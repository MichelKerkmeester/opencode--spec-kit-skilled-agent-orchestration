---
title: "Top-2 Ambiguity Window"
description: "Ambiguity detection that returns an ambiguous brief when the top two candidates are within a 0.05 confidence window."
trigger_phrases:
  - "ambiguity window"
  - "top 2 ambiguity"
  - "ambiguous brief"
  - "0.05 confidence window"
---

# Top-2 Ambiguity Window

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Avoid silently picking a single winner when two candidates are tied or near-tied. Expose the ambiguity to callers so routing decisions stay honest under the 5-lane fusion.

---

## 2. CURRENT REALITY

`lib/scorer/ambiguity.ts` measures the gap between the top-1 and top-2 aggregate scores. When the delta is <= 0.05, the response carries an ambiguity signal that the render path surfaces as an ambiguous brief. When the delta exceeds the window, top-1 is returned unambiguously. The 0.05 threshold matches the `weight-delta-cap` for promotion (see `lib/promotion/weight-delta-cap.ts`).

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/scorer/ambiguity.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/render.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts` — ambiguity window behavior.
- Playbook scenarios [SC-003](../../manual_testing_playbook/08--scorer-fusion/003-ambiguity.md) and [NC-004](../../manual_testing_playbook/01--native-mcp-tools/004-ambiguous-brief-rendering.md).

---

## 5. RELATED

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [04-attribution.md](./04-attribution.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
