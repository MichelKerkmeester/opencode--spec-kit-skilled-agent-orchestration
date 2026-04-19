---
title: "Implementation Plan: Phase 017 Review-Findings Remediation"
description: "4-wave implementation plan: Wave A infrastructure primitives (20h), Wave B cluster consumers (30h parallel 3 lanes), Wave C rollout + sweeps (15h), Wave D P2 maintainability (40h deferrable). Critical path ~60h / 6 working days."
trigger_phrases: ["017 phase 017 plan", "wave a infrastructure", "wave b consumers", "wave c rollout", "phase 017 implementation plan"]
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime"
    last_updated_at: "2026-04-17T14:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Plan scaffolded from iter-054 wave structure + segment-2 synthesis §5"
    next_safe_action: "Begin Wave A implementation after spec approval"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phase 017 Review-Findings Remediation

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Phase 017 closes 27 remediation tasks across 4 waves. Wave A (infrastructure primitives, 20h) is the critical-path spine that unblocks Wave B. Wave B (consumers, 30h) runs 3 parallel lanes. Wave C (rollout + sweeps, 15h) performs tree-wide metadata refresh. Wave D (P2 maintainability, 40h) is deferrable. Total effort: ~105h / ~60h critical-path / 6 working days with 1 engineer.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 1.5 QUALITY GATES

After each wave's code-complete, the following gates MUST pass before proceeding:

1. **`/spec_kit:deep-review :auto` ×7** on the wave's scope emits ZERO new P0, ZERO new P1
2. **`validate.sh --strict` on 017 folder** exits 0 with 0 warnings
3. **Atomic-ship groups verified** — no mid-rollout inconsistency windows observed
4. **Vitest suite** passes for all modified modules
5. **Rollback procedure** documented + tested per wave
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 1.6 ARCHITECTURE

### Cluster B infrastructure spine
```
workflow.ts (canonical save driver)
  → refreshPerFolderDescription (fixed: T-CNS-01)
  → refreshGraphMetadata (un-gated: T-W1-CNS-04)
  → backfillResearchMetadata (new: T-CNS-02)
  → validateContinuityFreshness (new: T-W1-CNS-05)
```

### Cluster D readiness contract
```
lib/code-graph/readiness-contract.ts (NEW: T-CGC-01)
  ↑ imported by
query.ts, scan.ts, status.ts, context.ts, ccc-status.ts, ccc-reindex.ts, ccc-feedback.ts
```

### Cluster E hooks provenance
```
hooks/shared-provenance.ts (NEW: T-W1-HOK-02)
  ↑ imported by
hooks/claude/shared.ts, hooks/gemini/shared.ts, hooks/copilot/compact-cache.ts (NEW: T-W1-HOK-01)
```
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 1.7 PHASES (WAVES)

Maps directly to waves A/B/C/D detailed below. Each wave is a discrete phase with its own gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 1.8 TESTING

### Unit tests (vitest)
- `workflow.ts` monotonic `lastUpdated` test
- `readiness-contract.ts` shared-fixture test
- `shared-provenance.ts` Claude/Gemini/Copilot parity test
- `scope-governance.normalizeScopeContext` matrix test
- `retry-budget.ts` 3rd-retry skipped test
- `gate-3-classifier.vitest.ts` +5 unicode cases
- `evidence-marker-lint.vitest.ts` new

### Integration / regression tests
- `/spec_kit:deep-review :auto` ×7 per wave gate
- 16-folder sweep verification (T-CNS-03)
- Copilot compact-cycle end-to-end test

### Manual verification
- Canary `/memory:save` on test folder (pre-Wave C sweep)
- Session-resume permissive-mode canary (T-SRS-BND-01)
- Docker `-v /tmp:/tmp` anti-pattern documented in deployment guide
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 1.9 DEPENDENCIES

### External dependencies (none new)
No new npm packages required.

### Internal file dependencies
See §6 in `spec.md` for the file-collision groups and atomic-ship constraints.

### Phase dependencies
- **Depends on**: Phase 017 (already landed — 27 fix commits since afbb3bc7f)
- **Related**: 015-deep-review-and-remediation (prior audit cycle)
- **Blocks**: Phase 019 changelog + parking-lot P2 items

### Runtime dependencies
- cli-codex gpt-5.4 xhigh fast (primary autonomous executor)
- cli-copilot gpt-5.4 high (fallback, 3-concurrent max)
- Opus 4.7 (manual orchestration + synthesis)

### Operator-constraint dependencies
- `feedback_phase_018_autonomous` (user memory) — DELETE-not-archive, dispatch deep-review ×7 per gate
- `feedback_copilot_concurrency_override` (user memory) — 3 concurrent max
- `feedback_stop_over_confirming` (user memory) — skip A/B/C/D approval menus when obvious
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:overview -->
## 2. OVERVIEW (retained for narrative readability)

27 remediation tasks organized in 4 waves with explicit file-collision grouping, atomic-ship constraints, and rollback procedures. Wave A (20h) is the critical-path infrastructure spine that unblocks Wave B. Wave B (30h) runs 3 parallel lanes after Wave A merges. Wave C (15h) performs tree-wide sweeps + lint activation. Wave D (40h) carries deferrable P2 maintainability. Total: ~105h / ~60h critical-path / 6 working days.

**Execution mode**: Per `feedback_phase_018_autonomous` (user memory), each wave runs under cli-codex primary + cli-copilot fallback (3 concurrent max). After each wave's code-complete, dispatch `/spec_kit:deep-review :auto` ×7 before proceeding to the next wave.
<!-- /ANCHOR:overview -->

---

<!-- ANCHOR:wave-a -->
## 2. WAVE A — INFRASTRUCTURE PRIMITIVES (20h / 2.5 days — CRITICAL PATH)

Blocks everything downstream. No parallelism within this wave (all tasks touch foundational contracts).

### 2.1 T-CNS-01 + T-W1-CNS-04 — Canonical save metadata writer (MERGED PR, 6h, M+M)

**Files**: `.opencode/skill/system-spec-kit/scripts/core/workflow.ts:1259, 1333`, `.opencode/skill/system-spec-kit/scripts/memory/generate-context.ts:415`

**Changes**:
1. Remove `const ctxFileWritten = false` stub at workflow.ts:1259. Wire in actual `savePerFolderDescription` return value.
2. Extend the description.json update block (lines 1261-1331) to write `lastUpdated: new Date().toISOString()` unconditionally on every call.
3. Lift the `plannerMode === 'full-auto'` gate at workflow.ts:1333 — `refreshGraphMetadata` now runs on every canonical save regardless of plannerMode.
4. Add unit test asserting monotonic `lastUpdated` advancement on successive saves.

**Atomic-ship constraint**: Both fixes in ONE PR. Splitting creates a transient window where description.json lastUpdated updates but graph-metadata.json.derived.last_save_at lags (new divergence direction).

**Resolves**: R4-P1-002, R51-P1-001, R51-P1-002, R56-P1-upgrade-001 (H-56-1 headline), partial R3-P2-001, partial R5-P1-001.

### 2.2 T-CGC-01 — Extract lib/code-graph/readiness-contract.ts (4h, M)

**Files**: Create `.opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts` (new); refactor `handlers/code-graph/query.ts:225-300` to consume it.

**Changes**:
1. Extract `canonicalReadinessFromFreshness()`, `queryTrustStateFromFreshness()`, `buildQueryGraphMetadata()`, `buildReadinessBlock()` functions from `query.ts:225-300` into the new shared module.
2. Update `query.ts` to import and use the extracted helpers.
3. Export 4-state `TrustState` type (`'live' | 'stale' | 'absent' | 'unavailable'`) from the new module.
4. Vitest: assert shared contract returns same values as pre-refactor query.ts for fixture inputs.

**Pre-work for T-W1-CGC-03** (Wave B): The shared module is the consumption point for the 5 other code-graph siblings.

**Resolves**: R6-P1-001 (prerequisite for T-W1-CGC-03 follow-on).

### 2.3 T-W1-HOK-02 — Extract hooks/shared-provenance.ts (4h, M)

**Files**: Create `.opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts` (new); refactor `hooks/claude/shared.ts:125-129` + `hooks/gemini/shared.ts:7`.

**Changes**:
1. Move `wrapRecoveredCompactPayload` + related provenance helpers from `hooks/claude/shared.ts` to `hooks/shared-provenance.ts`.
2. Claude + Gemini `shared.ts` re-export from the shared module.
3. Break the Gemini → Claude transitive import (R52-P2-001).
4. Vitest: unchanged behavior for existing Claude + Gemini hooks.

**Pre-work for T-W1-HOK-01** (Wave B): Enables Copilot `compact-cache.ts` to import from `hooks/shared-provenance.ts` directly rather than re-inline the logic.

**Resolves**: R52-P2-001.

### 2.4 T-SCP-01 — Collapse 4 local normalizers to canonical (4h, M)

**Files**: `mcp_server/handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444` — remove local `normalizeScopeValue` / `normalizeScopeMatchValue`. `lib/governance/scope-governance.ts:155-162` — keep canonical `normalizeScopeContext`.

**Changes**:
1. Delete 4 local normalizer definitions.
2. Import and call `normalizeScopeContext` from `lib/governance/scope-governance.ts` at each call site.
3. Vitest: semantic-equivalence matrix for `undefined`, `null`, `""`, whitespace, non-string inputs.

**Resolves**: R1-P1-001 + R4-P1-001 (compound).

### 2.5 T-EVD-01-prep — Rewrap 016 checklist.md evidence markers (2h, S)

**Files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research/checklist.md`

**Changes**: Replace 170/179 `)` closers with `]` via automated find-replace. Verify with `grep -c '\[EVIDENCE:.*\]$'` matches `grep -c '\[EVIDENCE:.*\)$'` pre-change count.

**Must complete before**: T-EVD-01 `--strict` mode activation in Wave C.

**Resolves**: R3-P2-002 (data side only; tool side deferred to T-EVD-01).

### Wave A gate

After Wave A code-complete: `/spec_kit:deep-review :auto` ×7 with focus on `workflow.ts`, `readiness-contract.ts`, `shared-provenance.ts`, `scope-governance.ts`. No regressions in pre-existing behavior.
<!-- /ANCHOR:wave-a -->

---

<!-- ANCHOR:wave-b -->
## 3. WAVE B — CLUSTER CONSUMERS (30h / 4 days — PARALLEL 3 LANES)

Depends on Wave A merged. Runs 3 parallel lanes.

### 3.1 Lane B1 — Cluster B consumers (12h)

#### 3.1.1 T-CNS-02 — Research folder backfill (4h, M)

**Files**: New `.opencode/skill/system-spec-kit/scripts/memory/backfill-research-metadata.ts`; wire into `generate-context.js`.

**Changes**:
1. Walk `research/NNN-*/iterations/` directories.
2. For each missing `description.json` or `graph-metadata.json`, auto-create from template.
3. Run as post-step of canonical save when target spec folder has `research/` child.

**Resolves**: R3-P1-002, R56-P1-NEW-003.

#### 3.1.2 T-W1-CNS-05 — Continuity freshness validator (4h, M)

**Files**: `scripts/spec/validate.sh`, new `scripts/validation/continuity-freshness.ts`.

**Changes**:
1. Parse `implementation-summary.md` frontmatter `_memory.continuity`.
2. Warn if `last_updated_at` older than `graph-metadata.json.derived.last_save_at` by more than 10m.
3. Wire into `--strict` mode.
4. Optional: `writeContinuityFrontmatter()` helper invoked on canonical save (Phase 019 candidate).

**Resolves**: R51-P1-003.

#### 3.1.3 T-CGC-02 — context.ts error branch explicit (2h, S)

**Files**: `handlers/code-graph/context.ts:98-105`

**Changes**: Replace silent catch into `freshness: 'empty'` stub with explicit `error → 'unavailable'` branch emitting `readiness_check_crashed` reason.

**Resolves**: Partial R6-P1-001 (observability mitigation if T-CGC-01/03 deferred).

#### 3.1.4 T-RBD-03 — Design-intent comments (2h, S)

**Files**: `handlers/save/post-insert.ts:344-369`, `handlers/save/response-builder.ts:136-201`.

**Changes**: Add design-intent comment blocks at both rollup sites citing T-RBD-01 / commit `709727e98`. Explain: post-insert tracks failure-with-recovery; response surfaces nuance to MCP clients.

**Resolves**: R6-P2-001.

### 3.2 Lane B2 — Cluster D + Cluster E (16h)

#### 3.2.1 T-W1-CGC-03 — 5-sibling readiness propagation (16h, L)

**Files**: `handlers/code-graph/scan.ts`, `status.ts`, `context.ts`, `ccc-status.ts`, `ccc-reindex.ts`, `ccc-feedback.ts`.

**Changes**:
1. Each handler imports from `lib/code-graph/readiness-contract.ts` (created in T-CGC-01).
2. Emit `canonicalReadiness` + `trustState` + `lastPersistedAt` in each handler's return payload.
3. `status.ts` is HIGHEST priority (IS the canonical readiness probe).
4. Vitest: assert all 6 handlers emit the 3 fields with the 4-state vocabulary.

**Atomic-ship constraint**: Must land as one PR OR emit `trustState: 'unavailable'` stubs in un-refactored handlers during staged rollout. Mid-rollout consumers keying on `trustState !== undefined` would conclude scan/status/ccc-* failed.

**Resolves**: R52-P1-001 (Cluster D).

#### 3.2.2 T-W1-HOK-01 — Copilot compact-cache (6h, M)

**Files**: Create `hooks/copilot/compact-cache.ts` (new); extend `hooks/copilot/session-prime.ts`.

**Changes**:
1. Create `compact-cache.ts` that writes `trustState: 'cached'` using helpers from `hooks/shared-provenance.ts` (Wave A).
2. Extend `session-prime.ts` to read `payloadContract?.provenance.trustState` at entry.
3. Vitest: parallel test to Claude + Gemini compact-cycle tests.

**Constraint**: MUST follow T-W1-HOK-02 (reverse order re-inlines the helper as third duplicate).

**Resolves**: R52-P1-002 (Cluster E), R56-P1-NEW-002 (compound H-56-4).

### 3.3 Lane B3 — Cluster A + Cluster C + Standalone P1 (12h)

#### 3.3.1 T-SCP-02 — Normalizer lint rule (2h, S)

**Files**: `.eslintrc.js` or `scripts/spec/validate.sh`.

**Changes**: Add lint that rejects new in-module `normalizeScope*` or `getOptionalString` helpers (exempt `scope-governance.ts`).

**Constraint**: Must follow T-SCP-01 in same PR — lint-first breaks build.

**Resolves**: R4-P1-001 (prevention of re-introduction).

#### 3.3.2 T-SAN-01 + T-SAN-03 — Gate 3 NFKC (4h, S+S)

**Files**: `shared/gate-3-classifier.ts:145-152`, `scripts/tests/gate-3-classifier.vitest.ts`.

**Changes**:
1. Add `.normalize('NFKC')` + `/[\u00AD\u200B-\u200F\uFEFF]/g` stripping to `normalizePrompt`.
2. Add 5+ unicode test cases: Cyrillic `е`, soft hyphen, zero-width space, Greek `Ε`, combined homoglyph+zero-width.
3. Rename `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` `it()` block to "Claude and Gemini consumers" with schema-share note for OpenCode.

**Atomic-ship constraint**: Tests fail until code lands. Both commits same PR.

**Resolves**: R2-P1-002, R3-P2-003, R5-P2-001.

#### 3.3.3 T-SAN-02 — sanitizeRecoveredPayload NFKC (2h, S)

**Files**: `mcp_server/hooks/claude/shared.ts:100-119`.

**Changes**: Mirror NFKC normalization from T-SAN-01 to `sanitizeRecoveredPayload` regex preprocessing.

**Resolves**: R2-P2-001.

#### 3.3.4 T-PIN-RET-01 — Retry exhaustion counter (4h, M)

**Files**: `handlers/save/post-insert.ts:159-173, 347-365`; new `lib/enrichment/retry-budget.ts`.

**Changes**:
1. Add retry-exhaustion counter keyed on `(memoryId, step, reason)`.
2. Skip `runEnrichmentBackfill` after N=3 retries for `partial_causal_link_unresolved` outcomes.
3. Emit structured warning log.
4. Vitest: assert 3rd retry is skipped; 4th attempt logs exhaustion.

**Resolves**: R1-P1-002.

### Wave B gate

After Wave B code-complete: `/spec_kit:deep-review :auto` ×7 across 3 lanes. No regressions. T-W1-CGC-03 atomic-ship constraint verified.
<!-- /ANCHOR:wave-b -->

---

<!-- ANCHOR:wave-c -->
## 4. WAVE C — ROLLOUT + SWEEPS (15h / 2 days)

Depends on Wave A + B merged.

### 4.1 T-EVD-01 — Evidence-marker lint activation (3h, M)

**Files**: `scripts/spec/validate.sh`, new `scripts/validation/evidence-marker-lint.ts`.

**Changes**:
1. Lint asserts every `[EVIDENCE: ...]` closes with `]` not `)`.
2. Wire into `--strict` mode.

**Pre-requisite**: 016 checklist.md rewrap (T-EVD-01-prep in Wave A §2.5) completed.

**Resolves**: R3-P2-002 (tool-side).

### 4.2 T-CNS-03 — 16-folder canonical-save sweep (8h, L)

**Files**: All 16 sibling `026-graph-and-context-optimization/*/` folders.

**Changes**:
1. Run 1 test folder first (`002-cache-warning-hooks/` or a low-risk target). Verify `description.json.lastUpdated` + `graph-metadata.json.derived.last_save_at` fresh post-save.
2. If test passes, sweep remaining 15 folders sequentially.
3. Commit per-folder to enable selective rollback.

**Rollback**: Per-folder revert; check `jq '.lastUpdated' description.json` before next folder.

**Resolves**: R5-P1-001, R3-P2-001 (data side).

### 4.3 T-CPN-01 — Closing-pass-notes amend (1h, S)

**Files**: `research/016-pt-01/closing-pass-notes.md:72-88`.

**Changes**: Amend CP-002 section to mark RESOLVED by T-PIN-08 / `e774eef07`. Add status tag `[STATUS: RESOLVED 2026-04-17]`.

**Resolves**: R3-P1-001.

### 4.4 T-W1-MCX-01 — memory-context readiness rename (2h, S)

**Files**: `handlers/memory-context.ts:200, 425`.

**Changes**: Rename `readiness` field in `StructuralRoutingNudgeMeta` to `advisoryPreset` OR remove (always-literal field). Preserve consumer-facing contract.

**Resolves**: R52-P2-002.

### 4.5 T-SRS-BND-01 — Session-resume auth binding (LIFTED TO WAVE B IF CRITICAL, 1h reserve here)

**Files**: `mcp_server/handlers/session-resume.ts:443-456`, `tools/lifecycle-tools.ts:67`.

**Changes**: Bind `handleSessionResume` session-ID authentication to caller's runtime-identity at MCP transport layer. Reject mismatched `args.sessionId`.

**Resolves**: R2-P1-001.

### Wave C gate

After Wave C code-complete: `/spec_kit:deep-review :auto` ×7 with focus on 16-folder sweep outcomes + evidence-marker lint strict mode.
<!-- /ANCHOR:wave-c -->

---

<!-- ANCHOR:wave-d -->
## 5. WAVE D — P2 MAINTAINABILITY (40h / deferrable)

Non-urgent. Can land in parallel with later phases.

### 5.1 T-EXH-01 — Exhaustiveness checks (8h, L)

**Files**: New `lib/utils/assert-never.ts`. Apply to 8 typed unions: `OnIndexSkipReason`, `EnrichmentStepStatus`, `EnrichmentSkipReason`, `EnrichmentFailureReason`, `ConflictAbortStatus`, `HookStateLoadFailureReason`, `SharedPayloadTrustState`, `TriggerCategory`.

**Changes**: `function assertNever(x: never): never { throw new Error(...) }`. Apply in switch default clauses. Use `satisfies` at lookup sites.

**Resolves**: R4-P2-002.

### 5.2 T-PIN-GOD-01 — Extract runEnrichmentStep helper (8h, L)

**Files**: `handlers/save/post-insert.ts:133-376`.

**Changes**: Extract `runEnrichmentStep(name, isEnabled, runner, options)` helper. Reduce `runPostInsertEnrichment` from 243 LOC to ~80. Preserve all 5 enrichment behaviors.

**Resolves**: R4-P2-001.

### 5.3 T-W1-PIN-02 — OnIndexSkipReason satisfies clause (2h, S)

**Files**: `handlers/save/post-insert.ts:302-316`.

**Changes**: Add `satisfies Record<OnIndexSkipReason, EnrichmentSkipReason>` clause. Warn-log on unmapped variant.

**Resolves**: R51-P2-001.

### 5.4 T-RCB-DUP-01 — Extract runAtomicReconsolidationTxn (6h, M)

**Files**: `lib/storage/reconsolidation.ts:507-600`.

**Changes**: Extract `runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)` for the duplicate deprecate-path + content-update-path transaction blocks.

**Resolves**: R4-P2-003.

### 5.5 T-YML-CP4-01 — Typed YAML predicate (4h, M)

**Files**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099`.

**Changes**: Replace prose `when:` string with typed predicate matching S7 YAML grammar (`shared/predicates/boolean-expr.ts`).

**Resolves**: CP-004.

### 5.6 T-W1-HST-02 — Docker deployment note (2h, S)

**Files**: Deployment docs (find `.opencode/skill/system-spec-kit/README.md` or create `DEPLOYMENT` docs).

**Changes**: Warn against `-v /tmp:/tmp` across Copilot MCP containers (R53-P1w-001). OPTIONAL: `getProjectHash()` incorporates `process.getuid?.()` for defense-in-depth.

**Resolves**: R53-P1w-001.

### 5.7 Deferred parking-lot P2s (tracked, not scheduled)

- R55-P2-002 — underused `importance-tier` helper
- R55-P2-003 — `executeConflict` precondition-block DRY opportunity
- R55-P2-004 — YAML boolean-predicate evolution gap

### Wave D gate

After Wave D code-complete (any subset): `/spec_kit:deep-review :auto` ×3 (lighter gate for maintainability-only wave).
<!-- /ANCHOR:wave-d -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK STRATEGY

### Per-task rollback

Each task lands as a separate commit (or atomic-ship group) to enable `git revert` per unit.

### Wave-level rollback

| Wave | Rollback action | Risk |
|------|-----------------|------|
| Wave A | `git revert` merged PR; no persistent state changes | Low — all in-code |
| Wave B | `git revert` per-lane; T-W1-CGC-03 may leave stub state if mid-rollout | Medium — requires verification sweep |
| Wave C | Per-folder `git revert` for T-CNS-03; re-run T-CNS-01 + T-W1-CNS-04 if description.json corrupted | HIGH — 16-folder sweep rollback is expensive |
| Wave D | Per-task rollback trivial | Low |

### Irreversible operations

- T-CNS-03 16-folder sweep WRITES to existing `description.json` files. Pre-sweep backup recommended: `git stash` the current `026/*/description.json` state before sweep runs.
- T-EVD-01-prep rewraps 170+ checklist.md closers. Reversible via `git revert` but visual noise in diff.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:risks -->
## 7. RISK MATRIX

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| Wave A introduces regression in canonical save | Low | High | Vitest coverage on all 3 workflow.ts changes; gate is `/spec_kit:deep-review :auto` ×7 |
| T-CGC-01 + T-W1-CGC-03 split mid-rollout creates consumer breakage | Medium | Medium | Atomic-ship constraint OR `trustState: 'unavailable'` stub strategy |
| Copilot runtime breaks on T-W1-HOK-01 deploy | Low | Medium | Parallel Claude + Gemini coverage via `hooks/shared-provenance.ts` |
| T-SRS-BND-01 blocks legitimate session-resume flows | Low | High | Staged rollout with permissive-mode flag; verify on canary session before full enable |
| T-CNS-03 sweep corrupts 016-foundational or other critical folder | Medium | High | Run on low-risk folder first; per-folder commit; pre-sweep `git stash` |
| Phase 017 autonomous execution triggers H-56-4 observability gap | Medium | Medium | Cluster E (T-W1-HOK-01/02) MUST land BEFORE Copilot-primary autonomous iteration |
| Wave D deferral creates tech-debt backlog | Low | Low | Track in Phase 019 parking lot |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:success-signal -->
## 8. SUCCESS SIGNALS

After all 4 waves complete:

- [ ] `validate.sh --strict` on all 16 sibling 026 folders exits 0 with 0 warnings
- [ ] `/spec_kit:deep-review :auto` ×7 on Wave A/B/C/D scope emits ZERO new P0, ZERO new P1
- [ ] All 10 original review P1s marked RESOLVED with evidence citations in checklist.md
- [ ] All 9 new segment-2 P1s marked RESOLVED
- [ ] `jq '.lastUpdated' description.json` across 16 sibling folders returns timestamps within 10m of `jq '.derived.last_save_at' graph-metadata.json`
- [ ] `grep -l 'trustState' handlers/code-graph/*.ts | wc -l` returns `7` (all siblings hardened)
- [ ] Copilot `hooks/copilot/{compact-cache.ts, session-prime.ts, shared.ts}` all present
- [ ] `grep -c '\[EVIDENCE:.*\)$' checklist.md` returns `0` (all closers canonical)
<!-- /ANCHOR:success-signal -->
