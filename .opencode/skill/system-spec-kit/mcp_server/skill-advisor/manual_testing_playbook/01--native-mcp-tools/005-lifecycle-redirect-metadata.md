---
title: "NC-005 Lifecycle Redirect Metadata"
description: "Manual validation that superseded, archived, future, and rolled-back lifecycle metadata surfaces through advisor_recommend."
trigger_phrases:
  - "nc-005"
  - "lifecycle redirect metadata"
  - "lifecycle redirect"
  - "lifecycle"
---

# NC-005 Lifecycle Redirect Metadata

## TABLE OF CONTENTS

- [1. SCENARIO](#1--scenario)
- [2. SETUP](#2--setup)
- [3. STEPS](#3--steps)
- [4. EXPECTED](#4--expected)
- [5. FAILURE MODES](#5--failure-modes)
- [6. RELATED](#6--related)

---

## 1. SCENARIO

Validate lifecycle redirect metadata for non-active skill states.

---

## 2. SETUP

- Repo root is the working directory.
- Native lifecycle tests and fixtures are present.
- Do not edit live skill folders for this scenario.

---

## 3. STEPS

1. Run lifecycle tests:

```bash
npm --prefix .opencode/skill/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/lifecycle-derived-metadata.vitest.ts skill-advisor/tests/compat/plugin-bridge.vitest.ts --reporter=default
```

2. If a runtime fixture is available, call:

```text
advisor_recommend({"prompt":"route a superseded lifecycle fixture","options":{"topK":3}})
```

3. Inspect recommendation metadata.

---

## 4. EXPECTED

- Superseded entries include `redirectFrom` or `redirectTo` as applicable.
- Archived and future entries include `status: "archived"` or `status: "future"`.
- Rolled-back entries are sanitized and do not expose stale private paths.
- OpenCode plugin bridge preserves lifecycle metadata in prompt-safe brief metadata.

---

## 5. FAILURE MODES

| Symptom | Detection | Action |
| --- | --- | --- |
| Redirect fields absent | Test failure or missing fields in MCP output | Inspect lifecycle projection and renderer. |
| Invalid lifecycle status appears | Status outside `active`, `deprecated`, `archived`, `future` | Inspect schema validation. |
| Prompt-injection text appears in labels | Unsafe label survives sanitizer | Block release; verify `sanitizeSkillLabel` at write boundaries. |

---

## 6. RELATED

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/lifecycle/`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`
