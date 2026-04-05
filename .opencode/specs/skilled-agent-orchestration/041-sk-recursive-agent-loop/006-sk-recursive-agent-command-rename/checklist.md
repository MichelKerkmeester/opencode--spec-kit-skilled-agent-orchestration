---
title: "Verification Checklist: Recursive Agent Command Rename [template:level_2/checklist.md]"
description: "Verification Date: 2026-04-03"
trigger_phrases:
  - "041 phase 006 checklist"
  - "recursive agent command rename checklist"
importance_tier: "important"
contextType: "general"
---
# Verification Checklist: Recursive Agent Command Rename

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Phase `006` scope is documented and bounded (verified)
- [x] CHK-002 [P0] The command rename is isolated from benchmark or promotion behavior changes (verified)
- [x] CHK-003 [P1] Active command-facing surfaces were read before edits (verified)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The canonical command markdown file is `.opencode/command/spec_kit/agent-improver.md` (verified)
- [x] CHK-011 [P0] The renamed command validates as a command document (verified)
- [x] CHK-012 [P1] Runtime wrappers use the agent-improver filename family (verified)
- [x] CHK-013 [P1] Runtime agent tables and skill docs point at the renamed command path (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] YAML workflow assets use the agent-improver filename family (verified)
- [x] CHK-021 [P0] Renamed wrapper TOMLs parse cleanly (verified)
- [x] CHK-022 [P0] `descriptions.json` parses cleanly after phase `006` registration (verified)
- [x] CHK-023 [P0] Phase `006` strict validation passes (verified)
- [x] CHK-024 [P0] Root `041` strict validation passes after the rename (verified)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets or credentials were introduced (verified)
- [x] CHK-031 [P1] The phase changes naming and references only; it does not widen agent-improver mutation scope (verified)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Root packet `041` lists phase `006` clearly (verified)
- [x] CHK-041 [P1] Root implementation summary reports `6 of 6 complete` (verified)
- [x] CHK-042 [P1] Phase `005` narrative is no longer misleading after the command rename (verified)
- [x] CHK-043 [P1] Future work is explicitly directed to `007-*` and later child phases (verified)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P0] The new phase folder exists under the parent packet (verified)
- [x] CHK-051 [P1] Renamed command files, wrappers, and packet references are synchronized (verified)
- [x] CHK-052 [P1] Parent packet docs and registry metadata are synchronized to phase `006` (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-04-03
<!-- /ANCHOR:summary -->

---
