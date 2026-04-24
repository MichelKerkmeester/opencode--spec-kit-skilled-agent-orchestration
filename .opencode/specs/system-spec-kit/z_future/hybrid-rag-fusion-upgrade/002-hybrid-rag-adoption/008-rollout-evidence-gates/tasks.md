---
title: "Tasks [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/008-rollout-evidence-gates/tasks]"
description: "1. Define the gate categories and evidence expectations in spec.md."
trigger_phrases:
  - "tasks"
  - "008"
  - "rollout"
importance_tier: "normal"
contextType: "implementation"
---
# Tasks: 008-rollout-evidence-gates

1. Define the gate categories and evidence expectations in `spec.md`.
2. Bind gate ownership to real handler and validator files in `plan.md`.
3. Add tasks for CI-lane naming, rollback triggers, and threshold capture in `tasks.md`.
4. Verify the phase remains evidence-only with `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/999-hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/008-rollout-evidence-gates --strict`.
