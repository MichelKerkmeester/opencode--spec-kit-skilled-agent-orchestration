---
title: "Deep Research - 002-codesight: AST-based codebase analysis and AI-assistant context generation"
description: "Synthesis of a 20-iteration deep-research session investigating the Codesight repository for concrete improvements applicable to Code_Environment/Public, covering AST detector design, framework/ORM coverage, MCP/tool ergonomics, projection surfaces, automation boundaries, and benchmark methodology."
phase: 002-codesight
session_id: dr-002-codesight-20260408T070203Z
generation: 2
status: complete
iterations: 20
findings: 95
questions_answered: 27
questions_total: 27
stop_reason: max_iterations_reached
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["research/research.md"]

---

# Deep Research — 002-codesight

> Source repository: `external/` under `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external/`
>
> Engine: iterations 1-10 were completed via the original cli-codex-centered deep-research workflow, including a mixed codex/native fallback path during the first continuation. Iterations 11-20 were reopened via `completed-continue` and executed directly in the active Codex session so the packet could reach 20 total iterations without circular self-delegation. All findings remain source-confirmed or clearly marked as synthesis-level.

<!-- ANCHOR:executive-summary -->
## 1. Executive Summary

Codesight is a zero-runtime-dependency Node.js/TypeScript CLI that scans a project root, runs AST-first detectors over routes, schemas, components, libraries, config, middleware, and an import graph, and projects the result into both static `.codesight/` markdown artifacts and a cached MCP query surface with 8 tools. The "zero dependency" claim is real at the package level (`external/package.json` has no runtime `dependencies`) but conditional in practice: AST precision depends on Codesight successfully borrowing the scanned project's own `typescript` package via `external/src/ast/loader.ts`. When that load fails, route and schema detectors degrade to deliberately narrow regex fallbacks.

The repository's strongest source-confirmed differentiators are (1) the unified `ScanResult` model in `external/src/index.ts:75-175` that branches late into static artifacts, MCP queries, profile files, and blast-radius analysis from one analysis pass; (2) the per-tool profile overlay system in `external/src/generators/ai-config.ts:164-264` that gives Claude Code, Cursor, Codex, Copilot, and Windsurf meaningfully different instructions on top of one shared summary; (3) the genuine AST decorator-walking NestJS route detector in `external/src/ast/extract-routes.ts:157-248`; and (4) a small but real precision/recall/F1 fixture harness in `external/src/eval.ts:43-244`.

Its weakest claims are (a) the README's "11.2x average token reduction" headline, which comes from three private SaaS codebases that are NOT in `external/eval/fixtures/` and is therefore not reproducible from this checkout; (b) the blast-radius "schema impact" overlay in `external/src/detectors/blast-radius.ts:91-127`, which heuristically marks all schemas affected when any affected file owns a route tagged `db`; and (c) a depth-cap off-by-one in the same blast-radius BFS that lets nodes one hop beyond `maxDepth` leak into results.

For `Code_Environment/Public`, the highest-leverage adoptions are the orchestration shape (one canonical scan, late-bound projections), the AST-first / regex-fallback / `confidence` label pattern, the per-tool profile overlay split, and the F1 fixture harness as a regression-test pattern. The biggest "do not duplicate" boundary is the cached MCP query interface, which belongs to phase 003-contextador, and the dependency-graph community detection layer, which belongs to phase 004-graphify.

<!-- /ANCHOR:executive-summary -->

<!-- ANCHOR:topic-and-scope -->
## 2. Topic and Scope

**Research topic** (verbatim from `phase-research-prompt.md`):
> Research the external repository at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/external` and identify concrete improvements for `Code_Environment/Public`, especially around AST-based codebase analysis, framework/ORM detector architecture, AI-assistant context file generation, MCP tool design, and per-tool config profile patterns.

**In scope:**
- AST route extraction pipeline (`extract-routes.ts`) and how it borrows project-local TypeScript.
- Framework/ORM detector architecture across 28 framework identifiers and 9 ORM identifiers in `external/src/types.ts`.
- MCP tool design and session-cache behavior in `external/src/mcp-server.ts`.
- Per-tool AI assistant profile generation in `external/src/generators/ai-config.ts`.
- Blast-radius reverse-import BFS in `external/src/detectors/blast-radius.ts` and the underlying graph in `external/src/detectors/graph.ts`.
- Hot-file ranking and dependency graph as "change carefully" surfaces.
- Benchmark methodology in `external/src/eval.ts` and fixture coverage under `external/eval/fixtures/`.
- Cross-phase boundary with 003-contextador (self-healing query interface) and 004-graphify (NetworkX/Leiden graph math).

**Out of scope** (per `phase-research-prompt.md` §10.2 and confirmed by every iteration):
- HTML report styling or presentational dashboard polish.
- npm publishing workflow, semver, release engineering.
- Generic TypeScript style commentary unrelated to AST detector design.
- Phase 003 self-healing MCP query interface (covered by `003-contextador`).
- Phase 004 NetworkX/Leiden community detection or evidence-tagging (covered by `004-graphify`).
- Re-implementing CocoIndex semantic search, Code Graph MCP structural queries, or Spec Kit Memory in `Code_Environment/Public`.

<!-- /ANCHOR:topic-and-scope -->

<!-- ANCHOR:methodology -->
## 3. Methodology

This synthesis is the result of a 20-iteration deep-research packet driven by `/spec_kit:deep-research:auto`, reopened once via `completed-continue`. State continuity lives in `deep-research-state.jsonl`, `deep-research-strategy.md`, `findings-registry.json`, and the iteration artifacts under `research/iterations/`.

**Iteration engine:** Iterations 1-10 followed the original cli-codex-driven workflow documented in sections 17-18. For the second continuation (iterations 11-20), the work was executed directly in this Codex session because self-invoking `cli-codex` from Codex would be circular. The same evidence rule still applied: source files were traced directly and every finding had to stay anchored to exact repo paths.

**Reading order discipline:** `external/src/index.ts` was read before `external/README.md` per `phase-research-prompt.md` instruction 3. README claims were always cross-checked against source files and fixtures and labeled `source-confirmed`, `test-confirmed`, `README-level`, or `mixed`.

**Convergence model:** The packet used the standard composite signal (rolling-average newInfoRatio, MAD noise floor, question entropy/coverage) plus quality guards, but the final stop reason for this reopened lineage is `max_iterations_reached` because the user explicitly requested 20 total iterations after the earlier 10-iteration continuation.

**Evidence rule:** Every finding cites exact paths under `external/src/`, `external/eval/`, or `external/tests/` with line ranges. README-only claims are explicitly flagged. Recommendations use the three-bucket rubric (`adopt now`, `prototype later`, `reject`) required by `phase-research-prompt.md` §11.

**Finding count per wave:** iterations 1-5 = 26 findings; iterations 6-10 = 26 findings; iterations 11-20 = 43 findings. Total = 95 findings across 20 iterations.

<!-- /ANCHOR:methodology -->

<!-- ANCHOR:system-overview -->
## 4. System Overview

Codesight ships as a single-binary CLI (`codesight`) with multiple sub-modes. The execution flow is:

```
codesight [path]
   |
   +-- detectProject(root)              -> ProjectInfo (frameworks, orms, language, monorepo)