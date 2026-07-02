# Reading the signals

EchoMode shows drift in two places: live in the chat header, and in detail on the Logs page.

## The header pills

While you chat, the header shows two pills:

- **Alignment Score** — the current on-topic reading, like *"85 Aligned"*.
- **Echo State** — the state label with a colored dot:
  <span class="dot" style="background:#10AA77"></span> Stable,
  <span class="dot" style="background:#EBAA00"></span> Mild drift,
  <span class="dot" style="background:#FF8000"></span> Moderate drift,
  <span class="dot" style="background:#47397D"></span> Severe drift, or
  <span class="dot" style="background:#E0401E"></span> Assistant refusal.

Right after you send a message, the pill briefly reads **"Computing alignment score…"** while
EchoMode scores the turn.

![Alignment score and echo state pills in the chat header](/images/manual/understanding-drift/header-pills.png)

<p class="manual-caption">The header pills: your live Alignment Score and Echo State.</p>

## The Logs page

For the full picture of a conversation, open the **Logs** page. It shows:

- An **alignment chart** — your score from 0 to 100 plotted across the conversation, one point
  per round.
- A **round table** — every turn, newest first, with its score, state, response time, and the
  time it happened.
- A **round detail drawer** — select a round to see how your message and the assistant's reply
  each scored, and any state changes that happened on that turn.

![The Logs page for a chat](/images/manual/understanding-drift/logs-page.png)

<p class="manual-caption">The Logs page: the alignment chart, the per-round table, and a round's detail drawer.</p>

At the top of a chat's log you'll also see a summary: the **agent** and **model** used, the
**total rounds**, the **average alignment score**, and how many rounds were stable, drifting, or
refusals.

::: tip
Use the Logs page to spot where a long conversation started to drift — the dip in the chart
usually points right at the turn where it happened.
:::
