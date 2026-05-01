# Iteration 001 — Retrieval Reality Check

Date: 2026-04-09

## Research question
Does Xethryon's live prompt-injection path actually use LLM-ranked memory retrieval by default, and should `system-spec-kit` adopt that retrieval pattern?

## Hypothesis
The docs overstate the runtime path, and the live system probably falls back to a lighter keyword/recency pass unless an explicit LLM callback is wired through.

## Method
I compared the external claims in `README.md` and `XETHRYON_CONTEXT.md` against the actual runtime wiring in `session/system.ts`, `session/prompt.ts`, `retrieveMemories.ts`, and `findRelevantMemories.ts`. I then compared that path with Spec Kit Memory's documented and implemented multi-channel retrieval stack.

## Evidence
- Xethryon's README markets persistent memory as "LLM-ranked retrieval (not keyword matching)." [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/README.md:11-18]
- XETHRYON_CONTEXT repeats the same claim, but also warns that the prompt-loop wiring "may need verification." [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/XETHRYON_CONTEXT.md:192-209]
- The system prompt layer exposes `relevantMemories(query)` by calling `retrieveRelevantMemories(query, signal)`; no `llmCall` is threaded through this interface. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/system.ts:98-115]
- The main prompt loop extracts the latest user text and calls `SystemPrompt.relevantMemories(userQueryText)` with only the query string. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/session/prompt.ts:1564-1585]
- `retrieveRelevantMemories()` loads session-memory text plus `loadRelevantMemoryContent(query, memoryDir, abortSignal)`; it still does not pass an LLM callback into the relevance engine. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/retrieveMemories.ts:25-84]
- `findRelevantMemories()` documents a dual-mode engine, but the default branch is keyword overlap plus recency/type bonuses; LLM ranking runs only when `llmCall` is provided and there are more than three memories. [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:5-8] [SOURCE: .opencode/specs/system-spec-kit/999-agentic-system-upgrade/001-research-agentic-systems/009-xethryon/external/packages/opencode/src/xethryon/memory/findRelevantMemories.ts:119-171]
- Spec Kit Memory already advertises and implements a materially richer retrieval stack: five search channels, session recovery surfaces, intent-aware routing, and a four-stage pipeline rather than a keyword fallback path. [SOURCE: .opencode/skill/system-spec-kit/README.md:76-84] [SOURCE: .opencode/skill/system-spec-kit/README.md:92-99] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:17-35] [SOURCE: .opencode/skill/system-spec-kit/references/memory/memory_system.md:99-145] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts:12-21]

## Analysis
The live Xethryon runtime does not support the README's plain-language claim that recall is broadly "LLM-ranked" by default. The decisive evidence is the prompt loop: `session/prompt.ts` only sends a raw query into `SystemPrompt.relevantMemories()`, and that bridge never provides the optional `llmCall` argument that unlocks `llmSelectRelevant()`. In practice, the shipped prompt-injection path is keyword overlap with recency/type bonuses. That makes Xethryon's retrieval engine interesting as a lightweight fallback, but not stronger than Spec Kit Memory's existing hybrid search.

## Conclusion
confidence: high

finding: Xethryon's retrieval marketing is ahead of its default runtime path. The current implementation is a light lexical+recency recall helper, not a generally LLM-ranked memory stack. `system-spec-kit` should not port this engine into `memory_search()` or `memory_context()` because the local system already exceeds it on recall sophistication and governance.

## Adoption recommendation for system-spec-kit
- **Target file or module:** `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- **Change type:** rejected
- **Blast radius:** small
- **Prerequisites:** none
- **Priority:** rejected

## Counter-evidence sought
I explicitly looked for any runtime call site that threaded an `llmCall` callback from `session/prompt.ts` or `session/system.ts` into `findRelevantMemories()`. I found none.

## Follow-up questions for next iteration
- How much value comes from Xethryon's project-global memory layout rather than its retrieval algorithm?
- Does Xethryon's post-turn memory hook provide a continuity benefit that Spec Kit lacks even if the retrieval engine is weaker?
- Can AutoDream-style consolidation improve Spec Kit's existing reconsolidation-on-save path?
