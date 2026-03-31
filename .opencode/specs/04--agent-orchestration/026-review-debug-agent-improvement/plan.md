
---
title: "Plan: Adversarial Self-Check for Review, Debug, Ultra-Think Agents [04--agent-orchestration/026-review-debug-agent-improvement/plan]"
description: "Implementation plan for normalizing the adversarial self-check update across surviving runtime variants."
trigger_phrases:
  - "plan"
  - "adversarial"
  - "review"
  - "debug"
  - "ultra-think"
  - "026"
importance_tier: "important"
contextType: "decision"
---
# Plan: Adversarial Self-Check for Review, Debug, Ultra-Think Agents

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Apply the adversarial self-check protocol to the surviving review, debug, and ultra-think runtime variants, then normalize the spec docs so they describe removed historical variants in prose instead of as live file links.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Canonical, Claude, Gemini-style, and Codex variants remain aligned.
- No out-of-scope agent families are modified.
- The spec folder validates without errors.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

This is a documentation-only protocol update. The canonical `.opencode/agent/` files remain the source of truth, and the surviving runtime-specific variants mirror that guidance.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Update review, debug, and ultra-think guidance in the canonical files.
2. Propagate the same behavioral changes to Claude, Gemini-style, and Codex variants.
3. Verify cross-references, formatting, and variant consistency.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Read the surviving runtime variants and confirm the protocol appears in each.
- Validate Codex TOML files for syntax safety.
- Run `validate.sh` on the spec folder.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `.opencode/agent/review.md`
- `.opencode/agent/debug.md`
- `.opencode/agent/ultra-think.md`
- `.claude/agents/`
- `.agents/agents/`
- `.codex/agents/`
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert only the affected review, debug, and ultra-think runtime variants if the adversarial self-check protocol needs to be withdrawn.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Setup depends on the existing canonical files. Implementation depends on setup. Verification depends on the completed propagation pass.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Estimated Effort |
|-------|------------------|
| Setup | 15 minutes |
| Implementation | 45 minutes |
| Verification | 20 minutes |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

If a variant drifts or a TOML file becomes invalid, revert the affected runtime variant, re-run syntax checks, and keep the spec docs as the audit trail.
<!-- /ANCHOR:enhanced-rollback -->
