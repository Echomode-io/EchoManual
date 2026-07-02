## Users & Organization

Manage user profiles, organization settings, and member administration.

### GET /entity/me/profile

Get the current user's profile.

**Response** `200`

```json
{
  "user_id": "uuid",
  "email": "user@example.com",
  "first_name": "Jane",
  "last_name": "Doe",
  "display_name": "Example User",
  "has_avatar": true,
  "has_password": true,
  "avatar_fallback_url": null
}
```

### PATCH /entity/me/profile

Update the current user's profile.

**Request body** — at least one of:

| Field | Type |
|-------|------|
| first_name | string |
| last_name | string |
| display_name | string |

**Response** `200` — updated profile.

### POST /entity/me/avatar

Upload a profile avatar. Send as `multipart/form-data`. Max 5 MB.

**Response** `200`.

### GET /entity/me/avatar

Download the current user's avatar image.

**Response** `200` — binary image.

### DELETE /entity/me/avatar

**Response** `200`.

### GET /entity/me/membership

Get current org and team membership.

**Response** `200`

```json
{
  "org_id": "uuid",
  "org_name": "Example Org",
  "tier": "pro",
  "user_id": "uuid",
  "is_org_admin": true,
  "teams": [
    {
      "team_id": "uuid",
      "name": "Engineering",
      "is_team_admin": false,
      "added_at": "2026-01-01T00:00:00Z"
    }
  ]
}
```

### PATCH /entity/org

Rename the organization. Requires org admin.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| name | string | yes |

**Response** `200`.

### DELETE /entity/org

Permanently delete the organization. Requires org admin.

**Response** `204` No content.

### GET /entity/members

List organization members.

**Response** `200`

```json
{
  "org_id": "uuid",
  "tier": "pro",
  "member_limit": 50,
  "items": [
    {
      "user_id": "uuid",
      "email": "user@example.com",
      "first_name": "Jane",
      "last_name": "Doe",
      "display_name": "Example User",
      "is_admin": true,
      "disabled": false,
      "added_by": "uuid",
      "added_at": "2026-01-01T00:00:00Z",
      "teams": [
        { "team_id": "uuid", "is_team_admin": false }
      ]
    }
  ]
}
```

### POST /entity/members

Create a new organization member. Requires org admin.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| email | string | yes |
| password | string | yes |
| display_name | string | no |
| is_admin | boolean | no |
| team_id | uuid | no |
| is_team_admin | boolean | no |

**Response** `201` — the created user object.

### PATCH /entity/members/{user_id}/org-admin

Set or remove org admin status. Requires org admin.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| is_org_admin | boolean | yes |

**Response** `200`.

### DELETE /entity/members/{user_id}

Remove a member from the organization. Requires org admin.

**Response** `204` No content.

### PATCH /entity/users/{user_id}

Update a managed user's profile. Requires admin.

**Request body** — at least one of `email`, `display_name`.

**Response** `200`.

### POST /entity/users/{user_id}/disable

Disable a user account. Requires admin.

**Response** `204` No content.

### POST /entity/users/{user_id}/enable

Re-enable a user account. Requires admin.

**Response** `204` No content.

### POST /entity/users/{user_id}/reset-password

Reset a user's password. Requires admin.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| new_password | string | yes |

**Response** `204` No content.

### GET /entity/users/{user_id}/avatar

Download another org member's avatar image.

**Response** `200` — binary image, or `302` redirect to an SSO avatar URL when no stored avatar exists.

**Errors:** `404` when the user is not in the caller's org, is disabled, or has no avatar.

---
