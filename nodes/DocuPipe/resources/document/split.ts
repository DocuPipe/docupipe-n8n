import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentSplit = {
	operation: ['split'],
	resource: ['document'],
};

export const documentSplitDescription: INodeProperties[] = [
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDocumentSplit,
		},
		description:
			'The ID of the multi-page document to split. Find documents at <a href="https://app.docupipe.ai/dashboard/documents">app.docupipe.ai/dashboard/documents</a>. Use the Split Complete trigger to get the resulting child document IDs.',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForDocumentSplit,
		},
		options: [
			{
				displayName: 'Dataset',
				name: 'dataset',
				type: 'string',
				default: '',
				description:
					'Group the split documents together for organization (e.g. "invoices-2026")',
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				default: '',
				description: 'Instructions for how to split the document (e.g. "Split by invoice")',
			},
		],
	},
];
