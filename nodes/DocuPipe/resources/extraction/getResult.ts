import type { INodeProperties } from 'n8n-workflow';

const showOnlyForExtractionGetResult = {
	operation: ['getResult'],
	resource: ['extraction'],
};

export const extractionGetResultDescription: INodeProperties[] = [
	{
		displayName: 'Extraction ID',
		name: 'standardizationId',
		type: 'string',
		default: '',
		required: true,
		displayOptions: {
			show: showOnlyForExtractionGetResult,
		},
		description: 'The ID of the extraction result to retrieve',
	},
];
