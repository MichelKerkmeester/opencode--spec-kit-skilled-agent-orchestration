---
title: "Implementation Plan: 005-claudest Research Phase"
description: "20-iteration deep-research loop dispatched against the Claudest external Claude Code plugin checkout across a 12-iteration cli-codex baseline and an 8-iteration completed-continue extension, with reducer-managed state, refreshed synthesis, and packet-ready follow-on contracts."
trigger_phrases:
  - "005-claudest research plan"
  - "005-claudest execution plan"
  - "deep-research loop claudest"
importance_tier: critical
contextType: plan
---
# Implementation Plan: 005-claudest Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown research artifacts; Node.js reducer; Python/JSON/Markdown under study (Claudest claude-memory plugin + get-token-insights skill) |
| **Framework** | Spec Kit Memory deep-research loop (`sk-deep-research`) |
| **Storage** | JSONL state log + JSON config + markdown iteration files + memory artifacts |
| **Testing** | Spec Kit Memory `validate.sh --strict`; reducer schema enforcement |

### Overview

Run a 20-iteration deep-research loop against `external/` to translate Claudest's claude-memory plugin (v3 SQLite schema with branch-aware BM25/FTS5 recall, Stop/SessionStart hook chain with cached `context_summary` fast path, `extract-learnings` consolidation with `memory-auditor`/`signal-discoverer` split) and the `get-token-insights` skill into Public-actionable adopt/prototype/reject recommendations, packet-ready briefs, and implementation-ready follow-on contracts. Iterations 1-12 dispatched through `cli-codex gpt-5.4 high --full-auto --sandbox workspace-write`; iteration 7 converged the original charter, then iterations 8-12 deepened Q10 into matrix, sequencing, v1 slicing, packet briefs, and uncertainty closeout. The packet was then reopened in `completed-continue` mode for iterations 13-20, which converted the first continuation into concrete implementation seams: FTS capability helper scope, forced-degrade tests, Stop-hook metadata patch, normalized analytics replay schema, SessionStart fast-path placement, verifier/discoverer split mapping, portable token-observability contracts, and a dependency-ordered roadmap. Externalized state in `research/deep-research-{config,state,strategy,dashboard,findings-registry}` survives crash and resume; reducer runs after every iteration to keep registry, dashboard, and machine-owned strategy sections in sync.

---

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Phase research prompt exists at `scratch/phase-research-prompt.md` with 10 explicit research questions
- [x] Cross-phase awareness (sibling phase `001-claude-optimization-settings`) loaded into strategy.md `Known Context` section
- [x] cli-codex CLI installed (verified via `codex --version` → `codex-cli 0.118.0`)
- [x] Reducer script reachable at `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
- [x] Memory script reachable at `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`

### Definition of Done

- [x] All P0 requirements (REQ-001 through REQ-010) met
- [x] All P1 requirements (REQ-011, REQ-012) met via continuation charter
- [x] research.md contains source-cited findings spanning 20 iterations with explicit recommendation labels on every finding
- [x] Adopt/Prototype/Reject decision matrix line-grounded for every row (delivered in §13 + §18.1)
- [x] Two packet-ready briefs delivered in §18.4 (Brief A: FTS capability cascade; Brief B: Normalized analytics tables)
- [x] Memory artifact saved with `critical` importance tier and clean trigger phrases
- [x] Spec docs (spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md) created and consistent
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
cli-codex iteration N                          |
   --model gpt-5.4                             |
   -c model_reasoning_effort=high              |
   --full-auto                                 |
   --sandbox workspace-write                   |
        |                                      |
        v                                      |
research/iterations/iteration-001.md ----+
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
research/research.md (synthesis §1-§13 + continuation §18.1-§18.5)
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

### Phase 1: Setup and original charter (iters 1-7)
1. Author phase research prompt with TIDD-EC structure.
2. Initialize deep-research state files via the deep-research workflow.
3. Iteration 1: marketplace discovery + versioning (Q1, Q9).
4. Iteration 2: claude-memory SQLite schema + recall cascade (Q2, Q4).
5. Iteration 3: SessionStart context injection flow (Q3).
6. Iteration 4: extract-learnings + auditor vs discoverer (Q5).
7. Iteration 5: get-token-insights ingestion + dashboard contract (Q7).
8. Iteration 6: dashboard contract + borrowable sections (Q8).
9. Iteration 7: memory hierarchy comparison (Q6).
10. Composite convergence at 0.84 (>=0.60 threshold + question coverage 9/10 >= 0.85), emit `synthesis_complete` event.

### Phase 2: Continuation charter (iters 8-12)
1. User requests 5 more iterations (8-12) via cli-codex gpt-5.4 high fast mode; emit `continuation_requested` event with `newMaxIterations=12`.
2. Iteration 8: Q10 synthesis matrix (closes the last open question with the explicit simplification bonus).
3. Iteration 9: Q10 sequencing + prerequisites (maps the matrix onto Public packet dependencies; identifies which lanes are unblocked).
4. Iteration 10: smallest safe v1 slices (stress-tests the sequence by defining v1 scope per adopt-now lane and selecting the first follow-on packet).
5. Iteration 11: packet-ready briefs (Brief A FTS capability cascade + Brief B normalized analytics tables, with named Public file surfaces).
6. Iteration 12: uncertainty closeout (reads Public's actual `mcp_server/lib/search/sqlite-fts.ts` and `mcp_server/hooks/claude/session-stop.ts` to resolve open implementation ambiguities).
7. Emit `continuation_complete` event listing iterations 8-12 and confirming `totalIterations=12`.

### Phase 3: Completed-continue execution charter (iters 13-20)
1. Reopen the packet in `completed-continue` mode with `maxIterations=20`, `generation=2`, and `continuedFromRun=12`.
2. Iteration 13: FTS capability helper contract + caller migration plan.
3. Iteration 14: forced-degrade FTS verification matrix.
4. Iteration 15: Stop-hook metadata patch for transcript identity + cache token persistence.
5. Iteration 16: normalized analytics replay schema + idempotent join keys.
6. Iteration 17: SessionStart cached-summary fast path mapped onto Public startup/resume surfaces.
7. Iteration 18: verifier/discoverer split mapped onto Public signal extraction and post-save review seams.
8. Iteration 19: portable token-insight JSON contracts.
9. Iteration 20: dependency-ordered implementation roadmap + acceptance gates.
10. Emit generation-2 completion events and refresh reducer outputs after each iteration.

### Phase 4: Synthesis and doc sync
1. Keep `research/research.md` synchronized through §19 with the execution-ready continuation outputs.
2. Update spec docs so packet status, iteration counts, roadmap references, and memory references match the 20-iteration state.
3. Preserve the generation-1 indexed memory artifact and record generation-2 memory/indexing constraints honestly rather than hand-editing saved memory markdown.

### Phase 5: Memory review and verification
1. Review `memory/` for duplicates, stale archives, and metadata health without manually rewriting saved memory markdown content.
2. Keep archived thin saves under `memory/.archive-pre-quality-rebuild/`; treat the 12-iteration indexed save as the canonical generation-1 memory and the 20-iteration save as a continuation artifact under the current write-only indexing policy.
3. Run `validate.sh --strict` and completion checks after doc sync.

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
- **Memory persistence**: Saved memory artifacts must persist cleanly in `memory/`; if the current indexing policy skips semantic indexing, the docs must state that honestly rather than claiming embedding success.

---

<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `external/` directory containing the Claudest checkout.
- cli-codex CLI v0.118.0+ (verified via `codex --version`).
- Node.js for reducer + memory scripts.
- Reducer script `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`.
- Memory script `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js`.
- Validator script `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`.
- Voyage API key for memory embedding (`VOYAGE_API_KEY` env var).
- Public packets `023/013` (FTS5 fix), `024/002` (SessionStart hook), `024/003` (Stop hook tracking), `022/008` (signal extraction) — referenced as substrate dependencies.

---

<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Because this phase does not modify any source under `external/` or any production code in `Code_Environment/Public`, rollback is trivially safe:

1. **State files**: Delete or revert `research/deep-research-state.jsonl` to a prior commit.
2. **Iteration files**: Delete `research/iterations/iteration-001.md` files for the unwanted iterations.
3. **Synthesis**: Revert `research/research.md` to its prior version (git history).
4. **Memory artifact**: Delete the memory file under `memory/` and run `memory_delete` via MCP if needed.
5. **Spec docs**: Delete spec.md, plan.md, tasks.md, implementation-summary.md, checklist.md, decision-record.md (but this would leave the validator failing).

No production rollback is needed because no production code was modified.

---

<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Provides | Blocks |
|-------|-----------|----------|--------|
| Phase 1 (Setup + original charter iters 1-7) | None | Initialized state files, codex CLI verified, 28 source-confirmed findings, 9/10 questions answered | Phase 2 |
| Phase 2 (Continuation charter iters 8-12) | Phase 1 (research.md as authoritative knowledge base for the avoid-list) | 39 additional findings (matrix synthesis + sequencing + v1 slices + packet briefs + uncertainty closeout) | Phase 3 |
| Phase 3 (Completed-continue charter iters 13-20) | Phase 2 | 55 additional findings, §19 implementation roadmap, generation-2 lineage | Phase 4 |
| Phase 4 (Synthesis + doc sync) | Phase 3 | 20-iteration research.md plus aligned Level 3 packet docs | Phase 5 |
| Phase 5 (Memory review + verification) | Phase 4 | Honest memory status, validator pass, completion-ready packet | Done |

**Critical path**: Phase 1 → Phase 2 → Phase 3 → Phase 4 → Phase 5. Both continuation generations stayed sequential because each synthesis-class iteration depends on the prior output (matrix → sequencing → slicing → briefs → closeout, then contract → tests → producer patch → reader schema → roadmap).

---

<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Wall Clock | Engine | Notes |
|-------|-----------|--------|-------|
| Phase 1 | ~5 minutes | orchestrator | One-time setup |
| Phase 1 (iters 1-7) | ~90 minutes | cli-codex | Each iter ~3-5 minutes; some overlap with reducer runs |
| Phase 2 (iters 8-12) | ~25 minutes | cli-codex | 5 sequential synthesis-class iterations, each ~5 minutes |
| Phase 3 (iters 13-20) | ~40 minutes | mixed Codex | 8 sequential execution-contract iterations across completed-continue generation |
| Phase 4 | ~10 minutes | orchestrator | research.md + spec-doc sync |
| Phase 5 | ~10 minutes | orchestrator | Memory review + validator pass |
| **Total** | **~180 minutes** | mixed | Sequential synthesis and contract iterations dominated by inter-iteration dependencies |

The estimate is dominated by the 20 total sequential dispatches across two generations; clean execution persisted because generation 1 used `--sandbox workspace-write` and generation 2 reused the live Codex workspace with the same model target.

---

<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Q1-Q10 baseline findings preserved before continuation iterations 8-12
- [x] Generation-2 continuation preserved the generation-1 synthesis instead of replacing it
- [x] Strategy mixed-ownership rule documented so reducer-managed sections can be reconstructed if needed
- [x] Packet-ready briefs remain grounded in the continuation files that generated them

### Rollback Procedure

1. Revert the plan and continuation-charter documentation if the sequential dependency story is later found to be inaccurate.
2. If packet-ready briefs need to be withdrawn, restore the research packet to the state that ended at iter 7 and mark the continuation findings as superseded.
3. Re-run reducer-dependent documents and strict validation after any revert so the research packet is internally consistent again.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A. This phase changes research packet docs and state artifacts only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 1 setup and baseline validation** - CRITICAL
2. **Original 7-iteration charter** - CRITICAL
3. **Sequential continuation charter iterations 8-12** - CRITICAL
4. **Completed-continue execution charter iterations 13-20** - CRITICAL
5. **Doc sync, memory review, and strict validation handoff** - CRITICAL

**Total Critical Path**: setup -> original charter -> first continuation -> completed-continue execution charter -> handoff artifacts

**Parallel Opportunities**:
- Both continuation generations intentionally have no safe internal parallelism because each iteration consumes the prior synthesis output.
- Validation can only start after the final continuation closeout and document sync are complete.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Setup complete | Baseline validation, state files, and strategy exist | Phase 1 |
| M2 | Original charter complete | Q1-Q10 baseline covered through iter 7 | Phase 1 continuation |
| M3 | Continuation charter complete | Matrix, sequencing, v1 slicing, briefs, and closeout done through iter 12 | Phase 2 |
| M4 | Completed-continue charter complete | Q11-Q18 contracts, tests, and roadmap done through iter 20 | Phase 3 |
| M5 | Packet handoff ready | Packet-ready docs, memory review, and validation complete | Phase 5 |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:dependency-graph -->
### Architecture Decision Summary

See `decision-record.md` for the four ADRs:

- **ADR-001**: Use cli-codex gpt-5.4 high reasoning effort with `--full-auto --sandbox workspace-write` as the primary research engine
- **ADR-002**: Run the continuation charter iterations 8-12 sequentially because each builds on the prior synthesis output
- **ADR-003**: Reducer manages strategy.md sections 7-11 only; analyst owns sections 1-6 and 12-13 with post-reducer re-add to prevent overwrites
- **ADR-004**: Cross-phase boundary with sibling phase `001-claude-optimization-settings`: implementation-side analysis here, audit-pattern analysis there

---

#### AI Execution Protocol

This section defines how an AI orchestrator (Claude Code, OpenCode, or any compatible runtime) should execute the research loop autonomously.

##### Pre-Task Checklist

Before dispatching any iteration, verify:

- [x] `research/deep-research-config.json` exists and `status` is `complete` or `complete-resume`
- [x] `research/deep-research-state.jsonl` is append-only and last record is consistent
- [x] `research/deep-research-strategy.md` Next Focus is non-empty
- [x] cli-codex CLI is reachable (`codex --version`)
- [x] Tool call budget remaining: target 8, hard max 12
- [x] No `research/.deep-research-pause` sentinel file
- [x] Phase prompt has a unique focus area for this iteration

##### Task Execution Rules

| Rule ID | Constraint | Enforcement |
|---------|------------|-------------|
| TASK-SEQ-001 | All iterations execute SEQUENTIALLY (continuation included) | Reducer must run between iterations to update state |
| TASK-SCOPE-001 | Each iteration writes to exactly ONE iteration file | research/iterations/iteration-001.md write-once |
| TASK-SCOPE-002 | External repo `external/` is READ-ONLY | sandbox=workspace-write, but the agent only reads under `external/` per the prompt's scope rules |
| TASK-SEQ-002 | Append iteration record to JSONL after iteration completes | One JSONL line per iteration with `type=iteration` |
| TASK-SEQ-003 | Run reducer after every iteration before the next dispatch | `node .opencode/skill/sk-deep-research/scripts/reduce-state.cjs <spec-folder>` |
| TASK-SCOPE-003 | Findings must cite file:line evidence | `[SOURCE: external/plugins/...:LINE-LINE]` format |
| TASK-SEQ-004 | Convergence check before each iteration | composite_converged stop unless user override |
| TASK-CONT-001 | Continuation iterations 8-12 are synthesis-class and depend on prior synthesis output | Sequential dispatch, no parallelism |
| TASK-CONT-002 | Completed-continue iterations 13-20 remain dependency-ordered contract work | Sequential dispatch, no parallelism |

##### Status Reporting Format

After each iteration, the orchestrator must report:

```
ITER N STATUS: complete | thought | error
FOCUS: <focus track>
FINDINGS: <count>
NEW INFO RATIO: <0.0-1.0>
ENGINE: cli-codex
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
