import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentGet = {
	operation: ['get'],
	resource: ['document'],
};

export const documentGetDescription: INodeProperties[] = [
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDocumentGet,
		},
		description:
			'The ID of the document to retrieve. You get this from the Upload action response, a Document Processed trigger, or from <a href="https://app.docupipe.ai/dashboard/documents">app.docupipe.ai/dashboard/documents</a>.',
	},
];
