# Research: Claude Code Optimization Settings (phase 001)

<!-- ANCHOR:summary -->
This research synthesis preserves the source discrepancies and repo-state cross-checks from the phase-001 audit. [SOURCE: external/reddit_post.md:1-40] [SOURCE: .claude/settings.local.json:1-40]
<!-- /ANCHOR:summary -->

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