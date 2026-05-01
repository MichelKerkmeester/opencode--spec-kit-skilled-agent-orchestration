---
title: "Verification Checklist: spec-kit UX adoptions from SPAR-Kit research"
description: "Verification checklist for packet 058 covering 5 sub-phases plus 3 reject-rationale records."
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist | v2.2"
trigger_phrases:
  - "058 spec kit ux checklist"
  - "spec kit ux adoptions checklist"
  - "058 verification"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/058-spec-kit-ux-adoptions"
    last_updated_at: "2026-05-01T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Checklist authored with sub-phase items"
    next_safe_action: "Begin Phase 1 implementation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: spec-kit UX adoptions from SPAR-Kit research

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

**Sub-phase tags** (`[SP1]` through `[SP6]`) map to the 5 approved adoptions plus the reject-rationale records. See `tasks.md` for the sub-phase legend.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P0] Research evidence linked from `../057-cmd-spec-kit-ux-upgrade/research/`
- [ ] CHK-004 [P1] Strict-validation baseline run before SP4 (T004)
- [ ] CHK-005 [P1] Persona directory location confirmed before SP5 (T007)
- [ ] CHK-006 [P1] [SP1] Required-vs-Optional copy template approved before applying to 6 commands
- [ ] CHK-007 [P1] [SP2] Specify/Plan/Act/Retain mapping approved before adding headers
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] [SP1] All 6 spec_kit command setup prompts split into Required-to-proceed and Optional-refinements sections
- [ ] CHK-011 [P0] [SP1] Gate-3 answer keys (A/B/C/D/E) preserved verbatim across all 6 commands
- [ ] CHK-012 [P0] [SP1] Matching YAML asset comments updated
- [ ] CHK-013 [P1] [SP1] Optional-question count capped at 4 per command
- [ ] CHK-014 [P0] [SP2] Specify / Plan / Act / Retain headers visible in `command/spec_kit/README.txt`
- [ ] CHK-015 [P0] [SP2] Every existing command preserved (count unchanged)
- [ ] CHK-016 [P1] [SP2] Headers added to `command/README.md` if file exists
- [ ] CHK-017 [P1] [SP2] AGENTS.md command-reference subsection updated without touching gates or memory rules
- [ ] CHK-018 [P0] [SP3] `command/spec_kit/references/command-taxonomy.md` exists with all 4 axes documented
- [ ] CHK-019 [P0] [SP3] Compatibility matrix table present (commands × axes)
- [ ] CHK-020 [P1] [SP3] Cross-links from command READMEs and SKILL.md resolve
- [ ] CHK-021 [P0] [SP4] `system-spec-kit/templates/INVENTORY.md` exists with classification table
- [ ] CHK-022 [P0] [SP4] All ~99 template files have exactly one role label
- [ ] CHK-023 [P0] [SP4] `system-spec-kit/templates/source-manifest.yaml` exists with source-layer entries
- [ ] CHK-024 [P0] [SP4] No source files moved or deleted
- [ ] CHK-025 [P1] [SP4] Classifications cross-checked against `validate.sh` and `is_phase_parent()` consumers
- [ ] CHK-026 [P1] [SP4] Ambiguous files marked `unknown` and surfaced
- [ ] CHK-027 [P0] [SP5] 6 persona fixtures + 1 README in chosen directory
- [ ] CHK-028 [P0] [SP5] Each fixture ships an evaluation-only, never-runtime disclaimer
- [ ] CHK-029 [P1] [SP5] Each fixture follows persona summary + primary needs + red flags + review questions format
- [ ] CHK-030 [P1] [SP6] All 3 reject-rationale records (067/068/069) authored
- [ ] CHK-031 [P0] No edits to `validate.sh`, `skill-advisor.py`, `mcp_server/`, agent runtime files
- [ ] CHK-032 [P0] No new instruction-file mutations outside SP2 explicit header section
- [ ] CHK-033 [P1] Phase 4 manifest under 50KB
- [ ] CHK-034 [P1] Each phase committed independently for revertibility
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-040 [P0] All P0 acceptance scenarios from spec.md §4A pass
- [ ] CHK-041 [P0] `validate.sh --strict` on this packet exits 0 or 1
- [ ] CHK-042 [P0] [SP1] gate-3 classifier smoke test passes after copy edits
- [ ] CHK-043 [P1] Manual visual review of all 6 spec_kit command READMEs after SP1
- [ ] CHK-044 [P1] Manual visual review of `command/spec_kit/README.txt` after SP2
- [ ] CHK-045 [P1] [SP5] All 7 persona fixture markdown files load without YAML errors
- [ ] CHK-046 [P1] [SP4] INVENTORY.md and source-manifest.yaml parse cleanly
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-050 [P0] No hardcoded secrets in any new file
- [ ] CHK-051 [P0] No PII or credentials in persona fixtures
- [ ] CHK-052 [P1] Phase 4 manifest does not expose internal-only paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-060 [P0] spec.md, plan.md, tasks.md, checklist.md all in sync
- [ ] CHK-061 [P0] `implementation-summary.md` authored at completion
- [ ] CHK-062 [P1] Continuity refreshed via `generate-context.js`
- [ ] CHK-063 [P2] Cross-link from packet 057 spec.md to this packet
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-070 [P1] Temp files in scratch/ only
- [ ] CHK-071 [P1] scratch/ cleaned before completion
- [ ] CHK-072 [P1] No stray files in packet root outside the canonical Level 2 set
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 22 | [ ]/22 |
| P1 Items | 23 | [ ]/23 |
| P2 Items | 1 | [ ]/1 |

**Verification Date**: TBD
<!-- /ANCHOR:summary -->
