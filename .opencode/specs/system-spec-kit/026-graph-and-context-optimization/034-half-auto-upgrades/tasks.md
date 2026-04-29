---
title: "Tasks: Half-Auto Upgrades"
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
description: "Task tracker for packet 034 half-auto upgrade remediation."
trigger_phrases:
  - "034-half-auto-upgrades"
  - "half-auto upgrade tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/034-half-auto-upgrades"
    last_updated_at: "2026-04-29T14:15:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Half-auto upgrades complete"
    next_safe_action: "Run packet 035 next"
    blockers: []
    completion_pct: 100
---
# Tasks: Half-Auto Upgrades

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read 013 packet 034 scope. [EVIDENCE: 013 report section 6 read]
- [x] T002 Read 012 Copilot/Codex/feature-flag findings. [EVIDENCE: 012 report RQ1/RQ4 read]
- [x] T003 Read target code and docs before editing. [EVIDENCE: Copilot, Codex, search flags, advisor status, tool schemas, ENV reference inspected]
- [x] T004 [P] Create packet docs and metadata.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Patch Copilot docs to NEXT-PROMPT freshness. [EVIDENCE: hook_system line 22, skill-advisor-hook line 61, Copilot README line 14]
- [x] T006 Add visible Copilot header field. [EVIDENCE: `hooks/copilot/custom-instructions.ts:130`]
- [x] T007 Patch Codex timeout fallback marker. [EVIDENCE: `hooks/codex/user-prompt-submit.ts:194-203`]
- [x] T008 Add Codex structured timeout warning. [EVIDENCE: `hooks/codex/user-prompt-submit.ts:174-192`, `:333-335`]
- [x] T009 Add Codex cold-start smoke helper. [EVIDENCE: `hooks/codex/lib/freshness-smoke-check.ts:23-42`]
- [x] T010 Add Codex freshness test. [EVIDENCE: `tests/hooks-codex-freshness.vitest.ts` passed]
- [x] T011 Read `search-flags.ts` exhaustively. [EVIDENCE: source read through final `isIntentAutoProfileEnabled` export]
- [x] T012 Generate feature flags reference table. [EVIDENCE: ENV reference lines 28-105]
- [x] T013 Reference feature table from automation docs. [EVIDENCE: CLAUDE line 102, SKILL line 657]
- [x] T014 Mark `advisor_status` diagnostic-only. [EVIDENCE: `advisor-status.ts` JSDoc and docs]
- [x] T015 Add `advisor_rebuild` handler. [EVIDENCE: `advisor-rebuild.ts:49-109`]
- [x] T016 Register `advisor_rebuild` schemas and tool descriptor. [EVIDENCE: `tool-input-schemas.ts:641`, `tools/index.ts:58`]
- [x] T017 Cross-reference advisor status/rebuild docs. [EVIDENCE: skill-advisor-hook lines 49-52 and 180-185]
- [x] T018 Add advisor rebuild test. [EVIDENCE: `tests/advisor-rebuild.vitest.ts` passed]
- [x] T019 Update legacy runtime parity expectation for Codex fallback marker. [EVIDENCE: `skill_advisor/tests/legacy/advisor-runtime-parity.vitest.ts`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run new targeted tests. [EVIDENCE: `hooks-codex-freshness.vitest.ts` and `advisor-rebuild.vitest.ts`, 4 tests passed]
- [x] T021 Run TypeScript build. [EVIDENCE: `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` passed]
- [x] T022 Run strict validator. [EVIDENCE: final strict validator passed]
- [x] T023 Inspect status for unrelated pre-existing changes. [EVIDENCE: `.opencode/specs/...` unrelated changes left untouched]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`.
- [x] No `[B]` blocked tasks remaining.
- [x] New tests pass.
- [x] TypeScript build succeeds.
- [x] Strict validator exits 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Source research**: `../013-automation-reality-supplemental-research/research/research-report.md`
- **Baseline research**: `../012-automation-self-management-deep-research/research/research-report.md`
<!-- /ANCHOR:cross-refs -->
