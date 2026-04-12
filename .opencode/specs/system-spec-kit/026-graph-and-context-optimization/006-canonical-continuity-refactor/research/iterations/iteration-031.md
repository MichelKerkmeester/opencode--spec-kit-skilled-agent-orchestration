---
title: "Iteration 031 — Tier 3 LLM classifier contract"
iteration: 31
band: F
timestamp: 2026-04-11T15:03:05+02:00
worker: cli-codex gpt-5.4 xhigh fast
scope: q1_tier3_llm_contract
status: complete
focus: "Define exact LLM classifier contract (prompt, token budget, response schema, refusal behavior, cost/latency, fallback, caching) as the third tier of the 3-tier contentRouter."
maps_to_questions: [Q1]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-031.md"]

---

# Iteration 031 — Tier 3 LLM Classifier Contract

## 1. Goal
Tier 3 is the rare-path semantic classifier for chunks that Tier 1 rules and Tier 2 prototype similarity cannot place safely. Tier 1 still handles the obvious 80 percent, Tier 2 still handles the next 15 percent, and Tier 3 is only entered when no Tier 2 prototype clears `0.70` confidence. It exists to prevent silent misroutes, over-refusals, and brittle rule explosion.

Typical Tier 3 chunks:
- mixed progress vs delivery prose
- decision vs research-finding prose
- handover vs task-update blends
- metadata-only vs drop-candidate wrapper fragments
- L2 vs L3 decision-target ambiguity
- legacy memory fragments with real signal but weak prototype match

Tier 3 runs inside `contentRouter` after chunking, normalization, Tier 1, and Tier 2, and before any merge/write. It classifies only. It never rewrites text, invents anchors, or bypasses validation.

## 2. Input contract
Tier 3 receives one chunk plus bounded routing evidence.

```ts
type Category = "narrative_progress" | "narrative_delivery" | "decision" | "task_update" | "handover_state" | "research_finding" | "metadata_only" | "drop_candidate";
type Tier1Result = { matched: boolean; category: Category | null; confidence: number; rule_id: string | null; hard_negative_flags: string[]; };
type Tier2Hit = { rank: 1 | 2 | 3; category: Category; prototype_id: string; similarity: number; target_doc: string; target_anchor: string; merge_intent: string; cue_summary: string; };
type SessionHints = { spec_folder: string; packet_level: "L1" | "L2" | "L3" | "L3+"; packet_kind: "feature" | "phase" | "remediation" | "research" | "unknown"; save_mode: "auto" | "interactive" | "dry-run" | "route-as"; recent_docs_touched: string[]; recent_anchors_touched: string[]; likely_phase_anchor: string | null; };
type Tier3ClassifierInput = { chunk_id: string; chunk_hash: string; chunk_text: string; chunk_text_normalized: string; chunk_char_count: number; source_field: "observations" | "decisions" | "preflight" | "postflight" | "exchanges" | "toolCalls" | "unknown"; tier1: Tier1Result | null; tier2_topk: Tier2Hit[]; tier2_trigger_reason: "top1_below_0_70" | "margin_too_narrow" | "mixed_signals" | "manual_retry"; context: SessionHints; };
```

Hard constraints:
- `chunk_text` is already normalized and trimmed.
- Tier 3 never receives full packet docs or full transcripts.
- `tier2_topk` always includes top 3 when available, even if weak.
- `recent_anchors_touched` is hinting only, never authority.
- `likely_phase_anchor` exists so `task_update` does not require anchor invention.

## 3. Prompt template
### Invocation envelope
- `model: gpt-5.4`
- `reasoning_effort: low`
- `temperature: 0`
- `max_output_tokens: 200`
- `timeout_ms: 2000`
- response format: strict JSON schema

### System prompt
```text
You are Tier 3 of the contentRouter for canonical continuity saves.

Classify ONE chunk into exactly ONE of these 8 categories:
- narrative_progress: what was built or changed; usually implementation-summary.md::what-built
- narrative_delivery: how work was delivered, rolled out, sequenced, verified, or gated; usually implementation-summary.md::how-delivered
- decision: choice, tradeoff, rationale, rejected alternative, or governing rule; L3/L3+ prefers decision-record.md, L2 prefers implementation-summary.md::decisions
- task_update: task/checklist/phase status mutation; usually tasks.md::<phase-anchor>
- handover_state: recent action, blocker, next safe action, stop-state, or resume instruction; usually handover.md
- research_finding: evidence, investigation result, cited upstream behavior, or research conclusion; usually research/research.md
- metadata_only: machine-owned continuity/indexing payload such as preflight, postflight, causal links, fingerprints, or compact continuity fields; usually _memory.continuity
- drop_candidate: transcript turns, generic recovery hints, tool telemetry, wrapper scaffolding, or other non-canonical content that should not merge into spec docs

Confidence scale: 0.90-1.00 safe auto-route; 0.70-0.89 strong route; 0.50-0.69 weak route with warning; below 0.50 refuse.
Refusal is first-class, not a ninth category. If no category reaches 0.50 confidence: choose the closest category, set merge_mode="refuse-to-route", target_doc="scratch/pending-route-{CHUNK_HASH}.json", and target_anchor="manual-review".
Output rules: return ONE JSON object only; no markdown fences; no chain-of-thought; no extra prose; reasoning <= 200 chars; alternatives up to 2, sorted by confidence; category must be one of the 8 categories; confidence must be 0.0..1.0; merge_mode must be one of "append-as-paragraph", "append-section", "insert-new-adr", "update-in-place", "refuse-to-route".
Merge-mode guidance: progress/delivery -> append-as-paragraph; handover/research -> append-section; L3/L3+ decision -> insert-new-adr; task_update, metadata_only, and L2 decision -> update-in-place; drop_candidate -> refuse-to-route.
Never invent a new category, doc, anchor, or merge mode. If still uncertain below 0.50 after using the provided evidence, refuse.
```

### User prompt template
```text
Classify this save chunk.
PROMPT_VERSION: tier3-router-v1
CHUNK_ID: {CHUNK_ID}
CHUNK_HASH: {CHUNK_HASH}
PACKET_LEVEL: {PACKET_LEVEL}
PACKET_KIND: {PACKET_KIND}
SAVE_MODE: {SAVE_MODE}
SOURCE_FIELD: {SOURCE_FIELD}
RECENT_DOCS_TOUCHED: {RECENT_DOCS_TOUCHED}
RECENT_ANCHORS_TOUCHED: {RECENT_ANCHORS_TOUCHED}
LIKELY_PHASE_ANCHOR: {LIKELY_PHASE_ANCHOR}
TIER1_RESULT:
{TIER1_RESULT_JSON}
TIER2_TOP3:
{TIER2_TOP3_JSON}
TIER3_TRIGGER_REASON:
{TIER3_TRIGGER_REASON}
CHUNK_TEXT:
{CHUNK_TEXT}
Return JSON only.
```

## 4. Response schema
Exact JSON shape:

```json
{
  "category": "narrative_progress",
  "confidence": 0.83,
  "target_doc": "implementation-summary.md",
  "target_anchor": "what-built",
  "merge_mode": "append-as-paragraph",
  "reasoning": "Concrete code-change narrative; rollout language is secondary.",
  "alternatives": [
    { "category": "narrative_delivery", "confidence": 0.41 },
    { "category": "decision", "confidence": 0.18 }
  ]
}
```

Field rules:
- `category`: one of the 8 categories only
- `confidence`: float in `[0.0, 1.0]`
- `target_doc`: canonical target file, or `scratch/pending-route-{CHUNK_HASH}.json` on refusal
- `target_anchor`: canonical anchor, or `manual-review` on refusal
- `merge_mode`: one of `append-as-paragraph`, `append-section`, `insert-new-adr`, `update-in-place`, `refuse-to-route`
- `reasoning`: short operator-facing summary, max 200 chars
- `alternatives`: `0..2` entries, same category enum, never repeating the winner

Coarse-to-concrete mapping:
- `append-as-paragraph` -> prose append for `what-built` / `how-delivered`
- `append-section` -> section/session append for `handover.md` / `research/research.md`
- `insert-new-adr` -> L3/L3+ decision insertion
- `update-in-place` -> task mutation, L2 decision table row, or `_memory.continuity` field update
- `refuse-to-route` -> no canonical write

Parse failure behavior:
1. trim whitespace
2. strip one outer code fence if present
3. strict JSON parse
4. strict schema validation
5. on failure, retry once with a tight "return valid JSON only" repair prompt
6. if retry still fails, refuse and persist pending
7. if category is not one of the 8, refuse
8. if merge_mode is not one of the 5, refuse

## 5. Token budget
Per-call budget:
- system prompt: ~700 tokens
- user wrapper: ~180 tokens
- chunk text: 350-450 tokens
- Tier 2 top-3 + hints: 120-180 tokens
- response: target 80-120 tokens, hard cap 200

Back-of-envelope:
- typical input: `~1,430` tokens
- typical output: `~120` tokens
- typical total: `~1,550`
- hard ceiling: `<= 1,650`

Guardrails:
- cap `chunk_text` before prompting; Tier 3 is not a long-context summarizer
- cap `alternatives` at 2
- cap `reasoning` at 200 chars
- reject oversized raw outputs instead of heuristically salvaging them

## 6. Refusal & fallback paths
Low-confidence refusal:
- if `confidence < 0.50`, refuse
- emit `merge_mode = "refuse-to-route"`, `target_doc = "scratch/pending-route-{CHUNK_HASH}.json"`, `target_anchor = "manual-review"`
- persist raw chunk, normalized chunk, Tier 1, Tier 2, and model metadata

`drop_candidate`:
- `>= 0.70` -> safe non-write, audit only
- `0.50-0.69` -> pending review, not silent discard
- `< 0.50` -> standard refusal path

LLM unavailable:
- trigger on timeout, network error, 5xx, model unavailable, or quota exhaustion
- fallback to Tier 2 top-1 with a `0.15` confidence penalty
- `fallback_confidence = max(0, tier2_top1.similarity - 0.15)`
- if `fallback_confidence >= 0.50`, continue with warning
- else refuse

Malformed JSON:
- one repair retry only
- if second parse still fails, refuse

Invalid enum:
- any category outside the 8 or merge mode outside the 5 is an immediate refuse

## 7. Cost & latency estimate
Pricing basis for `gpt-5.4` on 2026-04-11:
- input: `$2.50 / 1M`
- cached input: `$0.25 / 1M`
- output: `$15.00 / 1M`

Using the budget above:
- uncached input: `1,430 * 2.50 / 1,000,000 = $0.003575`
- output: `120 * 15.00 / 1,000,000 = $0.001800`
- uncached total: `~$0.005375` = `~0.54 cents/call`
- cached-pattern total: `~$0.003800` = `~0.38 cents/call`

Latency target for fast structured classification:
- p50: `500-800ms`
- p95: `<= 1.8s`
- hard timeout: `2.0s`

Expected call volume:
- formula: `0.05 * average_chunks_per_save * daily_save_volume`
- planning assumption: `6` chunks/save and `30` saves/day
- expected Tier 3 calls/day: `0.05 * 6 * 30 = 9`

Daily cost:
- uncached upper estimate: `9 * $0.005375 = $0.048375`
- cached-pattern estimate: `9 * $0.003800 = $0.034200`
- practical range: `3.4 to 4.8 cents/day`
- recommended alert ceiling: `25` Tier 3 calls/day or `>$0.15/day`

## 8. Cold-start & caching
Cold-start:
- first-ever save in session does no warmup
- Tier 3 pays full prompt cost on first use
- do not pre-classify chunks speculatively

Cache key:
```text
sha256(chunk_text_normalized)
```

Cached value should include `prompt_version`, `model`, `packet_level`, `category`, `confidence`, `target_doc`, `target_anchor`, `merge_mode`, and `created_at`.

TTL policy:
- primary cache: session-scoped, expires at session end
- optional fallback cache: spec-folder scoped, expires after `24h`
- bounded size: for example `256` session entries or `128` spec-folder entries

Cache rules:
- cache successful routes with `confidence >= 0.70`
- cache high-confidence `drop_candidate`
- do not cache provider outages
- do not cache malformed JSON failures
- do not cache low-confidence refusals caused by transient ambiguity

Cache-hit target:
- lookup and validation `<5ms`

## 9. Observability
Required spans:
- `router.tier3.classify`
- `router.tier3.refuse`
- `router.tier3.fallback`

Required tags:
- `spec_folder`, `packet_level`, `packet_kind`, `chunk_hash`, `chunk_chars`, `source_field`
- `tier1_category`, `tier1_confidence`, `tier2_top1_category`, `tier2_top1_similarity`, `tier2_top2_category`, `tier2_margin`
- `llm_model`, `prompt_version`, `cache_hit`, `retry_count`, `latency_ms`, `input_tokens`, `output_tokens`
- `final_category`, `final_confidence`, `target_doc`, `target_anchor`, `merge_mode`

Alert thresholds:
- malformed JSON rate `> 1%` over 15 minutes
- provider fallback rate `> 10%` over 30 minutes
- p95 latency `> 1.8s` over 30 minutes
- refusal rate `> 25%` after first 100 Tier 3 calls
- daily volume `> 25` calls or spend `> $0.15`

## 10. Open questions (if any) + Ruled Out
Open questions:
1. Should `drop_candidate` keep that external enum forever, or should phase 019 add a compatibility alias back to historical `drop`?
2. Should low-confidence `drop_candidate` always persist pending, or should interactive mode permit explicit discard in the warning band?
3. Should `_memory.continuity` always live on one canonical host doc per packet, or can the most recently touched canonical doc host it safely?
4. Should mixed chunks ever be split before Tier 3, or is that always the chunker’s job?

Ruled out:
- no ninth refusal category
- no freeform reasoning output
- no model-invented anchors
- no full-transcript prompt
- no more than one repair retry
- no caching of outage-induced failures
- no use of Tier 3 as a rewrite/cleanup layer
- no silent confidence inflation on Tier 2 fallback
