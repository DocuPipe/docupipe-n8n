import type { ILoadOptionsFunctions, INodeListSearchResult } from 'n8n-workflow';
import { docuPipeApiRequest } from '../shared/transport';

type ClassItem = {
	classId: string;
	className: string;
};

export async function getClasses(
	this: ILoadOptionsFunctions,
	filter?: string,
): Promise<INodeListSearchResult> {
	const responseData: ClassItem[] = await docuPipeApiRequest.call(this, 'GET', '/classes');

	let results = responseData.map((item: ClassItem) => ({
		name: item.className,
		value: item.classId,
	}));

	if (filter) {
		const lowerFilter = filter.toLowerCase();
		results = results.filter((item) => item.name.toLowerCase().includes(lowerFilter));
	}

	return { results };
}
