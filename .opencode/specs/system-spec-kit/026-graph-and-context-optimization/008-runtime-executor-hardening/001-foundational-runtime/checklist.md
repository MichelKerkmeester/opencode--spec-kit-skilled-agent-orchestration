---
title: "Verification Checklist: Phase 017 Review-Findings Remediation"
description: "P0/P1/P2 verification items for all 27 remediation tasks + compound hypothesis sign-off. All items use canonical [EVIDENCE:] closers with ] per T-EVD-01 contract."
trigger_phrases: ["017 checklist", "phase 017 verification", "h-56-1 verification"]
importance_tier: "critical"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime"
    last_updated_at: "2026-04-17T14:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Checklist scaffolded from tasks.md acceptance criteria"
    next_safe_action: "Verify items during Wave A/B/C/D implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Verification Checklist: Phase 017 Review-Findings Remediation

<!-- ANCHOR:protocol -->
## Protocol

**Legend**: `[ ]` pending • `[x]` verified (with `[EVIDENCE: <commit-hash> <description>]`) • `[~]` partial • `[!]` blocked

**Evidence marker format**: Every completed item MUST close with `[EVIDENCE: <commit-hash> <description>]` — canonical `]` closer per T-EVD-01 contract. Non-canonical `)` closer will fail T-EVD-01 lint in `--strict` mode.

**Verification ordering**: Execute checks in wave order (A → B → C → D). Each wave's gate (CHK-*-GATE) MUST pass before proceeding to the next wave.

**Compound-hypothesis resolution**: CHK-H-01..05 track the 5 compound hypotheses from iter 56. H-56-2 is pre-refuted; others resolve as their constituent tasks land.

**Final ship gate**: CHK-SHIP-01..04 represent the verdict-upgrade sign-off — CONDITIONAL → PASS transition.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Before starting Wave A, verify prerequisites:

- [ ] Spec.md §4 Success Criteria reviewed and approved [EVIDENCE: pending]
- [ ] Plan.md §6 Rollback Strategy understood by implementer [EVIDENCE: pending]
- [ ] Tasks.md effort budget confirmed realistic (6 working days critical path) [EVIDENCE: pending]
- [ ] Atomic-ship groups identified in plan.md §1.9 Dependencies [EVIDENCE: pending]
- [ ] `/spec_kit:deep-review :auto` ×7 gate protocol acknowledged (per feedback_phase_018_autonomous.md) [EVIDENCE: pending]
- [ ] Operator-constraint feedback files reviewed [EVIDENCE: pending]
- [ ] Pre-sweep backup strategy for T-CNS-03 documented [EVIDENCE: pending]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Gates

Continuous requirements across all waves:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`) [EVIDENCE: pending — verify after each task]
- [ ] No new ESLint violations introduced [EVIDENCE: pending]
- [ ] Vitest suite passes on every commit [EVIDENCE: pending]
- [ ] `validate.sh --strict` on 017 folder exits 0 after each wave [EVIDENCE: pending]
- [ ] No commented-out code blocks left in modified files [EVIDENCE: pending]
- [ ] No TODO comments added without ticket reference [EVIDENCE: pending]
- [ ] Import ordering preserved (no shuffle outside task scope) [EVIDENCE: pending]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Gates

Test-coverage verification across all waves:

- [ ] T-CNS-01 vitest: monotonic `lastUpdated` advancement [EVIDENCE: pending]
- [ ] T-CGC-01 vitest: shared-contract fixture parity [EVIDENCE: pending]
- [ ] T-W1-CGC-03 vitest: 6 sibling handlers emit 4-state vocabulary [EVIDENCE: pending]
- [ ] T-W1-HOK-01 vitest: Copilot compact-cycle parallel to Claude/Gemini [EVIDENCE: pending]
- [ ] T-SAN-01/03 vitest: 5+ unicode cases [EVIDENCE: pending]
- [ ] T-PIN-RET-01 vitest: 3rd retry, 4th skipped [EVIDENCE: pending]
- [ ] T-SCP-01 vitest: semantic-equivalence matrix (5 input types × 5 sites) [EVIDENCE: pending]
- [ ] Cumulative regression: `/spec_kit:deep-review :auto` ×7 ZERO new P0/P1 per wave [EVIDENCE: pending]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:security -->
## Security Gates

Security-relevant verification for tasks touching trust boundaries:

- [ ] T-SRS-BND-01 — `handleSessionResume` sessionId binding tested with mismatched identities [EVIDENCE: pending]
- [ ] T-SAN-01 NFKC normalization blocks homoglyph attacks (Cyrillic `е`, Greek `Ε`, soft hyphen, zero-width space) [EVIDENCE: pending]
- [ ] T-SAN-02 `sanitizeRecoveredPayload` NFKC pass blocks `"SYST\u0395M:"` injection [EVIDENCE: pending]
- [ ] T-W1-HST-02 Docker `-v /tmp:/tmp` anti-pattern documented [EVIDENCE: pending]
- [ ] No new MCP-args injection surfaces introduced (traversal-check + allow-list preserved) [EVIDENCE: pending]
- [ ] No new JSON.parse sinks without Zod validation [EVIDENCE: pending]
- [ ] All new test files cover the adversarial attack chain (not just happy path) [EVIDENCE: pending]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation Gates

Documentation completeness verification:

- [ ] `spec.md` frozen scope matches implementation (no scope creep) [EVIDENCE: pending]
- [ ] `plan.md` wave structure reflects actual execution order [EVIDENCE: pending]
- [ ] `tasks.md` every task has `[EVIDENCE: <commit>]` citation after completion [EVIDENCE: pending]
- [ ] `implementation-summary.md` populated after Phase 017 completes [EVIDENCE: pending]
- [ ] `description.json.lastUpdated` refreshed post-implementation (meta-test of T-CNS-01 itself!) [EVIDENCE: pending]
- [ ] Changelog entry drafted for v3.4.0.2 release [EVIDENCE: pending]
- [ ] Phase 017 handover.md created if iterations span multiple Claude sessions [EVIDENCE: pending]
- [ ] All T-RBD-03 design-intent comments reviewed for clarity [EVIDENCE: pending]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization Gates

- [ ] New files placed in canonical directories (`lib/code-graph/readiness-contract.ts`, `hooks/shared-provenance.ts`, `lib/enrichment/retry-budget.ts`) [EVIDENCE: pending]
- [ ] No ad-hoc helpers added outside the canonical locations [EVIDENCE: pending]
- [ ] Test files co-located with convention (`*.vitest.ts` in `mcp_server/tests/` or `scripts/tests/`) [EVIDENCE: pending]
- [ ] No temporary scratch files left in `scratch/` after Phase 017 completes [EVIDENCE: pending]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Summary Gate

Final summary verification (end of Phase 017):

- [ ] All 4 ANCHOR:security items verified [EVIDENCE: pending]
- [ ] All 7 ANCHOR:docs items verified [EVIDENCE: pending]
- [ ] All 4 ANCHOR:file-org items verified [EVIDENCE: pending]
- [ ] Final validator run: `validate.sh --strict` on 017 folder exits 0 with 0 warnings [EVIDENCE: pending]
- [ ] Combined ship gate CHK-SHIP-01..04 all green [EVIDENCE: pending]
<!-- /ANCHOR:summary -->

---

## Wave A — Infrastructure Primitives

### CHK-A-01 — T-CNS-01 landed
- [ ] `workflow.ts:1259` no longer contains `const ctxFileWritten = false` stub [EVIDENCE: pending]
- [ ] Description.json update block (1261-1331) runs unconditionally on canonical save [EVIDENCE: pending]
- [ ] `lastUpdated: new Date().toISOString()` written on every successful save [EVIDENCE: pending]
- [ ] Vitest asserts monotonic `lastUpdated` advancement across successive saves [EVIDENCE: pending]

### CHK-A-02 — T-W1-CNS-04 landed
- [ ] `workflow.ts:1333` no longer contains `plannerMode === 'full-auto'` gate on `refreshGraphMetadata` [EVIDENCE: pending]
- [ ] `graph-metadata.json.derived.last_save_at` advances on every `/memory:save` [EVIDENCE: pending]
- [ ] Both plan-only and full-auto modes covered by vitest [EVIDENCE: pending]

### CHK-A-03 — T-CNS-01 + T-W1-CNS-04 atomic-ship verified
- [ ] Both changes in same merge commit (no split-commit landed to main) [EVIDENCE: pending]
- [ ] No transient window observed in staging between description.json writes and graph-metadata refresh [EVIDENCE: pending]

### CHK-A-04 — T-CGC-01 landed
- [ ] `lib/code-graph/readiness-contract.ts` exists with 4 extracted helpers [EVIDENCE: pending]
- [ ] 4-state `TrustState` type exported [EVIDENCE: pending]
- [ ] `query.ts:225-300` refactored to consume shared module [EVIDENCE: pending]
- [ ] `query.ts` behavior unchanged post-refactor (fixture vitest passes) [EVIDENCE: pending]

### CHK-A-05 — T-W1-HOK-02 landed
- [ ] `hooks/shared-provenance.ts` exists with `wrapRecoveredCompactPayload` + provenance helpers [EVIDENCE: pending]
- [ ] `hooks/claude/shared.ts` re-exports from shared module (no own implementation) [EVIDENCE: pending]
- [ ] `hooks/gemini/shared.ts:7` no longer imports from `../claude/shared.js` [EVIDENCE: pending]
- [ ] Existing Claude + Gemini vitest passes [EVIDENCE: pending]

### CHK-A-06 — T-SCP-01 landed
- [ ] `reconsolidation-bridge.ts:228-234` imports from `scope-governance.ts` (no local `normalizeScopeValue`) [EVIDENCE: pending]
- [ ] `lineage-state.ts:198-204` imports canonical normalizer [EVIDENCE: pending]
- [ ] `save/types.ts:348-352` imports canonical normalizer [EVIDENCE: pending]
- [ ] `preflight.ts:440-444` imports canonical normalizer [EVIDENCE: pending]
- [ ] Semantic-equivalence matrix vitest passes for `undefined`, `null`, `""`, whitespace, non-string [EVIDENCE: pending]

### CHK-A-07 — T-EVD-01-prep completed
- [x] `grep -c '\[EVIDENCE:.*\)$' 016-foundational-runtime/001-initial-research/checklist.md` returns `0` [EVIDENCE: 7d85861a0 post-rewrap audit: 372 markers in 016 folder, all OK, 0 malformed, 0 unclosed]
- [x] All rewrapped markers verified via diff review [EVIDENCE: 7d85861a0 commit diff — 210 closer-only rewrites across 3 files (checklist.md +170, plan.md +30, tasks.md +10); parser safety check refuses to rewrite any char that is not `)` at closerOffset]

### CHK-A-08 — Wave A gate passed
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave A scope emits 0 new P0, 0 new P1 [EVIDENCE: pending]
- [ ] `validate.sh --strict` exits 0 with 0 warnings on 017 spec folder [EVIDENCE: pending]

---

## Wave B — Cluster Consumers

### Lane B1 — Cluster B consumers

#### CHK-B1-01 — T-CNS-02 landed
- [ ] `backfill-research-metadata.ts` exists [EVIDENCE: pending]
- [ ] All `research/NNN-*/iterations/` directories have `description.json` + `graph-metadata.json` [EVIDENCE: pending]
- [ ] Wired into `generate-context.js` post-save step [EVIDENCE: pending]
- [ ] Vitest covers missing-both, missing-one, already-present cases [EVIDENCE: pending]

#### CHK-B1-02 — T-W1-CNS-05 landed
- [ ] `validate.sh --strict` warns on stale continuity [EVIDENCE: pending]
- [ ] Passes for fresh folders [EVIDENCE: pending]

#### CHK-B1-03 — T-CGC-02 landed
- [ ] `context.ts:98-105` silent catch replaced with `error → 'unavailable'` branch [EVIDENCE: pending]
- [ ] `readiness_check_crashed` reason emitted on thrown exception [EVIDENCE: pending]

#### CHK-B1-04 — T-RBD-03 landed
- [ ] `post-insert.ts:344-369` has design-intent comment citing T-RBD-01 / `709727e98` [EVIDENCE: pending]
- [ ] `response-builder.ts:136-201` has matching design-intent comment [EVIDENCE: pending]

### Lane B2 — Cluster D + Cluster E

#### CHK-B2-01 — T-W1-CGC-03 landed (atomic-ship)
- [ ] `handlers/code-graph/scan.ts` emits `canonicalReadiness` + `trustState` + `lastPersistedAt` [EVIDENCE: pending]
- [ ] `handlers/code-graph/status.ts` emits all three (HIGHEST priority, IS canonical readiness probe) [EVIDENCE: pending]
- [ ] `handlers/code-graph/context.ts` emits all three [EVIDENCE: pending]
- [ ] `handlers/code-graph/ccc-status.ts` emits all three [EVIDENCE: pending]
- [ ] `handlers/code-graph/ccc-reindex.ts` emits all three [EVIDENCE: pending]
- [ ] `handlers/code-graph/ccc-feedback.ts` emits all three [EVIDENCE: pending]
- [ ] All 6 handlers import from `lib/code-graph/readiness-contract.ts` [EVIDENCE: pending]
- [ ] 4-state vocabulary used exclusively [EVIDENCE: pending]
- [ ] Atomic-ship constraint verified (single PR or stub rollout) [EVIDENCE: pending]

#### CHK-B2-02 — T-W1-HOK-01 landed
- [ ] `hooks/copilot/compact-cache.ts` exists [EVIDENCE: pending]
- [ ] Writes `trustState: 'cached'` via `hooks/shared-provenance.ts` [EVIDENCE: pending]
- [ ] `hooks/copilot/session-prime.ts` reads `payloadContract?.provenance.trustState` [EVIDENCE: pending]
- [ ] Parallel vitest to Claude + Gemini passes [EVIDENCE: pending]
- [ ] Order-of-ship verified: T-W1-HOK-02 landed first [EVIDENCE: pending]

### Lane B3 — Cluster A + Cluster C + Standalone P1

#### CHK-B3-01 — T-SCP-02 landed (lint)
- [ ] ESLint/validate-rule rejects new `normalizeScope*` / `getOptionalString` helpers [EVIDENCE: pending]
- [ ] `scope-governance.ts` exempted [EVIDENCE: pending]
- [ ] Lint passes against current tree [EVIDENCE: pending]

#### CHK-B3-02 — T-SAN-01 + T-SAN-02 + T-SAN-03 landed
- [ ] `normalizePrompt` applies `.normalize('NFKC')` [EVIDENCE: pending]
- [ ] `normalizePrompt` strips `[\u00AD\u200B-\u200F\uFEFF]` [EVIDENCE: pending]
- [ ] `sanitizeRecoveredPayload` mirrors NFKC pass [EVIDENCE: pending]
- [ ] 5+ unicode test cases present in `gate-3-classifier.vitest.ts` [EVIDENCE: pending]
- [ ] p0-a test renamed to "Claude and Gemini consumers" with OpenCode schema-share note [EVIDENCE: pending]

#### CHK-B3-03 — T-PIN-RET-01 landed
- [ ] `lib/enrichment/retry-budget.ts` exists [EVIDENCE: pending]
- [ ] Counter keyed on `(memoryId, step, reason)` [EVIDENCE: pending]
- [ ] Skip after N=3 retries for `partial_causal_link_unresolved` [EVIDENCE: pending]
- [ ] Structured warning log on exhaustion [EVIDENCE: pending]
- [ ] Vitest: 3rd attempted, 4th skipped with log [EVIDENCE: pending]

### CHK-B-GATE — Wave B gate passed
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave B scope emits 0 new P0, 0 new P1 [EVIDENCE: pending]
- [ ] T-W1-CGC-03 atomic-ship verified [EVIDENCE: pending]

---

## Wave C — Rollout + Sweeps

### CHK-C-01 — T-EVD-01 landed
- [ ] `evidence-marker-lint.ts` asserts `[EVIDENCE: ...]` closes with `]` [EVIDENCE: pending]
- [ ] `--strict` mode exits 1 on `)` closer [EVIDENCE: pending]
- [ ] All 16 sibling 026 spec folders pass the lint [EVIDENCE: pending]

### CHK-C-02 — T-CNS-03 landed (16-folder sweep)
- [ ] Test folder sweep verified fresh `lastUpdated` first [EVIDENCE: pending]
- [ ] Remaining 15 folders swept sequentially [EVIDENCE: pending]
- [ ] Per-folder commits in git log [EVIDENCE: pending]
- [ ] Final: 16/16 folders have `lastUpdated ≤ derived.last_save_at + 10m` [EVIDENCE: pending]

### CHK-C-03 — T-CPN-01 landed
- [ ] `closing-pass-notes.md:72-88` CP-002 marked `[STATUS: RESOLVED 2026-04-17]` [EVIDENCE: pending]
- [ ] Cites T-PIN-08 / commit `e774eef07` [EVIDENCE: pending]

### CHK-C-04 — T-W1-MCX-01 landed
- [ ] `readiness` field renamed to `advisoryPreset` in `StructuralRoutingNudgeMeta` OR removed [EVIDENCE: pending]
- [ ] Consumer contract preserved [EVIDENCE: pending]

### CHK-C-05 — T-SRS-BND-01 landed
- [ ] `handleSessionResume` rejects mismatched `args.sessionId` [EVIDENCE: pending]
- [ ] Staged rollout with permissive-mode flag [EVIDENCE: pending]
- [ ] Canary verification before full enable [EVIDENCE: pending]
- [ ] Vitest accept/reject cases pass [EVIDENCE: pending]

### CHK-C-GATE — Wave C gate passed
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave C scope emits 0 new P0, 0 new P1 [EVIDENCE: pending]
- [ ] 16-folder sweep verified end-to-end [EVIDENCE: pending]

---

## Wave D — P2 Maintainability (deferrable)

### CHK-D-01 — T-EXH-01 landed (any subset)
- [ ] `assertNever` helper exists [EVIDENCE: pending]
- [ ] Applied to 8 typed unions (or subset; track partial completion) [EVIDENCE: pending]

### CHK-D-02 — T-PIN-GOD-01 landed
- [ ] `runEnrichmentStep` helper extracted [EVIDENCE: pending]
- [ ] `runPostInsertEnrichment` reduced to ~80 LOC [EVIDENCE: pending]

### CHK-D-03 — T-W1-PIN-02 landed
- [ ] `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` at post-insert.ts:302 [EVIDENCE: pending]

### CHK-D-04 — T-RCB-DUP-01 landed
- [ ] `runAtomicReconsolidationTxn` helper extracted [EVIDENCE: pending]

### CHK-D-05 — T-YML-CP4-01 landed
- [ ] Prose `when:` at `spec_kit_complete_confirm.yaml:1099` replaced with typed predicate [EVIDENCE: pending]

### CHK-D-06 — T-W1-HST-02 landed
- [ ] Docker `-v /tmp:/tmp` anti-pattern documented [EVIDENCE: pending]

---

## Compound-Hypothesis Resolution Sign-off

### CHK-H-01 — H-56-1 RESOLVED (canonical-save paralysis)
- [ ] All 16 sibling 026 folders have fresh `description.json.lastUpdated` after a `/memory:save` [EVIDENCE: pending]
- [ ] Default `plan-only` mode now refreshes `graph-metadata.json.derived.*` [EVIDENCE: pending]
- [ ] Root cause (workflow.ts:1259 + 1333) eliminated [EVIDENCE: pending]

### CHK-H-02 — H-56-2 (REFUTED in iter 56 — no action required)
- [x] Refuted by iter 56 adversarial self-check — no in-tree caller composes handleCodeGraphContext + handleCodeGraphQuery. Documented in segment-2-synthesis.md §3 [EVIDENCE: segment-2-synthesis.md:65]

### CHK-H-03 — H-56-3 PARTIAL (hook-state reached, CAS not)
- [ ] Hook-state surface addressed via T-W1-HST-02 Docker deployment note [EVIDENCE: pending]
- [x] SQLite CAS surface confirmed not reachable via shared-tmpfs (iter 56) [EVIDENCE: segment-2-synthesis.md:66]

### CHK-H-04 — H-56-4 RESOLVED (Copilot silent-failure cluster)
- [ ] T-W1-HOK-01 + T-W1-HOK-02 landed (Copilot compact-cache + session-prime trustState read) [EVIDENCE: pending]
- [ ] T-PIN-RET-01 landed (retry-exhaustion signal) [EVIDENCE: pending]
- [ ] T-CPN-01 landed (CP-002 telemetry amend) [EVIDENCE: pending]
- [ ] Copilot autonomous-execution pre-req documented in `feedback_phase_018_autonomous` (user memory) honored [EVIDENCE: pending]

### CHK-H-05 — H-56-5 RESOLVED (research-iteration folders invisible)
- [ ] T-CNS-02 landed (research folder backfill) [EVIDENCE: pending]
- [ ] All `research/NNN-*/iterations/` directories have `description.json` + `graph-metadata.json` [EVIDENCE: pending]

---

## Final Ship Gate

### CHK-SHIP-01 — All Wave A+B+C checks green
- [ ] All CHK-A-* items verified [EVIDENCE: pending]
- [ ] All CHK-B*-* items verified [EVIDENCE: pending]
- [ ] All CHK-C-* items verified [EVIDENCE: pending]

### CHK-SHIP-02 — Regression guard
- [ ] `/spec_kit:deep-review :auto` ×7 on full Phase 017 scope emits ZERO new P0 [EVIDENCE: pending]
- [ ] Emits ZERO new P1 [EVIDENCE: pending]
- [ ] Emits ≤3 new P2 (allows minor maintainability regressions) [EVIDENCE: pending]

### CHK-SHIP-03 — Compound hypothesis verdicts
- [ ] H-56-1 marked RESOLVED via CHK-H-01 [EVIDENCE: pending]
- [ ] H-56-3 marked PARTIAL-RESOLVED via CHK-H-03 [EVIDENCE: pending]
- [ ] H-56-4 marked RESOLVED via CHK-H-04 [EVIDENCE: pending]
- [ ] H-56-5 marked RESOLVED via CHK-H-05 [EVIDENCE: pending]

### CHK-SHIP-04 — Verdict upgrade
- [ ] Review-report verdict transitions from CONDITIONAL to PASS [EVIDENCE: pending]
- [ ] `implementation-summary.md` populated with Phase 017 completion narrative [EVIDENCE: pending]
- [ ] Changelog entry drafted for v3.4.0.2 release [EVIDENCE: pending]

---

## Summary counts

| Category | Items | Status |
|----------|-------|--------|
| Wave A checks | 8 groups | 0/8 |
| Wave B checks | 9 groups (3 lanes) | 0/9 |
| Wave C checks | 5 groups | 0/5 |
| Wave D checks | 6 groups | 0/6 (deferrable) |
| Compound-H resolution | 5 items | 1/5 (H-56-2 pre-refuted) |
| Final ship gate | 4 items | 0/4 |
| **Total verification items** | **~90 CHK items across 32 groups** | **~1/90 verified** |
