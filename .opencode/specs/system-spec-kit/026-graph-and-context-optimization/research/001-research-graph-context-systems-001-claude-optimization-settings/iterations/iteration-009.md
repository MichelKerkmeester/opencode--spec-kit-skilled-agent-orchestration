# Iteration 009 -- Repo-local validation experiments and independent confidence audit

## Iteration metadata
- run: 9
- focus: validation experiments + independent confidence audit
- timestamp: 2026-04-06T11:20:00Z
- toolCallsUsed: 11
- status: insight
- newInfoRatio: 0.39
- findingsCount: 3

## A. Validation experiment table

These experiments are intentionally small, local, and measurable. They are designed to confirm or falsify the finding claims in this repo before any rollout work is treated as justified.

| F-id | Hypothesis | Experiment | Expected signal | Falsification signal | Cost (mins) | Tools needed |
|---|---|---|---|---|---:|---|
| F1 | `ENABLE_TOOL_SEARCH=true` is a real repo-local startup win, not just a copied external tip. | Run 3 matched `/context` startup tasks with `ENABLE_TOOL_SEARCH=true` and 3 with it disabled in a local settings copy. Capture startup prompt/input tokens plus first non-primary tool use from local Claude transcripts. | Startup prompt/input tokens drop materially with no task-completion regression. | No meaningful startup-token drop, or the disabled/enabled runs finish equally with indistinguishable payload size. | 25 | Claude Code, `/context`, local transcript JSONL, `node` or `python3` for tally |
| F2 | The repo still cannot honestly claim latency/discoverability gains from deferred loading unless local A/B data shows them. | Reuse the F1 A/B runs and score first non-primary-tool latency, tool-search count, bash fallback count, and turns-to-completion. | Mixed or statistically weak latency/discoverability differences, so the caution remains warranted. | Consistent improvement or regression across most runs, large enough to support a concrete claim either way. | 20 | Same F1 dataset, transcript review, stopwatch or scripted timestamps |
| F3 | Cache-expiry waste should be validated locally as a 3-signal model: prevalence, cliff count, and budget exposure. | On 20 recent local Claude transcripts, compute: turns after idle gaps over 5 minutes, adjacent-turn cache-read drops over 50 percent, and prompt-token exposure after those events. Compare the ranking against any single metric alone. | The combined 3-signal ranking surfaces more costly stale-session patterns than any one metric by itself. | One metric alone captures the same highest-cost sessions, making the 3-part model unnecessary. | 40 | Local `~/.claude/projects` JSONL, one-off `node` script, spreadsheet or CSV summary |
| F4 | Idle-timestamp capture belongs inside the existing `session-stop.js` hook rather than a second Stop surface. | Replay the Stop hook with fixture stdin and a transcript file, then inspect the persisted state payload and runtime duration. The experiment passes only if timestamp capture can be added without breaking current stop responsibilities. | Existing Stop ownership persists the needed data within timeout and with no extra hook process. | Stop hook cannot reliably persist the extra timestamp or causes timeout/behavior drift, implying a separate surface would be required. | 20 | `vitest` or fixture runner, `session-stop.js`, temp state dir, fixture transcript |
| F5 | A `UserPromptSubmit` warning hook can be prototype-validated locally without treating it as production-ready. | Build a scratch-only harness that feeds mocked `UserPromptSubmit` payloads at idle gaps of 2, 6, and 12 minutes and simulates a resend after the first warning. Measure warning count and unblock behavior. | Exactly one warning on the first stale submit, second submit proceeds, and hook output stays contract-clean. | Repeated blocking, missing timing fields, or noisy stdout/stderr makes the UX unfit even as a prototype. | 40 | Scratch hook harness, mocked stdin payloads, temp state file, `node` |
| F6 | Resume-cost estimation should live in `session-prime.js`, and it must fit the current startup token/time budget. | Feed `session-prime.js` a `source=resume` fixture plus synthetic state/transcript metadata and measure output length, runtime, and estimate quality. | A useful cost estimate fits inside current SessionStart output and remains under hook timeout. | Estimate requires a second startup hook, breaches token budget, or cannot be computed from repo-local inputs. | 35 | `session-prime.js`, fixture state/transcript, `node`, output-length check |
| F7 | The shared hook-state JSON is the correct seam for future cache-warning features. | Run a replay chain: `session-stop.js` writes state, then `session-prime.js` and a warning-hook prototype both read the same session state. Validate that one state file is sufficient for all three. | One file carries the needed fields end-to-end; no second storage layer is needed. | Warning/prime features must reparse transcripts or invent a second persistence layer because the shared state contract is insufficient. | 25 | `session-stop.js`, `session-prime.js`, `hook-state.js`, fixture session ids |
| F8 | `compact-inject.js` should remain a mitigation surface and not become the owner of stale-session warnings. | Replay `compact-inject.js` with a realistic transcript tail and check whether it can know idle-gap-at-submit or only compaction-time context. | The hook can prepare recovery context but cannot reliably own pre-submit warning logic. | PreCompact has all information needed to warn more accurately than prompt-time or stop-time surfaces. | 15 | `compact-inject.js`, transcript fixture, output/state inspection |
| F9 | For stale sessions, clear-and-rehydrate is often better than blind resume in this repo. | Run 6 matched continuation tasks after a controlled idle period. Branch A resumes the stale session. Branch B clears, starts a fresh session, then uses `memory_context(... resume ...)`. Compare prompt tokens, clarification turns, and time to first correct action. | Clear-and-rehydrate is cheaper or cleaner on most runs without quality loss. | Blind resume is consistently faster/cheaper with equal context quality. | 45 | Claude Code, local transcripts, Spec Kit Memory tools, manual task rubric |
| F10 | Reinforcing native-tool routing before adding more automation produces measurable behavior change. | Run 10 matched code-search/file-inspection tasks with current `CLAUDE.md` instructions intact, then 10 with the native-tool reminder removed from the task prompt. Count bash `cat/grep/find` fallbacks and completion turns. | Native-tool reminders reduce shell fallback and do not hurt completion. | No measurable behavior change, or reminders increase friction without reducing bash usage. | 35 | Claude Code, local transcripts, `rg`, transcript tally |
| F11 | Redundant rereads are a real compounding waste signal in this repo, not just a plausible theory. | Sample 15 local transcripts, count files read 3 or more times, then compare later prompt-token growth against nearby control segments with no rereads. | Sessions with clustered rereads show higher later prompt growth or cache exposure. | No association appears between repeated rereads and later prompt-token growth. | 40 | Local transcript JSONL, one-off parser, CSV or notebook |
| F12 | After the first failed edit, forcing reread/replan improves second-attempt success relative to blind retry. | Create 6 controlled edit tasks with an injected first miss. Branch A immediately retries. Branch B rereads the target and replans once before retrying. Measure second-attempt success and total turns. | Reread/replan improves second-attempt success or lowers total-turn cost. | Blind retry performs the same or better. | 45 | Controlled edit fixtures, Claude Code, transcript review |
| F13 | The denominator mismatches from the Reddit post should be enforced as explicit documentation, not silently normalized away. | Add a repo-local audit gate for the synthesis artifacts: require both `926/858` and `18,903/11,357` pairs plus explicit discrepancy language. Measure pass/fail across the packet research docs. | The audit catches missing discrepancy preservation and proves the rule is actionable. | The source numbers reconcile cleanly enough that no discrepancy-preservation gate is needed. | 10 | `rg`, `python3`, packet research docs |
| F14 | The cheapest useful observability layer for this repo is still an offline-first transcript auditor. | Compare two local methods on the same transcript sample: current hook-state outputs only, versus a one-off transcript audit script. Score how many questions each can answer about cache cliffs, skill usage, rereads, edit retries, and fallback behavior. | Offline transcript audit answers far more validation questions than hook-state alone. | Current hook-state outputs already answer most of the validation set. | 50 | Local transcript JSONL, hook-state files, one-off audit script |
| F15 | Skill-disable decisions need reason buckets, not just a low-usage count. | Parse local sessions for skill invocations and bucket each low-usage skill as never used, low-frequency-success, or low-frequency-error. Then review whether low-frequency-success skills exist. | At least one low-frequency skill is still useful, proving that low count alone is too weak. | All low-frequency skills are unused or all-error, supporting a raw low-usage disable rule. | 45 | Local transcript JSONL, one-off skill tally, spreadsheet |
| F16 | Reverse-engineered Claude JSONL should remain a guarded adapter because small format shifts can invalidate the parser. | Mutation-test `claude-transcript.js` with representative format drift: missing `message`, renamed usage keys, malformed lines, nested usage, and partial events. Measure undercount rate and error visibility. | Small schema shifts cause silent drops or incomplete counts, validating the guarded-adapter stance. | Parser stays robust and transparent across representative drift, weakening the fragility concern. | 30 | `claude-transcript.js`, fixture JSONL variants, `vitest` |
| F17 | If this repo ever generalizes observability across agents, the reusable layer should be schema/dashboard logic, not a shared raw parser. | Normalize two local artifacts into one report schema: Claude transcript metrics and `deep-research-state.jsonl` iteration/event records. Measure how much of the reporting layer can be shared above source-specific adapters. | Shared schema/reporting proves reusable while raw input adapters remain source-specific. | The normalization layer adds little value and parser-specific assumptions leak through the whole stack. | 30 | `deep-research-state.jsonl`, local transcript metrics, one-off normalization script |

## B. New findings from experiment-to-repo cross-reference

### Finding F18: Most of the ledger is not locally testable with the current hook telemetry alone
- Derived from: F11, F12, F14, F15, F17 experiment design.
- Repo-state basis: `claude-transcript.js` only extracts token counts/model/cache token fields, and `hook-state.js` only persists lightweight token totals, transcript offset, spec folder, and summary.
- What this adds: the current repo already has enough telemetry to test token-count claims, but not enough to validate rereads, skill-disable logic, edit-retry chains, or cross-agent portability. A richer transcript-analysis harness is therefore a prerequisite validation asset, not an optional later nicety.
- Recommendation: add a scratch or test-only transcript-audit harness before treating F11/F12/F15/F17 as locally confirmed.

### Finding F19: Cache-warning experiments depend on a dedicated idle-timestamp contract that the repo does not currently expose
- Derived from: F3, F4, F5, F6, F7 experiment design.
- Repo-state basis: `.claude/settings.local.json` wires only `PreCompact`, `SessionStart`, and `Stop`; `session-stop.js` stores metrics/summary/spec-folder state but does not currently expose a named `lastClaudeTurnAt`-style field for later warning logic.
- What this adds: using generic state update time as a proxy would make cache-warning validation noisy and ambiguous. The prerequisite is not "ship the warning hook"; it is "define a deterministic idle timestamp field and prove it survives Stop replay."
- Recommendation: validate F4 first, then use that state field in F5/F6/F7 experiments.

### Finding F20: A shared replay harness is the missing dependency edge across multiple findings
- Derived from: F4, F5, F6, F7, F8, F16 experiment design.
- Repo-state basis: the repo already contains discrete hook entrypoints (`session-stop.js`, `session-prime.js`, `compact-inject.js`) plus parser utilities, but no single replay harness that drives them against canned state/transcript fixtures.
- What this adds: six findings can be tested with the same local harness. The missing dependency is not another finding-specific prototype; it is one reusable validation scaffold for hook stdin, state files, and transcript fixtures.
- Recommendation: build the harness once in scratch/test space, then run F4/F5/F6/F7/F8/F16 through it in sequence.

## C. Independent confidence audit

Iteration 007 only scored a short-list of precursor claims, so the comparison column below names the closest scored precursor where one exists. Unmatched rows are marked `n/a`.

| F-id | My confidence (1-5) | Rationale | Closest iteration-007 score | Delta | Flag |
|---|---:|---|---|---:|---|
| F1 | 4 | Repo state confirms the flag is already enabled, but the local win is still unmeasured. | `I5-F1 = 4` | 0 | no |
| F2 | 5 | Strong negative claim: the Reddit post really does not report latency/discoverability evidence. | `I5-F2 = 5` | 0 | no |
| F3 | 4 | The source strongly supports directional cache-expiry dominance, but not exact local calibration. | `I1-F2 = 4` | 0 | no |
| F4 | 4 | Existing Stop ownership is a good fit, but the exact idle-timestamp contract is still unproven here. | `I2-F1 = 5` | 1 | no |
| F5 | 3 | Prototype plausibility is real, but prompt-block UX remains the shakiest hook recommendation in the ledger. | `I2-F2 = 4` | 1 | no |
| F6 | 4 | `session-prime.js` is the right boundary for resume guidance, but cost-estimate payload shape is still hypothetical. | `I1-F3 = 4` | 0 | no |
| F7 | 4 | Shared hook state is already real, but its current field set is not yet sufficient for all warning experiments. | `n/a` | n/a | no |
| F8 | 5 | Repo boundaries already show `compact-inject.js` is a compaction surface, not a submit-time warning surface. | `n/a` | n/a | no |
| F9 | 4 | Workflow guidance is plausible and low-risk, but still needs a matched stale-session comparison in this repo. | `n/a` | n/a | no |
| F10 | 5 | This is already aligned with current repo guidance in `CLAUDE.md`, so reinforcing it is highly credible. | `n/a` | n/a | no |
| F11 | 3 | The compounding-waste logic is believable, but this repo has not yet produced local reread counts. | `n/a` | n/a | no |
| F12 | 4 | The heuristic is sensible and cheap to test, but local second-attempt success data does not yet exist. | `n/a` | n/a | no |
| F13 | 5 | The denominator mismatch is explicit in the source and should remain explicit in synthesis. | `n/a` | n/a | no |
| F14 | 4 | Validation design strongly favors offline audit, but the repo does not yet ship the fuller auditor layer. | `n/a` | n/a | no |
| F15 | 3 | The reasoned disable-review queue is directionally right, but there is no local skill-usage dataset yet. | `n/a` | n/a | no |
| F16 | 5 | The parser is clearly dependent on undocumented JSONL shape, so guarded-adapter treatment remains well supported. | `n/a` | n/a | no |
| F17 | 4 | Shared schema/dashboard layering is a sound portability strategy, but the repo has not yet tested another raw agent source. | `n/a` | n/a | no |

## D. Suggested local validation order

1. Run F4 first to establish deterministic Stop-hook timestamp/state behavior.
2. Use that result to drive F7, then F5 and F6.
3. Build the shared replay harness from F20 before spending time on repeated manual hook checks.
4. Use F14's richer transcript-audit path before claiming local confirmation for F11, F12, F15, or F17.
5. Keep F1/F2/F3/F9/F10 as matched-run experiments that can be executed immediately on repo machines without runtime code changes.
