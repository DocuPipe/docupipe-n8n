import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadAndExtract = {
	operation: ['uploadAndExtract'],
	resource: ['extraction'],
};

export const uploadAndExtractDescription: INodeProperties[] = [
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAndExtract,
		},
		description: 'Direct URL to the file to upload. Must be a publicly accessible link.',
	},
	{
		displayName: 'Filename',
		name: 'fileName',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForUploadAndExtract,
		},
		placeholder: 'e.g. invoice.pdf',
		description: 'Name of the file including extension',
	},
	{
		displayName: 'Schema',
		name: 'schemaId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: showOnlyForUploadAndExtract,
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
			show: showOnlyForUploadAndExtract,
		},
		options: [
			{
				displayName: 'Dataset',
				name: 'dataset',
				type: 'string',
				default: '',
				description: 'Organizational grouping for the document',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description: 'Custom key-value pairs to attach to the document',
			},
		],
	},
];
