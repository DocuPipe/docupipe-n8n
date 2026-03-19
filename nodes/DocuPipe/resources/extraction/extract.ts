import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExtractionExtract = {
	operation: ['extract'],
	resource: ['extraction'],
};

export const extractionExtractDescription: INodeProperties[] = [
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForExtractionExtract,
		},
		description:
			'The ID of the document to extract data from. The document must be fully processed first (status: completed). Find documents at <a href="https://app.docupipe.ai/dashboard/documents">app.docupipe.ai/dashboard/documents</a>.',
	},
	{
		displayName: 'Schema',
		name: 'schemaId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: showOnlyForExtractionExtract,
		},
		description:
			'A schema defines which fields to extract (e.g. invoice number, amount, date). Create and manage schemas at <a href="https://app.docupipe.ai/dashboard/schemas">app.docupipe.ai/dashboard/schemas</a>.',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a schema...',
				typeOptions: {
					searchListMethod: 'getSchemas',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. schema_abc123',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForExtractionExtract,
		},
		options: [
			{
				displayName: 'Dataset',
				name: 'dataset',
				type: 'string',
				default: '',
				description:
					'Group extractions together for organization (e.g. "invoices-2026")',
			},
		],
	},
];
