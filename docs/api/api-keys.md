## API Keys

Create and manage API keys for programmatic access. API keys authenticate requests the same way JWT bearer tokens do — pass the key in the `Authorization` header:

```
Authorization: Bearer ek_...
```

All endpoints are prefixed with `/api-keys`.

---

### POST /api-keys

Create a new API key. The raw key is returned **only once** in the response — store it securely.

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| name | string | Display name for the key (1–255 characters) |

**Response** `201`

```json
{
  "id": "uuid",
  "name": "CI Pipeline",
  "key_prefix": "ek_abc1",
  "raw_key": "ek_abc1...full_key",
  "created_at": "2026-06-20T12:00:00Z"
}
```

::: warning
`raw_key` is only returned at creation time. If you lose it, revoke the key and create a new one.
:::

### GET /api-keys

List API keys for the current user. Org admins can view another member's keys by passing their `user_id`.

**Query parameters**

| Parameter | Type | Description |
|-----------|------|-------------|
| user_id | uuid | View keys for a different user (org admin only) |

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "name": "CI Pipeline",
      "key_prefix": "ek_abc1",
      "user_id": "uuid",
      "created_at": "2026-06-20T12:00:00Z",
      "last_used_at": "2026-06-25T09:15:00Z",
      "revoked_at": null
    }
  ]
}
```

| Error | Cause |
|-------|-------|
| 403 | Non-admin tried to view another user's keys |

### DELETE /api-keys/{key_id}

Revoke an API key. The key becomes unusable immediately. Users can revoke their own keys; org admins can revoke any key in the org.

**Response** `204` No content.

| Error | Cause |
|-------|-------|
| 404 | Key not found or not in the caller's org |

---
