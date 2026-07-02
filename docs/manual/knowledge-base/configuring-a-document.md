# Configuring a document

Each document has its own **search settings**. Most people never need to touch them — but when
you want more control, they're there. Open a document's settings from its
[quick-view panel](/manual/datarooms/viewing-a-document).

## The simple control

The main control is a single **Fast ↔ Accurate** slider. Slide toward **Fast** for quicker
answers, or toward **Accurate** for more thorough retrieval. EchoMode sets everything else for
you based on where you put it.

## Advanced settings

If you open the advanced settings, you can set each piece yourself:

::: details Chunking
How the document is split into searchable pieces — by **token count** or by **meaning**.
Defaults: about **500** tokens per chunk with **80** tokens of overlap.
:::

::: details Embedding
The provider and model used to turn text into searchable vectors.
:::

::: details Search strategy
**Best matching words**, **Semantic** (by meaning), or **Words + Semantic** (hybrid, the
default). You can also cap how many candidate passages are considered and set a minimum
relevance threshold (default **0.5**).
:::

::: details Rerank results
Re-orders the top passages so the most relevant come first. On by default; you can turn it off
or choose a more thorough reranker.
:::

::: warning
Changing the **chunking** or **embedding** settings re-processes the document so the new settings
take effect. It'll go through processing again before it's ready to search.
:::
