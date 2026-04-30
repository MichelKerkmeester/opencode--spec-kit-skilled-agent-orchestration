---
title: "Atomic Lifecycle Rollback"
description: "Atomic rollback of lifecycle metadata mutations (supersession, archive status, schema version) that leaves no partial state observable."
trigger_phrases:
  - "lifecycle rollback"
  - "atomic rollback lifecycle"
  - "supersession rollback"
  - "lifecycle revert"
---

# Atomic Lifecycle Rollback

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Keep lifecycle mutations reversible so operators can experiment with supersession, archival, and schema changes without fear of leaving the routing surface in a half-applied state.

<!-- /ANCHOR:overview -->

<!-- ANCHOR:current-reality -->
## 2. CURRENT REALITY

`lib/lifecycle/rollback.ts` reverts lifecycle metadata changes atomically. It coordinates with `lib/lifecycle/supersession.ts` and `lib/lifecycle/archive-handling.ts` so that redirect metadata, derived entries, and archive classification all snap back together. Readers never observe a partial rollback; either the rollback commits fully or the prior state remains in effect.

<!-- /ANCHOR:current-reality -->

<!-- ANCHOR:source-files -->
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/rollback.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/supersession.ts` | Library | Source reference |
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/lib/lifecycle/archive-handling.ts` | Library | Source reference |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/tests/lifecycle-derived-metadata.vitest.ts` | Automated test | rollback invariants |
| `Playbook scenario [LC-005](../../manual_testing_playbook/07--lifecycle-routing/005-rollback-lifecycle.md).` | Manual playbook | Source reference |
<!-- /ANCHOR:source-files -->

<!-- ANCHOR:source-metadata -->
## 4. SOURCE METADATA

- Group: Lifecycle routing
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--lifecycle-routing/05-rollback.md`

Related references:

- [04-schema-migration.md](./04-schema-migration.md).
- [02-supersession.md](./02-supersession.md).
<!-- /ANCHOR:source-metadata -->
