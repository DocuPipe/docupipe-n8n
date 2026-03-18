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

	documentationUrl = 'https://docs.docupipe.ai';

	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			description: 'API key from your DocuPipe dashboard (Settings → General)',
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
