---
title: "Flawless JSON Memory Pipeline — Deep Research Topic"
framework: "CRAFT (Research variant)"
mode: "$improve"
clear_score: 44/50
created: 2026-03-21
consumption: "10 GPT 5.4 agents, 2 waves of 5, reasoning effort high"
---

# Deep Research Topic: Flawless JSON Memory Capturing Pipeline

## CONTEXT

**Situation**: The `generate-context.js` pipeline is an 11-step TypeScript/Node.js memory generation system that produces YAML-frontmatter markdown files for MCP-indexed semantic memory. It processes AI-composed structured JSON input through:

1. Data loading (JSON via `--json`, `--stdin`, or file path)
2. Alignment checking (15% file-path overlap threshold)
3. Spec-folder detection (auto-detect or explicit CLI target)
4. Context directory setup (`memory/` subdirectory creation)
5. Contamination cleaning (74 denylist patterns, 3 severity levels)
6. Spec-folder and git context enrichment (observations, files, decisions)
7. Mustache template rendering with trigger phrase extraction and learning index calculation
8. Quality scoring (12 V-rules with severity-weighted penalty model)
9. Validation gating (write-blocking: V1,V3,V8,V9,V11 | index-blocking: V2,V12 | diagnostic: V4-V7,V10)
10. Atomic file writing with YAML frontmatter
10.5. Post-save quality review (compares saved frontmatter against original JSON payload)
11. MCP indexing via `memory_save()`

**Prior Work**: Phase 016 shipped structured JSON support (`toolCalls`, `exchanges`), file-backed JSON authority preservation, Wave 2 hardening (decision confidence, truncated titles, `git_changed_file_count` stability), and Wave 3 root cause fixes (RC1-RC5: sessionSummary title extraction, trigger phrase merge, keyDecisions propagation, importance tier cascading, contextType threading). A prior deep-research round (3 iterations, 3 agents, 21 findings) exists but targeted the abandoned hybrid-enrichment design rather than the shipped pipeline.

**Stakeholders**:

- **Memory consumers**: AI agents loading context via MCP semantic search (`memory_search`, `memory_quick_search`, `memory_match_triggers`)
- **Pipeline maintainers**: TypeScript developers modifying the `scripts/` directory
- **Session participants**: AI assistants composing the structured JSON input payload during `/memory:save` workflows

**Constraints**:

- Pipeline must remain backward-compatible with existing memory files
- JSON-primary input mode (`--json` or `--stdin`) is the sole canonical path
- File-backed JSON stays authoritative -- no stateless enrichment fallback
- Output must pass 12 V-rule quality scoring with write/index blocking gates
- YAML frontmatter must be parseable by any standard YAML parser
- Post-save quality review must report zero HIGH issues for a "clean" save

---

## ROLE

**Primary**: Pipeline reliability and output quality researcher conducting systematic, evidence-based investigation of the `generate-context.js` memory generation pipeline.

**Secondary**: TypeScript/Node.js systems analyst tracing data flow integrity across 11 pipeline stages with source-level precision.

**Authority**: Full read access to all source files. Findings MUST cite specific file paths and line numbers as `[SOURCE: file_path:line]`. Recommendations MUST be implementable as discrete code changes.

---

## ACTION

**Objective**: Identify concrete, implementable improvements to the `generate-context.js` pipeline that:

- (a) Eliminate silent field drops, truncations, and data mutations across all 11 steps
- (b) Prevent hallucinated or fabricated content appearing in memory output
- (c) Maximize trigger phrase quality and specificity for MCP search discoverability
- (d) Ensure YAML frontmatter validity, semantic accuracy, and cross-session coherence
- (e) Strengthen error resilience, validation coverage, and graceful degradation

### Domain Decomposition

#### Domain A: Pipeline Data Integrity (Steps 1-6)

**Focus**: Trace every JSON payload field through load -> normalize -> enrich to identify silent drops, truncations, mutations, and priority conflicts between explicit AI-provided input and enrichment-derived values. Map the exact priority chain for every field where both sources contribute.

**Key files**:
- `scripts/utils/input-normalizer.ts` -- field normalization, snake_case compat, keyDecisions fast-path
- `scripts/extractors/collect-session-data.ts` -- session data orchestration, multi-source aggregation
- `scripts/core/workflow.ts` -- main pipeline orchestrator, enrichment coordination, template assembly

#### Domain B: Schema & Validation Completeness (Steps 1, 8, 9)

**Focus**: Map all unvalidated input paths. Assess V-rule coverage gaps -- identify failure modes that no existing V-rule catches (target: 3+ uncovered modes). Evaluate whether a formal JSON Schema (or Zod/io-ts runtime validator) should replace ad-hoc runtime checks. Analyze what happens with unexpected fields, wrong types, or structurally invalid payloads.

**Key files**:
- `scripts/types/session-types.ts` -- TypeScript interfaces defining the JSON contract
- `scripts/lib/quality-scorer.ts` -- 12 V-rules with penalty model and sufficiency cap

#### Domain C: Quality Scoring Accuracy (Step 8)

**Focus**: Evaluate penalty weight calibration (high=0.25, medium=0.15, low=0.05) against actual memory files in the repository. Determine false positive rate (good memories scored low) and false negative rate (bad memories scored high). Assess whether the description quality tiers (placeholder, activity-only, semantic, high-confidence) and trust multipliers (synthetic=0.5, git=1.0, spec-folder/tool=0.8, default=0.3) predict real-world retrieval usefulness.

**Key files**:
- `scripts/lib/quality-scorer.ts` -- scoring dimensions, penalty model, sufficiency cap
- `scripts/renderers/memory-frontmatter.ts` -- description derivation, trigger phrase generation

#### Domain D: Indexing & Crawlability (Steps 10, 10.5, 11)

**Focus**: Analyze trigger phrase extraction pipeline for path-fragment contamination, overly generic phrases, missing domain-specific terms, and specificity distribution. Determine what field values optimize MCP search ranking in `memory_search()` and `memory_quick_search()` results. Identify memory files that are correctly written but practically invisible to search.

**Key files**:
- `scripts/renderers/memory-frontmatter.ts` -- trigger phrase generation, dedup, cap at 12
- `scripts/core/post-save-review.ts` -- generic title detection, path fragment detection, tier mismatch

#### Domain E: Hallucination & Error Prevention (Steps 5, 7, 8)

**Focus**: Map every point where the pipeline injects, synthesizes, or derives content NOT present in the explicit JSON input -- including auto-detected session characteristics, inferred decisions, synthetic file descriptions, generated topic extraction, and observation deduplication. Assess contamination filter completeness (74 patterns) for missing categories: PII, authentication tokens, partial stack traces, pricing/cost information, and model-specific artifacts.

**Key files**:
- `scripts/lib/contamination-filter.ts` -- 74 denylist patterns, 3 severity levels
- `scripts/extractors/session-extractor.ts` -- session ID generation, characteristic detection

#### Domain F: Semantic Quality & Cross-Session Coherence (Steps 7, 10)

**Focus**: Identify fields defined in `session-types.ts` but never consumed by any Mustache template, and template placeholders that have no corresponding data source. Trace the dedup pipeline (`buildSessionDedupContext()`) and causal link system (`memory_causal_link`) to assess how the system prevents duplicate or contradictory information across multiple memory files for the same spec folder.

**Key files**:
- `scripts/renderers/template-renderer.ts` -- Mustache rendering, variable interpolation, array loops
- `scripts/types/session-types.ts` -- type definitions, full field inventory

### Methodology

Evidence-based source code investigation. Every finding MUST include `[SOURCE: file_path:line_number]` citations. Recommendations MUST be implementable as discrete TypeScript changes. Prioritize findings by:

- **Severity**: CRITICAL (data loss/hallucination) > HIGH (quality degradation) > MEDIUM (suboptimal) > LOW (cosmetic)
- **Effort**: Small (1-10 LOC) < Medium (10-50 LOC) < Large (50+ LOC or new module)

---

## FORMAT

**Structure**: Findings organized by domain (A-F) with cross-cutting severity overlay. Each finding includes:

1. **Title**: Descriptive one-line summary
2. **Severity**: CRITICAL | HIGH | MEDIUM | LOW
3. **Source**: `[SOURCE: file_path:line_number]`
4. **Root cause**: Why this deficiency exists
5. **Impact**: What goes wrong when this is triggered
6. **Recommendation**: Concrete code change with target file and approach

**Detail level**: Technical -- specific to TypeScript functions, interfaces, and data structures in the pipeline. Include code-level suggestions referencing specific modules and line numbers.

**Deliverables**:
- Categorized improvement list with severity and effort per finding
- Root cause analysis for each output deficiency class
- Concrete code suggestions referencing specific modules and line numbers
- Gap analysis: what the pipeline cannot currently detect or prevent

---

## TARGET

**Audience**: Pipeline maintainers who will implement improvements as discrete spec-folder-tracked changes.

**Success metrics**:
- Every finding includes `[SOURCE: file:line]` citation backed by actual code
- At least 3 previously-unknown failure modes identified per domain (18+ total)
- Recommendations are specific enough to implement without further research
- Zero speculative claims -- every assertion is backed by source code evidence

**Consumption model**: This prompt will be decomposed into 12 focused research questions distributed across 10 GPT 5.4 agents (reasoning effort: high) in 2 waves of 5 agents each. Each agent receives one domain focus area and 1-2 specific questions. The prompt must be independently interpretable by each agent without requiring cross-agent context.
