# How Echo keeps you on-topic

The [Alignment Score](/manual/understanding-drift/what-drift-is) on a single reply can jump
around, so the Echo engine **smooths it over recent turns**. That way one off-topic aside won't
trigger an overreaction — it takes a sustained drift to move the needle.

The smoothed score drives **five states**. As the conversation drifts further from the agent's
subject, the assistant steers back more firmly.

| State | Score band | What the assistant does |
|---|---|---|
| <span class="dot" style="background:#10AA77"></span> **Stable** | ≥ 65 | Answers normally, in character |
| <span class="dot" style="background:#EBAA00"></span> **Mild drift** | 55–64 | Gently steers you back toward the topic |
| <span class="dot" style="background:#FF8000"></span> **Moderate drift** | 45–54 | Acknowledges, re-explains its subject, and invites you back |
| <span class="dot" style="background:#47397D"></span> **Severe drift** | &lt; 45 | Reasserts the agent's role |
| <span class="dot" style="background:#E0401E"></span> **Assistant refusal** | (detected) | Resets to stay helpful and on-task |

::: info
The transitions are gradual. A conversation usually moves one step at a time — Stable to Mild
drift, not Stable straight to Severe — and climbs back the same way as you return to the topic.
:::

::: tip
Staying within your agent's subject keeps you in **Stable**, where the assistant answers most
freely. If you need to cover a different domain, start a new chat with the agent that fits — or
save your own [agent](/manual/agents/agent-settings) tuned for it.
:::
