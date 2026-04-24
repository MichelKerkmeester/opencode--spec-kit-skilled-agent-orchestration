---
title: "Ver [system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface/checklist]"
description: "Level 3 umbrella verification checklist for 020."
trigger_phrases:
  - "020 checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/009-hook-package/001-skill-advisor-hook-surface"
    last_updated_at: "2026-04-19T06:40:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Verify after research + implementation"
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

- [ ] [P0] Spec scope + acceptance scenarios reviewed
- [ ] [P0] Research sub-packet (001) scaffolded and converged
- [ ] [P0] Dispatch log populated in implementation-summary.md
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] [P0] `buildSkillAdvisorBrief()` implemented with cache + timeout + fail-open
- [ ] [P0] `getAdvisorFreshness()` implements live/stale/absent/unavailable correctly
- [ ] [P0] Hooks wired for all 3 runtimes (claude, gemini, copilot)
- [ ] [P1] Codex integration shipped OR documented why deferred
- [ ] [P0] Shared-payload envelope correctly populated
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] [P0] Unit tests: cache + fingerprint + freshness
- [ ] [P0] Integration tests: per-runtime hook injection
- [ ] [P0] Regression: 019/004 corpus hook vs direct CLI — 100% match
- [ ] [P0] Performance: p95 ≤ 50ms, ≤ 80 tokens
- [ ] [P0] Cross-runtime snapshot parity
- [ ] [P1] Failure-mode tests (subprocess timeout, binary missing, JSON parse error)
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] [P0] No user prompt content logged outside hook-state TTL
- [ ] [P0] Shared-payload provenance contract populated (sanitizerVersion + runtimeFingerprint)
- [ ] [P1] Escape-hatch env flag documented and verified
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] [P0] New hook-surface reference doc published under `.opencode/skill/system-spec-kit/references/hooks/` (created by 020/009)
- [ ] [P1] CLAUDE.md references the hook in Gate 2 discussion
- [ ] [P1] Cross-runtime README updates
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] [P0] New files in expected paths (lib/skill-advisor/, hooks/*/user-prompt-submit.ts)
- [ ] [P0] No orphan files
- [ ] [P1] Dist artifacts rebuilt if applicable
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending (to be populated post-implementation)
<!-- /ANCHOR:summary -->
