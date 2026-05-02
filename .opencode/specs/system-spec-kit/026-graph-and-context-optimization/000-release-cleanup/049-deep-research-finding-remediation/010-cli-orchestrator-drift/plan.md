---
template_source: "SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2"
title: "Implementation Plan: 010 CLI Orchestrator Skill Doc Drift [template:level_2/plan.md]"
description: "Six surgical doc edits across five CLI orchestrator skills to close findings F-007-B2-01..06 from packet 046 iteration-007."
trigger_phrases:
  - "F-007-B2 plan"
  - "010 cli orchestrator drift plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/049-deep-research-finding-remediation/010-cli-orchestrator-drift"
    last_updated_at: "2026-05-01T07:35:00Z"
    last_updated_by: "remediation-orchestrator"
    recent_action: "Plan authored after spec; six edits already applied"
    next_safe_action: "Run validate.sh --strict, then commit + push"
    blockers: []
    key_files:
      - ".opencode/skill/cli-opencode/SKILL.md"
      - ".opencode/skill/cli-opencode/references/agent_delegation.md"
      - ".opencode/skill/cli-copilot/SKILL.md"
      - ".opencode/skill/cli-codex/assets/prompt_templates.md"
      - ".opencode/skill/cli-claude-code/assets/prompt_templates.md"
      - ".opencode/skill/cli-gemini/assets/prompt_templates.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "049-010-cli-drift"
      parent_session_id: null
    completion_pct: 80
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 010 CLI Orchestrator Skill Doc Drift

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skill/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Six surgical doc edits across five CLI orchestrator skills close findings F-007-B2-01..06. Each edit resolves one specific contradiction or omission identified in packet 046 iteration-007. No product code, no schema, no template-source bumps.

### Technical Context

The five CLI orchestrator skills (`cli-opencode`, `cli-copilot`, `cli-codex`, `cli-claude-code`, `cli-gemini`) live under `.opencode/skill/` and provide dispatch contracts plus prompt templates that downstream agents and humans copy into invocation. Drift across these files produces inconsistent behavior across runtimes. The fix is purely textual.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

| Gate | Threshold |
|------|-----------|
| validate.sh --strict | exit 0 (errors=0) |
| Git diff scope | six skill files + this packet's spec docs only |
| Stress regression | none expected (no product code touched) |
| Inline traceability markers | one `<!-- F-007-B2-NN -->` marker per finding |
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Doc-only changes. Each skill is a self-contained markdown package; the edits stay within the existing structure (frontmatter unchanged, headers unchanged, only inline prose and table rows modified).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

| # | Phase | Action | File | Finding | Status |
|---|-------|--------|------|---------|--------|
| 1 | Edit | Clarify single-hop dispatch contract | cli-opencode/SKILL.md | F-007-B2-01 | Done |
| 2 | Edit | Replace deep-loop direct-invocation rows | cli-opencode/references/agent_delegation.md | F-007-B2-02 | Done |
| 3 | Edit | Reconcile effort-flag prose with example | cli-copilot/SKILL.md | F-007-B2-03 | Done |
| 4 | Edit | Pin model+effort, fix --full-auto, mark service_tier opt-in | cli-codex/assets/prompt_templates.md | F-007-B2-04 | Done |
| 5 | Edit | Pin --model claude-sonnet-4-6 | cli-claude-code/assets/prompt_templates.md | F-007-B2-05 | Done |
| 6 | Edit | Split safe vs approved-write templates | cli-gemini/assets/prompt_templates.md | F-007-B2-06 | Done |
| 7 | Validate | validate.sh --strict | this packet | — | Pending |
| 8 | Ship | commit + push to origin main | repo | — | Pending |
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

No automated tests for doc-only changes. Verification is:
- `validate.sh --strict` exit 0
- Visual review of each cited line range to confirm edit applied
- Wave master will run `npm run stress` after Wave 1 completes to confirm no upstream regression
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Source of truth: `046-system-deep-research-bugs-and-improvements/research/research.md` §6
- Validate script: `.opencode/skill/system-spec-kit/scripts/spec/validate.sh`
- No other packet dependencies. Sub-phase 010 is independent within Wave 1.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

If a downstream skill breaks because of a doc edit:
1. `git revert <commit-sha>` reverts all six edits atomically
2. Re-run validate to confirm 048 baseline restored
3. Reauthor the failing edit with smaller scope

Each edit carries an inline finding marker, so locating the exact change for a partial revert (cherry-pick a subset of hunks) is straightforward.
<!-- /ANCHOR:rollback -->
