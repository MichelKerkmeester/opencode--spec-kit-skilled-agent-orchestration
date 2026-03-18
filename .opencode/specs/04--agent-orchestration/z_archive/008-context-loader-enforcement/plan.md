---
title: "Plan: Aggressive @context_loader Enforcement [008-context-loader-enforcement/plan]"
description: "Full audit of all agent and command files, applying the aggressive enforcement rule from spec.md §3. Each @explore reference is classified as KEEP (rule-compliant) or REPLACE (s..."
trigger_phrases:
  - "plan"
  - "aggressive"
  - "context"
  - "loader"
  - "enforcement"
  - "008"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: Aggressive @context_loader Enforcement

> **Spec Folder:** `.opencode/specs/04--agent-orchestration/z_archive/008-context-loader-enforcement/`
> **Created:** 2026-02-11

---

<!-- ANCHOR:summary -->
## 1. Approach

Full audit of all agent and command files, applying the aggressive enforcement rule from spec.md §3. Each @explore reference is classified as KEEP (rule-compliant) or REPLACE (should be @context_loader).

<!-- /ANCHOR:summary -->

<!-- ANCHOR:phases -->
## 2. Implementation Strategy

### Phase 1: Audit
- Search ALL agent files for `@explore` / `explore` references
- Search ALL command files in both `.claude/commands/` and `.opencode/command/`
- Deep-read orchestrate.md's 9 "intentional" references in full surrounding context

### Phase 2: Classify
- Apply the enforcement rule to each reference
- Categorize as KEEP or REPLACE with rationale

### Phase 3: Apply
- Make all REPLACE changes
- Verify no regressions

### Phase 4: Document
- Update tasks.md with results
- Create implementation-summary.md

<!-- /ANCHOR:phases -->
