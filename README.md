# n8n-nodes-docupipe

This is an n8n community node for [DocuPipe](https://docupipe.ai). It lets you automate document processing, data extraction, and classification directly from your n8n workflows.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) |
[Credentials](#credentials) |
[Operations](#operations) |
[Triggers](#triggers) |
[Compatibility](#compatibility) |
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You need a DocuPipe API key to use this node:

1. Sign up or log in at [docupipe.ai](https://docupipe.ai)
2. Go to **Settings → General**
3. Copy your **API Key**
4. In n8n, create a new **DocuPipe API** credential and paste your key

## Operations

### Document

- **Upload** — Upload a document from a URL
- **Get** — Retrieve a document by ID
- **Split** — Split a multi-page document into individual documents
- **Merge** — Merge multiple documents into one

### Extraction

- **Extract** — Extract structured data from a document using a schema
- **Get Result** — Retrieve the result of a completed extraction
- **Upload and Extract** — Upload a document and start extraction in one step

### Classification

- **Classify** — Classify a document into categories

### Schema

- **List** — List all schemas in your account

### Class

- **List** — List all document classes in your account

## Triggers

The DocuPipe Trigger node starts a workflow when DocuPipe finishes processing. Available events:

| Event | Description |
|-------|-------------|
| Document Processed | Fires after OCR completes |
| Extraction Complete | Fires after data extraction finishes |
| Classification Complete | Fires after document classification |
| Split Complete | Fires after document split |
| Merge Complete | Fires after document merge |
| Document Error | Fires on document processing error |
| Extraction Error | Fires on extraction error |
| Classification Error | Fires on classification error |
| Split Error | Fires on split error |
| Merge Error | Fires on merge error |

## AI Agent Support

This node supports `usableAsTool`, making it available as a tool in n8n's AI Agent workflows. Self-hosted users need to set the environment variable:

```
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

## Compatibility

- Tested with n8n version 2.12.3
- Requires Node.js 18 or later

## Resources

- [DocuPipe Documentation](https://docs.docupipe.ai)
- [DocuPipe Website](https://docupipe.ai)
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
