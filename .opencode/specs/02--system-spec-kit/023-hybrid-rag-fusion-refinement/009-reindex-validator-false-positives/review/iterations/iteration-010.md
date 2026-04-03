# Iteration 010: Adversarial Validation

## Scope

Reviewed all prior review iterations `001-009` from the parent packet at `.opencode/specs/02--system-spec-kit/023-hybrid-rag-fusion-refinement/review/iterations/` and re-verified every prior `P0`/`P1` finding against the current source tree and current spec packet state.

## P0 Findings Reviewed

None.

## P1 Findings Reviewed

### ITER001-P1-1 — `@spec-kit/mcp-server` package root is side-effectful and starts the server on import
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: `mcp_server/package.json` still points `"."` at `dist/context-server.js`, but `mcp_server/context-server.ts:1167-1170` now guards startup behind `isMain`; a bare import no longer calls `main()` unconditionally.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER001-P1-2 — The ESM migration raises runtime requirements to Node 20.11+, but the workspace/scripts contract still advertises Node 18
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: The current root, `scripts`, and `mcp_server` package manifests all declare `engines.node >=20.11.0` (`package.json:11-13`, `scripts/package.json:7-9`, `mcp_server/package.json:37-39`), so the metadata mismatch cited in iteration 001 is gone.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER002-P1-1 — Shared-memory admin authorization is still spoofable because the handler trusts caller-supplied actor IDs
- **Original Severity**: P1
- **Verified**: true
- **Evidence Check**: `mcp_server/handlers/shared-memory.ts:224-236` still states actor IDs are caller-supplied and not cryptographically bound; `validateCallerAuth()` still computes `isAdmin` by comparing those raw IDs to configured admin identity, and admin-only handlers still branch on that result (`shared-memory.ts:436-458`, `627-633`, `780-787`).
- **Revised Severity**: same
- **Status**: confirmed

### ITER002-P1-2 — The ESM V-rule bridge fails open, so a load or packaging regression disables runtime validation for all `memory_save` calls
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: `mcp_server/handlers/v-rule-bridge.ts:90-101` now returns an error-shaped unavailable result by default, and `mcp_server/handlers/memory-save.ts:211-213` throws `VRuleUnavailableError` when that happens. The only bypass left is the explicit opt-out path guarded by `SPECKIT_VRULE_OPTIONAL === 'true'`.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER002-P1-3 — `shared/paths.ts` lets `cwd` and relative env/config values steer the database root outside the package workspace
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: `shared/paths.ts:60-67` now validates resolved paths against the workspace root discovered from `import.meta.dirname`, and `shared/paths.ts:91-106` falls back to a package-relative path if a configured DB path escapes that root. The original "outside workspace" steering issue is mitigated.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER003-P1-1 — `CHK-010` is falsely marked complete because the packet no longer tells a single story about migration state
- **Original Severity**: P1
- **Verified**: true
- **Evidence Check**: `checklist.md:32-34` still says the packet docs are synchronized and "keep runtime implementation pending," but `plan.md:43-47`, `tasks.md:47-86`, and `implementation-summary.md:23-34` all describe completed shipment. The checklist evidence sentence is no longer truthful.
- **Revised Severity**: same
- **Status**: confirmed

### ITER003-P1-2 — `plan.md`, `tasks.md`, and checklist closure gates no longer trace to the packet's shipped-complete narrative
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: The specific closure-gap evidence from iteration 003 no longer holds: `plan.md` now has all Definition of Done items checked, `tasks.md` marks T001-T016 complete, and `checklist.md` is fully checked. The broader packet still has drift, but this exact finding was addressed.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER003-P1-3 — `spec.md` still embeds a stale phase-parent addendum that contradicts the claimed final packet state
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: The specific stale addendum evidence from iteration 003 is gone: the stray `006-phase-6 -> 007-phase-7` placeholder row is absent, and the phase map is populated through phase 8. There is still documentation drift elsewhere, but not the exact stale-tail issue previously cited.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER004-P1-1 — `scripts/core/workflow.ts` uses three different dynamic-import degradation contracts for the same `@spec-kit/mcp-server/api` surface
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: `scripts/core/workflow.ts:199-209` now centralizes degradation behind `tryImportMcpApi()`, and the retry-manager path is memoized through `loadWorkflowRetryManager()`. The fragmented import-contract issue called out in iteration 004 has been consolidated.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER006-P1-1 — `memory_save` collapses post-commit persistence failures into generic "anchor issues" warnings, obscuring partial-failure recovery
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: `mcp_server/handlers/memory-save.ts:987` now emits a `[file-persistence-failed] ...` warning tag, and `mcp_server/handlers/save/response-builder.ts:370-387` preserves typed warning categories and separates file-persistence warnings from anchor issues in the response message.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER007-P1-1 — Phase 4 is still incomplete at the child-packet level, so the parent packet cannot auditably claim the verification-and-standards phase shipped
- **Original Severity**: P1
- **Verified**: true
- **Evidence Check**: The child packet is no longer raw-template incomplete: `004-verification-and-standards/tasks.md` is checked through closure and `implementation-summary.md` is populated. However, `004-verification-and-standards/spec.md:50-56` still says `Status | Pending`, and its phase context still says `Phase 4 of 4` / `Successor | None` even though the parent packet progressed through phases 5-8. The remaining problem is stale child metadata, not wholesale incompleteness.
- **Revised Severity**: downgraded
- **Status**: confirmed

### ITER007-P1-2 — The reviewed ESM-focused tests still do not prove CHK-005 and CHK-006, so those unchecked P0 items are not mere stale boxes
- **Original Severity**: P1
- **Verified**: true
- **Evidence Check**: `mcp_server/tests/modularization.vitest.ts` validates selected emitted-import patterns and barrel structure, `scripts/tests/import-policy-rules.vitest.ts` checks sample prohibited import paths, and `mcp_server/tests/tool-input-schema.vitest.ts` is unrelated to ESM runtime proof. I did not find a whole-tree source/import proof or emitted-artifact proof matching the exact breadth claimed by `checklist.md:55-57`.
- **Revised Severity**: same
- **Status**: confirmed

### ITER008-P1-1 — The shipped `mcp_server/scripts` compatibility wrappers still use `__dirname` inside an ESM package, so both bridge entrypoints crash before they can delegate
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: Both wrappers now resolve their targets with `import.meta.dirname` (`mcp_server/scripts/map-ground-truth-ids.ts:10`, `mcp_server/scripts/reindex-embeddings.ts:9`), so the crash condition identified in iteration 008 is gone.
- **Revised Severity**: downgraded
- **Status**: already-fixed

### ITER009-P1-1 — Preflight exact-duplicate checks ignore governed scope, so `memory_save` can leak cross-tenant/shared-space memory metadata and falsely reject scoped saves
- **Original Severity**: P1
- **Verified**: false
- **Evidence Check**: `mcp_server/lib/validation/preflight.ts:514-555` now includes `scopeFilters` in the exact-duplicate SQL, and `memory-save.ts:1285-1288` threads `tenantId`, `userId`, `agentId`, and `sharedSpaceId` into preflight. The duplicate result is also scope-redacted before payload shaping.
- **Revised Severity**: downgraded
- **Status**: already-fixed

## Missed Issues

No new source-code `P0`/`P1` issue was missed by the earlier iterations.

The only residual gap I found is documentation truth-sync drift that is already adjacent to prior findings rather than a wholly new class of issue: the parent `spec.md` still presents an implementation-pending / active-phase narrative while sibling packet artifacts describe completed shipment.

## Contradictions

No prior findings directly contradicted each other.

The main conflict is between the later packet narrative and the live packet state:

- `implementation-summary.md:58-63` claims the deep-review findings were fully remediated.
- Current docs still retain at least two live packet-quality gaps (`CHK-010` truth-sync drift and insufficient proof for `CHK-005`/`CHK-006`), plus one downgraded advisory in the phase-4 child spec metadata.

## Overall Confidence in Review Quality

**Moderate-high (0.82).**

The review loop found the right risk areas, especially around ESM entrypoints, scope/governance, and packet truth-sync. Its weakest point was closure tracking: many legitimate `P1` findings were later fixed, but the review packet was not fully reconciled after those fixes landed.

## Final Verdict

- **Verdict**: CONDITIONAL
- **hasAdvisories**: true

### Summary Counts

- Prior `P0` findings reviewed: 0
- Prior `P1` findings reviewed: 14
- Confirmed as still live: 4
- Already fixed: 10
- False positives: 0

### Current Open Findings

- **P1**: 3
  - Shared-memory admin auth still trusts caller-supplied identity.
  - Parent packet `CHK-010` synchronization claim is still false.
  - `CHK-005` / `CHK-006` still overclaim verification breadth relative to actual test proof.

- **P2**: 1
  - Phase 4 child packet metadata is stale even though the child tasks/summary are largely complete.

### Release Assessment

No surviving `P0` blocker remains, so this is not a `FAIL`.

However, the remaining `P1` items are real enough that I would not call the packet fully release-clean. The codebase itself is substantially healthier than the earlier iterations suggested, but the release packet and shared-memory admin trust model still need follow-up. That makes the best adversarial verdict **CONDITIONAL**, with one advisory-level documentation cleanup still open.
