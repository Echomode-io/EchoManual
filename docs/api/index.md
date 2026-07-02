# API Reference

**Base URL:** `https://api.echomode.io`

All endpoints return JSON unless noted (e.g. `POST /chat/stream` uses Server-Sent Events). Authenticated endpoints require a `Bearer` token in the `Authorization` header.

---

## Authentication

EchoMode uses JWT bearer tokens with refresh-token rotation. Obtain tokens via login or SSO, then pass the access token on every request:

```
Authorization: Bearer <access_token>
```

When the access token expires, exchange the refresh token for a new pair via `POST /auth/refresh_tokens`.

---

## Error format

All error responses follow this shape:

```json
{
  "detail": "Human-readable error message"
}
```

| Status | Meaning |
|--------|---------|
| 400 | Validation or domain error |
| 401 | Missing or expired token |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Conflict (duplicate email, etc.) |
| 413 | Payload too large (avatar > 5 MB) |
| 429 | Rate limited |

---

## Strict body validation

Some request bodies reject unexpected fields — sending any key not listed in the endpoint's table returns `422`. These endpoints use strict validation:

- `POST /auth/register`, `POST /auth/set-password`
- `POST /connectors/s3/connections`, `PATCH /connectors/connections/{id}`, `POST /connectors/connections/{id}/browse`
- `POST /documents/paste`, `POST /documents/import-from-url`, `POST /documents/import-from-connector`
- `POST /folders`, `PATCH /folders/{id}`

Other endpoints silently ignore unknown fields.

---

## Pagination

List endpoints use two pagination styles:

**Keyset pagination** (chats, logs): pass the `next_cursor` value from the response as the `cursor` query parameter.

**Offset pagination** (documents, job audit): use `limit`/`offset` query parameters.

---

## Rate limiting

| Scope | Endpoints | Limit |
|-------|-----------|-------|
| IP-based | `/auth/register`, `/auth/login`, `/auth/refresh_tokens` | Per-IP throttle |
| User-based | Admin operations | Per-user throttle |

---

## Enums & constants

These are the accepted string values for enum fields across the API. Passing an unrecognized value returns `400`.

### Visibility

Controls who can access a resource (agents, chats, documents, folders).

| Value | Scope |
|-------|-------|
| `personal` | Only the creator can access |
| `team_level` | Accessible to members of the specified teams (requires `team_ids`) |
| `org_level` | Accessible to all organization members |
| `universal` | Read-only built-in resources (cannot be created via API) |

### Echo state

The alignment state machine that tracks whether conversations stay on-topic.

| Value | Meaning |
|-------|---------|
| `stable` | Conversation is on-topic |
| `mildDrift` | Slight topic drift detected |
| `moderateDrift` | Significant topic drift |
| `severeDrift` | Conversation has drifted far off-topic |
| `assistantRefusal` | The assistant refused to respond |

Transitions flow: `stable` &rarr; `mildDrift` &rarr; `moderateDrift` &rarr; `severeDrift`. On-topic messages move the state back toward `stable`. `assistantRefusal` is set independently when a refusal is detected.

### Organization tier

| Value | Description |
|-------|-------------|
| `free` | Free tier (default for new self-serve organizations) |
| `pro` | Pro tier |
| `max` | Max tier |

### Resource type

| Value |
|-------|
| `folder` |
| `agent` |
| `agent_draft` |
| `chat` |

### Job status

Returned by the [Jobs](./jobs) endpoints.

| Value | Meaning |
|-------|---------|
| `PENDING` | Queued, not yet started |
| `STARTED` | Picked up by a worker |
| `PROGRESS` | Running (progress info available) |
| `SUCCESS` | Completed successfully |
| `FAILURE` | Failed |
| `RETRY` | Failed, will be retried |
| `REVOKED` | Cancelled via `POST /jobs/{job_id}/revoke` |

### Connector provider

| Value | Label |
|-------|-------|
| `google_drive` | Google Drive |
| `onedrive` | OneDrive |
| `sharepoint` | SharePoint |
| `dropbox` | Dropbox |
| `s3` | Amazon S3 |

OAuth-based providers: `google_drive`, `dropbox`, `onedrive`, `sharepoint`. Credential-based: `s3`.

### Connection status

| Value | Meaning |
|-------|---------|
| `active` | Credentials are valid |
| `needs_reauth` | Credentials expired or invalid — re-authorize |

### Folder kind

| Value | Meaning |
|-------|---------|
| `system` | System-managed folder (created automatically) |
| `user` | User-created folder |

### Folder system role

System folders have a role that determines their purpose in the folder tree.

| Value | Meaning |
|-------|---------|
| `org_root` | Organization-level shared root |
| `team_root` | Team-level root |
| `user_personal_org` | User's personal folder at the org level |
| `user_personal_team` | User's personal folder within a team |

### Document paste source format

Used when creating documents via `POST /documents/paste`.

| Value |
|-------|
| `text` |
| `markdown` |
| `code` |

### Chunking method

Used in [RAG configuration](./rag).

| Value | Description |
|-------|-------------|
| `token` | Fixed token-count chunks with overlap |
| `semantic` | Semantically-aware chunk boundaries |

### Retrieval mode

Used in [RAG configuration](./rag).

| Value | Description |
|-------|-------------|
| `vector` | Vector similarity search only |
| `word_match` | Keyword / full-text search only |
| `hybrid` | Combines vector and keyword search (default) |

### Reranker type

Used in [RAG configuration](./rag) and [Chat](./chat) requests.

| Value | Description |
|-------|-------------|
| `cross_encoder` | Neural cross-encoder reranker |
| `llm` | LLM-based reranker |

### Transition reason

Returned inside Echo `events` arrays to explain why the alignment state changed.

| Value | Meaning |
|-------|---------|
| `no change` | Score stayed within current state bounds |
| `scored below bound of stable` | Score dropped below the stable threshold |
| `scored below bound of mild drift` | Score dropped below the mild-drift threshold |
| `scored below bound of moderate drift` | Score dropped below the moderate-drift threshold |
| `scored above bound of mild drift` | Score rose above the mild-drift threshold (recovering) |
| `scored above bound of moderate drift` | Score rose above the moderate-drift threshold (recovering) |
| `scored above bound of severe drift` | Score rose above the severe-drift threshold (recovering) |
| `user exceeded off topic streak` | Consecutive off-topic rounds hit the streak threshold |
| `user exceeded on topic streak` | Consecutive on-topic rounds hit the recovery threshold |
| `assistant refusal detected` | The assistant refused to respond |
| `assistant refusal cleared` | A normal response followed a prior refusal |

### Chunk source

Indicates how a chunk was retrieved. Returned in RAG retrieval results.

| Value | Meaning |
|-------|---------|
| `word_match` | Full-text / keyword search |
| `vector` | Vector similarity search |
| `hybrid` | Combined vector + keyword (RRF fusion) |
| `expanded` | Added via query expansion |

### Import file status

Returned by `POST /documents/import-from-connector`.

| Value |
|-------|
| `queued` |
| `error` |

### Chat export format

Used with `GET /chat/{chat_id}/export`.

| Value |
|-------|
| `markdown` |
| `json` |

### SSO provider

| Value | Notes |
|-------|-------|
| `google` | Google sign-in (also accepts `googleoauth`) |

### Inference mode

Used with `GET /inference/list-models`.

| Value |
|-------|
| `chat` |
| `embedding` |

### Avatar content type

Accepted MIME types for avatar uploads (`POST /entity/me/avatar`). Max 5 MB.

| Value | Extension |
|-------|-----------|
| `image/jpeg` | `.jpg` |
| `image/png` | `.png` |
| `image/webp` | `.webp` |
| `image/gif` | `.gif` |

### Upload file type

Accepted file extensions for document uploads (`POST /documents`).

| Extension | Notes |
|-----------|-------|
| `.txt` | Plain text (must be UTF-8) |
| `.md` | Markdown (must be UTF-8) |
| `.pdf` | PDF (parsed server-side) |
| `.doc` | Legacy Word (parsed server-side) |
| `.docx` | Word (parsed server-side) |

Max upload size: 500 MB.

---

## Modules

Endpoint documentation is grouped by API module:

- [Auth](./auth) — Registration, login, SSO, tokens
- [API Keys](./api-keys) — Programmatic access keys
- [Agents](./agents) — Published agent CRUD
- [Agent Drafts](./agent-drafts) — Draft workspace, versioning, publish
- [Agent Eval](./agent-eval) — PEEM evaluation and comparison
- [Chat](./chat) — Messaging, streaming, export
- [Echo](./echo) — Alignment configuration
- [Anchor Words](./anchor-words) — Topic vocabulary for alignment
- [Documents](./documents) — Upload, search, chunks
- [RAG](./rag) — Chunking, embedding, retrieval config
- [Connectors](./connectors) — External storage integrations
- [Users & Organization](./entity) — Profiles, org, members
- [Teams](./teams) — Team management
- [Folders](./folders) — Dataroom folder tree
- [Logs](./logs) — Session observability
- [Jobs](./jobs) — Background ingestion jobs
- [Limits](./limits) — Tier and usage limits
- [Inference](./inference) — Available models
- [Health](./health) — Liveness probe
