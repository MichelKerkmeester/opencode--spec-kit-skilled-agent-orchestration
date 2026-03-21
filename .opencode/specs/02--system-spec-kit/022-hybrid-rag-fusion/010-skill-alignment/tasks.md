---
title: "Tasks: Skill Alignment — system-spec-kit"
description: "Actionable backlog for the still-open documentation alignment work in 010-skill-alignment."
trigger_phrases: ["tasks", "skill alignment", "010 alignment"]
importance_tier: "important"
contextType: "implementation"
---
# Tasks: Skill Alignment — system-spec-kit
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (target)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Spec-Folder Remediation

- [x] T001 Upgrade `spec.md`, `plan.md`, and `tasks.md` to Level 2 metadata and anchors (`./spec.md`, `./plan.md`, `./tasks.md`)
- [x] T002 Fix local relative references so links resolve from `010-skill-alignment` (`./spec.md`, `./plan.md`, `./tasks.md`)
- [x] T003 Create a Level 2 checklist tailored to this documentation-only phase (`./checklist.md`)
- [x] T004 Rewrite the folder narrative so the phase is clearly draft, docs-only, and pre-implementation (`./spec.md`, `./plan.md`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Open Skill-Guide Backlog

- [x] T005 Retain stale metadata fixes that are still open: LOC, handler count, lib directory count, tool count, schema version, token approximation, and document-type list (`../../../../skill/system-spec-kit/SKILL.md`)
  - **Verified open gaps (live repo 2026-03-15):**
    - SKILL.md line 512 claims "12 handler files" — actual: ~30 handler .ts files in `mcp_server/handlers/` (plus `save/` subdirectory with ~13 sub-modules)
    - SKILL.md line 512 claims "20 lib subdirectories" — actual: 26 subdirectories in `mcp_server/lib/`
    - SKILL.md line 512 claims "25 MCP tools" — actual: 32 tools (confirmed via `tool-schemas.ts` TOOL_DEFINITIONS array, corroborated by 011-command-alignment)
    - SKILL.md line 514 claims "8 most-used of 25 total" — should be "8 most-used of 32 total"
    - Schema version, token approximation, and document-type list remain unchecked (deferred to implementation phase)
  - **Canonical source:** Count tool definitions in `mcp_server/tool-schemas.ts` TOOL_DEFINITIONS array (line 537+)

- [x] T006 Retain routing and keyword gaps still open in Smart Routing: new RAG intents, expanded RESOURCE_MAP, and `/memory:*` command boosts for all 7 commands (context, save, manage, learn, continue, analyze, shared — analyze and shared delivered by 016) (`../../../../skill/system-spec-kit/SKILL.md`)
  - **Verified open gaps (live repo 2026-03-15):**
    - Missing RAG intents: RETRIEVAL_TUNING, SCORING_CALIBRATION, EVALUATION, ROLLOUT_FLAGS, GOVERNANCE — none present in INTENT_SIGNALS (SKILL.md lines 126-143)
    - COMMAND_BOOSTS (lines 179-187) only covers 7 `/spec_kit:*` commands; no `/memory:*` command boosts exist for any of the 7 memory commands (context, save, manage, learn, continue, analyze, shared)
    - RESOURCE_MAP (lines 145-177) lacks entries for newer references: `trigger_config.md`, `embedding_resilience.md`, `epistemic_vectors.md`
    - No RESOURCE_MAP entries exist for EVALUATION, GOVERNANCE, or ROLLOUT_FLAGS intents

- [x] T007 Retain rules/guidance gaps still open for phase integrity, feature-flag governance, campaign execution, and shared-space/shared-memory tool treatment (`../../../../skill/system-spec-kit/SKILL.md`)
  - **Verified open gaps (live repo 2026-03-15):**
    - Phase integrity rules: no explicit SKILL.md section governing phase boundaries or phase-transition constraints
    - Feature-flag governance: flags are documented inline but no consolidated governance section exists
    - Campaign execution: no campaign execution guidance in SKILL.md
    - Shared-space/shared-memory tool treatment: SKILL.md lacks positioning for `shared_space_upsert`, `shared_space_membership_set`, `shared_memory_status`, `shared_memory_enable` (these tools now have command homes via 016's `/memory:shared`, but SKILL.md routing and rules do not reference them)

- [x] T008 Remove from the future backlog any skill-guide work that is already satisfied elsewhere in current repo docs; note that command-level tool coverage is now complete (016), so only SKILL.md metadata/routing/rules remain as 010 scope (`../../../../skill/system-spec-kit/SKILL.md`)
  - **Already satisfied (do not re-implement):**
    - Command-level tool coverage: fully closed by 011-command-alignment (32/32 tools across 7 commands)
    - Tool summary table in SKILL.md (lines 516-525): shows 8 most-used tools — accurate for a summary; full coverage is now in command docs
    - memory_context mode routing table (lines 531-536): accurate
    - memory_search key rules (lines 538-542): accurate
    - memory_save processing notes (lines 544-548): accurate
    - Epistemic learning section (line 550): accurate
    - Key concepts section (lines 552-564): accurate and current
  - **Remaining 010 scope:** SKILL.md stale metadata (T005), routing gaps (T006), rules/governance gaps (T007)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Open Reference and Asset Backlog

- [x] T009 [P] Keep only open memory-reference tasks for `../../../../skill/system-spec-kit/references/memory/memory_system.md`, `../../../../skill/system-spec-kit/references/memory/save_workflow.md`, `../../../../skill/system-spec-kit/references/memory/trigger_config.md`, `../../../../skill/system-spec-kit/references/memory/embedding_resilience.md`, and `../../../../skill/system-spec-kit/references/memory/epistemic_vectors.md` (`../../../../skill/system-spec-kit/references/memory/**`)
  - **Verified open gaps (live repo 2026-03-15):**
    - All 5 memory references (memory_system.md, save_workflow.md, trigger_config.md, embedding_resilience.md, epistemic_vectors.md) have 0 mentions of epic-scale patterns, campaign coordination, rollout guidance, governance, or shared-space concepts
    - memory_system.md: tool count references may cite 25 instead of 32
    - trigger_config.md: no coverage of shared-memory triggers or cross-space trigger matching
    - embedding_resilience.md: no governance or multi-tenant embedding considerations
    - epistemic_vectors.md: no epic-level learning metrics or cross-phase knowledge tracking
    - save_workflow.md: no shared-space save routing or governance-aware save paths

- [x] T010 [P] Keep only open validation/structure/workflow/debugging tasks for files still missing epic-scale guidance (`.opencode/skill/system-spec-kit/references/**`)
  - **Verified open gaps (live repo 2026-03-15):**
    - References across 7 subdirs (config, debugging, memory, structure, templates, validation, workflows) totaling ~25 files
    - Validation references: no epic-scale validation patterns (cross-phase validation, recursive parent-child verification at campaign level)
    - Structure references: folder_routing.md and folder_structure.md lack shared-space folder conventions
    - Workflow references: no campaign execution workflow or multi-phase coordination patterns
    - Debugging references: no shared-space or cross-tenant debugging guidance
    - Templates references: governance references exist (Level 3+ templates) but lack campaign template patterns
  - **Already covered:** recursive validation shortcuts (quick_reference.md), phase-aware templates (level_specifications.md), nested child-path support (sub_folder_versioning.md)

- [x] T011 Retain config work only for gaps still open in env-var docs, especially runtime `SPECKIT_GRAPH_UNIFIED` coverage and stale `SPEC_KIT_ENABLE_CAUSAL` wording (`.opencode/skill/system-spec-kit/references/config/environment_variables.md`)
  - **Verified open gaps (live repo 2026-03-15):**
    - `SPECKIT_GRAPH_UNIFIED` — referenced in 17 codebase files but environment_variables.md only mentions it in passing as "distinct from runtime `SPECKIT_GRAPH_UNIFIED`" on the Hydra roadmap line (line 263); no dedicated entry with default/description
    - `SPEC_KIT_ENABLE_CAUSAL` (line 168) — description says "experimental - maps decision dependencies" which is stale; the causal graph system is now mature with link/unlink/stats tools and dedicated command coverage via `/memory:analyze`

- [x] T012 Retain only open asset work for dispatch, complexity, level-decision, and template-mapping docs (`.opencode/skill/system-spec-kit/assets/**`)
  - **Verified open gaps (live repo 2026-03-15):**
    - 4 asset files: parallel_dispatch_config.md, complexity_decision_matrix.md, level_decision_matrix.md, template_mapping.md
    - parallel_dispatch_config.md: no epic-scale dispatch patterns or cross-phase parallelization
    - complexity_decision_matrix.md: no campaign-level complexity scoring
    - level_decision_matrix.md: no campaign-level level selection guidance
    - template_mapping.md: no shared-space template routing
    - None of the 4 assets mention shared-space, campaign, or epic-level coordination

- [x] T013 Explicitly exclude already-landed items from this backlog, including recursive validation shortcuts, phase-aware template guidance, nested child-path support, and env-var entries that are already documented (`./spec.md`, `./tasks.md`)
  - **Exclusions confirmed (live repo 2026-03-15):**
    - Recursive validation shortcuts: present in `references/workflows/quick_reference.md` — EXCLUDE from backlog
    - Phase-aware template guidance: present in `references/templates/level_specifications.md` — EXCLUDE from backlog
    - Nested child-path support: present in `references/structure/sub_folder_versioning.md` — EXCLUDE from backlog
    - Command-level tool documentation: fully delivered by 011-command-alignment (32/32 tools, 7 commands) — EXCLUDE from backlog
    - Rollback runbook: present in `references/workflows/rollback_runbook.md` with feature-flag rollback guidance — EXCLUDE from backlog
    - Env-var entries already documented (18 `SPEC_KIT_ENABLE_*` flags, `SPECKIT_ROLLOUT_PERCENT`, Hydra flags) — EXCLUDE from backlog; retain only missing `SPECKIT_GRAPH_UNIFIED` entry and stale `SPEC_KIT_ENABLE_CAUSAL` wording
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:phase-4 -->
## Phase 4: Verification and Guardrails

- [x] T014 Replace brittle tool-count verification with a canonical-source method that counts actual tool definition entries rather than every `name:` token (`./spec.md`, `./tasks.md`)
  - **Canonical method documented:** Count entries in the `TOOL_DEFINITIONS` array in `mcp_server/tool-schemas.ts` (line 537+). Each entry has a `name:` field with a string literal (e.g., `name: 'memory_context'`). Exclude type definitions (line 30: `name: string;`) and nested parameter objects (e.g., line 318, 337). This method matches 011-command-alignment's T00/T19 precedent. Current count: 32 tools.

- [x] T015 Add an explicit guard that future implementation must not change runtime TypeScript behavior while executing this phase (`./spec.md`, `./tasks.md`, `./checklist.md`)
  - **Guard language:** spec.md already contains NFR-C01 ("This phase must not authorize runtime TypeScript behavior changes") and checklist.md contains CHK-030 [P0] ("No runtime TypeScript behavior changes were made"). Both remain in effect for the implementation phase. Additionally, spec.md Out of Scope explicitly states "MCP server runtime code changes - this phase remains documentation-only."

- [x] T016 Run `validate.sh` for the `010-skill-alignment` folder and record any remaining policy conflicts honestly (`./checklist.md`)
  - **Result:** Exit 2. 14/16 checks pass. 2 errors: FILE_EXISTS (implementation-summary.md, resolved at finalization) and SPEC_DOC_INTEGRITY (8 false positives from cross-folder `../../../../skill/...` references). 1 warning: SECTION_COUNTS (0 acceptance scenarios, accurate for backlog curation phase). Recorded in CHK-020.

- [x] T017 Run `check-completion.sh` and confirm the new Level 2 checklist is recognized (`./checklist.md`)
  - **Result:** Standard mode recognized. 18/20 items (90%). P0: 7/8 → now 8/8 after CHK-020 resolution. P1: 10/10. P2: 1/2 (CHK-052 deferred). Recorded in CHK-021.

- [x] T018 Run `verify_alignment_drift.py --root .opencode/skill/system-spec-kit` and confirm this planning phase did not introduce runtime/code drift (`./checklist.md`)
  - **Result:** PASS. 776 files scanned, 0 findings, 0 errors, 0 warnings, 0 violations. Recorded in CHK-022.

- [x] T019 Re-run targeted searches to confirm every retained open task still maps to scratch research or live repo evidence (`./spec.md`, `./tasks.md`)
  - **Verification summary (live repo 2026-03-15):**
    - SKILL.md LOC: 788 (stale claim references context-server.ts at ~682)
    - Handler .ts files in `mcp_server/handlers/`: ~30 (SKILL.md claims 12) — CONFIRMED OPEN
    - Lib subdirectories in `mcp_server/lib/`: 26 (SKILL.md claims 20) — CONFIRMED OPEN
    - Tool count in `tool-schemas.ts`: 32 (SKILL.md claims 25) — CONFIRMED OPEN
    - COMMAND_BOOSTS: only 7 `/spec_kit:*` entries, no `/memory:*` — CONFIRMED OPEN
    - RESOURCE_MAP: lacks trigger_config.md, embedding_resilience.md, epistemic_vectors.md — CONFIRMED OPEN
    - SPECKIT_GRAPH_UNIFIED: no dedicated env-var entry — CONFIRMED OPEN
    - SPEC_KIT_ENABLE_CAUSAL: stale "experimental" description — CONFIRMED OPEN
    - Memory references: 0 mentions of epic/campaign/shared-space patterns — CONFIRMED OPEN
    - All retained tasks map to observable repo gaps
<!-- /ANCHOR:phase-4 -->

---

<!-- ANCHOR:phase-5 -->
## Phase 5: Implementation (Applied Fixes)

- [x] T020 Apply SKILL.md metadata + tool table fixes: handler count ~30, lib dirs 26, tool count 32, tool table expanded to 13 entries (`../../../../skill/system-spec-kit/SKILL.md`)
- [x] T021 Apply SKILL.md feature flags expansion: added 15 flags (PIPELINE_V2, QUALITY_LOOP, RELATIONS, STRICT_SCHEMAS, DEGREE_BOOST, GRAPH_SIGNALS, COMMUNITY_DETECTION, CAUSAL_BOOST, GRAPH_UNIFIED, SCORE_NORMALIZATION, CLASSIFICATION_DECAY, INTERFERENCE_SCORE, FOLDER_SCORING, SHADOW_SCORING, DASHBOARD_LIMIT) for 25 total (`../../../../skill/system-spec-kit/SKILL.md`)
- [x] T022 Apply SKILL.md smart routing additions: 5 new INTENT_SIGNALS (13 total), 5 new RESOURCE_MAP entries (13 total), 7 new `/memory:*` COMMAND_BOOSTS (14 total) (`../../../../skill/system-spec-kit/SKILL.md`)
- [x] T023 Apply environment_variables.md fixes: +7 env vars (SPEC_KIT_DB_DIR, DISABLE_SESSION_DEDUP, ENABLE_TOOL_CACHE, ENABLE_BM25, SPECKIT_SHADOW_SCORING, SPECKIT_DASHBOARD_LIMIT, SPECKIT_GRAPH_UNIFIED), fixed SPECKIT_PIPELINE_V2 and SPEC_KIT_ENABLE_CAUSAL descriptions (`../../../../skill/system-spec-kit/references/config/environment_variables.md`)
- [x] T024 Apply reference file updates: Learning Index Workflow section in epistemic_vectors.md, Signal Vocabulary Expansion in trigger_config.md, Known Resolved Issues (7 entries) in troubleshooting.md (`../../../../skill/system-spec-kit/references/memory/epistemic_vectors.md`, `../../../../skill/system-spec-kit/references/memory/trigger_config.md`, `../../../../skill/system-spec-kit/references/debugging/troubleshooting.md`)
- [x] T025 Fix 7 stale catalog entries: namespace management, validation feedback, co-activation divisor, cold-start novelty, anchor-tags-as-graph-nodes, feature flag defaults (2 files) (`../../../../skill/system-spec-kit/feature_catalog/`)
- [x] T026 Run validate.sh and verify_alignment_drift.py (`./checklist.md`)
<!-- /ANCHOR:phase-5 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All spec-folder remediation tasks are complete
- [x] Only still-open documentation work remains in the backlog
- [x] No runtime behavior changes were performed under this phase
- [x] Verification results are captured in `checklist.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `./spec.md`
- **Plan**: See `./plan.md`
- **Checklist**: See `./checklist.md`
- **Research Evidence**: See `./scratch/agent-01-skill-routing.md` through `./scratch/agent-10-refs-config.md`
<!-- /ANCHOR:cross-refs -->

---
