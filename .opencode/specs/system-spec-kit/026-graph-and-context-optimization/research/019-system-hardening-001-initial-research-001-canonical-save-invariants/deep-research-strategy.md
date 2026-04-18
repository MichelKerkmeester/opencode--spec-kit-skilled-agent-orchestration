---
title: Deep Research Strategy — Canonical-Save Pipeline Invariants (SSK-RR-2)
description: Runtime strategy file for the 019/001/001 research session. Tracks focus decisions, progress, and outcomes across iterations.
---

# Deep Research Strategy - Session Tracking

Runtime strategy for `019-system-hardening/001-initial-research/001-canonical-save-invariants` deep research session.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Persistent brain for the canonical-save-pipeline invariant research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the executor and agents at every iteration.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Canonical-save pipeline invariant research for system-spec-kit. Enumerate every state write performed by `/memory:save` across four layers (frontmatter `_memory.continuity`, `description.json`, `graph-metadata.json.derived.*`, memory vector index). Derive cross-layer invariants. Observe actual invariant holding across the 26 active 026-tree packets. Classify divergences (expected/benign/latent/real). Verify H-56-1 fix scope (`workflow.ts:1259` dead-code guard + `:1333` plan-only gate). Propose validator assertions with migration notes.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What state fields does each `/memory:save` invocation write across the four state layers (frontmatter, description.json, graph-metadata.json.derived.*, memory vector index)? Produce an exhaustive field catalogue.
- [ ] Q2: What cross-layer invariants should hold between the four state layers? (e.g., `description.json.lastUpdated == max(frontmatter _memory.continuity.last_updated_at across packet docs)`). Derive at least 5 invariants with source-code citations.
- [ ] Q3: Does the H-56-1 fix at `workflow.ts:1259` (dead-code guard) and `:1333` (plan-only gate) fully close the metadata no-op? Verify both full-auto and plan-only dispatch paths.
- [ ] Q4: Across the 26 active 026-tree packets, which observed divergences are expected, benign, latent, or real? Classify every divergence (including the known `CONTINUITY_FRESHNESS deltaMs=-8455798` on 026 root).
- [ ] Q5: What validator assertions should be added to enforce the derived invariants, and what migration path handles existing packet-local drift without breaking shipped packets?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Code changes to the save pipeline (`generate-context.js`, `workflow.ts`, `generate-description.ts`, `post-save-review.ts`). This is research only.
- Non-canonical save paths (legacy `memory/*.md` writes retired in phase 014).
- External-tree invariants (memory index SQLite schema, embeddings backends).
- Numeric retry-budget or continuity-threshold tuning (Tier 3 candidate `RR-3`).

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- Converged: composite stop rule (rolling-average newInfoRatio + MAD noise floor + question coverage >= 0.85) passes AND graph convergence signal allows STOP.
- Max iterations: iteration 15 reached.
- All questions answered: Q1-Q5 all marked `[x]`.
- Stuck: 3 consecutive iterations with `newInfoRatio < 0.05` and no new question answered.
- P0 found: if a real state-divergence defect surfaces, halt immediately and escalate via `_memory.continuity.blockers` in parent packets (019/001 and 019).

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: What state fields does each `/memory:save` invocation write across the four state layers (frontmatter, description.json, graph-metadata.json.derived.*, memory vector index)? Produce an exhaustive field catalogue.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

Phase 016/002-infrastructure-primitives shipped the H-56-1 fix on 2026-04-17. The fix addressed two specific lines in `scripts/core/workflow.ts`:
- `:1259` — removed a dead-code guard (`const ctxFileWritten = false`) that made the per-folder `description.json` update block (lines 1261-1331) unreachable.
- `:1333` — changed the `refreshGraphMetadata` gate from `plannerMode === 'full-auto'` to allow both modes.

Before H-56-1, every default `/memory:save` invocation (which uses `plan-only` mode) wrote zero metadata to `description.json.lastUpdated` and `graph-metadata.json.derived.*`. After H-56-1, metadata writes are restored.

The 026 root validator surfaces drift classified as "benign clock skew":
- `CONTINUITY_FRESHNESS deltaMs=-8455798` (continuity timestamp 2.3 hours newer than graph-metadata.json).

Phase 018 R4 added parse/schema split + merge-preserving repair helper for description.json (post-schema-invalid case), but did not address the regen-overwrite pattern where valid-but-rich description.json gets clobbered by `generate-description.js` auto-regen. Root `implementation-summary.md §Known Limitations #4` flags this.

Phase 018 R6-R7 added `graph-metadata.json.derived.save_lineage` tag to reduce reliance on timestamp subtraction for freshness claims.

Relevant files for research:
- `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts` (entry point)
- `.opencode/skill/system-spec-kit/scripts/core/workflow.ts` (H-56-1 fix)
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts` (description.json regen)
- `.opencode/skill/system-spec-kit/scripts/core/post-save-review.ts` (quality review)
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph-metadata-parser.ts` (graph-metadata.json derived.*)
- Validator rules: `CONTINUITY_FRESHNESS`, `POST_SAVE_FINGERPRINT`, `SPEC_DOC_INTEGRITY`, `GRAPH_METADATA_PRESENT`

Representative packet sample (26 active 026-tree packets): `001-research-graph-context-systems` through `018-cli-executor-remediation` plus nested children. Each has `description.json` + `graph-metadata.json` + continuity frontmatter in 5+ spec docs.

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 15
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 30 minutes
- Progressive synthesis: true (default)
- research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `.deep-research-pause` (within artifact_dir)
- Current generation: 1
- Executor: cli-codex gpt-5.4 high fast (timeout 1800s)
- Started: 2026-04-18T18:12:41Z
<!-- /ANCHOR:research-boundaries -->
