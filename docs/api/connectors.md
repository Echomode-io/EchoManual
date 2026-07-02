## Connectors

Connect external storage providers to import documents into the dataroom. Supported providers: Google Drive, OneDrive, SharePoint, Dropbox, and Amazon S3.

See [Connector provider](./index#connector-provider) and [Connection status](./index#connection-status) for accepted enum values.

### GET /connectors/oauth/providers

List available OAuth providers.

**Response** `200`

```json
{
  "providers": [
    { "provider": "google_drive", "label": "Google Drive" },
    { "provider": "onedrive", "label": "OneDrive" }
  ]
}
```

### GET /connectors/oauth/{provider}/authorize

Start an OAuth flow for a storage provider.

**Query parameters**

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| login_hint | string | no | Email hint passed to the OAuth provider's consent screen |
| site_id | string | conditional | Required for `sharepoint` — the SharePoint site ID to connect |
| return_to | string | no | Frontend path to redirect after the OAuth callback completes |

**Response** `200`

```json
{
  "authorize_url": "https://accounts.google.com/..."
}
```

### GET /connectors/oauth/{provider}/callback

OAuth provider redirect callback. Unauthenticated; state-verified.

**Response** `200` (JSON) or `303` (redirect to frontend).

### POST /connectors/s3/connections

Create an S3 connection.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| display_name | string | yes |
| credentials | object | yes |
| config | object | no |

`credentials` and `config` are provider-specific objects. Required keys depend on the connector type; values are stored encrypted server-side.

**Response** `201` — connection object.

### GET /connectors/connections

List all connections for the current user.

**Response** `200`

```json
{
  "items": [
    {
      "id": "uuid",
      "provider": "google_drive",
      "display_name": "My Drive",
      "status": "active",
      "last_error": null,
      "credentials_masked": { "email": "j***@example.com" },
      "config": {},
      "user_id": "uuid",
      "created_at": "2026-01-05T08:00:00Z",
      "updated_at": "2026-01-05T08:00:00Z"
    }
  ]
}
```

### GET /connectors/connections/{connection_id}

Get connection details.

**Response** `200` — connection object.

### PATCH /connectors/connections/{connection_id}/refresh

Re-validate stored credentials for a connection and update its status.

**Response** `200` — updated connection object. The `status` field is `"active"` when validation succeeds, or `"needs_reauth"` when credentials are invalid or expired.

### PATCH /connectors/connections/{connection_id}

Update a connection.

**Request body**

| Field | Type |
|-------|------|
| display_name | string |
| credentials | object |
| config | object |

All fields optional.

**Response** `200` — updated connection object.

### DELETE /connectors/connections/{connection_id}

**Response** `204` No content.

### POST /connectors/connections/{connection_id}/browse

Browse the remote file tree.

**Request body**

| Field | Type | Default |
|-------|------|---------|
| path | string | `""` (root) |

**Response** `200`

```json
{
  "path": "Documents/Reports",
  "files": [
    {
      "file_id": "drive-file-id",
      "name": "Q1 Report.pdf",
      "path": "Documents/Reports/Q1 Report.pdf",
      "mime_type": "application/pdf",
      "size_bytes": 245000,
      "is_folder": false
    }
  ]
}
```

---
