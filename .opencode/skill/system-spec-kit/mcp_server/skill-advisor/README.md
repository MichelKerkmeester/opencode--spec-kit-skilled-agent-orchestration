---
title: "Skill Advisor Native Package"
description: "Package-local architecture and public API reference for the native TypeScript Skill Advisor MCP surface."
---

# Skill Advisor Native Package

This directory is the Phase 027 native Skill Advisor package. It is part of the existing system-spec-kit MCP server and should not be registered as a separate MCP server.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. PACKAGE LAYOUT](#2--package-layout)
- [3. MCP TOOL SURFACE](#3--mcp-tool-surface)
- [4. PUBLIC API ENTRYPOINTS](#4--public-api-entrypoints)
- [5. SCORING AND TRUST MODEL](#5--scoring-and-trust-model)
- [6. VALIDATION](#6--validation)
- [7. RELATED DOCUMENTS](#7--related-documents)

---

## 1. OVERVIEW

The native package replaces script-first advisor routing with TypeScript handlers, schemas, scoring, daemon freshness, lifecycle metadata, and validation slices. Python remains a compatibility caller through `.opencode/skill/skill-advisor/scripts/skill_advisor.py`.

Shipped baseline at remediation SHA `97a318d83`:

| Area | Baseline |
| --- | --- |
| Tools | `advisor_recommend`, `advisor_status`, `advisor_validate` |
| Fusion lanes | explicit_author, lexical, graph_causal, derived_generated, semantic_shadow |
| Live semantic weight | `0.00` shadow-only |
| Accuracy | 80.5% full corpus, 77.5% holdout |
| UNKNOWN target | <= 10 |
| Python parity | 0 regressions on Python-correct prompts |
| Watcher | Chokidar narrow scope, SQLite single-writer lease, fail-open trust states |

---

## 2. PACKAGE LAYOUT

```text
skill-advisor/
├── INSTALL_GUIDE.md
├── README.md
├── bench/
│   ├── corpus-bench.ts
│   ├── holdout-bench.ts
│   ├── latency-bench.ts
│   ├── safety-bench.ts
│   ├── scorer-bench.ts
│   └── watcher-benchmark.ts
├── compat/
│   └── index.ts
├── handlers/
│   ├── advisor-recommend.ts
│   ├── advisor-status.ts
│   ├── advisor-validate.ts
│   └── index.ts
├── lib/
│   ├── compat/
│   ├── corpus/
│   ├── daemon/
│   ├── derived/
│   ├── freshness/
│   ├── lifecycle/
│   ├── promotion/
│   ├── scorer/
│   ├── render.ts
│   ├── skill-advisor-brief.ts
│   └── prompt-cache.ts
├── schemas/
│   ├── advisor-tool-schemas.ts
│   ├── daemon-status.ts
│   ├── generation-metadata.ts
│   ├── promotion-cycle.ts
│   └── skill-derived-v2.ts
├── tests/
└── tools/
```

Directory ownership:

| Directory | Purpose |
| --- | --- |
| `bench/` | Corpus, holdout, latency, safety, scorer, and watcher measurements. |
| `compat/` | Stable package entrypoint for plugin bridge and Python shim consumers. |
| `handlers/` | MCP handler implementations. |
| `lib/scorer/` | 5-lane fusion, thresholds, ambiguity, projection, and weights. |
| `lib/daemon/` | Watcher, lifecycle, lease, and quarantine state. |
| `lib/freshness/` | Generation and trust-state helpers. |
| `lib/derived/` | Generated trigger and metadata handling. |
| `lib/lifecycle/` | Superseded, archived, future, and rollback metadata. |
| `lib/promotion/` | Shadow-cycle and seven-gate promotion checks. |
| `schemas/` | Zod contracts for tool IO and daemon metadata. |
| `tools/` | MCP tool descriptors registered by the parent server. |

---

## 3. MCP TOOL SURFACE

### advisor_recommend

Routes a prompt through the native scorer.

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAttribution":true,"includeAbstainReasons":true}})
```

Important output fields:

- `recommendations[]`
- `ambiguous`
- `freshness`
- `trustState`
- `cache`
- `warnings`
- `abstainReasons`

`includeAttribution` returns lane contribution metadata only. It must not return prompt-derived evidence snippets.

Absent freshness fails open:

```json
{
  "recommendations": [],
  "freshness": "absent"
}
```

### advisor_status

Reports prompt-safe native advisor health.

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
```

Important output fields:

- `freshness`
- `generation`
- `trustState`
- `lastGenerationBump`
- `lastScanAt`
- `skillCount`
- `laneWeights`
- optional `daemonPid`
- optional `errors`

### advisor_validate

Runs the measured validation bundle.

```text
advisor_validate({"skillSlug":null})
```

Slices:

- corpus: full top-1, UNKNOWN count, gold-none false-fire delta
- holdout: holdout top-1
- parity: Python-correct regression guard, ambiguity stability, derived-lane attribution
- safety: adversarial stuffing
- latency: P0 pass rate, failed count, command-bridge false positives, cache-hit and uncached p95

---

## 4. PUBLIC API ENTRYPOINTS

Use `compat/index.ts` for consumers outside this package:

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

## 5. SCORING AND TRUST MODEL

Lane weights:

| Lane | Weight | Notes |
| --- | --- | --- |
| `explicit_author` | 0.45 | Author-declared routing signals. |
| `lexical` | 0.30 | Prompt and skill text overlap. |
| `graph_causal` | 0.15 | Relationship-aware support. |
| `derived_generated` | 0.10 | Generated derived metadata. |
| `semantic_shadow` | 0.00 | Measured only; cannot affect live ranking. |

Trust states:

| State | Meaning |
| --- | --- |
| `live` | Sources and graph generation are current. |
| `stale` | Sources changed after current generation or fallback data is in use. |
| `absent` | Required graph state is missing. |
| `unavailable` | Status cannot be read. |

Prompt safety:

- Raw prompts are HMAC-keyed for cache lookup and are not returned.
- `sanitizeSkillLabel` guards skill labels, redirect fields, lifecycle status, envelopes, and diagnostics.
- Hook and plugin diagnostics use prompt-free JSONL/metadata.

---

## 6. VALIDATION

Build:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

Typecheck:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
```

Native tests:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests --reporter=default
```

Manual playbook:

```text
.opencode/skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md
```

---

## 7. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [INSTALL_GUIDE.md](./INSTALL_GUIDE.md) | Native bootstrap, compatibility shim, rollback, and operator checks. |
| [Skill Advisor README](../../../skill-advisor/README.md) | Operator-facing overview and runtime integrations. |
| [Skill Advisor setup guide](../../../skill-advisor/SET-UP_GUIDE.md) | Setup and rollback controls. |
| [Manual testing playbook](../../../skill-advisor/manual_testing_playbook/manual_testing_playbook.md) | 17 current manual scenarios. |
| [Hook reference](../../references/hooks/skill-advisor-hook.md) | Per-runtime hook and plugin contract. |
