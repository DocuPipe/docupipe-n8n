# n8n-nodes-docupipe

This is an n8n community node for [DocuPipe](https://docupipe.ai) - an intelligent document processing platform. It lets you automate document uploads, data extraction, classification, and more directly from your n8n workflows.

**What is DocuPipe?** DocuPipe processes documents (PDFs, images, Word files) using AI to extract structured data, classify documents into categories, and split/merge multi-page files. You define schemas (what fields to extract) and classes (document categories) in the [DocuPipe dashboard](https://app.docupipe.ai), then use this node to automate the processing.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

[Installation](#installation) |
[Credentials](#credentials) |
[Operations](#operations) |
[Triggers](#triggers) |
[Examples](#examples) |
[Compatibility](#compatibility) |
[Resources](#resources)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

## Credentials

You need a DocuPipe API key to use this node:

1. [Sign up for free](https://docupipe.ai) or log in at [app.docupipe.ai](https://app.docupipe.ai)
2. Go to **Settings → General**
3. Copy your **API Key**
4. In n8n, create a new **DocuPipe API** credential and paste your key
5. Click **Test** to verify the connection

## Operations

### Document

- **Upload** - Upload a document from a URL or binary file (e.g. email attachment)
- **Get** - Retrieve a document's details by its ID
- **Split** - Split a multi-page document into individual documents
- **Merge** - Merge multiple documents into one

### Extraction

- **Extract** - Extract structured data from a document using a schema you defined in DocuPipe
- **Get Result** - Retrieve the extracted data after extraction completes
- **Upload and Extract** - Upload a document and extract data in one step

### Classification

- **Classify** - Classify a document into categories you defined in DocuPipe

### Schema / Class

- **List Schemas** - List all extraction schemas in your account
- **List Classes** - List all document classes in your account

## Triggers

The DocuPipe Trigger node automatically starts a workflow when DocuPipe finishes processing. No polling needed - DocuPipe sends data to n8n in real-time via webhooks.

| Event | What it returns |
|-------|-----------------|
| Document Processed | documentId, filename, text, numPages |
| Extraction Complete | standardizationId, documentId, schemaId, extracted data |
| Classification Complete | documentId, assigned classIds |
| Split Complete | parentDocumentId, childDocumentIds |
| Merge Complete | new documentId, source documentIds |
| Document Error | documentId, errorMessage |
| Extraction Error | standardizationId, documentId, errorMessage |
| Classification Error | documentId, errorMessage |
| Split Error | documentId, errorMessage |
| Merge Error | documentIds, errorMessage |

## Examples

### Example 1: Upload a file from URL and extract data

The simplest workflow - upload a document and extract structured data from it.

1. Add a **Manual Trigger** node (click to run)
2. Add a **DocuPipe** node → Resource: **Extraction** → Operation: **Upload and Extract**
3. Set Input Mode to **URL**
4. Enter the file URL (e.g. `https://example.com/invoice.pdf`) and filename
5. Select a **Schema** from the dropdown (create one first at [app.docupipe.ai](https://app.docupipe.ai) → Schemas)
6. Run the workflow - you'll get back a `documentId` and `standardizationId`
7. To get the extracted data, add a **DocuPipe Trigger** (Extraction Complete) in a separate workflow

### Example 2: Process email attachments automatically

Automatically extract data from every email attachment you receive.

1. Add a **Gmail Trigger** node → Event: **Message Received**
2. Add a **DocuPipe** node → Resource: **Document** → Operation: **Upload**
3. Set Input Mode to **Binary File**
4. Leave Binary Property as `data` (Gmail outputs attachments as "data")
5. Connect Gmail → DocuPipe

Now every email attachment is automatically uploaded to DocuPipe. Add a DocuPipe Trigger (Document Processed) in another workflow to process them after upload.

### Example 3: Extract data from Google Drive files

Process documents saved in Google Drive.

1. Add a **Google Drive Trigger** node → Event: **File Created**
2. Add a **Google Drive** node → Operation: **Download** (to get the file as binary)
3. Add a **DocuPipe** node → Resource: **Extraction** → Operation: **Upload and Extract**
4. Set Input Mode to **Binary File**
5. Leave Binary Property as `data`
6. Select your **Schema**
7. Connect: Google Drive Trigger → Google Drive Download → DocuPipe

### Example 4: Extract data and send results to Google Sheets

End-to-end automation: extract invoice data and write it to a spreadsheet.

**Workflow 1 - Kick off extraction:**
1. **Gmail Trigger** (Message Received)
2. **DocuPipe** → Upload and Extract (Binary File mode, select your invoice schema)

**Workflow 2 - Process results:**
1. **DocuPipe Trigger** → Event: **Extraction Complete** (receives standardizationId and extracted data)
2. **Google Sheets** → Append Row (map the extracted fields to spreadsheet columns)

### Example 5: Classify and route documents

Automatically classify documents and take different actions based on the type.

**Workflow 1 - Upload and classify:**
1. **HTTP Request** node → Download a file (set Response Format to **File**)
2. **DocuPipe** → Upload (Binary File mode)
3. **DocuPipe** → Classify (use the documentId from upload, select your classes)

**Workflow 2 - Route based on classification:**
1. **DocuPipe Trigger** → Event: **Classification Complete** (returns documentId and classIds)
2. **IF** node → Check which class was assigned
3. Route to different actions (e.g. invoices → accounting software, contracts → legal team)

### Example 6: Upload a document from base64 (database or API)

If your documents are stored as base64 strings (e.g. in a database or returned by an API):

1. Add a node that outputs base64 content (e.g. a **Postgres** node querying a `documents` table, or a **Code** node)
2. Add a **DocuPipe** node → Resource: **Document** → Operation: **Upload**
3. Set Input Mode to **Base64**
4. Set **Base64 Content** to reference the field from the previous node (e.g. `{{ $json.fileContent }}`)
5. Set **Filename** (e.g. `invoice.pdf`) - DocuPipe needs this to know the file format

### Example 7: Split a document and process each part

Split a multi-page PDF into individual documents, then extract data from each one.

**Workflow 1 - Upload and split:**
1. **Manual Trigger**
2. **DocuPipe** → Upload (URL or Binary File)
3. **DocuPipe** → Split (use the documentId from upload)

**Workflow 2 - Process each child document:**
1. **DocuPipe Trigger** → Event: **Split Complete** (returns parentDocumentId and childDocumentIds)
2. **Split In Batches** node → loop through each childDocumentId
3. **DocuPipe** → Extract (use each childDocumentId + select a schema)

### How Binary File mode works

Many n8n nodes output files as "binary data" (Gmail attachments, HTTP downloads, Google Drive files, Dropbox, etc.). DocuPipe's **Binary File** mode reads these files automatically - no manual conversion needed.

**Steps:**
1. Add a node that outputs a file (e.g. HTTP Request with Response Format: **File**)
2. Connect it to a **DocuPipe** node
3. Set Input Mode to **Binary File**
4. Leave Binary Property as **data** (this is the default for most nodes)
5. Run it - DocuPipe automatically reads the file and uploads it

**How to check the binary property name:** If "data" doesn't work, run the previous node first and click on the **Binary** tab in the output. The property name is shown there (e.g. "data", "attachment_0", "file").

## AI Agent Support

This node supports `usableAsTool`, making it available as a tool in n8n's AI Agent workflows. Self-hosted users need to set the environment variable:

```
N8N_COMMUNITY_PACKAGES_ALLOW_TOOL_USAGE=true
```

## Compatibility

- Tested with n8n version 2.12.3
- Requires Node.js 18 or later

## Resources

- [DocuPipe Dashboard](https://app.docupipe.ai) - Create schemas, classes, and manage documents
- [DocuPipe Documentation](https://docs.docupipe.ai) - API reference and guides
- [DocuPipe Website](https://docupipe.ai) - Sign up for a free account
- [n8n Community Nodes Documentation](https://docs.n8n.io/integrations/community-nodes/)
