import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentMerge = {
	operation: ['merge'],
	resource: ['document'],
};

export const documentMergeDescription: INodeProperties[] = [
	{
		displayName: 'Document IDs',
		name: 'documentIds',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDocumentMerge,
		},
		placeholder: 'e.g. doc_abc123,doc_def456',
		description: 'Comma-separated list of document IDs to merge (minimum 2)',
	},
	{
		displayName: 'Filename',
		name: 'fileName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDocumentMerge,
		},
		placeholder: 'e.g. merged_document.pdf',
		description: 'Name for the merged document',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForDocumentMerge,
		},
		options: [
			{
				displayName: 'Dataset',
				name: 'dataset',
				type: 'string',
				default: '',
				description: 'Organizational grouping for the merged document',
			},
		],
	},
];
