## Teams

Manage teams within an organization. Teams control resource visibility when using `team_level` access.

### GET /entity/teams

List teams in the organization.

**Response** `200`

```json
{
  "org_id": "uuid",
  "tier": "pro",
  "items": [
    {
      "id": "uuid",
      "org_id": "uuid",
      "name": "Engineering",
      "created_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### POST /entity/teams

Create a team. Requires org admin.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| name | string | yes |

**Response** `201` — the created team object.

### DELETE /entity/teams/{team_id}

Delete (disable) a team. Requires org admin.

**Response** `204` No content.

### GET /entity/teams/{team_id}/members

List team members.

**Response** `200`

```json
{
  "team_id": "uuid",
  "tier": "pro",
  "items": [
    {
      "user_id": "uuid",
      "email": "user@example.com",
      "display_name": "Example User",
      "is_team_admin": false,
      "disabled": false,
      "added_by": "uuid",
      "added_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### POST /entity/teams/{team_id}/members

Create a new user and add them to the team. Requires team/org admin.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| email | string | yes |
| password | string | yes |
| display_name | string | no |
| is_team_admin | boolean | no |

**Response** `201` — the created user object.

### PUT /entity/teams/{team_id}/members/{user_id}

Add an existing org member to a team. If already a member, optionally promote to team admin.

**Request body** (optional)

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| is_team_admin | boolean | `false` | Set to `true` to grant team admin role |

**Response** `200`.

### PATCH /entity/teams/{team_id}/members/{user_id}/team-admin

Set team admin status.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| is_team_admin | boolean | yes |

**Response** `200`.

### DELETE /entity/teams/{team_id}/members/{user_id}

Remove a user from a team.

**Response** `204` No content.

---
