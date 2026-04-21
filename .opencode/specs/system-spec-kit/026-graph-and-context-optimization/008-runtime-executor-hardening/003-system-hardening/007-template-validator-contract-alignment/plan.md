---
title: "Implementation Plan: Template/Validator Contract Alignment"
description: "Rule registry + semantic frontmatter + anchor parity."
trigger_phrases: ["validator alignment plan"]
importance_tier: "critical"
contextType: "plan"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment"
    last_updated_at: "2026-04-18T23:52:00Z"
    last_updated_by: "claude-opus-4.7-1m"
    recent_action: "Plan scaffolded"
    next_safe_action: "Dispatch implementation"
---
# Implementation Plan: Template/Validator Contract Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Stack** | Bash (validator) + TypeScript (preflight, spec-doc-structure) |
| **Source Audit** | 019/001/006 review-report.md |

### Overview

5 ranked proposals. Land P1 rank 1 first (registry canonicalization). Then rank 2 (semantic frontmatter). Then rank 3 (anchor parity). Rank 4 defer-able. Rank 5 is 1-line doc fix.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 019/001/006 audit converged

### Definition of Done
- [ ] Registry + frontmatter + anchor fixes land
- [ ] No regression in existing validator output
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Extract single-source-of-truth (registry) refactor. Additive semantic checks. Alignment fix (anchor parity).
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Rank 1 — Rule registry canonicalization
- [ ] Create `scripts/lib/validator-registry.ts` (or .sh data file) with {rule_id, script_path, severity, description}
- [ ] Update `validate.sh` to dispatch from registry
- [ ] Generate `show_help()` output from registry
- [ ] Regression: same rule set dispatched, same output format

### Phase 2: Rank 2 — Semantic frontmatter validation
- [ ] Update `check-frontmatter.sh` to reject empty `title`/`description`/`trigger_phrases`/`importance_tier`/`contextType`
- [ ] Update `spec-doc-structure.ts:518-567` `requiredPairs` to treat empty-string as missing
- [ ] Allowlist for grandfathering
- [ ] Regression: synthetic empty-field fixtures fail

### Phase 3: Rank 3 — Anchor parity
- [ ] Update `check-anchors.sh` to reject duplicate IDs (match preflight semantics)
- [ ] Pre-scan active packets for latent duplicates; surface before release
- [ ] Regression: synthetic duplicate-anchor fixture fails

### Phase 4: Rank 4 (deferrable) — Reporting split
- [ ] Categorize rules: authored-template vs operational/save-time
- [ ] Coverage matrix output groups by category

### Phase 5: Rank 5 — decision-record.md placeholder
- [ ] Fix frontmatter description in `templates/level_3/decision-record.md:2-4`
- [ ] Regression: template validates cleanly

### Phase 6: Verification
- [ ] Full validator regression green
- [ ] Full mcp_server test suite green
- [ ] Checklist verified
<!-- /ANCHOR:phases -->

### 4.1 Dispatch Command
```
/spec_kit:implement :auto --executor=cli-codex --model=gpt-5.4 --reasoning-effort=high --service-tier=fast --executor-timeout=1800
```

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Registry parse + dispatch | bats / shell |
| Integration | Validator run on packet fixtures | validate.sh |
| Regression | Full mcp_server test suite | vitest |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 019/001/006 audit | Input | Converged |
| Preflight (as reference for anchor parity) | Source | Live |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- Per-rank revert granularity; each rank is independent
<!-- /ANCHOR:rollback -->
