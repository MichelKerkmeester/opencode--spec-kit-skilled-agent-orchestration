---
title: "Implementation Summary: Outsourced Agent Memory Capture"
description: "The outsourced-agent memory path now fails explicit bad JSON-mode inputs fast, preserves next actions correctly, and documents the caller-side handback flow without overstating deferred verification."
trigger_phrases: ["outsourced agent summary", "memory handback summary", "runtime memory inputs"]
importance_tier: "normal"
contextType: "general"
---
# Implementation Summary: Outsourced Agent Memory Capture
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 014-outsourced-agent-memory |
| **Completed** | 2026-03-11 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The outsourced-agent memory workflow is now documented and enforced the way the runtime actually behaves. Explicit JSON-mode failures stop immediately, manual next-step data survives normalization into `NEXT_ACTION`, and the CLI handback docs now tell callers to redact and scrub payloads before saving them. This reconciliation also removes stale proof claims so future sessions are not misled by an unverifiable 1032-line artifact story.

### Runtime input hardening

You now get deterministic failure behavior when `/tmp/save-context-data.json` is provided explicitly and cannot be loaded. `data-loader.ts` throws `EXPLICIT_DATA_FILE_LOAD_FAILED: ...` for missing files, invalid JSON, and validation failures, and it does not fall back to OpenCode capture on those paths.

### Next-step persistence

Manual JSON-mode saves now accept both `nextSteps` and `next_steps`. `input-normalizer.ts` stores the first entry as `Next: ...`, stores the rest as `Follow-up: ...`, preserves mixed structured payload next steps when those facts are missing, and avoids duplicating existing `Next:` / `Follow-up:` facts. `session-extractor.ts` uses the first `Next: ...` fact to populate `NEXT_ACTION`.

### CLI handback guidance

All 4 `cli-*` SKILL files and all 4 prompt templates now document the same caller-side flow: extract the handback block, map it to JSON, redact and scrub sensitive values, write `/tmp/save-context-data.json`, and stop if explicit JSON-mode loading fails. The `cli-codex` prompt template numbering drift was fixed at the same time.

### Spec evidence reconciliation

This spec folder now reflects the real repo state instead of a mixed story. It removes stale `.opencode/skill/sk-cli/` wording, stops treating the missing 1032-line artifact as proof, and keeps live outsourced CLI dispatch marked deferred until it is rerun with fresh evidence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts` | Modified | Hard-fail explicit JSON-mode load, parse, and validation failures |
| `.opencode/skill/system-spec-kit/scripts/utils/input-normalizer.ts` | Modified | Normalize `nextSteps` and `next_steps` into persisted `Next:` / `Follow-up:` facts |
| `.opencode/skill/system-spec-kit/scripts/extractors/session-extractor.ts` | Modified | Feed persisted `Next:` facts into `NEXT_ACTION` |
| `.opencode/skill/system-spec-kit/scripts/tests/runtime-memory-inputs.vitest.ts` | Modified | Lock in regression coverage for explicit failure handling and next-step persistence |
| `.opencode/skill/cli-codex/`, `.opencode/skill/cli-copilot/`, `.opencode/skill/cli-gemini/`, `.opencode/skill/cli-claude-code/` | Modified | Align handback docs across 4 SKILL files and 4 prompt templates |
| `.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-outsourced-agent-memory/*.md` | Modified | Reconcile spec evidence, security wording, and deferred verification |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The delivery used a fresh documentation audit plus reproducible repo checks. This reconciliation reread the implementation files, verified current CLI doc wording by repo search, reran targeted runtime Vitest coverage (`runtime-memory-inputs.vitest.ts`), reran `npm run lint` (`tsc --noEmit`) for scripts TypeScript correctness, reran alignment drift for the scripts root, confirmed the existing memory artifact is 620 lines rather than 1032, and updated the 5 Level 2 spec artifacts so claims rely on current repo-verifiable evidence.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Treat explicit `dataFile` failures as hard stops | Falling back after an explicit caller-provided JSON file fails would hide bad inputs and recreate garbage memory behavior. |
| Keep live outsourced CLI dispatch deferred in the spec docs | The current spec folder must not claim a fresh end-to-end pass without rerunning it and capturing new proof. |
| Remove historical numeric pass claims from acceptance evidence unless rerun now | This prevents stale historical test totals or prior clean typecheck statements from being treated as current proof. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Targeted runtime Vitest evidence | PASS: `npx vitest run tests/runtime-memory-inputs.vitest.ts --config ../mcp_server/vitest.config.ts --root .` returned 1 file passed, 5 tests passed |
| Alignment drift | PASS: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit/scripts` returned `0 findings`, `0 warnings` |
| Current `npm run lint` rerun | PASS: `.opencode/skill/system-spec-kit/scripts` `npm run lint` passed (`tsc --noEmit`) |
| Existing memory artifact check | PASS: `memory/11-03-26_15-37__analyzed-loadcollecteddata-in-data-loader-ts.md` exists and is 620 lines |
| Live outsourced CLI dispatch | DEFERRED: not rerun during this reconciliation |
| Spec validation | PASS: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/014-outsourced-agent-memory` exited 0 (Errors: 0, Warnings: 0) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live outsourced CLI dispatch is still deferred.** Rerun a fresh end-to-end outsourced-agent session if new acceptance proof is required.
<!-- /ANCHOR:limitations -->
