---
title: "Health check"
description: "Describes the advisor health payload exposed through the `--health` CLI flag."
---

# Health check

## 1. OVERVIEW

Describes the advisor health payload exposed through the `--health` CLI flag.

Sometimes the fastest way to verify the routing stack is to ask it what it sees right now. The health check does that by returning a structured snapshot of discovery, cache, graph, and semantic-search state without requiring a real user prompt.

---

## 2. CURRENT REALITY

`health_check()` returns the advisor's local diagnostics payload. It reports overall status, how many real skills and command bridges were discovered, the discovered names, the configured skills directory, whether that directory exists, the current cache status from the runtime helper, whether the compiled graph loaded successfully, and how many skills the loaded graph contains. Treat `skills_found`, `command_bridges_found`, and `skill_graph_skill_count` as live inventory values rather than fixed constants, and treat `status` as a derived health signal: the implementation only returns `ok` when graph load, inventory parity, cache health, and source-metadata health are all green. The CLI path then enriches that payload with `cocoindex_available` and the resolved CocoIndex binary path before printing JSON.

This makes `--health` a thin operational readiness probe for the whole routing stack. Operators can confirm that discovery is working, the compiled graph is readable, the runtime cache is alive, and semantic search dependencies are present without needing to reason through a specific prompt or inspect files by hand.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `skill_advisor.py` | Diagnostic CLI | Defines `health_check()` and the `--health` execution path that prints the advisor status payload. |
| `skill_advisor.py` | Runtime | Resolves CocoIndex availability and includes cache plus graph state in the final health response. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `skill_graph_compiler.py` | Validation CLI | Separately validates the metadata and graph artifact that `--health` later reports as loaded. |
| `skill-graph.json` | Compiled artifact | Provides the graph file whose presence and skill count are surfaced by the health payload. |

---

## 4. SOURCE METADATA

- Group: Testing
- Canonical catalog source: `FEATURE_CATALOG.md`
- Feature file path: `04--testing/02-health-check.md`
