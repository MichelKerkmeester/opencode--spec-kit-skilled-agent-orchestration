---
title: "...t/026-graph-and-context-optimization/010-hook-parity/003-codex-hook-parity-remediation/implementation-summary]"
description: "Outcome A shipped: native Codex SessionStart and UserPromptSubmit hooks are implemented, registered beside Superset notify hooks, documented, built, tested, and smoke-tested on Codex CLI 0.122.0."
trigger_phrases:
  - "codex hook parity complete"
  - "026/009/005 implementation"
  - "codex startup advisor hooks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-hook-parity/003-codex-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Independent review and live re-verification — all claims hold"
    next_safe_action: "Closed; downstream sk-improve-prompt routing tweak landed separately"
    blockers: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Codex SessionStart and UserPromptSubmit hooks inject developer context."
      - "Live Codex config preserves Superset notify hooks."
      - "Independent re-verification on 2026-04-22 reproduced every documented check."
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->"
---
# Implementation Summary: Codex CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-codex-hook-parity-remediation |
| **Completed** | 2026-04-22 |
| **Level** | 3 |
| **Outcome** | A, full native hook parity shipped |
| **Codex Version** | 0.122.0 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Codex now receives the same dynamic context surfaces that Claude already had. `SessionStart` injects startup repository context, and `UserPromptSubmit` injects the compact skill advisor brief through Codex-native `hookSpecificOutput.additionalContext`.

### Runtime Hooks

The Codex hook folder now contains a SessionStart adapter and the verified UserPromptSubmit adapter. The adapters parse Codex JSON stdin, emit Codex JSON stdout, and fail open with `{}`.

### Live Wiring

The live user config now appends Spec Kit Memory commands beside the existing Superset notification commands in `~/.codex/hooks.json`. `~/.codex/config.toml` now enables `codex_hooks = true`.

### Documentation

The cli-codex skill and README now document native hooks, troubleshooting, and the hook contract reference. The parent summary records the phase outcome.

### Follow-Up Documentation Sync

Manual testing playbooks, feature catalogs, and README-style operator docs now describe Codex native `SessionStart` and `UserPromptSubmit` hooks as the primary path. Prompt-wrapper language remains only as a fallback for older or unavailable hook-policy deployments.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation reused the existing Claude advisor/startup behavior where possible and kept Codex-specific logic in runtime-specific adapters. Live config was backed up before editing. The Superset notify hook entries were preserved exactly and the new Spec Kit commands were appended.

Files changed include the Codex hook adapters and README, focused Codex tests, cli-codex documentation, live Codex user config, and this phase packet's tasks/checklist/decision/summary docs.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Use `hookSpecificOutput.additionalContext` | It is the explicit Codex hook output contract and avoids ambiguity around plain stdout parsing. |
| Preserve `notify.sh` entries | They are user-owned Superset wiring and were already present in live config. |
| Use absolute repo-root commands | Global hook registration cannot rely on current working directory. |
| Avoid a git commit | The user asked to implement, and the Claude reference files were already tracked. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npm run build` | PASS |
| `npx vitest run tests/codex-session-start-hook.vitest.ts tests/codex-user-prompt-submit-hook.vitest.ts tests/claude-user-prompt-submit-hook.vitest.ts` | PASS, 3 files and 22 tests |
| Live hooks JSON parse and config flag check | PASS |
| Direct SessionStart smoke | PASS, emitted startup context in 42.22ms |
| Direct UserPromptSubmit smoke | PASS, emitted `Advisor: stale; use sk-code-opencode 0.92/0.12 pass.` in 71ms |
| Real Codex feature flag | PASS, `codex_hooks` reports true |
| Fresh real Codex smoke | PASS, returned `HOOK_SMOKE_OK` with 28,265 input tokens |
| Strict spec validation | PASS, 0 errors and 0 warnings |
| `generate-context.js` | EXIT 0; refreshed description/graph metadata; post-save reviewer returned REVIEWER_ERROR with no issues; memory index retry left six files failed on lineage/candidate-change errors |
| Documentation stale-string sweep | PASS, stale "Codex hookless" and old `hookPolicy=unavailable` wording removed from updated playbooks/catalog/readme surfaces |
| **Independent re-verification (2026-04-22T12:45Z)** | PASS — fresh agent reproduced build, vitest 22/22, strict validate 0/0, direct SessionStart smoke (28.8ms), direct UserPromptSubmit smoke for triggering prompt (`Advisor: stale; use sk-code-review 0.95/0.12 pass.`) and non-triggering prompt (correct `{}` fail-open), `codex_hooks=true`, backup file present, Superset notify entries preserved in all 3 events, Spec Kit hooks registered alongside with `timeout: 3` |
| **User-driven Codex-session smoke** | PASS — user ran supplied test prompts in a real `codex` interactive session; SessionStart context received with full repo metrics + structural highlights; UserPromptSubmit advisor brief surfaced for triggering prompts (`sk-code-review`, `sk-deep-review`, `system-spec-kit`); concurrent ordering with Superset notify is non-conflicting |
| **Downstream finding (out of scope, fixed separately)** | Manual smoke surfaced a routing asymmetry in the skill catalog (NOT the hook layer): `sk-improve-prompt` failed to surface for prompts containing "improve this prompt" because its keyword line registered only hyphenated forms. Patched in `.opencode/skill/sk-improve-prompt/SKILL.md` by adding natural-language phrases; `explicit_author` lane now matches at 1.00 (was 0.75); confidence rose 0.82→0.87 for ambiguous dual-intent prompts and 0.88→0.94 for standalone prompts. Unrelated to Codex hook parity; does not change anything claimed by this packet |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex hooks are still under development.** `codex features list` reports `codex_hooks` as under development, so future Codex releases may require contract re-verification.
2. **CocoIndex timed out during implementation.** Code exploration used direct file reads and `rg` after semantic search timed out.
3. **The worktree had unrelated existing changes.** This phase intentionally touched only scoped repository files and live Codex user config.
4. **Memory indexing is partially degraded.** `generate-context.js` refreshed metadata and exited 0, but semantic indexing hit an `E_LINEAGE` / `candidate_changed` failure for several packet docs. Strict spec validation remains clean.
<!-- /ANCHOR:limitations -->
