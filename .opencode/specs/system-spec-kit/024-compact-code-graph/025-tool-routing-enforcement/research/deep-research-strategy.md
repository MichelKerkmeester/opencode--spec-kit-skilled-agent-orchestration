---
title: Deep Research Strategy - Tool Routing Enforcement
description: Strategy tracking for deep research on AI tool misjudgment root cause and enforcement across CLI runtimes.
---

# Deep Research Strategy - Tool Routing Enforcement

## 2. TOPIC
Tool routing enforcement — fixing root cause of AI tool misjudgment for CocoIndex and Code Graph across hook-compatible and non-hook CLIs. Additional directive: use cli-copilot with GPT 5.4 High model for research iterations.

---

## 3. KEY QUESTIONS (remaining)
- [ ] Q1: What is the exact decision path an AI takes when choosing between Grep/Glob vs CocoIndex vs Code Graph for a search task?
- [ ] Q2: Where in the MCP server can tool-routing rules be injected so ALL CLIs receive them (not just hook-compatible ones)?
- [ ] Q3: What does `buildServerInstructions()` currently return and how can it be extended with routing rules under 200 tokens?
- [x] Q4: How does the PrimePackage currently flow from session priming to the AI's context, and where can routing directives be added?
- [x] Q5: What patterns in user queries reliably distinguish semantic searches (CocoIndex) from structural queries (Code Graph) from exact text searches (Grep)?
- [x] Q6: How do non-hook CLIs (Codex, Copilot, Gemini) currently receive tool guidance — only via instruction files or also via MCP?
- [x] Q7: What existing hint/redirect mechanisms exist in MCP tool responses that can be reused for routing hints?
- [ ] Q8: What would a constitutional memory for tool routing look like and how would it interact with the existing gate-enforcement constitutional?
- [x] Q9: How effective are tool description changes vs server instruction changes vs response hints at influencing AI tool selection?
- [ ] Q10: What are the failure modes of over-aggressive routing (false redirects) and how to design escape hatches?

---

## 4. NON-GOALS
- Changing CocoIndex or Code Graph core functionality (both work correctly)
- Creating new MCP tools (reuse existing infrastructure)
- Blocking or preventing Grep/Glob usage (they're correct for exact text search)
- UI/UX changes beyond instruction text

---

## 5. STOP CONDITIONS
- All 10 questions answered with evidence from code or tests
- Implementation approach is fully specified with file paths and LOC estimates
- No remaining open questions about the enforcement mechanism
- Convergence: 3+ consecutive iterations with <5% new information

---

## 6. ANSWERED QUESTIONS
- [x] Q1: The current decision path was mapped across runtime docs, MCP server instructions, `ListTools` descriptions, and first-call PrimePackage hints.
- [x] Q2: Central injection points were identified: `buildServerInstructions()` first, `tool-schemas.ts` second, PrimePackage/result hints third.
- [x] Q3: `buildServerInstructions()` was enumerated and a sub-200-token routing extension was specified.
- [x] Q4: PrimePackage is built in `primeSessionIfNeeded()` on the first MCP tool call and reaches the model only via post-dispatch response-envelope hints (`injectSessionPrimeHints()` and `meta.sessionPriming`), so routing directives added there influence follow-up choices, not the first tool choice.
- [x] Q5: The codebase already has a lightweight structural-vs-semantic classifier, and the remaining missing routing class is a high-precision exact-text/path category for Grep/Glob triggers such as quoted literals, regex/path/glob markers, and explicit `exact`/`string`/`file named` phrasing.
- [x] Q6: Non-hook CLIs receive guidance through both runtime instruction files and MCP bootstrap metadata, but the MCP-delivered content is currently recovery/status oriented rather than an explicit routing policy for CocoIndex vs Code Graph vs Grep/Glob.
- [x] Q7: Existing MCP response-envelope hinting can be reused in two places: `appendAutoSurfaceHints()` for compact reactive reminders and `injectSessionPrimeHints()` / `meta.sessionPriming` for PrimePackage-carried routing metadata after the first tool call.
- [x] Q9: Enforcement leverage now ranks clearly: startup server instructions (`setInstructions`) are strongest for first-tool choice, `ListTools` descriptions are the next-best per-tool reinforcement, and response hints are post-selection recovery only.

---

## 7. WHAT WORKED
- Reading `context-server.ts` dispatch code together with `memory-surface.ts` exposed the pre-selection vs post-selection split.
- Comparing `CLAUDE.md`, `GEMINI.md`, `CODEX.md`, and `AGENTS.md` showed that most explicit routing policy currently lives in runtime instruction files, not MCP metadata.
- Checking `opencode.json` confirmed CocoIndex is a separate provider, which explains why `tool-schemas.ts` alone cannot enforce cross-tool routing.
- Reading runtime detection plus cross-runtime fallback tests clarified that the real runtime split is transport timing (`hooks` vs `tool_fallback`), not separate routing content per runtime.
- Reading `query-intent-classifier.ts` with `memory-context.ts` exposed a reusable heuristic already present in the codebase, making classifier design an extension problem instead of a greenfield one.
- Comparing the MCP classifier to runtime search-protocol docs made the missing `exact_text` bucket obvious: Grep/Glob routing exists in docs, but not in the server-side heuristic.
- Reading `.opencode/agent/context-prime.md` and `.claude/agents/context-prime.md` together confirmed that the display contract is already stable across runtimes and can absorb a shared `Tool Routing` section without runtime divergence.
- Pairing `hooks/response-hints.ts` with the existing startup/envelope tests in `context-server.vitest.ts` made the test strategy concrete: extend live `setInstructions()` checks, add PrimePackage builder tests, and reuse call-handler hint injection tests.

---

## 8. WHAT FAILED
- Focused memory retrieval returned no prior work for this exact topic, so this iteration had to proceed from code inspection rather than historical context.
- Inspecting only `tool-schemas.ts` was insufficient to answer the CocoIndex side of routing because CocoIndex is not defined in this server.
- The research packet on disk was inconsistent with the task directive: no prior iteration artifact or iteration JSONL line existed even though this run was labeled iteration 2.
- Looking for an existing exact-match router in the MCP server did not pay off; the investigated classifier only distinguishes `structural`, `semantic`, and `hybrid`.
- Looking for existing PrimePackage-focused tests did not pay off; the current suite exercises startup instructions and envelope enrichment, but not `buildPrimePackage()` as a standalone unit.

---

## 9. EXHAUSTED APPROACHES (do not retry)
[None yet]

---

## 10. RULED OUT DIRECTIONS
- Treating PrimePackage as the primary enforcement mechanism for first-tool selection; it is injected only after the first successful tool response.
- Treating `tool-schemas.ts` changes as sufficient for both Code Graph and CocoIndex routing; CocoIndex is exposed by a separate MCP provider.
- Assuming non-hook runtimes are instruction-file-only; they do receive MCP bootstrap metadata, but not yet routing-specific metadata.
- Replacing the current heuristic with a heavyweight model-based classifier; extending the existing scorer with an `exact_text` layer is lower-risk and sufficient for routing hints.
- Using response hints as the main exact-match enforcement surface; they arrive too late to prevent the initial wrong tool choice.
- Encoding all routing semantics inside `recommendedCalls`; that field should remain an action list, while a new `routingRules` field carries the classifier itself.

---

## 11. NEXT FOCUS
Iteration 10: Investigate over-aggressive enforcement failure modes and escape hatches: quoted structural queries, exact symbol-name lookups, stale-code-graph fallback, unavailable CocoIndex/Code Graph scenarios, and how to keep redirects conservative while still correcting Grep/Glob overuse.

---

## 12. KNOWN CONTEXT
- No prior memory found (evidence gap — this is new research territory)
- CocoIndex code search found relevant source files:
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/README.md` — Code graph lib overview
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/code-graph-context.ts` — LLM-oriented graph neighborhoods
  - `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` — Tool definitions including code_graph_status, code_graph_context
  - `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/seed-resolver.ts` — CocoIndex to graph node resolution
  - `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` — Context handler
- Runtime fixtures show 4 runtimes: claude-code (hooks enabled), codex-cli (hooks unavailable), copilot-cli (hooks unavailable), gemini-cli (hooks unavailable)
- Session priming fires via `primeSessionIfNeeded()` in `hooks/memory-surface.ts`
- `buildServerInstructions()` in `context-server.ts:605` currently covers memory stats + session recovery, no tool routing
- Non-hook CLIs already receive some MCP-delivered bootstrap guidance, but it is session recovery/status guidance rather than active tool-routing policy.
- PrimePackage currently flows: first tool call -> `primeSessionIfNeeded()` -> `injectSessionPrimeHints()` -> response `hints` plus `meta.sessionPriming`.
- The research packet currently has an evidence gap between the task-declared iteration number and the on-disk iteration artifacts.
- `context-prime` currently has no `Tool Routing` section in either `.opencode` or `.claude`, so the middle enforcement layer is content-incomplete even though the transport path exists.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- Current segment: 1
- Started: 2026-04-01T07:21:00.000Z
- Research agent directive: use cli-copilot with GPT 5.4 High model
