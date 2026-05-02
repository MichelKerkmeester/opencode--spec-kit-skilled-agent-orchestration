---
title: "Implementation Plan: Broader Default Excludes and Granular Skills"
description: "Extends the code-graph scope policy, consumers, schemas, tests, and docs for broader defaults and selected skill inclusion."
trigger_phrases:
  - "broader default excludes"
  - "granular skill selection"
  - "code graph scope policy"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "026/007/011"
    last_updated_at: "2026-05-02T19:50:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented scope policy and test matrix"
    next_safe_action: "Ready for final handoff"
    blockers: []
    key_files:
      - ".opencode/skill/system-spec-kit/mcp_server/code_graph/lib/index-scope-policy.ts"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/utils/index-scope.ts"
    session_dedup:
      fingerprint: "sha256:2222222222222222222222222222222222222222222222222222222222222222"
      session_id: "026-007-011-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Broader Default Excludes and Granular Skills

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, NodeNext ESM |
| **Framework** | Vitest |
| **Storage** | SQLite metadata via existing code graph DB |
| **Testing** | Focused Vitest, full code-graph Vitest, strict spec validation |

### Overview
Centralize scope decisions in `index-scope-policy.ts`, keep `getDefaultConfig()` and `shouldIndexForCodeGraph()` as the two scan-time consumers, and let status/readiness compare the new v2 fingerprint. Public and runtime schemas must move together so API validation does not drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Dependencies identified.

### Definition of Done
- [x] Gates A-D pass.
- [ ] Checklist marked with evidence.
- [x] Docs updated.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared policy resolver with handler, walker, DB, readiness, schema and doc consumers.

### Key Components
- **Policy resolver**: Parses per-call args and env vars, returns booleans, selected skill list, labels and v2 fingerprint.
- **Walker gate**: Applies broad folder exclusions and selected skill-name matching after path normalization.
- **Scan/status handlers**: Pass args into policy and surface active scope.
- **Schema pair**: Keeps public schema and Zod runtime validation aligned.

### Data Flow
Scan args plus env vars feed `resolveIndexScopePolicy()`. The resulting policy controls default globs and final path eligibility, then the scan stores the v2 fingerprint for readiness and status comparisons.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `index-scope-policy.ts` | Producer for env, labels, fingerprints, excluded globs. | Updated for five folders, skill lists, v2 parser. | `code-graph-indexer.vitest.ts` matrix. |
| `indexer-types.ts` | Consumer building default exclude globs. | Reads all excluded glob fields. | Config tests. |
| `index-scope.ts` | Consumer enforcing final path decisions. | Handles five folders and selected skills. | Walker tests and indexer fixtures. |
| `scan.ts` | Consumer of per-call args. | Passes new args to resolver. | `code-graph-scan.vitest.ts`. |
| `status.ts` | Consumer exposing active scope. | Adds expanded included fields. | Status assertion in scan tests. |
| `code-graph-db.ts` | Consumer parsing stored fingerprint. | Returns expanded stored scope. | Readiness round-trip test. |
| `ensure-ready.ts` | Consumer comparing active vs stored scope. | Existing comparison uses v2 parser and treats v1 as mismatch. | v1 migration test. |
| Schemas | Public/runtime input contract. | Added union/list and folder booleans. | `tool-input-schema.vitest.ts`. |
| Docs | Operator guidance. | Updated README and env reference. | Strict validation plus doc grep. |

Required inventories:
- Same-class producers: `rg -n ".opencode/(skill|agent|command|specs|plugins)" .opencode/skill/system-spec-kit/mcp_server/ --type ts`.
- Consumers: `rg -n "resolveIndexScopePolicy|IndexScopePolicy|excludedSkillGlobs" .opencode/skill/system-spec-kit/mcp_server/ --type ts`.
- Matrix axes: five folders x default/env/per-call, plus skills boolean true/list/env csv/empty list.
- Algorithm invariant: skill-list fingerprint sorts selected skill names before serialization.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Locate current 009 scope policy implementation.
- [x] Run R5 inventories for same-class producers and consumers.

### Phase 2: Core Implementation
- [x] Extend resolver, env vars, default globs, and v2 fingerprints.
- [x] Extend walker, default config, DB stored-scope read, scan args and status payload.
- [x] Extend public and runtime schemas.
- [x] Update docs.

### Phase 3: Verification
- [x] Focused tests pass.
- [x] Full code-graph regression passes.
- [x] Workflow-invariance passes.
- [x] 009 and 011 strict validates pass after checklist evidence is marked.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Policy resolver, walker, fingerprint parser. | Vitest |
| Integration | Scan/status and readiness behavior. | Vitest |
| Schema | Public and runtime tool input validation. | Vitest |
| Docs | Packet strict validation. | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing 009 scope policy | Internal | Green | Provides storage and readiness baseline. |
| Vitest config | Internal | Green | Required for Gates A-C. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Scope policy causes scan/readiness regression.
- **Procedure**: Revert 011 code changes and rerun Gates A-D; v1 DB rows will remain migratable by the pre-011 policy.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inventory -> Policy/Schema -> Consumers -> Tests -> Docs -> Gates
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Policy, tests |
| Policy/Schema | Inventory | Consumers |
| Consumers | Policy/Schema | Tests |
| Tests | Consumers | Gates |
| Docs | Policy/Schema | Strict validation |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | 15 minutes |
| Core Implementation | Medium | 60 minutes |
| Verification | Medium | 30 minutes |
| **Total** | | **~105 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Stay on `main`.
- [x] Avoid commits.
- [x] Preserve 009 strict validation.

### Rollback Procedure
1. Revert files touched by 011.
2. Rerun focused tests.
3. Rerun strict validation for 009 and 011 if the packet folder remains.

### Data Reversal
- **Has data migrations?** No schema migration. Scope fingerprint v2 changes read behavior until a full scan stores v2.
- **Reversal procedure**: Delete v2 rows only if explicitly testing local DB state; no repo data migration required.
<!-- /ANCHOR:enhanced-rollback -->
