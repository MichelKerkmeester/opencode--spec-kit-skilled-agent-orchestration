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
| **Spec Folder** | 016-json-mode-hybrid-enrichment |
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
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery happened in two passes. Wave 1 expanded the structured JSON contract that actually shipped. Wave 2 then hardened count, confidence, and outcome handling. This summary has been corrected so it no longer reports an unshipped file-backed enrichment path as completed work.
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
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No file-backed hybrid enrichment shipped here.** The earlier draft narrative overstated what landed in the live code.
2. **If fuller file-backed enrichment is still desired, it needs a fresh follow-up phase.** It should not be inferred from this corrected implementation summary.
<!-- /ANCHOR:limitations -->
