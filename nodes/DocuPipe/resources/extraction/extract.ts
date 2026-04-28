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
			show: showOnlyForExtractionExtract,
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
			show: { ...showOnlyForExtractionExtract, apiVersion: ['v3'] },
		},
		options: [
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
			show: { ...showOnlyForExtractionExtract, apiVersion: ['v3'] },
		},
		options: [
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
				name: 'timeout',
				type: 'number',
				default: 0,
				description: 'Webhook error-reporting timeout in seconds. Leave 0 to use the server default.',
			},
			{
				displayName: 'Use Metadata',
				name: 'useMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to feed the document\'s stored metadata into the extraction context. Metadata must have been set when the document was uploaded.',
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
			show: { ...showOnlyForExtractionExtract, apiVersion: ['v2'] },
		},
		options: [
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
			show: { ...showOnlyForExtractionExtract, apiVersion: ['v2'] },
		},
		options: [
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
				name: 'timeout',
				type: 'number',
				default: 0,
				description: 'Webhook error-reporting timeout in seconds. Leave 0 to use the server default.',
			},
			{
				displayName: 'Use Metadata',
				name: 'useMetadata',
				type: 'boolean',
				default: false,
				description:
					'Whether to feed the document\'s stored metadata into the extraction context. Metadata must have been set when the document was uploaded.',
			},
		],
	},
];
