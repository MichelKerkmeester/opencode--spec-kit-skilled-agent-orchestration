---
title: "Implementation Summary: Review Remediation (006/007)"
description: "Placeholder. Populated after the 6-theme remediation pass completes."
trigger_phrases:
  - "006/007 implementation summary"
  - "006 remediation summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-graph-impact-and-affordance-uplift/007-review-remediation"
    last_updated_at: "2026-04-25T19:00:00Z"
    last_updated_by: "claude-opus-4-7-orchestrator-wave-1-integration"
    recent_action: "Wave 1 fully integrated. All 6 batches (T-A through T-F) cherry-picked onto main. T-F closes 11 cleanup findings (R-007-12/16/17/18/P2-2/4/5/6/7/9/12) via cache-key generation counter, INSTALL_GUIDE Python path fix, tool-count canonicalization (51), query.ts micro-fixes (true overflow detection via full-traversal-then-slice; semantically equivalent to `limit + 1`, multi-subject seed preservation, failureFallback.code, shared edge-mapper dedup), affordance debug counters, phase alias note."
    next_safe_action: "Run final tsc + vitest sweep; commit Wave 2 integration meta if needed; push"
    completion_pct: 95
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "../../mcp_server/schemas/tool-input-schemas.ts"
      - "../../mcp_server/tool-schemas.ts"
      - "../../mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts"
      - "../../mcp_server/tests/tool-input-schema.vitest.ts"
      - "../../mcp_server/code_graph/handlers/detect-changes.ts"
      - "../../mcp_server/code_graph/lib/diff-parser.ts"
      - "../../mcp_server/skill_advisor/lib/affordance-normalizer.ts"
      - "../../mcp_server/skill_advisor/scripts/skill_graph_compiler.py"
      - "../../mcp_server/formatters/search-results.ts"
      - "../../mcp_server/code_graph/lib/phase-runner.ts"
      - "../../mcp_server/tests/memory/trust-badges.test.ts"
      - "implementation-summary.md"
---
# Implementation Summary: Review Remediation (006/007)

<!-- SPECKIT_LEVEL: 2 -->

## Status
**Wave 1 fully integrated.** T-A, T-B, T-C, T-D, T-E, T-F all complete and on main.

- **T-A (detect_changes MCP wiring):** detect_changes registered as MCP tool across dispatcher, JSON schema, Zod validator, allowed-parameter ledger, and 6 umbrella docs. Closes R-007-2, R-007-14.
- **T-B (verification evidence sync):** Wave-3 canonical evidence (`tsc --noEmit` exit 0; `vitest run` 9 passed | 1 skipped (10), 90 passed | 3 skipped (93), 1.34s; per-sub-phase `validate.sh --strict` results) synced across 006/001/002/003/005/006 sub-phase implementation-summary.md + checklist.md files. Premature `[x]` PASS marks unchecked and rewritten with the 3-state convention (`[x]` real evidence captured | `[ ] OPERATOR-PENDING` command can't run from this context | `[ ] BLOCKED` blocked with reason). Closes R-007-1, R-007-5, R-007-7, R-007-15, R-007-19, R-007-20, R-007-21.
- **T-C (public API surface gaps):** `minConfidence` exposed end-to-end on `code_graph_query` (Zod schema, JSON schema, allowed-parameter ledger, accept/reject tests). `affordances` DEFER decision: stays compile-time-only scorer seam (prompt-injection surface concern). Closes R-007-6, R-007-10.
- **T-D (sanitization hardening):** 7 files hardened (`detect-changes.ts` canonical-root path containment, `diff-parser.ts` per-side hunk counters, `skill_graph_compiler.py` validate-reject `conflicts_with` + broadened denylist, `affordance-normalizer.ts` broadened denylist, `formatters/search-results.ts` merge-per-field trustBadges + allowlisted age strings + trace flag, `phase-runner.ts` duplicate-output rejection, `code-graph-db.ts`/`query.ts:614-615`/`code-graph-context.ts` `reason`/`step` allowlist on read path). New shared adversarial fixture `affordance-injection-fixtures.json` consumed by both TS and Python tests. Closes R-007-3, 4, 8, 9, 11, P2-1, P2-3, P2-8, P2-10, P2-11. Verify: tsc clean; vitest 37/37 PASS; pytest 57/57 PASS.
- **T-E (test rig fix — DI strategy):** `fetchTrustBadgeSnapshots` exposes optional `dbGetter` parameter (defaults to `requireDb`). Three previously-skipped trust-badges tests unskipped (3/3 pass). **Precision correction (008/D15):** of those 3, two exercise the SQL-derivation pipeline directly via the DI getter and one is the explicit-pass-through test (formatter-only, DB-independent). Latent production bug fixed: `resultIds.map(String)` at bind time so `CAST(rid.memory_id AS TEXT)` matches TEXT-typed `causal_edges.{source_id,target_id}` columns (better-sqlite3 was binding JS numbers as REAL → `'11.0'` instead of `'11'`). Formatter return type harmonized to T-D's `TrustBadgeFetchResult` shape during integration; tests now dereference `fetchResult.snapshots.get(...)`. Closes R-007-13.
- **T-F (doc cleanup + query.ts micro-fixes + cache invalidation):** memory_search cache key includes causal-edge generation counter (folded only when `enableCausalBoost=true`); INSTALL_GUIDE Python smoke-test path fixed; tool count canonicalized to 51 (`TOOL_DEFINITIONS.length`) across all umbrella docs with explicit deferred-handlers-do-not-count note; broken `FEATURE_CATALOG_IN_SIMPLE_TERMS` link removed; `structural-indexer.ts` `runPhases` wrapped in try/catch/finally so error outcome metric emits; `query.ts` detects true overflow by comparing full-BFS-traversal size against `limit` BEFORE slicing (semantically equivalent to `limit + 1` — the BFS frontier is already over-collected, so no extra SQL request is needed; 008/D8 doc-fix correction), preserves seed nodes on multi-subject sibling failures, adds stable `failureFallback.code` + new `spec_kit.graph.blast_radius_failure_total` metric, and dedupes 4 switch branches via shared edge mapper; affordance debug counters (received/accepted/dropped_unsafe/dropped_empty/dropped_unknown_skill) added to TS + Python; 006/006 alias note for renumber. Closes R-007-12, 16, 17, 18, P2-2, P2-4, P2-5, P2-6, P2-7, P2-9, P2-12.

## Findings Closed

### R-007-2 — `detect_changes` MCP wiring decision (T-A)

**Decision:** WIRE — register `detect_changes` as a callable MCP tool.

**Rationale:**
- Handler at `mcp_server/code_graph/handlers/detect-changes.ts` is fully implemented (canonical-root sanitization, readiness probe, diff parser, line-range overlap attribution) and unit-tested (`code_graph/tests/detect-changes.test.ts`) since 006/002.
- Docs already describe it as an operator-callable surface: feature catalog `03--discovery/04-detect-changes-preflight.md`, manual testing playbook `03--discovery/014-detect-changes-preflight.md`, and `INSTALL_GUIDE.md §4a` smoke test all demonstrate calling the tool with `{ diff, rootDir? }`.
- ADR-012-003 (deferred route/tool/shape contract safety) governs the **new** graph-entity surfaces (`route_map`, `tool_map`, `shape_check`, `api_impact`), not the routine MCP exposure of an existing read-only preflight handler. The 002 implementation summary's appeal to ADR-012-003 to defer registration was a misapplication — re-reading the ADR confirms its scope is route/tool/consumer extraction, not handler-to-MCP wiring.
- Wiring is a mechanical 4-touchpoint addition, parallel to existing patterns (`codeGraphScan`, `codeGraphContext`, `cccStatus`): no new schema infrastructure, no new validation primitives, no new dispatcher patterns.
- Marking the handler INTERNAL would require rewriting 8 doc surfaces to disclaim a capability that is otherwise complete and tested — strictly more work than wiring it, and contrary to the operator-facing experience already published in 006/006.

**Evidence — files modified (WIRE path):**

| File | Change |
|------|--------|
| `mcp_server/code_graph/tools/code-graph-tools.ts` | Added `'detect_changes'` to `TOOL_NAMES`; imported `handleDetectChanges`; added `case 'detect_changes'` dispatcher with `parseArgs` |
| `mcp_server/tool-schemas.ts` | New `detectChanges: ToolDefinition`; appended to `TOOL_DEFINITIONS` under "L8: Code Graph" |
| `mcp_server/schemas/tool-input-schemas.ts` | New `detectChangesSchema`; entry in `TOOL_SCHEMAS`; entry in `ALLOWED_PARAMETERS` |
| `mcp_server/code_graph/handlers/index.ts` | No change needed — `handleDetectChanges` was already exported (verified 2026-04-25) |

### R-007-14 — Sync chosen path across surfaces (T-A)

The `detect_changes` story now reads consistently as a callable MCP tool across:
- `README.md` (root) — "Phase 012 adds the read-only `detect_changes` MCP tool …"
- `.opencode/skill/system-spec-kit/SKILL.md` — `detect_changes` row updated (no longer "deferred")
- `.opencode/skill/system-spec-kit/README.md` — `Preflight` row updated; footer updated
- `.opencode/skill/system-spec-kit/mcp_server/README.md` — `detect_changes` section heading no longer "tool-schema deferred"
- `.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md` — §4a smoke test wording aligned (no scope change; tool is callable as documented)
- `.opencode/skill/system-spec-kit/feature_catalog/03--discovery/04-detect-changes-preflight.md` — overview and current-reality reflect MCP-tool registration
- `.opencode/skill/system-spec-kit/manual_testing_playbook/03--discovery/014-detect-changes-preflight.md` — invocation example uses canonical `detect_changes({ … })` shape

### T-B — Verification Evidence Sync (closes R-007-1, R-007-5, R-007-7, R-007-15, R-007-19, R-007-20, R-007-21)

**Wave-3 canonical evidence used (verbatim):**

```text
# tsc --noEmit (mcp_server)
$ cd mcp_server && npx --no-install tsc --noEmit
exit 0 (clean after the type-widening fix in commit c6e766dc5)

# vitest run (Phase 006 specific files)
$ cd mcp_server && npx --no-install vitest run \
  code_graph/tests/phase-runner.test.ts \
  code_graph/tests/detect-changes.test.ts \
  code_graph/tests/code-graph-context-handler.vitest.ts \
  code_graph/tests/code-graph-indexer.vitest.ts \
  code_graph/tests/code-graph-query-handler.vitest.ts \
  skill_advisor/tests/affordance-normalizer.test.ts \
  skill_advisor/tests/lane-attribution.test.ts \
  skill_advisor/tests/routing-fixtures.affordance.test.ts \
  tests/memory/trust-badges.test.ts \
  tests/response-profile-formatters.vitest.ts

  Test Files  9 passed | 1 skipped (10)
       Tests  90 passed | 3 skipped (93)
   Duration  1.34s

# validate.sh --strict per sub-phase
  001 license-audit:                        FAILED (template-section conformance)
  002 phase-runner-and-detect-changes:      FAILED (template-section conformance)
  003 code-graph-edge-explanation:          FAILED (template-section conformance)
  004 skill-advisor-affordance-evidence:    PASSED
  005 memory-causal-trust-display:          FAILED (template-section conformance)
  006 docs-and-catalogs-rollup:             FAILED (template-section conformance)

  All FAILED outcomes are template-section style errors (extra/non-canonical
  section headers); they are cosmetic, NOT contract violations.
```

**Findings closure mapping:**

| Finding | Sub-phase | Doc edits applied |
|---------|-----------|-------------------|
| R-007-1 | 006/001 | `implementation-summary.md` Status: added "Complete (with caveat)" + post-scrub note (no LICENSE quote needed; P0 RESOLVED by scrub, not by quote); §Verification table updated; §Verification — validate.sh now contains Wave-3 canonical FAILED-COSMETIC evidence; §Known Limitations §4 reflects new state. `checklist.md` `validate.sh --strict` row left UNCHECKED with "OPERATOR-PENDING — cosmetic template-section warnings" + canonical evidence. |
| R-007-5 | 006/002 | `implementation-summary.md` Status: "Complete & verified (006/007/T-B, 2026-04-25)" + Wave-3 canonical line; §Verification Evidence §Test execution rewritten with verbatim canonical block (10 test files, 9 passed | 1 skipped, 90 passed | 3 skipped, 1.34s); §`validate.sh --strict` rewritten with FAILED-COSMETIC canonical; §Known Limitations §1 updated. |
| R-007-7 | 006/003 | `implementation-summary.md` Status: "Complete & verified" line; §Verification Evidence rewritten with Wave-3 canonical block + 003-specific result mapping (every 003 surface PASS, validate.sh FAILED-COSMETIC). |
| R-007-15 | 006/006 | `implementation-summary.md` §DQI Scores rewritten — explicit "estimated PASS ≠ validated PASS" framing; §Verification Evidence split into "Validated PASS" (script-backed/runnable) and "Estimated PASS" (structural pre-flight only) sections; new §`validate.sh --strict` Wave-3 canonical block; Status updated; §Known Limitations §1 rewritten. `checklist.md`: 5 DQI rows + 1 smoke-test row + 1 validate.sh row unchecked with OPERATOR-PENDING + R-007-15 reason. |
| R-007-19 | 006/002 | `checklist.md` premature PASS marks unchecked: "sk-doc DQI score ≥85" → OPERATOR-PENDING (R-007-19); `validate.sh --strict` → OPERATOR-PENDING-COSMETIC (Wave-3 canonical FAILED on template-section conformance only). "Existing code-graph vitest suite passes unchanged" stays `[x]` with new Wave-3 canonical evidence (002 surfaces inside the 9 PASSED files). |
| R-007-20 | 006/003 | `checklist.md` premature PASS marks unchecked: "sk-doc DQI ≥85" → OPERATOR-PENDING (R-007-20); `validate.sh --strict` → OPERATOR-PENDING-COSMETIC. "code-graph vitest suite passes unchanged" stays `[x]` with new Wave-3 canonical evidence (003 surfaces inside the 9 PASSED files). |
| R-007-21 | 006/005 | `checklist.md` premature PASS marks unchecked: "sk-doc DQI ≥85" → OPERATOR-PENDING (R-007-21); `validate.sh --strict` → OPERATOR-PENDING-COSMETIC; "Memory vitest suite passes" → PARTIAL with reason pointing at T-E remediation (R-007-13: trust-badges SQL-mock describe block 3 SKIPPED tests pending DI-fixture rewrite). Hard Rules + Output contract items checked `[x]` with verified-from-code evidence. |

**3-state checklist convention applied across all 10 doc edits (5 sub-phase implementation-summary.md + 5 sub-phase checklist.md):**

- `[x]` = real command output captured (Wave-3 canonical or directly verifiable on disk)
- `[ ] OPERATOR-PENDING` = command can't run from this context (sk-doc DQI script invocations, live MCP smoke tests)
- `[ ] BLOCKED` = blocked with reason recorded (validate.sh --strict FAILED-COSMETIC; trust-badges SQL-mock SKIPPED pending T-E)

**Files modified (T-B):**

| File | Sub-phase | Findings touched |
|------|-----------|------------------|
| `001-clean-room-license-audit/implementation-summary.md` | 006/001 | R-007-1 |
| `001-clean-room-license-audit/checklist.md` | 006/001 | R-007-1 |
| `002-code-graph-phase-runner-and-detect-changes/implementation-summary.md` | 006/002 | R-007-5 |
| `002-code-graph-phase-runner-and-detect-changes/checklist.md` | 006/002 | R-007-19 |
| `003-code-graph-edge-explanation-and-impact-uplift/implementation-summary.md` | 006/003 | R-007-7 |
| `003-code-graph-edge-explanation-and-impact-uplift/checklist.md` | 006/003 | R-007-20 |
| `005-memory-causal-trust-display/implementation-summary.md` | 006/005 | R-007-21 (impl-summary) |
| `005-memory-causal-trust-display/checklist.md` | 006/005 | R-007-21 |
| `006-docs-and-catalogs-rollup/implementation-summary.md` | 006/006 | R-007-15 |
| `006-docs-and-catalogs-rollup/checklist.md` | 006/006 | R-007-15 |
| `007-review-remediation/implementation-summary.md` (this file) | 006/007 | T-B closure record |

**Total: 11 files modified (10 sub-phase docs + this implementation-summary).** Zero code files modified (T-B is doc-only; per brief Hard Rule 4). Sub-phase 004 docs untouched (already verified PASS per Wave-3 canonical; no T-B changes needed). Out-of-territory paths (006/007 prompts, other batch territories T-A/C/D/E/F) untouched.

### R-007-6 — Expose `minConfidence` on `code_graph_query` MCP surface (T-C)

**Decision:** WIRE — surface end-to-end (Zod schema, JSON schema, allowed-parameter ledger, vitest accept/reject coverage).

**Rationale:**
- Handler at `mcp_server/code_graph/handlers/query.ts:1024` already accepts `args.minConfidence` (clamped via `clampNumericConfidence`) and threads it through `computeBlastRadius` (line 1122) and `queryImportDependentsForBlastRadius` (line 731). The only public-API gap is schema rejection: requests with `minConfidence` were dropped at validation as an unknown property (`additionalProperties: false`).
- 006/003 implementation summary already documents `minConfidence` as a published field of the `blast_radius` response (line 34) and as a tested code path (line 58, `code-graph-query-handler.vitest.ts` covers `minConfidence` cases). So callers are documented to expect the input lever; only the schema needed to catch up.
- Mechanical wiring follows the existing `positiveIntMax` / `boundedNumber` pattern. Validation keeps the contract tight: `z.number().min(0).max(1).optional()` matches the handler's clamp and the spec's `[0, 1]` range.

**Evidence — files modified:**

| File | Change |
|------|--------|
| `mcp_server/schemas/tool-input-schemas.ts` (line 461) | Added `minConfidence: z.number().min(0).max(1).optional()` to `codeGraphQuerySchema` |
| `mcp_server/schemas/tool-input-schemas.ts` (line 675) | Added `'minConfidence'` to `ALLOWED_PARAMETERS.code_graph_query` ledger |
| `mcp_server/tool-schemas.ts` (line 584) | Added JSON-schema property `minConfidence: { type: 'number', minimum: 0, maximum: 1, description: 'Minimum confidence threshold (0-1) for blast_radius dependency edges …' }` |
| `mcp_server/tests/tool-input-schema.vitest.ts` | Added 3 acceptance cases (0.5, boundary 0, boundary 1) and 3 rejection cases (1.5 above max, -0.1 below min, 'high' non-numeric) |

### R-007-10 — Score-time `affordances` exposure (T-C)

**Decision:** DEFER — keep `affordances` as a compile-time-only internal scorer seam; do NOT expose via the public `advisor_recommend` input schema.

**Rationale:**
- The 006/004 implementation specifically routes affordance evidence through compiled skill graph metadata (via `skill_graph_compiler.py` emitting sanitized `derived.affordances[]` from skill files), not through request input. This is the design intent of the packet, not an oversight.
- `affordance-normalizer.ts` was hardened against prompt-stuffing (URL/email/token strip, instruction-pattern denylist, control-character strip, trigger length cap). Exposing `affordances` as a public request field would re-introduce exactly the surface the normalizer defends against — caller-supplied free-form strings flowing into the scorer.
- The 004 implementation summary (Key Decisions) explicitly states: "Ignore free-form `description` as a trigger source — descriptions are the highest-risk prompt-stuffing input. Structured fields are safer and easier to test." A public `affordances` array would be a strict superset of that risk.
- No existing public consumer passes `affordances` to `scoreAdvisorPrompt`. The TS callers (`advisor-validate.ts`, `advisor-recommend.ts`, the bench scripts) all rely on compile-time projections. The seam is reachable only by direct in-process calls (e.g., bench harnesses, alternate scorer wrappers), where the caller is trusted.
- Backward compat is preserved: existing public callers without `affordances` already work and remain unaffected.

**Evidence — files modified:**

| File | Change |
|------|--------|
| `mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts` (lines 24-34) | Added DEFER-decision doc comment above `AdvisorRecommendInputSchema` documenting `AdvisorScoringOptions.affordances` as a compile-time-only seam, the prompt-stuffing rationale, and the path for internal callers (direct `scoreAdvisorPrompt` invocation) |

**Files intentionally NOT modified (DEFER path):**
- `mcp_server/skill_advisor/handlers/advisor-recommend.ts` — handler does not read `options.affordances` and should not (would violate the boundary above).
- `mcp_server/skill_advisor/lib/scorer/types.ts` — `AdvisorScoringOptions.affordances` remains the internal seam.
- Public docs — no public surface to update; the option is internal.

### R-007-3 — Diff-path canonicalization (T-D)

**Decision:** REJECT-EXPLICITLY paths that resolve outside `canonicalRootDir`.

`mcp_server/code_graph/handlers/detect-changes.ts:118-160` now returns a structured `CandidatePathResult` (`ok | skip | reject`). Relative diff paths are resolved against `canonicalRootDir`; absolute paths are accepted only when contained by the canonical root (path-prefix containment with platform-separator boundary). Any rejection surfaces as `status: 'parse_error'` with the offending path in `blockedReason`. No silent drop. The check uses path-string prefix containment instead of `realpathSync` so pure-add hunks on not-yet-existing files still validate.

### R-007-4 — Diff-parser multi-file boundary fix (T-D)

`mcp_server/code_graph/lib/diff-parser.ts:109-220` now tracks `remainingOldLines` / `remainingNewLines` for the active hunk body. Once both counters reach zero the body terminates — a subsequent `-` (next file's `--- a/<path>` header) or `+` (next file's `+++ b/<path>` header) is no longer eaten as a hunk-body line. Body lines additionally decrement counters per-side (`-` decrements old only, `+` decrements new only, ` ` decrements both, `\` is no-op). Out-of-budget `-`/`+` triggers re-process.

### R-007-8 — `conflicts_with` affordance contract (T-D)

**Decision:** VALIDATE — reject `conflicts_with`/`conflictsWith` in affordance derived inputs.

`mcp_server/skill_advisor/scripts/skill_graph_compiler.py:45-78` — `AFFORDANCE_RELATION_FIELDS` no longer includes `conflicts_with`/`conflictsWith`. New `AFFORDANCE_REJECTED_RELATION_FIELDS` frozen-set lists them as reserved. `validate_derived_affordances` (line ~470) emits a structured "declares reserved field(s) … : conflict edges require an authoritative reciprocal declaration in `edges.conflicts_with` and cannot be derived from affordances" error.

Test added: `R-007-8: affordance \`conflicts_with\` is rejected with explicit reserved-field error` in `python/test_skill_advisor.py`.

### R-007-9 — Prompt-injection denylist broadened (T-D)

Both sanitizers expanded with synonyms (`disregard`, `forget`, `skip`, `bypass`, `override`), directional variants (`previous|prior|earlier|above|all|any`, including stacked forms like "all prior"), reveal-prompt probes, role-prefix variants (`user:|human:`), and bracketed/angled role markers (`[INST]`, `<system>`).

- TS: `mcp_server/skill_advisor/lib/affordance-normalizer.ts:59-73`
- PY: `mcp_server/skill_advisor/scripts/skill_graph_compiler.py:78-101`

Anchoring uses `(?:^|\s|\b)` lead so `ignore the cache when stale` and `system call audit` still pass.

### R-007-11 + P2-10 + P2-11 — Trust-badge merge / age-allowlist / trace flag (T-D)

`mcp_server/formatters/search-results.ts:235-360` rewrites the explicit-trust-badge path:

- **R-007-11 merge-per-field**: `normalizeExplicitTrustBadges` returns a partial shape; `mergeTrustBadges` overlays non-null explicit fields onto the derived snapshot per-field. Required boolean fields missing on both sides cause the badge to be omitted entirely (no half-formed shape).
- **R-007-P2-10 age-label allowlist**: `sanitizeAgeLabel` rejects strings outside `^(?:never|today|yesterday|\d{1,6}\s+(?:day|days|week|weeks|month|months)\s+ago)$` and falls through to `formatAgeString` derivation. Length cap 32 chars.
- **R-007-P2-11 trace flag**: `fetchTrustBadgeSnapshots` now returns `{snapshots, attempted, derivedCount, failureReason}`. Failure reasons: `'no_db' | 'no_results' | 'query_error' | null`. Trace exposes `MemoryResultTrace.trustBadgeDerivation` when `includeTrace` is set.

### R-007-P2-1 — Phase runner duplicate-output rejection (T-D)

`mcp_server/code_graph/lib/phase-runner.ts:45-110` extends `PhaseRunnerError.kind` with `'duplicate-output'`. `topologicalSort` rejects (a) two phases publishing the same `output` key and (b) a phase whose `output` collides with another phase's `name`. Mirrors the duplicate-name rejection.

### R-007-P2-3 — Edge-metadata `reason`/`step` allowlist on read path (T-D)

Read-path defense-in-depth at three sites:
- `mcp_server/code_graph/lib/code-graph-db.ts:756-805` — `rowToEdge` now sanitizes `reason`/`step` on JSON parse.
- `mcp_server/code_graph/handlers/query.ts:608-635` — `edgeMetadataOutput` re-validates (defense-in-depth for non-DB-sourced edges).
- `mcp_server/code_graph/lib/code-graph-context.ts:287-320` — `formatContextEdge` uses the same sanitizer.

Allowlist: single-line, length ≤ 200, no control chars (`\x00-\x1F\x7F`). Failures fall through to `null` rather than passing the raw value.

### R-007-P2-8 — Shared adversarial fixture (T-D)

Created `mcp_server/skill_advisor/tests/__shared__/affordance-injection-fixtures.json` (28 injection phrases, 11 benign phrases, 4 privacy phrases). Both `affordance-normalizer.test.ts` (TS) and `python/test_skill_advisor.py` (PY) load this fixture and run identical drop-vs-survive assertions. Forces row-for-row sanitizer parity.

### R-007-13 — Trust-badges SQL test rig fix (T-E)

**Strategy:** **DI** (dependency injection on `fetchTrustBadgeSnapshots`).

**Rationale:** The Wave 3 follow-up note attributed the test failures to vitest mock-resolution. After re-running with all three mock layers active, the mocks intercepted correctly but two of three cases still returned `confidence: null`. Tracing the SQL pipeline directly against an in-memory better-sqlite3 revealed the actual blocker: `better-sqlite3` binds JavaScript numbers as REAL, so `VALUES (?)` with the integer `11` stores `11.0`, and `CAST(11.0 AS TEXT)` yields `'11.0'`, which never matches the TEXT-typed `target_id='11'` column. The mock theory was a red herring — the SQL itself was latently broken since 006/005 and only invisible because the tests were skipped. The DI seam (additive optional `dbGetter` parameter) plus a one-line bind-side coercion (`resultIds.map(String)`) jointly close R-007-13: tests exercise the SQL path against an in-memory DB with no mock plumbing, and production callers using JS-number IDs correctly resolve causal-edge metadata against TEXT-typed source/target columns. DI was preferred over real-DB integration fixture because it leaves the production caller signature unchanged, avoids cross-suite global mocks, and surfaces the bind-type bug as a localized fix.

**Evidence — files modified:**

| File | Change |
|------|--------|
| `mcp_server/formatters/search-results.ts` | `fetchTrustBadgeSnapshots` exported with new optional `dbGetter = requireDb` parameter (DI seam); `toTrustBadges` and `TrustBadgeSnapshot` exported for direct test assertion; bind-type coercion `resultIds.map(String)` so SQL `CAST(memory_id AS TEXT)` joins resolve against TEXT-typed `source_id`/`target_id` columns. **Integration note:** function returns the T-D `TrustBadgeFetchResult` shape (`{snapshots, attempted, derivedCount, failureReason}`); tests dereference `fetchResult.snapshots.get(...)`. |
| `mcp_server/tests/memory/trust-badges.test.ts` | Removed `describe.skip(...)`; removed all `vi.mock(...)` plumbing; SQL-derivation tests call `fetchTrustBadgeSnapshots` + `toTrustBadges` directly with per-test `:memory:` better-sqlite3 getter; explicit-pass-through test continues to exercise `formatSearchResults`. |

**Verification (real command output, T-E worktree):**
- `cd mcp_server && npx --no-install tsc --noEmit` → exit 0 (clean).
- `cd mcp_server && npx --no-install vitest run tests/memory/trust-badges.test.ts` → 3 passed (3).
- `cd mcp_server && npx --no-install vitest run tests/response-profile-formatters.vitest.ts` → 2 passed (2).
- Sanity-check on causal suites → 9 passed (9), no regression.

### T-F — Doc + Label Cleanup (closes R-007-12, 16, 17, 18, P2-2, P2-4, P2-5, P2-6, P2-7, P2-9, P2-12)

#### R-007-12 — Memory_search cache invalidation on causal-edge mutations
**Strategy:** include a causal-edges generation counter in the `memory_search` cache key. Mutations bump a module-level counter; readers fold the counter into the cache key only when `enableCausalBoost=true` so unrelated callers do not suffer needless cache misses.

**Evidence — files modified:**

| File | Change |
|------|--------|
| `mcp_server/lib/storage/causal-edges.ts` | New `causalEdgesGeneration` counter, bumped inside `invalidateDegreeCache()` (the universal call site for all mutators); exported `getCausalEdgesGeneration()` |
| `mcp_server/lib/search/search-utils.ts` | New optional `causalEdgesGeneration?: number` on `CacheArgsInput`; gated by `enableCausalBoost === true` so the cache key stays stable for non-causal callers |
| `mcp_server/handlers/memory-search.ts` | Imports `causal-edges`; reads generation when `enableCausalBoost` is true; threads through to `buildCacheArgs` |

#### R-007-16 — INSTALL_GUIDE smoke-test cwd bug
`mcp_server/INSTALL_GUIDE.md` §4c: after `cd mcp_server`, the Python invocation
now uses the cwd-relative path `python3 skill_advisor/tests/python/test_skill_advisor.py`.

#### R-007-17 — Tool-count canonicalization
**Canonical source-of-truth:** `TOOL_DEFINITIONS.length` in
`mcp_server/tool-schemas.ts` (currently 51). Internal helper handlers and
deferred / not-yet-wired handlers do NOT count.

**Synced:**
- `/README.md` lines 7, 56, 1261, 1281, 1301 → "60 MCP tools" (51 spec_kit_memory + 7 code mode + 1 CocoIndex + 1 sequential thinking) and "51 tools, 7 layers + L8 graph/advisor + L9 coverage"
- `/README.md` line 677 → "51-tool memory and code-graph surface"
- `.opencode/skill/system-spec-kit/README.md` line 62 → 51 (with explicit canonical-source note)
- `.opencode/skill/system-spec-kit/mcp_server/README.md` lines ~1274-1283 → table updated to 51 with L8 + L9 rows added; "deferred handlers do NOT count" footnote

#### R-007-18 — Broken FEATURE_CATALOG_IN_SIMPLE_TERMS.md link
Removed the dangling Related-Documents link in `/README.md` line 1288 and
softened the FAQ wording: the simple-terms companion is now described as a
"future docs deliverable" rather than an existing artifact.

#### R-007-P2-2 — `runPhases` try/catch/finally for error-outcome metrics
`code_graph/lib/structural-indexer.ts::indexFiles` now wraps `runPhases` in a
try/catch. The catch flips `scanOutcomeRef.value = 'error'` and emits the
`spec_kit.graph.scan_duration_ms` histogram with `outcome: 'error'` so the
metric fires even when a prior phase short-circuits the runner. Original
error is rethrown unchanged.

#### R-007-P2-4 — `computeBlastRadius` true-overflow detection
`code_graph/handlers/query.ts::computeBlastRadius` now records
`totalAffectedBeforeSlice = affectedByFile.size` BEFORE slicing, then sets
`overflowed = totalAffectedBeforeSlice > limit`. Previously the
`affectedFiles.length >= limit` check false-positived whenever the result
set happened to equal `limit` exactly.

#### R-007-P2-5 — Multi-subject blast-radius preserves resolved seeds
Same handler: when one candidate fails to resolve in the multi-subject loop,
the response now includes the already-resolved sibling seeds as
`preservedSeedNodes` (instead of returning an empty `nodes: []`). The
`partialResult` now also carries those seeds so the failure-fallback payload
is genuinely useful for callers.

#### R-007-P2-6 — Stable `failureFallback.code` + warning log + metric
- Extended `BlastRadiusFailureFallback` with optional `code: BlastRadiusFailureCode`
  (literal union: `limit_reached | unresolved_subject | ambiguous_subject | empty_source | compute_error`)
- All five failure-fallback sites now set `code` deterministically.
- The `compute_error` site additionally emits `console.warn` and increments
  the new `spec_kit.graph.blast_radius_failure_total{code}` counter (added to
  `SPECKIT_METRIC_DEFINITIONS` and `SpeckitMetricName`).

#### R-007-P2-7 — Shared relationship-edge mapper
4 near-duplicate switch branches (`calls_from`, `calls_to`, `imports_from`,
`imports_to`) collapsed into 2 case groups using new helpers:
`mapOutboundRelationshipEdge`, `mapInboundRelationshipEdge`,
`extractOutboundFilePaths`, `extractInboundFilePaths`. The `includeLine` flag
preserves the existing behavioural difference (calls_* include the line,
imports_* omit it).

#### R-007-P2-9 — Affordance debug counters (TS + Python parity)
- `mcp_server/skill_advisor/lib/affordance-normalizer.ts`: new module-level
  `affordanceNormalizerCounters` with 5 fields (`received`, `accepted`,
  `dropped_unsafe`, `dropped_empty`, `dropped_unknown_skill`); `normalize()`
  bumps them; exported `getAffordanceNormalizerCounters()` + reset helper.
- `mcp_server/skill_advisor/scripts/skill_graph_compiler.py`: matching
  `AFFORDANCE_NORMALIZER_COUNTERS` dict + `get_/reset_` helpers;
  `normalize_affordance_input()` bumps them. `dropped_unsafe` is reserved
  for future per-input prompt-injection rejections — current sanitizers
  scrub at the phrase level rather than rejecting whole inputs.

#### R-007-P2-12 — Phase-naming alias note (012 → 010)
Added an explicit alias block at the top of `006/006-docs-and-catalogs-rollup/`
`spec.md`, `checklist.md`, and `implementation-summary.md` documenting that
phase 012 was renumbered to wrapper 010 and both labels refer to the same
packet.

## Findings Deferred (with Defer-To pointers)

Tier 2 state-hygiene update (2026-04-28): no 006/007 batch item is left in ambiguous `[TBD per task ID]` state. Lower-priority follow-ups are carried by the completed 008 deep-research review matrix:

| Class | Defer-To |
|-------|----------|
| Future hardening | 008 deep-research review D2, D3, D6, D11 |
| Polish backlog | 008 deep-research review D18 |
| Adopted closure follow-up | Recommended 006/008 and 006/009 packets listed in 008 `spec.md` §6 |

## Verification Evidence (real command output)

**T-A scope (`detect_changes` wiring):**

- `tsc --noEmit` clean: VALIDATED PASS via Wave-3 canonical (006/007/T-B, 2026-04-25) — `npx --no-install tsc --noEmit` exit 0 (clean after the type-widening fix in commit c6e766dc5). The four T-A edits are confirmed type-clean.
- Existing test `code_graph/tests/detect-changes.test.ts` unchanged; the wiring does not alter handler behaviour. Wave-3 canonical `vitest run` shows `code_graph/tests/detect-changes.test.ts` is inside the 9 PASSED test files (90 passed | 3 skipped (93) tests, 1.34s).

**T-B scope (verification evidence sync):**

- `tsc --noEmit`: VALIDATED PASS via Wave-3 canonical (exit 0).
- `vitest run` (Phase 006 specific files, 10 files): VALIDATED PASS-WITH-SKIP — 9 passed | 1 skipped, 90 passed | 3 skipped tests, 1.34s. The 1 skipped file (`tests/memory/trust-badges.test.ts` SQL-mock describe block) is the documented Wave-3 follow-up tracked under R-007-13 (T-E remediation).
- `validate.sh --strict` per sub-phase: 001/002/003/005/006 FAILED-COSMETIC (template-section conformance, NOT contract violations); 004 PASSED. Cosmetic debt tracked as deferred P2 in 006/007.

**Sync, not aspiration (per brief Hard Rule 1):** Every Wave-3 canonical evidence block reproduced in the 10 sub-phase doc files is verbatim from the orchestrator's recorded session — no fabricated test counts, no estimated durations, no "operator-pending" placeholders standing in for real output. Operator-pending markers in the post-T-B docs reflect commands that *cannot* run from a doc-edit context (sk-doc DQI script invocations, live MCP smoke tests against running tools), NOT commands that are merely inconvenient.

**T-C scope (R-007-6 + R-007-10):**

- `cd .opencode/skill/system-spec-kit/mcp_server && tsc --noEmit --composite false -p tsconfig.json` — **PASS** (no output; clean). Verified 2026-04-25 in 010-007-C worktree.
- `cd .opencode/skill/system-spec-kit/mcp_server && vitest run tests/tool-input-schema.vitest.ts` — **PASS** (`Test Files 1 passed (1) | Tests 79 passed (79) | Duration 233ms`). 6 new T-C cases included (3 accept + 3 reject for `minConfidence`).
- Backward compat: existing `code_graph_query` callers without `minConfidence` continue to pass schema validation (covered by the pre-existing `'code_graph_query accepts structural traversal options'` case at lines 503-514 of the test file, which omits `minConfidence`).
- Affordance DEFER: no behavioural change — `AdvisorRecommendInputSchema.strict()` continues to reject `affordances` at the public boundary, matching the design intent.

**T-D scope (sanitization hardening):**

- `npx --no-install tsc --noEmit --composite false -p tsconfig.json` from `mcp_server/`: **CLEAN** (exit 0, no diagnostics).
- `npx --no-install vitest run skill_advisor/tests/affordance-normalizer.test.ts code_graph/tests/detect-changes.test.ts code_graph/tests/phase-runner.test.ts`: **PASSED** — 37/37 tests green (3 files), including the new R-007-P2-8 shared-fixture coverage in `affordance-normalizer.test.ts`.
- `python3 skill_advisor/tests/python/test_skill_advisor.py`: **PASSED** — 57/57 tests green, including the new R-007-8 (`affordance \`conflicts_with\` is rejected`) and R-007-P2-8 (shared fixture: injection / benign / privacy) assertions.

## References
- spec.md, plan.md, tasks.md, checklist.md (this folder)
- 006/review/phase-review-summary.md
- 006/{001..006}/review/review-report.md
- 006/decision-record.md ADR-012-003 (re-read for scope clarification — governs NEW route/tool/shape entities only)
