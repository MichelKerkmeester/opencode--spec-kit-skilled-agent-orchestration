---
title: "Skill Advisor: Feature Catalog"
description: "Unified reference combining the complete feature inventory and current-reality reference for the skill advisor routing system."
---

# Skill Advisor: Feature Catalog

This document combines the current feature inventory for the `skill-advisor` system into a single reference. The root catalog acts as the system-level directory: it summarizes the routing pipeline, graph compilation surfaces, semantic search hooks, and validation tooling, and points to the per-feature files that carry the deeper implementation and verification anchors.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. ROUTING PIPELINE](#2--routing-pipeline)
- [3. GRAPH SYSTEM](#3--graph-system)
- [4. SEMANTIC SEARCH](#4--semantic-search)
- [5. HOOK SURFACE](#5--hook-surface)
- [6. TESTING](#6--testing)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `skill-advisor` feature surface. The numbered sections below group the advisor by capability area so readers can move from a top-level summary into per-feature reference files without losing the implementation and validation context behind each routing decision.

| Category | Coverage | Primary Runtime Surface |
|---|---:|---|
| Routing pipeline | 6 features | `skill_advisor.py` |
| Graph system | 10 features | `skill_advisor.py`, `skill_graph_compiler.py`, `skill-graph.sqlite` |
| Semantic search | 2 features | `skill_advisor.py` |
| Hook surface | 12 features | `buildSkillAdvisorBrief()`, runtime `UserPromptSubmit` adapters |
| Testing | 2 features | `skill_advisor_regression.py`, `skill_advisor.py` |

---

## 2. ROUTING PIPELINE

These entries cover how the advisor discovers skills, normalizes prompts, applies lexical and phrase-based boosts, calibrates confidence, and decides which candidates make it into the final result set.

### Skill discovery

#### Description

Loads the routable surface before scoring begins.

#### Current Reality

The advisor builds a live inventory from cached skill records and overlays command bridges so skills and slash-command surfaces can be ranked together.

#### Source Files

See [`01--routing-pipeline/01-skill-discovery.md`](01--routing-pipeline/01-skill-discovery.md) for full implementation and test file listings.

---

### Request normalization

#### Description

Converts raw prompts into scorer-friendly tokens.

#### Current Reality

The prompt is lowercased, tokenized, stop words are filtered only for corpus matching, synonyms are expanded, and canonical intent rules are applied before the main score loop.

#### Source Files

See [`01--routing-pipeline/02-request-normalization.md`](01--routing-pipeline/02-request-normalization.md) for full implementation and test file listings.

---

### Keyword boosting

#### Description

Applies direct token-level evidence to candidate skills.

#### Current Reality

Single-skill boosters, multi-skill boosters, explicit skill mentions, and name-or-corpus term matches all contribute weighted evidence to the score.

#### Source Files

See [`01--routing-pipeline/03-keyword-boosting.md`](01--routing-pipeline/03-keyword-boosting.md) for full implementation and test file listings.

---

### Phrase intent boosting

#### Description

Adds high-signal boosts for multi-token requests.

#### Current Reality

Exact phrase matches such as `review this pr`, `responsive css layout fix`, and `semantic code search` inject stronger routing hints than isolated words.

#### Source Files

See [`01--routing-pipeline/04-phrase-intent-boosting.md`](01--routing-pipeline/04-phrase-intent-boosting.md) for full implementation and test file listings.

---

### Confidence calibration

#### Description

Converts raw scores into routing readiness.

#### Current Reality

The advisor computes confidence and uncertainty separately, applies margin and ambiguity penalties, and checks the default `0.8 / 0.35` dual threshold.

#### Source Files

See [`01--routing-pipeline/05-confidence-calibration.md`](01--routing-pipeline/05-confidence-calibration.md) for full implementation and test file listings.

---

### Result filtering

#### Description

Chooses what the caller actually receives.

#### Current Reality

Default mode keeps only dual-threshold passes, confidence-only mode can bypass uncertainty gating, and the final rank order prefers explicit, passing skill results over command bridges.

#### Source Files

See [`01--routing-pipeline/06-result-filtering.md`](01--routing-pipeline/06-result-filtering.md) for full implementation and test file listings.

---

## 3. GRAPH SYSTEM

These entries describe the relationship-aware overlay that validates per-skill metadata, compiles export snapshots, maintains the live SQLite graph store, and feeds graph evidence back into routing without letting the graph invent unsupported candidates.

### Graph metadata schema

#### Description

Defines the per-skill metadata contract.

#### Current Reality

The compiler enforces schema version, family/category allowlists, typed edge groups, target validation, weight bounds, and required `domains` plus `intent_signals` arrays.

#### Source Files

See [`02--graph-system/01-graph-metadata-schema.md`](02--graph-system/01-graph-metadata-schema.md) for full implementation and test file listings.

---

### Graph compiler

#### Description

Scans, validates, and writes the compiled graph.

#### Current Reality

The CLI discovers skill metadata, reports hard validation failures, emits soft symmetry and orphan warnings, and writes `skill-graph.json` when validation passes.

#### Source Files

See [`02--graph-system/02-graph-compiler.md`](02--graph-system/02-graph-compiler.md) for full implementation and test file listings.

---

### Compiled graph

#### Description

Describes the runtime JSON artifact the advisor loads.

#### Current Reality

The shipped graph currently contains 21 skills, 6 families, sparse adjacency, per-skill signals, no active conflicts, and a computed hub-skill list.

#### Source Files

See [`02--graph-system/03-compiled-graph.md`](02--graph-system/03-compiled-graph.md) for full implementation and test file listings.

---

### Transitive boosts

#### Description

Propagates evidence across graph edges.

#### Current Reality

Positive candidates can reinforce related skills through `enhances`, `siblings`, and `depends_on` edges with distinct multipliers and a minimum useful boost threshold.

#### Source Files

See [`02--graph-system/04-transitive-boosts.md`](02--graph-system/04-transitive-boosts.md) for full implementation and test file listings.

---

### Family affinity

#### Description

Adds lighter within-family reinforcement.

#### Current Reality

Strong evidence for one family member can slightly lift weaker same-family candidates when those candidates already have some direct evidence.

#### Source Files

See [`02--graph-system/05-family-affinity.md`](02--graph-system/05-family-affinity.md) for full implementation and test file listings.

---

### Conflict penalty

#### Description

Raises uncertainty when conflicting results both pass.

#### Current Reality

The penalty path is live in the advisor, but the current compiled graph exposes an empty conflicts list so no runtime conflicts are being penalized today.

#### Source Files

See [`02--graph-system/06-conflict-penalty.md`](02--graph-system/06-conflict-penalty.md) for full implementation and test file listings.

---

### Ghost candidate guard

#### Description

Stops the graph from creating brand-new winners.

#### Current Reality

Graph boosts only apply to candidates that already have positive evidence in the snapshot, so edges can reinforce but not conjure recommendations.

#### Source Files

See [`02--graph-system/07-ghost-candidate-guard.md`](02--graph-system/07-ghost-candidate-guard.md) for full implementation and test file listings.

---

### Evidence separation

#### Description

Keeps graph evidence distinct from lexical evidence.

#### Current Reality

Graph reasons are tagged separately, counted separately, and heavily graph-driven recommendations receive an extra confidence haircut after calibration.

#### Source Files

See [`02--graph-system/08-evidence-separation.md`](02--graph-system/08-evidence-separation.md) for full implementation and test file listings.

---

### SQLite graph store

#### Description

Stores the compiled skill graph in a dedicated SQLite database instead of a static JSON file, enabling real-time queries and auto-indexing.

#### Current Reality

The skill graph is stored in `skill-graph.sqlite` alongside `code-graph.sqlite` and `deep-loop-graph.sqlite`. The advisor reads from SQLite first and falls back to JSON if unavailable. Four MCP tools (`skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`) provide structural queries accessible from all runtimes.

#### Source Files

See [`02--graph-system/09-sqlite-graph-store.md`](02--graph-system/09-sqlite-graph-store.md) for full implementation and test file listings.

---

### Auto-indexing

#### Description

Watches `graph-metadata.json` files for changes and automatically reindexes the SQLite store without manual recompilation.

#### Current Reality

A Chokidar file watcher monitors `.opencode/skill/*/graph-metadata.json` with 2-second debounce. On startup, an async non-blocking scan indexes all 21 metadata files. Content hashing (SHA-256) skips unchanged files for fast incremental updates.

#### Source Files

See [`02--graph-system/10-auto-indexing.md`](02--graph-system/10-auto-indexing.md) for full implementation and test file listings.

---

## 4. SEMANTIC SEARCH

These entries cover the advisor's built-in CocoIndex handoff and the heuristics that decide when semantic discovery should activate automatically instead of relying on lexical matching alone.

### CocoIndex integration

#### Description

Blends `ccc search` results into advisor scores.

#### Current Reality

The advisor can launch built-in CocoIndex searches, parse result text into skill hits, and convert ranked semantic hits into score boosts with rank decay.

#### Source Files

See [`03--semantic-search/01-cocoindex-integration.md`](03--semantic-search/01-cocoindex-integration.md) for full implementation and test file listings.

---

### Auto triggers

#### Description

Decides when semantic search should run without an explicit flag.

#### Current Reality

Phrase triggers, token intersections, exact-match guards, and binary availability checks determine whether the advisor auto-promotes `mcp-coco-index`.

#### Source Files

See [`03--semantic-search/02-auto-triggers.md`](03--semantic-search/02-auto-triggers.md) for full implementation and test file listings.

---

## 5. HOOK SURFACE

These entries cover the Phase 020 prompt-time hook surface. The hook path is now the primary Gate 2 invocation route, while `skill_advisor.py` remains the direct CLI fallback for diagnostics and scripted checks. The operator contract lives in the [Skill Advisor Hook Reference](../../system-spec-kit/references/hooks/skill-advisor-hook.md).

### User-prompt-submit hook adapters

#### Description

Runs the advisor at prompt time for Claude, Gemini, Copilot, and Codex.

#### Current Reality

Claude and Gemini emit JSON `hookSpecificOutput.additionalContext`, Copilot uses an SDK callback when available with a wrapper fallback, and Codex uses native `UserPromptSubmit` with a prompt-wrapper fallback when native hooks are unavailable.

#### Source Files

Primary adapters: `mcp_server/hooks/claude/user-prompt-submit.ts`, `mcp_server/hooks/gemini/user-prompt-submit.ts`, `mcp_server/hooks/copilot/user-prompt-submit.ts`, and `mcp_server/hooks/codex/user-prompt-submit.ts`.

---

### Shared-payload advisor envelope

#### Description

Defines the typed advisor metadata contract carried through shared payloads.

#### Current Reality

`AdvisorEnvelopeMetadata` allows only `freshness`, `confidence`, `uncertainty`, `skillLabel`, and `status`, with producer-gated metadata and prompt-derived provenance rejection.

#### Source Files

Primary contract: `mcp_server/lib/context/shared-payload.ts`.

---

### HMAC exact prompt cache

#### Description

Caches exact canonical prompt results without persisting prompt text.

#### Current Reality

Prompt cache keys use an HMAC with a process-local session secret, include runtime, source signature, and threshold settings, and expire after the 5-minute TTL.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/prompt-cache.ts`.

---

### Freshness probe and fingerprints

#### Description

Reports whether advisor sources and graph artifacts are current enough for hook output.

#### Current Reality

Freshness uses per-skill `SKILL.md` and `graph-metadata.json` fingerprints, script and graph artifact probes, generation-tagged snapshots, and explicit live/stale/absent/unavailable states.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/freshness.ts`.

---

### Generation counter

#### Description

Tags source snapshots so graph rebuilds can invalidate stale prompt-cache reads.

#### Current Reality

The generation counter writes through a temporary file plus rename, recovers malformed counters when possible, and reports unrecoverable corruption as unavailable freshness.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/generation.ts`.

---

### Four-runtime parity harness

#### Description

Keeps model-visible advisor text consistent across runtime transports.

#### Current Reality

Adapter output normalization compares Claude, Gemini, Copilot, and Codex outputs through a runtime-neutral shape so parity tests can assert identical `additionalContext` text.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/normalize-adapter-output.ts`.

---

### 200-prompt corpus parity gate

#### Description

Protects routing quality against regressions from hook integration.

#### Current Reality

The Phase 020 release gate reuses the 019/004 200-prompt corpus and requires top-1 parity between direct advisor output and hook-visible recommendations.

#### Source Files

Primary evidence: `mcp_server/tests/advisor-corpus-parity.vitest.ts` and the Phase 020 implementation summaries.

---

### Disable flag

#### Description

Provides an immediate rollback switch for prompt-time advisor work.

#### Current Reality

Setting `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` makes every runtime adapter bypass `buildSkillAdvisorBrief()` and emit `{}` or no prompt wrapper output.

#### Source Files

Primary contract: [Skill Advisor Hook Reference §9](../../system-spec-kit/references/hooks/skill-advisor-hook.md#9--disable-flag).

---

### Observability metrics

#### Description

Defines the closed metric namespace for hook outcomes, latency, cache behavior, and freshness.

#### Current Reality

Metrics use the `speckit_advisor_hook_*` namespace with closed labels for runtime, status, freshness, cacheHit, and errorCode.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/metrics.ts`.

---

### AdvisorHookDiagnosticRecord JSONL

#### Description

Standardizes prompt-free diagnostic records written by runtime adapters.

#### Current Reality

Diagnostics include timestamp, runtime, status, freshness, duration, cache hit state, optional error code, skill label, and generation. Forbidden JSONL fields include `prompt`, `promptFingerprint`, `promptExcerpt`, `stdout`, and `stderr`.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/metrics.ts`.

---

### advisor-hook-health session section

#### Description

Summarizes recent hook health without exposing prompt content.

#### Current Reality

The `advisor-hook-health` section reports recent diagnostic records, rolling cache-hit rate, cache-hit p95, and fail-open rate, capped to the last 30 invocations.

#### Source Files

Primary implementation: `mcp_server/lib/skill-advisor/metrics.ts`.

---

### Privacy contract

#### Description

Prevents prompt text and prompt-derived identifiers from crossing hook observability or shared-payload boundaries.

#### Current Reality

Raw prompts, prompt excerpts, prompt fingerprints, subprocess stdout, and subprocess stderr are forbidden in diagnostics, metrics, health output, and shared-payload source refs. Exact prompt cache keys stay private and HMAC-derived.

#### Source Files

Primary contract: [Skill Advisor Hook Reference §10](../../system-spec-kit/references/hooks/skill-advisor-hook.md#10--privacy-contract).

---

## 6. TESTING

These entries describe the validation surfaces that keep routing quality measurable and make it easy to inspect whether the advisor can still discover skills, load the compiled graph, and reach its semantic dependencies.

### Regression harness

#### Description

Runs the permanent routing quality suite.

#### Current Reality

The JSONL-driven harness measures pass rate, P0 coverage, top-1 accuracy, and command-bridge false positives, then fails the run when any quality gate is missed.

#### Source Files

See [`04--testing/01-regression-harness.md`](04--testing/01-regression-harness.md) for full implementation and test file listings.

---

### Health check

#### Description

Returns a one-shot advisor diagnostics payload.

#### Current Reality

`--health` reports discovery counts, cache status, graph load state, and CocoIndex availability so operators can verify the routing stack without running a real prompt.

#### Source Files

See [`04--testing/02-health-check.md`](04--testing/02-health-check.md) for full implementation and test file listings.
