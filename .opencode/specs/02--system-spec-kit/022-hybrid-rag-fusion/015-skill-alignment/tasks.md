---
title: "Tasks: Skill Alignment — system-spec-kit"
description: "Task breakdown for aligning SKILL.md, references, and assets with 022-hybrid-rag-fusion deliverables."
---
<!-- SPECKIT_LEVEL: 1 -->
# Tasks: 015-skill-alignment

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Phase A: SKILL.md P0 Stale Data Fixes

- [ ] **A1** Fix server shape line (~L512): `context-server.ts (~1073 lines) with 40 handler files, 26 lib subdirectories, and 31 MCP tools across 7 layers`
- [ ] **A2** Fix tool table header (~L514): "8 most-used of 31 total"
- [ ] **A3** Add schema version to Key Concepts: "schema v22 (current; v13 introduced document_type/spec_level)"
- [ ] **A4** Fix token approximation (~L588): "enforced via `chars/4` approximation (MCP_CHARS_PER_TOKEN default)"
- [ ] **A5** Fix document type list (~L554): Remove `research (1.1x)`, add `scratch (0.6x)`. Corrected list: spec (1.4x), plan (1.3x), constitutional (2.0x), decision_record (1.4x), tasks (1.1x), implementation_summary (1.1x), checklist (1.0x), handover (1.0x), memory (1.0x), scratch (0.6x)
- [ ] **A6** Fix External Dependencies (~L781): "Spec Kit Memory MCP (~1073 lines)"

**Verification:**
- [ ] **A-V1** Grep SKILL.md for "682", "25 MCP", "12 handler", "20 lib", "v13", "3.5" — zero matches expected
- [ ] **A-V2** Confirm `wc -l mcp_server/context-server.ts` matches stated LOC
- [ ] **A-V3** Confirm `grep -c "name:" mcp_server/tool-schemas.ts` matches stated tool count

---

## Phase B: SKILL.md Content Additions

### B-P0: Must Add

- [ ] **B1** §2 Smart Routing: Add 6 new INTENT_SIGNALS entries:
  - `RETRIEVAL_TUNING` (weight 3): rrf, rerank, mmr, normalization, calibration, scoring
  - `SCORING_CALIBRATION` (weight 3): score, weight, decay, boost, interference
  - `PIPELINE_ARCHITECTURE` (weight 3): pipeline, stage, fusion, channel, candidate
  - `EVALUATION` (weight 3): ablation, recall, precision, f1, ground truth, dashboard
  - `ROLLOUT_FLAGS` (weight 3): feature flag, rollout, rollback, sunset, canary, governance
  - `GOVERNANCE` (weight 3): hydra, shared memory, scope, lifecycle, cascade
- [ ] **B2** §2 Smart Routing: Add RESOURCE_MAP entries for new intents:
  - `RETRIEVAL_TUNING` → `references/memory/embedding_resilience.md`, `references/workflows/execution_methods.md`
  - `ROLLOUT_FLAGS` → `references/config/environment_variables.md`, `references/workflows/rollback_runbook.md`
  - `GOVERNANCE` → `references/structure/phase_definitions.md`, `references/validation/phase_checklists.md`
  - `EVALUATION` → `references/workflows/execution_methods.md`
- [ ] **B7** §3 Validation Workflow: Add recursive validation subsection:
  - `validate.sh <spec-folder> --recursive` for parent + all children
  - Phase sweep verification pattern (tsc + build + vitest + alignment)
  - Exit code interpretation for mixed pass/fail across children
- [ ] **B10** §4 Rules: Add ALWAYS #20: "Verify parent-child integrity for phased programs — parent status derives from child states, no parent completion with open FAIL/Draft children, recursive validation required"
- [ ] **B11** §4 Rules: Add ALWAYS #21: "Document feature-flag lifecycle for rollout-affecting changes — flag owner, default state, rollout stage, rollback path, sunset criteria"
- [ ] **B13** §5 Success Criteria: Add Phase Program Completion subsection:
  - Parent-child integrity verified (child counts, statuses, dependency order)
  - Recursive validation passed (all descendants)
  - Sprint gate artifacts present (gate metrics, go/no-go decisions)
  - Fail/defer ledger complete (explicit disposition for all items)
- [ ] **B14** §5 Success Criteria: Add Flag Governance Compliance subsection:
  - Flag inventory reconciled to source
  - Rollout status documented per flag
  - Rollback test evidence present
  - Sunset audit completed (if applicable)

### B-P1: Should Add

- [ ] **B3** §2 Smart Routing: Add COMMAND_BOOSTS for `/memory:save`, `/memory:context`, `/memory:manage`, `/memory:learn`
- [ ] **B4** §3 Gate 3: Add Phase Workflow block (parent/child phase folders, sprint-gate sequencing, multi-agent campaign patterns)
- [ ] **B5** §3 Complexity: Add hybrid rubric table (scope/risk/research/multi-agent/coordination dimensions, with epic-scale triggers)
- [ ] **B6** §3 Feature Flags: Split into two tables — gate-governed scoring flags (ceiling policy) and platform/telemetry/roadmap flags (non-scoring)
- [ ] **B8** §3 Memory System: Add Sprint 4-7 key concepts:
  - Feedback loop (MPAB aggregation, learned relevance, shadow scoring)
  - Contradiction detection (N3-lite, Hebbian strengthening)
  - Ablation framework and reporting dashboard
  - Flag sunset audit outcome
- [ ] **B9** §3 Checklist: Add campaign-level checklist model (multi-folder burn-down, wave plans, deferred-item accounting)
- [ ] **B12** §4 Rules: Add ALWAYS #22: "Plan and verify multi-agent campaigns — wave plan, concurrency limits, acceptance criteria per wave, revalidation between waves"
- [ ] **B15** §5 Success Criteria: Add Campaign Verification subsection (planned vs executed waves, finding closure, post-wave revalidation)
- [ ] **B16** §6 Integration: Add phase-aware validation triggers (create.sh --phase, validate.sh --recursive, /spec_kit:phase)
- [ ] **B17** §6 Integration: Add multi-CLI campaign orchestration workflow (Codex + Copilot + Gemini + Claude coordination pattern)
- [ ] **B18** §7 Related Resources: Add feature_catalog/ and manual_testing_playbook/ entries
- [ ] **B19** §7 Related Resources: Add phase system resource links (phase_definitions.md, phase commands)
- [ ] **B20** §7 Quick Reference: Add two-tier command block — core (always) + phase/flag (conditional)
- [ ] **B21** §1 When to Use: Replace generic examples with spec-kit-native: "tune reranker thresholds", "calibrate score normalization", "add rollout flag guardrail", "decompose epic into child phases"

**Verification:**
- [ ] **B-V1** Verify new intents have keywords, weights, and RESOURCE_MAP entries
- [ ] **B-V2** Verify new rules are numbered sequentially without gaps
- [ ] **B-V3** Verify new criteria have evidence format examples

---

## Phase C: References Updates

### C1: memory/ (5 files)

- [ ] **C1a** memory_system.md: Update tool count table (23→31), add "Sprint 0-7 Delivered Retrieval Features" section covering adaptive/shadow fusion, telemetry, quality gate, reconsolidation guardrails
- [ ] **C1b** save_workflow.md: Add "Save Pipeline Quality Controls" section (quality gate threshold 0.4, reconsolidation branches merge/supersede/store-new, mutation ledger provenance)
- [ ] **C1c** trigger_config.md: Add "Learned Trigger Behavior" section (Sprint 4 safeguard stack, negative feedback suppression, safety constraints)
- [ ] **C1d** embedding_resilience.md: Add retrieval telemetry fields for degraded mode auditing, adaptive fusion routing during embedding degradation
- [ ] **C1e** epistemic_vectors.md: Add integration guidance for adaptive retrieval loops and telemetry-driven uncertainty reduction (P2)

### C2: validation/ (5 files)

- [ ] **C2a** validation_rules.md: Update FOLDER_NAMING and PHASE_LINKS for nested `.opencode/specs/**/` hierarchies; add multi-child rollup integrity rule; add Sprint 4+ quality artifact evidence contract
- [ ] **C2b** path_scoped_rules.md: Align path patterns to `**/*.md` in nested topologies; update memory validation posture; add child-phase required-file matrices
- [ ] **C2c** phase_checklists.md: Add 21-child verification workflow, 6-child Hydra governance checks, audit-campaign closure items, adaptive fusion telemetry checks
- [ ] **C2d** decision_format.md: Add fields for retrieval telemetry snapshot, fusion strategy, quality gate result, mutation ledger linkage, multi-child audit decision matrix
- [ ] **C2e** five_checks.md: Add measured retrieval evidence requirement (R13 metrics/ablation), flag safety/rollback evidence, phase-campaign governance criterion

### C3: structure/ (4 files)

- [ ] **C3a** folder_routing.md: Add 3-level path resolution (grandchild support), multi-level alignment scoring, deep glob patterns (`specs/**/memory/`)
- [ ] **C3b** folder_structure.md: Add `NN--category-name` convention, epic-root (coordination-only parent) pattern, 10+ children diagrams, archive-within-active-parent guidance, .gitkeep stub documentation
- [ ] **C3c** phase_definitions.md: Expand phase count cap guidance to 16+, add hierarchical phase map format, add sprint-gate lifecycle model, add stub/deferred/partial statuses, add structured dependency table format, add grandchild validation depth
- [ ] **C3d** sub_folder_versioning.md: Add 3+ level nesting support (4-part paths), coordination-only parent pattern, scale disambiguation conventions, sequential numbering guidance for 20+ children

### C4: templates/ (4 files)

- [ ] **C4a** level_specifications.md: Add audit child template archetype (rubric, evidence table, test count, findings); update LOC estimates to current actuals; add Level 3+ epic-scale patterns
- [ ] **C4b** template_guide.md: Add guidance for audit child, root synthesis, sprint gate evaluation document types
- [ ] **C4c** template_style_guide.md: Add style rules for multi-child campaign reports, parent status dashboards
- [ ] **C4d** level_selection_guide.md: Add non-LOC selection criteria (campaign scale, phase topology, governance risk), parent-child level inheritance rules

### C5: workflows/ (4 files)

- [ ] **C5a** worked_examples.md: Add 3 new worked examples:
  1. Epic-scale program (16 phases, parent-child hierarchy, recursive validation)
  2. Sprint-gate validation (define gates, evaluate metrics, go/no-go decision)
  3. Multi-agent campaign (wave-based dispatch, mixed models, finding triage)
- [ ] **C5b** execution_methods.md: Add `--recursive` flag documentation, wave-based parallel dispatch method, sprint-gate evaluation method, multi-model agent mixing method, epic-scale memory save guidance
- [ ] **C5c** rollback_runbook.md: Generalize to general-purpose rollback patterns: feature-flag rollback, sprint regression recovery, phase failure recovery, campaign failure/collision handling, Hydra phase rollback
- [ ] **C5d** quick_reference.md: Add sprint-gate quick reference, expand phase section for 16+ phases, add multi-agent campaign setup entries, add flag governance shortcuts

### C6: debugging/ (2 files)

- [ ] **C6a** troubleshooting.md: Add entries for: recursive validation failures (with 012/021 as example), multi-child phase errors (triage P0 vs P1 across children), stale MCP metadata after sprint transitions, campaign verification failures (addressed vs verified), description.json path mismatches
- [ ] **C6b** universal_debugging_methodology.md: Add RAG pipeline debugging lens (scoring, calibration, channel attribution), retrieval quality measurement methodology (R13 evaluation), evaluation infrastructure debugging (P1)

### C7: config/ (1 file)

- [ ] **C7a** environment_variables.md: Add `SPECKIT_GRAPH_UNIFIED` entry (ON, gates unified graph search channel); update `SPEC_KIT_ENABLE_CAUSAL` description (opt-in but fully shipped, not experimental)

**Verification:**
- [ ] **C-V1** Run `validate.sh` on skill folder structure
- [ ] **C-V2** Verify no broken cross-references between updated files
- [ ] **C-V3** Spot-check 5 representative updated files for placeholder removal

---

## Phase D: Assets Updates

- [ ] **D1** complexity_decision_matrix.md: Add "Epic/Program" tier for 15+ phases, 50+ folders, 150+ features; add multi-child hierarchy scoring signals; add metric-gated sprint model risk signals
- [ ] **D2** level_decision_matrix.md: Add parent-child phase relationship rules; add non-code task guidance (audits, synthesis, coordination); add explicit parent-child level inheritance
- [ ] **D3** parallel_dispatch_config.md: Add 5-wave execution model (16 agents), multi-model mixing profiles (GPT-5.4 + Codex + Sonnet), root synthesis delegation (13 agents across 2+ CLIs), wave-based campaign dispatch with inter-wave synthesis
- [ ] **D4** template_mapping.md: Add archetypes and composition commands for "Audit Child Spec", "Root Synthesis Document", "Sprint Gate Evaluation"

**Verification:**
- [ ] **D-V1** Review each asset against epic patterns in implementation-summary.md
- [ ] **D-V2** Verify new dispatch configs have concrete agent counts and model assignments

---

## Phase E: Cross-Reference Verification

- [ ] **E1** Verify all SKILL.md markdown links resolve to existing files
- [ ] **E2** Verify tool/handler/flag counts consistent across SKILL.md, memory_system.md, environment_variables.md (grep for numeric claims)
- [ ] **E3** Verify new RESOURCE_MAP entries point to existing reference paths
- [ ] **E4** Run alignment drift verifier: `python3 .opencode/skill/sk-code--opencode/scripts/verify_alignment_drift.py --root .opencode/skill/system-spec-kit`
- [ ] **E5** Run spec validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/015-skill-alignment`

---

## Summary

| Phase | Files | P0 Tasks | P1 Tasks | P2 Tasks | Total |
|-------|-------|----------|----------|----------|-------|
| A | 1 | 6 | 0 | 0 | 6 |
| B | 1 | 7 | 14 | 0 | 21 |
| C | 25 | 13 | 12 | 1 | 26 |
| D | 4 | 1 | 3 | 0 | 4 |
| E | - | 0 | 5 | 0 | 5 |
| **Total** | **31** | **27** | **34** | **1** | **62** |
