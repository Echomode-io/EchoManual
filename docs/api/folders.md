## Folders

Manage the dataroom folder tree. Folders organize documents and control visibility.

See [Folder kind](./index#folder-kind) and [Folder system role](./index#folder-system-role) for accepted enum values.

### GET /folders

List the folder tree (root folders with recursive children).

**Response** `200` — array of `FolderTreeNode`:

```json
[
  {
    "id": "uuid",
    "name": "Shared",
    "kind": "system",
    "system_role": "org_root",
    "visibility": "org_level",
    "entity_missing": false,
    "can_write": true,
    "created_at": "2026-01-01T00:00:00Z",
    "updated_at": "2026-01-05T00:00:00Z",
    "folders": [],
    "documents": [
      { "id": "uuid", "name": "Onboarding Guide.md" }
    ]
  }
]
```

### POST /folders

Create a folder.

**Request body**

| Field | Type | Required |
|-------|------|----------|
| name | string | yes |
| parent_id | uuid | yes |

**Response** `201` — the created folder object.

### GET /folders/{folder_id}/info

Get folder details.

**Response** `200` — folder object.

### GET /folders/{folder_id}

List folder contents (immediate children).

**Response** `200` — object with `folders` and `documents` arrays.

### PATCH /folders/{folder_id}

Update a folder (rename or move).

**Request body**

| Field | Type |
|-------|------|
| name | string |
| parent_id | uuid |

**Response** `200` — updated folder object.

### DELETE /folders/{folder_id}

Delete a folder.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| cascade | boolean | Also delete contained documents |

**Response** `204` No content.

---
