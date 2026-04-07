---
title: "Implementation Plan: 002-codesight Research Phase"
description: "10-iteration deep-research loop dispatched against the codesight external Node.js/TypeScript skill via cli-codex gpt-5.4 high engine, externalized JSONL state, reducer-managed registry, and post-synthesis memory save."
trigger_phrases:
  - "002-codesight research plan"
  - "002-codesight execution plan"
  - "deep-research loop codesight"
importance_tier: critical
contextType: plan
---
# Implementation Plan: 002-codesight Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; Node.js reducer; Node.js/TypeScript under study |
| **Framework** | Spec Kit Memory deep-research loop (`sk-deep-research`) |
| **Storage** | JSONL state log + JSON config + markdown iteration files + memory artifacts |
| **Testing** | Spec Kit Memory `validate.sh --strict`; reducer schema enforcement |

### Overview

Run a 10-iteration deep-research loop against `external/` to translate codesight's zero-dependency AST extraction, framework/ORM detector architecture, MCP tool design, per-tool profile generation, and blast-radius analysis patterns into Public-actionable Adopt/Adapt/Reject recommendations. Iterations 1-3 dispatched cleanly through `cli-codex gpt-5.4 high`; iterations 4-5 fell back to native Read/Grep after the codex CLI stalled in S sleep state for 20-50 minutes (likely API throttling from concurrent codex traffic). After original-charter convergence, the user requested 5 more iterations (6-10) targeting unexplored modules; all 5 were dispatched in parallel as background processes via cli-codex. The read-only sandbox blocked direct writes to `/tmp`, so the orchestrator (Claude Opus 4.6) extracted the assembled reports from the codex `-o` last-message captures or stdout reasoning traces and reconstructed iteration files verbatim. Externalized state in `research/deep-research-{config,state,strategy,dashboard,findings-registry}` survives crash and resume; reducer runs after every iteration to keep registry, dashboard, and machine-owned strategy sections in sync.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase research prompt exists at `scratch/phase-research-prompt.md` with 12 explicit research questions
- [x] Cross-phase awareness (003 contextador, 004 graphify) loaded into strategy.md `Known Context` section
- [x] cli-codex CLI installed (verified via `codex --version` → `codex-cli 0.118.0`)
- [x] Reducer script reachable at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- [x] Memory script reachable at `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

### Definition of Done

- [x] All P0 requirements (REQ-001 through REQ-010) met
- [x] All P1 requirements (REQ-011, REQ-012) met via continuation charter
- [x] research.md contains at least 12 cited findings (delivered: 52 = 26 from iters 1-5 + 26 from iters 6-10)
- [x] Adopt/Adapt/Reject decision matrix line-grounded for every row (delivered: 22 rows in §18.3)
- [x] Memory artifact saved with `critical` importance tier and clean trigger phrases
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md) created and consistent
- [x] `validate.sh --strict` returns RESULT: PASSED

---

<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Data Flow

```
phase-research-prompt.md (TIDD-EC contract)
        |
        v
deep-research-config.json (immutable, status=complete)
        |
        v
deep-research-state.jsonl (append-only)  <----+
        |                                      |
        v                                      |
cli-codex iteration N (background)             |
   --model gpt-5.4                             |
   -c model_reasoning_effort=high              |
   --sandbox read-only                         |
   -o /tmp/codex-iter-NNN-output.md            |
        |                                      |
        v                                      |
[sandbox blocks /tmp write?] -- yes --> orchestrator extracts from
        |                              -o capture or stdout reasoning trace
        | no                                   |
        v                                      |
/tmp/codex-iter-NNN-output.md                  |
        |                                      |
        +----> research/iterations/iteration-001.md ----+
                            |
                            v
                  reduce-state.cjs (reducer)
                            |
                            +--> findings-registry.json
                            +--> research/deep-research-dashboard.md
                            +--> strategy.md (machine-owned sections 7-11)
        ...
        |
        v
research/research.md (synthesis + §18 continuation)
        |
        v
generate-context.js -> memory/<dated-summary>.md + metadata.json
```

### State File Boundaries

| File | Owner | Mutability |
|------|-------|-----------|
| `deep-research-config.json` | orchestrator | immutable after init |
| `deep-research-state.jsonl` | orchestrator | append-only |
| `research/deep-research-strategy.md` | mixed | analyst sections (1-6, 12-13) + reducer-owned sections (7-11) |
| `research/deep-research-dashboard.md` | reducer | auto-generated |
| `findings-registry.json` | reducer | auto-generated |
| `research/research.md` | orchestrator | mutable synthesis output |
| `research/iterations/iteration-001.md` | per-iteration agent | write-once |

---

<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup and original charter (iters 1-5)
1. Author phase research prompt with TIDD-EC structure.
2. Initialize deep-research state files via the deep-research workflow.
3. Iteration 1: index.ts execution + zero-dep loader (Q1, Q5).
4. Iteration 2: Hono + NestJS routes + Drizzle schema (Q2, Q3, Q4-partial).
5. Iteration 3: graph + blast-radius + 8 MCP tools (Q6, Q7, Q9).
6. Iteration 4: profile generators + benchmark validation (Q8, Q10).
7. Iteration 5: static vs query-time + cross-phase scoping (Q11, Q12, Q4-confirmed).
8. Compile original-charter synthesis (research.md sections 1-17).

### Phase 2: Continuation charter (iters 6-10)
1. Read prior iterations to understand coverage; pick 5 unexplored modules for Q13-Q17.
2. Author 5 codex prompt files at `/tmp/codex-iter-{006..010}-prompt.md`.
3. Dispatch all 5 codex iterations in parallel as background processes.
4. Process completion notifications; for each iteration:
   - If `-o` last-message capture contains the full report → use directly.
   - If sandbox blocked the write → extract assembled report from stdout reasoning trace.
   - Write `research/iterations/iteration-001.md` with template + sandbox note.
   - Append iteration record to `deep-research-state.jsonl`.

### Phase 3: Continuation synthesis
1. Append `research/research.md` §18 with continuation charter, new findings summary, and 22-row updated decision matrix.
2. Update strategy.md to mark Q1-Q17 answered; refresh NEXT FOCUS to "SESSION COMPLETE".
3. Append `continuation_synthesis_complete` event to state.jsonl.
4. Run reducer to refresh dashboard + findings-registry.

### Phase 4: Memory save and verification
1. Compose structured JSON for `generate-context.js` with session summary, files modified, key decisions, trigger phrases, importance_tier=critical, next steps.
2. Run `generate-context.js` with project-relative spec folder path.
3. Patch HIGH severity quality issues (replace path-fragment trigger phrases).
4. Create spec.md, plan.md, tasks.md, implementation-summary.md to satisfy validator Level 3 requirements.
5. Run `validate.sh --strict` and confirm RESULT: PASSED.

---

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a research-only phase, so the "testing" surface is documentation and validator compliance:

- **Validator gate**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` must return RESULT: PASSED.
- **Anchor integrity**: All anchor open and close pairs in research.md and strategy.md must balance.
- **Frontmatter validity**: All spec docs must have `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` fields.
- **Memory quality**: `generate-context.js` post-save review must report no HIGH severity issues; MEDIUM issues should be patched when practical.
- **Reducer schema**: `reduce-state.cjs` must complete without schema errors and report `iterationsCompleted` matching the actual count.
- **Semantic indexing**: The saved memory artifact must be indexed by Voyage embeddings (verified via `Indexed as memory #NNNN`).

---

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `external/` directory containing the codesight source tree.
- cli-codex CLI v0.118.0+ (verified via `codex --version`).
- Node.js for reducer + memory scripts.
- Reducer script `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`.
- Memory script `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.
- Validator script `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.
- Voyage API key for memory embedding (`VOYAGE_API_KEY` env var).

---

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Because this phase does not modify any source under `external/` or any production code in `Code_Environment/Public`, rollback is trivially safe:

1. **State files**: Delete or revert `research/deep-research-state.jsonl` to a prior commit.
2. **Iteration files**: Delete `research/iterations/iteration-001.md` files for the unwanted iterations.
3. **Synthesis**: Revert `research/research.md` to its prior version (git history).
4. **Memory artifact**: Delete the memory file under `memory/` and run `memory_delete({ memoryId: 1835 })` via MCP.
5. **Spec docs**: Delete spec.md, plan.md, tasks.md, implementation-summary.md (but this would leave the validator failing).

No production rollback is needed because no production code was modified.

---

<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Provides | Blocks |
|-------|-----------|----------|--------|
| Phase 1 (Setup) | None | Initialized state files, codex CLI verified | Phase 2 |
| Phase 2 (Original charter iters 1-5) | Phase 1 | 26 source-confirmed findings, original-charter synthesis | Phase 3, Phase 4 |
| Phase 3 (Continuation charter iters 6-10) | Phase 2 (research.md as authoritative knowledge base for the avoid-list) | 26 additional findings, 22-row decision matrix | Phase 4 |
| Phase 4 (Memory save + verification) | Phase 3 | Saved memory artifact, validator pass | Done |

**Critical path**: Phase 1 → Phase 2 (sequential iters 1-5) → Phase 3 (parallel iters 6-10) → Phase 4. Phase 3's parallel dispatch is the only structural deviation from a fully sequential loop, justified by ADR-003.

---

<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Wall Clock | Engine | Notes |
|-------|-----------|--------|-------|
| Phase 1 | ~5 minutes | orchestrator | One-time setup |
| Phase 2 (iters 1-3) | ~9 minutes | cli-codex | ~3 minutes per iteration, sequential |
| Phase 2 (iters 4-5) | ~30 minutes | native fallback (codex stalled) | Includes ~20 minutes of stuck codex wait time |
| Phase 3 (iters 6-10) | ~7 minutes | cli-codex parallel background | All 5 iterations dispatched simultaneously |
| Phase 4 | ~10 minutes | orchestrator | Memory save + spec doc creation + validator pass |
| **Total** | **~60 minutes** | mixed | Continuation charter iters 6-10 dominated by parallel dispatch efficiency |

The estimate is dominated by the codex stall in Phase 2 (iters 4-5). Without that stall, the full session would have been ~30 minutes.

---

<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Original-charter findings K1-K12 preserved before continuation work
- [x] Continuation-charter findings K13-K22 appended without rewriting the earlier audit trail
- [x] `research/deep-research-state.jsonl` and reducer outputs remain append-only

### Rollback Procedure

1. Revert the plan, task, and decision-record edits if they misstate the actual research chronology.
2. If the continuation charter is later judged misleading, restore the pre-continuation packet state and remove the appended continuation findings from the follow-on synthesis documents.
3. Re-run reducer and strict validation after any revert so the packet returns to a coherent audited state.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes research packet docs and state artifacts only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 setup and validator baseline** - CRITICAL
2. **Original-charter iterations 1-5** - CRITICAL
3. **Continuation-charter parallel dispatch and recovery for iters 6-10** - CRITICAL
4. **Synthesis, memory save, and strict validation handoff** - CRITICAL

**Total Critical Path**: setup -> original charter -> continuation charter -> synthesis and validation

**Parallel Opportunities**:
- Continuation iterations 6-10 were intentionally parallelized because the five unexplored modules were independent.
- Validation and memory save still remain sequential after the synthesis completes.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Baseline validation, state files, and strategy exist | Phase 1 |
| M2 | Original charter complete | Questions from the first charter are answered through iter 5 | Phase 2 |
| M3 | Continuation charter complete | Independent modules covered by iters 6-10 | Phase 3 |
| M4 | Packet handoff ready | Synthesis, memory save, and validation complete | Phase 4 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:dependency-graph -->
### Architecture Decision Summary

See `decision-record.md` for the four ADRs:

- **ADR-001**: Use cli-codex gpt-5.4 high reasoning effort as the primary research engine
- **ADR-002**: Switch to native Read/Grep fallback after codex stalled in iters 4-5
- **ADR-003**: Dispatch the continuation charter (iters 6-10) in parallel as background processes
- **ADR-004**: Sandbox-extract workaround when cli-codex `--sandbox read-only` blocks `/tmp` writes

---

#### AI Execution Protocol

This section defines how an AI orchestrator (Claude Code, OpenCode, or any compatible runtime) should execute the research loop autonomously.

##### Pre-Task Checklist

Before dispatching any iteration, verify:

- [x] `research/deep-research-config.json` exists and `status` is `complete` or `complete-resume`
- [x] `research/deep-research-state.jsonl` is append-only and last record is consistent
- [x] `research/deep-research-strategy.md` Next Focus is non-empty
- [x] cli-codex CLI is reachable (`codex --version`) OR native Read/Grep fallback is available
- [x] Tool call budget remaining: target 8, hard max 12
- [x] No `research/.deep-research-pause` sentinel file
- [x] Phase prompt has a unique focus area for this iteration

##### Task Execution Rules

| Rule ID | Constraint | Enforcement |
|---------|------------|-------------|
| TASK-SEQ-001 | Original-charter iterations execute SEQUENTIALLY | Reducer must run between iterations to update state |
| TASK-SCOPE-001 | Each iteration writes to exactly ONE iteration file | research/iterations/iteration-001.md write-once |
| TASK-SCOPE-002 | External repo `external/` is READ-ONLY | sandbox=read-only enforced via cli-codex CLI flag |
| TASK-SEQ-002 | Append iteration record to JSONL after iteration completes | One JSONL line per iteration with `type=iteration` |
| TASK-SEQ-003 | Run reducer after every iteration before the next dispatch | `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>` |
| TASK-SCOPE-003 | Findings must cite file:line evidence | `[SOURCE: external/src/...:LINE-LINE]` format |
| TASK-SEQ-004 | Convergence check before each iteration | composite_converged stop unless user override |
| TASK-PARA-001 | Continuation-charter iterations MAY execute in parallel when modules are independent | Justified by ADR-003; reducer runs after all parallel iterations complete |

##### Status Reporting Format

After each iteration, the orchestrator must report:

```
ITER N STATUS: complete | thought | error
FOCUS: <focus track>
FINDINGS: <count>
NEW INFO RATIO: <0.0-1.0>
ENGINE: <cli-codex | native-fallback>
STOP DECISION: CONTINUE | STOP | STUCK_RECOVERY
NEXT FOCUS: <next focus or "TRANSITION TO SYNTHESIS">
```

### Blocked Task Protocol

When an iteration is BLOCKED (cannot make progress):

1. Append a JSONL event: `{"type":"event","event":"blocked","iteration":N,"reason":"<specific>","timestamp":"<ISO-8601>"}`
2. Set the iteration record status to `error` and findingsCount=0
3. If 3+ consecutive blocked iterations: halt loop and enter synthesis with partial findings
4. If unblockable: switch engine (cli-codex to native-fallback or vice versa), log `engine_switch` event, retry once
5. Document the block in `research/research.md` Open Questions section so future readers can pick it up

<!-- /ANCHOR:dependency-graph -->
