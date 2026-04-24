---
title: "...pec-kit/026-graph-and-context-optimization/006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment/plan]"
description: "Plan for updating skill-advisor docs to present the Phase 020 hook surface as primary and auditing Phase 020 TypeScript files against sk-code-opencode standards."
trigger_phrases:
  - "022 implementation plan"
  - "skill-advisor docs plan"
  - "phase 020 audit plan"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/005-skill-advisor-docs-and-code-alignment"
    last_updated_at: "2026-04-19T18:10:00Z"
    last_updated_by: "codex-gpt-5.4"
    recent_action: "Plan populated during implementation"
    next_safe_action: "Validate packet"
    blockers: []
    key_files:
      - "../../../../skill/skill-advisor/README.md"
      - "../../../../skill/skill-advisor/feature_catalog/feature_catalog.md"
      - "../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md"
      - ".opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use Phase 020 hook surface as primary invocation path"
      - "Preserve direct Python advisor as fallback"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->"
---
# Implementation Plan: Skill-Advisor Docs + Phase 020 Code Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, TypeScript |
| **Framework** | OpenCode spec-kit, system-spec-kit MCP server |
| **Storage** | Existing skill graph and advisor artifacts only |
| **Testing** | Vitest, TypeScript compiler, spec-kit validator |

### Overview

Update the skill-advisor package docs so the Phase 020 hook surface is documented as the primary Gate 2 path. Audit the Phase 020 TypeScript hook and advisor modules against sk-code-opencode standards, then verify the targeted 118-test Phase 020 suite, `tsc --noEmit`, and strict spec validation.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Problem statement clear and scope documented in `spec.md`
- [x] Success criteria measurable in REQ/SC tables
- [x] Dependencies identified: Phase 020 reference docs, sk-code-opencode, target TS files

### Definition of Done

- [x] skill-advisor docs describe hook invocation as primary
- [x] TS audit findings documented and remediated or deferred
- [x] Phase 020 vitest suite passes 118/118
- [x] `npx tsc --noEmit` passes
- [x] strict spec validation passes
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation alignment plus surgical TypeScript quality remediation.

### Key Components

- **skill-advisor docs**: README, feature catalog, setup guide, and manual playbook describe how operators invoke and validate the hook path.
- **Phase 020 advisor libs**: Freshness, cache, subprocess, render, metrics, shared-payload, and policy modules keep strict TypeScript boundaries.
- **Runtime adapters**: Claude, Gemini, Copilot, and Codex hooks preserve fail-open behavior and prompt privacy.

### Data Flow

Runtime prompt-submit hooks call `buildSkillAdvisorBrief()`, render a model-visible advisor brief when threshold and freshness allow it, write prompt-free diagnostics, and otherwise return `{}` or wrapper no-op output. The direct Python CLI remains a fallback for raw advisor JSON and troubleshooting.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Read `spec.md` and `tasks.md`
- [x] Read sk-code-opencode TypeScript standards
- [x] Read Phase 020 hook reference and validation playbook
- [x] Read current skill-advisor docs and target TypeScript files

### Phase 2: Documentation Updates

- [x] Add README hook-primary section and direct CLI fallback label
- [x] Add feature catalog entries for Phase 020 hook features
- [x] Add hook-routing manual playbook and root playbook links
- [x] Update setup guide where direct CLI was still shown as primary integration

### Phase 3: Code Alignment Audit

- [x] Audit 18 Phase 020 TypeScript files
- [x] Document findings in `scratch/audit-findings.md`
- [x] Fix major and minor findings without behavior changes

### Phase 4: Verification

- [x] Run targeted Phase 020 vitest suite
- [x] Run `npx tsc --noEmit`
- [x] Run strict spec validation after packet docs are complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit and integration | Phase 020 advisor libs and hook adapters | `npx vitest run advisor ... codex-prompt-wrapper` |
| Typecheck | system-spec-kit MCP server TypeScript | `npx tsc --noEmit` |
| Documentation validation | 022 spec folder docs | `validate.sh --strict --no-recursive` |
| Manual docs review | Skill-advisor README, catalog, playbook | File inspection and link consistency checks |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 020 hook reference docs | Internal | Green | Docs would lack authoritative hook setup source |
| sk-code-opencode standards | Internal | Green | TS audit checklist would be incomplete |
| Phase 020 vitest suites | Internal | Green | Cannot prove 118/118 preservation |
| system-spec-kit validator | Internal | Green | Cannot claim packet-level completion |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Phase 020 tests, typecheck, or strict spec validation fails after remediation.
- **Procedure**: Revert only the affected 022 doc or Phase 020 TS audit patch, rerun the targeted failing command, and keep the audit finding documented if behavior-changing remediation is unsafe.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Setup -> Documentation Updates -> TS Audit -> Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Documentation Updates, TS Audit |
| Documentation Updates | Setup | Verification |
| TS Audit | Setup | Verification |
| Verification | Documentation Updates, TS Audit | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 0.5 hour |
| Documentation Updates | Medium | 1-2 hours |
| TS Audit | Medium | 1-2 hours |
| Verification | Low | 0.5 hour |
| **Total** | | **3-5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

- [x] Existing dirty worktree reviewed and unrelated changes left untouched
- [x] Phase 020 tests run after TS audit patches
- [x] Typecheck run after TS audit patches

### Rollback Procedure

1. Identify the failing doc, code file, or validation item.
2. Revert only the scoped edit that caused the failure.
3. Rerun the failed verification command.
4. Document any skipped behavior-changing remediation in `implementation-summary.md`.

### Data Reversal

- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->
