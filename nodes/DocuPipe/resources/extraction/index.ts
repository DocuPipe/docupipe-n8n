import type { INodeProperties } from 'n8n-workflow';
import { extractionExtractDescription } from './extract';
import { extractionGetResultDescription } from './getResult';

const showOnlyForExtraction = {
	resource: ['extraction'],
};

export const extractionDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForExtraction,
		},
		options: [
			{
				name: 'Extract',
				value: 'extract',
				action: 'Extract data from a document',
				description: 'Extract structured data using a schema. Create schemas at app.docupipe.ai/dashboard/schemas.',
			},
			{
				name: 'Get Result',
				value: 'getResult',
				action: 'Get an extraction result',
				description: 'Retrieve the result of a completed extraction',
			},
			{
				name: 'Upload and Extract',
				value: 'uploadAndExtract',
				action: 'Upload and extract data from a document',
				description: 'Upload a document and extract data in one step. Create schemas first at app.docupipe.ai/dashboard/schemas.',
			},
		],
		default: 'extract',
	},
	...extractionExtractDescription,
	...extractionGetResultDescription,
];
