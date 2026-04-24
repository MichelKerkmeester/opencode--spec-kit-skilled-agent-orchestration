---
title: "Task [system-spec-kit/026-graph-and-context-optimization/009-hook-package/005-codex-hook-parity-remediation/tasks]"
description: "Completed task breakdown for Codex native hook parity: contract research, adapter port, live registration, documentation, validation, and memory save."
trigger_phrases:
  - "026/009/005 tasks"
  - "codex hook parity tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/005-codex-hook-parity-remediation"
    last_updated_at: "2026-04-23T13:55:57Z"
    last_updated_by: "codex-gpt-5"
    recent_action: "Independent review and live re-verification — all claims hold"
    next_safe_action: "Validate and save"
    completion_pct: 100
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
---
# Task Breakdown: Codex CLI Hook Parity Remediation

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete with evidence.
- `[ ]` pending final gate in this implementation turn.
- P0/P1/P2 evidence is recorded in checklist and implementation summary.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] **T-01** Fetch Codex hook docs and official references. [EVIDENCE: Phase 1 research synthesis completed.]
- [x] **T-02** Search openai/codex source and issues for hook contract details. [EVIDENCE: Hook contract reference cites upstream schema and issue evidence.]
- [x] **T-03** Check recent Codex hook behavior and release context. [EVIDENCE: ADR-003 accepted for Codex 0.122.0.]
- [x] **T-04** Inspect Superset notify hook behavior. [EVIDENCE: Existing notify command preserved in live hooks config.]
- [x] **T-05** Run empirical hook probe for stdin/stdout/exit/timeout behavior. [EVIDENCE: Research F9 documents isolated `CODEX_HOME` probe.]
- [x] **T-06** Classify stdout, exit-code, timeout, and concurrency findings. [EVIDENCE: ADR-003 contract matrix.]
- [x] **T-07** Author research synthesis. [EVIDENCE: Research artifact exists under the parent research folder.]
- [x] **T-08** Author ADR-003 with accepted implementation path. [EVIDENCE: decision record marks outcome A accepted.]
- [x] **T-09** Stabilize Claude reference files. [EVIDENCE: `git ls-files` shows both referenced Claude files are tracked.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] **T-10** Create Codex hook surface. [EVIDENCE: `hooks/codex/` contains README, SessionStart, and UserPromptSubmit files.]
- [x] **T-11** Port and verify Codex UserPromptSubmit. [EVIDENCE: build and prompt hook smoke passed.]
- [x] **T-12** Add Codex SessionStart. [EVIDENCE: direct SessionStart smoke emitted startup context.]
- [x] **T-13** Add Codex prompt hook tests. [EVIDENCE: focused Vitest run passed.]
- [x] **T-14** Run focused Vitest regression. [EVIDENCE: 3 files, 22 tests passed.]
- [x] **T-15** Back up live Codex hook config. [EVIDENCE: `/Users/michelkerkmeester/.codex/hooks.json.bak-20260422-130756`.]
- [x] **T-16** Register Spec Kit hooks in live Codex config. [EVIDENCE: live hooks config has Spec Kit SessionStart/UserPromptSubmit commands beside notify entries.]
- [x] **T-17** Smoke direct hooks and a fresh real Codex session. [EVIDENCE: direct advisor brief emitted; `codex exec` returned `HOOK_SMOKE_OK`.]
- [x] **T-18** Confirm Claude regression. [EVIDENCE: Claude Vitest file included in green focused run.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] **T-19** Author cli-codex hook contract reference. [EVIDENCE: repo-root `.opencode/skill/cli-codex/references/hook_contract.md`.]
- [x] **T-20** Update cli-codex skill docs. [EVIDENCE: `.opencode/skill/cli-codex/SKILL.md` references hook contract, startup context, advisor brief, and `codex_hooks`.]
- [x] **T-21** Update cli-codex README. [EVIDENCE: README has Native Hooks section and FAQ.]
- [x] **T-22** Update parent summary. [EVIDENCE: parent implementation summary includes Codex phase outcome.]
- [x] **T-23** Resolve stale spec-020 reference. [EVIDENCE: active cross-reference points at the hook-daemon parity packet.]
- [x] **T-24** Walk checklist with evidence. [EVIDENCE: P0/P1/P2 checklist entries updated.]
- [x] **T-25** Author final implementation summary. [EVIDENCE: summary states outcome A shipped and lists verification.]
- [x] **T-26** Run strict spec validation. [EVIDENCE: `validate.sh --strict` passed with 0 errors and 0 warnings.]
- [x] **T-27** Run `generate-context.js`. [EVIDENCE: command exited 0, refreshed description/graph metadata, and produced POST-SAVE REVIEWER_ERROR plus memory-index lineage failures recorded in checklist.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- P0 and P1 checklist items complete.
- Build and focused tests pass.
- Live Codex config preserves Superset notify hooks and enables Spec Kit Memory hooks.
- Strict validation complete.
- Canonical save invoked; residual memory-index lineage failures are recorded.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: spec in this folder.
- Plan: plan in this folder.
- Checklist: checklist in this folder.
- Decision record: decision record in this folder.
- Implementation summary: implementation summary in this folder.
<!-- /ANCHOR:cross-refs -->
