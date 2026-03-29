---
title: "Implementation Plan: Verification and Standards Sync"
description: "Highest-risk retests, full verification matrix, and deferred standards-doc sync after ESM runtime proof."
trigger_phrases:
  - "verification plan"
  - "023 phase 4 plan"
importance_tier: "standard"
contextType: "architecture"
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
- [x] Verification matrix defined in `../research/research.md`

### Definition of Done
- [ ] Highest-risk recent surfaces re-tested and stable
- [ ] Full verification matrix passes
- [ ] Standards docs outside 023 updated from verified state
- [ ] Parent `implementation-summary.md` and `checklist.md` closed with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification-first approach: prove runtime truth before updating documentation.

### Key Components
- **Verification matrix**: Root gates, workspace builds, Vitest suites, runtime smokes, interop tests
- **Highest-risk surfaces**: memory-save, memory-index, shared-memory, vector-index-store, session-manager, generate-context, workflow
- **Standards docs**: `sk-code--opencode` and related standards surfaces outside 023

### Data Flow
Run highest-risk retests -> run full verification matrix -> pass/fail gate -> only then update standards docs -> close parent packet
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Step 1: Highest-Risk Retests
- [ ] Re-test `mcp_server/handlers/memory-save.ts` runtime paths
- [ ] Re-test `mcp_server/handlers/memory-index.ts` runtime paths
- [ ] Re-test `mcp_server/handlers/shared-memory.ts` runtime paths
- [ ] Re-test `mcp_server/lib/search/vector-index-store.ts` runtime paths
- [ ] Re-test `mcp_server/lib/session/session-manager.ts` runtime paths
- [ ] Re-test `scripts/memory/generate-context.ts` runtime paths
- [ ] Re-test `scripts/core/workflow.ts` runtime paths

### Step 2: Full Verification Matrix
- [ ] `npm run --workspaces=false typecheck`
- [ ] `npm run --workspaces=false test:cli`
- [ ] `npm run build --workspace=@spec-kit/mcp-server`
- [ ] `npm run test --workspace=@spec-kit/mcp-server`
- [ ] `npm run test --workspace=@spec-kit/scripts`
- [ ] `npx vitest run tests/cli.vitest.ts tests/regression-010-index-large-files.vitest.ts tests/continue-session.vitest.ts`
- [ ] `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts`
- [ ] `npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts`
- [ ] `node dist/context-server.js` startup smoke
- [ ] `node scripts/dist/memory/generate-context.js --help`
- [ ] `node scripts/tests/test-scripts-modules.js`
- [ ] `node scripts/tests/test-export-contracts.js`

### Step 3: Standards-Doc Sync
- [ ] Update `sk-code--opencode` standards docs with verified ESM state
- [ ] Update any other standards surfaces affected by the ESM migration
- [ ] Verify standards docs describe the runtime truth, not planning intent

### Step 4: Packet Closure
- [ ] Update parent `implementation-summary.md` with runtime evidence
- [ ] Mark all parent `checklist.md` items with verification evidence
- [ ] Close the parent packet
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
| `../research/research.md` | Internal | Green | Defines the exact verification matrix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Verification matrix fails on critical items after all targeted fixes attempted
- **Procedure**: Flag specific failures, revert to last verified state if needed, keep standards docs deferred
<!-- /ANCHOR:rollback -->
