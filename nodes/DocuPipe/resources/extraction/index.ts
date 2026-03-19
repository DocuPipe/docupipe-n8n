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
				description:
					'Extract structured data using a schema. <a href="https://docs.docupipe.ai/docs/extraction-basics">Extraction guide</a>.',
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
				description:
					'Upload a document (URL, binary file, or base64) and extract data in one step. <a href="https://docs.docupipe.ai/docs/quick-start">Quick start guide</a>.',
			},
		],
		default: 'extract',
	},
	...extractionExtractDescription,
	...extractionGetResultDescription,
];
