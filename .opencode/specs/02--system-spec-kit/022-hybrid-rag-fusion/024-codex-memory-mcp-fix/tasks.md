---
title: "Tasks: Codex Memory MCP Fix"
description: "Packet truth-sync tasks for the landed Codex MCP remediation slice, including the startup fix, the DB-isolation fix, and the remaining broader recommendations outside this packet's completion gate."
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
| `empty checkbox` | Unused template marker |
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
- [x] T002A Capture the direct DB root cause and landed fix: `initializeDb(':memory:')` and custom-path initialization now promote the active shared DB connection/path so later reads or writes stay isolated (`mcp_server/lib/search/vector-index-store.ts`, `mcp_server/tests/vector-index-store-remediation.vitest.ts`)
- [x] T003 Reconfirm the follow-up caveat fix: numeric spec-leaf matching, public `SPEC_DOCUMENT_FILENAMES` re-export, and modularization threshold alignment (`mcp_server/lib/config/spec-doc-paths.ts`, `mcp_server/lib/config/memory-types.ts`, `mcp_server/tests/modularization.vitest.ts`)
- [x] T004 Read the broader `020` backlog and extract the unresolved work that still matters for Codex-facing memory MCP reliability and release-control truth (`../020-pre-release-remediation/tasks.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Packet Creation

- [x] T010 Update `024-codex-memory-mcp-fix` packet docs so they match the landed runtime remediation slice (`024-codex-memory-mcp-fix/*.md`)
- [x] T011 Replace stale docs-only wording in `README.md`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md` with current session fix evidence (`024-codex-memory-mcp-fix/*.md`)
- [x] T012 Keep packet-local identity metadata aligned while the packet scope stays under the same slug (`024-codex-memory-mcp-fix/description.json`)
- [x] T013 Record the relationship to `020-pre-release-remediation` so this packet owns the narrow Codex MCP slice without claiming the whole remediation program (`./spec.md`, `./tasks.md`, `./checklist.md`)

### Broader Remediation Follow-On Capture

- [x] T020 Record the still-open need to verify embedding-dimension integrity and adjacent custom-path invariants after the active-connection promotion fix (`mcp_server/core/db-state.ts`, vector-index initialization, direct tests)
- [x] T021 Record the need to extend direct lifecycle coverage for startup failure branches, Stage 2b fail-open behavior, and stale in-flight tool-cache invalidation or shutdown cleanup (`context-server`, hooks, runtime tests)
- [x] T022 Record the need to sanitize operator-facing provider failure logs without hiding useful debug context (`retry-manager`, related tests, packet docs if user-facing wording changes)
- [x] T023 Record the need to refresh Codex-facing launcher and install docs so `MEMORY_DB_PATH`, writable-home expectations, and clean-transport guidance remain truthful across all entry points (`opencode.json`, `.codex/config.toml`, repo/system-spec-kit READMEs as needed)
- [x] T024 Record the release-control truth that `020` remains the broader remediation source while the Codex startup slice is green in `024` (`020` and `024` packet docs/checklists)
- [x] T025 Record the routing rule that the first non-trivial post-Codex runtime wave may need `025` to keep scope controlled (`024-codex-memory-mcp-fix/*.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T030 Run packet-local validation after backfilling the new Level 3 packet (`024-codex-memory-mcp-fix/`)
- [x] T031 Record the targeted runtime checks that passed for this landed fix and that later implementation waves must rerun when follow-on work lands (`npx vitest run tests/vector-index-store-remediation.vitest.ts tests/handler-memory-list-edge.vitest.ts tests/handler-memory-health-edge.vitest.ts tests/handler-memory-search.vitest.ts`, `npm run test:core`, alignment drift, startup smoke as needed)
- [x] T032 Document that any later implementation wave should save memory and handoff context in its own packet lifecycle instead of blocking this retrospective closeout (`024-codex-memory-mcp-fix/memory/`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] The retroactive packet exists and is populated with real content.
- [x] The packet separates landed Codex MCP fixes from the still-open broader remediation recommendations.
- [x] The packet records the DB-isolation root cause, the active-connection promotion fix, and the regression coverage truthfully.
- [x] Follow-on recommendations T020-T025 are captured without falsely claiming the implementation itself has already landed.
- [x] Runtime re-verification expectations are documented for any later implementation wave.
- [x] Later-wave memory and handoff expectations are documented without blocking this packet closeout.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md` for requirements REQ-001 through REQ-009 and success criteria SC-001 through SC-004.
- **Plan**: See `plan.md` for execution phases, dependency graph, and validation strategy.
- **Checklist**: See `checklist.md` for packet-local completion evidence and follow-on control coverage.
- **Canonical Broader Backlog**: `../020-pre-release-remediation/tasks.md`
- **Canonical Broader Review**: `../020-pre-release-remediation/review/review-report.md`
<!-- /ANCHOR:cross-refs -->

---
