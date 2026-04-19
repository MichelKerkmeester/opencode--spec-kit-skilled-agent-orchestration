---
title: "Tasks: Deferred Remediation + Telemetry Measurement Run"
description: "Implementation tasks for Phase 024 across Codex registration, static measurement, live-session wrapper and analyzer."
trigger_phrases:
  - "024 tasks"
  - "deferred remediation tasks"
  - "telemetry measurement tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/024-deferred-remediation-and-telemetry-run"
    last_updated_at: "2026-04-19T18:05:00Z"
    last_updated_by: "codex"
    recent_action: "Tracks 2-4 shipped and strict validation passed"
    next_safe_action: "Codex config retry"
    blockers:
      - ".codex directory is not writable in this sandbox; Track 1 config files are blocked"
    key_files:
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts"
      - ".opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts"
    completion_pct: 90
---
# Tasks: Deferred Remediation + Telemetry Measurement Run

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

- [x] T001 Read required Phase 024 spec, Phase 020 hook docs, Codex adapter, telemetry primitive, producer, corpus and router parser sources
- [B] T002 Create Codex hook registration file (`.codex/settings.json`) [Blocked: sandbox denies writes under `.codex` with `Operation not permitted`]
- [B] T003 Create Codex Bash policy file (`.codex/policy.json`) [Blocked: sandbox denies writes under `.codex` with `Operation not permitted`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement static smart-router measurement harness (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-measurement.ts`)
- [x] T005 Add measurement harness tests (`.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-measurement.vitest.ts`)
- [x] T006 Implement live-session wrapper template (`.opencode/skill/system-spec-kit/scripts/observability/live-session-wrapper.ts`)
- [x] T007 Document live-session wrapper setup for four runtimes (`.opencode/skill/system-spec-kit/scripts/observability/LIVE_SESSION_WRAPPER_SETUP.md`)
- [x] T008 Implement telemetry analyzer CLI (`.opencode/skill/system-spec-kit/scripts/observability/smart-router-analyze.ts`)
- [x] T009 Add analyzer tests (`.opencode/skill/system-spec-kit/mcp_server/tests/smart-router-analyze.vitest.ts`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run static measurement harness against the 200-prompt corpus [Evidence: 200/200 processed, 112/200 advisor top-1 matches]
- [x] T011 Run new targeted Vitest suites [Evidence: 2 files, 7 tests passed]
- [x] T012 Run Phase 020/current regression tests requested by the phase [Evidence: targeted advisor/hook set, 20 files, 138 tests passed]
- [x] T013 Run TypeScript noEmit checks [Evidence: scripts and mcp_server typecheck passed]
- [x] T014 Run strict spec validation for the 024 folder [Evidence: `NODE_OPTIONS='--import ./.opencode/skill/system-spec-kit/scripts/node_modules/tsx/dist/loader.mjs' validate.sh ... --strict` passed with errors=0]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] Additive observability tracks shipped
- [x] Measurement report states predicted-route caveats plainly
- [x] Analyzer handles empty and invalid JSONL inputs
- [ ] Codex top-level config files written
- [x] Strict validation passes with local tsx loader workaround
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
