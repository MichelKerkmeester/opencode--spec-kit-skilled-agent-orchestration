---
title: "Ver [system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface/checklist]"
description: "Level 3 umbrella verification checklist for 020."
trigger_phrases:
  - "020 checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/007-skill-advisor-hook-surface"
    last_updated_at: "2026-04-28T19:30:00Z"
    last_updated_by: "codex-gpt-5-hygiene-pass"
    recent_action: "Hygiene pass - validator structure"
    next_safe_action: "Keep validators green"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
---
# Verification Checklist: Skill-Advisor Hook Surface

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] [P0] Spec scope + acceptance scenarios reviewed. Evidence: `spec.md` now documents Copilot next-prompt semantics explicitly. [EVIDENCE: completion carried forward]
- [x] [P0] Research sub-packet (001) scaffolded and converged. Evidence: `implementation-summary.md` children convergence log lists 001 as converged. [EVIDENCE: completion carried forward]
- [x] [P0] Dispatch log populated in implementation-summary.md. Evidence: `implementation-summary.md` dispatch log records T1-T10 release events. [EVIDENCE: completion carried forward]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] [P0] `buildSkillAdvisorBrief()` implemented with cache + timeout + fail-open. Evidence: `implementation-summary.md` 020/004 summary. [EVIDENCE: completion carried forward]
- [x] [P0] `getAdvisorFreshness()` implements live/stale/absent/unavailable correctly. Evidence: `implementation-summary.md` 020/003 summary. [EVIDENCE: completion carried forward]
- [x] [P0] Hooks wired for Claude/Gemini/Copilot, with Copilot documented as next-prompt custom-instructions transport. Evidence: `decision-record.md` ADR-005. [EVIDENCE: completion carried forward]
- [x] [P1] Codex integration shipped OR documented why deferred. Evidence: `implementation-summary.md` 020/008 summary. [EVIDENCE: completion carried forward]
- [x] [P0] Shared-payload envelope correctly populated. Evidence: `implementation-summary.md` verification table. [EVIDENCE: completion carried forward]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] [P0] Unit tests: cache + fingerprint + freshness. Evidence: `implementation-summary.md` 020/003 and 020/004 summaries. [EVIDENCE: completion carried forward]
- [x] [P0] Integration tests: per-runtime hook injection. Evidence: `implementation-summary.md` T9 integration gauntlet. [EVIDENCE: completion carried forward]
- [x] [P0] Regression: 019/004 corpus hook vs direct CLI — 100% match. Evidence: `implementation-summary.md` verification table reports 200/200. [EVIDENCE: completion carried forward]
- [x] [P0] Performance: p95 ≤ 50ms, ≤ 80 tokens. Evidence: `implementation-summary.md` verification table reports cache-hit lane p95 0.016ms. [EVIDENCE: completion carried forward]
- [x] [P0] Cross-runtime snapshot parity, with Copilot parity scoped to rendered brief not same-current-turn delivery. Evidence: `spec.md` success criteria and `decision-record.md` ADR-005. [EVIDENCE: completion carried forward]
- [x] [P1] Failure-mode tests (subprocess timeout, binary missing, JSON parse error). Evidence: `implementation-summary.md` 020/004 and 020/009 summaries. [EVIDENCE: completion carried forward]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [x] [P0] No user prompt content logged outside hook-state TTL. Evidence: `implementation-summary.md` privacy audit row. [EVIDENCE: completion carried forward]
- [x] [P0] Shared-payload provenance contract populated (sanitizerVersion + runtimeFingerprint). Evidence: `implementation-summary.md` 020/002 summary. [EVIDENCE: completion carried forward]
- [x] [P1] Escape-hatch env flag documented and verified. Evidence: `implementation-summary.md` disable flag smoke row. [EVIDENCE: completion carried forward]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] [P0] New hook-surface reference doc published under `.opencode/skill/system-spec-kit/references/hooks/` (created by 020/009). Evidence: `implementation-summary.md` 020/009 summary. [EVIDENCE: completion carried forward]
- [x] [P1] CLAUDE.md references the hook in Gate 2 discussion. Evidence: `implementation-summary.md` 020/009 summary. [EVIDENCE: completion carried forward]
- [x] [P1] Cross-runtime README updates. Evidence: `implementation-summary.md` 020/009 summary. [EVIDENCE: completion carried forward]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] [P0] New files in expected paths (lib/skill-advisor/, hooks/*/user-prompt-submit.ts). Evidence: `implementation-summary.md` component stack. [EVIDENCE: completion carried forward]
- [x] [P0] No orphan files. Evidence: `implementation-summary.md` release prep and T9 gauntlet. [EVIDENCE: completion carried forward]
- [x] [P1] Dist artifacts rebuilt if applicable. Evidence: `implementation-summary.md` T9 gauntlet. [EVIDENCE: completion carried forward]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Complete. Tier 2 remediation adds one caveat: Copilot is file-backed next-prompt freshness, not same-current-turn context injection.
<!-- /ANCHOR:summary -->
