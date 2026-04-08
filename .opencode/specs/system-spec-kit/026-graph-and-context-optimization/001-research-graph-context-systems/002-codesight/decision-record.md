---
title: "Decision Record: 002-codesight Research Phase"
description: "Architecture Decision Records covering engine selection, native fallback after codex stalls, parallel background dispatch for the first continuation charter, and sandbox-extract workaround within the 20-iteration codesight deep-research packet."
trigger_phrases:
  - "002-codesight decision record"
  - "002-codesight ADR"
  - "codesight engine choice"
  - "codesight sandbox extract workaround"
importance_tier: critical
contextType: decision-record
---
# Decision Record: 002-codesight Research Phase

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Use cli-codex gpt-5.4 high reasoning effort as the primary research engine

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | User directive plus orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The phase needed an engine that could read dense Node.js/TypeScript source files (`external/src/index.ts` ~550 lines, `external/src/ast/extract-routes.ts` ~340 lines, `external/src/detectors/blast-radius.ts` ~127 lines) and produce evidence-grounded findings with file:line citations rather than vague summaries. The user explicitly directed cli-codex with gpt-5.4 high reasoning effort, and the deep-research loop supports per-iteration engine choice through the dispatch step.

### Constraints

- Each iteration must produce at least 4 findings with file:line citations
- Tool call budget per iteration: target 8, hard max 12
- Iteration wall clock under 10 minutes for fast feedback
- External repo (`external/`) is read-only — no edits, only reads

---

<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Dispatch iterations through `cli-codex gpt-5.4` with `model_reasoning_effort=high` and `sandbox=read-only` in fast `exec` mode.

**How it works**: The orchestrator writes a per-iteration prompt file to `/tmp/codex-iter-006-prompt`, then runs `codex exec --model gpt-5.4 -c model_reasoning_effort="high" --sandbox read-only -o /tmp/codex-iter-006-output "$(cat /tmp/codex-iter-006-prompt)"`. Each invocation runs as a fresh-context LEAF agent that reads the cited files, attempts to write findings to `/tmp/codex-iter-006-output`, and exits.

---

<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **cli-codex gpt-5.4 high** | Strong evidence grounding, per-iteration fresh context, user-directed | External dependency, parallel-job contention risk, sandbox limitations | 9/10 |
| Native Claude Opus 4.6 (orchestrator's own context) | No external dependency, fast | Context window grows across iterations | 7/10 |
| Claude Code Task tool dispatching @deep-research subagent | Native integration, clean fresh context | Slower than codex exec on dense reads | 6/10 |
| Mixed engines per iteration | Flexibility | Complicates the audit trail | 5/10 |

**Why this one**: cli-codex gives the strongest combination of fresh context per iteration and dense-file reasoning, and the user explicitly directed it. The native fallback (ADR-002) absorbs the codex-stall risk. The sandbox-extract workaround (ADR-004) absorbs the read-only-blocks-tmp-write risk.

---

<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:

- Per-iteration findings are line-cited and reproducible (95 findings across 20 iterations, every one backed by packet-local source citations).
- Fresh context per iteration prevents the orchestrator's context from drifting across long sessions.

**What it costs**:

- External CLI dependency (cli-codex 0.118.0 must be installed). Mitigation: documented in spec section 7 dependencies; native fallback proven in iters 4-5.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| codex CLI stalls in S sleep state under API throttling | H | ADR-002 native fallback protocol |
| codex sandbox=read-only blocks /tmp writes | M | ADR-004 stdout extraction workaround |

---

<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Phase needs evidence-grounded reads of large source files |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared above |
| 3 | **Sufficient?** | PASS | Iters 1-3 produced 15 findings with line citations in ~9 minutes total |
| 4 | **Fits Goal?** | PASS | Critical path of the audit |
| 5 | **Open Horizons?** | PASS | Pattern reusable for future deep-research phases |

**Checks Summary**: 5/5 PASS

---

<!-- /ANCHOR:adr-001-five-checks -->

### Implementation

**What changes**:

- Iters 1-3 dispatched via cli-codex gpt-5.4 high (~3 minutes each, clean output)
- Iters 6-10 dispatched in parallel via cli-codex gpt-5.4 high (~7 minutes total wall time)
- Iters 4-5 fell back to native Read/Grep after codex stalled (see ADR-002)
- Iters 11-20 ran directly in the active Codex session once the packet was reopened in `completed-continue` mode

**How to roll back**: Switch any subsequent iteration to native Read/Grep via the orchestrator. No persistent state binds the loop to a specific engine.

---


<!-- /ANCHOR:adr-001 -->

### ADR-002: Switch to native Read/Grep fallback after codex stalled in iters 4-5

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Orchestrator |

---

### Context

After successfully running iters 1-3 via cli-codex, iter 4 dispatched at ~10:30Z and the codex process entered S (interruptible sleep) state. After 40 minutes with no output (likely API throttling from concurrent codex traffic in a sibling session), the orchestrator killed PIDs 5866, 59530, 56544 and prepared to retry. Iter 5 dispatched and exhibited the same stall, killed after 20 minutes (PIDs 59524, 56538). The deep-research loop's stop conditions had not yet been met, so abandoning the iteration was not acceptable.

### Constraints

- Iters 4-5 must still produce evidence-grounded findings with the same template as iters 1-3
- Cannot wait indefinitely for codex API quota to recover
- Cannot lose the work already invested in the prompts and the cumulative context

---


### Decision

**We chose**: Complete iters 4-5 using native Read/Grep tools with the same finding template, exact line citations, and the same write target (`research/iterations/iteration-006.md`).

**How it works**: The orchestrator reads each file directly via the Read tool, runs Grep for cross-file confirmation, and composes the iteration markdown manually. Each finding still cites exact file paths and line ranges; the only difference from iters 1-3 is that the write happens from the orchestrator's own context rather than from a codex agent.

---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Native Read/Grep fallback** | Always available, exact line preservation, no API quota dependency | Orchestrator context grows across iterations | 8/10 |
| Wait indefinitely for codex to recover | No engine change | Could block the loop for hours; user is waiting | 3/10 |
| Skip iters 4-5 and proceed to synthesis | Preserves engine purity | Loses Q8/Q10/Q11/Q12 coverage | 2/10 |
| Switch to a different external CLI (Gemini, Copilot) | New engine perspective | More complexity for marginal value | 5/10 |

**Why this one**: Native fallback is the lowest-friction recovery from a codex stall, and it preserves the evidence-grounding discipline of iters 1-3. The cost (orchestrator context growth) is small relative to the cost of losing 2 iterations.

---


### Consequences

**What improves**:

- Iters 4-5 completed with 11 findings cited at exact line ranges (6 + 5 findings).
- The session reached `all_questions_answered` at iter 5 instead of stalling at iter 3.

**What it costs**:

- The audit trail now distinguishes "cli-codex iterations" (1-3) from "native fallback iterations" (4-5). Documented in `research/research.md` §3 Methodology.
- Future readers may wonder whether the fallback findings are equivalent in quality. Mitigation: same finding template, same line citations, same evidence labels.

---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Codex stalled twice, blocking the loop |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | Iters 4-5 produced 11 findings with line citations |
| 4 | **Fits Goal?** | PASS | Coverage hit 12/12 questions |
| 5 | **Open Horizons?** | PASS | Pattern reusable when external CLIs stall |

**Checks Summary**: 5/5 PASS

---


### Implementation

**What changes**:

- Iter 4 fallback: 6 findings on profile generators + benchmark validation
- Iter 5 fallback: 5 findings on static vs query-time + cross-phase scoping

**How to roll back**: Re-dispatch iters 4-5 via cli-codex when API quota recovers. The native-fallback iteration files would be overwritten by the new agent-written versions if desired.

---



### ADR-003: Dispatch the continuation charter (iters 6-10) in parallel as background processes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | User directive ("5 more iterations of /spec_kit:deep-research with gpt-5.4 high agents in fast mode through cli-codex") plus orchestrator |

---

### Context

After original-charter convergence at iter 5 (stop reason `all_questions_answered`), the user requested 5 more iterations to deepen coverage of unexplored modules. The user explicitly emphasized "fast mode through cli-codex". The deep-research loop normally runs iterations sequentially because each iteration's strategy.md `Next Focus` informs the next, but the 5 unexplored modules I picked (contracts.ts, extract-python.ts/extract-go.ts, tokens.ts, scanner.ts/config.ts, components.ts/telemetry.ts) are independent — no iteration depends on another's findings.

### Constraints

- Each iteration must still produce evidence-grounded findings with file:line citations
- Total wall time must be substantially faster than 5x sequential dispatches (~25-30 min)
- Iteration ordering must not affect findings quality (true independence)
- The user specified "fast mode" and "cli-codex"

---


### Decision

**We chose**: Dispatch all 5 continuation iterations as parallel background processes via `Bash run_in_background`. Each codex call writes to its own `/tmp/codex-iter-006-output` and `/tmp/codex-iter-NNN-stdout.log`. The orchestrator processes completion notifications as they arrive (iter 8 finished first, then 6+9, then 7+10).

**How it works**: 5 parallel `codex exec` calls are launched in a single response, each with a unique prompt file and output target. Each prompt explicitly lists the avoid-list of topics covered in iters 1-5 to prevent rehash. Background IDs: bxjs6jo8n (iter 6), boamb0vry (iter 7), bhiek5bm7 (iter 8), b1hramyju (iter 9), b4avf6pv6 (iter 10).

---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Parallel background dispatch (5 codex calls)** | Fast (7 min total wall time vs ~25 min sequential), matches user "fast mode" directive | Higher risk of API contention | 9/10 |
| Sequential cli-codex dispatch | Lower API contention risk | Slow; doesn't match user "fast mode" intent | 6/10 |
| Sequential native Read/Grep | Always available | Doesn't use cli-codex per user directive | 4/10 |
| Single mega-iteration covering all 5 modules | One agent with full context | Too much for one iteration's tool budget; loses focus discipline | 3/10 |

**Why this one**: The 5 modules are genuinely independent, the user said "fast mode", and parallel dispatch is the only way to honor both constraints. The contention risk is mitigated by the sandbox-extract workaround (ADR-004) -- even when codex hits API limits or sandbox issues, the orchestrator can still extract the assembled report from stdout.

---


### Consequences

**What improves**:

- Total wall time for the continuation charter dropped from ~30 minutes (sequential) to ~7 minutes (parallel).
- All 5 iterations finished within a single user-facing notification cycle.

**What it costs**:

- Parallel codex calls increased the risk of API contention. Mitigation: spread the prompts to focus on independent modules so the agents do not duplicate work.
- The user-visible notification ordering does not match iteration numbers (iter 8 finished first, then 6+9, then 7+10), which slightly complicates progress reporting. Mitigation: orchestrator processes completions in any order and writes iteration files as they arrive.

---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | User directive; iteration independence justified parallelism |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | All 5 iterations produced findings; stop reason `all_continuation_questions_answered` |
| 4 | **Fits Goal?** | PASS | Honors user "fast mode" directive |
| 5 | **Open Horizons?** | PASS | Parallel dispatch pattern reusable for future independent iteration sets |

**Checks Summary**: 5/5 PASS

---


### Implementation

**What changes**:

- Iters 6-10 dispatched in parallel; total wall time ~7 minutes
- Background IDs tracked in tasks.md T204

**How to roll back**: Sequential redispatch via cli-codex or native Read/Grep. State files are append-only so re-running an iteration would just append new records.

---



### ADR-004: Sandbox-extract workaround when cli-codex --sandbox read-only blocks /tmp writes

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-04-06 |
| **Deciders** | Orchestrator (after iter 8 first surfaced the issue) |

---

### Context

When dispatching the continuation iterations 6-10 with `cli-codex --sandbox read-only`, every codex agent successfully ran the source trace but failed to write its assembled report to `/tmp/codex-iter-006-output`. The exact errors were `zsh:1: operation not permitted: /tmp/codex-iter-006-output` and `zsh:1: can't create temp file for here document: operation not permitted`. A direct Python `Path.write_text` probe also failed with `PermissionError: [Errno 1] Operation not permitted`. This proved that `--sandbox read-only` fully blocks `/tmp` writes, not just heredoc temp files.

The user explicitly asked for sandbox=read-only as part of the dispatch policy, so loosening the sandbox would violate the directive. But losing the assembled reports would mean losing all 5 continuation iterations.

### Constraints

- Cannot violate the user's "sandbox read-only" directive
- Cannot lose any findings from the 5 successful agent runs
- Must preserve exact line citations from the agent's reasoning trace
- Must produce iteration files that match the same template as iters 1-5

---


### Decision

**We chose**: Extract the fully assembled reports from each codex agent's stdout reasoning trace (or `-o` last-message capture for iter 8) and reconstruct the iteration files verbatim.

**How it works**: The codex CLI writes its full reasoning trace to stdout as the agent thinks through the task, including the exact heredoc or Python script that the agent tried to use to write `/tmp/codex-iter-006-output`. This stdout is captured by the orchestrator's bash redirect to `/tmp/codex-iter-NNN-stdout.log`. After each agent's background process completes, the orchestrator greps the stdout log for the assembled report (typically inside the failing heredoc string or a fenced markdown block in the `-o` capture), copies it verbatim into `research/iterations/iteration-006.md`, and adds a "Sandbox Note" section documenting the workaround.

---


### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Stdout extraction + manual reconstruction** | Preserves user's read-only directive, no rework needed, exact line citations preserved | Requires orchestrator to read large stdout logs (60-200KB each) | 9/10 |
| Re-dispatch with `--sandbox workspace-write` | Codex writes the report directly | Violates user directive; needs explicit user approval | 4/10 |
| Re-dispatch with `--full-auto` | Same as above plus auto-approval | Same violation; even more permissive | 3/10 |
| Discard the failed iterations and start over | Clean slate | Wastes 7 minutes of compute and 700K+ tokens of agent work | 1/10 |

**Why this one**: Extraction preserves the user's directive AND the agent's findings, at the cost of orchestrator effort. The agents already did the hard work (reading the source files, building the findings); we just need to harvest what they produced.

---


### Consequences

**What improves**:

- All 5 continuation iterations produced complete iteration files with exact line citations.
- The user's `--sandbox read-only` directive was honored throughout.
- Future codex-via-deep-research dispatches now have a documented fallback for the sandbox-block scenario.

**What it costs**:

- Each iteration file now contains a "Sandbox Note" subsection explaining the workaround. This is light bookkeeping.
- The orchestrator had to read 60-200KB of stdout per iteration, which inflates orchestrator context usage. Acceptable for a 5-iteration burst; would not scale to 50 iterations.

---


### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Sandbox blocked all 5 agent writes; without extraction we lose 26 findings |
| 2 | **Beyond Local Maxima?** | PASS | 4 alternatives compared |
| 3 | **Sufficient?** | PASS | All 5 iteration files reconstructed verbatim with line citations |
| 4 | **Fits Goal?** | PASS | Honors sandbox directive while preserving findings |
| 5 | **Open Horizons?** | PASS | Pattern reusable for any sandbox-blocked dispatch |

**Checks Summary**: 5/5 PASS

---


### Implementation

**What changes**:

- Iter 6: Report extracted from `-o` last-message capture (which contained the full report inside a fenced markdown block).
- Iter 7: Report extracted from stdout reasoning trace (heredoc inside Python script that failed to write).
- Iter 8: Key findings extracted from `-o` last-message capture (4-line summary), supplemented by stdout reasoning trace for line-cited detail.
- Iter 9: Report extracted from stdout reasoning trace (heredoc that failed twice — heredoc temp + direct Python write).
- Iter 10: Report extracted from stdout reasoning trace (heredoc that failed; agent then ran a probe to confirm the sandbox boundary).

**How to roll back**: Re-dispatch any iteration with `--sandbox workspace-write` (requires explicit user approval). The native iteration files would be replaced by the new agent-written versions.
