---
title: "Implementation Plan: Phase 2 -- sk-deep-review Improvements [template:level_1/plan.md]"
description: "Implement the review-mode contract alignment across deep-review docs, assets, workflow YAML, runtime mirrors, packet tests, and packet closeout docs, then verify the phase folder with strict validation."
trigger_phrases:
  - "deep review plan"
  - "phase 2 plan"
  - "review reducer plan"
  - "review parity plan"
  - "runtime mirror plan"
importance_tier: "high"
contextType: "general"
---
# Implementation Plan: Phase 2 -- sk-deep-review Improvements

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON, TOML, TypeScript |
| **Framework** | Spec Kit workflow assets, runtime mirror agents, packet-local Vitest guards |
| **Storage** | Disk-first review packet files under `review/` plus packet docs under this phase folder |
| **Testing** | Vitest contract tests, strict packet validation, stale-name sweep, diff integrity checks |

### Overview
This phase updates the deep-review contract where it is actually expressed today: skill docs, references, assets, workflow YAML, runtime mirrors, operator playbook scenarios, and packet-local tests. After those surfaces are aligned, the phase packet itself is rebuilt into the active Level 1 template and revalidated so the named spec folder can close as fully complete.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent review recommendations are available from [../research/recommendations-sk-deep-review.md](../research/recommendations-sk-deep-review.md).
- [x] All named deep-review target surfaces are readable in the workspace.
- [x] The repo provides a strict packet validator and an existing Vitest test harness under [../../../../skill/system-spec-kit/scripts/tests/](../../../../skill/system-spec-kit/scripts/tests/).

### Definition of Done
- [x] Deep-review docs, assets, workflow YAML, runtime mirrors, and operator playbook surfaces are aligned to the canonical review contract.
- [x] Reducer/parity/severity schema checks exist as executable Vitest coverage and pass.
- [x] This phase packet validates under the strict Spec Kit validator and records complete task tracking in [tasks.md](./tasks.md) and [implementation-summary.md](./implementation-summary.md).
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative review contract plus runtime-mirror parity plus packet-local verification

### Key Components
- **Skill and references**: [../../../../skill/sk-deep-review/SKILL.md](../../../../skill/sk-deep-review/SKILL.md), [../../../../skill/sk-deep-review/README.md](../../../../skill/sk-deep-review/README.md), and the `references/` files define the durable review-mode packet contract.
- **Workflow assets**: [../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_auto.yaml) and [../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml](../../../../command/spec_kit/assets/spec_kit_deep-review_confirm.yaml) encode lifecycle, migration, reducer refresh, and synthesis rules.
- **Runtime mirrors**: [../../../../agent/deep-review.md](../../../../agent/deep-review.md), [../../../../../../.claude/agents/deep-review.md](../../../../../../.claude/agents/deep-review.md), [../../../../../../.gemini/agents/deep-review.md](../../../../../../.gemini/agents/deep-review.md), and [../../../../../../.codex/agents/deep-review.toml](../../../../../../.codex/agents/deep-review.toml) must all consume the same packet contract.
- **Verification surfaces**: The new Vitest guards under [../../../../skill/system-spec-kit/scripts/tests/](../../../../skill/system-spec-kit/scripts/tests/) enforce parity, reducer schema, lifecycle, and severity stability.

### Data Flow
The workflow YAML initializes or resumes a `review/` packet, dispatches a single-iteration `@deep-review` mirror, and refreshes reducer-owned state surfaces after each iteration. This phase hardens the contract around those handoffs, then records the verified result inside the phase packet itself so packet completion and runtime completion agree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Load the parent phase context and review recommendations.
- [x] Inspect current deep-review skill, asset, workflow, runtime-mirror, and playbook surfaces for drift.
- [x] Inspect the phase packet itself for strict-validation gaps.

### Phase 2: Core Implementation
- [x] Apply canonical naming, lifecycle, reducer, registry, release-readiness, and ownership updates across the deep-review target surfaces.
- [x] Align all four runtime mirrors and both workflow assets to the same review packet contract.
- [x] Normalize stale operator playbook scenarios so they teach the canonical review-mode artifact names.
- [x] Add executable parity and reducer/severity schema tests.
- [x] Restore this phase packet to the active Level 1 template and add an implementation summary.

### Phase 3: Verification
- [x] Run packet-local Vitest coverage for parity and reducer/schema enforcement.
- [x] Run strict packet validation on this phase folder.
- [x] Run stale-name and diff-integrity checks for the named deep-review surfaces.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parity contract test | Canonical naming, lifecycle terms, and mirror parity | `npx vitest run --config ../mcp_server/vitest.config.ts tests/deep-review-contract-parity.vitest.ts` |
| Reducer/schema contract test | Reducer inputs/outputs, release-readiness, severity schema, and synthesis guidance | `npx vitest run --config ../mcp_server/vitest.config.ts tests/deep-review-reducer-schema.vitest.ts` |
| Packet validation | This phase folder only | `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` |
| Integrity sweeps | Named review surfaces only | `rg` stale-name audit and `git diff --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| [../research/recommendations-sk-deep-review.md](../research/recommendations-sk-deep-review.md) | Internal | Green | Lifecycle and reducer wording would drift from the parent packet |
| Deep-review runtime mirrors and workflow assets | Internal | Green | Cross-runtime parity could not be verified |
| Vitest harness under [../../../../skill/system-spec-kit/scripts/tests/](../../../../skill/system-spec-kit/scripts/tests/) | Internal | Green | Reducer/parity verification would be documentation-only instead of executable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The new Vitest guards fail, strict packet validation fails, or the runtime contract becomes less consistent after edits.
- **Procedure**: Revert the scoped deep-review and packet-doc changes, then re-apply only the validated contract updates once the failing surface is isolated.
<!-- /ANCHOR:rollback -->

---
