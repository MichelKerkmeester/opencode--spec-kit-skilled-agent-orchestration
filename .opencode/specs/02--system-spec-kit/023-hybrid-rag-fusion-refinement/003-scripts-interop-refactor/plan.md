---
title: "Implementation Plan: Scripts Interop [02--system-spec-kit/023-hybrid-rag-fusion-refinement/003-scripts-interop-refactor/plan]"
description: "CJS-to-ESM interoperability helpers, scripts-side consumer refactors, and test rewrites for @spec-kit/scripts."
trigger_phrases:
  - "scripts interop plan"
  - "023 phase 3 plan"
importance_tier: "important"
contextType: "planning"
---
# Implementation Plan: Scripts Interop Refactor

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js (CommonJS package consuming ESM) |
| **Framework** | OpenCode scripts workspace (npm workspaces) |
| **Storage** | N/A |
| **Testing** | Vitest, Node runtime smokes, scripts interop tests |

### Overview
Refactor `@spec-kit/scripts` to cross the CJS-to-ESM boundary with explicit `import()` helpers rather than `require()`. This is the dual-build decision gate: if the bounded interop refactor proves too invasive, dual-build for `shared`/`mcp_server` becomes the fallback.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phases 1-2 complete: both `shared` and `mcp_server` emit native ESM
- [x] Research locked the scripts interop strategy

### Definition of Done
- [x] `scripts/package.json` still declares `"type": "commonjs"`
- [x] All scripts-side consumers of ESM siblings use explicit `import()` interop
- [x] `node scripts/dist/memory/generate-context.js --help` passes
- [x] Module-sensitive tests rewritten for ESM runtime truth
- [x] Scripts interop tests pass
- [x] Dual-build decision documented if interop was too invasive
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
CommonJS package with explicit async `import()` bridges to ESM sibling packages.

### Key Components
- **`scripts/lib/esm-interop.ts`**: Central interop helper providing typed `import()` wrappers
- **`scripts/memory/generate-context.ts`**: Primary CLI consumer of shared/mcp-server APIs
- **`scripts/core/workflow.ts`**: Core workflow engine consuming shared utilities
- **`scripts/tests/`**: Module-sensitive and interop-specific test suites

### Data Flow
`scripts` CJS runtime -> `esm-interop.ts` (async `import()`) -> `@spec-kit/shared` ESM + `@spec-kit/mcp-server/api*` ESM -> results flow back through Promise resolution
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Delivery

### Step 1: Create Interop Helper
- [x] Create `scripts/lib/esm-interop.ts` with typed dynamic `import()` wrappers
- [x] Export helper functions for `@spec-kit/shared` and `@spec-kit/mcp-server/api*` surfaces
- [x] Handle async loading pattern (Promise-based)

### Step 2: Refactor Scripts-Side Consumers
- [x] Audit all 20 scripts files that consume ESM siblings
- [x] Replace `require('@spec-kit/shared/...')` with interop helper calls
- [x] Replace `require('@spec-kit/mcp-server/api...')` with interop helper calls
- [x] Ensure all call sites correctly `await` the async import results
- [x] If >50% of files need deep restructuring, escalate to dual-build decision

### Step 3: Rewrite Module-Sensitive Tests
- [x] Rewrite tests asserting CommonJS output details to ESM-truth assertions
- [x] Update `modularization.vitest.ts`, `trigger-config-extended.vitest.ts`
- [x] Update `scripts/tests/test-integration.vitest.ts`, `architecture-boundary-enforcement.vitest.ts`

### Step 4: Add Scripts Interop Tests
- [x] Add or update `scripts/tests/test-scripts-modules.js`
- [x] Add or update `scripts/tests/test-export-contracts.js`
- [x] Test failing paths (missing modules, version mismatches)

### Step 5: Runtime Verification
- [x] Run `node scripts/dist/memory/generate-context.js --help`
- [x] Run `npm run test --workspace=@spec-kit/scripts`
- [x] Run module-sensitive Vitest suites
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command / Proof |
|-----------|-------|-----------------|
| CLI smoke | Primary scripts surface | `node scripts/dist/memory/generate-context.js --help` |
| Package tests | Scripts workspace | `npm run test --workspace=@spec-kit/scripts` |
| Module Vitest | ESM-truth assertions | `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts` |
| Integration Vitest | Scripts integration | `npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts` |
| Interop tests | Interop helpers specifically | `node scripts/tests/test-scripts-modules.js`; `node scripts/tests/test-export-contracts.js` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 1-2 (ESM siblings) | Internal | Must be complete | Cannot test interop without ESM packages |
| Parent research | Internal | Green | Defines the dual-build fallback trigger |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Interop refactor proves materially too invasive (>50% deep restructuring)
- **Procedure**: Revert scripts interop changes; escalate to dual-build/conditional-exports for `shared` and `mcp_server` as fallback strategy per parent research
<!-- /ANCHOR:rollback -->
