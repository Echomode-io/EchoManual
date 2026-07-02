## Agents

Read, update, and delete published agents. Agents define the persona, model settings, and alignment behavior for conversations. New agents are created by [publishing a draft version](./agent-drafts#post-agent-drafts-draft_id-publish).

### GET /agents

List agent summaries visible to the current user.

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "agent_name": "Customer Support Bot",
      "agent_prompt": "You are a helpful support agent...",
      "tags": ["support", "tier1"],
      "color": "#4A90D9",
      "icon_name": "headset",
      "chat_model": "<chat-model-id>",
      "temperature": 0.7,
      "max_tokens": 4096,
      "user_off_topic_streak_threshold": 3,
      "user_on_topic_streak_threshold": 3,
      "visibility": "org_level",
      "team_ids": [],
      "created_by": "uuid",
      "created_by_name": "Jane Doe",
      "created_at": "2026-01-15T10:30:00Z",
      "updated_at": "2026-01-15T10:30:00Z",
      "anchor_word_candidates": ["help", "issue", "ticket"],
      "ready": true,
      "has_chats": true,
      "can_write": true,
      "source_draft_id": "uuid"
    }
  ]
}
```

### GET /agents/hidden

List IDs of agents the current user has hidden.

**Response** `200`

```json
{
  "ids": ["uuid", "uuid"]
}
```

### GET /agents/{agent_id}

Get full agent details.

**Response** `200` — full agent object (same shape as list items).

### PATCH /agents/{agent_id}

Update an agent's metadata and scope. Inference fields (prompt, model, temperature, max_tokens) are immutable after publish. All fields are optional.

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| agent_name | string | Display name |
| tags | string[] | Categorization tags |
| color | string | Hex color for UI |
| icon_name | string | Icon identifier |
| visibility | string | `personal`, `team_level`, or `org_level` (`universal` is not accepted) |
| team_ids | uuid[] | Required when visibility is `team_level` |

**Response** `200` — updated agent object.

### DELETE /agents/{agent_id}

**Response** `204` No content.

### POST /agents/{agent_id}/hide

Hide an agent from the current user's library view.

**Response** `204` No content.

### DELETE /agents/{agent_id}/hide

Unhide a previously hidden agent.

**Response** `204` No content.

---
