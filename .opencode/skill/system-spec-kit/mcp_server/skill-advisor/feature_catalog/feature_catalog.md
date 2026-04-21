---
title: "Skill Advisor: Feature Catalog"
description: "Post-Phase-027 feature inventory for the native-first skill advisor, covering daemon freshness, auto-indexing, lifecycle routing, 5-lane scorer fusion, promotion gates, MCP surface, runtime hooks, plugin bridge, and Python compatibility."
trigger_phrases:
  - "skill advisor catalog"
  - "advisor feature catalog"
  - "native advisor features"
  - "skill advisor inventory"
---

# Skill Advisor: Feature Catalog

This catalog is the post-Phase-027 inventory for the skill advisor. The package source of truth is `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`. Each group links to per-feature files that cite the real implementation and test anchors.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. DAEMON AND FRESHNESS](#2--daemon-and-freshness)
- [3. AUTO-INDEXING](#3--auto-indexing)
- [4. LIFECYCLE ROUTING](#4--lifecycle-routing)
- [5. SCORER FUSION](#5--scorer-fusion)
- [6. PROMOTION GATES](#6--promotion-gates)
- [7. MCP SURFACE](#7--mcp-surface)
- [8. HOOKS AND PLUGIN](#8--hooks-and-plugin)
- [9. PYTHON COMPAT](#9--python-compat)

---

## 1. OVERVIEW

The catalog covers 42 features across 8 groups. Group 1 owns daemon correctness; groups 2-3 own the index and lifecycle surface that feeds the scorer; groups 4-5 own the scoring and promotion pipeline; group 6 exposes the MCP tools; groups 7-8 cover runtime integrations and Python compatibility.

| Group | Count | Scope |
| --- | --- | --- |
| [01--daemon-and-freshness](./01--daemon-and-freshness/) | 7 | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation |
| [02--auto-indexing](./02--auto-indexing/) | 6 | Derived extraction, sanitizer, provenance, sync, anti-stuffing, DF/IDF corpus |
| [03--lifecycle-routing](./03--lifecycle-routing/) | 5 | Age haircut, supersession, archive handling, schema migration, rollback |
| [04--scorer-fusion](./04--scorer-fusion/) | 6 | 5-lane fusion, projection, ambiguity, attribution, ablation, weights config |
| [05--promotion-gates](./05--promotion-gates/) | 6 | Shadow cycle, weight delta cap, 7-gate bundle, two-cycle, semantic lock, rollback |
| [06--mcp-surface](./06--mcp-surface/) | 4 | `advisor_recommend`, `advisor_status`, `advisor_validate`, stable compat entrypoint |
| [07--hooks-and-plugin](./07--hooks-and-plugin/) | 5 | Claude, Copilot, Gemini, Codex hooks plus OpenCode plugin bridge |
| [08--python-compat](./08--python-compat/) | 3 | Python CLI shim, regression suite, bench runner |

Baseline numbers (Phase 027 remediation SHA `97a318d83`):

| Metric | Value |
| --- | --- |
| Full-corpus top-1 accuracy | 80.5% |
| Holdout top-1 accuracy | 77.5% |
| UNKNOWN count | <= 10 |
| Python regression suite | 52 of 52 pass |
| Advisor vitest tests | 167 across 23 files |
| Watcher idle envelope | 0.031% CPU, 5.516 MB RSS |
| Cache-hit p95 | ~6.989 ms |
| Uncached p95 | ~11.45 ms |

---

## 2. DAEMON AND FRESHNESS

| Feature | File |
| --- | --- |
| Chokidar narrow-scope watcher | [01--daemon-and-freshness/01-watcher.md](./01--daemon-and-freshness/01-watcher.md) |
| Workspace single-writer lease | [01--daemon-and-freshness/02-lease.md](./01--daemon-and-freshness/02-lease.md) |
| Daemon lifecycle and health | [01--daemon-and-freshness/03-lifecycle.md](./01--daemon-and-freshness/03-lifecycle.md) |
| Generation-tagged snapshot publication | [01--daemon-and-freshness/04-generation.md](./01--daemon-and-freshness/04-generation.md) |
| Live / stale / absent / unavailable trust state | [01--daemon-and-freshness/05-trust-state.md](./01--daemon-and-freshness/05-trust-state.md) |
| Rebuild from source on corrupt SQLite | [01--daemon-and-freshness/06-rebuild-from-source.md](./01--daemon-and-freshness/06-rebuild-from-source.md) |
| Generation-tied cache invalidation | [01--daemon-and-freshness/07-cache-invalidation.md](./01--daemon-and-freshness/07-cache-invalidation.md) |

---

## 3. AUTO-INDEXING

| Feature | File |
| --- | --- |
| Deterministic derived extraction | [02--auto-indexing/01-derived-extraction.md](./02--auto-indexing/01-derived-extraction.md) |
| A7 sanitizer at every write boundary | [02--auto-indexing/02-sanitizer.md](./02--auto-indexing/02-sanitizer.md) |
| Provenance fingerprints and trust lanes | [02--auto-indexing/03-provenance-and-trust-lanes.md](./02--auto-indexing/03-provenance-and-trust-lanes.md) |
| Graph-metadata derived sync | [02--auto-indexing/04-sync.md](./02--auto-indexing/04-sync.md) |
| Anti-stuffing and cardinality caps | [02--auto-indexing/05-anti-stuffing.md](./02--auto-indexing/05-anti-stuffing.md) |
| DF/IDF corpus stats (active-only) | [02--auto-indexing/06-df-idf-corpus.md](./02--auto-indexing/06-df-idf-corpus.md) |

---

## 4. LIFECYCLE ROUTING

| Feature | File |
| --- | --- |
| Derived-lane-only age haircut | [03--lifecycle-routing/01-age-haircut.md](./03--lifecycle-routing/01-age-haircut.md) |
| Asymmetric supersession routing | [03--lifecycle-routing/02-supersession.md](./03--lifecycle-routing/02-supersession.md) |
| Archive and future skills indexed but not routed | [03--lifecycle-routing/03-archive-handling.md](./03--lifecycle-routing/03-archive-handling.md) |
| Schema v1 to v2 additive backfill | [03--lifecycle-routing/04-schema-migration.md](./03--lifecycle-routing/04-schema-migration.md) |
| Atomic lifecycle rollback | [03--lifecycle-routing/05-rollback.md](./03--lifecycle-routing/05-rollback.md) |

---

## 5. SCORER FUSION

| Feature | File |
| --- | --- |
| Five-lane analytical fusion | [04--scorer-fusion/01-five-lane-fusion.md](./04--scorer-fusion/01-five-lane-fusion.md) |
| Skill-nodes / skill-edges projection | [04--scorer-fusion/02-projection.md](./04--scorer-fusion/02-projection.md) |
| Top-2 ambiguity window | [04--scorer-fusion/03-ambiguity.md](./04--scorer-fusion/03-ambiguity.md) |
| Lane contribution attribution | [04--scorer-fusion/04-attribution.md](./04--scorer-fusion/04-attribution.md) |
| Lane-by-lane ablation protocol | [04--scorer-fusion/05-ablation.md](./04--scorer-fusion/05-ablation.md) |
| Lane weights configuration | [04--scorer-fusion/06-weights-config.md](./04--scorer-fusion/06-weights-config.md) |

---

## 6. PROMOTION GATES

| Feature | File |
| --- | --- |
| Shadow cycle (no-mutation corpus replay) | [05--promotion-gates/01-shadow-cycle.md](./05--promotion-gates/01-shadow-cycle.md) |
| Weight delta cap (0.05 max per promotion) | [05--promotion-gates/02-weight-delta-cap.md](./05--promotion-gates/02-weight-delta-cap.md) |
| Seven-gate promotion bundle | [05--promotion-gates/03-gate-bundle.md](./05--promotion-gates/03-gate-bundle.md) |
| Two consecutive passing cycles | [05--promotion-gates/04-two-cycle.md](./05--promotion-gates/04-two-cycle.md) |
| Semantic shadow weight lock | [05--promotion-gates/05-semantic-lock.md](./05--promotion-gates/05-semantic-lock.md) |
| Atomic promotion rollback | [05--promotion-gates/06-rollback.md](./05--promotion-gates/06-rollback.md) |

---

## 7. MCP SURFACE

| Feature | File |
| --- | --- |
| `advisor_recommend` MCP tool | [06--mcp-surface/01-advisor-recommend.md](./06--mcp-surface/01-advisor-recommend.md) |
| `advisor_status` MCP tool | [06--mcp-surface/02-advisor-status.md](./06--mcp-surface/02-advisor-status.md) |
| `advisor_validate` MCP tool | [06--mcp-surface/03-advisor-validate.md](./06--mcp-surface/03-advisor-validate.md) |
| Stable `compat/index.ts` entrypoint | [06--mcp-surface/04-compat-entrypoint.md](./06--mcp-surface/04-compat-entrypoint.md) |

---

## 8. HOOKS AND PLUGIN

| Feature | File |
| --- | --- |
| Claude Code `user-prompt-submit` hook | [07--hooks-and-plugin/01-claude-hook.md](./07--hooks-and-plugin/01-claude-hook.md) |
| Copilot CLI `user-prompt-submit` hook | [07--hooks-and-plugin/02-copilot-hook.md](./07--hooks-and-plugin/02-copilot-hook.md) |
| Gemini CLI `user-prompt-submit` hook | [07--hooks-and-plugin/03-gemini-hook.md](./07--hooks-and-plugin/03-gemini-hook.md) |
| Codex CLI hook with prompt-wrapper fallback | [07--hooks-and-plugin/04-codex-hook.md](./07--hooks-and-plugin/04-codex-hook.md) |
| OpenCode plugin bridge | [07--hooks-and-plugin/05-opencode-plugin-bridge.md](./07--hooks-and-plugin/05-opencode-plugin-bridge.md) |

---

## 9. PYTHON COMPAT

| Feature | File |
| --- | --- |
| Python CLI shim (`skill_advisor.py`) | [08--python-compat/01-cli-shim.md](./08--python-compat/01-cli-shim.md) |
| Python regression suite (52/52) | [08--python-compat/02-regression-suite.md](./08--python-compat/02-regression-suite.md) |
| Python bench runner (`skill_advisor_bench.py`) | [08--python-compat/03-bench-runner.md](./08--python-compat/03-bench-runner.md) |
