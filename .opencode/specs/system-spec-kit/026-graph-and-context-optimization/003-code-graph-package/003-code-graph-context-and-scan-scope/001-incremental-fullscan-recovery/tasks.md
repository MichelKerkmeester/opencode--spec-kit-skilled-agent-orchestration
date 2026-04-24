---
title: "...xt-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/001-incremental-fullscan-recovery/tasks]"
description: "Ordered task list T-001 through T-011 for restoring full-scan behavior, deduping symbol IDs, testing, building, and documenting the code graph remediation."
trigger_phrases:
  - "incremental fullscan tasks"
  - "t-001 skipfreshfiles"
  - "t-004 seensymbolids"
  - "012/002 tasks"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Created task list"
    next_safe_action: "Execute tasks in order and update checkboxes with evidence."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/README.md"
    session_dedup:
      fingerprint: "sha256:002-incremental-fullscan-recovery-tasks-2026-04-23"
      session_id: "cg-012-002-2026-04-23"
      parent_session_id: "dr-2026-04-23-130100-pt04"
    completion_pct: 0
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->"
---
# Tasks: Code Graph Incremental Fullscan Recovery

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

- [x] T-000 Create Level 3 nested spec folder and strict-validate initial canonical docs (`002-incremental-fullscan-recovery/`) - expected diff: new docs. Evidence: initial `validate.sh --strict` passed with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

| ID | Type | File | Change | Est. diff |
|----|------|------|--------|-----------|
| T-001 | code | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Add `IndexFilesOptions` interface and optional `options` parameter to `indexFiles()`. | <=8 lines |
| T-002 | code | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Use `skipFreshFiles` to conditionally apply `isFileStale()`. | <=2 lines |
| T-003 | code | `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Pass `{ skipFreshFiles: effectiveIncremental }` to `indexFiles()`. | 1 line |
| T-004 | code | `.opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts` | Add `seenSymbolIds` dedupe in `capturesToNodes()`. | <=10 lines |
| T-005 | code | `.opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts` | Add `fullScanRequested` and `effectiveIncremental` to `ScanResult` and response population. | <=6 lines |

- [x] T-001 Add `IndexFilesOptions` interface and optional `options` parameter. Evidence: `structural-indexer.ts` exports `IndexFilesOptions`.
- [x] T-002 Condition stale-gate on `skipFreshFiles`. Evidence: `if (skipFreshFiles && !isFileStale(file)) continue`.
- [x] T-003 Pass `skipFreshFiles: effectiveIncremental` from scan handler. Evidence: `indexFiles(config, { skipFreshFiles: effectiveIncremental })`.
- [x] T-004 Dedupe duplicate capture-derived `symbolId` values. Evidence: `seenSymbolIds` guard in `capturesToNodes()`.
- [x] T-005 Add additive response metadata. Evidence: `ScanResult` includes `fullScanRequested` and `effectiveIncremental`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

| ID | Type | File | Change | Est. diff |
|----|------|------|--------|-----------|
| T-006 | test | `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` | Add `indexFiles` option tests for `skipFreshFiles=false`, `true`, and omitted/default. | ~40 lines |
| T-007 | test | `.opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts` | Add scan handler integration tests for `incremental:false` mode and idempotent counts. | ~30 lines |
| T-008 | test | `.opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts` | Add `capturesToNodes()` dedupe regression tests. | ~20 lines |

- [x] T-006 Add `indexFiles` options tests. Evidence: `structural-contract.vitest.ts` has 3 option cases.
- [x] T-007 Add scan handler integration tests. Evidence: `structural-contract.vitest.ts` has 2 incremental:false cases.
- [x] T-008 Add duplicate-symbol dedupe tests. Evidence: `tree-sitter-parser.vitest.ts` has 3 dedupe cases.
### Build, Docs, and Runtime Verification

| ID | Type | File | Change | Est. diff |
|----|------|------|--------|-----------|
| T-009 | build | `.opencode/skill/system-spec-kit/mcp_server/` | Run `npm run build` and confirm dist output contains new symbols. | N/A |
| T-010 | verify | runtime | Operator restarts MCP and runs live `code_graph_scan({ incremental:false })`. | N/A |
| T-011 | doc | `.opencode/skill/system-spec-kit/mcp_server/code-graph/README.md` | Document response fields and `IndexFilesOptions { skipFreshFiles }`. | ~8 lines |

- [x] T-009 Run `npm run build` and inspect dist for `skipFreshFiles` and `fullScanRequested`. Evidence: build exited 0; dist greps found both tokens.
- [x] T-010 Document post-restart live scan verification as operator-owned. Evidence: implementation summary lists AC-1, AC-4, and AC-5 as post-restart checks.
- [x] T-011 Update code graph README. Evidence: README documents response fields and `IndexFilesOptions`.
- [B] T-012 Run `npx vitest run` from `mcp_server/`. Blocked: full suite fails in out-of-scope `tests/copilot-hook-wiring.vitest.ts`; focused packet tests pass 30/30.
- [x] T-013 Create `implementation-summary.md` with `_memory.continuity`. Evidence: summary file exists with continuity frontmatter.
- [x] T-014 Run final `validate.sh --strict`. Evidence: final validation exited 0 with 0 errors and 0 warnings.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks T-001 through T-009 and T-011 through T-013 marked `[x]`.
- [x] T-010 marked operator-deferred with rationale.
- [ ] No `[B]` blocked tasks remaining.
- [ ] Test and build commands passed.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Record**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Research**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-code-graph-package/003-code-graph-context-and-scan-scope/research/007-deep-review-remediation-pt-04/research.md`

### AI Execution Protocol

#### Pre-Task Checklist
- [x] Read research packet before editing.
- [x] Read each target file before modifying it.
- [x] Confirm no live `code_graph_scan` will run in this Codex session.

#### Execution Rules

| Rule | Description |
|------|-------------|
| TASK-SEQ | Execute T-001 through T-011 in order. |
| TASK-SCOPE | Modify only files listed in `spec.md` scope. |
| TASK-VERIFY | Run vitest, build, dist greps, and strict validation. |

#### Status Reporting Format
Use `T-### [done] - evidence` in the implementation summary.

#### Blocked Task Protocol
If a task is blocked, document the blocker in `implementation-summary.md` and stop before claiming completion.
<!-- /ANCHOR:cross-refs -->
