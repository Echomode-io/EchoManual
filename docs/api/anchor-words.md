## Anchor Words

Anchor words define the topic vocabulary that Echo uses for alignment scoring. They are generated via LLM suggestions and can be expanded with related terms.

### POST /anchor-words/expand

Generate anchor-word candidates. Supply `agent_id` to pull metadata from a published agent, or pass inline metadata for a draft agent.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| agent_id | uuid | — | Published agent whose metadata to use (omit for drafts) |
| agent_name | string | — | Agent name (inline metadata for drafts) |
| agent_prompt | string | — | System prompt (inline metadata for drafts) |
| chat_model | string | — | Model used for generation |
| tags | string[] | `[]` | Agent tags for context |
| words | string[] | `[]` | Already-selected anchor words (used as expansion context). Also accepts `anchor_words`. |
| exclude_words | string[] | `[]` | Previously shown candidates to omit from the next batch |

**Response** `200`

```json
{
  "anchor_word_candidates": ["billing", "invoice", "payment", "refund"]
}
```

### GET /anchor-words/{agent_id}

Get a published agent's saved anchor words.

**Response** `200`

```json
{
  "agent_id": "uuid",
  "anchor_words": { "billing": 1, "invoice": 1, "payment": 2 },
  "anchor_word_count": 3,
  "created_at": "2026-01-15T10:30:00Z"
}
```

| Error | Cause |
|-------|-------|
| 404 | Agent not found, not readable, or anchor words not initialized |

---
