import type { INodeProperties } from 'n8n-workflow';
import { documentUploadDescription } from './upload';
import { documentGetDescription } from './get';
import { documentSplitDescription } from './split';
import { documentMergeDescription } from './merge';

const showOnlyForDocument = {
	resource: ['document'],
};

export const documentDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForDocument,
		},
		options: [
			{
				name: 'Get',
				value: 'get',
				action: 'Get a document',
				description: 'Retrieve a document by ID',
			},
			{
				name: 'Merge',
				value: 'merge',
				action: 'Merge documents',
				description: 'Merge multiple documents into one',
			},
			{
				name: 'Split',
				value: 'split',
				action: 'Split a document',
				description: 'Split a multi-page document into individual documents',
			},
			{
				name: 'Upload',
				value: 'upload',
				action: 'Upload a document',
				description: 'Upload a document from a URL',
			},
		],
		default: 'upload',
	},
	...documentUploadDescription,
	...documentGetDescription,
	...documentSplitDescription,
	...documentMergeDescription,
];
