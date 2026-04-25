---
title: "Merged Skill Advisor Bug Scan Findings"
description: "Merged read-only multi-agent bug scan findings for the skill-advisor package and tightly coupled skill-graph/advisor surfaces."
importance_tier: "high"
contextType: "review-findings"
review_date: "2026-04-21"
scope: ".opencode/skill/system-spec-kit/mcp_server/skill-advisor"
merged_from:
  - "scan-findings.md"
  - "skill-advisor-bug-scan-findings.md"
---

# Merged Scan Findings - Skill Advisor Bug Audit

## Summary

This document merges `scan-findings.md` and `skill-advisor-bug-scan-findings.md` into one canonical read-only bug scan report for the skill advisor package under the Phase 027 review packet.

Outcome:

- `0` P0 findings
- `27` P1 findings
- `10` P2 findings

Primary risk themes:

- API cache, prompt-safety, and freshness contracts can return incorrect, stale, or over-disclosed public results.
- Scoring logic has correctness defects around thresholding, ambiguity, age decay, projection parity, and graph-causal propagation.
- Freshness publication, file watching, lease handling, and generation invalidation contain race, deletion-path, and stale-index bugs.
- Derived metadata and rollback flows have filesystem-safety, path-containment, and failure-atomicity gaps.
- Python/native bridge tooling, routing accuracy tooling, documented commands, and validation coverage miss important shipped failure modes.

## Scope And Method

- Review mode: read-only bug scan.
- Coverage approach: one inventory pass plus parallel review passes across API, scorer, freshness/daemon, derived/lifecycle/promotion, Python/runtime, and follow-up local verification partitions.
- Verification: representative high-severity findings were spot-checked directly against source after sub-agent synthesis.
- Limitation: findings are code-review findings, not runtime reproductions, unless explicitly stated in the finding text.

## Merge Notes

- `scan-findings.md` was kept as the canonical destination because it already contained the broader external-scan structure and remediation ordering.
- `skill-advisor-bug-scan-findings.md` contributed additional confirmed issues that were not present in the first document, especially prompt leakage, path containment, SQLite fail-open, Python pathing, and CLI/documentation failures.
- Duplicate topics were merged into the existing external-scan IDs rather than listed twice. Examples: cache-key options, status freshness mtime, derived age decay, and unlink handling.

## Findings By Severity

### P1

| ID | File:Line | Finding | Impact |
| --- | --- | --- | --- |
| API-P1-001 | `handlers/advisor-recommend.ts:138-160` | Cache key omits threshold and response-shape options. Merged duplicate: `skill-advisor-bug-scan-findings.md` P1-004. | Different requests can reuse the wrong cached recommendation payload. |
| API-P1-002 | `handlers/advisor-status.ts:35-38`, `handlers/advisor-status.ts:71-73` | Freshness compares DB mtime against the top-level `.opencode/skill` directory mtime. Merged duplicate: `skill-advisor-bug-scan-findings.md` P1-005. | Nested source edits can be missed and reported as `live`. |
| API-P1-003 | `schemas/advisor-tool-schemas.ts:88-90`, `handlers/advisor-validate.ts:282-299` | Public `advisor_validate` surface lacks meaningful gating while executing heavy corpus, parity, and latency work. | Avoidable denial-of-service and public-surface cost risk. |
| SCORE-P1-001 | `lib/scorer/lanes/derived.ts:25-33`, `lib/lifecycle/age-haircut.ts:27-37` | Derived-lane age decay is disabled because `generatedAt` is set to `now`. Merged duplicate: `skill-advisor-bug-scan-findings.md` P1-012. | Old derived metadata never decays as intended. |
| SCORE-P1-002 | `lib/scorer/fusion.ts:295-300` | `includeAllCandidates` bypasses threshold semantics for `topSkill` and `unknown`. | Callers can receive a winner even when nothing passed thresholds. |
| SCORE-P1-003 | `lib/scorer/ambiguity.ts:9-12`, `lib/scorer/fusion.ts:282-301` | Ambiguity is keyed off confidence deltas after confidence flooring. | Lower-scoring candidates can be falsely marked ambiguous. |
| SCORE-P1-004 | `lib/scorer/projection.ts:158-169`, `lib/scorer/projection.ts:237-245` | Projection differs between SQLite and filesystem fallback for derived keywords. | Routing behavior changes when the DB is unavailable. |
| SCORE-P1-005 | `lib/scorer/lanes/graph-causal.ts:53-66` | Negative causal edges still feed positive downstream propagation. | Conflicting relationships can incorrectly boost later nodes. |
| FRESH-P1-001 | `lib/daemon/watcher.ts:384-390`, `lib/daemon/watcher.ts:434-442` | Deleted watched files are ignored because `unlink` paths hash to `null` and short-circuit processing. Merged duplicate: `skill-advisor-bug-scan-findings.md` P1-007. | Removed skills or metadata can remain indexed indefinitely. |
| FRESH-P1-002 | `lib/freshness/generation.ts:76-91` | Generation publication is read-then-write without locking or CAS. | Concurrent publishers can lose increments and invalidations. |
| FRESH-P1-003 | `lib/daemon/lease.ts:161-176`, `lib/daemon/lease.ts:192-201` | Heartbeat and release ignore zero-row updates after lease loss. | A stale holder can keep acting as if it still owns the lease. |
| FRESH-P1-004 | `lib/freshness/cache-invalidation.ts:24-33` | One throwing invalidation listener aborts the entire callback fan-out. | Later listeners may never receive invalidation events. |
| DERIVED-P1-001 | `lib/derived/sync.ts:16-23`, `lib/derived/sync.ts:75-78`, `lib/derived/sync.ts:106-107` | `syncDerivedMetadata()` never checks that `skillDir` stays under `workspaceRoot`. | Caller-controlled paths can trigger writes outside the intended workspace. |
| DERIVED-P1-002 | `lib/derived/anti-stuffing.ts:17-23`, `lib/derived/anti-stuffing.ts:71-82`, `lib/derived/anti-stuffing.ts:91-96` | Anti-stuffing computes a demotion value that is never applied by live consumers. | Repetition-heavy derived metadata is not down-ranked as designed. |
| DERIVED-P1-003 | `lib/lifecycle/rollback.ts:35-41` | Graph-metadata rollback writes in place instead of using atomic temp-file replacement. | A crash during rollback can corrupt the file that is supposed to be the safe restore path. |
| DERIVED-P1-004 | `lib/promotion/rollback.ts:34-45` | Promotion rollback can restore weights and then throw during cache invalidation or telemetry. | Callers can see partial success with stale cache and missing audit trace. |
| PY-P1-001 | `scripts/skill_advisor.py:3203-3205`, `scripts/skill_advisor.py:3219-3229` | `--force-native` is bypassed when `SPECKIT_SKILL_ADVISOR_HOOK_DISABLED=1`. | Forced-native callers get silent success instead of a hard failure. |
| PY-P1-002 | `scripts/skill_advisor_bench.py:108-129`, `scripts/skill_advisor_bench.py:141-155`, `scripts/skill_advisor_bench.py:168-195` | Bench runners compare different runtimes because subprocess paths can use native-first while in-process paths stay Python-only. | Bench numbers are apples-to-oranges when native is available. |
| PY-P1-003 | `scripts/skill_advisor_regression.py:77-87`, `scripts/skill_advisor_regression.py:188-254` | Regression suite exercises only the in-process path, not the shipped CLI/native bridge path. | Native-bridge regressions can ship while regression checks stay green. |
| PY-P1-004 | `scripts/skill_graph_compiler.py:149-151`, `scripts/skill_graph_compiler.py:305-314`, `scripts/skill_graph_compiler.py:327-344`, `scripts/skill_graph_compiler.py:378-384` | Invalid `edges` metadata is reported but later validators still assume a dict and call `.get(...)`. | Malformed metadata can crash validation instead of producing a structured validation failure. |
| MERGE-P1-001 | `mcp_server/context-server.ts:1181`, `mcp_server/lib/errors/core.ts:326`, `mcp_server/lib/errors/core.ts:345`, `skill-advisor/tools/advisor-recommend.ts:9` | `advisor_recommend` can leak raw prompts through generic MCP error envelopes. | Unexpected scorer, cache, schema, or handler errors can return the caller's raw prompt to the MCP client. |
| MERGE-P1-002 | `lib/derived/extract.ts:235`, `lib/derived/extract.ts:244`, `lib/derived/provenance.ts:43`, `lib/derived/provenance.ts:62` | `derived.key_files` allows out-of-workspace reads and hashing through absolute paths, traversal, or symlinks. | Workspace-controlled metadata can create an out-of-workspace file hash oracle or large-file DoS path. |
| MERGE-P1-003 | `lib/daemon/watcher.ts:119`, `lib/daemon/watcher.ts:142`, `lib/daemon/watcher.ts:151`, `lib/daemon/watcher.ts:172` | Daemon watcher trusts `derived.key_files` and can watch/hash files outside the workspace. | A malformed workspace can extend the trusted watch surface beyond the repository. |
| MERGE-P1-004 | `mcp_server/handlers/skill-graph/scan.ts:38`, `mcp_server/context-server.ts:1479`, `skill-advisor/lib/freshness/generation.ts:76`, `skill-advisor/lib/freshness/generation.ts:86` | Explicit skill graph scans update the graph without publishing generation or invalidating advisor caches. | Process-local prompt-cache entries can survive a successful rescan. |
| MERGE-P1-005 | `mcp_server/lib/skill-graph/skill-graph-db.ts:531`, `mcp_server/lib/skill-graph/skill-graph-db.ts:558`, `mcp_server/lib/skill-graph/skill-graph-db.ts:572` | Previously rejected edges are never backfilled when their target skill appears later. | Skill graph relationships can remain permanently incomplete after incremental scans. |
| MERGE-P1-006 | `lib/scorer/projection.ts:177`, `lib/scorer/projection.ts:180`, `lib/scorer/fusion.ts:207`, `handlers/advisor-recommend.ts:191` | Corrupt SQLite can crash native recommendation instead of failing open or rebuilding. | `advisor_recommend` can throw rather than return explicit stale/unavailable status or fallback data. |
| MERGE-P1-007 | `scripts/skill_advisor.py:165`, `scripts/init-skill-graph.sh:16`, `handlers/advisor-status.ts:21` | Python shim points to a non-existent nested SQLite path. | Python compatibility mode silently ignores the live SQLite graph and falls back to JSON. |
| MERGE-P1-008 | `scripts/routing-accuracy/gate3-corpus-runner.mjs:3`, `scripts/routing-accuracy/score-routing-corpus.py:72` | Routing accuracy runner imports the Gate 3 classifier from a non-existent path. | Gate 3 and advisor corpus validation cannot run. |

### P2

| ID | File:Line | Finding | Impact |
| --- | --- | --- | --- |
| API-P2-001 | `handlers/advisor-status.ts:82-89` | `trustState.lastLiveAt` is overwritten with check time on live reads. | Repeated reads can make freshness look newer than it is. |
| FRESH-P2-001 | `lib/subprocess.ts:22-31`, `lib/subprocess.ts:157-160`, `lib/subprocess.ts:198`, `lib/subprocess.ts:270-279` | Timeout failures are classified as `SIGNAL_KILLED`; declared `TIMEOUT` code is never emitted. | Timeout telemetry and watchdog logic reason about the wrong failure mode. |
| FRESH-P2-002 | `lib/freshness.ts:124-130`, `lib/freshness.ts:159-165`, `lib/freshness.ts:344-349` | Freshness fingerprints use only `path + mtime + size`. | Same-size rewrites or timestamp collisions can keep stale cache entries alive. |
| DERIVED-P2-001 | `lib/promotion/semantic-lock.ts:17-30` | Semantic lock rejects only positive `semantic_shadow` weights. | Negative malformed values can slip through before schema enforcement. |
| PY-P2-001 | `tests/python/test_skill_advisor.py` plus the shipped bridge surfaces | Python tests do not establish strong parity for the shipped bridge path. | Cross-language contract drift remains easier to miss than it should be. |
| MERGE-P2-001 | `mcp_server/package.json:24`, `mcp_server/vitest.config.ts:17`, `skill-advisor/tests/python/test_skill_advisor.py:30` | Python compatibility tests are broken and not wired into automated test commands. | `npm test` can pass while Python shim tests fail immediately. |
| MERGE-P2-002 | `schemas/advisor-tool-schemas.ts:66`, `handlers/advisor-status.ts:41`, `handlers/advisor-status.ts:62`, `handlers/advisor-status.ts:112` | `advisor_status` has an unbounded synchronous scan surface from caller-controlled `workspaceRoot`. | A large `.opencode/skill` tree can block the Node event loop. |
| MERGE-P2-003 | `README.md:234`, `INSTALL_GUIDE.md:79`, `SET-UP_GUIDE.md:145` | Documented advisor test command fails from the repository root. | Bootstrap/install verification instructions fail even though the suite is runnable. |
| MERGE-P2-004 | `scripts/skill_advisor.py:3207`, `scripts/skill_advisor.py:3227` | `--force-native` falsely reports native unavailable when combined with semantic flags. | Valid native installations can be misreported for an accepted flag combination. |
| MERGE-P2-005 | `scripts/skill_advisor.py:3099`, `scripts/skill_advisor.py:3194` | `--stdin-preferred` can hang in an interactive terminal before falling back to argv. | Manual CLI usage can appear frozen while waiting for EOF. |

## Prioritized Remediation Order

1. Fix public safety contracts first: prompt leakage, path containment for derived key files, and out-of-workspace watcher targets.
2. Repair public API correctness: cache-key options, status freshness, validation gating, and `lastLiveAt` semantics.
3. Repair scorer correctness in `fusion.ts`, `ambiguity.ts`, `derived.ts`, `projection.ts`, and `graph-causal.ts`.
4. Harden freshness publication, explicit scan generation publishing, watcher delete handling, lease ownership, and invalidation fan-out.
5. Close filesystem-safety and rollback-atomicity gaps in derived sync, graph-metadata rollback, and promotion rollback.
6. Fix skill graph edge backfill and corrupt-SQLite fail-open/rebuild behavior.
7. Make Python/native bridge, regression, benchmark, routing accuracy, and documented test commands exercise the same shipped execution surface.

## Verification Notes

- No P0 issue was confirmed from either source scan.
- Targeted Vitest command from the second scan passed: 3 files and 33 tests.
- `skill_advisor.py --health` reproduced degraded JSON fallback caused by the wrong SQLite path.
- Direct Python test execution failed immediately because test pathing points to `tests/scripts`.
- CocoIndex semantic search timed out during the second scan, so that review used direct file reads plus parallel review agents for evidence.
- Historical files already in this packet, especially `remediation-report.md`, describe an earlier review/remediation cycle and were left unchanged.

## Superseded Source

`skill-advisor-bug-scan-findings.md` was merged into this file and removed to avoid split-brain remediation tracking.

## Remediation Log 2026-04-21

| ID | Status | Primary Fix Location | Test Citation |
| --- | --- | --- | --- |
| API-P1-001 | fixed | `skill-advisor/lib/prompt-cache.ts`, `skill-advisor/handlers/advisor-recommend.ts` | `skill-advisor/tests/handlers/advisor-recommend.vitest.ts`; Theme 2 gate: 224 vitest tests, Python 52/52 |
| API-P1-002 | fixed | `skill-advisor/handlers/advisor-status.ts` | `skill-advisor/tests/handlers/advisor-status.vitest.ts`; Theme 2 gate: 224 vitest tests, Python 52/52 |
| API-P1-003 | fixed | `skill-advisor/schemas/advisor-tool-schemas.ts`, `skill-advisor/handlers/advisor-validate.ts`, `skill-advisor/tools/advisor-validate.ts` | `skill-advisor/tests/handlers/advisor-validate.vitest.ts`; Theme 2 gate: 224 vitest tests, Python 52/52 |
| API-P2-001 | fixed | `skill-advisor/lib/freshness/trust-state.ts`, `skill-advisor/handlers/advisor-status.ts` | `skill-advisor/tests/handlers/advisor-status.vitest.ts`; Theme 2 gate: 224 vitest tests, Python 52/52 |
| SCORE-P1-001 | fixed | `skill-advisor/lib/scorer/lanes/derived.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 3 gate: 229 vitest tests, Python 52/52 |
| SCORE-P1-002 | fixed | `skill-advisor/lib/scorer/fusion.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 3 gate: 229 vitest tests, Python 52/52 |
| SCORE-P1-003 | fixed | `skill-advisor/lib/scorer/fusion.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 3 gate: 229 vitest tests, Python 52/52 |
| SCORE-P1-004 | fixed | `skill-advisor/lib/scorer/projection.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 3 gate: 229 vitest tests, Python 52/52 |
| SCORE-P1-005 | fixed | `skill-advisor/lib/scorer/lanes/graph-causal.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 3 gate: 229 vitest tests, Python 52/52 |
| FRESH-P1-001 | fixed | `skill-advisor/lib/daemon/watcher.ts` | `skill-advisor/tests/daemon-freshness-foundation.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| FRESH-P1-002 | fixed | `skill-advisor/lib/freshness/generation.ts` | `skill-advisor/tests/daemon-freshness-foundation.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| FRESH-P1-003 | fixed | `skill-advisor/lib/daemon/lease.ts` | `skill-advisor/tests/daemon-freshness-foundation.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| FRESH-P1-004 | fixed | `skill-advisor/lib/freshness/cache-invalidation.ts` | `skill-advisor/tests/daemon-freshness-foundation.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| FRESH-P2-001 | fixed | `skill-advisor/lib/subprocess.ts` | `skill-advisor/tests/legacy/advisor-subprocess.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| FRESH-P2-002 | fixed | `skill-advisor/lib/freshness.ts` | `skill-advisor/tests/legacy/advisor-freshness.vitest.ts`, `advisor-brief-producer.vitest.ts`, `advisor-privacy.vitest.ts`, `advisor-timing.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| DERIVED-P1-001 | fixed | `skill-advisor/lib/derived/sync.ts` | `skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`; Theme 5 gate: 239 vitest tests, Python 52/52 |
| DERIVED-P1-002 | fixed | `skill-advisor/schemas/skill-derived-v2.ts`, `skill-advisor/lib/scorer/projection.ts`, `skill-advisor/lib/scorer/lanes/derived.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 5 gate: 239 vitest tests, Python 52/52 |
| DERIVED-P1-003 | fixed | `skill-advisor/lib/lifecycle/rollback.ts` | `skill-advisor/tests/lifecycle-derived-metadata.vitest.ts`; Theme 5 gate: 239 vitest tests, Python 52/52 |
| DERIVED-P1-004 | fixed | `skill-advisor/lib/promotion/rollback.ts` | `skill-advisor/tests/promotion/promotion-gates.vitest.ts`; Theme 5 gate: 239 vitest tests, Python 52/52 |
| DERIVED-P2-001 | fixed | `skill-advisor/lib/promotion/semantic-lock.ts` | `skill-advisor/tests/promotion/promotion-gates.vitest.ts`; Theme 5 gate: 239 vitest tests, Python 52/52 |
| PY-P1-001 | fixed | `skill-advisor/scripts/skill_advisor.py` | `skill-advisor/tests/compat/shim.vitest.ts`, `skill-advisor/tests/python/test_skill_advisor.py`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| PY-P1-002 | fixed | `skill-advisor/scripts/skill_advisor_bench.py` | `skill-advisor/tests/python/test_skill_advisor.py`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| PY-P1-003 | fixed | `skill-advisor/scripts/skill_advisor_regression.py` | `skill-advisor/tests/python/test_skill_advisor.py`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| PY-P1-004 | fixed | `skill-advisor/scripts/skill_graph_compiler.py` | `skill-advisor/tests/python/test_skill_advisor.py`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| PY-P2-001 | fixed | `skill-advisor/tests/python/test_skill_advisor.py`, `skill-advisor/tests/compat/shim.vitest.ts` | `skill-advisor/tests/compat/python-compat.vitest.ts`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P1-001 | fixed, committed in Theme 1 | `skill-advisor/handlers/advisor-recommend.ts`, `context-server.ts`, `lib/errors/core.ts` | Theme 1 committed at `3768b59e0` |
| MERGE-P1-002 | fixed, committed in Theme 1 | `skill-advisor/lib/derived/extract.ts`, `skill-advisor/lib/derived/provenance.ts` | Theme 1 committed at `3768b59e0` |
| MERGE-P1-003 | fixed, committed in Theme 1 | `skill-advisor/lib/daemon/watcher.ts` | Theme 1 committed at `3768b59e0` |
| MERGE-P1-004 | fixed | `handlers/skill-graph/scan.ts`, `context-server.ts`, `skill-advisor/lib/freshness/generation.ts`, `skill-advisor/lib/freshness/cache-invalidation.ts` | `skill-advisor/tests/daemon-freshness-foundation.vitest.ts`; Theme 4 gate: 233 vitest tests, Python 52/52 |
| MERGE-P1-005 | fixed | `lib/skill-graph/skill-graph-db.ts` | `skill-advisor/tests/skill-graph-db.vitest.ts`; Theme 6 gate: 241 vitest tests, Python 52/52 |
| MERGE-P1-006 | fixed | `skill-advisor/lib/scorer/projection.ts` | `skill-advisor/tests/scorer/native-scorer.vitest.ts`; Theme 6 gate: 241 vitest tests, Python 52/52 |
| MERGE-P1-007 | fixed | `skill-advisor/scripts/skill_advisor.py`; `init-skill-graph.sh` and `advisor-status.ts` were already correct | `skill-advisor/tests/python/test_skill_advisor.py`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P1-008 | fixed / legacy path superseded | Active file `skill-advisor/scripts/routing-accuracy/gate3-corpus-runner.mjs`; legacy `.opencode/skill/system-spec-kit/scripts/routing-accuracy/` path absent | Direct runner smoke check plus Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P2-001 | fixed | `skill-advisor/tests/python/test_skill_advisor.py`, `skill-advisor/tests/compat/python-compat.vitest.ts` | `skill-advisor/tests/compat/python-compat.vitest.ts`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P2-002 | fixed | `skill-advisor/schemas/advisor-tool-schemas.ts`, `skill-advisor/handlers/advisor-status.ts` | `skill-advisor/tests/handlers/advisor-status.vitest.ts`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P2-003 | fixed | `skill-advisor/README.md`, `skill-advisor/INSTALL_GUIDE.md`, `skill-advisor/SET-UP_GUIDE.md` | Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P2-004 | fixed | `skill-advisor/scripts/skill_advisor.py` | `skill-advisor/tests/compat/shim.vitest.ts`; Theme 7 gate: 245 vitest tests, Python 104/104 |
| MERGE-P2-005 | fixed | `skill-advisor/scripts/skill_advisor.py` | `skill-advisor/tests/python/test_skill_advisor.py`; Theme 7 gate: 245 vitest tests, Python 104/104 |
