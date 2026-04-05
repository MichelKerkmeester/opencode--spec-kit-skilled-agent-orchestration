# Deep Research Strategy: 002-indexing-normalization Improvement Audit

## Key Research Questions

### Theme 1: Code Quality & Bugs
1. [PARTIAL] Are there edge cases in canonical path deduplication? YES — symlinks, dot-segments, relative/absolute not unified. Raw string equality in seenPaths. (EDGE-001)
2. [PARTIAL] Does `input-normalizer.ts` violate SRP? YES — 337-line transformOpencodeCapture, 180-line normalizeInputData, 126-line validateInputData. (STD-010, A2 pending detailed decomposition)
3. [ANSWERED] Are there missing error handling paths? YES — memory-indexer has no try/catch around embedding/vector writes (ERR-001). Bare catch blocks in spec-affinity (STD-005).
4. [ANSWERED] Does normalizeFileEntryLike() handle all variants? NO — unchecked casts (BUG-001), ACTION not normalized (BUG-003), unknown MAGNITUDE silently dropped.

### Theme 2: Architecture & Performance
5. [OPEN] Is the embedding cache (1,000 entries, in-memory) optimal? Should it persist?
6. [OPEN] Can the importance weighting formula (length 0.3 + anchor 0.3 + recency 0.2 + baseline 0.2) be improved?
7. [OPEN] Is the 100ms batch delay for embeddings the right rate limit?
8. [OPEN] Can spec-affinity filtering be made more intelligent (semantic vs keyword matching)?

### Theme 3: Automation & UX
9. [ANSWERED] Can CLI be simplified? YES — replace overloaded positional arg with explicit subcommands (UX-001).
10. [PARTIAL] Can rebuild be automated? YES — system detects stale indexes but doesn't auto-repair (AUTO-001). memory_health has repair hooks.
11. [ANSWERED] Missing CLI flags? YES — dryRun, asyncEmbedding, force, includeSpecDocs, incremental, verbose, json-output all exist in MCP but not CLI (UX-002).

### Theme 4: Cross-Skill Alignment
12. [OPEN] Do P0/P1/P2 labels conflict between spec-kit checklist items and sk-code quality gates?
13. [OPEN] Does validation exit code semantics differ between `validate.sh`, `verify_alignment_drift.py`, and `extract_structure.py`?
14. [OPEN] Does HVR (Human Voice Rules) from sk-doc apply to spec documents? Enforcement gap?
15. [OPEN] Are document-type scoring multipliers documented consistently across spec-kit and sk-doc?
16. [OPEN] Is there a memory save trigger ambiguity when sk-doc creates spec folder documentation?
17. [OPEN] Does the Smart Router ambiguity_delta behave consistently across all three skills?

## Critical Files

### Core Indexing/Normalization (6,539 lines total)
- `scripts/utils/input-normalizer.ts` (1,157 lines) — Input validation and normalization
- `scripts/core/memory-indexer.ts` (205 lines) — Embedding generation and vector DB storage
- `scripts/memory/generate-context.ts` (612 lines) — CLI entry point
- `scripts/utils/spec-affinity.ts` (546 lines) — Spec relevance filtering
- `scripts/types/session-types.ts` (534 lines) — Canonical type definitions
- `scripts/core/workflow.ts` (2,482 lines) — Main workflow orchestrator
- `scripts/extractors/collect-session-data.ts` (1,005 lines) — Session data collection

### MCP Server Indexing (1,845 lines)
- `mcp_server/lib/parsing/memory-parser.ts` (969 lines) — Memory file parsing
- `mcp_server/handlers/memory-index.ts` (647 lines) — Index scan handler
- `mcp_server/lib/scoring/importance-tiers.ts` (229 lines) — Tier scoring

### Cross-Skill Standards
- `sk-code-opencode/SKILL.md` — OpenCode coding standards
- `sk-doc/SKILL.md` — Documentation standards
- `system-spec-kit/SKILL.md` — Spec Kit standards

## Iteration Focus Schedule

| Iter | Theme | Focus Area | Primary Agents |
|------|-------|------------|----------------|
| 1-3 | Code Quality | input-normalizer.ts decomposition, bug hunting, edge cases | A1, A2 |
| 4-6 | Architecture | Embedding pipeline, cache strategy, importance weighting | A2, C1 |
| 7-9 | Cross-Skill | P0/P1/P2 semantics, validation exit codes, HVR scope | A3, C2 |
| 10-12 | Automation | CLI UX, auto-migration, index rebuild workflow | C1, C3 |
| 13-15 | Deep Dive | Spec-affinity intelligence, memory indexing gaps, agent exclusivity | A1, A3 |
| 16-18 | Integration | End-to-end workflow testing, template placeholder policy, feature flags | C2, C3 |
| 19-20 | Synthesis | Consolidation, contradiction resolution, priority ranking | All |

## Next Focus
**CONVERGED** — Research complete. Moving to synthesis and review.

## What Worked / What Failed
### Iteration 1
- **Worked**: All 6 agents produced substantial findings. Codex (70-95KB outputs) extremely thorough. Copilot (12-24KB) more structured.
- **Worked**: Parallel dispatch of 3 Codex + 3 Copilot gave complementary perspectives.
- **Issue**: Codex agents take 8-10+ minutes. Copilot completes in 4-6 minutes.

### Iteration 2
- **Worked**: All 6 agents covered architecture, pipeline, session data, cross-skill. Very deep analysis.
- **Worked**: C1 ran a real synthetic benchmark on spec-affinity (350 specs, 122K cross-pairs).
- **Worked**: A2 did actual AST analysis with TypeScript compiler for cyclomatic complexity.

### Iteration 3
- **Worked**: Targeted 2 agents efficiently closed remaining gaps.
- **Observation**: All 17 questions covered within 3 iterations (plan allowed for 20).

## Convergence Tracking
| Iter | newInfoRatio | rollingAvg | MAD | questionsCovered | weightedScore |
|------|-------------|------------|-----|-----------------|---------------|
| 1 | 0.85 | 0.85 | — | 7/17 (41%) | 0.14 |
| 2 | 0.65 | 0.75 | 0.10 | 16/17 (94%) | 0.58 |
| 3 | 0.15 | 0.55 | 0.25 | 16.5/17 (97%) | 0.72 |
| **CONVERGED** | — | — | — | — | **0.72 > 0.60** |
