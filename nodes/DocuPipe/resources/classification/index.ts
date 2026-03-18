import type { INodeProperties } from 'n8n-workflow';

const showOnlyForClassification = {
	resource: ['classification'],
};

const showOnlyForClassify = {
	operation: ['classify'],
	resource: ['classification'],
};

export const classificationDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForClassification,
		},
		options: [
			{
				name: 'Classify',
				value: 'classify',
				action: 'Classify a document',
				description: 'Classify a document into categories',
			},
		],
		default: 'classify',
	},
	{
		displayName: 'Document ID',
		name: 'documentId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForClassify,
		},
		description: 'The ID of the document to classify',
	},
	{
		displayName: 'Classes',
		name: 'classIds',
		type: 'resourceLocator',
		default: { mode: 'list', value: '' },
		required: true,
		displayOptions: {
			show: showOnlyForClassify,
		},
		description: 'The classes to classify the document into',
		modes: [
			{
				displayName: 'From List',
				name: 'list',
				type: 'list',
				placeholder: 'Select a class...',
				typeOptions: {
					searchListMethod: 'getClasses',
					searchable: true,
				},
			},
			{
				displayName: 'By ID',
				name: 'id',
				type: 'string',
				placeholder: 'e.g. class_abc123',
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
			show: showOnlyForClassify,
		},
		options: [
			{
				displayName: 'Multi-Class',
				name: 'multiClass',
				type: 'boolean',
				default: false,
				description: 'Whether to allow multiple classifications',
			},
		],
	},
];
