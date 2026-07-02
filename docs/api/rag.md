## RAG Configuration

Per-document configuration for the retrieval-augmented generation pipeline. Controls how documents are chunked, how retrieval queries are executed, and how results are reranked.

See [Chunking method](./index#chunking-method), [Retrieval mode](./index#retrieval-mode), and [Reranker type](./index#reranker-type) for accepted enum values.

### Key config fields

| Field | Description |
|-------|-------------|
| `chunking.method` | How text is split into chunks — `"token"` or `"semantic"` |
| `chunking.target_tokens` | Target chunk size in tokens |
| `chunking.overlap_tokens` | Token overlap between adjacent chunks |
| `retrieval.mode` | Search strategy — `"vector"`, `"word_match"`, or `"hybrid"` |
| `retrieval.rrf_k` | Reciprocal rank fusion constant for hybrid mode (higher = smoother blending) |
| `reranking.reranker_type` | Reranker to use — `"cross_encoder"` or `"llm"` |
| `reranking.top_k` | Number of chunks to keep after reranking |

### GET /rag/config/{document_id}

**Response** `200`

```json
{
  "config": {
    "chunking": {
      "method": "token",
      "target_tokens": 256,
      "overlap_tokens": 50
    },
    "retrieval": {
      "mode": "hybrid",
      "rrf_k": 60,
      "word_match_limit": 100,
      "vector_limit": 100,
      "min_vector_similarity": 0.6
    },
    "reranking": {
      "enabled": true,
      "reranker_type": "cross_encoder",
      "top_k": 5
    },
    "embedding": {
      "model": "<embedding-model-id>"
    }
  }
}
```

### PUT /rag/config/{document_id}

Update the RAG configuration for a document.

**Request body** — full `RagConfig` object (same shape as response).

**Response** `200` — updated config.

### POST /rag/ingest/{document_id}

Queue chunking and embedding for a document.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| redo | boolean | `false` | `true` deletes existing chunks first |

**Response** `200`

```json
{
  "document_id": "uuid",
  "parse_job_id": "job-id",
  "docling_job_id": "job-id",
  "chunking_job_id": "job-id",
  "embedding_job_id": "job-id",
  "upload_complete": true,
  "chunking_complete": false,
  "embedding_complete": false,
  "queued": true
}
```

### POST /rag/chunks/preview

Dry-run chunking on raw text without persisting.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| content | string | yes |
| config | object | no |

**Response** `200`

```json
{
  "chunks": [
    {
      "index": 0,
      "content": "...",
      "token_count": 248,
      "contextual_text": null,
      "chunk_kind": null
    }
  ],
  "total": 5
}
```

### POST /rag/documents/{document_id}/chunks/preview

Dry-run chunking for an already-stored document. Content is read from the stored document. Chunking parameters are form-encoded.

**Request body** (`multipart/form-data`)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| chunking_method | string | `"token"` | `"token"` or `"semantic"` |
| target_tokens | integer | — | Target chunk size in tokens (≥ 1) |
| overlap_tokens | integer | — | Token overlap between chunks (≥ 0) |

**Response** `200` — same shape as above.

---
