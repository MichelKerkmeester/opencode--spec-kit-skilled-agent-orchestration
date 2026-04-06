# Research: Claude Code Optimization Settings (phase 001)

## 1. Executive Summary

Code_Environment/Public should **adopt now** the documentation and rule-clarity moves that the Reddit field report supports directly: keep `ENABLE_TOOL_SEARCH=true` as the validated baseline, preserve the post's denominator discrepancies explicitly, and strengthen guidance around stale-session recovery, native-tool routing, reread discipline, and edit-miss recovery. The repo already has `ENABLE_TOOL_SEARCH=true` in `.claude/settings.local.json`, so the highest-leverage config recommendation from the post is already present; the dominant remaining external waste signal is cache expiry, which the post describes with 54% idle-gap turns and 232 cache-cliff events rather than with a new one-line setting. Immediate wins here are therefore mostly **documentation and rule clarity**, not new code. Cache-warning hook work remains a **prototype lane** because Stop and SessionStart responsibilities exist already but the `UserPromptSubmit` UX is explicitly unshipped in the source packet. Transcript auditing also remains a **prototype lane**: this phase owns the what/why, while phase `005-claudest` owns the implementation provenance for the auditor pipeline and plugin internals. The resulting recommendation split is simple: adopt the repo-facing workflow guidance now, prototype hook and observability layers later, and reject undocumented Claude JSONL as stable core infrastructure.

The skeptical pass still leaves the post directionally useful, but F21 makes the headline token and dollar arithmetic too inconsistent for ledger-grade totals, and F22 means the preferred `/clear` plus plugin-memory remedy bundle should not be treated as net-positive until its own overhead is measured. This synthesis therefore keeps the architectural signal while explicitly narrowing the quantitative and remedy-confidence claims.

## 2. Source and Discrepancies

`external/reddit_post.md` should be treated as a **primary-source field report**, not as an implementation spec. It is strong evidence for observed waste patterns, hook ideas, and an audit architecture, but it is not a canonical production contract for Claude internals, settings coverage, or runtime APIs.

The audit footprint contains unresolved denominator mismatches that should be preserved rather than normalized away:

| Discrepancy | Anchor sentence | Why it matters |
| --- | --- | --- |
| Header vs body session count | `"i did audit of 926 sessions"` vs `"My stats: 858 sessions. 18,903 turns."` | The body reuses 858 as the working dataset size, so the sampling frame is visibly inconsistent. |
| Headline turns vs cache-expiry denominator | `"My stats: 858 sessions. 18,903 turns."` vs `"54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes."` | The post never explains why 11,357 rather than 18,903 is the relevant denominator for the cache-expiry claim. |

These discrepancies are **preserved, not smoothed**. They weaken exact prevalence and budget extrapolations more than they weaken the architectural conclusions about deferred tool loading, cache cliffs, reread exposure, or offline-first auditing.

## 3. Cross-Check Against Repo State

| Post recommendation | Code_Environment/Public current state | Gap | Verification source |
| --- | --- | --- | --- |
| `ENABLE_TOOL_SEARCH` deferred loading | Already enabled in `.claude/settings.local.json` under `env.ENABLE_TOOL_SEARCH=true`. | No config gap; only local validation and honest claim-scoping remain. | `.claude/settings.local.json:1-5`; iteration-001 F1; iteration-005 F1-F2 |
| Cache-warning hooks | Repo already has `PreCompact`, `SessionStart`, and `Stop`, but none of them currently implement cache-warning behavior and there is no `UserPromptSubmit` hook. | Need prototype-only Stop timestamp capture, SessionStart resume estimate, and a dedicated pre-send warning path. | `.claude/settings.local.json:6-40`; iteration-002 hook surface map and conflict matrix |
| Code Search Decision Tree | Already mandated in `CLAUDE.md` as the preferred routing order before bash fallback. | No rulebook gap; only downstream enforcement and observability gaps remain. | `CLAUDE.md:37-40`; iteration-003 F1 |
| Gate 2 `skill_advisor.py` | Already required for non-trivial tasks. | Useful as policy-distribution and routing, but not a detector for rereads, shell fallback, or retry chains. | `CLAUDE.md:123-125,300-315`; iteration-003 F6 |
| Transcript audit pipeline | Not present in Public as a checked-in local auditor pipeline. Phase `005-claudest` is the implementation packet for the relevant plugin/auditor internals. | This phase should define adoption boundaries, not duplicate the implementation walkthrough. | iteration-006 boundary paragraph; phase-research-prompt.md:174-199 |

## 4. Findings (F1..F24)

Findings below are ordered by the updated tier map from iteration 012 rather than by numeric ID.

### F1 - `ENABLE_TOOL_SEARCH` is already the baseline win in Public
- **Source passage anchor:** "paragraph beginning `This setting only loads 6 primary tools and lazy-loads the rest on demand instead of dumping them all upfront.`"
- **Source quote:** "This setting only loads 6 primary tools and lazy-loads the rest on demand instead of dumping them all upfront. Starting context dropped from 45k to 20k and the system tool overhead went from 20k to 6k."
- **What the post documents:** The post treats deferred tool loading as the clearest one-line config win in the packet. Its claimed effect is large enough to matter at session scale rather than only at startup.
- **Why it matters for Code_Environment/Public:** Public already has the exact setting enabled, so the field report validates an existing choice instead of uncovering a missing configuration. The remaining repo task is to avoid overclaiming local performance gains that have not been measured here.
- **Recommendation:** adopt now
- **Tier:** 1
- **Category:** config change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json`
- **Already implemented in this repo?** yes
- **Confidence:** 4
- **Risk / validation cost:** Low operational risk because the flag is already on. Validation cost is limited to repo-local A/B or workflow checks if Public later wants to make local performance claims.

### F2 - Do not overclaim deferred-loading latency or discoverability gains
- **Source passage anchor:** "paragraph beginning `This setting only loads 6 primary tools and lazy-loads the rest on demand instead of dumping them all upfront.`"
- **Source quote:** "lazy-loads the rest on demand"
- **What the post documents:** The source explains the mechanism for deferred loading, but it does not provide a first-tool latency benchmark, a discoverability benchmark, or a task-completion ergonomics comparison.
- **Why it matters for Code_Environment/Public:** Public can safely say the post supports lower upfront schema payload, but it cannot honestly say the post proves better or worse first-use responsiveness in this repo. That boundary matters because the repo runs a richer startup environment than the field report describes.
- **Recommendation:** adopt now
- **Tier:** 1
- **Category:** config change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Already implemented in this repo?** partial
- **Confidence:** 5
- **Risk / validation cost:** Low cost to state this honestly. The real cost is deferred to any later local measurement plan if the repo wants stronger claims.

### F13 - Preserve the post's denominator mismatches explicitly
- **Source passage anchor:** "paragraph beginning `anthropic isn't the only reason you're hitting claude code limits.`"; "paragraph beginning `My stats: 858 sessions. 18,903 turns. $1,619 estimated spend across 33 days.`"; "paragraph beginning `54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes.`"
- **Source quote:** "i did audit of 926 sessions"; "My stats: 858 sessions. 18,903 turns."; "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes."
- **What the post documents:** The source contains a real dataset mismatch that the synthesis cannot resolve from within the packet. The safest reading is to preserve the inconsistency while using it to bound the precision of later claims.
- **Why it matters for Code_Environment/Public:** This canonical synthesis is the place where the discrepancy either gets preserved or erased. If Public smooths it away now, later planning documents will repeat an artificial precision that the source itself does not support. F21 raises this from a transparency note to an audit boundary because the denominator mismatch now also collides with the post's own headline cost arithmetic.
- **Recommendation:** adopt now
- **Tier:** 1
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** Minimal cost to preserve. The real risk lies in future summaries that flatten the discrepancy for convenience or ignore the F21 audit boundary.

### F19 - Idle-timestamp contract is a prerequisite
- **Source passage anchor:** "iteration-009 Finding F19 repo-state derivative"
- **Source quote:** "no source quote -- repo-state derivative finding"
- **What the post documents:** Iteration 009 showed that the repo's current hook wiring is compatible with stale-session experiments only if a dedicated semantic idle timestamp exists rather than an inferred file-update proxy.
- **Why it matters for Code_Environment/Public:** The first dependency edge is not the warning UX itself. It is a deterministic `lastClaudeTurnAt`-style contract that survives Stop replay and can be read consistently by later warning prototypes.
- **Recommendation:** prototype later
- **Tier:** 1
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** Low implementation scope but high dependency value. Using `updatedAt` as a proxy would make later cache-warning validation noisy and ambiguous.

### F20 - Shared hook replay harness is the missing scaffold
- **Source passage anchor:** "iteration-009 Finding F20 repo-state derivative"
- **Source quote:** "no source quote -- repo-state derivative finding"
- **What the post documents:** Iteration 009 established that the repo already has the right discrete hook entrypoints and parser utilities, but not one reusable replay harness that drives them against the same fixture and state layout.
- **Why it matters for Code_Environment/Public:** One reusable harness unlocks F4, F5, F6, F7, F8, and F16 without six bespoke validation paths. That makes it a top-priority prerequisite rather than background test ergonomics.
- **Recommendation:** prototype later
- **Tier:** 1
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** Moderate setup cost, but it prevents repeated one-off validation work and reduces false confidence from ad hoc prototype runs.

### F21 - Headline arithmetic is too inconsistent for ledger-grade totals
- **Source passage anchor:** "paragraph beginning `Starting context dropped from 45k to 20k and the system tool overhead went from 20k to 6k.`"; "paragraph beginning `Across 858 sessions, that's 264 million tokens...`"; "paragraph beginning `My stats: 858 sessions. 18,903 turns.`"; "paragraph beginning `Estimated waste: 12.3 million tokens... roughly 7.5% of my total input budget.`"
- **Source quote:** "Across 858 sessions, that's 264 million tokens" and "Estimated waste: 12.3 million tokens... roughly 7.5% of my total input budget"
- **What the post documents:** Iteration 010 showed that the post's own extrapolated token totals do not reconcile cleanly across the same narrative, even before local validation is considered.
- **Why it matters for Code_Environment/Public:** This is the clearest skeptical correction that needs to land in synthesis before any downstream packet treats the post's token and dollar totals as settled accounting. The post remains useful directionally, but its headline totals are rhetorical upper-bound framing unless a denominator map is supplied.
- **Recommendation:** adopt now
- **Tier:** 1
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** Low writing cost and high synthesis value. Ignoring it would let later planning inherit unreconciled token and dollar rhetoric as if it were ledger-grade fact.

### F24 - Hook replay must isolate side effects
- **Source passage anchor:** "iteration-011 Finding F24 prototype-design derivative"
- **Source quote:** "no source quote -- repo-state derivative finding"
- **What the post documents:** Iteration 011 surfaced that replay quality depends not only on fixtures and a harness but also on isolation from current Stop-hook side effects such as autosave and shared temp-state writes.
- **Why it matters for Code_Environment/Public:** Prototype evidence can be polluted even when the core hook logic is correct. Follow-on replay work therefore needs isolated `TMPDIR` and an explicit autosave stub or disable path before results are compared.
- **Recommendation:** adopt now
- **Tier:** 1
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** High if ignored, because prototype evidence can look deterministic while hidden state writes or autosave behavior are contaminating the run.

### F4 - Merge idle-timestamp capture into existing `session-stop.js`
- **Source passage anchor:** "paragraph beginning `Stop hook -- records the exact timestamp after every Claude turn, so the system knows when you went idle`"
- **Source quote:** "Stop hook -- records the exact timestamp after every Claude turn, so the system knows when you went idle"
- **What the post documents:** The post's Stop hook is a pure state-capture surface. It is meant to persist the last-turn timestamp without presenting user-facing copy.
- **Why it matters for Code_Environment/Public:** Public already has one async Stop owner and one shared hook-state file, so the cleanest fit is to extend that existing handler instead of adding a parallel Stop script. That preserves current ownership boundaries and avoids duplicate writes to the same per-session state.
- **Recommendation:** prototype later
- **Tier:** 2
- **Category:** hook implementation
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-stop.js`
- **Already implemented in this repo?** partial
- **Confidence:** 4
- **Risk / validation cost:** Low UX risk because the change is state-only. The main validation burden is schema discipline inside the shared hook-state contract and the F19 prerequisite field definition.

### F6 - Put stale-resume cost estimation inside `session-prime.js`
- **Source passage anchor:** "paragraph beginning `SessionStart hook -- for resumed sessions, reads your last transcript, estimates how many cached tokens will need re-creation, and warns you before your first prompt`"
- **Source quote:** "SessionStart hook -- for resumed sessions, reads your last transcript, estimates how many cached tokens will need re-creation, and warns you before your first prompt"
- **What the post documents:** The post wants visibility before the first prompt in a resumed stale session. The warning is the core requirement; rereading the transcript is the post's implementation path, not the only imaginable one.
- **Why it matters for Code_Environment/Public:** Public already has `session-prime.js` as the single SessionStart owner and already stores token estimates in Stop state. That makes `session-prime.js` the correct place for an approximate resume-cost warning if the repo prototypes this later.
- **Recommendation:** prototype later
- **Tier:** 2
- **Category:** hook implementation
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/session-prime.js`
- **Already implemented in this repo?** partial
- **Confidence:** 4
- **Risk / validation cost:** Moderate validation cost because the estimate would still be approximate. Startup copy also needs suppression rules so it does not double-warn on `source=compact` or `source=clear`.

### F7 - Reuse the shared hook-state JSON as the cache-warning seam
- **Source passage anchor:** "paragraph beginning `Before these hooks, cache expiry was invisible. Now I see it before the expensive turn fires.`"
- **Source quote:** "Before these hooks, cache expiry was invisible. Now I see it before the expensive turn fires."
- **What the post documents:** The post's cache-warning design depends on reliable handoff across Stop, pre-send, and resumed-session surfaces. That implies persistent shared state rather than isolated per-hook memory.
- **Why it matters for Code_Environment/Public:** Public already has one atomic per-session hook-state store used by `compact-inject.js`, `session-prime.js`, and `session-stop.js`. Extending that file is less risky than introducing a second cache-warning-specific state store.
- **Recommendation:** prototype later
- **Tier:** 2
- **Category:** hook implementation
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/hook-state.js`
- **Already implemented in this repo?** partial
- **Confidence:** 4
- **Risk / validation cost:** Low-to-moderate risk if the state contract remains explicit. Informal field growth would create coupling and make warning suppression logic harder to reason about later.

### F10 - Reinforce native-tool routing before adding more automation
- **Source passage anchor:** "paragraph beginning `The auditor also flags bash antipatterns`"
- **Source quote:** "The auditor also flags bash antipatterns (662 calls where Claude used cat, grep, find via bash instead of native Read/Grep/Glob tools)..."
- **What the post documents:** The problem is not shell usage in the abstract. It is shell usage where semantically narrower native tools already existed and would have returned less noisy context.
- **Why it matters for Code_Environment/Public:** Public already has the right decision tree in `CLAUDE.md`, so the repo should strengthen and preserve that routing guidance before it spends effort on new automation layers. This is one of the clearest "documentation first" recommendations in the packet.
- **Recommendation:** adopt now
- **Tier:** 2
- **Category:** behavioral change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- **Already implemented in this repo?** yes
- **Confidence:** 5
- **Risk / validation cost:** Very low risk because it reinforces existing policy. Future telemetry can still be added later without changing the core guidance.

### F14 - The missing observability layer is an offline-first transcript auditor
- **Source passage anchor:** "paragraph beginning `So I built a token usage auditor.`"
- **Source quote:** "It walks every JSONL file, parses every turn, loads everything into a SQLite database (token counts, cache hit ratios, tool calls, idle gaps, edit failures, skill invocations), and an insights engine ranks waste categories by estimated dollar amount. It also generates an interactive dashboard with 19 charts..."
- **What the post documents:** The source gives a concrete end-to-end observability pipeline rather than only a complaint list. That pipeline explains how the post discovered its aggregate waste categories in the first place.
- **Why it matters for Code_Environment/Public:** Public already has strong rules and hook surfaces, but it does not have the measurement layer that could prove where those rules fail in practice. This is now a prerequisite validation asset for F11, F12, F15, and F17, while the concrete implementation lane still belongs to phase `005-claudest`.
- **Recommendation:** prototype later
- **Tier:** 2
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** Moderate implementation cost and ongoing maintenance cost. The architecture is compelling, but it depends on ingesting runtime artifacts that this phase does not own.

### F16 - Reverse-engineered Claude JSONL must stay a guarded adapter, not core infra
- **Source passage anchor:** "paragraph beginning `limitations worth noting:`"
- **Source quote:** "the JSONL parsing depends on Claude Code's local file format, which isn't officially documented. works on the current format but could break if Anthropic changes it."
- **What the post documents:** The post explicitly disclaims parser stability. That means the most fragile part of the auditor architecture is the reverse-engineered ingest contract, not the database or dashboard layers.
- **Why it matters for Code_Environment/Public:** Public should not promote undocumented Claude JSONL into a trusted, stable substrate for shared observability. If phase `005-claudest` prototypes an ingest path, it should remain a guarded adapter with coverage counters, explicit parse-failure visibility, an `unknown` bucket, and fail-closed behavior rather than a core guarantee.
- **Recommendation:** reject as core infra; prototype later as adapter
- **Tier:** 2
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/005-claudest/`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** High if ignored, because a silent format drift could keep dashboards green while the underlying waste math is wrong. Validation must focus on coverage and parser-failure visibility, not only on successful runs.

### F18 - Current hook telemetry cannot validate most of the ledger
- **Source passage anchor:** "iteration-009 Finding F18 repo-state derivative"
- **Source quote:** "no source quote -- repo-state derivative finding"
- **What the post documents:** Iteration 009 showed that the repo's current hook-state and transcript extraction surfaces can support some token-count checks but not most of the validation questions implied by the ledger.
- **Why it matters for Code_Environment/Public:** Without a richer transcript-audit harness, Public cannot honestly call F11, F12, F15, or F17 locally proven. That makes this a near-term validation-planning constraint rather than a background tooling note.
- **Recommendation:** prototype later
- **Tier:** 2
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/`
- **Already implemented in this repo?** no
- **Confidence:** 5
- **Risk / validation cost:** Moderate because the missing evidence layer can create false certainty if downstream packets mistake current hook telemetry for a full observability story.

### F22 - Remedy bundle is not net-costed
- **Source passage anchor:** "paragraph beginning `the answer was 45,000 tokens`"; "paragraph beginning `Starting context dropped from 45k to 20k`"; "paragraph beginning `Instead I just /clear and start a new session.`"
- **Source quote:** "Instead I just /clear and start a new session."
- **What the post documents:** Iteration 010 showed that the post promotes a `/clear` plus plugin-memory remedy stack without measuring the plugin's own added context, hook, and skill overhead against the claimed savings.
- **Why it matters for Code_Environment/Public:** The optimization argument is one-sided until remediation overhead is netted out. Public should therefore narrow the recommendation to "promising but not yet net-costed" rather than treating the remedy bundle as obviously cheaper.
- **Recommendation:** adopt now
- **Tier:** 2
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Already implemented in this repo?** no
- **Confidence:** 4
- **Risk / validation cost:** Low synthesis cost, but high decision risk if skipped because later recommendations could inherit an un-netted remedy framing.

### F3 - Cache expiry should be modeled with prevalence, cliff count, and budget exposure
- **Source passage anchor:** "paragraph beginning `54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes.`"; "paragraph beginning `The auditor flags "cache cliffs" specifically:`"; "paragraph beginning `Estimated waste: 12.3 million tokens that counted against my usage for zero value.`"
- **Source quote:** "54% of my turns (6,152 out of 11,357) followed an idle gap longer than 5 minutes."; "232 of those across 858 sessions..."; "Estimated waste: 12.3 million tokens... roughly 7.5% of my total input budget..."
- **What the post documents:** The source does not rely on a single noisy percentage. It frames cache expiry as dominant through three layers at once: measured prevalence, cliff-event count, and estimated budget exposure.
- **Why it matters for Code_Environment/Public:** This remains the right synthesis frame for Public even before local telemetry exists, but it should now be read as qualitative guidance rather than numerically settled budget accounting. F21 is the reason to preserve the model while narrowing the arithmetic confidence.
- **Recommendation:** adopt now
- **Tier:** 3
- **Category:** behavioral change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Already implemented in this repo?** no
- **Confidence:** 3
- **Risk / validation cost:** Low writing risk, because this is a synthesis-model recommendation rather than a code change. Repo-local calibration still requires instrumentation that does not yet exist.

### F8 - Keep `compact-inject.js` as mitigation target, not warning owner
- **Source passage anchor:** "paragraph beginning `UserPromptSubmit hook -- checks how long you've been idle since Claude's last response.`"
- **Source quote:** "run /compact first to reduce cost, or re-send to proceed."
- **What the post documents:** In the source design, `/compact` is a response the warning may recommend. It is not the surface that decides whether the session is stale.
- **Why it matters for Code_Environment/Public:** Public's `PreCompact` hook is currently a silent cache-builder, and it already has a narrow, well-defined responsibility. Moving stale-warning ownership into `compact-inject.js` would blur boundaries and still miss resumed sessions that never invoked `/compact`.
- **Recommendation:** reject
- **Tier:** 3
- **Category:** hook implementation
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skill/system-spec-kit/mcp_server/dist/hooks/claude/compact-inject.js`
- **Already implemented in this repo?** partial
- **Confidence:** 5
- **Risk / validation cost:** High boundary risk relative to its value. It creates responsibility overlap without satisfying the post's own "warn before the expensive turn" intent.

### F11 - Treat redundant rereads as cache-amplified waste
- **Source passage anchor:** "paragraph beginning `1,122 extra file reads across all sessions where the same file was read 3 or more times.`"
- **Source quote:** "Each re-read isn't expensive on its own. But the output from every read sits in your conversation context for every subsequent turn. In a long session that's already cache-stressed, redundant reads pad the context that gets re-processed at full price every time the cache expires."
- **What the post documents:** The source reframes rereads from a local nuisance into a session-wide replay cost. Their real impact grows when they inflate the prefix that later gets rebuilt after cache expiry.
- **Why it matters for Code_Environment/Public:** Public already tells agents to batch reads and avoid sequential rereads when unnecessary, but it does not yet name rereads as cache-amplified waste. This framing sharpens why the existing discipline matters without requiring new tooling, while F18 explains why it is not yet locally validated.
- **Recommendation:** adopt now
- **Tier:** 3
- **Category:** behavioral change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- **Already implemented in this repo?** partial
- **Confidence:** 3
- **Risk / validation cost:** Low policy risk. Measurement remains a later problem because legitimate rereads still exist and need exception handling if a detector is added.

### F12 - Break edit-retry chains by reread/replan after the first miss
- **Source passage anchor:** "paragraph beginning `The auditor also flags bash antipatterns`"
- **Source quote:** "edit retry chains (31 failed-edit-then-retry sequences)."
- **What the post documents:** The post isolates a sequential waste pattern rather than just isolated edit errors. A failed edit followed by another attempt can replay extra context, prompt another reread, and turn into a mini-loop.
- **Why it matters for Code_Environment/Public:** Public already lists `"string not found"` as a halt condition, but it does not yet say what should happen **after** that first miss. The lowest-effort improvement is a workflow rule: reread or re-anchor before any second edit attempt.
- **Recommendation:** adopt now
- **Tier:** 3
- **Category:** behavioral change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- **Already implemented in this repo?** partial
- **Confidence:** 4
- **Risk / validation cost:** Low documentation risk and moderate interpretive risk. The post does not partition root causes, so the repo should phrase this as a chain-breaking rule rather than a claim about why every retry happens.

### F23 - Skill-disable review needs a baseline-window contract
- **Source passage anchor:** "iteration-011 Finding F23 prototype-design derivative"
- **Source quote:** "no source quote -- repo-state derivative finding"
- **What the post documents:** Iteration 011 showed that a disable-review queue cannot honestly emit labels like `never_used` or `low_frequency` without a declared observation window, denominator, and routing-attempt context.
- **Why it matters for Code_Environment/Public:** F15 already rejects raw low-usage auto-disable. F23 sharpens that into a prerequisite contract: baseline period, session count, routing attempts, and error buckets must be defined before any queue output is interpreted.
- **Recommendation:** adopt now
- **Tier:** 3
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- **Already implemented in this repo?** no
- **Confidence:** 4
- **Risk / validation cost:** Moderate. Without a baseline-window contract, the queue can look rigorous while still emitting misleading or unfair labels.

### F5 - Add a dedicated `UserPromptSubmit` warning hook and keep it prototype-only
- **Source passage anchor:** "paragraph beginning `UserPromptSubmit hook -- checks how long you've been idle since Claude's last response.`"
- **Source quote:** "UserPromptSubmit hook -- checks how long you've been idle since Claude's last response. If it's been more than 5 minutes, blocks your message once and warns you: 'cache expired, this turn will re-process full context from scratch. run /compact first to reduce cost, or re-send to proceed.'"
- **What the post documents:** This is the only hook in the three-hook design that actively changes immediate user flow. It depends on a one-time soft block and an acknowledgement path rather than only on state capture or startup copy.
- **Why it matters for Code_Environment/Public:** No same-event collision exists today because Public has no `UserPromptSubmit` hook, but the runtime behavior is still explicitly unshipped in the source. The clean repo move is to treat this as a dedicated experimental hook rather than to hide it inside existing startup or stop handlers.
- **Recommendation:** prototype later
- **Tier:** 4
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.claude/settings.local.json`
- **Already implemented in this repo?** no
- **Confidence:** 3
- **Risk / validation cost:** Highest UX risk among the hook ideas. The repo does not yet have proof that "block once, then allow resend" behaves well under real Claude runtime conditions and F24 shows how easy it is to pollute prototype evidence.

### F9 - Prefer clear-and-rehydrate guidance over blind stale resume
- **Source passage anchor:** "paragraph beginning `I don't prefer /compact (which loses context) or resuming stale sessions (which pays for a full cache rebuild) for continuity.`"
- **Source quote:** "I don't prefer /compact (which loses context) or resuming stale sessions (which pays for a full cache rebuild) for continuity. Instead I just /clear and start a new session."
- **What the post documents:** The source recommends a behavioral response to stale sessions once the warning exists: stop dragging an old transcript forward and restart with curated context instead.
- **Why it matters for Code_Environment/Public:** Public already frames recovery as context bootstrap and memory/search rehydration rather than as endless raw-transcript continuity. That remains directionally aligned, but F22 means the preferred remedy bundle is not yet net-costed, so this should stay as a local-validation-needed prototype recommendation rather than a strong adopt-now rule.
- **Recommendation:** prototype later
- **Tier:** 4
- **Category:** behavioral change
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- **Already implemented in this repo?** partial
- **Confidence:** 3
- **Risk / validation cost:** Low documentation risk if phrased cautiously. The real cost is a matched stale-session comparison that proves the repo-local path is actually cleaner or cheaper after remedy overhead is netted.

### F15 - Skill gating needs a reasoned disable-review queue, not raw low-usage auto-disable
- **Source passage anchor:** "paragraph beginning `Covered above, but the dashboard makes it starker.`"
- **Source quote:** "42 skills loaded in my setup. 19 of them had 2 or fewer invocations across the entire 858-session dataset." and "The dashboard has a 'skills to consider disabling' table that flags low-usage skills automatically with a reason column (never used, low frequency, errors on every run)."
- **What the post documents:** The source's strongest disable signal is not a raw usage threshold alone. It is a review queue with explicit buckets such as never used, low frequency, and errors on every run.
- **Why it matters for Code_Environment/Public:** Public already uses Gate 2 skill routing, but it still has no usage ledger proving which skills are dead weight in Claude sessions. If the repo ever audits skills, it should review never-used or always-erroring entries first instead of treating any low-frequency skill as automatically disposable, and F23 now makes a declared baseline-window contract a prerequisite for calling that review honest.
- **Recommendation:** prototype later
- **Tier:** 4
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/CLAUDE.md`
- **Already implemented in this repo?** no
- **Confidence:** 3
- **Risk / validation cost:** Moderate because repo-local counts do not exist yet. A bad threshold or missing denominator contract could disable rarely used but still important capabilities.

### F17 - Cross-agent rollout should share schema and dashboard layers, not a single parser
- **Source passage anchor:** "paragraph beginning `One more thing. This auditor isn't only useful if you're a Claude Code user.`"
- **Source quote:** "As long as the agent writes a raw session file, you can observe the same waste patterns... the architecture ports."
- **What the post documents:** The portability claim is conditional. The architecture ports only when each runtime exposes some raw session artifact, which means the ingest edge cannot be assumed to be uniform.
- **Why it matters for Code_Environment/Public:** Public already supports Claude, Codex, Gemini, and Copilot runtime surfaces, so the right portability move is to share the middle and downstream layers first. A single Claude-shaped parser would be the wrong foundation for cross-CLI observability.
- **Recommendation:** prototype later
- **Tier:** 4
- **Category:** hybrid
- **Affected area:** `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/001-claude-optimization-settings/research/research.md`
- **Already implemented in this repo?** no
- **Confidence:** 3
- **Risk / validation cost:** Moderate-high because raw transcript availability is still unverified outside Claude in this packet. Portability should therefore start with schema and dashboard design, not with shared parser assumptions.

## 5. Config-Change Checklist for `.claude/settings.local.json`

```json
{
  "alreadyInRepo": [
    {
      "type": "env",
      "key": "ENABLE_TOOL_SEARCH",
      "value": "true",
      "status": "already_in_repo",
      "why": "Matches the post's explicit deferred tool loading recommendation."
    }
  ],
  "recommendedAdditions": [
    {
      "type": "env",
      "key": "CACHE_WARNING_IDLE_THRESHOLD_MINUTES",
      "proposedValue": "5",
      "status": "recommended_addition",
      "sourceType": "implied_repo_local",
      "why": "The post's warning flow uses a >5 minute idle gap, but the repo has no explicit tunable threshold yet."
    },
    {
      "type": "env",
      "key": "CACHE_WARNING_RESUME_ESTIMATE_ENABLED",
      "proposedValue": "true",
      "status": "recommended_addition",
      "sourceType": "implied_repo_local",
      "why": "Lets SessionStart resume-cost warnings be prototyped separately from the rest of startup priming."
    },
    {
      "type": "env",
      "key": "CACHE_WARNING_SOFT_BLOCK_ONCE",
      "proposedValue": "true",
      "status": "recommended_addition",
      "sourceType": "implied_repo_local",
      "why": "Matches the post's block-once-then-resend idea if Public prototypes that UX."
    }
  ],
  "recommendedHookAdditions": [
    {
      "event": "Stop",
      "status": "recommended_hook_addition",
      "implementation": "merge into existing session-stop.js",
      "why": "Persist lastClaudeTurnAt so later warning hooks can measure idle gap."
    },
    {
      "event": "SessionStart",
      "status": "recommended_hook_addition",
      "implementation": "merge into existing session-prime.js",
      "why": "Estimate resumed-session cache rebuild cost before the first prompt."
    },
    {
      "event": "UserPromptSubmit",
      "status": "recommended_hook_addition",
      "implementation": "new dedicated hook script",
      "phase": "prototype_later",
      "why": "Warn or soft-block once when the idle gap exceeds the configured threshold."
    }
  ],
  "outOfScopeForThisPhase": [
    {
      "item": "Changing compaction defaults",
      "status": "out_of_scope"
    },
    {
      "item": "Treating implied cache-warning flags as if they were quoted post settings",
      "status": "out_of_scope"
    },
    {
      "item": "Publishing local latency or discoverability claims without measurement",
      "status": "out_of_scope"
    },
    {
      "item": "Enabling a transcript auditor from this phase",
      "status": "out_of_scope"
    }
  ]
}
```

Per-key narrative:

- **Already in repo — `ENABLE_TOOL_SEARCH=true`:** This is the only clearly post-backed configuration move already present in Public. The synthesis should treat it as a validated baseline, not as new work.
- **Recommended addition — `CACHE_WARNING_IDLE_THRESHOLD_MINUTES`:** This is a repo-local experimental key implied by the post's `> 5 minutes` warning threshold. It is documentation for later hook design, not a source-quoted production setting.
- **Recommended addition — `CACHE_WARNING_RESUME_ESTIMATE_ENABLED`:** This separates a resume-cost prototype from the rest of startup priming. The post supports the behavior class, while the exact flag is a repo-local design choice.
- **Recommended addition — `CACHE_WARNING_SOFT_BLOCK_ONCE`:** This exists only to make the one-time warning UX explicit if Public prototypes it later. Because the post says the UX still needs more thought, this key should remain firmly in prototype territory.
- **Recommended hook addition — `Stop`:** No new event is needed; the repo should eventually extend the existing Stop handler rather than create a second Stop script.
- **Recommended hook addition — `SessionStart`:** No second startup handler should be introduced. If prototyped later, this belongs inside `session-prime.js`.
- **Recommended hook addition — `UserPromptSubmit`:** This is the only truly new hook surface implied by the post, and it should stay experimental until the runtime contract and acknowledgement behavior are validated.
- **Out of scope for this phase:** This phase documents the what/why. It does not turn this checklist into runtime changes, and it does not pretend that the post published a complete production-ready settings catalog.

## 6. Hook Design Recommendations

Existing hook surface map:

| Existing hook | Event | Current responsibility | Why it matters here |
| --- | --- | --- | --- |
| `compact-inject.js` | `PreCompact` | Builds and caches compact-recovery payload; stdout is not injected here. | It is a mitigation/action surface, not a stale-warning surface. |
| `session-prime.js` | `SessionStart` | Emits startup, resume, clear, and compact recovery text to stdout. | It already owns startup/resume copy, so any resume-cost warning belongs here if prototyped. |
| `session-stop.js` | `Stop` | Async post-turn processing, metrics, spec detection, summary extraction, and autosave. | It already owns post-turn state writes, so idle timestamp capture belongs here if prototyped. |

Proposed hook surface from the post:

| Proposed hook | Event | Proposed responsibility | Blocking vs warning behavior |
| --- | --- | --- | --- |
| Stop hook | `Stop` | Record the exact timestamp after every Claude turn. | Data capture only |
| UserPromptSubmit hook | `UserPromptSubmit` | Check idle duration before send and warn on stale cache. | Soft block once plus warning |
| SessionStart hook | `SessionStart` | Estimate cache rebuild cost for resumed sessions before first prompt. | Warning only |

Conflict matrix from iteration-002:

| Existing hook | Proposed hook | Assessment | Required rule |
| --- | --- | --- | --- |
| `session-stop.js` | Stop idle-timestamp recorder | Could be merged into a single multi-purpose handler. | `session-stop.js` remains the canonical writer of last-response timing state. |
| `session-prime.js` | SessionStart cache-rebuild estimator | Could be merged, but separate handlers would need ordering rules and would compete for startup budget. | Put stale-resume estimation inside `handleResume()` rather than in a second stdout-producing SessionStart hook. |
| none today | UserPromptSubmit idle-gap warning | Composes cleanly only as a new dedicated handler. | Read Stop-written state, then persist a one-time acknowledgement in the same shared hook-state file. |

Cross-event rules that fall out of the matrix:

1. `session-stop.js` must remain the source of truth for "last Claude response at" state.
2. `UserPromptSubmit` must persist acknowledgement state so the resend path does not loop.
3. `session-prime.js` should suppress stale-resume copy for `source=compact` and `source=clear`.
4. `compact-inject.js` should stay the action target after a warning, not the producer of the warning itself.

Per-hook recommendation from F4-F8:

- **F4 / Stop:** Prototype later by extending `session-stop.js`; no new Stop script.
- **F5 / UserPromptSubmit:** Prototype later as a new dedicated hook; do not treat it as ready for default rollout.
- **F6 / SessionStart:** Prototype later inside `session-prime.js`; do not add a second SessionStart writer.
- **F7 / shared state:** Prototype later by extending the existing hook-state JSON contract, not by adding a parallel state file.
- **F8 / PreCompact ownership:** Reject `compact-inject.js` as the warning owner; it should remain a mitigation surface only.

## 7. Behavioral / Process Recommendations

These are the adopt-now rules that can drop directly into `CLAUDE.md`:

- **F9:** Treat clear-and-rehydrate as a prototype-later workflow hypothesis, not a default rule, until local matched runs net out plugin and recovery overhead.
- **F10:** When native Read/Grep/Glob or the Code Search Decision Tree can do the job, do not fall back to `bash cat`, `bash grep`, or `bash find`.
- **F11:** Do not reread the same unchanged file unless it changed, the previous read was insufficient, or a new question requires a different range.
- **F12:** After the first edit miss, reread or re-anchor before any second edit attempt; do not chain blind retries.
- **F13:** Preserve source denominator mismatches explicitly in synthesis and decision records; do not smooth them into a single invented total.

## 8. Audit Methodology and Portability

The post's auditor architecture decomposes into six layers:

1. **Transcript discovery** — find raw session artifacts.
2. **JSONL parsing** — turn transcript events into structured turns.
3. **SQLite normalization** — load turns, usage, and tool events into a queryable substrate.
4. **Waste classification** — derive cache cliffs, rereads, shell fallback, edit retries, and skill usage categories.
5. **Dollar estimation** — rank categories by estimated spend or budget exposure.
6. **Dashboard rendering** — present the reduced results as ranked views and charts.

Methodology decomposition from iteration-004:

| Layer | Claude-specific vs transferable | Adoption note |
| --- | --- | --- |
| Transcript discovery | Claude-specific implementation, transferable concept | Keep per-agent adapters; do not generalize Claude file-path assumptions. |
| JSONL parsing | Claude-specific implementation, transferable abstraction | Parser logic must stay versioned and runtime-specific. |
| SQLite normalization | Transferable | Best shared substrate once adapters exist. |
| Waste classification | Mostly transferable | Categories port, but cache-specific fields need runtime-specific mapping. |
| Dollar estimation | Partly transferable | Framework ports; pricing inputs and billing interpretations do not. |
| Dashboard rendering | Transferable | Safest shared downstream layer. |

Portability matrix from iteration-004:

| Layer | Codex CLI | Gemini CLI | Copilot CLI | Why |
| --- | --- | --- | --- | --- |
| Transcript discovery | prototype later | prototype later | prototype later | This packet verified multi-runtime support in the repo, not a shared raw transcript contract. |
| JSONL parsing | prototype later | prototype later | prototype later | Reusing a Claude-format parser across runtimes would be incorrect. |
| SQLite normalization | adopt now | adopt now | adopt now | A shared schema can normalize turns, tool calls, read events, edit failures, and pricing facts once adapters exist. |
| Waste classification | prototype later | prototype later | prototype later | The taxonomy ports, but runtime semantics differ. |
| Dollar estimation | prototype later | prototype later | prototype later | Pricing and cache semantics are provider-specific. |
| Dashboard rendering | adopt now | adopt now | adopt now | Once normalized tables exist, downstream charts do not care which CLI produced them. |

Why the layered approach matters:

- It lets Public separate what is **portable now** (schema, ranking, dashboard thinking) from what is **runtime-fragile** (transcript discovery and parser logic).
- It keeps phase `001` from overcommitting to Claude JSONL as stable infrastructure.
- It explains why cross-agent rollout should start in the middle of the stack, not at the parser edge.

Portability should therefore be layered twice: source-specific adapters at the ingest edge, then shared normalization, ranking, and reporting above that edge. Public should also avoid letting shared reporting inherit unreconciled source totals, because F21 and F22 show that portability is not only a parser question but also an accounting-boundary question.

## 9. Phase 005-claudest Cross-Phase Boundary

Phase `001-claude-optimization-settings` owns the **problem framing and repo decision layer**: extract what the Reddit post proves, preserve source discrepancies, classify waste patterns, decide which config, hook, and behavior changes Public should adopt now versus prototype later, and keep the analysis aligned with Public's current Claude rulebook. Phase `005-claudest` owns the **implementation provenance layer**: inspect the Claudest marketplace, `claude-memory`, and `get-token-insights` source to explain how the auditor, memory layer, and dashboard are actually built. The allowed overlap is therefore one-way and narrow: phase `001` may cite phase `005` only to point at the concrete implementation home of the auditor, while phase `005` may cite phase `001` only to explain why the implementation matters.

- **F14:** stays in phase `005-claudest` for implementation provenance, even though phase 001 now treats it as a prerequisite validation asset for multiple findings.
- **F5:** remains separate later-phase work because the `UserPromptSubmit` UX is still the highest-risk runtime behavior.
- **F15:** remains separate later-phase work because it depends on audited data plus governance policy, not only on implementation plumbing.
- **F19:** stays in phase 001 follow-up because the idle-timestamp contract is a local prerequisite for hook validation.
- **F20:** stays in phase 001 follow-up because the shared replay harness is the validation scaffold for this phase's hook decisions.
- **F24:** applies across all follow-on hook prototypes as a prerequisite isolation rule, not as a Claudest implementation detail.

## 10. Risks, Fragility, and Validation Gaps

- **JSONL format fragility (F16):** The post explicitly says Claude JSONL parsing depends on an undocumented local format. Any future auditor must treat ingest as a guarded adapter with coverage reporting and fail-closed parsing.
- **Deferred-loading latency and discoverability tradeoffs (F2):** The post proves smaller upfront tool payload, not first-tool latency, discoverability, or workflow ergonomics in this repo. Those remain validation questions.
- **Cross-iteration label drift (iteration-007 contradiction sweep):** Several items split into "adopt now for wording" versus "prototype later for implementation." The important corrections are: fresh-session recovery is adopt-now guidance but not adopt-now hook enforcement; layered reducer thinking is valid now but reducer implementation is later; JSONL is reject as core infra but prototype-only as an adapter; edit-chain breaking is adopt-now messaging but prototype-later telemetry.
- **Open instrumentation dependencies (F14, F15, F17):** Public does not yet have the transcript auditor, shared waste schema, or skill-usage ledger that several later-stage recommendations depend on.
- **Unshipped `UserPromptSubmit` UX (F5):** The post itself says the blocking flow still needs more thought. That makes this the riskiest hook surface to prototype.
- **Resume-estimate fidelity (F6):** `session-prime.js` could produce useful approximate warnings from stored Stop metrics, but any future estimate will still be heuristic without deeper cache telemetry.
- **Headline arithmetic inconsistency (F21):** The post's token and dollar totals are directionally useful, but the denominators do not reconcile cleanly enough for ledger-grade planning or ROI math.
- **Un-netted remedy overhead (F22):** The preferred `/clear` plus plugin-memory remedy bundle is not shown net of its own injected context, hook, and skill overhead.
- **Prototype side-effect pollution (F24):** Replay results can be misleading unless isolated `TMPDIR`, autosave stubs, and shared-state boundaries are enforced during experiments.

## 11. Open Questions

The only research questions still partial or exhausted-without-closure after iteration 007 are:

1. **Q2 — Deferred-loading ergonomics:** The packet does not contain enough source evidence to close first-tool latency, discoverability, fallback rate, or task-completion ergonomics. The source only says tools are "lazy-load[ed] ... on demand" and reports token savings.
2. **Q8 — Edit-retry root causes:** The packet reports "31 failed-edit-then-retry sequences" but does not separate prompt quality, workflow design, or messaging causes. The repo can improve guardrails now, but root-cause attribution remains open.
3. **Q9 — Plugin-overhead net costing:** What is the actual gross-savings-minus-remedy-overhead result for `/clear` plus plugin-memory recovery once injected context, hook writes, and skill surfaces are counted?
4. **Q10 — Baseline-window definition for skill review:** What minimum observation window, routing denominator, and error bucket are required before a skill can honestly be labeled `never_used` or `low_frequency`?
5. **Q11 — Replay-harness isolation boundary:** Which artifacts must the hook replay harness isolate or stub so that Stop-hook autosave and temp-state writes do not contaminate validation results?

## 12. Convergence Report

- **Stop reason:** loop-complete after canonical synthesis amendments landed and the extended skeptical pass was incorporated
- **Total iterations:** 13
- **newInfoRatio trajectory:** `0.93, 0.68, 0.57, 0.48, 0.41, 0.38, 0.24, 0.12, 0.39, 0.34, 0.38, 0.28, 0.18`
- **Findings count by iteration:** `8, 5, 6, 5, 4, 4, 2, 0, 3, 2, 10, 0, 7`
- **Total deduplicated findings:** 24
- **Tier distribution:** `T1=7, T2=8, T3=5, T4=4`
- **Recommendations:** `adopt now=11, prototype later=11, reject=2`
- **Confidence average:** `~4.2/5`
- **Loop extension event:** iterations 9-13 were added by user request via `cli-codex` `gpt-5.4` high reasoning to bring an independent skeptical perspective.
- **Iteration-013 role:** canonical synthesis amendment pass plus F18-F24 landing in `research.md`
- **Convergence judgment:** source discovery is exhausted for this packet, the amendment list is fully applied, and the loop is ready for memory re-save.
