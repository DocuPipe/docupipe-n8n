import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { docuPipeApiRequest } from '../shared/transport';

type SchemaItem = {
	schemaId: string;
	schemaName: string;
};

export async function getSchemas(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData: SchemaItem[] = await docuPipeApiRequest.call(
		this,
		'GET',
		'/schemas',
		undefined,
		{ limit: 1000, exclude_payload: true },
	);

	let results = responseData.map((item: SchemaItem) => ({
		name: item.schemaName,
		value: item.schemaId,
	}));

	if (filter) {
		const lowerFilter = filter.toLowerCase();
		results = results.filter((item) => item.name.toLowerCase().includes(lowerFilter));
	}

	return { results };
}
