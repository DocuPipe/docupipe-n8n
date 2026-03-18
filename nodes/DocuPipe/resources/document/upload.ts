import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentUpload = {
	operation: ['upload'],
	resource: ['document'],
};

export const documentUploadDescription: INodeProperties[] = [
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForDocumentUpload,
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
			show: showOnlyForDocumentUpload,
		},
		placeholder: 'e.g. invoice.pdf',
		description: 'Name of the file including extension',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: showOnlyForDocumentUpload,
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
