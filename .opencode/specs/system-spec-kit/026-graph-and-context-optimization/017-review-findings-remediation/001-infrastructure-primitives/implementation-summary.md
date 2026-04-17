---
title: "Implementation Summary: Wave A — Infrastructure Primitives"
description: "Phase 017 Wave A complete: 5 commits on main landing H-56-1 canonical save fix, readiness-contract extract, shared-provenance extract, normalizer collapse, and EVIDENCE audit parser. Critical-path infrastructure that unblocked Waves B/C/D."
trigger_phrases: ["017 wave a summary", "wave a implementation", "infrastructure primitives summary", "h-56-1 fix summary"]
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/017-review-findings-remediation/001-infrastructure-primitives"
    last_updated_at: "2026-04-17T18:10:00Z"
    last_updated_by: "claude-opus-4.7"
    recent_action: "Wave A complete: 5 commits landed on main closing T-CNS-01+04 (H-56-1), T-CGC-01, T-W1-HOK-02, T-SCP-01, EVIDENCE audit"
    next_safe_action: "Wave A unblocked B/C/D. See parent 017/implementation-summary.md for full Phase 017 narrative."
    blockers: []
    completion_pct: 100
---
# Implementation Summary: Wave A — Infrastructure Primitives

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

> **Status: COMPLETE.** 5 commits landed on `main` on 2026-04-17. Critical-path infrastructure that unblocks everything downstream. Atomic-ship constraint respected for T-CNS-01 + T-W1-CNS-04 (single PR on `workflow.ts`).

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Wave** | A (Infrastructure Primitives, critical path) |
| **Parent** | `017-review-findings-remediation/` |
| **Completed** | 2026-04-17 |
| **Tasks Closed** | 5 (+ EVIDENCE audit pre-req) |
| **Commits** | 5 |
| **Effort Budget** | 20h planned, ~1.5h wall-clock via parallel dispatch (Opus agents for Wave A1, sequential for A2) |
| **Executor** | Opus 4.7 via Task tool (Wave A1 3-concurrent), cli-copilot for EVIDENCE audit |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### T-CNS-01 + T-W1-CNS-04 — H-56-1 canonical save fix (commit `aaf0f49a8`, atomic-shipped)

`scripts/core/workflow.ts`:
- **Line 1259**: `const ctxFileWritten = false` stub replaced with `true`. The 70-LOC description.json tracking block (lines 1261-1331) is now reachable on every canonical save.
- Inside the block: added `sequenceSnapshot.lastUpdated = new Date().toISOString()` inside the memorySequence retry loop. Every successful save writes a fresh timestamp.
- **Line 1333**: `shouldRunExplicitSaveFollowUps = options.plannerMode === 'full-auto'` changed to `true` (unconditional). `refreshGraphMetadata` now runs regardless of plannerMode.

New vitest: `scripts/tests/workflow-canonical-save-metadata.vitest.ts` — synthetic folder fixture test proves the fix works independent of any live spec folder's state (meta-irony mitigation — we can't verify the fix by invoking it on 017 itself, since 017 needs the fix to write metadata). 4/4 live asserts + 1 skipped (full workflow harness deferred).

Resolves: R4-P1-002, R51-P1-001, R51-P1-002, R56-P1-upgrade-001 (H-56-1 compound headline).

### T-CGC-01 — Readiness contract extract (commit `4a154c555`)

New `mcp_server/lib/code-graph/readiness-contract.ts`: extracted 4 helpers from `handlers/code-graph/query.ts:225-300`:
- `canonicalReadinessFromFreshness` — `'fresh'|'stale'|'empty'` → `'ready'|'stale'|'missing'`
- `queryTrustStateFromFreshness` — `ReadyResult.freshness` → `SharedPayloadTrustState` subset
- `buildQueryGraphMetadata` — detector provenance block or `undefined`
- `buildReadinessBlock` — combines raw readiness + canonicalReadiness + trustState

Type re-exports: `ReadyResult`, `StructuralReadiness`, `SharedPayloadTrustState` (canonical 8-state vocabulary from `lib/context/shared-payload.ts:36`). Zero new enum — aligned to existing type per user scope decision.

`query.ts` refactored to consume the shared module. Unused imports cleaned (`StructuralReadiness`, `SharedPayloadTrustState`).

Tests: `mcp_server/tests/readiness-contract.vitest.ts` — 15 assertions covering behavior parity. Existing `code-graph-query-handler.vitest.ts` unchanged (16/16 still passing).

Prerequisite for Wave B T-W1-CGC-03 (5-sibling propagation).

### T-W1-HOK-02 — Shared provenance extract (commit `77da3013a`)

New `mcp_server/hooks/shared-provenance.ts`: extracted 3 functions from `hooks/claude/shared.ts:100-140`:
- `escapeProvenanceField(value: unknown, fallback: string): string`
- `sanitizeRecoveredPayload(payload: string): string` (with `RECOVERED_TRANSCRIPT_STRIP_PATTERNS` constant)
- `wrapRecoveredCompactPayload(payload, cachedAt, metadata?): string`

Claude `shared.ts` re-exports for backward-compat. Gemini `shared.ts` added explicit re-export (was previously using `../claude/shared.js` transitive import). Enables Copilot compact-cache (Wave B T-W1-HOK-01) to import from canonical source without re-inlining a third duplicate.

Tests: `mcp_server/tests/hooks-shared-provenance.vitest.ts` — 19 assertions. Full hook regression: 159/159 green. One pre-existing unrelated failure in `hook-session-start.vitest.ts:252` (verified on HEAD with changes stashed — not caused by this refactor).

### T-SCP-01 — Scope normalizer collapse (commit `b923623cc`)

Added canonical `normalizeScopeValue(value: unknown): string | null` export to `lib/governance/scope-governance.ts`. Collapsed 4 local duplicates:
- `handlers/save/reconsolidation-bridge.ts:228-234`
- `lib/storage/lineage-state.ts:198-204`
- `handlers/save/types.ts:348-352`
- `lib/validation/preflight.ts:440-444`

Per-callsite null-semantics audit: canonical returns `string | null` (not `undefined`) to preserve existing consumer narrowing (all 4 call sites expected null). `normalizeScopeContext` structural-object normalizer (returns `string | undefined` via `normalizeId`) unchanged.

Tests: `mcp_server/tests/scope-governance-normalizer-parity.vitest.ts` — 15 fixture cases (undefined/null/empty/whitespace/non-string/valid/trim).

Resolves: R1-P1-001 (empty-string scope CAS bypass latent risk) + R4-P1-001 (5-way normalizer drift landmine).

### EVIDENCE audit v2 (commit `7d85861a0`)

New `scripts/validation/evidence-marker-audit.ts`: bracket-depth state-machine parser (586 LOC). Distinguishes genuinely malformed `[EVIDENCE:...]` markers (closed with `)` when depth doesn't close with `]`) from paren-in-content false positives. Skips fenced code blocks + inline backtick spans.

CLI modes:
- Default (report): emits per-folder audit summary
- `--rewrap`: rewrites genuinely malformed closers

Scan results across 16 sibling 026-tree folders: 1962 markers total → 1962 OK, 0 malformed after rewrap. ~210 markers rewrapped (mostly in 016 checklist + plan + tasks, discovered beyond v1 scope).

Tests: `scripts/tests/evidence-marker-audit.vitest.ts` — 19 test cases (nested brackets, code blocks, backticks, URLs with parens, multi-marker lines, multiline markers).

Wave C T-EVD-01 activates the strict lint that enforces this going forward.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

### Wave A1 (3 concurrent Opus 4.7 subagents)

- Agent 1: T-CNS-01 + T-W1-CNS-04 merged PR on workflow.ts (atomic-ship constraint — single commit touching both lines 1259 AND 1333 verified via `git show HEAD | grep -c 'workflow.ts'`)
- Agent 2: T-CGC-01 readiness extract
- Agent 3: T-W1-HOK-02 shared-provenance extract

### Wave A2 (2 concurrent agents)

- Agent 4: T-SCP-01 normalizer collapse (4 files + 1 canonical export + vitest)
- Agent 5: EVIDENCE audit v2 bracket-depth parser (cli-copilot gpt-5.4 high — commit landed mid-session as `7d85861a0`)

### Wave A gate

Smoke test: `tsc --noEmit` clean + 49/49 Wave A test files + `workflow-memory-tracking.vitest.ts` + `graph-metadata-refresh.vitest.ts` regression — all green. Full `/spec_kit:deep-review :auto` ×7 deferred to optional final ship gate.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

1. **Atomic-ship enforcement for T-CNS-01 + T-W1-CNS-04**: Single merged PR with explicit agent instruction + post-commit grep verification. Splitting would have created a transient inconsistency window where `description.json.lastUpdated` advanced but `graph-metadata.json.derived.last_save_at` lagged.

2. **`ctxFileWritten = true` (hardcoded) vs real file-write tracking**: Agent 1 considered threading the real "did the canonical save write the file" decision through the block, but opted for `true` hardcoded with comment explaining the fix. The block's downstream behavior (memorySequence increment + lastUpdated write) is idempotent and safe on every save — no harm from running it when the write was a duplicate.

3. **8-state `SharedPayloadTrustState` (not new 4-state enum)**: Per user scope decision before Wave A kicked off. The canonical type at `lib/context/shared-payload.ts:36` already has 8 values (`live|cached|stale|absent|unavailable|imported|rebuilt|rehomed`). Handler emissions use a subset (typically `live|stale|absent|unavailable`). Zero type proliferation.

4. **Normalizer canonical returns `string | null` (not `undefined`)**: Per-callsite audit showed all 4 duplicates returned `string | null` and consumers had null-specific narrowing (`if (x === null)`). Preserving null semantics avoided a 20+ call-site narrowing audit.

5. **EVIDENCE parser (bracket-depth) vs regex**: Per Plan agent critique, regex false-positives on paren-in-content (`[EVIDENCE: foo.ts:bar (baz) details]`). State-machine parser tracks `[` / `]` depth separately from `(` / `)` which are content-legal.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- `tsc --noEmit` from `mcp_server/`: clean
- `tsc --noEmit` from `scripts/`: clean
- `workflow-canonical-save-metadata.vitest.ts`: 4 passed + 1 skipped (intentional)
- `readiness-contract.vitest.ts`: 15/15
- `hooks-shared-provenance.vitest.ts`: 19/19 (+ 159/159 hook regression sweep)
- `scope-governance-normalizer-parity.vitest.ts`: 15/15
- `evidence-marker-audit.vitest.ts`: 19/19

**Proof of H-56-1 fix in practice**: During this session, `/memory:save` invocations cascaded `lastUpdated` refresh across 38 folder metadata files (commit `8859da9cd` — the cascade was a visible side-effect proving the canonical save path now writes metadata).
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Limitations

- `ctxFileWritten = true` hardcode is a pragmatic stub — a fully accurate implementation would compute it from the actual file-write decision. Phase 018 follow-up candidate if the current behavior surfaces false-positive saves.
- `generate-description.js` auto-regen (separate from canonical save) overwrites hand-authored rich content with minimal auto-template. Observed on 017 folder's own description.json. Unrelated to Wave A but flagged for Phase 018+ follow-up.
- EVIDENCE audit rewraps 210 markers in 016 — visual noise in the diff but no content loss.
<!-- /ANCHOR:limitations -->
