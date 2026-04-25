---
title: "Derived-Lane-Only Age Haircut"
description: "Age-based decay applied strictly to the derived lane so aging evidence does not dominate fresh explicit or lexical signals."
trigger_phrases:
  - "age haircut"
  - "derived age decay"
  - "age weighted derived"
  - "lifecycle age"
---

# Derived-Lane-Only Age Haircut

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Keep routing sensitive to currency without discounting author-declared signals. Older skills should see their auto-generated (derived) evidence softened, but their explicit declarations (`intent_signals`, trigger phrases) remain authoritative.

---

## 2. CURRENT REALITY

`lib/lifecycle/age-haircut.ts` reads each skill's source modification time and applies a documented decay curve to the derived lane only. The `explicit_author`, `lexical`, `graph_causal`, and `semantic_shadow` lanes are untouched. The haircut shows up as a gap between `rawScore` and `weightedScore` in lane attribution for the derived lane.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/age-haircut.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/lanes/derived.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/scorer/native-scorer.vitest.ts` — derived-lane decay application.
- Playbook scenario [LC-001](../../manual_testing_playbook/07--lifecycle-routing/001-age-haircut.md).

---

## 5. RELATED

- [`04--scorer-fusion/01-five-lane-fusion.md`](../04--scorer-fusion/01-five-lane-fusion.md).
- [`04--scorer-fusion/04-attribution.md`](../04--scorer-fusion/04-attribution.md).
- [02-supersession.md](./02-supersession.md).
