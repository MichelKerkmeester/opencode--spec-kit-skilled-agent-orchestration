---
speckit_template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2"
title: "Implementation Plan: External Project Deep Research Closeout"
description: "Plan for running and closing a 10-iteration External Project deep-research workflow that compares External Project graph patterns with Public Code Graph, Spec Kit Memory causal graph, and Skill Graph surfaces."
trigger_phrases:
  - "git nexus research plan"
  - "external-project deep research"
  - "007-external-project plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/007-external-project"
    last_updated_at: "2026-04-25T07:10:00Z"
    last_updated_by: "codex"
    recent_action: "Closed out 10-iteration External Project deep research workflow"
    next_safe_action: "Review the final synthesis and decide which follow-up implementation packet to create first"
    blockers: []
    key_files:
      - "spec.md"
      - "research/007-external-project-pt-01/research.md"
      - "research/007-external-project-pt-01/deep-research-dashboard.md"
      - "research/007-external-project-pt-01/resource-map.md"
    session_dedup:
      fingerprint: "sha256:external-project-deep-research-2026-04-25"
      session_id: "dr-2026-04-25T06-21-07Z"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Which External Project patterns should Public adopt, adapt, reject, or defer?"
---
# Implementation Plan: External Project Deep Research Closeout

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSONL, Node.js reducer scripts |
| **Framework** | system-spec-kit deep research workflow |
| **Storage** | Spec packet files under `.opencode/specs/.../007-external-project/` |
| **Testing** | JSONL parse checks, reducer pass, targeted spec validation, full packet validation |

### Overview

This plan covers a research-only workflow. The work runs 10 deep-research iterations over the downloaded External Project source, reduces the iteration state, synthesizes recommendations, and saves the packet for later implementation planning. No External Project or Public implementation source files are changed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec folder established at `007-external-project`.
- [x] External Project source confirmed under `external/`.
- [x] User requested `/spec_kit:deep-research:auto`, 10 iterations, and parallel research support.

### Definition of Done

- [x] Ten iteration notes exist under `research/007-external-project-pt-01/iterations/`.
- [x] Ten delta logs exist under `research/007-external-project-pt-01/deltas/`.
- [x] Reducer dashboard, findings registry, resource map, and final synthesis exist.
- [x] `spec.md` contains a generated findings summary.
- [x] Validation results are recorded in `implementation-summary.md`.

### AI Execution Protocol

#### Pre-Task Checklist

- [x] Use the established spec folder.
- [x] Read workflow and template instructions before writing.
- [x] Keep External Project source read-only.
- [x] Keep Public implementation files read-only.

#### Execution Rules

| Rule | Application |
|------|-------------|
| Canonical workflow | Use `sk-deep-research` config, state, deltas, iterations, reducer, and dashboard files |
| Evidence first | Cite exact source paths and line numbers in iteration files and synthesis |
| Scope lock | Write only packet docs and workflow-owned research files |
| Verification | Parse JSONL, run reducer, and run spec validation before completion |

#### Status Reporting Format

Report progress by phase: setup, iteration progress, reducer outputs, synthesis, validation, memory save, and closeout.

#### Blocked Task Protocol

If a workflow tool fails, record the failure in `implementation-summary.md`, keep completed artifacts intact, and continue only when a safe packet-local recovery exists.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Canonical deep-research packet with append-only state, per-iteration notes, reducer-generated observability, and final synthesis.

### Key Components

- **State log**: `deep-research-state.jsonl` records initialization, iteration, and synthesis events.
- **Iteration files**: `research/007-external-project-pt-01/iterations/iteration-001.md` through `research/007-external-project-pt-01/iterations/iteration-010.md` preserve evidence and reflection.
- **Delta files**: `deltas/iter-001.jsonl` through `iter-010.jsonl` preserve machine-readable findings.
- **Reducer outputs**: `research/007-external-project-pt-01/findings-registry.json`, `research/007-external-project-pt-01/deep-research-dashboard.md`, and `research/007-external-project-pt-01/resource-map.md` summarize convergence.
- **Final synthesis**: `research/007-external-project-pt-01/research.md` turns evidence into decisions and follow-up packet proposals.

### Data Flow

External Project and Public source evidence feeds iteration notes and deltas. The reducer reads JSONL state and iteration files to update registry, dashboard, strategy, and resource map. The final synthesis reads the reduced evidence and writes a compact summary back to `spec.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Workflow Setup

- [x] Resolve artifact root to `research/007-external-project-pt-01/`.
- [x] Initialize config, state log, strategy, registry, prompts, deltas, and iterations folders.
- [x] Establish advisory lock while research is active.

### Phase 2: Evidence Gathering

- [x] Run architecture baseline research.
- [x] Research graph schema and persistence fit.
- [x] Research query, context, and impact surfaces.
- [x] Research change safety, route/tool/shape checks, group contracts, Memory fit, and Skill Graph fit.

### Phase 3: Synthesis and Verification

- [x] Produce Adopt/Adapt/Reject/Defer matrix.
- [x] Propose follow-up implementation packets.
- [x] Run reducer and emit dashboard/resource map.
- [x] Validate JSONL state and spec packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parse | Main state log and all delta JSONL files | Node.js JSON parser |
| Reducer | Registry, dashboard, strategy, resource map | `sk-deep-research/scripts/reduce-state.cjs` |
| Spec validation | Targeted research-safe spec checks and full packet validation | `system-spec-kit/scripts/spec/validate.sh` |
| Manual review | Synthesis, matrix, ownership boundaries, follow-up proposals | Direct file read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| External Project source under `external/` | External local source | Available | Research cannot cite External Project internals |
| system-spec-kit validation scripts | Internal tooling | Available | Packet cannot be verified |
| sk-deep-research reducer | Internal tooling | Available | Dashboard and resource map cannot be generated |
| Spec Kit Memory save tooling | Internal tooling | Pending final save | Metadata and memory index may be stale |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts are found to contain invalid state, uncited claims, or malformed packet docs.
- **Procedure**: Remove or replace only the affected research packet artifacts in `007-external-project`, rerun JSONL parse checks, rerun reducer, and rerun validation. Do not modify `external/` source.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup -> Iterations -> Reducer -> Synthesis -> Validation -> Memory Save
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Spec folder, workflow docs | Iterations |
| Iterations | Setup | Reducer |
| Reducer | Iterations | Synthesis |
| Synthesis | Reducer | Validation |
| Validation | Synthesis | Memory Save |
| Memory Save | Validation | Closeout |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Completed |
| Evidence gathering | High | Completed |
| Synthesis | Medium | Completed |
| Verification and save | Medium | In progress during closeout |
| **Total** | | **10-iteration research packet** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Config and state | Spec folder | Research run identity | Iteration files |
| Iteration notes | Source reads | Evidence and findings | Reducer |
| Deltas | Iteration findings | Machine-readable state | Reducer |
| Reducer | State, deltas, iterations | Dashboard, registry, resource map | Synthesis |
| Synthesis | Reducer outputs | Research decisions | Spec writeback and memory save |
<!-- /ANCHOR:dependency-graph -->
