---
title: "Implementation Plan: Phase 017 Wave B — Cluster Consumers"
description: "Wave B plan: 9 tasks / 30h / 3 parallel lanes. Lane B1 Cluster B consumers (12h), Lane B2 Cluster D + E (16h, atomic-ship T-W1-CGC-03), Lane B3 Cluster A + C + Standalone P1 (12h). Quality gate after all lanes complete via /spec_kit:deep-review :auto ×7."
trigger_phrases: ["017 wave b plan", "wave b 3-lane execution", "017 lane b1 plan", "017 lane b2 plan", "017 lane b3 plan", "t-w1-cgc-03 atomic ship"]
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/003-cluster-consumers"
    last_updated_at: "2026-04-17T14:41:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Child 002 Wave B plan scaffolded from parent plan.md §3"
    next_safe_action: "Dispatch all 3 lanes in parallel after Wave A merge"
    blockers: ["Wave A merge prerequisite"]
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

# Implementation Plan: Phase 017 Wave B — Cluster Consumers

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Wave B consumes the Wave A primitives across 3 parallel lanes totaling 30h. Lane B1 (Cluster B consumers, 12h) backfills research folders and adds freshness validation. Lane B2 (Cluster D + Cluster E, 16h) propagates the readiness contract to 5 code-graph siblings and lands the Copilot compact-cache. Lane B3 (Cluster A + Cluster C + Standalone P1, 12h) activates the normalizer lint rule, adds NFKC unicode hardening, and implements the retry-exhaustion counter. Parallel wall-clock is ~4 working days (limited by Lane B2's 16h T-W1-CGC-03). All lanes merge before the Wave B gate (`/spec_kit:deep-review :auto` ×7) fires.

**Critical constraints**: T-W1-CGC-03 atomic-ship OR stub rollout; T-W1-HOK-01 MUST follow T-W1-HOK-02 (Wave A); T-SAN-01 + T-SAN-03 same PR; T-SCP-02 depends on T-SCP-01 (Wave A) having completed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 1.5 QUALITY GATES

### 1.5.1 Wave B code-complete gate (after all 3 lanes merge)

The following MUST pass before Wave B is considered closed and Wave C (child 003) starts:

1. **`/spec_kit:deep-review :auto` ×7** on Wave B scope emits ZERO new P0, ZERO new P1 findings.
2. **`validate.sh --strict`** on 017 spec folder exits 0 with 0 warnings.
3. **Vitest suite** passes end-to-end for all modified modules:
   - `readiness-contract.shared.vitest.ts`
   - `scan.readiness.vitest.ts`, `status.readiness.vitest.ts`, `context.readiness.vitest.ts`, `ccc-status.readiness.vitest.ts`, `ccc-reindex.readiness.vitest.ts`, `ccc-feedback.readiness.vitest.ts`
   - `copilot-compact-cache.vitest.ts`
   - `gate-3-classifier.vitest.ts` (5+ unicode cases added)
   - `sanitize-recovered-payload.vitest.ts` (NFKC case added)
   - `retry-budget.vitest.ts`
   - `continuity-freshness.vitest.ts`
   - `backfill-research-metadata.vitest.ts`
4. **Atomic-ship verification**:
   - T-W1-CGC-03: single merge commit OR staged-stub diff reviewed
   - T-SAN-01 + T-SAN-03: single merge commit (tests fail without code)
5. **Rollback procedures** documented per-lane AND smoke-tested on branch before merge.

### 1.5.2 Per-lane checkpoint gates

Each lane MUST pass a lightweight gate before its final task marks complete:

- **Lane B1 checkpoint**: `validate.sh` on 017 folder; T-CNS-02 vitest green; test `research/` folder sweep produces expected metadata files.
- **Lane B2 checkpoint**: 6 handlers emit the 3-field vocabulary (grep-check); Copilot compact-cycle parallel test green.
- **Lane B3 checkpoint**: lint fires on scratch-branch violation attempt; 5+ unicode fixtures pass in vitest; retry counter 3rd/4th test case green.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

### 2.1 Lane B1 consumer architecture

```
workflow.ts (Wave A canonical save writer)
  → refreshPerFolderDescription (Wave A)
  → refreshGraphMetadata (Wave A — un-gated)
  → backfillResearchMetadata (NEW: T-CNS-02)
      ↓ scans research/NNN-*/iterations/
      → for each missing description.json OR graph-metadata.json → template-write
  → validateContinuityFreshness (NEW: T-W1-CNS-05)
      ↓ parses implementation-summary.md frontmatter _memory.continuity
      → warns if last_updated_at < derived.last_save_at - 10m
```

### 2.2 Lane B2 — code-graph sibling propagation (Cluster D)

```
lib/code-graph/readiness-contract.ts (Wave A — T-CGC-01)
    ↑ import
    ├── handlers/code-graph/query.ts (Wave A consumer)
    ├── handlers/code-graph/scan.ts            ← T-W1-CGC-03
    ├── handlers/code-graph/status.ts          ← T-W1-CGC-03 (HIGHEST priority)
    ├── handlers/code-graph/context.ts         ← T-W1-CGC-03 (+ T-CGC-02 partial mitigation)
    ├── handlers/code-graph/ccc-status.ts      ← T-W1-CGC-03
    ├── handlers/code-graph/ccc-reindex.ts     ← T-W1-CGC-03
    └── handlers/code-graph/ccc-feedback.ts    ← T-W1-CGC-03

Emitted tokens per handler: canonicalReadiness, trustState, lastPersistedAt
Vocabulary: 'live' | 'stale' | 'absent' | 'unavailable' (4-state, no additions)
```

### 2.3 Lane B2 — Copilot compact-cache (Cluster E)

```
hooks/shared-provenance.ts (Wave A — T-W1-HOK-02)
    ↑ import
    ├── hooks/claude/shared.ts        (Wave A — re-exports)
    ├── hooks/gemini/shared.ts        (Wave A — re-exports)
    └── hooks/copilot/compact-cache.ts ← T-W1-HOK-01 (NEW)
        ↳ writes trustState: 'cached' (SharedPayloadTrustState, not code-graph)
    
hooks/copilot/session-prime.ts (extend to read trustState at entry) ← T-W1-HOK-01
```

### 2.4 Lane B3 — lint + unicode + retry-budget

```
scripts/spec/validate.sh (Wave A + B shared)
    ├── evidence-marker-lint.ts (Wave C — T-EVD-01)
    ├── continuity-freshness.ts (Lane B1 — T-W1-CNS-05)
    └── normalizer-lint (Lane B3 — T-SCP-02)
        ↳ rejects new in-module `normalizeScope*` / `getOptionalString` helpers
        ↳ exempts lib/governance/scope-governance.ts

shared/gate-3-classifier.ts (Lane B3 — T-SAN-01)
    normalizePrompt:
        → .normalize('NFKC')
        → .replace(/[\u00AD\u200B-\u200F\uFEFF]/g, '')
mcp_server/hooks/claude/shared.ts (Lane B3 — T-SAN-02)
    sanitizeRecoveredPayload: mirrored NFKC pass

lib/enrichment/retry-budget.ts (Lane B3 — T-PIN-RET-01 — NEW)
    Map<(memoryId, step, reason), count>
    threshold: N=3
    → emitted signal: 'retry_exhausted' structured warning log
handlers/save/post-insert.ts (consumer at 159-173, 347-365)
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 3. PHASES (LANES)

Wave B is decomposed into 3 parallel lanes. Each lane is a discrete phase with its own gate. All 3 lanes MUST complete before the Wave B gate fires.

### 3.1 Lane B1 — Cluster B consumers (12h — 4 tasks)

#### 3.1.1 T-CNS-02 — Research folder backfill (4h, M)

**Files**: New `.opencode/skill/system-spec-kit/scripts/memory/backfill-research-metadata.ts`; wire into `generate-context.js`.

**Changes**:
1. Walk `research/NNN-*/iterations/` directories.
2. For each missing `description.json` OR `graph-metadata.json`, auto-create from template.
3. Run as post-step of canonical save when target spec folder has `research/` child.
4. Missing-only semantics — DO NOT overwrite existing metadata.

**Resolves**: R3-P1-002, R56-P1-NEW-003.

#### 3.1.2 T-W1-CNS-05 — Continuity freshness validator (4h, M)

**Files**: `scripts/spec/validate.sh`, new `scripts/validation/continuity-freshness.ts`.

**Changes**:
1. Parse `implementation-summary.md` frontmatter `_memory.continuity`.
2. Warn if `last_updated_at` older than `graph-metadata.json.derived.last_save_at` by more than 10m.
3. Wire into `--strict` mode.
4. Optional helper `writeContinuityFrontmatter()` invoked on canonical save — deferred to Phase 019.

**Resolves**: R51-P1-003.

#### 3.1.3 T-CGC-02 — context.ts error branch explicit (2h, S)

**Files**: `handlers/code-graph/context.ts:98-105`.

**Changes**: Replace silent catch into `freshness: 'empty'` stub with explicit `error → 'unavailable'` branch emitting `readiness_check_crashed` reason.

**Resolves**: Partial R6-P1-001 (observability mitigation layered on top of T-W1-CGC-03 propagation).

#### 3.1.4 T-RBD-03 — Design-intent comments (2h, S)

**Files**: `handlers/save/post-insert.ts:344-369`, `handlers/save/response-builder.ts:136-201`.

**Changes**: Add design-intent comment blocks at both rollup sites citing T-RBD-01 / commit `709727e98`. Comments explain:
- post-insert tracks failure-with-recovery
- response surfaces nuance to MCP clients

**Resolves**: R6-P2-001.

### 3.2 Lane B2 — Cluster D + Cluster E (16h — 2 tasks)

#### 3.2.1 T-W1-CGC-03 — 5-sibling readiness propagation (16h, L)

**Files**: `handlers/code-graph/{scan,status,context,ccc-status,ccc-reindex,ccc-feedback}.ts`.

**Changes**:
1. Each handler imports from `lib/code-graph/readiness-contract.ts` (Wave A).
2. Emit `canonicalReadiness` + `trustState` + `lastPersistedAt` in each handler's return payload.
3. `status.ts` is HIGHEST priority (IS the canonical readiness probe).
4. Vitest: assert all 6 handlers emit the 3 fields with the 4-state vocabulary.

**Atomic-ship constraint**: Must land as ONE PR OR emit `trustState: 'unavailable'` stubs in un-refactored handlers during staged rollout. Mid-rollout consumers keying on `trustState !== undefined` would conclude scan/status/ccc-* failed silently.

**Resolves**: R52-P1-001 (Cluster D).

#### 3.2.2 T-W1-HOK-01 — Copilot compact-cache (6h, M)

**Files**: Create `hooks/copilot/compact-cache.ts` (new); extend `hooks/copilot/session-prime.ts`.

**Changes**:
1. Create `compact-cache.ts` that writes `trustState: 'cached'` using helpers from `hooks/shared-provenance.ts` (Wave A).
2. Extend `session-prime.ts` to read `payloadContract?.provenance.trustState` at entry.
3. Vitest: parallel test to Claude + Gemini compact-cycle tests.

**Constraint**: MUST follow T-W1-HOK-02 (reverse order re-inlines the helper as third duplicate).

**Resolves**: R52-P1-002 (Cluster E), R56-P1-NEW-002 (compound H-56-4).

### 3.3 Lane B3 — Cluster A + Cluster C + Standalone P1 (12h — 3 tasks)

#### 3.3.1 T-SCP-02 — Normalizer lint rule (2h, S)

**Files**: `.eslintrc.js` or `scripts/spec/validate.sh`.

**Changes**: Add lint that rejects new in-module `normalizeScope*` or `getOptionalString` helpers (exempt `scope-governance.ts`).

**Constraint**: Must follow T-SCP-01 in the Wave A merge — lint-first breaks build.

**Resolves**: R4-P1-001 (prevention of re-introduction).

#### 3.3.2 T-SAN-01 + T-SAN-02 + T-SAN-03 — NFKC unicode normalization + tests (6h, S+S+S)

**Files**:
- `shared/gate-3-classifier.ts:145-152`
- `mcp_server/hooks/claude/shared.ts:100-119`
- `scripts/tests/gate-3-classifier.vitest.ts`
- `mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11, 67, 152-154`

**Changes**:
1. T-SAN-01: Add `.normalize('NFKC')` + `/[\u00AD\u200B-\u200F\uFEFF]/g` stripping to `normalizePrompt`.
2. T-SAN-02: Mirror NFKC normalization to `sanitizeRecoveredPayload` regex preprocessing.
3. T-SAN-03: Add 5+ unicode test cases (Cyrillic `е`, soft hyphen, zero-width space, Greek `Ε`, combined homoglyph+zero-width); rename `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` `it()` block to "Claude and Gemini consumers" with schema-share note for OpenCode.

**Atomic-ship constraint**: Tests fail until code lands. T-SAN-01 + T-SAN-03 same PR; T-SAN-02 can land separately but recommended same PR.

**Resolves**: R2-P1-002, R2-P2-001, R3-P2-003, R5-P2-001.

#### 3.3.3 T-PIN-RET-01 — Retry exhaustion counter (4h, M)

**Files**: `handlers/save/post-insert.ts:159-173, 347-365`; new `lib/enrichment/retry-budget.ts`.

**Changes**:
1. Add retry-exhaustion counter keyed on `(memoryId, step, reason)`.
2. Skip `runEnrichmentBackfill` after N=3 retries for `partial_causal_link_unresolved` outcomes.
3. Emit structured warning log on exhaustion.
4. Vitest: assert 3rd retry attempted; 4th attempt skipped with log.

**Resolves**: R1-P1-002.

### 3.4 Wave B final gate

After all 3 lanes merge:
- `/spec_kit:deep-review :auto` ×7 across Wave B scope
- T-W1-CGC-03 atomic-ship verified (`git log --follow handlers/code-graph/` inspection)
- Implementation-summary.md updated in parent 017 folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 4. TESTING

### 4.1 Unit tests (vitest) — NEW for Wave B

- `backfill-research-metadata.vitest.ts` — covers missing-both, missing-one, already-present cases
- `continuity-freshness.vitest.ts` — fresh vs stale fixtures, 10m boundary
- `context.ts` explicit error branch — thrown-exception path triggers `readiness_check_crashed`
- `scan.readiness.vitest.ts`, `status.readiness.vitest.ts`, `context.readiness.vitest.ts`, `ccc-status.readiness.vitest.ts`, `ccc-reindex.readiness.vitest.ts`, `ccc-feedback.readiness.vitest.ts` — each asserts 3-field emission + 4-state vocabulary
- `copilot-compact-cache.vitest.ts` — parallel to Claude + Gemini compact-cycle
- `copilot-session-prime.vitest.ts` — reads `payloadContract?.provenance.trustState` on entry
- `gate-3-classifier.vitest.ts` — +5 unicode cases (Cyrillic `е`, soft hyphen, zero-width space, Greek `Ε`, combined)
- `sanitize-recovered-payload.vitest.ts` — NFKC-normalized `"SYST\u0395M:"` detected
- `retry-budget.vitest.ts` — 3rd attempt allowed, 4th skipped with log signal
- Normalizer-lint scratch-branch fixture — attempting to add `normalizeScopeFoo` fails validation

### 4.2 Integration / regression tests

- `/spec_kit:deep-review :auto` ×7 after Wave B code-complete
- T-CNS-02 run against 1 research folder (e.g. `research/016-pt-01/iterations/`) — verify generated `description.json` + `graph-metadata.json` match template
- Copilot end-to-end compact cycle — dispatch autonomous iteration, verify `trustState` round-trips through compaction

### 4.3 Manual verification

- Induce stale continuity (edit `_memory.continuity.last_updated_at` backwards) → `validate.sh --strict` warns
- T-SCP-02 lint: attempt to add `const normalizeScopeFoo = (x) => x` in a handler file; confirm lint rejects
- T-W1-HOK-01 smoke: observe `hooks/copilot/compact-cache.ts` file exists + imports from `../shared-provenance.js`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 5. DEPENDENCIES

### 5.1 External dependencies (none new)

No new npm packages required. All Wave B changes use existing runtime capabilities (Node `String.prototype.normalize`, existing vitest).

### 5.2 Internal file dependencies (from Wave A)

| Wave A artefact | Wave B consumer |
|------------------|------------------|
| `lib/code-graph/readiness-contract.ts` | T-W1-CGC-03 (6 handlers), T-CGC-02 observability layering |
| `hooks/shared-provenance.ts` | T-W1-HOK-01 (Copilot compact-cache) |
| `lib/governance/scope-governance.ts` (canonical, collapsed) | T-SCP-02 lint anchor |
| `scripts/core/workflow.ts` metadata writer | T-CNS-02 post-save hook |

### 5.3 Phase dependencies

- **Depends on**: Child 001 (Wave A — Infrastructure Primitives) merged to `main`.
- **Blocks**: Child 003 (Wave C — Rollout + Sweeps), child 004 (Wave D — P2 Maintainability).

### 5.4 Runtime dependencies

- cli-codex gpt-5.4 xhigh fast (primary autonomous executor)
- cli-copilot gpt-5.4 high (fallback, 3-concurrent max per `feedback_copilot_concurrency_override` (user memory))
- Opus 4.7 (manual orchestration + synthesis)

### 5.5 Operator-constraint dependencies

- `feedback_phase_018_autonomous` (user memory) — dispatch `/spec_kit:deep-review :auto` ×7 per gate
- `feedback_copilot_concurrency_override` (user memory) — 3-concurrent limit on Copilot
- `feedback_stop_over_confirming` (user memory) — skip A/B/C/D approval menus
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 6. ROLLBACK STRATEGY

### 6.1 Per-task rollback

Each task lands as a separate commit (or atomic-ship group) to enable `git revert` per unit. Commit granularity per-lane:

- **Lane B1**: 4 commits (one per task); each independently revertable.
- **Lane B2**: T-W1-CGC-03 lands as 1 commit (atomic) OR 1 commit per-handler with intermediate `trustState: 'unavailable'` stub; T-W1-HOK-01 is 2 commits (compact-cache + session-prime extension).
- **Lane B3**: T-SCP-02 is 1 commit; T-SAN-01+02+03 atomic 1 commit; T-PIN-RET-01 is 1-2 commits.

### 6.2 Lane-level rollback

| Lane | Rollback action | Risk |
|------|-----------------|------|
| Lane B1 | `git revert` per task; validate Wave A primitives unchanged | Low — consumer-only changes |
| Lane B2 | `git revert` T-W1-CGC-03 (atomic) or re-apply stubs; revert T-W1-HOK-01 keeping Wave A shared-provenance intact | Medium — multi-handler blast radius if atomic |
| Lane B3 | `git revert` per task; SAN rollback may affect Gate 3 behavior for Unicode inputs | Low |

### 6.3 Wave-level rollback

If Wave B gate fails:
- **Option A**: Revert only the failing lane; keep passing lanes merged; dispatch fix PR for failing lane; re-run gate.
- **Option B**: Revert entire Wave B; return to Wave A state; re-plan.
- **Option C** (partial): Keep Lane B1 + B3 merged (consumer-only, lower blast radius); revert Lane B2 for re-design.

### 6.4 Irreversible operations

None. Wave B is entirely in-code:
- No schema migrations
- No persistent-state writes outside `description.json` / `graph-metadata.json` during T-CNS-02 backfill (which uses missing-only semantics — safe for repeated re-runs)
- No external API contract breaking changes

### 6.5 Rollback rehearsal

Before Wave B gate fires:
- Test revert of T-W1-CGC-03 on a scratch branch — verify 6-handler revert leaves `query.ts` and the shared module intact.
- Test revert of T-W1-HOK-01 — verify Claude + Gemini compact cycles unaffected (shared-provenance from Wave A remains).
<!-- /ANCHOR:rollback -->

---

## 7. LANE EXECUTION MAP

```
Wave A merged to main
     │
     ├─── Lane B1 (B1-eng) ─── 12h
     │      T-CNS-02 → T-W1-CNS-05 → T-CGC-02 → T-RBD-03
     │
     ├─── Lane B2 (B2-eng) ─── 16h  ◄── critical-path lane
     │      T-W1-CGC-03 ∥ T-W1-HOK-01
     │      (atomic-ship T-W1-CGC-03)
     │
     └─── Lane B3 (B3-eng) ─── 12h
            T-SCP-02 → T-SAN-01+02+03 → T-PIN-RET-01
            (atomic-ship T-SAN-01 + T-SAN-03)
              │
              ▼
         Wave B code-complete
              │
              ▼
       /spec_kit:deep-review :auto ×7
              │
              ▼
        validate.sh --strict
              │
              ▼
       Wave B gate passes
              │
              ▼
        Wave C kicks off
```

**Parallelism**: Lanes B1/B2/B3 run concurrently. Wall-clock ~16h (Lane B2 is bottleneck).

**Autonomous execution**: Per `feedback_phase_018_autonomous` (user memory), dispatch cli-codex primary + cli-copilot fallback (3-concurrent max) across lanes. IMPORTANT: Cluster E (T-W1-HOK-01) must land BEFORE any autonomous Copilot iteration resumes.

---

## 8. RISK MATRIX (wave-specific)

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-------------|
| T-W1-CGC-03 split mid-rollout creates consumer breakage | Medium | Medium | Atomic-ship constraint OR `trustState: 'unavailable'` stub strategy |
| Copilot runtime breaks on T-W1-HOK-01 deploy | Low | Medium | Parallel Claude + Gemini coverage via `hooks/shared-provenance.ts` |
| Lane B3 lint fires on pre-existing code post-Wave-A collapse | Low | Low | Lint exempts canonical `scope-governance.ts`; regression-test current tree |
| Merge conflict between Lane B1 `validate.sh` + Lane B3 `validate.sh` | Medium | Low | Explicit merge-coordination note; one lane merges first, second rebases |
| Phase 017 autonomous execution triggers H-56-4 before T-W1-HOK-01 | Medium | Medium | Cluster E MUST land BEFORE Copilot-primary autonomous iteration — gate enforces this |
| T-CNS-02 backfill semantics accidentally overwrite extant metadata | Low | Medium | "Missing-only" write semantics + vitest covers "already-present" case |
| T-PIN-RET-01 counter keys collide across unrelated enrichment scopes | Low | Low | Tuple key (memoryId, step, reason) uniquely identifies each retry scope |

---

## 9. SUCCESS SIGNALS

After all 3 lanes merge AND Wave B gate passes:

- [ ] All 9 Wave B tasks marked `[x]` in parent `tasks.md` with `[EVIDENCE: <commit-hash>]` citations
- [ ] `/spec_kit:deep-review :auto` ×7 emits ZERO new P0, ZERO new P1 for Wave B scope
- [ ] `validate.sh --strict` exits 0 on 017 folder
- [ ] `grep -l 'trustState' handlers/code-graph/*.ts | wc -l` returns `7` (6 new + query.ts from Wave A)
- [ ] `ls hooks/copilot/{compact-cache.ts, session-prime.ts}` both present
- [ ] T-SCP-02 lint fires on scratch-branch violation (smoke-tested)
- [ ] Research folder backfill verified on at least 1 folder
- [ ] Wave B closed; Wave C kickoff unblocked
