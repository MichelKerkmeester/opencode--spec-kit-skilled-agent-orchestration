---
title: "Phase 018 — Autonomous Execution Runbook"
version: 1
created: 2026-04-11T20:00:00Z
target_runtime: cli-codex gpt-5.4 high fast
scope: Implement + verify + test Gates A–E autonomously; Gate F runs as observation only
total_active_wall_clock: ~8–14 hours serial + 2-week D0 observation gap
---

# Phase 018 — Autonomous Execution Runbook

One-shot execution plan for Gates A through E of the phase 018 Canonical Continuity Refactor, using cli-codex gpt-5.4 high fast as the execution worker. Gate F is **partial** in one go — it only gets the observation-start step; its permanence decision requires 180 days of elapsed real-world time and comes back later.

## 1. Honest Scope

**Fully autonomous in one run**:
- Gate A pre-work (~1 wk of work → ~30-60 min Codex wall clock)
- Gate B foundation (~2 wk → ~60-120 min)
- Gate C writer ready (~2 wk → ~120-240 min, biggest)
- Gate D reader ready (~2 wk → ~90-180 min)
- Gate E runtime migration (~3 wk → ~60-120 min, big fanout but shallow edits)
- Gate F observation kickoff (~10 min setup)

**NOT possible in one run** (real-world time gates):
- Gate D `D0` 2-week observation window — starts when Gate C stable, runs unattended
- Gate E canonical flag stable ≥7 days — runs unattended
- Gate F 180-day `archived_hit_rate` window — started at Gate B, matures ~6 months later
- Gate F decision pass — requires human review of the EWMA trend at maturation time

**Total active wall clock**: ~8–14 hours of Codex execution. Plus the real-world observation windows which run in the background after the active session ends.

**Recommended execution mode**: split into two active sessions with observation windows between them:
- **Session 1 (Gates A → D writer + reader ready, D0 start)**: ~6–10 hours active
- **Observation gap 1**: D0 2-week window + Gate C dual-write stability
- **Session 2 (Gate E runtime flip + Gate F observation roll-forward)**: ~2–4 hours active
- **Observation gap 2**: Gate E canonical stability + remainder of Gate F 180-day window
- **Session 3 (Gate F decision, ~180 days out)**: ~1 hour active, human-in-the-loop for the retire/keep/investigate decision

The runbook below describes Session 1 + Session 2 in full. Session 3 is summarized at the end because it needs human judgment not automatable here.

---

## 2. Execution Architecture

### Worker model

Each gate is executed by **one orchestrating Codex session** launched via `cli-codex gpt-5.4 high fast --full-auto --sandbox workspace-write`. The Codex session reads the gate's pre-populated `spec.md / plan.md / tasks.md / checklist.md / decision-record.md` (already committed on the 026 branch as of commit `0c39fff10`) and executes the tasks serially, with internal parallelism for `[P]`-marked tasks.

### Dispatch pattern

```bash
cat /tmp/execute-<gate>-prompt.md | codex exec \
  --model gpt-5.4 \
  -c model_reasoning_effort="high" \
  -c service_tier="fast" \
  --full-auto \
  --sandbox workspace-write \
  - 2>&1 | tee /tmp/execute-<gate>.log
```

**One gate at a time.** Gates are serially dependent: A → B → C → D → E → F. Within a gate, tasks marked `[P]` can run in parallel via a single Codex session's internal parallelism. Do NOT fan out across gate agents in parallel — each gate needs the prior gate's artifacts in place to make real changes.

### Per-gate workflow (inside each Codex session)

1. **Preflight**:
   - Read the gate folder's spec/plan/tasks/checklist
   - Read cited research iterations + resource-map rows
   - Read the parent packet `implementation-design.md` + `resource-map.md`
   - Read parent packet `research/iterations/iteration-028.md` for the gate's DAG + critical path
   - Confirm entry gate criteria (prior gate closed + artifacts present)

2. **Execute tasks in order**:
   - For each task T00N in `tasks.md`, do the actual code/file edit
   - For `[P]` tasks, run them internally in parallel where safe
   - After each significant edit, run targeted tests/validators
   - Commit per logical unit (typically per-task or per-phase-1/2/3 block)

3. **Per-task verification**:
   - Syntax check the edited file (tsc for TS, shell -n for bash, etc.)
   - If the task touched code, run the relevant unit tests
   - If the task touched a template, run `validate.sh --strict` on the template
   - If the task touched a spec doc, run `validate.sh --strict` on the target packet

4. **Exit gate check**:
   - Run the full `checklist.md` verification set
   - Confirm every P0 checklist item is `[x]`
   - Run `validate.sh --strict` on the gate's own packet folder → must pass
   - Run regression-relevant test files (per gate — see §5 Testing Strategy)
   - Update `implementation-summary.md` with real evidence (replace TBD placeholders)

5. **Gate handover**:
   - Git commit with `feat(026.018.00N-gate-X): ...` prefix
   - Git push to `system-speckit/026-graph-and-context-optimization`
   - Log final status + next gate entry criteria
   - Exit Codex session; orchestrator launches next gate

### Safety rails

- **Git rollback**: if a gate fails, `git reset --hard` to the commit before that gate and stop. Do NOT auto-retry a failed gate — it needs human review.
- **Scope lock**: each gate agent only edits files listed in its own `spec.md §3 Files to Change` + the target packet folder. Refuse work outside that set.
- **No amend, no force-push**: always create new commits.
- **No skip hooks**: pre-commit hooks must pass.
- **Checkpoint per gate**: Git commit is the per-gate checkpoint. If Codex crashes mid-gate, restart that gate from scratch (it re-reads the commit state and continues from the last committed point).

---

## 3. Session 1 — Gates A through D + D0 Start

### Gate A — Pre-work (~30–60 min)

**Entry**: commit `0c39fff10` present on 026 branch (phase 018 spec folders committed + reviewed + P1s fixed). No code changes yet.

**Prompt file**: `/tmp/execute-gate-a-prompt.md`

Content:
```
# Execute Gate A — Pre-work

Target packet: `018-canonical-continuity-refactor/001-gate-a-prework/`

Read the packet's spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md.
Read parent packet files: implementation-design.md, resource-map.md §4 Gate A, scratch/resource-map/04-templates.md.
Read research iterations: 016, 020, 022, 028.

Execute tasks T001 → T021 in order. Use `[P]` markers to run parallel where safe.

Specifically:
- Fix anchor bugs in templates/level_3/spec.md and level_3+/spec.md (orphan metadata closers)
- Add baseline anchors to templates/level_{1,2,3,3+}/handover.md, research.md, debug-delegation.md
- Add exclusion rule for changelog/* and sharded/* in validate.sh (or equivalent validator)
- Audit the ~5 root packets lacking canonical implementation-summary.md — identify + backfill via human review or deterministic generation
- sqlite3 memory.db .backup memory-018-pre.db (confirm backup file exists)
- Rehearse restore on a copy + verify rollback
- Run memory_context({ mode: "resume" }) warmup + confirm <5s
- Document inline-migration convention choice in vector-index-schema.ts OR create mcp_server/database/migrations/ directory

After every task, run `validate.sh --strict` on the affected template folder.

Exit gate: checklist.md P0 items all [x], validate.sh --strict PASSED on templates, backup restorable.

Commit with: feat(026.018.001-gate-a-prework): ... per task.
Push at gate close.

Update implementation-summary.md with real evidence (commits, file paths, validator output).
```

**Verification after Gate A**:
- All template anchor bugs fixed (validate.sh passes on every level's filled example)
- 5 root packet backfills committed
- `memory-018-pre.db` exists + restore drill passed
- Embedding warmup <5s confirmed
- Rollback script tested on copy

### Gate B — Foundation (~60–120 min)

**Entry**: Gate A closed + committed + pushed. Backup file exists.

**Prompt file**: `/tmp/execute-gate-b-prompt.md`

Content:
```
# Execute Gate B — Foundation

Target packet: `018-canonical-continuity-refactor/002-gate-b-foundation/`

Read packet files + parent: implementation-design.md, resource-map.md §4 Gate B, scratch/resource-map/01-schema.md.
Read research iterations: 010, 016, 020, 027, 028, 035, 036, 037.

Execute tasks T001 → T020 in order.

Specifically:
- Run iter 037 migration dry-run pipeline on a copy of memory.db. Capture JSON evidence.
- Rehearse rollback drill on the copy. Must pass before touching prod.
- ALTER TABLE causal_edges ADD COLUMN source_anchor TEXT + target_anchor TEXT + 2 indexes in vector-index-schema.ts
- UPDATE memory_index SET is_archived=1 WHERE source_path LIKE '%/memory/%.md' (155 rows, one-way door — do this only after rehearsal proof)
- Thread anchor columns through causal-edges.ts, checkpoints.ts, reconsolidation.ts
- Update ranking in lib/search/pipeline/stage2-fusion.ts: archived × 0.3
- Expose archived_hit_rate in handlers/memory-crud-stats.ts (per resource-map §1)
- Verify schema-downgrade.ts mirror consistency or document exclusion

Validate: row counts preserved, is_archived flipped (exactly 155), ranking live, metric visible.

Run the 2-hop BFS causal graph tests to confirm the schema change didn't break causal traversal.

Exit gate: checklist.md P0 items all [x], validate.sh --strict PASSED, 155 rows archived, metric visible.

Commit per task. Push at gate close.
Update implementation-summary.md with rehearsal evidence JSON + row counts + migration timestamps.
```

**Verification after Gate B**:
- Schema migration completed on production DB (not a copy)
- 155 memory rows archived
- Causal graph traversal tests green
- Rollback script verified

### Gate C — Writer Ready (~120–240 min, biggest)

**Entry**: Gate B closed. Schema in place. Archive flipped. Ranking updated.

**Prompt file**: `/tmp/execute-gate-c-prompt.md`

Content:
```
# Execute Gate C — Writer Ready

Target packet: `018-canonical-continuity-refactor/003-gate-c-writer-ready/` (L3+, largest gate)

Read packet files + parent: implementation-design.md, resource-map.md §3 P0/P1 table, scratch/resource-map/02-handlers.md (16-stage pipeline matrix), scratch/resource-map/03-scripts.md (generator refactor), scratch/resource-map/04-templates.md (_memory.continuity schema).
Read research iterations: 001, 002, 003, 004, 005, 021, 022, 023, 024, 029, 031, 032, 033, 034, 038.

Execute tasks T001 → T013 in order. T002, T003, T004b are [P]-parallelizable.

Specifically:

**Phase 1 — Contract freeze (T001)**:
- Build mcp_server/lib/validation/spec-doc-structure.ts with 5 new rules (FRONTMATTER_MEMORY_BLOCK, MERGE_LEGALITY, SPEC_DOC_SUFFICIENCY, CROSS_ANCHOR_CONTAMINATION, POST_SAVE_FINGERPRINT)
- Wire rule aliases into scripts/spec/validate.sh
- Add unit tests. Freeze iter 022/024 failure-code contract.

**Phase 2 — Writer core (T002, T003, T004, T004b in parallel, then T005)**:
- T002 [P]: contentRouter (Tier 1 rules + Tier 2 prototype similarity from iter 021 + Tier 3 LLM strict JSON fallback from iter 031)
- T003 [P]: anchorMergeOperation (5 merge modes from iter 023 pseudocode; model after scripts/spec-folder/nested-changelog.ts read-transform-write pattern)
- T004: atomicIndexMemory (drop-in replacement for atomicSaveMemory; reuse withSpecFolderLock at memory-save.ts L1569 unchanged)
- T004b [P]: thinContinuityRecord (typed reader/writer for _memory.continuity YAML sub-block, 14-field schema, 2048-byte budget per iter 005/024)
- T005: Rewrite memory-save.ts (XL ~1799 LOC). Keep 8 pass-through stages unchanged. Adapt 6 stages. Rewrite 2 stages (template contract, atomic save). Preserve withSpecFolderLock.

**Phase 3 — Generator + templates (T006-T010)**:
- T006: Refactor scripts/memory/generate-context.ts to use the new routed writer path
- T007 [P]: Add _memory.continuity block to all 30 level templates (templates/level_{1,2,3,3+}/*.md)
- T008 [P]: Update mcp_server/handlers/save/types.ts with AtomicIndex* types
- T009 [P]: Adapt save helpers + schemas + memory-triggers (full list in tasks.md T009)
- T010: Activate S1 shadow_only feature flag (iter 034 state machine) — writer paths dual-write to shadow log only

**Phase 4 — Verification (T011-T013)**:
- T011: Execute the 243-test catalog (routing 120, merge 50, validator 25, resume 10, integration 25, regression 13) per iter 029
- T012: Prove ≥95% golden-set parity + zero fingerprint rollback + 7-day shadow stability window
- T013 + T012b: Multi-agent governance sign-off recorded, schema hash re-verified

Commit per task. Run targeted tests after each module builds. Run full 243-test suite at Phase 4.

Exit gate: all 13 tasks marked [x], validate.sh --strict PASSED on packet and on a sample level_3 filled template, shadow-compare ≥95% parity, dual-write shadow stable ≥7 days (if the 7-day clock hasn't elapsed, flag as "Gate C-Pending-Observation" and let Gate D start its own work on parallel non-dependent files, then revisit when stable).

Update implementation-summary.md with commits, test results, shadow-compare evidence, ADR-001 finalization.
Push at gate close.
```

**Verification after Gate C**:
- 4 new modules exist and tested
- `memory-save.ts` rewritten, passes regression
- Dual-write shadow active (S1 state)
- 243-test catalog green
- Shadow-compare ≥95% parity on golden set

**Dependency on 7-day shadow stability**: if the 7-day clock hasn't elapsed when Gate C otherwise completes, let Gate D start its work on **non-dependent** files (reader handlers that don't rely on writer stability proof) while the clock runs underneath. When 7 days elapsed, finalize Gate C close.

### Gate D — Reader Ready (~90–180 min active + 2-week D0 observation)

**Entry**: Gate C closed. Dual-write shadow stable ≥7 days. Writer path proven.

**Prompt file**: `/tmp/execute-gate-d-prompt.md`

Content:
```
# Execute Gate D — Reader Ready

Target packet: `018-canonical-continuity-refactor/004-gate-d-reader-ready/`

Read packet files + parent: implementation-design.md, resource-map.md §3 P0 reader rows, scratch/resource-map/02-handlers.md.
Read research iterations: 013, 017, 018, 025, 027, 029, 039.

Execute tasks T001 → T014 in order. T003/T005/T006/T007/T008 are [P].

Specifically:

**Phase 1 — Start D0 observation + build resumeLadder (T001, T001b, T002)**:
- T001: Kick off D0 2-week archived observation window (runs in parallel with the rest of Gate D)
- T001b: Confirm Gate C dual-write shadow still stable (sanity check)
- T002: Create mcp_server/lib/resume/resume-ladder.ts helper per ADR-001

**Phase 2 — Retarget readers (T003-T008)**:
- T003 [P]: Restructure handlers/memory-search.ts (L restructure, keep 4-stage pipeline, retarget source assumptions to spec_doc + continuity fallback, add is_archived filter)
- T004: Restructure handlers/memory-context.ts (L restructure, retarget resume mode to new ladder)
- T005 [P]: Rewrite handlers/session-resume.ts (L rewrite, use resumeLadder helper: handover → continuity → spec docs → archived)
- T006 [P]: Restructure handlers/session-bootstrap.ts (M, follow session-resume retarget)
- T007 [P]: Restructure handlers/memory-index-discovery.ts (M, promote spec docs, demote memory/ to archive-only)
- T008 [P]: Update handlers/memory-triggers.ts (M, retarget trigger source from memory-file frontmatter to spec-doc frontmatter trigger_phrases field)

**Phase 3 — Verification (T009-T014)**:
- T009: Run 13-feature regression suite from iter 025 scenarios — merge-blocking
- T010: Run perf benchmarks: resume p95 <500ms (target 300ms happy path), search p95 <300ms, trigger match p95 <10ms
- T011: Stress test concurrent writes via fingerprint forensics per iter 039 circuit breaker
- T012: Fingerprint post-save verification passes on sample saves
- T013: archived_hit_rate <15% during live observation
- T014: Close D0 observation at 2-week mark (may land AFTER the rest of Gate D — that's expected)

Commit per task. Run perf benchmarks at Phase 3.

Exit gate: 4 reader handlers restructured, resume p95 <500ms verified, search p95 <300ms verified, 13-feature regression green, archived_hit_rate <15% for D0 duration.

Update implementation-summary.md with perf numbers, regression results, resume ladder test evidence.
Push at gate close.
```

**Verification after Gate D**:
- Resume p95 <500ms verified via iter 027 instrumentation
- Search p95 <300ms verified
- 13-feature regression green
- `archived_hit_rate` <15% during D0 window

**Observation gap**: at end of Session 1, the orchestrator enters standby. The D0 window runs unattended for ~2 weeks. During that time, background monitoring (dashboards from iter 033) alerts on any regression.

---

## 4. Session 2 — Gate E + Gate F Observation Handoff

**Entry to Session 2**: Session 1 committed and pushed. D0 window elapsed. Dual-write shadow stable. No auto-rollback alarms fired.

### Gate E — Runtime Migration (~60–120 min active + 7-day canonical stability)

**Prompt file**: `/tmp/execute-gate-e-prompt.md`

Content:
```
# Execute Gate E — Runtime Migration

Target packet: `018-canonical-continuity-refactor/005-gate-e-runtime-migration/`

Read packet files + parent: implementation-design.md, resource-map.md §8 gap coverage, scratch/resource-map/05-commands-agents-docs.md, scratch/resource-map/06-skill-surface-exhaustive.md, scratch/resource-map/07-sub-readmes.md.
Read research iterations: 014, 018, 020, 030, 034 (state machine), 040.

Execute tasks T001 → T014 in order.

Specifically:

**Week 1 equivalent (active) — state transitions**:
- T001: Verify Gate D closed + D0 clean + feature flag currently at S1 shadow_only
- T002: Transition S1 → dual_write_10pct. Observe 24h via dashboards (iter 033 alert thresholds).
- T003: Transition → dual_write_50pct. Observe 24h.
- T004: Transition → dual_write_100pct. Observe 48h.
- T005: Transition → canonical (new path is default, legacy path runs read-only as verification)

**Week 2-3 equivalent (parallel fanout) — documentation sync**:
- T006 [P]: Update .opencode/command/memory/{save,search,manage,learn}.md
- T007 [P]: Update .opencode/command/spec_kit/{resume,handover,plan,implement,complete,deep-research,deep-review}.md
- T008 [P]: Update .opencode/command/spec_kit/assets/*.yaml workflow YAMLs
- T009 [P]: Update .opencode/agent/{context,speckit,orchestrate,handover,deep-research,deep-review,ultra-think}.md
- T010 [P]: Update 8 CLI handback files (cli-{claude-code,codex,copilot,gemini}/SKILL.md + assets/prompt_templates.md) in lockstep with generate-context.js contract
- T011 [P]: Update 4 referencing skills (sk-deep-research, sk-deep-review, sk-doc, sk-git) + system-spec-kit/SKILL.md
- T012 [P]: Update top-level docs (CLAUDE.md, AGENTS.md, README.md, ARCHITECTURE.md, mcp_server/README.md, mcp_server/INSTALL_GUIDE.md)
- T013 [P]: Update 19 memory-relevant sub-READMEs from resource-map §8.5
- T013b [P]: Touch 92 doc-parity-only sub-READMEs for terminology
- T012b: Re-verify CLI batch against frozen generate-context.js schema hash before closeout

**Stability window (active)**:
- T014: Hold canonical state for ≥7 days. Auto-rollback rules from iter 034 §4 must stay quiet.

Commit per task. Parallel doc updates can land in batched commits.

Exit gate: feature flag in canonical state ≥7 days, all 160+ doc/command/agent/skill files updated, CLI handback files consistent with generate-context.js, metrics healthy per iter 033 alert thresholds.

Update implementation-summary.md with state-machine transition log + final metrics report.
Push at gate close.
```

**Verification after Gate E**:
- Canonical flag stable ≥7 days
- Zero auto-rollback alarms
- All 160+ doc/cmd/agent/skill files updated
- CLI handback protocol consistent

### Gate F — Observation Only (~10 min setup in Session 2)

**Prompt file**: `/tmp/execute-gate-f-setup-prompt.md`

Content:
```
# Execute Gate F — Observation Kickoff Only (Session 2)

Target packet: `018-canonical-continuity-refactor/006-gate-f-archive-permanence/`

The 180-day observation window STARTED at Gate B archive flip, so by Session 2 time it's already running. This step is just setup for the eventual decision pass:

1. Verify archived_hit_rate metric is recording daily values in the database
2. Confirm the EWMA α=0.1 + weekly seasonality calculator from iter 036 can be invoked
3. Confirm the retirement script stub exists at scripts/memory/018-006-gate-f-retirement.ts (it's in the tasks list but only activates if the Day-180 decision is RETIRE)
4. Generate a baseline trend chart from data collected so far

Do NOT make the permanence decision in Session 2. That requires 180 days of data and comes in Session 3.

Update implementation-summary.md with observation-setup evidence.
Commit + push.
```

---

## 5. Testing Strategy

### Per-gate test runs

| Gate | Active tests |
|:-:|---|
| **A** | `validate.sh --strict` on all level templates; backup/restore drill on memory.db copy |
| **B** | Schema validation queries (row counts, constraint checks); 2-hop BFS causal graph tests on mixed pre/post migration edges; rollback drill on copy |
| **C** | 243-test catalog (iter 029): 120 contentRouter + 50 anchorMergeOperation + 15 spec-doc-structure + 10 continuity validator + 10 resumeLadder contract + 25 integration + 13 regression. Shadow-compare equivalence on golden set. Unit coverage ≥80% per new module. |
| **D** | 13-feature regression suite (iter 025) — merge-blocking. Perf benchmarks (iter 027): resume p95 <500ms, search p95 <300ms, trigger match p95 <10ms. Fingerprint forensics (iter 039) stress test. |
| **E** | Shadow-compare delta check at each transition (iter 032). Alert threshold validation (iter 033 + iter 034 §4). Feature flag state machine integration test. |
| **F** | Observation metric sanity check only. |

### Full regression at end of Session 2

After Gate E closes and canonical is stable:
- Run the full `mcp_server/tests/*.vitest.ts` suite
- Run `scripts/tests/memory-quality-phase*.test.ts` if they exist
- Run `validate.sh --strict` on the entire `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/018-canonical-continuity-refactor/` tree
- Confirm zero errors across all 6 gate packets
- Push a final commit with full regression evidence

### Merge blocking

13-feature regression (iter 025) and the 243-test catalog (iter 029) are merge-blocking. If any test fails, the orchestrator stops that gate and surfaces the failure to human review.

---

## 6. Rollback Playbook

### Per-gate rollback

- **Gate A**: `git reset --hard HEAD~N` to pre-Gate-A commit. Restore template anchor bugs. No schema impact.
- **Gate B**: `sqlite3 memory.db .restore memory-018-pre.db` (from Gate A backup). Then `git reset --hard` to pre-Gate-B commit. Hard stop; 1-hour maintenance window.
- **Gate C**: Feature flag auto-rollback on shadow divergence >threshold. Code rollback via `git reset --hard`. Schema remains intact (Gate B artifacts stay).
- **Gate D**: Feature flag auto-rollback on perf regression >20%. Code rollback via git. Reader handlers revert to the prior behavior.
- **Gate E**: Feature flag state machine rollback per iter 034 incident playbook. Automatic path back to `canonical → dual_write_100pct → ... → shadow_only` depending on trigger severity.
- **Gate F**: Retire decision is one-way; keep + investigate are reversible. The retirement script at `scripts/memory/018-006-gate-f-retirement.ts` is only run after human approval.

### Orchestrator rollback rules

1. If any gate's `validate.sh --strict` fails with errors after Codex claims completion → halt, human review required.
2. If any perf benchmark regression exceeds threshold → halt, human review.
3. If Codex crashes mid-gate or exits non-zero → halt, human review. Do NOT auto-retry.
4. If shadow-compare divergence >5% at any check → halt, trigger feature-flag auto-rollback.
5. If fingerprint mismatch count >0 in iter 039 circuit breaker → halt, preserve pending to scratch.

**Human review means**: stop autonomous execution, surface error to orchestrator log, require explicit approval before resuming. Do not attempt to fix-forward without review.

---

## 7. Orchestrator Script (Session 1 Pseudocode)

The outer orchestrator (Claude Code, or a shell script) does this:

```bash
#!/bin/bash
set -euo pipefail
PACKET=018-canonical-continuity-refactor
BRANCH=system-speckit/026-graph-and-context-optimization

# Preflight
git fetch origin
git checkout "$BRANCH"
git pull --ff-only

# Verify starting commit
[[ "$(git rev-parse HEAD)" == "0c39fff10" ]] || { echo "starting commit mismatch"; exit 1; }

# Run each gate sequentially
for gate in 001-gate-a-prework 002-gate-b-foundation 003-gate-c-writer-ready 004-gate-d-reader-ready; do
  echo "=== Starting $gate ==="
  cat "/tmp/execute-$gate-prompt.md" | codex exec \
    --model gpt-5.4 \
    -c model_reasoning_effort="high" \
    -c service_tier="fast" \
    --full-auto \
    --sandbox workspace-write \
    - 2>&1 | tee "/tmp/execute-$gate.log"

  # Verify exit code
  [[ ${PIPESTATUS[1]} -eq 0 ]] || { echo "$gate failed"; exit 2; }

  # Verify commit landed
  git log -1 --format=%s | grep -q "$gate" || { echo "$gate commit missing"; exit 3; }

  # Strict validate
  bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict \
    ".opencode/specs/system-spec-kit/026-graph-and-context-optimization/$PACKET/$gate" \
    | tee "/tmp/validate-$gate.log"

  echo "=== $gate closed ==="
done

echo "Session 1 complete. D0 observation window started. Pause until ~2 weeks elapsed + dual-write stable."
```

Session 2 is similar but runs only `005-gate-e-runtime-migration` + the Gate F setup step.

---

## 8. Monitoring + Dashboards During Autonomous Execution

Per iter 033 instrumentation spec, the orchestrator relies on these live metrics:

- **Write path**: `save.router.classify.duration`, `save.merge.apply.duration`, `save.fingerprint.verify.ok/fail`, `save.retry.count`, `save.retry.pattern`
- **Read path**: `search.p95.duration`, `resume.path.p95.duration`, `trigger_match.p95.duration`
- **Shadow-compare**: `shadow.compare.parity_rate.per_class`, `shadow.compare.divergence_rate`
- **Feature flag**: `feature_flag.state.current`, `feature_flag.transition.count`, `feature_flag.auto_rollback.fire_count`
- **Migration**: `archived_hit_rate` (daily EWMA), `causal_edges.row_count`, `memory_index.is_archived.count`
- **Validator**: `validator.rollback.fingerprint` rate, `spec_doc_structure.rule_fire` per rule

**Alert thresholds** (iter 034 §4): any of these triggers auto-rollback:
- `resume.path.total p95 > 1000ms` → S5 → S4
- `validator.rollback.fingerprint != 0` → S5 → S1 (hard rollback)
- `search.shadow.diff > 3%` → S5 → S4

The orchestrator must honor these thresholds and stop autonomous execution on trigger.

---

## 9. What Session 3 Looks Like (~180 days later)

**Human-in-the-loop only**. Codex can prep the evidence package but the decision is human-approved.

1. Pull 180 days of `archived_hit_rate` daily values
2. Compute EWMA per iter 036 rulebook (α=0.1, weekly seasonality, variance check)
3. Classify: RETIRE / KEEP / INVESTIGATE / ESCALATE
4. Generate evidence package (90-day trend chart, query class breakdown, top 20 archive-only queries, cost estimate)
5. Human reviews, approves the decision
6. If RETIRE: run retirement script, verify archived tier stops serving, prepare phase 021 Option F spec
7. If KEEP or INVESTIGATE: document rationale, close Gate F

---

## 10. Open Questions & Assumptions

### Assumptions

1. **Codex gpt-5.4 high fast is capable of XL rewrites**: the Gate C `memory-save.ts` rewrite is 1799 LOC. Precedent: gen 2 research iterations handled similar-scale work. Risk: if Codex tokens-out or stalls mid-rewrite, the orchestrator will see a stall and halt.
2. **Test suite exists and is runnable**: the 243-test catalog from iter 029 is a *catalog*, not actual test code. Gate C must build the tests from the catalog before running them. Add ~60 min to Gate C for this.
3. **Golden set exists for shadow-compare**: iter 032 defines the equivalence metric but doesn't specify the golden-set fixture. Gate C must build the fixture (add ~30 min).
4. **No parallel-track conflicts**: the 042 lane (sk-deep-review remediation) is on the same branch but targets different files. Watch for merge conflicts when Session 1 starts.

### Open questions

1. **Session 1 duration tolerance**: if Gate C takes 4 hours instead of 2, is that OK? (Yes — no hard upper bound until Codex rate-limits.)
2. **Test creation from catalog**: should Gate C build the tests as part of its own scope, or should that be pre-work in Gate A? (Recommend: Gate C builds them, since they need the implementation to exist first.)
3. **Shadow golden set**: same question — build it in Gate C prep or as a Gate B side-task? (Recommend: Gate C prep.)
4. **Parallel feature-flag rollout in Gate E**: iter 034 state machine runs serially (10→50→100→canonical). Not parallelizable. Real wall clock: 24h + 24h + 48h + 7d = ~10 days minimum. Session 2's "~60-120 min active" is the code work, but the observation gates gate the real-world duration. Orchestrator must respect these windows.
5. **D0 observation automation**: a 2-week window cannot be accelerated. Orchestrator must enter standby mode and resume on wake.

### Hard "can't automate" items

- 2-week D0 observation window (real-world time)
- 7-day canonical stability window (real-world time)
- 180-day Gate F observation (real-world time)
- Gate F retire/keep/investigate decision (human judgment)
- Root packet backfill human review step in Gate A (content quality review)

---

## 11. Handover to the Orchestrator

To start autonomous execution:

1. Verify commit `0c39fff10` is the HEAD of `system-speckit/026-graph-and-context-optimization`
2. Write the 6 prompt files to `/tmp/execute-<gate>-prompt.md` (using the content blocks above as templates, tailored to each gate's actual tasks.md contents at execution time)
3. Run the Session 1 orchestrator script
4. Wait for Session 1 completion + D0 observation gap
5. Run the Session 2 orchestrator script
6. Wait for real-world observation windows
7. Run Session 3 (human-in-the-loop) when 180 days have elapsed

**Estimated total autonomous time**: 8–14 hours of Codex active execution across 2 sessions. Real-world time including observation gaps: ~6 months from Session 1 kickoff to Gate F close.

**Recommended first step**: run Session 1 in a dev/staging environment first with a throwaway DB copy to validate the orchestrator script end-to-end before touching production memory.db.
