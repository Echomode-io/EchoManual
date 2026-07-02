## Jobs

Monitor and manage background ingestion jobs (parsing, chunking, embedding).

See [Job status](./index#job-status) for the full list of job states.

### GET /jobs

List queued and in-progress ingestion jobs.

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| include_finished | boolean | `false` | Include SUCCESS, FAILURE, and REVOKED jobs |

**Response** `200`

```json
{
  "jobs": [
    {
      "job_id": "job-id",
      "operation": "embed_document",
      "state": "PROGRESS",
      "progress": {
        "stage": "embedding",
        "current": 12,
        "total": 24,
        "message": "Embedding chunks..."
      }
    }
  ],
  "broker": {
    "queue_name": "celery",
    "pending_count": 3,
    "active_count": 1,
    "reserved_count": 0,
    "scheduled_count": 0
  }
}
```

### GET /jobs/{job_id}

Check status of a specific background job.

**Response** `200`

```json
{
  "job_id": "job-id",
  "state": "SUCCESS",
  "operation": "embed_document",
  "result": 24,
  "payload": null,
  "elapsed_seconds": 12.5,
  "error": null,
  "progress": null
}
```

### GET /jobs/audit

Query the job status audit log.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| job_id | string | Filter by job ID |
| status | string | Filter by status |
| operation | string | Filter by operation |
| created_from | string | ISO 8601 start date (inclusive) |
| created_to | string | ISO 8601 end date (inclusive) |
| limit | integer | Page size |
| offset | integer | Offset |

**Response** `200`

```json
{
  "items": [
    {
      "job_id": "job-id",
      "status": "SUCCESS",
      "created_at": "2026-01-10T09:05:00Z",
      "user_id": "uuid",
      "operation": "embed_document",
      "error": null,
      "elapsed_seconds": 12.5
    }
  ],
  "total": 50,
  "limit": 20,
  "offset": 0
}
```

### POST /jobs/{job_id}/revoke

Cancel a background job.

**Query parameters**

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| terminate | boolean | `true` | Also terminate the running process (prefork pool). Avoid with solo pool. |

**Response** `200`

```json
{
  "job_id": "job-id",
  "terminate": true,
  "message": "Revocation sent to workers..."
}
```

---
