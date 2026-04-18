---
title: "Verification Checklist: Phase 017 Wave A — Infrastructure Primitives"
description: "Verification items for 5 Wave A tasks (CHK-A-01..08 extracted from parent 017/checklist.md). Canonical ] closers throughout. Code quality, testing, security, docs, and file-org gates for Wave A scope."
trigger_phrases: ["017 wave a checklist", "phase 017 wave a verification", "chk-a-01 through chk-a-08 wave a", "wave a gate verification"]
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/002-infrastructure-primitives"
    parent_packet: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave A child checklist scaffolded; inherits CHK-A-01..08 from parent 017 checklist"
    next_safe_action: "Verify CHK items during Wave A implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Verification Checklist: Phase 017 Wave A — Infrastructure Primitives

> **Parent packet**: `016-foundational-runtime/checklist.md` CHK-A-01..08
> **Child phase**: `001-infrastructure-primitives`

---

<!-- ANCHOR:protocol -->
## Protocol

**Legend**: `[ ]` pending • `[x]` verified (with `[EVIDENCE: <commit-hash> <description>]`) • `[~]` partial • `[!]` blocked

**Evidence marker format**: Every completed item MUST close with `[EVIDENCE: <commit-hash> <description>]` — canonical `]` closer per T-EVD-01 contract. Non-canonical `)` closer will fail T-EVD-01 lint in `--strict` mode when Wave C activates.

**Verification ordering**: Complete items group-by-group (G1 → G2 → G3 → G4 → G5), then CHK-WAVE-A-GATE last. Parent-level items (CHK-SHIP-*) NOT tracked here — they gate cross-wave and belong to the parent packet's checklist.

**Atomic-ship verification**: CHK-A-03 asserts G1 atomic-ship constraint. Failing this check means T-CNS-01 and T-W1-CNS-04 landed as separate commits — revert both and reship as single PR.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Before starting Wave A, verify prerequisites:

- [ ] Parent 017 `spec.md` §4 Success Criteria reviewed and approved [EVIDENCE: pending]
- [ ] Parent 017 `plan.md` §6 Rollback Strategy understood by implementer [EVIDENCE: pending]
- [ ] Wave A child `spec.md` §3 Scope confirmed as authoritative (no drift into Wave B/C/D) [EVIDENCE: pending]
- [ ] Wave A child `plan.md` §2 Quality Gates acknowledged [EVIDENCE: pending]
- [ ] Atomic-ship groups G1..G5 identified and understood [EVIDENCE: pending]
- [ ] `/spec_kit:deep-review :auto` ×7 gate protocol acknowledged (per feedback_phase_018_autonomous.md) [EVIDENCE: pending]
- [ ] Operator-constraint feedback files reviewed (feedback_phase_018_autonomous, feedback_copilot_concurrency_override, feedback_stop_over_confirming, feedback_worktree_cleanliness_not_a_blocker) [EVIDENCE: pending]
- [ ] Dispatcher selected: cli-codex gpt-5.4 xhigh fast (primary) / cli-copilot gpt-5.4 high (fallback, 3-concurrent cap) [EVIDENCE: pending]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Gates

Continuous requirements across Wave A tasks:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`) after every task commit [EVIDENCE: pending]
- [ ] No new ESLint violations introduced [EVIDENCE: pending]
- [ ] Vitest full suite passes on every commit [EVIDENCE: pending]
- [ ] `validate.sh --strict` on 017 folder exits 0 after every task commit [EVIDENCE: pending]
- [ ] No commented-out code blocks left in modified files [EVIDENCE: pending]
- [ ] No TODO comments added without ticket reference [EVIDENCE: pending]
- [ ] Import ordering preserved (no shuffle outside task scope) [EVIDENCE: pending]
- [ ] No ad-hoc helpers added outside canonical locations (readiness-contract.ts, shared-provenance.ts, scope-governance.ts) [EVIDENCE: pending]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Gates

Test-coverage verification across Wave A tasks:

- [ ] T-CNS-01 vitest: monotonic `lastUpdated` advancement across 3 successive saves [EVIDENCE: pending]
- [ ] T-W1-CNS-04 vitest: both plan-only and full-auto modes advance `derived.last_save_at` [EVIDENCE: pending]
- [ ] T-CGC-01 vitest: shared-contract fixture parity (pre/post refactor byte-identical) [EVIDENCE: pending]
- [ ] T-CGC-01 vitest: 4-state `TrustState` exhaustiveness check [EVIDENCE: pending]
- [ ] T-W1-HOK-02 vitest: Claude + Gemini compact-cycle unchanged [EVIDENCE: pending]
- [ ] T-W1-HOK-02 vitest: Gemini `shared.ts` imports from `shared-provenance.ts`, not `claude/shared.ts` [EVIDENCE: pending]
- [ ] T-SCP-01 vitest: semantic-equivalence matrix (5 input types × 4 call sites) [EVIDENCE: pending]
- [ ] T-EVD-01-prep: 016 checklist.md rewrap diff-reviewed for content-only closer change [EVIDENCE: pending]
- [ ] Full vitest suite green on `main` after Wave A merge [EVIDENCE: pending]
- [ ] Wave A gate: `/spec_kit:deep-review :auto` ×7 emits ZERO new P0, ZERO new P1 introduced by Wave A [EVIDENCE: pending]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security Gates

Security-relevant verification for Wave A scope:

- [ ] No new MCP-args injection surfaces introduced (T-CNS-01 + T-W1-CNS-04 write-path changes reviewed for argument sanitization) [EVIDENCE: pending]
- [ ] No new JSON.parse sinks without Zod validation (applies to T-CGC-01 `TrustState` parsing if any external source) [EVIDENCE: pending]
- [ ] `readiness-contract.ts` does not expose internal filesystem paths or trust-state transitions to untrusted callers [EVIDENCE: pending]
- [ ] `shared-provenance.ts` preserves Claude + Gemini trust-boundary semantics (no weakening of `wrapRecoveredCompactPayload` guarantees) [EVIDENCE: pending]
- [ ] `normalizeScopeContext` canonical call sites do not introduce bypass paths for scope-governance checks [EVIDENCE: pending]
- [ ] No secrets or credentials written to `description.json.lastUpdated` or `graph-metadata.json.derived.*` [EVIDENCE: pending]
- [ ] 016 checklist.md rewrap does not alter any evidence-citation commit hashes or descriptions [EVIDENCE: pending]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation Gates

Documentation completeness verification for Wave A:

- [ ] `spec.md` frozen scope matches implementation (no drift into Wave B/C/D) [EVIDENCE: pending]
- [ ] `plan.md` §4 implementation phases reflect actual execution order [EVIDENCE: pending]
- [ ] `tasks.md` every Wave A task has `[EVIDENCE: <commit>]` citation after completion [EVIDENCE: pending]
- [ ] `readiness-contract.ts` has module-level JSDoc documenting exported signatures [EVIDENCE: pending]
- [ ] `shared-provenance.ts` has module-level JSDoc documenting exported signatures [EVIDENCE: pending]
- [ ] Commit messages follow conventional format: `fix(017/A): ...`, `refactor(017/A): ...`, `chore(017/A): ...` [EVIDENCE: pending]
- [ ] Parent 017 `tasks.md` Wave A section updated with evidence citations on Wave A merge [EVIDENCE: pending]
- [ ] Parent 017 `checklist.md` CHK-A-01..08 items updated with evidence citations on Wave A merge [EVIDENCE: pending]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization Gates

- [ ] `readiness-contract.ts` created at `mcp_server/lib/code-graph/` canonical location [EVIDENCE: pending]
- [ ] `shared-provenance.ts` created at `mcp_server/hooks/` canonical location [EVIDENCE: pending]
- [ ] No new helpers added outside `scope-governance.ts` for scope-normalization logic [EVIDENCE: pending]
- [ ] Vitest test files co-located per convention (`*.vitest.ts` in `mcp_server/tests/` or adjacent) [EVIDENCE: pending]
- [ ] No temporary scratch files left in `scratch/` after Wave A completes [EVIDENCE: pending]
- [ ] No `.opencode/specs/` files modified outside 017 folder and 016 checklist.md (T-EVD-01-prep only) [EVIDENCE: pending]
<!-- /ANCHOR:file-org -->

---

## Wave A — Per-Task Verification (CHK-A-01..08)

### CHK-A-01 — T-CNS-01 landed
- [ ] `workflow.ts:1259` no longer contains `const ctxFileWritten = false` stub [EVIDENCE: pending]
- [ ] Description.json update block (1261-1331) runs unconditionally on canonical save [EVIDENCE: pending]
- [ ] `lastUpdated: new Date().toISOString()` written on every successful save [EVIDENCE: pending]
- [ ] Vitest asserts monotonic `lastUpdated` advancement across successive saves [EVIDENCE: pending]
- [ ] `grep 'ctxFileWritten = false' scripts/core/workflow.ts` returns no match [EVIDENCE: pending]

### CHK-A-02 — T-W1-CNS-04 landed
- [ ] `workflow.ts:1333` no longer contains `plannerMode === 'full-auto'` gate on `refreshGraphMetadata` [EVIDENCE: pending]
- [ ] `graph-metadata.json.derived.last_save_at` advances on every `/memory:save` regardless of `plannerMode` [EVIDENCE: pending]
- [ ] Both plan-only and full-auto modes covered by vitest [EVIDENCE: pending]
- [ ] `generate-context.ts:415` default plan-only mode still emits metadata writes [EVIDENCE: pending]

### CHK-A-03 — G1 atomic-ship verified (T-CNS-01 + T-W1-CNS-04)
- [ ] Both changes in same merge commit (no split-commit landed to main) [EVIDENCE: pending]
- [ ] No transient window observed in staging between description.json writes and graph-metadata refresh [EVIDENCE: pending]
- [ ] PR description explicitly names both task IDs and cites R4-P1-002, R51-P1-001, R51-P1-002, R56-P1-upgrade-001 (H-56-1 headline) [EVIDENCE: pending]

### CHK-A-04 — T-CGC-01 landed (G2)
- [ ] `mcp_server/lib/code-graph/readiness-contract.ts` exists with 4 extracted helpers [EVIDENCE: pending]
- [ ] 4-state `TrustState` type exported from shared module [EVIDENCE: pending]
- [ ] `query.ts:225-300` refactored to consume shared module [EVIDENCE: pending]
- [ ] `query.ts` behavior unchanged post-refactor (fixture vitest passes byte-identical) [EVIDENCE: pending]
- [ ] Module-level JSDoc documents exported signatures for Wave B consumers [EVIDENCE: pending]

### CHK-A-05 — T-W1-HOK-02 landed (G3)
- [ ] `mcp_server/hooks/shared-provenance.ts` exists with `wrapRecoveredCompactPayload` + provenance helpers [EVIDENCE: pending]
- [ ] `hooks/claude/shared.ts` re-exports from shared module (no own implementation) [EVIDENCE: pending]
- [ ] `hooks/gemini/shared.ts:7` no longer imports from `../claude/shared.js` [EVIDENCE: pending]
- [ ] Existing Claude + Gemini vitest passes unchanged [EVIDENCE: pending]
- [ ] Module-level JSDoc documents signatures for Wave B Copilot consumer (T-W1-HOK-01) [EVIDENCE: pending]

### CHK-A-06 — T-SCP-01 landed (G4)
- [ ] `reconsolidation-bridge.ts:228-234` imports from `scope-governance.ts` (no local `normalizeScopeValue`) [EVIDENCE: pending]
- [ ] `lineage-state.ts:198-204` imports canonical normalizer [EVIDENCE: pending]
- [ ] `save/types.ts:348-352` imports canonical normalizer [EVIDENCE: pending]
- [ ] `preflight.ts:440-444` imports canonical normalizer [EVIDENCE: pending]
- [ ] Semantic-equivalence matrix vitest passes for `undefined`, `null`, `""`, whitespace, non-string at all 4 call sites [EVIDENCE: pending]
- [ ] `grep -rn 'function normalizeScope' mcp_server/handlers mcp_server/lib/storage mcp_server/lib/validation` returns only `scope-governance.ts` [EVIDENCE: pending]

### CHK-A-07 — T-EVD-01-prep completed (G5)
- [ ] `grep -c '\[EVIDENCE:.*\)$' 016-foundational-runtime/001-initial-research/checklist.md` returns `0` [EVIDENCE: pending]
- [ ] `grep -c '\[EVIDENCE:.*\]$' 016-foundational-runtime/001-initial-research/checklist.md` returns count equal to pre-change completed-CHK count [EVIDENCE: pending]
- [ ] Diff review confirms no content changes beyond closer character [EVIDENCE: pending]

### CHK-A-08 — Wave A gate passed
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave A scope emits 0 new P0, 0 new P1 [EVIDENCE: pending]
- [ ] `validate.sh --strict` exits 0 with 0 warnings on 017 spec folder [EVIDENCE: pending]
- [ ] Full vitest suite green on `main` after all Wave A tasks merged [EVIDENCE: pending]
- [ ] Parent 017 `tasks.md` Wave A section marked complete with evidence [EVIDENCE: pending]

---

## Wave A Ordering Constraints Verification

### CHK-A-ORDER-01 — G3 ordering
- [ ] T-W1-HOK-02 merged BEFORE any Wave B Lane B2 task (T-W1-HOK-01, T-W1-CGC-03) dispatched [EVIDENCE: pending]

### CHK-A-ORDER-02 — G4 ordering
- [ ] T-SCP-01 merged BEFORE T-SCP-02 (Wave B Lane B3 lint) dispatched [EVIDENCE: pending]

### CHK-A-ORDER-03 — G5 ordering
- [ ] T-EVD-01-prep merged BEFORE T-EVD-01 (Wave C) activates `--strict` mode [EVIDENCE: pending]

---

<!-- ANCHOR:summary -->
## Summary Gate

Final verification (Wave A complete):

- [ ] All 5 Wave A tasks marked `[x]` with evidence in `tasks.md` [EVIDENCE: pending]
- [ ] All 8 CHK-A-* items verified with `[EVIDENCE: <commit-hash> <description>]` [EVIDENCE: pending]
- [ ] All 3 CHK-A-ORDER-* items verified [EVIDENCE: pending]
- [ ] Wave A gate passed: `/spec_kit:deep-review :auto` ×7 ZERO new P0/P1 [EVIDENCE: pending]
- [ ] `validate.sh --strict` 017 folder exits 0 with 0 warnings [EVIDENCE: pending]
- [ ] Parent 017 `checklist.md` CHK-A-01..08 mirrored with same evidence [EVIDENCE: pending]
- [ ] Wave B dispatch unblocked; handover note written to parent 017 packet [EVIDENCE: pending]
<!-- /ANCHOR:summary -->

---

## Summary counts

| Category | Items | Status |
|----------|-------|--------|
| Pre-implementation | 8 | 0/8 |
| Code quality gates | 8 | 0/8 |
| Testing gates | 10 | 0/10 |
| Security gates | 7 | 0/7 |
| Documentation gates | 8 | 0/8 |
| File organization gates | 6 | 0/6 |
| CHK-A-01..08 (per-task) | 8 groups / ~35 items | 0/35 |
| Ordering constraints | 3 | 0/3 |
| Summary gate | 7 | 0/7 |
| **Total Wave A items** | **~92** | **0/92** |

---

## Cross-references

- **Parent checklist**: `../checklist.md` — full 017 verification items (this child owns CHK-A-01..08 subset)
- **Parent ship gate**: `../checklist.md` CHK-SHIP-01..04 (cross-wave; NOT tracked here)
- **Compound hypothesis verification**: `../checklist.md` CHK-H-01 (H-56-1) — resolved by Wave A G1 + G4 via eliminating canonical-save paralysis root cause; evidence flows up from CHK-A-01..03

**End of checklist.md**
