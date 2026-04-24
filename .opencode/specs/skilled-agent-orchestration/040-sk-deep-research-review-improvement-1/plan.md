---
title: "Implementation Plan: 040 Auto Deep [skilled-agent-orchestration/040-sk-deep-research-review-improvement-1/plan]"
description: "Two sequential phases: Phase 1 establishes the deep-research contract (lineage, reducer, parity), Phase 2 brings deep-review to the same model."
trigger_phrases:
  - "040 plan"
  - "deep research review plan"
  - "reducer parity plan"
importance_tier: "important"
contextType: "general"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/040-sk-deep-research-review-improvement-1"
    last_updated_at: "2026-04-24T15:25:01Z"
    last_updated_by: "backfill-memory-block"
    recent_action: "Backfilled _memory block (repo-wide frontmatter sweep)"
    next_safe_action: "Revalidate packet docs and update continuity on next save"
    key_files: ["plan.md"]
---
# Implementation Plan: 040 Auto Deep Research / Review Improvement

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON, TOML, TypeScript, JavaScript (CJS) |
| **Framework** | Spec Kit workflow assets, runtime mirror agents, Vitest contract guards |
| **Storage** | Disk-first packet files under `research/` and `review/` |
| **Testing** | Vitest contract tests, strict packet validation, stale-name sweep |

### Overview
Two sequential phases bring `sk-deep-research` and `sk-deep-review` to explicit, testable packet contracts. Phase 1 establishes the lineage schema and reducer interface for deep-research. Phase 2 adopts the same model for deep-review and adds release-readiness semantics. Both phases were executed as one-pass workflows with sequential sub-phases.

```
Phase 1 (sk-deep-research) — COMPLETE
  A: Schema + Naming --> B: Lifecycle --> C: Reducer + Registry --> D: Runtime + Hardening
       |                                        |
       | (lineage schema)                       | (reducer interface)
       v                                        v
Phase 2 (sk-deep-review) — COMPLETE
  A: Naming + Migration --> B: Lifecycle + Registry --> C: Reducer + Lineage --> D: Parity + Polish
```
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research packet completed (90 iterations, 0.92 confidence)
- [x] Skill-specific recommendations available for both skills
- [x] All named target surfaces readable in workspace

### Definition of Done
- [x] Both skills operate under canonical naming with no stale cross-references
- [x] Lineage, lifecycle, reducer, and release-readiness semantics propagated to all active surfaces
- [x] All four runtime mirrors synchronized and under Vitest guard
- [x] Both phase folders pass strict packet validation
- [x] Root packet documents reflect complete status with verification evidence
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative packet contract plus runtime-mirror parity plus executable verification

### Key Components
- **Phase 1 — [`001-sk-deep-research-improvements/`](./001-sk-deep-research-improvements/)**: Skill docs, references, assets, executable helpers (`reduce-state.cjs`, `runtime-capabilities.cjs`), runtime mirrors, workflow YAML, Vitest parity and reducer coverage
- **Phase 2 — [`002-sk-deep-review-improvements/`](./002-sk-deep-review-improvements/)**: Skill docs, references, assets, `review_mode_contract.yaml`, runtime mirrors, workflow YAML, Vitest parity and reducer/schema coverage

### Data Flow
Phase 1 defined the lineage schema (`sessionId`, `parentSessionId`, `lineageMode`, `generation`, `continuedFromRun`) and reducer interface (`inputs → outputs`). Phase 2 adopted both for review dimensions and added release-readiness states (`in-progress`, `converged`, `release-blocking`). Both phases synchronized their contract across docs, workflow YAML, and all four runtime mirrors.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: sk-deep-research — Complete
Full details: [`001-sk-deep-research-improvements/plan.md`](./001-sk-deep-research-improvements/plan.md)
- [x] Sub-phase A: Lineage schema + naming freeze + migration layer
- [x] Sub-phase B: All 4 lifecycle branches (resume, restart, fork, completed-continue)
- [x] Sub-phase C: Deterministic reducer + findings registry + dashboard sync
- [x] Sub-phase D: Capability matrix + portability + parity checks + surface audit + ownership

### Phase 2: sk-deep-review — Complete
Full details: [`002-sk-deep-review-improvements/plan.md`](./002-sk-deep-review-improvements/plan.md)
- [x] Sub-phase A: Review naming freeze + migration layer
- [x] Sub-phase B: All 4 lifecycle branches + review findings registry + dimension tracking
- [x] Sub-phase C: Review reducer + lineage adoption + dimension coverage validation
- [x] Sub-phase D: Parity gates + naming separation + release readiness + operator guidance

### Phase 3: Verification — Complete
- [x] All four Vitest contract test files pass
- [x] Both phase folders pass strict packet validation
- [x] Stale-name sweep confirms legacy names only in scratch migration paths
- [x] Root packet documents updated with verification evidence
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Parity contract | Canonical naming, lifecycle, mirror parity | `deep-research-contract-parity.vitest.ts`, `deep-review-contract-parity.vitest.ts` |
| Reducer/schema | Reducer I/O, severity, release-readiness | `deep-research-reducer.vitest.ts`, `deep-review-reducer-schema.vitest.ts` |
| Packet validation | Phase folders | `validate.sh --strict` |
| Integrity sweep | Named surfaces | `rg` stale-name audit, `git diff --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 90-iteration research packet | Internal | Green | Phase design would lack evidence base |
| Phase 1 → Phase 2 (lineage schema, reducer interface) | Internal | Green | Phase 2 could not adopt the contract model |
| Runtime mirrors across 4 runtimes | Internal | Green | Cross-runtime parity could not be verified |
| Vitest harness | Internal | Green | Verification would be documentation-only |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Vitest guards fail, strict validation fails, or runtime contract becomes less consistent after edits.
- **Procedure**: Revert the scoped skill, mirror, and workflow changes, then re-apply only the validated contract updates once the failing surface is isolated.
<!-- /ANCHOR:rollback -->

---
