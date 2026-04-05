# Changelog: 028/002-sk-deep-review-improvements

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration)

---

## 002-sk-deep-review-improvements — 2026-04-03

This phase brought `sk-deep-review` to the same lineage-aware, reducer-driven contract that Phase 1 established for `sk-deep-research`. It froze canonical `deep-review-*` artifact naming, propagated lifecycle and reducer semantics across all review surfaces, synchronized all four runtime mirrors, and closed the phase packet with executable Vitest guards and strict validation.

> Spec folder: `.opencode/specs/skilled-agent-orchestration/040-sk-auto-deep-research-review-improvement/002-sk-deep-review-improvements/`

---

## Review Contract and Naming (3)

### Canonical review-mode artifact naming is now frozen

**Problem:** The deep-review skill still mixed `deep-research-*` and `deep-review-*` artifact names in docs, references, and assets. Operators tracing the review packet had to guess which naming convention was authoritative.

**Fix:** All review surfaces now use `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `.deep-review-pause`, and `deep-review-dashboard.md`. Legacy `deep-research-*` names survive only in the intentional scratch migration path inside the two workflow YAML assets.

### Lifecycle branches and release-readiness states are now explicit

**Problem:** Review lifecycle modes (`resume`, `restart`, `fork`, `completed-continue`) and release-readiness states (`in-progress`, `converged`, `release-blocking`) were either missing or described inconsistently across the review contract surfaces.

**Fix:** The review mode contract YAML, config asset, skill docs, references, and runtime mirrors all now agree on the same lifecycle vocabulary and release-readiness state machine.

### Reducer ownership is explicit across all review surfaces

**Problem:** It was unclear whether the agent or the workflow reducer owned strategy, registry, and dashboard refreshes. This ambiguity is the same pattern that Phase 1 resolved for deep-research.

**Fix:** The config asset now exposes reducer inputs (`latestJSONLDelta`, `newIterationFile`, `priorReducedState`), outputs (`findingsRegistry`, `dashboardMetrics`, `strategyUpdates`), and metrics (`dimensionsCovered`, `findingsBySeverity`, `openFindings`, `resolvedFindings`, `convergenceScore`). Docs and workflow YAML point to the same reducer contract.

---

## Runtime and Workflow Parity (3)

### All four runtime mirrors now consume the same review packet contract

**Problem:** The OpenCode, Claude, Gemini, and Codex agent definitions could quietly diverge on packet file paths, lifecycle branches, and reducer boundaries if patched independently.

**Fix:** All four mirrors were updated together so they reference `review/deep-review-state.jsonl`, `review/deep-review-findings-registry.json`, `lineageMode`, `releaseReadinessState`, and `completed-continue`. The parity contract test now guards these expectations.

### Workflow YAML encodes migration, reducer refresh, and synthesis in both modes

**Problem:** The auto and confirm workflow assets lacked explicit reducer refresh steps, migration logic for legacy `deep-research-*` packets, and machine-owned report boundary guidance for synthesis.

**Fix:** Both workflow assets now carry `step_reduce_review_state:` with idempotent reducer refresh, dual-read single-write migration from `scratch/` legacy paths, `releaseReadinessState` propagation through synthesis, and machine-owned report marker preservation for `completed-continue` snapshots.

### Manual testing playbook no longer teaches stale review-mode names

**Problem:** Operator playbook scenarios still referenced `deep-research-*` artifact names when describing review-mode behavior, which could mislead operators running review packets.

**Fix:** Stale `deep-research-*` references were removed from the review-mode playbook scenarios so they teach the canonical `deep-review-*` names.

---

## Executable Verification (2)

### Contract parity is now guarded by a focused Vitest suite

**Problem:** Without targeted tests, naming parity, lifecycle terms, and migration boundaries could drift back out of sync while still looking plausible on a manual read.

**Fix:** `deep-review-contract-parity.vitest.ts` checks canonical artifact names, lifecycle terms, and `completed-continue` across primary docs, all four runtime mirrors, and both command assets. It also verifies that legacy `deep-research-*` write paths are absent from review surfaces while scratch migration reads are preserved.

### Reducer, severity, and release-readiness schemas are now locked

**Problem:** The severity weights (`P0=10`, `P1=5`, `P2=1`), reducer inputs/outputs, and release-readiness state machine could change without any test catching the drift.

**Fix:** `deep-review-reducer-schema.vitest.ts` asserts the exact severity, reducer, and release-readiness schemas from both the contract YAML and the config JSON. It also verifies that both workflow assets wire reducer refresh steps, read/write the correct registry paths, and preserve machine-owned report markers.

---

## Packet Closeout (1)

### The phase packet closes with evidence, not deferrals

**Problem:** The original packet docs were not aligned to the active Level 1 template, which meant the spec folder could not pass strict validation and could not be truthfully closed.

**Fix:** `spec.md`, `plan.md`, `tasks.md`, and `implementation-summary.md` were rebuilt to the active Level 1 template. All tasks are marked complete. Strict packet validation passes. The implementation summary records the verification commands and their outcomes.

---

<details>
<summary>Files Changed (full scoped list)</summary>

### Deep-Review Skill, References, and Assets

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-review/SKILL.md` | Froze lifecycle, reducer, release-readiness, and runtime-parity guidance to the canonical review contract. |
| `.opencode/skill/sk-deep-review/README.md` | Published canonical review packet names, lifecycle modes, and operator guidance. |
| `.opencode/skill/sk-deep-review/references/state_format.md` | Defined review packet schemas, reducer metrics, and operator-controlled sentinel behavior. |
| `.opencode/skill/sk-deep-review/references/loop_protocol.md` | Documented reducer sequencing, canonical reducer inputs and outputs, and lifecycle handling. |
| `.opencode/skill/sk-deep-review/references/convergence.md` | Tied convergence output to release-readiness states. |
| `.opencode/skill/sk-deep-review/references/quick_reference.md` | Published canonical state files, lifecycle modes, and readiness terminology. |
| `.opencode/skill/sk-deep-review/assets/deep_review_config.json` | Added canonical reducer metrics and sentinel protection metadata. |
| `.opencode/skill/sk-deep-review/assets/deep_review_strategy.md` | Marked reducer-owned sections and review boundaries. |
| `.opencode/skill/sk-deep-review/assets/deep_review_dashboard.md` | Carried machine-owned metrics and readiness data. |
| `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` | Established the canonical review-mode contract and output paths. |

### Workflow and Runtime Mirrors

| File | What changed |
|------|--------------|
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` | Carried migration logic, lifecycle branches, reducer refresh, and synthesis guidance. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` | Mirrored the same contract for confirm mode. |
| `.opencode/agent/deep-review.md` | Aligned the OpenCode runtime mirror to the canonical review packet contract. |
| `.claude/agents/deep-review.md` | Aligned the Claude runtime mirror to the canonical review packet contract. |
| `.gemini/agents/deep-review.md` | Aligned the Gemini runtime mirror to the canonical review packet contract. |
| `.codex/agents/deep-review.toml` | Aligned the Codex runtime mirror to the canonical review packet contract. |

### Manual Testing Playbook

| File | What changed |
|------|--------------|
| `.opencode/skill/sk-deep-review/manual_testing_playbook/` | Removed stale review-mode `deep-research-*` references from operator scenarios. |

### Focused Verification

| File | What changed |
|------|--------------|
| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-contract-parity.vitest.ts` | Added parity coverage for docs, runtime mirrors, command assets, and migration boundaries. |
| `.opencode/skill/system-spec-kit/scripts/tests/deep-review-reducer-schema.vitest.ts` | Added reducer, lifecycle, severity, and release-readiness schema coverage. |

### Phase Packet

| File | What changed |
|------|--------------|
| `spec.md` | Rebuilt to active Level 1 template with complete requirements and success criteria. |
| `plan.md` | Updated architecture, phases, and test strategy to reflect the delivered contract. |
| `tasks.md` | Marked all 14 tasks complete and closed the completion criteria. |
| `implementation-summary.md` | Recorded the final completion narrative and verification evidence. |

</details>

---

## Upgrade

No migration is required for consumers of the shipped deep-review packet. The main practical change is that the review contract is now unambiguous: one canonical set of artifact names, one lifecycle model, one reducer contract, and one set of runtime mirrors — all backed by executable Vitest guards.
