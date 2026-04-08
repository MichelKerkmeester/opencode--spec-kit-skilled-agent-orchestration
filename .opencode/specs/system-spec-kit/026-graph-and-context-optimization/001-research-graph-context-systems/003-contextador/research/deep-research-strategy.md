---
title: Deep Research Strategy for 003-contextador
description: Persistent research strategy file for the 003-contextador phase. Tracks topic, key questions, focus, and reducer-owned sections across iterations.
---

# Deep Research Strategy - 003-contextador

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Persistent brain for the 003-contextador deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the loop manager and iteration agents at every iteration.

### Usage

- **Init:** Loop manager copied this template to `research/deep-research-strategy.md` and populated Topic, Key Questions, Known Context, and Research Boundaries from config and memory_context.
- **Per iteration:** Iteration agent (cli-codex gpt-5.4 high preferred) reads Next Focus, writes evidence to `research/iterations/iteration-NNN.md`, and the reducer refreshes machine-owned sections.
- **Mutability:** Mutable, with explicit ownership boundaries between analyst-owned and machine-owned sections.

---

<!-- /ANCHOR:overview -->
<!-- ANCHOR:topic -->
## 2. TOPIC

Research the external repository at `external/` (Contextador checkout) and identify concrete improvements for `Code_Environment/Public`, especially around MCP-based query interfaces, self-healing context, shared agent caches (Mainframe), and token-efficient codebase navigation patterns.

The phase prompt is `phase-research-prompt.md`. Reading order: `external/src/mcp.ts` first, then query routing in `headmaster.ts` and related files, then the self-healing loop in `feedback.ts` / `janitor.ts` / `generator.ts`, then Mainframe in `bridge.ts` / `client.ts` / `rooms.ts` / `dedup.ts` / `summarizer.ts`, then README-level material.

---

<!-- /ANCHOR:topic -->
<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1. What exact MCP tools does Contextador expose, and how does the tool surface change agent workflow compared with direct file reading?
- [x] Q2. What data shape is returned by `context` queries, and how much of the structured-context schema comes from CONTEXT.md pointers versus live file reads?
- [x] Q3. How does routeQuery decide between AI routing, keyword fallback, and fan-out across multiple scopes?
- [x] Q4. How does the self-healing loop work end to end from context_feedback through repair queue processing, regeneration, Key Files patching, and enrichment?
- [x] Q5. What parts of the "self-improving" claim are backed by code today, and what parts remain product language?
- [x] Q6. How does Mainframe synchronize broadcasts and requests across agents, what metadata is shared in Matrix room messages, and where is conflict resolution shallow or missing?
- [x] Q7. What privacy and operational tradeoffs come from Mainframe (persistent local agent IDs, room-level message history, budget state, optional Docker-hosted Operator setup)?
- [x] Q8. How is the 93% token-reduction claim measured or approximated, and does the current stats implementation provide strong evidence or only coarse estimates?
- [x] Q9. How does the provider abstraction layer support Anthropic, OpenAI, Google, GitHub Copilot, OpenRouter, custom servers, and Claude Code?
- [x] Q10. How does .mcp.json auto-detection and framework-specific setup shape adoption compared with this repo's current MCP configuration patterns?
- [x] Q11. What is the actual AGPL plus commercial licensing model, and how does that constrain adoption or direct reuse for Code_Environment/Public?
- [x] Q12. Compared with CocoIndex, Code Graph MCP, and Spec Kit Memory, what is genuinely new in Contextador's query model, and what would only duplicate behavior this repo already has?

<!-- /ANCHOR:key-questions -->
<!-- ANCHOR:non-goals -->
## 4. NON-GOALS

- Detailed commercial contract terms or legal review of LICENSE-COMMERCIAL.md
- View AI marketing strategy or product positioning analysis
- Speculative rewrites of Contextador into another runtime
- Generic MCP primers not grounded in this repository's tooling
- Implementation work or patches outside the phase folder
- Recommending direct adoption of AGPL-bound code without explicit licensing discussion

---

<!-- /ANCHOR:non-goals -->
<!-- ANCHOR:stop-conditions -->
## 5. STOP CONDITIONS

- All 12 key questions answered, OR
- Composite convergence triggered (rolling average + MAD noise floor + question entropy), OR
- Max 20 iterations reached, OR
- 3 consecutive failed iterations, OR
- Pause sentinel `research/.deep-research-pause` created by the user

---

<!-- /ANCHOR:stop-conditions -->
<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1. What exact MCP tools does Contextador expose, and how does the tool surface change agent workflow compared with direct file reading?
- Q2. What data shape is returned by `context` queries, and how much of the structured-context schema comes from CONTEXT.md pointers versus live file reads?
- Q3. How does routeQuery decide between AI routing, keyword fallback, and fan-out across multiple scopes?
- Q4. How does the self-healing loop work end to end from context_feedback through repair queue processing, regeneration, Key Files patching, and enrichment?
- Q5. What parts of the "self-improving" claim are backed by code today, and what parts remain product language?
- Q6. How does Mainframe synchronize broadcasts and requests across agents, what metadata is shared in Matrix room messages, and where is conflict resolution shallow or missing?
- Q7. What privacy and operational tradeoffs come from Mainframe (persistent local agent IDs, room-level message history, budget state, optional Docker-hosted Operator setup)?
- Q8. How is the 93% token-reduction claim measured or approximated, and does the current stats implementation provide strong evidence or only coarse estimates?
- Q9. How does the provider abstraction layer support Anthropic, OpenAI, Google, GitHub Copilot, OpenRouter, custom servers, and Claude Code?
- Q10. How does .mcp.json auto-detection and framework-specific setup shape adoption compared with this repo's current MCP configuration patterns?
- Q11. What is the actual AGPL plus commercial licensing model, and how does that constrain adoption or direct reuse for Code_Environment/Public?
- Q12. Compared with CocoIndex, Code Graph MCP, and Spec Kit Memory, what is genuinely new in Contextador's query model, and what would only duplicate behavior this repo already has?

<!-- /ANCHOR:answered-questions -->
<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the MCP entrypoint and the routing/pointer helpers together made it easy to separate the public tool promise from the actual returned payload. (iteration 14)
- following the control flow from the MCP tool into the lower-level helpers made it easy to separate synchronous repair from later janitor stages. (iteration 15)
- reading the bridge together with the Matrix client and envelope builders exposed the real collaboration contract quickly. (iteration 16)
- reading the arithmetic and adapter code directly removed the temptation to rely on README-level wording for both the savings and provider stories. (iteration 17)
- splitting setup into global-config, init, and doctor phases turned a fuzzy onboarding claim into a concrete sequence of files and checks. (iteration 18)
- package metadata plus the two license documents were enough to close the adoption boundary without speculating about legal interpretations beyond the repo's own text. (iteration 19)
- doing the final comparison directly against Public source surfaces kept the recommendation boundary honest and prevented cargo-cult adoption of Contextador's weaker layers. (iteration 20)

<!-- /ANCHOR:what-worked -->
<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- relying on prior packet synthesis alone would have been weaker here because the open questions were about contract shape, not just recommendation posture. (iteration 14)
- treating "self-improving" as a single claim blurred three separate behaviors: patching, regeneration, and staged maintenance. (iteration 15)
- focusing only on `checkHistory()` would have understated the privacy story because the risky data path is in message creation and local credential persistence. (iteration 16)
- treating budget gating as part of the token-savings proof would have conflated operational limits with empirical measurement. (iteration 17)
- looking only at README commands would have overstated framework integration and editor auto-detection. (iteration 18)
- relying on README-only wording would have hidden the stronger `-or-later` package declaration and the explicit commercial exception text. (iteration 19)
- packet-level summaries alone were too coarse for the final keep-versus-reject decision because Q12 is fundamentally comparative. (iteration 20)

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
[All tracked questions are resolved. Proceed to synthesis.]

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->
<!-- ANCHOR:known-context -->
## 12. KNOWN CONTEXT

memory_context retrieval for "Contextador MCP server self-healing context Mainframe shared cache" returned NO prior memories specific to Contextador (evidence gap detected, Z=0.00). Auto-surfaced adjacent memories from `system-spec-kit/024-compact-code-graph` track:

- `024-compact-code-graph/spec` -- Hybrid Context Injection (Hook + Tool Architecture)
- `024-compact-code-graph/decision-record` -- Decision Record: Hybrid Context Injection
- `024-compact-code-graph/001-precompact-hook/spec` -- Phase 1: Compaction Context Injection
- `024-compact-code-graph/003-stop-hook-tracking/spec` -- Phase 3: Stop Hook + Token Tracking

These are useful as a comparison baseline because they cover hybrid context injection and token tracking, which are conceptually adjacent to Contextador's MCP query interface and stats subsystem. They are NOT a substitute for source-grounded research on the Contextador checkout.

Constitutional auto-surfaces (always-on rules):

- `system-spec-kit/constitutional/gate-tool-routing` -- TOOL ROUTING decision tree
- `system-spec-kit/constitutional/gate-enforcement` -- GATE ENFORCEMENT edge cases

---

<!-- /ANCHOR:known-context -->
<!-- ANCHOR:research-boundaries -->
## 13. RESEARCH BOUNDARIES

- Max iterations: 20
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart`, `fork`, `completed-continue`
- Machine-owned sections: reducer controls Sections 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.opencode/skill/sk-deep-research/assets/runtime_capabilities.json`
- Capability resolver: `.opencode/skill/sk-deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-04-06T10:14:10.000Z
- Iteration delegation: cli-codex `gpt-5.4` with `model_reasoning_effort="high"` preferred; internal `@deep-research` agent fallback
<!-- /ANCHOR:research-boundaries -->
