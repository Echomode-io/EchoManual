## Agent Drafts

Create, iterate, and publish agent drafts. A draft is a workspace with a linear version chain — each save creates a new immutable version snapshot. When a version is ready, publish it to create a live agent.

Draft summaries expose `name` from the head (latest) version's `agent_name` — there is no separate draft-level name. Empty agent names display as `"Untitled Draft"`. Version titles default to sequential labels (`v1`, `v2`, …) from a monotonic `next_version_number` counter; use [Rename a version](#patch-agent-drafts-draft_id-versions-version_id) to set a custom title without affecting the counter.

All endpoints are prefixed with `/agent-drafts`.

---

### GET /agent-drafts

List draft summaries owned by the current user.

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "org_id": "uuid",
      "created_by": "uuid",
      "created_by_name": "Jane Doe",
      "name": "Support Bot",
      "visibility": "personal",
      "team_ids": [],
      "head_version_id": "uuid",
      "next_version_number": 3,
      "created_at": "2026-06-15T10:00:00Z",
      "updated_at": "2026-06-20T14:30:00Z"
    }
  ]
}
```

### GET /agent-drafts/hidden

List IDs of drafts the current user has hidden.

**Response** `200`

```json
{
  "ids": ["uuid", "uuid"]
}
```

### POST /agent-drafts

Create a new draft workspace with an initial version.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| visibility | string | `"personal"` | `personal`, `team_level`, or `org_level` |
| team_ids | uuid[] | `[]` | Required when visibility is `team_level` |
| source_agent_id | uuid | — | Fork from a published agent — mutually exclusive with `source_version_id` (sending both returns `422`) |
| source_version_id | uuid | — | Fork from an existing draft version — mutually exclusive with `source_agent_id` (sending both returns `422`) |
| agent_name | string | `""` | Initial version agent name — defaults to `"Untitled Draft"` when blank (ignored when forking) |
| agent_prompt | string | `""` | Initial version system prompt (ignored when forking) |
| tags | string[] | `[]` | Initial version tags (ignored when forking) |
| color | string | — | Icon color hex (ignored when forking) |
| icon_name | string | — | Lucide icon name (ignored when forking) |
| chat_model | string | — | Model identifier (ignored when forking) |
| temperature | number | `0.7` | Sampling temperature (ignored when forking) |
| max_tokens | integer | `4096` | Max response tokens (ignored when forking) |
| anchor_words | object | — | Anchor word map (ignored when forking) |
| golden_cases | object[] | — | Golden test cases — each object has `id` (string), `prompt` (string), and `reference_answer` (string, default `""`) (ignored when forking) |

**Response** `201` — `AgentDraftDetail` (see [Get a draft](#get-agent-drafts-draft_id)).

| Error | Cause |
|-------|-------|
| 404 | Source agent or version not found |
| 409 | Draft-version limit reached |

### GET /agent-drafts/{draft_id}

Get a draft with its full version chain.

**Response** `200`

```json
{
  "id": "uuid",
  "org_id": "uuid",
  "created_by": "uuid",
  "created_by_name": "Jane Doe",
  "name": "Support Bot",
  "visibility": "personal",
  "team_ids": [],
  "head_version_id": "uuid",
  "next_version_number": 2,
  "created_at": "2026-06-15T10:00:00Z",
  "updated_at": "2026-06-20T14:30:00Z",
  "versions": [
    {
      "id": "uuid",
      "draft_id": "uuid",
      "parent_version_id": null,
      "title": "v1",
      "agent_name": "Support Bot",
      "agent_prompt": "You are a helpful support agent...",
      "tags": ["support"],
      "color": "#4A90D9",
      "icon_name": "headset",
      "chat_model": "<chat-model-id>",
      "temperature": 0.7,
      "max_tokens": 4096,
      "anchor_words": { "help": 1, "issue": 1 },
      "anchor_word_count": 20,
      "eval_scores": null,
      "eval_status": null,
      "golden_cases": [],
      "created_by": "uuid",
      "created_at": "2026-06-15T10:00:00Z"
    }
  ]
}
```

---

### POST /agent-drafts/{draft_id}/versions

Commit a new version after the given parent.

Any version in the chain may be used as the parent. If the parent already has descendants, the request returns `409` unless `force=true`. When `force` is set, all descendants of the parent are deleted before the new version is created.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| parent_version_id | uuid | **required** | The version to build on |
| title | string | — | Version title — defaults to `v{next_version_number}` (e.g. `v2`) when omitted or blank; the counter increments on each commit and is not reset by renames or deletions |
| agent_name | string | `""` | Agent display name |
| agent_prompt | string | `""` | System prompt |
| tags | string[] | `[]` | Categorization tags |
| color | string | — | Icon color hex |
| icon_name | string | — | Lucide icon name |
| chat_model | string | — | Model identifier |
| temperature | number | `0.7` | Sampling temperature |
| max_tokens | integer | `4096` | Max response tokens |
| anchor_words | object | — | Anchor word map |
| golden_cases | object[] | — | Golden test cases — each object has `id` (string), `prompt` (string), and `reference_answer` (string, default `""`) |
| eval_scores | object | — | Preview eval scores to persist |
| force | boolean | `false` | Delete existing descendants before committing |

Fields that are **not included** in the request body inherit their value from the parent version. Fields that are explicitly sent (even if empty) overwrite the parent's value.

**Response** `201`

```json
{
  "version": { "...AgentDraftVersionSummary" }
}
```

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can edit |
| 404 | Draft or parent version not found |
| 409 | Parent has descendants (send `force: true` to replace them), or version limit reached |

### PATCH /agent-drafts/{draft_id}/versions/{version_id}

Rename a version.

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| title | string | New version title (1–256 characters) |

**Response** `200` — `AgentDraftVersionSummary`.

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can edit |
| 404 | Draft or version not found |

### PATCH /agent-drafts/{draft_id}/scope

Update draft visibility and team scope. Applies to the whole draft workspace, not individual versions.

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| visibility | string | `personal`, `team_level`, or `org_level` |
| team_ids | uuid[] | Required when visibility is `team_level` |

**Response** `200` — `AgentDraftDetail`.

### POST /agent-drafts/{draft_id}/hide

Hide a draft from the current user's library view.

**Response** `204` No content.

### DELETE /agent-drafts/{draft_id}/hide

Unhide a previously hidden draft.

**Response** `204` No content.

### DELETE /agent-drafts/{draft_id}

Delete a draft and all its versions.

**Response** `204` No content.

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can delete |
| 404 | Draft not found |

### DELETE /agent-drafts/{draft_id}/versions/{version_id}

Delete a single version and reparent its descendants.

**Response** `204` No content.

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can edit |
| 404 | Draft or version not found |

---

### POST /agent-drafts/{draft_id}/publish

Publish a version as a live agent. The version must have a prompt and anchor words.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| version_id | uuid | **required** | Version to publish |
| visibility | string | — | Override the draft's visibility |
| team_ids | uuid[] | — | Override the draft's team assignment |

**Response** `201` — `AgentSummary` (same shape as [GET /agents](./agents) items).

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can publish |
| 404 | Draft or version not found |
| 409 | Version not ready or agent limit reached |

---

### POST /agent-drafts/{draft_id}/versions/{version_id}/eval/start

Run prompt evaluation and/or golden-case evaluation against a version. Results are persisted on the version.

**Request body** (optional)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| run_golden | boolean | `false` | Run golden test cases |
| golden_cases | object[] | — | Golden cases to evaluate (each has `id`, `prompt`, `reference_answer`) |
| golden_case_ids | string[] | — | Subset of golden case IDs to run |

**Response** `200` — `AgentDraftVersionSummary` with updated `eval_scores` and `eval_status`.

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can run evals |
| 404 | Draft or version not found |

---
