---
title: "Feature Specification: 002-codesight Research Phase"
description: "Read-only 20-iteration research investigation of the codesight external Node.js/TypeScript skill covering detector discipline, MCP/cache semantics, profile generation safety, scanner heuristics, and adoption patterns Public should adopt, adapt, or reject."
trigger_phrases:
  - "002-codesight research spec"
  - "002-codesight phase spec"
  - "codesight Adopt Adapt Reject"
  - "codesight AST detector research"
importance_tier: critical
contextType: spec
---
# Feature Specification: 002-codesight Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 2 of `001-research-graph-context-systems` is a read-only audit of the codesight external Node.js/TypeScript skill (zero-runtime-dependency CLI that scans a project root and generates AI-assistant context artifacts) to translate its detector architecture, MCP tool design, profile generation, scanner heuristics, and blast-radius analysis into concrete improvements for `Code_Environment/Public`'s existing structural retrieval stack (Code Graph MCP, CocoIndex, Spec Kit Memory). The deliverable is an evidence-backed Adopt/Adapt/Reject table plus late-session adoption synthesis grounded in specific `external/src/` file:line citations across 20 deep-research iterations, not a generic feature inventory. No source files outside this spec folder are modified during the research phase.

**Key Decisions**: Run the packet to 20 total iterations across three segments: original charter (iters 1-5), first continuation charter (iters 6-10), and a `completed-continue` extension (iters 11-20) covering watch/hook automation, middleware/libs/config detectors, formatter lifecycle, MCP cache/error semantics, AI-config write safety, HTML projection, scanner heuristics, and final adoption synthesis. Iterations 1-3 and 6-10 used cli-codex `gpt-5.4` high reasoning effort, iters 4-5 used native fallback after codex stalls, and iters 11-20 executed directly in the active Codex session because self-invoking cli-codex from Codex would be circular. The packet keeps the 22-row Adopt/Adapt/Reject matrix and extends it with the 20-iteration synthesis.

**Critical Dependencies**: cli-codex CLI installed (verified `codex-cli 0.118.0`); `external/` accessible at the spec folder root; reducer script at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; memory script at `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-06 |
| **Branch** | `main` (research-only phase, no branch needed) |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../001-claude-optimization-settings/spec.md` |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`Code_Environment/Public` already has CocoIndex semantic search, Code Graph MCP for structural queries, and Spec Kit Memory for context preservation, but it lacks Codesight-style automated `CLAUDE.md` / `.cursorrules` / `codex.md` / `AGENTS.md` generation from a single project scan, per-AI-tool profile generation, and a blast-radius command built around reverse-import BFS. Without an evidence-grounded survey of Codesight's actual implementation (separated from its README marketing claims), any port would risk importing the wrong patterns, the wrong claims, and the wrong risks.

### Purpose

Produce an evidence-grounded Adopt/Adapt/Reject decision matrix for Codesight patterns in `external/src/`, with every recommendation cited by exact file:line ranges and labeled by evidence type (`source-confirmed`, `test-confirmed`, `README-level`, or `mixed`). The matrix must distinguish between Codesight's documented architecture and what the source code actually proves, especially for the README's headline "11.2x token reduction" claim and the "8 ORM parsers" / "25+ frameworks" coverage claims.

---

<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- AST route extraction pipeline (`external/src/ast/extract-routes.ts`) and its borrowing of project-local TypeScript via `external/src/ast/loader.ts`.
- Framework and ORM detector architecture across 28 framework identifiers and 9 ORM identifiers in `external/src/types.ts`.
- MCP tool design and session-cache behavior in `external/src/mcp-server.ts`.
- Per-tool AI assistant profile generation in `external/src/generators/ai-config.ts`.
- Blast-radius reverse-import BFS in `external/src/detectors/blast-radius.ts` and the underlying graph in `external/src/detectors/graph.ts`.
- Hot-file ranking and dependency graph as "change carefully" surfaces.
- Benchmark methodology in `external/src/eval.ts` and fixture coverage under `external/eval/fixtures/`.
- First continuation charter: contract enrichment (`external/src/detectors/contracts.ts`), Python/Go AST parity (`external/src/ast/extract-python.ts`, `external/src/ast/extract-go.ts`), token stats provenance (`external/src/detectors/tokens.ts`), monorepo + config + plugins (`external/src/scanner.ts`, `external/src/config.ts`), and components + telemetry + cumulative risk inventory (`external/src/detectors/components.ts`, `external/src/telemetry.ts`).
- Completed-continue extension: watch mode + pre-commit hook automation (`external/src/index.ts`), middleware/libs/config detector behavior (`external/src/detectors/middleware.ts`, `external/src/detectors/libs.ts`, `external/src/detectors/config.ts`), formatter lifecycle (`external/src/formatter.ts`), MCP cache + error semantics (`external/src/mcp-server.ts`), AI-config write safety (`external/src/generators/ai-config.ts`), HTML projection (`external/src/generators/html-report.ts`), scanner heuristics (`external/src/scanner.ts`), and final synthesis over all 20 iterations.
- Cross-phase boundary with 003-contextador (self-healing query interface) and 004-graphify (NetworkX/Leiden graph math).

### Out of Scope

- HTML report styling and presentational dashboard polish.
- npm publishing workflow, semver, release engineering details.
- Generic TypeScript style commentary unrelated to AST detector design.
- Phase 003 self-healing MCP query interface analysis (covered by `003-contextador`).
- Phase 004 NetworkX/Leiden community detection or evidence-tagging analysis (covered by `004-graphify`).
- Re-implementing CocoIndex semantic search, Code Graph MCP structural queries, or Spec Kit Memory in Public.

---

<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Priority | Requirement |
|----|----------|-------------|
| REQ-001 | P0 | Trace `external/src/index.ts` execution flow before reading the README, per `scratch/phase-research-prompt.md` instruction 3 |
| REQ-002 | P0 | Confirm zero-dependency claim in `external/package.json` and trace `external/src/ast/loader.ts` for project-local TypeScript borrowing |
| REQ-003 | P0 | Map all 28 framework identifiers and 9 ORM identifiers in `external/src/types.ts` to their actual detector implementations |
| REQ-004 | P0 | Trace one full route detector pipeline (Hono or NestJS) end to end with confidence-label discipline |
| REQ-005 | P0 | Trace ORM schema extraction across Drizzle, Prisma, TypeORM, SQLAlchemy, and GORM with AST-vs-regex distinction |
| REQ-006 | P0 | Enumerate the exact 8 MCP tools in `external/src/mcp-server.ts` and document the session cache lifecycle |
| REQ-007 | P0 | Trace `external/src/detectors/blast-radius.ts` reverse-import BFS internals and call out heuristic vs graph-backed overlays |
| REQ-008 | P0 | Compare per-tool profile differentiation across Claude Code, Cursor, Codex, Copilot, and Windsurf in `external/src/generators/ai-config.ts` |
| REQ-009 | P0 | Validate or refute the README's headline benchmark claims against `external/src/eval.ts`, `external/eval/fixtures/`, and `external/tests/detectors.test.ts` |
| REQ-010 | P0 | Bound cross-phase overlap with phases 003 (contextador) and 004 (graphify) explicitly |
| REQ-011 | P1 | First continuation charter: trace contract enrichment, Python/Go AST parity, token stats provenance, monorepo + config + plugins, and components + telemetry + cumulative risk inventory |
| REQ-012 | P1 | Completed-continue extension: trace watch/hook automation, middleware/libs/config detectors, formatter lifecycle, MCP cache/error semantics, AI-config write safety, HTML projection, scanner heuristics, and final adoption synthesis |
| REQ-013 | P1 | Keep `research/research.md`, reducer outputs, and human-owned phase docs aligned after the `completed-continue` reopen so the packet state agrees on 20 total iterations |
| REQ-014 | P1 | Preserve the 22-row Adopt/Adapt/Reject decision matrix in `research/research.md` §18.3 and reconcile it with the 20-iteration final closeout |

---

<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- All 27 questions (Q1-Q12 + Q13-Q17 + Q18-Q27) are answered with source-cited findings.
- At least 12 evidence-backed findings exist (delivered: 95 across 20 iterations).
- Cross-phase overlap between 002 / 003 / 004 is bounded explicitly in synthesis.
- A 22-row Adopt/Adapt/Reject decision matrix lives in `research/research.md` §18.3 with every row line-grounded and the late-session synthesis reconciles the matrix against the additional 10 iterations.
- Memory chronology is preserved under `memory/`; lower-quality saved memories are documented rather than manually rewritten.
- `validate.sh --strict` reports 0 blocking errors; the remaining strict failure is the known warning-only ADR-anchor bucket in `decision-record.md`.
- No edits made under `external/`.

---

<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### Risks

| ID | Risk | Mitigation |
|----|------|-----------|
| R-001 | cli-codex CLI stalls in S sleep state under API throttling | Native Read/Grep fallback (used in iters 4-5) |
| R-002 | `--sandbox read-only` blocks `/tmp` writes from codex agents | Orchestrator extracts reports from `-o` last-message capture or stdout reasoning trace (used successfully in iters 6-10) |
| R-003 | Reducer overwrites analyst-owned strategy sections | Re-add Q1-Q27 summaries to KEY QUESTIONS and ANSWERED QUESTIONS sections after reducer runs when needed |
| R-004 | Validator infers wrong level for research phase folder | Declare `<!-- SPECKIT_LEVEL: 3 -->` explicitly in spec.md |
| R-005 | README headline claims (e.g., "11.2x token reduction") quoted as truth | Iter 4 finding 4 + iter 8 explicitly distinguish heuristic formula from real measurement; flag as `README-level` |
| R-006 | `completed-continue` reopen leaves human-owned phase docs stale while reducer files move ahead | Reconcile spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, and description.json after generation-2 closeout |

### Dependencies

- `external/` directory containing the codesight source tree (already cloned at phase folder root).
- cli-codex CLI v0.118.0+ for iteration dispatch.
- Reducer script `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs` for state file maintenance.
- Memory script `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` for memory artifact generation.
- Validator script `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` for spec compliance.

---

## 7. NON-FUNCTIONAL REQUIREMENTS

| ID | Priority | Requirement |
|----|----------|-------------|
| NFR-001 | P0 | Every finding must cite exact `external/src/` paths with line ranges; line numbers must be verified against actual `nl -ba` output, not guessed |
| NFR-002 | P0 | README claims must be flagged as `README-level` and cross-checked against source/fixtures before being used |
| NFR-003 | P0 | No edits under `external/`; the directory is read-only per phase charter |
| NFR-004 | P1 | cli-codex iterations must use `--model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only` |
| NFR-005 | P1 | Iteration files must follow the standard finding template with Source, What it does, Why it matters, Evidence type, Recommendation, Affected area, Risk/cost fields |

---

## 8. EDGE CASES

- **Codex CLI stalls or hangs.** If a cli-codex iteration stalls in S sleep state past 10 minutes, the orchestrator falls back to native Read/Grep tools and preserves the same finding template (used in iters 4-5).
- **Sandbox blocks `/tmp` writes.** When `--sandbox read-only` blocks the agent's `/tmp` write attempts, the orchestrator extracts the assembled report from the `-o` last-message capture or the codex stdout reasoning trace (used in iters 6-10).
- **README claim contradicts source.** When a README claim cannot be reproduced from `external/eval/fixtures/` or `external/tests/`, the finding is labeled `README-level` with an explicit gap statement (e.g., the "11.2x token reduction" headline in iter 4).
- **Fixture authored to extractor's limitation.** When a `ground-truth.json` matches the extractor's current bug (e.g., FastAPI prefix composition in iter 7), call out the tautology rather than treating the test as evidence of correctness.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score (1-10) | Rationale |
|-----------|--------------|-----------|
| Surface area | 8 | 10 detector modules, 8 MCP tools, 5 profile generators, 14+ frameworks, 9 ORMs, 22-row decision matrix |
| Inter-module coupling | 5 | Detectors are mostly independent; index.ts is the orchestration spine |
| External dependencies | 1 | Zero runtime dependencies (the whole point of the audit) |
| Documentation discipline | 7 | README claims diverge from source in measurable ways; the audit exists to expose those gaps |
| Total complexity | 6 | Mid-high; the research output is high-leverage but the analysis spans many surfaces |

---

## 10. RISK MATRIX

| Risk ID | Likelihood | Impact | Mitigation status |
|---------|-----------|--------|-------------------|
| R-001 (codex stall) | Medium | Low | Mitigated via native fallback (iters 4-5) |
| R-002 (sandbox /tmp block) | High | Low | Mitigated via stdout extraction (iters 6-10) |
| R-003 (reducer overwrite) | High | Low | Mitigated via post-reducer re-add of analyst sections |
| R-004 (wrong level inference) | High | Low | Mitigated via explicit `<!-- SPECKIT_LEVEL: 3 -->` |
| R-005 (README quoted as truth) | High | High | Mitigated via explicit `README-level` evidence labeling |

---

## 11. USER STORIES

### US-001: Researcher needs Adopt/Adapt/Reject guidance for Codesight patterns

**As a** Code_Environment/Public maintainer planning a context-generation feature
**I want** an evidence-grounded matrix of Codesight's portable patterns and known gotchas
**So that** I can adopt the high-leverage low-risk patterns without inheriting the heuristic formulas, the over-marketed claims, or the known bugs

**Acceptance**: research/research.md §18.3 contains a 22-row matrix where every row cites exact `external/src/` line ranges and labels evidence type and recommendation tier, and the late-session synthesis updates the recommendation boundaries after the additional 10 iterations.

### US-002: Researcher needs to know what the README overreaches

**As a** Code_Environment/Public maintainer evaluating Codesight's marketing claims
**I want** explicit flags for which README headline numbers are reproducible from fixtures vs which come from undocumented sources
**So that** I do not accidentally cite Codesight's "11.2x token reduction" as a measurement when it is actually a hand-tuned linear formula

**Acceptance**: research/research.md cross-checks every README headline claim against `external/src/eval.ts`, `external/eval/fixtures/`, and `external/tests/detectors.test.ts`, with `README-level` evidence labels for unreproducible claims.

### US-003: Researcher needs to bound cross-phase overlap

**As a** Code_Environment/Public maintainer working across phases 002 / 003 / 004 / 005
**I want** explicit boundaries that say which phase owns which capability
**So that** synthesis time across phases does not duplicate work or import overlapping patterns

**Acceptance**: research/research.md §10 explicitly assigns AST detector design + per-tool profile generation + static artifact emission to 002, query MCP to 003, and graph math to 004.

### Acceptance Scenarios

**Scenario 1 (REQ-001/REQ-002 — Source-before-README discipline)**
- **Given** a fresh phase folder with the codesight `external/` source tree
- **When** the orchestrator dispatches iteration 1
- **Then** the agent reads `external/src/index.ts` and `external/src/ast/loader.ts` BEFORE any read of `external/README.md`, and the resulting iteration file cites only source paths

**Scenario 2 (REQ-006 — 8 MCP tools enumerated)**
- **Given** `external/src/mcp-server.ts` is in scope
- **When** iteration 3 traces the MCP tool surface
- **Then** the iteration file lists the exact 8 tool names with line citations and notes session-cache lifecycle

**Scenario 3 (REQ-009 — README claim cross-checking)**
- **Given** the README headlines an "11.2x average token reduction" claim
- **When** iteration 4 cross-checks this against `external/eval/fixtures/` and `external/src/eval.ts`
- **Then** the finding labels the claim as `README-level` with explicit gap statement (3 private SaaS codebases not in fixtures)

**Scenario 4 (REQ-007 — Blast-radius bug discovery)**
- **Given** `external/src/detectors/blast-radius.ts` has a depth-cap loop
- **When** iteration 3 traces the BFS internals
- **Then** the iteration file documents the depth-cap off-by-one bug at the exact line where it occurs

**Scenario 5 (REQ-011 — First continuation charter dispatch)**
- **Given** the user requests "5 more iterations of /spec_kit:deep-research with gpt-5.4 high agents in fast mode through cli-codex"
- **When** the orchestrator selects 5 unexplored modules
- **Then** all 5 iterations dispatch in parallel as background processes via cli-codex with `--sandbox read-only` and produce iteration files with line-cited findings

**Scenario 6 (REQ-012 — Completed-continue extension to 20 total iterations)**
- **Given** the packet has already completed 10 iterations and the user requests 10 more
- **When** the orchestrator reopens the packet in `completed-continue` mode
- **Then** it snapshots the prior synthesis, appends runs 11-20 plus lifecycle events to `deep-research-state.jsonl`, and extends `research/research.md` to the 20-iteration closeout

**Scenario 7 (REQ-014 — 22-row decision matrix retained after generation-2 closeout)**
- **Given** all 20 iterations have completed
- **When** the orchestrator finalizes the packet synthesis
- **Then** the section still contains the 22-row Adopt/Adapt/Reject matrix and the final synthesis explicitly reconciles late-session findings against it

---

<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None — all 27 questions (Q1-Q27) answered. See `research/research.md` for the full coverage report.

---

## RELATED DOCUMENTS

- `research/research.md` — canonical generation-2 synthesis (872 lines, 20 iterations)
- `research/iterations/iteration-{001..020}.md` — per-iteration findings
- `research/deep-research-strategy.md` — analyst + reducer strategy file
- `research/deep-research-dashboard.md` — reducer-generated dashboard (Status: COMPLETE, 20/20)
- `plan.md` — implementation plan
- `tasks.md` — task tracking
- `implementation-summary.md` — outcome summary
- `memory/` — three chronological saved-memory artifacts; use `research/research.md` as canonical truth if a memory snapshot and packet docs disagree


<!-- /ANCHOR:questions -->
