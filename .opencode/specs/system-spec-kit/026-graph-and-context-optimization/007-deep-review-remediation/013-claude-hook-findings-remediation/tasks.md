---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
title: "Tasks: Claude Hook Findings Remediation"
description: "Task Format: T### [P?] Description (file path) — 3 phases: Spike, Patch+Normalize+Document, Verify"
trigger_phrases:
  - "claude hook findings tasks"
  - "freshness fix tasks"
  - "026/007/013 tasks"
importance_tier: "high"
contextType: "tasks"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/013-claude-hook-findings-remediation"
    last_updated_at: "2026-04-23T10:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "T012-T013 done; T011 blocked"
    next_safe_action: "Resolve AS-003/AS-004 blockers"
    blockers: []
    completion_pct: 86
    open_questions: []
    answered_questions: []
---
# Tasks: Claude Hook Findings Remediation

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

Spike + investigation before any code change.

- [x] T001 Read `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/freshness.ts` (and peers if signature logic lives elsewhere) — located `SourceSnapshot.sourceSignature` computation in `freshness.ts` and null publication in `handlers/skill-graph/scan.ts` (evidence moved into `implementation-summary.md`)
- [x] T002 `git log -p --follow` for `.opencode/skill/.advisor-state/skill-graph-generation.json` and scanner module(s) — last 30 days; commits `32fd9197c4` and `a663cbe78f` show support added but no deferral ADR (evidence moved into `implementation-summary.md`)
- [x] T003 Write temporary spike notes: exact fix location, null cause, blockers recorded; scratch file removed after summary per cleanup requirement
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

Patch + normalize + document, parallelizable where noted.

- [x] T004 Patch scanner to compute and atomically persist `sourceSignature` alongside `generation` bump — implemented via `computeAdvisorSourceSignature()` and `publishSkillGraphGeneration({ sourceSignature })`; verification continues in T009-T010
- [x] T005 [P] Normalize `.claude/settings.local.json` — removed only outer `bash` and `timeoutSec` from UserPromptSubmit, SessionStart, PreCompact, Stop after creating `.claude/settings.local.json.bak`
- [x] T006 [P] Add §9 "Multi-turn regression harness" to `.opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook-validation.md` with working stream-json fixture example and cost-reduction rationale
- [x] T007 [P] Add cross-reference from `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md` to the new §9
- [x] T008 `npm --prefix .opencode/skill/system-spec-kit/mcp_server run build` — passed cleanly (evidence: `tsc --build`, exit 0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Run `skill_graph_scan` via MCP → MCP surface was cancelled by runtime twice; compiled scan handler passed with `status:"ok"` and `.opencode/skill/.advisor-state/skill-graph-generation.json` shows `sourceSignature:"776a2bcc..."` (evidence: REQ-002, SC-001)
- [x] T010 Direct advisor smoke: pipe UserPromptSubmit JSON into `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/user-prompt-submit.js` → JSONL shows `status:"ok"`, `freshness:"live"`, `skillLabel:"sk-git"` (SC-001)
- [B] T011 One real parity run: `claude -p "ping" --output-format stream-json --include-hook-events --max-budget-usd 0.30` → observed `SessionStart=2`, `UserPromptSubmit=3`; blocked because `$HOME/.claude/settings.json` has both GitKraken and SUPERSET UserPromptSubmit hooks and Claude CLI is not authenticated in the sandbox
- [x] T012 Run advisor regression suites (corpus parity, privacy, timing) → green: 3 files, 4 tests; corpus parity 200/200; cache-hit p95 `0.025ms`; hit rate `20/30`
- [x] T013 Write `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/013-claude-hook-findings-remediation/implementation-summary.md` with evidence citations (JSONL snippets, hook_started counts, vitest output, cost result limitations)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks T001–T013 marked `[x]` (blocked by T011 environment parity)
- [ ] No `[B]` blocked tasks remaining (T011 blocked by user-global settings/auth)
- [ ] Checklist P0 items verified with evidence (see `checklist.md`)
- [ ] `implementation-summary.md` exists with cited evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Upstream findings origin**: conversation 2026-04-23, sessions `b06fd791-e5eb-4b83-bb72-470d9b773b8e` (enabled parity) and `17e651f5-471b-4de9-aa42-78cb77dba458` (disable-flag verification)
<!-- /ANCHOR:cross-refs -->

---
