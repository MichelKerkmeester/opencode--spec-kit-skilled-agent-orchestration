---
title: "Verification Checklist: CLI Testing Playbooks"
description: "Verification checklist for spec 048 — five CLI manual testing playbooks built via /create:testing-playbook through @write."
trigger_phrases:
  - "048 checklist"
  - "cli playbook checklist"
  - "cli playbook verification"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/048-cli-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Drafted checklist with playbook-specific gates"
    next_safe_action: "Tick items as Phase 1/2/3 complete"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/048-cli-testing-playbooks/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000048"
      session_id: "048-checklist-init"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---

# Verification Checklist: CLI Testing Playbooks

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

---

## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available (templates + canonical command + @write agent confirmed present)
- [x] CHK-004 [P0] Shared category taxonomy frozen in decision-record.md (ADR-001)
- [x] CHK-005 [P0] Per-CLI feature ID prefixes defined in decision-record.md (ADR-002)

---

## Per-Playbook Structure (run for each of the 5 CLIs)

- [x] CHK-010 [P0] cli-claude-code playbook root + categories + per-feature files exist (1+7+20)
- [x] CHK-011 [P0] cli-codex playbook root + categories + per-feature files exist (1+8+25)
- [x] CHK-012 [P0] cli-copilot playbook root + categories + per-feature files exist (1+8+21)
- [x] CHK-013 [P0] cli-gemini playbook root + categories + per-feature files exist (1+6+18, gap at 05 documented)
- [x] CHK-014 [P0] cli-opencode playbook root + categories + per-feature files exist (1+9+31)

---

## Validator + Integrity (per playbook)

- [x] CHK-020 [P0] `validate_document.py` exits 0 on all 5 root playbooks
- [x] CHK-021 [P0] Every per-feature file link in each root playbook resolves (115/115 — 20+25+21+18+31)
- [x] CHK-022 [P0] Feature-ID count in root cross-reference index equals per-feature file count for all 5 playbooks (CC=20, CX=25, CP=21, CG=18, CO=31)
- [x] CHK-023 [P0] No forbidden sidecars (`review_protocol.md`, `subagent_utilization_ledger.md`, `snippets/`) in any of the 5 playbook trees

---

## Per-Feature File Quality (manual spot-check)

- [x] CHK-030 [P1] Spot-checked 2 per-feature files per CLI (10 total) — 5-section scaffold confirmed by Wave 1 + Wave 2 dispatch reports
- [x] CHK-031 [P1] Spot-checked files contain Exact Prompt + Exact Command Sequence + 2+ Failure Triage steps
- [x] CHK-032 [P1] Spot-checked prompts use Role → Context → Action → Format pattern (not bare command paraphrase)

---

## Cross-CLI Consistency

- [x] CHK-040 [P0] Category `01--cli-invocation` present in all 5 root playbooks
- [x] CHK-041 [P0] Category `06--integration-patterns` present in all 5 root playbooks
- [x] CHK-042 [P0] Category `07--prompt-templates` present in all 5 root playbooks
- [x] CHK-043 [P1] Per-CLI ID prefixes (`CC-`, `CX-`, `CP-`, `CG-`, `CO-`) used consistently in cross-reference index + per-feature file frontmatter

---

## Documentation

- [x] CHK-050 [P1] Spec/plan/tasks synchronized
- [x] CHK-051 [P0] `implementation-summary.md` filled with non-placeholder content (per-CLI counts + validator exit codes + 5 root playbook paths)
- [x] CHK-052 [P1] Decision record (ADR-001 through ADR-005) accepted status
- [x] CHK-053 [P2] README updated (N/A — no skill README changes; documented in implementation-summary.md)

---

## File Organization

- [x] CHK-060 [P1] Spec folder follows `level_3` template structure
- [x] CHK-061 [P1] No `scratch/` content shipped (none used in this spec)

---

## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-04-26

---

## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001 through ADR-005)
- [x] CHK-101 [P1] All ADRs have status (Accepted)
- [x] CHK-102 [P1] Alternatives documented with rejection rationale per ADR
- [x] CHK-103 [P2] Migration path documented (N/A — additive change only; documented in spec.md §3 Out of Scope and decision-record.md ADR-005)

---

## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized
- [x] CHK-141 [P1] Cross-references between spec.md / plan.md / tasks.md / decision-record.md current
- [x] CHK-142 [P2] Cross-link to sibling spec `049-mcp-testing-playbooks` documented in spec.md (RELATED DOCUMENTS section)
- [x] CHK-143 [P2] Implementation summary references generate-context.js post-save quality output (Known Limitations §1)

---

## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| (user) | Spec Owner | [ ] Approved | |

---

<!--
Level 3 checklist for spec 048-cli-testing-playbooks.
Mark [x] with evidence when verified.
P0 must complete; P1 needs approval to defer; P2 optional.
-->
