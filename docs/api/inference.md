## Inference

Query available models from the inference gateway.

### GET /inference/list-models

List available LLM models from the inference gateway.

**Query parameters**

| Param | Type | Description |
|-------|------|-------------|
| mode | string | `"chat"` or `"embedding"` |

**Response** `200`

```json
{
  "models": [
    {
      "id": "<model-id>",
      "mode": "chat",
      "provider": "<provider>",
      "label": "<display-name>"
    }
  ]
}
```

---
