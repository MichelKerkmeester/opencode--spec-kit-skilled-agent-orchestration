# Iteration 001 -- Initial Evidence Sweep

## Iteration metadata
- run: 1
- focus: Read `external/reddit_post.md` end-to-end, extract the quantitative findings, cache-warning hooks, and audit methodology, then cross-check them against `.claude/settings.local.json`, `CLAUDE.md`, and `.claude/CLAUDE.md` with passage-anchored answers to Q1, Q2, and Q3.
- timestamp: 2026-04-06T10:02:07.349Z
- toolCallsUsed: 10
- status: insight
- newInfoRatio: 0.93
- findingsCount: 8

## Source map
| Claim | Paragraph anchor | Raw number(s) |
|---|---|---|
| Headline audit size | paragraph beginning "anthropic isn't the only reason you're hitting claude code limits." | 926 sessions |
| Daily usage baseline | paragraph beginning "Like most, my work had completely stopped." | 8-10 hours/day |
| Base session payload | paragraph beginning "I started investigating with a basic question. How much context is loaded before I even type anything?" | 45,000 tokens; ~5% of 1M; >20% of 200k |
| Cache pricing cliff | paragraph beginning "Claude Code (and every AI assistant) doesn't maintain a persistent conversation." | 5 minutes; $0.50/MTok cache read; $5/MTok input; 10x jump |
| Manual prompt/memory trimming impact | paragraph beginning "So I went manic optimizing." | 4-5k tokens; 10% reduction |
| Tool-schema overhead before config | paragraph beginning "I got curious again and looked at where the other 40k was coming from." | 20,000 tokens |
| ENABLE_TOOL_SEARCH impact | paragraph beginning "This setting only loads 6 primary tools and lazy-loads the rest on demand instead of dumping them all upfront." | 6 primary tools; 45k -> 20k; 20k -> 6k; 14,000 tokens saved/turn |
| ENABLE_TOOL_SEARCH cost math | paragraph beginning "Some rough math on what that one setting was costing me." | 22 turns/session; 308,000 tokens/session; 858 sessions; 264 million tokens; $132-$1,300 |
| Auditor coverage and spend | paragraph beginning "My stats: 858 sessions. 18,903 turns. $1,619 estimated spend across 33 days." | 858 sessions; 18,903 turns; $1,619; 33 days |
| Idle-gap cache expiry | paragraph beginning "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes." | 54%; 6,152/11,357; >5 minutes |
| Cache cliffs | paragraph beginning "The auditor flags "cache cliffs" specifically:" | 232 cliffs; 858 sessions |
| Cache-expiry waste estimate | paragraph beginning "Estimated waste: 12.3 million tokens that counted against my usage for zero value." | 12.3M tokens; $55-$600; 7.5% |
| Skill bloat | paragraph beginning "Covered above, but the dashboard makes it starker." | 42 skills; 19 had <=2 invocations; 858 sessions |
| Redundant reads | paragraph beginning "1,122 extra file reads across all sessions where the same file was read 3 or more times." | 1,122 reads; 3+ reads threshold; 33x; 28x |
| Redundant-read waste estimate | paragraph beginning "Each re-read isn't expensive on its own." | 561K tokens; $2.80-$28 |
| Bash antipatterns and edit retries | paragraph beginning "The auditor also flags bash antipatterns" | 662 bash calls; 31 retry chains |
| Hook count | paragraph beginning "After seeing the cache expiry data, I built three hooks to make it visible before it costs anything:" | 3 hooks |
| Auditor runtime | paragraph beginning "The plugin is called claude-memory, hosted on my open source claude code marketplace called claudest." | ~100 seconds first run; under 5 seconds incremental |

## Findings
### Finding F1: ENABLE_TOOL_SEARCH is confirmed as the highest-leverage config win, but Public already has it enabled
- Source passage (anchor): "paragraph beginning 'This setting only loads 6 primary tools and lazy-loads the rest on demand instead of dumping them all upfront.'"
- Source quote: "This setting only loads 6 primary tools and lazy-loads the rest on demand instead of dumping them all upfront. Starting context dropped from 45k to 20k and the system tool overhead went from 20k to 6k."
- What it documents: The post treats deferred tool loading as a one-line configuration flip with outsized per-turn savings. The claimed gain is not marginal; it halves starting context and removes 14k tokens of tool-schema overhead from every turn.
- Quantitative anchor: 45k -> 20k starting context; 20k -> 6k tool overhead; 14,000 tokens/turn
- Why it matters for Code_Environment/Public: This repo has already adopted the exact setting in `.claude/settings.local.json`, so the post does not justify a new config flip here; it validates an existing choice. The remaining work is regression prevention and observability, not rediscovery of the flag. [SOURCE: `.claude/settings.local.json:2-5`]
- Recommendation label: adopt now
- Category: config change
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json`
- Risk / ambiguity / validation cost: The reduction numbers come from one user's setup, so the absolute token delta may differ in this repo. There is also no repo-local measurement yet of first-use latency or tool discoverability after lazy-loading.
- Already implemented in this repo? yes

### Finding F2: Cache expiry is the dominant waste pattern, and it is mostly a workflow problem until surfaced in-product
- Source passage (anchor): "paragraph beginning '54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes.'"
- Source quote: "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes. Every one of those turns paid full input price instead of the cached rate."
- What it documents: The post argues the biggest waste is not output verbosity or prompt size but idle-time cache expiry. The important point is the invisibility of the cliff: the user does not change anything, but the next turn replays the full prompt at full price.
- Quantitative anchor: 54%; 6,152 of 11,357 turns; >5 minutes
- Why it matters for Code_Environment/Public: Public already has `Stop` and `SessionStart` hooks, which means the repo has the right event surface to detect stale sessions. What it lacks is cache-expiry-specific logic or messaging, so the same invisible waste category could still exist even with stronger search/tooling rules. [SOURCE: `.claude/settings.local.json:6-40`]
- Recommendation label: prototype later
- Category: hybrid
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json` hook surface plus the Claude hook scripts under `.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/`
- Risk / ambiguity / validation cost: The post mixes denominators (926 sessions in the header, 858 sessions and 11,357-turn subset in the body), so Public should treat the pattern as directionally strong but not numerically portable without its own telemetry. Detecting real cache cliffs here requires transcript or hook data that this phase does not yet collect.
- Already implemented in this repo? no

### Finding F3: The three proposed cache-warning hooks fit Public's existing hook architecture, but only partially
- Source passage (anchor): "paragraph beginning 'After seeing the cache expiry data, I built three hooks to make it visible before it costs anything:'"
- Source quote: "After seeing the cache expiry data, I built three hooks to make it visible before it costs anything:"
- What it documents: The post proposes a specific three-hook design rather than a vague "warn users more" idea. The design splits responsibilities cleanly across turn-end timestamp capture, pre-send idle-gap detection, and session-resume estimation.
- Quantitative anchor: 3 hooks
- Why it matters for Code_Environment/Public: Public already wires `Stop` and `SessionStart` hooks, and `.claude/CLAUDE.md` already gives Claude-specific `SessionStart` recovery behavior, so two of the three event surfaces exist today. The missing piece is `UserPromptSubmit`, plus cache-warning logic that coexists with `session-prime.js`, `session-stop.js`, and `compact-inject.js` without double-warning or conflicting with recovery flows. [SOURCE: `.claude/settings.local.json:6-40`; `.claude/CLAUDE.md:11-14`]
- Recommendation label: prototype later
- Category: hook implementation
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/CLAUDE.md`
- Risk / ambiguity / validation cost: The post explicitly says these hooks are "not shipped yet," so the UX has not been battle-tested. Blocking `UserPromptSubmit` once per stale turn could be useful, but it also risks frustration if it fires during legitimate long-running workflows.
- Already implemented in this repo? partial

### Finding F4: The post's preferred stale-session mitigation is behavioral: clear and restart with curated memory, not blind resume
- Source passage (anchor): "paragraph beginning 'I don't prefer /compact (which loses context) or resuming stale sessions (which pays for a full cache rebuild) for continuity.'"
- Source quote: "I don't prefer /compact (which loses context) or resuming stale sessions (which pays for a full cache rebuild) for continuity. Instead I just /clear and start a new session."
- What it documents: The post's mitigation taxonomy is not purely hook-based; it recommends a user behavior change once the warning exists. The key tradeoff is continuity versus cost: avoid dragging a long, stale transcript forward when a summarized restart will do.
- Quantitative anchor: full cache rebuild after stale resume; tied to the post's 5-minute expiry model
- Why it matters for Code_Environment/Public: Public already frames recovery as context rehydration through memory/search rather than carrying raw history forever, and Claude-specific notes already describe bootstrap guidance on `source=startup`, `source=resume`, and `source=clear`. That means the repo is philosophically aligned with the post's "clear and restart with curated context" approach, but it does not yet turn that philosophy into an idle-gap recommendation. [SOURCE: `CLAUDE.md:52-55,72-81`; `.claude/CLAUDE.md:11-14`]
- Recommendation label: prototype later
- Category: behavioral change
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`; `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/CLAUDE.md`
- Risk / ambiguity / validation cost: The repo should not hard-code "/clear over /compact" without testing continuity loss on real tasks. The right action may differ for short sessions, long sessions, or workflows that depend on exact recent transcript wording.
- Already implemented in this repo? partial

### Finding F5: The audit methodology is concrete and portable: JSONL -> SQLite -> ranked insights -> dashboard
- Source passage (anchor): "paragraph beginning 'So I built a token usage auditor.'"
- Source quote: "It walks every JSONL file, parses every turn, loads everything into a SQLite database (token counts, cache hit ratios, tool calls, idle gaps, edit failures, skill invocations), and an insights engine ranks waste categories by estimated dollar amount. It also generates an interactive dashboard with 19 charts: cache trajectories per session, cost breakdowns by project and model, tool efficiency metrics, behavioral patterns, skill usage analysis."
- What it documents: The post does not just give anecdotes; it sketches an end-to-end observability pipeline that converts raw Claude transcripts into ranked waste categories. That matters because several recommendations in the post depend on aggregate evidence, not isolated bad turns.
- Quantitative anchor: JSONL parsing of every session; SQLite load; 19-chart dashboard
- Why it matters for Code_Environment/Public: Public currently has strong policy documents and hook wiring, but no equivalent local telemetry pipeline for Claude transcript waste analysis. If Public wants evidence strong enough to justify disabling skills, adding warnings, or changing behavior, this methodology is the clearest missing capability. [SOURCE: `CLAUDE.md:34-40,47-69,122-127`; `.claude/settings.local.json:6-40`]
- Recommendation label: prototype later
- Category: hybrid
- Affected area in this repo: component gap - no existing transcript-audit pipeline in `Code_Environment/Public`
- Risk / ambiguity / validation cost: The post later notes that the JSONL format is undocumented, so any parser here would be format-fragile. The methodology is still valuable, but its storage schema and maintenance cost need scoping before adoption.
- Already implemented in this repo? no

### Finding F6: Low-usage skill telemetry is the missing evidence layer behind skill-schema bloat decisions
- Source passage (anchor): "paragraph beginning 'Covered above, but the dashboard makes it starker.'"
- Source quote: "42 skills loaded in my setup. 19 of them had 2 or fewer invocations across the entire 858-session dataset."
- What it documents: The post frames skill bloat as a measurable problem rather than a stylistic preference. It also gives a simple triage heuristic: count skill invocations across sessions and flag never-used, rarely-used, or always-erroring entries.
- Quantitative anchor: 42 skills loaded; 19 with <=2 invocations across 858 sessions
- Why it matters for Code_Environment/Public: Public already uses `skill_advisor.py` in Gate 2 to route skill usage more selectively, which is a partial hedge against spurious skill invocation. What Public does not have is a usage ledger proving which skills are dead weight in Claude context or which ones should be disabled, gated harder, or lazy-loaded. [SOURCE: `CLAUDE.md:122-127,293-317`]
- Recommendation label: prototype later
- Category: hybrid
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md` Gate 2 skill routing and future Claude transcript telemetry
- Risk / ambiguity / validation cost: The post's <=2 threshold is heuristic, not universal. Public should not disable a rarely used but mission-critical skill until it has both usage counts and a severity/impact review.
- Already implemented in this repo? partial

### Finding F7: Redundant file rereads are already a known behavioral hazard and should be treated as cache-multiplied waste
- Source passage (anchor): "paragraph beginning '1,122 extra file reads across all sessions where the same file was read 3 or more times.'"
- Source quote: "1,122 extra file reads across all sessions where the same file was read 3 or more times. Worst case: one session read the same file 33 times. Another hit 28 reads on a single file."
- What it documents: The post treats rereads as multiplicative waste, not because one read is expensive, but because every repeated file dump remains in conversation state and gets replayed on later turns. It turns a local inefficiency into a session-wide cost problem.
- Quantitative anchor: 1,122 extra rereads; 3+ read threshold; 33x and 28x worst cases
- Why it matters for Code_Environment/Public: Public's root CLAUDE guidance already tells agents to batch reads, plan all needed reads first, and avoid sequential re-reading unless unavoidable. That means the repo already encodes the right behavior, but it has no detector showing where actual Claude sessions still violate it. [SOURCE: `CLAUDE.md:51-53`; root instructions in current session mirrored by repository policy]
- Recommendation label: adopt now
- Category: behavioral change
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- Risk / ambiguity / validation cost: The policy change itself is already low risk because it matches existing repo guidance. The ambiguous part is measurement: without telemetry, Public cannot tell whether reread waste is common or only hypothetical here.
- Already implemented in this repo? partial

### Finding F8: Bash-antipattern and edit-retry detection should be added as observability, not as a replacement for Public's native-tool rules
- Source passage (anchor): "paragraph beginning 'The auditor also flags bash antipatterns'"
- Source quote: "The auditor also flags bash antipatterns (662 calls where Claude used cat, grep, find via bash instead of native Read/Grep/Glob tools) and edit retry chains (31 failed-edit-then-retry sequences)."
- What it documents: The post identifies two waste signatures that are easy to miss in one session but expensive in aggregate: shell-based file inspection instead of native tools, and repeated failed edits that replay extra context. These are detectable patterns, not just subjective complaints.
- Quantitative anchor: 662 bash antipattern calls; 31 edit-retry chains
- Why it matters for Code_Environment/Public: Public already mandates a Code Search Decision Tree and explicitly prefers CocoIndex/code graph/rg/glob/view over bash for code and file search. The gap is not policy language; it is the lack of a feedback loop that can prove whether Claude sessions still fall back to `cat`, `grep`, `find`, or retry loops often enough to matter. [SOURCE: `CLAUDE.md:34-40,51-53`]
- Recommendation label: adopt now
- Category: hybrid
- Affected area in this repo: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- Risk / ambiguity / validation cost: The behavioral recommendation is already safe because it reinforces current repo policy. Adding automated detection is costlier and should follow only after the transcript-audit methodology in F5 is scoped.
- Already implemented in this repo? partial

## Repo cross-check ledger
| Post recommendation | This repo current state | Gap | Verification source |
|---|---|---|---|
| Enable deferred tool loading with `ENABLE_TOOL_SEARCH=true` | Already enabled in local Claude settings | No config gap; only a validation/observability gap remains | `.claude/settings.local.json:2-5` |
| Use Stop hook to record idle timestamp | `Stop` hook already exists and points to `session-stop.js` | No idle-timestamp capture evidence yet; cache-warning semantics unverified | `.claude/settings.local.json:29-40` |
| Use SessionStart hook to warn about cache rebuild on resumed sessions | `SessionStart` hook already exists and points to `session-prime.js`; Claude notes already define startup/resume/clear guidance | Missing cache-rebuild estimator and warning copy | `.claude/settings.local.json:18-28`; `.claude/CLAUDE.md:11-14` |
| Add `UserPromptSubmit` hook to warn/block on >5-minute idle gap | No `UserPromptSubmit` hook is configured | Entire event surface is missing in current repo state | `.claude/settings.local.json:6-40` |
| Prefer native Read/Grep/Glob and structured code search over bash `cat`/`grep`/`find` | Root CLAUDE already mandates Code Search Decision Tree and native-tool preference | Missing telemetry/audit to detect violations in real Claude transcripts | `CLAUDE.md:34-40,51-53` |
| Detect low-usage skills and consider disabling them | Gate 2 already routes skills via `skill_advisor.py` | No usage-count pipeline or low-value skill disable list exists | `CLAUDE.md:122-127,293-317` |
| Build transcript auditor (JSONL -> SQLite -> ranked insights -> dashboard) | No equivalent analytics component is present in this repo | Full observability pipeline is absent | `CLAUDE.md:34-40,47-69`; repo cross-check by absence in `.claude/settings.local.json` |
| Favor fresh-session recovery over blindly resuming stale conversations | Recovery doctrine already emphasizes memory/bootstrap context | No idle-gap policy tells users when to prefer clear/restart vs compact/resume | `CLAUDE.md:52-55,72-81`; `.claude/CLAUDE.md:11-14` |

## Answers to key questions
- Q1 (ENABLE_TOOL_SEARCH credibility + repo state): The post's strongest configuration claim is passage-anchored in the paragraph beginning "This setting only loads 6 primary tools..." and the follow-on cost math paragraph, which report 45k -> 20k base context and 20k -> 6k tool overhead with 14k tokens saved per turn. In Public, the exact flag is already present (`.claude/settings.local.json:2-5`), so the immediate recommendation is not "turn it on" but "treat it as required baseline and measure whether lazy-loading introduces first-use latency or discoverability regressions for non-primary tools." Because no repo-local measurement exists, the post is credible as a field report but not yet a calibrated local benchmark.
- Q2 (cache expiry mitigation taxonomy): The post supports a three-part taxonomy. Hook implementation: the three-hook design is explicit in the paragraph beginning "After seeing the cache expiry data..." plus the Stop/UserPromptSubmit/SessionStart paragraphs. Behavioral change: the paragraph beginning "I don't prefer /compact..." recommends clear-and-restart with curated context rather than blindly resuming stale sessions. Pure config is comparatively weak for cache expiry in this post; unlike ENABLE_TOOL_SEARCH, there is no one-line setting that solves expiry, so Public's near-term path is hook prototypes on top of its existing `Stop` and `SessionStart` surfaces, not a simple config flip. [SOURCE: `.claude/settings.local.json:6-40`; `.claude/CLAUDE.md:11-14`]
- Q3 (skill schema bloat detection): The post's evidence threshold is session-aggregate telemetry, not intuition: "42 skills loaded" and "19 of them had 2 or fewer invocations" from the paragraph beginning "Covered above, but the dashboard makes it starker." Public already has Gate 2 skill routing via `skill_advisor.py`, which reduces unnecessary skill use, but that is not the same as measuring low-value skills in actual Claude sessions. The adoptable method is therefore: parse transcript JSONL, count skill invocations/errors, then rank candidates for disable/gating/lazy-load; until that telemetry exists, disabling a skill in Public would be guesswork. [SOURCE: `CLAUDE.md:122-127,293-317`]

## Open follow-ups for next iteration
- Inspect the actual Claude hook scripts (`compact-inject.js`, `session-prime.js`, `session-stop.js`) to see where cache-warning logic can be inserted without conflicting with existing payload formats.
- Determine whether Claude supports `UserPromptSubmit` in this repo's current runtime and settings shape, or whether a different pre-send hook/event is required.
- Look for any existing transcript, log, or SQLite artifacts in this repo or sibling phases that already approximate the JSONL -> SQLite -> insights pipeline.
- Clarify whether the 11,357-turn cache-expiry denominator is a subset of the 18,903 total turns or a reporting inconsistency that should be called out in synthesis.
- Assess whether Public has any skill inventory counts comparable to the post's "42 skills loaded" claim.

## Proposed Next Focus (for iteration 2)
Read the existing Claude hook implementations and recovery scripts end-to-end to map where cache-expiry warnings, idle timestamps, and resume-cost estimates could fit without breaking current startup/compact/stop behavior. Then assess whether Public already has any transcript or usage logs that could seed a lightweight version of the post's JSONL -> SQLite observability method.
