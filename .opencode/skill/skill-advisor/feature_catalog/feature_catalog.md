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
- [5. TESTING](#5--testing)

---

## 1. OVERVIEW

Use this catalog as the canonical inventory for the live `skill-advisor` feature surface. The numbered sections below group the advisor by capability area so readers can move from a top-level summary into per-feature reference files without losing the implementation and validation context behind each routing decision.

| Category | Coverage | Primary Runtime Surface |
|---|---:|---|
| Routing pipeline | 6 features | `skill_advisor.py` |
| Graph system | 10 features | `skill_advisor.py`, `skill_graph_compiler.py`, `skill-graph.sqlite` |
| Semantic search | 2 features | `skill_advisor.py` |
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

## 5. TESTING

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
