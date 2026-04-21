---
title: "Skill Advisor"
description: "Self-contained native-first skill routing package with MCP tools, runtime hooks, Python compatibility scripts, validation bundle, auto-update daemon, 5-lane scorer fusion, and promotion gates."
trigger_phrases:
  - "skill advisor"
  - "gate 2 routing"
  - "advisor_recommend"
  - "skill advisor hook"
  - "skill advisor setup"
---

# Skill Advisor

> Native-first Gate 2 routing for the Spec Kit skill library, with Python kept as the compatibility path inside this package.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. CURRENT ARCHITECTURE](#3--current-architecture)
- [4. RUNTIME INTEGRATIONS](#4--runtime-integrations)
- [5. FEATURE SUMMARY](#5--feature-summary)
- [6. VALIDATION BASELINE](#6--validation-baseline)
- [7. PACKAGE STRUCTURE](#7--package-structure)
- [8. ROLLBACK AND TROUBLESHOOTING](#8--rollback-and-troubleshooting)
- [9. RELATED DOCUMENTS](#9--related-documents)

---

## 1. OVERVIEW

The Skill Advisor routes through the native TypeScript package at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`. This package owns scoring, daemon freshness, lifecycle metadata, validation, MCP handlers, schemas, hook-compatible rendering, operator docs, manual playbooks, and Python compatibility scripts. The design is documented as native-first per ADR-007.

Python remains available for runtimes or scripts that cannot call MCP tools directly. The shim at `scripts/skill_advisor.py` probes the native advisor first, translates native output back to the legacy JSON-array shape when possible, and falls back to the local Python scorer only when native routing is unavailable or explicitly bypassed.

Current shipped baseline as of remediation SHA `97a318d83`:

| Area | Shipped Reality |
| --- | --- |
| Native MCP tools | `advisor_recommend`, `advisor_status`, `advisor_validate` |
| Fusion lanes | explicit_author 0.45, lexical 0.30, graph_causal 0.15, derived_generated 0.10, semantic_shadow 0.00 |
| Accuracy | 80.5% full corpus, 77.5% holdout, UNKNOWN <= 10 |
| Regression parity | 0 regressions on Python-correct prompts under ADR-007 |
| Python compatibility | 52/52 Python regression suite passed |
| Package tests | 23 advisor test files / 167 tests |
| Watcher limits | Chokidar narrow scope, ≤ 1% idle CPU, < 20 MB RSS (measured 0.031% / 5.516 MB) |
| Freshness states | `live`, `stale`, `absent`, `unavailable` fail open |

ADR reference: ADR-007 (native-first + Python compatibility).

---

## 2. QUICK START

### Native MCP Tools

Build the MCP server:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

Call the native advisor tools from the active MCP client:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1,"includeAttribution":true}})
advisor_validate({"skillSlug":null})
```

Expected shape:

- `advisor_status` returns `freshness`, `generation`, `trustState`, `lastScanAt`, `skillCount`, and `laneWeights`.
- `advisor_recommend` returns prompt-safe `recommendations[]`, cache state, lifecycle redirect metadata, and freshness trust.
- `advisor_validate` returns real corpus, holdout, parity, safety, and latency slices.

### Python Compatibility Fallback

Use the shim when a runtime cannot call MCP tools directly or when a script still expects the legacy JSON array:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py "help me commit my changes" --threshold 0.8
printf '%s' "save this conversation context to memory" | python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --stdin
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-local "save this context"
```

### Disable Flag

To temporarily disable the advisor across every surface (native tools, hooks, plugin, shim), set:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
```

All consumers honor this flag and fail open with a documented disabled status.

Controls:

| Control | Meaning |
| --- | --- |
| `--stdin` | Read one prompt from stdin. |
| `--force-native` | Require native `advisor_recommend`; fail if unavailable. |
| `--force-local` | Bypass native delegation and use Python scoring. |
| `--threshold` | Set confidence threshold; default is `0.8`. |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disable prompt-time advisor surfaces and native recommendations. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Force Python fallback for shim or plugin diagnostics. |

---

## 3. CURRENT ARCHITECTURE

The native package is self-contained:

```text
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/
├── README.md
├── SET-UP_GUIDE.md
├── INSTALL_GUIDE.md
├── graph-metadata.json
├── feature_catalog/
├── manual_testing_playbook/
├── scripts/
├── bench/
├── compat/
├── docs/
├── handlers/
├── lib/
├── schemas/
├── tests/
└── tools/
```

### 5-Lane Fusion

Scoring uses 5-lane analytical fusion. The semantic lane is shadow-only and locked at weight `0.00`; it can be measured but cannot affect live routing until the semantic lock is explicitly lifted by a promotion.

| Lane | Weight | Role |
| --- | --- | --- |
| `explicit_author` | 0.45 | Author-declared signals (`intent_signals`, explicit mentions). |
| `lexical` | 0.30 | IDF-weighted token overlap on the active corpus. |
| `graph_causal` | 0.15 | Graph-edge evidence via projected skill_nodes/skill_edges. |
| `derived_generated` | 0.10 | Auto-extracted derived entries under trust-lane control. |
| `semantic_shadow` | 0.00 | Semantic similarity (shadow-only; locked at 0 for live). |

### Promotion Gates

Any lane weight change must clear the 7-gate bundle across two consecutive passing shadow cycles, with a per-lane per-promotion delta cap of 0.05. Post-promotion regression fires atomic rollback. The gates are:

1. Full-corpus top-1 >= 75%.
2. Holdout top-1 >= 72.5%.
3. Gold-none UNKNOWN count must not increase.
4. Safety slice (adversarial + sanitization).
5. Latency slice (cache-hit p95 <= 50 ms, uncached p95 <= 60 ms).
6. Exact parity with Python-correct prompts.
7. Python regression suite passes 52/52.

Prompt safety is enforced at every public boundary. `sanitizeSkillLabel` runs before SQLite writes, `graph-metadata.json.derived` writes, response envelopes, lifecycle diagnostics, and plugin bridge output. `includeAttribution` returns lane contribution numbers only; it does not return prompt-derived evidence snippets.

The Phase 028 code graph lives in its own package at `.opencode/skill/system-spec-kit/mcp_server/code-graph/`. Advisor docs should not point at retired shared `lib/code-graph` or handler paths.

---

## 4. RUNTIME INTEGRATIONS

| Runtime | Current Entry |
| --- | --- |
| Claude Code | `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` |
| Copilot CLI | `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` |
| Gemini CLI | `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` |
| Codex CLI | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts` and `hooks/codex/prompt-wrapper.ts` |
| OpenCode | `.opencode/plugins/spec-kit-skill-advisor.js` and `.opencode/plugins/spec-kit-skill-advisor-bridge.mjs` |

All hook paths fail open. When `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` is set, the adapters skip advisor work and return no context or a prompt-safe disabled status.

The OpenCode plugin bridge imports the stable native compatibility entrypoint:

```text
.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js
```

It should not pin to private handler files in `dist/`.

---

## 5. FEATURE SUMMARY

The [feature catalog](./feature_catalog/feature_catalog.md) lists 42 features across 8 groups:

| Group | Scope |
| --- | --- |
| [01--daemon-and-freshness](./feature_catalog/01--daemon-and-freshness/) | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation. |
| [02--auto-indexing](./feature_catalog/02--auto-indexing/) | Derived extraction, sanitizer, provenance, sync, anti-stuffing, DF/IDF corpus. |
| [03--lifecycle-routing](./feature_catalog/03--lifecycle-routing/) | Age haircut, supersession, archive handling, schema migration, rollback. |
| [04--scorer-fusion](./feature_catalog/04--scorer-fusion/) | 5-lane fusion, projection, ambiguity, attribution, ablation, weights config. |
| [05--promotion-gates](./feature_catalog/05--promotion-gates/) | Shadow cycle, weight delta cap, 7-gate bundle, two-cycle, semantic lock, rollback. |
| [06--mcp-surface](./feature_catalog/06--mcp-surface/) | `advisor_recommend`, `advisor_status`, `advisor_validate`, compat entrypoint. |
| [07--hooks-and-plugin](./feature_catalog/07--hooks-and-plugin/) | Claude, Copilot, Gemini, Codex hooks plus OpenCode plugin bridge. |
| [08--python-compat](./feature_catalog/08--python-compat/) | Python CLI shim, regression suite, bench runner. |

---

## 6. VALIDATION BASELINE

Use the native validation tool for release checks:

```text
advisor_validate({"skillSlug":null})
```

The current Phase 027 baseline:

- Full corpus top-1 accuracy: 80.5%.
- Holdout top-1 accuracy: 77.5%.
- UNKNOWN count: <= 10.
- Python-correct parity regressions: 0.
- Safety slices include adversarial stuffing.
- Latency slices include cache-hit and uncached p95 measurements (~6.99 ms / ~11.45 ms).

Python compatibility regression:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Native package checks:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
(cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/ code-graph/tests/ --reporter=default)
```

Manual validation surface: the [playbook](./manual_testing_playbook/manual_testing_playbook.md) ships 47 deterministic scenarios across 10 groups. Automated counterparts include 23 advisor test files / 167 vitest tests and the 52-case Python regression suite.

---

## 7. PACKAGE STRUCTURE

Directory ownership:

| Directory | Purpose |
| --- | --- |
| `bench/` | Corpus, holdout, latency, safety, scorer, and watcher measurements. |
| `compat/` | Stable package entrypoint for plugin bridge and Python shim consumers. |
| `docs/` | Alignment notes and operational blockers. |
| `feature_catalog/` | Operator-facing feature inventory for daemon freshness, auto-indexing, lifecycle, scorer, promotion, MCP surface, hooks/plugin, and Python compat. |
| `handlers/` | MCP handler implementations (`advisor-recommend.ts`, `advisor-status.ts`, `advisor-validate.ts`). |
| `lib/corpus/` | DF/IDF corpus statistics. |
| `lib/compat/` | Daemon probe and redirect metadata adapters. |
| `lib/daemon/` | Watcher, lease, lifecycle. |
| `lib/derived/` | Deterministic derived extraction, sanitizer, provenance, trust lanes, anti-stuffing, sync. |
| `lib/freshness/` | Generation, trust state, rebuild-from-source, cache invalidation. |
| `lib/lifecycle/` | Age haircut, supersession, archive handling, schema migration, rollback. |
| `lib/promotion/` | Shadow cycle, weight delta cap, gate bundle, two-cycle, semantic lock, rollback. |
| `lib/scorer/` | 5-lane fusion, per-lane scorers under `lanes/`, projection, ambiguity, attribution, ablation, weights config. |
| `manual_testing_playbook/` | Native tools, hooks, compatibility, H5 recovery, auto-update daemon, auto-indexing, lifecycle, scorer, promotion, Python compat scenarios (10 groups / 47 scenarios). |
| `schemas/` | Zod contracts for tool IO and daemon metadata. |
| `scripts/` | Python shim, runtime, regression, bench, graph compiler, fixtures, routing accuracy tools, and shell helpers. |
| `tests/` | Handler, parity, compat, promotion, scorer, legacy compatibility, and Python script tests. |
| `tools/` | MCP tool descriptors registered by the parent server. |

Public API entrypoints for external consumers:

```ts
export { handleAdvisorRecommend } from '../handlers/advisor-recommend.js';
export { readAdvisorStatus } from '../handlers/advisor-status.js';
export { probeAdvisorDaemon } from '../lib/compat/daemon-probe.js';
export { buildSkillAdvisorBrief } from '../lib/skill-advisor-brief.js';
export { renderAdvisorBrief } from '../lib/render.js';
```

Plugin bridge and shim consumers should import the compiled equivalent:

```text
.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js
```

Do not pin plugins to private compiled handler files.

---

## 8. ROLLBACK AND TROUBLESHOOTING

Use rollback controls only long enough to diagnose or recover:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-local "your prompt"
```

Unset the controls after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

Operator states:

| State | Meaning | First Check |
| --- | --- | --- |
| `live` | Daemon writer is active and generation is fresh | `advisor_status({"workspaceRoot":"..."})` |
| `stale` | No live writer but a previous snapshot is readable | `advisor_status` plus daemon logs |
| `absent` | No snapshot exists for the workspace | Bring daemon up; `advisor_status` |
| `unavailable` | Storage unreadable (corruption or permissions) | Rebuild from source; `skill_graph_scan({})` |
| `degraded` | Stale generation or impaired health | OP-001 playbook |
| `quarantined` | Watcher isolated malformed skill metadata | OP-002 playbook |

Follow the OP and AU scenarios in the [manual playbook](./manual_testing_playbook/manual_testing_playbook.md) for detailed recovery steps.

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Native bootstrap, compatibility shim, rollback, and operator checks. |
| [SET-UP_GUIDE.md](./SET-UP_GUIDE.md) | Project setup notes and rollback controls. |
| [Feature catalog](./feature_catalog/feature_catalog.md) | 42-feature operator-facing inventory across 8 groups. |
| [Manual testing playbook](./manual_testing_playbook/manual_testing_playbook.md) | 47 deterministic scenarios across 10 groups. |
| [Hook reference](../../references/hooks/skill-advisor-hook.md) | Runtime hook contract for Claude, Copilot, Gemini, Codex, and OpenCode. |
| ADR-007 | Native-first + Python compatibility ADR; referenced inline. No standalone file under `references/adrs/` exists at the current revision. |
