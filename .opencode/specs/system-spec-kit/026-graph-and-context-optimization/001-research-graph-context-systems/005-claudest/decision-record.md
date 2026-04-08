---
title: "Decision Record: 005-claudest Research Phase"
description: "Architecture Decision Records covering engine selection (cli-codex with workspace-write fast mode), sequential continuation dispatch, reducer/analyst section ownership, and cross-phase boundary with sibling phase 001-claude-optimization-settings for the Claudest deep-research audit."
trigger_phrases:
  - "005-claudest decision record"
  - "005-claudest ADR"
  - "claudest engine choice"
  - "claudest cli-codex workspace-write"
importance_tier: critical
contextType: decision-record
---
# Decision Record: 005-claudest Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use cli-codex gpt-5.4 high reasoning effort with --full-auto --sandbox workspace-write as the primary research engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | User directive plus orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase needed an engine that could read dense plugin source files (`external/plugins/claude-memory/skills/recall-conversations/scripts/memory_lib/db.py` ~300 lines, `external/plugins/claude-memory/skills/get-token-insights/scripts/ingest_token_data.py` ~2000 lines, `external/plugins/claude-memory/skills/get-token-insights/templates/dashboard.html` ~2000 lines) and produce evidence-grounded findings with file:line citations rather than vague summaries. The user explicitly directed cli-codex with gpt-5.4 high reasoning effort in fast mode, and the deep-research loop supports per-iteration engine choice through the dispatch step. Unlike phase 002-codesight which used `--sandbox read-only`, this phase used `--sandbox workspace-write` per the user-approved delegation override in `deep-research-config.json` so codex agents could write iteration files directly without a stdout-extraction workaround.

### Constraints

- Each iteration must produce at least 4 findings with file:line citations
- Tool call budget per iteration: target 8, hard max 12
- Iteration wall clock under 10 minutes for fast feedback
- External repo (`external/`) is read-only — no edits, only reads
- User explicitly approved `--full-auto --sandbox workspace-write` for fast mode

---

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Dispatch iterations through `cli-codex gpt-5.4` with `model_reasoning_effort=high`, `--full-auto`, and `--sandbox workspace-write` in fast `exec` mode.

**How it works**: Generation 1 writes a per-iteration prompt file to `/tmp/codex-iter-NNN-prompt`, then runs `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --full-auto --sandbox workspace-write "$(cat /tmp/codex-iter-NNN-prompt)"`. Those invocations run as fresh-context LEAF agents that read the cited files and write findings directly to `research/iterations/iteration-001.md` through `research/iterations/iteration-012.md`. Generation 2 reopens the packet in `completed-continue` mode and extends the same research packet through `research/iterations/iteration-013.md` through `research/iterations/iteration-020.md` inside the active Codex workspace session with the same model target.

---

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cli-codex gpt-5.4 high + --full-auto + workspace-write** | Strong evidence grounding, per-iteration fresh context, user-directed, direct file writes | External dependency, parallel-job contention risk | 9/10 |
| cli-codex with --sandbox read-only (002-codesight pattern) | Tighter sandbox isolation | Blocks /tmp writes; requires stdout-extraction workaround | 6/10 |
| Native Claude Opus 4.6 (orchestrator's own context) | No external dependency, fast | Context window grows across iterations | 7/10 |
| Claude Code Task tool dispatching @deep-research subagent | Native integration, clean fresh context | Slower than codex exec on dense reads | 6/10 |

**Why this one**: cli-codex with `--full-auto --sandbox workspace-write` gives the strongest combination of fresh context per iteration, dense-file reasoning, and direct iteration-file writes. The user explicitly approved this configuration as part of the dispatch policy, and it eliminated the stdout-extraction workaround needed in phase 002-codesight.

---

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Per-iteration findings are line-cited and reproducible (162 reducer-tracked findings across 20 iterations, with both external Claudest source and bounded Public-source closeout reads).
- Fresh context per iteration prevents the orchestrator's context from drifting across long sessions.
- Direct file writes eliminate the brittle stdout-extraction pattern needed when the sandbox blocks `/tmp` writes.

**What it costs**:

- External CLI dependency (cli-codex 0.118.0 must be installed). Mitigation: documented in spec section 7 dependencies.
- `workspace-write` sandbox is broader than `read-only`, so the orchestrator must trust each iteration's prompt scope to constrain writes to the iteration file under `research/iterations/`.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| codex CLI stalls under API throttling | M | None observed in this phase; native fallback would be the recovery path if needed |
| workspace-write sandbox allows broader writes than intended | L | Each iteration prompt explicitly names the single file the agent should write |

---

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase needs evidence-grounded reads of large source files |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared above |
| 3 | **Sufficient?** | PASS | All 20 iterations produced findings with line citations under the 12-tool budget |
| 4 | **Fits Goal?** | PASS | Critical path of the audit |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future deep-research phases that need direct file writes |

**Checks Summary**: 5/5 PASS

---

<!-- /ANCHOR:adr-001-five-checks -->

### Implementation

**What changes**:

- Iterations 1-12 dispatched via cli-codex gpt-5.4 high with `--full-auto --sandbox workspace-write`
- Iterations 13-20 extended the same packet in completed-continue mode with the same model target and sequential synthesis discipline
- Each iteration completed in ~3-5 minutes
- No stdout-extraction workaround required

**How to roll back**: Switch any subsequent iteration to native Read/Grep via the orchestrator. No persistent state binds the loop to a specific engine.

---


<!-- /ANCHOR:adr-001 -->

### ADR-002: Run continuation charter iterations 8-12 sequentially because each builds on the prior synthesis output

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Orchestrator |

---

### Context

After original-charter convergence at iter 7 (composite 0.84, 9/10 questions answered, `synthesis_complete` event), the user requested 5 more iterations to deepen Q10 specifically. Phase 002-codesight had previously parallelized its 5 continuation iterations because they covered independent modules (contracts.ts, extract-python.ts/extract-go.ts, tokens.ts, scanner.ts/config.ts, components.ts/telemetry.ts), but phase 005-claudest's 5 continuation iterations form a synthesis dependency chain: matrix → sequencing → smallest-safe-v1 slicing → packet-ready briefs → uncertainty closeout. Each iteration's output is the next iteration's required input.

### Constraints

- Each continuation iteration must consume the prior iteration's output
- Cannot lose the dependency chain by running iters 8-12 in parallel
- Total wall time should be reasonable; 5 sequential iterations at ~5 minutes each is ~25 minutes
- The user specified "fast mode" but not "parallel"

---


### Decision

**We chose**: Dispatch iters 8-12 sequentially via `codex exec`, with each iteration's prompt explicitly referencing the prior iteration's iteration file as the load-bearing input.

**How it works**: After iter 7 emitted `synthesis_complete`, the orchestrator emitted `continuation_requested` with `newMaxIterations=12`, then dispatched iter 8 (synthesis matrix), waited for completion + reducer run, then dispatched iter 9 (sequencing), then iter 10 (smallest-safe-v1 slicing), then iter 11 (packet briefs), then iter 12 (uncertainty closeout). Each prompt named the previous iteration file as a required read.

---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Sequential dispatch (5 codex calls in series)** | Preserves the synthesis dependency chain; each iteration consumes prior output | Slower than parallel; ~25 minutes total | 9/10 |
| Parallel background dispatch (002-codesight pattern) | Fast (~7 min total) | Wastes the synthesis dependency chain; later iters cannot read earlier iter outputs | 4/10 |
| Single mega-iteration covering all 5 synthesis passes | One agent with full context | Too much for one iteration's tool budget; loses focus discipline; would lose the matrix-vs-sequencing-vs-slicing-vs-briefs-vs-closeout structure | 3/10 |
| Stop at iter 8 (matrix only) and skip iters 9-12 | Cheapest | Loses the packet-ready handoff and uncertainty closeout that make the research actionable | 2/10 |

**Why this one**: The 5 continuation iterations are inherently sequential because each one consumes the prior iteration's output. Parallelism would have required each iter to start from scratch with no synthesis context, defeating the entire point of the continuation charter.

---


### Consequences

**What improves**:

- Each continuation iteration produced focused output that the next iteration could build on
- The final handoff (Brief A FTS cascade + Brief B normalized analytics + closeout) is actionable for packet creation
- The dependency chain is preserved in the iteration files themselves

**What it costs**:

- Total wall time for the continuation charter was ~25 minutes (vs. ~7 minutes parallel for 002-codesight)
- The orchestrator had to wait for each iter to complete before dispatching the next

---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Synthesis dependency chain requires sequential execution |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | All 5 continuation iterations produced focused, build-on-prior output |
| 4 | **Fits Goal?** | PASS | Final handoff is packet-ready |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future synthesis-class continuation iterations |

**Checks Summary**: 5/5 PASS

---


### Implementation

**What changes**:

- Iter 8: Q10 synthesis matrix → 9 findings
- Iter 9: Q10 sequencing + prerequisites → 6 findings
- Iter 10: smallest safe v1 per adopt-now lane → 8 findings
- Iter 11: packet-ready briefs (FTS cascade + normalized analytics tables) → 9 findings
- Iter 12: uncertainty closeout against Public source → 7 findings

**How to roll back**: Re-dispatch any iteration with a new focus, or stop the loop after iter 8 with only the matrix delivered. State files are append-only so re-running an iteration would just append new records.

---



### ADR-003: Reducer manages strategy.md sections 7-11 only; analyst owns sections 1-6 and 12-13 with post-reducer re-add to prevent overwrites

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Orchestrator (after observing reducer overwrite analyst-owned content in iter 8) |

---

### Context

The reducer is configured (in `research/deep-research-config.json`) to own sections 7-11 of `research/deep-research-strategy.md` (`what-worked`, `what-failed`, `exhausted-approaches`, `ruled-out-directions`, `next-focus`). It treats those sections as machine-generated and rewrites them after every iteration. However, when JSONL records use abbreviated question texts in their `answeredQuestions` array, the reducer occasionally also wipes the analyst-owned sections 3 (KEY QUESTIONS) and 6 (ANSWERED QUESTIONS), removing the line-by-line Q1-Q18 tracking the analyst maintains.

### Constraints

- The reducer must continue to own sections 7-11 (this is a hard config constraint)
- The analyst must maintain Q1-Q18 line tracking in sections 3 and 6
- Conflicts must be resolved without disabling the reducer

---


### Decision

**We chose**: Treat sections 1-6 and 12-13 as analyst-owned, treat sections 7-11 as reducer-owned, and after every reducer run manually re-add the Q1-Q18 summaries to sections 3 and 6 if the reducer removed them.

**How it works**: The orchestrator runs the reducer after each iteration, then immediately re-reads `research/deep-research-strategy.md` and re-applies the analyst section content if it was overwritten. The first continuation updated Q10 after iter 12; the completed-continue generation then extended the same tracking through Q11-Q18 before the final "SESSION COMPLETE" closeout.

---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Mixed ownership with post-reducer re-add** | Preserves both reducer schema and analyst tracking | Manual re-add work after each reducer run | 8/10 |
| Move Q1-Q18 tracking to a separate analyst-only file | Cleaner separation | Loses single-source-of-truth for strategy.md | 6/10 |
| Disable reducer entirely | No overwrite risk | Loses dashboard refresh, findings-registry sync, machine-owned section maintenance | 3/10 |
| Reduce JSONL records to use full question texts | Reducer would not abbreviate | Bloats JSONL records significantly | 5/10 |

**Why this one**: Mixed ownership with post-reducer re-add is the lowest-friction recovery from the reducer's overzealous section management, and it preserves both the reducer's schema discipline and the analyst's question-tracking responsibility.

---


### Consequences

**What improves**:

- strategy.md remains the canonical state file with both machine-generated and analyst-curated content
- Q1-Q18 tracking survives across both generations and the SESSION COMPLETE transition

**What it costs**:

- The orchestrator must remember to re-add analyst sections after each reducer run

---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Reducer overwrite was observed and would have lost Q1-Q18 tracking |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | Q1-Q18 tracking preserved across all 20 iterations |
| 4 | **Fits Goal?** | PASS | Maintains both reducer schema and analyst tracking |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future deep-research phases |

**Checks Summary**: 5/5 PASS

---


### Implementation

**What changes**:

- Reducer continues to own sections 7-11
- Analyst owns sections 1-6 and 12-13
- Post-reducer re-add applied after iter 8, iter 12, and the final SESSION COMPLETE edit

**How to roll back**: Disable the reducer entirely (would lose dashboard refresh) or move Q1-Q18 tracking to a separate file (would lose single-source-of-truth).

---



### ADR-004: Cross-phase boundary with sibling phase 001-claude-optimization-settings: implementation-side analysis here, audit-pattern analysis there

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Orchestrator (per `scratch/phase-research-prompt.md` non-goals) |

---

### Context

Phase `005-claudest` and sibling phase `001-claude-optimization-settings` both touch the Claudest ecosystem but from different angles. Phase 001 extracts lessons from a Reddit audit post about Claude Code optimization patterns. Phase 005 examines the actual Claudest source implementation. Without an explicit boundary, the two phases would risk duplicating findings or contradicting each other.

### Constraints

- Both phases are in scope simultaneously
- Findings must be assignable to exactly one phase
- Cross-references between phases must be acknowledged but not duplicated

---


### Decision

**We chose**: Phase `005-claudest` covers implementation-side analysis (what does the Claudest source actually do at function level); phase `001-claude-optimization-settings` covers audit-pattern analysis (what does the Reddit post say about optimization patterns). The two phases reference each other in their `Known Context` strategy sections without restating findings.

**How it works**: The phase `005-claudest` strategy file `Known Context` section explicitly says "Phase `001-claude-optimization-settings` extracts lessons from the Reddit audit post (pattern side). This phase `005-claudest` examines the implementation side. Do not restate audit patterns - focus on what the Claudest source actually does." All iteration agents respect this boundary.

---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Implementation here, audit patterns there (with cross-references)** | Clean ownership, no duplication, explicit boundary | Requires discipline from each iteration agent | 9/10 |
| Merge both phases into a single deep-research session | Single source of truth | Doubles iteration count and tool budget; mixes evidence types | 5/10 |
| Run only phase 005 and ignore phase 001 audit findings | Simpler | Loses the audit-pattern context that informs adoption decisions | 4/10 |

**Why this one**: Splitting the two phases by evidence type (implementation source vs Reddit-post audit pattern) is the cleanest boundary because they answer different questions and require different reading depths.

---


### Consequences

**What improves**:

- Each phase has a clear ownership boundary
- Findings are assigned to the correct phase
- Cross-references acknowledge sibling work without duplicating it

**What it costs**:

- Each phase must respect the boundary in every iteration prompt
- Cross-phase synthesis (if needed later) requires reading both phases

---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Two sibling phases both touch Claudest |
| 2 | **Beyond Local Maxima?** | PASS | 3 alternatives compared |
| 3 | **Sufficient?** | PASS | No duplicate findings between phases observed |
| 4 | **Fits Goal?** | PASS | Each phase has a clear scope |
| 5 | **Open Horizons?** | PASS | Pattern reusable for any sibling research phases |

**Checks Summary**: 5/5 PASS

---


### Implementation

**What changes**:

- Phase 005 strategy.md `Known Context` section explicitly references phase 001
- All 20 iteration prompts respect the boundary (no Reddit-post audit findings restated in phase 005)
- Phase 005 research.md §14 + §15 explicitly bound the cross-phase scope

**How to roll back**: Merge the two phases by combining their state files, iteration files, and research.md into a single phase folder. This would require renaming and re-running both phase memory artifacts.
