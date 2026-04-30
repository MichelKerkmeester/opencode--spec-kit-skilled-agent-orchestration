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

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Let the advisor forward queries from a superseded skill to its successor without silently losing traceability or creating routing loops.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/lifecycle/supersession.ts` reads supersession fields from each skill's `graph-metadata.json`, demotes the superseded skill, and exposes redirect metadata on responses: `lifecycle.redirect_to` on matches against the superseded slug, and `lifecycle.redirect_from` on the successor's own responses. The redirect is asymmetric — the successor does not redirect back. `lib/compat/redirect-metadata.ts` adapts the lifecycle data into the stable envelope consumed by callers.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/supersession.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/compat/redirect-metadata.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/compat/redirect-metadata.vitest.ts` | Automated test | Validation reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | Validation reference |
| `Playbook scenarios [LC-002](../../manual_testing_playbook/07--lifecycle-routing/002-supersession.md) and [NC-005](../../manual_testing_playbook/01--native-mcp-tools/005-lifecycle-redirect-metadata.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--lifecycle-routing/02-supersession.md`

Related references:

- [01-age-haircut.md](./01-age-haircut.md).
- [05-rollback.md](./05-rollback.md).
- [`06--mcp-surface/01-advisor-recommend.md`](../06--mcp-surface/01-advisor-recommend.md).
<!-- /ANCHOR:source-metadata -->
