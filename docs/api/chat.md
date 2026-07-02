## Chat

Messaging endpoints for creating conversations, sending messages, and exporting chat history.

### Key response fields

| Field | Description |
|-------|-------------|
| `echo_state` | Current alignment state — see [Echo state values](./index#echo-state) |
| `ewma` | Alignment trend score (0–100). Higher = more on-topic. |
| `alignment_score` | Per-round alignment score (0–1) |
| `rag_reranking_type` | Reranker used for retrieval — `"cross_encoder"` or `"llm"` |

### GET /chat

List chats visible to the current user.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| agent_id | uuid | Filter by agent |
| cursor | string | Keyset pagination cursor |
| limit | integer | Page size |
| mine | boolean | When `true`, only chats created by the caller |

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "agent_id": "uuid",
      "title": "Billing question",
      "round": 5,
      "echo_state": "stable",
      "ewma": 82.4,
      "echo_scoring_pending": false,
      "input_tokens": 1200,
      "completion_tokens": 450,
      "latency_ms": 820,
      "rag_enabled": true,
      "rag_reranking": true,
      "rag_reranking_type": "cross_encoder",
      "rag_include_document_ids": null,
      "rag_exclude_document_ids": null,
      "created_at": "2026-01-20T14:00:00Z",
      "updated_at": "2026-01-20T14:05:00Z"
    }
  ],
  "next_cursor": "eyJ...",
  "total": 42
}
```

### POST /chat

Send a message and receive the assistant reply (non-streaming).

**Request body**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| message | string | yes | User message (min 1 char) |
| chat_id | uuid | no | Omit to start a new chat |
| agent_id | uuid | conditional | Required when starting a new chat |
| visibility | string | no | Chat visibility for new chats |
| team_ids | uuid[] | no | Team scope for new chats |
| enable_rag | boolean | no | Default `true` |
| include_document_ids | uuid[] | no | Restrict RAG to these documents |
| exclude_document_ids | uuid[] | no | Exclude from RAG |
| reranking | boolean | no | Enable/disable reranking |
| reranking_type | string | no | `"cross_encoder"` or `"llm"` |

**Validation rules:**
- `include_document_ids` and `exclude_document_ids` are mutually exclusive — sending both returns `422`.
- `visibility` and `team_ids` are only accepted when creating a new chat (`chat_id` omitted) — sending them on an existing chat returns `422`.

**Response** `200` / `201`

```json
{
  "chat_id": "uuid",
  "reply": "I'd be happy to help with your billing question...",
  "model": "<chat-model-id>",
  "echo": {
    "state": "stable",
    "ewma": 85.2,
    "alignment_score": 0.88,
    "round": 1,
    "events": []
  },
  "title": "Billing question",
  "postprocess_job_id": "job-id",
  "citations": [
    { "chunk_id": "uuid", "document_id": "uuid" }
  ]
}
```

### POST /chat/stream

Send a message and stream the assistant reply as Server-Sent Events.

**Request body** — same as `POST /chat`.

**Response** `200` — `text/event-stream`. Events:

| Event | Data |
|-------|------|
| `token` | `{"t": "partial text"}` |
| `done` | Full `ChatMessageResponse` JSON |
| `error` | `{"detail": "..."}` |

### GET /chat/{chat_id}/export

Download a chat as Markdown or JSON.

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| format | string | `markdown` | `markdown` or `json` |

**Response** `200` — file attachment (`text/markdown` or `application/json`) with `Content-Disposition: attachment`.

Markdown exports include the chat title, agent name, date, and each turn as user/assistant sections. JSON exports include `chat_id`, `agent`, `title`, `created_at`, and a `turns` array.

**Errors:** `400` for unsupported format; `404` when the chat is not readable.

### GET /chat/{chat_id}

Get chat with full message history.

**Response** `200`

```json
{
  "chat_id": "uuid",
  "agent_id": "uuid",
  "title": "Billing question",
  "messages": [
    { "role": "system", "content": "You are...", "pruned": false, "citations": [] },
    { "role": "user", "content": "How do I update my plan?", "pruned": false, "citations": [] },
    {
      "role": "assistant",
      "content": "You can update...",
      "pruned": false,
      "citations": [{ "chunk_id": "uuid", "document_id": "uuid" }]
    }
  ],
  "echo_scoring_pending": false,
  "agent_deleted": false
}
```

### PATCH /chat/{chat_id}

Rename a chat.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| title | string | yes | 1–200 characters |

**Response** `200` — updated `ChatSummary`.

### DELETE /chat/{chat_id}

**Response** `204` No content.

---
