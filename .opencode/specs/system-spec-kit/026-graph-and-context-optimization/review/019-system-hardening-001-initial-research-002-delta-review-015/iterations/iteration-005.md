# Iteration 005

## Focus

Resolve the 13 residual `UNVERIFIED` findings from iterations 001-004, then continue the P2 batch on test/schema/registration drift around `skill_graph_*`, `session_resume`, `session_bootstrap`, and the coverage-graph tool surface.

## Actions Taken

1. Re-read `iteration-004.md`, `deep-review-state.jsonl`, and the iteration-005 prompt pack to preserve the prior tally, open questions, and the exact `UNVERIFIED` backlog.
2. Re-scanned the 015 source report at `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/015-deep-review-and-remediation/review-report.md` for the unresolved anchors: `discover_graph_metadata`, `get_cached_skill_records`, `health_check`, `skill_graph_scan`, `resolveDatabasePaths`, `session_resume(minimal)`, `session_bootstrap`, `deep_loop_graph_*`, and the trigger-quality coverage complaint.
3. Verified the current runtime surfaces in:
   - `.opencode/skill/skill-advisor/scripts/skill_graph_compiler.py`
   - `.opencode/skill/skill-advisor/scripts/skill_advisor.py`
   - `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py`
   - `.opencode/skill/system-spec-kit/mcp_server/core/config.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/skill-graph/scan.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts`
4. Verified the current regression net in:
   - `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/session-bootstrap.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/session-resume-auth.vitest.ts`
   - `.opencode/skill/skill-advisor/tests/test_skill_advisor.py`

## UNVERIFIED Resolved

- `11` prior `UNVERIFIED` items moved out of evidence limbo this iteration.
- `5` moved to `ADDRESSED`:
  - corrupt `graph-metadata.json` now fails closed in `discover_graph_metadata()` (`skill_graph_compiler.py:50-80`)
  - `skill_graph_scan` now rejects workspace escapes (`handlers/skill-graph/scan.ts:23-35`)
  - `session_bootstrap` now marks malformed child payload extraction as `_extractionFailed` and records bootstrap completeness as `partial` instead of silently reporting `full` (`handlers/session-bootstrap.ts:71-91`, `:240-243`)
  - `skill_graph_*` now has dedicated schema acceptance/rejection coverage (`tests/tool-input-schema.vitest.ts:581-610`)
  - `skill-advisor` now has executable test coverage for cached skill records and topology-warning health surfacing (`tests/test_skill_advisor.py:216-236`, `:509-536`)
- `4` moved to `SUPERSEDED`:
  - the older "coverage-graph tools are dead/unregistered" and adjacent archived-only runtime-surface complaints no longer land on the shipping surface now that `deep_loop_graph_*` is actively registered in the dispatcher (`tools/index.ts:25-46`)
  - the associated P2 complaints tied to that retired registration gap now point at replaced primitives rather than a live missing tool surface
- `2` moved to `STILL_OPEN`:
  - `get_cached_skill_records()` still drops unreadable `SKILL.md` files while `health_check()` status does not degrade on cache-health alone (`skill_advisor_runtime.py:247-268`, `skill_advisor.py:2470-2488`)
  - `session_resume(minimal)` still serializes and returns the full `memory` payload instead of omitting it (`handlers/session-resume.ts:547-637`)
- `2` remain `UNVERIFIED` with stronger rationale:
  - the `extractSpecTitle()` silent-fallback complaint still lacks a stable current-main reproduction chain from the 015 anchor to a live operator-facing failure, so the evidence is still too thin to call it either live or retired
  - the `session-prime` startup-brief regression-hiding complaint is still transport/runtime specific, and this iteration did not reopen the runtime-specific hook path needed to prove the current failure mode

## Findings Batch-Audited

- `1 x P1 / discover_graph_metadata fails open on corrupt graph metadata`  
  Classification: `ADDRESSED`  
  Current-main evidence: `discover_graph_metadata()` now accumulates corrupt/unreadable `graph-metadata.json` files and raises `RuntimeError` instead of silently truncating the graph (`skill_graph_compiler.py:50-80`).

- `1 x P1 / skill_graph_scan workspace escape`  
  Classification: `ADDRESSED`  
  Current-main evidence: the handler resolves `skillsRoot` under `cwd` and rejects scans outside the workspace (`handlers/skill-graph/scan.ts:28-35`).

- `1 x P1 / get_cached_skill_records silently drops unreadable SKILL.md and health_check can still report ok`  
  Classification: `STILL_OPEN`  
  Current-main evidence: `get_cached_skill_records()` still drops parse failures into `skipped` and continues (`skill_advisor_runtime.py:247-268`), while `health_check()` only degrades on `{graph missing, topology warnings, inventory mismatch}` and not on cache-health alone (`skill_advisor.py:2470-2488`).

- `1 x P1 / session_resume(minimal) does not honor the published minimal-mode contract`  
  Classification: `STILL_OPEN`  
  Current-main evidence: the minimal branch computes `sessionQuality`, but the handler still adds `memory-resume` to the payload sections and returns `memory: memoryResult` in the result object (`handlers/session-resume.ts:547-637`).

- `2 x P1 / resolveDatabasePaths residual boundary defects`  
  Classification: `STILL_OPEN`  
  Current-main evidence: the function comment says it should use `realpathSync`, but the actual guard compares `path.resolve(databaseDir)` only (`core/config.ts:54-79`), and multiple server surfaces still import the module-level `DATABASE_DIR` / `DATABASE_PATH` constants initialized at import time (`core/config.ts:83-86`, `context-server.ts:23-24`, `memory-ingest.ts:13`, `lib/analytics/session-analytics-db.ts:12`, `lib/skill-graph/skill-graph-db.ts:12`, `lib/coverage-graph/coverage-graph-db.ts:11`, `lib/code-graph/code-graph-db.ts:11`).

- `2 x P1 / skill-advisor source graph metadata loaders silently skip corrupt metadata`  
  Classification: `STILL_OPEN`  
  Current-main evidence: both `_load_source_graph_signal_map()` and `_load_source_conflict_declarations()` still swallow unreadable/corrupt `graph-metadata.json` and continue without surfacing degraded-routing state (`skill_advisor.py:162-170`, `:208-216`).

- `2 x P2 / skill_graph schema-dispatcher coverage gap`  
  Classification: `ADDRESSED`  
  Current-main evidence: `tool-input-schema.vitest.ts` now covers `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, and `skill_graph_validate` acceptance/rejection at the public/runtime contract boundary (`tests/tool-input-schema.vitest.ts:581-610`), and the runtime dispatch surface is centralized in `tools/skill-graph-tools.ts`.

- `2 x P2 / skill-advisor automated coverage absence / topology-warning health visibility`  
  Classification: `ADDRESSED`  
  Current-main evidence: `tests/test_skill_advisor.py` now exercises cached record extraction and asserts that `health_check()` exposes `topology_warnings` while degrading status when warnings are present (`tests/test_skill_advisor.py:216-236`, `:509-536`).

- `3 x P2 / session_bootstrap malformed child payload / false-full completeness drift`  
  Classification: `ADDRESSED`  
  Current-main evidence: `extractData()` now returns an error envelope with `_extractionFailed` on malformed child payloads, and completeness is downgraded to `partial` when extraction fails (`handlers/session-bootstrap.ts:71-91`, `:240-243`).

- `7 x P2 / deep_loop_graph runtime-dead / unregistered-surface / archived-only coverage complaints`  
  Classification: `SUPERSEDED`  
  Current-main evidence: `deep_loop_graph_upsert`, `deep_loop_graph_query`, `deep_loop_graph_status`, and `deep_loop_graph_convergence` are now live dispatcher entries (`tools/index.ts:25-46`) with concrete handlers under `handlers/coverage-graph/`. The original complaint targeted an older missing-registration surface, which is no longer the shipping contract.

- `1 x P2 / whitespace-only trigger phrases count as real trigger coverage`  
  Classification: `STILL_OPEN`  
  Current-main evidence: `scoreTriggerQuality()` still uses `triggerPhrases.length` directly and does not trim/filter whitespace-only phrases before awarding credit (`save-quality-gate.ts:493-497`).

- `1 x P2 / deep_loop_graph query collapses distinct query modes into the same implementation branch`  
  Classification: `STILL_OPEN`  
  Current-main evidence: `handleCoverageGraphQuery()` still routes both `uncovered_questions` and `coverage_gaps` through `findCoverageGaps(ns)`, so the documented query modes are not meaningfully separated on the current shipping handler (`handlers/coverage-graph/query.ts:57-77`).

## Cumulative Tally

- Findings audited in this iteration: `24`
- Cumulative audited after iteration 005: `120 / 242`
- Cumulative tally: `ADDRESSED=29`, `STILL_OPEN=8`, `SUPERSEDED=81`, `UNVERIFIED=2`
- Remaining unaudited findings after this pass: `122`

## STILL_OPEN Expanded

- `2 x P1 / resolveDatabasePaths residual boundary hardening`  
  Reproduction evidence: `core/config.ts:54-79`, `core/config.ts:83-86`, `context-server.ts:23-24`, `memory-ingest.ts:13`  
  Proposed remediation cluster: `DB path boundary and late-override unification`

- `2 x P1 / skill-advisor source metadata fail-open`  
  Reproduction evidence: `skill_advisor.py:162-170`, `skill_advisor.py:208-216`  
  Proposed remediation cluster: `advisor degraded-source diagnostics`

- `1 x P1 / cache-health false-green in skill-advisor`  
  Reproduction evidence: `skill_advisor_runtime.py:247-268`, `skill_advisor.py:2470-2488`  
  Proposed remediation cluster: `advisor cache integrity and health state`

- `1 x P1 / session_resume(minimal) contract drift`  
  Reproduction evidence: `handlers/session-resume.ts:547-637`  
  Proposed remediation cluster: `resume minimal-mode contract enforcement`

- `1 x P2 / whitespace trigger phrases score as coverage`  
  Reproduction evidence: `save-quality-gate.ts:493-497`  
  Proposed remediation cluster: `trigger-quality normalization`

- `1 x P2 / coverage-graph query semantics collapse`  
  Reproduction evidence: `handlers/coverage-graph/query.ts:57-77`  
  Proposed remediation cluster: `coverage-graph query-mode separation`

## Questions Answered

- `Q3` moved materially forward: the remaining P1 backlog is now mostly concrete and narrow, centered on path-boundary hardening, advisor degraded-state surfacing, and the `session_resume(minimal)` contract.
- `Q4` is sharper now: a large slice of P2 noise belongs to retired registration/coverage surfaces, while the live P2 backlog is down to small correctness/quality gaps (`scoreTriggerQuality`, coverage-query semantics).
- `Q5` is now actionable: the residual restart backlog is an eight-finding set with current file:line evidence and remediation clusters, instead of a mixed evidence-quality bucket.

## Next Focus

Continue the P2 sweep on the remaining documentation-drift, logging/telemetry, and code-smell/readability complaints, but prioritize closing the final two `UNVERIFIED` items first so the residual backlog is fully evidence-backed before the last five iterations.
