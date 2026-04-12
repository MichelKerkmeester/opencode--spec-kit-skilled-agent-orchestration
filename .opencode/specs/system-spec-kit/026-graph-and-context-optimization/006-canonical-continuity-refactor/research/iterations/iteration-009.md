---
title: "Iteration 009 — Quality gates, contamination gate, reconsolidation (Features 4, 5)"
iteration: 9
band: B
timestamp: 2026-04-11T14:15:00Z
worker: claude-opus-4-6
scope: q4_features_4_5
status: complete
focus: "Retarget the 4 quality gates and the reconsolidation merge logic for spec-doc writes."
maps_to_questions: [Q4, Q7]
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/iterations/iteration-009.md"]

---

# Iteration 009 — Features 4, 5: Quality Gates + Reconsolidation

## Features covered

- **Feature 4**: Multi-dimension quality scoring — structure gate, sufficiency gate, quality loop, contamination gate
- **Feature 5**: Memory reconsolidation — auto-merge at >0.96 similarity, review at 0.88-0.96, keep separate <0.88

## Structure gate retarget

**Current**: validates memory doc body has anchors `## continue session`, `## recovery hints`, `<!-- memory metadata -->` (per `STANDARD_MEMORY_TEMPLATE_MARKERS` at `memory-save.ts:129-133`).

**Target**: validates that the TARGET spec doc + anchor exist and are writable. New checks:
1. Target spec doc exists at the specified path
2. Target anchor is present (opened and closed)
3. No adjacent anchor integrity violations
4. Merge mode is valid for the anchor's content shape

This is one of the 2 "rewrite" stages from phase 017 F2. Implementation: new module `lib/validation/spec-doc-structure.ts` that replaces `lib/parsing/memory-template-contract.ts` for spec-doc writes. The existing module stays for archived memory backward compat.

## Sufficiency gate retarget

**Current**: `evaluateMemorySufficiency` — checks that the content has enough evidence (primary, support, semantic chars).

**Target**: same check, but "primary evidence" is redefined per anchor:
- For `implementation-summary.md::what-built` — primary evidence = file/line citations, code references
- For `decision-record.md::adr-NNN` — primary evidence = decision statement + rationale + alternatives
- For `handover.md` — primary evidence = recent action + next safe action + blockers
- For `research/research.md` — primary evidence = source citations

Implementation: extend `evaluateMemorySufficiency` to accept a target anchor and use an anchor-specific rubric. The evidence counting logic stays.

## Quality loop retarget

**Current**: `runQualityLoop` — iteratively applies auto-fixes until content passes structure + sufficiency, up to N iterations.

**Target**: operates per-anchor-write, not per-whole-doc. Each merge operation runs its own quality loop against the target anchor's content. This keeps the loop scope tight and avoids iterating over unchanged anchors.

Implementation: small adaptation to `handlers/quality-loop.ts` — accept an anchor scope parameter.

## Contamination gate retarget

**Current**: detects cross-spec contamination (content that doesn't belong to the target spec folder).

**Target**: still detects cross-spec contamination, but also detects **cross-anchor contamination** — content that's being merged into the wrong anchor within the right spec folder. Example: a task update getting routed to the decisions anchor.

Implementation: extend contamination gate to check the routing decision's confidence level. If the router returned confidence <0.7, the contamination gate runs an extra check comparing the content's embedding against the target anchor's prototype embeddings (from iteration 2's Tier 2 classifier prototypes).

## Reconsolidation retarget

**Current**: `runReconsolidationIfEnabled` — when a new save has >0.96 similarity to an existing memory, auto-merge rather than create a new row.

**Target**: when a new merge chunk has >0.96 similarity to existing content inside the target anchor, skip the merge (it's a no-op, content already there). This is the same logic as iteration 3's idempotency check, unified with the reconsolidation pipeline.

Implementation: `save/reconsolidation-bridge.ts` is called by the merge operation before writing. If the chunk is a near-duplicate of existing anchor content, skip. If 0.88-0.96 similarity, log a "review recommended" flag but proceed. Below 0.88, always merge.

## Code changes summary

| File | Effort | Change |
|---|:---:|---|
| `lib/validation/spec-doc-structure.ts` | M | NEW module |
| `lib/parsing/memory-template-contract.ts` | XS | retained for archived memory backward compat |
| `lib/parsing/memory-sufficiency.ts` | S | extend rubric with anchor-specific primary evidence rules |
| `handlers/quality-loop.ts` | S | accept anchor scope parameter |
| `save/reconsolidation-bridge.ts` | S | call from merge operation before write |
| `handlers/contamination-gate.ts` (if separate) or embedded in save pipeline | M | extend to detect cross-anchor contamination |

## Findings

- **F9.1**: The 4 quality gates retarget with **1 new module + 4 small edits**. The structure gate rewrite is the biggest item but its implementation is ~150 LOC.
- **F9.2**: Reconsolidation unifies with iteration 3's idempotency check — they're the same operation viewed from different angles.
- **F9.3**: Contamination gate gains cross-anchor detection under Option C. This is a new capability, not a loss — the current memory system can't detect when content goes to the wrong section because each memory file is its own target.
- **F9.4**: Per-anchor quality loops are more efficient than per-doc quality loops because they iterate over a smaller surface.

## Next focus

Iteration 10 — causal graph with 6 relation types.
