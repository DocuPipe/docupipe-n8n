import type {
	IExecuteFunctions,
	IHookFunctions,
	ILoadOptionsFunctions,
	IHttpRequestMethods,
	IDataObject,
	IHttpRequestOptions,
} from 'n8n-workflow';

export async function docuPipeApiRequest(
	this: IHookFunctions | IExecuteFunctions | ILoadOptionsFunctions,
	method: IHttpRequestMethods,
	resource: string,
	body: IDataObject | undefined = undefined,
	qs: IDataObject = {},
) {
	const options: IHttpRequestOptions = {
		method,
		url: `https://app.docupipe.ai${resource}`,
		qs,
		body,
		json: true,
	};

	return this.helpers.httpRequestWithAuthentication.call(this, 'docuPipeApi', options);
}
