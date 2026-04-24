---
title: "...aph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/003-cluster-consumers/checklist]"
description: "Wave B verification items: CHK-B1/B2/B3 per-lane checks + CHK-B-GATE wave gate. All items use canonical [EVIDENCE:] closers with ] per T-EVD-01 contract."
trigger_phrases:
  - "017 wave b checklist"
  - "chk-b1-* verification"
  - "chk-b2-* verification"
  - "chk-b3-* verification"
  - "chk-b-gate"
  - "wave b gate verification"
importance_tier: "critical"
contextType: "implementation"
template_source_hint: "<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/003-cluster-consumers"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Child 002 Wave B checklist scaffolded from parent checklist.md Wave B section"
    next_safe_action: "Verify items during Lane B1/B2/B3 execution"
    blockers: ["Wave A merge prerequisite"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->

# Verification Checklist: Phase 017 Wave B — Cluster Consumers

<!-- ANCHOR:protocol -->
## Protocol

**Legend**: `[ ]` pending • `[x]` verified (with `[EVIDENCE: <commit-hash> <description>]`) • `[~]` partial • `[!]` blocked

**Evidence marker format**: Every completed item MUST close with `[EVIDENCE: <commit-hash> <description>]` — canonical `]` closer per T-EVD-01 contract. Non-canonical `)` closer will fail T-EVD-01 lint in `--strict` mode (activated in Wave C).

**Verification ordering**: Execute checks in lane order but lanes may complete in any order. CHK-B-GATE fires only after ALL 3 lanes verified.

**Parallelism**: Lane B1 / B2 / B3 checks run concurrently in 3 parallel executor tracks (cli-codex primary, cli-copilot fallback 3-concurrent max).

**Wave prerequisite**: Wave A (child 001) MUST be merged to `main` before any Wave B check can verify. If Wave A not merged, mark all items `[!]` with `[EVIDENCE: BLOCKED — Wave A not merged]`.

**Scope**: This checklist covers Wave B only. Wave A items live in child 001; Wave C items live in child 003; Wave D items live in child 004.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

Before starting Wave B, verify prerequisites:

- [ ] Child 001 (Wave A) merged to `main` [EVIDENCE: pending]
- [ ] Wave A artefacts present:
  - [ ] `lib/code-graph/readiness-contract.ts` exists (T-CGC-01) [EVIDENCE: pending]
  - [ ] `hooks/shared-provenance.ts` exists (T-W1-HOK-02) [EVIDENCE: pending]
  - [ ] `lib/governance/scope-governance.ts` canonical normalizer intact after T-SCP-01 collapse [EVIDENCE: pending]
  - [ ] `scripts/core/workflow.ts` canonical-save metadata writer active (T-CNS-01 + T-W1-CNS-04) [EVIDENCE: pending]
- [ ] Wave B spec.md §3 Scope reviewed [EVIDENCE: pending]
- [ ] Wave B plan.md §6 Rollback Strategy understood [EVIDENCE: pending]
- [ ] Wave B atomic-ship constraints (T-W1-CGC-03, T-SAN-01+03) acknowledged [EVIDENCE: pending]
- [ ] `/spec_kit:deep-review :auto` ×7 gate protocol acknowledged (per `feedback_phase_018_autonomous` (user memory)) [EVIDENCE: pending]
- [ ] Operator feedback: 3-concurrent Copilot limit acknowledged [EVIDENCE: pending]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality Gates

Continuous requirements across all 3 lanes:

- [ ] TypeScript compiles without errors (`npx tsc --noEmit`) [EVIDENCE: pending — verify after each task]
- [ ] No new ESLint violations introduced [EVIDENCE: pending]
- [ ] Vitest suite passes on every commit [EVIDENCE: pending]
- [ ] `validate.sh --strict` on 017 folder exits 0 after each lane completes [EVIDENCE: pending]
- [ ] No commented-out code blocks left in modified files [EVIDENCE: pending]
- [ ] No TODO comments added without ticket reference [EVIDENCE: pending]
- [ ] Import ordering preserved (no shuffle outside task scope) [EVIDENCE: pending]
- [ ] No `normalizeScope*` / `getOptionalString` duplicates re-introduced (T-SCP-02 lint enforcement) [EVIDENCE: pending]
- [ ] 4-state `TrustState` vocabulary unchanged — no new values [EVIDENCE: pending]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Gates

Test-coverage verification across Wave B scope:

- [ ] T-CNS-02 vitest: missing-both, missing-one, already-present cases all green [EVIDENCE: pending]
- [ ] T-W1-CNS-05 vitest: 10m boundary fresh/stale cases [EVIDENCE: pending]
- [ ] T-CGC-02 vitest: thrown-exception path produces `readiness_check_crashed` [EVIDENCE: pending]
- [ ] T-W1-CGC-03 vitest: 6 handlers each emit 3-field vocabulary [EVIDENCE: pending]
- [ ] T-W1-CGC-03 shared-contract fixture test: all 6 agree with query.ts [EVIDENCE: pending]
- [ ] T-W1-HOK-01 vitest: Copilot compact-cycle parallel to Claude/Gemini [EVIDENCE: pending]
- [ ] T-SAN-01/03 vitest: 5+ unicode cases (Cyrillic, soft hyphen, zero-width, Greek, combined) [EVIDENCE: pending]
- [ ] T-SAN-02 vitest: NFKC-normalized `"SYST\u0395M:"` detected [EVIDENCE: pending]
- [ ] T-PIN-RET-01 vitest: 3rd attempted, 4th skipped with log signal [EVIDENCE: pending]
- [ ] Cumulative regression: `/spec_kit:deep-review :auto` ×7 ZERO new P0/P1 [EVIDENCE: pending]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security Gates

Security-relevant verification for Wave B trust-boundary touches:

- [ ] T-SAN-01 NFKC normalization blocks homoglyph attacks (Cyrillic `е`, Greek `Ε`, soft hyphen, zero-width space) [EVIDENCE: pending]
- [ ] T-SAN-02 `sanitizeRecoveredPayload` NFKC pass blocks `"SYST\u0395M:"` injection [EVIDENCE: pending]
- [ ] T-W1-HOK-01 Copilot compact-cache propagates trust provenance correctly across compaction boundary [EVIDENCE: pending]
- [ ] T-W1-CGC-03 `trustState` emitted for 6 handlers — no silent fallback to implicit trust [EVIDENCE: pending]
- [ ] T-PIN-RET-01 retry-exhaustion does not mask legitimate failures (signal is observable, not silent drop) [EVIDENCE: pending]
- [ ] No new MCP-args injection surfaces introduced by Wave B handlers [EVIDENCE: pending]
- [ ] No new JSON.parse sinks without Zod validation [EVIDENCE: pending]
- [ ] T-CNS-02 backfill uses path-traversal-safe walk (no `..` escape, no symlink follow outside target tree) [EVIDENCE: pending]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation Gates

Documentation completeness verification:

- [ ] `spec.md` (this child) frozen scope matches Wave B implementation (no scope creep) [EVIDENCE: pending]
- [ ] `plan.md` (this child) lane structure reflects actual execution [EVIDENCE: pending]
- [ ] `tasks.md` (this child) every task has `[EVIDENCE: <commit>]` citation after completion [EVIDENCE: pending]
- [ ] Parent 017 `tasks.md` Wave B section carries same evidence citations [EVIDENCE: pending]
- [ ] Parent 017 `checklist.md` CHK-B1/B2/B3 items reflect Wave B completion state [EVIDENCE: pending]
- [ ] T-RBD-03 design-intent comments reviewed for clarity by second reader [EVIDENCE: pending]
- [ ] `description.json.lastUpdated` refreshed post-Wave-B (meta-verification of Wave A T-CNS-01 itself) [EVIDENCE: pending]
- [ ] `graph-metadata.json.derived.last_save_at` refreshed post-Wave-B [EVIDENCE: pending]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization Gates

- [ ] New files placed in canonical directories:
  - [ ] `lib/enrichment/retry-budget.ts` (T-PIN-RET-01) [EVIDENCE: pending]
  - [ ] `hooks/copilot/compact-cache.ts` (T-W1-HOK-01) [EVIDENCE: pending]
  - [ ] `scripts/memory/backfill-research-metadata.ts` (T-CNS-02) [EVIDENCE: pending]
  - [ ] `scripts/validation/continuity-freshness.ts` (T-W1-CNS-05) [EVIDENCE: pending]
- [ ] No ad-hoc helpers added outside canonical locations [EVIDENCE: pending]
- [ ] Test files co-located with convention (`*.vitest.ts` in `mcp_server/tests/` or `scripts/tests/`) [EVIDENCE: pending]
- [ ] No temporary scratch files left in `scratch/` after Wave B completes [EVIDENCE: pending]
<!-- /ANCHOR:file-org -->

---

## Lane B1 — Cluster B Consumers

### CHK-B1-01 — T-CNS-02 landed

- [ ] `backfill-research-metadata.ts` exists under `.opencode/skill/system-spec-kit/scripts/memory/` [EVIDENCE: pending]
- [ ] All `research/NNN-*/iterations/` directories have `description.json` + `graph-metadata.json` after test-folder run [EVIDENCE: pending]
- [ ] Wired into `generate-context.js` post-save step [EVIDENCE: pending]
- [ ] Runs conditionally when target spec folder has `research/` child (verified by dry-run on folder without `research/`) [EVIDENCE: pending]
- [ ] Vitest covers missing-both, missing-one, already-present cases [EVIDENCE: pending]
- [ ] Missing-only semantics verified — re-run on already-backfilled folder produces zero diff [EVIDENCE: pending]

### CHK-B1-02 — T-W1-CNS-05 landed

- [ ] `scripts/validation/continuity-freshness.ts` exists [EVIDENCE: pending]
- [ ] `validate.sh --strict` warns on stale continuity (induced fixture) [EVIDENCE: pending]
- [ ] Passes for fresh folders [EVIDENCE: pending]
- [ ] 10m boundary is inclusive at 10m exactly, exclusive at 10m+1s [EVIDENCE: pending]
- [ ] Frontmatter parser handles missing `_memory.continuity` block gracefully (warn + continue, not fatal) [EVIDENCE: pending]

### CHK-B1-03 — T-CGC-02 landed

- [ ] `context.ts:98-105` silent catch replaced with `error → 'unavailable'` branch [EVIDENCE: pending]
- [ ] `readiness_check_crashed` reason emitted on thrown exception [EVIDENCE: pending]
- [ ] Vitest covers thrown-exception path [EVIDENCE: pending]
- [ ] Happy-path behavior unchanged (existing vitest fixtures pass unmodified) [EVIDENCE: pending]

### CHK-B1-04 — T-RBD-03 landed

- [ ] `post-insert.ts:344-369` has design-intent comment citing T-RBD-01 / `709727e98` [EVIDENCE: pending]
- [ ] `response-builder.ts:136-201` has matching design-intent comment [EVIDENCE: pending]
- [ ] Post-insert comment explicitly mentions "failure-with-recovery" [EVIDENCE: pending]
- [ ] Response-builder comment explicitly mentions "MCP-client nuance" [EVIDENCE: pending]

### CHK-B1-GATE — Lane B1 checkpoint passed

- [ ] CHK-B1-01..04 all verified [EVIDENCE: pending]
- [ ] `validate.sh --strict` on 017 folder exits 0 after Lane B1 merge [EVIDENCE: pending]
- [ ] No regression in Claude + Gemini existing behavior (smoke test) [EVIDENCE: pending]

---

## Lane B2 — Cluster D + Cluster E

### CHK-B2-01 — T-W1-CGC-03 landed (atomic-ship)

- [ ] `handlers/code-graph/scan.ts` emits `canonicalReadiness` + `trustState` + `lastPersistedAt` [EVIDENCE: pending]
- [ ] `handlers/code-graph/status.ts` emits all three (HIGHEST priority — IS canonical readiness probe) [EVIDENCE: pending]
- [ ] `handlers/code-graph/context.ts` emits all three [EVIDENCE: pending]
- [ ] `handlers/code-graph/ccc-status.ts` emits all three [EVIDENCE: pending]
- [ ] `handlers/code-graph/ccc-reindex.ts` emits all three [EVIDENCE: pending]
- [ ] `handlers/code-graph/ccc-feedback.ts` emits all three [EVIDENCE: pending]
- [ ] All 6 handlers import from `lib/code-graph/readiness-contract.ts` [EVIDENCE: pending]
- [ ] 4-state vocabulary used exclusively (`'live' | 'stale' | 'absent' | 'unavailable'`) [EVIDENCE: pending]
- [ ] Atomic-ship constraint verified (single PR OR staged-stub diff reviewed) [EVIDENCE: pending]
- [ ] `status.ts` parity with Wave A `query.ts` verified via shared-contract fixture test [EVIDENCE: pending]

### CHK-B2-02 — T-W1-HOK-01 landed

- [ ] `hooks/copilot/compact-cache.ts` exists [EVIDENCE: pending]
- [ ] Writes `trustState: 'cached'` via `hooks/shared-provenance.ts` [EVIDENCE: pending]
- [ ] `hooks/copilot/session-prime.ts` reads `payloadContract?.provenance.trustState` at entry [EVIDENCE: pending]
- [ ] Parallel vitest to Claude + Gemini compact-cycle tests passes [EVIDENCE: pending]
- [ ] Order-of-ship verified: Wave A T-W1-HOK-02 landed first [EVIDENCE: pending]
- [ ] No re-inlined `wrapRecoveredCompactPayload` in Copilot path (import-only from shared-provenance) [EVIDENCE: pending]
- [ ] `SharedPayloadTrustState` vocabulary for hooks distinct from code-graph `TrustState` [EVIDENCE: pending]

### CHK-B2-GATE — Lane B2 checkpoint passed

- [ ] CHK-B2-01..02 all verified [EVIDENCE: pending]
- [ ] `grep -l 'trustState' handlers/code-graph/*.ts | wc -l` returns `7` (query.ts from Wave A + 6 from T-W1-CGC-03) [EVIDENCE: pending]
- [ ] `ls hooks/copilot/{compact-cache.ts, session-prime.ts}` both present [EVIDENCE: pending]

---

## Lane B3 — Cluster A + Cluster C + Standalone P1

### CHK-B3-01 — T-SCP-02 landed (lint)

- [ ] ESLint/validate-rule rejects new `normalizeScope*` / `getOptionalString` helpers [EVIDENCE: pending]
- [ ] `scope-governance.ts` exempted [EVIDENCE: pending]
- [ ] Lint passes against current tree post Wave A collapse [EVIDENCE: pending]
- [ ] Scratch-branch smoke test: introducing `const normalizeScopeFoo` fails lint [EVIDENCE: pending]
- [ ] `getOptionalString` parallel smoke test fails lint [EVIDENCE: pending]

### CHK-B3-02 — T-SAN-01 + T-SAN-02 + T-SAN-03 landed

- [ ] `normalizePrompt` applies `.normalize('NFKC')` [EVIDENCE: pending]
- [ ] `normalizePrompt` strips `[\u00AD\u200B-\u200F\uFEFF]` [EVIDENCE: pending]
- [ ] NFKC first, then strip order verified [EVIDENCE: pending]
- [ ] `sanitizeRecoveredPayload` mirrors NFKC pass [EVIDENCE: pending]
- [ ] 5+ unicode test cases present in `gate-3-classifier.vitest.ts`:
  - [ ] Cyrillic `е` [EVIDENCE: pending]
  - [ ] Soft hyphen `\u00AD` [EVIDENCE: pending]
  - [ ] Zero-width space `\u200B` [EVIDENCE: pending]
  - [ ] Greek `Ε` [EVIDENCE: pending]
  - [ ] Combined homoglyph + zero-width [EVIDENCE: pending]
- [ ] p0-a test `it()` block renamed to "Claude and Gemini consumers" [EVIDENCE: pending]
- [ ] Schema-share note added for OpenCode in p0-a test [EVIDENCE: pending]
- [ ] Atomic-ship verified: T-SAN-01 + T-SAN-03 in single merge commit [EVIDENCE: pending]

### CHK-B3-03 — T-PIN-RET-01 landed

- [ ] `lib/enrichment/retry-budget.ts` exists [EVIDENCE: pending]
- [ ] Counter keyed on `(memoryId, step, reason)` tuple [EVIDENCE: pending]
- [ ] Skip after N=3 retries for `partial_causal_link_unresolved` [EVIDENCE: pending]
- [ ] Structured warning log on exhaustion (`retry_exhausted` signal) [EVIDENCE: pending]
- [ ] Vitest: 3rd attempted, 4th skipped with log [EVIDENCE: pending]
- [ ] Counter scope is per-process / per-enrichment-context [EVIDENCE: pending]
- [ ] Counter does not persist across process restart (documented in code comment) [EVIDENCE: pending]

### CHK-B3-GATE — Lane B3 checkpoint passed

- [ ] CHK-B3-01..03 all verified [EVIDENCE: pending]
- [ ] T-SAN atomic-ship verified (single merge commit) [EVIDENCE: pending]
- [ ] Gate 3 classifier passes all new unicode cases + no regression on existing English cases [EVIDENCE: pending]

---

<!-- ANCHOR:summary -->
## Summary Gate — CHK-B-GATE

Wave B completion gate — fires only after ALL 3 lanes verified:

- [ ] CHK-B1-GATE passed (Lane B1 complete) [EVIDENCE: pending]
- [ ] CHK-B2-GATE passed (Lane B2 complete) [EVIDENCE: pending]
- [ ] CHK-B3-GATE passed (Lane B3 complete) [EVIDENCE: pending]
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave B scope emits ZERO new P0 [EVIDENCE: pending]
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave B scope emits ZERO new P1 [EVIDENCE: pending]
- [ ] Final validator run: `validate.sh --strict` on 017 folder exits 0 with 0 warnings [EVIDENCE: pending]
- [ ] T-W1-CGC-03 atomic-ship verified (`git log --follow handlers/code-graph/`) [EVIDENCE: pending]
- [ ] T-W1-HOK-01 ordering verified (T-W1-HOK-02 landed first) [EVIDENCE: pending]
- [ ] T-SAN-01 + T-SAN-03 atomic-ship verified (single merge commit) [EVIDENCE: pending]
- [ ] Parent 017 `implementation-summary.md` updated with Wave B outcomes [EVIDENCE: pending]
- [ ] Parent 017 `checklist.md` Wave B section marked `[x]` with evidence citations [EVIDENCE: pending]
- [ ] Parent 017 `tasks.md` Wave B section marked `[x]` with evidence citations [EVIDENCE: pending]
- [ ] All 5 Wave B FCs (FC-3, FC-4, FC-5, FC-6, FC-8) verified as satisfied [EVIDENCE: pending]
- [ ] Wave C (child 003) kickoff unblocked [EVIDENCE: pending]
- [ ] Cluster E closure confirmed — autonomous Copilot iteration clearance verified [EVIDENCE: pending]

### Cluster-level resolution crosswalk

- [ ] **Cluster A** R4-P1-001 prevention — T-SCP-02 lint active [EVIDENCE: pending]
- [ ] **Cluster B** R3-P1-002 + R56-P1-NEW-003 — T-CNS-02 complete; research iteration folders visible [EVIDENCE: pending]
- [ ] **Cluster B** R51-P1-003 — T-W1-CNS-05 complete; freshness validator warns on drift [EVIDENCE: pending]
- [ ] **Cluster B** R6-P1-001 (partial) — T-CGC-02 complete; context.ts explicit error branch [EVIDENCE: pending]
- [ ] **Cluster B** R6-P2-001 — T-RBD-03 complete; design-intent comments at rollup sites [EVIDENCE: pending]
- [ ] **Cluster C** R2-P1-002 + R3-P2-003 + R5-P2-001 — T-SAN-01 + T-SAN-03 complete [EVIDENCE: pending]
- [ ] **Cluster C** R2-P2-001 — T-SAN-02 complete [EVIDENCE: pending]
- [ ] **Cluster D** R52-P1-001 — T-W1-CGC-03 complete; 6-sibling readiness propagation [EVIDENCE: pending]
- [ ] **Cluster E** R52-P1-002 + R56-P1-NEW-002 — T-W1-HOK-01 complete; Copilot compact-cache present [EVIDENCE: pending]
- [ ] **Standalone** R1-P1-002 — T-PIN-RET-01 complete; retry-exhaustion counter active [EVIDENCE: pending]

### Compound-hypothesis contributions (Wave B subset)

- [ ] H-56-4 (Copilot silent-failure cluster) — contribution from T-W1-HOK-01 + T-PIN-RET-01 [EVIDENCE: pending]
- [ ] H-56-5 (research-iteration folders invisible) — contribution from T-CNS-02 [EVIDENCE: pending]
<!-- /ANCHOR:summary -->

---

## Summary counts

| Category | Items | Status |
|----------|-------|--------|
| Pre-implementation | 7 groups | 0/7 |
| Code quality gates | 9 items | 0/9 |
| Testing gates | 10 items | 0/10 |
| Security gates | 8 items | 0/8 |
| Documentation gates | 8 items | 0/8 |
| File organization gates | 4 groups | 0/4 |
| Lane B1 (CHK-B1-01..04 + gate) | 5 groups | 0/5 |
| Lane B2 (CHK-B2-01..02 + gate) | 3 groups | 0/3 |
| Lane B3 (CHK-B3-01..03 + gate) | 4 groups | 0/4 |
| Summary gate (CHK-B-GATE) | 15 items | 0/15 |
| Cluster crosswalk | 10 items | 0/10 |
| **Total Wave B verification items** | **~85 CHK items across 13 groups** | **0/85 verified** |
