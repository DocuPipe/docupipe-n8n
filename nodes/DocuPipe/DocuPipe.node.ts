import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes, NodeOperationError } from 'n8n-workflow';
import { documentDescription } from './resources/document';
import { extractionDescription } from './resources/extraction';
import { uploadAndExtractDescription } from './resources/extraction/uploadAndExtract';
import { classificationDescription } from './resources/classification';
import { schemaDescription } from './resources/schema';
import { classDescription } from './resources/docuClass';
import { getSchemas } from './listSearch/getSchemas';
import { getClasses } from './listSearch/getClasses';
import { docuPipeApiRequest } from './shared/transport';

export class DocuPipe implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuPipe',
		name: 'docuPipe',
		icon: 'file:../../icons/docupipe.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Automate document processing with DocuPipe',
		defaults: {
			name: 'DocuPipe',
		},
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
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
					const fileUrl = this.getNodeParameter('fileUrl', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						dataset?: string;
						metadata?: string;
					};

					const body: Record<string, unknown> = {
						document: { url: fileUrl, filename: fileName },
					};
					if (additionalFields.dataset) body.dataset = additionalFields.dataset;
					if (additionalFields.metadata) {
						try {
							body.metadata = JSON.parse(additionalFields.metadata);
						} catch {
							throw new NodeOperationError(
								this.getNode(),
								'Invalid JSON in Metadata field',
								{ itemIndex: i },
							);
						}
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
					const documentId = this.getNodeParameter('documentId', i) as string;
					const schemaIdParam = this.getNodeParameter('schemaId', i) as
						| { value: string }
						| string;
					const schemaId =
						typeof schemaIdParam === 'string' ? schemaIdParam : schemaIdParam.value;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						dataset?: string;
					};

					const body: Record<string, unknown> = {
						documentIds: [documentId],
						schemaId,
					};
					if (additionalFields.dataset) body.dataset = additionalFields.dataset;

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/v2/standardize/batch',
						body as never,
					);
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
					const fileUrl = this.getNodeParameter('fileUrl', i) as string;
					const fileName = this.getNodeParameter('fileName', i) as string;
					const schemaIdParam = this.getNodeParameter('schemaId', i) as
						| { value: string }
						| string;
					const schemaId =
						typeof schemaIdParam === 'string' ? schemaIdParam : schemaIdParam.value;
					const additionalFields = this.getNodeParameter('additionalFields', i) as {
						dataset?: string;
						metadata?: string;
					};

					// step 1: create a workflow that extracts with this schema on document submit
					const workflowResponse = (await docuPipeApiRequest.call(
						this,
						'POST',
						'/workflow/on-submit-document',
						{
							standardizeStep: {
								schemaIds: [schemaId],
							},
						} as never,
					)) as { workflowId: string };

					// step 2: upload document with workflowId — DocuPipe auto-extracts after processing
					const uploadBody: Record<string, unknown> = {
						document: { url: fileUrl, filename: fileName },
						workflowId: workflowResponse.workflowId,
					};
					if (additionalFields.dataset) uploadBody.dataset = additionalFields.dataset;
					if (additionalFields.metadata)
						uploadBody.metadata = JSON.parse(additionalFields.metadata);

					responseData = await docuPipeApiRequest.call(
						this,
						'POST',
						'/document',
						uploadBody as never,
					);
				} else if (resource === 'classification' && operation === 'classify') {
					const documentId = this.getNodeParameter('documentId', i) as string;
					const classIdsParam = this.getNodeParameter('classIds', i) as
						| { value: string }
						| string;
					const classId =
						typeof classIdsParam === 'string' ? classIdsParam : classIdsParam.value;
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
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: i,
					});
				} else {
					throw new NodeOperationError(this.getNode(), error as Error, { itemIndex: i });
				}
			}
		}

		return [returnData];
	}
}
