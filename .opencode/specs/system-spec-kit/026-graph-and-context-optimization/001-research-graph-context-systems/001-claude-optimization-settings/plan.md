---
title: "Implementation Plan: Phase 001 - Claude Optimization Settings (Reddit field-report audit)"
description: "Research methodology for an 8-iteration deep-research loop auditing a Reddit field report against Code_Environment/Public's Claude configuration, producing 17 findings across 4 prioritization tiers."
trigger_phrases:
  - "claude optimization research methodology"
  - "deep research iterations"
  - "convergence trajectory"
  - "reddit audit plan"
importance_tier: "important"
contextType: "research"
---
# Implementation Plan: Phase 001 - Claude Optimization Settings (Reddit field-report audit)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Research Runner** | cli-copilot gpt-5.4, `reasoning_effort=high` |
| **State Format** | Externalized JSONL (deep-research-state.jsonl) + research/deep-research-strategy.md + findings-registry.json |
| **Synthesis Target** | `research/research.md` (466 lines, 12 sections) |
| **Iteration Cap** | 10 (stopped at 8; synthesis-ready signal reached) |
| **Sub-agent Dispatch** | Prohibited per phase-research-prompt §8 (LEAF-only execution) |

### Overview

This phase followed an 8-iteration deep-research loop against a single primary-source document (external/reddit_post.md). The loop used an externalized JSONL + strategy file state model, a reducer-driven dashboard for tracking convergence, and a synthesis dry-run blueprint (iteration 008) before the final `research/research.md` writer pass. The output is not code or configuration changes -- it is a ranked recommendation set (F1-F17) that downstream phases and planning can act on. No settings were modified, no hooks were written, and no auditor was built in this phase.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Primary source (external/reddit_post.md) read in full before any cross-referencing
- [x] Repo state verified: `.claude/settings.local.json` and `CLAUDE.md` read against post recommendations
- [x] Phase 005-claudest boundary confirmed: implementation work explicitly out of scope
- [x] Discrepancy handling rule set: preserve 926-vs-858 sessions and 18,903-vs-11,357 turns mismatches

### Definition of Done

- [x] `research/research.md` exists with >=5 evidence-backed findings (17 produced)
- [x] Every finding cites a specific external/reddit_post.md passage with paragraph anchor
- [x] Config-change checklist in research.md §5 completed
- [x] Phase 005-claudest boundary stated in research.md §9
- [x] Convergence report in research.md §12 with full newInfoRatio trajectory
- [x] Level 3 spec documents created (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md)
- [ ] Validation via `validate.sh --strict` (to run after spec set creation)
- [ ] Memory saved via `generate-context.js` (to run after validation)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Offline deep-research loop with externalized state: each iteration agent reads strategy + JSONL state, performs targeted evidence extraction, writes an iteration file, and updates the shared state. A reducer pass refreshes the convergence dashboard. The loop terminates on synthesis-ready signal rather than cap.

### Key Components

- **external/reddit_post.md**: Primary source; read-only; the only required research target for this phase
- **research/deep-research-state.jsonl**: Machine-owned per-iteration state records (11 records across 8 iterations plus init)
- **research/deep-research-strategy.md**: Analyst-owned strategy file: topic, key questions, non-goals, stop conditions, known context
- **research/findings-registry.json**: Deduplicated cross-iteration finding ledger
- **research/deep-research-dashboard.md**: Reducer-generated convergence tracking (newInfoRatio, finding counts, open questions)
- **research/iterations/iteration-001 through iteration-008**: Per-iteration evidence files
- **research/research.md**: Canonical synthesis output; produced by a dedicated writer pass after iteration 008

### Data Flow

Primary source is read once (iteration 001), then targeted re-reads are performed per-iteration for specific passages. Each iteration writes new findings to findings-registry.json and its own numbered iteration file. The reducer reads all iteration files and rewrites the dashboard after each pass. At iteration 008, the synthesis dry-run blueprint was produced. The writer then composed research/research.md from the consolidated finding ledger.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research Loop Initialization

- [x] Create `research/deep-research-config.json` with iteration cap, convergence threshold, runner config
- [x] Create `research/deep-research-state.jsonl` with init record
- [x] Create `research/deep-research-strategy.md` with topic, 5 key questions, non-goals, stop conditions, known context
- [x] Verify repo state: `.claude/settings.local.json` has `ENABLE_TOOL_SEARCH=true` (confirmed)
- [x] Confirm phase 005-claudest boundary is understood before starting

### Phase 2: Evidence Extraction Iterations (1-7)

- [x] Iteration 001: Initial full read of external/reddit_post.md; source map; 8 findings; newInfoRatio=0.93
- [x] Iteration 002: Q4 cache-warning hooks vs existing hook surface; conflict matrix; 5 findings; newInfoRatio=0.68
- [x] Iteration 003: Q5 bash-vs-native + redundant reads + edit retries + routing (RTK); 6 findings; newInfoRatio=0.57
- [x] Iteration 004: Audit methodology + portability + JSONL fragility + discrepancy preservation; 5 findings; newInfoRatio=0.48
- [x] Iteration 005: Q7 latency risks + Q8 edit retries + config checklist draft; 4 findings; newInfoRatio=0.41
- [x] Iteration 006: Phase 005 boundary + prioritization tier table + gap matrix; 4 findings; newInfoRatio=0.38
- [x] Iteration 007: Gap closure + contradiction sweep + confidence scoring; 2 findings; newInfoRatio=0.24

### Phase 3: Synthesis

- [x] Iteration 008: Synthesis dry-run blueprint; final F1-F17 ledger; 0 new findings; status=thought; newInfoRatio=0.12
- [x] Writer pass: Compose `research/research.md` from consolidated ledger (466 lines, 12 sections)
- [x] Create Level 3 spec documents (this task set)
- [ ] Validation: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh [PHASE_FOLDER] --strict`
- [ ] Memory save: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [PHASE_FOLDER]`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Method |
|-----------|-------|--------|
| Source grounding | Every finding cites a passage anchor | Manual: check each F1-F17 for "Source passage anchor" and "Source quote" fields |
| Discrepancy preservation | 926/858 sessions and 18,903/11,357 turns visible | Manual: search research.md §2 for both values |
| Cross-check coverage | Repo state table covers all 5 post recommendations | Manual: verify research.md §3 table has all rows |
| Phase boundary | research.md §9 contains no implementation content | Manual: read §9 boundary paragraph; confirm no plugin/auditor detail |
| Spec validation | All six Level 3 docs exist and pass template checks | `validate.sh --strict` on phase folder |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| external/reddit_post.md | Internal (read-only) | Green | Primary source; without it no findings are possible |
| `.claude/settings.local.json` | Internal (read-only) | Green | Required for repo cross-check in research.md §3 |
| `CLAUDE.md` | Internal (read-only) | Green | Required for behavioral recommendation cross-check |
| Phase 005-claudest | Sibling phase | Yellow (not yet complete) | Prototype-lane findings (F4-F7, F14-F15, F17) cannot be validated until 005 ships; not blocking for this phase |
| cli-copilot gpt-5.4 | External runner | Green (used; iterations complete) | All 8 iterations completed successfully |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research output found to have smoothed source discrepancies or duplicated phase 005 content
- **Procedure**: Edit research.md to restore discrepancy table rows per research.md §2 template; remove any implementation-level content from research.md §9; re-run validate.sh
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1: Init ──────────────────────────────────────────────────────────────────┐
                                                                                 │
Phase 2: Iterations 1-7 (serial, each depends on previous JSONL state) ─────────┤
                                                                                 │
Phase 3: Iteration 008 (dry-run) + Writer (research.md) + Spec docs ────────────►  Validation + Memory Save
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Init | None | Iterations |
| Iteration 001 | Init | Iteration 002 |
| Iterations 002-007 | Previous iteration JSONL state | Next iteration |
| Iteration 008 | Iterations 001-007 complete | Writer pass |
| Writer (research.md) | Iteration 008 blueprint | Spec docs |
| Spec docs | research.md | Validation |
| Validation | All spec docs | Memory save |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual (retrospective) |
|-------|------------|------------------------|
| Init + repo cross-check | Low | ~15 minutes (iteration 001 setup) |
| Iterations 1-7 (evidence extraction) | High | ~7 iterations x ~10 minutes each |
| Iteration 008 (dry-run) | Medium | ~20 minutes |
| Writer pass (research.md) | High | ~30 minutes |
| Level 3 spec documents | Medium | ~45 minutes |
| Validation + memory save | Low | ~5 minutes |
| **Total** | | **~3.5 hours (estimated)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-completion Checklist

- [x] Source discrepancies visible in research.md §2 (not smoothed)
- [x] Phase 005-claudest boundary in research.md §9 (not duplicated)
- [x] `ENABLE_TOOL_SEARCH=true` identified as already present (not listed as new action)
- [ ] validate.sh --strict exit code 0 or 1 (no errors)

### Rollback Procedure

1. If discrepancy smoothed: restore research.md §2 table rows from iteration-001 source map
2. If phase 005 content duplicated: trim research.md §9 to boundary paragraph only
3. If config checklist claims post-backed settings for repo-local flags: correct labels to "implied_repo_local"
4. Re-run validate.sh after any correction

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A -- this phase produces documentation only; no settings, hooks, or code were modified
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
external/reddit_post.md (read-only)
        |
        v
Iteration 001 (full read + source map + 8 findings)
        |
        v
Iterations 002-007 (targeted extraction, serial JSONL state)
        |
        v
Iteration 008 (consolidation + blueprint, 0 new findings)
        |
        v
Writer pass --> research/research.md
        |
        v
Level 3 spec docs (spec, plan, tasks, checklist, decision-record, impl-summary)
        |
        v
validate.sh --strict --> memory save
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Iteration 001 | external/reddit_post.md read | Source map + 8 findings | All later iterations |
| Iterations 002-007 | Previous JSONL state | 21 additional raw findings | Iteration 008 |
| Iteration 008 | All prior iterations | F1-F17 consolidated ledger + blueprint | Writer pass |
| research.md | Iteration 008 blueprint | Canonical synthesis (466 lines) | Spec docs |
| Spec docs | research.md | 6 Level 3 documents | Validation |
| Validation | Spec docs | Exit code + error count | Memory save |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Iteration 001** - Full primary-source read - CRITICAL (no findings without this)
2. **research.md writer pass** - Canonical synthesis from consolidated ledger - CRITICAL
3. **Level 3 spec documents** - Required for phase completion bar - CRITICAL
4. **validate.sh --strict** - Gate before memory save - CRITICAL

**Total Critical Path**: 4 sequential gates

**Parallel Opportunities**:
- Iterations 002-007 were serial by design (JSONL state dependency); no parallelism was possible in the loop
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Actual |
|-----------|-------------|------------------|--------|
| M1 | Initial evidence sweep complete | Iteration 001 written; 8 findings; source map present | 2026-04-06 |
| M2 | Evidence extraction complete | Iterations 002-007 written; 29 raw findings; Q1-Q12 addressed | 2026-04-06 |
| M3 | Synthesis ready | Iteration 008 dry-run; consolidated ledger; blueprint | 2026-04-06 |
| M4 | Research deliverable complete | research.md written; 17 findings; 12 sections; 466 lines | 2026-04-06 |
| M5 | Phase complete | Spec docs + validation + memory save | Pending validation |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for ADR-001 through ADR-004. Key decisions are:

- **ADR-001**: Treat Reddit post as primary-source field report, not implementation spec
- **ADR-002**: Preserve source discrepancies explicitly (926-vs-858; 18,903-vs-11,357)
- **ADR-003**: Apply four-tier prioritization framework from phase-research-prompt §10.3
- **ADR-004**: Defer auditor implementation to phase 005-claudest
