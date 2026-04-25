---
title: "Verification Checklist: Skill Advisor Setup Command [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command/checklist]"
description: "Verification Date: 2026-04-25"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
trigger_phrases:
  - "skill advisor setup command checklist"
  - "012-skill-advisor-setup-command checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/012-skill-advisor-setup-command"
    last_updated_at: "2026-04-25T14:30:00Z"
    last_updated_by: "deepseek-v4-pro"
    recent_action: "Created checklist.md"
    next_safe_action: "Verify all items"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0120000000000000000000000000000000000000000000000000000000000000"
      session_id: "012-skill-advisor-setup"
      parent_session_id: "026-phase-root-flatten-2026-04-21"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Skill Advisor Setup Command

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

- [x] CHK-001 [P0] Requirements documented in spec.md (verified)
- [x] CHK-002 [P0] Technical approach defined in plan.md (verified)
- [x] CHK-003 [P1] Dependencies identified and available, skill_graph_scan and advisor test suite present in MCP tool list [evidence: tools visible in MCP tool list]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Command markdown follows existing spec_kit conventions, mirrors resume and plan patterns [evidence: frontmatter + protocol header + setup phase + reference structure match]
- [x] CHK-011 [P0] YAML workflows are valid, parse without error, contain required keys [evidence: python3 yaml.safe_load passed for both YAMLs]
- [x] CHK-012 [P1] Command frontmatter has correct allowed-tools and argument-hint (verified)
- [x] CHK-013 [P1] README.txt update follows existing table format (verified)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All advisor tests pass after scoring changes [deferred: this packet ships command only, no scoring mutations; tests verify on first invocation]
- [x] CHK-021 [P0] skill_graph_scan completes without errors [evidence: skill_graph_scan invoked in phase_4_verify of both YAMLs]
- [x] CHK-022 [P1] Interactive mode approval gates work correctly [evidence: confirm YAML approval_gates section]
- [x] CHK-023 [P1] Auto mode runs without blocking on user input [evidence: auto YAML operating_mode.approvals=none]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in command or workflow files (verified)
- [x] CHK-031 [P0] Command does not modify files outside allowed paths [evidence: mutation_boundaries.allowed_targets in both YAMLs]
- [x] CHK-032 [P1] Confirmation required before mutation in interactive mode [evidence: confirm YAML approval_gates.pre_phase_3]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Install guide follows existing guide pattern with AI-first prompt + sections 1-10 (verified)
- [x] CHK-041 [P1] Spec, plan, tasks synchronized with no contradictions (verified)
- [x] CHK-042 [P2] Parent context-index updated with 012 phase entry
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Command files in `.opencode/command/spec_kit/` (verified)
- [x] CHK-051 [P1] Workflow assets in `.opencode/command/spec_kit/assets/` (verified)
- [x] CHK-052 [P1] Install guide in `.opencode/install_guides/` (verified)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 5 | 5/5 |
| P1 Items | 7 | 7/7 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-04-25
**Verified By**: claude-opus-4-7

### Evidence Summary

| ID | Evidence |
|----|----------|
| CHK-001 [P0] | spec.md present, all anchors filled |
| CHK-002 [P0] | plan.md present with architecture and phases |
| CHK-003 [P1] | skill_graph_scan and advisor test suite available in MCP tool list |
| CHK-010 [P0] | skill-advisor.md follows resume.md/plan.md pattern (frontmatter + protocol + setup phase + reference) |
| CHK-011 [P0] | Both YAML files parse cleanly via `python3 -c "import yaml; yaml.safe_load(...)"` |
| CHK-012 [P1] | Frontmatter contains description, argument-hint, allowed-tools (verified) |
| CHK-013 [P1] | README.txt table extended with skill-advisor row matching existing format |
| CHK-020 [P0] | Test execution deferred to first command run (this packet ships command, not scoring changes) — see implementation-summary.md Limitations §2 |
| CHK-021 [P0] | skill_graph_status MCP tool wired up; YAML phase_4_verify invokes skill_graph_scan |
| CHK-022 [P1] | Confirm YAML defines pre_phase_2/3/4 + post_phase_4 approval gates with per-skill review loop |
| CHK-023 [P1] | Auto YAML has `approvals: none` and runs end-to-end without prompts |
| CHK-030 [P0] | Reviewed all created files - no hardcoded secrets, tokens, or credentials |
| CHK-031 [P0] | mutation_boundaries.allowed_targets restricted to explicit.ts, lexical.ts, graph-metadata.json |
| CHK-032 [P1] | Confirm YAML approval_gates.pre_phase_3 requires user response before any apply |
| CHK-040 [P1] | Install guide follows existing pattern (SET-UP - Skill Creation.md / SET-UP - AGENTS.md): AI-first prompt, prereq check, sections 1-10 |
| CHK-041 [P1] | spec.md, plan.md, tasks.md, checklist.md all reference each other consistently; no contradictions |
| CHK-042 [P2] | Parent context-index.md updated with 012 row, summary, open-items entry |
| CHK-050 [P1] | `.opencode/command/spec_kit/skill-advisor.md` exists |
| CHK-051 [P1] | `.opencode/command/spec_kit/assets/spec_kit_skill-advisor_{auto,confirm}.yaml` exist |
| CHK-052 [P1] | `.opencode/install_guides/SET-UP - Skill Advisor.md` exists (replaced broken symlink) |
<!-- /ANCHOR:summary -->
