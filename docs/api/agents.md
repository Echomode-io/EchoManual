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
      "enabled_tools": ["google_calendar", "brave_search"],
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

Update an agent's metadata. Inference fields (prompt, model, temperature, max_tokens, anchor words) and scope (visibility, teams) are immutable after publish — change them by creating a draft and re-publishing. All fields are optional.

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| agent_name | string | Display name |
| tags | string[] | Categorization tags |
| color | string | Hex color for UI |
| icon_name | string | Icon identifier |
| enabled_tools | string[] | Tool definition IDs to enable (validated against tool registry) |

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

### GET /agents/tools

List the full tool catalog. Each entry includes connection status and per-action grants for the caller's org.

**Response** `200`

```json
{
  "items": [
    {
      "id": "google_calendar",
      "name": "Google Calendar",
      "group": "Google",
      "description": "...",
      "requires_credentials": false,
      "credential_fields": [],
      "available": true,
      "auth_kind": "oauth",
      "connected": true,
      "actions": [
        {
          "id": "google_calendar_create_event",
          "label": "Create Event",
          "description": "...",
          "crudl": "create",
          "granted": true
        }
      ]
    }
  ]
}
```

### GET /agents/tools/connections

List org-level tool provider connections for the Connections page.

**Response** `200`

```json
{
  "items": [
    {
      "provider": "google",
      "name": "Google",
      "connected": true,
      "configured": true,
      "auth_mode": "oauth",
      "category": "integration",
      "credential_fields": [],
      "scope_options": [],
      "tools": ["Google Calendar", "Google Docs"],
      "auth_actions": ["google_calendar_create_event"],
      "actions": [{ "id": "...", "label": "...", "description": "...", "crudl": "create", "granted": true }]
    }
  ],
  "is_org_admin": true
}
```

### GET /agents/tools/{provider}/authorize

Start OAuth consent for a tool provider (org admins only).

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| return_to | string | Frontend path to redirect after callback |
| scopes | string[] | OAuth scopes to request (repeat param for multiple) |

**Response** `200`

```json
{ "authorize_url": "https://accounts.google.com/..." }
```

### POST /agents/tools/{provider}/connection

Connect a platform-key provider by supplying an API key (org admins only).

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| api_key | string | API key for the provider |

**Response** `204` No content.

### DELETE /agents/tools/{provider}/connection

Disconnect a tool provider (org admins only).

**Response** `204` No content.

---
