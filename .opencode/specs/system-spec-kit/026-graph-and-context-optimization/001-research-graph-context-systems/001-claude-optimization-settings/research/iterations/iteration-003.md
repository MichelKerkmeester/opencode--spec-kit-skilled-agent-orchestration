# Iteration 003 -- Translating bash/read/retry waste into enforceable repo signals

## Iteration metadata
- run: 3
- focus: Q5 bash-vs-native + redundant reads + edit retries + RTK
- timestamp: 2026-04-06T10:12:27.709Z
- toolCallsUsed: 6
- status: insight
- newInfoRatio: 0.57
- findingsCount: 6

## Source map
| Source | Why it matters for this iteration |
|---|---|
| `research/iterations/iteration-001.md` | Avoid duplicate claims from the initial evidence sweep, especially prior notes on rereads and bash/edit observability. |
| `research/iterations/iteration-002.md` | Avoid repeating hook-surface conclusions from Q4; keep this pass focused on enforcement and measurability. |
| `external/reddit_post.md` | Primary source for the 662 bash antipattern calls, 1,122 redundant rereads, 31 edit retry chains, JSONL/SQLite auditor design, and RTK note. |
| `CLAUDE.md` | Source of current repo defenses: mandatory tool routing, Code Search Decision Tree, Gate 2, Gate 3, read-first, and halt-on-edit-failure rules. |
| `.claude/CLAUDE.md` | Confirms the root `CLAUDE.md` remains the source of truth for Claude-runtime gates and tool routing. |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | Current telemetry scaffold: generic `tool_call` metric events plus limited fine-grained classifications. |

## Detection Mechanism Comparison
| Antipattern | Detectable in real-time? | Where? | Cost |
|---|---|---|---|
| Bash-vs-native (`cat`/`grep`/`find` through bash instead of native tools) | **Partly** | Real-time only if the runtime inspects outgoing `bash` commands before execution; fully reviewable offline from local Claude JSONL tool-call records and command strings. | **Low-medium** signal extraction, but **medium** false-positive review because some shell `grep`/`find` usage is legitimate outside code/file search. |
| Redundant file reads | **Partly** | Real-time only with per-session path tracking across `Read`/`view`/`Glob`/`Grep`/`bash cat`; most reliable as postflight JSONL reduction with normalized file paths and thresholds. | **Medium** because it needs path normalization, range-awareness, and an "unnecessary reread" heuristic rather than a raw count. |
| Edit retry chains | **Usually no single-turn detection** | Best detected from local Claude JSONL or a streaming reducer that can group a failed edit and the next retry on the same file/path. | **Medium-high** because the chain definition is sequential and depends on error parsing, same-target matching, and retry-window heuristics. |

### Q10 note: what is direct vs inferred from local Claude JSONL
1. **Directly measurable from local JSONL:** raw tool invocations, `bash` command strings, native tool names, explicit edit failures, and repeated exact file-path reads when the path is preserved in tool arguments. [SOURCE: `external/reddit_post.md:28,58-62`]
2. **Heuristic or inferred:** whether a bash call was avoidable, whether a reread was unnecessary, whether two edit failures belong to one retry chain, and the token/dollar impact of each category after cache compounding. The post itself warns that local JSONL parsing is based on an undocumented format and that dollar figures are directional rather than exact. [SOURCE: `external/reddit_post.md:95-99`]

## Findings
### Finding F1: Bash-vs-native should be treated as a prompt-rule reinforcement problem first, and a telemetry problem second
- Source passage (anchor): "paragraph beginning 'The auditor also flags bash antipatterns'"
- Source quote: "The auditor also flags bash antipatterns (662 calls where Claude used cat, grep, find via bash instead of native Read/Grep/Glob tools)..." [SOURCE: `external/reddit_post.md:62`]
- What it documents: The post's bash waste signal is not "bash is bad"; it is "bash was used where a semantically narrower native tool already existed."
- Implied root cause: Agents fall back to the universal shell because it is flexible, but that bypasses the repo's lower-token native-tool path and often returns noisier output than the purpose-built tool would.
- Current defenses in this repo: Public already mandates a Code Search Decision Tree: semantic search via CocoIndex, structural queries via `code_graph_query`, exact text via `Grep`, then file-path lookup via `Glob`, then file contents via `Read`. Claude-runtime guidance also says the root `CLAUDE.md` is the source of truth for tool routing. [SOURCE: `CLAUDE.md:37-40,53`; `.claude/CLAUDE.md:9`]
- Gap analysis: The defense is directional, not measurable. It tells the agent what to prefer, but it does not classify `bash cat`, `bash grep`, or `bash find` as a reportable violation, and the current metric layer only records generic `tool_call` plus a few special cases (`memory_recovery`, `code_graph_query`, `spec_folder_change`). [SOURCE: `CLAUDE.md:37-40`; `context-server.ts:788-803`]
- Detection options: `prompt-rule reinforcement` (explicitly name `bash cat/grep/find` as the discouraged fallback when native equivalents exist) | `telemetry` (classify shell commands into native-equivalent vs unavoidable shell use) | `postflight check` (reduce local Claude JSONL into a bash-antipattern table) | `hook` (possible only if command text is inspectable before execution) | `tooling change` (extend metric taxonomy beyond generic `tool_call`).
- Why it matters for Code_Environment/Public: Q5 does not require replacing the repo's decision tree; it requires making the existing policy auditable so the team can tell whether Claude sessions are still bypassing it in practice.
- Recommendation label: adopt now
- Category: prompt + telemetry
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/CLAUDE.md`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- Risk / ambiguity / validation cost: Low risk for prompt-rule reinforcement; medium validation cost for telemetry because "shell command was avoidable" is partly contextual and will need false-positive review.
- Already implemented in this repo? partial

### Finding F2: Redundant rereads are under-defended today because the repo has read-first rules, but not a reread detector
- Source passage (anchor): "paragraph beginning '1,122 extra file reads across all sessions where the same file was read 3 or more times.'"
- Source quote: "1,122 extra file reads across all sessions where the same file was read 3 or more times. Worst case: one session read the same file 33 times. Another hit 28 reads on a single file." [SOURCE: `external/reddit_post.md:58`]
- What it documents: The post frames rereads as a compounding problem: repeated file dumps are cheap individually, but expensive after they stay in context across later turns and cache rebuilds.
- Implied root cause: The agent does not maintain a strong enough per-turn read ledger, so it re-requests files it already saw instead of reusing context or rereading only when a change/error justifies it.
- Current defenses in this repo: Public requires "Read files first" and includes `Read` as the final stage of the Code Search Decision Tree after narrower search tools. [SOURCE: `CLAUDE.md:53,221,236`]
- Gap analysis: Those rules promote correct sequencing, but they do not define an "excessive reread" threshold, a same-file/session counter, or any postflight audit. Unlike bash-vs-native, there is not even a strongly worded negative rule in `CLAUDE.md` that says "do not reread the same file unless it changed or the prior read was insufficient." [SOURCE: `CLAUDE.md:53,221,236`]
- Detection options: `telemetry` (count normalized file-path reads across native tools and bash fallback) | `postflight check` (local Claude JSONL reducer with 3+ reread threshold and exceptions for changed files / new ranges) | `prompt-rule reinforcement` (name "reread only after change/error/new question" explicitly) | `hook` (possible, but only if the runtime can keep per-session path state) | `tooling change` (emit `file_read` metric events with normalized paths instead of only generic `tool_call`).
- Why it matters for Code_Environment/Public: Iteration 001 already noted rereads as a hazard, but Q5 clarifies the enforcement gap: the repo has prevention hints, not evidence-producing machinery. [SOURCE: `research/iterations/iteration-001.md:107-129`]
- Recommendation label: prototype later
- Category: telemetry
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- Risk / ambiguity / validation cost: Medium validation cost because legitimate rereads exist (file changed, different line range, or context was compacted away), so a detector must normalize paths and allow justified exceptions.
- Already implemented in this repo? no

### Finding F3: Edit retry chains are best translated into failure-sequence telemetry, not just stricter wording
- Source passage (anchor): "paragraph beginning 'The auditor also flags bash antipatterns'"
- Source quote: "...and edit retry chains (31 failed-edit-then-retry sequences)." [SOURCE: `external/reddit_post.md:62`]
- What it documents: The post isolates a sequential waste pattern: an edit fails, the agent tries again, and the retry sequence itself adds extra transcript bulk and often extra rereads.
- Implied root cause: The agent lacks a strong escalation boundary between "recoverable edit miss" and "I need to reread / re-anchor before trying again," so retries can turn into mini-loops.
- Current defenses in this repo: Public already says to halt when the edit tool reports "string not found," to read first, and to keep the simplest scoped change. [SOURCE: `CLAUDE.md:31,221,236`]
- Gap analysis: The repo has a correctness rule for one failed edit, but it has no detection for *chains* of failures and no per-session metric that says "this file had repeated failed edits before success." The current metric scaffold also does not emit any edit-specific events. [SOURCE: `context-server.ts:788-803`]
- Detection options: `telemetry` (emit `edit_failure` and `edit_retry` events with target path) | `postflight check` (group failed-edit-then-retry sequences from local Claude JSONL) | `prompt-rule reinforcement` (after first edit miss, require reread/replan rather than blind retry) | `tooling change` (retry taxonomy in reducer or audit dashboard) | `hook` (least attractive, because the signal is sequential rather than single-command).
- Why it matters for Code_Environment/Public: This is the antipattern least well served by the current Code Search Decision Tree. Search routing helps *before* editing, but retry chains happen after an edit failure and therefore need a separate observability layer.
- Recommendation label: prototype later
- Category: telemetry
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- Risk / ambiguity / validation cost: Medium-high validation cost because healthy correction loops and wasteful retry chains can look similar without path matching, timing windows, and error parsing.
- Already implemented in this repo? no

### Finding F4: Q5 points to a layered enforcement model: prompt rules prevent, JSONL/postflight proves, hooks only cover the narrow real-time slice
- Source passage (anchor): "paragraph beginning 'So I built a token usage auditor.'"
- Source quote: "It walks every JSONL file, parses every turn, loads everything into a SQLite database (token counts, cache hit ratios, tool calls, idle gaps, edit failures, skill invocations), and an insights engine ranks waste categories by estimated dollar amount." [SOURCE: `external/reddit_post.md:28`]
- What it documents: The post's detection stack is offline-first. It does not rely on hooks for everything; it uses local JSONL plus reduction to discover repeated waste patterns across many sessions.
- Implied root cause: Waste categories like rereads and retry chains are mostly sequence problems, so single-turn rules are necessary but insufficient.
- Current defenses in this repo: Public already has a telemetry pattern in `context-server.ts` through `recordMetricEvent(...)`, but only for coarse categories. [SOURCE: `context-server.ts:788-803`]
- Gap analysis: There is no current repo component that answers "how often did Claude bypass native tools?", "which files were reread 3+ times?", or "how many failed-edit-then-retry chains happened this week?" The repo has rule text and a generic metric hook, but not a waste-audit reducer.
- Detection options: `postflight check` (strongest fit for all three antipatterns) | `telemetry` (use current metric-event pattern as a future feeder) | `prompt-rule reinforcement` (prevention only) | `hook` (real-time warning only for the subset with a strong immediate signal, such as shell command text).
- Why it matters for Code_Environment/Public: This answers Q10 directly: raw local Claude JSONL can directly expose tool usage and failures, but waste ranking depends on heuristics and inferred token/cost models; therefore the repo should separate "signal capture" from "waste estimation." [SOURCE: `external/reddit_post.md:95-99`]
- Recommendation label: adopt now
- Category: telemetry architecture
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/context-server.ts`; any future local Claude JSONL audit workflow under this spec area
- Risk / ambiguity / validation cost: Medium. The measurement model is useful even if the absolute cost numbers are approximate, but the undocumented JSONL format creates maintenance risk. [SOURCE: `external/reddit_post.md:95-99`]
- Already implemented in this repo? partial

### Finding F5: RTK-style CLI output filtering is a secondary mitigation for unavoidable shell verbosity, not a substitute for native-tool routing
- Source passage (anchor): "paragraph beginning 'The auditor also flags bash antipatterns'"
- Source quote: "I also installed RTK (a CLI proxy that filters and summarizes command outputs before they reach your LLM context) to cut down output token bloat from verbose shell commands." [SOURCE: `external/reddit_post.md:62`]
- What it documents: RTK targets output bloat after the agent has already chosen a shell-heavy workflow.
- Implied root cause: Even justified shell usage can flood context with verbose logs, so there is a separate output-shaping problem beyond initial tool choice.
- Current defenses in this repo: Public's main defense is to avoid unnecessary shell use in the first place through the Code Search Decision Tree and native-tool preference. There is no repo rule today about proxy-filtering command output. [SOURCE: `CLAUDE.md:37-40,53`]
- Gap analysis: RTK addresses the symptom after bash is already in play. That means it overlaps most with build/test/log-tail workflows, not with the repo's search-tree rules. It also introduces an observability tradeoff: filtered output can reduce tokens, but may hide the exact raw diagnostic detail needed for debugging.
- Detection options: `tooling change` only; this is not really a prompt rule or a reliable hook pattern. `telemetry` should come first so the repo knows whether verbose shell output is a material waste source before evaluating a proxy.
- Why it matters for Code_Environment/Public: The concept is worth keeping on the table for shell-heavy validation workflows, but it should not be framed as the answer to the 662 bash-antipattern calls because those are primarily routing failures, not log-filtering failures.
- Recommendation label: prototype later
- Category: tooling change
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`; any future shell-wrapper layer outside the current spec
- Risk / ambiguity / validation cost: Medium-high. It could meaningfully reduce output tokens for unavoidable shell commands, but it adds another transformation layer between the agent and the raw command result.
- Already implemented in this repo? no

### Finding F6: Gate 2 (`skill_advisor.py`) overlaps with antipattern enforcement only as a policy-distribution surface, not as a detector
- Source passage (anchor): "Gate 2: Skill routing"
- Source quote: "Run: `python3 .opencode/skill/scripts/skill_advisor.py \"[request]\" --threshold 0.8`" and "Confidence > 0.8 -> MUST invoke recommended skill." [SOURCE: `CLAUDE.md:123-125,300-315`]
- What it documents: Gate 2 exists to steer the agent into the right skill and bundled instructions before work starts.
- Implied root cause: Better routing can indirectly reduce bash misuse and some blind retries by loading the right workflow-specific instructions earlier.
- Current defenses in this repo: Gate 2 is required for non-trivial tasks, and the Claude runtime is told to treat the root `CLAUDE.md` as authoritative. [SOURCE: `CLAUDE.md:122-125,300-317`; `.claude/CLAUDE.md:9`]
- Gap analysis: Gate 2 cannot observe whether the agent later rereads the same file 33 times, falls back to `bash cat`, or enters an edit retry chain. It is front-loaded classification, not per-tool or per-sequence telemetry.
- Detection options: `prompt-rule reinforcement` (teach skills to restate native-tool preference and failure-escalation rules) | `tooling change` (future advisor hints could mention likely antipattern risk areas) | **not** a sufficient `telemetry` substitute.
- Why it matters for Code_Environment/Public: Q5 should treat Gate 2 as an amplifier for prevention language, not as evidence that the repo already has enforcement. The overlap is real but partial.
- Recommendation label: adopt now
- Category: prompt routing
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/CLAUDE.md`
- Risk / ambiguity / validation cost: Low. The conceptual boundary is clear: Gate 2 can reduce risk upstream, but it cannot answer waste-frequency questions downstream.
- Already implemented in this repo? partial

## Key answer for Q5
Translate the post's three waste signatures into a **layered enforcement stack**, not a single mechanism:
1. **Prompt rules** for prevention: make the existing native-tool decision tree more explicit about discouraged `bash cat/grep/find`, justified rereads, and "reread/replan before retrying edit again."
2. **Telemetry + postflight reduction** for proof: use local Claude JSONL and/or the repo's metric-event pattern to count shell fallbacks, normalized rereads, and failed-edit retry chains.
3. **Hooks only where the signal is immediate and low-ambiguity**: shell-command inspection is a plausible real-time warning surface; reread and retry chains are mostly better as reducers than hooks.
4. **RTK-class tools stay secondary**: useful only for unavoidable shell-output bloat, not for correcting routing mistakes that should have used native tools in the first place.

## Open follow-ups for iteration 4+
1. Which existing local Claude JSONL fields in this environment preserve enough tool-argument detail to normalize file paths and distinguish `bash grep` from native `Grep` with low false-positive risk?
2. Should the repo's future metric taxonomy treat rereads and edit retries as raw counts only, or as thresholded "waste events" to avoid over-reporting legitimate repetition?
