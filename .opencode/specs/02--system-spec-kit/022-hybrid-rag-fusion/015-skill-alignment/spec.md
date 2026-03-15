---
title: "Skill Alignment: system-spec-kit SKILL.md, References, and Assets"
description: "Align system-spec-kit skill artifacts (SKILL.md, 25 references, 4 assets) with the 022-hybrid-rag-fusion epic deliverables — 51 spec folders, 189 features, 8 RAG sprints, and multi-agent campaign patterns."
trigger_phrases:
  - "skill alignment"
  - "015 alignment"
  - "speckit skill update"
  - "SKILL.md update"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_LEVEL: 1 -->
# Spec: 015-skill-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-03-14 |
| **Updated** | 2026-03-14 |
| **Branch** | `017-markovian-architectures` |
| **Parent** | `022-hybrid-rag-fusion` |
| **Complexity** | 45/100 |

---

## 2. PROBLEM & PURPOSE

### Problem Statement

The system-spec-kit skill artifacts (SKILL.md, 25 reference files, 4 asset files) contain stale metadata, missing documentation for delivered features, and structural gaps that emerged from the 022-hybrid-rag-fusion epic. A 10-agent cross-model gap analysis (5 Codex gpt-5.3-codex via Copilot, 1 GPT-5.4 via Codex CLI, 1 Gemini 3.1 Pro, 3 Sonnet 4.6 native) identified 32 P0 gaps, 40+ P1 gaps, and 15+ P2 gaps.

Key categories of misalignment:

1. **Stale server metadata** in SKILL.md: tool count (25 vs 31 actual), handler count (12 vs 40), LOC (682 vs 1073), lib subdirs (20 vs 26), schema version (v13 vs v22)
2. **Missing RAG pipeline documentation**: Sprint 4-7 features (feedback loop, quality gate, reconsolidation, contradiction detection, ablation framework) absent or underspecified
3. **No epic-scale patterns**: Phase definitions cap at 4 phases (epic has 16), no sprint-gate model, no parent-child verification workflows, no multi-agent campaign patterns
4. **Reference file gaps**: Validation rules don't cover nested hierarchies, rollback runbook scoped to single spec, worked examples all single-folder
5. **Asset file gaps**: Parallel dispatch config outdated (4-agent vs 16-agent), complexity matrix doesn't scale, template mappings missing audit/synthesis archetypes

### Purpose

Update system-spec-kit skill artifacts to accurately reflect the post-epic state: 31 MCP tools, schema v22, 10 feature flags (of 86 total), 4-stage pipeline, sprint-gate validation, multi-child phase hierarchies, and multi-agent campaign execution patterns.

---

## 3. SCOPE

### In Scope

**SKILL.md (1 file):**
- §1 When to Use: Update activation examples, add phase/rollout trigger phrases
- §2 Smart Routing: Add RAG-specific intents, expand RESOURCE_MAP, update COMMAND_BOOSTS
- §3 How It Works: Fix stale server shape, update feature flags, add phase workflow to Gate 3, expand complexity detection, add recursive validation, update Memory System section
- §4 Rules: Add program integrity, flag governance, campaign verification rules
- §5 Success Criteria: Add phase program, recursive verification, sprint-gate criteria
- §6 Integration Points: Add phase-aware triggers, multi-CLI workflows
- §7 Related Resources: Fix stale metadata, add feature catalog and playbook links

**References (25 files across 7 domains):**
- memory/ (5 files): Update tool counts, add Sprint 4-7 features, quality gate, reconsolidation
- validation/ (5 files): Update path patterns for nested hierarchies, add multi-child verification, add Sprint 4+ evidence contracts
- structure/ (4 files): Add 3-level nesting, NN--category convention, program-scale phase definitions, sprint-gate model
- templates/ (4 files): Add audit child archetype, epic-scale patterns, Level 3+ guidance
- workflows/ (4 files): Add epic-scale examples, sprint-gate evaluation, multi-agent campaigns, general rollback runbook
- debugging/ (2 files): Add recursive validation failures, multi-child errors, stale metadata troubleshooting
- config/ (1 file): Add SPECKIT_GRAPH_UNIFIED, update SPEC_KIT_ENABLE_CAUSAL description

**Assets (4 files):**
- complexity_decision_matrix.md: Add epic/program tier
- level_decision_matrix.md: Add parent-child phase relationships
- parallel_dispatch_config.md: Add wave-based execution, multi-model mixing
- template_mapping.md: Add audit child, root synthesis, sprint gate archetypes

### Out of Scope

- MCP server code changes (this is documentation alignment only)
- New feature implementation
- Command alignment (covered by 016-command-alignment)
- Agent alignment (covered by 999/017-agents-alignment)

---

## 4. REQUIREMENTS

### P0 - Must Fix

| ID | Requirement | Source |
|----|-------------|--------|
| SA-001 | Fix SKILL.md server shape: LOC 682→1073, handlers 12→40, libs 20→26, tools 25→31 | Agent 2, 4, 10 |
| SA-002 | Fix schema version: v13→v22 | Agent 10 |
| SA-003 | Fix chars/token approximation: 3.5→4 | Agent 10 |
| SA-004 | Fix document type list: remove research (1.1x), add scratch (0.6x) | Agent 10 |
| SA-005 | Add RAG-specific intents to smart routing (RETRIEVAL_TUNING, SCORING_CALIBRATION, etc.) | Agent 1 |
| SA-006 | Update RESOURCE_MAP for RAG operational references | Agent 1 |
| SA-007 | Update validation_rules.md for nested .opencode/specs/ hierarchies | Agent 3 |
| SA-008 | Update phase_checklists.md for 21-child/6-child verification workflows | Agent 3 |
| SA-009 | Update path_scoped_rules.md for epic-era nested topologies | Agent 3 |
| SA-010 | Update folder_routing.md for 3-level deep paths | Agent 8 |
| SA-011 | Update folder_structure.md with NN--category-name convention | Agent 8 |
| SA-012 | Update phase_definitions.md: expand cap beyond 4, add sprint-gate model | Agent 8 |
| SA-013 | Update sub_folder_versioning.md for deep nesting (3+ levels) | Agent 8 |
| SA-014 | Add parent-child phase integrity rule to §4 | Agent 6 |
| SA-015 | Add sprint-gate progression rule to §4 | Agent 6 |
| SA-016 | Add recursive verification criteria to §5 | Agent 6 |
| SA-017 | Add feature-flag governance rule to §4 | Agent 6 |
| SA-018 | Update parallel_dispatch_config.md for wave-based execution (16 agents) | Agent 5 |
| SA-019 | Create general-purpose rollback runbook (not spec-specific) | Agent 9 |
| SA-020 | Add recursive validation troubleshooting entry | Agent 9 |
| SA-021 | Add sprint-gate entry to worked_examples.md | Agent 9 |
| SA-022 | Add epic-scale worked example (parent-child hierarchy) | Agent 9 |
| SA-023 | Add --recursive flag documentation to execution_methods.md | Agent 9 |
| SA-024 | Add wave-based dispatch execution method | Agent 9 |

### P1 - Should Fix

| ID | Requirement | Source |
|----|-------------|--------|
| SA-025 | Expand COMMAND_BOOSTS for /memory:* prefixes | Agent 1 |
| SA-026 | Refresh §1 activation examples with spec-kit-native cases | Agent 1 |
| SA-027 | Add phase workflow block to Gate 3 | Agent 2 |
| SA-028 | Add hybrid complexity rubric (non-LOC triggers) | Agent 2 |
| SA-029 | Split feature flags into gate-governed vs platform tables | Agent 2 |
| SA-030 | Add campaign-level checklist guidance to §3 | Agent 2 |
| SA-031 | Add Sprint 4-7 features to memory_system.md | Agent 3, 4 |
| SA-032 | Add save pipeline quality controls to save_workflow.md | Agent 3 |
| SA-033 | Update trigger_config.md with learned trigger behavior | Agent 3 |
| SA-034 | Add feedback/learning signals across trigger_config.md and validation refs | Agent 3 |
| SA-035 | Extend decision_format.md with telemetry, ledger, quality-gate fields | Agent 3 |
| SA-036 | Add campaign execution rule to §4 | Agent 6 |
| SA-037 | Add deferred-work governance rule to §4 | Agent 6 |
| SA-038 | Add metadata freshness criteria to §5 | Agent 6 |
| SA-039 | Add phase-aware validation triggers to §6 | Agent 7 |
| SA-040 | Add multi-CLI campaign orchestration to cross-skill workflows | Agent 7 |
| SA-041 | Add feature catalog and manual testing playbook to §7 | Agent 7 |
| SA-042 | Add phase-system resource links to §7 | Agent 7 |
| SA-043 | Update quick reference commands for phase/flag operations | Agent 7 |
| SA-044 | Add audit child template archetype to level_specifications.md | Agent 8 |
| SA-045 | Add SPECKIT_GRAPH_UNIFIED to environment_variables.md | Agent 10 |
| SA-046 | Update shared-space tools layer assignment in SKILL.md | Agent 10 |

### P2 - Nice to Have

| ID | Requirement |
|----|-------------|
| SA-047 | Update template LOC estimates (Level 1: ~533, Level 2: ~769, Level 3+: ~1193) |
| SA-048 | Add phase/rollout trigger phrases to §1 |
| SA-049 | Add framing note to feature flag table linking to full 86-entry reference |
| SA-050 | Update complexity_decision_matrix.md with epic/program tier |
| SA-051 | Update level_decision_matrix.md with parent-child rules |
| SA-052 | Update template_mapping.md with audit child and root synthesis archetypes |
| SA-053 | Add Level 3+ row to worked_examples overview table |
| SA-054 | Update SPEC_KIT_ENABLE_CAUSAL description in env vars |

---

## 5. APPROACH

### Strategy

This is a **documentation-only alignment task**: update existing files to match delivered reality. No code changes. All changes are additive or corrective — no feature removals.

### Execution Model

Phased by domain with parallel execution where possible:

1. **Phase A — SKILL.md P0 fixes**: Stale data corrections (server shape, schema, chars/token, document types)
2. **Phase B — SKILL.md content additions**: New intents, rules, criteria, integration points
3. **Phase C — References updates**: All 7 reference domains
4. **Phase D — Assets updates**: All 4 asset files
5. **Phase E — Cross-reference verification**: Ensure consistency across all updated files

### Evidence Sources

All gap findings are documented in `015-skill-alignment/scratch/agent-01` through `agent-10` markdown files, produced by the 10-agent cross-model analysis.

---

## RELATED DOCUMENTS

- **Parent epic**: `022-hybrid-rag-fusion/spec.md`
- **Implementation summary**: `022-hybrid-rag-fusion/implementation-summary.md`
- **Gap analysis**: `015-skill-alignment/scratch/agent-01-skill-routing.md` through `agent-10-refs-config.md`
- **SKILL.md**: `.opencode/skill/system-spec-kit/SKILL.md`
