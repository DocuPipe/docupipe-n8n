import type { INodeProperties } from 'n8n-workflow';

const showOnlyForDocumentUpload = {
	operation: ['upload'],
	resource: ['document'],
};

const showForUrlMode = {
	operation: ['upload'],
	resource: ['document'],
	inputMode: ['url'],
};

const showForBinaryMode = {
	operation: ['upload'],
	resource: ['document'],
	inputMode: ['binary'],
};

const showForBase64Mode = {
	operation: ['upload'],
	resource: ['document'],
	inputMode: ['base64'],
};

export const documentUploadDescription: INodeProperties[] = [
	{
		displayName: 'Input Mode',
		name: 'inputMode',
		type: 'options',
		options: [
			{
				name: 'URL',
				value: 'url',
				description: 'Provide a publicly accessible link to the file',
			},
			{
				name: 'Binary File',
				value: 'binary',
				description:
					'Use a file from a previous node (e.g. Gmail, Google Drive, HTTP Request, Dropbox)',
			},
			{
				name: 'Base64',
				value: 'base64',
				description:
					'Provide the file content as a base64-encoded string (e.g. from a database or API)',
			},
		],
		default: 'url',
		displayOptions: {
			show: showOnlyForDocumentUpload,
		},
		description:
			'How to provide the document. "URL" for public links. "Binary File" for files from previous nodes (email attachments, cloud storage). "Base64" for raw base64-encoded content from a database or API.',
	},
	{
		displayName: 'File URL',
		name: 'fileUrl',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showForUrlMode,
		},
		placeholder: 'https://example.com/document.pdf',
		description:
			'Direct URL to the file. Must be publicly accessible (not behind a login). For private files, switch to Binary File mode. Supported: PDF, PNG, JPEG, TIFF, DOCX, XLSX, CSV, and more.',
	},
	{
		displayName: 'Filename',
		name: 'fileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: showForUrlMode,
		},
		placeholder: 'e.g. invoice.pdf',
		description:
			'Optional. Name of the file including extension. If not provided, DocuPipe will extract it from the URL automatically.',
	},
	{
		displayName: 'Binary Property',
		name: 'binaryPropertyName',
		type: 'string',
		default: 'data',
		required: true,
		displayOptions: {
			show: showForBinaryMode,
		},
		description:
			'Name of the binary property containing the file. Leave as "data" — this works with most nodes (Gmail, HTTP Request, Google Drive, Dropbox). Tip: run the previous node first and check its binary output tab to see the property name.',
	},
	{
		displayName: 'Base64 Content',
		name: 'base64Content',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showForBase64Mode,
		},
		description:
			'The file content as a base64-encoded string. You can reference this from a previous node (e.g. a database query or API response that returns base64).',
	},
	{
		displayName: 'Filename',
		name: 'base64FileName',
		type: 'string',
		default: '',
		displayOptions: {
			show: showForBase64Mode,
		},
		placeholder: 'e.g. invoice.pdf',
		description: 'Optional. Name of the file including extension (e.g. invoice.pdf). Recommended for .txt, .JSON, and .xml files so DocuPipe can detect the format.',
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
				description:
					'Group documents together for organization (e.g. "invoices-2026", "client-acme")',
			},
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description:
					'JSON object with custom key-value pairs (e.g. {"invoiceNumber": "INV-001"}). Passed through to webhook payloads and extraction results.',
			},
		],
	},
];
