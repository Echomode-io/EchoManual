# Choosing an agent

An **agent** is the domain expert behind your chat. It shapes the assistant's voice and the
subject it stays focused on. EchoMode includes ten built-in agents:

<div class="card-grid">
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Engineer</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Product</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Marketing</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Sales</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Legal</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Finance</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Healthcare</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Operations</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Executive</div></a>
  <a href="/manual/chatting/start-a-chat"><div class="card-title">Writer</div></a>
</div>

## Pick one in the setup wizard

When you start a new chat, the first step of the setup wizard shows the agents in a grid.
Select the one you want, then continue to start chatting.

![The agent selection grid](/images/manual/chatting/agent-grid.png)

<p class="manual-caption">Step 1 of the new-chat wizard: choose an agent from the grid.</p>

## One agent per chat

Each chat uses a single agent. You can switch it **until the chat starts** — once you send
your first message, the agent locks for that conversation. EchoMode shows this as a tooltip:
*"Each chat uses one agent. You can switch it until the chat starts."*

::: info
Want a different agent? Start a new chat. To talk to an agent you've customized yourself,
see [Agents](/manual/agents/agent-library).
:::

Behind the scenes, your agent also defines the **anchor words** — the vocabulary of its
subject — that the Echo engine uses to measure drift. That's why staying within an agent's
domain keeps your conversation [on-topic](/manual/understanding-drift/how-echo-keeps-you-on-topic).
