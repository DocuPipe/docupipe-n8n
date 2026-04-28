import type { INodeProperties } from 'n8n-workflow';

const showOnlyForUploadAndExtract = {
	operation: ['uploadAndExtract'],
	resource: ['extraction'],
};

const showForUrlMode = {
	operation: ['uploadAndExtract'],
	resource: ['extraction'],
	inputMode: ['url'],
};

const showForBinaryMode = {
	operation: ['uploadAndExtract'],
	resource: ['extraction'],
	inputMode: ['binary'],
};

const showForBase64Mode = {
	operation: ['uploadAndExtract'],
	resource: ['extraction'],
	inputMode: ['base64'],
};

export const uploadAndExtractDescription: INodeProperties[] = [
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
			show: showOnlyForUploadAndExtract,
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
			'Name of the binary property containing the file. Leave as "data" - this works with most nodes (Gmail, HTTP Request, Google Drive, Dropbox). Tip: run the previous node first and check its binary output tab to see the property name.',
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
		displayName: 'Schema',
		name: 'schemaId',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: showOnlyForUploadAndExtract,
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
		displayName: 'API Version',
		name: 'apiVersion',
		type: 'options',
		default: 'v3',
		options: [
			{
				name: 'V3',
				value: 'v3',
				description: 'Latest agentic extraction engine. Recommended.',
			},
			{
				name: 'V2 (Legacy)',
				value: 'v2',
				description: 'Legacy extraction engine. Use for continuity with existing workflows.',
			},
		],
		displayOptions: {
			show: showOnlyForUploadAndExtract,
		},
		description: 'Which extraction engine to use',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFieldsV3',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForUploadAndExtract, apiVersion: ['v3'] },
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
				displayName: 'Effort Level',
				name: 'effortLevel',
				type: 'options',
				default: 'standard',
				options: [
					{ name: 'Standard', value: 'standard' },
				],
				description:
					'Effort level for the V3 extractor. Only Standard is currently available; High is coming soon.',
			},
			{
				displayName: 'Guidelines',
				name: 'guidelines',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Free-text instructions to steer the extraction (e.g. tone, formatting rules)',
			},
		],
	},
	{
		displayName: 'Advanced Options',
		name: 'advancedV3',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { ...showOnlyForUploadAndExtract, apiVersion: ['v3'] },
		},
		options: [
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description:
					'JSON object with custom key-value pairs (e.g. {"invoiceNumber": "INV-001"}). Stored on the document and passed through to webhook payloads. Toggle Use Metadata to feed it into extraction.',
			},
			{
				displayName: 'Pages',
				name: 'pages',
				type: 'string',
				default: '',
				placeholder: '0,1,4',
				description:
					'Comma-separated 0-indexed page numbers to extract from. Leave empty to extract from the full document.',
			},
			{
				displayName: 'Timeout (Seconds)',
				name: 'standardizeTimeout',
				type: 'number',
				default: 0,
				description: 'Webhook error-reporting timeout in seconds for the standardize step. Leave 0 to use the server default.',
			},
			{
				displayName: 'Use Metadata',
				name: 'useMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to feed the document\'s metadata into the extraction context. Set Metadata above to provide it.',
			},
		],
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFieldsV2',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: {
			show: { ...showOnlyForUploadAndExtract, apiVersion: ['v2'] },
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
				displayName: 'Display Mode',
				name: 'displayMode',
				type: 'options',
				default: 'auto',
				options: [
					{ name: 'Auto', value: 'auto' },
					{ name: 'Image', value: 'image' },
					{ name: 'Sections', value: 'sections' },
					{ name: 'Spatial', value: 'spatial' },
				],
				description: 'How the document is rendered for the V2 extractor',
			},
			{
				displayName: 'Effort Level',
				name: 'effortLevel',
				type: 'options',
				default: 'standard',
				options: [
					{ name: 'Extended', value: 'extended' },
					{ name: 'High', value: 'high' },
					{ name: 'Standard', value: 'standard' },
				],
				description: 'Higher effort uses more model capacity at the cost of latency',
			},
			{
				displayName: 'Guidelines',
				name: 'guidelines',
				type: 'string',
				typeOptions: { rows: 4 },
				default: '',
				description: 'Free-text instructions to steer the extraction (e.g. tone, formatting rules)',
			},
			{
				displayName: 'Split Mode',
				name: 'splitMode',
				type: 'options',
				default: 'auto',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Auto', value: 'auto' },
					{ name: 'Never', value: 'never' },
				],
				description: 'How the document is split into chunks before extraction',
			},
		],
	},
	{
		displayName: 'Advanced Options',
		name: 'advancedV2',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: {
			show: { ...showOnlyForUploadAndExtract, apiVersion: ['v2'] },
		},
		options: [
			{
				displayName: 'Metadata',
				name: 'metadata',
				type: 'json',
				default: '{}',
				description:
					'JSON object with custom key-value pairs (e.g. {"invoiceNumber": "INV-001"}). Stored on the document and passed through to webhook payloads. Toggle Use Metadata to feed it into extraction.',
			},
			{
				displayName: 'Pages',
				name: 'pages',
				type: 'string',
				default: '',
				placeholder: '0,1,4',
				description:
					'Comma-separated 0-indexed page numbers to extract from. Leave empty to extract from the full document.',
			},
			{
				displayName: 'Timeout (Seconds)',
				name: 'standardizeTimeout',
				type: 'number',
				default: 0,
				description: 'Webhook error-reporting timeout in seconds for the standardize step. Leave 0 to use the server default.',
			},
			{
				displayName: 'Use Metadata',
				name: 'useMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to feed the document\'s metadata into the extraction context. Set Metadata above to provide it.',
			},
		],
	},
];
