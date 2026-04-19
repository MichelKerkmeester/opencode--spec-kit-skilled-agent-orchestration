---
title: "Verification Checklist: Documentation + Release Contract"
description: "Level 2 verification for 020/009 — doc accuracy + DQI."
trigger_phrases:
  - "020 009 checklist"
importance_tier: "critical"
contextType: "checklist"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/020-skill-advisor-hook-surface/009-documentation-and-release-contract"
    last_updated_at: "2026-04-19T09:30:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Checklist scaffolded"
    next_safe_action: "Populate post-implementation"
    blockers: []
    key_files: []

---
# Verification Checklist: Documentation + Release Contract

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer |
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] 006 + 007 + 008 converged
- [ ] CHK-002 [P0] All prior children's implementation-summary.md populated
- [ ] CHK-003 [P0] sk-doc skill available
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Reference doc exists at .opencode/skill/system-spec-kit/references/hooks/skill-advisor-hook.md
- [ ] CHK-011 [P0] All 11 sections present (overview, setup, disable, privacy, failure modes, observability, migration, concurrency, capability matrix, troubleshooting, performance budget)
- [ ] CHK-012 [P0] CLAUDE.md §Gate 2 updated
- [ ] CHK-013 [P0] CLAUDE.md §Mandatory Tools updated
- [ ] CHK-014 [P0] 020 parent implementation-summary.md release section filled
- [ ] CHK-015 [P1] sk-doc DQI ≥ 0.85
- [ ] CHK-016 [P1] 4 runtime READMEs updated (where present)
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Capability matrix matches 006/007/008 implementation-summary.md
- [ ] CHK-021 [P0] Observability metric names match 005's implementation
- [ ] CHK-022 [P0] Failure modes match 004's fail-open table
- [ ] CHK-023 [P0] Disable flag tested: `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1` verified no subprocess run
- [ ] CHK-024 [P0] Performance budget table references 005's bench results
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] Privacy contract documented matches producer implementation
- [ ] CHK-031 [P0] No example in doc embeds real prompt content
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P0] Cross-references to prior children's implementation-summary.md
- [ ] CHK-041 [P1] Links to research synthesis
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P0] Doc at canonical path `.opencode/skill/system-spec-kit/references/hooks/`
- [ ] CHK-051 [P1] README updates in respective runtime directories
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Status: Pending

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 0/18 |
| P1 Items | 4 | 0/4 |
| P2 Items | 0 | 0/0 |
<!-- /ANCHOR:summary -->
