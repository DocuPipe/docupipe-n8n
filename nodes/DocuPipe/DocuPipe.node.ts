import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	JsonObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import { documentDescription } from './resources/document';
import { extractionDescription } from './resources/extraction';
import { uploadAndExtractDescription } from './resources/extraction/uploadAndExtract';
import { classificationDescription } from './resources/classification';
import { schemaDescription } from './resources/schema';
import { classDescription } from './resources/docuClass';
import { getSchemas } from './listSearch/getSchemas';
import { getClasses } from './listSearch/getClasses';
import { docuPipeApiRequest } from './shared/transport';

function resolveResourceLocator(param: { value: string } | string): string {
	return typeof param === 'string' ? param : param.value;
}

async function buildDocumentBody(
	context: IExecuteFunctions,
	itemIndex: number,
): Promise<Record<string, unknown>> {
	const inputMode = context.getNodeParameter('inputMode', itemIndex) as string;

	if (inputMode === 'binary') {
		const binaryPropertyName = context.getNodeParameter(
			'binaryPropertyName',
			itemIndex,
		) as string;
		const binaryData = context.helpers.assertBinaryData(itemIndex, binaryPropertyName);
		const buffer = await context.helpers.getBinaryDataBuffer(itemIndex, binaryPropertyName);
		const base64Content = buffer.toString('base64');
		const filename = binaryData.fileName ?? `document.${binaryData.fileExtension ?? 'pdf'}`;

		return {
			document: {
				file: {
					contents: base64Content,
					filename,
				},
			},
		};
	}

	if (inputMode === 'base64') {
		const base64Content = context.getNodeParameter('base64Content', itemIndex) as string;
		const filename = context.getNodeParameter('base64FileName', itemIndex, '') as string;
		const file: Record<string, unknown> = { contents: base64Content };
		if (filename) file.filename = filename;

		return { document: { file } };
	}

	const fileUrl = context.getNodeParameter('fileUrl', itemIndex) as string;
	const fileName = context.getNodeParameter('fileName', itemIndex, '') as string;
	const doc: Record<string, unknown> = { url: fileUrl };
	if (fileName) doc.filename = fileName;

	return {
		document: doc,
	};
}

function parseMetadata(
	context: IExecuteFunctions,
	metadata: string,
	itemIndex: number,
): unknown {
	try {
		return JSON.parse(metadata);
	} catch {
		throw new NodeOperationError(context.getNode(), 'Invalid JSON in Metadata field', {
			itemIndex,
		});
	}
}

export class DocuPipe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuPipe',
		name: 'docuPipe',
		icon: 'file:../../icons/docupipe.svg',
		group: ['transform'],
		version: 2,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description:
			'Automate document processing, data extraction, and classification with DocuPipe',
		defaults: {
			name: 'DocuPipe',
		},
		usableAsTool: true,
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'docuPipeApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Class',
						value: 'class',
					},
					{
						name: 'Classification',
						value: 'classification',
					},
					{
						name: 'Document',
						value: 'document',
					},
					{
						name: 'Extraction',
						value: 'extraction',
					},
					{
						name: 'Schema',
						value: 'schema',
					},
				],
				default: 'document',
			},
			...classDescription,
			...classificationDescription,
			...documentDescription,
			...extractionDescription,
			...uploadAndExtractDescription,
			...schemaDescription,
		],
	};

	methods = {
		listSearch: {
			getSchemas,
			getClasses,
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const resource = this.getNodeParameter('resource', 0) as string;
		const operation = this.getNodeParameter('operation', 0) as string;
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: unknown;

				if (resource === 'document' && operation === 'upload') {
					const body = await buildDocumentBody(this, i);
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						dataset?: string;
						metadata?: string;
					};

					if (additionalFields.dataset) body.dataset = additionalFields.dataset;
					if (additionalFields.metadata) {
						body.metadata = parseMetadata(this, additionalFields.metadata, i);
					}

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/document',
						body as never,
					);
				} else if (resource === 'document' && operation === 'get') {
					const documentId = this.getNodeParameter('documentId', i) as string;
					responseData = await docuPipeApiRequest.call(
						this,
						'GET',
						`/document/${documentId}`,
					);
				} else if (resource === 'document' && operation === 'split') {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						dataset?: string;
						instructions?: string;
					};

					const body: Record<string, unknown> = { documentId };
					if (additionalFields.dataset) body.dataset = additionalFields.dataset;
					if (additionalFields.instructions)
						body.instructions = additionalFields.instructions;

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/split',
						body as never,
					);
				} else if (resource === 'document' && operation === 'merge') {
					const documentIds = this.getNodeParameter('documentIds', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						dataset?: string;
					};

					const body: Record<string, unknown> = {
						documentIds: documentIds.split(',').map((id) => id.trim()),
						filename: fileName,
					};
					if (additionalFields.dataset) body.dataset = additionalFields.dataset;

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/documents/merge',
						body as never,
					);
				} else if (resource === 'extraction' && operation === 'extract') {
					const apiVersion = this.getNodeParameter('apiVersion', i, 'v3') as 'v2' | 'v3';
					const documentId = this.getNodeParameter('documentId', i) as string;
					const schemaId = resolveResourceLocator(
						this.getNodeParameter('schemaId', i) as { value: string } | string,
					);

					if (apiVersion === 'v3') {
						const f = this.getNodeParameter('additionalFieldsV3', i, {}) as {
							effortLevel?: string;
							guidelines?: string;
						};
						const adv = this.getNodeParameter('advancedV3', i, {}) as {
							pages?: string;
							timeout?: number;
							useMetadata?: boolean;
						};
						const body: Record<string, unknown> = { documentId, schemaId };
						if (f.effortLevel) body.effortLevel = f.effortLevel;
						if (f.guidelines) body.guidelines = f.guidelines;
						if (adv.useMetadata !== undefined) body.useMetadata = adv.useMetadata;
						if (adv.pages) {
							body.pages = adv.pages.split(',').map((p) => parseInt(p.trim(), 10));
						}
						if (adv.timeout) body.timeout = adv.timeout;

						responseData = await docuPipeApiRequest.call(
							this,
							'POST',
							'/v3/standardize',
							body as never,
						);
					} else {
						const f = this.getNodeParameter('additionalFieldsV2', i, {}) as {
							displayMode?: string;
							splitMode?: string;
							effortLevel?: string;
							guidelines?: string;
						};
						const adv = this.getNodeParameter('advancedV2', i, {}) as {
							pages?: string;
							timeout?: number;
							useMetadata?: boolean;
						};
						const body: Record<string, unknown> = {
							documentIds: [documentId],
							schemaId,
						};
						if (f.displayMode) body.displayMode = f.displayMode;
						if (f.splitMode) body.splitMode = f.splitMode;
						if (f.effortLevel) body.effortLevel = f.effortLevel;
						if (f.guidelines) body.guidelines = f.guidelines;
						if (adv.useMetadata !== undefined) body.useMetadata = adv.useMetadata;
						if (adv.pages) {
							body.pages = [adv.pages.split(',').map((p) => parseInt(p.trim(), 10))];
						}
						if (adv.timeout) body.timeout = adv.timeout;

						responseData = await docuPipeApiRequest.call(
							this,
							'POST',
							'/v2/standardize/batch',
							body as never,
						);
					}
				} else if (resource === 'extraction' && operation === 'getResult') {
					const standardizationId = this.getNodeParameter(
						'standardizationId',
						i,
					) as string;
					responseData = await docuPipeApiRequest.call(
						this,
						'GET',
						`/standardization/${standardizationId}`,
					);
				} else if (resource === 'extraction' && operation === 'uploadAndExtract') {
					const apiVersion = this.getNodeParameter('apiVersion', i, 'v3') as 'v2' | 'v3';
					const schemaId = resolveResourceLocator(
						this.getNodeParameter('schemaId', i) as { value: string } | string,
					);
					const standardizeStep: Record<string, unknown> = { schemaIds: [schemaId] };
					let dataset: string | undefined;
					let metadata: string | undefined;

					if (apiVersion === 'v3') {
						const f = this.getNodeParameter('additionalFieldsV3', i, {}) as {
							dataset?: string;
							effortLevel?: string;
							guidelines?: string;
						};
						const adv = this.getNodeParameter('advancedV3', i, {}) as {
							metadata?: string;
							pages?: string;
							standardizeTimeout?: number;
							useMetadata?: boolean;
						};
						dataset = f.dataset;
						metadata = adv.metadata;
						if (f.effortLevel) standardizeStep.effortLevel = f.effortLevel;
						if (f.guidelines) standardizeStep.guidelines = f.guidelines;
						if (adv.useMetadata !== undefined) standardizeStep.useMetadata = adv.useMetadata;
						if (adv.pages) {
							standardizeStep.pages = [adv.pages.split(',').map((p) => parseInt(p.trim(), 10))];
						}
						if (adv.standardizeTimeout) standardizeStep.standardizeTimeout = adv.standardizeTimeout;
					} else {
						const f = this.getNodeParameter('additionalFieldsV2', i, {}) as {
							dataset?: string;
							displayMode?: string;
							splitMode?: string;
							effortLevel?: string;
							guidelines?: string;
						};
						const adv = this.getNodeParameter('advancedV2', i, {}) as {
							metadata?: string;
							pages?: string;
							standardizeTimeout?: number;
							useMetadata?: boolean;
						};
						dataset = f.dataset;
						metadata = adv.metadata;
						if (f.displayMode) standardizeStep.displayMode = f.displayMode;
						if (f.splitMode) standardizeStep.splitMode = f.splitMode;
						if (f.effortLevel) standardizeStep.effortLevel = f.effortLevel;
						if (f.guidelines) standardizeStep.guidelines = f.guidelines;
						if (adv.useMetadata !== undefined) standardizeStep.useMetadata = adv.useMetadata;
						if (adv.pages) {
							standardizeStep.pages = [adv.pages.split(',').map((p) => parseInt(p.trim(), 10))];
						}
						if (adv.standardizeTimeout) standardizeStep.standardizeTimeout = adv.standardizeTimeout;
					}

					// step 1: create a workflow that extracts with this schema on document submit
					const workflowResponse = (await docuPipeApiRequest.call(
						this,
						'POST',
						'/workflow/on-submit-document',
						{ standardizeStep } as never,
					)) as { workflowId: string };

					// step 2: upload document with workflowId - DocuPipe auto-extracts after processing
					const uploadBody = await buildDocumentBody(this, i);
					uploadBody.workflowId = workflowResponse.workflowId;
					if (dataset) uploadBody.dataset = dataset;
					if (metadata) uploadBody.metadata = parseMetadata(this, metadata, i);

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/document',
						uploadBody as never,
					);
				} else if (resource === 'classification' && operation === 'classify') {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const classId = resolveResourceLocator(
						this.getNodeParameter('classIds', i) as { value: string } | string,
					);
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						multiClass?: boolean;
					};

					const body: Record<string, unknown> = {
						documentId,
						classIds: [classId],
					};
					if (additionalFields.multiClass !== undefined)
						body.multiClass = additionalFields.multiClass;

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/classify',
						body as never,
					);
				} else if (resource === 'schema' && operation === 'list') {
					responseData = await docuPipeApiRequest.call(
						this,
						'GET',
						'/schemas',
						undefined,
						{ limit: 1000, exclude_payload: true },
					);
				} else if (resource === 'class' && operation === 'list') {
					responseData = await docuPipeApiRequest.call(this, 'GET', '/classes');
				} else {
					throw new NodeOperationError(
						this.getNode(),
						`Unknown resource/operation: ${resource}/${operation}`,
					);
				}

				if (Array.isArray(responseData)) {
					returnData.push(
						...responseData.map((item: unknown) => ({
							json: item as IDataObject,
							pairedItem: i,
						})),
					);
				} else {
					returnData.push({
						json: responseData as IDataObject,
						pairedItem: i,
					});
				}
			} catch (error) {
				const apiError =
					error instanceof NodeApiError || error instanceof NodeOperationError
						? error
						: new NodeApiError(this.getNode(), error as JsonObject, {
								itemIndex: i,
							});

				if (this.continueOnFail()) {
					returnData.push({
						json: { error: apiError } as unknown as IDataObject,
						pairedItem: i,
					});
					continue;
				}
				throw apiError;
			}
		}

		return [returnData];
	}
}
