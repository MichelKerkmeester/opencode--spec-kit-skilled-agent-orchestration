---
title: "Skill Advisor Setup Guide"
description: "Setup, validation, rollback, and operator guidance for the Phase 027 native-first skill advisor."
---

# Skill Advisor Setup Guide

This guide covers the current setup for `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/` after Phase 027. The canonical runtime is the native TypeScript package under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/`; the Python script remains for compatibility and diagnostics.

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CANONICAL INSTALL PATH](#2--canonical-install-path)
- [3. COMPATIBILITY SHIM](#3--compatibility-shim)
- [4. RUNTIME HOOKS AND PLUGIN](#4--runtime-hooks-and-plugin)
- [5. VALIDATION](#5--validation)
- [6. ROLLBACK CONTROLS](#6--rollback-controls)
- [7. OPERATOR STATES](#7--operator-states)
- [8. REFERENCE COMMANDS](#8--reference-commands)

---

## 1. OVERVIEW

Phase 027 moved Skill Advisor routing into a native MCP package with three public tools:

- `advisor_recommend`
- `advisor_status`
- `advisor_validate`

The native package owns scorer fusion, freshness trust, daemon watching, lifecycle redirects, prompt-safe response schemas, promotion gates, and package-local tests. The Python shim probes this native path first and falls back to local Python scoring when native routing is unavailable or explicitly bypassed.

Current baseline:

| Metric | Value |
| --- | --- |
| Full corpus top-1 | 80.5% |
| Holdout top-1 | 77.5% |
| UNKNOWN target | <= 10 |
| Python-correct regressions | 0 |
| Python regression suite | 52/52 passed |
| Native MCP tools | 3 |
| Fusion lanes | 5, with `semantic_shadow` at live weight 0.00 |

---

## 2. CANONICAL INSTALL PATH

Use the native bootstrap guide as the source of truth:

[Native Skill Advisor Install Guide](./INSTALL_GUIDE.md)

Minimum setup:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server install
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
```

Then verify native tool registration:

```text
advisor_status({"workspaceRoot":"/absolute/path/to/repo"})
advisor_recommend({"prompt":"save this conversation context to memory","options":{"topK":1}})
advisor_validate({"skillSlug":null})
```

Expected:

- `advisor_status` includes `skillCount` and `lastScanAt`.
- `advisor_recommend` returns prompt-safe recommendations or a fail-open empty set.
- `advisor_validate` returns measured corpus, holdout, parity, safety, and latency slices.

---

## 3. COMPATIBILITY SHIM

The stable Python entry remains:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py "help me commit my changes"
```

Important modes:

```bash
printf '%s' "save this conversation context to memory" | \
  python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --stdin

python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-native "save this context"
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-local "save this context"
```

Mode meanings:

| Mode | Behavior |
| --- | --- |
| default | Probe native; use native if live/stale; otherwise local Python fallback. |
| `--stdin` | Read one prompt from stdin. |
| `--force-native` | Require native routing and fail prompt-safely when unavailable. |
| `--force-local` | Bypass native routing and run local Python scoring. |

---

## 4. RUNTIME HOOKS AND PLUGIN

Prompt-time routing is available across runtime adapters:

| Runtime | Hook Surface |
| --- | --- |
| Claude Code | `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts` |
| Copilot CLI | `.opencode/skill/system-spec-kit/mcp_server/hooks/copilot/user-prompt-submit.ts` |
| Gemini CLI | `.opencode/skill/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts` |
| Codex CLI | `.opencode/skill/system-spec-kit/mcp_server/hooks/codex/session-start.ts`, `user-prompt-submit.ts`, plus `prompt-wrapper.ts` fallback |
| OpenCode | `.opencode/plugins/spec-kit-skill-advisor.js` plus `.opencode/skill/system-spec-kit/mcp_server/plugin-bridges/spec-kit-skill-advisor-bridge.mjs` |

The OpenCode bridge must use the stable package entrypoint:

```text
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/compat/index.ts
```

After build, plugin consumers load:

```text
.opencode/skill/system-spec-kit/mcp_server/dist/skill-advisor/compat/index.js
```

---

## 5. VALIDATION

Native validation:

```text
advisor_validate({"skillSlug":null})
```

Package checks:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build
(cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/ code-graph/tests/ --reporter=default)
```

Python compatibility:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```

Manual validation:

```text
.opencode/skill/system-spec-kit/mcp_server/skill-advisor/manual_testing_playbook/manual_testing_playbook.md
```

---

## 6. ROLLBACK CONTROLS

Use these controls only while diagnosing or recovering:

| Control | Scope |
| --- | --- |
| `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` | Disables prompt-time advisor surfaces and native recommendations. |
| `SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1` | Forces Python fallback in shim or plugin bridge diagnostics. |
| `--force-local` | CLI-only Python scorer path. |
| `--force-native` | CLI-only native-required path. |

Examples:

```bash
export SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1
export SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-local "help me commit my changes"
```

Restore normal operation:

```bash
unset SPECKIT_SKILL_ADVISOR_HOOK_DISABLED
unset SPECKIT_SKILL_ADVISOR_FORCE_LOCAL
```

---

## 7. OPERATOR STATES

| State | Meaning | First Response |
| --- | --- | --- |
| `live` | Native graph and generation state are current | No action. |
| `stale` | Sources are newer than graph state | Run `skill_graph_scan` or restart daemon scan. |
| `absent` | Required graph state is missing | Rebuild from source; `advisor_recommend` should fail open. |
| `unavailable` | Native status cannot be read | Inspect daemon logs and rebuild source state. |
| `degraded` | Hook or daemon can run only in limited trust | Follow OP-001 in the playbook. |
| `quarantined` | Malformed skill metadata was isolated | Follow OP-002 in the playbook. |

H5 operator scenarios live in the manual playbook under `04--operator-h5/`.

---

## 8. REFERENCE COMMANDS

```bash
# Build native package
npm --prefix .opencode/skill/system-spec-kit/mcp_server run build

# Typecheck native package
npm --prefix .opencode/skill/system-spec-kit/mcp_server run typecheck

# Python shim default
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py "create a pull request on github"

# Python shim stdin
printf '%s' "save this conversation context to memory" | \
  python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --stdin

# Native required
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-native "save this context"

# Python fallback required
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --force-local "save this context"

# Regression compatibility
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py \
  --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
```
