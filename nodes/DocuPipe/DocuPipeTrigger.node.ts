import type {
	IHookFunctions,
	IWebhookFunctions,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

export class DocuPipeTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'DocuPipe Trigger',
		name: 'docuPipeTrigger',
		icon: 'file:../../icons/docupipe.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Triggers when DocuPipe completes processing a document',
		defaults: {
			name: 'DocuPipe Trigger',
		},
		usableAsTool: true,
		inputs: [],
		outputs: [NodeConnectionTypes.Main],
		credentials: [
			{
				name: 'docuPipeApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'document.processed.success',
				options: [
					{
						name: 'Classification Complete',
						value: 'classification.processed.success',
						description: 'Fires after document classification',
					},
					{
						name: 'Classification Error',
						value: 'classification.processed.error',
						description: 'Fires on classification error',
					},
					{
						name: 'Document Error',
						value: 'document.processed.error',
						description: 'Fires on document processing error',
					},
					{
						name: 'Document Processed',
						value: 'document.processed.success',
						description: 'Fires after OCR completes',
					},
					{
						name: 'Extraction Complete',
						value: 'standardization.processed.success',
						description: 'Fires after data extraction finishes',
					},
					{
						name: 'Extraction Error',
						value: 'standardization.processed.error',
						description: 'Fires on extraction error',
					},
					{
						name: 'Merge Complete',
						value: 'merge.processed.success',
						description: 'Fires after document merge',
					},
					{
						name: 'Merge Error',
						value: 'merge.processed.error',
						description: 'Fires on merge error',
					},
					{
						name: 'Split Complete',
						value: 'split.processed.success',
						description: 'Fires after document split',
					},
					{
						name: 'Split Error',
						value: 'split.processed.error',
						description: 'Fires on split error',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				return webhookData.endpointId !== undefined;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default');
				const event = this.getNodeParameter('event') as string;

				const response = await this.helpers.httpRequestWithAuthentication.call(
					this,
					'docuPipeApi',
					{
						method: 'POST',
						url: 'https://app.docupipe.ai/webhook/generate-endpoint',
						body: {
							url: webhookUrl,
							subscribedEvents: [event],
						},
						json: true,
					},
				);

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.endpointId = (response as { endpointId: string }).endpointId;
				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');
				const endpointId = webhookData.endpointId as string;

				if (!endpointId) {
					return true;
				}

				try {
					await this.helpers.httpRequestWithAuthentication.call(this, 'docuPipeApi', {
						method: 'POST',
						url: 'https://app.docupipe.ai/webhook/delete-endpoint',
						body: {
							endpointId,
						},
						json: true,
					});
				} catch {
					// endpoint may already be deleted
				}

				delete webhookData.endpointId;
				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const bodyData = this.getBodyData();
		return {
			workflowData: [this.helpers.returnJsonArray(bodyData)],
		};
	}
}
