OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d114c-6b0d-7a93-aa34-d663645aed0c
--------
user
# Research Dimension D5: Retrieval UX & Result Presentation

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching retrieval UX and result presentation for a production Hybrid RAG Fusion system. The system is an MCP (Model Context Protocol) server called by AI assistants (Claude, GPT, Gemini, Copilot). The "user" is an AI assistant, not a human directly. Built in TypeScript with SQLite.

**Current Result Format:**
- Results returned as MCP tool response with: id, title, score (0-1), content_text, file_path, spec_folder, context_type, importance_tier
- Score aliases preserved for auditability: score, rrfScore, stage2Score, rerankerScore
- Provenance tracing: which channels contributed to each result
- Anchor metadata extraction: state, next-steps, decisions, blockers
- Token budget enforcement: results truncated to fit context window

**Current UX Features:**
- `memory_context()`: unified retrieval for general context loading
- `memory_search()`: targeted search with specific query
- `memory_quick_search()`: lightweight search for simple lookups
- Dynamic token budget allocation (feature-flagged)
- Confidence-based result truncation
- Constitutional memory injection (always-surface memories)
- Session boost for working-memory attention

**What's Missing:**
- No score explainability (WHY was this result ranked #1?)
- No per-result confidence signal (how confident is the system in THIS result?)
- No adaptive formatting (same format for quick lookup vs deep research vs session recovery)
- No no-result handling (empty results returned silently)
- No multi-turn session awareness (each query is independent)
- No result quality self-assessment
- No suggested follow-up queries
- No knowledge gap identification

## Current Reality (Feature Catalog Excerpts)

- **Provenance-Rich Response Envelopes** (feature 15-08): Partially implemented. Score aliases preserved but no per-channel attribution breakdown returned to caller.
- **Dynamic Token Budget Allocation** (feature 12-05): Implemented. Adjusts result count based on available tokens.
- **Unified Context Retrieval** (feature 01-01): Implemented. `memory_context()` handler with multiple modes (focused, broad, session).
- **UX Hooks Automation** (Sprint 004): Some hooks implemented for auto-surfacing context at session start.

## Research Questions

1. **Score Explainability for AI Callers**: How should the system communicate WHY a result was ranked where it is? Per-channel scoring breakdown? Contributing signal names and weights? Fusion attribution? What level of explainability helps an AI assistant make better decisions about which results to use?

2. **Adaptive Result Formatting**: Should `memory_context()` return different structures for different retrieval modes? What would "quick lookup" vs "deep research" vs "session recovery" formatting look like? How should the AI caller signal which mode it needs?

3. **Context Window Optimization**: The system enforces a token budget. Is simple truncation optimal? What about hierarchical summarization of large result sets? Progressive disclosure (summary first, detail on demand)? How do production RAG systems handle context window limits for LLM callers?

4. **Per-Result Confidence Scoring**: Beyond the composite fusion score (0-1), should each result carry a confidence signal? How to compute confidence — from score distribution (gap between #1 and #2), channel agreement, query-document relevance certainty? What confidence thresholds are useful for the AI caller?

5. **No-Result and Low-Quality UX**: When retrieval returns nothing useful (no results, or all results below threshold), how should the system respond? Suggest related queries? Identify knowledge gaps? Recommend memory creation? What do production knowledge systems do here?

6. **Multi-Turn Session Intelligence**: How should the system leverage the calling AI's conversation history to refine subsequent queries? Session-aware re-ranking? Query refinement suggestions? Result deduplication across turns? How to maintain retrieval coherence across a multi-step task?

## Constraints

- The "user" is an AI assistant calling via MCP — not a human with a GUI
- Response format is structured MCP tool response (JSON-like)
- Adding fields to response envelopes is cheap but bloating hurts context budgets
- The AI caller has limited ability to provide feedback — mostly implicit
- Sub-second p95 latency requirement for simple queries
- Size recommendations as S (days), M (weeks), L (months)

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (RAG UX for AI callers, result presentation patterns, context optimization — cite papers and production systems)
3. **Gap Analysis** (current system vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, MCP response schema sketch, expected impact on caller quality, feature flag name)
5. **Risk Assessment** (context budget bloat, latency costs, backwards compatibility)
6. **Cross-Dimensional Dependencies** (how UX connects to Fusion D1, Query D2, Graph D3, Feedback D4)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: cocoindex_code starting
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a deep research pass on D5 for retrieval UX/result presentation. First I’m checking the project’s required research workflow and locating the relevant retrieval code paths so the recommendations stay grounded in both the current implementation and current RAG practice.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: sk-deep-research
description: "Autonomous deep research loop protocol with iterative investigation, externalized state, convergence detection, and fresh context per iteration"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task, WebFetch, memory_context, memory_search]
# Note: Task tool is for the command executor (loop management). The @deep-research agent itself does NOT have Task (LEAF-only).
argument-hint: "[topic] [:auto|:confirm] [--max-iterations=N] [--convergence=N]"
version: 1.0.0
---

<!-- Keywords: autoresearch, deep-research, iterative-research, autonomous-loop, convergence-detection, externalized-state, fresh-context, research-agent, JSONL-state, strategy-file -->

# Autonomous Deep Research Loop

Iterative research protocol with fresh context per iteration, externalized state, and convergence detection for deep technical investigation.

Runtime path resolution:
- OpenCode/Copilot runtime: `.opencode/agent/*.md`
- ChatGPT runtime: `.opencode/agent/chatgpt/*.md`
- Claude runtime: `.claude/agents/*.md`
- Codex runtime: `.codex/agents/*.toml`
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


<!-- ANCHOR:when-to-use -->
## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Research Dimension D5: Retrieval UX & Result Presentation for a production Hybrid RAG Fusion MCP server; deep research on score explainability, adaptive result formatting, context window optimization, per-result confidence, no-result UX, and multi-turn session intelligence" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep research(phrase), context, deep(name), per, research(name)"
  },
  {
    "skill": "mcp-code-mode",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.31,
    "passes_threshold": true,
    "reason": "Matched: !intent:tooling, !mcp(multi), !server(multi), context, mcp(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
codex
SKILL ROUTING: `sk-deep-research` (confidence `0.95`), with `system-spec-kit` as supporting workflow context for memory/retrieval conventions. I’m now grounding the research in the actual server implementation so the gaps and schema proposals map cleanly onto what already exists.
tool cocoindex_code.search({"query":"memory_context handler unified retrieval modes focused broad session token budget truncation provenance score aliases result envelope","languages":"typescript","paths":["**/*memory*.ts","**/*retriev*.ts","**/*search*.ts","**/*mcp*.ts"],"limit":8,"refresh_index":true})
cocoindex_code.search({"query":"memory_context handler unified retrieval modes focused broad session token budget truncation provenance score aliases result envelope","languages":"typescript","paths":["**/*memory*.ts","**/*retriev*.ts","**/*search*.ts","**/*mcp*.ts"],"limit":8,"refresh_index":true}) failed in 1ms:
{
  "content": [
    {
      "type": "text",
      "text": "Error executing tool search: 1 validation error for searchArguments\nlanguages\n  Input should be a valid list [type=list_type, input_value='typescript', input_type=str]\n    For further information visit https://errors.pydantic.dev/2.12/v/list_type"
    }
  ],
  "isError": true
}
exec
/bin/zsh -lc "find specs -maxdepth 3 \\( -iname '*feature*catalog*' -o -iname '*research*.md' -o -iname '*implementation-summary.md' \\) | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

exec
/bin/zsh -lc 'rg -n "memory_context|memory_search|memory_quick_search|rrfScore|stage2Score|rerankerScore|provenance|token budget|constitutional|session boost|always-surface|anchor metadata|next-steps|blockers|decisions|state" .' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 46ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/010-integration-testing/checklist.md:6:This document records the current verified state for this scope. Use [spec.md](spec.md) and [plan.md](plan.md) to trace requirements and implementation evidence.
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/010-integration-testing/checklist.md:73:- [x] CHK-040 [P1] `spec.md` and `plan.md` reflect the shipped phase state [Evidence: Both files now describe the active E2E and integration surface.]
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/012-query-intelligence/memory/metadata.json:25:    "decisions": 0,
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/scratch/agent-output-iter-003-copilot-C2.md:7:| FILES array + file objects | Yes | **Yes** (DESCRIPTION, _provenance) | **HIGH** |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/016-json-mode-hybrid-enrichment/scratch/agent-output-iter-003-copilot-C2.md:20:Also starts with shallow copy (workflow.ts:1244), but its operations are safer — observations, FILES, trigger phrases, decisions, recentContext are all rebuilt with spread operators, not mutated in place.
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:42:- [PROJECT STATE SNAPSHOT](#project-state-snapshot)
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:46:- [DECISIONS](#decisions)
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:76:**Decisions:** 6 decisions recorded
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:109:<!-- ANCHOR:project-state-snapshot -->
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:110:<a id="project-state-snapshot"></a>
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:123:<!-- /ANCHOR:project-state-snapshot -->
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:227:<!-- ANCHOR:decisions -->
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:228:<a id="decisions"></a>
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:394:<!-- /ANCHOR:decisions -->
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:436:| State Mismatch | Files don't match expected state | Verify with `git status` and `git diff` |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:437:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion" })` |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:449:memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion", limit: 10 })
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:455:memory_search({ query: "orphaned", anchors: ["state"] })
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:464:2. **Load memory context** - Use memory_search to surface prior work
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/004-ux-hooks-automation/memory/06-03-26_20-30__review-13-fixes-applied.md:465:3. **Review last session state** - Check PROJECT STATE SNAPSHOT
codex
The first broad grep was too noisy, so I’m tightening it to the actual memory server paths and semantic search. Next step is to pull the concrete handler/schema files for `memory_context`, `memory_search`, scoring, and response envelopes.
tool cocoindex_code.search({"query":"memory_context unified retrieval modes focused broad session token budget truncation provenance score aliases result envelope","languages":["typescript"],"paths":[".opencode/**/*",".**/*"],"limit":8,"refresh_index":true})
cocoindex_code.search({"query":"memory_context unified retrieval modes focused broad session token budget truncation provenance score aliases result envelope","languages":["typescript"],"paths":[".opencode/**/*",".**/*"],"limit":8,"refresh_index":true}) success in 6.51s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [],\n  \"total_returned\": 0,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [],
    "total_returned": 0,
    "offset": 0,
    "message": null
  },
  "isError": false
}
exec
/bin/zsh -lc 'rg --files . | rg "memory|retriev|search|fusion|rrf|rerank|sqlite|mcp"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml
./.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml
./.opencode/command/spec_kit/deep-research.md
./.opencode/command/memory/README.txt
./.opencode/command/memory/save.md
./.opencode/command/memory/manage.md
./.opencode/command/memory/analyze.md
./.opencode/command/memory/continue.md
./.opencode/command/memory/shared.md
./.opencode/command/memory/learn.md
./.opencode/agent/deep-research.md
./.opencode/agent/chatgpt/deep-research.md
./.opencode/changelog/18--mcp-clickup/v1.0.0.md
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/spec.md
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/plan.md
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/checklist.md
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/description.json
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/implementation-summary.md
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/memory/20-02-26_13-42__memory-command-output.md
./.opencode/specs/03--commands-and-skills/014-cmd-memory-output/memory/20-02-26_14-44__memory-command-output.md
exec
/bin/zsh -lc "find . -path '*node_modules*' -prune -o -path '*/dist/*' -prune -o -type f \\( -name '*.ts' -o -name '*.md' \\) | rg 'memory|retriev|fusion|search|mcp'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 534ms:
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-discovery.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/README.md
./.opencode/skill/system-spec-kit/mcp_server/handlers/causal-links-processor.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/types.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-delete.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/validation-responses.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/post-insert.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/dedup.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/markdown-evidence-builder.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/README.md
codex
I’ve confirmed the relevant design docs are in the `system-spec-kit` feature catalog, but I still want the live TypeScript handlers so the recommendations line up with what ships. I’m drilling into the actual source files and the retrieval feature docs in parallel.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/15--retrieval-enhancements/08-provenance-rich-response-envelopes.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Provenance-rich response envelopes"
description: "Provenance-rich response envelopes expose internal pipeline scoring and retrieval trace data in search results when `includeTrace` is enabled."
---

# Provenance-rich response envelopes

## 1. OVERVIEW

Provenance-rich response envelopes expose internal pipeline scoring and retrieval trace data in search results when `includeTrace` is enabled.

When you search for something, the system normally just gives you the answer. With this feature turned on, it also shows you how it found the answer: which search methods it used, how it scored each result and where the information came from. It is like getting a receipt with your purchase that shows every step of the transaction.

---

## 2. CURRENT REALITY

**IMPLEMENTED (Sprint 019).** Search results gain optional provenance envelopes (default `includeTrace: false`) exposing internal pipeline scoring that is currently dropped at Stage 4 exit. When enabled, responses include `scores` (semantic, lexical, fusion, intentAdjusted, composite, rerank, attention), `source` (file, anchorIds, anchorTypes, lastModified, memoryState) and `trace` (channelsUsed, pipelineStages, fallbackTier, queryComplexity, expansionTerms, budgetTruncated, scoreResolution).

---
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/12--query-intelligence/02-relative-score-fusion-in-shadow-mode.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Relative score fusion in shadow mode"
description: "Relative score fusion (RSF) is a standalone fusion module retained for future use but no longer wired into live ranking."
---

# Relative score fusion in shadow mode

## 1. OVERVIEW

Relative score fusion (RSF) is a standalone fusion module retained for future use but no longer wired into live ranking.

When you search for something, multiple search methods each return their own ranked lists of results. This feature is an alternative way to merge those lists into one final ranking. It is currently shelved and not actively used, but it remains available if the team decides to switch merging strategies in the future.

---

## 2. CURRENT REALITY

RRF remains the live fusion method. RSF no longer runs in the shipped hybrid-search ranking path.

The repository still contains the standalone RSF fusion module and tests for three variants: single-pair (fusing two ranked lists), multi-list (fusing N lists with proportional penalties for missing sources) and cross-variant (fusing results across query expansions with a +0.10 convergence bonus). Those artifacts can be exercised in isolation, but they are not wired into live ranking.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/feature_catalog/01--retrieval/01-unified-context-retrieval-memorycontext.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Unified context retrieval (memory_context)"
description: "Describes the L1 orchestration layer that auto-detects task intent and routes to the best retrieval strategy."
---

# Unified context retrieval (memory_context)

## 1. OVERVIEW

Describes the L1 orchestration layer that auto-detects task intent and routes to the best retrieval strategy.

When you ask the system a question, it figures out what kind of help you need and automatically picks the best way to find the answer. Think of it like a smart librarian who reads your request, decides whether you need a quick lookup or a deep research session and then fetches the right materials for you. Without this, you would have to manually tell the system how to search every time.

---

## 2. CURRENT REALITY

You send a query or prompt. The system figures out what you need. That is the core idea behind `memory_context`: an L1 orchestration layer that auto-detects your task intent and routes to the best retrieval strategy without you having to pick one.

Intent detection classifies your input into one of seven types (add_feature, fix_bug, refactor, security_audit, understand, find_spec, find_decision) and maps it to a retrieval mode. Five modes are available: auto (default, intent-detected routing), quick (trigger matching for fast lookups), deep (comprehensive semantic search across the full corpus), focused (intent-optimized with tighter filtering) and resume (session recovery targeting state, next-steps, summary and blocker anchors with full content included).
exec
/bin/zsh -lc "rg -n \"function memory_context|memory_context\\(|memory_search\\(|memory_quick_search\\(|rrfScore|stage2Score|rerankerScore|provenance\" .opencode --glob '"'!**/dist/**'"' --glob '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 12ms:
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/audit-v3-c03-search-scoring-analysis.md:12:Stop syncing `attentionScore` inside score-alias helpers. Preserve the raw attention/session signal in a dedicated field such as `rawAttentionScore` or `sessionAttentionScore`, and reserve `score`/`rrfScore`/`intentAdjustedScore` for ranking aliases only.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/02-03-26_16-36__cross-ai-review-phase-018-launch.md:476:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion" })` |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/02-03-26_16-36__cross-ai-review-phase-018-launch.md:488:memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion", limit: 10 })
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/02-03-26_16-36__cross-ai-review-phase-018-launch.md:494:memory_search({ query: "orphaned", anchors: ["state"] })
.opencode/specs/01--anobel.com/034-form-bot-problem/memory/07-03-26_10-50__planning-package-remediated-after-ultra-think.md:374:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "01--anobel.com/034-form-bot-problem" })` |
.opencode/specs/01--anobel.com/034-form-bot-problem/memory/07-03-26_10-50__planning-package-remediated-after-ultra-think.md:386:memory_search({ specFolder: "01--anobel.com/034-form-bot-problem", limit: 10 })
.opencode/specs/01--anobel.com/034-form-bot-problem/memory/07-03-26_10-50__planning-package-remediated-after-ultra-think.md:392:memory_search({ query: "orphaned", anchors: ["state"] })
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/02-03-26_19-40__gemini-codex-review-14-findings.md:421:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion" })` |
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/02-03-26_19-40__gemini-codex-review-14-findings.md:433:memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion", limit: 10 })
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/memory/02-03-26_19-40__gemini-codex-review-14-findings.md:439:memory_search({ query: "orphaned", anchors: ["state"] })
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA10-C20-remediation-plan.md:177:### 22. O16-P1-01 / C07-P2-1 — Semantic file enhancement strips provenance markers
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA10-C20-remediation-plan.md:178:- **Description:** When semantic descriptions are added, provenance markers are dropped, so downstream consumers cannot tell synthetic file context from original evidence.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA10-C20-remediation-plan.md:180:- **Specific fix recommendation:** Preserve `_provenance` / `_synthetic` metadata when matching and enriching files, and ensure merge logic carries those fields forward.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/research/agent-outputs/stateless-research/audit-QA10-C20-remediation-plan.md:215:3. **Harden parser/type integrity after behavior settles:** address `SessionData` typing, mutation semantics, frontmatter parsing, observation capping, and provenance preservation once the runtime data shape is stable.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/review-2026-03-06/agent-4-adr-quality.md:88:  - Excellent provenance: cites the exact source (triple ultra-think + 10-agent cross-AI review) with agent counts and dates.
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/005-architecture-audit/scratch/z-archive-prior-audit/review-2026-03-06/agent-4-adr-quality.md:124:  - Proper merge provenance (from former spec 030, with archived source location).
.opencode/specs/01--anobel.com/034-form-bot-problem/memory/07-03-26_10-37__doc-package-remediation-completed.md:372:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "01--anobel.com/034-form-bot-problem" })` |
.opencode/specs/01--anobel.com/034-form-bot-problem/memory/07-03-26_10-37__doc-package-remediation-completed.md:384:memory_search({ specFolder: "01--anobel.com/034-form-bot-problem", limit: 10 })
.opencode/specs/01--anobel.com/034-form-bot-problem/memory/07-03-26_10-37__doc-package-remediation-completed.md:390:memory_search({ query: "orphaned", anchors: ["state"] })
.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/000-dynamic-capture-deprecation/003-multi-cli-parity/memory/quarantine/18-03-26_15-17__fixed-two-runtime-issues-discovered-after-phase-a.md:379:| Memory Not Found | Search returns no results | Check `memory_search({ specFolder: "02--system-spec-kit/022-hybrid-rag-fusion/025-capture-quality-parity" })` |
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Memory Context
// ────────────────────────────────────────────────────────────────

import { randomUUID } from 'crypto';

// Layer definitions
import * as layerDefs from '../lib/architecture/layer-definitions';
import { checkDatabaseUpdated } from '../core';
import { toErrorMessage } from '../utils';

// Intent classifier
import * as intentClassifier from '../lib/search/intent-classifier';

// Core handlers for routing
import { handleMemorySearch } from './memory-search';
import { handleMemoryMatchTriggers } from './memory-triggers';

// Response envelope
import { createMCPErrorResponse, createMCPResponse } from '../lib/response/envelope';
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Search
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. DEPENDENCIES
──────────────────────────────────────────────────────────────── */

import * as toolCache from '../lib/cache/tool-cache';
import * as sessionManager from '../lib/session/session-manager';
import * as intentClassifier from '../lib/search/intent-classifier';
// TierClassifier, crossEncoder imports removed — only used by legacy V1 pipeline.
import { isEnabled as isSessionBoostEnabled } from '../lib/search/session-boost';
import { isEnabled as isCausalBoostEnabled } from '../lib/search/causal-boost';
// 4-stage pipeline architecture
import { executePipeline } from '../lib/search/pipeline';
import type { PipelineConfig, PipelineResult } from '../lib/search/pipeline';
import type { IntentWeightsConfig } from '../lib/search/pipeline/types';
import { initConsumptionLog, logConsumptionEvent } from '../lib/telemetry/consumption-logger';
import * as retrievalTelemetry from '../lib/telemetry/retrieval-telemetry';
// Artifact-class routing (spec/plan/tasks/checklist/memory)
exec
/bin/zsh -lc 'ls -la .opencode/skill/system-spec-kit/mcp_server/handlers' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
total 1000
drwxr-xr-x@ 35 michelkerkmeester  staff   1120 Mar 21 15:58 .
drwxr-xr-x@ 36 michelkerkmeester  staff   1152 Mar 21 15:58 ..
-rw-r--r--@  1 michelkerkmeester  staff   4830 Mar 18 18:35 README.md
-rw-r--r--@  1 michelkerkmeester  staff  27479 Mar 15 07:57 causal-graph.ts
-rw-r--r--@  1 michelkerkmeester  staff   6313 Mar 15 07:57 causal-links-processor.ts
-rw-r--r--@  1 michelkerkmeester  staff  17992 Mar 19 14:00 checkpoints.ts
-rw-r--r--@  1 michelkerkmeester  staff  22757 Mar 21 15:58 chunking-orchestrator.ts
-rw-r--r--@  1 michelkerkmeester  staff  10450 Mar 21 15:58 eval-reporting.ts
-rw-r--r--@  1 michelkerkmeester  staff   2926 Mar 15 07:57 handler-utils.ts
-rw-r--r--@  1 michelkerkmeester  staff   5217 Mar 21 15:58 index.ts
-rw-r--r--@  1 michelkerkmeester  staff  11630 Mar 19 09:12 memory-bulk-delete.ts
-rw-r--r--@  1 michelkerkmeester  staff  35368 Mar 21 15:58 memory-context.ts
-rw-r--r--@  1 michelkerkmeester  staff  11571 Mar 19 09:12 memory-crud-delete.ts
-rw-r--r--@  1 michelkerkmeester  staff  22910 Mar 20 18:34 memory-crud-health.ts
-rw-r--r--@  1 michelkerkmeester  staff   7152 Mar 15 07:57 memory-crud-list.ts
-rw-r--r--@  1 michelkerkmeester  staff  13158 Mar 15 07:57 memory-crud-stats.ts
-rw-r--r--@  1 michelkerkmeester  staff   3821 Mar 15 07:57 memory-crud-types.ts
-rw-r--r--@  1 michelkerkmeester  staff  13327 Mar 19 09:12 memory-crud-update.ts
-rw-r--r--@  1 michelkerkmeester  staff   3630 Mar 20 18:34 memory-crud-utils.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ────────────────────────────────────────────────────────────────
// MODULE: Search Results Formatter
// ────────────────────────────────────────────────────────────────

// Node stdlib
import fs from 'fs';

// Internal modules
import { estimateTokens } from './token-metrics';

// Import path security utilities (migrated from shared/utils.js)
import { validateFilePath } from '../lib/utils/path-security';
import {
  readSessionTransitionTrace,
  type SessionTransitionTrace,
} from '../lib/search/session-transition';

// Import memory parser for anchor extraction (SK-005)
import * as memoryParser from '../lib/parsing/memory-parser';

exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Evidence Gap Detector
// ───────────────────────────────────────────────────────────────
// Feature catalog: Signal vocabulary expansion
// Transparent Reasoning Module (TRM): Z-score confidence check
// On RRF scores to detect low-confidence retrieval and inject
// Warnings for the MCP markdown output layer.
// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Z-score threshold below which retrieval confidence is considered low. */
const Z_SCORE_THRESHOLD = 1.5;

/** Absolute minimum score; any top score below this triggers a gap. */
const MIN_ABSOLUTE_SCORE = 0.015;

/**
 * Minimum number of memory nodes that must be connected to matched graph
 * nodes before the graph coverage is considered sufficient.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Truncation
// ───────────────────────────────────────────────────────────────
// Feature catalog: Confidence-based result truncation
/* --- 1. TYPES & CONSTANTS --- */

/** Generic scored result for truncation — supports both numeric and string IDs. */
interface ScoredResult {
  id: number | string;
  score: number;
  [key: string]: unknown;
}

/** Result of a truncation operation with full audit metadata. */
interface TruncationResult {
  results: ScoredResult[];
  truncated: boolean;
  originalCount: number;
  truncatedCount: number;
  /** Inclusive index of the last kept result (0-based). */
exec
/bin/zsh -lc 'rg -n "includeTrace|tokenBudget|quick|deep|focused|resume|pressure|no results|no-results|empty|sessionTransition|knowledge gap|follow-up|hint|confidence" .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:124:  sessionTransition?: SessionTransitionTrace;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:335:  const sessionTransition = readSessionTransitionTrace(extraData?.sessionTransition) ?? undefined;
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:347:    sessionTransition,
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:364:  includeTrace: boolean = false
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:370:    // REQ-019: Use standardized empty response envelope
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:380:      hints: [
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:416:    if (includeTrace) {
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:546:  // REQ-019: Build hints based on context
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:547:  const hints: string[] = [];
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:549:    hints.push('Anchor filtering applied for token efficiency');
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:552:    hints.push('Use includeContent: true to embed file contents in results');
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:555:    hints.push('Some files could not be read - check file paths');
.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:576:    hints,
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:5:// Transparent Reasoning Module (TRM): Z-score confidence check
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:6:// On RRF scores to detect low-confidence retrieval and inject
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:12:/** Z-score threshold below which retrieval confidence is considered low. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:33:  /** True when retrieval confidence is too low to trust results. */
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:132: * - The input array is empty.
.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts:191:  return `> **[EVIDENCE GAP DETECTED]: Retrieved context has low mathematical confidence (Z=${trm.zScore.toFixed(2)}). Consider first principles.**`;
.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts:42: * Check whether confidence-based truncation is enabled.
exec
/bin/zsh -lc "sed -n '520,700p' .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
              anchorsFound: 0
            };
          }
        }

        formattedResult.content = content;
      } catch (err: unknown) {
        formattedResult.content = null;
        const message = err instanceof Error ? err.message : String(err);
        // BUG-023 FIX: Sanitize error messages to prevent information leakage
        formattedResult.contentError = message.includes('Access denied')
          ? 'Security: Access denied'
          : message.includes('ENOENT')
            ? 'File not found'
            : 'Failed to read file';
      }
    }

    return formattedResult;
  }));
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Envelope
// ───────────────────────────────────────────────────────────────
import { estimateTokens } from '../../formatters/token-metrics';

// Feature catalog: Provenance-rich response envelopes


// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Describes the ResponseMeta shape.
 */
export interface ResponseMeta {
  tool: string;
  tokenCount: number;
  tokenBudget?: number;
  latencyMs?: number;
exec
/bin/zsh -lc "sed -n '430,930p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '330,820p' .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
}

/* ───────────────────────────────────────────────────────────────
   3. CONTEXT MODE DEFINITIONS
──────────────────────────────────────────────────────────────── */

const CONTEXT_MODES: Record<string, ContextMode> = {
  // Auto-detect: Let the system determine the best approach
  auto: {
    name: 'Auto',
    description: 'Automatically detect intent and route to optimal strategy',
    strategy: 'adaptive'
  },

  // Quick: Fast trigger-based matching for reactive context
  quick: {
    name: 'Quick',
    description: 'Fast trigger matching for real-time context (low latency)',
    strategy: 'triggers',
    tokenBudget: 800
 succeeded in 0ms:
    specFolder,
    tenantId,
    userId,
    agentId,
    sharedSpaceId,
    limit: rawLimit = 10,
    tier,
    contextType,
    useDecay: useDecay = true,
    includeContiguity: includeContiguity = false,
    includeConstitutional: includeConstitutional = true,
    includeContent: includeContent = false,
    anchors,
    bypassCache: bypassCache = false,
    sessionId,
    enableDedup: enableDedup = true,
    intent: explicitIntent,
    autoDetectIntent: autoDetectIntent = true,
    minState: minState = 'WARM',
    applyStateLimits: applyStateLimits = false,
codex
I’ve got the live behavior now: there is already a trace envelope, empty-response hints, session transition trace, and confidence truncation, but the caller-facing contract is still pretty “flat.” I’m switching to external research next so I can compare this against current RAG patterns for agent-facing retrieval APIs rather than human UI patterns.
🌐 Searching the web...
🌐 Searched: Azure AI Search semantic ranker debug subscores official docs
🌐 Searching the web...
🌐 Searched: site:docs.anthropic.com context editing Anthropic docs
🌐 Searching the web...
🌐 Searched: site:docs.vespa.ai document summaries match-features ranking explainability
🌐 Searching the web...
🌐 Searched: site:docs.anthropic.com "context editing" Anthropic
🌐 Searching the web...
🌐 Searched: RAG-Fusion arXiv 2024 query reformulation reciprocal rank fusion
🌐 Searching the web...
🌐 Searched: site:arxiv.org RAG-Fusion Retrieval Augmented Generation Fusion arxiv
🌐 Searching the web...
🌐 Searched: "Corrective Retrieval Augmented Generation" arxiv.org
🌐 Searching the web...
🌐 Searched: "RAG-Fusion" github io paper
🌐 Searching the web...
🌐 Searched: site:elastic.co Elasticsearch explain search results retriever profile docs
🌐 Searching the web...
🌐 Searched: site:elastic.co explain API search results elastic docs ranking
🌐 Searching the web...
🌐 Searched: site:docs.langchain.com contextual compression retriever LangChain
codex
I have enough of the implementation shape to start writing recommendations, but I’m grabbing exact file/line anchors now so the gap analysis points to concrete behavior instead of paraphrasing. After that I’ll synthesize the external survey with the local reality into the D5 output format you asked for.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts | sed -n '440,920p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts | sed -n '340,820p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts | sed -n '150,620p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   150	  }
   151	  // Additional check for .. patterns (not just null bytes which shared handles)
   152	  if (filePath.includes('..')) {
   153	    throw new Error('Access denied: Invalid path pattern');
   154	  }
   155	  return result;
   156	}
   157	
   158	// ────────────────────────────────────────────────────────────────
   159	// 3. HELPER UTILITIES 
   160	
   161	// ────────────────────────────────────────────────────────────────
   162	
   163	export function safeJsonParse<T>(str: string | null | undefined, fallback: T): T {
   164	  if (!str) return fallback;
   165	  try {
   166	    return JSON.parse(str) as T;
   167	  } catch (_error: unknown) {
   168	    return fallback;
   169	  }
 succeeded in 0ms:
   440	    description: 'Automatically detect intent and route to optimal strategy',
   441	    strategy: 'adaptive'
   442	  },
   443	
   444	  // Quick: Fast trigger-based matching for reactive context
   445	  quick: {
   446	    name: 'Quick',
   447	    description: 'Fast trigger matching for real-time context (low latency)',
   448	    strategy: 'triggers',
   449	    tokenBudget: 800
   450	  },
   451	
   452	  // Deep: Comprehensive semantic search with full context
   453	  deep: {
   454	    name: 'Deep',
   455	    description: 'Semantic search with full context retrieval',
   456	    strategy: 'search',
   457	    tokenBudget: 2000
   458	  },
   459	
 succeeded in 0ms:
   340	    includeConstitutional: includeConstitutional = true,
   341	    includeContent: includeContent = false,
   342	    anchors,
   343	    bypassCache: bypassCache = false,
   344	    sessionId,
   345	    enableDedup: enableDedup = true,
   346	    intent: explicitIntent,
   347	    autoDetectIntent: autoDetectIntent = true,
   348	    minState: minState = 'WARM',
   349	    applyStateLimits: applyStateLimits = false,
   350	    rerank = true, // Enable reranking by default for better result quality
   351	    applyLengthPenalty: applyLengthPenalty = true,
   352	    trackAccess: trackAccess = false, // opt-in, off by default
   353	    includeArchived: includeArchived = false, // REQ-206: exclude archived by default
   354	    enableSessionBoost: enableSessionBoost = isSessionBoostEnabled(),
   355	    enableCausalBoost: enableCausalBoost = isCausalBoostEnabled(),
   356	    minQualityScore,
   357	    min_quality_score,
   358	    mode,
   359	    includeTrace: includeTraceArg = false,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts | sed -n '1,220p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts | sed -n '1,220p'; nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts | sed -n '1,240p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Confidence Truncation
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Confidence-based result truncation
     5	/* --- 1. TYPES & CONSTANTS --- */
     6	
     7	/** Generic scored result for truncation — supports both numeric and string IDs. */
     8	interface ScoredResult {
     9	  id: number | string;
    10	  score: number;
    11	  [key: string]: unknown;
    12	}
    13	
    14	/** Result of a truncation operation with full audit metadata. */
    15	interface TruncationResult {
    16	  results: ScoredResult[];
    17	  truncated: boolean;
    18	  originalCount: number;
    19	  truncatedCount: number;
    20	  /** Inclusive index of the last kept result (0-based). */
🌐 Searching the web...
🌐 Searched: site:www.anthropic.com context editing Claude official
🌐 Searching the web...
🌐 Searched: site:learn.microsoft.com azure ai search subscores semantic ranker debug
🌐 Searching the web...
🌐 Searched: site:www.elastic.co/docs explain API search results Elasticsearch reference
🌐 Searching the web...
🌐 Searched: site:elastic.co explain API elastic search reference _explain
🌐 Searching the web...
🌐 Searched: site:docs.vespa.ai document summaries result presentation query api
🌐 Searching the web...
🌐 Searched: site:arxiv.org "Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection"
🌐 Searching the web...
🌐 Searched: site:aclanthology.org "Corrective Retrieval Augmented Generation"
🌐 Searching the web...
🌐 Searched: https://learn.microsoft.com/en-us/azure/search/semantic-ranking
🌐 Searching the web...
🌐 Searched: 'Explain in RRF' in https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion
🌐 Searching the web...
🌐 Searched: https://docs.vespa.ai/en/reference/schemas/schemas.html
🌐 Searching the web...
🌐 Searched: 'match-features' in https://docs.vespa.ai/en/reference/schemas/schemas.html
🌐 Searching the web...
🌐 Searched: 'Only set "debug": "queryRewrites" for testing purposes' in https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite
🌐 Searching the web...
🌐 Searched: "On the Influence of Context Size and Model Choice in Retrieval-Augmented Generation Systems" arxiv
🌐 Searching the web...
🌐 Searched: site:aclanthology.org "BRIEF" "Bridging Retrieval and Inference through Evidence Fusion"
codex
One correction to the prompt’s “current reality”: in the repository snapshot on March 21, 2026, empty-result handling is no longer silent. The formatter now returns a standardized empty envelope plus hints, so I’m treating D5’s no-result UX gap as “basic handling exists, but it isn’t diagnostic or adaptive yet.”
🌐 Searching the web...
🌐 Searched: site:elastic.co suggesters Elasticsearch reference spelling suggestions
🌐 Searching the web...
🌐 Searched: https://learn.microsoft.com/en-us/azure/search/index-add-suggesters
🌐 Searching the web...
🌐 Searched: 'After context resets' in https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents
codex
**Executive Summary**
- The strongest D5 move is to split retrieval UX into `default` and `debug` contracts: keep the default envelope lean, and expose score attribution, query rewrites, and ranking reasons only on demand. That matches production search patterns in Azure AI Search, Elasticsearch, and Vespa.
- Your current system is further along than the prompt suggests. As of **March 21, 2026**, the repo already has basic empty-result handling, trace envelopes, session transition trace, token budgets, and session dedup; the real gap is that these signals are not yet shaped into an AI-caller-friendly decision contract. See [memory-context.ts:445](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-search.ts:567](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [search-results.ts:369](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [envelope.ts:106](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts).
- Simple tail truncation is no longer state of the art for agent callers. Production systems increasingly use summarization, compaction, selective clearing, and progressive disclosure; recent RAG work also shows too much context hurts quality.
- Per-result confidence should be added, but as a calibrated decision aid, not a second opaque score. The best version combines score margin, cross-channel agreement, reranker support, anchor density, and request-level evidence-gap status.
- No-result UX should become explicit recovery UX: return status codes, likely failure reasons, suggested reformulations, and knowledge-gap signals instead of just `results: []`.

**State of Art Survey**
- **Explainability is opt-in and structured.** Azure exposes debug query rewrites and partial-response reasons only when asked; Elasticsearch exposes RRF score explanations and a verbose Profile API, but explicitly warns that profiling adds overhead. Inference: production systems keep explanation off the hot path by default. Sources: [Azure semantic ranking](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview), [Azure query rewrite debug](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite), [Elastic RRF explain](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion), [Elastic profile](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-profile), [Vespa match-features](https://docs.vespa.ai/en/reference/schemas/schemas.html).
- **Result presentation is task-adaptive.** Azure returns reranked hits plus extractive captions/answers instead of forcing callers to consume raw full documents; Vespa uses document summaries and compact CBOR/JSON variants. Sources: [Azure semantic ranking](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview), [Vespa document summaries](https://docs.vespa.ai/en/querying/document-summaries.html), [Vespa result format](https://docs.vespa.ai/en/reference/querying/default-result-format.html).
- **Context optimization favors compression and progressive disclosure.** Anthropic’s context editing clears stale tool results, and its context engineering guidance explicitly recommends compaction, note-taking, and just-in-time retrieval. Recent papers point the same way: context helps up to a point, then stalls or declines; progressive/coarse-to-fine retrieval and compression reduce latency and noise. Sources: [Anthropic context management](https://claude.com/blog/context-management), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Vladika & Matthes 2025](https://aclanthology.org/2025.findings-naacl.375/), [FunnelRAG 2025](https://aclanthology.org/2025.findings-naacl.165/), [BRIEF 2025](https://aclanthology.org/2025.findings-naacl.301/), [PISCO 2025](https://aclanthology.org/2025.findings-acl.800/).
- **Adaptive retrieval is now mainstream research direction.** RetrievalQA argues systems should decide when retrieval is necessary; R2AG argues retrieval-side signals help the generator use evidence better. Sources: [RetrievalQA 2024](https://aclanthology.org/2024.findings-acl.415/), [R2AG 2024](https://aclanthology.org/2024.findings-emnlp.678/), [RAKI survey 2024](https://aclanthology.org/2024.knowllm-1.5/).
- **Recovery UX uses reformulation and reason codes.** Azure query rewrite returns rewrite candidates, debug traces, and explicit partial-response reasons like `OriginalQueryOnly`; Azure suggesters show a production pattern for query suggestion as a first-class API. Sources: [Azure query rewrite](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite), [Azure suggesters](https://learn.microsoft.com/en-us/azure/search/index-add-suggesters).

**Gap Analysis**
- **Explainability:** current repo exposes `scores`, `source`, and `trace` when `includeTrace=true`, plus `channelsUsed`, but not per-channel numeric contribution or a compact “why this ranked #1” reason string. See [search-results.ts:416](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [memory-search.ts:620](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts).
- **Adaptive formatting:** `quick`, `focused`, `deep`, and `resume` change retrieval behavior and budgets, but the response envelope is still mostly uniform. See [memory-context.ts:445](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-context.ts:865](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts).
- **Context optimization:** current system enforces budgets and truncates, but it does not yet offer hierarchical summaries, continuation tokens, or “summary first, evidence on demand.” See [memory-context.ts:841](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts).
- **Confidence:** you already have confidence truncation and evidence-gap detection, but they are request-level heuristics, not surfaced as per-result confidence objects. See [confidence-truncation.ts:33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts), [evidence-gap-detector.ts:137](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts).
- **No-result UX:** the prompt is outdated here. Basic empty-response hints already exist, but there is still no diagnostic status, reformulation proposal, or explicit knowledge-gap contract. See [search-results.ts:369](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [envelope.ts:174](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts).
- **Multi-turn intelligence:** session dedup, session transition trace, and resume injection exist, but they do not yet form a learned retrieval state across turns. See [memory-context.ts:651](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-search.ts:682](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts).

**Recommendations**
1. **P1: Add a two-tier explainability contract.** Rationale: AI callers need decision support, but full traces should stay opt-in. Size: **M**. Impact: high trust and better evidence selection. Flag: `SPECKIT_RESULT_EXPLAIN_V1`.
```json
{
  "result": {
    "rank": 1,
    "score": 0.81,
    "why": {
      "summary": "Ranked first because semantic, reranker, and decision-anchor signals agreed.",
      "topSignals": ["semantic_match", "anchor:decisions", "reranker_support"],
      "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06, "rerank": 0.19 }
    }
  },
  "debug": { "enabled": false }
}
```

2. **P2: Make response shape explicitly mode-aware.** Rationale: quick lookup, deep research, and session recovery should not share the same payload contract. Size: **M**. Impact: lower token waste and less caller-side branching. Flag: `SPECKIT_RESPONSE_PROFILE_V1`.
```json
{ "presentation": "quick|research|resume|debug" }
```
- `quick`: `topResult`, `oneLineWhy`, `omittedCount`
- `research`: `results[]`, `evidenceDigest`, `followUps[]`
- `resume`: `state`, `nextSteps`, `blockers`, `recentDecisions`

3. **P3: Replace hard tail-truncation with progressive disclosure.** Rationale: the literature and agent practice both favor compression before omission. Size: **L**. Impact: better quality under tight budgets. Flag: `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`.
```json
{
  "summaryLayer": { "count": 10, "digest": "3 strong matches, 2 weak, 1 unresolved conflict" },
  "results": [{ "id": 1, "snippet": "...", "detailAvailable": true }],
  "continuation": { "cursor": "abc", "remainingCount": 6 }
}
```

4. **P4: Add calibrated per-result confidence plus request quality.** Rationale: a single fused score is not the same as confidence. Size: **M**. Impact: better caller abstention, tool chaining, and follow-up decisions. Flag: `SPECKIT_RESULT_CONFIDENCE_V1`.
```json
{
  "result": {
    "confidence": {
      "label": "high|medium|low",
      "value": 0.78,
      "drivers": ["large_margin", "multi_channel_agreement", "reranker_confirmed"]
    }
  },
  "requestQuality": { "label": "good|weak|gap", "evidenceGap": false }
}
```

5. **P5: Upgrade empty/weak retrieval into recovery UX.** Rationale: the right response to weak retrieval is usually reformulate, broaden, switch mode, or create memory. Size: **S**. Impact: fewer silent failures. Flag: `SPECKIT_EMPTY_RESULT_RECOVERY_V1`.
```json
{
  "status": "no_results|low_confidence|partial",
  "reason": "spec_filter_too_narrow|low_signal_query|rewrite_failed|knowledge_gap",
  "suggestedQueries": ["broader query...", "query with spec folder...", "query anchored to decisions"],
  "recommendedAction": "retry_broader|switch_mode|save_memory|ask_user"
}
```

6. **P6: Introduce retrieval session state.** Rationale: current session handling is operational, not strategic. Store what has already been shown, what the agent is trying to prove, and which gaps remain. Size: **L**. Impact: strongest improvement for multi-step tasks. Flag: `SPECKIT_SESSION_RETRIEVAL_STATE_V1`.
```json
{
  "sessionState": {
    "activeGoal": "resume implementation of phase 2",
    "seenResultIds": [12, 18, 44],
    "openQuestions": ["why ranking changed", "missing blocker note"],
    "preferredAnchors": ["state", "next-steps", "decisions"]
  }
}
```

**Risk Assessment**
- **Context budget bloat:** the biggest risk. Mitigation: default to slim mode, require `presentation=debug` or `includeExplain=true` for verbose fields.
- **Latency cost:** per-result attribution and confidence can get expensive if they require extra model calls. Keep v1 heuristic and deterministic.
- **Backward compatibility:** new fields are cheap; changing default envelope shape is not. Add additive fields first, then introduce opt-in `presentation`.
- **False precision:** confidence and attribution can look more certain than they are. Use coarse labels plus driver lists, not pseudo-calibrated decimals alone.

**Cross-Dimensional Dependencies**
- **D1 Fusion:** explainability and confidence depend on exposing per-channel contributions, not just final fused scores.
- **D2 Query Intelligence:** no-result recovery, follow-up queries, and adaptive formatting should reuse query rewrite and query classification work.
- **D3 Graph:** confidence should incorporate graph coverage and graph contribution, especially for “decision” and “next-step” retrieval.
- **D4 Feedback:** session state and confidence labels become much more useful once implicit feedback can tune thresholds, follow-up suggestions, and mode selection.

**Key Sources**
- Local implementation: [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [search-results.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [confidence-truncation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts), [evidence-gap-detector.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts), [envelope.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts)
- External: [Azure semantic ranking](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview), [Azure query rewrite](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite), [Azure suggesters](https://learn.microsoft.com/en-us/azure/search/index-add-suggesters), [Elastic RRF](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion), [Elastic profile](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-profile), [Elastic retrievers](https://www.elastic.co/docs/solutions/search/retrievers-overview), [Vespa document summaries](https://docs.vespa.ai/en/querying/document-summaries.html), [Vespa result format](https://docs.vespa.ai/en/reference/querying/default-result-format.html), [Vespa rank features](https://docs.vespa.ai/en/reference/schemas/schemas.html), [Anthropic context management](https://claude.com/blog/context-management), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [R2AG 2024](https://aclanthology.org/2024.findings-emnlp.678/), [RetrievalQA 2024](https://aclanthology.org/2024.findings-acl.415/), [RAKI survey 2024](https://aclanthology.org/2024.knowllm-1.5/), [Context size study 2025](https://aclanthology.org/2025.findings-naacl.375/), [FunnelRAG 2025](https://aclanthology.org/2025.findings-naacl.165/), [BRIEF 2025](https://aclanthology.org/2025.findings-naacl.301/), [PISCO 2025](https://aclanthology.org/2025.findings-acl.800/)

If you want, I can turn this into a **D5 implementation roadmap** next, with rollout order, evaluation metrics, and exact MCP schema diffs.
tokens used
244,628
**Executive Summary**
- The strongest D5 move is to split retrieval UX into `default` and `debug` contracts: keep the default envelope lean, and expose score attribution, query rewrites, and ranking reasons only on demand. That matches production search patterns in Azure AI Search, Elasticsearch, and Vespa.
- Your current system is further along than the prompt suggests. As of **March 21, 2026**, the repo already has basic empty-result handling, trace envelopes, session transition trace, token budgets, and session dedup; the real gap is that these signals are not yet shaped into an AI-caller-friendly decision contract. See [memory-context.ts:445](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-search.ts:567](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [search-results.ts:369](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [envelope.ts:106](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts).
- Simple tail truncation is no longer state of the art for agent callers. Production systems increasingly use summarization, compaction, selective clearing, and progressive disclosure; recent RAG work also shows too much context hurts quality.
- Per-result confidence should be added, but as a calibrated decision aid, not a second opaque score. The best version combines score margin, cross-channel agreement, reranker support, anchor density, and request-level evidence-gap status.
- No-result UX should become explicit recovery UX: return status codes, likely failure reasons, suggested reformulations, and knowledge-gap signals instead of just `results: []`.

**State of Art Survey**
- **Explainability is opt-in and structured.** Azure exposes debug query rewrites and partial-response reasons only when asked; Elasticsearch exposes RRF score explanations and a verbose Profile API, but explicitly warns that profiling adds overhead. Inference: production systems keep explanation off the hot path by default. Sources: [Azure semantic ranking](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview), [Azure query rewrite debug](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite), [Elastic RRF explain](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion), [Elastic profile](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-profile), [Vespa match-features](https://docs.vespa.ai/en/reference/schemas/schemas.html).
- **Result presentation is task-adaptive.** Azure returns reranked hits plus extractive captions/answers instead of forcing callers to consume raw full documents; Vespa uses document summaries and compact CBOR/JSON variants. Sources: [Azure semantic ranking](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview), [Vespa document summaries](https://docs.vespa.ai/en/querying/document-summaries.html), [Vespa result format](https://docs.vespa.ai/en/reference/querying/default-result-format.html).
- **Context optimization favors compression and progressive disclosure.** Anthropic’s context editing clears stale tool results, and its context engineering guidance explicitly recommends compaction, note-taking, and just-in-time retrieval. Recent papers point the same way: context helps up to a point, then stalls or declines; progressive/coarse-to-fine retrieval and compression reduce latency and noise. Sources: [Anthropic context management](https://claude.com/blog/context-management), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [Vladika & Matthes 2025](https://aclanthology.org/2025.findings-naacl.375/), [FunnelRAG 2025](https://aclanthology.org/2025.findings-naacl.165/), [BRIEF 2025](https://aclanthology.org/2025.findings-naacl.301/), [PISCO 2025](https://aclanthology.org/2025.findings-acl.800/).
- **Adaptive retrieval is now mainstream research direction.** RetrievalQA argues systems should decide when retrieval is necessary; R2AG argues retrieval-side signals help the generator use evidence better. Sources: [RetrievalQA 2024](https://aclanthology.org/2024.findings-acl.415/), [R2AG 2024](https://aclanthology.org/2024.findings-emnlp.678/), [RAKI survey 2024](https://aclanthology.org/2024.knowllm-1.5/).
- **Recovery UX uses reformulation and reason codes.** Azure query rewrite returns rewrite candidates, debug traces, and explicit partial-response reasons like `OriginalQueryOnly`; Azure suggesters show a production pattern for query suggestion as a first-class API. Sources: [Azure query rewrite](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite), [Azure suggesters](https://learn.microsoft.com/en-us/azure/search/index-add-suggesters).

**Gap Analysis**
- **Explainability:** current repo exposes `scores`, `source`, and `trace` when `includeTrace=true`, plus `channelsUsed`, but not per-channel numeric contribution or a compact “why this ranked #1” reason string. See [search-results.ts:416](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [memory-search.ts:620](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts).
- **Adaptive formatting:** `quick`, `focused`, `deep`, and `resume` change retrieval behavior and budgets, but the response envelope is still mostly uniform. See [memory-context.ts:445](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-context.ts:865](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts).
- **Context optimization:** current system enforces budgets and truncates, but it does not yet offer hierarchical summaries, continuation tokens, or “summary first, evidence on demand.” See [memory-context.ts:841](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts).
- **Confidence:** you already have confidence truncation and evidence-gap detection, but they are request-level heuristics, not surfaced as per-result confidence objects. See [confidence-truncation.ts:33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts), [evidence-gap-detector.ts:137](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts).
- **No-result UX:** the prompt is outdated here. Basic empty-response hints already exist, but there is still no diagnostic status, reformulation proposal, or explicit knowledge-gap contract. See [search-results.ts:369](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [envelope.ts:174](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts).
- **Multi-turn intelligence:** session dedup, session transition trace, and resume injection exist, but they do not yet form a learned retrieval state across turns. See [memory-context.ts:651](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-search.ts:682](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts).

**Recommendations**
1. **P1: Add a two-tier explainability contract.** Rationale: AI callers need decision support, but full traces should stay opt-in. Size: **M**. Impact: high trust and better evidence selection. Flag: `SPECKIT_RESULT_EXPLAIN_V1`.
```json
{
  "result": {
    "rank": 1,
    "score": 0.81,
    "why": {
      "summary": "Ranked first because semantic, reranker, and decision-anchor signals agreed.",
      "topSignals": ["semantic_match", "anchor:decisions", "reranker_support"],
      "channelContribution": { "vector": 0.44, "fts": 0.12, "graph": 0.06, "rerank": 0.19 }
    }
  },
  "debug": { "enabled": false }
}
```

2. **P2: Make response shape explicitly mode-aware.** Rationale: quick lookup, deep research, and session recovery should not share the same payload contract. Size: **M**. Impact: lower token waste and less caller-side branching. Flag: `SPECKIT_RESPONSE_PROFILE_V1`.
```json
{ "presentation": "quick|research|resume|debug" }
```
- `quick`: `topResult`, `oneLineWhy`, `omittedCount`
- `research`: `results[]`, `evidenceDigest`, `followUps[]`
- `resume`: `state`, `nextSteps`, `blockers`, `recentDecisions`

3. **P3: Replace hard tail-truncation with progressive disclosure.** Rationale: the literature and agent practice both favor compression before omission. Size: **L**. Impact: better quality under tight budgets. Flag: `SPECKIT_PROGRESSIVE_DISCLOSURE_V1`.
```json
{
  "summaryLayer": { "count": 10, "digest": "3 strong matches, 2 weak, 1 unresolved conflict" },
  "results": [{ "id": 1, "snippet": "...", "detailAvailable": true }],
  "continuation": { "cursor": "abc", "remainingCount": 6 }
}
```

4. **P4: Add calibrated per-result confidence plus request quality.** Rationale: a single fused score is not the same as confidence. Size: **M**. Impact: better caller abstention, tool chaining, and follow-up decisions. Flag: `SPECKIT_RESULT_CONFIDENCE_V1`.
```json
{
  "result": {
    "confidence": {
      "label": "high|medium|low",
      "value": 0.78,
      "drivers": ["large_margin", "multi_channel_agreement", "reranker_confirmed"]
    }
  },
  "requestQuality": { "label": "good|weak|gap", "evidenceGap": false }
}
```

5. **P5: Upgrade empty/weak retrieval into recovery UX.** Rationale: the right response to weak retrieval is usually reformulate, broaden, switch mode, or create memory. Size: **S**. Impact: fewer silent failures. Flag: `SPECKIT_EMPTY_RESULT_RECOVERY_V1`.
```json
{
  "status": "no_results|low_confidence|partial",
  "reason": "spec_filter_too_narrow|low_signal_query|rewrite_failed|knowledge_gap",
  "suggestedQueries": ["broader query...", "query with spec folder...", "query anchored to decisions"],
  "recommendedAction": "retry_broader|switch_mode|save_memory|ask_user"
}
```

6. **P6: Introduce retrieval session state.** Rationale: current session handling is operational, not strategic. Store what has already been shown, what the agent is trying to prove, and which gaps remain. Size: **L**. Impact: strongest improvement for multi-step tasks. Flag: `SPECKIT_SESSION_RETRIEVAL_STATE_V1`.
```json
{
  "sessionState": {
    "activeGoal": "resume implementation of phase 2",
    "seenResultIds": [12, 18, 44],
    "openQuestions": ["why ranking changed", "missing blocker note"],
    "preferredAnchors": ["state", "next-steps", "decisions"]
  }
}
```

**Risk Assessment**
- **Context budget bloat:** the biggest risk. Mitigation: default to slim mode, require `presentation=debug` or `includeExplain=true` for verbose fields.
- **Latency cost:** per-result attribution and confidence can get expensive if they require extra model calls. Keep v1 heuristic and deterministic.
- **Backward compatibility:** new fields are cheap; changing default envelope shape is not. Add additive fields first, then introduce opt-in `presentation`.
- **False precision:** confidence and attribution can look more certain than they are. Use coarse labels plus driver lists, not pseudo-calibrated decimals alone.

**Cross-Dimensional Dependencies**
- **D1 Fusion:** explainability and confidence depend on exposing per-channel contributions, not just final fused scores.
- **D2 Query Intelligence:** no-result recovery, follow-up queries, and adaptive formatting should reuse query rewrite and query classification work.
- **D3 Graph:** confidence should incorporate graph coverage and graph contribution, especially for “decision” and “next-step” retrieval.
- **D4 Feedback:** session state and confidence labels become much more useful once implicit feedback can tune thresholds, follow-up suggestions, and mode selection.

**Key Sources**
- Local implementation: [memory-context.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts), [memory-search.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts), [search-results.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts), [confidence-truncation.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/confidence-truncation.ts), [evidence-gap-detector.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/evidence-gap-detector.ts), [envelope.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts)
- External: [Azure semantic ranking](https://learn.microsoft.com/en-us/azure/search/semantic-search-overview), [Azure query rewrite](https://learn.microsoft.com/en-us/azure/search/semantic-how-to-query-rewrite), [Azure suggesters](https://learn.microsoft.com/en-us/azure/search/index-add-suggesters), [Elastic RRF](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/reciprocal-rank-fusion), [Elastic profile](https://www.elastic.co/docs/reference/elasticsearch/rest-apis/search-profile), [Elastic retrievers](https://www.elastic.co/docs/solutions/search/retrievers-overview), [Vespa document summaries](https://docs.vespa.ai/en/querying/document-summaries.html), [Vespa result format](https://docs.vespa.ai/en/reference/querying/default-result-format.html), [Vespa rank features](https://docs.vespa.ai/en/reference/schemas/schemas.html), [Anthropic context management](https://claude.com/blog/context-management), [Anthropic context engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents), [R2AG 2024](https://aclanthology.org/2024.findings-emnlp.678/), [RetrievalQA 2024](https://aclanthology.org/2024.findings-acl.415/), [RAKI survey 2024](https://aclanthology.org/2024.knowllm-1.5/), [Context size study 2025](https://aclanthology.org/2025.findings-naacl.375/), [FunnelRAG 2025](https://aclanthology.org/2025.findings-naacl.165/), [BRIEF 2025](https://aclanthology.org/2025.findings-naacl.301/), [PISCO 2025](https://aclanthology.org/2025.findings-acl.800/)

If you want, I can turn this into a **D5 implementation roadmap** next, with rollout order, evaluation metrics, and exact MCP schema diffs.
