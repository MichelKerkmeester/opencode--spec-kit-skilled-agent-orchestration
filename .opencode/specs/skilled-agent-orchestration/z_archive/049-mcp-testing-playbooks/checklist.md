---
title: "Verification Checklist: MCP Testing Playbooks for Four Skills"
description: "P0/P1/P2 verification matrix gating spec 049 release readiness."
trigger_phrases:
  - "049 checklist"
  - "mcp playbook checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "specs/skilled-agent-orchestration/049-mcp-testing-playbooks"
    last_updated_at: "2026-04-26T00:00:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Authored Level-3 verification checklist with V1-V8 gates"
    next_safe_action: "Author decision-record.md with ADR-001..ADR-005"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-bootstrap-2026-04-26"
      parent_session_id: null
    completion_pct: 20
    open_questions: []
    answered_questions: []
---

# Verification Checklist: MCP Testing Playbooks for Four Skills

This checklist gates release readiness for spec 049. All P0 items MUST pass; P1 items MUST pass OR carry a user-approved deferral; P2 items are best-effort.

---

## P0 — Blockers (MUST pass before claiming completion)

### Per-skill structure (CM, BDG, CU)

- [ ] CM: `.opencode/skill/mcp-code-mode/manual_testing_playbook/manual_testing_playbook.md` exists and validates (`validate_document.py` exit 0)
- [ ] CM: 7 category folders present (`01--core-tools` through `07--recovery-and-config`)
- [ ] CM: per-feature file count == ID count in root FEATURE FILE INDEX (~26 files)
- [ ] CM: every CM-NNN ID is unique (no dupes across categories)
- [ ] BDG: root `manual_testing_playbook.md` exists and validates
- [ ] BDG: 6 category folders present
- [ ] BDG: per-feature file count == ID count (~22 files)
- [ ] BDG: every BDG-NNN ID is unique
- [ ] CU: root `manual_testing_playbook.md` exists and validates
- [ ] CU: 6 category folders present
- [ ] CU: per-feature file count == ID count (~25 files)
- [ ] CU: every CU-NNN ID is unique

### Per-feature file contract

- [ ] Every per-feature file has frontmatter `title` + `description` keys
- [ ] Every per-feature file has all 5 H2 sections: OVERVIEW, CURRENT REALITY, TEST EXECUTION, SOURCE FILES, SOURCE METADATA
- [ ] Every per-feature file has a deterministic prompt formatted "As a {ROLE}, {ACTION} against {TARGET}. Verify {EXPECTED}. Return {OUTPUT}."
- [ ] Every per-feature file has ≥2 ordered failure-triage steps with specific file paths, command names, or signal references
- [ ] Vague-prompt grep returns empty: `grep -rE "(test it|run it|check stuff|validate it)\b" .opencode/skill/mcp-{code-mode,chrome-devtools,clickup}/manual_testing_playbook/`

### Cross-skill references

- [ ] All `CM-NNN` references in BDG-014..BDG-018 resolve to existing CM scenarios
- [ ] All `CM-NNN` references in CU-017..CU-019 resolve to existing CM scenarios
- [ ] Frozen-IDs check: CM-001..CM-026 IDs unchanged after Phase 3 and Phase 4 authoring (no renumbering)

### Spec governance

- [ ] All 9 spec files present (spec.md, plan.md, tasks.md, checklist.md, decision-record.md, research.md, implementation-summary.md, description.json, graph-metadata.json)
- [ ] `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks --strict` exits 0
- [ ] All P0 requirements (REQ-001..REQ-005) marked complete in spec.md with evidence

---

## P1 — Required (MUST pass OR carry user-approved deferral)

### CCC audit

- [ ] research.md `## CCC Audit (YYYY-MM-DD)` section present with explicit gap inventory
- [ ] If gaps found: per-feature files appended at next free numeric slot in matching categories (not root rewrite)
- [ ] If no gaps: explicit `[]` recorded with reasoning
- [ ] CCC root `manual_testing_playbook.md` byte-unchanged unless explicit gap-driven addition (verified via `git diff`)
- [ ] All 23 existing CCC IDs preserved (no renumbering)

### V7 smoke runs (real environment)

- [ ] CM-001 (local list_tools) — executed end-to-end, evidence in implementation-summary.md, verdict PASS or SKIP with documented sandbox blocker
- [ ] BDG-001 (real Chrome lifecycle) — executed or SKIP with documented blocker
- [ ] CU-001 (live ClickUp install/version) — executed or SKIP with documented blocker
- [ ] CCC-001 (existing index search) — executed or SKIP with documented blocker
- [ ] At least 3 of 4 smoke runs verdict PASS (per SC-003)

### Memory + discovery

- [ ] `description.json` contains the spec's title, description, status, and phase pointers
- [ ] `graph-metadata.json` has `derived_status` matching `implementation-summary.md` presence + checklist completion
- [ ] Memory save executed: `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js ... .opencode/specs/skilled-agent-orchestration/049-mcp-testing-playbooks/`
- [ ] `memory_search({query: "mcp testing playbook"})` returns this spec in results (post-indexing)

---

## P2 — Best-effort (warn but don't block)

- [ ] Per-feature file LOC ≤200 (snippet template scaffold)
- [ ] Root playbook LOC ≤800 per skill (readability)
- [ ] Cross-references include feature names, not just IDs (e.g., "CM-005 (correct manual.tool form)" not just "CM-005")
- [ ] Failure-triage entries cite specific file paths or commands (not generic "check the logs")
- [ ] Each playbook root `## 14. AUTOMATED TEST CROSS-REFERENCE` section names actual test files where they exist
- [ ] Each playbook root `## 6. SUB-AGENT ORCHESTRATION AND WAVE PLANNING` section identifies destructive scenario IDs requiring isolated waves

---

## Sign-off

- [ ] All P0 items checked
- [ ] All P1 items checked (or deferral noted in implementation-summary.md)
- [ ] User-visible smoke evidence captured in implementation-summary.md
- [ ] Memory save executed
- [ ] Spec marked Status=Complete in spec.md §1 METADATA
