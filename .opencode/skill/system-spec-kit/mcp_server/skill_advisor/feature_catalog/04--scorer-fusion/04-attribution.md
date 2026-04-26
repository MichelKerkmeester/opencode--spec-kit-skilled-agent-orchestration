---
title: "Lane Contribution Attribution"
description: "Attribution metadata that returns per-lane rawScore, weight, weightedScore, and shadowOnly fields without leaking prompt text."
trigger_phrases:
  - "lane attribution"
  - "includeAttribution"
  - "laneBreakdown"
  - "attribution metadata"
---

# Lane Contribution Attribution

## TABLE OF CONTENTS

- [1. PURPOSE](#1-purpose)
- [2. CURRENT REALITY](#2-current-reality)
- [3. SOURCE FILES](#3-source-files)
- [4. TEST COVERAGE](#4-test-coverage)
- [5. RELATED](#5-related)

---

## 1. PURPOSE

Make the fusion score auditable by exposing each lane's contribution per recommendation, without leaking prompt text or evidence snippets.

---

## 2. CURRENT REALITY

`lib/scorer/attribution.ts` builds the `laneBreakdown` array when `includeAttribution: true` is passed to `advisor_recommend`. Each entry carries exactly `lane`, `rawScore`, `weight`, `weightedScore`, and `shadowOnly`. The semantic lane always reports `shadowOnly: true`. Prompt substrings are never copied into attribution.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/scorer/attribution.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-recommend.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/handlers/advisor-recommend.vitest.ts` — attribution shape.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/legacy/advisor-privacy.vitest.ts` — no prompt leakage.
- Playbook scenario [SC-004](../../manual_testing_playbook/08--scorer-fusion/004-lane-attribution.md).

---

## 5. RELATED

- [01-five-lane-fusion.md](./01-five-lane-fusion.md).
- [05-ablation.md](./05-ablation.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
