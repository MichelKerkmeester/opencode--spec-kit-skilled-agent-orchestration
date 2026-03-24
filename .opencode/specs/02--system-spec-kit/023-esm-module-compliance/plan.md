---
title: "Implementation Plan: ESM Module Compliance"
description: "Technical plan for completing the real mcp_server ESM compliance refactor and the follow-on documentation updates."
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
| **Framework** | OpenCode skill workspace + MCP server runtime |
| **Storage** | N/A |
| **Testing** | Build, typecheck, targeted Vitest, emitted-artifact inspection, doc validation |

### Overview
This plan delivers a true ESM migration for `mcp_server/`. It starts by locking the target module strategy, then changes package/compiler settings, rewrites runtime-relative specifiers, and only after that updates standards documentation to describe the verified architecture.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Current-state evidence distinguishes source syntax from runtime module mode
- [ ] Final ESM compiler/package strategy selected for `mcp_server`
- [ ] Scope boundary between `mcp_server` and `scripts/` is explicit before code changes begin

### Definition of Done
- [ ] `mcp_server` emits native ESM entrypoints instead of CommonJS wrappers
- [ ] Non-test runtime-relative imports/exports are ESM-compatible
- [ ] Build, typecheck, and targeted verification commands pass
- [ ] Follow-on standards docs describe the final architecture rather than the old assumption
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Incremental module-system migration with workspace boundary isolation

### Key Components
- **Workspace compiler config**: `.opencode/skill/system-spec-kit/tsconfig.json`
- **Runtime package boundary**: `.opencode/skill/system-spec-kit/mcp_server/package.json`
- **Import graph**: `.opencode/skill/system-spec-kit/mcp_server/**/*.ts`
- **Verification surfaces**: `dist/context-server.js`, `vitest.config.ts`, workspace build/test commands
- **Follow-on standards docs**: `.opencode/skill/sk-code--opencode/SKILL.md` and this spec package

### Data Flow
Source TypeScript -> ESM-compatible compiler/package settings -> emitted `dist/*.js` entrypoints -> Node runtime smoke checks -> standards-doc alignment
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 0: Baseline and Strategy Lock
- [x] Capture current-state evidence in the spec package
- [ ] Select the final ESM strategy for `mcp_server` (for example, `NodeNext` or an equivalent proven approach)
- [ ] Confirm how `scripts/` stays CommonJS while `mcp_server` migrates

### Phase 1: Toolchain and Package Alignment
- [ ] Update workspace or package-local compiler settings so `mcp_server` emits ESM
- [ ] Update `mcp_server/package.json` metadata, exports, and entrypoints for the new runtime mode

### Phase 2: Source Migration
- [ ] Rewrite non-test relative imports/exports in `mcp_server/**/*.ts`
- [ ] Normalize barrel exports, deep relative paths, and any test imports affected by the new module mode

### Phase 3: Verification and Documentation
- [ ] Run build, typecheck, and targeted `mcp_server` tests
- [ ] Inspect emitted `dist/context-server.js` to verify the entrypoint is ESM
- [ ] Update `sk-code--opencode` and any decision records only after the runtime migration is proven
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static audit | Package metadata, tsconfig, and import-pattern inventory | `rg`, `sed`, direct file reads |
| Typecheck | Workspace compiler correctness after module changes | `npm run typecheck` |
| Build verification | Emitted runtime artifact shape | `npm run build`, direct inspection of `dist/context-server.js` |
| Runtime smoke | `mcp_server` entrypoint startup path | `npm run start --workspace=@spec-kit/mcp-server` or equivalent bounded smoke command |
| Targeted tests | Module-resolution-sensitive server tests | `npm run test:mcp` or targeted Vitest runs |
| Documentation sync | Spec package and standards docs | `rg`, spec validation scripts |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Node 18+ runtime | Internal | Green | ESM entrypoints cannot be validated |
| `@modelcontextprotocol/sdk` package entrypoints | External | Green | SDK import conventions influence the final module strategy |
| Workspace package boundaries (`mcp_server`, `shared`, `scripts`) | Internal | Yellow | Mixed module modes can break builds or startup unexpectedly |
| Existing test harness and Vitest config | Internal | Yellow | Runtime migration may require test-path adjustments |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Module migration breaks entrypoint startup, test resolution, or cross-workspace interoperability
- **Procedure**: Revert package/compiler changes together, restore pre-migration import specifiers, and keep standards docs pinned to the last verified runtime truth
<!-- /ANCHOR:rollback -->

---

## L2: PHASE DEPENDENCIES

```
Phase 0 (Baseline) -> Phase 1 (Toolchain) -> Phase 2 (Imports) -> Phase 3 (Verify + docs)
```

---

## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 0: Baseline and strategy lock | Low | 30-60 minutes |
| Phase 1: Toolchain and package alignment | Medium | 1-3 hours |
| Phase 2: Import graph migration | High | 4-8 hours |
| Phase 3: Verification and follow-on docs | Medium | 2-4 hours |
| **Total** | **Medium** | **7-16 hours** |
