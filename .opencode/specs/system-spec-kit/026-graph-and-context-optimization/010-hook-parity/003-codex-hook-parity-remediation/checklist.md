---
title: "...ystem-spec-kit/026-graph-and-context-optimization/010-hook-parity/003-codex-hook-parity-remediation/checklist]"
description: "Evidence-backed verification checklist for Codex native hook parity."
trigger_phrases:
  - "026/009/005 checklist"
  - "codex hook parity checklist"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-hook-parity/003-codex-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Independent review and live re-verification — all claims hold"
    next_safe_action: "Validate and save"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->"
---
# Verification Checklist: Codex CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

### P0 - Blockers

- [x] **P0-01** Research exists with contract spec, primary sources, and empirical probe result. [EVIDENCE: parent research synthesis records Codex 0.122.0 hook probe.]
- [x] **P0-02** Decision record ADR-003 accepted with concrete contract matrix. [EVIDENCE: ADR-003 status accepted, outcome A.]
- [x] **P0-03** Codex UserPromptSubmit hook exists and compiles. [EVIDENCE: build passed.]
- [x] **P0-04** Live Codex UserPromptSubmit registration exists beside notify hook. [EVIDENCE: live hooks config preserves notify and adds Spec Kit prompt command.]
- [x] **P0-05** Claude regression test is green. [EVIDENCE: focused Vitest run passed 3 files, 22 tests.]
- [x] **P0-06** Fresh Codex smoke observes advisor/startup context path. [EVIDENCE: direct prompt hook emitted advisor brief; real `codex exec` returned `HOOK_SMOKE_OK` with 28,265 input tokens.]
- [x] **P0-07** Superset notify hook remains registered. [EVIDENCE: live hooks config still has notify entries for SessionStart, UserPromptSubmit, and Stop.]
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

### P1 - Required

- [x] **P1-01** Codex SessionStart hook exists and fires. [EVIDENCE: direct SessionStart smoke emitted startup context in 42.22ms.]
- [x] **P1-02** Codex UserPromptSubmit tests exist and pass. [EVIDENCE: focused Vitest run passed.]
- [x] **P1-03** cli-codex skill and README document hook parity. [EVIDENCE: docs mention hook contract, `codex_hooks`, startup context, and advisor brief.]
- [x] **P1-04** Parent summary updated. [EVIDENCE: parent implementation summary includes Codex phase outcome.]
- [x] **P1-05** Live hooks backup exists. [EVIDENCE: `/Users/michelkerkmeester/.codex/hooks.json.bak-20260422-130756`.]
- [x] **P1-06** Implementation summary has outcome label, file list, and smoke evidence. [EVIDENCE: summary records outcome A shipped.]
- [x] **P1-07** Strict validation exit code recorded. [EVIDENCE: `validate.sh --strict` passed with 0 errors and 0 warnings.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] **P1-CQ01** TypeScript compilation passes. [EVIDENCE: `npm run build` passed.]
- [x] **P1-CQ02** Hook adapters fail open on invalid input. [EVIDENCE: Codex hook tests cover invalid and empty input.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] **P1-T01** Focused hook test run passes. [EVIDENCE: 3 files, 22 tests passed.]
- [x] **P1-T02** Direct SessionStart smoke passes. [EVIDENCE: emitted `hookSpecificOutput.additionalContext`.]
- [x] **P1-T03** Direct UserPromptSubmit smoke passes. [EVIDENCE: emitted `Advisor: stale; use sk-code-opencode 0.92/0.12 pass.`]
- [x] **P1-T04** Real Codex smoke passes. [EVIDENCE: `codex exec --json --ephemeral` returned `HOOK_SMOKE_OK`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] **P1-S01** Hook commands use absolute repo path and do not consume shell input beyond Codex-provided JSON. [EVIDENCE: live commands `cd` to repo root and execute compiled JS.]
- [x] **P1-S02** Existing user notification hook remains user-owned. [EVIDENCE: `notify.sh` command was not edited.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] **P2-01** cli-codex hook contract exists. [EVIDENCE: repo-root `.opencode/skill/cli-codex/references/hook_contract.md`.]
- [x] **P2-02** Research methodology exists for future CLI parity work. [EVIDENCE: parent research synthesis has methodology notes.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] **P1-F01** Runtime-specific Codex hooks live under the Codex hook folder. [EVIDENCE: `hooks/codex/` contains the adapters and README.]
- [x] **P1-F02** Spec packet docs remain in the child phase folder. [EVIDENCE: this checklist, tasks, plan, decisions, and summary live in the phase folder.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

### P2 - Recommended

- [x] **P2-03** Memory save emits no high post-save quality issues. [EVIDENCE: `generate-context.js` exited 0 and POST-SAVE QUALITY REVIEW returned REVIEWER_ERROR with `issues:[]`; standalone memory index retry updated/reinforced two docs but left six files failed on lineage/candidate-change errors.]
- [x] **P2-04** Timing observations recorded. [EVIDENCE: SessionStart 42.22ms; UserPromptSubmit 71ms.]

### Verification Log

- 2026-04-22 11:09Z: build passed.
- 2026-04-22 11:09Z: focused Vitest passed, 3 files and 22 tests.
- 2026-04-22 11:09Z: direct SessionStart and UserPromptSubmit smokes passed.
- 2026-04-22 11:09Z: live feature flag visible as `codex_hooks true`.
- 2026-04-22 11:10Z: fresh real Codex smoke returned `HOOK_SMOKE_OK`.

P0/P1 are complete. P2-03 is recorded with residual memory-index risk: metadata refreshed, but semantic indexing did not fully accept all docs.
<!-- /ANCHOR:summary -->
