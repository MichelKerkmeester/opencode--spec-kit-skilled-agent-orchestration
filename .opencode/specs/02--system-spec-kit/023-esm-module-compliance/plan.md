---
title: "Implementation Plan: ESM Module Compliance"
description: "Research-ordered implementation plan for the pending shared plus mcp_server native ESM migration, with scripts retained as CommonJS and standards docs deferred until runtime proof."
trigger_phrases:
  - "esm plan"
  - "mcp_server esm migration plan"
importance_tier: "standard"
contextType: "architecture"
---
# Implementation Plan: ESM Module Compliance

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, JavaScript, Node.js, Markdown |
| **Framework** | OpenCode skill workspace plus MCP server runtime |
| **Storage** | N/A |
| **Testing** | Root `npm` gates, workspace builds/tests, targeted Vitest, runtime smokes, spec validation |

### Overview
This plan follows the completed 20-iteration research in `research/research.md`. The first pass is a coordinated package-local native ESM migration for `@spec-kit/shared` and `@spec-kit/mcp-server`, while `@spec-kit/scripts` remains a CommonJS package and crosses the new module boundary through explicit dynamic-import interoperability helpers. Dual-build or conditional-exports is not the first-pass approach and is only reconsidered if the bounded scripts interop refactor proves materially too invasive.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research has locked the first-pass strategy in `research/research.md`
- [x] The packet scope excludes converting `@spec-kit/scripts` to package-level ESM
- [x] Standards-doc updates outside 023 are deferred until runtime verification passes

### Definition of Done
- [ ] `@spec-kit/shared` and `@spec-kit/mcp-server` both emit truthful native ESM
- [ ] `@spec-kit/scripts` remains CommonJS and proves interoperability through explicit dynamic imports
- [ ] The required verification matrix passes, including runtime smokes and highest-risk retests first
- [ ] Follow-on standards docs are updated only after runtime proof exists
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Coordinated sibling-package ESM migration with an explicit CommonJS-to-ESM interoperability boundary

### Key Components
- **Shared package boundary**: `.opencode/skill/system-spec-kit/shared/{package.json,tsconfig.json,src}`
- **MCP server package boundary**: `.opencode/skill/system-spec-kit/mcp_server/{package.json,tsconfig.json,lib,handlers,tests}`
- **Scripts CommonJS boundary**: `.opencode/skill/system-spec-kit/scripts/{package.json,dist,src,tests}`
- **Verification entrypoints**: `dist/context-server.js`, `scripts/dist/memory/generate-context.js`, module-sensitive Vitest suites, targeted scripts interop tests
- **Deferred standards surfaces**: `sk-code--opencode` and any related standards docs outside this packet

### Data Flow
`shared` source plus package metadata -> package-local ESM emit -> `mcp_server` source plus package metadata -> package-local ESM emit -> `scripts` CommonJS loaders call explicit dynamic `import()` boundaries -> runtime smokes and targeted retests -> only then standards-doc sync
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Doc Lock and Decision Freeze
- [x] Sync the packet to the finished 20-iteration research
- [x] Lock the strategy: `shared` plus `mcp_server` migrate together, `scripts` stays CommonJS, dual-build remains fallback-only
- [x] Keep standards-doc updates outside 023 deferred until runtime proof passes

### Phase 1: `@spec-kit/shared` ESM Package-Config Migration
- [ ] Update `shared/package.json` to truthful native ESM package metadata and exports
- [ ] Apply package-local TypeScript settings that emit native ESM without forcing the whole workspace to flip
- [ ] Rewrite production imports and exports in `shared` to runtime-valid ESM specifiers

### Phase 2: `@spec-kit/mcp-server` ESM Package-Config Migration
- [ ] Update `mcp_server/package.json` `type`, `main`, `exports`, and `bin` for native ESM
- [ ] Apply package-local TypeScript settings that match the chosen native ESM runtime
- [ ] Rewrite production imports and exports and replace CommonJS-only globals, hard-coded dist path assumptions, and cross-package relative hops

### Phase 3: `@spec-kit/scripts` CommonJS-to-ESM Interop Refactor
- [ ] Keep `scripts/package.json` CommonJS
- [ ] Replace scripts-side direct CommonJS consumption of ESM siblings with explicit dynamic-import interoperability helpers
- [ ] Rework bridge and loader call sites until `scripts -> shared` and `scripts -> mcp_server/api*` paths are proven under runtime smoke
- [ ] Revisit dual-build only if this bounded interop phase proves materially too invasive

### Phase 4: Verification Matrix and Follow-On Standards Docs
- [ ] Re-test the highest-risk recent surfaces first
- [ ] Run the full verification matrix from `research/research.md`
- [ ] Update deferred standards docs outside 023 only after runtime verification passes
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command / Proof |
|-----------|-------|-----------------|
| Root gates | Workspace-level proof without npm workspace fan-out surprises | `npm run --workspaces=false typecheck`; `npm run --workspaces=false test:cli` |
| Package builds | Native ESM emit for the server package | `npm run build --workspace=@spec-kit/mcp-server` |
| Package tests | Workspace-targeted verification for migrated packages | `npm run test --workspace=@spec-kit/mcp-server`; `npm run test --workspace=@spec-kit/scripts` |
| Module-sensitive Vitest | Existing high-signal module and CLI suites | `npx vitest run tests/cli.vitest.ts tests/regression-010-index-large-files.vitest.ts tests/continue-session.vitest.ts`; `npx vitest run tests/modularization.vitest.ts tests/trigger-config-extended.vitest.ts`; `npx vitest run scripts/tests/test-integration.vitest.ts scripts/tests/architecture-boundary-enforcement.vitest.ts` |
| Direct runtime smokes | Real emitted entrypoint behavior | `node dist/context-server.js`; `node scripts/dist/memory/generate-context.js --help` |
| Scripts interop proof | Scripts-owned interoperability boundaries | `node scripts/tests/test-scripts-modules.js`; `node scripts/tests/test-export-contracts.js` |
| Highest-risk retests first | Recent hot runtime surfaces before broader doc sync | Targeted smokes or regressions for `mcp_server/handlers/v-rule-bridge.ts`, `mcp_server/handlers/memory-crud-health.ts`, scripts interop helpers, plus first-pass revalidation of the hot areas tied to `f10fb98`, `ca15faf`, `85078af`, and `6da69a9` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `research/research.md` | Internal | Green | Strategy, rollback boundary, and verification order lose their source of truth |
| Package-local TypeScript and Node ESM behavior | Internal | Yellow | Misaligned compiler/runtime settings can fake source-level compliance while runtime still fails |
| `@spec-kit/scripts` interoperability surface | Internal | Yellow | This is the main reason dual-build stays fallback-only rather than first pass |
| Existing module-sensitive tests | Internal | Yellow | Several tests still encode CommonJS-output assumptions and must be rewritten to remain trustworthy |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Primary rollback trigger**: `dist/context-server.js` startup, scripts interop paths, or required module-sensitive tests fail after the ESM flips
- **Rollback action**: revert `shared` and `mcp_server` package metadata, TypeScript settings, import rewrites, and scripts interop changes together so the package boundary returns to the last verified CommonJS-aligned state
- **Fallback rule**: dual-build or conditional exports is not adopted preemptively; it is considered only if the bounded scripts interop refactor proves materially too invasive during Phase 3
- **Docs rule**: standards-doc updates outside 023 stay deferred during rollback and are only refreshed from a verified runtime state
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

`Phase 0 -> Phase 1 -> Phase 2 -> Phase 3 -> Phase 4`

Phase 4 cannot begin until `scripts` interoperability proof exists. Standards-doc updates outside 023 are downstream of the verification matrix, not peers of the runtime work.

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0: Doc lock and decision freeze | Low | Complete |
| Phase 1: `shared` ESM package-config migration | Medium | 2-4 hours |
| Phase 2: `mcp_server` ESM package-config migration | High | 4-8 hours |
| Phase 3: `scripts` interop refactor | High | 4-8 hours |
| Phase 4: Verification matrix plus follow-on standards docs | Medium | 3-5 hours |
| **Total Remaining** | **High** | **13-25 hours** |

---

## L2: ENHANCED ROLLBACK

- Capture before/after package metadata and import-pattern diffs for `shared`, `mcp_server`, and scripts interop helpers before landing the runtime work.
- If rollback is required, restore runtime truth first and leave packet docs implementation-pending rather than over-claiming partial migration progress.
