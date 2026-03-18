import type { INodeProperties } from 'n8n-workflow';

const showOnlyForClass = {
	resource: ['class'],
};

export const classDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: showOnlyForClass,
		},
		options: [
			{
				name: 'List',
				value: 'list',
				action: 'List all classes',
				description: 'Get all document classes in your account',
			},
		],
		default: 'list',
	},
];
