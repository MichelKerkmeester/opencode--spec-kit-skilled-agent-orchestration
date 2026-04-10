---
title: "Verification Checklist: MCP Doctor Diagnostic Command"
description: "Quality verification checklist for the mcp-doctor.sh diagnostic script"
trigger_phrases:
  - "checklist"
  - "mcp doctor verification"
importance_tier: "normal"
contextType: "general"
---
# Verification Checklist: MCP Doctor Diagnostic Command

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

- [x] CHK-001 [P0] Script uses `set -euo pipefail` and proper `#!/usr/bin/env bash` shebang [EVIDENCE: .opencode/scripts/mcp-doctor.sh:1,24]
- [x] CHK-002 [P0] Requirements documented in spec.md [EVIDENCE: specs/027-mcp-doctor-diagnostic/spec.md]
- [x] CHK-003 [P1] Dependencies identified (node, python3, npm, npx) [EVIDENCE: spec.md:6 RISKS section]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All 4 MCP servers diagnosed: Spec Kit Memory, CocoIndex Code, Code Mode, Sequential Thinking [EVIDENCE: mcp-doctor.sh:146-479 — 4 diagnose_* functions]
- [x] CHK-011 [P0] Runtime config detection works for all present config files [EVIDENCE: output shows 5 config files scanned, 4/5 have all servers wired]
- [x] CHK-012 [P0] Human-readable output with color-coded PASS/WARN/FAIL [EVIDENCE: tested — 34 PASS, 5 WARN, 0 FAIL displayed]
- [x] CHK-013 [P1] `--json` flag produces valid JSON output [EVIDENCE: python3 -m json.tool validates successfully]
- [x] CHK-014 [P1] `--fix` flag runs safe auto-repair actions [EVIDENCE: mcp-doctor.sh:248-266,337-357,413-424,472-478 — repair code implemented]
- [x] CHK-015 [P1] `--server <name>` flag works for each server [EVIDENCE: tested --server spec_kit_memory — only that server shown]
- [x] CHK-016 [P1] Exit codes: 0=pass, 1=warnings, 2=failures [EVIDENCE: EXIT_CODE=1 returned correctly for warnings-only state]
- [x] CHK-017 [P1] Error handling — gracefully handles missing prerequisites [EVIDENCE: HAS_NODE/HAS_PYTHON guards skip checks gracefully]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Script runs on current system without errors [EVIDENCE: exit code 1 (warnings only, no errors)]
- [x] CHK-021 [P0] All acceptance criteria from spec.md met [EVIDENCE: REQ-001 through REQ-010 verified]
- [x] CHK-022 [P1] Script handles missing Node.js gracefully [EVIDENCE: HAS_NODE guard + record_skip]
- [x] CHK-023 [P1] Script handles missing Python gracefully [EVIDENCE: HAS_PYTHON guard + record_warn]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No API keys or secrets printed in output [EVIDENCE: verified — no env var values printed]
- [x] CHK-031 [P0] Read-only by default, --fix requires explicit flag [EVIDENCE: FIX_MODE=false default, only runs repairs when --fix passed]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Script has usage help (`--help` flag) [EVIDENCE: --help tested, displays full usage]
- [x] CHK-041 [P1] Spec/plan/tasks synchronized [EVIDENCE: all artifacts cross-referenced]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Script placed at `.opencode/scripts/mcp-doctor.sh` [EVIDENCE: file exists and is executable]
- [x] CHK-051 [P2] Helper library at `.opencode/scripts/mcp-doctor-lib.sh` [EVIDENCE: file exists, sourced by main script]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-10
**Status**: ALL PASS
<!-- /ANCHOR:summary -->
