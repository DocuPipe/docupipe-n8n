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
		description: 'The ID of the document to retrieve',
	},
];
