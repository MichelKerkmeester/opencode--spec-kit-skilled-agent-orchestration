---
title: "Feature Specification [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/004-graphify/spec]"
description: "Read-only research investigation of the graphify external Python skill to identify two-pass AST+LLM extraction, Leiden clustering, evidence-tagging, multimodal, and PreToolUse hook patterns Public should adopt, adapt, or reject."
trigger_phrases:
  - "graphify research spec"
  - "004-graphify phase spec"
  - "two-pass extraction research"
  - "graphify adopt adapt reject"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["spec.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->"
---
# Feature Specification: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 4 of `001-research-graph-context-systems` is a read-only audit of the graphify external Python skill to translate its two-pass codebase knowledge graph patterns into concrete improvements for Code_Environment/Public's existing structural retrieval stack (Code Graph MCP, CocoIndex, Spec Kit Memory). The deliverable is an evidence-backed Adopt/Adapt/Reject table grounded in specific `external/graphify/` file:line citations, not a generic feature inventory. No source files outside this spec folder are modified during the research phase.

**Key Decisions**: Use a 20-iteration two-wave deep-research loop; preserve K1 to K42 finding lineage across the original run plus completed-continue wave; keep Code Graph MCP and CocoIndex as the platform while translating graphify patterns into additive rollout guidance for Public.

**Critical Dependencies**: cli-codex CLI installed; `external/graphify/` accessible at the spec folder root; reducer script at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`; memory script at `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-06 |
| **Branch** | `main` (research-only phase, no branch needed) |
| **Parent Spec** | `../spec.md` |
| **Predecessor Phase** | `../003-contextador/spec.md` |
| **Successor Phase** | `../005-claudest/spec.md` |
<!-- /ANCHOR:metadata -->


---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Public already has Code Graph MCP for structural code queries (442.9K nodes, 225.4K edges), CocoIndex for semantic retrieval, Spec Kit Memory for persistent context, and hook-based context injection patterns. It does NOT have community-clustered knowledge graphs, multimodal artifact extraction (PDFs, images), evidence-tagged provenance for retrieval edges, or a PreToolUse hook that nudges Claude away from raw Grep when a structural index exists. graphify ships all four capabilities in a small Python package, so it is the closest external candidate to study before deciding which patterns to bring inside Public.

### Purpose

Produce an evidence-backed translation layer that tells Public exactly which graphify patterns to adopt directly, adapt into existing surfaces, or reject as duplicative or non-applicable, with every recommendation tied to `external/graphify/` file:line evidence and to a specific Public surface (Code Graph MCP, CocoIndex, Spec Kit Memory, hooks, or CLAUDE.md).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Two-pass extraction architecture (AST + LLM) and merge logic
- Per-language extractor inventory across `extract.py` (12 extractors, 16 extensions)
- Leiden community clustering parameters and cohesion logic
- Evidence labelling vocabulary (EXTRACTED, INFERRED, AMBIGUOUS) and confidence backfill
- Multimodal pipeline for PDFs, images, papers, and tweets
- Cache invalidation across `detect.py` and `cache.py`
- PreToolUse hook payload, matcher, and CLAUDE.md companion section
- JSON, HTML, Obsidian, wiki, Canvas, Neo4j, GraphML, SVG export contracts plus the `external/worked/karpathy-repos/GRAPH_REPORT.md` reference output
- MCP `serve.py` interface and tool surface
- 71.5x token-reduction claim credibility
- Adopt / Adapt / Reject recommendations against Public's existing stack
- Cross-phase deduplication versus phases 002 (codesight) and 003 (contextador)

### Out of Scope

- Modifying any file under `external/` (read-only treatment) - graphify is the subject of study, not the target of edits
- HTML viewer styling, vis.js chrome, sidebar cosmetics - not relevant to retrieval architecture
- PyPI packaging mechanics, release cadence, CHANGELOG semantics - orthogonal to the audit
- Wholesale replacement of Code Graph MCP or CocoIndex - prompt Don'ts forbid it unless graphify clearly solves something they cannot
- Implementation of any adopted patterns - deferred to a follow-up `/spec_kit:plan`
- Phase 002 (codesight) AST extraction decisions - covered by its own phase
- Phase 003 (contextador) MCP server decisions - covered by its own phase

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/research.md` | Create + Modify | Canonical synthesis: 17 sections, 12 baseline findings (K1 to K12), 20 cli-codex extension findings (K13 to K32), Adopt/Adapt/Reject table |
| `research/iterations/iteration-001.md` to `research/iterations/iteration-020.md` | Create | 20 per-iteration evidence files across the original run and completed-continue wave |
| `research/deep-research-config.json` | Create + Modify | Loop config; status flips initialized to complete on synthesis |
| `research/deep-research-state.jsonl` | Create + Append | Append-only event log |
| `research/deep-research-strategy.md` | Create + Modify | Strategy + reducer-owned sections |
| `research/findings-registry.json` | Create + Modify | Reducer-owned findings registry |
| `research/deep-research-dashboard.md` | Create + Modify | Reducer-owned dashboard |
| `memory/06-04-26_*.md` | Create | Memory artifacts via `generate-context.js` |
| `spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`, `decision-record.md`, `checklist.md` | Create + Modify | Level 3 Spec Kit documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the end-to-end graphify pipeline architecture from `detect` through `export` with file:line citations | research.md section 4 names all 7 stages with at least 1 file:line cite per stage |
| REQ-002 | Map AST extraction internals: language coverage, node and edge schema, Python call graph and cross-file `uses` inference, rationale handling | research.md section 5 includes the 12-extractor matrix and the cross-file inference walkthrough |
| REQ-003 | Capture the semantic subagent prompt verbatim from `external/skills/graphify/skill.md` and document the merge / cache / promotion path to `graph.json` | research.md section 5.4 to 5.5 cites `skill.md:184-234` and `skill.md:259-317` directly |
| REQ-004 | Document the EXTRACTED / INFERRED / AMBIGUOUS evidence vocabulary, validator enforcement, and numeric backfill | research.md section 6 cites `validate.py:5` and `export.py:250, 264-275` and explains the two-source-of-truth issue |
| REQ-005 | Document the multimodal pipeline (PDF text via pypdf, image semantic via Claude vision, URL ingestion) and security guards | research.md section 7 cites `ingest.py`, `security.py`, `detect.py:91-112`, and the per-image-type strategies in `external/skills/graphify/skill.md` |
| REQ-006 | Document the PreToolUse hook payload, matcher, fire conditions, and CLAUDE.md companion | research.md section 8 quotes the verbatim hook string and cites `__main__.py:9-21, 70-79, 108-131` |
| REQ-007 | Document Leiden clustering parameters, oversized-community split rules, god nodes, surprising connections, and `external/worked/karpathy-repos/GRAPH_REPORT.md` structure | research.md sections 5 and 12 cover `cluster.py`, `analyze.py`, `report.py` end-to-end |
| REQ-008 | Verify the 71.5x token-reduction claim against `external/worked/karpathy-repos/` and identify load-bearing assumptions | research.md K1 reproduces `123,488 / 1,726 = 71.55x` and lists the three assumptions |
| REQ-009 | Compare graphify against Public's existing Code Graph MCP and CocoIndex without duplicating phase 002 or phase 003 findings | research.md section 10 has a capability matrix; section 11 documents cross-phase deduplication |
| REQ-010 | Produce Adopt / Adapt / Reject recommendations with prioritization | research.md section 12 has 6 Adopt + 7 Adapt + 4 Reject rows plus an impact-effort matrix |
| REQ-011 | Validate the spec folder via `validate.sh --strict` with no errors | Strict validator returns RESULT: PASSED |
| REQ-012 | Save memory context via `generate-context.js` and verify artifact exists | At least one file in `memory/*.md` with critical importance tier |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Per-iteration evidence files for every loop run | `research/iterations/iteration-{001..020}.md` exist with Findings, Sources Queried, Tools Used sections |
| REQ-014 | Reducer-managed registry, dashboard, and machine-owned strategy sections | `findings-registry.json`, `research/deep-research-dashboard.md` refreshed by `reduce-state.cjs` after every iteration |
| REQ-015 | cli-codex extension iterations 8 to 10 produce K13 to K32 findings | research.md section 13.A has 20 net-new findings beyond K1 to K12 |
| REQ-016 | Cross-corpus validation across `karpathy-repos` and `mixed-corpus` worked examples | research.md K26 cites both corpora and identifies the packaging mismatch |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: research.md contains at least 12 cited findings (delivered: 42 consolidated findings = K1 to K42, all with file:line citations)
- **SC-002**: Adopt / Adapt / Reject table is line-grounded for every row (delivered inline in section 12, with section 13.A.4 retained only as lineage notes)
- **SC-003**: Cross-phase overlap with 002 and 003 acknowledged in section 11 with explicit deduplication notes
- **SC-004**: 22 of 22 research questions answered across wave 1 and wave 2 (final coverage 1.0 at iter 20)
- **SC-005**: `validate.sh --strict` returns RESULT: PASSED with zero errors
- **SC-006**: Memory artifact saved with `critical` importance tier and clean trigger phrases
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | cli-codex CLI 0.118 with gpt-5.4 model access | Iters 1, 8, 9, 10 cannot dispatch | Fall back to claude-opus-direct reads (proven pattern from iters 2-7) |
| Dependency | `reduce-state.cjs` reducer script | Strategy and registry will not refresh | Run reducer manually after each iteration; verify exit code 0 |
| Dependency | `generate-context.js` memory script | Memory save will fail | Use structured JSON file path argument; manually patch HIGH severity issues post-save |
| Risk | codex parallel-job API contention starvation (observed in original iter 2) | High - blocks the iteration | Switch engine to claude-opus-direct mid-loop; record `engine_switch` event in JSONL |
| Risk | Composite_converged stop fires before all questions answered | Medium - misses Q12 grounding | User may explicitly override stop and dispatch additional iterations (used at iter 8 to 10) |
| Risk | Iteration findings duplicate phase 002 or 003 work | Medium - redundant effort | Cross-phase awareness loaded into strategy.md `Known Context` section at init |
| Risk | Memory `trigger_phrases` quality flags HIGH severity issues | Low - blocks memory finalization | Manually patch trigger phrases to remove path fragments and add domain terms |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Each iteration completes in under 10 minutes wall clock; cli-codex iterations target 4 to 8 minutes
- **NFR-P02**: Tool call budget per iteration: target 8, hard max 12

### Security

- **NFR-S01**: External repo treated as read-only - no writes to `external/**`
- **NFR-S02**: codex sandbox mode `workspace-write` only outside `external/`; iter prompts forbid modifying `external/`

### Reliability

- **NFR-R01**: JSONL state log is append-only; reducer is idempotent for identical inputs
- **NFR-R02**: Strategy file machine-owned sections (7 to 11) only refreshed by reducer, never manually
- **NFR-R03**: Memory save uses structured JSON contract; manual Write tool blocked for memory paths

---

## 8. EDGE CASES

### Data Boundaries

- Empty input: research questions list cannot be empty - phase prompt enforces 12 questions
- Maximum length: research.md grew to 859 lines after iter 8 to 10; no upper bound but section 13 must stay scannable

### Error Scenarios

- codex starvation: switch engine, log `engine_switch` event, continue with claude-opus-direct
- Reducer schema mismatch: reject input, log conflict event, halt iteration
- Memory script "spec folder not found": pass relative spec folder path with `system-spec-kit/...` prefix
- composite_converged at iter 7 then user requests more iterations: log `continuation` event in JSONL, do not overwrite prior synthesis
- Iteration writes to research/iterations/iteration-NNN.md already exists: write-once protection - block overwrite

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~25 read, ~10 written, Systems: deep-research loop + reducer + memory pipeline |
| Risk | 8/25 | Auth: N, API: cli-codex external, Breaking: N (research-only) |
| Research | 20/20 | 22 explicit research questions across a 20-iteration two-wave loop, including Public-internal rollout translation |
| Multi-Agent | 10/15 | Workstreams: 1 leaf agent dispatched per iteration; serial orchestration |
| Coordination | 10/15 | Dependencies: reducer between iterations, memory script post-synthesis |
| **Total** | **66/100** | **Level 3 (research lens dominant)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | codex parallel-job API contention starvation | H | M | Engine switch to claude-opus-direct, log `engine_switch` event |
| R-002 | Composite_converged stop misses Q12 grounding | M | M | Allow user override; log `continuation` event; resume same lineage |
| R-003 | Cross-phase finding duplication with 002/003 | M | M | `Known Context` injection at init; explicit deduplication note in section 11 |
| R-004 | Memory `trigger_phrases` quality flags HIGH severity | L | M | Manual patch post-save; never run script blind |
| R-005 | Reducer schema mismatch on malformed JSONL append | L | L | Idempotent reducer; conflict event in state log |

---

## 11. USER STORIES

### US-001: Evidence-Grounded Adoption Decisions (Priority: P0)

**As a** Public maintainer evaluating external graph systems, **I want** every Adopt/Adapt/Reject row to be backed by a specific `external/graphify/` file:line citation, **so that** I can audit the recommendation independently and reject any claim I cannot verify in source.

**Acceptance Criteria**:
1. **Given** research.md section 12, **When** I scan any row, **Then** I see at least one `[SOURCE: external/graphify/...:LINE-LINE]` citation per row.
2. **Given** any K1 to K42 finding, **When** I open the cited file at the cited lines, **Then** the code matches the claim.
3. **Given** the cli-codex extension rows (A5, A6, D6, D7) now inlined into section 12, **When** I trace their evidence, **Then** each points back to the relevant K-finding lineage in section 13.A.

---

### US-002: Cross-Phase Deduplication (Priority: P0)

**As a** Public maintainer reading the parent 026 packet, **I want** phase 004 recommendations to NOT duplicate phase 002 or 003 work, **so that** the parent synthesis stays clean and each phase contributes unique value.

**Acceptance Criteria**:
1. **Given** the cross-phase awareness table from `scratch/phase-research-prompt.md`, **When** I read research.md section 11, **Then** I see explicit notes on what was excluded because phases 002 or 003 cover it.
2. **Given** the Reject table (R1, R2), **When** I check the rationale, **Then** both rows explicitly redirect AST extractor and MCP server adoption to phases 002 and 003.

---

### US-003: Audit-Ready Iteration Trail (Priority: P1)

**As a** future researcher resuming this work, **I want** every iteration to have its own evidence file with sources and tools used, **so that** I can replay any iteration and reproduce its findings without re-reading the entire synthesis.

**Acceptance Criteria**:
1. **Given** `research/iterations/`, **When** I list files, **Then** I see `research/iterations/iteration-001.md` through `research/iterations/iteration-020.md` (20 files).
2. **Given** any iteration file, **When** I read it, **Then** I see Focus, Findings, Tools Used, Sources Queried sections at minimum.

---

### US-004: Engine Switch Auditability (Priority: P1)

**As a** future researcher debugging a deep-research loop, **I want** every engine switch (cli-codex to claude-opus-direct or back) to be logged as an explicit JSONL event, **so that** I can correlate findings to engines and detect engine-specific bias.

**Acceptance Criteria**:
1. **Given** `research/deep-research-state.jsonl`, **When** I grep for `engine_switch`, **Then** I see at least one event with `from`, `to`, `reason`, and `timestamp` fields.
2. **Given** any iteration record in JSONL, **When** I read it, **Then** I see an `engine` field naming the engine that produced the iteration.

---

### US-005: Adopt Path Has File-Level Roll-In Steps (Priority: P1)

**As a** Public maintainer who decided to adopt A1 (evidence tagging) or A2 (PreToolUse hook), **I want** the section 12 row to name the exact Public file or surface to modify, **so that** I can open a follow-up plan without re-deriving the integration point.

**Acceptance Criteria**:
1. **Given** any Adopt row in research/research.md section 12, **When** I read the "Concrete Adoption Plan" column, **Then** I see a specific Public surface (for example `code_graph_query` response payload, project hooks, CocoIndex incremental update path).
2. **Given** the cli-codex extension rows (A5, A6, D6, D7) in section 12, **When** I read each row, **Then** I see the K-finding source plus the target Public surface.

---

### US-006: Cross-Phase Synthesis Hand-Off (Priority: P2)

**As a** researcher synthesizing the parent 026 packet, **I want** phase 004 to leave a memory artifact with critical importance tier and clean trigger phrases, **so that** future cross-phase research can recall this phase's findings without re-running iterations.

**Acceptance Criteria**:
1. **Given** the spec folder memory directory, **When** I list files, **Then** I see at least one Markdown artifact with frontmatter `importance_tier: critical`.
2. **Given** the memory artifact, **When** I read its `trigger_phrases` field, **Then** I see domain-specific phrases (graphify research, evidence tagging, two-pass extraction) and NO path fragments leaked from auto-generation.

---

## 12. OPEN QUESTIONS

- None remaining. All 22 research questions are answered (final coverage 1.0 at iter 20). Q12 is fully covered in section 12, and Q13-Q22 are covered in section 13.B.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Implementation Summary**: See `implementation-summary.md`
- **Canonical research output**: See `research/research.md`
- **Phase prompt**: `scratch/phase-research-prompt.md`

---

<!--
LEVEL 3 SPEC
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->
