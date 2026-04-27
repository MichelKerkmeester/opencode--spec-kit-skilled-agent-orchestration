---
_memory:
  continuity:
    next_safe_action: "Iter 009 should drill 011 playbook scenarios plus the 17 new Vitest cases for adversarial-completeness gaps."
---
# Iteration 008 — 010/007 T-A..T-F closure integrity audit

**Focus:** Verify each of 33 010/007 closures lands in code; flag doc-only or contradicted closures.
**Iteration:** 8 of 10
**Convergence score:** 0.84

## Closure verdicts table (33 rows)

| Finding | Batch | Claim | Verdict | Evidence |
|---|---|---|---|---|
| R-007-1 | T-B | 010/001 verification evidence sync | CLOSED-DOC-ONLY (intended) | `001-clean-room-license-audit/implementation-summary.md:48`, `001-clean-room-license-audit/checklist.md:28` |
| R-007-2 | T-A | `detect_changes` MCP wiring | CLOSED-IN-CODE | Dispatcher imports/registers/calls handler at `code-graph-tools.ts:13`, `code-graph-tools.ts:20-29`, `code-graph-tools.ts:75-80`; JSON schema at `tool-schemas.ts:636-647`; `TOOL_DEFINITIONS` entry at `tool-schemas.ts:915-920`; Zod schema and ledgers at `tool-input-schemas.ts:494-497`, `tool-input-schemas.ts:615-619`, `tool-input-schemas.ts:675-679`. |
| R-007-3 | T-D | diff-path canonicalization | CONTRADICTED-BY-CODE | Known F1/F6 P1 mixed-header path bypass remains the controlling verdict; not re-audited here per prompt. Closure claim is in `007-review-remediation/implementation-summary.md:187`. |
| R-007-4 | T-D | multi-file diff boundary per-side counters | CLOSED-IN-CODE | `diff-parser.ts:123-130` defines `remainingOldLines`/`remainingNewLines`; `diff-parser.ts:197-200` initializes from hunk header; `diff-parser.ts:204-220` terminates/reprocesses after both counters reach zero. |
| R-007-5 | T-B | 010/002 verification evidence sync | CLOSED-DOC-ONLY (intended) | `002-code-graph-phase-runner-and-detect-changes/implementation-summary.md:46-48`, `002-code-graph-phase-runner-and-detect-changes/checklist.md:21`, `002-code-graph-phase-runner-and-detect-changes/checklist.md:32-35`. |
| R-007-6 | T-C | `minConfidence` wired | CLOSED-IN-CODE | Already verified in iters 3/4; schema/ledger evidence still present at `tool-input-schemas.ts:676` and JSON schema in `tool-schemas.ts:584`. |
| R-007-7 | T-B | 010/003 verification evidence sync | CLOSED-DOC-ONLY (intended) | `003-code-graph-edge-explanation-and-impact-uplift/implementation-summary.md:28-30`, `003-code-graph-edge-explanation-and-impact-uplift/checklist.md:27-32`. |
| R-007-8 | T-D | `conflicts_with` affordance reject | CONTRADICTED-BY-CODE | Python compiler rejects at `skill_graph_compiler.py:61-75` and `skill_graph_compiler.py:543-550`, with test at `test_skill_advisor.py:1539-1555`; TS still accepts/models `conflicts_with` at `affordance-normalizer.ts:5-10`, `affordance-normalizer.ts:24-25`, `affordance-normalizer.ts:184-190`. This re-confirms F14. |
| R-007-9 | T-D | prompt-injection denylist broadened | CLOSED-IN-CODE | Already verified iter 5; TS normalizer hardening/counters are present at `affordance-normalizer.ts:55-73` and normalization drops at `affordance-normalizer.ts:220-229`; Python shared fixture coverage consumes the same adversarial list at `test_skill_advisor.py:1568-1585`. |
| R-007-10 | T-C | `affordances` DEFER boundary | CLOSED-IN-CODE | DEFER comment exists at `advisor-tool-schemas.ts:24-35`; public `AdvisorRecommendInputSchema` options are strict and do not include `affordances` at `advisor-tool-schemas.ts:36-45`. |
| R-007-11 | T-D | trust-badge merge per field | CLOSED-IN-CODE | Already verified iter 6; per-field normalization/merge is in `search-results.ts:291-320` and `search-results.ts:342-370`. |
| R-007-12 | T-F | cache invalidation generation counter | CLOSED-IN-CODE | Already verified iter 6; closure claim cites causal-edge generation folded into cache only with causal boost at `007-review-remediation/implementation-summary.md:274-282`. |
| R-007-13 | T-E | trust-badges DI strategy; "3/3 SQL tests pass" | CONTRADICTED-BY-CODE | DI seam and bind-side fix are real at `search-results.ts:398-405` and SQL casts at `search-results.ts:472-478`; test file has only two SQL-pipeline tests plus one formatter pass-through at `trust-badges.test.ts:91`, `trust-badges.test.ts:132`, `trust-badges.test.ts:166`. This re-confirms F17 precision drift against the `3/3 SQL tests` claim at `007-review-remediation/implementation-summary.md:47` and `007-review-remediation/implementation-summary.md:264`. |
| R-007-14 | T-A | chosen `detect_changes` path synced across docs | CLOSED-DOC-ONLY (intended) | Callable-tool docs exist in root README and MCP README at `README.md:540`, `mcp_server/README.md:552`, `mcp_server/README.md:1173`; residual tool-count drift belongs to R-007-17/F19-F23. |
| R-007-15 | T-B | 010/006 verification evidence sync | CLOSED-DOC-ONLY (intended) | Estimated-vs-validated distinction is explicit at `006-docs-and-catalogs-rollup/implementation-summary.md:45`, `006-docs-and-catalogs-rollup/implementation-summary.md:92-94`, and checklist OPERATOR-PENDING rows at `006-docs-and-catalogs-rollup/checklist.md:18-22`. |
| R-007-16 | T-F | INSTALL_GUIDE Python path fixed | CLOSED-IN-CODE | After `cd .opencode/skill/system-spec-kit/mcp_server`, the guide now runs `python3 skill_advisor/tests/python/test_skill_advisor.py` at `mcp_server/INSTALL_GUIDE.md:516-523`. |
| R-007-17 | T-F | tool-count canonicalization to 51 | CONTRADICTED-BY-CODE | Canonical `TOOL_DEFINITIONS` has 51 entries ending at `tool-schemas.ts:915-938`, and an awk count returns 51. Docs still drift: `SKILL.md:568` says 48, `SKILL.md:669` says 48, `INSTALL_GUIDE.md:5` says 43, `feature_catalog.md:171` says 43, and MCP README has only 40 detailed `#####` tool sections. Re-confirms F19-F23. |
| R-007-18 | T-F | broken simple-terms feature catalog link removed | CLOSED-IN-CODE | Root README now describes `FEATURE_CATALOG_IN_SIMPLE_TERMS.md` as a future docs deliverable, not an existing link, at `README.md:1264-1266`. |
| R-007-19 | T-B | 010/002 checklist premature PASS sync | CLOSED-DOC-ONLY (intended) | `002-code-graph-phase-runner-and-detect-changes/checklist.md:32-35` marks DQI and strict validation as OPERATOR-PENDING / OPERATOR-PENDING-COSMETIC while keeping real Vitest evidence at `checklist.md:21`. |
| R-007-20 | T-B | 010/003 checklist premature PASS sync | CLOSED-DOC-ONLY (intended) | `003-code-graph-edge-explanation-and-impact-uplift/checklist.md:27-31` has OPERATOR-PENDING DQI/validate rows and script-backed Vitest evidence. |
| R-007-21 | T-B | 010/005 checklist premature PASS sync | CLOSED-DOC-ONLY (intended) | `005-memory-causal-trust-display/checklist.md:25-30` marks DQI/validate as pending and trust-badge SQL as partial pending T-E; implementation summary mirrors the partial state at `005-memory-causal-trust-display/implementation-summary.md:42`, `implementation-summary.md:141-147`. |
| R-007-P2-1 | T-D | phase-runner duplicate-output rejection | CLOSED-IN-CODE | `PhaseRunnerError.kind` includes `duplicate-output` at `phase-runner.ts:39-45`; duplicate output keys rejected at `phase-runner.ts:97-115`; output-vs-name collision rejected at `phase-runner.ts:117-130`. |
| R-007-P2-2 | T-F | `runPhases` try/catch/finally for error metrics | CLOSED-IN-CODE | Already verified iter 1; closure claim is specific and landed per `007-review-remediation/implementation-summary.md:297-302`. |
| R-007-P2-3 | T-D | `reason`/`step` allowlist on read path | CLOSED-IN-CODE | Shared shape appears at all three promised read sites: DB parse sanitizer at `code-graph-db.ts:756-783` and applied at `code-graph-db.ts:787-800`; query output sanitizer at `query.ts:631-645` and applied through `edgeMetadataOutput` at `query.ts:647-654`; context output sanitizer at `code-graph-context.ts:287-300` and applied at `code-graph-context.ts:302-317`. |
| R-007-P2-4 | T-F | limit+1 overflow detection | CONTRADICTED-BY-CODE | Re-confirms F12. Code records `totalAffectedBeforeSlice = affectedByFile.size`, slices to `limit`, then sets `overflowed = totalAffectedBeforeSlice > limit` at `query.ts:960-968`; there is no actual `limit + 1` request path despite the closure wording at `007-review-remediation/implementation-summary.md:303-309`. |
| R-007-P2-5 | T-F | multi-subject seed preservation | CLOSED-IN-CODE | On unresolved candidate, already-resolved siblings are kept as `preservedSeedNodes` at `query.ts:1147-1159`, returned in `nodes` at `query.ts:1164-1170`, and placed in `partialResult` at `query.ts:1174-1182`. |
| R-007-P2-6 | T-F | stable `failureFallback.code` | CLOSED-IN-CODE | Already verified iter 4; examples remain visible for `limit_reached`, `unresolved_subject`, `ambiguous_subject`, `empty_source`, and `compute_error` at `query.ts:1005-1008`, `query.ts:1174-1177`, `query.ts:1208-1211`, `query.ts:1235-1238`, `query.ts:1278-1281`. |
| R-007-P2-7 | T-F | shared relationship-edge mapper | CLOSED-IN-CODE | Helpers exist at `query.ts:685-719`; four branches are collapsed into two case groups at `query.ts:1357-1405`, preserving `includeLine` differences for calls vs imports. |
| R-007-P2-8 | T-D | shared adversarial fixture consumed by TS/PY | CLOSED-IN-CODE | Fixture exists at `skill_advisor/tests/__shared__/affordance-injection-fixtures.json`; TS loads it at `affordance-normalizer.test.ts:27-33`; Python loads it at `test_skill_advisor.py:1568-1576` and consumes injection phrases at `test_skill_advisor.py:1578-1585`. |
| R-007-P2-9 | T-F | affordance debug counters | CLOSED-IN-CODE | Already verified iter 5; TS counter contract at `affordance-normalizer.ts:55-73` and increments at `affordance-normalizer.ts:220-229`; Python parity was verified in iter 5. |
| R-007-P2-10 | T-D | age-label allowlist | CLOSED-IN-CODE | Already verified iter 6; allowlist regex and fallback derivation are at `search-results.ts:262-288`. |
| R-007-P2-11 | T-D | trace flag trust-badge derivation | CLOSED-IN-CODE | Already verified iter 6; closure claim and returned shape are documented at `007-review-remediation/implementation-summary.md:226-230`. |
| R-007-P2-12 | T-F | phase 012 -> 010 alias note | CLOSED-IN-CODE | Alias note exists in all 010/006 packet docs: `006-docs-and-catalogs-rollup/spec.md:32-39`, `006-docs-and-catalogs-rollup/checklist.md:11-15`, `006-docs-and-catalogs-rollup/implementation-summary.md:30-34`. |

## New findings (use IDs F24+)

None. This iteration re-confirms known closure-integrity failures but did not surface a new F24+ gap.

## Verdict aggregate

- CLOSED-IN-CODE: 20
- CLOSED-DOC-ONLY (intended): 8
- CONTRADICTED-BY-CODE: 5
- NOT-LANDED: 0
- TOTAL: 33

## Cross-references

- F12 (R-007-P2-4): re-confirmed CONTRADICTED-BY-CODE / NOT-LANDED-as-documented. The implementation uses total pre-slice size, not a `limit + 1` retrieval path.
- F14 (R-007-8): re-confirmed PARTIALLY-LANDED (Python only). TS normalizer still accepts and emits `conflicts_with`.
- F17 (R-007-13): re-confirmed PRECISION-DRIFT. The test file has two SQL-pipeline tests plus one formatter pass-through, not three SQL tests.
- F19-F23 (R-007-17): re-confirmed PARTIALLY-LANDED. Some root/system docs say 51, but SKILL.md, INSTALL_GUIDE, feature_catalog, and MCP README detail coverage still drift.

## RQ coverage cumulative through iter 8

- RQ1 — Covered for 010/001-007 closure integrity; no new P0, and known P1 path-bypass remains open.
- RQ2 — Expanded with systematic 33-row closure verification; five contradicted rows remain, all previously known.
- RQ3 — Sanitization, schema, and read-path hardening claims are mostly code-backed; `conflicts_with` TS/Python parity remains the main exception.
- RQ4 — Tool-count/documentation drift remains open and re-confirmed against the 51-entry canonical registry.
- RQ5 — Playbook/doc alias and smoke-test path claims verified where requested; next pass should move from closure integrity to adversarial completeness.

## Next iteration recommendation

Iter 009 should drill 011 playbook scenarios plus the 17 new Vitest cases for adversarial-completeness gaps.

JSONL delta:
```jsonl
{"iter":8,"convergence_score":0.84,"closures_verified":33,"closed_in_code":20,"closed_doc_only":8,"contradicted":5,"not_landed":0,"new_findings":[],"rq_coverage":{"RQ1":"Covered 010/001-007 closure integrity; known P1 path-bypass retained, no new P0/P1.","RQ2":"Systematic 33-row closure audit completed; five contradictions remain and all are previously known.","RQ3":"Most sanitizer/schema/read-path claims code-backed; TS/Python conflicts_with parity remains open.","RQ4":"Tool-count canonicalization drift re-confirmed against 51-entry TOOL_DEFINITIONS registry.","RQ5":"Requested doc alias/path claims verified; next pass should target 011 playbook and adversarial tests."},"new_p0":0,"new_p1":0,"new_p2":0}
```

EXIT_STATUS=DONE | findings=0 | convergence=0.84 | closed=28/contradicted=5/not-landed=0 | next=iter-009
