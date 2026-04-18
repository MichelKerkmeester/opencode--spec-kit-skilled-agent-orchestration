# Deep Review Report — Phase 016/017 Remediation

**Session**: `2026-04-17T120827Z-016-phase017-review`
**Review target**: Phase 016/017 remediation (27 fix(016) commits since `afbb3bc7f`)
**Dispatcher**: task-tool / @deep-review / claude-opus-4-7
**Iterations**: 7 of 7 (converged at iter 6)
**Verdict**: **CONDITIONAL**

---

## 1. Summary

This report consolidates a 7-iteration autonomous deep-review of Phase 016/017 remediation, covering 27 `fix(016)` commits that landed 4 P0 composites (A HookState overhaul, B transactional reconsolidation, C graph-metadata laundering, D TOCTOU cleanup), 7 structural refactors (S1-S7), 13 medium refactors (M3-M13), 21 quick wins, and 34 test migrations. The review cycled through 4 primary dimensions (correctness, security, traceability, maintainability) plus cross-reference cluster consolidation and a recovery sweep, then synthesized results in a pure-synthesis iteration 7.

30 findings surfaced: **0 P0, 10 P1, 18 P2** with evidence citations anchored to `file:line` across the full review target. The review converged at iteration 6 with `newFindingsRatio 0.0923 < 0.10` threshold (smooth deceleration: 1.00 → 0.50 → 0.333 → 0.264 → 0.102 → 0.0923). No P0 override fired across the full loop, and all 4 P0 composite regression tests were re-verified at iter 5 to exercise genuine attack chains (including `fs.openSync` spy for P0-D race simulation and ranking-inversion assertions for P0-C).

Three root-cause clusters dominate the remediation backlog: **Cluster A** (scope-normalization drift: 5 disconnected normalizers share semantics today but are a future-drift landmine), **Cluster B** (canonical-save-surface hygiene: 16/16 sibling 026-tree folders have stale or missing `description.json.lastUpdated`, the most systemic finding in the review), and **Cluster C** (ASCII-only sanitization: gate-3-classifier and sanitizeRecoveredPayload share the same Unicode-NFKC coverage gap). The CP-001 classification from the closing-pass audit upgrades to P1 based on new Phase-017 evidence — sibling `code-graph/query.ts` was hardened with `canonicalReadiness`+`trustState`+`lastPersistedAt` while `code-graph/context.ts` did not receive parity. Phase 017 is correctness-complete on the 4 P0 composites; the dominant remaining risk is infrastructural (Cluster B) and architectural-symmetry (R6-P1-001).

---

## 2. Verdict

### CONDITIONAL

**Rationale** (per `.opencode/skill/sk-code-review/references/review_core.md` §Verdicts):
- **0 active P0 findings** → FAIL is NOT triggered.
- **10 active P1 findings** → PASS is NOT reachable without remediation.
- **18 active P2 findings** → informational; `hasAdvisories=true` flag should accompany any PASS re-evaluation after P1 remediation.

### Ship conditions

To move from CONDITIONAL to PASS:
1. Address all 10 P1 findings (Section 5 provides a prioritized remediation backlog).
2. Re-run a reduced-scope deep-review targeting just the remediated surfaces, OR run `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <spec-folder> --strict` after the remediation spec folder closes.
3. Update `description.json.lastUpdated` across all 16 sibling 026-tree folders (R5-P1-001) after the generate-context.js fix lands (R4-P1-002).

### Binary quality gates

| Gate | Status | Notes |
|------|--------|-------|
| Evidence | **PASS** | Every active finding cites concrete `file:line` evidence; 100% of P1 findings have typed claim-adjudication packets. |
| Scope | **PASS** | All findings stay inside the declared 27-commit review window and the 24 focus files + 9 regression tests. |
| Coverage | **PASS** | 4 primary dimensions + cross-reference + recovery sweep + synthesis all executed. 24/24 focus files covered structurally (3 sampled unreviewed files in iter 6 all clean). |

---

## 3. Finding Inventory

### P0 Findings

**None.** The 4 P0 composites from Phase 016 (A/B/C/D) are all correctly remediated with genuine regression test coverage. No new P0 surfaces discovered across 6 discovery iterations.

### P1 Findings (10)

| ID | Cluster | Severity | File:Line | Title | Confidence |
|----|---------|----------|-----------|-------|------------|
| R1-P1-001 | A | P1 (narrowed) | `mcp_server/lib/storage/reconsolidation.ts:513, 564, 872-875, 918-923` | Empty-string scope CAS bypass via `getOptionalString`/`normalizeScopeValue` divergence | 0.78 |
| R1-P1-002 | Standalone | P1 | `mcp_server/handlers/save/post-insert.ts:159-173, 347-365` | `partial_causal_link_unresolved` pairs with `runEnrichmentBackfill` without retry-exhaustion counter — structurally non-retryable references cause recurring backfill scheduling | 0.72 |
| R2-P1-001 | Standalone | P1 | `mcp_server/handlers/session-resume.ts:443-456`, `mcp_server/hooks/claude/hook-state.ts:454-463, 501` | `handleSessionResume` trusts `args.sessionId` without authentication → cross-session cached-summary leakage (same-UID data disclosure) | 0.82 |
| R2-P1-002 | C | P1 | `shared/gate-3-classifier.ts:145-152, 158-165` | `normalizePrompt` lacks Unicode NFKC + zero-width/soft-hyphen stripping → homoglyph Cyrillic 'е' + `\u00AD` bypasses Gate 3 file_write token detection | 0.88 |
| R3-P1-001 | Standalone | P1 | `research/016-foundational-runtime-001-initial-research/closing-pass-notes.md:72-88`, `mcp_server/lib/search/graph-lifecycle.ts:507-528, 606-610` | Closing-pass-notes CP-002 stale — documented as OPEN but fully resolved by `e774eef07 T-PIN-08` | 0.90 |
| R3-P1-002 | B | P1 | `specs/system-spec-kit/026-graph-and-context-optimization/research/016-foundational-runtime-001-initial-research/` (directory) | Research folder missing both mandatory `description.json` + `graph-metadata.json` → invisible to memory-search/graph traversal | 0.85 |
| R4-P1-001 | A | P1 | `mcp_server/handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444`, `lib/governance/scope-governance.ts:155-162` | Scope-normalization helper duplicated in 5 locations with divergent signatures (`unknown`, `string\|null`, `string\|undefined`); canonical `normalizeScopeContext` under-adopted | 0.85 |
| R4-P1-002 | B | P1 | `scripts/dist/memory/generate-context.js` (grep: 0 lastUpdated hits), `.git/hooks/` (14 `.sample`, 0 active) | No auto-repair infrastructure for `description.json.lastUpdated` → drift is structurally inevitable absent refresh mechanism | 0.90 |
| R5-P1-001 | B | P1 | `specs/system-spec-kit/026-graph-and-context-optimization/*/description.json` (16 folders sweep) | Systemic staleness: 0/16 sibling 026-tree folders have fresh `description.json.lastUpdated` (11 stale, 4 missing field, 1 no graph timestamp) | 0.92 |
| R6-P1-001 | Standalone | P1 (upgrade) | `mcp_server/handlers/code-graph/context.ts:87-210`, `handlers/code-graph/query.ts:238-282` | CP-001 upgraded: `context.ts` silently catches readiness exception and lacks `canonicalReadiness` + `trustState` + `lastPersistedAt` hardening that T-CGQ-09/10/11/12 applied to sibling `query.ts` — two-tier observability asymmetry | 0.85 |

### P2 Findings (18)

| ID | Cluster | File:Line | Title |
|----|---------|-----------|-------|
| R1-P2-001 | Standalone | `mcp_server/hooks/claude/hook-state.ts:818-864` | `cleanStaleStates` TOCTOU residual — close→unlink window is open (microsecond-scale on tmpfs, blast radius: one stale file) |
| R1-P2-002 | Standalone | `mcp_server/lib/graph/graph-metadata-parser.ts:1076-1083, 1094-1106` | `deriveGraphMetadata` passes `existing?.migrated ?? undefined` into Zod `parse(...)` — safety net at merge time, fragile if called standalone |
| R1-P2-003 | Standalone | `mcp_server/hooks/claude/session-stop.ts:313, 421-423, 477-488` | `stateBeforeStop` stale-read of `metrics.lastTranscriptOffset` mitigated by downstream `Math.max` guard but T-SST-11 contract only partially delivered |
| R2-P2-001 | C | `mcp_server/hooks/claude/shared.ts:100-119` | `sanitizeRecoveredPayload` ASCII-only regex — Greek `Ε` (U+0395) slips through `/^\s*(?:system\|developer\|assistant\|user)\s*:/i` |
| R2-P2-002 | Standalone | `shared/predicates/boolean-expr.ts:372-379, 242-245` | `scalarsEqual` TRUE/FALSE-string coercion is an intentional compat shim but creates silent predicate-success surface (string `'TRUE'` ≡ boolean `true`) |
| R2-P2-003 | Standalone | `shared/gate-3-classifier.ts:223-231` | `readOnlyMatched` override fires whenever any read-only token appears — `"fix the typo in the review comment"` incorrectly flips `triggersGate3: false` |
| R3-P2-001 | B | `specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research/description.json:37, 46-47` vs `graph-metadata.json:162-163` | `description.json.lastUpdated` stale (`2026-04-16T21:45:00Z`) relative to `graph-metadata.json.derived.last_save_at` (`2026-04-17T11:20:00Z`); status divergence `ready_for_implementation` vs `implemented` |
| R3-P2-002 | B | `specs/system-spec-kit/026-graph-and-context-optimization/016-foundational-runtime/001-initial-research/checklist.md` (all 179 completed) | 170/179 completed CHK items close with `)` (orphaned parenthesis) instead of canonical `]` — machine-parseable traceability broken |
| R3-P2-003 | C | `mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11, 67, 152-154` | `p0-a` test name claims Claude+Gemini+OpenCode but imports only Claude+Gemini — OpenCode coverage is structural-share only |
| R4-P2-001 | Standalone | `mcp_server/handlers/save/post-insert.ts:133-376` | `runPostInsertEnrichment` is a 243-line god function with 5 near-identical try/catch enrichment blocks |
| R4-P2-002 | Standalone | `mcp_server/` (grep: 0 `satisfies never`/`assertNever` hits) | No compile-time exhaustiveness checks anywhere — 7+ typed unions consumed via string-compare + object-lookup |
| R4-P2-003 | Standalone | `mcp_server/lib/storage/reconsolidation.ts:507-600` | `executeConflict` has two near-duplicate transaction blocks sharing identical precondition checks (deprecate-path + content-update-path) |
| R4-P2-004 | Standalone | `mcp_server/lib/storage/reconsolidation.ts:527, 580` (sampled) | `importance_tier != 'deprecated'` de facto deprecation predicate repeated inline in 6+ SQL statements without shared constant or helper |
| R5-P2-001 | C | `mcp_server/hooks/opencode/` (glob: no files), `tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:11,67` | P0-A OpenCode coverage is zero because no OpenCode hook module exists to import — refinement of R3-P2-003 with structural evidence |
| R6-P2-001 | B | `mcp_server/handlers/save/post-insert.ts:344-369`, `handlers/save/response-builder.ts:136-201` | Undocumented intentional rollup divergence between `post-insert.ts` executionStatus (failure-with-recovery) and `response-builder.ts` postInsertEnrichment (MCP-client nuance) — T-RBD-01 intent visible only in commit notes |
| CP-002-note | Standalone | `research/.../closing-pass-notes.md:84-86` | Pre-existing closing-pass finding now RESOLVED by T-PIN-08; see R3-P1-001 for the stale-documentation upgrade |
| CP-003 | Standalone | `mcp_server/lib/search/entity-linker.ts:1129-1133` | Whole-corpus escalation on incremental-pipeline failure; bounded by `extractionRan` gate; iter 6 confirmed stays at P2 |
| CP-004 | Standalone | `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099` | Prose `when:` string escapes the typed YAML predicate grammar from S7 refactor; still present (not covered by `f9478670c`) |

### Finding distribution by cluster

| Cluster | P1 | P2 | Total |
|---------|----|----|-------|
| A — Scope-normalization drift | 2 | 0 | 2 |
| B — Canonical-save-surface hygiene | 3 | 4 | 7 |
| C — ASCII-only sanitization | 1 | 3 | 4 |
| Standalones | 4 | 11 | 15 |
| **Total** | **10** | **18** | **28** |

(Note: counts reflect the 28 uniquely-ID'd findings in this report. Two pre-existing closing-pass notes — CP-002-note and CP-004 — are tracked as P2 reference entries to preserve cross-reference from the research artifact.)

---

## 4. Cluster Analysis

### Cluster A — Scope-normalization drift (2 members)

**Members**: R1-P1-001, R4-P1-001

**Surface**: five separate `normalizeScopeValue` / `normalizeScopeMatchValue` / `normalizeScopeContext` implementations across `handlers/save/reconsolidation-bridge.ts`, `handlers/save/types.ts`, `lib/storage/lineage-state.ts`, `lib/validation/preflight.ts`, `lib/governance/scope-governance.ts`.

**Root cause**: canonical `normalizeScopeContext` (scope-governance.ts) exists as the intended Schelling point and is correctly consumed by `checkpoints.ts` + `memory-search.ts`. Four other callers reinvented local versions with subtly divergent signatures (`unknown`, `string | undefined`, `string | null`).

**Current exposure**: **NONE** (refuted at iter 5). Iter 2 confirmed symmetric empty-string-to-null collapse on both sides of `executeConflict` CAS; iter 5 re-verified all tested inputs (`undefined`, `null`, `""`, whitespace, non-string) produce semantically equivalent output across the two extant normalizers that matter for CAS. The guard protects against scope-bypass as designed today.

**Latent risk**: **HIGH**. Any future author who modifies one of the 5 normalizers without finding and updating the others re-introduces R1-P1-001-class drift, silently re-opening the empty-string CAS bypass that iter 2 eliminated. The 5-way duplication is a preventable correctness landmine wearing maintainability clothing.

**Recommended remediation** (single spec-folder task bundle):
- Collapse the 4 reinvented normalizers to imports of `normalizeScopeContext`.
- Add a regression test asserting semantic equivalence for the full input matrix (`undefined`, `null`, `""`, `"   "`, non-string).
- Add an ESLint rule or grep-based precommit lint that rejects new in-module `normalizeScope*` definitions.

### Cluster B — Canonical-save-surface hygiene (7 members)

**Members**: R3-P1-002 (research folder missing both metadata files), R3-P2-001 (single-packet description.json drift), R3-P2-002 (95% malformed evidence markers), R4-P1-002 (no auto-repair infrastructure), R5-P1-001 (systemic 16/16 staleness across 026 tree), R6-P1-001 (context.ts sibling-asymmetry fail-open, extended family), R6-P2-001 (rollup divergence intent undocumented).

**Root cause**: **canonical-save pipeline is not self-healing.** `generate-context.js` never writes `description.json.lastUpdated` (0 references in all 9 dist scripts). No git pre-commit / post-commit / post-merge hooks are active (all 14 `.git/hooks/*` are `.sample`). No `.husky/`, `.githooks/`, or `lint-staged` config. Evidence-marker format has zero code-level constant and zero linter. Manual deep-research dispatch (used for iteration-50 of the research packet) bypasses `generate-context.js` entirely, producing deep-research-loop artifacts but not canonical packet metadata.

**Current exposure**: **SEVERE AND MEASURABLE**.
- 0/16 sibling folders in `026-graph-and-context-optimization/` are fresh.
- 4/16 folders (007-010) have no `lastUpdated` field at all.
- 11/16 folders have `description.json.lastUpdated` ≥1 day stale relative to `graph-metadata.json.derived.last_save_at`.
- Research folder (`research/016-foundational-runtime-001-initial-research/`) is missing both mandatory files, violating the CLAUDE.md §3 invariant.
- 170/179 completed checklist.md evidence markers are malformed, breaking machine parseability of traceability citations.
- Two-tier observability asymmetry in `code_graph_*` tool family: `query.ts` emits `trustState` + `canonicalReadiness` per T-CGQ-09/10/11/12, `context.ts` emits neither.

**Remediation priority**: **HIGHEST** of all clusters. This is the single largest leverage surface because 7 findings share one infrastructure gap. Fixing generate-context.js + adding git hooks + back-porting T-CGQ hardening to context.ts addresses 7 P1/P2 findings simultaneously.

**Recommended remediation** (coordinated Phase 018 task set):
- Extend `generate-context.js` to write `description.json.lastUpdated` during canonical saves.
- Add backfill step to `generate-context.js` that creates `description.json` + `graph-metadata.json` for research folders under `research/` when missing.
- Add evidence-marker lint to `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh --strict`.
- Back-port T-CGQ-09/10/11/12 readiness+trustState to `handlers/code-graph/context.ts`.
- Add design-intent comment blocks at both rollup sites (`post-insert.ts:344-369` + `response-builder.ts:136-201`) citing T-RBD-01.
- After all the above land, re-run canonical save across all 16 sibling 026-tree folders to restore freshness.

### Cluster C — ASCII-only sanitization (4 members)

**Members**: R2-P1-002 (gate-3-classifier), R2-P2-001 (sanitizeRecoveredPayload), R3-P2-003 (p0-a test overclaims coverage, reinforcing evidence for ASCII-only theme), R5-P2-001 (refinement of R3-P2-003 with structural evidence that no OpenCode hook module exists).

**Root cause**: multiple Phase 017 string-matching surfaces share the ASCII-only assumption without a shared character-set contract. No `.normalize('NFKC')` or zero-width/soft-hyphen stripping applied anywhere in the Phase 017 sanitizer/classifier chain. The codebase DOES have NFKC elsewhere (`trigger-matcher.ts:600-605`, `contamination-filter.ts:172`) — so the pattern is known, just not applied to Gate 3 or recovered-payload sanitization.

**Current exposure**:
- Gate 3 homoglyph bypass (Cyrillic `е` U+0435, soft hyphen U+00AD, zero-width space U+200B) allows crafted prompts to defeat the Four Laws gate on file modification.
- Same-UID attacker with write access to `${tmpdir()}/speckit-claude-hooks/<session>.json` can inject `"SYST\u0395M:"` into `pendingCompactPrime.payload` and bypass `sanitizeRecoveredPayload`.
- Bounded by filesystem permissions (0o600 on state files, 0o700 on dir) for cross-UID attacks on POSIX. Cross-session prompt-injection requires same-UID access.
- No OpenCode hook module exists — cross-runtime test coverage is bounded by what-doesn't-exist-can't-be-tested.

**Recommended remediation**:
- Add `.normalize('NFKC')` + zero-width/soft-hyphen stripping to `gate-3-classifier.normalizePrompt`.
- Mirror the normalization in `sanitizeRecoveredPayload` regex preprocessing.
- Rename `p0-a` test `it()` block to "Claude and Gemini consumers" with a note that OpenCode inherits coverage by schema-share; OR stub a minimal `hooks/opencode/session-prime.ts` to make the claim literal.
- Add NFKC coverage to `gate-3-classifier.vitest.ts` (zero unicode cases today).

---

## 5. Remediation Backlog

Prioritized recommended tasks grouped by cluster. Effort estimates: S (≤2h), M (2-8h), L (≥1 day). All tasks target Phase 018 scope.

### Cluster A tasks (2 tasks covering 2 P1 findings)

| ID | Sev | Effort | File target | Acceptance criteria |
|----|-----|--------|-------------|---------------------|
| T-SCP-01 | P1 | M | `mcp_server/handlers/save/reconsolidation-bridge.ts:228-234`, `lib/storage/lineage-state.ts:198-204`, `handlers/save/types.ts:348-352`, `lib/validation/preflight.ts:440-444` | Replace 4 local `normalizeScopeValue`/`normalizeScopeMatchValue` variants with imports of canonical `normalizeScopeContext` from `lib/governance/scope-governance.ts`. Vitest asserts semantic equivalence for full input matrix. R1-P1-001 + R4-P1-001 resolve together. |
| T-SCP-02 | P2 | S | `.eslintrc.js` or `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Add lint rule that rejects any new file declaring a local `normalizeScope*` or `getOptionalString` helper. Rule exempts `scope-governance.ts` canonical file. |

### Cluster B tasks (7 tasks covering 7 findings — HIGHEST PRIORITY)

| ID | Sev | Effort | File target | Acceptance criteria |
|----|-----|--------|-------------|---------------------|
| T-CNS-01 | P1 | M | `.opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js` | Extend `generate-context.js` to write `description.json.lastUpdated` during canonical saves. Must be idempotent. R4-P1-002 resolves. |
| T-CNS-02 | P1 | M | `generate-context.js` + new `backfill-research-metadata.js` | Add backfill routine that creates `description.json` + `graph-metadata.json` for any directory matching `research/<phase-name>/` that is missing either file. R3-P1-002 resolves. |
| T-CNS-03 | P1 | L | all 16 sibling 026-tree folders | After T-CNS-01 lands, run canonical save against each 026/NNN-*/ folder. Verify 16/16 fresh via `jq '.lastUpdated' description.json`. R5-P1-001 + R3-P2-001 resolve together. |
| T-CGC-01 | P1 | M | `mcp_server/handlers/code-graph/context.ts:87-210` | Back-port T-CGQ-09/10/11/12: add `canonicalReadiness`, `trustState`, `lastPersistedAt` emission matching `query.ts:238-282`. Emit 4-state vocabulary (`live`/`stale`/`absent`/`unavailable`). R6-P1-001 resolves. |
| T-CGC-02 | P1 | S | `handlers/code-graph/context.ts:98-105` | Replace silent catch into `freshness: 'empty'` stub with explicit `error → 'unavailable'` branch emitting `readiness_check_crashed` reason. Partial R6-P1-001 mitigation if T-CGC-01 is deferred. |
| T-EVD-01 | P2 | M | `scripts/spec/validate.sh` + new `evidence-marker-linter.ts` | Add evidence-marker lint that asserts every `[EVIDENCE: ...]` closes with `]`, not `)`. Wire into `--strict` mode. R3-P2-002 resolves after checklist.md is rewrapped. |
| T-RBD-03 | P2 | S | `handlers/save/post-insert.ts:344-369`, `handlers/save/response-builder.ts:136-201` | Add design-intent comment block at both rollup sites citing T-RBD-01 (commit `709727e98`). Explain: post-insert tracks failure-with-recovery; response surfaces nuance to MCP clients. R6-P2-001 resolves. |

### Cluster C tasks (3 tasks covering 4 findings)

| ID | Sev | Effort | File target | Acceptance criteria |
|----|-----|--------|-------------|---------------------|
| T-SAN-01 | P1 | S | `shared/gate-3-classifier.ts:145-152` | Add `.normalize('NFKC')` + `/[\u00AD\u200B-\u200F\uFEFF]/g` stripping to `normalizePrompt`. R2-P1-002 resolves. |
| T-SAN-02 | P2 | S | `mcp_server/hooks/claude/shared.ts:100-119` | Add NFKC normalization pass to `sanitizeRecoveredPayload` before regex matching. R2-P2-001 resolves. |
| T-SAN-03 | P2 | S | `mcp_server/tests/p0-a-cross-runtime-tempdir-poisoning.vitest.ts:67`, `scripts/tests/gate-3-classifier.vitest.ts` | Rename P0-A `it()` to "Claude and Gemini consumers" with inline comment on OpenCode schema-share. Add 5+ NFKC/unicode cases to gate-3-classifier tests (cyrillic `е`, soft hyphen, zero-width, Greek Ε). R3-P2-003 + R5-P2-001 + R2-P1-002 test coverage gap resolve. |

### Standalone P1 tasks (5 tasks covering 4 standalone P1 findings)

| ID | Sev | Effort | File target | Acceptance criteria |
|----|-----|--------|-------------|---------------------|
| T-PIN-RET-01 | P1 | M | `mcp_server/handlers/save/post-insert.ts:159-173`, consumer of `runEnrichmentBackfill` | Add retry-exhaustion counter to `runEnrichmentBackfill` driver for `partial_causal_link_unresolved` outcomes, keyed on `(memoryId, step, reason)`. Skip after N retries. R1-P1-002 resolves. |
| T-SRS-BND-01 | P1 | L | `mcp_server/handlers/session-resume.ts:443-456`, `tools/lifecycle-tools.ts:67` | Bind `handleSessionResume` session-ID authentication to the caller's runtime-identity at the MCP transport layer. Reject `args.sessionId` that does not match the caller's active session. R2-P1-001 resolves. |
| T-CPN-01 | P2 | S | `research/.../closing-pass-notes.md:72-88` | Amend CP-002 section to mark it RESOLVED by T-PIN-08 / `e774eef07`. Add status tag `[STATUS: RESOLVED 2026-04-17]`. R3-P1-001 resolves. |
| T-YML-CP4-01 | P2 | M | `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml:1099` | Replace prose `when:` string with typed predicate matching S7 YAML grammar. CP-004 resolves. |

### Standalone P2 tasks (3 high-leverage P2s)

| ID | Sev | Effort | File target | Acceptance criteria |
|----|-----|--------|-------------|---------------------|
| T-EXH-01 | P2 | L | `mcp_server/` (7+ typed unions) | Add `assertNever` utility + apply to `OnIndexSkipReason`, `EnrichmentStepStatus`, `EnrichmentSkipReason`, `EnrichmentFailureReason`, `ConflictAbortStatus`, `HookStateLoadFailureReason`, `SharedPayloadTrustState`, `TriggerCategory`. R4-P2-002 resolves. High leverage because it prevents future silent runtime-fallback bugs. |
| T-PIN-GOD-01 | P2 | L | `mcp_server/handlers/save/post-insert.ts:133-376` | Extract `runEnrichmentStep(name, isEnabled, runner, options)` helper. Reduce `runPostInsertEnrichment` from 243 LOC to ~80. R4-P2-001 resolves. |
| T-RCB-DUP-01 | P2 | M | `mcp_server/lib/storage/reconsolidation.ts:507-600` | Extract `runAtomicReconsolidationTxn(predecessorSnapshot, op, ops)` helper for the duplicate deprecate-path + content-update-path transaction blocks. R4-P2-003 resolves. |

### Task summary

- **Cluster A**: 2 tasks (1 P1, 1 P2)
- **Cluster B**: 7 tasks (5 P1, 2 P2) — **highest priority**
- **Cluster C**: 3 tasks (1 P1, 2 P2)
- **Standalone P1**: 4 tasks (2 P1 remediation, 2 P2 follow-on)
- **Standalone P2**: 3 tasks (high-leverage maintainability)

**Total**: 19 proposed tasks covering all 10 P1 findings and 8 of the 18 P2 findings. Remaining 10 P2 findings are lower-leverage hardening items that can be deferred.

---

## 6. Test Coverage Gaps

Based on iter 3 (traceability) + iter 5 (test re-verification) + iter 6 (rollup investigation):

| Gap | Source | Severity | Recommended test |
|-----|--------|----------|------------------|
| `gate-3-classifier.vitest.ts` has 29 cases but ZERO Unicode/NFKC/homoglyph coverage | iter 3 track 6, iter 2 R2-P1-002 reinforcement | Active P1 test gap | Add 5+ cases: Cyrillic `е`, soft hyphen `\u00AD`, zero-width space `\u200B`, Greek Ε, combined homoglyph+zero-width |
| `p0-a-cross-runtime-tempdir-poisoning.vitest.ts` claims Claude+Gemini+OpenCode but imports only Claude+Gemini (OpenCode hook module does not exist) | iter 5 R5-P2-001 | P2 test-name gap | Rename test to "Claude and Gemini consumers" with schema-share note, OR create minimal `hooks/opencode/session-prime.ts` stub |
| No dedicated P0-C regression test for ranking-inversion edge (boost→penalty when migrated marker flips) | iter 5 analysis | P2 (passed via `graph-metadata-integration.vitest.ts:140-169` asserting both boost AND penalty deltas) | Consider extracting ranking-inversion as standalone test named `p0-c-migrated-marker-penalty-inversion.vitest.ts` for visibility parity with P0-A/B/D |
| `boolean-expr.test.ts` does not test prototype-chain traversal edge cases beyond the `__proto__` + `constructor` direct reads | iter 2 R2-P2-002 implied | P2 defense-in-depth | Add cases for `hasOwnProperty` direct field access, `toString` inheritance, `valueOf` inheritance, and polluted `Object.prototype.tenantAdmin = true` scenario |
| Mixed-outcome rollup divergence (1 failed + 4 ran → post-insert `failed` but response `partial`) has no unit test asserting the specific split | iter 6 R6-P2-001 | P2 (intentional design, but untested means future regressions go undetected) | Add `post-insert-rollup-divergence.vitest.ts` asserting the explicit split per T-RBD-01 contract |
| `description.json.lastUpdated` auto-refresh has no test because the feature does not exist | iter 4 R4-P1-002 | P1 (feature missing) | After T-CNS-01 lands, add `generate-context-lastUpdated-refresh.vitest.ts` asserting `description.json.lastUpdated` monotonic advancement on save |

---

## 7. Adversarial Self-Check

Following `.opencode/skill/sk-code-review/references/review_core.md` §Adversarial Self-Check, this section documents Hunter/Skeptic/Referee outcomes for the significant classification decisions.

### Refuted compound hypotheses (iter 5)

- **R1-P1-001 + R4-P1-001 compound "CAS never actually protects"**: REFUTED. Iter 5 verified both extant normalizers (`normalizeScopeValue` in reconsolidation-bridge, `getOptionalString` in reconsolidation lib) produce semantically equivalent output for all tested inputs. CAS guard works today. R4-P1-001's P1 classification stands on *latent* future-drift risk, not current exposure. Confidence 0.85.
- **R2-P1-001 + R3-P1-002 compound "session-discovery attack"**: REFUTED. Session-resume flow reads hook-state (tmpdir, per-session). Research folder metadata gap affects memory-graph discoverability. Surfaces do not intersect. No compound attack created. Confidence 0.90.
- **R1-P1-001 + R4-P1-001 + R4-P2-002 compound "CAS + exhaustiveness silent failure → P0"**: REFUTED. Typed-union exhaustiveness (`OnIndexSkipReason`, etc.) is orthogonal to the scope-normalizer contract. No cross-surface amplification. Confidence 0.92.
- **P0-B sequential-not-race suspicion**: REFUTED. `p0-b-reconsolidation-composite.vitest.ts` has 3 independent `it()` blocks mapping 1:1 to B1/B2/B3 phases, each a distinct transaction scenario. Confidence 0.95.
- **P0-D timing-only-test suspicion**: REFUTED. `p0-d-toctou-cleanup-regression.vitest.ts:89-95` uses `vi.spyOn(fs, 'openSync')` to trigger a `saveState` call mid-cleanup — genuine race simulation. Assertion at `:101` confirms the mock-driven race fired. Confidence 0.95.
- **P0-C coverage gap in ranking inversion**: REFUTED. `graph-metadata-integration.vitest.ts:140-151` proves clean graph_metadata candidates get boosted; `:153-169` proves migrated candidates get penalized. Inversion contract is explicitly asserted with numeric thresholds. Confidence 0.92.

### Confirmed via evidence (iter 4-6)

- **R4-P1-002 zero-grep confirmation**: `grep -n 'lastUpdated' .opencode/skill/system-spec-kit/scripts/dist/memory/*.js` returns zero hits across all 9 dist scripts. `.git/hooks/` contains only `.sample` files; no `.husky/`, no `.githooks/`. No `lint-staged` config. Auto-repair mechanism confirmed absent. Confidence 0.90.
- **R5-P1-001 tree-wide sweep**: 16/16 sibling phase folders in `026-graph-and-context-optimization/` confirmed stale or missing `description.json.lastUpdated` via `jq` inspection. Breakdown: 11 stale, 4 missing field, 1 no graph timestamp. Confidence 0.92.
- **R6-P1-001 sibling-asymmetry**: Direct code comparison of `context.ts:87-210` vs `query.ts:238-282` shows `query.ts` emits `canonicalReadiness` + `trustState` + `lastPersistedAt` per T-CGQ-09/10/11/12 while `context.ts` does not. tasks.md confirms T-CGQ tasks target `query.ts` exclusively. Confidence 0.85.

### Severity classification confidence intervals

- **0 P0**: high confidence. Each P0 composite (A/B/C/D) has genuine regression test coverage verified in iter 5. No hidden P0 surfaced in 6 discovery iterations.
- **10 P1**: high confidence. Every P1 finding has a typed claim-adjudication packet with explicit `downgradeTrigger`. Confidence per finding: 0.72-0.92 (min R1-P1-002, max R5-P1-001).
- **18 P2**: medium confidence. Some P2 findings (R4-P2-002 no-exhaustiveness, R3-P2-002 evidence-marker 95% lint fail) could reasonably upgrade to P1 under stricter grading; iter 4/5 kept them P2 because the P0/P1 noise-to-signal ratio was dominated by correctness/security concerns at those iterations.

### Sycophancy and inflation audit

- No findings were inflated to appear thorough. R5-P1-001 was the systemic escalation that genuinely merited P1 per tree-wide sweep evidence; it is not a re-flag of R3-P2-001.
- No findings were dismissed to avoid conflict. R6-P1-001 is an explicit UPGRADE of a closing-pass-era P2 to P1 based on NEW Phase-017 evidence — the review explicitly contradicted an earlier classification when evidence demanded.

---

## 8. Convergence Report

### Iteration-by-iteration metrics

| Iteration | Dimension | newFindingsRatio | New findings | Cumulative P0/P1/P2 | Status |
|-----------|-----------|------------------|--------------|---------------------|--------|
| 1 | correctness | 1.00 | 2 P1, 3 P2 | 0/2/3 | complete |
| 2 | security | 0.50 | 2 P1, 3 P2 | 0/4/6 | complete |
| 3 | traceability | 0.333 | 2 P1, 3 P2 | 0/6/9 | complete |
| 4 | maintainability | 0.264 | 2 P1, 4 P2 | 0/8/13 | complete |
| 5 | cross-reference | 0.102 | 1 P1, 1 P2 (+refinements) | 0/9/14 | complete |
| 6 | recovery-sweep | **0.0923** | 1 P1 upgrade, 1 P2 | 0/10/15 | complete (converged) |
| 7 | synthesis | 0 (N/A) | 0 | 0/10/18 | synthesis-only |

Note: P2 count in this report reaches 18 because cross-reference P2s from iter 5 + iter 6 plus the 3 closing-pass residuals (CP-002 RESOLVED note, CP-003, CP-004) are included in the consolidated inventory. Discovery iterations 1-6 produced 15 net-new P2 findings; the other 3 P2 entries are reference-tracked from the closing-pass audit.

### Convergence decision

```
STOP REASON: converged (newFindingsRatio 0.0923 < 0.10 threshold at iter 6)
P0-OVERRIDE: not invoked (0 P0 findings across all 6 discovery iterations)
COVERAGE: all 4 primary dimensions complete + cross-reference + recovery sweep
QUALITY GATES: evidence ✓, scope ✓, coverage ✓
```

### Severity-weighted calculation (iter 6)

```
SEVERITY_WEIGHTS = { P0: 10.0, P1: 5.0, P2: 1.0 }
iter-6 weightedNew = (1 P1 × 5.0) + (1 P2 × 1.0) = 6.0
cumulative weightedTotal (iter 1-6) = 13.0 + 13.0 + 13.0 + 14.0 + 6.0 + 6.0 = 65.0
newFindingsRatio = 6.0 / 65.0 = 0.0923
```

### Convergence trajectory

Smooth deceleration from 1.00 → 0.0923 across 6 discovery iterations. No stuck-iteration triggers fired; no P0 overrides required. The trajectory below threshold at iter 6 + the iter 6 adversarial self-checks refuting all compound-P0 hypotheses together constitute high-confidence convergence attestation.

### Quality gate summary

| Gate | Result | Evidence |
|------|--------|----------|
| newFindingsRatio < threshold | **MET** | 0.0923 < 0.10 at iter 6 |
| P0 cumulative | **MET** | 0 P0 across 6 iterations |
| Dimensional coverage | **MET** | correctness, security, traceability, maintainability, cross-reference, recovery-sweep, synthesis |
| Focus file coverage | **MET** | 24/24 structural; 3 sampled from remaining 9 unreviewed and found clean |
| Evidence citation hygiene | **MET** | 100% of P1 findings have claim-adjudication packets |
| Scope discipline | **MET** | All findings within 27-commit window + 24 focus files + 9 regression tests |

---

## 9. Next Steps

### Immediate (shipping decisions)

Given the CONDITIONAL verdict, ship options in order of risk:

1. **Ship as-is with advisories** (NOT recommended): documents all 10 P1 findings as known issues in changelog; requires explicit stakeholder acknowledgment. Cluster B drift will continue to worsen.
2. **Remediate P1 findings first, then ship** (recommended): invoke `/spec_kit:plan` to draft Phase 018 scope from this report's §5 remediation backlog. Target: all 10 P1 findings addressed, then re-run deep-review on remediated surfaces.
3. **Phased remediation** (pragmatic): split remediation into 2 sub-phases:
   - Phase 018a: Cluster B (5 P1 tasks, highest-leverage)
   - Phase 018b: Cluster A + Cluster C + standalone P1s (5 P1 tasks)

### Recommended command sequence

If proceeding with remediation:
```
/spec_kit:plan [phase-018-p1-remediation]
```

Remediation spec should:
- Cite this review-report.md as `authoritativeSources` in description.json.
- Inherit the 10 P1 findings as the frozen scope.
- Apply Cluster B tasks first (T-CNS-01 → T-CNS-02 → T-CNS-03 → T-CGC-01 → T-CGC-02 → T-EVD-01 → T-RBD-03) to address infrastructure gap before surface-level fixes.

If shipping with advisories (option 1):
```
/create:changelog
```

Generate changelog entry flagging v3.4.0.2 as "known P1 residuals; see review-report.md" and bump version accordingly.

### Optional follow-on deep-review

If concerned about undiscovered infrastructure gaps similar to Cluster B:
```
/spec_kit:deep-review :auto
```

Target: `generate-context.js` + `scripts/dist/memory/*.js` + `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` as a focused maintainability-and-infrastructure review. Scope: detect other "manual-dispatch bypass" surfaces, other "no auto-refresh" gaps, and other "canonical-save incomplete" patterns.

### Save context before closing loop

```
/memory:save
```

Persist review continuity into `implementation-summary.md._memory.continuity` for the active 016 spec folder. The handover includes:
- 10 P1 findings + 18 P2 findings
- 3 root-cause clusters with remediation recommendations
- Convergence attestation at iter 6 (0.0923 ratio)
- Full finding-ID to task-ID crosswalk for Phase 018 planning

---

## Appendix A — Artifact paths

- **Config**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/016-foundational-runtime-001-initial-research/deep-review-config.json`
- **State log**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/016-foundational-runtime-001-initial-research/deep-review-state.jsonl` (8 lines: init + 7 iterations)
- **Iteration files**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/016-foundational-runtime-001-initial-research/iterations/iteration-{001..007}.md`
- **Deltas**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/016-foundational-runtime-001-initial-research/deltas/iter-{001..007}.jsonl`
- **This report**: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/016-foundational-runtime-001-initial-research/review-report.md`

## Appendix B — Phase 016/017 commit manifest (from config)

```
afbb3bc7f  P0-D TOCTOU cleanup
6f5623a4c  P0-A HookState overhaul
1bdd1ed03  P0-C graph-metadata laundering
104f534bd  P0-B transactional reconsolidation
c789e71b7  M13 post-insert enum
6371149cf  S2-M3 session-stop atomic
e009eda0c  S4 skill routing
1af23e10a  S5 Gate 3 classifier
1bf322ece  S6 playbook runner
f9478670c  S7 YAML predicates
175ad87c9  M8 trust-state
e774eef07  scattered medium refactors (10 task IDs verified in iter 3)
0da4e1aa6  closing-pass audit
0a2d7a576  test migration audit
fcf75929f  Phase 016 closeout
d802cff51  close gaps
bc47d3dce  fix pre-existing warnings
39d6098a5  v3.4.0.1 changelog
```

---

**End of Review Report**
