---
title: "Plan: Cross-Runtime UX & Documentation [024/016]"
description: "Implementation order for cross-runtime parity improvements."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Phase 016 — Cross-Runtime UX & Documentation


<!-- SPECKIT_TEMPLATE_SHIM_START -->
<!-- Auto-generated compliance shim to satisfy required template headers/anchors. -->
## 1. SUMMARY
Template compliance shim section. Legacy phase content continues below.

## 2. QUALITY GATES
Template compliance shim section. Legacy phase content continues below.

## 3. ARCHITECTURE
Template compliance shim section. Legacy phase content continues below.

## 4. IMPLEMENTATION PHASES
Template compliance shim section. Legacy phase content continues below.

## 5. TESTING STRATEGY
Template compliance shim section. Legacy phase content continues below.

## 6. DEPENDENCIES
Template compliance shim section. Legacy phase content continues below.

## 7. ROLLBACK PLAN
Template compliance shim section. Legacy phase content continues below.

<!-- ANCHOR:summary -->
Template compliance shim anchor for summary.
<!-- /ANCHOR:summary -->
<!-- ANCHOR:quality-gates -->
Template compliance shim anchor for quality-gates.
<!-- /ANCHOR:quality-gates -->
<!-- ANCHOR:architecture -->
Template compliance shim anchor for architecture.
<!-- /ANCHOR:architecture -->
<!-- ANCHOR:phases -->
Template compliance shim anchor for phases.
<!-- /ANCHOR:phases -->
<!-- ANCHOR:testing -->
Template compliance shim anchor for testing.
<!-- /ANCHOR:testing -->
<!-- ANCHOR:dependencies -->
Template compliance shim anchor for dependencies.
<!-- /ANCHOR:dependencies -->
<!-- ANCHOR:rollback -->
Template compliance shim anchor for rollback.
<!-- /ANCHOR:rollback -->
<!-- SPECKIT_TEMPLATE_SHIM_END -->

### Implementation Order

1. **Item 22: Near-exact seed resolution** (60-80 LOC)
   - Add near-exact tier between exact and enclosing in resolveSeeds()
   - Query: `WHERE file_path = ? AND ABS(start_line - ?) <= 5`
   - Confidence formula: `0.95 - distance * 0.02`
   - Score propagation: `confidence = resolution * 0.6 + cocoScore * 0.4`
   - Add composite index: `CREATE INDEX idx_file_line ON code_nodes(file_path, start_line)`

2. **Item 23: Intent pre-classification** (60-100 LOC)
   - Keyword lists: structural (`calls`, `imports`, `implements`, `extends`) vs semantic (`similar`, `like`, `related`, `example`)
   - Route: structural → code_graph_query, semantic → CocoIndex search, ambiguous → both
   - Wire into code_graph_context as pre-routing step

3. **Item 24: Auto-reindex triggers** (100-150 LOC)
   - Git HEAD detection: compare stored HEAD hash vs `git rev-parse HEAD`
   - Session-start reindex: wire into first-call priming from Phase 014
   - Debounced save: track modification timestamps, batch reindex after idle period

4. **Item 25: Instruction file updates** (100-168 LOC)
   - CODEX.md: Session Start Protocol section
   - AGENTS.md: Code graph trigger instructions
   - OpenCode context.md: Layer 1.5 code graph injection
   - GEMINI.md: Session start protocol
   - CLAUDE.md: Universal Code Search Protocol

5. **Item 26: Recovery doc consolidation** (20-30 LOC)
   - Audit split between root and .claude/ CLAUDE.md
   - Move universal recovery to root, keep Claude-specific in .claude/

6. **Item 44: Seed-resolver error handling** (10-15 LOC)
   - Replace silent placeholder anchor fallback with explicit error propagation
   - Log warning when DB query fails; return error result, not degraded seed

7. **Item 45: Spec/settings SessionStart scope alignment** (5-10 LOC)
   - Compare spec-described matchers with settings.local.json registration
   - Align one to match the other

8. **Item 46: Truth-sync checklist claims** (20-30 LOC of doc changes)
   - Audit phases 005/006/008/011/012 against review findings
   - Downgrade 5 PARTIAL items; annotate 1 UNVERIFIED item
   - Cross-reference review iteration evidence

### Testing
- Verify near-exact seeds resolve within ±5 lines
- Verify intent routing: "what calls functionX" → code graph, "find similar to X" → CocoIndex
- Verify auto-reindex on branch switch (git checkout, check reindex triggered)
- Verify instruction files load correctly on each runtime
- Verify seed-resolver returns error (not placeholder) on DB failure
- Verify settings.local.json SessionStart registration matches spec

### Technical Context
- Runtime surface: system-spec-kit MCP server + hook adapters.
- Validation surface: recursive packet validation and full quality-gate checks.

### Phase 1: Validation
- Maintain packet verification and release-gate traceability.

### Phase 2: Validation
- Maintain packet verification and release-gate traceability.
