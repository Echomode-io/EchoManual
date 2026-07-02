## Documents

Upload, search, and manage documents in the dataroom. Documents are automatically chunked and embedded for RAG retrieval.

### GET /documents

List documents readable by the current user.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| folder_id | uuid | Filter by folder |
| limit | integer | Page size |
| offset | integer | Result offset |

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Q1 Report.pdf",
      "folder_ids": ["uuid"],
      "source_format": "pdf",
      "import_source_provider": null,
      "import_source_url": null,
      "char_count": 45200,
      "content_preview": "Executive summary: In Q1 2026...",
      "has_stored_original": true,
      "has_preview_pdf": false,
      "page_count": 12,
      "chunking_stale": false,
      "embedding_stale": false,
      "chunking_complete": true,
      "embedding_complete": true,
      "created_by": "uuid",
      "created_by_name": "Example User",
      "created_at": "2026-01-10T09:00:00Z",
      "updated_by": "uuid",
      "updated_at": "2026-01-10T09:05:00Z"
    }
  ],
  "total": 15,
  "total_pages": 2,
  "has_more": true
}
```

### GET /documents/recent

Most recently updated documents readable by the caller, ordered by `updated_at` descending.

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | integer | 31 | Max items (1–31) |
| mine | boolean | `false` | When `true`, only return documents created by the caller |

**Response** `200` — same shape as `GET /documents` (without pagination fields when empty).

### GET /documents/search

Full-text search across readable documents. Combines document name matching with ranked chunk content search.

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| q | string | — | Search query (1–200 chars). Empty or whitespace-only returns no results. |
| limit | integer | 20 | Page size (1–50) |
| offset | integer | 0 | Result offset |

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "Q1 Report.pdf",
      "folder_ids": ["uuid"],
      "source_format": "pdf",
      "content_preview": "Executive summary: In Q1 2026...",
      "char_count": 45200,
      "page_count": 12,
      "rank": 0.842,
      "created_by": "uuid",
      "created_at": "2026-01-10T09:00:00Z",
      "updated_at": "2026-01-10T09:05:00Z"
    }
  ],
  "total": 3,
  "query": "executive summary"
}
```

### POST /documents

Upload a document. Send as `multipart/form-data`.

**Form fields**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | file | yes | The document file |
| name | string | no | Display name (defaults to filename) |
| target_folder_id | uuid | no | Destination folder |
| chunking_method | string | no | `"token"` (default) or `"semantic"` |
| target_tokens | integer | no | Target chunk size in tokens |
| overlap_tokens | integer | no | Token overlap between chunks |
| ingest | boolean | no | Chunk and embed after upload (default `true`) |

**Response** `201` — full document object.

### POST /documents/paste

Create a document from pasted text.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | yes | Document name |
| content | string | yes | Text content |
| source_format | string | yes | `"text"`, `"markdown"`, or `"code"` |
| target_folder_id | uuid | no | Destination folder |

**Response** `201` — full document object.

### POST /documents/import-from-url

Import a document from a public or authenticated URL.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| url | string | yes |
| target_folder_id | uuid | no |
| name | string | no |

**Response** `201` — full document object.

### POST /documents/import-from-connector

Import files from a connected remote storage provider.

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| connection_id | uuid | yes | Connector connection ID |
| files | object[] | yes | List of `{file_id, path, name, mime_type, folder}` — at least one of `file_id`, `path`, or `name` required per item. Per-item `folder` overrides the top-level default. |
| folder | string | no | Default remote folder for all files |
| target_folder_id | uuid | no | EchoMode destination folder |

**Response** `200`

```json
{
  "results": [
    {
      "file_id": "drive-file-id",
      "document_id": "uuid",
      "job_id": "job-id",
      "status": "queued",
      "error": null
    }
  ]
}
```

### GET /documents/{document_id}

Get full document details including content.

**Response** `200` — full document object including `content` and associated job IDs.

### GET /documents/{document_id}/download-url

Get a time-limited presigned download URL.

**Response** `200`

```json
{
  "url": "https://storage.example.com/...",
  "expires_in": 3600
}
```

### GET /documents/{document_id}/file

Stream the document bytes for inline preview.

**Response** `200` — binary stream with appropriate `Content-Type`.

### PATCH /documents/{document_id}

Update a document (rename, move, reupload, change chunking config). Send as `multipart/form-data` when reuploading.

**Response** `200` — updated document object.

### GET /documents/{document_id}/links

List folders a document is linked to.

**Response** `200`

```json
{
  "document_id": "uuid",
  "links": [
    { "folder_id": "uuid", "folder_name": "Shared" },
    { "folder_id": "uuid", "folder_name": "Engineering" }
  ]
}
```

### POST /documents/{document_id}/links

Add a folder link to a document (place it in an additional folder).

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| folder_id | uuid | yes | Destination folder |
| promote | boolean | no | When `true`, move the document out of its current folder into the target folder |

**Response** `201`.

### DELETE /documents/{document_id}/links/{folder_id}

Remove a document's link from a folder.

**Response** `204` No content.

### GET /documents/{document_id}/chunks

List chunks for a document.

**Response** `200`

```json
{
  "document_id": "uuid",
  "items": [
    {
      "id": "uuid",
      "chunk_index": 0,
      "content": "Executive summary...",
      "contextual_text": null,
      "chunk_kind": null,
      "token_count": 256,
      "embedded": true,
      "embedding_model": "<embedding-model-id>",
      "embedded_at": "2026-01-10T09:05:00Z"
    }
  ]
}
```

### GET /documents/chunks/{chunk_id}

Get a specific chunk with its source document context.

**Response** `200`

```json
{
  "chunk_id": "uuid",
  "chunk_index": 0,
  "content": "...",
  "document_id": "uuid",
  "document_name": "Q1 Report.pdf",
  "visibility": "org_level",
  "page_number": 3,
  "content_offset": 1240
}
```

`page_number` is a 1-based page containing the chunk (PDF, office preview, or estimated). `content_offset` is the character offset in the document body for text-preview scroll/highlight.

### GET /documents/{document_id}/chunking-status

**Response** `200`

```json
{
  "document_id": "uuid",
  "chunking_complete": true,
  "chunk_count": 24
}
```

### GET /documents/{document_id}/embedding-status

**Response** `200`

```json
{
  "document_id": "uuid",
  "embedding_complete": true,
  "chunks_total": 24,
  "chunks_embedded": 24
}
```

### DELETE /documents/{document_id}

**Response** `204` No content.

---
