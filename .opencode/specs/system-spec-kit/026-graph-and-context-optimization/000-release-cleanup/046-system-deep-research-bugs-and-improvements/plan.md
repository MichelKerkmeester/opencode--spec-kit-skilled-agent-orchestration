---
title: "Plan: System Deep Research — Bugs and Improvements (20 iterations)"
description: "Run 20 sk-deep-research iterations via /spec_kit:deep-research:auto with cli-codex gpt-5.5 high; one angle per iteration across 4 categories."
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
trigger_phrases:
  - "046-system-deep-research-bugs-and-improvements plan"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/046-system-deep-research-bugs-and-improvements"
    last_updated_at: "2026-05-01T05:55:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Plan authored"
    next_safe_action: "Dispatch deep-research workflow"
    blockers: []
    completion_pct: 10
    open_questions: []
    answered_questions: []
---

# Plan: System Deep Research — Bugs and Improvements

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Workflow** | `/spec_kit:deep-research:auto` (canonical command surface) |
| **Executor** | `cli-codex` `gpt-5.5` reasoning=`high` service-tier=null |
| **Iterations** | 20 (one per research angle) |
| **Convergence** | 0.01 (low to allow full 20-iter sweep) |
| **State** | Externalized: `research/deep-research-state.jsonl`, `research/deep-research-config.json`, per-iteration `iterations/iteration-NNN.md`, `deltas/iter-NNN.jsonl` |

### Overview
A 20-iteration autonomous deep-research loop covering 5 angles per category (production bugs, wiring/automation bugs, refinement opportunities, architecture/organization). Each iteration produces a finding-rich markdown narrative + a JSONL delta for state reduction. The synthesis step compiles `research/research.md` and `research/resource-map.md`. Output feeds remediation packets (047+).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Spec.md authored with 20 angles
- [x] Research/ artifact dir created
- [x] cli-codex verified (used in packets 042-045)

### Definition of Done
- [ ] 20 iteration files exist with findings + file:line citations
- [ ] `research/research.md` synthesizes findings
- [ ] `research/resource-map.md` lists every file consulted
- [ ] `validate.sh --strict` exits 0
- [ ] Continuity refreshed via `generate-context.js`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Iterative deep-research loop — fresh context per iteration, externalized state, convergence detection, automatic dashboard.

### Workflow Phases
1. **Init** — Write `deep-research-config.json` from template + executor config; write `deep-research-strategy.md` with the 20 angles as research questions; create lock; load prior context via `memory_context`
2. **Loop** — For each iteration NNN ∈ 001..020: render prompt pack, dispatch `cli-codex gpt-5.5 high`, write `iteration-NNN.md` + `iter-NNN.jsonl`, run reducer, evaluate convergence
3. **Synth** — Aggregate findings into `research.md`; emit `resource-map.md` listing analyzed files
4. **Save** — Refresh `description.json`/`graph-metadata.json`; route continuity into `decision-record.md`/`implementation-summary.md`

### Data Flow
```
spec.md (charter, 20 angles) + memory_context + cocoindex_search
        |
        v
deep-research-strategy.md ← init phase writes
        |
        v
Loop x 20:
  prompt-pack render → cli-codex gpt-5.5 high → iteration-NNN.md + delta JSONL
  reducer aggregates state, dashboard updates, convergence checked
        |
        v
Synth phase → research.md + resource-map.md
        |
        v
Save phase → description.json + graph-metadata.json refreshed
        |
        v
validate.sh --strict + commit + push
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup (DONE)
- [x] Scaffold packet 046 (Level 2)
- [x] Author spec.md with 20 angles + executor config
- [x] Author plan.md (this doc), tasks.md, checklist.md

### Phase 2: Init (workflow phase)
- [ ] Write `deep-research-config.json` with cli-codex/gpt-5.5/high settings
- [ ] Write `deep-research-strategy.md` mapping 20 angles to per-iteration focus
- [ ] Acquire `.deep-research.lock`
- [ ] Load `memory_context` for prior research on these subsystems

### Phase 3: Loop (20 iterations)
- [ ] Iterations 001-005 — Category A (production bugs)
- [ ] Iterations 006-010 — Category B (wiring/automation)
- [ ] Iterations 011-015 — Category C (refinement)
- [ ] Iterations 016-020 — Category D (architecture/organization)

### Phase 4: Synth
- [ ] Aggregate findings into `research/research.md`
- [ ] Emit `research/resource-map.md`
- [ ] Update dashboard

### Phase 5: Save + Finalize
- [ ] Run `generate-context.js`
- [ ] Run `validate.sh --strict`
- [ ] Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validation | Packet shape | `validate.sh --strict` |
| Spot-check | Random iteration findings | Manual review of 5 iterations |
| Synthesis | research.md coverage | grep for each angle (A1..D5) |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-codex` `gpt-5.5` | External | Green | All iterations blocked |
| sk-deep-research workflow YAML | Internal | Green | Workflow can't dispatch |
| memory MCP | Internal | Green | Prior context unavailable (degrades, doesn't block) |
| cocoindex_code MCP | Internal | Green | Code search unavailable (degrades) |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Workflow stalls or produces unusable findings
- **Procedure**: `rm -rf .../research/` to restart; spec/plan stay intact for re-run
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup, done) → Phase 2 (Init) → Phase 3 (Loop x20) → Phase 4 (Synth) → Phase 5 (Save)
```
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Effort |
|-------|--------|
| 1 Setup (done) | 30 min |
| 2 Init | 5 min |
| 3 Loop (20 × 8-10 min) | ~3h wall clock |
| 4 Synth | 15 min |
| 5 Save | 10 min |
| **Total** | **~4h** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Spec scaffolded
- [x] Workflow YAML available
- [x] Executor verified

### Rollback Procedure
1. Delete `research/` artifact dir
2. Re-run from `/spec_kit:deep-research:auto`
3. State is fully externalized, restart is clean

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
