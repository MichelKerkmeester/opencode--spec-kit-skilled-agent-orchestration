---
title: "Implementation Summary"
description: "This summary now reflects the narrower JSON-mode work that actually shipped: structured summary-field support and normalization hardening, not the full file-backed hybrid enrichment path originally described in phase 016."
trigger_phrases:
  - "implementation"
  - "summary"
  - "json mode"
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-initial-enrichment |
| **Completed** | 2026-03-20 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The shipped work in this tree is narrower than the original phase write-up. Phase 016 did land richer structured JSON summary support and follow-up normalization hardening, but it did not land the full file-backed hybrid enrichment path that this pack originally claimed.

### Shipped Structured JSON Hardening

The concrete runtime changes in this tree add JSON-mode summary fields such as `toolCalls` and `exchanges`, keep file-backed JSON authoritative, and tighten related normalization and downstream count handling.

### Wave 2 Hardening

Wave 2 closed the follow-up correctness gaps that showed up after the base implementation landed. Decision confidence now respects explicit input, truncated outcome titles can fall back to longer narratives, `git_changed_file_count` has a stable three-tier priority chain, and template assembly preserves explicit counts when the conversation arrays under-report the session.

### Wave 3: JSON Payload Field Propagation Fixes + Post-Save Review

Wave 3 fixed 5 root cause bugs where structured JSON payload fields (`sessionSummary`, `triggerPhrases`, `keyDecisions`, `importanceTier`, `contextType`) were silently discarded or overridden during the save pipeline:

- **RC1 (title)**: `sessionSummary` now flows through `_JSON_SESSION_SUMMARY` as the first candidate in `pickPreferredMemoryTask()`, preventing generic titles like "Next Steps".
- **RC2 (trigger phrases)**: Manual trigger phrases from JSON are now merged into frontmatter triggers (previously only went to vector indexing).
- **RC3 (decisions)**: Fast-path in `normalizeInputData()` now propagates `keyDecisions` into both `_manualDecisions` and decision-type observations (matching slow-path).
- **RC4 (importance tier)**: Cascading fix — resolved by RC3 (decisions propagate) + RC5 (contextType honored), so auto-detection returns correct tier.
- **RC5 (context type)**: `detectContextType()` now checks `decisionCount > 0` before `total === 0` early return; explicit `contextType` from JSON is honored via new `explicitContextType` parameter.

Additionally, a **post-save quality review** (`scripts/core/post-save-review.ts`) was added as Step 10.5 in the workflow. After writing the memory file, it reads back the frontmatter and compares against the original JSON payload, reporting HIGH/MEDIUM/LOW severity issues for silent field overrides. The 4 tracked instruction files present in this repo `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`, and `AGENTS_example_fs_enterprises.md` were updated to instruct AIs to act on the review output.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery happened in three passes. Wave 1 expanded the structured JSON contract that actually shipped. Wave 2 hardened count, confidence, and outcome handling. Wave 3 fixed 5 root cause bugs in JSON payload field propagation and added a post-save quality review mechanism. This summary has been corrected so it no longer reports an unshipped file-backed enrichment path as completed work.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep file-backed JSON authoritative | Routine JSON input should not silently fall back into stateless enrichment |
| Ship summary-field support first | `toolCalls` and `exchanges` improve saved context without reopening transcript reconstruction complexity |
| Correct the spec pack to shipped truth | The documentation should not claim a hybrid enrichment path that is absent from the live code |
| Reassert explicit counts during final template assembly | The overwrite bug happened at the assembly layer, so the fix belongs there |
| Use explicit > enrichment > provenance for changed-file counts | That order matches the relative confidence of the available data sources |
| Fix field propagation at root cause rather than patching frontmatter post-hoc | Silent overrides defeat the purpose of JSON mode; pipeline must honor structured input |
| Add post-save quality review as safety net | Even after fixes, a review step catches regressions before the AI continues |
| Mirror `importanceTier` pattern for `contextType` threading | Consistent approach across the codebase reduces future maintenance burden |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TypeScript validation | PASS, `npx tsc --noEmit` |
| Build output | PASS, `npx tsc -b` |
| File-backed JSON authority | PASS, `_source: 'file'` remains the structured path and does not enter stateless enrichment |
| Structured summary fields | PASS, `toolCalls` and `exchanges` exist in the shared JSON contract |
| Wave 2 fixes | PASS, confidence, changed-file count, and explicit message/tool counts follow the corrected priority rules |
| Wave 3 RC fixes | PASS, all 5 JSON payload fields propagate correctly through pipeline |
| Post-save review | PASS, `scripts/core/post-save-review.ts` compiles and integrates at Step 10.5 |
| Instruction layer | PASS, the 4 tracked instruction files present in this repo were updated with post-save review guidance |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No file-backed hybrid enrichment shipped here.** The earlier draft narrative overstated what landed in the live code.
2. **If fuller file-backed enrichment is still desired, it needs a fresh follow-up phase.** It should not be inferred from this corrected implementation summary.
3. **Post-save review is advisory.** The review output instructs the AI to patch fields, but enforcement depends on the AI following the instructions. The root cause fixes (RC1-RC5) should prevent most issues from occurring.
<!-- /ANCHOR:limitations -->
