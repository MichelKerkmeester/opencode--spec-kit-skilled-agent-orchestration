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
| Graph system | 8 features | `skill_advisor.py`, `skill_graph_compiler.py`, `skill-graph.json` |
| Semantic search | 2 features | `skill_advisor.py` |
| Testing | 2 features | `skill_advisor_regression.py`, `skill_advisor.py` |

---

## 2. ROUTING PIPELINE

These entries cover how the advisor discovers skills, normalizes prompts, applies lexical and phrase-based boosts, calibrates confidence, and decides which candidates make it into the final result set.

| Feature | Description | Current Reality | Source Files |
|---|---|---|---|
| [Skill discovery](01--routing-pipeline/01-skill-discovery.md) | Loads the routable surface before scoring begins. | The advisor builds a live inventory from cached skill records and overlays command bridges so skills and slash-command surfaces can be ranked together. | [`01--routing-pipeline/01-skill-discovery.md`](01--routing-pipeline/01-skill-discovery.md) |
| [Request normalization](01--routing-pipeline/02-request-normalization.md) | Converts raw prompts into scorer-friendly tokens. | The prompt is lowercased, tokenized, stop words are filtered only for corpus matching, synonyms are expanded, and canonical intent rules are applied before the main score loop. | [`01--routing-pipeline/02-request-normalization.md`](01--routing-pipeline/02-request-normalization.md) |
| [Keyword boosting](01--routing-pipeline/03-keyword-boosting.md) | Applies direct token-level evidence to candidate skills. | Single-skill boosters, multi-skill boosters, explicit skill mentions, and name-or-corpus term matches all contribute weighted evidence to the score. | [`01--routing-pipeline/03-keyword-boosting.md`](01--routing-pipeline/03-keyword-boosting.md) |
| [Phrase intent boosting](01--routing-pipeline/04-phrase-intent-boosting.md) | Adds high-signal boosts for multi-token requests. | Exact phrase matches such as `review this pr`, `responsive css layout fix`, and `semantic code search` inject stronger routing hints than isolated words. | [`01--routing-pipeline/04-phrase-intent-boosting.md`](01--routing-pipeline/04-phrase-intent-boosting.md) |
| [Confidence calibration](01--routing-pipeline/05-confidence-calibration.md) | Converts raw scores into routing readiness. | The advisor computes confidence and uncertainty separately, applies margin and ambiguity penalties, and checks the default `0.8 / 0.35` dual threshold. | [`01--routing-pipeline/05-confidence-calibration.md`](01--routing-pipeline/05-confidence-calibration.md) |
| [Result filtering](01--routing-pipeline/06-result-filtering.md) | Chooses what the caller actually receives. | Default mode keeps only dual-threshold passes, confidence-only mode can bypass uncertainty gating, and the final rank order prefers explicit, passing skill results over command bridges. | [`01--routing-pipeline/06-result-filtering.md`](01--routing-pipeline/06-result-filtering.md) |

---

## 3. GRAPH SYSTEM

These entries describe the relationship-aware overlay that validates per-skill metadata, compiles a compact runtime graph, and feeds graph evidence back into routing without letting the graph invent unsupported candidates.

| Feature | Description | Current Reality | Source Files |
|---|---|---|---|
| [Graph metadata schema](02--graph-system/01-graph-metadata-schema.md) | Defines the per-skill metadata contract. | The compiler enforces schema version, family/category allowlists, typed edge groups, target validation, weight bounds, and required `domains` plus `intent_signals` arrays. | [`02--graph-system/01-graph-metadata-schema.md`](02--graph-system/01-graph-metadata-schema.md) |
| [Graph compiler](02--graph-system/02-graph-compiler.md) | Scans, validates, and writes the compiled graph. | The CLI discovers skill metadata, reports hard validation failures, emits soft symmetry and orphan warnings, and writes `skill-graph.json` when validation passes. | [`02--graph-system/02-graph-compiler.md`](02--graph-system/02-graph-compiler.md) |
| [Compiled graph](02--graph-system/03-compiled-graph.md) | Describes the runtime JSON artifact the advisor loads. | The shipped graph currently contains 20 skills, 6 families, sparse adjacency, per-skill signals, no active conflicts, and a computed hub-skill list. | [`02--graph-system/03-compiled-graph.md`](02--graph-system/03-compiled-graph.md) |
| [Transitive boosts](02--graph-system/04-transitive-boosts.md) | Propagates evidence across graph edges. | Positive candidates can reinforce related skills through `enhances`, `siblings`, and `depends_on` edges with distinct multipliers and a minimum useful boost threshold. | [`02--graph-system/04-transitive-boosts.md`](02--graph-system/04-transitive-boosts.md) |
| [Family affinity](02--graph-system/05-family-affinity.md) | Adds lighter within-family reinforcement. | Strong evidence for one family member can slightly lift weaker same-family candidates when those candidates already have some direct evidence. | [`02--graph-system/05-family-affinity.md`](02--graph-system/05-family-affinity.md) |
| [Conflict penalty](02--graph-system/06-conflict-penalty.md) | Raises uncertainty when conflicting results both pass. | The penalty path is live in the advisor, but the current compiled graph exposes an empty conflicts list so no runtime conflicts are being penalized today. | [`02--graph-system/06-conflict-penalty.md`](02--graph-system/06-conflict-penalty.md) |
| [Ghost candidate guard](02--graph-system/07-ghost-candidate-guard.md) | Stops the graph from creating brand-new winners. | Graph boosts only apply to candidates that already have positive evidence in the snapshot, so edges can reinforce but not conjure recommendations. | [`02--graph-system/07-ghost-candidate-guard.md`](02--graph-system/07-ghost-candidate-guard.md) |
| [Evidence separation](02--graph-system/08-evidence-separation.md) | Keeps graph evidence distinct from lexical evidence. | Graph reasons are tagged separately, counted separately, and heavily graph-driven recommendations receive an extra confidence haircut after calibration. | [`02--graph-system/08-evidence-separation.md`](02--graph-system/08-evidence-separation.md) |

---

## 4. SEMANTIC SEARCH

These entries cover the advisor's built-in CocoIndex handoff and the heuristics that decide when semantic discovery should activate automatically instead of relying on lexical matching alone.

| Feature | Description | Current Reality | Source Files |
|---|---|---|---|
| [CocoIndex integration](03--semantic-search/01-cocoindex-integration.md) | Blends `ccc search` results into advisor scores. | The advisor can launch built-in CocoIndex searches, parse result text into skill hits, and convert ranked semantic hits into score boosts with rank decay. | [`03--semantic-search/01-cocoindex-integration.md`](03--semantic-search/01-cocoindex-integration.md) |
| [Auto triggers](03--semantic-search/02-auto-triggers.md) | Decides when semantic search should run without an explicit flag. | Phrase triggers, token intersections, exact-match guards, and binary availability checks determine whether the advisor auto-promotes `mcp-coco-index`. | [`03--semantic-search/02-auto-triggers.md`](03--semantic-search/02-auto-triggers.md) |

---

## 5. TESTING

These entries describe the validation surfaces that keep routing quality measurable and make it easy to inspect whether the advisor can still discover skills, load the compiled graph, and reach its semantic dependencies.

| Feature | Description | Current Reality | Source Files |
|---|---|---|---|
| [Regression harness](04--testing/01-regression-harness.md) | Runs the permanent routing quality suite. | The JSONL-driven harness measures pass rate, P0 coverage, top-1 accuracy, and command-bridge false positives, then fails the run when any quality gate is missed. | [`04--testing/01-regression-harness.md`](04--testing/01-regression-harness.md) |
| [Health check](04--testing/02-health-check.md) | Returns a one-shot advisor diagnostics payload. | `--health` reports discovery counts, cache status, graph load state, and CocoIndex availability so operators can verify the routing stack without running a real prompt. | [`04--testing/02-health-check.md`](04--testing/02-health-check.md) |
