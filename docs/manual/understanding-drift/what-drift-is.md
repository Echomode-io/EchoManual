# What drift is

**Drift** is when a conversation drifts away from what your agent is about. Ask the Engineer
agent about software and you're on-topic; steer it toward weekend dinner plans and the
conversation has drifted.

EchoMode watches for this automatically. After every reply, the **Echo engine** compares both
your message and the assistant's response against the agent's **anchor words** — the
vocabulary that defines its subject. The closer the conversation is to that subject, the higher
your **Alignment Score**, a number from **0 to 100**.

## Why it matters

Drift detection keeps the assistant useful and predictable:

- A **customer-facing** agent stays on script instead of wandering.
- A **research** agent can follow related tangents without losing the thread.
- You always get a sense of whether the conversation is staying where you want it.

::: tip
You don't have to do anything to turn this on — the Echo engine runs on every chat. The next
pages explain [how it keeps you on-topic](/manual/understanding-drift/how-echo-keeps-you-on-topic)
and [what you'll see](/manual/understanding-drift/reading-the-signals).
:::
