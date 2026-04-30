---
title: "PC-003 --threshold Confidence Flag"
description: "Manual validation that --threshold adjusts the shim's confidence cutoff for Python-path scoring and affects which skills pass the dual-threshold check."
trigger_phrases:
  - "pc-003"
  - "threshold flag"
  - "confidence cutoff shim"
  - "dual threshold shim"
---

# PC-003 --threshold Confidence Flag

## TABLE OF CONTENTS

- [1. SCENARIO](#1-scenario)
- [2. SETUP](#2-setup)
- [3. STEPS](#3-steps)
- [4. EXPECTED](#4-expected)
- [5. FAILURE MODES](#5-failure-modes)
- [6. RELATED](#6-related)

---

## 1. SCENARIO

Validate that `--threshold <value>` adjusts the confidence cutoff applied by the shim (default 0.8) and that lower thresholds surface additional candidates while higher thresholds filter aggressively.

---

## 2. SETUP

- Repo root; Python 3 available.
- MCP server built.
- A prompt known to produce a middle-tier confidence candidate (for example around 0.7).

---

## 3. STEPS

1. Run at the default threshold:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "review this pull request" --threshold 0.8
```

2. Run at a looser threshold:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "review this pull request" --threshold 0.6
```

3. Run at a strict threshold:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py "review this pull request" --threshold 0.95
```

4. Record the number of entries returned in each case.

---

## 4. EXPECTED

- Default returns the standard candidate set.
- Looser threshold returns more candidates (never fewer than default).
- Strict threshold returns fewer candidates (often zero if no candidate clears 0.95).
- All outputs remain valid JSON arrays with consistent shape.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Threshold ignored | Output identical across thresholds | Inspect shim flag parser. |
| Threshold inverted | Strict returns more than looser | Audit cutoff direction. |
| Invalid JSON at edge thresholds | Shell JSON parser errors | Confirm shim exits cleanly. |

---

## 6. RELATED

- Scenario [PC-002](./002-force-native-force-local.md) — force toggles.
- Scenario [PC-004](./004-regression-suite.md) — regression suite coverage of threshold behavior.
- Feature [`08--python-compat/01-cli-shim.md`](../../feature_catalog/08--python-compat/01-cli-shim.md).
- Source: `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/scripts/skill_advisor.py`.
