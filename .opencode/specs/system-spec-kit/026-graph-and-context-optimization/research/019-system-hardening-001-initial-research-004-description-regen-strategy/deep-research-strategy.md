---
title: Deep Research Strategy — description.json Regen Strategy (RR-2)
description: Runtime strategy for 019/001/004 RR-2 research session.
---

# Deep Research Strategy - description.json Regen Strategy

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Research session evaluating preservation strategies for hand-authored rich content in description.json when canonical-save regen runs.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

description.json rich-content preservation research. Audit 86 description.json files in 026, classify fields derived vs authored, evaluate 4 strategies, recommend one with migration path + validation fixtures.

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Catalogue all fields across 86 description.json files. Classify each as "always derived" (safe to regen) or "can be authored" (must preserve).
- [ ] Q2: Of the 4 candidate strategies (opt-in regen flag, hash-based change detection, schema-versioned authored layer, field-level merge policy), which best preserves rich content with minimal migration cost?
- [ ] Q3: Audit the 29 "rich" description.json files identified in 018 research.md §5. What authored-content patterns must survive regen?
- [ ] Q4: Does the recommended strategy conflict with phase 018 R4 description-repair-helper (merge-preserving repair for schema-invalid files)? If yes, how to reconcile?
- [ ] Q5: Concrete implementation — schema changes, migration path, validation fixtures that prevent regression.

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Implementation (sibling implementation child).
- graph-metadata.json regen (different code path, different packet).
- Archive/revive policy for packets.

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 86 files field-catalogued, all 4 strategies evaluated, recommendation with migration path.
- Max iterations 12.
- Stuck: 3 iters < 0.05.

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
Q1: Catalogue all fields across 86 description.json files. Classify each as "always derived" (safe to regen) or "can be authored" (must preserve).

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

Root impl-summary §Known Limitations #4 flags: H-56-1 fix triggers auto-regen overwriting hand-authored fields. Observed on 017's own description.json during implementation.

Phase 018 R4 added parse/schema split + merge-preserving repair helper (at `description-repair-helper.ts` or similar) — but only for post-schema-invalid case. Valid-but-rich files still get clobbered by regen.

Phase 018 research.md §5 identified 29 of 86 description.json files as "rich" (have authored content beyond template).

Sub-packet 001 (SSK-RR-2) iter 5 found save_lineage writeback bug — same package regen path. The two P0s interact.

4 candidate preservation strategies:
1. Opt-in regen flag (`description.json.regen_policy: "preserve" | "overwrite"`)
2. Hash-based change detection (only regen if hash matches last-auto-generated)
3. Schema-versioned authored layer (separate `derived.*` from `authored.*`, merge at read)
4. Field-level merge policy (each field has `source` marker)

Files involved:
- `.opencode/skill/system-spec-kit/scripts/spec-folder/generate-description.ts`
- All 86 description.json files under `.opencode/specs/`
- Phase 018 R4 `description-repair-helper.ts` module

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 12
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 30 minutes
- Executor: cli-codex gpt-5.4 high fast
- Started: 2026-04-18T19:14:43Z
<!-- /ANCHOR:research-boundaries -->
