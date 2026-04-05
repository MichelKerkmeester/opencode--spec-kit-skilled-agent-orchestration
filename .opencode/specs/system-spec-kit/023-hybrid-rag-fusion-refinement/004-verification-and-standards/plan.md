---
title: "Implementation Plan: Verification [system-spec-kit/023-hybrid-rag-fusion-refinement/004-verification-and-standards/plan]"
description: "Highest-risk retests, full verification matrix, and deferred standards-doc sync after ESM runtime proof."
trigger_phrases:
  - "verification plan"
  - "023 phase 4 plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Verification and Standards Sync

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Markdown |
| **Framework** | OpenCode skill workspace, MCP server |
| **Storage** | N/A |
| **Testing** | Root npm gates, workspace tests, Vitest, runtime smokes |

### Overview
Close the ESM migration by running the research-defined verification matrix, re-testing highest-risk recent surfaces first, and syncing deferred standards docs only after runtime proof exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 1-3 complete: all runtime migration work landed
- [x] Verification matrix defined in `../review/deep-review-strategy.md`

### Definition of Done
- [x] Highest-risk recent surfaces re-tested and stable
- [x] Full verification matrix passes
- [x] Standards docs outside 023 updated from verified state
- [x] Parent `implementation-summary.md` closed with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-first approach: prove runtime truth before updating documentation.

### Key Components
- **Verification matrix**: Root gates, workspace builds, Vitest suites, runtime smokes, interop tests
- **Highest-risk surfaces**: memory-save, memory-index, shared-memory, vector-index-store, session-manager, generate-context, workflow
- **Standards docs**: `sk-code-opencode` and related standards surfaces outside 023

### Data Flow
Run highest-risk retests -> run full verification matrix -> pass/fail gate -> only then update standards docs -> close parent packet
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delivery

### Step 1: Highest-Risk Retests
- [x] Re-test `mcp_server/handlers/memory-save.ts` runtime paths
- [x] Re-test `mcp_server/handlers/memory-index.ts` runtime paths
- [x] Re-test `mcp_server/handlers/shared-memory.ts` runtime paths
- [x] Re-test `mcp_server/lib/search/vector-index-store.ts` runtime paths
- [x] Re-test `mcp_server/lib/session/session-manager.ts` runtime paths
- [x] Re-test `scripts/memory/generate-context.ts` runtime paths
- [x] Re-test `scripts/core/workflow.ts` runtime paths

### Step 2: Full Verification Matrix
- [x] `npm run --workspaces=false typecheck`
- [x] `npm run --workspaces=false test:cli`
- [x] `npm run build --workspace=@spec-kit/mcp-server`
- [x] `npm run test --workspace=@spec-kit/mcp-server`
- [x] `npm run test --workspace=@spec-kit/scripts`
- [x] `npx vitest run tests/cli.vitest.ts tests/regression-010-index-large-files.vitest.ts tests/continue-session.vitest.ts`
- [x] `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts`
- [x] `npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts`
- [x] `node dist/context-server.js` startup smoke
- [x] `node scripts/dist/memory/generate-context.js --help`
- [x] `node scripts/tests/test-scripts-modules.js`
- [x] `node scripts/tests/test-export-contracts.js`

### Step 3: Standards-Doc Sync
- [x] Update `sk-code-opencode` standards docs with verified ESM state
- [x] Update any other standards surfaces affected by the ESM migration
- [x] Verify standards docs describe the runtime truth, not planning intent

### Step 4: Packet Closure
- [x] Update parent `implementation-summary.md` with runtime evidence
- [x] Mark all parent verification evidence items in the packet
- [x] Close the parent packet
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command / Proof |
|-----------|-------|-----------------|
| Root gates | Workspace-level | `npm run --workspaces=false typecheck`; `npm run --workspaces=false test:cli` |
| Package builds | Native ESM emit | `npm run build --workspace=@spec-kit/mcp-server` |
| Package tests | Workspace tests | `npm run test --workspace=@spec-kit/mcp-server`; `npm run test --workspace=@spec-kit/scripts` |
| Module Vitest | High-signal suites | `npx vitest run tests/cli.vitest.ts tests/modularization.vitest.ts` + others |
| Runtime smokes | Entrypoint behavior | `node dist/context-server.js`; `node scripts/dist/memory/generate-context.js --help` |
| Scripts interop | Interop proof | `node scripts/tests/test-scripts-modules.js`; `node scripts/tests/test-export-contracts.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1-3 complete | Internal | Must be complete | Cannot verify incomplete migration |
| `../review/deep-review-strategy.md` | Internal | Green | Defines the exact verification matrix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification matrix fails on critical items after all targeted fixes attempted
- **Procedure**: Flag specific failures, revert to last verified state if needed, keep standards docs deferred
<!-- /ANCHOR:rollback -->
