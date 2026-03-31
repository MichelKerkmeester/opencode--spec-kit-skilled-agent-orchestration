---
title: "Feature [02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/019-architecture-remediation/spec]"
description: "Global architecture audit, bug detection, alignment verification, and type safety analysis across the perfect-session-capturing subsystem. Level 3 upgrade with 15-agent scope."
trigger_phrases:
  - "architecture remediation"
  - "019 deep dive"
  - "session capturing audit"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: Architecture Remediation Deep Dive

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Global architecture, bug fix, and alignment deep dive across the entire `009-perfect-session-capturing` subsystem. This phase deployed 15 parallel analysis agents across 3 waves (5 GPT 5.4 via Codex CLI + 5 Claude Opus Wave 1/2 analysis, plus 5 Claude Opus Wave 3 synthesis) to produce a comprehensive findings report covering:

1. Core pipeline architecture (quality-scorer, workflow, memory-indexer, tree-thinning)
2. Extractor system consistency across 5 CLI targets
3. Utility/library bug detection
4. Memory system correctness (generate-context JSON/recovery modes)
5. Test coverage and eval gap analysis
6. Phase tree spec consistency (20 child phases, 000-019)
7. Spec-to-code alignment verification
8. Architecture boundary violations
9. Git diff regression analysis
10. Type system and contract verification
11. (Wave 3) Prior findings verification and synthesis
12. (Wave 3) Remediation priority matrix
13. (Wave 3) Decision record compilation
14. (Wave 3) Checklist generation
15. (Wave 3) Research aggregation

**Analysis phase complete.** All 3 waves finished. 270 raw findings deduplicated to 197 unique findings. 8-sprint remediation plan produced. 8 ADRs documented.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Analysis Complete; Remediation Pending |
| **Created** | 2026-03-20 |
| **Updated** | 2026-03-21 |
| **Parent** | `009-perfect-session-capturing` |
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Predecessor** | [018-memory-save-quality-fixes](../018-memory-save-quality-fixes/spec.md) |
| **Successor** | None |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

<!-- ANCHOR:problem -->

### Problem Statement
The perfect-session-capturing subsystem has grown to 20 child phases (000-019), 96+ TypeScript source files, 44 MCP handlers, and multiple audit passes. No single comprehensive architecture audit has examined the full system for: structural bugs, alignment drift between spec docs and implementation, dead code from deleted files, type safety gaps, and cross-phase consistency issues. Wave 1 analysis (10 agents) produced 135 findings requiring synthesis and prioritization.

### Purpose
Produce a prioritized findings report that identifies every actionable bug, misalignment, dead reference, and architecture violation — enabling targeted remediation in subsequent phases. Wave 3 synthesis agents consolidate and validate all 135 findings, produce a decision record, and generate the remediation sprint plan.

<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

<!-- ANCHOR:scope -->

### In Scope
- All TypeScript source files under `scripts/` (core, extractors, lib, utils, memory, renderers, spec-folder, evals, types, tests) — 96+ files
- All 20 child phase spec folders (000-019) plus 5 sub-children under 000 = 25 total phase folders
- Parent pack documentation (6 Level 3 docs)
- All unstaged git changes
- All description.json files
- 44 MCP server handlers

### Out of Scope
- Implementing fixes (this phase is analysis-only)
- Modifying any source files
- Editing existing spec folder documents outside of 019

<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

<!-- ANCHOR:requirements -->

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Complete Wave 1 audit coverage across the targeted subsystem | Ten Wave 1 workstreams complete and collectively cover core, extractors, lib, utils, memory, renderers, spec-folder, tests, metadata, and git-diff analysis |
| REQ-002 | Verify the inherited findings inventory against current HEAD | Wave 3 OPUS-B1 classifies every prior finding as persist, fixed, superseded, or new |
| REQ-003 | Produce a remediation priority matrix with explicit sprint assignments | `plan.md` captures S1-S8 sequencing with priority, effort, and risk context |
| REQ-004 | Record the governing remediation decisions for downstream execution | `decision-record.md` contains accepted or proposed ADRs with alternatives, consequences, and rollback guidance |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Keep this phase analysis-only and avoid implementing source fixes here | Scope, tasks, and checklist remain documentation and synthesis focused |
| REQ-006 | Preserve traceability from findings to sprints, ADRs, and checklist items | Maintainers can map each remediation area back to validated source findings or synthesis artifacts |
| REQ-007 | Keep parent/child packet navigation aligned with `009-perfect-session-capturing` | Strict spec integrity checks resolve parent metadata and document references cleanly |
| REQ-008 | Maintain Level 3 template compliance while retaining Wave 3 substance | Strict validation passes without section, anchor, header, or evidence warnings |

### Wave 1: Parallel Analysis (10 agents)

| ID | Agent | Model | Focus |
|----|-------|-------|-------|
| CODEX-A1 | Codex CLI | GPT 5.4 | Core pipeline architecture |
| CODEX-A2 | Codex CLI | GPT 5.4 | Extractor system analysis |
| CODEX-A3 | Codex CLI | GPT 5.4 | Utility & library bug hunt |
| CODEX-A4 | Codex CLI | GPT 5.4 | Memory system & generate-context |
| CODEX-A5 | Codex CLI | GPT 5.4 | Test coverage & eval gaps |
| OPUS-A1 | Claude Opus | Opus 4.6 | Phase tree consistency audit |
| OPUS-A2 | Claude Opus | Opus 4.6 | Spec-to-code alignment |
| OPUS-A3 | Claude Opus | Opus 4.6 | Architecture boundary analysis |
| OPUS-A4 | Claude Opus | Opus 4.6 | Git diff deep analysis |
| OPUS-A5 | Claude Opus | Opus 4.6 | Type system & contract verification |

### Wave 3: Synthesis (5 agents)

| ID | Agent | Model | Focus |
|----|-------|-------|-------|
| OPUS-B1 | Claude Opus | Opus 4.6 | Prior findings verification |
| OPUS-B2 | Claude Opus | Opus 4.6 | Remediation priority matrix |
| OPUS-B3 | Claude Opus | Opus 4.6 | Decision record synthesis |
| OPUS-B4 | Claude Opus | Opus 4.6 | Checklist generation |
| OPUS-B5 | Claude Opus | Opus 4.6 | Research compilation |

<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

<!-- ANCHOR:success-criteria -->

Each workstream produces findings in this format:
- **ID**: FINDING-NNN
- **Severity**: CRITICAL / HIGH / MEDIUM / LOW
- **Category**: BUG / ALIGNMENT / ARCHITECTURE / DEAD_CODE / TYPE_SAFETY
- **File**: path:line
- **Description**: what's wrong
- **Evidence**: code snippet or reference
- **Fix**: recommended remediation

Raw findings go to `scratch/`, synthesis goes to `plan.md`.

- **SC-001**: **Given** the Wave 1 scratch outputs are complete, **When** Wave 3 verification runs, **Then** all inherited findings are classified as persist, fixed, superseded, or new.
- **SC-002**: **Given** the verified findings inventory, **When** remediation planning completes, **Then** every non-LOW finding is assigned to Sprint S1-S8 or explicitly deferred.
- **SC-003**: **Given** later remediation depends on architectural direction, **When** `decision-record.md` is reviewed, **Then** eight ADRs with status, alternatives, and rationale are present.
- **SC-004**: **Given** the packet rename to `009-perfect-session-capturing`, **When** spec integrity checks run, **Then** parent links and packet references resolve cleanly.
- **SC-005**: **Given** this phase is documentation-first, **When** strict validation runs, **Then** the Level 3 doc set passes without structural or evidence warnings.
- **SC-006**: **Given** a maintainer starts Sprint S1-S8 work from this phase, **When** they read the plan, checklist, and ADR summary, **Then** they can trace each sprint back to validated findings.

<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

<!-- ANCHOR:risks -->

### Dependencies
- Wave 1 scratch outputs (all 10 files in `scratch/`) must be present before Wave 3 runs
- `plan.md` Sprint 1-6 prioritization must remain stable as Wave 3 input
- Parent spec (009-perfect-session-capturing/spec.md) phase map needs updating (OPUS1-015)

### Risk Matrix

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|------------|
| R-001 | Stale findings — Wave 1 outputs reference line numbers that shift during parallel edits | Medium | High | Wave 3 OPUS-B1 re-verifies each finding against current HEAD before accepting |
| R-002 | Agent coverage gaps — 8 subsystems, but some overlap between CODEX-A3/A4 and OPUS-A3/A5 | Low | Medium | OPUS-B1 deduplication pass during synthesis |
| R-003 | Remediation scope creep — 135 findings could expand to include adjacent system fixes | Medium | High | Sprint S1-S6 boundary in plan.md is frozen; new findings go to a separate follow-up phase |
| R-004 | Wave 3 synthesis diverges from Wave 1 raw data | Low | High | OPUS-B1 explicitly cites scratch file + finding ID for every verified finding |
| R-005 | Type rename decisions (R-002/003/004) break callers not in scope | Medium | Medium | ADR-002 decision gates the rename; full call-site audit before execution |

<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:requirements -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **Completeness**: All 8 subsystems (core, extractors, lib, utils, memory, renderers, spec-folder, tests) covered by at least one Wave 1 agent
- **Traceability**: Every remediation sprint item traceable to a numbered finding
- **Consistency**: Finding IDs follow `{AGENT}-{NNN}` format throughout all scratch files
- **Auditability**: All Wave 3 synthesis decisions recorded in `decision-record.md` with alternatives

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Empty scratch output**: If a Wave 1 agent produces zero findings, treat as complete with explicit "No findings" entry — do not re-run unless scope was missed
- **Large session files**: Scripts with >500 LOC (e.g., `conversation-extractor.ts`, `collect-session-data.ts`) may produce disproportionate finding counts; OPUS-B2 normalizes by file size during priority scoring
- **Deleted-then-recreated files**: Git diff analysis (OPUS-A4) may surface findings against files deleted in a prior commit that were subsequently recreated with different shape — Wave 3 must validate current file state
- **Overlapping findings**: Two agents reporting the same issue with different IDs are merged by OPUS-B1 into a single canonical finding with both source references preserved

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| **Codebase size** | 9/10 | 96+ TypeScript files, 44 MCP handlers, 8 subsystems |
| **Agent coordination** | 9/10 | 15 agents across 2 waves; Wave 3 depends on Wave 1 output fidelity |
| **Finding volume** | 8/10 | 197 unique findings (270 raw minus 73 duplicates) requiring prioritization and sprint assignment across 8 sprints |
| **Decision complexity** | 8/10 | Type renames + architecture boundary restoration + build artifact cleanup each require ADRs |
| **Doc alignment** | 7/10 | 20 child phase spec folders, parent docs, and description.json all need synchronization |

**Overall Complexity Score: ~85/100** — Qualifies for Level 3 documentation. Multi-agent coordination, architectural decisions, and high finding volume all exceed Level 2 thresholds.

<!-- /ANCHOR:complexity -->
---

## 10. RISK MATRIX

| ID | Risk | Sprint Exposure | Owner | ADR Reference |
|----|------|----------------|-------|---------------|
| R-001 | Stale findings — Wave 1 outputs reference line numbers that shift during parallel edits | S1-S8 | OPUS-B1 (verified) | ADR-001 |
| R-002 | Agent coverage gaps in 8 subsystems | Resolved — 197 unique findings confirmed | OPUS-B1 | ADR-001 |
| R-003 | Remediation scope creep beyond S1-S8 | Post-Wave 3 | Plan.md sprint freeze | — |
| R-004 | Type rename decisions break callers not in sprint scope | S3 | ADR-002 | ADR-002 |
| R-005 | Memory save race condition causes data loss during remediation work | S2 | ADR-006 | ADR-006 |
| R-006 | V-rule bridge fail-open silently disables quality gates if dist/ stale | S1 (blocked until ADR-004 done) | ADR-006 | ADR-004, ADR-006 |
| R-007 | Dead code deletion breaks undiscovered external consumers | S4, S6 | Barrel narrowing verification | ADR-008 |

---

## 11. USER STORIES

- **US-001**: As a maintainer, I want a complete findings inventory so I can prioritize which bugs and alignment issues to fix first without re-running the full audit.
- **US-002**: As a developer, I want architecture boundary violations documented so I can avoid introducing new violations when implementing fixes in sprints S1-S6.
- **US-003**: As a tech lead, I want ADRs for the type rename and boundary restoration decisions so I understand the rationale before approving sprint work.
- **US-004**: As an agent author, I want the Wave 3 synthesis to verify all 135 findings are still valid so I don't spend sprint capacity on already-fixed issues.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

<!-- ANCHOR:questions -->

| ID | Question | Owner | Resolution |
|----|----------|-------|------------|
| Q-001 | Should type renames (OPUS5-002/003/004) be executed in S2 or deferred to a dedicated type-safety phase? | Tech lead | Pending ADR-002 |
| Q-002 | Does OPUS-B5 research compilation require a standalone research file or is it embedded in decision-record.md? | Agent author | Pending Wave 3 start |
| Q-003 | Are the 44 MCP handlers fully covered by CODEX-A4, or does a separate Wave 2 MCP agent need to be added? | Audit scope owner | To be confirmed before Wave 3 |

<!-- /ANCHOR:questions -->

---

### AI Execution Protocol

### Pre-Task Checklist

- Confirm the current finding source is one of the Wave 1 or Wave 3 artifacts in `scratch/`.
- Confirm any reported file path still exists on the current branch before accepting a finding.
- Confirm sprint placement matches the remediation ordering already captured in `plan.md`.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| Scope lock | Analysis stays inside the `009-perfect-session-capturing` subsystem and its child phases |
| Evidence first | Every accepted finding must cite a current file path or a verified scratch artifact |
| No implementation | This phase records analysis only and does not apply fixes |
| Drift handling | Any contradictory evidence is resolved against current on-disk state before synthesis |

### Status Reporting Format

- Report progress by wave and agent group.
- Cite the scratch artifact or spec file used for each accepted finding.
- Mark unresolved questions explicitly as open follow-up work rather than implied closure.

### Blocked Task Protocol

- If a scratch artifact is missing, record the gap and stop acceptance for findings that depend on it.
- If a referenced file has moved or changed shape, revalidate against current files before keeping the finding.
- If scope expands beyond this phase, capture it as follow-up work instead of broadening the analysis pass.

---

## RELATED DOCUMENTS

| Document | Path | Notes |
|----------|------|-------|
| Parent spec | 009-perfect-session-capturing/spec.md | Phase map needs updating (OPUS1-015) |
| Plan | `plan.md` | Sprint 1-6 remediation order |
| Tasks | `tasks.md` | 15-agent task breakdown |
| Checklist | `checklist.md` | Quality gates |
| Decision Record | `decision-record.md` | 8 ADRs (ADR-001 through ADR-008 — Wave 3 synthesis complete) |
| Raw findings | `scratch/codex-1-core-pipeline.md` through `scratch/opus-5-type-system.md` | 10 Wave 1 outputs |
