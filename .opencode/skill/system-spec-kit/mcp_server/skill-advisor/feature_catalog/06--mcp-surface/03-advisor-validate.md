---
title: "advisor_validate MCP Tool"
description: "Native MCP tool that returns real corpus, holdout, parity, safety, and latency slice measurements for release-gate evaluation."
trigger_phrases:
  - "advisor_validate"
  - "mcp validate tool"
  - "release gate slices"
  - "corpus holdout parity"
---

# advisor_validate MCP Tool

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Drive release-readiness decisions from real measurements. Consolidate corpus, holdout, parity, safety, and latency slices behind one tool call.

---

## 2. CURRENT REALITY

`handlers/advisor-validate.ts` runs the bundled validation slices and returns per-slice results. The current baseline:

| Slice | Target | Measured |
| --- | --- | --- |
| Full corpus top-1 | >= 75% | 80.5% |
| Holdout top-1 | >= 72.5% | 77.5% |
| UNKNOWN | <= 10 | UNKNOWN <= 10 |
| Python-correct parity | 0 regressions | 0 regressions |
| Latency (cache-hit p95) | <= 50 ms | ~6.99 ms |
| Latency (uncached p95) | <= 60 ms | ~11.45 ms |

The tool also exposes ablation slices when requested.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-validate.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/schemas/advisor-tool-schemas.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/handlers/advisor-validate.vitest.ts`.
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/parity/` — Python/TS parity harness.
- Playbook scenario [NC-003](../../manual_testing_playbook/01--native-mcp-tools/003-native-validate-slices.md).

---

## 5. RELATED

- [01-advisor-recommend.md](./01-advisor-recommend.md).
- [`05--promotion-gates/03-gate-bundle.md`](../05--promotion-gates/03-gate-bundle.md).
- [`04--scorer-fusion/05-ablation.md`](../04--scorer-fusion/05-ablation.md).
