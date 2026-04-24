---
title: "Iteration 002 — Content-to-anchor routing rules and classifier contract"
iteration: 2
band: A
timestamp: 2026-04-11T13:40:00Z
worker: claude-opus-4-6
scope: q1_routing_rules
status: complete
focus: "Design the contentRouter component. Enumerate content categories. Define the classifier contract, the refuse-to-route signal, and the user-override path."
maps_to_questions: [Q1]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/002-continuity-memory-runtime/003-continuity-refactor-gates"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-002.md"]

---

# Iteration 002 — Q1: Content Routing Rules

## Goal

Design the `contentRouter` new component from iteration 1. Given an arbitrary session content chunk, classify it into one of N categories and emit a routing decision. The classifier must be deterministic enough to trust but override-able when wrong.

## The 8 content categories (established here)

Starting from the redundancy matrix in phase 017 iteration 4 + the seed's F4 overlap table:

| # | Category | Routing target | Merge mode | Example input |
|---:|---|---|---|---|
| 1 | `narrative_progress` | `implementation-summary.md::what-built` | append-as-paragraph | "Refactored the auth middleware to support JWT rotation; all tests pass" |
| 2 | `narrative_delivery` | `implementation-summary.md::how-delivered` | append-as-paragraph | "Delivered via feature flag; 24-hour shadow comparison before rollout" |
| 3 | `decision` | `decision-record.md::adr-NNN` (L3+) OR `implementation-summary.md::decisions` (L2) | insert-new-adr OR append-table-row | "Chose JWT with asymmetric signing over HMAC for key rotation reasons" |
| 4 | `handover_state` | `handover.md` | append-new-session | "Session paused at the validator implementation; next: verify audit log" |
| 5 | `research_finding` | `research/research.md` | append-section | "Found that the upstream lib has a race condition on concurrent reads" |
| 6 | `task_update` | `tasks.md::phase-N` | update-in-place | "T023 completed with evidence; T024 started" |
| 7 | `metadata_only` | thin continuity record | set-field | trigger_phrases, causal_links, fsrs_state, fingerprint |
| 8 | `drop` | (nothing) | refuse-to-route | conversation transcript, generic recovery hints, placeholder text |

Categories 1-2 split the old IMPLEMENTATION GUIDE into two narrower anchors — this is per F4's 90% overlap with `implementation-summary.md::what-built` specifically.

## Classifier contract

The classifier is a pure function:

```
classifyContent(
  chunk: ContentChunk,
  context: { specFolder, packetLevel, existingAnchors, sessionMeta }
) → RoutingDecision
```

Where `RoutingDecision` is:

```
{
  category: one of the 8,
  target: { docPath, anchorId, mergeMode },
  confidence: 0.0..1.0,
  fallback: RoutingDecision | null,
  explanation: string,
  overrideable: boolean  // false only for 'drop' category
}
```

### Three-tier classification strategy

**Tier 1 — Rule-based (primary, ~80% of content)**

Fast, deterministic, no API calls. Rules:

- If chunk has `type: "decision"` in structured input → `decision`
- If chunk has `type: "handover"` → `handover_state`
- If chunk contains `## Research` or `research:` key → `research_finding`
- If chunk contains checkbox updates (`[x]`, `[ ]`) → `task_update`
- If chunk is a trigger phrase array or metadata-only → `metadata_only`
- If chunk is wrapped in `<!-- CONVERSATION_LOG -->` tags → `drop` (conversation)
- If chunk matches template boilerplate patterns → `drop` (recovery hints)
- Default fallthrough → `narrative_progress`

Tier 1 handles the structured inputs that `generate-context.ts` already accepts (see `generate-context.ts:51-120` CLI help text) plus a few pattern-match heuristics.

**Tier 2 — Embedding-similarity (secondary, ~15% of content)**

When Tier 1 yields low confidence (<0.7), compute the embedding of the chunk and compare against prototype vectors for each category. Prototypes are 5-10 sample chunks per category captured during phase 018 design work and stored in `config/routing-prototypes.json`. Nearest-prototype classification with cosine similarity.

Cost: one embedding per ambiguous chunk. Reuses the existing `generateOrCacheEmbedding` from `save/embedding-pipeline.ts`.

**Tier 3 — LLM prompt (escalation, ~5% of content)**

When Tier 2 still yields low confidence (<0.6), escalate to a short LLM prompt: "Classify this chunk into one of: narrative_progress, narrative_delivery, decision, handover_state, research_finding, task_update, metadata_only, drop. Return JSON."

Cost: one LLM call per escalation. Rare by design.

### Refuse-to-route signal

When Tier 3 also yields <0.5 confidence, the classifier returns `category: "refuse-to-route"` with `overrideable: true`. The save pipeline then surfaces the chunk to the user (via a warning message or a pending-review file in `scratch/`), rather than force-routing to a wrong target.

### User override

The `RoutingDecision.overrideable: true` field lets callers override the classifier's choice. `/memory:save` can accept a `--route-as <category>` flag, and interactive sessions can prompt "Content classified as X with confidence Y; route anyway?".

## Handling structured vs unstructured inputs

`generate-context.ts` already accepts structured JSON inputs with fields like `user_prompts`, `observations`, `toolCalls`, `exchanges`, `preflight`, `postflight`. The router maps these structured fields directly:

| Structured field | Category |
|---|---|
| `user_prompts[]` + `exchanges[]` | `drop` (conversation — not stored) OR `narrative_progress` if the exchange contains implementation details |
| `observations[]` | `narrative_progress` or `narrative_delivery` (by content pattern) |
| `toolCalls[]` | `drop` (telemetry, not canonical narrative) |
| `preflight` | `metadata_only` (stored in continuity record as preflight baseline) |
| `postflight` | `metadata_only` (stored as postflight learning delta) |
| `decisions[]` (if present) | `decision` |

Unstructured input (raw markdown or free-form text) falls through to Tier 1 pattern matching → Tier 2 embedding → Tier 3 LLM.

## Confidence tiers and behaviors

| Confidence | Action |
|---|---|
| 0.9–1.0 | Auto-route silently (no user prompt) |
| 0.7–0.89 | Auto-route but log routing decision to `scratch/routing-log.jsonl` for review |
| 0.5–0.69 | Route but emit a warning in the save response |
| <0.5 | Refuse to route; surface to user for manual decision |

## Findings

- **F2.1**: 8 content categories are sufficient to cover all memory content types observed in phase 017's redundancy matrix (F4). No category is missing.
- **F2.2**: Tier 1 rule-based classification can handle ~80% of routing cases based on structured input shape alone. This means the classifier's common-case is fast and deterministic — good for developer ergonomics.
- **F2.3**: Tier 2 embedding similarity reuses the existing embedding pipeline (`save/embedding-pipeline.ts`). No new infrastructure needed.
- **F2.4**: Refuse-to-route is critical. Force-routing low-confidence chunks would corrupt spec docs. Better to surface to user.
- **F2.5**: The routing decision shape (category, target, confidence, fallback, explanation, overrideable) gives callers everything they need for UX transparency. `/memory:save` can echo "Routed 3 chunks: 2 to implementation-summary.md, 1 to decision-record.md ADR-005" in the response.

## Open questions for later iterations

- Exact prototype set for Tier 2 (defer to phase 018 implementation phase 019)
- LLM prompt text for Tier 3 (defer to phase 018 implementation)
- How to handle chunks that span multiple categories (e.g., a paragraph that contains both a decision AND a task update) — iteration 3 addresses this with merge semantics

## What worked

- Starting from phase 017 iteration 4 redundancy matrix gave the categories and anchor targets without re-analysis.
- The three-tier classification strategy (rule → embedding → LLM) bounds cost while preserving accuracy. Most chunks hit Tier 1.

## What failed / did not work

- Did not enumerate the exact Tier 1 regex patterns — deferred to phase 018 implementation iteration 2 in the next research band if needed.

## Next focus (iteration 3)

Design `anchorMergeOperation`. Define merge modes (append, insert, update, replace, refuse). Specify atomicity, rollback, and anchor integrity preservation. Answer Q2 (anchor-scoped write semantics).
