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
		description:
			'Comma-separated list of document IDs to merge (minimum 2). Find documents at <a href="https://app.docupipe.ai/dashboard/documents">app.docupipe.ai/dashboard/documents</a>.',
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
		description: 'Name for the merged document including extension (e.g. merged_invoices.pdf)',
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
				description:
					'Group the merged document for organization (e.g. "invoices-2026")',
			},
		],
	},
];
