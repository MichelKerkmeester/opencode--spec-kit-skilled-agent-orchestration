OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d114c-5d48-7833-9975-1e8f1cc6fbdf
--------
user
# Research Dimension D3: Graph-Augmented Retrieval & Knowledge Structure

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching graph-augmented retrieval for a production Hybrid RAG Fusion system. The system maintains a causal knowledge graph alongside vector/lexical indexes, built in TypeScript with SQLite.

**Graph Infrastructure:**
- `causal_edges` table: stores typed edges between memory documents (relations: CORRECTION, PREFERENCE, DEPENDS_ON, EXTENDS, etc.)
- Graph search channel: traverses causal edges to find related documents
- Graph weight boost: 1.5x flat in RRF fusion for graph-sourced results
- Community detection: BFS components + Louvain fallback (pre-computed, not live in Stage 2)
- Co-activation spreading: from top-5 search seeds, spread activation to graph neighbors
- Graph signals in Stage 2: momentum (N2a) + causal depth (N2b)
- Typed-weighted degree (R4): 5th RRF channel added in Sprint 1

**Current State:**
- Graph was completely broken (0% hit rate) in Sprint 0 — fixed by correcting ID format
- Edge density measurement implemented but the density question remains open
- Community detection assignments are "stale" — pre-computed, not refreshed on query
- Sprint 6b (centrality measures, sophisticated community detection) is GATED on a feasibility spike
- Entity extraction is not automated — edges are manually curated or inferred from spec-kit metadata
- TM-08 signal vocabulary: CORRECTION, PREFERENCE types were added in Sprint 1

**Feature Flags:**
- `SPECKIT_CAUSAL_BOOST` — graph-traversal amplification
- `SPECKIT_CO_ACTIVATION` — spreading activation from top results
- `SPECKIT_COMMUNITY_DETECTION` — N2c community co-retrieval
- `SPECKIT_GRAPH_SIGNALS` — graph momentum + depth signals

## Current Reality (Feature Catalog Excerpts)

- **Graph Signal Activation** (feature category 10): 11 features covering typed-degree channel, edge density measurement, co-activation tuning, signal vocabulary expansion, graph momentum, causal depth signals
- **Cross-Document Entity Linking** (feature 15-06): Planned but not implemented. Would create entity nodes linking across documents.
- **Community Detection** (implemented): BFS + Louvain. Pre-computed. Stale data risk identified but not addressed.
- **Auto-Entity Extraction** (Sprint 6b R10): GATED. Requires feasibility spike. Rule-based vs lightweight NER vs LLM-extracted not yet decided.

## Research Questions

1. **Sparse Graph Strategies**: For organically-grown knowledge graphs with low edge density (typical of memory systems), what retrieval strategies are most effective? Connected components vs Louvain vs label propagation vs spectral clustering? What's the minimum edge density for community detection to add value?

2. **Community Refresh Strategy**: Should community assignments be refreshed on write (when new edges are added), on query (live computation), or on schedule (background job)? What's the latency impact of each? What does the literature say about incremental community detection?

3. **Graph Enrichment at Save Time**: What should be extracted and linked when a new document is saved? Entity extraction (rule-based vs NER vs LLM), relation extraction, concept linking? How do GraphRAG (Microsoft), RAPTOR, and KG-RAG approach this?

4. **Typed Graph Traversal**: The system has typed edges (CORRECTION, PREFERENCE, DEPENDS_ON, EXTENDS). How should edge types affect traversal priority and scoring? Should different query intents follow different edge types? (e.g., fix_bug → CORRECTION edges, add_feature → EXTENDS edges)

5. **Graph Signal Calibration**: Graph momentum (N2a) and causal depth (N2b) are two of 12 Stage 2 signals. How should they be weighted relative to the other 10 signals? Is 1.5x graph boost in RRF empirically justified or should it be data-driven?

6. **Hybrid Graph-Vector Retrieval**: What are proven patterns for combining graph signals with vector similarity? How do RAPTOR (tree-of-abstractions), GraphRAG (community summaries), and ColBERT-based approaches handle this integration?

## Constraints

- SQLite database (no Neo4j, no dedicated graph DB)
- Graph operations must not exceed 50ms for typical queries
- Edge density is low and organic (not a curated knowledge base)
- TypeScript implementation, single-threaded (better-sqlite3)
- Size recommendations as S (days), M (weeks), L (months)
- Feature flags available for gradual rollout

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (GraphRAG, RAPTOR, KG-RAG, hybrid graph-vector systems — cite papers and implementations)
3. **Gap Analysis** (current graph utilization vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, implementation sketch, expected impact, feature flag name)
5. **Risk Assessment** (graph sparsity risks, computation costs, stale data risks)
6. **Cross-Dimensional Dependencies** (how graph improvements connect to Fusion D1, Query D2, Feedback D4, UX D5)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: code_mode starting
mcp: cocoindex_code starting
mcp: spec_kit_memory starting
mcp: sequential_thinking starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a deep research pass on D3 for the Hybrid RAG Fusion graph layer. I’ll first load the relevant skill guidance and project context, then I’ll verify the current literature and implementation patterns before synthesizing recommendations against your latency and SQLite constraints.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/sk-deep-research/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
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
 succeeded in 0ms:
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
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Research Dimension D3: Graph-Augmented Retrieval & Knowledge Structure for Hybrid RAG Fusion. Need deep research on sparse graph strategies, community refresh, save-time graph enrichment, typed traversal, signal calibration, and hybrid graph-vector retrieval under SQLite/TypeScript/50ms constraints." --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "sk-deep-research",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !deep research(phrase), context, deep(name), refresh~, research(name)"
  },
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.88,
    "uncertainty": 0.28,
    "passes_threshold": true,
    "reason": "Matched: !save(multi), !vector, context, memory"
  },
  {
    "skill": "command-memory-save",
    "kind": "command",
codex
SKILL ROUTING: `sk-deep-research` (confidence 0.95) and `system-spec-kit` (confidence 0.88). User specified: “Mode: Deep” and the task is a multi-source research investigation, so I’m following the deep-research workflow and pulling prior project context before I branch into the literature pass.
tool codex.list_mcp_resources({})
tool codex.list_mcp_resource_templates({})
codex.list_mcp_resources({}) success in 11ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resources\":[]}"
    }
  ],
  "isError": false
}
codex.list_mcp_resource_templates({}) success in 11ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resourceTemplates\":[]}"
    }
  ],
  "isError": false
}
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/references/workflows/quick_reference.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: Quick Reference
description: Fast lookup for commands, checklists, and troubleshooting using the progressive enhancement model.
---

# Quick Reference - Commands, Checklists & Troubleshooting

Fast lookup for spec folder commands, checklists, and troubleshooting.

---

<!-- ANCHOR:overview -->
## 1. OVERVIEW

### Purpose

Quick reference for spec folder management, commands, and troubleshooting using the progressive enhancement model.

### Progressive Enhancement Model

codex
I’ve confirmed the research workflow and there’s no live memory MCP exposed in this session, so I’m falling back to local project context. Next I’m mapping the existing graph-related docs and implementation notes so the recommendations stay grounded in the current system rather than generic RAG advice.
tool cocoindex_code.search({"query":"graph retrieval causal_edges community detection co-activation graph signals typed-weighted degree Hybrid RAG Fusion","limit":8,"refresh_index":true})
cocoindex_code.search({"query":"graph retrieval causal_edges community detection co-activation graph signals typed-weighted degree Hybrid RAG Fusion","limit":8,"refresh_index":true}) success in 11.05s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/MODULE_MAP.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### `graph/`\\n\\n- Purpose: Owns graph-derived retrieval signals and community detection over memory relationships. It is the canonical place for graph algorithms that operate over causal/community structure rather than primary retrieval channels.\\n- Key files:\\n  - `community-detection.ts` — BFS/Louvain-style community discovery and community boost logic.\\n  - `graph-signals.ts` — momentum and causal-depth signal calculation.\\n  - `README.md` — graph-feature overview and runtime flags.\\n- Primary consumers:\\n  - `lib/search/*`\\n  - `lib/storage/*`\\n  - `handlers/mutation-hooks.ts`\",\n      \"start_line\": 191,\n      \"end_line\": 201,\n      \"score\": 0.6845684523882607\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/graph/README.md\",\n      \"language\": \"markdown\",\n      \"content\": \"---\\ntitle: \\\"Graph Analysis\\\"\\ndescription: \\\"Community detection and graph signal scoring for causal memory networks. Provides BFS connected-component labelling, single-level Louvain modularity and momentum/depth scoring.\\\"\\ntrigger_phrases:\\n  - \\\"community detection\\\"\\n  - \\\"graph signals\\\"\\n  - \\\"causal depth\\\"\\n  - \\\"momentum scoring\\\"\\n  - \\\"louvain\\\"\\n---\",\n      \"start_line\": 1,\n      \"end_line\": 10,\n      \"score\": 0.6595514322434539\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## System Context\\n\\nYou are researching graph-augmented retrieval for a production Hybrid RAG Fusion system. The system maintains a causal knowledge graph alongside vector/lexical indexes, built in TypeScript with SQLite.\\n\\n**Graph Infrastructure:**\\n- `causal_edges` table: stores typed edges between memory documents (relations: CORRECTION, PREFERENCE, DEPENDS_ON, EXTENDS, etc.)\\n- Graph search channel: traverses causal edges to find related documents\\n- Graph weight boost: 1.5x flat in RRF fusion for graph-sourced results\\n- Community detection: BFS components + Louvain fallback (pre-computed, not live in Stage 2)\\n- Co-activation spreading: from top-5 search seeds, spread activation to graph neighbors\\n- Graph signals in Stage 2: momentum (N2a) + causal depth (N2b)\\n- Typed-weighted degree (R4): 5th RRF channel added in Sprint 1\\n\\n**Current State:**\",\n      \"start_line\": 17,\n      \"end_line\": 30,\n      \"score\": 0.6428113748345083\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/graph/README.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 1. OVERVIEW\\n<!-- ANCHOR:overview -->\\n\\nThe graph module operates on the `causal_edges` table to detect communities of related memories and compute graph-derived scoring signals. Both files are gated behind feature flags (`SPECKIT_COMMUNITY_DETECTION` and `SPECKIT_GRAPH_SIGNALS`).\\n\\n### What It Does\\n\\n- **Community detection** groups memory nodes into clusters using BFS connected-component labelling as a fast first pass, then escalates to single-level Louvain modularity when the largest component holds more than 50% of all nodes.\\n- **Graph signals** compute two additive score bonuses for search results: momentum (degree change over 7 days) and causal depth (normalized longest-path depth on the SCC-condensed causal DAG).\",\n      \"start_line\": 30,\n      \"end_line\": 38,\n      \"score\": 0.6355614307010722\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D3-graph.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Research Dimension D3: Graph-Augmented Retrieval & Knowledge Structure\\n\\n> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50\\n\\n## System Context\\n\\nYou are researching graph-augmented retrieval for a production Hybrid RAG Fusion system. The system maintains a causal knowledge graph alongside vector/lexical indexes, built in TypeScript with SQLite.\\n\\n**Graph Infrastructure:**\\n- `causal_edges` table: stores typed edges between memory documents (relations: CORRECTION, PREFERENCE, DEPENDS_ON, EXTENDS, etc.)\\n- Graph search channel: traverses causal edges to find related documents\\n- Graph weight boost: 1.5x flat in RRF fusion for graph-sourced results\\n- Community detection: BFS components + Louvain fallback (pre-computed, not live in Stage 2)\\n- Co-activation spreading: from top-5 search seeds, spread activation to graph neighbors\\n- Graph signals in Stage 2: momentum (N2a) + causal depth (N2b)\\n- Typed-weighted degree (R4): 5th RRF channel added in Sprint 1\\n\\n**Current State:**\",\n      \"start_line\": 1,\n      \"end_line\": 18,\n      \"score\": 0.6319873092751322\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/tasks.md\",\n      \"language\": \"markdown\",\n      \"content\": \"---\\ntitle: \\\"Tasks: graph-signal-activation [template:level_2/tasks.md]\\\"\\ndescription: \\\"Graph-signal audit backlog fully closed: all 11 items remediated or verified with current evidence\\\"\\n# SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2\\ntrigger_phrases:\\n  - \\\"graph signal activation tasks\\\"\\n  - \\\"typed weighted degree\\\"\\n  - \\\"co-activation boost\\\"\\n  - \\\"edge density\\\"\\n  - \\\"graph momentum\\\"\\n  - \\\"causal depth\\\"\\n  - \\\"community detection\\\"\\n  - \\\"anchor tags\\\"\\n  - \\\"causal neighbor boost\\\"\\n  - \\\"temporal contiguity\\\"\\nimportance_tier: \\\"normal\\\"\\ncontextType: \\\"general\\\"\\n---\",\n      \"start_line\": 1,\n      \"end_line\": 18,\n      \"score\": 0.6205053620040086\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/scratch/iteration-003-gpt54.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Iteration 3 (GPT-5.4): Phase 3 Graph Modules Audit\\n\\n## Focus\\nAudit Phase 3 unified graph retrieval modules: graph-signals.ts, community-detection.ts, graph-search-fn.ts, causal-edges.ts. Focus on graph signal atomicity, cleanup completeness on memory deletion, cache invalidation, and test coverage.\\n\\n## Findings\\n\\n1. **Dead Code (P1): N2a momentum and N2c community retrieval are effectively dead in production** — `applyGraphSignals()` reads `degree_snapshots` (graph-signals.ts:135) and `applyCommunityBoost()` reads `community_assignments` (community-detection.ts:490). Stage 2 calls them (stage2-fusion.ts:659, 678). But no non-test callers of `snapshotDegrees()`, `detectCommunities()`, or `storeCommunityAssignments()` exist. Momentum stays 0 and community injection is a no-op unless an external job populates those tables.\\n   — SOURCE: graph-signals.ts:67,135; community-detection.ts:322,443,490; stage2-fusion.ts:659,678\",\n      \"start_line\": 1,\n      \"end_line\": 9,\n      \"score\": 0.6126659250563122\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/002-sprint-1-graph-signal-activation/implementation-summary.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Implementation Summary — Sprint 1: Graph Signal Activation\\n\\n<!-- SPECKIT_LEVEL: 2 -->\\n<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->\\n\\n---\\n\\n## Overview\\n\\nSprint 1 activated the causal graph's structural connectivity as a 5th RRF channel via typed-weighted degree computation (R4), measured edge density to inform graph enrichment decisions, increased co-activation boost strength from 0.1x to 0.25x with fan-effect dampening (A7/R17), and expanded the trigger matcher signal vocabulary with CORRECTION and PREFERENCE categories (TM-08).\\n\\n## Key Changes\\n\\n| File | Change | Lines |\\n|------|--------|-------|\\n| `mcp_server/lib/search/graph-search-fn.ts` | R4: Added typed-weighted degree computation with edge type weights, logarithmic normalization\",\n      \"start_line\": 11,\n      \"end_line\": 26,\n      \"score\": 0.6111873150665588\n    }\n  ],\n  \"total_returned\": 8,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/MODULE_MAP.md",
        "language": "markdown",
        "content": "### `graph/`\n\n- Purpose: Owns graph-derived retrieval signals and community detection over memory relationships. It is the canonical place for graph algorithms that operate over causal/community structure rather than primary retrieval channels.\n- Key files:\n  - `community-detection.ts` — BFS/Louvain-style community discovery and community boost logic.\n  - `graph-signals.ts` — momentum and causal-depth signal calculation.\n  - `README.md` — graph-feature overview and runtime flags.\n- Primary consumers:\n  - `lib/search/*`\n  - `lib/storage/*`\n  - `handlers/mutation-hooks.ts`",
        "start_line": 191,
        "end_line": 201,
        "score": 0.6845684523882607
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/graph/README.md",
exec
/bin/zsh -lc 'rg --files specs .opencode | rg "(feature_catalog|research|fusion|graph|causal|memory|retrieval|community|signal)"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
specs/03--commands-and-skills/014-cmd-memory-output/spec.md
specs/03--commands-and-skills/014-cmd-memory-output/plan.md
specs/03--commands-and-skills/014-cmd-memory-output/checklist.md
specs/03--commands-and-skills/014-cmd-memory-output/description.json
specs/03--commands-and-skills/014-cmd-memory-output/implementation-summary.md
specs/03--commands-and-skills/014-cmd-memory-output/memory/20-02-26_13-42__memory-command-output.md
specs/03--commands-and-skills/014-cmd-memory-output/memory/20-02-26_14-44__memory-command-output.md
specs/03--commands-and-skills/014-cmd-memory-output/memory/metadata.json
.opencode/command/create/assets/create_feature_catalog_confirm.yaml
.opencode/command/create/assets/create_feature_catalog_auto.yaml
specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/decision-record.md
specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/spec.md
specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/plan.md
specs/03--commands-and-skills/028-sk-deep-research-testing-playbook/checklist.md
specs/03--commands-and-skills/015-cmd-create-changelog/memory/01-03-26_14-30__create-changelog-command.md
specs/03--commands-and-skills/015-cmd-create-changelog/memory/metadata.json
.opencode/agent/deep-research.md
.opencode/agent/chatgpt/deep-research.md
specs/03--commands-and-skills/020-cmd-create-readme-install-merger/memory/metadata.json
.opencode/command/spec_kit/deep-research.md
exec
/bin/zsh -lc 'rg -n "causal_edges|community detection|co-activation|typed-weighted degree|graph momentum|causal depth|SPECKIT_CAUSAL_BOOST|SPECKIT_CO_ACTIVATION|SPECKIT_COMMUNITY_DETECTION|SPECKIT_GRAPH_SIGNALS|R4|TM-08|CORRECTION|PREFERENCE" .' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 31ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/005-sprint-4-feedback-and-quality/spec.md:174:| Risk | R1 N=0 div-by-zero (MR4) | High | Guard: N=0 --> return 0 |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/005-sprint-4-feedback-and-quality/spec.md:175:| Risk | R1+N4 double-boost — MPAB bonus on already co-activation-boosted scores | Medium | Verify MPAB operates after fusion, not on pre-boosted scores |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/005-sprint-4-feedback-and-quality/spec.md:176:| Risk | N4+R11 transient artifact learning — R11 learns from temporary co-activation patterns | Medium | R11 eligibility requires memory age >= 72h |
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:120:FILE:.opencode/skill/system-spec-kit/feature_catalog/10--graph-signal-activation/02-co-activation-boost-strength-increase.md
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:137:/bin/zsh -lc 'rg -n "typed-weighted degree|co-activation|edge density|weight history|graph momentum|momentum score|weighted degree|history audit|activation boost|density" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:159:.opencode/skill/system-spec-kit/mcp_server/context-server.ts:78:import * as coActivation from './lib/cache/cognitive/co-activation';
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:160:.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:26:import * as coActivation from '../lib/cache/cognitive/co-activation';
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:161:.opencode/skill/system-spec-kit/mcp_server/README.md:647:│   ├── cognitive/          # FSRS, PE gating, state model, co-activation, rollout policy
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:163:.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:170:.opencode/skill/system-spec-kit/mcp_server/handlers/mutation-hooks.ts:9:import { clearRelatedCache } from '../lib/cache/cognitive/co-activation';
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:171:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:165:  description: '[L2:Core] Fast trigger phrase matching with cognitive memory features. Supports attention-based decay, tiered content injection (HOT=full, WARM=summary), and co-activation of related memories. Pass session_id and turnNumber for cognitive features. Token Budget: 1500.',
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:172:.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:166:  inputSchema: { type: 'object', additionalProperties: false, properties: { prompt: { type: 'string', description: 'User prompt or text to match against trigger phrases' }, limit: { type: 'number', default: 3, description: 'Maximum number of matching memories to return (default: 3)' }, session_id: { type: 'string', description: 'Session identifier for cognitive features. When provided, enables attention decay and tiered content injection.' }, turnNumber: { type: 'number', description: 'Current conversation turn number. Used with session_id for decay calculations.' }, include_cognitive: { type: 'boolean', default: true, description: 'Enable cognitive features (decay, tiers, co-activation). Requires session_id.' } }, required: ['prompt'] },
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:180:I’ve already spotted one likely drift point: the codebase contains both `lib/cognitive/co-activation.ts` and `lib/cache/cognitive/co-activation.ts`, and the live search pipeline currently imports the cache-scoped path. I’m checking each feature’s listed paths for existence and then tracing which files the runtime actually uses so I can separate “exists” from “actually implements the feature.”
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:187:co-activation.ts
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:200:co-activation.ts
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:246:// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:287:/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/co-activation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:290:/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cache/cognitive/co-activation.ts | sed -n '1,260p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:343:    11	 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:364:    11	 * Default co-activation boost strength when SPECKIT_COACTIVATION_STRENGTH is not set.
exec
/bin/zsh -lc "sed -n '1,220p' specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/002-sprint-1-graph-signal-activation/implementation-summary.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Implementation Summary: Sprint 1 — Graph Signal Activation"
description: "Sprint 1 implementation summary covering typed degree activation, edge density measurement, co-activation tuning, and signal vocabulary expansion."
# SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2
trigger_phrases:
  - "sprint 1 implementation"
  - "graph signal activation implementation summary"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Summary — Sprint 1: Graph Signal Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

## Overview

Sprint 1 activated the causal graph's structural connectivity as a 5th RRF channel via typed-weighted degree computation (R4), measured edge density to inform graph enrichment decisions, increased co-activation boost strength from 0.1x to 0.25x with fan-effect dampening (A7/R17), and expanded the trigger matcher signal vocabulary with CORRECTION and PREFERENCE categories (TM-08).
exec
/bin/zsh -lc "sed -n '1,220p' specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/graph/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
---
title: "Graph Analysis"
description: "Community detection and graph signal scoring for causal memory networks. Provides BFS connected-component labelling, single-level Louvain modularity and momentum/depth scoring."
trigger_phrases:
  - "community detection"
  - "graph signals"
  - "causal depth"
  - "momentum scoring"
  - "louvain"
---

# Graph Analysis

> Community detection and graph signal scoring for causal memory networks. Provides BFS connected-component labelling, single-level Louvain modularity and momentum/depth scoring.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-search-fn.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Search Fn
// ───────────────────────────────────────────────────────────────
// Feature catalog: Unified graph retrieval, deterministic ranking, explainability, and rollback
// Causal graph search channel — uses FTS5 for node matching

import { sanitizeFTS5Query } from './bm25-index';
import { queryHierarchyMemories } from './spec-folder-hierarchy';

import type Database from 'better-sqlite3';
import type { GraphSearchFn } from './search-types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
interface CausalEdgeRow {
  id: string;
  source_id: string;
  target_id: string;
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/community-detection.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Community Detection
// ───────────────────────────────────────────────────────────────
// Deferred feature — gated via SPECKIT_COMMUNITY_DETECTION
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from "better-sqlite3";

// Feature catalog: Community detection


// ───────────────────────────────────────────────────────────────
// 2. TYPES

// ───────────────────────────────────────────────────────────────
/** Adjacency list: node ID (string) -> set of neighbor node IDs */
type AdjacencyList = Map<string, Set<string>>;

exec
/bin/zsh -lc "sed -n '1,220p' specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/scratch/iteration-003-gpt54.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
# Iteration 3 (GPT-5.4): Phase 3 Graph Modules Audit

## Focus
Audit Phase 3 unified graph retrieval modules: graph-signals.ts, community-detection.ts, graph-search-fn.ts, causal-edges.ts. Focus on graph signal atomicity, cleanup completeness on memory deletion, cache invalidation, and test coverage.

## Findings

1. **Dead Code (P1): N2a momentum and N2c community retrieval are effectively dead in production** — `applyGraphSignals()` reads `degree_snapshots` (graph-signals.ts:135) and `applyCommunityBoost()` reads `community_assignments` (community-detection.ts:490). Stage 2 calls them (stage2-fusion.ts:659, 678). But no non-test callers of `snapshotDegrees()`, `detectCommunities()`, or `storeCommunityAssignments()` exist. Momentum stays 0 and community injection is a no-op unless an external job populates those tables.
   — SOURCE: graph-signals.ts:67,135; community-detection.ts:322,443,490; stage2-fusion.ts:659,678

2. **Bug (P1): Memory-delete path leaves typed-degree cache stale** — `deleteAncillaryMemoryRows()` removes graph rows via raw SQL (vector-index-mutations.ts:38). Then `deleteEdgesForMemory()` is called (memory-crud-delete.ts:95,113) but finds no rows to delete (already gone), so `clearDegreeCache()` never fires (causal-edges.ts:552). `runPostMutationHooks()` clears graph-signals cache but not degree cache (mutation-hooks.ts:67). Hybrid search continues using stale degree scores (hybrid-search.ts:671).
   — SOURCE: vector-index-mutations.ts:38,448; memory-crud-delete.ts:95,113; causal-edges.ts:552; mutation-hooks.ts:67; hybrid-search.ts:671

3. **Architecture (P2): Graph table cleanup not universal across delete paths** — `deleteAncillaryMemoryRows()` is the safe path. But raw `DELETE FROM memory_index` without that helper exists in: orphan chunk auto-clean (vector-index-queries.ts:1376), reconsolidation cleanup (reconsolidation.ts:519). Reconsolidation only removes `vec_memories` and `memory_artifacts` (reconsolidation.ts:532), leaving graph residue path-dependent.
   — SOURCE: vector-index-mutations.ts:38; vector-index-queries.ts:1376; reconsolidation.ts:519,532

4. **Architecture (P2): Graph signal scoring not snapshot-consistent under concurrent writes** — `applyGraphSignals()` computes momentum, depth, and graph-walk in separate passes (graph-signals.ts:571-574) without a read transaction. `snapshotDegrees()` reads `causal_edges` before opening its write transaction (graph-signals.ts:71,90). With WAL enabled (context-server.ts:882), concurrent writes can interleave, producing mixed old/new graph state.
   — SOURCE: graph-signals.ts:71,90,571-574; context-server.ts:882

5. **Test Gap (P2): graph-roadmap-finalization.vitest.ts covers only happy paths** — Tests check deterministic sort (line 23), telemetry serialization (lines 37,75,119), and mocked microbenchmark (line 190). Never touches degree_snapshots, community_assignments, delete cleanup, orphaned edges, or cache invalidation. graph-health/adaptive helpers are test-only in practice.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Signals
// ───────────────────────────────────────────────────────────────
// Feature catalog: Typed-weighted degree channel
// Deferred feature — gated via SPECKIT_GRAPH_SIGNALS
// ───────────────────────────────────────────────────────────────
// 1. IMPORTS

// ───────────────────────────────────────────────────────────────
import type Database from 'better-sqlite3';
import {
  STAGE2_GRAPH_BONUS_CAP,
  clampStage2GraphBonus,
} from '../search/pipeline/ranking-contract';

// ───────────────────────────────────────────────────────────────
// 2. SESSION CACHE

// ───────────────────────────────────────────────────────────────
/** Maximum number of entries allowed in each session-scoped cache. */
codex
The local picture is clearer now: the system already has the right primitives, but some of the graph features are effectively “offline” unless background jobs populate their tables. I’m moving into the external survey next, with a focus on primary sources and implementations that answer your six concrete design questions instead of broad GraphRAG marketing material.
Plan update
Grounding the research in both local system state and external literature before synthesizing recommendations.
  ✓ Map current graph-related implementation and known limitations in the local codebase/specs
  → Survey primary literature and official implementations for GraphRAG, RAPTOR, KG-RAG, hybrid graph-vector retrieval, and incremental community detection
  • Synthesize gap analysis and priority-ordered recommendations for D3 under SQLite/50ms constraints
🌐 Searching the web...
🌐 Searched: Microsoft GraphRAG arXiv paper community summaries official implementation
🌐 Searching the web...
🌐 Searched: "From Local to Global" GraphRAG arXiv
🌐 Searching the web...
🌐 Searched: "incremental community detection" dynamic graphs arxiv
🌐 Searching the web...
🌐 Searched: RAPTOR retrieval arxiv recursive abstractive processing tree organized retrieval
🌐 Searching the web...
🌐 Searched: "dynamic community detection" survey pdf
🌐 Searching the web...
🌐 Searched: "LabelRankT" community detection dynamic networks pdf
🌐 Searching the web...
🌐 Searched: "ColBERT" graph retrieval augmented generation paper
🌐 Searching the web...
🌐 Searched: https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/
🌐 Searching the web...
🌐 Searched: 'Abstract' in https://aclanthology.org/2025.findings-acl.321/
🌐 Searching the web...
🌐 Searched: https://github.com/microsoft/graphrag/blob/main/docs/index/methods.md
🌐 Searching the web...
🌐 Searched: site:microsoft.github.io/graphrag/query/global_search GraphRAG global search community summaries
🌐 Searching the web...
🌐 Searched: "KG-RAG" arXiv biomedical prompt-aware context
🌐 Searching the web...
🌐 Searched: "incremental louvain" community detection dynamic graph
codex
I’m in the calibration part now: pulling together the external patterns with the exact local knobs you already have, especially the flat 1.5x graph boost and the Stage 2 graph bonuses. That should let me translate the literature into concrete rollout guidance instead of abstract “best practices.”
exec
/bin/zsh -lc "sed -n '620,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
          : row;
      });
      metadata.causalBoostApplied = cbMeta.applied ? 'applied' : 'off';
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.warn(`[stage2-fusion] causal boost failed: ${message}`);
      metadata.causalBoostApplied = 'failed';
    }
  }

  // -- 2a. Co-activation spreading --
  // Gated behind SPECKIT_COACTIVATION flag. Takes the top-N results as seeds,
  // Performs spreading activation traversal, and boosts scores of results that
  // Appear in the co-activation graph. Matches V1 hybrid-search behavior.
  if (isCoActivationEnabled() && isGraphUnifiedEnabled()) {
    try {
      const topIds = results
        .slice(0, SPREAD_ACTIVATION_TOP_N)
        .map(r => r.id)
        .filter((id): id is number => typeof id === 'number');
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/graph-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/search/rrf-fusion.ts: No such file or directory
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Graph Flags
// ───────────────────────────────────────────────────────────────
// Feature catalog: Typed-weighted degree channel
// Legacy compatibility shim retained for test/runtime imports.

import { isFeatureEnabled } from '../cognitive/rollout-policy';
import {
  resolveGraphWalkRolloutState,
  type GraphWalkRolloutState,
} from './search-flags';

/**
 * Unified graph channel gate (default-on, explicit opt-out with `'false'`).
 */
export function isGraphUnifiedEnabled(): boolean {
  return isFeatureEnabled('SPECKIT_GRAPH_UNIFIED');
}

/**
exec
/bin/zsh -lc "rg -n \"1\\.5|SPECKIT_CAUSAL_BOOST|SPECKIT_CO_ACTIVATION|SPECKIT_COMMUNITY_DETECTION|SPECKIT_GRAPH_SIGNALS|STAGE2_GRAPH_BONUS_CAP|momentum|causal depth|community boost|graph.*boost|RRF\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests specs/02--system-spec-kit/022-hybrid-rag-fusion -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/spec.md:61:| 143 | Verify `SPECKIT_GRAPH_WALK_ROLLOUT` changes diagnostics and bounded bonus behavior without destabilizing ordering | [`../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md`](../../feature_catalog/01--retrieval/02-semantic-and-lexical-search-memorysearch.md) | `Validate bounded graph-walk rollout states and trace diagnostics.` | `1) Prepare a graph-connected sandbox corpus 2) Start runtime with SPECKIT_GRAPH_WALK_ROLLOUT=trace_only and run memory_search({ query:"graph rollout trace check", includeTrace:true, limit:10 }) 3) Verify trace.graphContribution.rolloutState is trace_only and appliedBonus remains 0 while raw/normalized are still visible 4) Restart with SPECKIT_GRAPH_WALK_ROLLOUT=bounded_runtime and repeat 5) Verify appliedBonus is present, bounded at <= 0.03, and capApplied flips to true when the bounded runtime bonus saturates at the Stage 2 cap 6) Restart with SPECKIT_GRAPH_WALK_ROLLOUT=off and verify the graph-walk bonus disappears while the broader graph-signal path stays governed by SPECKIT_GRAPH_SIGNALS and repeated identical runs keep the same ordering` |
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:16:  'SPECKIT_CAUSAL_BOOST',
.opencode/skill/system-spec-kit/mcp_server/tests/rollout-policy.vitest.ts:85:      'SPECKIT_CAUSAL_BOOST',
specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/plan.md:140:Phase 1.5 (Config) ───┘
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:502:  it('D5: 1.5 days ago returns "yesterday"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:503:    const oneDayAgo = new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString();
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/implementation-summary.md:96:| 9 evidence files exist in scratch/ | PASS — all non-empty, 1.5-3.2 KB each |
.opencode/skill/system-spec-kit/mcp_server/tests/importance-tiers.vitest.ts:55:        important: 1.5,
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:32:| `SPECKIT_GRAPH_SIGNALS` | `isGraphSignalsEnabled()` / `resolveGraphWalkRolloutState()` | ON → bounded_runtime | Graph |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/017-governance/scratch/execution-evidence.md:34:| `SPECKIT_COMMUNITY_DETECTION` | `isCommunityDetectionEnabled()` | ON (N2c) | Graph |
.opencode/skill/system-spec-kit/mcp_server/tests/co-activation.vitest.ts:254:  describe('C138: Post-RRF Pipeline Integration', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:221:    expect(sharedNode?.['score']).toBe(1.5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:227:      makeCausalRow({ source_id: '1', target_id: '2', strength: 1.5 }),
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:142:  it('T007.1.5: dataset includes distribution summary', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/ground-truth.vitest.ts:650:  it('T007.11.5: queries 17-21 are all hard negatives from T000d', () => {
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/memory/19-03-26_20-08__manual-testing-per-playbook-retrieval-phase.md:747:embedding_model: "nomic-ai/nomic-embed-text-v1.5"
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/019-feature-flag-reference/scratch/execution-evidence.md:49:- **Active flags (default true)**: `SPECKIT_ABLATION`(false), `SPECKIT_ARCHIVAL`(true), `SPECKIT_AUTO_ENTITIES`(true), `SPECKIT_CAUSAL_BOOST`(true), `SPECKIT_COACTIVATION`(true), `SPECKIT_CROSS_ENCODER`(true), `SPECKIT_GRAPH_UNIFIED`(true), and 40+ others
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/memory/metadata.json:70:      "timestamp": "2026-03-19T19:17:01.502Z",
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/001-retrieval/memory/metadata.json:214:    "model": "nomic-ai/nomic-embed-text-v1.5",
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:70:   1. RRF Score Normalization
codex
One local detail surfaced that matters for the final call: community and graph-signal hooks are wired into Stage 2, but the data they depend on is still mostly batch-populated, so the gating question is really freshness strategy, not just scoring math. I’m also checking where the RRF-side graph weighting lives so I can comment on the 1.5x multiplier with exact local evidence.
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Search Flags
// ───────────────────────────────────────────────────────────────
// Default-on runtime gates for search pipeline controls
//
// Production-ready flags graduated to default-ON.
// Set SPECKIT_<FLAG>=false to disable any graduated feature.

/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */

import { isFeatureEnabled } from '../cognitive/rollout-policy';

// Feature catalog: Quality-aware 3-tier search fallback
// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Negative feedback confidence signal

/* ───────────────────────────────────────────────────────────────
   2. CORE FLAGS
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg "rrf|fusion"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/rsf-fusion.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
exec
/bin/zsh -lc "rg -n \"1\\.5|graph.*1\\.5|causal.*1\\.5|boost.*1\\.5|RRF.*graph|graph.*RRF|typed-weighted degree\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests specs/02--system-spec-kit/022-hybrid-rag-fusion -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:502:  it('D5: 1.5 days ago returns "yesterday"', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/search-results-format.vitest.ts:503:    const oneDayAgo = new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString();
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:395:    it('T508-08d: olderThanDays=1.5 fails validation', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/history.vitest.ts:396:      const result = memoryBulkDeleteSchema.safeParse({ ...baseInput, olderThanDays: 1.5 });
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/memory/21-03-26_11-58__manual-testing-per-playbook-memory-quality-and.md:729:embedding_model: "nomic-ai/nomic-embed-text-v1.5"
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/010-graph-signal-activation/spec.md:87:| `REQ-016` | Document the typed-weighted degree channel scenario and its bounded boost expectations. | PASS when boost values stay within `[0, cap]`, fallback returns the default when no typed edges exist, and varied edge types produce different scores. FAIL when boosts exceed the cap or fallback behavior does not appear. |
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts:250:    // Mem-2 MPAB: 0.5 + 0.3 * 1.5 / sqrt(4) = 0.5 + 0.45/2 = 0.725
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:446:    const newDLow = updateD(1.5, 4); // Grade 4 should decrease
.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:204:      validateToolArgs('memory_bulk_delete', { tier: 'deprecated', confirm: true, olderThanDays: 1.5 });
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/memory/metadata.json:214:    "model": "nomic-ai/nomic-embed-text-v1.5",
.opencode/skill/system-spec-kit/mcp_server/tests/regression-010-index-large-files.vitest.ts:127:      bulkDelete.handleMemoryBulkDelete({ tier: 'deprecated', confirm: true, olderThanDays: 1.5 })
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:221:    expect(sharedNode?.['score']).toBe(1.5);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-search-fn.vitest.ts:227:      makeCausalRow({ source_id: '1', target_id: '2', strength: 1.5 }),
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:27:// Log2(3) = 1.584963
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:294:  // I=1 (rank 2): rel=2, divisor=log2(1+2)=log2(3)=1.584963
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:295:  // Contribution = 2 / 1.584963 = 1.261860
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:303:  // I=1: 2 / log2(3) = 2 / 1.584963 = 1.261860
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:341:  // I=1 (rank 2): mem:2 rel=2, divisor=log2(3)=1.584963
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:342:  // Contribution = 2 / 1.584963 = 1.261860
.opencode/skill/system-spec-kit/mcp_server/tests/eval-the-eval.vitest.ts:344:  // Contribution = 3 / 2.000000 = 1.500000
exec
/bin/zsh -lc "sed -n '300,430p' .opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    const fused = fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }, { id: 'b', title: 'B' }] },
    ], { k: 0 });

    const first = requireResult(fused.find(r => r.id === 'a'));
    const second = requireResult(fused.find(r => r.id === 'b'));

    expect(first.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(1, 6);
    expect(second.sourceScores[SOURCE_TYPES.VECTOR]).toBeCloseTo(0.5, 6);
  });

  it('C138-CV8: fuseResultsMulti rejects negative k', () => {
    expect(() => fuseResultsMulti([
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'a', title: 'A' }] },
    ], { k: -1 })).toThrow('RRF k parameter must be non-negative');
  });

  it('C138-CV9: fuseResultsCrossVariant honors explicit k=0', () => {
    const variant = [
      { source: SOURCE_TYPES.VECTOR, results: [{ id: 'shared', title: 'Shared' }] },
exec
/bin/zsh -lc "rg -n \"SOURCE_TYPES\\.GRAPH|graphWeight|graph weight|sourceScores\\[SOURCE_TYPES\\.GRAPH\\]|1\\.5 / 61|1\\.5\\s*\\/\\s*61|graph source\" .opencode/skill/system-spec-kit/mcp_server -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"function .*rrf|rrfFusion|SOURCE_TYPES\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:354:  it('C138-CV12: invalid graphWeightBoost falls back to the default graph boost', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:356:      { source: SOURCE_TYPES.GRAPH, results: [{ id: 'g1', title: 'Graph 1' }] },
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:357:    ], { graphWeightBoost: Number.POSITIVE_INFINITY });
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:360:    expect(graphItem.sourceScores[SOURCE_TYPES.GRAPH]).toBeCloseTo(1.5 / 61, 6);
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:802:      const { graphWeight: adaptiveGraphWeight } = adaptiveResult.weights;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:11:  it('keeps removed getSubgraphWeights helper absent from public exports', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:12:    expect('getSubgraphWeights' in graphSearchFn).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/graph-regression-flag-off.vitest.ts:132:    it('T022-2b: hybridSearch with useGraph=true and null graphFn returns result without graph source', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:624:  it('C138-T3: graph source type is defined in rrf-fusion', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:625:    expect(rrfFusion.SOURCE_TYPES.GRAPH).toBe('graph');
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:634:      { source: rrfFusion.SOURCE_TYPES.GRAPH as RrfSource, results: graphResults },
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:686:  it('C138-P0-T3: graph results appear in fused output with graph source tag', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:700:  it('C138-P0-T5: adaptive graph weight from fusion profile applied', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:702:    // Not the hardcoded 0.5. For 'understand' intent, graphWeight = 0.15
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:204:  it('T3: pipeline hits vector, fts5, and graph sources', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:301:    expect(understand.graphWeight).toBe(0.15);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:302:    expect(fixBug.graphWeight).toBe(0.10);
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:313:  it('all 7 intent profiles include graphWeight and graphCausalBias', async () => {
.opencode/skill/system-spec-kit/mcp_server/tests/integration-138-pipeline.vitest.ts:320:      expect(typeof profile.graphWeight).toBe('number');
.opencode/skill/system-spec-kit/mcp_server/tests/adaptive-fusion.vitest.ts:319:  // ---- T019: graphWeight and graphCausalBias field validation ----
 succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:7:import { fuseResultsMulti, SOURCE_TYPES } from '@spec-kit/shared/algorithms/rrf-fusion';
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:77:  describe('SOURCE_TYPES.DEGREE', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:79:      expect(SOURCE_TYPES.DEGREE).toBe('degree');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:83:      expect(SOURCE_TYPES.VECTOR).toBe('vector');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:84:      expect(SOURCE_TYPES.FTS).toBe('fts');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:85:      expect(SOURCE_TYPES.BM25).toBe('bm25');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:86:      expect(SOURCE_TYPES.GRAPH).toBe('graph');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:87:      expect(SOURCE_TYPES.KEYWORD).toBe('keyword');
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:94:        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }, { id: 2 }, { id: 3 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:95:        { source: SOURCE_TYPES.FTS, results: [{ id: 2 }, { id: 1 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:96:        { source: SOURCE_TYPES.BM25, results: [{ id: 3 }, { id: 2 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:97:        { source: SOURCE_TYPES.GRAPH, results: [{ id: 1 }, { id: 4 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:98:        { source: SOURCE_TYPES.DEGREE, results: [{ id: 4 }, { id: 1 }, { id: 2 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:119:        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:120:        { source: SOURCE_TYPES.DEGREE, results: [{ id: 1 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:124:        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:145:        { source: SOURCE_TYPES.DEGREE, results: [{ id: 10 }] },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:157:        { source: SOURCE_TYPES.VECTOR, results: [{ id: 1 }, { id: 2 }, { id: 3 }], weight: 1.0 },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:158:        { source: SOURCE_TYPES.FTS, results: [{ id: 2 }, { id: 4 }], weight: 0.8 },
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-degree-channel.vitest.ts:159:        { source: SOURCE_TYPES.BM25, results: [{ id: 3 }, { id: 5 }], weight: 0.6 },
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts | sed -n '760,860p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:

exec
/bin/zsh -lc "rg --files . | rg \"rrf-fusion\\.(ts|js)"'$|algorithms/rrf-fusion"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: RRF Fusion
// ---------------------------------------------------------------
// Reciprocal Rank Fusion for combining search results
// P3-11: TypeScript source (previously orphaned .js only)

/* --- 1. CONSTANTS --- */

// Feature catalog: Hybrid search pipeline
// Feature catalog: RRF K-value sensitivity analysis

const SOURCE_TYPES = {
  VECTOR: 'vector',
  FTS: 'fts',
  BM25: 'bm25',
  GRAPH: 'graph',
  DEGREE: 'degree',
  KEYWORD: 'keyword',
} as const;

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/search/adaptive-fusion.ts: No such file or directory
exec
/bin/zsh -lc "rg -n \"graphWeight|graphCausalBias|find_bug|add_feature|find_spec|understand|DEFAULT_WEIGHTS\" .opencode/skill/system-spec-kit/mcp_server/lib/search .opencode/skill/system-spec-kit/mcp_server/tests -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:84:  /** Classified query intent for adaptive fusion weight selection (e.g. 'understand', 'fix_bug'). */
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:687:        // FTS weight 0.8 < vector 1.0 because FTS lacks semantic understanding
.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:802:      const { graphWeight: adaptiveGraphWeight } = adaptiveResult.weights;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:11:  it('keeps removed getSubgraphWeights helper absent from public exports', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-routing.vitest.ts:12:    expect('getSubgraphWeights' in graphSearchFn).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/hybrid-search.vitest.ts:702:    // Not the hardcoded 0.5. For 'understand' intent, graphWeight = 0.15
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:354:  it('C138-CV12: invalid graphWeightBoost falls back to the default graph boost', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:357:    ], { graphWeightBoost: Number.POSITIVE_INFINITY });
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:7:type ClassifiableIntent = Exclude<IntentType, 'find_spec' | 'find_decision'>;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:14:  add_feature: [
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:46:  understand: [
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:51:    'understand the database schema',
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:64:    expect(types).toContain('add_feature');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:68:    expect(types).toContain('understand');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:69:    expect(types).toContain('find_spec');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:112:    expect(result.intent).toBe('understand');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:119:    expect(result.intent).toBe('understand');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:177:    const weights = intentClassifier.getIntentWeights('add_feature');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:226:    const desc = intentClassifier.getIntentDescription('add_feature');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts:265:describe('T051: Intent Classification for add_feature Queries', () => {
exec
/bin/zsh -lc "rg --files . | rg \"adaptive-fusion\\.(ts|js)"'$"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ---------------------------------------------------------------
// MODULE: Adaptive Fusion
// ---------------------------------------------------------------
// Local
import { fuseResultsMulti } from './rrf-fusion';

// Type-only
import type { RrfItem, FusionResult, RankedList } from './rrf-fusion';

// Feature catalog: Hybrid search pipeline
// Feature catalog: Adaptive shadow ranking, bounded proposals, and rollback


/* --- 1. INTERFACES --- */

/** Represents fusion weights. */
export interface FusionWeights {
  /** Weight for semantic/vector search results (0-1) */
  semanticWeight: number;
  /** Weight for keyword/lexical search results (0-1) */
exec
/bin/zsh -lc "sed -n '760,840p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
            });
          }
        }
      } catch (_err: unknown) {
        // Non-critical — degree channel failure does not block pipeline
      }
    }

    // Merge keyword results after all channels complete
    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
      ...ftsChannelResults,
      ...bm25ChannelResults,
    ];

    if (lists.length > 0) {
      // Track multi-source and graph-only results
      const sourceMap = new Map<string, Set<string>>();
      for (const list of lists) {
        for (const r of list.results) {
          const key = canonicalResultId(r.id);
🌐 Searching the web...
🌐 Searched: 'Abstract'
🌐 Searching the web...
🌐 Searched: https://link.springer.com/article/10.1007/s41109-024-00687-3
🌐 Searching the web...
🌐 Searched: 'Our approach uses an LLM to build a graph index' in https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/
🌐 Searching the web...
🌐 Searched: "RAPTOR: Recursive Abstractive Processing for Tree-Organized Retrieval"
🌐 Searching the web...
🌐 Searched: https://proceedings.iclr.cc/paper_files/paper/2024/hash/8a2acd174940dbca361a6398a4f9df91-Abstract-Conference.html
🌐 Searching the web...
🌐 Searched: "KG-RAG" github knowledge graph retrieval augmented generation
🌐 Searching the web...
🌐 Searched: "Biomedical knowledge graph-enhanced prompt generation for large language models" arxiv
🌐 Searching the web...
🌐 Searched: "Graph-based Retriever Captures the Long Tail of Biomedical Knowledge" arxiv
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: https://microsoft.github.io/graphrag/query/drift_search/
🌐 Searching the web...
🌐 Searched: "A survey of dynamic community discovery methods" pdf
🌐 Searching the web...
🌐 Searched: https://link.springer.com/article/10.1007/s10994-016-5582-8
🌐 Searching the web...
🌐 Searched: "Graph-Based Retriever Captures the Long Tail of Biomedical Knowledge"
🌐 Searching the web...
🌐 Searched: arXiv 2402.12352
🌐 Searching the web...
🌐 Searched: "PathRAG: Pruning Graph-based Retrieval Augmented Generation with Relational Paths" arxiv
🌐 Searching the web...
🌐 Searched: "community detection" sparse networks label propagation louvain comparison
exec
/bin/zsh -lc "sed -n '1,220p' specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/010-graph-signal-activation/spec.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Edge Density
// ───────────────────────────────────────────────────────────────
// Measures the edge density of the causal graph:
// Density = edge_count / total_memories
//
// This denominator makes sparse non-empty graphs measurable.
// Fallback for legacy/partial datasets: if total_memories is 0,
// Use unique participating nodes as denominator.
//
// Density classifications:
// >= 1.0  → "dense"    — graph is highly connected
// 0.5–1.0 → "moderate" — sufficient for graph signals
// < 0.5   → "sparse"   — R10 escalation recommended
//
// When density < 0.5 an R10 escalation recommendation is generated
// And included in the result.

import type Database from 'better-sqlite3';

 succeeded in 0ms:
---
title: "Feature Specification: graph-signal-activation [template:level_2/spec.md]"
description: "Feature-centric code audit for Graph Signal Activation to verify correctness, standards alignment, behavioral fidelity, and test coverage across 11 cataloged features."
# SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2
trigger_phrases:
  - "graph signal activation"
  - "graph-signal-activation"
  - "typed weighted degree"
  - "co-activation boost"
  - "edge density measurement"
  - "graph momentum scoring"
  - "causal depth signal"
  - "community detection"
  - "anchor tags graph nodes"
  - "causal neighbor boost"
  - "temporal contiguity layer"
importance_tier: "normal"
contextType: "general"
---
# Feature Specification: graph-signal-activation
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: https://aclanthology.org/2025.findings-acl.163/
🌐 Searching the web...
🌐 Searched: https://microsoft.github.io/graphrag/query/local_search/
🌐 Searching the web...
🌐 Searched: 'temporal aggregation'
🌐 Searching the web...
🌐 Searched: https://link.springer.com/article/10.1007/s41109-024-00687-3
🌐 Searching the web...
🌐 Searched: 'no-smoothing' in https://link.springer.com/article/10.1007/s41109-024-00687-3
🌐 Searching the web...
🌐 Searched: https://microsoft.github.io/graphrag/query/local_search/
🌐 Searching the web...
🌐 Searched: https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/
🌐 Searching the web...
🌐 Searched: https://www.nature.com/articles/srep08828
codex
I have enough external material now, so I’m tightening the local citations for the final gap analysis: which graph features are live, which are effectively batch-only, and where the current weights/thresholds come from. Then I’ll turn it into a recommendation stack with sizes, flags, and cross-dimensional dependencies.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-signals.ts | sed -n '54,175p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts | sed -n '20,45p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    20	
    21	/**
    22	 * Default RRF smoothing constant used in the reciprocal rank term `1 / (k + rank)`.
    23	 *
    24	 * Origin: Cormack, Clarke, and Buettcher (SIGIR 2009), where Reciprocal Rank
    25	 * Fusion is introduced with `k = 60` as a robust default for rank aggregation.
    26	 *
    27	 * Behavior:
    28	 * - Lower `k` increases sensitivity to early ranks (top results dominate more).
    29	 * - Higher `k` flattens rank-position impact (more conservative, less top-heavy).
    30	 *
    31	 * Valid range:
    32	 * - Explicit `k` values must be finite and non-negative.
    33	 * - Runtime override `SPECKIT_RRF_K` is accepted only when parseable as a
    34	 *   finite positive number (`> 0`).
    35	 */
    36	const DEFAULT_K = 60;
    37	const CONVERGENCE_BONUS = 0.10;
    38	// AI-WHY: Graph channel gets 1.5x boost when no explicit weight is supplied because
    39	// graph edges encode curated human decisions (causal links) that are high-signal.
 succeeded in 0ms:
    54	export function clearGraphSignalsCache(): void {
    55	  momentumCache.clear();
    56	  depthCache.clear();
    57	}
    58	
    59	// 3. DEGREE SNAPSHOTS (N2a support)
    60	/**
    61	 * Record the current degree count for every memory node that participates
    62	 * in at least one causal edge. Writes into the `degree_snapshots` table
    63	 * with today's date, using INSERT OR REPLACE to allow idempotent re-runs.
    64	 *
    65	 * @returns The number of nodes snapshotted.
    66	 */
    67	export function snapshotDegrees(db: Database.Database): { snapshotted: number } {
    68	  try {
    69	    // Collect all unique memory node IDs and their degree counts from causal_edges.
    70	    // Source_id and target_id are TEXT columns, so we cast to ensure numeric comparison.
    71	    const rows = db.prepare(`
    72	      SELECT node_id, COUNT(*) AS degree_count
    73	      FROM (
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Edge Density
     3	// ───────────────────────────────────────────────────────────────
     4	// Measures the edge density of the causal graph:
     5	// Density = edge_count / total_memories
     6	//
     7	// This denominator makes sparse non-empty graphs measurable.
     8	// Fallback for legacy/partial datasets: if total_memories is 0,
     9	// Use unique participating nodes as denominator.
    10	//
    11	// Density classifications:
    12	// >= 1.0  → "dense"    — graph is highly connected
    13	// 0.5–1.0 → "moderate" — sufficient for graph signals
    14	// < 0.5   → "sparse"   — R10 escalation recommended
    15	//
    16	// When density < 0.5 an R10 escalation recommendation is generated
    17	// And included in the result.
    18	
    19	import type Database from 'better-sqlite3';
    20	
exec
/bin/zsh -lc "nl -ba specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/scratch/iteration-003-gpt54.md | sed -n '1,40p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	# Iteration 3 (GPT-5.4): Phase 3 Graph Modules Audit
     2	
     3	## Focus
     4	Audit Phase 3 unified graph retrieval modules: graph-signals.ts, community-detection.ts, graph-search-fn.ts, causal-edges.ts. Focus on graph signal atomicity, cleanup completeness on memory deletion, cache invalidation, and test coverage.
     5	
     6	## Findings
     7	
     8	1. **Dead Code (P1): N2a momentum and N2c community retrieval are effectively dead in production** — `applyGraphSignals()` reads `degree_snapshots` (graph-signals.ts:135) and `applyCommunityBoost()` reads `community_assignments` (community-detection.ts:490). Stage 2 calls them (stage2-fusion.ts:659, 678). But no non-test callers of `snapshotDegrees()`, `detectCommunities()`, or `storeCommunityAssignments()` exist. Momentum stays 0 and community injection is a no-op unless an external job populates those tables.
     9	   — SOURCE: graph-signals.ts:67,135; community-detection.ts:322,443,490; stage2-fusion.ts:659,678
    10	
    11	2. **Bug (P1): Memory-delete path leaves typed-degree cache stale** — `deleteAncillaryMemoryRows()` removes graph rows via raw SQL (vector-index-mutations.ts:38). Then `deleteEdgesForMemory()` is called (memory-crud-delete.ts:95,113) but finds no rows to delete (already gone), so `clearDegreeCache()` never fires (causal-edges.ts:552). `runPostMutationHooks()` clears graph-signals cache but not degree cache (mutation-hooks.ts:67). Hybrid search continues using stale degree scores (hybrid-search.ts:671).
    12	   — SOURCE: vector-index-mutations.ts:38,448; memory-crud-delete.ts:95,113; causal-edges.ts:552; mutation-hooks.ts:67; hybrid-search.ts:671
    13	
    14	3. **Architecture (P2): Graph table cleanup not universal across delete paths** — `deleteAncillaryMemoryRows()` is the safe path. But raw `DELETE FROM memory_index` without that helper exists in: orphan chunk auto-clean (vector-index-queries.ts:1376), reconsolidation cleanup (reconsolidation.ts:519). Reconsolidation only removes `vec_memories` and `memory_artifacts` (reconsolidation.ts:532), leaving graph residue path-dependent.
    15	   — SOURCE: vector-index-mutations.ts:38; vector-index-queries.ts:1376; reconsolidation.ts:519,532
    16	
    17	4. **Architecture (P2): Graph signal scoring not snapshot-consistent under concurrent writes** — `applyGraphSignals()` computes momentum, depth, and graph-walk in separate passes (graph-signals.ts:571-574) without a read transaction. `snapshotDegrees()` reads `causal_edges` before opening its write transaction (graph-signals.ts:71,90). With WAL enabled (context-server.ts:882), concurrent writes can interleave, producing mixed old/new graph state.
    18	   — SOURCE: graph-signals.ts:71,90,571-574; context-server.ts:882
    19	
    20	5. **Test Gap (P2): graph-roadmap-finalization.vitest.ts covers only happy paths** — Tests check deterministic sort (line 23), telemetry serialization (lines 37,75,119), and mocked microbenchmark (line 190). Never touches degree_snapshots, community_assignments, delete cleanup, orphaned edges, or cache invalidation. graph-health/adaptive helpers are test-only in practice.
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '646,714p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   646	            const boost = spreadMap.get(row.id);
   647	            if (boost !== undefined) {
   648	              const baseScore = resolveBaseScore(row);
   649	              const updated = withSyncedScoreAliases(row, baseScore + boost * CO_ACTIVATION_CONFIG.boostFactor);
   650	              return withGraphContribution(updated, 'coActivationDelta', resolveBaseScore(updated) - baseScore, 'co-activation');
   651	            }
   652	            return row;
   653	          });
   654	          // Re-sort after co-activation boost to ensure boosted results
   655	          // Are promoted to their correct position in the ranking
   656	          results = sortDeterministicRows(results as Array<PipelineRow & { id: number }>);
   657	          (metadata as Record<string, unknown>).coActivationApplied = true;
   658	        }
   659	      }
   660	    } catch (err: unknown) {
   661	      // Non-critical enrichment — co-activation failure does not affect core ranking
   662	      const message = err instanceof Error ? err.message : String(err);
   663	      console.warn(`[stage2-fusion] co-activation spreading failed: ${message}`);
   664	    }
   665	  }
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts | sed -n '48,85p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    48	}
    49	
    50	/** Represents dark run diff. */
    51	export interface DarkRunDiff {
    52	  standardCount: number;
    53	  adaptiveCount: number;
    54	  orderDifferences: number;
    55	  topResultChanged: boolean;
    56	}
    57	
    58	/* --- 2. WEIGHT PROFILES --- */
    59	
    60	const INTENT_WEIGHT_PROFILES: Record<string, FusionWeights> = {
    61	  understand:      { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.15, graphCausalBias: 0.10 },
    62	  find_spec:       { semanticWeight: 0.7, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.30, graphCausalBias: 0.10 },
    63	  fix_bug:         { semanticWeight: 0.4, keywordWeight: 0.4, recencyWeight: 0.2, graphWeight: 0.10, graphCausalBias: 0.15 },
    64	  add_feature:     { semanticWeight: 0.5, keywordWeight: 0.3, recencyWeight: 0.2, graphWeight: 0.20, graphCausalBias: 0.15 },
    65	  refactor:        { semanticWeight: 0.6, keywordWeight: 0.3, recencyWeight: 0.1, graphWeight: 0.15, graphCausalBias: 0.10 },
    66	  security_audit:  { semanticWeight: 0.3, keywordWeight: 0.5, recencyWeight: 0.2, graphWeight: 0.15, graphCausalBias: 0.10 },
    67	  find_decision:   { semanticWeight: 0.3, keywordWeight: 0.2, recencyWeight: 0.1, graphWeight: 0.50, graphCausalBias: 0.15 },
🌐 Searching the web...
🌐 Searched: https://www.nature.com/articles/srep08828
🌐 Searching the web...
🌐 Searched: arXiv 2311.17330
exec
/bin/zsh -lc "rg -n \"cross-document entity linking|Auto-Entity Extraction|R10|rule-based|NER|LLM-extracted\" specs/02--system-spec-kit/022-hybrid-rag-fusion -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"AUTO_ENTITIES|ENTITY_LINKING|entity extraction|noun phrase|entity linking\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/mcp_server/tests specs/02--system-spec-kit/022-hybrid-rag-fusion -g '"'!**/node_modules/**'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/spec.md:10:  - "entity extraction"
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/spec.md:64:| 048 | Auto entity extraction (R10) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Direct category match for entity extraction, normalization, and denylist behavior. |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/spec.md:67:| 092 | Implemented: auto entity extraction (R10) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Implemented-status validation for the same entity extraction pipeline covered by 048. |
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/spec.md:26:| D3 | Graph-Augmented Retrieval | Sparse graph, community refresh, entity extraction | Sprint 6 (DRAFT) |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/plan.md:115:| 048 | Confirm entity pipeline persistence | `Validate auto entity extraction (R10).` | manual |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/plan.md:118:| 092 | Confirm implemented auto entity extraction | `Validate implemented auto entity extraction (R10).` | manual |
specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/013-memory-quality-and-indexing/tasks.md:10:  - "entity extraction"
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:262:./.opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C09.md:163:.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:506:specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/019-feature-flag-reference/scratch/execution-evidence.md:49:- **Active flags (default true)**: `SPECKIT_ABLATION`(false), `SPECKIT_ARCHIVAL`(true), `SPECKIT_AUTO_ENTITIES`(true), `SPECKIT_CAUSAL_BOOST`(true), `SPECKIT_COACTIVATION`(true), `SPECKIT_CROSS_ENCODER`(true), `SPECKIT_GRAPH_UNIFIED`(true), and 40+ others
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:235:# Cross-document entity linking
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:241:Cross-document entity linking bridges this gap using the entity catalog populated by R10. The `buildEntityCatalog()` function groups entities from the `memory_entities` table by canonical name. The `findCrossDocumentMatches()` function identifies entities appearing in two or more distinct spec folders, which represent genuine cross-document relationships.
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:249:A density guard prevents runaway edge creation: current global edge density is computed as `total_edges / total_memories` and checked before link generation begins. The linker also checks projected post-insert global density before creating links. If either check exceeds the configured threshold, new entity links are skipped to avoid overwhelming the graph. The threshold is controlled by `SPECKIT_ENTITY_LINKING_MAX_DENSITY` (default `1.0`), and invalid or negative values fall back to `1.0`. Runs behind the `SPECKIT_ENTITY_LINKING` flag (default ON). Depends on a populated `entity_catalog` (typically produced by R10 auto-entities).
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:433:/bin/zsh -lc 'rg -n "buildEntityCatalog|findCrossDocumentMatches|createEntityLinks|runEntityLinking|entity_linker|SPECKIT_ENTITY_LINKING|MAX_DENSITY|batchGetEdgeCounts|catalogSets|supports" .opencode/skill/system-spec-kit/mcp_server' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:524:.opencode/skill/system-spec-kit/mcp_server/README.md:704:| `SPECKIT_ENTITY_LINKING_MAX_DENSITY` | `1.0`                      | S5 density guard threshold for cross-document entity linking |
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:525:.opencode/skill/system-spec-kit/mcp_server/README.md:706:S5 density guard behavior in `lib/search/entity-linker.ts`: if current global edge density (`causal_edges / memory_index`) is already above the threshold, entity linking is skipped for that run. During link creation, inserts that would push projected density above the threshold are skipped. Invalid values (non-numeric or non-finite) and negative values for `SPECKIT_ENTITY_LINKING_MAX_DENSITY` fall back to `1.0`.
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:526:.opencode/skill/system-spec-kit/mcp_server/README.md:793:| `SPECKIT_ENTITY_LINKING`       | `true`  | Links memories sharing extracted entities (S5) |
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:1337:// Gated via SPECKIT_ENTITY_LINKING
specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C18.md:1351:/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:146:### 048 — Auto entity extraction (R10)
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:152:- Tests file found: `.opencode/skill/system-spec-kit/scripts/tests/task-enrichment.vitest.ts` — covers entity extraction pipeline.
 succeeded in 0ms:
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/spec.md:64:| 048 | Auto entity extraction (R10) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Direct category match for entity extraction, normalization, and denylist behavior. |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/spec.md:67:| 092 | Implemented: auto entity extraction (R10) | [`../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md`](../../../../../skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity-extraction.md) | Implemented-status validation for the same entity extraction pipeline covered by 048. |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/plan.md:115:| 048 | Confirm entity pipeline persistence | `Validate auto entity extraction (R10).` | manual |
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/plan.md:118:| 092 | Confirm implemented auto entity extraction | `Validate implemented auto entity extraction (R10).` | manual |
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D3-graph.md:37:- **Auto-Entity Extraction** (Sprint 6b R10): GATED. Requires feasibility spike. Rule-based vs lightweight NER vs LLM-extracted not yet decided.
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D3-graph.md:45:3. **Graph Enrichment at Save Time**: What should be extracted and linked when a new document is saved? Entity extraction (rule-based vs NER vs LLM), relation extraction, concept linking? How do GraphRAG (Microsoft), RAPTOR, and KG-RAG approach this?
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:146:### 048 — Auto entity extraction (R10)
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:201:### 092 — Implemented: auto entity extraction (R10)
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:210:- Status: R10 was marked "deferred" in earlier spec versions; the presence of `quality-scorer.js` in dist and 3738 extracted trigger phrases confirms it is now implemented and active.
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:215:Rationale: R10 is confirmed implemented — quality-scorer.js exists in dist, 3738 trigger phrases extracted across 615 memories, and entity extraction tests exist. The "deferred" status is superseded by the compiled implementation.
specs/02--system-spec-kit/022-hybrid-rag-fusion/014-manual-testing-per-playbook/013-memory-quality-and-indexing/scratch/execution-evidence-partA.md:423:| 092 | PASS | quality-scorer.js in dist; 3738 trigger phrases confirm R10 implemented |
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:49:- **Auto-Entity Extraction** (Sprint 6b R10): GATED. Requires feasibility spike. Rule-based vs lightweight NER vs LLM-extracted not yet decided.
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:57:3. **Graph Enrichment at Save Time**: What should be extracted and linked when a new document is saved? Entity extraction (rule-based vs NER vs LLM), relation extraction, concept linking? How do GraphRAG (Microsoft), RAPTOR, and KG-RAG approach this?
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:774:// < 0.5   → "sparse"   — R10 escalation recommended
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:776:// When density < 0.5 an R10 escalation recommendation is generated
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:881:    14	// < 0.5   → "sparse"   — R10 escalation recommended
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D3-graph.md:883:    16	// When density < 0.5 an R10 escalation recommendation is generated
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D2-query.md:46:3. **Concept Extraction for Graph Routing**: Can the system extract entities/concepts from the query to route more effectively to the graph channel? E.g., detecting "graph signals" as a concept linked to known causal edges. Rule-based vs lightweight NER vs LLM extraction?
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D2-query.md:58:3. **Concept Extraction for Graph Routing**: Can the system extract entities/concepts from the query to route more effectively to the graph channel? E.g., detecting "graph signals" as a concept linked to known causal edges. Rule-based vs lightweight NER vs LLM extraction?
specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/agent-D2-query.md:395:      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/manual_testing_playbook/manual_testing_playbook.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| NEW-038 | [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md) | Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion | Expanded query variants + dedup count + simple-query skip confirmation | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output | Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection |\",\n      \"start_line\": 346,\n      \"end_line\": 346,\n      \"score\": 0.6283989330638757\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/manual_testing_playbook/manual_testing_playbook.md\",\n      \"language\": \"markdown\",\n      \"content\": \"| NEW-038 | [12--query-intelligence/06-query-expansion.md](../feature_catalog/12--query-intelligence/06-query-expansion.md) | Complex queries produce expanded variants; expanded results deduplicated against baseline; simple queries skip expansion | Expanded query variants + dedup count + simple-query skip confirmation | PASS: Complex query generates >=2 expansion variants; results deduplicated; simple queries bypass expansion; FAIL: No expansion or duplicate results in output | Verify expansion trigger threshold → Check dedup logic → Inspect simple-query detection |\",\n      \"start_line\": 346,\n      \"end_line\": 346,\n      \"score\": 0.6283988816792032\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/investigation-X04.md\",\n      \"language\": \"markdown\",\n      \"content\": \".opencode/skill/system-spec-kit/feature_catalog/feature_catalog.md:277:Stage 1 (Candidate Generation) executes search channels based on query type. Multi-concept queries generate one embedding per concept. Deep mode expands into up to 3 query variants via `expandQuery()`. When embedding expansion is active and R15 does not classify the query as \\\"simple\\\", a baseline and expanded-query search run in parallel with deduplication. Constitutional memory injection appends up to 5 constitutional rows when none appear in the initial candidate set. Quality score and tier filters run at the end of Stage 1.\",\n      \"start_line\": 310,\n      \"end_line\": 310,\n      \"score\": 0.6019938936349529\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D2-query.md\",\n      \"language\": \"markdown\",\n      \"content\": \"- Intent classifier routes queries to 7 classes: understand, fix_bug, add_feature, find_decision, recover_context, review_code, general\\n- Complexity router (R15) classifies queries as simple/moderate/complex and adjusts channel selection\\n- Query expansion via embedding-based term mining: generates additional search terms by finding semantically similar tokens\\n- Multi-query expansion: generates multiple query variants (feature-flagged)\\n- Query tokenization via `sanitizeQueryTokens()` for BM25 channel\\n- No query decomposition for multi-faceted questions\\n- No HyDE (Hypothetical Document Embeddings)\\n- No LLM-assisted reformulation\\n- No chain-of-thought query analysis\\n\\n**Stage 1 — Candidate Generation:**\",\n      \"start_line\": 10,\n      \"end_line\": 20,\n      \"score\": 0.596344835674671\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/001-hybrid-rag-fusion-epic/scratch/iteration-012.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Rule-Based Query Expansion (query-expander.ts, 96 LOC)\\n\\n4. **Expansion is rule-based synonym substitution with a hardcoded 27-entry vocabulary map.** No LLM calls. For each query word matching a key in `DOMAIN_VOCABULARY_MAP`, one synonym is substituted to create a variant. Maximum 3 variants total (original + 2 expansions). The map covers 5 domains: auth (4 entries), error (4), architecture (4), code (3), memory system (12).\\n   [SOURCE: mcp_server/lib/search/query-expander.ts:12, 23-56, 73-95]\\n\\n5. **Expansion is used ONLY in deep mode (`mode === 'deep'`).** `expandQuery()` is called exclusively via `buildDeepQueryVariants()` in stage1-candidate-gen.ts, which only runs when `mode === 'deep' && isMultiQueryEnabled()`. Standard (non-deep) hybrid searches never use rule-based expansion.\\n   [SOURCE: mcp_server/lib/search/pipeline/stage1-candidate-gen.ts:272-275]\",\n      \"start_line\": 19,\n      \"end_line\": 25,\n      \"score\": 0.5809545529291977\n    }\n  ],\n  \"total_returned\": 5,\n  \"offset\": 0,\n  \"message\": null\n}"
codex
One subtlety I found: the repo now contains some R10/S5 scaffolding and validation artifacts around auto-entities/entity-linking, but your prompt still frames save-time graph enrichment as not operational. I’m treating your prompt as the production source of truth and will call out that discrepancy instead of assuming the feature is truly live.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Entity Linker
// ───────────────────────────────────────────────────────────────
// Feature catalog: Cross-document entity linking
// Gated via SPECKIT_ENTITY_LINKING
// Creates causal edges between memories sharing entities across spec folders.
import type Database from 'better-sqlite3';
import { isEntityLinkingEnabled } from './search-flags';
import { createLogger } from '../utils/logger';

// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Maximum causal edges per node to prevent graph density explosion. */
const MAX_EDGES_PER_NODE = 20;

/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
const DEFAULT_MAX_EDGE_DENSITY = 1.0;

exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg "entity-linker|entity|quality-scorer"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts
.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-denylist.ts
.opencode/skill/system-spec-kit/mcp_server/lib/parsing/entity-scope.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/parsing/entity-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/parsing/entity-extractor.ts: No such file or directory
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Entity Extractor
// ───────────────────────────────────────────────────────────────
// Feature catalog: Auto entity extraction
// Feature-flagged via SPECKIT_AUTO_ENTITIES
// Pure-TS rule-based extraction, zero npm dependencies.
import { isEntityDenied } from './entity-denylist';
import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker';

import type Database from 'better-sqlite3';

// Re-export canonical versions from entity-linker for backward compatibility
export { normalizeEntityName, computeEdgeDensity };

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/** A single entity extracted from memory content. */
export interface ExtractedEntity {
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Entity Extractor
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Auto entity extraction
     5	// Feature-flagged via SPECKIT_AUTO_ENTITIES
     6	// Pure-TS rule-based extraction, zero npm dependencies.
     7	import { isEntityDenied } from './entity-denylist';
     8	import { normalizeEntityName, computeEdgeDensity } from '../search/entity-linker';
     9	
    10	import type Database from 'better-sqlite3';
    11	
    12	// Re-export canonical versions from entity-linker for backward compatibility
    13	export { normalizeEntityName, computeEdgeDensity };
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	// 1. TYPES
    17	
    18	// ───────────────────────────────────────────────────────────────
    19	/** A single entity extracted from memory content. */
    20	export interface ExtractedEntity {
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Entity Linker
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Cross-document entity linking
     5	// Gated via SPECKIT_ENTITY_LINKING
     6	// Creates causal edges between memories sharing entities across spec folders.
     7	import type Database from 'better-sqlite3';
     8	import { isEntityLinkingEnabled } from './search-flags';
     9	import { createLogger } from '../utils/logger';
    10	
    11	// ───────────────────────────────────────────────────────────────
    12	// 1. CONSTANTS
    13	
    14	// ───────────────────────────────────────────────────────────────
    15	/** Maximum causal edges per node to prevent graph density explosion. */
    16	const MAX_EDGES_PER_NODE = 20;
    17	
    18	/** S5 density guard default: skip entity linking when projected density exceeds this threshold. */
    19	const DEFAULT_MAX_EDGE_DENSITY = 1.0;
    20	
Plan update
External survey and local calibration evidence are assembled; moving to synthesis.
  ✓ Map current graph-related implementation and known limitations in the local codebase/specs
  ✓ Survey primary literature and official implementations for GraphRAG, RAPTOR, KG-RAG, hybrid graph-vector retrieval, and incremental community detection
  → Synthesize gap analysis and priority-ordered recommendations for D3 under SQLite/50ms constraints
codex
**1. Executive Summary**
- For a sparse, organically grown memory graph, typed 1-hop/2-hop traversal will add value sooner than full community detection.
- Refresh graph structure on write for touched components, plus scheduled full recompute; do not run full Louvain/community recomputation on query if `50ms` matters.
- Save-time enrichment should start with cheap deterministic extraction and linking; reserve LLM graph building for async backfill on high-value documents.
- The current flat `1.5x` graph RRF boost is a heuristic, not something the literature justifies as a universal default.
- I’m inferring that your existing `<0.5` edges-per-memory gate is a good operational cutoff, but the literature does not define a universal “minimum density” where communities suddenly become worthwhile.

**2. State of Art Survey**
- GraphRAG’s core pattern is: build an entity/relationship graph at index time, then use community summaries for global questions and graph-plus-text retrieval for local questions. Its docs also show a cheaper `FastGraphRAG` mode using noun phrases, co-occurrence, and small chunks, which is much closer to your SQLite constraints.
- GraphRAG local search combines structured graph objects with raw text units at query time; DRIFT then blends local and global search by starting from community reports and refining with local follow-up traversal.
- RAPTOR is not a typed graph system; it builds a tree of recursive summaries and retrieves at multiple abstraction levels. The useful lesson for you is multi-resolution retrieval, not graph traversal.
- KG-driven systems like SimGRAG emphasize query-to-graph-pattern alignment: transform the query into a graph pattern, then retrieve matching subgraphs. That is a strong argument for intent-aware edge-type priors in your system.
- Dynamic community work favors local incremental updates over repeated full recomputation. `Tiles` is a classic example: it updates memberships when interactions arrive. Recent sparse temporal-network work also shows that data sparsity changes which temporal/community strategies work well, and modularity-based methods retain known resolution-limit issues.
- Sparse-network literature supports the broader point that classic community methods degrade in sparse/tree-like graphs; specialized spectral approaches can help, but they are not a good fit for a single-threaded SQLite query path.

**3. Gap Analysis**
- The system already has Stage 2 hooks for co-activation, community boost, and graph signals in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L667), but the audit notes momentum and community retrieval are effectively inert unless `degree_snapshots` and `community_assignments` are populated out-of-band in [iteration-003-gpt54.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/scratch/iteration-003-gpt54.md#L8).
- Graph weighting is partly hardcoded as `GRAPH_WEIGHT_BOOST = 1.5` in [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L36), while intent profiles already carry per-intent `graphWeight` values from `0.10` to `0.50` in [adaptive-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L60). That mix looks heuristic rather than calibrated.
- Your own density logic treats `<0.5` as sparse and `0.5-1.0` as the first “moderate” band in [edge-density.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts#L11), which is sensible operationally.
- There is a repo-level discrepancy: rule-based auto-entity extraction and cross-doc entity linking modules exist in [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L4) and [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L4), but your D3 brief still describes save-time automation as not relied on. I’m assuming those modules are experimental, partial, or not yet production-wired.

**4. Recommendations**
1. Sparse-first retrieval policy. Rationale: low-density graphs benefit more from seeded typed traversal than from global communities. Size: `S`. Sketch: default to 1-hop typed expansion; allow 2-hop only through high-priority relations with capped fan-out. Disable community injection when density `<0.5` or freshness is stale. Expected impact: better precision and latency stability. Flag: extend `SPECKIT_CAUSAL_BOOST` or add `SPECKIT_TYPED_TRAVERSAL`.
2. Refresh on write locally, recompute globally on schedule. Rationale: this matches incremental-community literature and your latency budget. Size: `M`. Sketch: mark dirty nodes/components when edges change; if the touched component is small, recompute immediately; run full BFS/Louvain or label-propagation snapshots in a background job. Never do full recompute on query. Expected impact: fresh graph signals without query-path spikes. Flag: `SPECKIT_GRAPH_REFRESH_MODE=off|write_local|scheduled`.
3. Save-time enrichment should be deterministic first. Rationale: `FastGraphRAG`-style extraction is much cheaper and often good enough for sparse corpora. Size: `M`. Sketch: extract modules, filenames, commands, headings, quoted phrases, code-fence tech names, and explicit relation phrases; normalize aliases; create typed edges only from explicit evidence. Add optional async LLM backfill for important docs. Expected impact: higher edge density and better typed routing. Flag: reuse `SPECKIT_AUTO_ENTITIES` and `SPECKIT_ENTITY_LINKING`, add `SPECKIT_LLM_GRAPH_BACKFILL`.
4. Make traversal intent-aware by edge type. Rationale: SimGRAG-style query-to-pattern alignment is more valuable than generic graph centrality here. Size: `S`. Sketch: `fix_bug -> CORRECTION > DEPENDS_ON`, `add_feature -> EXTENDS > DEPENDS_ON`, `find_decision/understand -> PREFERENCE/CORRECTION/DEPENDS_ON`; score with `seedScore * edgePrior * hopDecay * freshness`. Expected impact: better recall without noisy community expansion. Flag: `SPECKIT_TYPED_TRAVERSAL`.
5. Calibrate graph signals from eval data, not constants. Rationale: flat `1.5x` RRF boost and current additive graph bonuses are heuristics. Size: `M`. Sketch: ablate by intent on `MRR@k/NDCG@k`; tune `graphWeightBoost`, N2a cap, N2b cap, and community injection caps. I’d start conservatively with total Stage 2 graph bonus capped around `0.05` combined, not `0.10`. Expected impact: less ranking volatility. Flag: `SPECKIT_GRAPH_CALIBRATION_PROFILE`.
6. Treat communities as a secondary layer, not the primary retrieval primitive. Rationale: Louvain has resolution-limit and staleness issues, and low-density memory graphs often do not justify it. Size: `M`. Sketch: keep connected components as a cheap health/fallback view; only run Louvain or label propagation on sufficiently large, sufficiently dense components; use communities for expansion/summarization more than first-rank scoring. Expected impact: lower complexity and fewer stale boosts. Flag: reuse `SPECKIT_COMMUNITY_DETECTION`.

**5. Risk Assessment**
- Sparse-graph risk: community labels will be unstable, hub-biased, or semantically weak when edge density is low.
- Compute risk: query-time Louvain or spectral methods are the clearest path to breaking the `50ms` budget.
- Freshness risk: stale `degree_snapshots` / `community_assignments` can silently degrade quality because the ranking code still trusts them.
- Enrichment risk: save-time extraction can flood the graph with aliases/noise unless you keep denylists, `created_by='auto'`, density guards, and rollback tooling.

**6. Cross-Dimensional Dependencies**
- `D1 Fusion`: graph should move from flat boosts to calibrated per-intent channel weights and capped rerank bonuses.
- `D2 Query`: intent/entity extraction should choose hop budget, edge-type priors, and whether community expansion is allowed.
- `D4 Feedback`: accepted/rejected results should update edge strengths, stale-edge decay, and correction/preference priors.
- `D5 UX`: explain graph hits as “via CORRECTION from X, hop 1” and show freshness/staleness so users can trust graph-derived context.

**Sources**
- GraphRAG paper: https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/
- GraphRAG indexing methods: https://github.com/microsoft/graphrag/blob/main/docs/index/methods.md
- GraphRAG local search: https://microsoft.github.io/graphrag/query/local_search/
- GraphRAG DRIFT search: https://microsoft.github.io/graphrag/query/drift_search/
- RAPTOR (ICLR 2024): https://proceedings.iclr.cc/paper_files/paper/2024/hash/8a2acd174940dbca361a6398a4f9df91-Abstract-Conference.html
- SimGRAG (ACL 2025): https://aclanthology.org/2025.findings-acl.163/
- Tiles incremental community detection: https://link.springer.com/article/10.1007/s10994-016-5582-8
- Sparse temporal community detection (2025): https://link.springer.com/article/10.1007/s41109-024-00687-3
- Sparse-network community detection: https://www.nature.com/articles/srep08828


tokens used
330,979
**1. Executive Summary**
- For a sparse, organically grown memory graph, typed 1-hop/2-hop traversal will add value sooner than full community detection.
- Refresh graph structure on write for touched components, plus scheduled full recompute; do not run full Louvain/community recomputation on query if `50ms` matters.
- Save-time enrichment should start with cheap deterministic extraction and linking; reserve LLM graph building for async backfill on high-value documents.
- The current flat `1.5x` graph RRF boost is a heuristic, not something the literature justifies as a universal default.
- I’m inferring that your existing `<0.5` edges-per-memory gate is a good operational cutoff, but the literature does not define a universal “minimum density” where communities suddenly become worthwhile.

**2. State of Art Survey**
- GraphRAG’s core pattern is: build an entity/relationship graph at index time, then use community summaries for global questions and graph-plus-text retrieval for local questions. Its docs also show a cheaper `FastGraphRAG` mode using noun phrases, co-occurrence, and small chunks, which is much closer to your SQLite constraints.
- GraphRAG local search combines structured graph objects with raw text units at query time; DRIFT then blends local and global search by starting from community reports and refining with local follow-up traversal.
- RAPTOR is not a typed graph system; it builds a tree of recursive summaries and retrieves at multiple abstraction levels. The useful lesson for you is multi-resolution retrieval, not graph traversal.
- KG-driven systems like SimGRAG emphasize query-to-graph-pattern alignment: transform the query into a graph pattern, then retrieve matching subgraphs. That is a strong argument for intent-aware edge-type priors in your system.
- Dynamic community work favors local incremental updates over repeated full recomputation. `Tiles` is a classic example: it updates memberships when interactions arrive. Recent sparse temporal-network work also shows that data sparsity changes which temporal/community strategies work well, and modularity-based methods retain known resolution-limit issues.
- Sparse-network literature supports the broader point that classic community methods degrade in sparse/tree-like graphs; specialized spectral approaches can help, but they are not a good fit for a single-threaded SQLite query path.

**3. Gap Analysis**
- The system already has Stage 2 hooks for co-activation, community boost, and graph signals in [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L667), but the audit notes momentum and community retrieval are effectively inert unless `degree_snapshots` and `community_assignments` are populated out-of-band in [iteration-003-gpt54.md](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/008-hydra-db-based-features/scratch/iteration-003-gpt54.md#L8).
- Graph weighting is partly hardcoded as `GRAPH_WEIGHT_BOOST = 1.5` in [rrf-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts#L36), while intent profiles already carry per-intent `graphWeight` values from `0.10` to `0.50` in [adaptive-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts#L60). That mix looks heuristic rather than calibrated.
- Your own density logic treats `<0.5` as sparse and `0.5-1.0` as the first “moderate” band in [edge-density.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/edge-density.ts#L11), which is sensible operationally.
- There is a repo-level discrepancy: rule-based auto-entity extraction and cross-doc entity linking modules exist in [entity-extractor.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts#L4) and [entity-linker.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/entity-linker.ts#L4), but your D3 brief still describes save-time automation as not relied on. I’m assuming those modules are experimental, partial, or not yet production-wired.

**4. Recommendations**
1. Sparse-first retrieval policy. Rationale: low-density graphs benefit more from seeded typed traversal than from global communities. Size: `S`. Sketch: default to 1-hop typed expansion; allow 2-hop only through high-priority relations with capped fan-out. Disable community injection when density `<0.5` or freshness is stale. Expected impact: better precision and latency stability. Flag: extend `SPECKIT_CAUSAL_BOOST` or add `SPECKIT_TYPED_TRAVERSAL`.
2. Refresh on write locally, recompute globally on schedule. Rationale: this matches incremental-community literature and your latency budget. Size: `M`. Sketch: mark dirty nodes/components when edges change; if the touched component is small, recompute immediately; run full BFS/Louvain or label-propagation snapshots in a background job. Never do full recompute on query. Expected impact: fresh graph signals without query-path spikes. Flag: `SPECKIT_GRAPH_REFRESH_MODE=off|write_local|scheduled`.
3. Save-time enrichment should be deterministic first. Rationale: `FastGraphRAG`-style extraction is much cheaper and often good enough for sparse corpora. Size: `M`. Sketch: extract modules, filenames, commands, headings, quoted phrases, code-fence tech names, and explicit relation phrases; normalize aliases; create typed edges only from explicit evidence. Add optional async LLM backfill for important docs. Expected impact: higher edge density and better typed routing. Flag: reuse `SPECKIT_AUTO_ENTITIES` and `SPECKIT_ENTITY_LINKING`, add `SPECKIT_LLM_GRAPH_BACKFILL`.
4. Make traversal intent-aware by edge type. Rationale: SimGRAG-style query-to-pattern alignment is more valuable than generic graph centrality here. Size: `S`. Sketch: `fix_bug -> CORRECTION > DEPENDS_ON`, `add_feature -> EXTENDS > DEPENDS_ON`, `find_decision/understand -> PREFERENCE/CORRECTION/DEPENDS_ON`; score with `seedScore * edgePrior * hopDecay * freshness`. Expected impact: better recall without noisy community expansion. Flag: `SPECKIT_TYPED_TRAVERSAL`.
5. Calibrate graph signals from eval data, not constants. Rationale: flat `1.5x` RRF boost and current additive graph bonuses are heuristics. Size: `M`. Sketch: ablate by intent on `MRR@k/NDCG@k`; tune `graphWeightBoost`, N2a cap, N2b cap, and community injection caps. I’d start conservatively with total Stage 2 graph bonus capped around `0.05` combined, not `0.10`. Expected impact: less ranking volatility. Flag: `SPECKIT_GRAPH_CALIBRATION_PROFILE`.
6. Treat communities as a secondary layer, not the primary retrieval primitive. Rationale: Louvain has resolution-limit and staleness issues, and low-density memory graphs often do not justify it. Size: `M`. Sketch: keep connected components as a cheap health/fallback view; only run Louvain or label propagation on sufficiently large, sufficiently dense components; use communities for expansion/summarization more than first-rank scoring. Expected impact: lower complexity and fewer stale boosts. Flag: reuse `SPECKIT_COMMUNITY_DETECTION`.

**5. Risk Assessment**
- Sparse-graph risk: community labels will be unstable, hub-biased, or semantically weak when edge density is low.
- Compute risk: query-time Louvain or spectral methods are the clearest path to breaking the `50ms` budget.
- Freshness risk: stale `degree_snapshots` / `community_assignments` can silently degrade quality because the ranking code still trusts them.
- Enrichment risk: save-time extraction can flood the graph with aliases/noise unless you keep denylists, `created_by='auto'`, density guards, and rollback tooling.

**6. Cross-Dimensional Dependencies**
- `D1 Fusion`: graph should move from flat boosts to calibrated per-intent channel weights and capped rerank bonuses.
- `D2 Query`: intent/entity extraction should choose hop budget, edge-type priors, and whether community expansion is allowed.
- `D4 Feedback`: accepted/rejected results should update edge strengths, stale-edge decay, and correction/preference priors.
- `D5 UX`: explain graph hits as “via CORRECTION from X, hop 1” and show freshness/staleness so users can trust graph-derived context.

**Sources**
- GraphRAG paper: https://www.microsoft.com/en-us/research/publication/from-local-to-global-a-graph-rag-approach-to-query-focused-summarization/
- GraphRAG indexing methods: https://github.com/microsoft/graphrag/blob/main/docs/index/methods.md
- GraphRAG local search: https://microsoft.github.io/graphrag/query/local_search/
- GraphRAG DRIFT search: https://microsoft.github.io/graphrag/query/drift_search/
- RAPTOR (ICLR 2024): https://proceedings.iclr.cc/paper_files/paper/2024/hash/8a2acd174940dbca361a6398a4f9df91-Abstract-Conference.html
- SimGRAG (ACL 2025): https://aclanthology.org/2025.findings-acl.163/
- Tiles incremental community detection: https://link.springer.com/article/10.1007/s10994-016-5582-8
- Sparse temporal community detection (2025): https://link.springer.com/article/10.1007/s41109-024-00687-3
- Sparse-network community detection: https://www.nature.com/articles/srep08828

