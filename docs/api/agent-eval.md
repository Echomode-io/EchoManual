## Agent Eval

Evaluate and compare agent draft versions using the PEEM rubric. All endpoints score draft versions only — published agents are immutable and not evaluated here.

All endpoints are prefixed with `/agent-eval`.

---

### POST /agent-eval/evaluate

Score a draft version on prompt axes and (optionally) response axes for supplied test cases.

When `rubric` is omitted, the mode is auto-selected: `plain` for root versions (no parent), `anchored` for versions with a parent.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| draft_id | uuid | **required** | The draft that owns the version |
| version_id | uuid | **required** | The version snapshot to evaluate |
| rubric | string | auto | `plain` or `anchored` |
| evaluator_model | string | — | Judge model (defaults to system setting) |
| cases | object[] | `[]` | Test inputs (max 20); empty means prompt axes only |

Each case object:

| Field | Type | Description |
|-------|------|-------------|
| input | string | User message to run the prompt against (min 1 char) |
| expected | string or null | Reference answer — unlocks the accuracy axis when present. Optional; omit or set to `null` for prompt-only scoring. |

**Response** `200`

```json
{
  "agent_id": "uuid",
  "generation_model": "<model-id>",
  "evaluator_model": "<model-id>",
  "rubric": "anchored",
  "prompt_scores": [
    {
      "axis": "clarity_structure",
      "label": "Clarity & Structure",
      "score": 4.0,
      "rationale": "...",
      "weakness": "...",
      "severity": "cosmetic"
    }
  ],
  "prompt_average": 3.8,
  "cases": [
    {
      "input": "How do I reset my password?",
      "generated_response": "...",
      "has_reference": true,
      "response_scores": [ { "...AxisScore" } ],
      "response_average": 4.2
    }
  ],
  "response_average": 4.2,
  "overall_average": 4.0
}
```

### POST /agent-eval/evaluate-prompt

Score only the prompt axes of a draft version — no response generation.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| draft_id | uuid | **required** | Draft ID |
| version_id | uuid | **required** | Version ID |
| rubric | string | auto | `plain` or `anchored` |
| evaluator_model | string | — | Judge model |

**Response** `200` — same `EvaluationResult` shape (with empty `cases`).

### POST /agent-eval/evaluate-prompt-adhoc

Score prompt axes from raw input — no saved draft or version required. Used to preview eval scores on unsaved editor changes.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| agent_name | string | `""` | Agent name for context |
| agent_prompt | string | **required** | The system prompt to evaluate |
| tags | string[] | — | Agent tags for context |
| rubric | string | auto | `plain` or `anchored` |
| evaluator_model | string | — | Judge model |

**Response** `200` — same `EvaluationResult` shape (with empty `cases`).

### POST /agent-eval/evaluate-case

Evaluate a single Q&A case against a draft version. Generates a response and scores response axes.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| draft_id | uuid | **required** | Draft ID |
| version_id | uuid | **required** | Version ID |
| case | object | **required** | Test case (`input` + optional `expected`) |
| rubric | string | auto | `plain` or `anchored` |
| evaluator_model | string | — | Judge model |

**Response** `200`

```json
{
  "input": "How do I reset my password?",
  "generated_response": "...",
  "has_reference": true,
  "response_scores": [ { "...AxisScore" } ],
  "response_average": 4.2
}
```

### POST /agent-eval/compare

Pairwise comparison of one draft version against a baseline, axis by axis. More discriminating than absolute scoring.

The baseline defaults to the version's parent. If the version has no parent and no baseline is given, use `/agent-eval/evaluate` instead.

**Request body**

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| draft_id | uuid | **required** | Draft ID |
| version_id | uuid | **required** | Version to compare |
| baseline_version_id | uuid | parent | Version to compare against (defaults to parent) |
| evaluator_model | string | — | Judge model |
| cases | object[] | `[]` | Test inputs for response comparison (max 20) |

**Response** `200`

```json
{
  "version_id": "uuid",
  "baseline_version_id": "uuid",
  "evaluator_model": "<model-id>",
  "version_generation_model": "<model-id>",
  "baseline_generation_model": "<model-id>",
  "version_prompt_scores": [ { "...AxisScore" } ],
  "baseline_prompt_scores": [ { "...AxisScore" } ],
  "version_prompt_average": 4.0,
  "baseline_prompt_average": 3.5,
  "cases": [
    {
      "input": "How do I reset my password?",
      "version_response": "...",
      "baseline_response": "...",
      "comparisons": [
        {
          "axis": "relevance",
          "label": "Relevance",
          "winner": "version",
          "rationale": "..."
        }
      ]
    }
  ],
  "summary": {
    "version_wins": 3,
    "baseline_wins": 1,
    "ties": 1
  }
}
```

| Error | Cause |
|-------|-------|
| 403 | Only the draft owner can run evals |
| 404 | Draft or version not found |
| 422 | No baseline available (root version with no baseline_version_id) |

---

### Enums

#### Rubric mode

| Value | Description |
|-------|-------------|
| `plain` | Paper-faithful: criterion definitions only |
| `anchored` | Per-score anchors, forced weakness identification, reserved top |

#### Winner

| Value | Description |
|-------|-------------|
| `version` | Version scored better on this axis |
| `baseline` | Baseline scored better |
| `tie` | No meaningful difference |

#### Weakness severity

Returned in `AxisScore` when using the `anchored` rubric.

| Value | Description |
|-------|-------------|
| `none` | No weakness identified |
| `cosmetic` | Minor stylistic issue |
| `structural` | Organizational or flow problem |
| `fundamental` | Core prompt design issue |

---
