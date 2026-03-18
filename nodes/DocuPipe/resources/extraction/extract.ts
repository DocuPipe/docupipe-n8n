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
		description: 'The ID of the document to extract data from',
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
		description: 'The schema to use for extraction. Create schemas in your DocuPipe dashboard.',
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
				description: 'Organizational grouping for this extraction',
			},
		],
	},
];
