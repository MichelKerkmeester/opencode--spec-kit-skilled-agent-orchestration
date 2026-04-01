# Iteration 005: Constitutional Memory Design for Tool Routing

## Focus: Design the constitutional memory for tool routing and analyze how it should interact with the existing gate-enforcement constitutional memory.

## Findings:
1. The existing constitutional memory already owns gate behavior, not tool-choice behavior. `gate-enforcement.md` is intentionally lean and limited to the Gate 1/2/3 cross-reference plus continuation, compaction, memory-save, and completion quick reference. A routing constitutional should therefore avoid repeating spec-folder, continuation, memory-save, or completion rules and instead activate only after those gates are satisfied. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:53-68] [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:93-106]

2. A routing constitutional would have real runtime reach because constitutional memories are injected on both major retrieval paths: Stage 1 search injection for normal `memory_search()` and the hook/auto-surface path used during tool-dispatch context assembly. This means one compact routing rule can reinforce tool choice across both hook-compatible and non-hook flows whenever the memory system is consulted, but every extra word becomes recurring prompt tax. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:952-1004] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/hooks/memory-surface.ts:378-415] [SOURCE: .opencode/skill/system-spec-kit/constitutional/README.md:752-766]

3. The constitutional memory must stay very short because the system treats constitutional tier as always-surface context. The constitutional README explicitly says these memories are highest-priority, always surface, never decay, and should be used sparingly for rules that truly must always be visible; DR-003 already accepts the token trade-off for tool routing, but only if the file remains compact. [SOURCE: .opencode/skill/system-spec-kit/constitutional/README.md:752-766] [SOURCE: .opencode/specs/02--system-spec-kit/024-compact-code-graph/025-tool-routing-enforcement/decision-record.md:38-44]

4. The proposed content should mirror the already-emergent canonical routing policy instead of inventing a new one: semantic discovery and unfamiliar-code exploration go to CocoIndex first; structural navigation such as callers/imports/outline/impact goes to Code Graph; exact-token and known-path lookups stay on grep/glob. This matches both runtime guidance and current tool capability boundaries. [SOURCE: CLAUDE.md:34-50] [SOURCE: CODEX.md:28-33] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:637-744]

5. The body text should use imperative keywords such as `always`, `never`, or `should`, because retrieval-directive enrichment extracts constitutional guidance from lines containing those keywords and adds the result as metadata without altering scores or ordering. A routing constitutional written in the same imperative style as gate-enforcement is more likely to yield a useful `retrieval_directive` alongside the memory content. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:6-15] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:63-89] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/lib/search/retrieval-directives.ts:122-139]

6. The cleanest interaction model is separation by concern plus one explicit handoff line: `gate-enforcement.md` answers "may I proceed yet?" while `gate-tool-routing.md` answers "which search primitive should I use once I may proceed?" The routing constitutional should include a brief qualifier such as `After gate rules pass` or `Does not override Gate 3` so the two constitutional memories co-surface without ambiguity. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:60-68] [SOURCE: .opencode/skill/system-spec-kit/mcp_server/context-server.ts:548-560]

7. Trigger phrases should be intentionally disjoint from gate-enforcement. `gate-enforcement.md` already covers verbs like `fix`, `implement`, `resume`, `done`, and `save context`; the routing constitutional should instead target search-intent and tool-choice phrases such as `semantic search`, `exact text`, `known path`, `callers`, `imports`, `outline`, `impact`, `CocoIndex`, `code graph`, `grep`, and `glob`. That makes the two constitutional memories complementary rather than redundant in trigger-based surfacing. [SOURCE: .opencode/skill/system-spec-kit/constitutional/gate-enforcement.md:2-48]

## Proposed gate-tool-routing.md Content:
```md
---
title: "TOOL ROUTING - Search Decision Tree"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  - semantic search
  - exact text
  - known path
  - callers
  - imports
  - outline
  - impact
  - cocoindex
  - code graph
  - grep
  - glob
---

# TOOL ROUTING - Search Decision Tree

After gate rules pass, always route code search by intent:
- Semantic discovery, unfamiliar code, or "how is X implemented" -> CocoIndex first.
- Callers, imports, outline, impact, or neighborhoods -> code_graph_query / code_graph_context.
- Exact token, exact error text, or known path -> grep / glob.
- If code graph is stale or empty, use CocoIndex plus file reads until graph health is restored.
- Never start with grep/glob for semantic discovery.
```

This draft is intentionally short, imperative, and non-overlapping with `gate-enforcement.md`.

## Key Questions Answered:
- Q8: What would a constitutional memory for tool routing look like and how would it interact with the existing gate-enforcement constitutional?

## New Information Ratio: 0.36

## Next Focus Recommendation:
Investigate Q9 next: compare which enforcement surface actually changes model behavior most reliably in practice — `buildServerInstructions()` text, tool-description wording, constitutional memory, or reactive response hints — and identify the minimum effective combination.
