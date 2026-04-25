---
title: "Tasks: Memory Indexer Invariants [system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants/tasks]"
description: "Unified task ledger for both invariant tracks: PE lineage guard + fromScan recheck bypass (Track A), shared index-scope SSOT + multi-layer constitutional-tier enforcement + transactional cleanup CLI (Track B), plus Wave-1 SQL-layer remediation, Wave-2 hardening, and the phase-merge restructure."
trigger_phrases:
  - "026/010 tasks"
  - "memory indexer invariants tasks"
  - "index scope invariants tasks"
  - "constitutional tier cleanup tasks"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/005-memory-indexer-invariants"
    last_updated_at: "2026-04-24T19:25:00+02:00"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Merged Track A and Track B tasks into root ledger"
    next_safe_action: "Restart MCP and rerun memory_index_scan on 026/009 to close Track A live acceptance"
    blockers:
      - "Track A live MCP rescan on 026/009 still pending"
    completion_pct: 95
    status: "code-complete-pending-track-a-live-rescan"
    open_questions: []
    answered_questions: []
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->"
---
# Task Breakdown: Memory Indexer Invariants

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level3-arch | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence in `checklist.md` or `implementation-summary.md` |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

### AI Execution Protocol

**Pre-Task Checklist**
- Re-read each runtime file immediately before patching it.
- Keep edits inside this packet, `mcp_server/`, `scripts/memory/`, and the 026 parent metadata.
- Run packet validation, focused tests, and cleanup verify before marking a task complete.

**Execution Rules**

| Rule ID | Rule | Why |
|---------|------|-----|
| TASK-SEQ-A | Track A Fix A lands before Fix B (canonical path plumbing → A2 guard → fromScan wiring). | A2 depends on `canonical_file_path` being available in `SimilarMemory`. |
| TASK-SEQ-B | Track B shared helper lands before scanner and save-path callers. | Prevents policy drift from reappearing during the patch sequence. |
| TASK-SCOPE | Track A and Track B edits share `memory-save.ts`; re-read before each patch. | Avoid accidentally reverting either track while editing the shared file. |
| TASK-DB | Every cleanup mutation runs inside one SQLite transaction; `--apply` rebuilds its plan inside the transaction. | Prevents partial cleanup states and TOCTOU gaps. |
| TASK-VERIFY | Record exact exit codes and before/after counts in `implementation-summary.md` and `checklist.md`. | Keeps verification auditable. |

**Status Reporting Format**
- Start state: which track and runtime surface is being changed.
- Work state: which invariant, remediation wave, or cleanup pass is active.
- End state: validation / tests / cleanup outcome — passing, pending, or blocked.

**Blocked Task Protocol**
- Mark a task `[B]` if a schema relationship or DB reference cannot be updated safely.
- Stop the cleanup apply path on the first SQL error and preserve rollback.
- Record blockers in `implementation-summary.md` before continuing elsewhere.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Investigation and Baseline

- [x] **T-01** Read `/tmp/codex-lineage-investigation-output.txt` and confirm Track A root causes. [EVIDENCE: investigation summary matches the PE lineage path and the scan-recheck race.]
- [x] **T-02** Read the live code paths before editing: PE gating, prediction-error decision logic, scan batching, reconsolidation bridge, save-time transaction flow, memory discovery, spec-doc classification, code-graph walkers. [EVIDENCE: `pe-gating.ts`, `prediction-error-gate.ts`, `memory-index.ts`, `reconsolidation-bridge.ts`, `memory-save.ts`, `memory-index-discovery.ts`, `spec-doc-paths.ts`, `structural-indexer.ts`.]
- [x] **T-03** Live-inspect the Voyage-4 DB for Track B baseline counts. [EVIDENCE: 5700 constitutional / 2 in-folder / 5947 z_future / 0 external / duplicate gate-enforcement rule file at ids 1 + 9868.]
- [x] **T-04** Create shared index-scope helper for memory and code graph. [EVIDENCE: `mcp_server/lib/utils/index-scope.ts` with `shouldIndexForMemory`, `shouldIndexForCodeGraph`, `EXCLUDED_FOR_MEMORY`.]
- [x] **T-05** Create realpath canonicalization helper. [EVIDENCE: `mcp_server/lib/utils/canonical-path.ts` wraps `fs.realpathSync` with fail-open fallback.]
- [x] **T-06** Centralize governance-audit action strings and helpers. [EVIDENCE: `mcp_server/lib/governance/scope-governance.ts` exports `GOVERNANCE_AUDIT_ACTIONS`, `recordTierDowngradeAudit()`, `buildGovernanceLogicalKey()`.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Track A — Lineage and Concurrency

- [x] **T-10** Add canonical path plumbing to `SimilarMemory` so PE orchestration can reason about same-file identity. [EVIDENCE: `handlers/save/types.ts`, `handlers/pe-gating.ts`.]
- [x] **T-11** Implement Fix A with A2: downgrade cross-file `UPDATE` and `REINFORCE` decisions to `CREATE` in PE orchestration. [EVIDENCE: `handlers/save/pe-orchestration.ts`.]
- [x] **T-12** Roll back Fix B1 by removing the forced `scanBatchSize = 1` override. [EVIDENCE: `handlers/memory-index.ts` uses `BATCH_SIZE`.]
- [x] **T-13** Implement Fix B2: mark scan-originated saves with `fromScan: true` and skip the transactional reconsolidation recheck only for those saves. [EVIDENCE: `handlers/memory-index.ts`, `handlers/memory-save.ts`.]

### Track B — Baseline Invariants

- [x] **T-20** Wire memory discovery and spec-doc classification to the shared helper. [EVIDENCE: `handlers/memory-index-discovery.ts`, `lib/config/spec-doc-paths.ts`.]
- [x] **T-21** Align `isMemoryFile()` with the rule-file-only constitutional policy. [EVIDENCE: `lib/parsing/memory-parser.ts`.]
- [x] **T-22** Add save-time path rejection and constitutional-tier downgrade. [EVIDENCE: `handlers/memory-save.ts`.]
- [x] **T-23** [P] Wire code-graph recursive and specific-file scanning to the shared helper while preserving existing excludes. [EVIDENCE: `code-graph/lib/structural-indexer.ts`, `code-graph/lib/indexer-types.ts`.]
- [x] **T-24** [P] Add cleanup CLI with dry-run, apply, and verify modes. [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts`.]

### Track B — Wave-1 Storage-Layer Remediation

- [x] **T-30** Hoist the constitutional-tier guard into SQL-layer update writes. [EVIDENCE: `lib/search/vector-index-mutations.ts`.]
- [x] **T-31** Protect post-insert metadata tier writes. [EVIDENCE: `lib/storage/post-insert-metadata.ts`.]
- [x] **T-32** Re-assert index-scope and constitutional-tier invariants during checkpoint restore inside the barrier-held transaction. [EVIDENCE: `lib/storage/checkpoints.ts`.]
- [x] **T-33** Emit durable `governance_audit` rows for non-constitutional tier downgrade attempts without failing the write path. [EVIDENCE: `handlers/memory-save.ts`, `lib/search/vector-index-mutations.ts`, `lib/storage/checkpoints.ts` emit `action='tier_downgrade_non_constitutional_path'`.]

### Track B — Wave-2 Hardening

- [x] **T-40** Close the cleanup-script audit gap: retain historical `governance_audit` rows for deleted memories; emit `tier_downgrade_non_constitutional_path_cleanup` per downgraded row. [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts`.]
- [x] **T-41** Collapse spec-doc exclusion drift onto `index-scope.ts` as SSOT; prove the helper drives classification + discovery. [EVIDENCE: `lib/config/spec-doc-paths.ts`, `handlers/memory-index-discovery.ts`.]
- [x] **T-42** Harden save-time and code-graph `specificFiles` checks with `fs.realpathSync` canonicalization. [EVIDENCE: `handlers/memory-save.ts`, `code-graph/lib/structural-indexer.ts`.]
- [x] **T-43** Move cleanup apply planning onto the transaction snapshot; add walker DoS caps for `.gitignore` size, depth, and node count. [EVIDENCE: `scripts/memory/cleanup-index-scope-violations.ts`, `handlers/memory-index-discovery.ts`, `code-graph/lib/structural-indexer.ts`.]
- [x] **T-44** Extend `constitutional → critical` update auditing and refresh operator + spec docs. [EVIDENCE: `handlers/memory-crud-update.ts`, `api/index.ts`, `.opencode/skill/system-spec-kit/mcp_server/README.md`.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Focused Test Coverage

- [x] **T-50** Add Fix A regression for `tasks.md` vs sibling checklist. [EVIDENCE: `tests/pe-orchestration.vitest.ts`.]
- [x] **T-51** Replace the old B1 scan serialization test with B2 coverage for `fromScan` propagation and the non-scan control path. [EVIDENCE: `tests/handler-memory-index.vitest.ts`.]
- [x] **T-52** [P] Add focused exclusion and constitutional-tier Vitest coverage. [EVIDENCE: `tests/index-scope.vitest.ts`, `tests/memory-save-index-scope.vitest.ts`.]
- [x] **T-53** [P] Add SQL-layer update + checkpoint-restore invariant coverage. [EVIDENCE: `tests/memory-crud-update-constitutional-guard.vitest.ts`, `tests/checkpoint-restore-invariant-enforcement.vitest.ts`.]
- [x] **T-54** [P] Add Wave-2 coverage for cleanup audits, SSOT unification, realpath, walker DoS caps, and governance helpers. [EVIDENCE: `tests/cleanup-script-audit-emission.vitest.ts`, `tests/exclusion-ssot-unification.vitest.ts`, `tests/symlink-realpath-hardening.vitest.ts`, `tests/walker-dos-caps.vitest.ts`, `tests/memory-governance.vitest.ts`.]

### Build and Suite

- [x] **T-60** Run `npm run typecheck` and `npm run build` for `mcp_server` and `scripts`. [EVIDENCE: all four exit `0`.]
- [x] **T-61** Run the Track A focused regression pair. [EVIDENCE: `26/26` passed.]
- [x] **T-62** Run the Wave-2 focused Vitest set. [EVIDENCE: `20/20` passed across 8 files.]
- [x] **T-63** Run the README-regression set. [EVIDENCE: `218/218` passed across 4 files.]
- [x] **T-64** Run `timeout 300 npm run test:core` and record carryover failures honestly. [EVIDENCE: exit `124`; unrelated failures in `tests/copilot-hook-wiring.vitest.ts` and `tests/stage3-rerank-regression.vitest.ts` reproduced in isolation.]
- [x] **T-65** Run packet strict validation. [EVIDENCE: `validate.sh --strict --no-recursive` exit `0`.]

### Live Cleanup

- [x] **T-70** Run cleanup dry-run / apply / verify against the Voyage-4 DB. [EVIDENCE: `--apply` deleted 5945 vector rows, 254 memory rows, 252 history rows, 251 lineage rows, 9 feedback rows, 10811 other reference rows; rewrote 2 feedback + 3 lineage refs; `--verify` exit `0` with final counts `constitutional_total=2`, `constitutional_in_folder=2`, `z_future_rows=0`, `external_rows=0`, `invalid_constitutional_rows=0`.]
- [x] **T-71** Update operator README with invariants, helper location, and stable governance-audit action strings. [EVIDENCE: `.opencode/skill/system-spec-kit/mcp_server/README.md` "Index Scope Invariants" section.]

### Root Merge Restructure

- [x] **T-80** Merge Track A and Track B phase docs into root `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`. [EVIDENCE: root docs rewritten with consolidated context; no copy/paste.]
- [x] **T-81** Update root `description.json` and `graph-metadata.json` to reflect merged state (no children). [EVIDENCE: `children_ids=[]`, merged `key_files`, `trigger_phrases`, and `entities`.]
- [x] **T-82** Remove `001-memory-indexer-lineage-and-concurrency-fix/` and `002-index-scope-and-constitutional-tier-invariants/` phase folders. [EVIDENCE: `git rm -r`.]
- [x] **T-83** Add legacy-path aliases to `graph-metadata.json.aliases` so external cross-references keep resolving. [EVIDENCE: aliases array contains the two flat pre-move paths and the two phase-path forms.]

### Pending Live Acceptance

- [ ] **T-90** Restart MCP, rerun `memory_index_scan` on `026/010-hook-parity`, and confirm zero `E_LINEAGE` plus zero `candidate_changed`. (BLOCKED: requires user restart + live embedding-capable runtime.)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All Track A code changes landed with regression coverage
- [x] All Track B invariants enforced at every mutation surface (discovery, save, SQL update, post-insert, checkpoint restore, code-graph scan)
- [x] Wave-1 + Wave-2 remediations merged with focused tests
- [x] Cleanup CLI dry-run / apply / verify exited `0` against the live DB
- [x] Operator README + spec docs reflect the final invariant set
- [x] Phase folders merged into root docs
- [ ] Track A live MCP rescan on `026/010-hook-parity` — pending user restart + embedding-capable runtime
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Investigation Source**: `/tmp/codex-lineage-investigation-output.txt`
<!-- /ANCHOR:cross-refs -->
