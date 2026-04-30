---
title: "PC-005 Python Bench Runner"
description: "Manual validation that scripts/skill_advisor_bench.py runs the performance bench and emits latency measurements within documented limits."
trigger_phrases:
  - "pc-005"
  - "python bench"
  - "skill_advisor_bench.py"
  - "latency bench runner"
---

# PC-005 Python Bench Runner

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate that `scripts/skill_advisor_bench.py` runs the performance bench, measures latency for shim-driven calls, and emits results within the documented envelope (cache-hit p95 <= 50 ms, uncached p95 <= 60 ms at the native level).

---

## 2. SETUP

- Repo root; Python 3 available.
- MCP server built.
- System load low enough for stable latency measurement (no heavy concurrent jobs).

---

## 3. STEPS

1. Run the bench:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_bench.py
```

2. Capture stdout and any emitted summary file (check `bench/` directory).
3. Record p50 and p95 latencies for cache-hit and uncached paths.
4. Confirm no runtime warnings about native unavailability when native is expected to be up.

---

## 4. EXPECTED

- Bench completes without errors.
- Cache-hit p95 <= 50 ms for native path.
- Uncached p95 <= 60 ms for native path.
- Documented measured values (`0.031% idle CPU`, `5.516 MB RSS`, `6.989 ms` cache-hit p95, `11.45 ms` uncached p95) remain reproducible within reasonable system variance.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| p95 exceeds budget | Summary shows latency over threshold | Investigate regression; block release if repeatable. |
| Bench hangs | No output after expected runtime | Check daemon health per AU-003 and OP-003. |
| Cache-hit missing | All runs show uncached latency | Verify prompt cache wiring in `lib/prompt-cache.ts`. |

---

## 6. RELATED

- Scenario [PC-004](./004-regression-suite.md) — regression suite.
- Scenario [NC-003](../01--native-mcp-tools/003-native-validate-slices.md) — native validate latency slice.
- Feature [`08--python-compat/03-bench-runner.md`](../../feature_catalog/08--python-compat/03-bench-runner.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor_bench.py`.
