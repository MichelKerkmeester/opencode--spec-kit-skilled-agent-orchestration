---
title: "Implementation Plan: 004-graphify Research Phase"
description: "20-iteration two-wave deep-research loop covering graphify plus Public rollout translation, with externalized JSONL state, reducer-managed registry, and post-synthesis memory save."
trigger_phrases:
  - "graphify research plan"
  - "004-graphify execution plan"
  - "deep-research loop graphify"
importance_tier: critical
contextType: plan
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]

---
# Implementation Plan: 004-graphify Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; Node.js reducer; Python under study |
| **Framework** | Spec Kit Memory deep-research loop (`sk-deep-research`) |
| **Storage** | JSONL state log + JSON config + markdown iteration files + memory artifacts |
| **Testing** | Spec Kit Memory `validate.sh --strict`; reducer schema enforcement |

### Overview

Run a 20-iteration two-wave deep-research loop. Wave 1 audits `external/graphify/` and establishes Adopt/Adapt/Reject guidance. Wave 2 reopens the completed packet in `completed-continue` mode and maps those findings onto Public's current payload contracts, runtime hints, bridge surfaces, incremental indexing, multimodal scope, clustering path, validation, metrics, and rollout sequencing. Externalized state in `research/deep-research-{config,state,strategy,dashboard,findings-registry}` survives crash and resume; reducer runs after each iteration or wave close to keep registry, dashboard, and machine-owned strategy sections in sync.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase research prompt exists at `scratch/phase-research-prompt.md` with 12 explicit research questions
- [x] Cross-phase awareness (002 codesight, 003 contextador) loaded into strategy.md `Known Context` section
- [x] cli-codex CLI installed (verified via `which codex`)
- [x] Reducer script reachable at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- [x] Memory script reachable at `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

### Definition of Done

- [x] All P0 requirements (REQ-001 through REQ-012) met
- [x] research.md contains at least 12 cited findings (delivered: 42 consolidated findings = K1 to K42)
- [x] Adopt/Adapt/Reject table line-grounded for every row
- [x] Memory artifact saved with `critical` importance tier and clean trigger phrases
- [x] `validate.sh --strict` returns RESULT: PASSED
- [x] checklist.md verification items all marked `[x]` with evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Externalized-state deep-research loop with leaf-agent dispatch per iteration. Fresh context per iteration plus append-only state log = no context degradation across runs.

### Key Components

- **Loop manager** (`/spec_kit:deep-research:auto`): runs phase_init -> phase_loop -> phase_synthesis -> phase_save
- **Leaf agent** (`@deep-research` via cli-codex or claude-opus-direct): executes one iteration, writes findings to file, exits
- **Reducer** (`reduce-state.cjs`): refreshes registry, dashboard, machine-owned strategy sections after each iteration
- **State files**: `deep-research-config.json` (immutable after init), `deep-research-state.jsonl` (append-only), `research/deep-research-strategy.md` (mutable), `findings-registry.json` (auto-generated), `research/deep-research-dashboard.md` (auto-generated)
- **Memory script** (`generate-context.js`): persists session context to `memory/*.md` after synthesis

### Data Flow

```
phase-research-prompt.md
        |
        v
phase_init: config.json + state.jsonl + strategy.md + findings-registry.json
        |
        v
phase_loop (x20):
  read_state -> check_convergence -> dispatch_iteration -> reduce_state -> evaluate_results -> generate_dashboard
        |
        v
phase_synthesis: research.md (17 sections + section 13.A + section 13.B) + convergence_complete event
        |
        v
phase_save: generate-context.js -> memory/*.md
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Phase prompt authored at `scratch/phase-research-prompt.md` with RICCE structure
- [x] Spec folder initialized at `.opencode/specs/.../004-graphify/`
- [x] Cross-phase awareness (002, 003) loaded into strategy.md
- [x] cli-codex CLI verified installed and reachable

### Phase 2: Core Implementation

- [x] **Iteration 1**: Pipeline architecture lock via `cli-codex gpt-5.4 high`. Read external/ARCHITECTURE.md, external/README.md, external/graphify/__main__.py. Map file inventory and 7-stage pipeline. 8 findings.
- [x] **Iteration 2**: AST extraction internals via `claude-opus-direct` (after iter 2 codex starvation - engine_switch event logged). Read `detect.py`, `extract.py` dispatch + Python extractor + cross-file `uses` inference. 10 findings.
- [x] **Iteration 3**: Semantic merge cache promotion via `claude-opus-direct`. Read external/skills/graphify/skill.md (650 lines), `cache.py`, `build.py`, `validate.py`, `export.py:240-275`. 12 findings.
- [x] **Iteration 4**: Clustering analyze report via `claude-opus-direct`. Read `cluster.py`, `analyze.py`, `report.py` end-to-end. 13 findings.
- [x] **Iteration 5**: Hooks cache rebuild via `claude-opus-direct`. Read `__main__.py`, `watch.py`, `hooks.py` end-to-end. 12 findings.
- [x] **Iteration 6**: Multimodal pipeline via `claude-opus-direct`. Read `ingest.py`, `security.py`; re-cite `detect.py` PDF logic and external/skills/graphify/skill.md image strategies. 11 findings.
- [x] **Iteration 7**: Benchmark credibility via `claude-opus-direct`. Read `benchmark.py`, validate against `external/worked/karpathy-repos/{README,GRAPH_REPORT,review}.md`. 12 findings. composite_converged decision logged at coverage 91.7%.
- [x] **Iteration 8** (cli-codex extension): Export + wiki + MCP serve surface via `cli-codex gpt-5.4 high`. Read `export.py` (954 lines), `wiki.py` (214 lines), `serve.py` (322 lines), `external/worked/mixed-corpus/GRAPH_REPORT.md`. 10 findings (K13 to K21).
- [x] **Iteration 9** (cli-codex extension): Build orchestration + cross-corpus validation via `cli-codex gpt-5.4 high`. Read `manifest.py`, `build.py`, `skill.md:236-400, 588-705`, `detect.py:216-274`, mixed-corpus + karpathy-repos worked corpora. 10 findings (K22 to K27).
- [x] **Iteration 10** (cli-codex extension): Per-language extractor inventory + final Q12 grounding via `cli-codex gpt-5.4 high`. Read per-language extractor bodies in `extract.py:301-2206`, dispatch table at `extract.py:2367-2505`, full `validate.py`. 12 findings (K28 to K32) plus comprehensive Adopt/Adapt/Reject table.
- [x] **Iterations 11-20** (completed-continue wave): Public-internal translation and rollout mapping. Covered payload contracts, runtime nudge placement, indexing and invalidation, multimodal scope, clustering path, validation extensions, architecture-native metrics, trust boundaries, bridge surfaces, and phased rollout guidance. Wrote `research/iterations/iteration-011.md` through `research/iterations/iteration-020.md`.

### Phase 3: Verification

- [x] Synthesis: `research/research.md` updated to include section 13.A (K13-K32) and section 13.B (K33-K42), expanded section 14, updated section 16 convergence report
- [x] Convergence final state: max_iterations_reached AND all_questions_answered (coverage 1.0, 22 of 22 questions)
- [x] config.status flipped from `initialized` to `complete`
- [x] Memory save via `generate-context.js` with structured JSON contract
- [x] HIGH severity quality issues (trigger_phrases path fragments) manually patched in memory file
- [x] `validate.sh --strict` passes with RESULT: PASSED
- [x] checklist.md: every item marked `[x]` with evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Schema validation | JSONL state log records, registry schema | Reducer schema check (rejects malformed delta) |
| Spec doc validation | Level 3 template headers, section counts, broken refs | `validate.sh --strict` |
| Memory quality | trigger_phrases, importance_tier, frontmatter | `generate-context.js` post-save quality review |
| Manual cross-check | Every K1 to K42 finding has a verifiable file:line citation | Read tool + Grep on cited lines |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-codex CLI 0.118 | External | Green | Fall back to claude-opus-direct (proven pattern from iters 2-7) |
| `gpt-5.4` model with `model_reasoning_effort=high` | External (OpenAI) | Green | Fall back to claude-opus-direct |
| `reduce-state.cjs` reducer | Internal | Green | Manual JSONL updates (slow but possible) |
| `generate-context.js` memory script | Internal | Green | Memory save would need a different mechanism |
| `validate.sh --strict` | Internal | Green | Cannot certify spec folder compliance |
| `external/graphify/` source files | External | Green (vendored under spec folder) | Cannot ground findings; halt research |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Research-only phase - no production code modified, so no rollback is required for source code. If the synthesis is invalidated by later evidence, the rollback is to revert `research/research.md` to the prior generation snapshot or to archive the entire `research/` packet under `research/archive/` and re-run the loop.
- **Procedure**:
  1. `git status` to confirm no production-code drift outside the spec folder.
  2. If research.md is wrong: `git checkout HEAD -- research/research.md` or restore from `research/archive/`.
  3. If memory artifact is wrong: delete the offending `memory/*.md` file and re-run `generate-context.js`.
  4. If iteration files are wrong: archive the iteration under `research/archive/iterations/`, append a `correction` event to JSONL, re-run the affected iteration with adjusted prompt.
  5. If the entire phase is wrong: archive `research/`, increment generation in config, restart phase.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Iterations 1-10) ──► Phase 3 (Verify)
Phase 1.5 (Cross-phase awareness) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Iterations |
| Cross-phase awareness | Setup | Iterations |
| Iterations 1-10 | Setup, Cross-phase awareness | Synthesis, Verification |
| Synthesis | Iterations 1-10 | Memory save, Verification |
| Verification | Synthesis, Memory save | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes (prompt authoring + cross-phase awareness load) |
| Iterations 1-7 baseline | Medium | ~3 hours wall clock (1x codex 4 min + 6x claude-opus-direct ~3 min each) |
| Iterations 8-10 cli-codex extension | Medium | ~25 minutes wall clock (3x cli-codex ~5 to 9 minutes each) |
| Synthesis | Medium | ~30 minutes (research.md updates + reducer + convergence event) |
| Verification | Low | ~15 minutes (validation, checklist marking, memory quality patch) |
| **Total** | | **~5 hours wall clock** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Backup created: prior research.md preserved before iter 8 to 10 extension via git history
- [x] Feature flag configured: N/A (research-only phase)
- [x] Monitoring alerts set: reducer schema mismatch logs `conflict` event in JSONL

### Rollback Procedure

1. Confirm no production-code drift outside `004-graphify/` via `git status`.
2. If any single iteration file is wrong: archive under `research/archive/iterations/`, append correction event, re-run that iteration only.
3. If research.md is wrong: `git checkout HEAD -- research/research.md` or restore from prior generation.
4. If memory file is wrong: delete the affected `memory/*.md`, fix the source data, re-run `generate-context.js`.
5. If the whole phase is wrong: increment `lineage.generation` in config, archive `research/` to `research/archive/gen-N/`, restart phase.

### Data Reversal

- **Has data migrations?** No. Research-only phase produces only markdown and JSON artifacts.
- **Reversal procedure**: Git checkout or directory archive only.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────────┐     ┌──────────────────┐     ┌───────────────┐
│   Phase 1       │────►│   Phase 2        │────►│   Phase 3     │
│   Setup +       │     │   10 Iterations  │     │   Synthesis + │
│   Cross-phase   │     │   (loop)         │     │   Verify      │
└─────────────────┘     └────────┬─────────┘     └───────────────┘
                                 │
                          ┌──────▼──────┐
                          │  Reducer    │
                          │  per iter   │
                          └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Phase prompt | None | `scratch/phase-research-prompt.md` | Iter 1 |
| Iter N | Iter N-1 reducer output | research/iterations/iteration-NNN.md, JSONL append | Iter N+1 |
| Reducer | Iter N output | Updated registry, dashboard, strategy machine-owned sections | Iter N+1 read_state |
| Synthesis | All 20 iterations + final reducer | `research/research.md` updates, synthesis_complete event | Memory save |
| Memory save | Synthesis | `memory/*.md` artifact | Final verification |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase prompt + setup** - 30 minutes - CRITICAL
2. **Iterations 1-7 baseline** - 3 hours - CRITICAL (each iter blocks the next)
3. **Iterations 8-10 cli-codex extension** - 25 minutes - CRITICAL (sequential, each blocks the next)
4. **Iterations 11-20 completed-continue wave** - 60 minutes - CRITICAL
5. **Synthesis** - 30 minutes - CRITICAL
6. **Memory save + validation** - 15 minutes - CRITICAL

**Total Critical Path**: ~6 hours wall clock

**Parallel Opportunities**:
- None within iterations (each iter must finish + reducer must run before the next iter starts)
- Parallel research across phases 002, 003, 004, 005 of `001-research-graph-context-systems` is possible at the parent packet level (each phase is independent)
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Phase setup complete | phase prompt authored, cross-phase awareness loaded | 2026-04-06 (done) |
| M2 | Iter 7 composite_converged | coverage >= 0.85, 11 of 12 questions answered | 2026-04-06 (done) |
| M3 | Iter 10 cli-codex extension complete | 32 cumulative findings (K1 to K32), 12 of 12 questions answered | 2026-04-06 (done) |
| M4 | Wave 2 completed-continue closeout | iter 20 complete, 22 of 22 questions answered, section 13.B drafted | 2026-04-08 (done) |
| M5 | Synthesis + memory save | research.md updated, memory artifact saved, config.status=complete | 2026-04-08 (done) |
| M6 | Verification | `validate.sh --strict` passes, checklist all `[x]` | 2026-04-08 (done) |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the four ADRs:
- **ADR-001**: Use cli-codex `gpt-5.4` high reasoning effort for primary research engine
- **ADR-002**: Switch engine to `claude-opus-direct` mid-loop after iter 2 codex starvation
- **ADR-003**: Override iter 7 composite_converged stop with 3 forced cli-codex iterations (8 to 10)
- **ADR-004**: Append cli-codex findings as section 13.A rather than rewriting K1 to K12

---

### L3: AI EXECUTION PROTOCOL

This section defines how an AI orchestrator (Claude Code, OpenCode, or any compatible runtime) should execute the research loop autonomously.

### Pre-Task Checklist

Before dispatching any iteration, verify:

- [ ] `research/deep-research-config.json` exists and `status` is `initialized` or `complete-resume`
- [ ] `research/deep-research-state.jsonl` is append-only and last record is consistent
- [ ] `research/deep-research-strategy.md` Next Focus is non-empty
- [ ] cli-codex CLI is reachable (`which codex`) OR claude-opus-direct fallback is available
- [ ] Tool call budget remaining: target 8, hard max 12
- [ ] No `research/.deep-research-pause` sentinel file
- [ ] Phase prompt has a unique focus area for this iteration

### Task Execution Rules

| Rule ID | Constraint | Enforcement |
|---------|------------|-------------|
| TASK-SEQ-001 | Iterations execute SEQUENTIALLY, never parallel | Reducer must run between iterations to update state |
| TASK-SCOPE-001 | Each iteration writes to exactly ONE iteration file | research/iterations/iteration-NNN.md write-once |
| TASK-SCOPE-002 | External repo `external/graphify/` is READ-ONLY | sandbox_mode workspace-write outside external/ only |
| TASK-SEQ-002 | Append iteration record to JSONL after iteration completes | One JSONL line per iteration with `type=iteration` |
| TASK-SEQ-003 | Run reducer after every iteration before the next dispatch | `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>` |
| TASK-SCOPE-003 | Findings must cite file:line evidence | `[SOURCE: external/graphify/...:LINE-LINE]` format |
| TASK-SEQ-004 | Convergence check before each iteration | composite_converged stop unless user override |

### Status Reporting Format

After each iteration, the orchestrator must report:

```
ITER N STATUS: complete | thought | error
FOCUS: <focus track>
FINDINGS: <count>
NEW INFO RATIO: <0.0-1.0>
ENGINE: <codex-cli | claude-opus-direct>
STOP DECISION: CONTINUE | STOP | STUCK_RECOVERY
NEXT FOCUS: <next focus or "TRANSITION TO SYNTHESIS">
```

### Blocked Task Protocol

When an iteration is BLOCKED (cannot make progress):

1. Append a JSONL event: `{"type":"event","event":"blocked","iteration":N,"reason":"<specific>","timestamp":"<ISO-8601>"}`
2. Set the iteration record status to `error` and findingsCount=0
3. If 3+ consecutive blocked iterations: halt loop and enter synthesis with partial findings
4. If unblockable: switch engine (cli-codex to claude-opus-direct or vice versa), log `engine_switch` event, retry once
5. Document the block in `research/research.md` Open Questions section so future readers can pick it up

---

<!--
LEVEL 3 PLAN
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records (see decision-record.md)
-->
