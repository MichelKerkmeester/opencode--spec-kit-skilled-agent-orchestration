# 001 — Post Session Capturing Alignment

**Level:** 2 | **Priority:** P1 | **Status:** In Progress

## 1. Problem

Six completed specs within the 022-hybrid-rag-fusion epic introduced changes that were not fully propagated to the system-spec-kit skill documentation surface:

- **016-json-mode-hybrid-enrichment**: Structured JSON summary fields (toolCalls, exchanges, preflight, postflight)
- **017-json-primary-deprecation**: JSON as primary save contract, recovery-only gating
- **018-memory-save-quality-fixes**: Tree-thinning threshold, conversation synthesis, decision deduplication
- **011-command-alignment**: 6-command structure (context merged into analyze), 32-tool coverage
- **012-agents-alignment**: Multi-runtime agent sync (18 files across Claude/Gemini)
- **013-agents-md-alignment**: AGENTS.md Quick Reference tables, Gate 3 ordering fix

## 2. Scope

### In Scope
- SKILL.md: Structured JSON fields, 6-command note, handler count, quality-fix Key Concepts
- template_guide.md: Fix bare positional syntax
- execution_methods.md: Reorder JSON-first, add --json/--stdin
- save_workflow.md: Add --recovery to bare positional examples, add --json/--stdin
- environment_variables.md: Add JSON-mode usage example
- memory_system.md: Update tool count 23→32, add 10 missing tool rows

### Out of Scope
- Runtime TypeScript changes (NFR-C01)
- Command files (handled by 011)
- AGENTS.md files (handled by 013)
- Agent definitions (handled by 012)

## 3. Requirements

- SA-001: All bare positional generate-context.js examples use --recovery or JSON-primary syntax
- SA-002: SKILL.md documents structured JSON fields matching session-types.ts
- SA-003: memory_system.md tool count matches live 32-tool surface
- SA-004: execution_methods.md and save_workflow.md show JSON mode as primary path
- SA-005: Zero runtime TypeScript files modified
