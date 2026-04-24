---
title: "Implementation Plan [system-spec-kit/026-graph-and-context-optimization/001-research-and-baseline/002-codesight/plan]"
description: "20-iteration deep-research packet for the codesight external Node.js/TypeScript skill using cli-codex, native fallback, direct Codex continuation, reducer-managed state, and post-closeout doc reconciliation."
trigger_phrases:
  - "002-codesight research plan"
  - "002-codesight execution plan"
  - "deep-research loop codesight"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight"
    last_updated_at: "2026-04-12T16:16:10Z"
    last_updated_by: "copilot-gpt-5-4"
    recent_action: "Reviewed packet docs"
    next_safe_action: "Run strict validation"
    key_files: ["plan.md"]
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
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

Run the packet to 20 total deep-research iterations against `external/` to translate codesight's zero-dependency AST extraction, framework/ORM detector architecture, MCP tool design, per-tool profile generation, scanner heuristics, and blast-radius patterns into Public-actionable recommendations. Iterations 1-3 dispatched cleanly through `cli-codex gpt-5.4 high`; iterations 4-5 fell back to native Read/Grep after the codex CLI stalled in S sleep state for 20-50 minutes (likely API throttling from concurrent codex traffic). After original-charter convergence, the user requested 5 more iterations (6-10) targeting unexplored modules; all 5 were dispatched in parallel as background processes via cli-codex. The read-only sandbox blocked direct writes to `/tmp`, so the orchestrator extracted the assembled reports from the codex `-o` last-message captures or stdout reasoning traces and reconstructed iteration files verbatim. The packet was later reopened in `completed-continue` mode for runs 11-20; those late iterations executed directly in the active Codex session because self-invoking cli-codex from Codex would be circular. Externalized state in `research/deep-research-{config,state,strategy,dashboard,findings-registry}` survives crash and resume; reducer runs keep registry, dashboard, and machine-owned strategy sections in sync.

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
- [x] All P1 requirements (REQ-011 through REQ-014) met across the two continuation passes and final doc reconciliation
- [x] `research/research.md` contains at least 12 cited findings (delivered: 95 = 26 from iters 1-5 + 26 from iters 6-10 + 43 from iters 11-20)
- [x] Adopt/Adapt/Reject decision matrix line-grounded for every row (22 rows in §18.3, reconciled by the 20-iteration final synthesis)
- [x] Memory artifact saved with `critical` importance tier and clean trigger phrases
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md) created and consistent
- [x] `validate.sh --strict` reports 0 blocking errors; remaining strict failure is the known ADR-anchor warning bucket

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
8. Compile original-charter synthesis (`research/research.md` sections 1-17).

### Phase 2: First continuation charter (iters 6-10)
1. Read prior iterations to understand coverage; pick 5 unexplored modules for Q13-Q17.
2. Author 5 codex prompt files at `/tmp/codex-iter-{006..010}-prompt.md`.
3. Dispatch all 5 codex iterations in parallel as background processes.
4. Process completion notifications; for each iteration:
   - If `-o` last-message capture contains the full report → use directly.
   - If sandbox blocked the write → extract assembled report from stdout reasoning trace.
   - Write `research/iterations/iteration-001.md` with template + sandbox note.
   - Append iteration record to `deep-research-state.jsonl`.

### Phase 3: Completed-continue extension (iters 11-20)
1. Reopen the packet in `completed-continue` mode and snapshot the 10-iteration synthesis to `research/synthesis-v1.md`.
2. Append lifecycle events (`completed_continue`, `segment_start`) to `deep-research-state.jsonl`.
3. Execute iterations 11-20 directly in the active Codex session, covering watch/hook automation, middleware/libs/config detectors, formatter lifecycle, MCP cache/error semantics, AI-config write safety, HTML projection, scanner heuristics, and the final adoption synthesis.
4. Extend `research/research.md` with generation-2 findings and close the packet at 20 total iterations.
5. Run the reducer to refresh dashboard + findings-registry after generation-2 closeout.

### Phase 4: Memory save and verification
1. Append `research/research.md` §18 with continuation charter, new findings summary, and 22-row updated decision matrix.
2. Update strategy.md analyst-owned sections to reflect answered questions and keep NEXT FOCUS at packet-complete state.
3. Preserve the three chronological saved-memory artifacts without unsafe manual rewrites; document memory-quality caveats in the phase docs instead.
4. Reconcile spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, and `description.json` to the 20-iteration packet state.
5. Run `validate.sh --strict` and confirm 0 blocking errors; carry the known ADR-anchor warning explicitly.

---

<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This is a research-only phase, so the "testing" surface is documentation and validator compliance:

- **Validator gate**: `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` must return 0 errors. The current packet still carries one warning-only ADR-anchor bucket in strict mode.
- **Anchor integrity**: All anchor open and close pairs in `research/research.md` and `research/deep-research-strategy.md` must balance.
- **Frontmatter validity**: All spec docs must have `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType` fields.
- **Memory quality**: `generate-context.js` post-save review must report no HIGH severity issues for new saves; existing saved-memory markdown is audited for usefulness/duplication but not hand-edited outside the sanctioned save workflow.
- **Reducer schema**: `reduce-state.cjs` must complete without schema errors and report `iterationsCompleted` matching the actual count.
- **Indexing awareness**: Saved-memory indexing may be skipped by policy; packet docs must not assume every saved memory has an active embedding.

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
- Optional Voyage API key for memory embedding when indexing is enabled by policy.

---

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Because this phase does not modify any source under `external/` or any production code in `Code_Environment/Public`, rollback is trivially safe:

1. **State files**: Delete or revert `research/deep-research-state.jsonl` to a prior commit.
2. **Iteration files**: Delete or revert the affected `research/iterations/iteration-*.md` files.
3. **Synthesis**: Revert `research/research.md` and `research/synthesis-v1.md` to the desired generation.
4. **Memory artifacts**: Remove only the specific saved-memory files you intend to retract, then refresh the packet metadata through the approved memory workflow if needed.
5. **Spec docs**: Revert the human-owned phase docs if they misstate the packet chronology.

No production rollback is needed because no production code was modified.

---

<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Provides | Blocks |
|-------|-----------|----------|--------|
| Phase 1 (Setup) | None | Initialized state files, codex CLI verified | Phase 2 |
| Phase 2 (Original charter iters 1-5) | Phase 1 | 26 source-confirmed findings, original-charter synthesis | Phase 3, Phase 4 |
| Phase 3 (First continuation iters 6-10) | Phase 2 (`research/research.md` as avoid-list knowledge base) | 26 additional findings, 22-row decision matrix | Phase 4 |
| Phase 4 (Completed-continue iters 11-20 + closeout) | Phase 3 | 43 additional findings, final synthesis, reconciled packet docs | Done |

**Critical path**: Phase 1 → Phase 2 (sequential iters 1-5) → Phase 3 (parallel iters 6-10) → Phase 4 (completed-continue iters 11-20 + closeout). Phase 3's parallel dispatch is the only structural deviation from a fully sequential loop.

---

<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Wall Clock | Engine | Notes |
|-------|-----------|--------|-------|
| Phase 1 | ~5 minutes | orchestrator | One-time setup |
| Phase 2 (iters 1-3) | ~9 minutes | cli-codex | ~3 minutes per iteration, sequential |
| Phase 2 (iters 4-5) | ~30 minutes | native fallback | Includes stuck codex wait time |
| Phase 3 (iters 6-10) | ~7 minutes | cli-codex parallel background | All 5 iterations dispatched simultaneously |
| Phase 4 (iters 11-20) | ~40 minutes | direct Codex | 10 late iterations plus final synthesis in the active session |
| Phase 4 closeout | ~15 minutes | orchestrator | Reducer refresh + doc reconciliation + validator rerun |
| **Total** | **~106 minutes** | mixed | The completed-continue extension materially expanded the packet beyond the original 10-iteration closeout |

The estimate is dominated by the codex stall in iters 4-5 and the additional 10-iteration completed-continue extension.

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
3. **First continuation parallel dispatch and recovery for iters 6-10** - CRITICAL
4. **Completed-continue extension for iters 11-20** - CRITICAL
5. **Doc reconciliation and strict-validation closeout** - CRITICAL

**Total Critical Path**: setup -> original charter -> first continuation -> completed-continue extension -> closeout

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
| M3 | First continuation complete | Independent modules covered by iters 6-10 | Phase 3 |
| M4 | Completed-continue extension complete | Late-session surfaces covered through iter 20 | Phase 4 |
| M5 | Packet handoff ready | Synthesis, metadata, memory audit note, and validation are aligned | Phase 4 closeout |
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

- [x] `research/deep-research-config.json` exists and `status` is `complete`, `complete-resume`, or a valid `completed-continue` reopen state
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
