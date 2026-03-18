import type { INodeProperties } from 'n8n-workflow';

const showOnlyForSchema = {
	resource: ['schema'],
};

export const schemaDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForSchema,
		},
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List all schemas',
				description: 'Get all schemas in your account',
			},
		],
		default: 'list',
	},
];
