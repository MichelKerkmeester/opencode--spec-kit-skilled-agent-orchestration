# Implementation Deep Review Report

## 1. Executive summary

Verdict: FAIL for implementation readiness. The 10-iteration implementation-focused loop audited 4 code files and found 6 active findings: 1 P0, 4 P1, and 1 P2.

The release-blocking issue is code-only and independent of packet metadata drift: Tier 3 model output can name an arbitrary `target_doc`, and the save handler resolves it with `path.join(specFolderAbsolute, routedDocPath)` without proving the final path stays under the current spec folder. A high-confidence model response can therefore route a canonical save into another existing packet document.

Confidence: high for the P0, because the path is visible across parsing, decision construction, target resolution, and merge.

## 2. Scope

Code files audited:

| File | Role |
|---|---|
| `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` | Save handler, Tier 3 transport, canonical target resolution |
| `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts` | Router, Tier 3 validation, cache, prompt contract |
| `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts` | Handler regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts` | Router regression coverage |

Not reviewed as findings evidence: spec docs, `description.json`, and `graph-metadata.json` drift. Those were only used to determine the implementation scope.

## 3. Method

Ran 10 iterations with rotating dimensions: correctness, security, robustness, testing, then repeat. Each iteration re-read prior state, reviewed the four scoped code files, ran the packet Vitest command, and wrote both an iteration note and JSONL delta.

Verification command used each iteration:

```sh
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run tests/handler-memory-save.vitest.ts tests/content-router.vitest.ts --reporter=default
```

All 10 runs passed: `2` files passed, `89` tests passed, `3` skipped.

Git history check:

```sh
git log --oneline --decorate -- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts .opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts
```

Relevant commits included `253b7d098b feat: enable Tier 3 LLM save routing by default, remove feature flag` and `ba0dbea718 fix(009): close 5 P1 deep-review findings`.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Required code evidence | Impact |
|---|---|---|---|---|
| IMPL-F002 | security | Tier 3 `target_doc` can escape the spec folder. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:837`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:856`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1503` | Untrusted model output can steer a canonical save to a sibling or parent packet document if the escaped path exists and has the requested anchor. |

### P1

| ID | Dimension | Finding | Required code evidence | Impact |
|---|---|---|---|---|
| IMPL-F001 | correctness | Tier 3 cache keys ignore route-shaping context. | `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:756`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:334`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1297`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1303`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296` | Identical text can replay a stale Tier 3 route across packet kind, save mode, packet level, or phase-anchor context. |
| IMPL-F003 | security | `plannerMode: full-auto` enables live Tier 3 transport even when the router flag is unset. | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1040`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1053`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1343`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1366`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625` | Full-auto saves can disclose save chunks to the configured endpoint without the explicit Tier 3 router flag being set. |
| IMPL-F005 | robustness | Tier 3 timeout does not cover response body parsing. | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1049`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1073`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1079`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1790` | A peer can return headers promptly and then stall or bloat body parsing outside the intended timeout. |
| IMPL-F006 | testing | No regression test rejects unsafe Tier 3 `target_doc` values. | `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:261`, `.opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts:296`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1625`, `.opencode/skill/system-spec-kit/mcp_server/tests/handler-memory-save.vitest.ts:1735`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1153` | The P0 path is not locked by tests and can regress again after remediation. |

### P2

| ID | Dimension | Finding | Required code evidence | Impact |
|---|---|---|---|---|
| IMPL-F004 | robustness | Shared session cache is unbounded and uses an infinite TTL. | `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:171`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:310`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:326`, `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:806` | Long-lived MCP server processes can retain every routed chunk hash for process lifetime. |

## 5. Findings by dimension

| Dimension | Findings | Summary |
|---|---|---|
| correctness | IMPL-F001 | Cache identity does not include the same context that shapes Tier 3 prompts and routing targets. |
| security | IMPL-F002, IMPL-F003 | The target path trust boundary is missing, and live transport activation is broader than the explicit router flag suggests. |
| robustness | IMPL-F004, IMPL-F005 | Cache lifetime is unbounded, and the transport timeout does not cover body parsing. |
| testing | IMPL-F006 | Tests cover happy-path Tier 3 routing but not adversarial target docs. |

## 6. Adversarial self-check for P0

Counterargument: the Tier 3 prompt tells the model not to invent target docs at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:1289`, and the save handler checks that the resolved target exists at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1427`.

Re-check: the prompt instruction is not a code boundary. `validateTier3Response()` still preserves any string `target_doc` at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:859`. `makeDecisionFromTier3()` still uses the model target at `.opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts:687`. `resolveCanonicalTargetDocPath()` still performs only `path.join(specFolderAbsolute, routedDocPath)` at `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1160`. Existence checks do not prevent `../sibling/implementation-summary.md` from resolving outside the packet when that sibling exists.

Expected vs actual: expected code should allowlist canonical docs or verify the normalized resolved path remains inside `specFolderAbsolute`; actual code trusts model-provided relative path strings after type checks.

Conclusion: keep IMPL-F002 as P0.

## 7. Remediation order

1. Fix IMPL-F002 first. Constrain Tier 3 `target_doc` to canonical docs or normalize and reject any resolved path whose `path.relative(specFolderAbsolute, targetDocPath)` starts with `..` or is absolute.
2. Add IMPL-F006 regression tests in both router and handler coverage: unsafe `target_doc` should be rejected or fail open to Tier 2 and must not write outside the packet.
3. Fix IMPL-F001 by adding prompt version plus route-shaping context to the cache key, or by validating cached entry context before reuse.
4. Clarify and enforce the Tier 3 activation contract in code for IMPL-F003.
5. Keep the timeout active through `response.json()` and/or parse with a bounded body size for IMPL-F005.
6. Bound the shared cache with a max size, finite session TTL, or both for IMPL-F004.

## 8. Test additions needed

| Test | Target |
|---|---|
| Tier 3 response with `target_doc: "../other/implementation-summary.md"` rejects or falls back without writing. | `handler-memory-save.vitest.ts` |
| Router rejects or sanitizes model-returned target docs outside the canonical allowlist. | `content-router.vitest.ts` |
| Identical chunk text with different `packet_kind`, `save_mode`, or `likely_phase_anchor` gets distinct cache behavior. | `content-router.vitest.ts` |
| Tier 3 endpoint returns headers then delayed body; timeout still fails open. | `handler-memory-save.vitest.ts` |
| Cache max-size or TTL behavior expires session entries. | `content-router.vitest.ts` |

## 9. Appendix: iteration list + churn

| Iteration | Dimension | New findings | newFindingsRatio | Churn | Stop status |
|---|---|---|---:|---:|---|
| 001 | correctness | IMPL-F001 | 0.32 | 0.32 | continue |
| 002 | security | IMPL-F002, IMPL-F003 | 0.58 | 0.44 | continue |
| 003 | robustness | IMPL-F004, IMPL-F005 | 0.28 | 0.22 | continue |
| 004 | testing | IMPL-F006 | 0.14 | 0.11 | continue |
| 005 | correctness | none | 0.05 | 0.04 | active P0 blocked stop |
| 006 | security | none | 0.04 | 0.03 | active P0 blocked stop |
| 007 | robustness | none | 0.03 | 0.03 | active P0 blocked stop |
| 008 | testing | none | 0.03 | 0.02 | active P0 blocked stop |
| 009 | correctness | none | 0.02 | 0.02 | active P0 blocked stop |
| 010 | security | none | 0.02 | 0.02 | max iterations reached |
