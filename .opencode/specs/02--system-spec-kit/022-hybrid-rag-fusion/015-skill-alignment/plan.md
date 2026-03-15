---
title: "Plan: Skill Alignment — system-spec-kit"
description: "Execution plan for aligning SKILL.md, 25 references, and 4 assets with 022-hybrid-rag-fusion epic deliverables."
---
<!-- SPECKIT_LEVEL: 1 -->
# Plan: 015-skill-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

## 1. OVERVIEW

Align system-spec-kit skill artifacts with the post-epic state. Five execution phases, parallelizable at the domain level. All changes are documentation corrections or additions — no code modifications.

**Estimated scope:** ~30 files modified, ~2000 LOC net additions across all files.

---

## 2. PHASES

### Phase A: SKILL.md P0 Stale Data Fixes
**Priority:** P0 | **Effort:** Low | **Dependencies:** None

Fix all factual inaccuracies in SKILL.md identified by agents 2, 4, and 10.

| Task | What Changes | Line(s) | Source |
|------|-------------|---------|--------|
| A1 | Server shape: 682→1073 LOC, 12→40 handlers, 20→26 libs, 25→31 tools | ~512 | SA-001 |
| A2 | Tool table header: "8 most-used of 25" → "8 most-used of 31" | ~514 | SA-001 |
| A3 | Schema version note: add "schema v22 (current)" | Key Concepts | SA-002 |
| A4 | Chars/token: "chars/3.5" → "chars/4 (MCP_CHARS_PER_TOKEN default)" | ~588 | SA-003 |
| A5 | Document type list: remove research (1.1x), add scratch (0.6x) | ~554 | SA-004 |
| A6 | External Dependencies: "~682 lines" → "~1073 lines" | ~781 | SA-001 |

**Verification:** Grep SKILL.md for all updated values. Cross-check against `wc -l context-server.ts`, `tool-schemas.ts` TOOL_DEFINITIONS count, `vector-index-schema.ts` SCHEMA_VERSION.

---

### Phase B: SKILL.md Content Additions
**Priority:** P0-P1 | **Effort:** Medium | **Dependencies:** Phase A

Add new content to SKILL.md sections 1-7.

| Task | Section | What to Add | Priority | Source |
|------|---------|-------------|----------|--------|
| B1 | §2 Smart Routing | Add 6 RAG intents (RETRIEVAL_TUNING, SCORING_CALIBRATION, PIPELINE_ARCHITECTURE, EVALUATION, ROLLOUT_FLAGS, GOVERNANCE) with keywords | P0 | SA-005 |
| B2 | §2 Smart Routing | Update RESOURCE_MAP with new intent→resource mappings | P0 | SA-006 |
| B3 | §2 Smart Routing | Expand COMMAND_BOOSTS with /memory:* prefixes | P1 | SA-025 |
| B4 | §3 How It Works | Add Phase Workflow block under Gate 3 | P1 | SA-027 |
| B5 | §3 How It Works | Add hybrid complexity rubric (scope/risk/research/multi-agent/coordination) | P1 | SA-028 |
| B6 | §3 How It Works | Split feature flags into gate-governed vs platform tables | P1 | SA-029 |
| B7 | §3 How It Works | Add recursive validation to Validation Workflow subsection | P0 | SA-016 |
| B8 | §3 How It Works | Update Memory System: add Sprint 4-7 key concepts (feedback loop, contradiction detection, ablation, flag sunset) | P1 | SA-031 |
| B9 | §3 How It Works | Add campaign-level checklist guidance | P1 | SA-030 |
| B10 | §4 Rules | Add ALWAYS: Program Integrity (parent-child rollup, recursive validation, gate progression) | P0 | SA-014, SA-015 |
| B11 | §4 Rules | Add ALWAYS: Flag Governance (owner, state, rollout stage, rollback, sunset) | P0 | SA-017 |
| B12 | §4 Rules | Add ALWAYS: Campaign Execution (wave plan, closure verification) | P1 | SA-036 |
| B13 | §5 Success Criteria | Add Phase Program Completion subsection | P0 | SA-016 |
| B14 | §5 Success Criteria | Add Flag Governance Compliance subsection | P0 | SA-017 |
| B15 | §5 Success Criteria | Add Campaign Verification subsection | P1 | SA-038 |
| B16 | §6 Integration Points | Add phase-aware validation triggers | P1 | SA-039 |
| B17 | §6 Integration Points | Add multi-CLI campaign orchestration workflow | P1 | SA-040 |
| B18 | §7 Related Resources | Add feature_catalog/ and manual_testing_playbook/ | P1 | SA-041 |
| B19 | §7 Related Resources | Add phase-system resource links | P1 | SA-042 |
| B20 | §7 Quick Reference | Add phase, recursive validation, and flag commands | P1 | SA-043 |
| B21 | §1 When to Use | Refresh activation examples with spec-kit-native cases | P1 | SA-026 |

**Verification:** Read updated SKILL.md sections. Check that new intents have keywords and RESOURCE_MAP entries. Validate new rules are numbered consistently. Confirm new criteria have evidence format examples.

---

### Phase C: References Updates
**Priority:** P0-P1 | **Effort:** High | **Dependencies:** None (parallel with A/B)

Update all 25 reference files across 7 domains. Organized by domain for parallel execution.

#### C1: memory/ domain (5 files)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C1a | memory_system.md | Update tool count (23→31), add Sprint 4-7 retrieval features section, add adaptive/shadow fusion, telemetry, guardrails | P0, P1 |
| C1b | save_workflow.md | Add quality gate documentation, reconsolidation flow, mutation ledger provenance | P1 |
| C1c | trigger_config.md | Add learned trigger behavior, negative feedback suppression, safeguard stack | P1 |
| C1d | embedding_resilience.md | Add retrieval telemetry for degraded mode, adaptive fusion routing during degradation | P1 |
| C1e | epistemic_vectors.md | Add integration guidance for adaptive retrieval loops, telemetry-driven uncertainty | P2 |

#### C2: validation/ domain (5 files)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C2a | validation_rules.md | Update path patterns for nested hierarchies, add PHASE_LINKS for 21-child/6-child, add quality artifact evidence | P0 |
| C2b | path_scoped_rules.md | Align patterns to .opencode/specs/** topologies, update memory validation posture, add child-phase file matrices | P0 |
| C2c | phase_checklists.md | Add multi-child verification workflows, audit campaign closure, Hydra governance checks | P0 |
| C2d | decision_format.md | Add telemetry fields, mutation ledger references, quality gate pass/fail, multi-child audit format | P1 |
| C2e | five_checks.md | Add measured retrieval evidence requirement, flag safety/rollback evidence, phase-campaign governance | P1 |

#### C3: structure/ domain (4 files)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C3a | folder_routing.md | Add 3-level deep path resolution, multi-level alignment scoring, deep glob patterns | P0 |
| C3b | folder_structure.md | Add NN--category-name convention, epic-root pattern, 10+ children guidance, archive within active parent | P0 |
| C3c | phase_definitions.md | Expand phase cap, add hierarchical phase map, sprint-gate model, stub/deferred/partial statuses, dependency table format | P0 |
| C3d | sub_folder_versioning.md | Add 3+ level nesting, coordination-only parent pattern, disambiguation at scale | P0 |

#### C4: templates/ domain (4 files)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C4a | level_specifications.md | Add audit child template archetype, update LOC estimates, add Level 3+ epic patterns | P0, P1 |
| C4b | template_guide.md | Add guidance for audit children, root synthesis, sprint gate evaluation templates | P1 |
| C4c | template_style_guide.md | Add style guidance for multi-child documentation, campaign reports | P1 |
| C4d | level_selection_guide.md | Add non-LOC selection criteria, parent-child level inheritance rules | P1 |

#### C5: workflows/ domain (4 files)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C5a | worked_examples.md | Add 3 new examples: epic-scale program, parent-child hierarchy, sprint-gate validation | P0 |
| C5b | execution_methods.md | Add --recursive flag, wave-based dispatch, sprint-gate evaluation, multi-model agent mixing | P0 |
| C5c | rollback_runbook.md | Generalize beyond single spec, add sprint regression, phase failure recovery, campaign failure patterns | P0 |
| C5d | quick_reference.md | Add sprint-gate entry, expand phase quick reference for 16+ phases, add troubleshooting for recursive failures | P1 |

#### C6: debugging/ domain (2 files)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C6a | troubleshooting.md | Add recursive validation failures, multi-child errors, stale MCP metadata, campaign verification failures | P0 |
| C6b | universal_debugging_methodology.md | Add RAG pipeline debugging lens, scoring calibration methodology, retrieval quality measurement | P1 |

#### C7: config/ domain (1 file)
| Task | File | Changes | Priority |
|------|------|---------|----------|
| C7a | environment_variables.md | Add SPECKIT_GRAPH_UNIFIED entry, update SPEC_KIT_ENABLE_CAUSAL description | P1, P2 |

**Verification:** Run `validate.sh` on skill folder. Check cross-references between updated files. Verify no broken links.

---

### Phase D: Assets Updates
**Priority:** P1-P2 | **Effort:** Medium | **Dependencies:** None (parallel with A/B/C)

| Task | File | Changes | Priority |
|------|------|---------|----------|
| D1 | complexity_decision_matrix.md | Add epic/program tier (15+ phases, 50+ folders, 150+ features) | P1 |
| D2 | level_decision_matrix.md | Add parent-child phase relationships, non-code task guidance | P1 |
| D3 | parallel_dispatch_config.md | Add wave-based execution model, 16-agent campaigns, multi-model mixing, root synthesis delegation | P0 |
| D4 | template_mapping.md | Add audit child, root synthesis, sprint gate evaluation archetypes | P1 |

**Verification:** Review against epic patterns documented in implementation-summary.md.

---

### Phase E: Cross-Reference Verification
**Priority:** P1 | **Effort:** Low | **Dependencies:** Phases A-D complete

| Task | What | Method |
|------|------|--------|
| E1 | Verify SKILL.md links resolve to updated files | Automated link check |
| E2 | Verify tool/handler/flag counts consistent across SKILL.md, memory_system.md, env_vars.md | Grep for all numeric claims |
| E3 | Verify new RESOURCE_MAP entries point to existing resources | Cross-reference check |
| E4 | Run alignment drift verifier | `verify_alignment_drift.py --root .opencode/skill/system-spec-kit` |

---

## 3. EXECUTION ORDER

```
Phase A (P0 fixes) ──────────┐
                              ├──► Phase E (cross-ref verification)
Phase B (content additions) ──┤
                              │
Phase C (references) ─────────┤
                              │
Phase D (assets) ─────────────┘
```

Phases A-D can execute in parallel across different files. Phase E requires all others to complete first.

**Recommended agent allocation for implementation:**
- Phase A: 1 agent (surgical edits, low risk)
- Phase B: 2-3 agents (SKILL.md is one file, but sections are independent)
- Phase C: 5-7 agents (one per domain, parallelizable)
- Phase D: 1-2 agents (4 small files)
- Phase E: 1 agent (verification only)

---

## 4. RISKS

| Risk | Impact | Mitigation |
|------|--------|------------|
| SKILL.md edits create internal inconsistencies | HIGH | Phase E cross-reference verification |
| Stale data exists beyond what agents found | MEDIUM | Agent 10 checked all cross-references; run alignment drift verifier |
| Reference updates break existing workflows | LOW | All changes are additive; no removals |
| Template LOC estimates change again with updates | LOW | Use approximate (~) notation |
