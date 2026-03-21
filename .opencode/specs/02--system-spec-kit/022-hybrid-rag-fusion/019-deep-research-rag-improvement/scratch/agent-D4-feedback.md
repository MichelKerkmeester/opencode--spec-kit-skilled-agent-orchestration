OpenAI Codex v0.115.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: workspace-write [workdir, /tmp, $TMPDIR, /Users/michelkerkmeester/.codex/memories]
reasoning effort: high
reasoning summaries: none
session id: 019d114c-6431-7cd3-8b90-28d3fa2ccdce
--------
user
# Research Dimension D4: Feedback Loops & Retrieval Quality Learning

> Mode: Deep | Framework: CRAFT | Perspectives: 5/5 | CLEAR: 43/50

## System Context

You are researching feedback loops and quality learning for a production Hybrid RAG Fusion system. The system uses FSRS (Free Spaced Repetition Scheduler) for temporal decay and has a planned but unimplemented feedback loop (Sprint 4). Built in TypeScript with SQLite.

**Current Decay Model — FSRS v4:**
- With review data: power-law `R(t) = (1 + 0.2346 * t / S)^(-0.5)` where S = stability
- Without review data: exponential `Weight * 0.5^(days / half_life_days)`
- `trackAccess()` in Stage 2 writes back access events (testing effect from FSRS)
- Documents gain "stability" through repeated retrieval (spacing effect)

**Current Quality Signals:**
- Importance tier (1-4, set at save time)
- Quality score (set at save time)
- Context type classification
- Spec folder association
- Trigger phrases (semantic keywords)

**What's NOT Implemented (Sprint 4 — DRAFT):**
- **R11 Learned Relevance Feedback**: 7 safeguards designed but unbuilt. Would allow the system to learn from explicit user signals (thumbs up/down, re-queries)
- **TM-04 Pre-Storage Quality Gate**: Signal density check, semantic dedup, minimum quality threshold before allowing memory save
- **TM-06 Reconsolidation**: Merge vs supersede vs complement logic for overlapping memories
- **MPAB Chunk Aggregation**: Multi-passage aggregation for long documents
- **Shadow Scoring**: A/B comparison of scoring strategies without affecting production results
- **Negative Feedback Demotions**: Demoting results that received negative signals (partially implemented via `feedback_negative_demotion`)

**Feature Flags:**
- `SPECKIT_SESSION_BOOST` — working-memory attention signals
- `SPECKIT_FEEDBACK_SIGNALS` — learned trigger signals + negative demotions (partially implemented)
- `SPECKIT_ABLATION` — controlled channel disabling for evaluation

## Current Reality (Feature Catalog Excerpts)

- **Learned Relevance Feedback** (feature 14-06): Designed with 7 safeguards (min samples, confidence threshold, FTS5 contamination prevention, max boost cap, decay, revert mechanism, audit log). NOT implemented.
- **Pre-Storage Quality Gate** (feature 13-05): Planned. Would check signal density and semantic similarity before allowing save. NOT implemented.
- **Reconsolidation on Save** (feature 13-06): Planned. Would detect overlapping memories and offer merge/supersede/complement. NOT implemented.
- **Classification-Based Decay** (feature 11-04): FSRS is the current decay model. No classification-based alternative explored.
- **Feedback Negative Demotion** (partially implemented): Can demote results that received negative signals, but signal collection mechanism doesn't exist.

## Research Questions

1. **FSRS for Knowledge Retrieval**: Is FSRS (designed for flashcard spaced repetition) the right decay model for knowledge document retrieval? Documents don't "decay" like human memory — a spec decision from 6 months ago may be MORE important than one from yesterday. What alternatives exist? (Use-frequency decay, attention-based recency, type-aware decay, no decay for certain document classes)

2. **Implicit Feedback Signals**: The calling AI doesn't provide explicit feedback. What implicit signals can be inferred from: (a) tool call sequences (memory_search followed by memory_search = dissatisfaction?), (b) session patterns (which results were followed up vs ignored), (c) re-queries (same topic queried again = poor results?), (d) downstream actions (did the AI use the retrieved content?). How reliable are these signals?

3. **Minimal Viable Feedback Loop**: Sprint 4's R11 has 7 safeguards. Is this over-engineered for a small corpus? What is the minimal safeguard set to prevent FTS5 contamination while still learning? Can we start with 2-3 safeguards and add more as data grows?

4. **Pre-Storage Quality Gates**: What thresholds work for structured spec-kit documents? Signal density (how many fields populated), semantic dedup distance, minimum content length? How to avoid over-filtering that rejects legitimate edge-case memories (e.g., a short but critical one-line decision)?

5. **Reconsolidation Strategy**: When two memories overlap, what decision logic should determine merge vs supersede vs complement? What do production knowledge systems (Notion AI, Obsidian, Mem.ai) do for deduplication and consolidation?

6. **Online vs Batch Learning**: At small corpus scale (hundreds to thousands of documents, dozens of queries per day), should feedback learning be online (update on each signal) or batch (aggregate and update periodically)? What's the cold-start strategy when no feedback data exists?

## Constraints

- No explicit user feedback mechanism exists — must work with implicit signals
- FSRS is deeply integrated — replacement must be gradual (feature-flagged)
- SQLite storage — no streaming/event infrastructure
- Must not degrade retrieval quality during learning cold-start
- Size recommendations as S (days), M (weeks), L (months)
- Single developer implementation capacity

## Output Format

1. **Executive Summary** (3-5 bullet points)
2. **State of Art Survey** (retrieval feedback systems, implicit signal mining, quality gates — cite papers and production systems)
3. **Gap Analysis** (current system vs state of art)
4. **Recommendations** (priority-ordered with: description, rationale, S/M/L size, implementation sketch, expected impact, cold-start strategy, feature flag name)
5. **Risk Assessment** (feedback loop instability, over-fitting, cold-start degradation)
6. **Cross-Dimensional Dependencies** (how feedback connects to Fusion D1, Query D2, Graph D3, UX D5)
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: sequential_thinking starting
mcp: cocoindex_code starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: cocoindex_code ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, cocoindex_code, sequential_thinking; failed: spec_kit_memory
codex
I’m treating this as a deep research pass on D4, grounded in the current codebase and current external literature. I’ll first route through the relevant skills and local context, then I’ll verify the latest papers and production patterns with cited sources before I synthesize recommendations.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
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
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Research Dimension D4: Feedback Loops & Retrieval Quality Learning for a Hybrid RAG Fusion system with FSRS decay, implicit feedback, quality gates, reconsolidation, and online vs batch learning" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
[
  {
    "skill": "sk-code--review",
    "kind": "skill",
    "confidence": 0.92,
    "uncertainty": 0.3,
    "passes_threshold": true,
    "reason": "Matched: !intent:review, !quality gate(phrase)"
  }
]
codex
SKILL ROUTING: `skill_advisor.py` suggested `sk-code--review`, but that looks like a keyword collision on “quality gate” rather than the real task. I’m using `sk-deep-research` for the investigation loop and `system-spec-kit` references for memory/retrieval context, since this turn is analysis-only and not a file-modification workflow.
tool codex.list_mcp_resources({})
codex.list_mcp_resources({}) success in 1ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resources\":[]}"
    }
  ],
  "isError": false
}
tool codex.list_mcp_resource_templates({})
codex.list_mcp_resource_templates({}) success in 0ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\"resourceTemplates\":[]}"
    }
  ],
  "isError": false
}
Plan update
Deep research on D4 will combine local system evidence, codebase/feature-catalog context, and current external sources before synthesizing rollout recommendations.
  → Load relevant local context on FSRS, feedback signals, quality gates, and feature flags
  • Survey current literature and production patterns for retrieval feedback, implicit signals, quality gating, reconsolidation, and online vs batch learning
  • Compare state of art to current system and synthesize priority-ordered recommendations with risks and dependencies
codex
I checked for directly exposed memory MCP resources, but none are surfaced in this runtime, so I’m grounding the local side through the repo itself. Next I’m pulling the exact design notes and implementation status for FSRS, feedback flags, and the Sprint 4 drafts so the recommendations stay anchored to what already exists.
tool cocoindex_code.search({"query":"FSRS decay memory retrieval stability trackAccess feedback signals feature flags learned relevance feedback quality gate reconsolidation","limit":8,"refresh_index":true})
cocoindex_code.search({"query":"FSRS decay memory retrieval stability trackAccess feedback signals feature flags learned relevance feedback quality gate reconsolidation","limit":8,"refresh_index":true}) success in 3.49s:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"success\": true,\n  \"results\": [\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D4-feedback.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## Current Reality (Feature Catalog Excerpts)\\n\\n- **Learned Relevance Feedback** (feature 14-06): Designed with 7 safeguards (min samples, confidence threshold, FTS5 contamination prevention, max boost cap, decay, revert mechanism, audit log). NOT implemented.\\n- **Pre-Storage Quality Gate** (feature 13-05): Planned. Would check signal density and semantic similarity before allowing save. NOT implemented.\\n- **Reconsolidation on Save** (feature 13-06): Planned. Would detect overlapping memories and offer merge/supersede/complement. NOT implemented.\\n- **Classification-Based Decay** (feature 11-04): FSRS is the current decay model. No classification-based alternative explored.\\n- **Feedback Negative Demotion** (partially implemented): Can demote results that received negative signals, but signal collection mechanism doesn't exist.\\n\\n## Research Questions\",\n      \"start_line\": 35,\n      \"end_line\": 43,\n      \"score\": 0.6936724384399025\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-output-iter-006-codex-A3.md\",\n      \"language\": \"markdown\",\n      \"content\": \"     4\\t// Feature catalog: Hybrid search pipeline\\n     5\\t// SEARCH: VECTOR INDEX\\n     6\\t// TypeScript port of the vector index implementation.\\n     7\\t// DECAY STRATEGY (ADR-004): Search-time temporal decay uses an\\n     8\\t// FSRS-preferred strategy. Memories with FSRS review data (last_review\\n     9\\t// IS NOT NULL, review_count > 0) use the FSRS v4 power-law formula:\\n    10\\t// R(t) = (1 + 0.2346 * t / S)^(-0.5)\\n    11\\t// Memories without review data fall back to half-life exponential:\\n    12\\t// Weight * 0.5^(days / half_life_days)\\n    13\\t// This ensures backward compatibility while aligning reviewed\\n    14\\t// Memories with the canonical FSRS algorithm.\",\n      \"start_line\": 441,\n      \"end_line\": 451,\n      \"score\": 0.6208167596081733\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C10.md\",\n      \"language\": \"markdown\",\n      \"content\": \"# Classification-based decay\\n\\n## Current Reality\\n\\nNot all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.\\n\\nFSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability, and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.\\n\\nThe combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.\",\n      \"start_line\": 227,\n      \"end_line\": 235,\n      \"score\": 0.6134706806199617\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/mcp_server/lib/scoring/README.md\",\n      \"language\": \"markdown\",\n      \"content\": \"### Event-Based Decay Model (Spec 136)\\n\\nThe scoring module supports an event-based decay model that replaces pure time-based decay with event-driven signals. Instead of decaying scores solely based on elapsed time, the model tracks meaningful events (access, citation, validation) and adjusts decay rates based on event frequency and recency. This provides more accurate relevance scoring for memories that are actively referenced versus those that are merely recent.\\n\\n**Key properties:**\\n- Decay triggered by event gaps rather than wall-clock time\\n- Event types: `access`, `citation`, `validation`, `modification`\\n- Memories with frequent events decay slower; idle memories decay faster\\n- Backward-compatible with FSRS decay (falls back when no event data available)\",\n      \"start_line\": 113,\n      \"end_line\": 121,\n      \"score\": 0.6077396803916599\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/feature_catalog/feature_catalog.md\",\n      \"language\": \"markdown\",\n      \"content\": \"FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.\\n\\nThe combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.\\n\\n#### Source Files\\n\\nSee [`11--scoring-and-calibration/04-classification-based-decay.md`](11--scoring-and-calibration/04-classification-based-decay.md) for full implementation and test file listings.\\n\\n---\",\n      \"start_line\": 1958,\n      \"end_line\": 1966,\n      \"score\": 0.6062951308893201\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/feature_catalog/feature_catalog.md\",\n      \"language\": \"markdown\",\n      \"content\": \"FSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.\\n\\nThe combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.\\n\\n#### Source Files\\n\\nSee [`11--scoring-and-calibration/04-classification-based-decay.md`](11--scoring-and-calibration/04-classification-based-decay.md) for full implementation and test file listings.\\n\\n---\",\n      \"start_line\": 1958,\n      \"end_line\": 1966,\n      \"score\": 0.6062951308893201\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/006-feature-catalog/scratch/verification-C12.md\",\n      \"language\": \"markdown\",\n      \"content\": \"    if (currentScore === resolveBaseScore(row)) return row;\\n\\n    return {\\n      ...row,\\n      score: currentScore,\\n    };\\n  });\\n}\\n\\n/**\\n * Apply FSRS testing effect (strengthening write-back) for all accessed memories.\\n *\\n * Called only when `trackAccess` is true (P3-09 FIX: explicit opt-in to avoid\\n * unintended write side-effects during read-only searches).\\n *\\n * For each result, the current retrievability R(t) is computed from the stored\\n * stability and last_review fields, then `strengthenOnAccess` fires an FSRS\\n * GRADE_GOOD update — increasing stability proportional to how much the memory\\n *\",\n      \"start_line\": 1230,\n      \"end_line\": 1248,\n      \"score\": 0.6028106223558307\n    },\n    {\n      \"file_path\": \"specs/02--system-spec-kit/022-hybrid-rag-fusion/system-spec-kit/feature_catalog/11--scoring-and-calibration/04-classification-based-decay.md\",\n      \"language\": \"markdown\",\n      \"content\": \"## 2. CURRENT REALITY\\n\\nNot all memories should decay at the same rate. A decision record from six months ago is still relevant. A scratch note from last Tuesday probably is not.\\n\\nFSRS decay rates now vary by a two-dimensional multiplier matrix. On the context axis: decisions never decay (stability set to Infinity), research memories get 2x stability and implementation/discovery/general memories follow the standard rate. On the tier axis: constitutional and critical memories never decay, important memories get 1.5x stability, normal memories follow the standard, temporary memories decay at 0.5x and deprecated at 0.25x.\\n\\nThe combined multiplier uses `Infinity` for never-decay cases, which produces `R(t) = 1.0` for all t without special-case logic. Runs behind the `SPECKIT_CLASSIFICATION_DECAY` flag.\\n\\n---\",\n      \"start_line\": 11,\n      \"end_line\": 19,\n      \"score\": 0.5942192836834277\n    }\n  ],\n  \"total_returned\": 8,\n  \"offset\": 0,\n  \"message\": null\n}"
    }
  ],
  "structuredContent": {
    "success": true,
    "results": [
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/019-deep-research-rag-improvement/scratch/prompt-D4-feedback.md",
        "language": "markdown",
        "content": "## Current Reality (Feature Catalog Excerpts)\n\n- **Learned Relevance Feedback** (feature 14-06): Designed with 7 safeguards (min samples, confidence threshold, FTS5 contamination prevention, max boost cap, decay, revert mechanism, audit log). NOT implemented.\n- **Pre-Storage Quality Gate** (feature 13-05): Planned. Would check signal density and semantic similarity before allowing save. NOT implemented.\n- **Reconsolidation on Save** (feature 13-06): Planned. Would detect overlapping memories and offer merge/supersede/complement. NOT implemented.\n- **Classification-Based Decay** (feature 11-04): FSRS is the current decay model. No classification-based alternative explored.\n- **Feedback Negative Demotion** (partially implemented): Can demote results that received negative signals, but signal collection mechanism doesn't exist.\n\n## Research Questions",
        "start_line": 35,
        "end_line": 43,
        "score": 0.6936724384399025
      },
      {
        "file_path": "specs/02--system-spec-kit/022-hybrid-rag-fusion/009-perfect-session-capturing/scratch/agent-output-iter-006-codex-A3.md",
exec
/bin/zsh -lc 'rg -n "FSRS|trackAccess|R11|TM-04|TM-06|Shadow Scoring|feedback_negative_demotion|SPECKIT_FEEDBACK_SIGNALS|SPECKIT_SESSION_BOOST|SPECKIT_ABLATION|Learned Relevance Feedback|Reconsolidation|Pre-Storage Quality Gate|MPAB" .' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
./README.md.bak:308:Two additional subsystems: **FSRS Scheduler** (spaced repetition for review intervals) and **Prediction Error Gating** (novel discoveries amplified, expected content deprioritized).
./.opencode/command/memory/README.txt:312:| Analyze ablation fails | `SPECKIT_ABLATION=true` not set | Set environment variable and retry |
./.opencode/changelog/01--system-spec-kit/v2.1.3.0.md:16:- **FSRS formula: 18.45x decay rate error** — Corrected; memories were decaying at the wrong rate due to incorrect factor calculation
./.opencode/changelog/01--system-spec-kit/v2.4.0.0.md:47:- **Schema params exposed** -- `memorySearch` tool schema now includes `trackAccess`, `includeArchived`, and `mode` parameters (#13).
./.opencode/command/memory/analyze.md:651:Runs a controlled channel ablation study (R13-S3). Requires `SPECKIT_ABLATION=true` environment variable.
./.opencode/command/memory/analyze.md:728:| SPECKIT_ABLATION not enabled | `STATUS=FAIL ERROR="Requires SPECKIT_ABLATION=true"` |
./.opencode/command/memory/analyze.md:896:| `trackAccess` | boolean | false | Write FSRS strengthening updates on read (off by default to avoid write-on-read) |
./.opencode/changelog/01--system-spec-kit/v1.1.0.0.md:9:**Major cognitive memory upgrade** implementing **FSRS power-law decay** validated on 100M+ users, **Prediction Error Gating** to prevent duplicates, and **30 bug fixes** from comprehensive 10-agent audit. Memory commands aligned with template standards.
./.opencode/changelog/01--system-spec-kit/v1.1.0.0.md:18:  - **FSRS power-law algorithm** — `R(t,S) = (1 + (19/81) * t/S)^(-0.5)` replaces arbitrary exponential decay
./.opencode/changelog/01--system-spec-kit/v1.1.0.0.md:25:  - **fsrs-scheduler.js** — FSRS algorithm implementation
./.opencode/changelog/01--system-spec-kit/v1.1.0.0.md:27:  - **fsrs-scheduler.test.js** — 30 unit tests for FSRS
./.opencode/changelog/01--system-spec-kit/v1.1.0.0.md:33:  - **BUG-001** — FSRS function never executed; fixed signature mismatch in tier-classifier.js
./.opencode/changelog/01--system-spec-kit/v1.1.0.0.md:66:  - **Attention decay** — Integrated FSRS decay functions
./.opencode/skill/system-spec-kit/mcp_server/handlers/memory-triggers.ts:120:/** Fetch full memory records required for FSRS tier classification. */
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:9:// Feature catalog: Reconsolidation-on-save
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:69: * TM-06 safety gate: verify a pre-reconsolidation checkpoint exists.
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:72:export function hasReconsolidationCheckpoint(database: Database.Database, specFolder: string): boolean {
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/db-helpers.ts:91:    console.warn('[db-helpers] hasReconsolidationCheckpoint lookup failed:', error instanceof Error ? error.message : String(error));
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:27:  hasReconsolidationCheckpoint,
./.opencode/skill/system-spec-kit/mcp_server/handlers/save/index.ts:41:export type { ReconsolidationBridgeResult } from './reconsolidation-bridge';
codex
One useful surprise from the repo: some “planned” items are no longer just draft notes. I’m reading the current implementation and feature-catalog sources now so the gap analysis reflects today’s codebase rather than the earlier Sprint 4 snapshot.
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Save Quality Gate
// ───────────────────────────────────────────────────────────────
// Pre-Storage Quality Gate
//
// 3-layer validation before storing memories:
// - Layer 1: Structural validation (existing checks, formalized)
// - Layer 2: Content quality scoring (title, triggers, length,
// Anchors, metadata, signal density)
// - Layer 3: Semantic dedup (cosine similarity against existing)
//
// Behind SPECKIT_SAVE_QUALITY_GATE flag (default ON, graduated).
// Set SPECKIT_SAVE_QUALITY_GATE=false to disable.
//
// Warn-only mode: for the first 14 days after activation, the
// Gate logs quality scores and would-reject decisions but does
// NOT block saves. This prevents disruption during rollout.
//
// Activation timestamp is persisted to SQLite config table so
// The 14-day graduation countdown survives server restarts.
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Reconsolidation Bridge
// ───────────────────────────────────────────────────────────────
import path from 'path';
import type BetterSqlite3 from 'better-sqlite3';

import * as vectorIndex from '../../lib/search/vector-index';
import * as embeddings from '../../lib/providers/embeddings';
import * as bm25Index from '../../lib/search/bm25-index';
import * as fsrsScheduler from '../../lib/cognitive/fsrs-scheduler';
import * as incrementalIndex from '../../lib/storage/incremental-index';
import { reconsolidate } from '../../lib/storage/reconsolidation';
import type { ReconsolidationResult } from '../../lib/storage/reconsolidation';
import { classifyEncodingIntent } from '../../lib/search/encoding-intent';
import {
  isEncodingIntentEnabled,
  isReconsolidationEnabled as isReconsolidationFlagEnabled,
} from '../../lib/search/search-flags';
import type * as memoryParser from '../../lib/parsing/memory-parser';
import { toErrorMessage } from '../../utils';
exec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/README.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/feedback/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 0ms:
sed: .opencode/skill/system-spec-kit/mcp_server/lib/feedback/learned-feedback.ts: No such file or directory
 succeeded in 0ms:
---
title: "Scoring Algorithms"
description: "Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking."
trigger_phrases:
  - "scoring algorithms"
  - "importance tiers"
  - "composite scoring"
---

# Scoring Algorithms

> Multi-factor scoring system for memory retrieval with composite weighting, importance tiers, folder ranking and confidence tracking.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. KEY CONCEPTS](#2--key-concepts)
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Negative Feedback
// ───────────────────────────────────────────────────────────────
// When wasUseful=false is recorded via memory_validate, reduce the
// Memory's composite score via a confidence multiplier.
//
// Multiplier: starts at 1.0, decreases with each negative validation
// Floor: 0.3 (never suppress below 30% of original score)
// Decay: gradual recovery over time (30-day half-life)
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// Feature catalog: Negative feedback confidence signal


// ───────────────────────────────────────────────────────────────
// 1. CONSTANTS

// ───────────────────────────────────────────────────────────────
/** Base multiplier before any negative feedback is applied. */
export const CONFIDENCE_MULTIPLIER_BASE = 1.0;
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Mpab Aggregation
// ───────────────────────────────────────────────────────────────
// Feature catalog: MPAB chunk-to-memory aggregation
// Multi-Parent Aggregated Bonus (MPAB) for chunk-to-memory score aggregation.
// Pipeline position: after RRF fusion, before state filtering.
// Feature flag: SPECKIT_DOCSCORE_AGGREGATION (graduated default ON)
// Runtime pipeline gating uses isDocscoreAggregationEnabled() in search-flags.ts.

/* --- 1. TYPES --- */

/**
 * Result of MPAB aggregation for a single parent memory.
 * Contains the aggregated score and metadata about the chunks
 * that contributed to it.
 */
export interface MpabResult {
  /** Unique identifier of the parent memory document. */
  parentMemoryId: number | string;
  /** MPAB-aggregated score: sMax + 0.3 * sum(remaining) / sqrt(N). */
 succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Confidence Tracker
// ───────────────────────────────────────────────────────────────
// Feature catalog: Score normalization
import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
export type { Database };

export interface ValidationResult {
  confidence: number;
  validationCount: number;
  positiveValidationCount: number;
  promotionEligible: boolean;
  wasPromoted: boolean;
}

exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server | rg "learned-feedback|negative-feedback|confidence-tracker|event-based|classification-based-decay|composite-scoring|mpab-aggregation"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts
.opencode/skill/system-spec-kit/mcp_server/tests/mpab-aggregation.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/composite-scoring.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/composite-scoring.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/mpab-aggregation.ts
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts
.opencode/skill/system-spec-kit/mcp_server/tests/unit-composite-scoring-types.vitest.ts
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Learned Feedback
// ───────────────────────────────────────────────────────────────
// Feature catalog: Learned relevance feedback
//
//
// Learns from user memory selections to improve future search results.
// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
//
// 10 Safeguards:
// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
// 2. 30-day TTL -- learned terms expire after 30 days
// 3. 100+ stop words denylist -- prevent noise injection
// 4. Rate cap -- max 3 terms per selection, max 8 terms per memory
// 5. Top-3 exclusion -- only learn from selections NOT already in top 3
// 6. 1-week shadow period -- log but don't apply for first week
// 7. Exclude <72h memories -- too new to learn from
// 8. Sprint gate review -- manual review before enabling
// 9. Rollback mechanism -- can clear all learned triggers
// 10. Provenance/audit log -- track what was learned and why
exec
/bin/zsh -lc "sed -n '260,520p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  queryTerms: string[],
  resultRank: number,
  db: Database
): { terms: string[]; applied: boolean; reason?: string } {
  try {
    // Safeguard #8: Feature must be enabled
    if (!isLearnedFeedbackEnabled()) {
      return { terms: [], applied: false, reason: 'feature_disabled' };
    }

    // Safeguard #5: Only learn from selections NOT in top-3
    if (resultRank <= TOP_N_EXCLUSION) {
      return { terms: [], applied: false, reason: 'top_3_exclusion' };
    }

    // Safeguard #7: Check memory age
    const memory = db.prepare(
      'SELECT created_at, trigger_phrases, learned_triggers FROM memory_index WHERE id = ?'
    ).get(memoryId) as { created_at?: string; trigger_phrases?: string; learned_triggers?: string } | undefined;

exec
/bin/zsh -lc "sed -n '520,760p' .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
  try {
    ensureLearnedTriggersIndex(db);
    const rows = db.prepare(
      `SELECT id, learned_triggers FROM memory_index WHERE learned_triggers IS NOT NULL AND learned_triggers != '[]'`
    ).all() as Array<{ id: number; learned_triggers: string }>;

    const nowSeconds = Math.floor(Date.now() / 1000);
    let affectedCount = 0;

    ensureAuditTable(db);

    for (const row of rows) {
      const entries = parseLearnedTriggers(row.learned_triggers);
      const valid = entries.filter((e) => e.expiresAt > nowSeconds);
      const expired = entries.filter((e) => e.expiresAt <= nowSeconds);

      if (expired.length > 0) {
        // Log expired terms to audit (Safeguard #10)
        db.prepare(
          'INSERT INTO learned_feedback_audit (memory_id, action, terms, source, timestamp, shadow_mode) VALUES (?, ?, ?, ?, ?, ?)'
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Fsrs Scheduler
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// CANONICAL FSRS CONSTANTS & ALGORITHM
// Free Spaced Repetition Scheduler v4 algorithm implementation
//
// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
// Long-term memory (this file):
// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
// All long-term decay consumers MUST import constants from this file.
//
// Working memory (working-memory.ts — separate system, intentionally decoupled):
// Linear multiplicative: score * 0.95 per tick
// Timescale: minutes. Operates on session-scoped attention scores only.
//
// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
// Algorithm. All temporal decay for persistent memories should route
// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
 succeeded in 0ms:
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
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
// ───────────────────────────────────────────────────────────────
// MODULE: Stage2 Fusion
// ───────────────────────────────────────────────────────────────
// the rollout (R6): 4-Stage Retrieval Pipeline
//
// I/O CONTRACT:
// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
// Output: Stage2Output { scored: PipelineRow[], metadata }
// Key invariants:
//     - Every score modification in the pipeline happens exactly once here
//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
//     - scored is sorted descending by effective composite score on exit
// Side effects:
//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
//     - Learned trigger and negative-feedback reads from DB
//
// PURPOSE: Single point for ALL scoring signals. Intent weights are
// Applied ONCE here only — this is the architectural guard against
// The G2 double-weighting recurrence bug.
//
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server/lib | rg "event-based|classification|search-flags|stage2-fusion|vector-index|fsrs-scheduler"' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-aliases.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-mutations.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-store.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-types.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-queries.ts
.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts
.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts
exec
/bin/zsh -lc "sed -n '240,420p' .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
 * parameter directly. Do NOT apply both to the same memory — use one or the other:
 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
 */
const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
  constitutional: 0.1,
  critical: 0.3,
  important: 0.5,
  normal: 1.0,
  temporary: 2.0,
  scratch: 3.0,
} as const;

/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   Multiplies FSRS stability so that:
codex
The codebase now confirms three important things: `TM-04` and `TM-06` both exist in current code paths, and learned feedback is also implemented in a guarded form. I’m switching to the external survey now to test whether those choices match the broader literature and where the remaining risks really are.
🌐 Searching the web...
🌐 Searched: implicit feedback learning to rank clickthrough dwell time paper Joachims 2005 pdf
🌐 Searching the web...
🌐 Searched: site:www.notion.so/help Notion AI duplicate merge related pages knowledge management
🌐 Searching the web...
🌐 Searched: site:www.algolia.com/doc click analytics personalization docs
🌐 Searching the web...
🌐 Searched: site:www.elastic.co guide search relevance click logs learning to rank elastic
🌐 Searching the web...
🌐 Searched: interleaving online evaluation information retrieval paper pdf
🌐 Searching the web...
🌐 Searched: dwell time as implicit feedback web search paper
🌐 Searching the web...
🌐 Searched: retrieval quality gates chunking dedup indexing RAG production docs
🌐 Searching the web...
🌐 Searched: site:docs.pinecone.io ingest deduplicate embeddings metadata filters
🌐 Searching the web...
🌐 Searched: site:www.notion.com/help AI Q&A related pages duplicate merge help notion
🌐 Searching the web...
🌐 Searched: https://www.microsoft.com/en-us/research/publication/query-chains-learning-to-rank-from-implicit-feedback/
🌐 Searching the web...
🌐 Searched: '30 seconds' in https://www.microsoft.com/en-us/research/publication/modeling-dwell-time-to-predict-click-level-satsifaction/
🌐 Searching the web...
🌐 Searched: 'Your feedback isn’t used to train your Notion Agent' in https://www.notion.com/help/notion-agent
🌐 Searching the web...
🌐 Searched: https://aclanthology.org/2025.findings-emnlp.472/
🌐 Searching the web...
🌐 Searched: 'Experiments show' in https://aclanthology.org/2024.findings-acl.281
🌐 Searching the web...
🌐 Searched: 'ample training data' in https://www.elastic.co/docs/solutions/search/ranking
🌐 Searching the web...
🌐 Searched: site:www.microsoft.com/en-us/research explicit in situ user feedback dwell time threshold 87 seconds
codex
I have enough external evidence now to compare against the code directly. I’m pulling exact local line references for the implemented thresholds and flags so the recommendations can cleanly separate “already built,” “built but not collecting signals,” and “still missing.”
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts | sed -n '80,140p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    80	  triggerPhrases?: string[];
    81	  anchors?: string[];
    82	  embedding?: Float32Array | number[] | null;
    83	  findSimilar?: FindSimilarFn | null;
    84	}
    85	
    86	/** Callback for finding similar memories by embedding */
    87	type FindSimilarFn = (
    88	  embedding: Float32Array | number[],
    89	  options: { limit: number; specFolder?: string }
    90	) => Array<{ id: number; file_path: string; similarity: number }>;
    91	
    92	// ───────────────────────────────────────────────────────────────
    93	// 2. CONFIGURATION
    94	
    95	// ───────────────────────────────────────────────────────────────
    96	/** Signal density threshold: below this score, content is too low quality */
    97	const SIGNAL_DENSITY_THRESHOLD = 0.4;
    98	
    99	/** Semantic dedup similarity threshold: above this, reject as near-duplicate */
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Learned Feedback
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Learned relevance feedback
     5	//
     6	//
     7	// Learns from user memory selections to improve future search results.
     8	// Writes to a SEPARATE `learned_triggers` column (NOT FTS5 index).
     9	//
    10	// 10 Safeguards:
    11	// 1. Separate column -- `learned_triggers` TEXT column, NOT in FTS5 index
    12	// 2. 30-day TTL -- learned terms expire after 30 days
    13	// 3. 100+ stop words denylist -- prevent noise injection
    14	// 4. Rate cap -- max 3 terms per selection, max 8 terms per memory
    15	// 5. Top-3 exclusion -- only learn from selections NOT already in top 3
    16	// 6. 1-week shadow period -- log but don't apply for first week
    17	// 7. Exclude <72h memories -- too new to learn from
    18	// 8. Sprint gate review -- manual review before enabling
    19	// 9. Rollback mechanism -- can clear all learned triggers
    20	// 10. Provenance/audit log -- track what was learned and why
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts | sed -n '45,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
    45	export async function runReconsolidationIfEnabled(
    46	  database: BetterSqlite3.Database,
    47	  parsed: ReturnType<typeof memoryParser.parseMemoryFile>,
    48	  filePath: string,
    49	  force: boolean,
    50	  embedding: Float32Array | null,
    51	  scope?: { tenantId?: string | null; userId?: string | null; agentId?: string | null; sessionId?: string | null; sharedSpaceId?: string | null },
    52	): Promise<ReconsolidationBridgeResult> {
    53	  // BUG-2 fix: Track reconsolidation warnings for structured MCP response (not just console.warn)
    54	  const reconWarnings: string[] = [];
    55	
    56	  // T-04: search-flags.ts is the canonical caller-visible opt-in gate.
    57	  // Reconsolidation.ts keeps an internal guard as a defensive fallback for
    58	  // Direct callers and future entry points.
    59	  if (!force && isReconsolidationFlagEnabled() && embedding) {
    60	    try {
    61	      const hasCheckpoint = hasReconsolidationCheckpoint(database, parsed.specFolder);
    62	      if (!hasCheckpoint) {
    63	        const reconMsg = 'TM-06: reconsolidation skipped — create checkpoint "pre-reconsolidation" first';
    64	        console.warn(`[memory-save] ${reconMsg}`);
 succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Fsrs Scheduler
     3	// ───────────────────────────────────────────────────────────────
     4	// Feature catalog: Classification-based decay
     5	// CANONICAL FSRS CONSTANTS & ALGORITHM
     6	// Free Spaced Repetition Scheduler v4 algorithm implementation
     7	//
     8	// TWO-DOMAIN DECAY MODEL (Single Source of Truth)
     9	// Long-term memory (this file):
    10	// FSRS v4 power-law: R(t) = (1 + FSRS_FACTOR * t/S)^FSRS_DECAY
    11	// Timescale: days/weeks. Constants: FSRS_FACTOR=19/81, FSRS_DECAY=-0.5
    12	// All long-term decay consumers MUST import constants from this file.
    13	//
    14	// Working memory (working-memory.ts — separate system, intentionally decoupled):
    15	// Linear multiplicative: score * 0.95 per tick
    16	// Timescale: minutes. Operates on session-scoped attention scores only.
    17	//
    18	// DECAY STRATEGY (ADR-004): This is the CANONICAL long-term decay
    19	// Algorithm. All temporal decay for persistent memories should route
    20	// Through calculateRetrievability(). Formula: R(t) = (1 + 19/81 * t/S)^(-0.5)
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts | sed -n '240,380p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	 *
   241	 * This is the main entry point for the feedback loop. When a user selects
   242	 * a search result, this function:
   243	 * 1. Checks if the feature is enabled (Safeguard #8)
   244	 * 2. Checks if the result was NOT in the top-3 (Safeguard #5)
   245	 * 3. Checks if the memory is old enough (Safeguard #7)
   246	 * 4. Extracts learnable terms (Safeguards #3, #4)
   247	 * 5. Applies or logs depending on shadow period (Safeguard #6)
   248	 * 6. Writes to audit log (Safeguard #10)
   249	 *
   250	 * @param queryId - Unique identifier for the search query
   251	 * @param memoryId - ID of the selected memory
   252	 * @param queryTerms - Terms from the user's search query
   253	 * @param resultRank - The rank position of this result (1-based)
   254	 * @param db - SQLite database connection
   255	 * @returns Object with learned terms and whether they were applied
   256	 */
   257	export function recordSelection(
   258	  queryId: string,
   259	  memoryId: number,
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts | sed -n '240,340p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
   240	 * NOTE (TM-03): This multiplier operates on elapsed-time in composite-scoring.ts
   241	 * (lower value = slower perceived time = slower decay). It is a SEPARATE system from
   242	 * IMPORTANCE_TIER_STABILITY_MULTIPLIER below, which operates on the FSRS stability
   243	 * parameter directly. Do NOT apply both to the same memory — use one or the other:
   244	 *   - TIER_MULTIPLIER → used by composite-scoring.ts (elapsed-time adjustment)
   245	 *   - IMPORTANCE_TIER_STABILITY_MULTIPLIER → used by getClassificationDecayMultiplier()
   246	 *     (stability adjustment, activated via SPECKIT_CLASSIFICATION_DECAY env var)
   247	 */
   248	const TIER_MULTIPLIER: Readonly<Record<string, number>> = {
   249	  constitutional: 0.1,
   250	  critical: 0.3,
   251	  important: 0.5,
   252	  normal: 1.0,
   253	  temporary: 2.0,
   254	  scratch: 3.0,
   255	} as const;
   256	
   257	/* --- 4a. CLASSIFICATION-BASED DECAY (TM-03) ---
   258	   Gated by SPECKIT_CLASSIFICATION_DECAY env var.
   259	   Multiplies FSRS stability so that:
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts | sed -n '1,90p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts | sed -n '60,110p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Stage2 Fusion
     3	// ───────────────────────────────────────────────────────────────
     4	// the rollout (R6): 4-Stage Retrieval Pipeline
     5	//
     6	// I/O CONTRACT:
     7	// Input:  Stage2Input { candidates: PipelineRow[], config, stage1Metadata }
     8	// Output: Stage2Output { scored: PipelineRow[], metadata }
     9	// Key invariants:
    10	//     - Every score modification in the pipeline happens exactly once here
    11	//     - Intent weights are NEVER applied to hybrid results (G2 double-weighting guard)
    12	//     - scored is sorted descending by effective composite score on exit
    13	// Side effects:
    14	//     - FSRS write-back to memory_index (when trackAccess=true) — DB write
    15	//     - Learned trigger and negative-feedback reads from DB
    16	//
    17	// PURPOSE: Single point for ALL scoring signals. Intent weights are
    18	// Applied ONCE here only — this is the architectural guard against
    19	// The G2 double-weighting recurrence bug.
    20	//
 succeeded in 0ms:
    60	  return isFeatureEnabled('SPECKIT_SEARCH_FALLBACK');
    61	}
    62	
    63	/**
    64	 * PI-B3: Automatic spec folder discovery via description cache.
    65	 * Default: TRUE (graduated). Set SPECKIT_FOLDER_DISCOVERY=false to disable.
    66	 */
    67	export function isFolderDiscoveryEnabled(): boolean {
    68	  return isFeatureEnabled('SPECKIT_FOLDER_DISCOVERY');
    69	}
    70	
    71	// -- Hybrid RAG Fusion Refinement flags --
    72	
    73	/**
    74	 * R1 MPAB: Document-level chunk-to-memory score aggregation.
    75	 * Default: TRUE (graduated). Set SPECKIT_DOCSCORE_AGGREGATION=false to disable.
    76	 */
    77	export function isDocscoreAggregationEnabled(): boolean {
    78	  return isFeatureEnabled('SPECKIT_DOCSCORE_AGGREGATION');
    79	}
exec
/bin/zsh -lc "nl -ba .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 0ms:
     1	// ───────────────────────────────────────────────────────────────
     2	// MODULE: Negative Feedback
     3	// ───────────────────────────────────────────────────────────────
     4	// When wasUseful=false is recorded via memory_validate, reduce the
     5	// Memory's composite score via a confidence multiplier.
     6	//
     7	// Multiplier: starts at 1.0, decreases with each negative validation
     8	// Floor: 0.3 (never suppress below 30% of original score)
     9	// Decay: gradual recovery over time (30-day half-life)
    10	import type { DatabaseExtended as Database } from '@spec-kit/shared/types';
    11	
    12	// Feature catalog: Negative feedback confidence signal
    13	
    14	
    15	// ───────────────────────────────────────────────────────────────
    16	// 1. CONSTANTS
    17	
    18	// ───────────────────────────────────────────────────────────────
    19	/** Base multiplier before any negative feedback is applied. */
    20	export const CONFIDENCE_MULTIPLIER_BASE = 1.0;
🌐 Searching the web...
🌐 Searched: Accurately interpreting clickthrough data as implicit feedback paper pdf
🌐 Searching the web...
🌐 Searched: query reformulation as implicit feedback satisfaction search paper
🌐 Searching the web...
🌐 Searched: 'statistical efficiency'
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: Large-scale validation and analysis of interleaved search evaluation paper
🌐 Searching the web...
🌐 Searched: 2024 implicit feedback retrieval augmented generation paper user interactions
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: site:www.algolia.com/doc/guides/building-search-ui/events/react Send click and conversion events with React InstantSearch
🌐 Searching the web...
🌐 Searched: site:www.notion.com/help enterprise search related pages connected apps notion
🌐 Searching the web...
🌐 Searched: site:get.mem.ai related notes heads up official
🌐 Searching the web...
🌐 Searched: sentence embeddings near duplicate detection cosine similarity threshold paper
🌐 Searching the web...
🌐 Searched: https://research.google/pubs/accurately-interpreting-clickthrough-data-as-implicit-feedback/
🌐 Searching the web...
🌐 Searched: 'agreement of interleaving with manual relevance judgments' in https://www.microsoft.com/en-us/research/publication/large-scale-validation-and-analysis-of-interleaved-search-evaluation/
🌐 Searching the web...
🌐 Searched: https://aclanthology.org/2025.findings-emnlp.472/
🌐 Searching the web...
🌐 Searched: https://docs.nvidia.com/nemo-framework/user-guide/25.02/datacuration/semdedup.html
🌐 Searching the web...
🌐 Searched: 'Deduplication Thresholds' in https://docs.nvidia.com/nemo-framework/user-guide/25.02/datacuration/semdedup.html
🌐 Searching the web...
🌐 Searched: 'query reformulations' in https://research.google/pubs/evaluating-the-accuracy-of-implicit-feedback-from-clicks-and-query-reformulations-in-web-search/
🌐 Searching the web...
🌐 Searched: https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf
Plan update
Local implementation status is now grounded in current source files, and the external survey has enough coverage across implicit feedback, evaluation, query adaptation, production analytics, and semantic deduplication to synthesize recommendations.
  ✓ Load relevant local context on FSRS, feedback signals, quality gates, and feature flags
  ✓ Survey current literature and production patterns for retrieval feedback, implicit signals, quality gating, reconsolidation, and online vs batch learning
  → Compare state of art to current system and synthesize priority-ordered recommendations with risks and dependencies
codex
I’m in the synthesis pass now. The big theme so far is that the codebase is already closer to a minimal viable feedback system than the prompt suggests, but the missing piece is not safeguards, it’s trustworthy signal collection and evaluation discipline around those safeguards.
tool sequential_thinking.sequentialthinking({"thought":"Need synthesize local code reality with external evidence. Core conclusions likely: FSRS is acceptable as one channel but should not be universal decay; implicit feedback signals should be treated as weak, combined evidence; minimal viable loop can be much smaller than 10 safeguards because local implementation already isolates learned triggers from FTS5 and logs audit; batch updates beat online at current scale; reconsolidation should default to suggest/complement, with merge only under very high similarity plus metadata compatibility.","thoughtNumber":1,"totalThoughts":4,"nextThoughtNeeded":true})
sequential_thinking.sequentialthinking({"thought":"Need synthesize local code reality with external evidence. Core conclusions likely: FSRS is acceptable as one channel but should not be universal decay; implicit feedback signals should be treated as weak, combined evidence; minimal viable loop can be much smaller than 10 safeguards because local implementation already isolates learned triggers from FTS5 and logs audit; batch updates beat online at current scale; reconsolidation should default to suggest/complement, with merge only under very high similarity plus metadata compatibility.","thoughtNumber":1,"totalThoughts":4,"nextThoughtNeeded":true}) success in 15ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"thoughtNumber\": 1,\n  \"totalThoughts\": 4,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 1\n}"
    }
  ],
  "structuredContent": {
    "thoughtNumber": 1,
    "totalThoughts": 4,
    "nextThoughtNeeded": true,
    "branches": [],
    "thoughtHistoryLength": 1
  }
}
tool sequential_thinking.sequentialthinking({"thought":"Need address user's outdated premise explicitly with date. As of March 21, 2026, local repo shows TM-04 implemented with 0.4 signal density, 0.92 semantic dedup, 50-char minimum, 14-day warn-only; TM-06 bridge exists but opt-in and checkpoint-gated; learned feedback exists with 10 safeguards and separate learned_triggers column plus top-3 exclusion, 72h age gate, 7-day shadow, audit log. Gap is that explicit selection events may not be wired from the calling AI, so learned feedback and negative demotion are partially dormant.","thoughtNumber":2,"totalThoughts":4,"nextThoughtNeeded":true})
sequential_thinking.sequentialthinking({"thought":"Need address user's outdated premise explicitly with date. As of March 21, 2026, local repo shows TM-04 implemented with 0.4 signal density, 0.92 semantic dedup, 50-char minimum, 14-day warn-only; TM-06 bridge exists but opt-in and checkpoint-gated; learned feedback exists with 10 safeguards and separate learned_triggers column plus top-3 exclusion, 72h age gate, 7-day shadow, audit log. Gap is that explicit selection events may not be wired from the calling AI, so learned feedback and negative demotion are partially dormant.","thoughtNumber":2,"totalThoughts":4,"nextThoughtNeeded":true}) success in 3ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"thoughtNumber\": 2,\n  \"totalThoughts\": 4,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 2\n}"
    }
  ],
  "structuredContent": {
    "thoughtNumber": 2,
    "totalThoughts": 4,
    "nextThoughtNeeded": true,
    "branches": [],
    "thoughtHistoryLength": 2
  }
}
tool sequential_thinking.sequentialthinking({"thought":"Need recommendation order: 1) add implicit-feedback event ledger and shadow scoring, 2) move decay to hybrid recency policy with immutable/no-decay classes while keeping FSRS as engagement prior, 3) batch-learn learned triggers weekly from high-confidence sessions only, 4) keep TM-04 thresholds with exception lane for short critical decisions, 5) reconsolidation should be assistive not destructive: suggest/complement default, merge only for near-identical + same spec + same type. Need sizes S/M/L and feature flags.","thoughtNumber":3,"totalThoughts":4,"nextThoughtNeeded":true})
sequential_thinking.sequentialthinking({"thought":"Need recommendation order: 1) add implicit-feedback event ledger and shadow scoring, 2) move decay to hybrid recency policy with immutable/no-decay classes while keeping FSRS as engagement prior, 3) batch-learn learned triggers weekly from high-confidence sessions only, 4) keep TM-04 thresholds with exception lane for short critical decisions, 5) reconsolidation should be assistive not destructive: suggest/complement default, merge only for near-identical + same spec + same type. Need sizes S/M/L and feature flags.","thoughtNumber":3,"totalThoughts":4,"nextThoughtNeeded":true}) success in 2ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"thoughtNumber\": 3,\n  \"totalThoughts\": 4,\n  \"nextThoughtNeeded\": true,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 3\n}"
    }
  ],
  "structuredContent": {
    "thoughtNumber": 3,
    "totalThoughts": 4,
    "nextThoughtNeeded": true,
    "branches": [],
    "thoughtHistoryLength": 3
  }
}
tool sequential_thinking.sequentialthinking({"thought":"Need risk section: feedback instability from self-reinforcement, popularity bias, query drift contamination, over-dedup/knowledge loss, cold-start degradation. Mitigations: shadow mode, capped boosts/demotions, aging/TTL, offline holdout, rollback. Need cross-dimensional dependencies: D1 fusion consumes feedback as another channel; D2 query understanding uses re-query loops; D3 graph uses citation/access/reconsolidation edges; D5 UX/explainability needed for audit and user override. Ready to draft.","thoughtNumber":4,"totalThoughts":4,"nextThoughtNeeded":false})
sequential_thinking.sequentialthinking({"thought":"Need risk section: feedback instability from self-reinforcement, popularity bias, query drift contamination, over-dedup/knowledge loss, cold-start degradation. Mitigations: shadow mode, capped boosts/demotions, aging/TTL, offline holdout, rollback. Need cross-dimensional dependencies: D1 fusion consumes feedback as another channel; D2 query understanding uses re-query loops; D3 graph uses citation/access/reconsolidation edges; D5 UX/explainability needed for audit and user override. Ready to draft.","thoughtNumber":4,"totalThoughts":4,"nextThoughtNeeded":false}) success in 2ms:
{
  "content": [
    {
      "type": "text",
      "text": "{\n  \"thoughtNumber\": 4,\n  \"totalThoughts\": 4,\n  \"nextThoughtNeeded\": false,\n  \"branches\": [],\n  \"thoughtHistoryLength\": 4\n}"
    }
  ],
  "structuredContent": {
    "thoughtNumber": 4,
    "totalThoughts": 4,
    "nextThoughtNeeded": false,
    "branches": [],
    "thoughtHistoryLength": 4
  }
}
🌐 Searching the web...
🌐 Searched: freshness-based ranking information retrieval recency paper
🌐 Searching the web...
🌐 Searched the web
🌐 Searching the web...
🌐 Searched: 'See related context without asking'
codex
**Executive Summary**
- As of **March 21, 2026**, the repo is ahead of the prompt in three areas: `TM-04` is implemented with current thresholds, `TM-06` exists behind an opt-in flag plus checkpoint gate, and learned relevance feedback already exists with 10 safeguards; the main missing piece is **reliable signal collection from the calling AI**, not safeguard design. See [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L96), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L56), [learned-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L7).
- FSRS is reasonable as an **engagement prior**, but not as the only decay law for document retrieval. Durable artifacts should use **type-aware/no-decay rules**, while FSRS or event-based decay should apply only where “recent use implies future usefulness.”
- Implicit feedback is useful, but the literature is clear that **click-like signals are biased**. The safest signals are **relative preferences and query chains**, plus downstream use/citation, not raw re-search counts alone ([Joachims et al. 2007](https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf), [Elastic LTR docs](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr)).
- At your scale, use **batch learning + shadow scoring**, not per-event online updates. Log online, learn weekly, cap boosts, and keep rollback.
- Reconsolidation should be **assistive by default**: auto-merge only for near-identical artifacts; otherwise prefer supersede/complement suggestions.

**State Of Art Survey**
- **Implicit feedback mining:** Classic IR work shows clicks are informative but biased, while **relative preferences** and **query reformulation chains** are more reliable than absolute click labels ([Joachims et al. 2007](https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf)). The same paper notes dwell/session signals help more in combination than alone.
- **Learning-to-rank in production:** Modern search systems train on **judgment lists** often built from behavioral analytics, but stress data balance and quality to avoid overfitting ([Elastic LTR docs](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr)). Production tooling like Algolia explicitly treats **view/click/conversion events** as the raw material for personalization and relevance tuning ([Algolia docs](https://www.algolia.com/doc/integration/salesforce-commerce-cloud-b2c/building-the-search-ui/events/)).
- **Freshness vs relevance:** Search literature does not treat recency as universally good. Microsoft’s freshness work argues freshness and relevance are coupled for some queries and independent for others, so the tradeoff should be **adaptive**, not global ([Dai et al. 2011](https://www.microsoft.com/en-us/research/publication/learning-to-rank-for-freshness-and-relevance/)).
- **RAG-specific signal use:** Recent RAG work suggests some robustness can be learned from **end-task supervision** rather than explicit relevance labeling alone; that supports using downstream answer success/citation as a feedback signal ([Shen et al. 2024](https://aclanthology.org/2024.emnlp-main.507/)).
- **Semantic dedup / quality gates:** Data-curation systems recommend threshold tuning in context rather than one universal semantic-duplicate cutoff; stricter thresholds yield higher precision, looser thresholds remove more content but raise false-merge risk ([NVIDIA NeMo semantic dedup](https://docs.nvidia.com/nemo-framework/user-guide/25.02/datacuration/semdedup.html)).
- **Production knowledge tools:** Public docs for Notion, Obsidian, and Mem suggest a pattern of **scoped retrieval, related-context surfacing, manual merge affordances, and feedback capture**, not aggressive silent auto-merging. Obsidian exposes manual note merge ([Obsidian Note Composer](https://obsidian.md/help/plugins/note-composer)); Notion exposes thumbs up/down but says that feedback is for product improvement, not direct agent training ([Notion Agent help](https://www.notion.com/help/notion-agent)); Mem emphasizes related-context surfacing and manual collection merges ([Mem](https://get.mem.ai/for/brain-dumps), [Mem collections](https://get.mem.ai/blog/automatic-organization-with-collections)).  
  Inference: public material does **not** show these tools doing destructive autonomous reconsolidation by default.

**Gap Analysis**
- The prompt’s “not implemented” view is partially outdated. Current code already has `TM-04` thresholds (`0.4` density, `0.92` dedup, `50` char minimum, `14` day warn-only) in [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L96).
- `TM-06` exists but is deliberately conservative: opt-in only, checkpoint-gated, and non-blocking on error in [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L59) and [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L89).
- Learned feedback is more mature than described: separate non-FTS storage, TTL, denylist, caps, top-3 exclusion, 72h age gate, shadow period, audit log, rollback in [learned-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L10).
- The real missing layer is **event capture**. Stage 2 can consume learned triggers and negative-feedback stats, and `trackAccess` already performs FSRS strengthening, but the calling AI is not yet reliably emitting selection/use/reformulation events into that loop. See [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L13) and [negative-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L19).
- FSRS is already partially corrected by type-aware decay support: decisions and top tiers can effectively become no-decay under classification decay in [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L257). So the better path is **hybridization**, not replacement.

**Recommendations**
- **1. Promote FSRS to a bounded engagement signal, not the universal decay law.**  
  Rationale: documents are not human memory; some artifacts are durable regardless of access.  
  Size: **S**.  
  Sketch: keep current FSRS; enable type-aware no-decay/slow-decay by default for `decision`, `constitutional`, `critical`, and optionally `important`; add query-time recency only for recency-sensitive intents.  
  Impact: high precision gain on durable docs, lower “stale but important” loss.  
  Cold start: no behavior change for normal docs; only protected classes change.  
  Flag: `SPECKIT_CLASSIFICATION_DECAY` or new `SPECKIT_HYBRID_DECAY_POLICY`.

- **2. Add an implicit-feedback event ledger before changing any ranking weights.**  
  Rationale: the safest first step is logging, not learning.  
  Size: **S**.  
  Sketch: record `search_shown`, `result_selected`, `result_cited`, `query_reformulated`, `same-topic-requery`, and `follow-on tool use`; compute confidence tiers per event. Treat downstream citation/use as strongest, reformulation chains as medium, raw repeated search as weak.  
  Impact: unlocks trustworthy training data.  
  Cold start: shadow-only, no ranking effect.  
  Flag: `SPECKIT_IMPLICIT_FEEDBACK_LOG`.

- **3. Learn in weekly batches from high-confidence implicit signals, not online per event.**  
  Rationale: current volume is too low for stable online updates, and Elastic-style LTR needs balanced evidence.  
  Size: **M**.  
  Sketch: every week, aggregate only events with enough support, then update learned triggers/negative stats with caps; require minimum support such as `>=3` high-confidence uses per memory or term cluster before applying any boost.  
  Impact: medium-high, low risk.  
  Cold start: zero learned boosts until thresholds are met; keep base retrieval untouched.  
  Flag: `SPECKIT_BATCH_LEARNED_FEEDBACK`.

- **4. Keep the current TM-04 thresholds, but add a short-critical exception lane.**  
  Rationale: `0.4` density, `0.92` dedup, and `50` chars are sensible defaults, but they will over-reject short high-value decisions.  
  Size: **S**.  
  Sketch: bypass the length gate when `context_type=decision` or top-tier importance is present and at least two strong structural signals exist (`title`, `specFolder`, `anchor`, `trigger`, `importanceTier`).  
  Impact: preserves rare but crucial memories without lowering the general bar.  
  Cold start: exception lane initially warn-only.  
  Flag: `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS`.

- **5. Make reconsolidation assistive-first: merge, supersede, complement.**  
  Rationale: public knowledge tools expose manual merge/review more than silent destructive consolidation.  
  Size: **M**.  
  Sketch: `merge` only when similarity is very high and metadata align; `supersede` when similarity is high plus explicit newer-version cues; otherwise `complement`. A good starting policy is: `>=0.96 merge`, `0.88-0.96 review for supersede/complement`, `<0.88 keep separate`.  
  Impact: reduces duplicates without losing nuance.  
  Cold start: log recommended action before auto-applying anything except exact-near duplicates.  
  Flag: `SPECKIT_ASSISTIVE_RECONSOLIDATION`.

- **6. Add shadow scoring and holdout evaluation before any live boost/demotion rollout.**  
  Rationale: learning loops fail quietly when they self-reinforce popularity bias.  
  Size: **M**.  
  Sketch: compute “would-have-changed rank” alongside live rank, compare with downstream use/citation on a holdout slice, and only promote a signal after two stable weekly evaluations.  
  Impact: strong safety net.  
  Cold start: fully passive.  
  Flag: `SPECKIT_SHADOW_FEEDBACK`.

**Risk Assessment**
- **Feedback-loop instability:** popular items can keep getting more popular. Mitigate with caps, TTL, and holdout evaluation.
- **Cold-start degradation:** learning too early can hurt more than help. Mitigate with batch-only activation and minimum-support thresholds.
- **Overfitting to one agent’s habits:** a single caller may create narrow preferences. Mitigate with source/session stratification.
- **FTS/vector contamination:** already well mitigated by separate `learned_triggers` storage and rollback, so don’t weaken that.
- **Over-deduplication:** aggressive reconsolidation can erase legitimate variants. Mitigate with assistive review bands and conservative merge thresholds.

**Cross-Dimensional Dependencies**
- **Fusion D1:** feedback should enter as a bounded Stage 2 signal after base retrieval, not mutate core similarity; MPAB and feedback need joint shadow evaluation.
- **Query D2:** re-query chains are one of the best implicit dissatisfaction signals, and recency-sensitive intent detection should control when freshness matters.
- **Graph D3:** citations, follow-on usage, and reconsolidation outcomes can become graph edges, improving better-than-click signals over time.
- **UX D5:** even with implicit-only learning, you need auditability: why a result was boosted, why a save was blocked, why two memories were proposed for merge.

**Sources**
[Joachims et al. 2007](https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf), [Elastic LTR docs](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr), [Algolia events docs](https://www.algolia.com/doc/integration/salesforce-commerce-cloud-b2c/building-the-search-ui/events/), [Dai et al. 2011](https://www.microsoft.com/en-us/research/publication/learning-to-rank-for-freshness-and-relevance/), [Shen et al. 2024](https://aclanthology.org/2024.emnlp-main.507/), [NVIDIA semantic dedup](https://docs.nvidia.com/nemo-framework/user-guide/25.02/datacuration/semdedup.html), [Notion Agent](https://www.notion.com/help/notion-agent), [Obsidian Note Composer](https://obsidian.md/help/plugins/note-composer), [Mem](https://get.mem.ai/for/brain-dumps), [Mem collections](https://get.mem.ai/blog/automatic-organization-with-collections).

If you want, I can turn this into a concrete Sprint 4.5 rollout plan with schema changes, event definitions, and week-by-week flags.
tokens used
252,472
**Executive Summary**
- As of **March 21, 2026**, the repo is ahead of the prompt in three areas: `TM-04` is implemented with current thresholds, `TM-06` exists behind an opt-in flag plus checkpoint gate, and learned relevance feedback already exists with 10 safeguards; the main missing piece is **reliable signal collection from the calling AI**, not safeguard design. See [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L96), [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L56), [learned-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L7).
- FSRS is reasonable as an **engagement prior**, but not as the only decay law for document retrieval. Durable artifacts should use **type-aware/no-decay rules**, while FSRS or event-based decay should apply only where “recent use implies future usefulness.”
- Implicit feedback is useful, but the literature is clear that **click-like signals are biased**. The safest signals are **relative preferences and query chains**, plus downstream use/citation, not raw re-search counts alone ([Joachims et al. 2007](https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf), [Elastic LTR docs](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr)).
- At your scale, use **batch learning + shadow scoring**, not per-event online updates. Log online, learn weekly, cap boosts, and keep rollback.
- Reconsolidation should be **assistive by default**: auto-merge only for near-identical artifacts; otherwise prefer supersede/complement suggestions.

**State Of Art Survey**
- **Implicit feedback mining:** Classic IR work shows clicks are informative but biased, while **relative preferences** and **query reformulation chains** are more reliable than absolute click labels ([Joachims et al. 2007](https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf)). The same paper notes dwell/session signals help more in combination than alone.
- **Learning-to-rank in production:** Modern search systems train on **judgment lists** often built from behavioral analytics, but stress data balance and quality to avoid overfitting ([Elastic LTR docs](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr)). Production tooling like Algolia explicitly treats **view/click/conversion events** as the raw material for personalization and relevance tuning ([Algolia docs](https://www.algolia.com/doc/integration/salesforce-commerce-cloud-b2c/building-the-search-ui/events/)).
- **Freshness vs relevance:** Search literature does not treat recency as universally good. Microsoft’s freshness work argues freshness and relevance are coupled for some queries and independent for others, so the tradeoff should be **adaptive**, not global ([Dai et al. 2011](https://www.microsoft.com/en-us/research/publication/learning-to-rank-for-freshness-and-relevance/)).
- **RAG-specific signal use:** Recent RAG work suggests some robustness can be learned from **end-task supervision** rather than explicit relevance labeling alone; that supports using downstream answer success/citation as a feedback signal ([Shen et al. 2024](https://aclanthology.org/2024.emnlp-main.507/)).
- **Semantic dedup / quality gates:** Data-curation systems recommend threshold tuning in context rather than one universal semantic-duplicate cutoff; stricter thresholds yield higher precision, looser thresholds remove more content but raise false-merge risk ([NVIDIA NeMo semantic dedup](https://docs.nvidia.com/nemo-framework/user-guide/25.02/datacuration/semdedup.html)).
- **Production knowledge tools:** Public docs for Notion, Obsidian, and Mem suggest a pattern of **scoped retrieval, related-context surfacing, manual merge affordances, and feedback capture**, not aggressive silent auto-merging. Obsidian exposes manual note merge ([Obsidian Note Composer](https://obsidian.md/help/plugins/note-composer)); Notion exposes thumbs up/down but says that feedback is for product improvement, not direct agent training ([Notion Agent help](https://www.notion.com/help/notion-agent)); Mem emphasizes related-context surfacing and manual collection merges ([Mem](https://get.mem.ai/for/brain-dumps), [Mem collections](https://get.mem.ai/blog/automatic-organization-with-collections)).  
  Inference: public material does **not** show these tools doing destructive autonomous reconsolidation by default.

**Gap Analysis**
- The prompt’s “not implemented” view is partially outdated. Current code already has `TM-04` thresholds (`0.4` density, `0.92` dedup, `50` char minimum, `14` day warn-only) in [save-quality-gate.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts#L96).
- `TM-06` exists but is deliberately conservative: opt-in only, checkpoint-gated, and non-blocking on error in [reconsolidation-bridge.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/save/reconsolidation-bridge.ts#L59) and [search-flags.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L89).
- Learned feedback is more mature than described: separate non-FTS storage, TTL, denylist, caps, top-3 exclusion, 72h age gate, shadow period, audit log, rollback in [learned-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L10).
- The real missing layer is **event capture**. Stage 2 can consume learned triggers and negative-feedback stats, and `trackAccess` already performs FSRS strengthening, but the calling AI is not yet reliably emitting selection/use/reformulation events into that loop. See [stage2-fusion.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts#L13) and [negative-feedback.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts#L19).
- FSRS is already partially corrected by type-aware decay support: decisions and top tiers can effectively become no-decay under classification decay in [fsrs-scheduler.ts](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/fsrs-scheduler.ts#L257). So the better path is **hybridization**, not replacement.

**Recommendations**
- **1. Promote FSRS to a bounded engagement signal, not the universal decay law.**  
  Rationale: documents are not human memory; some artifacts are durable regardless of access.  
  Size: **S**.  
  Sketch: keep current FSRS; enable type-aware no-decay/slow-decay by default for `decision`, `constitutional`, `critical`, and optionally `important`; add query-time recency only for recency-sensitive intents.  
  Impact: high precision gain on durable docs, lower “stale but important” loss.  
  Cold start: no behavior change for normal docs; only protected classes change.  
  Flag: `SPECKIT_CLASSIFICATION_DECAY` or new `SPECKIT_HYBRID_DECAY_POLICY`.

- **2. Add an implicit-feedback event ledger before changing any ranking weights.**  
  Rationale: the safest first step is logging, not learning.  
  Size: **S**.  
  Sketch: record `search_shown`, `result_selected`, `result_cited`, `query_reformulated`, `same-topic-requery`, and `follow-on tool use`; compute confidence tiers per event. Treat downstream citation/use as strongest, reformulation chains as medium, raw repeated search as weak.  
  Impact: unlocks trustworthy training data.  
  Cold start: shadow-only, no ranking effect.  
  Flag: `SPECKIT_IMPLICIT_FEEDBACK_LOG`.

- **3. Learn in weekly batches from high-confidence implicit signals, not online per event.**  
  Rationale: current volume is too low for stable online updates, and Elastic-style LTR needs balanced evidence.  
  Size: **M**.  
  Sketch: every week, aggregate only events with enough support, then update learned triggers/negative stats with caps; require minimum support such as `>=3` high-confidence uses per memory or term cluster before applying any boost.  
  Impact: medium-high, low risk.  
  Cold start: zero learned boosts until thresholds are met; keep base retrieval untouched.  
  Flag: `SPECKIT_BATCH_LEARNED_FEEDBACK`.

- **4. Keep the current TM-04 thresholds, but add a short-critical exception lane.**  
  Rationale: `0.4` density, `0.92` dedup, and `50` chars are sensible defaults, but they will over-reject short high-value decisions.  
  Size: **S**.  
  Sketch: bypass the length gate when `context_type=decision` or top-tier importance is present and at least two strong structural signals exist (`title`, `specFolder`, `anchor`, `trigger`, `importanceTier`).  
  Impact: preserves rare but crucial memories without lowering the general bar.  
  Cold start: exception lane initially warn-only.  
  Flag: `SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS`.

- **5. Make reconsolidation assistive-first: merge, supersede, complement.**  
  Rationale: public knowledge tools expose manual merge/review more than silent destructive consolidation.  
  Size: **M**.  
  Sketch: `merge` only when similarity is very high and metadata align; `supersede` when similarity is high plus explicit newer-version cues; otherwise `complement`. A good starting policy is: `>=0.96 merge`, `0.88-0.96 review for supersede/complement`, `<0.88 keep separate`.  
  Impact: reduces duplicates without losing nuance.  
  Cold start: log recommended action before auto-applying anything except exact-near duplicates.  
  Flag: `SPECKIT_ASSISTIVE_RECONSOLIDATION`.

- **6. Add shadow scoring and holdout evaluation before any live boost/demotion rollout.**  
  Rationale: learning loops fail quietly when they self-reinforce popularity bias.  
  Size: **M**.  
  Sketch: compute “would-have-changed rank” alongside live rank, compare with downstream use/citation on a holdout slice, and only promote a signal after two stable weekly evaluations.  
  Impact: strong safety net.  
  Cold start: fully passive.  
  Flag: `SPECKIT_SHADOW_FEEDBACK`.

**Risk Assessment**
- **Feedback-loop instability:** popular items can keep getting more popular. Mitigate with caps, TTL, and holdout evaluation.
- **Cold-start degradation:** learning too early can hurt more than help. Mitigate with batch-only activation and minimum-support thresholds.
- **Overfitting to one agent’s habits:** a single caller may create narrow preferences. Mitigate with source/session stratification.
- **FTS/vector contamination:** already well mitigated by separate `learned_triggers` storage and rollback, so don’t weaken that.
- **Over-deduplication:** aggressive reconsolidation can erase legitimate variants. Mitigate with assistive review bands and conservative merge thresholds.

**Cross-Dimensional Dependencies**
- **Fusion D1:** feedback should enter as a bounded Stage 2 signal after base retrieval, not mutate core similarity; MPAB and feedback need joint shadow evaluation.
- **Query D2:** re-query chains are one of the best implicit dissatisfaction signals, and recency-sensitive intent detection should control when freshness matters.
- **Graph D3:** citations, follow-on usage, and reconsolidation outcomes can become graph edges, improving better-than-click signals over time.
- **UX D5:** even with implicit-only learning, you need auditability: why a result was boosted, why a save was blocked, why two memories were proposed for merge.

**Sources**
[Joachims et al. 2007](https://www.cs.cornell.edu/people/tj/publications/joachims_etal_07a.pdf), [Elastic LTR docs](https://www.elastic.co/docs/solutions/search/ranking/learning-to-rank-ltr), [Algolia events docs](https://www.algolia.com/doc/integration/salesforce-commerce-cloud-b2c/building-the-search-ui/events/), [Dai et al. 2011](https://www.microsoft.com/en-us/research/publication/learning-to-rank-for-freshness-and-relevance/), [Shen et al. 2024](https://aclanthology.org/2024.emnlp-main.507/), [NVIDIA semantic dedup](https://docs.nvidia.com/nemo-framework/user-guide/25.02/datacuration/semdedup.html), [Notion Agent](https://www.notion.com/help/notion-agent), [Obsidian Note Composer](https://obsidian.md/help/plugins/note-composer), [Mem](https://get.mem.ai/for/brain-dumps), [Mem collections](https://get.mem.ai/blog/automatic-organization-with-collections).

If you want, I can turn this into a concrete Sprint 4.5 rollout plan with schema changes, event definitions, and week-by-week flags.
