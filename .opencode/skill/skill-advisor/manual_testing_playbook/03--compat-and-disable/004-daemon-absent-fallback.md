---
title: "CP-004 Daemon Absent Fallback"
description: "Manual validation for daemon-absent local fallback and native fail-open behavior."
---

# CP-004 Daemon Absent Fallback

## 1. OVERVIEW

Validate two fallback paths: the Python shim routes to local scoring when native daemon probing is unavailable, and native `advisor_recommend` fails open with empty recommendations when freshness is absent.

---

## 2. SETUP

- Use a disposable copy or controlled environment override to simulate absent native generation/artifact state.
- Do not move the live repository database without a restore plan.

---

## 3. STEPS

1. Python local fallback:

```bash
SPECKIT_SKILL_ADVISOR_FORCE_LOCAL=1 python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py "help me commit my changes"
```

2. Native absent check in disposable workspace:

```text
advisor_recommend({"prompt":"help me commit my changes","options":{"topK":1,"includeAbstainReasons":true}})
```

3. Inspect `freshness`, `trustState`, and recommendations.

---

## 4. EXPECTED

- Forced-local shim returns a JSON array from the Python scorer.
- Native absent response returns `recommendations: []`, `freshness: "absent"`, and a prompt-safe abstain reason.
- The absence path does not throw and does not block prompt handling.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Native absent throws | MCP call errors instead of JSON envelope | Inspect absent freshness branch. |
| Shim cannot route locally | Forced-local exits nonzero | Check Python scorer imports and skill metadata. |
| Live DB was moved and not restored | `advisor_status` remains absent in real repo | Restore database or run rebuild before continuing. |

---

## 6. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
