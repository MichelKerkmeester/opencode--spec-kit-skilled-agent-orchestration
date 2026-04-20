---
title: "CP-002 Force Local And Force Native Toggles"
description: "Manual validation for Python shim native/local routing controls."
---

# CP-002 Force Local And Force Native Toggles

## 1. OVERVIEW

Validate `--force-local` and `--force-native` behavior in the compatibility shim.

---

## 2. SETUP

- Repo root is the working directory.
- Python 3 is available.
- MCP server build is current.

---

## 3. STEPS

1. Force local:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local "help me commit my changes"
```

2. Force native:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-native "help me commit my changes"
```

3. Invalid combination:

```bash
python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --force-local --force-native "help me commit my changes"
```

---

## 4. EXPECTED

- `--force-local` returns legacy Python scorer output and does not require native availability.
- `--force-native` returns `source: "native"` or exits nonzero with a prompt-safe native-unavailable error.
- Combined flags exit with code `2` and a JSON error.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| `--force-local` delegates native | Output has `source: "native"` | Check `FORCE_LOCAL_ENV` and CLI flag handling. |
| `--force-native` silently falls back | Output has Python-only reason with exit `0` | Block release. |
| Combined flags accepted | Exit code is `0` | Block release; parser guard regressed. |

---

## 6. SOURCE FILES

- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
