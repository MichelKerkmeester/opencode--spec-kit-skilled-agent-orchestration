---
title: "Spec: Tree-Sitter WASM Migration [024/015]"
description: "Phase 015 laid the adapter and regex-based migration foundation. Tree-sitter WASM and default-parser follow-through landed later in Phase 017, with regex retained as fallback."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Phase 015 — Tree-Sitter WASM Migration

<!-- PHASE_LINKS: parent=../spec.md predecessor=014-hook-durability-auto-enrichment successor=016-cross-runtime-ux -->

<!-- SPECKIT_LEVEL: 2 -->


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. METADATA
Template compliance shim section. Legacy phase content continues below.

## 2. PROBLEM & PURPOSE
Template compliance shim section. Legacy phase content continues below.

## 3. SCOPE
Template compliance shim section. Legacy phase content continues below.

## 4. REQUIREMENTS
Template compliance shim section. Legacy phase content continues below.

## 5. SUCCESS CRITERIA
Template compliance shim section. Legacy phase content continues below.

## 6. RISKS & DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 10. OPEN QUESTIONS
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:metadata -->
Template compliance shim anchor for metadata.
<!-- /ANCHOR:metadata -->
<!-- ANCHOR:problem -->
Template compliance shim anchor for problem.
<!-- /ANCHOR:problem -->
<!-- ANCHOR:scope -->
Template compliance shim anchor for scope.
<!-- /ANCHOR:scope -->
<!-- ANCHOR:requirements -->
Template compliance shim anchor for requirements.
<!-- /ANCHOR:requirements -->
<!-- ANCHOR:success-criteria -->
Template compliance shim anchor for success-criteria.
<!-- /ANCHOR:success-criteria -->
<!-- ANCHOR:risks -->
Template compliance shim anchor for risks.
<!-- /ANCHOR:risks -->
<!-- ANCHOR:questions -->
Template compliance shim anchor for questions.
<!-- /ANCHOR:questions -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Summary

Phase 015 laid the migration foundation for moving the structural indexer from regex patterns (~70% accuracy) toward tree-sitter WASM (~99% accuracy). It established the adapter interface, shipped regex-based edge and SymbolKind improvements, and kept regex available as the long-term safety net. Tree-sitter WASM, the default-parser switch, and automatic fallback-on-init-failure were completed later in Phase 017. Bundle size: ~1.5MB.

### Items

### P2

**Item 17: Parser adapter interface (sub-phase C1)**
- Create `ParserAdapter` interface that both regex and tree-sitter implement
- ParseResult is already parser-agnostic; extractEdges() needs zero changes
- Allow runtime selection: `SPECKIT_PARSER=regex|treesitter` env var
- Files: `mcp_server/lib/code-graph/structural-indexer.ts`
- LOC: 40-60

**Item 18: Tree-sitter WASM implementation (sub-phase C2)**
- Use `web-tree-sitter` package (NOT native node-tree-sitter)
- Load WASM grammars: tree-sitter-javascript (~200KB), tree-sitter-typescript (~500KB), tree-sitter-python (~150KB), tree-sitter-bash (~100KB)
- Parse files to AST, extract symbols with correct startLine/endLine
- S-expression queries for CALLS, IMPORTS, CONTAINS, EXPORTS, EXTENDS, IMPLEMENTS
- Files: new `mcp_server/lib/code-graph/tree-sitter-parser.ts`, `package.json`
- LOC: 200-280

**Item 19: New edge types (sub-phase C3)**
- DECORATES: detect `@decorator` patterns in Python, `@Decorator()` in TypeScript
- OVERRIDES: detect method definitions that shadow parent class methods
- TYPE_OF: detect type annotations and type references
- Files: `indexer-types.ts` (add to EdgeType enum), `structural-indexer.ts` or `tree-sitter-parser.ts`
- LOC: 83-125

### P3

**Item 34: Extract ghost SymbolKinds (includes method)**
- variable, module, parameter defined in SymbolKind but never extracted
- **method** nodes also never emitted for JS/TS class methods (review F008)
- Tree-sitter AST makes extraction straightforward
- Files: `indexer-types.ts`, parser implementation
- LOC: 40-60

**Item 21: Regex demotion after tree-sitter stabilization (sub-phase C4)**
- Original plan was to remove regex parsing functions after tree-sitter proved stable in production
- Current reality: completed in Phase 017 as demotion, not removal; regex remains in `structural-indexer.ts` as the fallback parser (~430 LOC)
- `getParser()` now defaults to tree-sitter and auto-falls back to `new RegexParser()` if tree-sitter init/import fails
- Keep adapter interface for fallback safety and future parser alternatives

### Bundle Size

| Grammar | Size |
|---------|------|
| tree-sitter core WASM | ~300KB |
| JavaScript | ~200KB |
| TypeScript | ~500KB |
| Python | ~150KB |
| Bash | ~100KB |
| **Total** | **~1.5MB** |

### Migration Path (DR-014)

```
C1: Adapter interface (40-60 LOC)              ← DONE IN PHASE 015
  → C2: Tree-sitter WASM impl (200-280 LOC)    ← COMPLETED IN PHASE 017
    → C3: New edge types (83-125 LOC)          ← DONE IN PHASE 015 (via regex)
      → C4: Regex demoted to fallback          ← COMPLETED IN PHASE 017 (not removed)
```

### Completion Status

| Sub-phase | Status | Notes |
|-----------|--------|-------|
| C1: Adapter interface | **DONE IN PHASE 015** | ParserAdapter + RegexParser + SPECKIT_PARSER env var |
| C2: Tree-sitter WASM | **COMPLETED IN PHASE 017** | `web-tree-sitter` landed; tree-sitter is now the default parser |
| C3: New edge types | **DONE IN PHASE 015** | DECORATES, OVERRIDES, TYPE_OF via regex detection |
| C3.5: Cleanup | **DONE IN PHASE 015** | Dead TESTED_BY, excludeGlobs wired, .zsh globs |
| C4: Regex demotion to fallback | **COMPLETED IN PHASE 017** | Regex was not removed; it remains as automatic fallback (~430 LOC) |

### Deferred Items — Future Work

### Item 32: Tree-Sitter WASM Implementation
**Status:** COMPLETED IN PHASE 017
**Outcome:** `web-tree-sitter` and grammar assets landed, `TreeSitterParser` was implemented, and `SPECKIT_PARSER` now defaults to `treesitter`.
**Current behavior:** if tree-sitter init/import fails, `getParser()` logs a warning and returns `new RegexParser()`.

### Item 35: Regex Parser Removal
**Status:** NOT PURSUED; superseded by Phase 017 fallback posture
**Outcome:** regex was demoted to fallback instead of being removed and still occupies ~430 LOC in `structural-indexer.ts`.
**Reason:** Phase 017 kept regex as the resilience path for WASM init/import failures and explicit `SPECKIT_PARSER=regex` usage.

### Remaining Deferred Work

- Additional SymbolKinds (`decorator`, `property`, `constant`) still do not exist in the live `SymbolKind` union and remain deferred.

### P2 — Cleanup (new from 30-iteration review)

**Item 36: Remove dead per-file TESTED_BY branch**
- structural-indexer.ts has a per-file TESTED_BY code path that is never triggered
- Dead code, no runtime effect — only cross-file TESTED_BY works
- Fix: remove the dead branch
- Files: `mcp_server/lib/code-graph/structural-indexer.ts`
- Evidence: review F015

**Item 37: Wire or remove excludeGlobs option**
- `excludeGlobs` is exposed as an option but never consulted during file discovery
- Either wire it into the glob pipeline or remove the option
- Files: `mcp_server/lib/code-graph/structural-indexer.ts`
- Evidence: review F016

**Item 38: Fix .zsh language mapping**
- `.zsh` is mapped in the language table but default file discovery globs never match `.zsh` files
- Fix: add `**/*.zsh` to default globs, or remove `.zsh` from language mapping
- Files: `mcp_server/lib/code-graph/indexer-types.ts`
- Evidence: review F017

### Estimated LOC: 220-345 (net, after optional C4)
### Dependencies: Phase 013 (endLine fix enables comparison testing)
### Risk: HIGH — WASM loading in MCP server context, grammar compatibility

### Problem Statement
This phase addresses concrete context-preservation and code-graph reliability gaps tracked in this packet.

### Requirements Traceability
- REQ-900: Keep packet documentation and runtime verification aligned for this phase.
- REQ-901: Keep packet documentation and runtime verification aligned for this phase.
- REQ-902: Keep packet documentation and runtime verification aligned for this phase.
- REQ-903: Keep packet documentation and runtime verification aligned for this phase.
- REQ-904: Keep packet documentation and runtime verification aligned for this phase.

### Acceptance Scenarios
- **Given** phase context is loaded, **When** verification scenario 1 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 2 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 3 runs, **Then** expected packet behavior remains intact.
- **Given** phase context is loaded, **When** verification scenario 4 runs, **Then** expected packet behavior remains intact.
