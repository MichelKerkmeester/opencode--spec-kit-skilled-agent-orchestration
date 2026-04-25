---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
title: "Feature Specification: Code Graph Phase Runner + detect_changes Preflight (012/002)"
description: "Adopt typed phase-DAG runner around code-graph scan; build read-only detect_changes handler that maps git diff hunks to symbols and refuses to answer when graph is stale."
trigger_phrases:
  - "012 phase runner"
  - "012 detect changes"
  - "code graph phase dag"
  - "diff hunk preflight"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/012-graph-impact-and-affordance-uplift/002-code-graph-phase-runner-and-detect-changes"
    last_updated_at: "2026-04-25T11:00:00Z"
    last_updated_by: "claude-orchestrator"
    recent_action: "Initialized sub-phase scaffold"
    next_safe_action: "Wait for 012/001 license sign-off; then read structural-indexer.ts to plan phase wrap"
    completion_pct: 0
    blockers: ["012/001 license audit pending"]
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
---
# Feature Specification: Code Graph Phase Runner + detect_changes Preflight (012/002)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA
| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft (blocked on 012/001) |
| **Created** | 2026-04-25 |
| **Branch** | `012/002-code-graph-phase-runner-and-detect-changes` |
<!-- /ANCHOR:metadata -->

---

## 2. PROBLEM & PURPOSE

### Problem Statement
`code_graph/lib/structural-indexer.ts:1369` `indexFiles()` runs scan stages inlined with no phase abstraction. There's no way to declare phase dependencies, validate ordering, or surface failure attribution. Separately, no handler maps a git diff to affected symbols (the entire `detect_changes` capability is missing — verified: zero git-diff hooks in `code_graph/handlers/`).

### Purpose
1. Wrap the scan flow in a typed phase-DAG runner with declared `inputs[]`/`outputs[]`, topological sort, cycle/duplicate-name rejection.
2. Add a read-only `detect_changes` MCP handler that takes a git diff and reports affected symbols, refusing to answer when the graph is stale.

---

## 3. SCOPE

### In Scope
- Typed phase contract (TS interface for `Phase<I, O>`)
- Phase runner with topological sort + cycle/duplicate detection
- Wrap existing `indexFiles()` flow as N declared phases
- `detect_changes` handler taking diff input, returning `{affectedSymbols, status, blockedReason?}`
- Diff hunk parser (open: which library — see ADR in 012/001 if licensing constraints)

### Out of Scope
- Runtime mutation of user/worktree code via the `detect_changes` handler (the handler is read-only; new module files within `mcp_server/code_graph/` are implementation deliverables, not user-code mutations)
- Automatic remediation suggestions (handler returns symbols only)
- Cross-repo or multi-repo diff handling (single-repo scope)
- Replacing SQLite storage (purely orchestration layer over existing storage)

### Files to Change
| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `mcp_server/code_graph/lib/phase-runner.ts` | NEW | Typed phase contract, topo-sort, cycle/duplicate-name rejection |
| `mcp_server/code_graph/lib/diff-parser.ts` | NEW | Git diff hunk parser (lib choice tracked as P1-03 blocker) |
| `mcp_server/code_graph/handlers/detect-changes.ts` | NEW | Read-only preflight handler |
| `mcp_server/code_graph/lib/structural-indexer.ts:1369` | MODIFY | Wrap `indexFiles()` body as declared phases |
| `mcp_server/code_graph/handlers/index.ts` | MODIFY | Register new handler |
| `feature_catalog/03--discovery/` | NEW entry | Catalog `detect_changes` |
| `feature_catalog/14--pipeline-architecture/` | NEW entry | Catalog phase-DAG runner |
| `manual_testing_playbook/03--discovery/` | NEW entry | Playbook for `detect_changes` |
| `manual_testing_playbook/14--pipeline-architecture/` | NEW entry | Playbook for phase-DAG runner |

---

## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| R-002-1 | Phase runner rejects: duplicate phase names, missing dependencies, cycles |
| R-002-2 | Each phase only sees outputs of phases it explicitly declared as deps |
| R-002-3 | Existing `indexFiles()` exports preserved (backward compat); internal flow refactored |
| R-002-4 | `detect_changes` returns `status: "blocked"` when readiness requires full scan; **never** `"no affected symbols"` |
| R-002-5 | `detect_changes` output is structured: `{ status, affectedSymbols[], blockedReason?, timestamp }` |
| R-002-6 | Diff parser handles standard unified diff format; unknown hunk formats return `status: "parse_error"` |
| R-002-7 | All phase failures surface phase name + cause in error message (failure attribution) |
| R-002-8 | Handler registered in `handlers/index.ts` with proper schema |

---

## 5. VERIFICATION

- [ ] Unit test: phase runner rejects duplicates, missing deps, cycles
- [ ] Unit test: phases see only declared dep outputs
- [ ] Integration test: existing `indexFiles()` callers still work
- [ ] Unit test: `detect_changes` returns `blocked` on stale graph (NOT empty)
- [ ] Unit test: diff parser handles standard unified diff
- [ ] E2E: scan + `detect_changes` against a fixture repo
- [ ] `validate.sh --strict` passes
- [ ] sk-doc DQI score on feature_catalog + playbook entries

---

## 6. REFERENCES
- 012/spec.md §3 (scope), §4 (requirements R-002 row)
- 012/decision-record.md ADR-012-002, ADR-012-003
- pt-02 §4 (Code Graph findings — phase registry, runner contract, detect_changes rows)
- pt-02 §11 Packet 1
- Verified gap: `code_graph/lib/structural-indexer.ts:1369` (inlined), zero git-diff hooks in `handlers/`
