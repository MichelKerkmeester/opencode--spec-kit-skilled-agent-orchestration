---
title: "Anti-Stuffing and Cardinality Caps"
description: "Cardinality caps, repetition-density demotions, and adversarial-fixture rejection that prevent routing abuse through derived-lane stuffing."
trigger_phrases:
  - "anti-stuffing"
  - "cardinality cap derived"
  - "repetition density demote"
  - "adversarial rejection"
---

# Anti-Stuffing and Cardinality Caps

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Stop a skill from gaming routing by spamming trigger phrases or crafting adversarial content designed to dominate the derived lane. Caps and density checks keep derived evidence honest.

---

## 2. CURRENT REALITY

`lib/derived/anti-stuffing.ts` enforces:

1. A hard cap on the number of derived entries per skill.
2. Repetition-density demotion when the same token appears with abnormally high frequency.
3. Adversarial-fixture rejection using the fixture allowlist bundled in `scripts/fixtures/`.

Demoted or rejected entries never reach the scorer, so stuffed fixtures cannot outrank honest candidates.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/lib/derived/anti-stuffing.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/scorer/native-scorer.vitest.ts` — derived-lane boundary behavior.
- Playbook scenario [AI-005](../../manual_testing_playbook/06--auto-indexing/005-anti-stuffing.md).

---

## 5. RELATED

- [01-derived-extraction.md](./01-derived-extraction.md).
- [02-sanitizer.md](./02-sanitizer.md).
