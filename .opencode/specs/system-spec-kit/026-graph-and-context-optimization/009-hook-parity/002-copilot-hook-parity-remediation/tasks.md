---
title: "Tasks: Copilot CLI Hook Parity Remediation"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2"
description: "Completed task ledger for investigation, outcome B implementation, documentation, and strict-validator closure."
trigger_phrases:
  - "026/009/004 tasks"
  - "copilot hook parity tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-parity/002-copilot-hook-parity-remediation"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Strict validator closure"
    next_safe_action: "Keep validators green"
    completion_pct: 100
---

# Tasks: Copilot CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |

**Task Format**: `T### [REQ] Description. Evidence: file, artifact, or command result.`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T001** Fetch official Copilot CLI docs and hook/custom-instructions references. Evidence: research synthesis F1-F8 and GitHub docs verification.
- [x] **T002** Search Copilot CLI repo/issues for hook, plugin, extension, and pre-prompt behavior. Evidence: research synthesis references issues #1245, #2044, and #2555.
- [x] **T003** Review release notes for extensibility changes. Evidence: research synthesis F6 cites ACP public-preview changelog.
- [x] **T004** Empirically probe Copilot custom-instructions behavior. Evidence: 2026-04-22 `copilot -p` smoke confirmed managed instructions visibility.
- [x] **T005** Classify outcome as B, file-based workaround. Evidence: ADR-003 accepted outcome B.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T006** Identify `$HOME/.copilot/copilot-instructions.md` as the file path Copilot reads. Evidence: GitHub custom-instructions docs and writer target.
- [x] **T007** Add writer that renders the current brief into the managed block. Evidence: `hooks/copilot/custom-instructions.ts`, `hooks/copilot/user-prompt-submit.ts`, `.github/hooks/scripts/user-prompt-submitted.sh`.
- [x] **T008** Document latency/freshness trade-off. Evidence: ADR-003 consequences and cli-copilot docs state next-prompt freshness.
- [x] **T009** Route repo hooks through Spec Kit wrappers before optional Superset notification. Evidence: `.github/hooks/superset-notify.json` and `copilot-hook-wiring.vitest.ts`.
- [x] **T010** Add workspace-scoped retention and atomic write behavior. Evidence: `custom-instructions.ts` renders Workspace and uses lock/temp rename behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T011** Run focused Copilot and Claude hook tests. Evidence: implementation-summary.md verification table records 4 files / 28 tests passing.
- [x] **T012** Run real Copilot smoke. Evidence: implementation-summary.md records `Advisor: stale; use sk-code-opencode 0.92/0.00 pass.`
- [x] **T013** Update cli-copilot SKILL.md, README, hook docs, feature catalog, and manual playbook. Evidence: implementation-summary.md lists documentation sweep.
- [x] **T014** Update parent summary and packet implementation summary. Evidence: implementation-summary.md final outcome B.
- [x] **T015** Run strict validator after template closure. Evidence: temporary hygiene summary records the final strict-validator command and exit code.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Outcome B remains explicit.
- [x] Existing verification evidence remains intact.
- [x] No runtime code changed during this strict-validator closure pass.
- [x] Strict validator passes after template restructuring.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decision Records**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
<!-- /ANCHOR:cross-refs -->
