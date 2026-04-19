---
title: "Feature Specification: Skill-Advisor Docs + Phase 020 Code Alignment"
description: "Update skill-advisor feature catalog, manual testing playbook, and README with Phase 020 hook surface additions. Verify all Phase 020 lib + hook code aligns with sk-code-opencode standards."
trigger_phrases:
  - "022 skill-advisor docs alignment"
  - "skill-advisor feature catalog update"
  - "sk-code-opencode alignment check"
importance_tier: "important"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/022-skill-advisor-docs-and-code-alignment"
    last_updated_at: "2026-04-19T18:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Phase 022 scaffolded"
    next_safe_action: "Dispatch cli-codex to implement"
    dispatch_policy: "cli-codex gpt-5.4 high fast primary; cli-copilot gpt-5.4 high fallback"

---
# Feature Specification: Skill-Advisor Docs + Phase 020 Code Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

| Field | Value |
|-------|-------|
| **Parent Track** | 026-graph-and-context-optimization |
| **Predecessors** | 020-skill-advisor-hook-surface (shipped), 021-smart-router-context-efficacy (research in progress) |

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 (docs + code-quality alignment post-020) |
| **Status** | Spec Ready |
| **Created** | 2026-04-19 |
| **Effort Estimate** | 0.5-1 engineering day |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Phase 020 shipped the skill-advisor hook surface across 4 runtimes (Claude/Gemini/Copilot/Codex) with 11 new lib files, 4 hook adapters, 11 test files, and full reference documentation at `.opencode/skill/system-spec-kit/references/hooks/`. However:

1. The skill-advisor's OWN artifacts — `README.md`, feature_catalog/feature_catalog.md, manual_testing_playbook/manual_testing_playbook.md — have not been updated to reflect the new hook-based invocation path. They still describe the explicit `skill_advisor.py` subprocess flow as primary.

2. Phase 020 lib + hook code was written by cli-codex autonomously. While tests + tsc + validate all pass, the code hasn't been audited against sk-code-opencode multi-language TypeScript standards (strict mode, explicit return types, error handling patterns, comment discipline, etc.). Mismatches may exist.

### Purpose

Bring skill-advisor's own docs into alignment with the Phase 020 hook surface, and verify Phase 020 TypeScript code meets sk-code-opencode standards. Correct any misalignment found.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**Docs updates:**
- `../../../../skill/skill-advisor/README.md` — add hook-based invocation as primary path; keep explicit `skill_advisor.py` as fallback; cross-reference references/hooks/skill-advisor-hook.md.
- ../../../../skill/skill-advisor/feature_catalog/feature_catalog.md — document Phase 020 features: advisor hook, HMAC cache, freshness probe, 4-runtime parity, disable flag, observability, privacy contract.
- ../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md — add new playbook section for hook-based routing (per-runtime smoke test steps, disable-flag verification, stale-graph handling).
- Optional: `../../../../skill/skill-advisor/SET-UP_GUIDE.md` — reference hook registration snippets from 020/009.

**Code alignment:**
- Audit Phase 020 files against sk-code-opencode TypeScript standards:
  - `lib/context/shared-payload.ts` (020/002 extensions only)
  - `lib/skill-advisor/freshness.ts`, `source-cache.ts`, `generation.ts` (020/003)
  - `lib/skill-advisor/prompt-policy.ts`, `prompt-cache.ts`, `subprocess.ts`, `skill-advisor-brief.ts` (020/004)
  - `lib/skill-advisor/render.ts`, `normalize-adapter-output.ts`, `metrics.ts` (020/005)
  - `lib/codex-hook-policy.ts` (020/008)
  - `hooks/claude/user-prompt-submit.ts` (020/006)
  - `hooks/gemini/user-prompt-submit.ts`, `hooks/copilot/user-prompt-submit.ts` (020/007)
  - `hooks/codex/user-prompt-submit.ts`, `hooks/codex/pre-tool-use.ts`, `hooks/codex/prompt-wrapper.ts` (020/008)
- Run sk-code-opencode checklist: strict TS, explicit return types on exported fns, no `any` without justification, error handling at boundaries only, comment discipline, no dead code.
- Fix any misalignment found; preserve test green state.

### Out of Scope

- Any architectural changes to Phase 020 hook surface
- Changes to `skill_advisor.py` Python ranker
- Updating runtime-specific hook adapter tests beyond fixing style drift
- Phase 021 research artifacts (T11 still running)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `../../../../skill/skill-advisor/README.md` | Modify | Hook-based path documentation |
| ../../../../skill/skill-advisor/feature_catalog/feature_catalog.md | Modify | Phase 020 feature additions |
| ../../../../skill/skill-advisor/manual_testing_playbook/manual_testing_playbook.md | Modify | Hook-based routing playbook |
| `.opencode/skill/system-spec-kit/mcp_server/lib/skill-advisor/*.ts` | Audit + Fix if drift | sk-code-opencode alignment |
| `.opencode/skill/system-spec-kit/mcp_server/hooks/**/*.ts` | Audit + Fix if drift | sk-code-opencode alignment |
| `.opencode/skill/system-spec-kit/mcp_server/lib/context/shared-payload.ts` | Audit + Fix if drift | sk-code-opencode alignment (002 scope only) |
| `.opencode/skill/system-spec-kit/mcp_server/lib/codex-hook-policy.ts` | Audit + Fix if drift | sk-code-opencode alignment |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | README hook integration documented | README has §Hook Invocation section with setup snippet per runtime |
| REQ-002 | Feature catalog updated with Phase 020 features | ≥ 6 new entries (hook surface, HMAC cache, freshness, parity, disable, observability, privacy) |
| REQ-003 | Manual testing playbook has hook-based routing section | New step-by-step playbook sub-section covering all 4 runtimes |
| REQ-004 | All Phase 020 TS files pass sk-code-opencode checklist | Documented findings + remediations; zero new errors |
| REQ-005 | All Phase 020 tests remain green after alignment | 118/118 Phase 020 tests + tsc clean |

### 4.2 P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-010 | Cross-references from skill-advisor docs to reference doc | README + feature catalog link to ../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md |
| REQ-011 | sk-code-opencode findings catalogued | `implementation-summary.md` lists every finding + whether fixed or deferred with reason |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: skill-advisor README links to hook reference doc + describes hook-first invocation
- **SC-002**: Feature catalog entries cover all 11 lib files + 4 hook adapters
- **SC-003**: Manual testing playbook covers hook-based smoke test per runtime
- **SC-004**: sk-code-opencode audit findings catalogued + acted on
- **SC-005**: 118/118 Phase 020 tests PASS post-alignment
- **SC-006**: tsc --noEmit clean
- **SC-007**: validate.sh --strict clean on 022 spec folder

### Acceptance Scenario 1: README hook-first
**Given** a user lands on `../../../../skill/skill-advisor/README.md`, **when** they scan for "how to use the advisor", **then** the hook-based path is the primary documented invocation with cross-reference to the reference doc.

### Acceptance Scenario 2: Feature catalog comprehensive
**Given** the feature catalog after update, **when** searched for "hook", **then** entries exist for: user-prompt-submit hook (4 runtimes), HMAC exact cache, freshness probe + per-skill fingerprints, generation counter, 4-runtime parity, disable flag env var, observability metrics + JSONL, privacy contract.

### Acceptance Scenario 3: Manual playbook covers hook path
**Given** the playbook after update, **when** an operator runs the hook-based smoke test section, **then** they can verify per runtime: hook fires → brief emitted, disable flag bypasses producer, stale freshness still emits brief with stale badge.

### Acceptance Scenario 4: sk-code-opencode audit complete
**Given** the Phase 020 TypeScript files, **when** audited against sk-code-opencode standards, **then** every finding is documented in implementation-summary.md with fix or deferral-reason.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 020 hook reference docs | Docs could drift from shipped hook behavior | Use ../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md as the authoritative source |
| Dependency | Phase 020 vitest suites | Code alignment could regress hook behavior unnoticed | Run the targeted 118-test Phase 020 suite after TS edits |
| Risk | Over-broad code cleanup | Could change shipped Phase 020 behavior | Limit remediations to sk-code-opencode alignment issues and skip behavior-changing fixes |
| Risk | Parallel Phase 021 research artifacts | Could accidentally modify sibling work | Scope edits to 022 docs, skill-advisor docs, and Phase 020 TS audit targets |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

No open questions remain for Phase 022 execution.

### Related Documents

- Parent: `../020-skill-advisor-hook-surface/` (shipped)
- Sibling: `../021-smart-router-context-efficacy/` (research in progress)
- sk-code-opencode skill: `../../../../skill/sk-code-opencode/SKILL.md`
- skill-advisor: `.opencode/skill/skill-advisor/`
- Reference doc: ../../../../skill/system-spec-kit/references/hooks/skill-advisor-hook.md (from 020/009)
<!-- /ANCHOR:questions -->
