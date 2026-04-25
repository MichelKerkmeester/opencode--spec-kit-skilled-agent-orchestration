---
_memory:
  continuity:
    next_safe_action: "Iter 010 cross-cutting synthesis + Adopt/Adapt/Reject/Defer matrix"
---
# Iteration 009 — 011 playbook scenarios + 17 new vitest cases adversarial completeness

**Focus:** Audit whether the 011-added regression suite is sufficient to detect 010/007 hardening drift.
**Iteration:** 9 of 10
**Convergence score:** 0.88

011 improved the regression net, but it is not adversarially complete. The tests catch several shipped regressions directly, while a few integration and mixed-input shapes can still pass green.

## Section A verdicts (detect-changes adversarial coverage)

- **A1:** The 3 new 011 adversarial cases are:
  - `rejects diff path that escapes canonicalRootDir via ../../` at `.opencode/skill/system-spec-kit/mcp_server/code_graph/tests/detect-changes.test.ts:185`, using `--- a/../../etc/passwd` and `+++ b/../../etc/passwd` at `:187`.
  - `rejects absolute path that resolves outside the workspace` at `detect-changes.test.ts:198`, using `--- a/etc/passwd` and `+++ b/etc/passwd` at `:201`.
  - `accepts a legitimate workspace-relative path (negative control)` at `detect-changes.test.ts:220`, using `src/legitimate.ts` at `:223`.
- **A2:** NO, these do not cover the F1/F6 mixed-header bypass. Both the traversal test and the so-called absolute-path test give the same path shape on both old and new sides (`detect-changes.test.ts:187`, `:201`). The known bypass is old-side escape plus safe new-side, or safe old-side plus escaping new-side. The handler still selects only one candidate path at `detect-changes.ts:141-144` and returns `ok` after only that selected side passes containment.
- **A3:** Additional shapes the rig should add:
  - `--- a/../../etc/passwd` + `+++ b/src/safe.ts` to catch old-side escape hidden by safe new-side.
  - `--- a/src/safe.ts` + `+++ b/../../etc/passwd` to catch new-side escape hidden by safe old-side.
  - A true absolute header such as `--- /etc/passwd` + `+++ b/src/safe.ts`; the current "absolute path" case is actually `a/etc/passwd`, which normalizes to a workspace-relative path.
  - Backslash or encoded traversal variants such as `..\\..\\etc\\passwd` on Windows-like input, if this parser is expected to be portable.
  - Rename/copy metadata with `rename from ../../x` and safe `+++ b/src/y.ts`, if future parser logic starts consuming non-`---` / `+++` file headers.

## Section B verdicts (edge-metadata-sanitize coverage)

- **B1:** The 8 sanitizer cases are:
  - Legitimate single-line strings survive unchanged (`edge-metadata-sanitize.test.ts:12-16`).
  - Non-string inputs return `null` (`:18-25`).
  - Empty string returns `null` (`:27-29`).
  - Length boundary rejects strings longer than 200 chars while accepting exactly 200 (`:31-35`).
  - Control characters `\x00-\x1F` return `null`, including BEL, NUL, newline, tab, CR, and ESC (`:37-50`).
  - DEL `\x7F` returns `null` (`:52-54`).
  - Unicode/high-code-point content above the control band is accepted (`:56-60`).
  - Mixed legitimate prefix plus a control char is rejected whole, with no partial sanitization (`:62-65`).
- **B2:** YES. Non-string types include `null`, `undefined`, `42`, `true`, `{}`, and `[]` at `edge-metadata-sanitize.test.ts:19-24`.
- **B3:** YES. Boundary length is covered: 200 chars accepted, 201 and 2000 rejected at `edge-metadata-sanitize.test.ts:32-34`.
- **B4:** YES. Unicode and high-code-point values are accepted at `edge-metadata-sanitize.test.ts:56-60`.
- **B5:** NO. The suite imports and calls only `sanitizeEdgeMetadataString` from `code-graph-db.ts` (`edge-metadata-sanitize.test.ts:9`). It does not assert the sanitizer is called from all 3 documented sites: `rowToEdge` applies it at `code-graph-db.ts:787-800`, `edgeMetadataOutput` applies a local equivalent at `query.ts:647-654`, and `formatContextEdge` applies a local equivalent at `code-graph-context.ts:302-317`. That is a regression-detection gap: deleting one call site can leave this suite green.
- **B6:** If the exported sanitizer changed to `return value`, the 8 unit tests would catch it strongly: non-string, empty, over-length, control-char, DEL, and mixed-control tests fail (`edge-metadata-sanitize.test.ts:18-65`). But a call-site mutation such as removing `reason: sanitizeEdgeMetadataReadString(...)` in `query.ts:653` or `formatContextEdge` in `code-graph-context.ts:316-317` would not be caught by this file.

## Section C verdicts (R-007-12 generation counter coverage)

- **C1:** The 6 R-007-12 cases are:
  - G1 `insertEdge` bumps generation (`causal-edges-unit.vitest.ts:702-707`).
  - G2 `updateEdge` bumps generation (`:709-715`).
  - G3 `deleteEdge` bumps generation (`:717-723`).
  - G4 `deleteEdgesForMemory` bumps generation (`:725-732`).
  - G5 read-only operations do not bump generation (`:734-746`).
  - G6 successive mutations produce strictly increasing generation values (`:748-771`).
- **C2:** NO. The unit tests do not verify `enableCausalBoost === true` gating. The gating exists in code: `buildCacheArgs` includes `causalEdgesGeneration` only when `enableCausalBoost === true` at `search-utils.ts:178-214`, and `memory-search.ts` only reads the generation for causal-boost calls at `memory-search.ts:847-887`. The unit suite never exercises this path.
- **C3:** NO. The tests verify only the counter increments. They do not run `memory_search`, build the cache key end to end, or assert cache hit/miss behavior through `toolCache.generateCacheKey` at `memory-search.ts:891`.
- **C4:** NO. There is no concurrency/race test. The generation counter is in-memory and incremented before degree-cache invalidation (`causal-edges.ts:173-182` from the rg result), but the suite does not verify deterministic behavior when two `memory_search` calls race with a mutation.

## Section D verdicts (playbook scenarios block-level fidelity)

- **014 Block A:** Still matches current behavior. The handler canonicalizes root, blocks non-fresh readiness before DB lookup, and passes `allowInlineIndex: false` / `allowInlineFullScan: false` at `detect-changes.ts:193-212`. The playbook Block A asks for exactly that stale-vs-fresh shape (`014-detect-changes-preflight.md:35-43`).
- **014 Blocks B/C:** Block B matches the current path-traversal rejection path for selected candidate paths: `resolveCandidatePath` rejects outside-root paths at `detect-changes.ts:137-156`, and the handler emits `parse_error` at `detect-changes.ts:241-255`. Block C matches the current parser counter behavior: the playbook asks for combined-vs-per-file union checks at `014-detect-changes-preflight.md:51-56`, while the parser has a multi-file unit at `detect-changes.test.ts:360-378`. Gap: neither Block B nor the 3 new tests cover mixed old/new escape from F1/F6.
- **026 Block A:** The prompt and expected fields match the relationship/blast-radius handler surface. Relationship output uses `edgeMetadataOutput` for `reason` / `step` at `query.ts:647-654`, and the playbook requires those plus `depthGroups`, `riskLevel`, `minConfidence`, `ambiguityCandidates`, and `failureFallback` at `026-code-graph-edge-explanation-blast-radius-uplift.md:38-43`.
- **026 Blocks B/C/D/E:** Mostly match current return shapes. Block B checks runtime exact-limit truth (`partialResult:false` when count equals limit) at playbook `:45-49`, which current code achieves via pre-slice size comparison, not the documented `limit + 1` mechanism from known F12. Block C matches preserved resolved seeds (`:51-54`). Block D matches the 5 `failureFallback.code` values and allows `compute_error` to be unautomatable (`:56-62`). Block E matches relationship-query sanitizer exposure (`:64-69`), but it does not exercise `code_graph_context`'s `formatContextEdge` path.
- **199 Blocks A/B:** Block A matches the affordance privacy/routing suites (`199-skill-advisor-affordance-evidence.md:44-48`). Block B matches the debug-counter existence/parity surface (`:50-54`). Gap: the scenario metadata claims R-007-8 coverage at `:103`, but no block actually verifies `conflicts_with` rejection in TS and Python. A playbook PASS can hide known F14.
- **203 Blocks A/B:** Block A matches trust-badge formatter/profile preservation (`203-memory-causal-trust-display.md:36-40`). Block B is stronger than the new unit tests: it explicitly requires `H1 === H1'`, `H2 !== H1`, and `enableCausalBoost=false` stability at `:42-48`, matching the gated cache-key design in `memory-search.ts:847-887` and `search-utils.ts:178-214`.
- **D3 closure surfaces not exercised by a playbook PASS:** F12's documented `limit + 1` mechanism is not exercised, only runtime truth; F14's TS `conflicts_with` reject is not exercised; F17's "3 SQL-pipeline tests" precision claim is not exercised by 203; F19-F23 tool-count canonicalization is not covered by these four scenarios.

## Section E verdicts (fixture stability)

- **E1:** The differentiated `graph-rollout-diagnostics.md` corpus is now meaningfully distinct. Its body focuses on bounded graph walks, `graphContribution`, `graph_status`, latency histograms, and explicitly says it is separate from checkpoint/rollback semantics (`manual-playbook-fixture.ts:583-591`).
- **E2:** The defensive `indexSeed` fallback is present: if `indexMemoryFile` returns no positive numeric id, it logs a warning and returns `{ id: 0, title, filePath, specFolder }` so downstream truthy checks skip causal-link setup rather than aborting the fixture (`manual-playbook-fixture.ts:226-245`).
- **E3:** Remaining near-duplicate risks are mostly boilerplate-driven because every memory uses the same `buildMemoryDoc` wrapper. Seed pairs that may still approach a high similarity threshold:
  - `Sandbox Temporary Memory A` and `Sandbox Temporary Memory B` differ mainly by A/B and delete/bulk-delete wording (`manual-playbook-fixture.ts:621-634`).
  - `Ingest Alpha` and `Ingest Beta` differ mainly by alpha/beta (`:654-668`).
  - `Thin Sandbox Memory`, `Rich Sandbox Memory`, and `Sandbox Extra` share the same sandbox framing, though their unique lines are more distinct (`:670-692`).
  - `Checkpoint Rollback Runbook` and `Anchored Retrieval Reference` both include checkpoint/retrieval vocabulary (`:573-580`, `:636-643`) but appear less risky after the graph diagnostics differentiation.

## New findings (use IDs F24+)

- **F24 (P2, test-add, RQ5): The 011 "absolute path" detect_changes test is not actually absolute and still misses mixed-header containment bypasses.** Evidence: the test name says absolute outside workspace at `detect-changes.test.ts:198`, but the input is `--- a/etc/passwd` / `+++ b/etc/passwd` at `:201`, which is a workspace-relative path after prefix stripping. The known mixed old/new escape remains uncovered because the handler selects one candidate path at `detect-changes.ts:141-144`. Remediation: add true absolute and mixed old/new escape tests.
- **F25 (P2, test-add, RQ5): Edge metadata sanitizer tests validate the helper, not all documented read-path call sites.** Evidence: the unit suite imports only `sanitizeEdgeMetadataString` at `edge-metadata-sanitize.test.ts:9`; documented call sites are `rowToEdge` at `code-graph-db.ts:787-800`, `edgeMetadataOutput` at `query.ts:647-654`, and `formatContextEdge` at `code-graph-context.ts:302-317`. Remediation: add fixture/mocked-row tests for relationship query and context output, ideally with a direct DB mutation or mocked edge carrying control chars.
- **F26 (P2, test-add, RQ5): R-007-12 unit tests prove generation increments, not memory_search cache invalidation semantics.** Evidence: G1-G6 only read `getCausalEdgesGeneration()` around storage mutations (`causal-edges-unit.vitest.ts:702-771`). The actual semantics live in `memory-search.ts:847-891` and `search-utils.ts:178-214`, but no test asserts `enableCausalBoost=true` changes the cache key while `false` stays stable. Remediation: add a focused `memory_search` cache-key test with mutation and causal-boost on/off controls.
- **F27 (P2, test-add/doc-fix, RQ5/RQ2): Playbook 199 claims R-007-8 coverage but never exercises the TS/Python `conflicts_with` reject split.** Evidence: source metadata includes R-007-8 at `199-skill-advisor-affordance-evidence.md:103`, while the executable blocks cover privacy/routing and counters only (`:44-54`). Known F14 says Python rejects but TS still accepts. Remediation: either add a Block C for `conflicts_with` parity or remove R-007-8 from the scenario's covered surface.
- **F28 (P2, test-add, RQ5): The manual fixture still has boilerplate-heavy near-duplicate seed pairs that can make playbook setup stability depend on quality-gate tolerance.** Evidence: `indexSeed` explicitly anticipates near-duplicate quality-gate failures (`manual-playbook-fixture.ts:237-245`), while A/B and alpha/beta pairs remain close (`:621-668`). Remediation: add more semantically distinct unique lines per paired fixture, or add a fixture-level test that asserts all required seeded memories get positive IDs under the current duplicate threshold.

## Negative findings

- The sanitizer helper unit tests would catch a no-op sanitizer mutation (`return value`) across non-string, empty, over-length, control-char, DEL, and mixed-control cases (`edge-metadata-sanitize.test.ts:18-65`).
- The R-007-12 generation counter tests catch missing invalidation bumps on `insertEdge`, `updateEdge`, `deleteEdge`, and `deleteEdgesForMemory` (`causal-edges-unit.vitest.ts:702-732`) and catch accidental read-side bumps (`:734-746`).
- Playbook 203 Block B correctly specifies the end-to-end cache-key behavior missing from the unit tests: causal-boost responses must change after mutation, while non-causal-boost responses remain stable (`203-memory-causal-trust-display.md:42-63`).
- Playbook 014 Block C is stronger than the parser unit test because it requires combined multi-file output to equal the union of per-file outputs (`014-detect-changes-preflight.md:51-66`).
- Playbook 026 Block E would catch raw control characters leaking through relationship query output (`026-code-graph-edge-explanation-blast-radius-uplift.md:64-86`).

## RQ coverage cumulative through iter 9

- **RQ1:** No new P0/P1 regressions found in 011. Known F1/F6 P1 remains open and confirmed not covered by the 011 cases.
- **RQ2:** Extended with playbook closure-surface precision: F12/F14/F17/F19-F23 can still be hidden by a playbook PASS depending on scenario.
- **RQ3:** Adversarial boundary coverage improved for direct traversal and sanitizer primitives, but mixed-header paths and call-site sanitizer wiring remain incomplete.
- **RQ4:** No new umbrella-doc drift beyond known tool-count and scenario-scope wording. F27 is a playbook metadata-to-coverage mismatch.
- **RQ5:** Primary expansion this iteration. New gaps F24-F28 identify where the regression suite can pass while real caller shapes or documented sites drift.

## Next iteration recommendation

Iter 010 should produce the cross-cutting Adopt/Adapt/Reject/Defer matrix synthesizing all 9 prior iterations.

```jsonl
{"iter":9,"convergence_score":0.88,"findings":[{"id":"F24","severity":"P2","title":"011 detect_changes absolute-path test is not absolute and misses mixed-header bypasses","status":"new","rq":["RQ5"],"remediation":"test-add"},{"id":"F25","severity":"P2","title":"Edge metadata sanitizer tests do not assert all documented read-path call sites","status":"new","rq":["RQ5"],"remediation":"test-add"},{"id":"F26","severity":"P2","title":"R-007-12 unit tests miss memory_search cache-key semantics and enableCausalBoost gating","status":"new","rq":["RQ5"],"remediation":"test-add"},{"id":"F27","severity":"P2","title":"Playbook 199 claims R-007-8 coverage without conflicts_with parity checks","status":"new","rq":["RQ2","RQ5"],"remediation":"test-add/doc-fix"},{"id":"F28","severity":"P2","title":"Manual fixture retains boilerplate-heavy near-duplicate seed pairs","status":"new","rq":["RQ5"],"remediation":"test-add"}],"checklist_handled":19,"checklist_gap":5,"rq_coverage":{"RQ1":"No new P0/P1; known F1/F6 remains open and uncovered by 011 cases.","RQ2":"Extended with playbook closure-surface precision for F12/F14/F17/F19-F23.","RQ3":"Adversarial coverage improved but mixed-header and sanitizer call-site wiring remain gaps.","RQ4":"No new umbrella-doc drift; playbook metadata mismatch captured as F27.","RQ5":"Expanded materially with F24-F28 test-rig sufficiency gaps."},"new_p0":0,"new_p1":0,"new_p2":5}
```

EXIT_STATUS=DONE | findings=5 | convergence=0.88 | checklist=19/5 | next=iter-010
