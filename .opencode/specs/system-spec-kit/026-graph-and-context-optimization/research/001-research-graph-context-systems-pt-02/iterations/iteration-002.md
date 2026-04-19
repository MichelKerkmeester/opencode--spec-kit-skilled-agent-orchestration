# Iteration 002 -- Cache-Warning Hooks vs Existing Hook Surface

## Iteration metadata
- run: 2
- focus: Q4 cache-warning hooks vs existing PreCompact / SessionStart / Stop architecture, with emphasis on collision risk, handler ownership, and integration placement.
- timestamp: 2026-04-06T10:07:28.666Z
- toolCallsUsed: 6
- status: insight
- newInfoRatio: 0.68
- findingsCount: 5

## Current hook surface map
| Existing hook | File path | Event | Current responsibility | Execution | Timeout | Side effects |
|---|---|---|---|---|---|---|
| `compact-inject.js` | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js` | `PreCompact` | Parse hook stdin, tail transcript, build merged compact brief, and cache it for later `SessionStart` injection; explicit comment says stdout is **not** injected here. | Sync command | 3s in `.claude/settings.local.json:7-16`; internal stdin timeout `HOOK_TIMEOUT_MS=1800ms` in `shared.js:4-5,34-49` | Writes `pendingCompactPrime.payload` + `cachedAt` into per-session hook state via `updateState(...)` (`compact-inject.js:332-346`); state file lives under `${os.tmpdir()}/speckit-claude-hooks/<project-hash>/<session-hash>.json` (`hook-state.js:4,15-23,77-90,124-143`) |
| `session-prime.js` | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js` | `SessionStart` | Emit startup / resume / clear / compact recovery sections to stdout; on `source=compact`, inject cached compact payload and recovery instructions. | Sync command | 3s in `.claude/settings.local.json:18-28`; internal stdin timeout `HOOK_TIMEOUT_MS=1800ms` in `shared.js:4-5,34-49` | Reads hook state and pending compact payload (`session-prime.js:20-61,116-131`), writes injected text to stdout (`session-prime.js:180-184`), then clears `pendingCompactPrime` after successful compact output (`session-prime.js:181-188`; `hook-state.js:97-110`) |
| `session-stop.js` | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js` | `Stop` | Async post-turn processing: parse transcript for token usage, update metrics, detect spec folder, extract session summary, and attempt context autosave. | Async command | 10s and `async: true` in `.claude/settings.local.json:29-40`; internal stdin timeout `HOOK_TIMEOUT_MS=1800ms` in `shared.js:4-5,34-49` | Updates shared hook state with metrics / spec folder / session summary (`session-stop.js:153-166,172-198`; `hook-state.js:124-143`); may invoke `generate-context.js` via `spawnSync` (`session-stop.js:46-82,198`) and therefore mutate spec-memory artifacts indirectly |

## Proposed hook surface map from the Reddit post
| Proposed hook | Event | Proposed responsibility | Blocking vs warning behavior |
|---|---|---|---|
| Stop hook | `Stop` | "records the exact timestamp after every Claude turn, so the system knows when you went idle" (`external/reddit_post.md:64-68`) | No user-visible warning; data capture only |
| UserPromptSubmit hook | `UserPromptSubmit` | "checks how long you've been idle since Claude's last response" and warns on `> 5 minutes` (`external/reddit_post.md:68-69`) | Soft block once plus warning: "run /compact first ... or re-send to proceed" |
| SessionStart hook | `SessionStart` | "for resumed sessions, reads your last transcript, estimates how many cached tokens will need re-creation, and warns you before your first prompt" (`external/reddit_post.md:70-72`) | Warning only; no block described |

## Conflict matrix (same-event pairs + required ordering notes)
| Existing hook | Proposed hook | Event | Assessment | Why | Ordering / state rule |
|---|---|---|---|---|---|
| `session-stop.js` | Stop idle-timestamp recorder | `Stop` | **ii. could be merged into a single multi-purpose handler** | Existing Stop already owns post-turn state writes through `updateState(...)` and is the only async post-response hook in the repo (`session-stop.js:146-199`; `hook-state.js:124-143`). A second Stop handler would duplicate writes to the same per-session state file. | Prefer adding `lastClaudeTurnAt` to existing state inside `session-stop.js`; do not create a second Stop script unless hook ordering is guaranteed. |
| `session-prime.js` | SessionStart cache-rebuild estimator | `SessionStart` | **ii. could be merged into a single multi-purpose handler** and **iv. separate handlers would need ordering rules** | Existing SessionStart already branches on `source` and writes stdout injection (`session-prime.js:142-188`). A second SessionStart warning hook would compete for the same limited startup token budget and could double-inject recovery copy. | Put stale-resume estimation inside `handleResume()` (or `handleStartup()` only when source implies recovery), not in a second stdout-producing SessionStart hook. |
| _none configured today_ | UserPromptSubmit idle-gap warning | `UserPromptSubmit` | **i. composes cleanly** with current architecture, but only as a new dedicated handler | No current `UserPromptSubmit` hook is configured in `.claude/settings.local.json:6-40`, so there is no same-event collision today. The collision risk is cross-event state coordination, not same-event overlap. | Read `lastClaudeTurnAt` from the existing shared hook state. If it warns once, persist an acknowledgement field in the same state file so resend does not re-block. |

### Cross-event ordering rules that emerge from the matrix
1. `session-stop.js` must remain the canonical writer of "last Claude response at" state before any `UserPromptSubmit` warning can be accurate.
2. `UserPromptSubmit` should set a warning-ack field in the existing hook state so the user's resend is not blocked repeatedly for the same idle gap.
3. `session-prime.js` should suppress stale-resume warnings for `source=compact` and `source=clear`, because those paths already emit recovery guidance and do not mean "resumed stale transcript" in the Reddit post sense.
4. `compact-inject.js` should stay an action target after a warning (`/compact`), not become the warning producer itself.

## Concrete adoption recommendation per proposed hook
| Proposed hook | Recommendation | Why | Affected file path(s) | Integration sketch |
|---|---|---|---|---|
| Stop idle-timestamp recorder | **adopt now** | Lowest-risk addition: existing Stop hook is already async, already parses transcript/state, and already writes the shared session JSON. Timestamp capture adds state, not UX. | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`; `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js` | Extend `session-stop.js` to persist `lastClaudeTurnAt` (and optionally `lastStopProcessedAt`) via existing `updateState(...)`. No new hook event or new script needed. |
| UserPromptSubmit idle-gap warning + soft block | **prototype later** | Missing event wiring in current repo, and the post explicitly says the blocking UX "needs more thought" (`external/reddit_post.md:72,89-91`). It also needs per-gap acknowledgement and suppression rules with resume/compact flows. | `.claude/settings.local.json`; new dedicated script under `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/` plus `hook-state.js` | Add a **new dedicated cache-warning hook script** for `UserPromptSubmit`; keep it separate from `session-prime.js` / `session-stop.js`. Read idle timestamp from shared hook state, write warning acknowledgement back to the same JSON, and soft-block once. |
| SessionStart cache-rebuild estimator | **adopt now** | Event already exists, and startup text injection already belongs to `session-prime.js`. The repo also already stores token estimates in Stop state, so the estimator can be approximate without reopening the transcript on the critical startup path. | `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js`; `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`; `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js` | Extend `handleResume()` inside `session-prime.js` to read stale-age + prior token snapshot from shared state and inject a resume-cost estimate. Do **not** create a second `SessionStart` script. |

## Findings
### Finding F1: The proposed Stop idle-timestamp hook should be merged into the existing async Stop handler, not added as a parallel Stop script
- Source passage (anchor): "paragraph beginning 'Stop hook -- records the exact timestamp after every Claude turn, so the system knows when you went idle'"
- Source quote: "Stop hook -- records the exact timestamp after every Claude turn, so the system knows when you went idle"
- What it documents: The post treats Stop as pure state capture: no warning copy, no user interaction, just a reliable "last Claude response" marker for later hooks.
- Quantitative anchor: one timestamp written after every turn
- Why it matters for Code_Environment/Public: Public already has exactly one configured Stop hook, and that hook already owns async post-turn bookkeeping plus all per-session state writes. The shared state store is a single JSON file under `${tmpdir}/speckit-claude-hooks/...`, so a second Stop hook would either duplicate writes or require brittle ordering assumptions. The cleaner fit is to extend `session-stop.js` and reuse `updateState(...)`. [SOURCE: `.claude/settings.local.json:29-40`; `session-stop.js:146-199`; `hook-state.js:4,15-23,77-90,124-143`]
- Recommendation label: adopt now
- Category: hook implementation
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js`
- Risk / ambiguity / validation cost: Very low UX risk, but still needs schema discipline so new fields do not collide with existing `metrics`, `sessionSummary`, or autosave state. If the timestamp is recorded too early in the Stop flow, it could describe hook execution time rather than Claude-response completion time.
- Already implemented in this repo? partial

### Finding F2: UserPromptSubmit should be a new dedicated cache-warning hook, and the soft-block UX is still prototype-only
- Source passage (anchor): "paragraph beginning 'UserPromptSubmit hook -- checks how long you've been idle since Claude's last response.'"
- Source quote: "UserPromptSubmit hook -- checks how long you've been idle since Claude's last response. If it's been more than 5 minutes, blocks your message once and warns you: 'cache expired, this turn will re-process full context from scratch. run /compact first to reduce cost, or re-send to proceed.'"
- What it documents: This hook is the only one in the three-hook design that changes immediate user flow. It does not just observe state; it actively gates a prompt and requires resend/acknowledgement behavior.
- Quantitative anchor: >5 minutes idle gap; blocks once
- Why it matters for Code_Environment/Public: There is no `UserPromptSubmit` hook configured today, so there is no same-event collision. The real risk is cross-event behavior: it must consume the timestamp written by Stop, avoid fighting with `SessionStart` warnings, and store its one-time acknowledgement in the same shared hook-state JSON. Because the post itself says the UX is not shipped and "needs more thought," this repo should not bury this behavior inside `session-prime.js` or `session-stop.js`; it needs a dedicated pre-send script and a measured rollout. [SOURCE: `.claude/settings.local.json:6-40`; `hook-state.js:4,20-23,124-143`; `external/reddit_post.md:68-72,89-91`]
- Recommendation label: prototype later
- Category: hybrid
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json`; new dedicated script under `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js`
- Risk / ambiguity / validation cost: Highest UX risk of the three proposals. The runtime contract for "block once, then allow resend" is still unverified here, and repeated warnings could become more annoying than useful if acknowledgement state is not persisted correctly.
- Already implemented in this repo? no

### Finding F3: The SessionStart cache-rebuild estimator belongs inside `session-prime.js`, but it should reuse Stop metrics instead of rereading transcripts on startup
- Source passage (anchor): "paragraph beginning 'SessionStart hook -- for resumed sessions, reads your last transcript, estimates how many cached tokens will need re-creation, and warns you before your first prompt'"
- Source quote: "SessionStart hook -- for resumed sessions, reads your last transcript, estimates how many cached tokens will need re-creation, and warns you before your first prompt"
- What it documents: The post wants a startup-time visibility layer for stale resumed sessions, but the actual goal is the warning, not necessarily transcript rereading as the only implementation path.
- Quantitative anchor: warning occurs before the first prompt of a resumed session
- Why it matters for Code_Environment/Public: Public already has a single `SessionStart` owner (`session-prime.js`) that injects startup/resume/clear/compact guidance to stdout, and it already adjusts its budget under token pressure. Separately, `session-stop.js` already stores estimated prompt/completion tokens in hook state. That means this repo can produce an approximate cache-rebuild estimate during `handleResume()` without adding another stdout-producing handler or paying transcript-parse cost on the critical startup path. [SOURCE: `.claude/settings.local.json:18-28`; `session-prime.js:19-61,115-131,175-188`; `session-stop.js:153-166`; `hook-state.js:124-143`]
- Recommendation label: adopt now
- Category: hook implementation
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js`
- Risk / ambiguity / validation cost: The estimate will be approximate unless Public captures more explicit cache-read telemetry. Startup copy can also become noisy if it fires on every resume, so it needs stale-threshold gating and suppression for `source=compact` / `source=clear`.
- Already implemented in this repo? partial

### Finding F4: `compact-inject.js` should not absorb cache-warning logic; it is a downstream mitigation target, not a visibility surface
- Source passage (anchor): "paragraph beginning 'UserPromptSubmit hook -- checks how long you've been idle since Claude's last response.'"
- Source quote: "run /compact first to reduce cost, or re-send to proceed."
- What it documents: In the post's design, `/compact` is the action suggested **after** the warning fires. It is not itself the hook that decides whether the session is stale.
- Quantitative anchor: warning offers `/compact` as one optional response
- Why it matters for Code_Environment/Public: Public's `PreCompact` hook explicitly says "stdout is NOT injected on PreCompact -- we only cache here," then writes `pendingCompactPrime` into hook state for later recovery. Repurposing `compact-inject.js` to also warn about stale idle gaps would mix a silent cache-builder with user-facing stale-session policy and would still miss the ordinary resumed-session path where no `/compact` was invoked. The right boundary is: warning hooks may recommend compaction, but compaction remains a separate hook surface. [SOURCE: `compact-inject.js:5-8,312-348,355-362`; `.claude/settings.local.json:7-16`]
- Recommendation label: reject
- Category: hook implementation
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js`
- Risk / ambiguity / validation cost: Mixing warning copy into `PreCompact` would blur responsibilities and make debugging harder when either compaction caching or idle warnings misfire. It also would not solve the "warn before first resumed prompt" requirement from the post.
- Already implemented in this repo? partial

### Finding F5: The existing shared hook-state file is the correct integration seam; adding a second cache-warning state file would create avoidable conflicts
- Source passage (anchor): "paragraph beginning 'Before these hooks, cache expiry was invisible. Now I see it before the expensive turn fires.'"
- Source quote: "Before these hooks, cache expiry was invisible. Now I see it before the expensive turn fires."
- What it documents: The core requirement is visibility at the right moment, which depends on durable state handoff between end-of-turn capture, pre-send warning, and resumed-session warning.
- Quantitative anchor: three-hook handoff across turn end, prompt submit, and session start
- Why it matters for Code_Environment/Public: The repo already has one atomic per-session state store with `saveState()` -> temp-file write -> rename semantics, and both `compact-inject.js` and `session-stop.js` already use it. `session-prime.js` also clears compact cache from the same store only after stdout write succeeds. That existing path is already the repo's conflict-resolution mechanism. Cache-warning fields should extend this JSON contract instead of creating a parallel cache-warning file that would drift from `pendingCompactPrime`, `metrics`, and `sessionSummary`. [SOURCE: `hook-state.js:4,20-23,77-90,92-110,124-143`; `compact-inject.js:332-346`; `session-prime.js:181-188`; `session-stop.js:193-198`]
- Recommendation label: adopt now
- Category: hybrid
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js`; all Claude hook scripts that read or write hook state
- Risk / ambiguity / validation cost: Schema growth must stay disciplined. If warning acknowledgement, stale-age, and resume-estimate fields are added informally, the single-state-file benefit becomes accidental coupling instead of a clear contract.
- Already implemented in this repo? partial

## New open questions for iterations 3+
1. Does this Claude runtime expose a `UserPromptSubmit` payload contract that can actually "block once, then allow resend," or would the repo need a warning-only pre-send variant instead?
2. Is `session-stop.js`'s current token snapshot (`estimatedPromptTokens`, `estimatedCompletionTokens`) enough to produce a credible stale-resume estimate, or does Q4 really require transcript-length / cache-read-ratio telemetry that the current Stop hook does not capture?
3. Should resumed-session stale warnings be suppressed when the previous action was `/compact` or `/clear`, given that `session-prime.js` already injects recovery copy for `source=compact` and `source=clear`?
