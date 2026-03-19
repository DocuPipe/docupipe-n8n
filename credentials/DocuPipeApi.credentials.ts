import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class DocuPipeApi implements ICredentialType {
	name = 'docuPipeApi';

	displayName = 'DocuPipe API';

	icon: Icon = 'file:../icons/docupipe.svg';

	documentationUrl = 'https://docs.docupipe.ai/docs/getting-started';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description:
			'Your DocuPipe API key. Find it at <a href="https://app.docupipe.ai/settings/general">app.docupipe.ai/settings/general</a>. <a href="https://docupipe.ai">Sign up for free</a> if you don\'t have an account yet.',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-API-Key': '={{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://app.docupipe.ai',
			url: '/schemas',
			method: 'GET',
		},
	};
}
