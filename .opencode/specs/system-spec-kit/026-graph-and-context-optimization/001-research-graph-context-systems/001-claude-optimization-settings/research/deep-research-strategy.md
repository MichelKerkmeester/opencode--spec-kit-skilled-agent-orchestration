---
title: Deep Research Strategy - 001-claude-optimization-settings
description: Persistent strategy file for the deep-research session investigating Reddit post token-waste audit findings against Code_Environment/Public's current Claude Code configuration.
---

# Deep Research Strategy - 001-claude-optimization-settings

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Persistent brain for the deep-research session investigating Claude Code token-waste optimization opportunities surfaced in the Reddit audit (`external/reddit_post.md`). Tracks key questions, evidence, dead ends, and the next iteration focus.

### Usage

- **Init:** Workflow populated Topic, Key Questions, Non-Goals, Stop Conditions, Known Context.
- **Per iteration:** Iteration agent reads Next Focus, performs targeted reading + cross-checks, writes evidence to `iterations/iteration-NNN.md`. Reducer refreshes machine-owned sections.
- **Mutability:** Mutable for analyst-owned sections; reducer-owned sections are rewritten between iterations.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Research the Reddit post at `external/reddit_post.md` and identify concrete configuration changes, hook designs, and waste-pattern detection methods that should be adopted by `Code_Environment/Public` to reduce Claude Code token spend and avoid rate-limit exhaustion. The post audits 858-926 sessions and ~18,903 turns and proposes config flips, hooks, and behavioral changes. Treat the post as a primary-source field report, cross-check claims against this repo's actual `.claude/settings.local.json` and `CLAUDE.md`, and label every recommendation as `adopt now`, `prototype later`, or `reject` with affected-area and risk notes.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1. ENABLE_TOOL_SEARCH credibility and current-state diff: how should the post's claimed 45k -> 20k base-context drop and 20k -> 6k tool-schema drop be interpreted given that this repo already has `ENABLE_TOOL_SEARCH=true` in `.claude/settings.local.json`? What follow-up validation, latency tradeoffs, and discoverability risks remain even after the flag is set?
- [x] Q2. Cache-expiry mitigation taxonomy: how should the post's claim that 54% of turns followed >5-minute idle gaps and that 232 cache cliffs occurred across 858 sessions be modeled? Which mitigations are pure config (e.g., compaction defaults), which are hook implementations (Stop/UserPromptSubmit/SessionStart cache warnings), and which are behavioral (clear-and-restart vs compact vs resume)?
- [x] Q3. Skill schema bloat detection: how should this repo detect low-usage skills (the post reports 19 of 42 had <=2 invocations across 858 sessions) and schema bloat? What counts as evidence strong enough to disable, gate, or lazy-load a skill given that this repo's skill_advisor.py already gates Gate 2 routing?
- [x] Q4. Cache-warning hook designs: how should the three proposed hooks (Stop = idle-timestamp, UserPromptSubmit = idle-gap warning, SessionStart = cache-rebuild estimator) be evaluated against this repo's existing PreCompact/SessionStart/Stop hook architecture without conflicting with session-prime, session-stop, and compact-inject behavior?
- [x] Q5. Bash-vs-native + redundant-read + edit-retry reinforcement: how should the post's findings of 662 bash `cat`/`grep`/`find` calls, 1,122 redundant file reads, and 31 edit-retry chains be translated into prompt rules, hooks, or telemetry for this repo (which already has a Code Search Decision Tree mandate in CLAUDE.md)?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Do NOT implement the `claude-memory` plugin or `/get-token-insights` skill in this phase. That implementation lives in sibling phase `005-claudest`.
- Do NOT debate Anthropic billing, subscription pricing, or the legitimacy of the rate-limit changes themselves.
- Do NOT chase external Reddit comment threads or dead URLs referenced inside the post.
- Do NOT duplicate the deep dive on plugin architecture, marketplace structure, or memory plugin internals owned by phase `005`.
- Do NOT touch phases `002`, `003`, or `004` content (codesight, contextador, graphify).
- Do NOT build a new token auditor inside this phase. The output of this phase is a recommendation set, not an implementation.
- Do NOT enable or disable any setting in `.claude/settings.local.json` as part of this phase. This phase produces a checklist; later phases own actual config flips.

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 5 Key Questions answered with evidence anchored to specific paragraphs in `reddit_post.md`.
- At least 5 evidence-backed findings recorded in `research/research.md`, each with source quote, what-it-documents, why-it-matters-for-this-repo, recommendation label (`adopt now` | `prototype later` | `reject`), affected-area, and risk note.
- Cross-check against repo state complete: every recommendation explicitly notes whether it is already implemented, partially implemented, or missing in this repo.
- Composite convergence signal hits stop threshold (see `references/convergence.md`).
- 13 iterations cap reached.
- Three consecutive iterations with newInfoRatio < 0.05 (stuck threshold).

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1. ENABLE_TOOL_SEARCH credibility and current-state diff: how should the post's claimed 45k -> 20k base-context drop and 20k -> 6k tool-schema drop be interpreted given that this repo already has `ENABLE_TOOL_SEARCH=true` in `.claude/settings.local.json`? What follow-up validation, latency tradeoffs, and discoverability risks remain even after the flag is set?
- Q2. Cache-expiry mitigation taxonomy: how should the post's claim that 54% of turns followed >5-minute idle gaps and that 232 cache cliffs occurred across 858 sessions be modeled? Which mitigations are pure config (e.g., compaction defaults), which are hook implementations (Stop/UserPromptSubmit/SessionStart cache warnings), and which are behavioral (clear-and-restart vs compact vs resume)?
- Q3. Skill schema bloat detection: how should this repo detect low-usage skills (the post reports 19 of 42 had <=2 invocations across 858 sessions) and schema bloat? What counts as evidence strong enough to disable, gate, or lazy-load a skill given that this repo's skill_advisor.py already gates Gate 2 routing?
- Q4. Cache-warning hook designs: how should the three proposed hooks (Stop = idle-timestamp, UserPromptSubmit = idle-gap warning, SessionStart = cache-rebuild estimator) be evaluated against this repo's existing PreCompact/SessionStart/Stop hook architecture without conflicting with session-prime, session-stop, and compact-inject behavior?
- Q5. Bash-vs-native + redundant-read + edit-retry reinforcement: how should the post's findings of 662 bash `cat`/`grep`/`find` calls, 1,122 redundant file reads, and 31 edit-retry chains be translated into prompt rules, hooks, or telemetry for this repo (which already has a Code Search Decision Tree mandate in CLAUDE.md)?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->
<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

### Repo state (verified during init, 2026-04-06)

- `.claude/settings.local.json` ALREADY contains `"ENABLE_TOOL_SEARCH": "true"` in env block. The post's headline configuration recommendation is already adopted in this repo.
- `.claude/settings.local.json` also has `"SPECKIT_ABLATION": "true"` in env block.
- Existing hooks: `PreCompact` (compact-inject.js), `SessionStart` (session-prime.js), `Stop` (session-stop.js, async). All three event types from the post's proposed hooks are already wired, but for memory/session-state purposes, not cache-expiry warnings.
- `CLAUDE.md` already mandates the Code Search Decision Tree: semantic -> CocoIndex, structural -> code_graph_query, exact text -> Grep. Bash `find`/`grep`/`cat` use is already discouraged.
- `CLAUDE.md` already has skill_advisor.py (Gate 2) for skill routing.
- Spec Kit Memory MCP and `generate-context.js` script already in place for memory management.

### Sibling-phase awareness

- Phase `005-claudest` owns the `claude-memory` plugin and `/get-token-insights` skill implementation. This phase only references it as the implementation overlap; it does not duplicate plugin internals.
- Phases `002` (codesight), `003` (contextador), `004` (graphify) own context-generation systems unrelated to this audit.

### Discrepancy already noted in source

- Post header says "audit of 926 sessions"; body uses "858 sessions" and "18,903 turns" repeatedly. Preserve the discrepancy explicitly per phase prompt instruction 4 -- do NOT smooth it over.

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 13
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability matrix doc: `.opencode/skill/sk-deep-research/references/capability_matrix.md`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-06T09:59:15Z
- Iteration runner: cli-copilot `gpt-5.4` high for the initial loop, then cli-codex `gpt-5.4` high for the user-requested skeptical extension through iteration 013
- Sub-agent dispatch: PROHIBITED inside iteration runner per phase prompt §8 ("Don't dispatch sub-agents. This is a depth-1 leaf task")
<!-- /ANCHOR:research-boundaries -->
