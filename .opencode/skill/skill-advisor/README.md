---
title: "Skill Advisor"
description: "Native-first skill routing package with MCP tools, runtime hooks, a Python compatibility shim, plugin bridge, validation bundle, and operator playbook."
trigger_phrases:
  - "skill advisor"
  - "gate 2 routing"
  - "advisor_recommend"
  - "skill advisor hook"
  - "skill advisor setup"
---

# Skill Advisor

> Native-first Gate 2 routing for the Spec Kit skill library, with Python kept as the compatibility path.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. QUICK START](#2--quick-start)
- [3. CURRENT ARCHITECTURE](#3--current-architecture)
- [4. RUNTIME INTEGRATIONS](#4--runtime-integrations)
- [5. VALIDATION BASELINE](#5--validation-baseline)
- [6. PACKAGE STRUCTURE](#6--package-structure)
- [7. ROLLBACK AND TROUBLESHOOTING](#7--rollback-and-troubleshooting)
- [8. RELATED DOCUMENTS](#8--related-documents)

---

## 1. OVERVIEW

The Skill Advisor now routes through the native TypeScript package at `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`. That package owns scoring, daemon freshness, lifecycle metadata, validation, MCP handlers, schemas, and the stable compatibility entrypoint used by plugin consumers.

The older Python script still exists at `.opencode/skill/skill-advisor/scripts/skill_advisor.py`, but its role changed: it probes the native advisor first, translates native output back to the legacy JSON-array shape when possible, and falls back to the local Python scorer only when native routing is unavailable or explicitly bypassed.

Current shipped baseline as of remediation SHA `97a318d83`:

| Area | Shipped Reality |
| --- | --- |
| Native MCP tools | `advisor_recommend`, `advisor_status`, `advisor_validate` |
| Fusion lanes | explicit_author 0.45, lexical 0.30, graph_causal 0.15, derived_generated 0.10, semantic_shadow 0.00 |
| Accuracy | 80.5% full corpus, 77.5% holdout, UNKNOWN <= 10 |
| Regression parity | 0 regressions on Python-correct prompts under ADR-007 |
| Python compatibility | 52/52 Python regression suite passed |
| Package tests | 23 advisor test files / 167 tests |
| Watcher limits | Chokidar narrow scope, <= 1% idle CPU, < 20 MB RSS |
| Freshness states | `live`, `stale`, `absent`, `unavailable` fail open |

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
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "help me commit my changes" --threshold 0.8
printf '%s' "save this conversation context to memory" | python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --stdin
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local "save this context"
```

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
├── bench/       # corpus, holdout, latency, safety, scorer, watcher benches
├── compat/      # public stable entrypoint for plugin and shim consumers
├── handlers/    # advisor_recommend, advisor_status, advisor_validate
├── lib/         # scorer, daemon, freshness, derived metadata, lifecycle, promotion, render, cache
├── schemas/     # Zod input and output contracts
├── tests/       # handler, parity, compat, promotion, scorer, legacy compatibility tests
└── tools/       # MCP tool descriptors
```

Scoring uses 5-lane fusion. The semantic lane is shadow-only and locked at weight `0.00`; it can be measured but cannot affect live routing. Promotion to live weight requires the shadow-cycle harness, the seven-gate bundle, two consecutive clean cycles, and the semantic lock to be explicitly lifted.

Prompt safety is enforced at every public boundary. `sanitizeSkillLabel` is applied before SQLite writes, `graph-metadata.json.derived` writes, response envelopes, lifecycle diagnostics, and plugin bridge output. `includeAttribution` returns lane contribution numbers only; it does not return prompt-derived evidence snippets.

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

## 5. VALIDATION BASELINE

Use the native validation tool for release checks:

```text
advisor_validate({"skillSlug":null})
```

The current Phase 027 baseline is:

- Full corpus top-1 accuracy: 80.5%.
- Holdout top-1 accuracy: 77.5%.
- UNKNOWN count: <= 10.
- Python-correct parity regressions: 0.
- Safety slices include adversarial stuffing.
- Latency slices include cache-hit and uncached p95 measurements.

Python compatibility regression:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Native package checks:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests --reporter=default
```

---

## 6. PACKAGE STRUCTURE

This folder now holds operator-facing docs and compatibility scripts:

```text
.opencode/skill/skill-advisor/
├── README.md
├── SET-UP_GUIDE.md
├── graph-metadata.json
├── feature_catalog/
├── manual_testing_playbook/
└── scripts/
    ├── skill_advisor.py
    ├── skill_advisor_runtime.py
    ├── skill_advisor_regression.py
    ├── skill_advisor_bench.py
    ├── skill_graph_compiler.py
    ├── fixtures/
    └── out/
```

`scripts/skill_graph_compiler.py` still validates per-skill `graph-metadata.json` and builds `scripts/skill-graph.json` for export and fallback workflows. The live native runtime reads the MCP server's SQLite skill graph and freshness state first.

---

## 7. ROLLBACK AND TROUBLESHOOTING

Use rollback controls only long enough to diagnose or recover:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local "your prompt"
```

Unset the controls after recovery:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

Operator states:

| State | Meaning | First Check |
| --- | --- | --- |
| `degraded` | Native path is stale or generation health is impaired | `advisor_status({"workspaceRoot":"..."})` |
| `quarantined` | Watcher isolated malformed skill metadata | daemon logs and quarantine count |
| `unavailable` | Native graph state cannot be read | rebuild from source or restart MCP server |

Follow the H5 scenarios in the manual playbook for detailed recovery steps.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
| --- | --- |
| [Native bootstrap guide](../system-spec-kit/mcp_server/skill-advisor/INSTALL_GUIDE.md) | Canonical native advisor install, verification, and rollback steps |
| [Setup guide](./SET-UP_GUIDE.md) | Project setup notes and rollback controls |
| [Manual testing playbook](./manual_testing_playbook/manual_testing_playbook.md) | 17 current manual scenarios for native tools, hooks, compat, and H5 states |
| [Hook reference](../system-spec-kit/references/hooks/skill-advisor-hook.md) | Runtime hook contract for Claude, Copilot, Gemini, Codex, and OpenCode |
| [Native package README](../system-spec-kit/mcp_server/skill-advisor/README.md) | Package-local architecture and public API entrypoints |
