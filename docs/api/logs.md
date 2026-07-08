## Logs

Session logs and conversation analysis for observability.

### Key response fields

| Field | Description |
|-------|-------------|
| `ewma` / `avg_ewma` | Alignment trend score (0–100). Higher = more on-topic. |
| `alignment_score` | Per-round alignment score (0–1) |
| `state` | Echo alignment state — see [Echo state values](./index#echo-state) |
| `drift_rounds` | Number of rounds in any drift state |
| `drift_rate` | Fraction of total rounds that were in drift |
| `user_on_or_off_topic_streak` | Current consecutive on/off-topic round count |

### GET /logs/conversations

List accessible chats for session logs.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| agent_id | uuid | Filter by agent |
| state | string | Filter by Echo state |
| date_from | string | ISO 8601 start date (inclusive) |
| date_to | string | ISO 8601 end date (inclusive) |
| q | string | Search query |
| cursor | string | Keyset pagination cursor |
| limit | integer | Page size |
| include_total | boolean | Include total count in response (default `false`) |

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "title": "Billing question",
      "description": null,
      "agent_id": "uuid",
      "agent": "Customer Support Bot",
      "total_rounds": 5,
      "avg_ewma": 82.4,
      "started_at": "2026-01-20T14:00:00Z"
    }
  ],
  "next_cursor": "eyJ...",
  "total": 120
}
```

### GET /logs/stats

Aggregate conversation metrics across chats readable by the caller.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| agent_id | uuid | Filter by agent |
| date_from | string | ISO 8601 start date (inclusive) |
| date_to | string | ISO 8601 end date (inclusive) |

**Response** `200`

```json
{
  "total_chats": 120,
  "total_rounds": 842,
  "avg_ewma": 81.3,
  "total_input_tokens": 420000,
  "total_completion_tokens": 98000,
  "total_tokens": 518000,
  "total_cost_usd": 12.45,
  "avg_latency_ms": 920.5,
  "drift_rounds": 38,
  "stable_rounds": 790,
  "refusal_rounds": 14,
  "drift_rate": 0.045
}
```

### GET /logs/conversations/{chat_id}

Get session detail with paginated rounds.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| cursor | string | Keyset pagination cursor for round summaries |
| limit | integer | Page size (1–500) |

**Response** `200`

```json
{
  "session": {
    "run_id": "uuid",
    "agent": "Customer Support Bot",
    "model": "<chat-model-id>",
    "started_at": "2026-01-20T14:00:00Z",
    "summary": {
      "total_rounds": 5,
      "avg_ewma": 82.4,
      "stable_rounds": 4,
      "drift_rounds": 1,
      "refusal_rounds": 0
    }
  },
  "round_summaries": [
    {
      "round": 1,
      "type": null,
      "user_content": "How do I update my plan?",
      "assistant_reply": "You can update...",
      "scoring_pending": false,
      "state": "stable",
      "ewma": 85.0,
      "latency_ms": 820
    }
  ],
  "next_cursor": null,
  "avg_latency_ms": 780.0,
  "chat_title": "Billing question",
  "chat_description": ""
}
```

### GET /logs/conversations/{chat_id}/rounds/{round_index}

Get detailed data for a single round.

**Response** `200`

```json
{
  "chat_id": "uuid",
  "round_index": 1,
  "session": { "..." },
  "round": {
    "round": 1,
    "state": "stable",
    "ewma": 85.0,
    "alignment_score": 0.88,
    "input_tokens": 450,
    "completion_tokens": 200,
    "latency_ms": 820,
    "user_on_or_off_topic_streak": 0,
    "events": []
  },
  "scoring_pending": false
}
```

### GET /logs/recent

Most recently updated chats, ordered by `updated_at` descending.

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| limit | integer | — | Max items (1–31) |
| mine | boolean | `false` | When `true`, only chats created by the caller |

**Response** `200`

```json
[
  {
    "id": "uuid",
    "title": "Billing question",
    "updated_at": "2026-01-20T14:05:00Z"
  }
]
```

### GET /logs/agents

List agents that have at least one logged chat visible to the caller. Used for filter dropdowns.

**Response** `200`

```json
[
  { "id": "uuid", "name": "Customer Support Bot" }
]
```

---
