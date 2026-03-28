---
title: "Tasks: Codex Memory MCP Fix"
description: "Retroactive done items for the landed Codex MCP startup fix, plus the broader remediation backlog that should continue from packet 024."
trigger_phrases:
  - "codex memory mcp fix tasks"
  - "spec_kit_memory backlog"
  - "broader remediation todo"
  - "codex mcp packet tasks"
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Codex Memory MCP Fix

<!-- SPECKIT_LEVEL: 3 -->
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

### Retrospective Evidence Capture

- [x] T001 Reconstruct the Codex startup failure scope: repo-local writable DB-path assumptions plus stdout-sensitive structured logging (`opencode.json`, `.codex/config.toml`, `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`, `.gemini/settings.json`, `scripts/utils/logger.ts`)
- [x] T002 Reconfirm the narrow landed startup slice: home `MEMORY_DB_PATH`, stderr-only structured logging, and clean startup smoke expectations (same surfaces as T001)
- [x] T003 Reconfirm the follow-up caveat fix: numeric spec-leaf matching, public `SPEC_DOCUMENT_FILENAMES` re-export, and modularization threshold alignment (`mcp_server/lib/config/spec-doc-paths.ts`, `mcp_server/lib/config/memory-types.ts`, `mcp_server/tests/modularization.vitest.ts`)
- [x] T004 Read the broader `020` backlog and extract the unresolved work that still matters for Codex-facing memory MCP reliability and release-control truth (`../020-pre-release-remediation/tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Packet Creation

- [x] T010 Create `024-codex-memory-mcp-fix` from the Level 3 scaffold (`024-codex-memory-mcp-fix/`)
- [x] T011 Replace template placeholders in `README.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` with live packet content (`024-codex-memory-mcp-fix/*.md`)
- [x] T012 Create packet-local identity metadata in `description.json` (`024-codex-memory-mcp-fix/description.json`)
- [x] T013 Record the relationship to `020-pre-release-remediation` so this packet owns the Codex MCP slice without claiming the whole remediation program (`./spec.md`, `./tasks.md`, `./checklist.md`)

### Broader Remediation To-Do Backlog

- [ ] T020 Verify custom-path DB initialization still enforces embedding-dimension integrity for all non-default `MEMORY_DB_PATH` flows (`mcp_server/core/db-state.ts`, vector-index initialization, direct tests)
- [ ] T021 Extend direct lifecycle coverage for startup failure branches, Stage 2b fail-open behavior, and stale in-flight tool-cache invalidation or shutdown cleanup (`context-server`, hooks, runtime tests)
- [ ] T022 Sanitize operator-facing provider failure logs without hiding useful debug context (`retry-manager`, related tests, packet docs if user-facing wording changes)
- [ ] T023 Refresh Codex-facing launcher and install docs so `MEMORY_DB_PATH`, writable-home expectations, and clean-transport guidance remain truthful across all entry points (`opencode.json`, `.codex/config.toml`, repo/system-spec-kit READMEs as needed)
- [ ] T024 Reconcile release-control truth between `020` and `024`: the Codex startup slice is green, but broader `022` remediation remains open until fresh reruns justify change (`020` and `024` packet docs/checklists)
- [ ] T025 Decide whether the first non-trivial post-Codex runtime wave belongs in this packet or should open `025` to keep scope controlled (`024-codex-memory-mcp-fix/*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run packet-local validation after backfilling the new Level 3 packet (`024-codex-memory-mcp-fix/`)
- [ ] T031 Re-run targeted runtime checks when any of T020-T024 lands (`npm run build`, focused Vitest, `npm run test:core`, startup smoke)
- [ ] T032 Save memory and handoff context after a later implementation wave, not during this documentation-only turn (`024-codex-memory-mcp-fix/memory/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The retroactive packet exists and is populated with real content.
- [x] The packet separates landed Codex MCP fixes from the still-open broader remediation backlog.
- [ ] Pending backlog items T020-T025 have landed or have approved deferrals.
- [ ] Future runtime verification has been refreshed for any new implementation wave.
- [ ] Memory and handoff context are saved after the broader remediation wave completes.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for requirements REQ-001 through REQ-009 and success criteria SC-001 through SC-004.
- **Plan**: See `plan.md` for execution phases, dependency graph, and validation strategy.
- **Checklist**: See `checklist.md` for packet-local verification state and open follow-up controls.
- **Canonical Broader Backlog**: `../020-pre-release-remediation/tasks.md`
- **Canonical Broader Review**: `../020-pre-release-remediation/review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
