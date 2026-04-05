---
title: "Tasks: Phase 2 -- sk-deep-review Improvements [template:level_1/tasks.md]"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "deep review tasks"
  - "phase 2 tasks"
  - "review reducer tasks"
  - "review parity tasks"
importance_tier: "high"
contextType: "general"
---
# Tasks: Phase 2 -- sk-deep-review Improvements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Review parent recommendations and current deep-review contract surfaces ([../research/recommendations-sk-deep-review.md](../research/recommendations-sk-deep-review.md), named target files)
- [x] T002 Audit the named phase packet for strict-validation gaps (`spec.md`, `plan.md`, `tasks.md`)
- [x] T003 [P] Inspect workflow YAML, runtime mirrors, and operator playbook surfaces for naming, lifecycle, reducer, and release-readiness drift ([../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml), [../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml), runtime mirrors, playbook docs)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Freeze canonical `deep-review-*` naming and `.deep-review-pause` across the deep-review docs, references, assets, and playbook surfaces ([../../../../skill/sk-deep-review/](../../../../skill/sk-deep-review/))
- [x] T005 Add lineage, lifecycle, migration, reducer, registry, and release-readiness semantics to both deep-review workflow assets ([../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml), [../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml))
- [x] T006 Align all four runtime mirrors to the canonical review packet contract ([../../../../agent/deep-review.md](../../../../agent/deep-review.md), [../../../../../../.claude/agents/deep-review.md](../../../../../../.claude/agents/deep-review.md), [../../../../../../.gemini/agents/deep-review.md](../../../../../../.gemini/agents/deep-review.md), [../../../../../../.codex/agents/deep-review.toml](../../../../../../.codex/agents/deep-review.toml))
- [x] T007 Mark reducer-owned sections and machine-owned boundaries in the strategy/dashboard contract surfaces and synthesis guidance ([../../../../skill/sk-deep-review/assets/deep_review_strategy.md](../../../../skill/sk-deep-review/assets/deep_review_strategy.md), [../../../../skill/sk-deep-review/assets/deep_review_dashboard.md](../../../../skill/sk-deep-review/assets/deep_review_dashboard.md), workflow YAML, [../../../../skill/sk-deep-review/assets/review_mode_contract.yaml](../../../../skill/sk-deep-review/assets/review_mode_contract.yaml))
- [x] T008 Add executable parity coverage for the deep-review contract ([../../../../skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts](../../../../skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts))
- [x] T009 Add executable reducer, lifecycle, and severity-schema coverage for the deep-review contract ([../../../../skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts](../../../../skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts))
- [x] T010 Restore this phase packet to the active Level 1 template and add a complete implementation summary (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run the deep-review parity contract test (`npx vitest run --config ../mcp_server/vitest.config.ts tests/deep-review-contract-parity.vitest.ts`)
- [x] T012 Run the deep-review reducer and schema contract test (`npx vitest run --config ../mcp_server/vitest.config.ts tests/deep-review-reducer-schema.vitest.ts`)
- [x] T013 Re-run strict packet validation until this phase folder is fully green (`bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/002-sk-deep-review-improvements --strict`)
- [x] T014 Confirm stale-name migration references remain only in the intentional scratch migration path and packet closeout artifacts stay diff-clean (`rg` sweep, `git diff --check`)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](./spec.md)
- **Plan**: See [plan.md](./plan.md)
- **Implementation Summary**: See [implementation-summary.md](./implementation-summary.md)
- **Parent Research**: See [../research/recommendations-sk-deep-review.md](../research/recommendations-sk-deep-review.md)
<!-- /ANCHOR:cross-refs -->

---
