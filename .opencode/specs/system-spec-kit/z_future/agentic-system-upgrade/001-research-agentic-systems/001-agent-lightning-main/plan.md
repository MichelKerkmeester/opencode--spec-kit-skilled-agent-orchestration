---
title: "Implementation Plan: 001-agent-lightning-main Research Phase"
description: "A three-wave, 30-iteration deep-research loop that validates the phase docs, maps the Agent Lightning repo, investigates narrow RL and operator-surface questions, records structured iteration state, and synthesizes actionable system-spec-kit recommendations."
trigger_phrases:
  - "001-agent-lightning-main research plan"
  - "agent lightning execution plan"
  - "deep research loop plan"
importance_tier: "important"
contextType: "plan"
---
# Implementation Plan: 001-agent-lightning-main Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; Python and Markdown source under study; shell-based validation |
| **Framework** | `system-spec-kit` Level 3 packet workflow + manual deep-research loop |
| **Storage** | Markdown docs, iteration files, JSONL state log |
| **Testing** | `validate.sh --strict`, targeted source verification via direct reads and line-numbered evidence |

### Overview

This phase executes a disciplined three-wave, 30-iteration deep-research loop against the bundled Agent Lightning repository. The work starts by creating and validating the required Level 3 phase docs, then mapping the external repo and the relevant Public comparison surfaces, then executing one narrow question per iteration with exact citations, and finally synthesizing the results into a canonical research report, dashboard, implementation summary, and an auditable memory-save record.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `phase-research-prompt.md` reviewed end-to-end
- [x] Level 3 phase docs present
- [x] `external/` confirmed readable
- [x] strict validation passes
- [x] research output folders initialized

### Definition of Done
- [x] Iterations executed and logged in JSONL
- [x] `research/research.md` completed with actionable findings
- [x] `research/deep-research-dashboard.md` completed
- [x] `implementation-summary.md` completed
- [x] Memory saved with `generate-context.js`
- [x] Final strict validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Read-only deep research with externalized state and synthesis-by-iteration.

### Key Components
- **Phase docs**: define scope, validation contract, and completion bar.
- **Agent Lightning source map**: targeted external repo reads across tracer, store, adapter, trainer, algorithm, examples, and docs.
- **Public comparison set**: existing `system-spec-kit`, command, and agent files that each finding must influence.
- **Iteration artifacts**: one markdown file per question plus a JSONL state row.
- **Synthesis artifacts**: final report, dashboard, implementation summary, and a documented memory-save record.

### Data Flow
`phase-research-prompt.md` -> Level 3 phase docs -> strict validation -> external repo mapping -> iteration question selection -> evidence capture with citations -> iteration markdown -> JSONL append -> convergence check per wave -> final merged synthesis and closeout.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and Validation
- [x] Create Level 3 phase docs
- [x] Run strict validation
- [x] Fix any packet-doc issues before research

### Phase 2: Repository Mapping
- [x] Map Agent Lightning structure and core modules
- [x] Identify the key Public comparison targets
- [x] Define the first iteration question from real source evidence

### Phase 3: Iterative Research
- [x] Execute iterations `001` through `030` across the three completed waves unless convergence or insufficient evidence stops a wave early
- [x] Append a JSONL state record after every iteration
- [x] Review convergence after each iteration

### Phase 4: Synthesis and Closeout
- [x] Write `research/research.md`
- [x] Write `research/deep-research-dashboard.md`
- [x] Update checklist and tasks with evidence
- [x] Create `implementation-summary.md`
- [x] Preserve the earlier memory-save record and rerun strict validation
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Phase doc integrity and completion gates | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <phase> --strict` |
| Evidence verification | Line-accurate citations for external and internal files | `nl -ba`, `sed`, `rg`, CocoIndex |
| Manual review | Recommendation quality, overlap control, phase-only write scope | Diff inspection and artifact review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `phase-research-prompt.md` | Internal | Green | Research framing becomes invalid |
| `external/` Agent Lightning checkout | Internal | Green | No source material to study |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Internal | Green | Cannot pass packet gate |
| `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Internal | Green | Memory save cannot complete |
| CocoIndex semantic search | Internal | Green | Repo exploration becomes slower and less semantic |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research artifacts contain unsupported claims, failed validation, or edits escaped the phase folder.
- **Procedure**: Remove or correct the affected phase-local artifacts, rerun strict validation, and regenerate synthesis from the iteration evidence that remains valid.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Docs + Validate) -> Phase 2 (Repo Map) -> Phase 3 (Iterations) -> Phase 4 (Synthesis)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup and Validation | None | Repo Map, Iterations, Synthesis |
| Repo Map | Setup and Validation | Iterations |
| Iterative Research | Repo Map | Synthesis |
| Synthesis and Closeout | Iterative Research | Done |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup and Validation | Medium | 20-40 minutes |
| Repository Mapping | Medium | 20-40 minutes |
| Iterative Research | High | 4-8 hours |
| Synthesis and Closeout | Medium | 45-90 minutes |
| **Total** | | **~6-10 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Only phase-local files are modified
- [ ] All citations resolve to real line ranges
- [ ] External repo remains untouched
- [ ] Open questions and rejected recommendations are documented honestly

### Rollback Procedure
1. Delete or patch any invalid phase-local artifact.
2. Rebuild the affected iteration or synthesis file from verified evidence only.
3. Rerun strict validation before treating the phase as complete.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes research artifacts only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Read brief and create Level 3 docs** - CRITICAL
2. **Pass strict validation before research** - CRITICAL
3. **Map the external repo and Public comparison seams** - CRITICAL
4. **Run the bounded iteration loop with evidence capture** - CRITICAL
5. **Synthesize, preserve memory-save continuity, and revalidate** - CRITICAL

**Total Critical Path**: brief -> docs -> validation -> mapping -> iterations -> synthesis -> memory continuity -> final validation

**Parallel Opportunities**:
- External repo mapping and Public surface mapping can be gathered in parallel before iteration 001.
- Once iteration questions are chosen, evidence collection for a single iteration stays sequential to preserve citation integrity.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase docs ready | All required Level 3 docs exist | Phase 1 |
| M2 | Validation gate cleared | `validate.sh --strict` passes | Phase 1 |
| M3 | Research loop underway | At least 5 iterations completed with JSONL state in each active wave | Phase 3 |
| M4 | Full research set complete | 30 iterations complete across the three waves or a valid stop condition triggered for a wave | Phase 3 |
| M5 | Phase closeout complete | Synthesis, dashboard, implementation summary, memory-save record, and validation done | Phase 4 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────────┐
│ Phase Brief Review  │
└──────────┬──────────┘
           v
┌─────────────────────┐
│ Level 3 Phase Docs  │
└──────────┬──────────┘
           v
┌─────────────────────┐
│ Strict Validation   │
└──────────┬──────────┘
           v
┌─────────────────────┐
│ Repo Mapping        │
└──────────┬──────────┘
           v
┌─────────────────────┐
│ Iteration Loop      │
└──────────┬──────────┘
           v
┌─────────────────────┐
│ Synthesis + Closeout│
└─────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase docs | Phase brief | Valid packet structure | Validation |
| Validation | Phase docs | Green light for research | Repo map |
| Repo map | Validation | First iteration hypotheses | Iteration loop |
| Iteration loop | Repo map | Evidence-backed findings | Synthesis |
| Synthesis | Iteration loop | Final report and closeout | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:milestones -->
### Architecture Decision Summary

See `decision-record.md` for the core ADRs:

- **ADR-001**: Use static source analysis as the primary research method instead of trying to execute training workloads.
- **ADR-002**: Force every iteration to target one falsifiable question plus one concrete Public adoption target.
- **ADR-003**: Treat tracing and reward recommendations as RL-specific only when they add leverage beyond existing Public orchestration and memory surfaces.
- **ADR-004**: Keep the entire workflow phase-local, with `external/` strictly read-only.

#### AI Execution Protocol

This section defines the autonomous execution rules for the deep-research run.

##### Pre-Task Checklist

Before iteration 001 begins, verify:

- [ ] `phase-research-prompt.md` has been read
- [ ] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` exist
- [ ] `validate.sh --strict` passes
- [ ] `research/iterations/` exists
- [ ] `external/` is readable
- [ ] A first narrow research question is chosen from real file inspection

##### Task Execution Rules

| Rule ID | Constraint | Enforcement |
|---------|------------|-------------|
| TASK-SEQ-001 | Research iterations run sequentially | Complete each iteration artifact and JSONL row before moving to the next |
| TASK-SCOPE-001 | All writes stay inside this phase folder | Review modified paths before closeout |
| TASK-SCOPE-002 | `external/` is read-only | No edit commands target `external/` |
| TASK-EVID-001 | Every material claim needs a real citation | Use line-numbered file reads before writing findings |
| TASK-ITER-001 | Each iteration asks one narrow, falsifiable question | Reject broad repo-overview questions |
| TASK-ITER-002 | Each iteration names a Public adoption target | Recommendation section must point to a specific file, module, or concept |
| TASK-STATE-001 | Append exactly one JSONL row per iteration | `research/deep-research-state.jsonl` remains append-only |
| TASK-CONV-001 | Review convergence after every iteration | Stop early only after at least 5 iterations and a valid stop rule |
| TASK-CLOSE-001 | Final artifacts include report, dashboard, implementation summary, and memory save | Do not claim completion without all four |

##### Status Reporting Format

After each iteration, the recorded state should support this summary:

```
ITER N STATUS: complete
QUESTION: <narrow question>
CONFIDENCE: <high|medium|low>
NEW SIGNAL: <true|false>
FILES READ: <count>
NEXT FOCUS: <next question or SYNTHESIS>
```

### Blocked Task Protocol

If the run becomes blocked:

1. Record the blocker in `tasks.md` and the next iteration or closeout notes.
2. If validation is the blocker, patch phase docs first and rerun validation before continuing.
3. If source coverage is the blocker, fall back from CocoIndex to exact file reads and document the fallback.
4. If fewer than 5 meaningful iterations remain possible, synthesize with `insufficient_evidence`.
5. If `phase-research-prompt.md` or `external/` is unreadable, stop with the required explicit error string.
<!-- /ANCHOR:milestones -->
