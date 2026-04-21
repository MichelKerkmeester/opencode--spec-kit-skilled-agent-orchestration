---
title: "Phase 017 Wave A: Infrastructure Primitives"
description: "Child phase 001 of Phase 017 remediation — Wave A infrastructure primitives (~20h, CRITICAL PATH). 5 tasks: canonical save metadata writer (merged PR), readiness-contract extraction, shared-provenance extraction, normalizer collapse, 016 checklist evidence rewrap. Blocks everything downstream."
trigger_phrases: ["phase 017 wave a", "017 wave a infrastructure primitives", "wave a critical path", "t-cns-01 t-w1-cns-04 merged pr", "readiness-contract extract", "shared-provenance extract", "normalizer collapse wave a", "016 checklist evidence rewrap prep"]
importance_tier: "critical"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/002-infrastructure-primitives"
    parent_packet: "system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime"
    last_updated_at: "2026-04-17T14:45:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave A child-phase spec scaffolded from parent plan §2 + tasks.md Wave A section"
    next_safe_action: "Begin T-CNS-01 + T-W1-CNS-04 merged-PR implementation"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

# Specification: Phase 017 Wave A — Infrastructure Primitives

> **Parent packet**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/`
> **Child phase**: `001-infrastructure-primitives` (Wave A of A/B/C/D decomposition)
> **Level**: 2 | **Status**: ready_for_implementation | **Effort**: ~20h / 2.5 days / CRITICAL PATH

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Phase ID | 017 / Child 001 |
| Phase name | Infrastructure Primitives (Wave A) |
| Parent 017 folder | `016-foundational-runtime` |
| Wave position | 1 of 4 (A → B → C → D) |
| Critical path | YES — blocks Waves B/C/D |
| Atomic-ship groups | 1 (T-CNS-01 + T-W1-CNS-04 merged PR) |
| Total tasks | 5 |
| Total effort | ~20h |
| Gate | `/spec_kit:deep-review :auto` ×7 post code-complete |
| Parent synthesis source | `plan.md` §2 Wave A / `tasks.md` PHASE 1 anchor |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM STATEMENT

Phase 017 remediation requires five foundational primitives to land before any consumer work can begin. Without Wave A:

1. **Canonical-save pipeline remains broken** (H-56-1 CONFIRMED): `workflow.ts:1259` still contains the `const ctxFileWritten = false` stub and line 1333 still gates `refreshGraphMetadata` behind `plannerMode === 'full-auto'`. Every default `/memory:save` invocation writes ZERO structural metadata. Downstream consumers (Waves B/C) cannot reason about metadata freshness until this root cause is eliminated.
2. **Cluster D readiness contract is inlined in one handler** (`query.ts:225-300`) and unavailable to the 5 other code-graph siblings. Wave B's T-W1-CGC-03 cannot refactor 6 handlers without a shared module as a consumption point.
3. **Cluster E provenance helpers live inside `hooks/claude/shared.ts`** with a transitive Gemini → Claude import (R52-P2-001). Copilot's `compact-cache.ts` (Wave B T-W1-HOK-01) would re-inline the logic as a third duplicate if we don't extract first.
4. **Scope-normalization drift** (R1-P1-001 + R4-P1-001 compound): 4 handlers declare private `normalizeScopeValue` / `normalizeScopeMatchValue` helpers with subtly divergent semantics. Every save touches at least one. Wave B Lane B3 lint rule (T-SCP-02) would immediately fail the build if the collapse has not happened first.
5. **016 checklist evidence markers use `)` closers** (170 of 179 markers). T-EVD-01 in Wave C activates the lint in `--strict` mode; activating lint before data is canonical causes a false storm of 170 warnings across the entire 016 folder.

**Scope of this child**: Land exactly these 5 primitives, gate with `/spec_kit:deep-review :auto` ×7, then unblock Wave B (`002-cluster-consumers/`).

> **Frozen scope**: Every Wave B/C/D task is out of scope for this child. Do NOT touch consumer handlers in `scan.ts`, `status.ts`, `ccc-*.ts`, `context.ts`, Copilot hooks, sweeps, or NFKC normalization here.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### 3.1 In scope (5 tasks)

1. **T-CNS-01 + T-W1-CNS-04** — Canonical save metadata writer (MERGED PR, 6h, M+M)
   - Files: `scripts/core/workflow.ts:1259, 1333`; `scripts/memory/generate-context.ts:415`
   - Resolves: R4-P1-002, R51-P1-001, R51-P1-002, R56-P1-upgrade-001 (H-56-1 headline), partial R3-P2-001, partial R5-P1-001

2. **T-CGC-01** — Extract `lib/code-graph/readiness-contract.ts` (4h, M)
   - Files: New `mcp_server/lib/code-graph/readiness-contract.ts`; refactor `handlers/code-graph/query.ts:225-300`
   - Resolves: R6-P1-001 prerequisite (enables T-W1-CGC-03 in Wave B)

3. **T-W1-HOK-02** — Extract `hooks/shared-provenance.ts` (4h, M)
   - Files: New `mcp_server/hooks/shared-provenance.ts`; refactor `hooks/claude/shared.ts:125-129` + `hooks/gemini/shared.ts:7`
   - Resolves: R52-P2-001 (enables T-W1-HOK-01 in Wave B)

4. **T-SCP-01** — Collapse 4 local normalizers to canonical (4h, M)
   - Files: `handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444`
   - Resolves: R1-P1-001 + R4-P1-001 (compound)

5. **T-EVD-01-prep** — Rewrap 016 checklist.md evidence markers (2h, S)
   - Files: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/001-foundational-runtime/001-initial-research/checklist.md`
   - Resolves: R3-P2-002 (data side only — tool side deferred to T-EVD-01 Wave C)

### 3.2 Out of scope (belongs to later waves)

- **Wave B (002-cluster-consumers/)**: T-CNS-02, T-W1-CNS-05, T-CGC-02, T-RBD-03, T-W1-CGC-03, T-W1-HOK-01, T-SCP-02, T-SAN-*, T-PIN-RET-01
- **Wave C (003-rollout-sweeps/)**: T-EVD-01 lint activation, T-CNS-03 16-folder sweep, T-CPN-01, T-W1-MCX-01, T-SRS-BND-01
- **Wave D (004-p2-maintainability/)**: T-EXH-01, T-PIN-GOD-01, T-W1-PIN-02, T-RCB-DUP-01, T-YML-CP4-01, T-W1-HST-02, parking-lot items

### 3.3 Atomic-ship groups within Wave A

| Group | Tasks | Merge constraint |
|-------|-------|------------------|
| G1 | T-CNS-01 + T-W1-CNS-04 | MUST land in ONE PR. Splitting creates transient window where description.json updates but graph-metadata.json.derived.last_save_at lags (new divergence direction). |
| G2 | T-CGC-01 | Standalone. Shared module must exist before T-W1-CGC-03 in Wave B. |
| G3 | T-W1-HOK-02 | Standalone. MUST precede T-W1-HOK-01 in Wave B (reverse order re-inlines the helper as third duplicate). |
| G4 | T-SCP-01 | Standalone. MUST precede T-SCP-02 (Wave B lint) in the tree — lint-first breaks build. |
| G5 | T-EVD-01-prep | Standalone. MUST complete before T-EVD-01 in Wave C activates `--strict` mode. |

### 3.4 Files touched (authoritative inventory)

**New files** (3):
- `mcp_server/lib/code-graph/readiness-contract.ts`
- `mcp_server/hooks/shared-provenance.ts`
- Vitest siblings co-located per convention

**Modified files** (≥8):
- `scripts/core/workflow.ts` (lines 1259, 1261-1331, 1333)
- `scripts/memory/generate-context.ts` (line 415)
- `handlers/code-graph/query.ts` (lines 225-300)
- `hooks/claude/shared.ts` (lines 125-129)
- `hooks/gemini/shared.ts` (line 7)
- `handlers/save/reconsolidation-bridge.ts` (lines 228-234)
- `lib/storage/lineage-state.ts` (lines 198-204)
- `handlers/save/types.ts` (lines 348-352)
- `lib/validation/preflight.ts` (lines 440-444)
- `016-foundational-runtime/001-initial-research/checklist.md` (170 rewrap sites)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### 4.1 Functional requirements (FR)

| ID | Requirement | Source |
|----|-------------|--------|
| FR-A-1 | `workflow.ts:1259` MUST wire the actual `savePerFolderDescription` return value — the `ctxFileWritten = false` stub is removed. | T-CNS-01 |
| FR-A-2 | Description.json update block (1261-1331) MUST write `lastUpdated: new Date().toISOString()` unconditionally on every canonical save. | T-CNS-01 |
| FR-A-3 | `workflow.ts:1333` MUST lift the `plannerMode === 'full-auto'` gate so `refreshGraphMetadata` runs on every canonical save. | T-W1-CNS-04 |
| FR-A-4 | A new module `lib/code-graph/readiness-contract.ts` MUST export `canonicalReadinessFromFreshness`, `queryTrustStateFromFreshness`, `buildQueryGraphMetadata`, `buildReadinessBlock`, and the 4-state `TrustState` type. | T-CGC-01 |
| FR-A-5 | `handlers/code-graph/query.ts` MUST consume the shared module and exhibit byte-identical behavior against fixture inputs. | T-CGC-01 |
| FR-A-6 | A new module `hooks/shared-provenance.ts` MUST host `wrapRecoveredCompactPayload` + related provenance helpers, with Claude and Gemini re-exporting from it and Gemini no longer importing from Claude. | T-W1-HOK-02 |
| FR-A-7 | 4 local `normalizeScopeValue` / `normalizeScopeMatchValue` definitions MUST be deleted and replaced by imports of the canonical `normalizeScopeContext` from `lib/governance/scope-governance.ts`. | T-SCP-01 |
| FR-A-8 | 016 `checklist.md` MUST have all `)` evidence-closers replaced with `]` — `grep -c '\[EVIDENCE:.*\)$' checklist.md` MUST return `0`. | T-EVD-01-prep |

### 4.2 Non-functional requirements (NFR)

| ID | Requirement | Source |
|----|-------------|--------|
| NFR-A-1 | Atomic-ship: G1 (T-CNS-01 + T-W1-CNS-04) MUST land in ONE PR. | Parent plan §2.1 |
| NFR-A-2 | Ordering: G3 (T-W1-HOK-02) MUST merge before T-W1-HOK-01 in Wave B. | Parent plan §2.3 |
| NFR-A-3 | Ordering: G4 (T-SCP-01) MUST merge before T-SCP-02 in Wave B Lane B3. | Parent plan §3.3.1 |
| NFR-A-4 | Ordering: G5 (T-EVD-01-prep) MUST complete before T-EVD-01 activates `--strict` mode in Wave C. | Parent plan §4.1 |
| NFR-A-5 | Each task has vitest coverage: monotonic `lastUpdated` (T-CNS-01), fixture parity (T-CGC-01), Claude/Gemini/Copilot parity (T-W1-HOK-02), semantic-equivalence matrix (T-SCP-01). | Parent plan §1.8 |
| NFR-A-6 | `validate.sh --strict` on 017 folder exits 0 after every task commit. | Parent plan §1.5 |
| NFR-A-7 | Wave A gate: `/spec_kit:deep-review :auto` ×7 on the wave's scope emits ZERO new P0 and ZERO new P1. | Parent plan §1.5 / Wave A gate |
| NFR-A-8 | No scope creep: Wave B/C/D code remains unchanged by this child. | Operator-constraint FROZEN scope |

### 4.3 Cross-references

- Parent `spec.md` §5 (Cluster Inventory) — finding crosswalk
- Parent `plan.md` §2 Wave A — task-level implementation spec
- Parent `tasks.md` Wave A section — acceptance criteria
- Parent `checklist.md` CHK-A-01..08 — verification items (subset tracked in this child's checklist.md)
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

Wave A is code-complete when ALL of the following hold:

### 5.1 Derived from parent FC-1 (canonical save pipeline fresh)

- [ ] SC-A-1: `/memory:save` on any of the 16 sibling 026 folders updates `description.json.lastUpdated` to within 1s of invocation time.
- [ ] SC-A-2: `/memory:save` on any folder advances `graph-metadata.json.derived.last_save_at` regardless of `plannerMode`.
- [ ] SC-A-3: `grep -n 'ctxFileWritten = false' scripts/core/workflow.ts` returns no match.
- [ ] SC-A-4: `grep -n "plannerMode === 'full-auto'" scripts/core/workflow.ts:1333` returns no match.

### 5.2 Derived from parent FC-4 (readiness contract extraction)

- [ ] SC-A-5: `test -f .opencode/skill/system-spec-kit/mcp_server/lib/code-graph/readiness-contract.ts` succeeds.
- [ ] SC-A-6: `query.ts` shared-fixture vitest passes pre-refactor and post-refactor with byte-identical outputs.
- [ ] SC-A-7: 4-state `TrustState` type exported from the new module.

### 5.3 Derived from parent FC-6 partial (hooks provenance extraction)

- [ ] SC-A-8: `test -f .opencode/skill/system-spec-kit/mcp_server/hooks/shared-provenance.ts` succeeds.
- [ ] SC-A-9: `grep "from '../claude/" hooks/gemini/shared.ts` returns no match.
- [ ] SC-A-10: Claude + Gemini compact-cycle vitest unchanged (passes against the re-exported path).

### 5.4 Normalizer collapse

- [ ] SC-A-11: `grep -rn 'function normalizeScope' mcp_server/handlers mcp_server/lib/storage mcp_server/lib/validation` returns only `scope-governance.ts`.
- [ ] SC-A-12: Semantic-equivalence matrix vitest passes for `undefined`, `null`, `""`, whitespace, non-string at all 4 call sites.

### 5.5 Evidence-marker rewrap

- [ ] SC-A-13: `grep -c '\[EVIDENCE:.*\)$' 016-foundational-runtime/001-initial-research/checklist.md` returns `0`.
- [ ] SC-A-14: Pre-rewrap and post-rewrap checklist completion counts match (no accidental content mutation).

### 5.6 Wave gate

- [ ] SC-A-15: `/spec_kit:deep-review :auto` ×7 on Wave A scope emits ZERO new P0, ZERO new P1.
- [ ] SC-A-16: `validate.sh --strict` on 017 spec folder exits 0 with 0 warnings after every Wave A commit.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

### 6.1 Wave-A-specific risks

| Risk ID | Description | Likelihood | Impact | Mitigation |
|---------|-------------|------------|--------|------------|
| R-A-1 | Splitting G1 (T-CNS-01 + T-W1-CNS-04) creates transient window where description.json writes advance but graph-metadata.json lags (new divergence direction). | Low — constraint enforced | HIGH | Atomic-ship: ONE PR. Pre-merge reviewer asserts both changes present. |
| R-A-2 | `workflow.ts` edit introduces regression in existing full-auto pathway (T-CNS-01 + T-W1-CNS-04). | Low | HIGH | Vitest covers both plan-only and full-auto modes before merge. `/spec_kit:deep-review :auto` ×7 gate. |
| R-A-3 | `readiness-contract.ts` extraction inadvertently changes semantic output of `query.ts` for edge-case inputs. | Medium | Medium | Shared-fixture vitest locked pre-refactor; post-refactor MUST match byte-identical. |
| R-A-4 | Gemini → Claude transitive-import break requires Gemini test tree refactor. | Low | Low | Gemini tests import from `hooks/shared-provenance.ts` directly post-merge; adjust import paths in test files only. |
| R-A-5 | T-SCP-01 normalizer collapse uncovers latent semantic drift in one of 4 handlers. | Medium | Medium | Semantic-equivalence matrix vitest catches divergence; each call site tested independently. |
| R-A-6 | T-EVD-01-prep find-replace introduces accidental content mutation in checklist.md. | Low | Low | Pre- and post-rewrap diff review; only `)` → `]` in `[EVIDENCE:` lines allowed; byte-delta audit. |
| R-A-7 | Wave A gate (`/spec_kit:deep-review :auto` ×7) surfaces pre-existing P0/P1 that pre-dates Wave A and blocks progress. | Low | Medium | Filter deep-review findings by "new P0/P1 introduced by Wave A" per operator feedback; document pre-existing findings for Wave D parking lot. |

### 6.2 Dependencies

**Upstream (MUST be complete before Wave A starts)**:
- Parent `016-foundational-runtime/` spec + plan + tasks approved (satisfied).
- Operator-constraint files read: `feedback_phase_018_autonomous`, `feedback_copilot_concurrency_override`.

**Downstream (Wave A unblocks)**:
- `002-cluster-consumers/` (Wave B) — cannot start until ALL 5 Wave A tasks land.
- `003-rollout-sweeps/` (Wave C) — cannot start until Wave B merges AND T-EVD-01-prep is complete.
- `004-p2-maintainability/` (Wave D) — deferrable; does not strictly depend on Wave A but benefits from stable foundations.

**Runtime dependencies**:
- cli-codex gpt-5.4 xhigh fast (primary autonomous executor per user memory).
- cli-copilot gpt-5.4 high (fallback, 3-concurrent max).

### 6.3 Atomic-ship rollback tree

| Atomic group | Rollback plan | Blast radius |
|--------------|---------------|--------------|
| G1 | `git revert` merged PR; no persistent state changes; re-run `/memory:save` restores baseline. | Low (in-code only) |
| G2 | `git revert` commit; consumers in Wave B not yet landed so no cascade. | Low |
| G3 | `git revert` commit; restore Claude + Gemini inline helpers. | Low |
| G4 | `git revert` commit; restore 4 local normalizers. | Low (4 files) |
| G5 | `git revert` commit; `)` closers restored. Noisy diff but reversible. | Low (1 file, 170 lines) |
<!-- /ANCHOR:risks -->

---

## 7. ARCHITECTURE & EXECUTION NOTES

### 7.1 Canonical save pipeline (target architecture after Wave A)

```
/memory:save → generate-context.js → workflow.ts
                                         |
                                         +→ savePerFolderDescription (WIRED in T-CNS-01)
                                         |     returns { ctxFileWritten: boolean }
                                         |
                                         +→ description.json update block (T-CNS-01)
                                         |     writes lastUpdated: ISO-timestamp UNCONDITIONALLY
                                         |
                                         +→ refreshGraphMetadata (UN-GATED in T-W1-CNS-04)
                                               writes derived.last_save_at UNCONDITIONALLY
                                               regardless of plannerMode
```

### 7.2 Shared modules introduced

```
mcp_server/lib/code-graph/readiness-contract.ts  (NEW)
    └── exports: canonicalReadinessFromFreshness
                 queryTrustStateFromFreshness
                 buildQueryGraphMetadata
                 buildReadinessBlock
                 TrustState type

mcp_server/hooks/shared-provenance.ts  (NEW)
    └── exports: wrapRecoveredCompactPayload
                 <provenance helpers>
```

### 7.3 Consumed-by graph (completed in later waves)

- `readiness-contract.ts` → consumed by `query.ts` (Wave A) + 5 siblings in Wave B (T-W1-CGC-03)
- `shared-provenance.ts` → consumed by `hooks/claude/shared.ts`, `hooks/gemini/shared.ts` (Wave A) + `hooks/copilot/compact-cache.ts` (Wave B T-W1-HOK-01)
- `normalizeScopeContext` → consumed by 4 handlers (Wave A); T-SCP-02 lint in Wave B prevents regression.

---

## 8. EXECUTION ORDER (suggested within wave)

1. T-CNS-01 + T-W1-CNS-04 (G1 merged PR) — eliminates H-56-1 root cause FIRST.
2. T-CGC-01 (G2) — unblocks Wave B Lane B2 (T-W1-CGC-03).
3. T-W1-HOK-02 (G3) — unblocks Wave B Lane B2 (T-W1-HOK-01).
4. T-SCP-01 (G4) — unblocks Wave B Lane B3 (T-SCP-02 lint).
5. T-EVD-01-prep (G5) — unblocks Wave C (T-EVD-01 lint activation).

Each task may land as a separate commit within its atomic-ship group; consumer waves (B/C) may NOT start until ALL 5 primitives above have merged.

---

## 9. VALIDATION PROTOCOL

1. **Per-task**: Vitest for task-specific assertion (monotonic timestamps, fixture parity, semantic equivalence, etc.).
2. **Per-commit**: `validate.sh --strict` on 017 spec folder exits 0.
3. **Wave gate** (after all 5 tasks merged):
   - `/spec_kit:deep-review :auto` ×7 on Wave A scope (`workflow.ts`, `readiness-contract.ts`, `shared-provenance.ts`, `scope-governance.ts`, 016 `checklist.md`).
   - ZERO new P0, ZERO new P1 introduced by Wave A changes.
   - ≤3 new P2 permissible (minor maintainability regressions acceptable; tracked for Wave D parking lot).

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| ID | Question | Owner | Blocking? |
|----|----------|-------|-----------|
| Q-A-1 | Should `refreshGraphMetadata` also persist `last_accessed_at` on every read, or remain save-only? | Plan owner | No — current scope is save-only per T-W1-CNS-04. Defer read-path to Phase 019. |
| Q-A-2 | Does the Wave A gate filter out deep-review findings that pre-date this wave (inherited from 016)? | Reviewer | No — operator feedback permits filtering by "new P0/P1 introduced by Wave A"; pre-existing findings documented in Wave D parking lot. |
| Q-A-3 | Should `shared-provenance.ts` live under `mcp_server/hooks/` or `mcp_server/lib/provenance/`? | Code owner | No — parent plan §1.6 specifies `hooks/shared-provenance.ts`; honoring parent convention. |
| Q-A-4 | Is the 170-closer rewrap scope (016 checklist) complete, or are there hidden siblings in `research/`? | T-EVD-01-prep implementer | No — parent plan §2.5 frozen at 170. Wave C T-EVD-01 catches any stragglers via lint. |
<!-- /ANCHOR:questions -->

---

## 11. APPROVAL

| Role | Name | Status |
|------|------|--------|
| Parent phase owner | claude-opus-4.7 (orchestrator) | approved (via parent 017 plan) |
| Child phase scaffolder | claude-opus-4.7 (this session) | drafted 2026-04-17 |
| Implementation executor | cli-codex gpt-5.4 xhigh fast (primary) | pending dispatch |
| Review gate | `/spec_kit:deep-review :auto` ×7 | pending |

---

**End of spec.md**
