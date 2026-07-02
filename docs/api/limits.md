## Limits

Check organization usage against tier limits.

### GET /limits

Check organization usage and tier limits.

**Response** `200`

```json
{
  "tier": "pro",
  "member_count": 8,
  "member_limit": 50,
  "total_pages": 120,
  "page_limit": 10000,
  "inference_limit_usd": 100.0,
  "per_user_inference": [
    {
      "user_id": "uuid",
      "input_tokens": 50000,
      "completion_tokens": 20000,
      "cost_usd": 1.25
    }
  ],
  "draft_count": 5,
  "draft_version_count": 12,
  "draft_version_limit": 50,
  "published_agent_count": 3,
  "published_agent_limit": 20
}
```

---
