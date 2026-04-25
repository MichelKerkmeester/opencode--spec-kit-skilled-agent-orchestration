---
title: "Asymmetric Supersession Routing"
description: "Supersession metadata that routes traffic forward with redirect_from / redirect_to without letting the superseded skill outrank its successor."
trigger_phrases:
  - "supersession routing"
  - "redirect_from"
  - "redirect_to"
  - "asymmetric supersession"
---

# Asymmetric Supersession Routing

## TABLE OF CONTENTS

- [1. PURPOSE](#1--purpose)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. TEST COVERAGE](#4--test-coverage)
- [5. RELATED](#5--related)

---

## 1. PURPOSE

Let the advisor forward queries from a superseded skill to its successor without silently losing traceability or creating routing loops.

---

## 2. CURRENT REALITY

`lib/lifecycle/supersession.ts` reads supersession fields from each skill's `graph-metadata.json`, demotes the superseded skill, and exposes redirect metadata on responses: `lifecycle.redirect_to` on matches against the superseded slug, and `lifecycle.redirect_from` on the successor's own responses. The redirect is asymmetric — the successor does not redirect back. `lib/compat/redirect-metadata.ts` adapts the lifecycle data into the stable envelope consumed by callers.

---

## 3. SOURCE FILES

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/supersession.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/redirect-metadata.ts`

---

## 4. TEST COVERAGE

- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/redirect-metadata.vitest.ts`.
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts`.
- Playbook scenarios [LC-002](../../manual_testing_playbook/07--lifecycle-routing/002-supersession.md) and [NC-005](../../manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md).

---

## 5. RELATED

- [01-age-haircut.md](./01-age-haircut.md).
- [05-rollback.md](./05-rollback.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
