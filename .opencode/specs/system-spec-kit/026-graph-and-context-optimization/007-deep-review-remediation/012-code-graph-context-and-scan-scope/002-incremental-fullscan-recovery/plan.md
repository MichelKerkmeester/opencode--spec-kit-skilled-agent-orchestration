---
template_source_marker: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
title: "Implementation Plan: Code Graph Incremental Fullscan Recovery"
description: "Implement a minimal code graph remediation by threading scan mode into the indexer, deduping duplicate symbol IDs, adding response observability, and validating with vitest plus build output."
trigger_phrases:
  - "incremental fullscan plan"
  - "code graph stale gate plan"
  - "IndexFilesOptions plan"
  - "012/002 plan"
importance_tier: "critical"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-deep-review-remediation/012-code-graph-context-and-scan-scope/002-incremental-fullscan-recovery"
    last_updated_at: "2026-04-23T00:00:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Created implementation plan from deep research tasks T-001 through T-011."
    next_safe_action: "Apply T-001 through T-005 source patches, then add T-006 through T-008 tests."
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/lib/structural-indexer.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/code-graph/handlers/scan.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/structural-contract.vitest.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/tests/tree-sitter-parser.vitest.ts"
    session_dedup:
      fingerprint: "sha256:002-incremental-fullscan-recovery-plan-2026-04-23"
      session_id: "cg-012-002-2026-04-23"
      parent_session_id: "dr-2026-04-23-130100-pt04"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Incremental Fullscan Recovery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js 20+ |
| **Framework** | MCP server handlers, vitest |
| **Storage** | SQLite via `better-sqlite3` |
| **Testing** | `npx vitest run`, `npm run build` |

### Overview
The implementation adds a small indexer options API so the scan handler can distinguish incremental stale-only parsing from explicit full scans. It also dedupes capture-derived symbols before persistence and documents the additive scan response metadata that makes the effective mode observable.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable through AC-1 through AC-8.
- [x] Dependencies identified, including post-restart operator scan.

### Definition of Done
- [ ] T-001 through T-011 completed or explicitly marked operator-deferred.
- [ ] `validate.sh <spec-folder> --strict` exits 0 after creation and completion.
- [ ] `npx vitest run` exits 0 from `mcp_server/`.
- [ ] `npm run build` exits 0 from `mcp_server/`.
- [ ] Dist files contain `skipFreshFiles` and `fullScanRequested`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small API extension with caller-owned mode selection.

### Key Components
- **`indexFiles()`**: Owns file discovery and parse filtering. It gains `IndexFilesOptions` with `skipFreshFiles` defaulting to `true`.
- **`handleCodeGraphScan()`**: Owns scan-mode derivation. It passes `effectiveIncremental` into the indexer and adds response metadata.
- **`capturesToNodes()`**: Owns capture-to-node conversion. It prevents duplicate `symbolId` values before DB persistence.

### Data Flow
`code_graph_scan` computes `incremental`, `fullReindexTriggered`, and `effectiveIncremental`; the handler passes `{ skipFreshFiles: effectiveIncremental }` to `indexFiles()`. The indexer walks the post-exclude file set, optionally skips fresh files, parses each selected file, converts captures into unique nodes, then the handler persists nodes and edges.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Documentation Setup
- [x] Create nested Level 3 packet.
- [x] Populate spec, plan, tasks, checklist, decision record, description, and graph metadata.
- [ ] Validate the packet strictly.

### Phase 2: Source Patch
- [ ] T-001 Add `IndexFilesOptions`.
- [ ] T-002 Condition stale-gate on `skipFreshFiles`.
- [ ] T-003 Pass `skipFreshFiles: effectiveIncremental`.
- [ ] T-004 Dedupe duplicate capture symbol IDs.
- [ ] T-005 Add scan response fields.

### Phase 3: Tests and Docs
- [ ] T-006 Add `indexFiles` option tests.
- [ ] T-007 Add scan handler integration tests.
- [ ] T-008 Add `capturesToNodes()` dedupe tests.
- [ ] T-011 Update code graph README.

### Phase 4: Verification and Summary
- [ ] T-009 Run build.
- [ ] T-010 Mark live scan as operator verification after restart.
- [ ] Create implementation summary with continuity frontmatter.
- [ ] Run final strict spec validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `indexFiles()` stale skip behavior and `capturesToNodes()` dedupe | Vitest |
| Integration | `handleCodeGraphScan({ incremental:false })` mode propagation and response shape | Vitest with mocks |
| Build | TypeScript dist output | `npm run build` |
| Manual | Live scan scale and idempotence after MCP restart | Operator-run MCP tools |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Deep research packet | Internal | Green | Implementation would lack root-cause evidence. |
| MCP server restart | Operational | Yellow | AC-1, AC-4, and AC-5 remain unverified in this run. |
| Local node modules | Internal | Green unless tests reveal missing deps | Vitest/build cannot run without installed dependencies. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Vitest/build failures that cannot be resolved within the scoped files, or operator scan shows a worse regression after restart.
- **Procedure**: Revert this packet's source/test/doc changes as a single conventional commit revert or patch reversal. Existing `fullReindexTriggered` behavior is untouched, so rollback is limited to the new option, dedupe guard, tests, README, and packet docs.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Docs setup -> Source patch -> Tests/docs -> Build -> Summary
                                  |
                                  v
                         Post-restart operator scan
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Docs setup | Research packet | Source patch |
| Source patch | Target file reads | Tests, build |
| Tests/docs | Source patch | Build confidence |
| Build | Source patch | Dist verification |
| Summary | Verification outputs | Final packet validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Documentation Setup | Medium | 30-45 minutes |
| Core Implementation | Medium | 30-60 minutes |
| Verification | Medium | 30-90 minutes |
| **Total** | | **1.5-3.25 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No database migrations.
- [x] No VACUUM operation.
- [x] Response field changes are additive.

### Rollback Procedure
1. Revert modifications in `structural-indexer.ts` and `scan.ts`.
2. Revert new vitest additions.
3. Revert README additions.
4. Rebuild with `npm run build`.
5. Re-run `npx vitest run`.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
T-001 -> T-002 -> T-003 -> T-007
              \          \
               \          -> T-005 -> T-011
                \
                 -> T-006

T-004 -> T-008

T-006/T-007/T-008/T-011 -> T-009 -> summary -> final validation
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Indexer option | Research F1 | `IndexFilesOptions` | Scan handler mode propagation |
| Scan handler | Indexer option | Full-scan mode propagation and response metadata | Scan integration tests |
| Dedupe guard | Research F2 | Unique capture-derived nodes | Dedupe regression tests |
| Tests | Source patch | Regression evidence | Build/summary confidence |
| README | Source patch | Operator-facing contract | Final completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **T-001/T-002** - Add indexer option and conditional stale-gate - CRITICAL
2. **T-003/T-005** - Propagate mode and expose response fields - CRITICAL
3. **T-004** - Dedupe duplicate symbol IDs - CRITICAL
4. **T-006/T-007/T-008** - Add regression coverage - CRITICAL
5. **T-009** - Build dist and inspect symbols - CRITICAL

**Total Critical Path**: One continuous implementation pass.

**Parallel Opportunities**:
- README update can happen after source patch while tests are being prepared.
- Post-restart live scan is separate operator work after this run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet Initialized | Strict validation passes after doc creation | Phase 1 |
| M2 | Source Fixed | Grep finds `skipFreshFiles`, `seenSymbolIds`, `fullScanRequested` | Phase 2 |
| M3 | Regression Net | Vitest exits 0 with new tests included | Phase 3 |
| M4 | Build Ready | Dist files contain new symbols | Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decision details live in `decision-record.md`:
- ADR-001: Option A dedupe vs line-suffixed IDs vs parser-layer fix.
- ADR-002: Supplement scan response fields instead of renaming `fullReindexTriggered`.
