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
		description: 'The ID of the multi-page document to split',
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
				description: 'Organizational grouping for the split documents',
			},
			{
				displayName: 'Instructions',
				name: 'instructions',
				type: 'string',
				default: '',
				description: 'Instructions for how to split the document',
			},
		],
	},
];
