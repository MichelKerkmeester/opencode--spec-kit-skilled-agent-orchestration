---
title: "Deep Research Strategy: Save-Flow Backend Relevance Review"
description: "Per-iteration steering record for 20-iteration research on whether generate-context.js + save-flow backend is still proportionate post-memory-folder retirement"
---

# Deep Research Strategy — Save-Flow Backend Relevance Review

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Determine whether the `generate-context.js` orchestrator and its save-flow backend (mcp_server handlers, content-router, routing-prototypes, reconsolidation-bridge, pe-gating, chunking-orchestrator, quality gates, entity extraction, cross-doc linking, graph-metadata refresh, _memory.continuity sync) still earn their cost after `[spec]/memory/*.md` retirement (v3.4.1.0 + 013 r2). The hypothesis to test is that an operator-visible command could replace automated machinery.

### Runtime

- **Agent**: cli-codex (gpt-5.4, `model_reasoning_effort=high`, `service_tier=fast`)
- **Fallback**: cli-copilot
- **Mode**: auto, 20 iterations, convergence threshold 0.05, stuck threshold 3

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Save-flow backend relevance and proportionality post-[spec]/memory/*.md retirement. Categorise each subsystem (load-bearing / partial-value / over-engineered / dead), design a minimal replacement where applicable, and produce a keep/trim/replace/redesign recommendation per subsystem with concrete risk analysis.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (resolved)
- [x] Q1 Load-bearingness per subsystem: only canonical routing, atomic promotion/rollback, routed record identity, and continuity validation are strictly load-bearing.
- [x] Q2 Command substitution feasibility: the existing dry-run/preflight surface already exposes enough structure to support a planner-first `/memory:save` that lets the AI apply canonical-doc edits itself.
- [x] Q3 Quality gate value: hard structural/spec-doc legality checks matter; multi-layer scoring, trigger quotas, and auto-fix loops are heavier than the remaining contract needs.
- [x] Q4 Semantic indexing dependency: immediate indexing is valuable for freshness but separable from canonical-doc mutation.
- [x] Q5 Graph-metadata refresh necessity: useful derived output, but derivable from canonical docs and therefore decouplable from every save.
- [x] Q6 Entity extraction + cross-doc linking value: retrieval-adjacent and non-blocking, so better deferred to indexing/backfill than kept in the hot save path.
- [x] Q7 Reconsolidation-bridge scope: checkpoint-gated, warning-tolerant, and not required for canonical correctness; it is disproportionate in the post-retirement flow.
- [x] Q8 Routing-prototypes classifier scope: the 8-category model is still useful, but the Tier 2 library size plus optional Tier 3 path is over-fitted for the current operator contract.
- [x] Q9 Trigger-phrase harmonization value: useful as normalization, but save-time auto-fix enforcement is not required if indexing can harmonize lazily.
- [x] Q10 Continuity sync behaviour: `_memory.continuity` remains important, but direct AI edits are already an approved path for continuity-only updates.

---

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Redesigning the retrieval path (memory_search/memory_context/memory_quick_search stay out of scope)
- Auditing VectorIndex transaction semantics (BUG-001/BUG-002 already covered)
- Touching stop-hook autosave lifecycle
- Redesigning the code-graph MCP server
- Implementing any of the recommendations in this packet (this is research, not implementation)

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All Q1–Q10 answered with cited source evidence per subsystem
- Categorised verdict per subsystem present in findings-registry.json
- Proposed minimal replacement design recorded for over-engineered / dead subsystems (or explicitly marked "no replacement warranted")
- Keep/trim/replace/redesign recommendation present with risk analysis
- newInfoRatio below convergenceThreshold for `stuckThreshold` consecutive iterations
- OR maxIterations (20) reached

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:what-worked -->
## 6. WHAT WORKED (machine-owned)

- Iterations 001-002: tracing `generate-context.js` plus `workflow.ts` quickly separated wrapper/orchestrator duties from the canonical write engine.
- Iterations 003-004: reading `buildCanonicalAtomicPreparedSave`, `validateCanonicalPreparedSave`, `create-record.ts`, and `atomic-index-memory.ts` isolated the genuinely load-bearing core.
- Iterations 005-006: splitting the quality loop from the save-quality gate made it clear which checks are hard correctness guards versus metadata-quality ceremony.
- Iteration 007: following Step 11.5 proved semantic indexing now rides on canonical spec-doc reindexing, not the retired memory artifact path.
- Iteration 008: graph-metadata refresh was easy to classify once the derivation logic and refresh tests were read together.
- Iterations 009-010: PE gating and reconsolidation became tractable once scope filters, thresholds, and early-return conditions were compared directly.
- Iterations 011-012: reviewing router constants, tier thresholds, and the prototype-library size exposed the difference between useful category routing and overgrown classifier support.
- Iterations 013-015: combining continuity docs with the thin-continuity validator and post-insert pipeline showed which metadata flows are essential and which are deferred-value.
- Iterations 016-018: chunking, dry-run output, and atomic-save hook behavior supplied enough evidence to design a smaller operator-visible replacement flow.
- Iterations 019-020: the final sweep confirmed no hidden reintroduction of `[spec]/memory/*.md` writes in the inspected path and supported a trim-targeted recommendation rather than a full redesign.

---

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 7. WHAT FAILED (machine-owned)

- Memory MCP trigger/context lookups returned cancelled calls in this run, so prior-state surfacing had to fall back to direct packet files and manual evidence gathering.
- CocoIndex MCP and CLI both failed in this environment, so semantic exploration was replaced by `rg`, `nl -ba`, and direct file reads.
- Vitest was not a productive path for this packet: one targeted run found no files under the attempted root and another hung without yielding usable output.

---

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 8. EXHAUSTED APPROACHES (machine-owned)

- "The script workflow still owns canonical mutation" was exhausted after tracing `workflow.ts` and confirming it now skips legacy writes and delegates canonical correctness to the handler path.
- "Reconsolidation is required for canonical save correctness" was exhausted after confirming missing checkpoints only emit warnings and continue the create path.
- "Post-insert enrichment is save-blocking" was exhausted after confirming every enrichment step is flag-guarded and wrapped in non-fatal try/catch blocks.
- "Continuity updates must always flow through `generate-context.js`" was exhausted after comparing the thin-continuity library with the documented direct-edit allowance in governance/docs.

---

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 9. RULED OUT DIRECTIONS (machine-owned)

- Full-redesign framing was ruled out: the canonical write core already has atomic promotion, rollback, and identity handling that should be preserved.
- "Dead subsystem" classification for `generate-context.js` was ruled out: the CLI wrapper still owns explicit target validation and structured-input normalization.
- "Graph refresh must stay synchronous with every save" was ruled out because it is deterministically derived from canonical docs and has a standalone refresh surface.
- "Entity extraction/linking findings should be elevated above P2/P1-equivalent research confidence" was ruled out because the save path treats them as optional enrichment, not correctness gates.
- "Tier 3 routing is the only thing preventing misroutes" was ruled out because Tier 1 and Tier 2 already cover the stable category contract and Tier 2 fail-open exists.
- "PE gating and reconsolidation can be dropped without any replacement for record identity" was ruled out because same-path append-only lineage and canonical path identity still protect update semantics.

---

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 10. NEXT FOCUS (machine-owned)

Synthesis complete. The next safe follow-on is an implementation packet that preserves the canonical atomic writer and continuity validator, trims Tier 3/reconsolidation/save-time enrichment from the default path, and prototypes a planner-first `/memory:save` surface.

---

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:cross-refs -->
## 11. CROSS-REFERENCES

- `spec.md` — research seed with scope and initial questions
- `research/iterations/` — per-iteration evidence artifacts
- `research/findings-registry.json` — reducer-owned open/resolved questions, key findings, ruled-out directions
- `research/deep-research-state.jsonl` — append-only structured log for lineage
- Parent packet: `013-memory-folder-deprecation-audit/` (r2 audit context, F026-F040 closures)
- Related release: `.opencode/changelog/01--system-spec-kit/v3.4.1.0.md`
<!-- /ANCHOR:cross-refs -->
