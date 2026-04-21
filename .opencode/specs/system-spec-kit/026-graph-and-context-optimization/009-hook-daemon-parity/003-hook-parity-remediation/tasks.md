---
title: "029 - Hook Parity Remediation Tasks"
description: "Granular task list for closing hook parity findings and the 2026-04-21 deep-review P1 remediation items."
trigger_phrases:
  - "029 tasks"
  - "hook parity tasks"
importance_tier: "high"
contextType: "task-list"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-daemon-parity/003-hook-parity-remediation"
    last_updated_at: "2026-04-21T15:33:58Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Phase 003 tasks evidence updated for deep-review remediation"
    next_safe_action: "Run strict validation and targeted OpenCode plugin tests"
    completion_pct: 95
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->

# Tasks: 029 - Runtime Hook Parity Remediation

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[~]` | Deferred with reason |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read Phase 003 docs before editing (`spec.md:1`, `plan.md:1`, `tasks.md:1`, `checklist.md:1`, `decision-record.md:1`, `implementation-summary.md:1`).
- [x] T002 Run strict validation and capture failures (`validate.sh` reported missing anchors, template headers, and a stale command-doc integrity issue).
- [x] T003 Confirm write authority excludes git staging and commits (user prompt authority block).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Repair Phase 003 anchors and Level 3 template headers (`spec.md:28`, `plan.md:29`, `tasks.md:29`, `checklist.md:29`, `decision-record.md:29`, `implementation-summary.md:29`).
- [x] T005 Replace the broken command-doc reference with current command-doc language (`vitest-triage-phase-1-summary.md:12`).
- [x] T006 Remove stale Codex startup acceptance language and keep `session_bootstrap` as the recovery path (`spec.md:77`, `decision-record.md:100`, `implementation-summary.md:43`).
- [x] T007 Add OpenCode plugin diagnostic for absent or unparsable transport plan (`.opencode/plugins/spec-kit-compact-code-graph.js:145`, `.opencode/plugins/spec-kit-compact-code-graph.js:170`, `.opencode/plugins/spec-kit-compact-code-graph.js:237`).
- [x] T008 Confirm bridge stderr diagnostic for missing `opencodeTransport` remains active (`.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs:89`, `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs:93`, `.opencode/plugins/spec-kit-compact-code-graph-bridge.mjs:96`).
- [x] T009 Add vitest coverage for the diagnostic path (`.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:254`, `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:267`, `.opencode/skill/system-spec-kit/mcp_server/tests/opencode-plugin.vitest.ts:271`).
- [x] T010 Refresh continuity and graph metadata for parent 009 and children 001, 002, 003 (`../implementation-summary.md:12`, `../001-skill-advisor-hook-surface/implementation-summary.md:13`, `../002-skill-graph-daemon-and-advisor-unification/implementation-summary.md:12`, `implementation-summary.md:12`, `../graph-metadata.json:71`).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 `cd .opencode/skill/system-spec-kit/mcp_server && npm run typecheck` exits 0 (`../review/remediation-summary.md:18`).
- [x] T012 `cd .opencode/skill/system-spec-kit/mcp_server && npm run build` exits 0 (`../review/remediation-summary.md:21`).
- [x] T013 Targeted vitest command exits 0 for `tests/opencode-plugin.vitest.ts` and `tests/session-resume.vitest.ts` (`../review/remediation-summary.md:24`).
- [x] T014 Strict validation exits 0 for Phase 003 (`../review/remediation-summary.md:29`).
- [x] T015 Strict validation exits 0 for parent 009, child 001, and child 002 (`../review/remediation-summary.md:34`, `../review/remediation-summary.md:39`, `../review/remediation-summary.md:44`).
- [x] T016 Write the parent remediation summary with per-finding status, files, verification output, and proposed commit message (`../review/remediation-summary.md:1`, `../review/remediation-summary.md:9`).
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

### Closing Status

- [x] Phase A implemented and summarized in `phase-A-fix-summary.md` with evidence for OpenCode transport and real bridge tests (`phase-A-fix-summary.md:5`, `phase-A-fix-summary.md:35`).
- [x] Phase B implemented and summarized in `phase-B-fix-summary.md` with evidence for Codex advisor hook reliability and policy detection (`phase-B-fix-summary.md:5`, `phase-B-fix-summary.md:42`).
- [x] Phase C implemented and summarized in `phase-C-fix-summary.md` with evidence for Copilot routing and runtime docs truth-sync (`phase-C-fix-summary.md:5`, `phase-C-fix-summary.md:33`).
- [x] Phase D implemented and summarized in `phase-D-fix-summary.md` with evidence for PreToolUse denylist and read-only behavior (`phase-D-fix-summary.md:5`, `phase-D-fix-summary.md:28`).
- [x] Phase E remediation log, implementation summary, and checklist evidence were updated (`phase-E-fix-summary.md:5`, `phase-E-fix-summary.md:20`).
- [~] Full-suite vitest gate deferred with documented baseline failures outside this packet's authorized write scope (`phase-E-fix-summary.md:26`).
- [~] Direct `.codex/policy.json` edit deferred because sandbox writes returned `EPERM`; runtime/setup defaults cover the behavior (`phase-D-fix-summary.md:40`).

### Current Remediation Exit Criteria

- [x] All 5 P1 deep-review findings are fixed or explicitly deferred in the parent remediation summary (`../review/remediation-summary.md:15`, `../review/remediation-summary.md:49`, `../review/remediation-summary.md:69`, `../review/remediation-summary.md:96`, `../review/remediation-summary.md:117`).
- [x] No `[B]` blocked tasks remain without a documented follow-up (`tasks.md:28`).
- [x] Verification commands in the user request have been run and recorded (`../review/remediation-summary.md:15`, `../review/remediation-summary.md:60`, `../review/remediation-summary.md:89`, `../review/remediation-summary.md:144`, `../review/remediation-summary.md:184`, `../review/remediation-summary.md:220`).
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`.
- **Plan**: See `plan.md`.
- **Checklist**: See `checklist.md`.
- **Decisions**: See `decision-record.md`.
- **Review Source**: See the parent review report.
<!-- /ANCHOR:cross-refs -->
