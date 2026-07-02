## Echo Configuration

Echo is EchoMode's alignment monitoring system. It tracks whether conversations stay on-topic using a state machine. See [Echo state values](./index#echo-state) for the full list of states and transitions.

### GET /echo/config/{agent_id}

Get the Echo configuration for an agent.

**Response** `200`

```json
{
  "config": {
    "user_off_topic_streak_threshold": 3,
    "user_on_topic_streak_threshold": 3
  }
}
```

### PUT /echo/config/{agent_id}

Update Echo configuration.

**Request body**

| Field | Type | Description |
|-------|------|-------------|
| user_off_topic_streak_threshold | integer | Consecutive off-topic rounds before state escalation |
| user_on_topic_streak_threshold | integer | Consecutive on-topic rounds to recover state |

**Response** `200` — updated config.

---
