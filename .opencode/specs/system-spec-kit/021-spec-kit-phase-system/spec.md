---
title: "Feature Specification: SpecKit Phase System [system-spec-kit/021-spec-kit-phase-system/spec]"
description: "Level 3+ (+Govern) is appropriate when"
trigger_phrases:
  - "feature"
  - "specification"
  - "speckit"
  - "phase"
  - "system"
  - "spec"
  - "021"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/021-spec-kit-phase-system"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["spec.md"]
---
<!-- SPECKIT_LEVEL: 3+ -->
# Feature Specification: SpecKit Phase System

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

<!-- WHEN TO USE THIS TEMPLATE:
Level 3+ (+Govern) is appropriate when:
- Enterprise-scale changes with high visibility
- Formal approval workflow required
- Compliance checkpoints needed (SOX, HIPAA, etc.)
- Stakeholder matrix with sign-off tracking
- Changelog with version history
- AI execution protocols for multi-agent coordination
- Complexity score 80-100

DO NOT use Level 3+ if:
- Standard complex feature without governance (use Level 3)
- No formal approvals required (use Level 3)
- Compliance not mandated (use Level 3)
- Single-agent execution sufficient (use Level 3)
-->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

The SpecKit Phase System formalizes the organic sub-folder pattern observed in specs 136 and 138 into a first-class, AI-assisted workflow that proactively detects large tasks and guides decomposition into structured phase folders before work begins. This replaces the current manual, after-the-fact sub-folder creation with intelligent up-front phase planning.

**Key Decisions**: (1) Phases are a behavioral layer on top of existing levels, not a new level tier; (2) Auto-suggestion via enhanced `recommend-level.sh` scoring; (3) New `/spec_kit:phase` command for phase lifecycle management.

**Critical Dependencies**: Existing `create.sh --subfolder` infrastructure, SKILL.md smart router data-driven architecture.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Spec ID** | 021 |
| **Level** | 3+ |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-20 |
| **Parent** | system-spec-kit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Large, multi-session tasks (500+ LOC, 15+ files, cross-domain scope) currently produce monolithic spec folders whose documentation grows unwieldy and whose context files balloon beyond useful retrieval limits. The sub-folder pattern that evolved organically in specs 136 (7 phases) and 138 (3 workstreams) proves the pattern works, but AI agents have no systematic awareness of when to suggest phasing, how to create phase structures, or how to validate them as cohesive units. Today, sub-folder creation is entirely manual and after-the-fact.

### Purpose

AI agents proactively detect tasks that warrant phased execution, suggest structured decomposition before work begins, create properly linked parent/child spec folders, and validate them as integrated units - reducing rework, context overload, and documentation drift in complex multi-session projects.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Phase detection scoring in `recommend-level.sh` (new `--recommend-phases` output)
- SKILL.md smart router: new PHASE intent signal with keyword triggers and resource mapping
- New `/spec_kit:phase` command with auto/confirm modes and YAML workflow assets
- Enhanced `create.sh` with `--phase` mode (parent+child creation, phase metadata injection)
- Recursive validation via `validate.sh --recursive` for parent+child phase folders
- Phase-aware Gate 3: new Option E "Add phase to existing spec" in CLAUDE.md
- Parent spec template addendum with Phase Documentation Map and phase-linkage fields
- Child phase template with parent back-reference fields and handoff criteria
- New `../../../skill/system-spec-kit/nodes/phase-system.md` graph mode node
- New `../../../skill/system-spec-kit/references/structure/phase_definitions.md` reference document
- Updates to `../../../skill/system-spec-kit/references/structure/sub_folder_versioning.md`, `../../../skill/system-spec-kit/references/templates/level_specifications.md`, `../../../skill/system-spec-kit/references/templates/template_guide.md`, and `../../../skill/system-spec-kit/references/workflows/quick_reference.md`
- Updates to existing commands: `/spec_kit:plan`, `/spec_kit:implement`, `/spec_kit:complete`, `/spec_kit:resume`

### Out of Scope
- Memory MCP server changes - Phase system uses existing memory infrastructure as-is
- Sharded template integration - Sharded system remains a parallel alternative, not merged
- compose.sh modifications - Phase templates composed manually, not via compose.sh pipeline
- Level tier changes - Phases are behavioral, not a new documentation level
- Cross-spec-folder phase linking - Phases must live under a single parent spec folder
- Automated phase transition (auto-advancing from phase N to N+1) - Remains user-driven

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../../../skill/system-spec-kit/SKILL.md` | Modify | Add PHASE intent signal, resource mapping, command boost |
| `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | Modify | Add phase recommendation scoring and --recommend-phases flag |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Modify | Add --phase mode with parent+child creation |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Modify | Add --recursive flag for phase-aware validation |
| `/spec_kit:phase` command entry point | Create | New phase command entry point |
| `.opencode/command/spec_kit/assets/spec_kit_phase_auto.yaml` | Create | Phase command autonomous workflow |
| `.opencode/command/spec_kit/assets/spec_kit_phase_confirm.yaml` | Create | Phase command interactive workflow |
| `../../../command/spec_kit/plan.md` | Modify | Add phase awareness to Gate 3 options |
| `../../../command/spec_kit/implement.md` | Modify | Support sub-folder path resolution |
| `../../../command/spec_kit/complete.md` | Modify | Add phase lifecycle to workflow |
| `../../../command/spec_kit/resume.md` | Modify | Phase detection in context loading |
| `.opencode/skill/system-spec-kit/templates/addendum/phase/` | Create | Phase-linkage addendum (parent + child templates) |
| `../../../skill/system-spec-kit/nodes/phase-system.md` | Create | Graph mode node for phase workflow |
| `../../../skill/system-spec-kit/references/structure/phase_definitions.md` | Create | Phase taxonomy and transition rules |
| `../../../skill/system-spec-kit/references/structure/sub_folder_versioning.md` | Modify | Integrate phase concepts into versioning docs |
| `../../../skill/system-spec-kit/references/templates/level_specifications.md` | Modify | Phase-boundary rules in cross-cutting section |
| `../../../skill/system-spec-kit/references/templates/template_guide.md` | Modify | Phase template section (extend existing Section 10) |
| `../../../skill/system-spec-kit/references/workflows/quick_reference.md` | Modify | Phase workflow shortcuts and decision tables |
| `system-spec-kit index` | Modify | Add the phase-system node to the Workflow & Routing section |
| `CLAUDE.md` | Modify | Gate 3 Option E, phase-aware routing table |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `recommend-level.sh` outputs phase recommendation alongside level recommendation | `--json` output includes `recommended_phases: true/false`, `phase_reason`, `suggested_phase_count` when level score >= 70 (100-point scale) AND (architectural OR files > 15 OR LOC > 800) |
| REQ-002 | `create.sh --phase` creates parent spec folder with Phase Documentation Map section + first child phase folder with parent back-reference | Running `create.sh "Large Feature" --phase --level 3 --phases 3` creates `specs/NNN-large-feature/` with root docs + `001-phase-name/` child with linked docs |
| REQ-003 | `validate.sh --recursive` discovers and validates all `[0-9][0-9][0-9]-*/` child phase folders within a parent, producing aggregated results | Exit code reflects worst child; JSON output includes `phases[]` array with per-phase results |
| REQ-004 | `/spec_kit:phase` command exists with auto/confirm modes | Command definition + 2 YAML workflow assets follow the existing command structure pattern |
| REQ-005 | SKILL.md smart router recognizes PHASE intent and loads phase-specific resources | Adding `"phase"` to INTENT_SIGNALS, mapping to `../../../skill/system-spec-kit/references/structure/phase_definitions.md` in RESOURCE_MAP, and boosting via `/spec_kit:phase` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Gate 3 offers Option E "Add phase to existing spec" when existing spec has high complexity | CLAUDE.md updated; AI correctly offers E when resuming complex specs |
| REQ-007 | Existing commands (`plan`, `implement`, `complete`, `resume`) handle phase sub-folder paths | All commands resolve nested phase-plan paths correctly |
| REQ-008 | Auto-suggestion triggers when AI detects task exceeding phase thresholds | AI proactively suggests "This task may benefit from a phased approach" when recommend-level.sh scoring indicates phases |
| REQ-009 | Parent spec template includes Phase Documentation Map section linking to child phases | Section maps root requirements to phase deliverables (modeled after 136's Section 3.6) |
| REQ-010 | Child phase template includes parent back-references and handoff criteria | Each child spec contains parent spec/plan links plus predecessor and successor phase fields |
| REQ-011 | `../../../skill/system-spec-kit/nodes/phase-system.md` documents phase lifecycle, transitions, and boundary rules | Node exists in the Workflow & Routing section of the system-spec-kit index |
| REQ-012 | Reference docs updated: `../../../skill/system-spec-kit/references/structure/phase_definitions.md` created, plus the sub-folder versioning, template guide, quick reference, and level specification references updated | All reference docs reflect phase system as a first-class concept |

### P2 - Nice to Have (can defer without approval)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-013 | Phase progress dashboard in parent checklist.md | Parent checklist shows phase completion status table |
| REQ-014 | `recommend-level.sh` suggests phase names based on task decomposition | JSON output includes `suggested_phase_names[]` when phases recommended |
| REQ-015 | Sharded template integration for parent specs | Parent spec uses sharded format (spec-index.md + per-phase shards) for token efficiency |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Phase recommendation accuracy - `recommend-level.sh` correctly identifies tasks needing phases (validated against 136/138 retrospective); target >= 80%
- **SC-002**: Phase folder creation correctness - `create.sh --phase` creates valid, `validate.sh`-passing structures; target 100% pass rate
- **SC-003**: Recursive validation coverage - `validate.sh --recursive` validates all children + parent; all 14 rules applied per phase folder
- **SC-004**: Command phase-path resolution - all 4 modified commands resolve sub-folder paths; target 0 path resolution errors
- **SC-005**: AI auto-suggestion rate - AI proactively suggests phasing for qualifying tasks; triggers on tasks matching 136/138 scope profile
- **SC-006**: Template linkage integrity - parent-child back-references resolve correctly across parent and child docs

### Scenario 1: High-complexity scoring recommends phases

- **Given** a task scores at Level 3+ with architectural scope, more than 15 files, and more than 800 LOC
- **When** `recommend-level.sh --recommend-phases --json` evaluates the request
- **Then** the output includes `recommended_phases: true`, a concrete `phase_reason`, and a non-zero `suggested_phase_count`

### Scenario 2: Phase creation scaffolds parent and child folders

- **Given** a developer runs `create.sh "Large Feature" --phase --level 3+ --phases 3`
- **When** the phase creation workflow completes
- **Then** it creates a parent spec folder with a Phase Documentation Map and a `001-*` child phase folder with parent back-references and handoff metadata

### Scenario 3: Recursive validation aggregates parent and child results

- **Given** a parent spec contains numbered child phase folders with their own canonical docs
- **When** `validate.sh --recursive` runs on the parent spec folder
- **Then** it validates the parent and each child, reports per-phase results, and exits with the worst child status

### Scenario 4: Phase command routes work through the phase lifecycle

- **Given** a task qualifies for phased execution and the user chooses the phase workflow
- **When** `/spec_kit:phase` runs in auto or confirm mode
- **Then** it follows the command workflow pattern, creates or selects the phase folder structure, and routes the work into the correct phase lifecycle path

### Scenario 5: Gate 3 surfaces Option E only when phases are relevant

- **Given** an existing spec is complex or the task description contains phase-related signals
- **When** Gate 3 is rendered for a file-modification request
- **Then** the prompt includes Option E for phase-folder work instead of limiting the user to the standard four-option flow

### Scenario 6: CLAUDE.md stays aligned with phase-aware guidance

- **Given** CLAUDE.md includes Gate 3 Option E and phase-aware routing guidance
- **When** an agent evaluates planning, resume, or completion work for a complex existing spec
- **Then** the agent can offer phase-folder handling and matching command guidance without conflicting instructions across the documented workflow
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing `create.sh --subfolder` infrastructure (working, tested) | Phase creation blocked if broken | Verify existing tests pass before extending |
| Dependency | SKILL.md smart router data-driven dict architecture (extensible by design) | Router changes required if architecture changes | Design additive dict entries only |
| Dependency | `validate.sh` plugin-based rule architecture (14 rules, source-and-execute pattern) | Recursive validation depends on plugin system | Extend via existing plugin mechanism |
| Dependency | Existing command structure pattern (md + 2 YAML assets per command) | Inconsistent UX if pattern changes | Mirror existing command file layout exactly |
| Risk | Over-suggestion: AI recommends phases for tasks that don't need them | Medium | Conservative thresholds; require both high score AND multi-domain signals |
| Risk | Phase template bloat: Too many files per phase folder | High | Use Level 1-2 for child phases by default; only parent needs L3+ |
| Risk | Context window pressure: Parent + multiple child docs in single session | High | Sharded loading; only load active phase docs |
| Risk | Gate 3 complexity: 5 options (A-E) may confuse users | Medium | Option E only shown when existing spec has phased content or high complexity |
| Risk | Command path resolution brittleness: nested paths harder to resolve | Medium | Leverage existing generate-context.js path resolution (4 formats supported) |
| Risk | Backward compatibility: existing non-phased specs must continue working | High | Phase features are purely additive; all flags optional |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: `recommend-level.sh --recommend-phases` adds < 50ms to scoring time
- **NFR-P02**: `validate.sh --recursive` on 7-phase parent completes in < 10s

### Compatibility
- **NFR-C01**: All existing non-phased spec folders validate identically with or without `--recursive`
- **NFR-C02**: Bash 4.0+ compatibility maintained (no Bash 5+ features)

### Usability
- **NFR-U01**: Phase suggestion message includes concrete phase decomposition rationale
- **NFR-U02**: `/spec_kit:phase` follows identical UX patterns as existing commands

### Maintainability
- **NFR-M01**: Phase templates use CORE + ADDENDUM composition (no separate maintenance branch)

### Extensibility
- **NFR-E01**: Phase scoring dimensions configurable via `.speckit.yaml` overrides
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Phase Structure Boundaries
- EC-01 - Single-phase parent (user creates parent but only ever needs 1 phase): Valid; degenerate case equivalent to standard spec folder with one sub-folder
- EC-02 - Phase folder created but never populated (empty child): `validate.sh` warns about empty phase; does not error
- EC-03 - Parent has phases but user runs flat validate (no `--recursive`): Validates parent only; no error; warns if child folders detected
- EC-04 - Phase numbering gap (001, 002, 005 - skip 003/004): `create.sh` uses max+1 logic; skipped numbers are valid (no renumbering)
- EC-05 - Mixed levels: parent is L3+, child phases are L1: Valid; each folder's level is independent. Parent level does not cascade

### Error Scenarios
- EC-06 - Recommend-level suggests phases but user declines: System proceeds without phases; no persistent flag or penalty
- EC-07 - Existing sub-folder (versioning) vs new phase (semantic): Phase flag distinguishes: `--phase` creates phase metadata; `--subfolder` creates version iteration
- EC-08 - Phase created in wrong parent folder: `validate.sh` parent-child link check fails; error with corrective guidance
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 22/25 | Files: 20+, LOC: 500+, Systems: 6 subsystems modified/created |
| Risk | 14/20 | Backward compatibility critical; over-suggestion risk; path resolution complexity |
| Research | 18/20 | Deep integration with SKILL.md router, Gate 3, validation pipeline, command system, and template architecture; formalizing emergent pattern requires deep understanding of existing organic usage |
| Multi-Agent | 8/15 | Single developer/maintainer; no cross-team coordination needed |
| Coordination | 18/20 | Cross-cutting: scripts, commands, templates, references, nodes, CLAUDE.md all must align |
| **Total** | **80/100** | **Meets L3+ threshold (80+)** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-01 | Over-suggestion of phases | Medium | Medium | Conservative thresholds (score >= 70 AND architectural AND files > 15); user always has decline option |
| R-02 | Context window overflow with multi-phase docs | High | Medium | Default to L1/L2 for child phases; sharded parent loading; active-phase-only context |
| R-03 | Path resolution failures across commands | Medium | Medium | Reuse generate-context.js 4-format path resolver; comprehensive test fixtures |
| R-04 | Backward compatibility regression | High | Low | All phase features behind --phase/--recursive flags; existing behavior unchanged by default |
| R-05 | Template maintenance burden | Medium | Low | Phase addendum is small (~30 lines); composed via existing CORE + ADDENDUM pattern |
| R-06 | Gate 3 option overload (5 options) | Medium | Low | Option E contextually shown only when high-complexity existing spec detected |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-01: AI Suggests Phased Approach
**As an** AI agent processing a complex task request (e.g., "Build a hybrid RAG search system"),
**I want to** automatically detect that the task exceeds single-spec-folder complexity thresholds,
**So that** I proactively suggest a phased approach before the user starts working, reducing rework.

**Acceptance**: When `recommend-level.sh --json --loc 2000 --files 25 --architectural --api --db` runs, output includes `"recommended_phases": true, "suggested_phase_count": 3`.

### US-02: Developer Creates Phased Spec
**As a** developer starting a large feature,
**I want to** run `/spec_kit:phase` and get a properly structured parent + child phase folders,
**So that** each phase can be planned, implemented, and validated independently.

**Acceptance**: Running the command creates parent with Phase Documentation Map, child 001 with parent back-references, and both pass validate.sh.

### US-03: Validation Across Phases
**As a** developer completing a multi-phase project,
**I want to** run `validate.sh --recursive` on the parent folder,
**So that** all phases and the parent are validated as an integrated unit.

**Acceptance**: Output shows per-phase results, aggregated error/warning counts, and combined exit code.

### US-04: Resume Work on Specific Phase
**As a** developer resuming work after a break,
**I want to** run `/spec_kit:resume specs/system-spec-kit/022-hybrid-rag-fusion/003-index-tier-anomalies/`,
**So that** only phase 003's context is loaded without polluting my context with other phases.

**Acceptance**: Resume correctly loads only child phase memory files, not sibling phases.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:approval-workflow -->
## 12. APPROVAL WORKFLOW

| Checkpoint | Approver | Status | Date |
|------------|----------|--------|------|
| Specification | Project Owner | Pending | — |
| Plan Review | Project Owner | Pending | — |
| Implementation Phase 1: Detection & Scoring | Self-review | Pending | — |
| Implementation Phase 2: Templates & Creation | Self-review | Pending | — |
| Implementation Phase 3: Commands & Router | Self-review | Pending | — |
| Implementation Phase 4: Validation & Docs | Self-review | Pending | — |
| Final Acceptance | Project Owner | Pending | — |
<!-- /ANCHOR:approval-workflow -->

---

<!-- ANCHOR:compliance -->
## 13. COMPLIANCE CHECKPOINTS

### Template Compliance
- [ ] CORE + ADDENDUM v2.2 structure followed; `compose.sh --verify` passes
- [ ] Phase templates composed via existing addendum pipeline (no standalone maintenance branch)

### Script Compliance
- [ ] Bash 4.0+ compatibility verified via `shellcheck` on all modified scripts
- [ ] Tested on target platforms; no Bash 5+ features introduced

### Backward Compatibility
- [ ] `validate.sh` run on all 51 existing test fixtures with `--recursive`; no regressions
- [ ] Existing non-phased specs unaffected by new `--phase` and `--recursive` flags

### Command Pattern Compliance
- [ ] `/spec_kit:phase` command definition + 2 YAML assets match the file structure of existing commands
- [ ] All 4 modified commands (`plan`, `implement`, `complete`, `resume`) resolve phase sub-folder paths correctly

### Documentation Alignment
- [ ] Cross-reference check completed on all modified reference docs
- [ ] All internal links between parent and child phase docs resolvable
<!-- /ANCHOR:compliance -->

---

<!-- ANCHOR:stakeholders -->
## 14. STAKEHOLDER MATRIX

| Stakeholder | Role | Interest | Communication |
|-------------|------|----------|---------------|
| Project Owner | Decision maker | Feature direction, UX approval | Plan review, final acceptance |
| AI Agents (@write, @general) | Primary consumers | Phase-aware behavior in workflows | SKILL.md router, command integration |
| spec_kit commands | Integration surface | Phase path resolution | Command md + YAML updates |
| validate.sh pipeline | Quality gate | Phase-recursive validation | Script flag addition |
| Template system | Content generation | Phase template addendum | CORE + ADDENDUM composition |
<!-- /ANCHOR:stakeholders -->

---

<!-- ANCHOR:changelog -->
## 15. CHANGE LOG

### v0.1 (2026-02-20)
**Initial specification**
- Initial specification draft authored by AI Agent
<!-- /ANCHOR:changelog -->

---

<!-- ANCHOR:questions -->
## 16. OPEN QUESTIONS

- OQ-01: Should phase child folders default to L1 or inherit parent's level? (Impact: Template design) — Proposed: Default L1, allow --level override
- OQ-02: Should `--phase` mode in create.sh be a separate script or integrated? (Impact: Code organization) — Proposed: Integrated in create.sh (consistent with --subfolder)
- OQ-03: Should Phase Documentation Map be a mandatory section for all L3+ specs or only phased ones? (Impact: Template impact) — Proposed: Optional section, only injected by --phase mode
- OQ-04: Should the sharded template system be leveraged for parent specs to enable selective phase loading? (Impact: Token efficiency) — Proposed: P2 enhancement, not blocking
- OQ-05: How should phase numbering interact with existing sub-folder versioning? (Impact: Create.sh logic) — Proposed: --phase creates phases, --subfolder creates versions; mutually exclusive flags
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Sub-Folder Versioning Reference**: See `../../../skill/system-spec-kit/references/structure/sub_folder_versioning.md`
- **Level Specifications Reference**: See `../../../skill/system-spec-kit/references/templates/level_specifications.md`

---

<!--
LEVEL 3+ SPEC (~200 lines)
- Core + L2 + L3 + L3+ addendums
- Approval Workflow, Compliance, Stakeholders
- Full governance controls
-->
