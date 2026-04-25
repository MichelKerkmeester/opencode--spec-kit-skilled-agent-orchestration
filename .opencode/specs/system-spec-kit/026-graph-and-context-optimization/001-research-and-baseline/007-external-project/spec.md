---
# SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2
title: "Feature Specification: External Project Research for Graph and Context Optimization"
description: "Research-only seed spec for a later deep-research flow that will audit the downloaded External Project project for portable ideas to improve Public's Code Graph system, Spec Kit Memory causal graph, and Skill Graph surfaces."
trigger_phrases:
  - "git nexus research"
  - "external-project code graph"
  - "code graph git nexus"
  - "memory causal graph external-project"
  - "skill graph external-project"
  - "007-external-project"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project"
    last_updated_at: "2026-04-25T00:00:00Z"
    last_updated_by: "codex-spec-seed"
    recent_action: "Created seed spec for future External Project deep-research flow"
    next_safe_action: "Run /spec_kit:deep-research:auto against this spec when ready"
    blockers: []
    key_files:
      - "spec.md"
      - "external/README.md"
      - "external/ARCHITECTURE.md"
      - "external/"
      - "external/shared/"
      - "external/external-project-web/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "external-project-research-seed"
      parent_session_id: null
    completion_pct: 5
    open_questions:
      - "Which External Project graph, query, impact, and group-contract patterns are worth adapting into Public's Code Graph package?"
      - "Can External Project concepts improve Spec Kit Memory's causal graph without duplicating existing memory retrieval machinery?"
      - "Are there External Project agent-skill or MCP affordances that should influence Public's Skill Graph design?"
    answered_questions: []
---
# Feature Specification: External Project Research for Graph and Context Optimization

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

This packet seeds a future deep-research flow over the downloaded External Project project in this `external/` folder. The research should determine whether External Project patterns can be adopted, adapted, or rejected for three Public systems: the Code Graph package, Spec Kit Memory's causal graph, and the emerging Skill Graph surface.

**Key Decisions**: Treat External Project source as research input only during the deep-research phase; use the canonical `/spec_kit:deep-research:auto` workflow later; produce an evidence-backed Adopt/Adapt/Reject matrix rather than implementing anything in this packet.

**Critical Dependencies**: External Project source tree is present in `external/`; primary orientation docs are `external/README.md`, `external/ARCHITECTURE.md`, `external/RUNBOOK.md`, `external/TESTING.md`, and `external/AGENTS.md`; deeper evidence must come from exact source files under `external/`, `external/shared/`, `external/external-project-web/`, and `external/eval/`.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Planned - research not yet started |
| **Created** | 2026-04-25 |
| **Branch** | `main` (research-only seed; no branch required yet) |
| **Parent Spec** | `../spec.md` |
| **External Source** | `external/` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Public already has a Code Graph system, Spec Kit Memory, and Skill Advisor/Skill Graph-adjacent routing surfaces, but their graph responsibilities have grown in separate tracks. External Project appears to solve overlapping problems: local repository indexing, call/dependency/process graph construction, hybrid search, impact analysis, multi-repo contract bridging, and agent-facing MCP tools. Without a source-grounded comparison, Public risks either missing useful architecture or importing incompatible concepts.

### Purpose

Run a later deep-research loop that audits External Project as an external reference implementation and produces concrete recommendations for improving Public's graph and context systems.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- External Project ingestion pipeline: scan, structure, markdown, parse, routes, tools, ORM, cross-file, MRO, communities, and processes phases described in `external/ARCHITECTURE.md`.
- External Project graph persistence and query model: LadybugDB adapter, schema, hybrid BM25/vector search, Cypher escape hatch, staleness handling, and registry behavior.
- External Project MCP/CLI affordances: `query`, `context`, `impact`, `detect_changes`, `rename`, `route_map`, `tool_map`, `shape_check`, `group_list`, and `group_sync`.
- External Project impact and safety mechanics: blast-radius semantics, change detection, graph-assisted rename, route/API impact, response-shape checking, and pre-edit guidance.
- External Project group and contract bridge concepts: cross-repo groups, Contract Registry, provider/consumer rows, and group-aware query/context/impact routing.
- Possible transfer paths into Public's Code Graph package: graph schema, edge types, scan pipeline phases, context summaries, freshness model, process extraction, and startup/session payloads.
- Possible transfer paths into Spec Kit Memory causal graph: causal edges, co-activation relationships, provenance, impact lineage, and memory-to-code evidence navigation.
- Possible transfer paths into Skill Graph: skill-to-file coverage, skill dependency graphing, skill routing evidence, hook advisory context, and skill impact/change detection.

### Out of Scope

- Implementing any External Project-inspired changes during this packet.
- Modifying External Project source under `external/` beyond this seed spec.
- Treating README claims as truth without source or test evidence.
- Replacing Public's existing Code Graph, Spec Kit Memory, or Skill Advisor wholesale.
- Commercial, licensing, publishing, or marketplace evaluation beyond noting adoption constraints.
- Running network calls or external services during research unless the user explicitly approves a later workflow that needs them.

### Files to Change

This seed request creates only the initial spec document. Later deep-research workflow outputs should live under `research/`.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Create | Seed spec for the future External Project deep-research flow |
| `research/` | Create later | Iteration state, findings, synthesis, and Adopt/Adapt/Reject matrix generated by `/spec_kit:deep-research:auto` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Research uses canonical deep-research workflow | Later execution is invoked through `/spec_kit:deep-research:auto`, not direct ad hoc agent loops |
| REQ-002 | External Project source claims are evidence-checked | Every recommendation cites exact files and line numbers from the downloaded source tree |
| REQ-003 | Adopt/Adapt/Reject matrix produced | Final synthesis includes a table mapping each candidate External Project pattern to Adopt, Adapt, Reject, or Defer |
| REQ-004 | Code Graph improvement opportunities identified | Research names concrete Public Code Graph files or behaviors that could benefit, or explicitly says none were found |
| REQ-005 | Memory causal graph opportunities identified | Research names concrete Spec Kit Memory causal-graph opportunities, risks, and evidence boundaries |
| REQ-006 | Skill Graph opportunities identified | Research names concrete Skill Graph or Skill Advisor routing opportunities, risks, and evidence boundaries |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | External Project architecture baseline documented | First research segment explains the actual index to graph to tool flow from source evidence |
| REQ-008 | Cross-system overlap bounded | Research distinguishes what belongs in Code Graph vs Memory vs Skill Graph, avoiding duplicated responsibilities |
| REQ-009 | Safety and operability patterns assessed | Research evaluates impact analysis, staleness, detect-changes, rename, shape-check, and group-contract safety surfaces |
| REQ-010 | Follow-up implementation phase seed proposed | Synthesis proposes one or more follow-up spec folders with scoped implementation candidates |
| REQ-011 | Licensing/adoption constraints noted | Research records any license or commercial-use constraints relevant to copying code vs adapting ideas |
| REQ-012 | Runtime and storage assumptions compared | Research compares External Project LadybugDB, embeddings, registry, and MCP assumptions with Public's current runtime constraints |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Future research synthesis contains evidence-backed findings with exact source citations.
- **SC-002**: At least one research section explicitly addresses each target system: Code Graph, Spec Kit Memory causal graph, and Skill Graph.
- **SC-003**: The final matrix separates direct adoption candidates from adaptation-only ideas and rejected ideas.
- **SC-004**: Any recommendation that depends on runtime measurement is marked "requires runtime observation" with a concrete measurement proposal.
- **SC-005**: No implementation changes are made during the research packet unless the user starts a later implementation phase.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | External Project source in `external/` | Research cannot proceed without the downloaded source tree | Confirm source paths before starting deep research |
| Dependency | Public Code Graph, Memory, and Skill Graph source paths | Recommendations must map to real Public code, not conceptual targets | Use direct file reads and exact path citations |
| Risk | README claims overstate implemented behavior | Could lead to adopting marketing instead of working patterns | Verify claims against source and tests before using them |
| Risk | External Project and Public use different graph/runtime assumptions | Direct code reuse may be inappropriate | Prefer architectural adaptation unless source compatibility is proven |
| Risk | Research scope spans too many systems | Findings become broad and shallow | Use phased research questions and force per-system closeouts |
| Risk | External source folder contains repo-specific AGENTS rules | Later agents may over-apply External Project edit rules to Public work | Treat External Project AGENTS rules as governing the external tree only |
<!-- /ANCHOR:risks -->

---
<!-- ANCHOR:questions -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Research Quality

- **NFR-Q01**: Every claim about External Project internals must cite exact source files and line numbers.
- **NFR-Q02**: Findings must distinguish source-confirmed, test-confirmed, README-level, and inference-only evidence.
- **NFR-Q03**: Recommendations must name the target Public system and explain why that system is the right owner.
- **NFR-Q04**: The research synthesis must preserve negative findings, including ideas that should be rejected.

### Research Safety

- **NFR-S01**: External Project source under `external/` is read-only for the future research loop.
- **NFR-S02**: Public implementation files are read-only during the research loop.
- **NFR-S03**: Any later implementation must be split into a separate spec folder after research synthesis.

### Suggested Research Questions

These questions are the initial queue for the later deep-research flow. The researcher may refine them after the architecture baseline, but should preserve coverage across all three target systems.

**Dimension A - Code Graph Package**

- **RQ-01 Pipeline Design**: Which External Project ingestion phases or typed DAG patterns could improve Public's structural indexer, scan scoping, edge enrichment, or process extraction?
- **RQ-02 Query and Context Surface**: Does External Project provide better patterns for `query`, `context`, `impact`, freshness warnings, startup summaries, or user-facing graph highlights?
- **RQ-03 Impact and Change Safety**: Can External Project `impact`, `detect_changes`, `rename`, `route_map`, `tool_map`, or `shape_check` concepts improve Public's pre-edit and post-edit safety story?
- **RQ-04 Multi-Repo and Contracts**: Are External Project group mode and Contract Registry concepts useful for future Public cross-repo graph work?

**Dimension B - Spec Kit Memory Causal Graph**

- **RQ-05 Causal Edge Model**: Which External Project relationship types, process flows, or cross-file dependencies could map into memory causal edges without turning memory into a duplicate code index?
- **RQ-06 Provenance and Staleness**: Does External Project offer useful patterns for graph freshness, source provenance, indexing metadata, or stale-result warnings in memory retrieval?
- **RQ-07 Impact Lineage**: Can External Project impact analysis inspire memory-level "what prior decisions or specs are affected by this change" traversal?

**Dimension C - Skill Graph and Advisor Surfaces**

- **RQ-08 Skill-to-Code Coverage**: Can External Project tool/resource mapping or process extraction help build a skill graph that links skills, commands, agents, and the code they govern?
- **RQ-09 Routing Evidence**: Could External Project-style graph context improve Skill Advisor recommendations by adding dependency, ownership, or blast-radius signals?
- **RQ-10 Skill Change Detection**: Can detect-changes or graph-assisted rename patterns be adapted to warn when a skill, command, or agent change affects downstream workflows?

**Dimension D - Adoption Boundaries**

- **RQ-11 Runtime Fit**: Which External Project pieces depend on LadybugDB, embeddings, Tree-sitter native bindings, or project-local install assumptions that do not fit Public?
- **RQ-12 Adoption Priority**: Which three External Project ideas should be implemented first if research finds strong evidence, and which should be rejected despite being appealing?

### Open Questions

- Should the later deep-research loop run a fixed 20 iterations, or start with 10 and extend only if findings are still novel?
- Should the final synthesis seed one follow-up implementation packet or separate packets for Code Graph, Memory causal graph, and Skill Graph?
- Should licensing review be part of the research closeout, or handled before any implementation that copies code?

---

## 8. EDGE CASES

### Data Boundaries

- External Project source tree changes before research starts: record the commit or local file timestamp baseline before making claims.
- External Project contains generated or vendored files: exclude them from architectural findings unless they are part of the actual runtime path.
- Public system ownership is ambiguous: mark the recommendation as "owner unresolved" and do not force it into a target system.

### Error Scenarios

- Deep-research workflow cannot start: verify the canonical `/spec_kit:deep-research:auto` command surface and the target spec folder.
- Source citations drift during research: re-run `nl -ba` on cited files before final synthesis.
- A recommendation touches multiple systems: split it into a shared design note plus system-specific implementation candidates.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 19/25 | External Project CLI/core, MCP tools, web UI, shared types, eval harness, and Public comparison targets |
| Risk | 8/25 | Research-only now; later implementation could affect graph and memory infrastructure |
| Research | 18/20 | External architecture audit plus three-system adoption analysis |
| Multi-Agent | 8/15 | Later flow uses canonical deep-research workflow; no parallel agents required at seed stage |
| Coordination | 10/15 | Recommendations must be split across Code Graph, Memory causal graph, and Skill Graph ownership |
| **Total** | **63/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Research becomes a feature inventory instead of an adoption decision | M | M | Require Adopt/Adapt/Reject matrix and target-system ownership |
| R-002 | External Project architecture is too different for direct reuse | M | H | Prefer pattern adaptation; reject direct reuse where runtime assumptions diverge |
| R-003 | Recommendations duplicate existing Public capabilities | M | M | Compare every recommendation against current Code Graph, Memory, and Skill Advisor code |
| R-004 | License constraints limit copying code | H | M | Record license constraints and distinguish idea adaptation from code reuse |
| R-005 | Deep-research over-focuses on Code Graph and misses Memory or Skill Graph | M | M | Require per-system sections and success criteria for all three systems |

---

## 11. USER STORIES

### US-001: Research External Project for Code Graph Improvements (Priority: P0)

**As a** Public maintainer, **I want** a source-grounded audit of External Project graph construction and agent-facing tools, **so that** I can decide which ideas should improve Public's Code Graph package.

**Acceptance Criteria**:
1. **Given** the future research synthesis exists, **When** I read the Code Graph section, **Then** each recommendation cites External Project source and maps to a Public Code Graph target area.
2. **Given** a External Project idea is rejected, **When** I read the matrix, **Then** the rejection states whether the reason is runtime mismatch, duplication, weak evidence, or licensing.

### US-002: Research External Project for Memory Causal Graph Improvements (Priority: P0)

**As a** Spec Kit Memory maintainer, **I want** External Project relationship and impact patterns evaluated against memory's causal graph, **so that** memory can improve evidence navigation without becoming a second code index.

**Acceptance Criteria**:
1. **Given** the memory section exists, **When** I read a recommendation, **Then** it explains whether the concept belongs in memory retrieval, causal graph traversal, or not in memory at all.
2. **Given** a recommendation relies on source-code relationships, **When** it is proposed, **Then** it names how Code Graph and Memory should share responsibility.

### US-003: Research External Project for Skill Graph Improvements (Priority: P1)

**As a** Skill Graph or Skill Advisor maintainer, **I want** External Project agent integration patterns evaluated, **so that** skill routing and skill impact analysis can gain graph evidence where it helps.

**Acceptance Criteria**:
1. **Given** the skill section exists, **When** I read a recommendation, **Then** it distinguishes skill routing, skill dependency mapping, and skill change-impact use cases.
2. **Given** a External Project tool/resource pattern is proposed, **When** I read it, **Then** it names the specific skill, command, or advisor surface that would use it.

### US-004: Seed Follow-Up Implementation Work (Priority: P1)

**As a** packet owner, **I want** the research closeout to seed scoped implementation candidates, **so that** later work can proceed without redoing discovery.

**Acceptance Criteria**:
1. **Given** the research has converged, **When** synthesis completes, **Then** top recommendations are grouped into one or more follow-up packet proposals.
2. **Given** a follow-up recommendation is high risk, **When** it is listed, **Then** it includes a suggested validation strategy before implementation.

---

## 12. OPEN QUESTIONS

- How many deep-research iterations should be budgeted for first pass: 10 focused iterations or 20 full iterations?
- Should follow-up implementation be split by target system or by shared graph capability?
- Which current Public source paths should be treated as canonical comparison targets for Skill Graph work if that subsystem is still emerging?
- Should External Project be indexed with Public's Code Graph before research, or should the loop rely on direct file reads first to avoid trusting a newly built graph?
- What licensing threshold is acceptable: copying source, adapting architecture, or only documenting conceptual inspiration?
<!-- /ANCHOR:questions -->

---

## 13. RELATED DOCUMENTS

<!-- BEGIN GENERATED: deep-research/spec-findings -->
### Deep-Research Findings Summary

The 10-iteration External Project deep-research run completed in `research/007-external-project-pt-01/`. The final synthesis recommends adapting External Project' phase-DAG ingestion, edge confidence/reason metadata, richer pre-edit impact surfaces, route/tool/shape checks, and cross-repo contract resources. It rejects direct LadybugDB storage migration, wholesale source copying, a single shared graph for Code Graph/Memory/Skill Graph, and a new Skill Advisor scoring lane.

Primary ownership boundaries:

- **Code Graph** owns structural extraction, phase-DAG indexing, process/route/tool edges, freshness, and pre-edit blast-radius evidence.
- **Spec Kit Memory** owns decision lineage and should link to Code Graph evidence with provenance and freshness metadata instead of copying structural code edges into `causal_edges`.
- **Skill Graph / Skill Advisor** owns skill-to-command, skill-to-agent, skill-to-file, and hook evidence, feeding the existing graph-causal scoring lane.

Recommended follow-up packets:

1. `008-code-graph-phase-dag-and-edge-provenance`
2. `009-code-graph-impact-and-safety-surfaces`
3. `010-memory-code-evidence-bridge`
4. `011-skill-graph-evidence-and-impact`

Canonical artifacts:

- `research/007-external-project-pt-01/research.md`
- `research/007-external-project-pt-01/deep-research-dashboard.md`
- `research/007-external-project-pt-01/findings-registry.json`
- `research/007-external-project-pt-01/resource-map.md`
<!-- END GENERATED: deep-research/spec-findings -->

### Deep-Research Start Prompt

Use this prompt when starting the later workflow:

```text
/spec_kit:deep-research:auto

Research the downloaded External Project project in this spec folder's external source tree. Determine which patterns can be adopted, adapted, rejected, or deferred to improve Public's Code Graph package, Spec Kit Memory causal graph, and Skill Graph or Skill Advisor graph surfaces. Ground every claim in exact source citations. Do not implement changes. Produce a final Adopt/Adapt/Reject matrix, per-system recommendations, ownership boundaries, risks, and follow-up implementation packet proposals.
```
