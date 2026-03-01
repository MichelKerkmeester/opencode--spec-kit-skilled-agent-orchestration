---
title: "Implementation Plan: SpecKit Phase System [138-spec-kit-phase-system/plan]"
description: "This plan covers formalizing the organic phase decomposition pattern that emerged from specs 136 and 138 into a first-class SpecKit behavioral layer. The technical approach adds..."
trigger_phrases:
  - "implementation"
  - "plan"
  - "speckit"
  - "phase"
  - "system"
  - "138"
  - "spec"
importance_tier: "important"
contextType: "decision"
---
# Implementation Plan: SpecKit Phase System

<!-- SPECKIT_LEVEL: 3+ -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch + level3plus-govern | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash/Shell |
| **Framework** | SpecKit CLI |
| **Storage** | None |
| **Testing** | Shell test fixtures |

### Overview

This plan covers formalizing the organic phase decomposition pattern that emerged from specs 136 and 138 into a first-class SpecKit behavioral layer. The technical approach adds phase detection to `recommend-level.sh`, structured creation to `create.sh`, a new `/spec_kit:phase` command, and recursive validation to `validate.sh` — all as additive changes that leave existing flat specs unaffected.

The system-spec-kit skill manages spec folder lifecycle through 6 interconnected subsystems:

1. **Smart Router** (SKILL.md §2): Data-driven intent detection with 7 signals (PLAN, RESEARCH, IMPLEMENT, DEBUG, COMPLETE, MEMORY, HANDOVER), command boosts (+6), and 3-tier resource loading (ALWAYS/CONDITIONAL/ON_DEMAND). All dicts — adding a new intent requires only dict entries.

2. **Script System** (scripts/spec/): 9 lifecycle scripts. `create.sh` has `--subfolder` mode that auto-increments `[0-9][0-9][0-9]-*/` numbering, copies level templates, creates `memory/` + `scratch/`. No git branch for sub-folders. `recommend-level.sh` scores on 4 dimensions (LOC 35%, files 20%, risk 25%, complexity 20%) with thresholds 0-24=skip, 25-44=L1, 45-69=L2, 70+=L3. No phase scoring exists.

3. **Validation Pipeline** (scripts/spec/validate.sh + scripts/rules/): Pure orchestrator sourcing 14 `check-*.sh` plugins. **No sub-folder handling** — validates single folder path only. No recursion into phase children.

4. **Command System** (.opencode/command/spec_kit/): 7 commands (plan, implement, research, complete, resume, debug, handover) each following `md + 2 YAML assets` pattern. Path resolution assumes flat `specs/NNN-name/` structure.

5. **Template System**: CORE + ADDENDUM v2.2 composition via `compose.sh`. 4 levels (1/2/3/3+). Sharded alternative exists but is separate. No phase-specific templates.

6. **Graph Mode** (index.md + nodes/): Star topology MOC with 9 leaf nodes. No phase-system node exists.

### Organic Phase Pattern (Current State)

| Spec | Phases | Pattern | Phase Level |
|------|--------|---------|-------------|
| 136-mcp-working-memory-hybrid-rag | 7 | Sequential pipeline: Foundation → Extraction → Quality → 3 Post-Research Waves → Docs Alignment | Each child is full L3+ |
| 138-hybrid-rag-fusion | 3 | Dependency-ordered workstreams: RAG Fusion → Skill Graph → Unified Graph Intelligence | Each child is full L3+ |

**Common characteristics:**
- Root holds canonical master spec, plan, tasks, checklist, decision-record
- Root spec.md contains Phase Documentation Map (136 §3.6) linking requirements to phases
- Each child has `Parent Spec: ../spec.md` and `Parent Plan: ../plan.md` back-references
- Children are independently executable with own memory/, scratch/, full doc set
- Phase numbering encodes dependency order (138's 003 depends on 001+002)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (spec.md complete)
- [x] Success criteria measurable (metrics defined in §6)
- [x] Dependencies identified (all 6 internal dependencies confirmed working)
- [x] Organic pattern analyzed (136 and 138 profiles documented)
- [x] Constitution check passed (Five Checks all green)

### Definition of Done
- [ ] All P0 acceptance criteria met (see checklist.md)
- [ ] Phase detection: recommend-level.sh with --recommend-phases, 5 fixtures passing
- [ ] Phase creation: create.sh --phase + template addendum + parent+child structures
- [ ] Phase routing: /spec_kit:phase command + 4 modified commands
- [ ] Phase validation: validate.sh --recursive + check-phase-links.sh rule
- [ ] Docs updated: all 6 reference documents + phase-system.md node + CLAUDE.md
- [ ] Backward compatibility: 51/51 existing fixtures pass with --recursive flag
- [ ] Phase detection precision >= 80% (retroactive check against 136/138 profiles)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Behavioral Layer (cross-cutting additive overlay on existing Level taxonomy)

### Design Decision: Behavioral Layer, Not New Level

Phases are a **cross-cutting behavioral concept** layered on top of existing documentation levels:

```
                    LEVELS (documentation depth)
                    L1 ─── L2 ─── L3 ─── L3+
                    │      │      │       │
PHASES (execution   │      │      │       │
decomposition) ─────┼──────┼──────┼───────┤
                    │      │      │       │
Parent spec:     Can be any level (typically L3/L3+)
Child phases:    Can be any level (typically L1/L2)
```

This means:
- A L3+ parent can have L1 child phases (small, focused slices)
- Phase detection is separate from level recommendation
- No new template tier needed — phases use existing level templates + a small linkage addendum

### Key Components

- **recommend-level.sh**: Extended with phase scoring dimension and --recommend-phases flag
- **create.sh**: Extended with --phase / --phases / --phase-names flags for structured creation
- **/spec_kit:phase command**: New command with auto + confirm YAML workflows
- **validate.sh**: Extended with --recursive flag and check-phase-links.sh rule
- **Template addendum**: New phase/ addendum for parent Phase Documentation Map and child back-references

### Data Flow

```
User Request → Gate 3 (enhanced with Option E)
                    ↓
         recommend-level.sh (enhanced with --recommend-phases)
                    ↓
         ┌─── phases=false ────→ Standard spec folder
         │
         └─── phases=true ─────→ /spec_kit:phase OR auto-suggestion
                                       ↓
                              create.sh --phase
                                       ↓
                              ┌─ Parent folder (L3/L3+)
                              │    ├── spec.md (with Phase Documentation Map)
                              │    ├── plan.md, tasks.md, checklist.md, decision-record.md
                              │    └── memory/, scratch/
                              │
                              └─ Child folders (001-*, 002-*, ...)
                                   ├── spec.md (with Parent back-references)
                                   ├── plan.md, tasks.md [+ level-appropriate extras]
                                   └── memory/, scratch/
                                       ↓
                              validate.sh --recursive
                                       ↓
                              Per-phase + aggregated results
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Detection & Scoring (recommend-level.sh enhancement)

**Goal**: Add phase recommendation to the existing scoring pipeline.

**Changes to `recommend-level.sh`:**

1. New scoring dimension: `WEIGHT_PHASE_SIGNALS` (separate from level scoring)

| Signal | Points | Trigger |
|--------|--------|---------|
| `--architectural` flag present | +15 | Complex cross-cutting change |
| Files > 15 | +10 | Many files = many domains |
| LOC > 800 | +10 | Large implementation scope |
| Risk flags >= 2 (any of --auth, --api, --db) | +10 | Multi-domain risk |
| Files > 30 OR LOC > 2000 | +5 | Extreme scale bonus |

**Phase threshold**: Score >= 25 (out of 50 max) AND Level >= 3

2. New output fields (JSON):
```json
{
  "recommended_level": 3,
  "recommended_phases": true,
  "phase_score": 35,
  "phase_reason": "Architectural change + 25 files + API + DB risk factors",
  "suggested_phase_count": 3,
  "confidence": 82
}
```

3. New function: `determine_phasing()` called after `determine_level()`, checks `RECOMMENDED_LEVEL`, `SCORE_RISK`, `SCORE_COMPLEXITY`, and `FILES`.

4. New CLI flags: `--recommend-phases` (include phase scoring in output), `--phase-threshold <N>` (override default 25).

**Test fixtures**: 5 new fixtures covering: below threshold, at boundary, above threshold, extreme scale, no risk factors.

---

### Phase 2: Templates & Creation (create.sh --phase + templates)

**Goal**: Enable structured parent+child phase folder creation.

**Changes to `create.sh`:**

1. New flag: `--phase` (mutually exclusive with `--subfolder`)
2. New flag: `--phases <N>` (number of initial child phases to create, default 1)
3. New flag: `--phase-names <name1,name2,...>` (optional descriptive names for phases)

**Phase creation flow:**
```
create.sh "Feature Name" --phase --level 3+ --phases 3 --phase-names "foundation,implementation,integration"
  ↓
1. Create parent: specs/NNN-feature-name/
2. Copy level_3+ templates to parent
3. Inject Phase Documentation Map section into parent spec.md
4. For each child (001, 002, 003):
   a. Create NNN-{name}/ with memory/ + scratch/
   b. Copy level_1 templates (default) or --child-level N
   c. Inject parent back-reference fields into child spec.md
   d. Inject phase metadata (phase number, predecessor, successor)
5. Create git branch (if not --skip-branch)
```

**New template addendum** (`templates/addendum/phase/`):
- `phase-parent-section.md`: Phase Documentation Map section for parent spec.md
- `phase-child-header.md`: Parent back-reference metadata block for child spec.md

**Phase Documentation Map format** (injected into parent spec.md):
```markdown
## PHASE DOCUMENTATION MAP

| Phase | Folder | Scope | Dependencies | Status |
|-------|--------|-------|-------------|--------|
| 1 | 001-foundation/ | Core infrastructure | None | Pending |
| 2 | 002-implementation/ | Feature implementation | Phase 1 | Pending |
| 3 | 003-integration/ | Integration & testing | Phase 1, 2 | Pending |
```

**Child phase back-reference** (injected into child spec.md metadata):
```markdown
| **Parent Spec** | ../spec.md |
| **Parent Plan** | ../plan.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-implementation |
| **Handoff Criteria** | [To be defined during planning] |
```

---

### Phase 3: Commands & Router (SKILL.md + spec_kit commands)

**Goal**: Wire phase awareness into the command and routing layers.

**SKILL.md Changes:**

1. Add to `INTENT_SIGNALS`:
```python
"PHASE": {"weight": 3, "keywords": ["phase", "decompose", "split", "workstream", "multi-phase", "phased approach"]}
```

2. Remove `"phase"` from IMPLEMENT keywords (avoid double-scoring).

3. Add to `RESOURCE_MAP`:
```python
"PHASE": ["references/structure/phase_definitions.md", "references/structure/sub_folder_versioning.md"]
```

4. Add to `COMMAND_BOOSTS`:
```python
"/spec_kit:phase": "PHASE"
```

**New Command**: `/spec_kit:phase`

File: `command/spec_kit/phase.md`
- Frontmatter: `description: "Create and manage phase decomposition for complex spec folders"`
- Argument hint: `"Feature description" [--phases N] [--parent specs/NNN-name/]`
- Execution protocol: detect mode → load YAML → execute

File: `assets/spec_kit_phase_auto.yaml` (7-step workflow):
1. Analyze request scope → run recommend-level.sh with phase scoring
2. Present phase decomposition proposal (count, names, dependencies)
3. Create parent + child folders via create.sh --phase
4. Fill parent Phase Documentation Map
5. Fill child phase specs (scope boundaries for each)
6. Save context (generate-context.js)
7. Present next steps (/spec_kit:plan per child phase)

File: `assets/spec_kit_phase_confirm.yaml` (same 7 steps, with approval gates)

**Existing Command Modifications:**

| Command | Modification |
|---------|-------------|
| `plan.md` | Add Gate 3 Option E; support `--phase-folder` argument for targeting specific child |
| `implement.md` | Resolve nested path `specs/NNN/002-phase/plan.md`; scope implementation to active phase |
| `complete.md` | Add phase lifecycle step: validate active phase → check if all phases done → validate parent |
| `resume.md` | Detect phase folders; offer choice: resume parent or specific child phase |

---

### Phase 4: Validation, Docs & Nodes

**Goal**: Ensure phase structures are validated correctly and all documentation reflects the phase system.

**validate.sh Changes:**

1. New flag: `--recursive` (discover and validate child phase folders)
2. Discovery logic:
```bash
if [[ "$RECURSIVE" == "true" ]]; then
  for phase_dir in "$FOLDER_PATH"/[0-9][0-9][0-9]-*/; do
    validate_folder "$phase_dir"  # Reuse existing validation
  done
  aggregate_results
fi
```
3. JSON output enhancement: `"phases": [{"name": "001-foundation", "level": 1, "errors": 0, "warnings": 2}, ...]`
4. Exit code: worst of parent + all children (any error = exit 2)
5. **New rule script**: `check-phase-links.sh` — validates parent-child back-references

**Documentation Updates:**

| Document | Changes |
|----------|---------|
| `references/structure/phase_definitions.md` (NEW) | Phase taxonomy, transition rules, boundary definitions, when-to-phase decision tree |
| `references/structure/sub_folder_versioning.md` | Add "Phases vs Versions" distinction section; integrate with --phase flag |
| `references/templates/level_specifications.md` | Add §9.5 "Phase-Aware Specifications" with phase template rules |
| `references/templates/template_guide.md` | Expand §10 "Using Sub-Folders" into §10 "Phase & Sub-Folder Organization" |
| `references/workflows/quick_reference.md` | Add phase workflow shortcuts, decision table, and phase creation commands |
| `references/validation/validation_rules.md` | Add PHASE_LINKS rule documentation |

**Graph Mode Updates:**

New node: `nodes/phase-system.md`
- Covers: Phase detection triggers, creation workflow, validation, transitions, boundary rules
- Links to: gate-3-integration.md (entry), progressive-enhancement.md (levels), validation-workflow.md (validation)
- Position: index.md MOC → Workflow & Routing section, between gate-3-integration and progressive-enhancement

Update: `index.md` — add `[[nodes/phase-system|Phase System]]` to Workflow & Routing section.

**CLAUDE.md Updates:**
- Gate 3: Add Option E "Add phase to existing spec" with contextual display rules
- Quick Reference table: Add phase workflow row
- Gate 3 triggers: Add "decompose", "phased", "multi-phase" to file modification triggers
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Category | Tool | Coverage Target |
|----------|------|----------------|
| recommend-level.sh phase scoring | Shell test fixtures | 5 fixtures: below/at/above threshold, extreme, no-risk |
| create.sh --phase mode | Shell test fixtures | 4 fixtures: single phase, multi-phase, with names, error cases |
| validate.sh --recursive | Shell test fixtures | 6 fixtures: flat (no recurse), 1-phase, 3-phase, mixed levels, empty child, broken links |
| check-phase-links.sh rule | Shell test fixtures | 3 fixtures: valid links, broken parent ref, missing child metadata |
| Command phase-path resolution | Manual verification | All 4 modified commands with nested paths |
| SKILL.md router PHASE intent | Manual verification | Keyword scoring, command boost, resource loading |
| End-to-end workflow | Manual verification | Full /spec_kit:phase → create → validate → resume cycle |

### Backward Compatibility Tests

Run ALL existing 51 test fixtures with `--recursive` flag to verify no regression. Expected: identical results (no phase children = no additional output).

### Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Phase detection precision | >= 80% | Retrospective: would system have correctly flagged 136 and 138 as needing phases? |
| Phase creation time | < 5s for 3-phase structure | Wall clock time of create.sh --phase --phases 3 |
| Validation time (recursive, 7 phases) | < 10s | Wall clock time of validate.sh --recursive on 136-style structure |
| Zero backward compatibility regressions | 51/51 existing fixtures pass | test-validation.sh suite |
| Command resolution success rate | 100% | All modified commands resolve phase sub-folder paths |
| Reference doc consistency | 0 broken cross-references | Manual review of all modified docs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Phase | Status | Impact if Blocked |
|------------|------|-------|--------|-------------------|
| create.sh --subfolder infrastructure | Internal | Phase 2 | Working (tested) | Blocks --phase flag design |
| recommend-level.sh scoring framework | Internal | Phase 1 | Working (4-dimension scoring) | Blocks phase dimension addition |
| validate.sh plugin architecture | Internal | Phase 4 | Working (14 rules, source-execute pattern) | Blocks --recursive and check-phase-links.sh |
| Command md + 2 YAML pattern | Internal | Phase 3 | Working (7 existing commands) | Blocks /spec_kit:phase creation |
| SKILL.md data-driven router | Internal | Phase 3 | Working (dict-based, extensible) | Blocks PHASE intent addition |
| CORE + ADDENDUM template system | Internal | Phase 2 | Working (compose.sh v2.2) | Blocks phase/ addendum creation |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase scoring produces excessive false positives (>20% error rate), path resolution failures occur in modified commands, or backward compatibility regressions are detected in the 51-fixture suite.
- **Procedure**: All changes are additive with new flags (--recommend-phases, --phase, --recursive). Rollback is `git revert` of the relevant commits per phase. Existing specs are unaffected — no data migrations involved. Feature flags (new CLI flags) can be simply not invoked.

**Risk-linked rollback triggers** (from spec.md Risk Matrix):
- R-01 (Over-suggestion): Raise --phase-threshold from 25 to 35+ to reduce false positives without reverting
- R-02 (Context overflow): Revert child-level defaults to L1 only (remove --child-level option)
- R-03 (Path resolution failures): Revert command modifications for the affected command only
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1: Detection & Scoring ──→ Phase 2: Templates & Creation
                                          │
                                          ↓
                               Phase 3: Commands & Router
                                          │
                                          ↓
                               Phase 4: Validation, Docs & Nodes
```

Phases 1 and 2 can be partially parallelized (scoring is independent of template creation). Phases 3 and 4 depend on 1+2 being complete.

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Phase 1: Detection & Scoring | None | Phase 2 (partial), Phase 3 |
| Phase 2: Templates & Creation | Phase 1 (partial) | Phase 3, Phase 4 |
| Phase 3: Commands & Router | Phase 1, Phase 2 | Phase 4 |
| Phase 4: Validation, Docs & Nodes | Phase 1, Phase 2, Phase 3 | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Phase 1: Detection & Scoring | Medium | 3-5 hours (scoring logic + 5 test fixtures) |
| Phase 2: Templates & Creation | High | 6-10 hours (create.sh flags + template addendum + 4 test fixtures) |
| Phase 3: Commands & Router | Medium | 4-7 hours (new command + 4 modified commands + SKILL.md) |
| Phase 4: Validation, Docs & Nodes | High | 6-10 hours (validate.sh + 6 docs + 3 test fixtures + node) |
| **Total** | | **19-32 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] All 51 existing test fixtures confirmed passing before any changes
- [ ] Git branch created for each implementation phase
- [ ] Phase scoring thresholds documented (default: 25) for reference
- [ ] Baseline benchmarks recorded (create.sh timing, validate.sh timing)

### Rollback Procedure
1. **Immediate**: Stop using new CLI flags (--recommend-phases, --phase, --recursive) — all changes are flag-gated
2. **Per-phase revert**: `git revert` commits from the affected phase only (phases are independently committable)
3. **Verify rollback**: Run full 51-fixture regression suite — expected: identical output to pre-change baseline
4. **Notify**: Document rollback reason in spec memory file for future reference

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A — all changes are script/template/documentation only; no persistent state affected
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────────┐
│  Phase 1                 │
│  Detection & Scoring     │─────────────────────────────┐
│  (recommend-level.sh)    │──────┐                       │
└──────────────────────────┘      │                       │
                                  ▼                       ▼
                    ┌──────────────────────────┐   ┌──────────────────────────┐
                    │  Phase 2                 │   │  Phase 3                 │
                    │  Templates & Creation    │──►│  Commands & Router       │
                    │  (create.sh + addendum)  │   │  (SKILL.md + commands)   │
                    └──────────────────────────┘   └──────────────────────────┘
                                  │                       │
                                  └───────────┬───────────┘
                                              ▼
                                ┌──────────────────────────┐
                                │  Phase 4                 │
                                │  Validation, Docs &      │
                                │  Nodes                   │
                                └──────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| recommend-level.sh (phase scoring) | None | Phase score JSON, --recommend-phases output | create.sh --phase design, SKILL.md PHASE intent |
| create.sh --phase | Phase 1 (partial) | Parent+child folder structures, template addendum | All command modifications, validate.sh |
| /spec_kit:phase command | Phase 1, Phase 2 | New command + YAML assets | Phase 4 docs (command documented there) |
| Modified commands (plan/implement/complete/resume) | Phase 2 | Phase-aware path resolution | Phase 4 docs |
| validate.sh --recursive | Phase 1, Phase 2, Phase 3 | Per-phase + aggregated validation output | Reference doc updates |
| check-phase-links.sh | Phase 2 (template format) | Link validation rule | validate.sh --recursive |
| Reference docs + node | All prior phases | Updated documentation | M4 milestone |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1: Detection & Scoring** — 3-5 hours — CRITICAL (unblocks all downstream)
2. **Phase 2: Templates & Creation** — 6-10 hours — CRITICAL (unblocks commands + validation)
3. **Phase 3: Commands & Router** — 4-7 hours — CRITICAL (required before Phase 4 docs)
4. **Phase 4: Validation, Docs & Nodes** — 6-10 hours — CRITICAL (final integration)

**Total Critical Path**: 19-32 hours sequential

**Parallel Opportunities**:
- Phase 1 (scoring logic) and Phase 2 (template addendum design) can run simultaneously — scoring output shape is independent of template structure
- Within Phase 4: validate.sh changes, reference doc updates, and phase-system.md node creation are all independent and can be parallelized across agents
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Deliverable | Verification | Target |
|-----------|-------------|--------------|--------|
| M1: Phase Detection Ready | recommend-level.sh with --recommend-phases, 5 test fixtures passing | Run scoring against 136/138 profiles — both should trigger phases=true | End of Phase 1 |
| M2: Phase Creation Ready | create.sh --phase, template addendum, parent+child structures | Create 3-phase test structure, validate with existing validate.sh | End of Phase 2 |
| M3: Commands Phase-Aware | /spec_kit:phase + 4 modified commands + SKILL.md PHASE intent | End-to-end /spec_kit:phase workflow, all modified commands resolve nested paths | End of Phase 3 |
| M4: Validation & Docs Complete | validate.sh --recursive, all 6 reference docs updated, phase-system.md node, CLAUDE.md updated | Full test suite (18 new fixtures) + 51 fixture regression (0 regressions) | End of Phase 4 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

> **Note:** This section summarizes key architectural decisions. The authoritative source is [decision-record.md](./decision-record.md) which contains full ADR detail including context, constraints, alternatives analysis, consequences, and Five Checks evaluations. See ADR-001 and ADR-002 in that document for complete records.

---

<!-- ANCHOR:ai-execution -->
## L3+: AI EXECUTION FRAMEWORK

### Tier 1: Sequential Foundation (Phase 1)
**Files**: recommend-level.sh (scoring logic), 5 new test fixtures
**Duration**: ~3-5 hours
**Agent**: @general (Sonnet) — script modification, straightforward scoring logic

### Tier 2: Parallel Execution (Phase 2 + Phase 3 partial)

| Agent | Focus | Files |
|-------|-------|-------|
| @speckit | Template addendum creation (phase-parent-section.md, phase-child-header.md) | templates/addendum/phase/ |
| @general | create.sh --phase flag implementation | scripts/spec/create.sh |
| @general | SKILL.md PHASE intent addition | SKILL.md |

**Duration**: ~6-10 hours (parallel between @speckit and @general)

### Tier 3: Integration (Phase 3 + Phase 4)
**Agent**: @general (Sonnet) for commands/validation; @speckit (Opus) for reference docs and node
**Task**: Wire phase command system, implement validate.sh --recursive, update all reference docs
**Duration**: ~10-17 hours

### Agent Routing Summary

| Phase | Recommended Agent | Model | Rationale |
|-------|-------------------|-------|-----------|
| Phase 1 | @general | Sonnet | Script modification, straightforward scoring logic |
| Phase 2 | @speckit + @general | Opus (spec) + Sonnet (script) | Template creation needs @speckit exclusivity; create.sh needs @general |
| Phase 3 | @general | Sonnet | Command system modifications, well-defined patterns |
| Phase 4 | @speckit + @general | Opus (docs) + Sonnet (validation) | Reference docs need @speckit; validate.sh needs @general |

### Context Protection

- Each implementation phase should be a separate session or use /spec_kit:resume
- Phase-level memory saves after each milestone
- Avoid loading all modified files simultaneously — work file-by-file
<!-- /ANCHOR:ai-execution -->

---

<!-- ANCHOR:workstreams -->
## L3+: WORKSTREAM COORDINATION

### Workstream Definition

| ID | Name | Owner | Files | Status |
|----|------|-------|-------|--------|
| W-A | Detection & Scoring | @general | scripts/spec/recommend-level.sh, test fixtures (5) | Pending |
| W-B | Templates & Creation | @speckit + @general | scripts/spec/create.sh, templates/addendum/phase/* | Pending (after W-A) |
| W-C | Commands & Router | @general | command/spec_kit/phase.md, assets/spec_kit_phase_*.yaml, SKILL.md, plan.md, implement.md, complete.md, resume.md | Pending (after W-A, W-B) |
| W-D | Validation, Docs & Nodes | @speckit + @general | scripts/spec/validate.sh, scripts/rules/check-phase-links.sh, 6 reference docs, nodes/phase-system.md, index.md, CLAUDE.md | Pending (after W-A, W-B, W-C) |

### Sync Points

| Sync ID | Trigger | Participants | Output |
|---------|---------|--------------|--------|
| SYNC-001 | W-A complete (Phase 1 done) | @general | Phase scoring JSON schema locked; W-B and W-C can begin |
| SYNC-002 | W-B complete (Phase 2 done) | @speckit + @general | Template addendum format locked; W-C and W-D can proceed |
| SYNC-003 | W-C complete (Phase 3 done) | @general | All command path patterns documented; W-D docs can reference them |
| SYNC-004 | W-D complete (Phase 4 done) | All agents | Full test suite run; 51 regression fixtures verified; M4 milestone |

### File Ownership Rules
- Each file owned by ONE workstream
- Cross-workstream changes require SYNC before proceeding
- @speckit has exclusive authority over all template and reference doc files
- @general handles all script (.sh) files
<!-- /ANCHOR:workstreams -->

---

<!-- ANCHOR:communication -->
## L3+: COMMUNICATION PLAN

### Checkpoints

| Gate | Trigger | Required Artifacts | Approver |
|------|---------|-------------------|----------|
| G1: Plan Approval | After this plan review | spec.md, plan.md, decision-record.md | Project Owner |
| G2: Phase 1 Complete | recommend-level.sh tests pass | Updated script, 5 test fixtures | Self-review |
| G3: Phase 2 Complete | create.sh --phase works | Templates, test structures | Self-review |
| G4: Phase 3 Complete | All commands handle phases | Modified commands, SKILL.md | Self-review |
| G5: Phase 4 Complete | All docs + validation done | Reference docs, node, validate.sh | Self-review |
| G6: Final Acceptance | All P0/P1 verified | checklist.md fully marked | Project Owner |

### Change Control

Changes to spec scope (new P0 requirements, architectural shifts) require re-approval at G1 gate. Implementation-level adjustments within approved scope proceed autonomously.

### Escalation Path
1. Technical blockers (script failures, path resolution issues) → Document in scratch/ + raise in next session with full error context
2. Scope changes (new phase system requirements discovered during implementation) → Re-evaluate spec.md → Re-approve at G1
3. Backward compatibility regressions → Halt Phase 4 → Investigate in Phase 1-3 changes → Fix before proceeding
<!-- /ANCHOR:communication -->

---

## RELATED DOCUMENTS

- [Specification](./spec.md)
- [Tasks](./tasks.md)
- [Checklist](./checklist.md)
- [Decision Record](./decision-record.md)
- [Risk Matrix](./spec.md#risk-matrix)

---

<!--
LEVEL 3+ PLAN (~340 lines)
- Core + L2 + L3 + L3+ addendums
- Behavioral layer architecture, full phase implementation design
- AI execution framework, workstream coordination, communication plan
-->
