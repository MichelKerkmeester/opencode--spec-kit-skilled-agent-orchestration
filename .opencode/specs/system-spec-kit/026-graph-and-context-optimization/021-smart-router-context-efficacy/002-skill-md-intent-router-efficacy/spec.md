---
title: "Feature Specification: SKILL.md Smart-Router Section Efficacy"
description: "Research whether the Smart Routing section inside each top-level .opencode/skill/*/SKILL.md actually reduces AI context load or remains advisory only. The packet measures inventory, byte budgets, behavioral signals, classifier accuracy, compliance gaps, fallback safety, enforcement, and a future harness design."
trigger_phrases:
  - "021 002 skill md smart router"
  - "skill-md intent router efficacy"
  - "resource loading tier effectiveness"
importance_tier: "important"
contextType: "research-charter"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/021-smart-router-context-efficacy/002-skill-md-intent-router-efficacy"
    last_updated_at: "2026-04-19T19:45:00Z"
    last_updated_by: "codex"
    recent_action: "Completed 20-iteration deep research and repaired Level 2 packet scaffolding"
    next_safe_action: "Review research/research.md and implement observe-only telemetry harness if approved"
    blockers: []
    key_files:
      - "research/research.md"
      - "research/research-validation.md"
      - "research/findings-registry.json"
      - "research/iterations/iteration-001.md"
      - "research/iterations/iteration-020.md"
    session_dedup:
      fingerprint: "sha256:021002smartrouterefficacy"
      session_id: "021-002-r01"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "What is the live Read-call compliance rate once telemetry exists?"
    answered_questions:
      - "V1-V10 research questions"
---
# Feature Specification: SKILL.md Smart-Router Section Efficacy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-04-19 |
| **Branch** | `main` |
| **Research Budget** | 20 iterations |
| **Executor** | Local Codex execution following sk-deep-research protocol |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every top-level `.opencode/skill/*/SKILL.md` is expected to include a Smart Routing section that defines intent signals, resource maps, loading tiers, and a pseudocode route function. The unverified claim is that AI assistants follow those tiers and load only the returned resources instead of reading broad `references/` and `assets/` trees.

### Purpose

Measure whether the Smart Routing pattern has real efficacy evidence, identify where it is only advisory, and define the next measurement/enforcement step without changing runtime code in this packet.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Inventory Smart Routing sections in top-level `.opencode/skill/*/SKILL.md` files.
- Parse tier/resource declarations and compute deterministic byte budgets.
- Scan existing research iteration artifacts for skill-resource usage signals.
- Run a small deterministic intent-scoring sample against the 019/004 prompt corpus.
- Assess fallback behavior, enforcement mechanisms, and harness design.

### Out of Scope

- Phase 020 or 021/001 advisor-hook efficacy research.
- Runtime code changes.
- Edits to existing skill files.
- Git commits or pull requests.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/iterations/iteration-*.md` | Create | 20 deep-research iteration records |
| `research/deep-research-state.jsonl` | Update | Append iteration and completion records |
| `research/research.md` | Create | 17-section synthesis |
| `research/research-validation.md` | Create | Per-V validation matrix |
| `research/findings-registry.json` | Create | Machine-readable findings registry |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Create/Update | Level 2 packet scaffolding and completion evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Run 20 iterations or stop early by convergence | 20 `research/iterations/iteration-*.md` files exist and JSONL records are valid |
| REQ-002 | Answer V1-V10 | `research/research-validation.md` contains a row for every V question |
| REQ-003 | Produce final synthesis | `research/research.md` exists and contains the 17-section synthesis |
| REQ-004 | Produce machine-readable registry | `research/findings-registry.json` is valid JSON and lists V1-V10 findings |
| REQ-005 | Avoid runtime/skill code edits | Git diff shows changes confined to this `002` packet |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Compute static metrics | Final handback includes skill count, byte metrics, iteration scan count, compliance estimate, and ON_DEMAND hit rate |
| REQ-007 | State uncertainty honestly | Synthesis distinguishes deterministic data from observational proxies and design-only harness work |
| REQ-008 | Validate artifacts | JSON, JSONL, iteration count, and spec packet validation checks are run |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 20 iteration files exist and each includes focus, tools, sources, findings, new-info-ratio, and next focus.
- **SC-002**: `research/research.md`, `research/research-validation.md`, and `research/findings-registry.json` exist.
- **SC-003**: Final conclusion does not overclaim live compliance and uses `needs-harness` where telemetry is absent.
- **SC-004**: Packet validation passes after scaffolding repair.

### Acceptance Scenarios

1. **Given** the research packet is complete, **When** the iteration directory is counted, **Then** exactly 20 iteration files are present.
2. **Given** the synthesis artifacts are complete, **When** JSON and JSONL checks run, **Then** `research/findings-registry.json` and `research/deep-research-state.jsonl` parse successfully.
3. **Given** live Read-call telemetry is unavailable, **When** V5 is reported, **Then** the compliance estimate is `needs-harness` instead of a fabricated percentage.
4. **Given** the approved scope excludes runtime and skill-file edits, **When** the work is reviewed, **Then** changes are confined to this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Iteration artifacts are not raw Read telemetry | Could overstate or understate AI compliance | Label V3/V5 as moderate evidence and require harness |
| Risk | Router pseudocode variants | Naive parser could undercount resources | Support aliases and document parser limits |
| Dependency | 019/004 corpus | V4/V7 depend on corpus quality | Treat results as corpus-specific |
| Risk | Full subtree byte denominator | Huge non-resource folders distort bloat metrics | Prefer `SKILL.md + loadable resource tree` denominator |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- What is the actual live Read-call compliance rate once telemetry exists?
- Should zero-score `GENERATION` fallback in CLI skills be changed to UNKNOWN/disambiguation?
- Which runtime should host the first observe-only harness?
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: Deterministic scans should complete locally without network access.
- **NFR-P02**: Final artifacts should stay compact enough for future memory retrieval.

### Security

- **NFR-S01**: No secrets or private external data are introduced.
- **NFR-S02**: No runtime or skill code is modified.

### Reliability

- **NFR-R01**: JSON and JSONL artifacts must parse successfully.
- **NFR-R02**: Claims must identify evidence strength and uncertainty.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries

- Empty prior iteration state: start from iteration 001.
- Missing route paths: report separately from AI compliance failures.
- Huge non-resource skill folders: exclude from primary loadable-resource denominator.

### Error Scenarios

- MCP semantic search unavailable: fall back to exact `rg` and direct file reads.
- Spec validator fails on scaffolding: repair only this approved packet.
- Corpus labels insufficient for route accuracy: report as moderate evidence.

### State Transitions

- Initialized research packet to complete packet after 20 iteration records.
- JSONL state changed from config/init only to config/init/20 iterations/completed.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Research packet only, but touches multiple artifact types |
| Risk | 8/25 | No runtime code changes |
| Research | 18/20 | Multi-source deterministic and observational analysis |
| **Total** | **42/70** | **Level 2** |
<!-- /ANCHOR:complexity -->
