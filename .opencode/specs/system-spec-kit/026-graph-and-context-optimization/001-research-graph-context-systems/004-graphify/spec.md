---
title: "Spec: 004-graphify Research Phase"
description: "Research phase investigating graphify external repo for two-pass AST+LLM extraction patterns to adopt into Public"
trigger_phrases:
  - "graphify research spec"
  - "004-graphify phase spec"
importance_tier: "important"
contextType: "spec"
---
# Spec: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec | v1.0 -->

## 1. Overview

Phase 4 of `001-research-graph-context-systems`. Read-only research investigation of the graphify Python skill (`external/graphify/`, `external/skills/graphify/skill.md`) to identify concrete improvements for Code_Environment/Public around two-pass AST + LLM extraction, Leiden community detection, EXTRACTED/INFERRED/AMBIGUOUS evidence tagging, multimodal artifact processing, and PreToolUse hook patterns.

This is a **research-only phase**. No source files outside `research/`, `memory/`, `implementation-summary.md`, `spec.md`, `plan.md`, `tasks.md` are modified. The `external/` directory is treated as read-only throughout.

The canonical research output is `research/research.md`. Stub files (`spec.md`, `plan.md`, `tasks.md`) exist only to satisfy Level 1 validation; the substance lives in `research/research.md`.

## 2. Requirements

1. Document the end-to-end graphify pipeline architecture from `detect` through `export` with file:line citations.
2. Map AST extraction internals: language coverage, entity/relationship schema, Python's call graph + cross-file `uses` inference, rationale node treatment.
3. Capture the semantic subagent prompt verbatim and document the merge/cache/promotion path to `graphify-out/graph.json`.
4. Document Leiden clustering parameters, oversized-community split rules, god nodes, surprising connections, suggested questions, and `GRAPH_REPORT.md` structure.
5. Document the PreToolUse hook installation, payload, fire conditions, and CLAUDE.md companion section.
6. Document cache invalidation across the manifest mtime layer and the SHA256 content-hash layer.
7. Document the multimodal pipeline (PDFs via pypdf, images via Claude vision, URL ingestion) and security guards.
8. Verify the 71.5x token-reduction claim against `external/worked/karpathy-repos/`.
9. Compare graphify capabilities against Public's existing Code Graph MCP and CocoIndex without duplicating phase 002 (codesight) or phase 003 (contextador) findings.
10. Produce Adopt / Adapt / Reject recommendations with prioritization.

## 3. Acceptance Scenarios

1. **Given** the graphify external repo is read-only, **when** the research phase completes, **then** `research/research.md` exists with at least 5 cited findings each referencing specific `external/graphify/` or `external/skills/graphify/` paths.
2. **Given** Public already has Code Graph MCP, CocoIndex, and Spec Kit Memory, **when** the comparison section is read, **then** every recommendation labels itself as Adopt, Adapt, or Reject with a rationale tied to one of those existing systems.
3. **Given** the cross-phase awareness table from the phase prompt, **when** the recommendations are reviewed, **then** none of them duplicate findings already covered for codesight (002) or contextador (003).

## 4. Out of Scope

- Modifying graphify source files
- HTML viewer / vis.js / pyvis polish
- PyPI packaging mechanics
- Wholesale replacement of Code Graph MCP or CocoIndex
- Implementation of any adopted patterns (deferred to a follow-up plan)

## 5. Success Criteria

- At least 5 concrete findings with file:line citations
- Adopt/Adapt/Reject recommendations explicitly labeled
- Cross-phase overlap with 002/003 acknowledged
- `implementation-summary.md` created after research completes
- Memory context saved via `generate-context.js`
- `validate.sh --strict` passes

## 6. References

- Phase research prompt: `phase-research-prompt.md`
- Canonical research output: `research/research.md`
- Iteration files: `research/iterations/iteration-001.md` through `iteration-007.md`
- External repo: `external/graphify/`, `external/skills/graphify/`, `external/worked/`
