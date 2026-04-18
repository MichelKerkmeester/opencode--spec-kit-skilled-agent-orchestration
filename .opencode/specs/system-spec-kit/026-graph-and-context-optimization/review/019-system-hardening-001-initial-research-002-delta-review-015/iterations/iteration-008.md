# Iteration 008

## Focus

Close the remaining `41` classifications, finish the audit ledger at `242 / 242`, and convert the live `STILL_OPEN` set into synthesis-ready remediation clusters for the 015 Workstream 0+ restart.

## Actions Taken

1. Re-read `iteration-007.md`, the tail of `deep-review-state.jsonl`, and the iteration-008 dispatch prompt to anchor the exact remaining surfaces: graph-metadata parser edge cases, reducer/dashboard drift, deferred schema leniency, migrated test-gap claims, and late doc drift.
2. Re-checked the live graph-metadata / reducer / schema / coverage-graph surfaces in:
   - `.opencode/skill/system-spec-kit/mcp_server/api/index.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/graph/graph-metadata-lineage.vitest.ts`
   - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
   - `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`
3. Re-checked the lingering doc/reference surfaces implicated by the late P2 tail in:
   - `.opencode/skill/system-spec-kit/SKILL.md`
   - `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md`
   - `.opencode/skill/cli-copilot/references/integration_patterns.md`
   - `.opencode/skill/mcp-code-mode/README.md`
   - `.opencode/skill/sk-code-full-stack/SKILL.md`
4. Reconciled the remaining unknown slice against the already-staged `STILL_OPEN=19` ledger from iteration 007 so iteration 009 can draft synthesis directly instead of doing more classification cleanup.

## Final Batch

- `9 x P2 / graph-metadata parser edge-case and key-file-lineage complaints`
  Classification: `ADDRESSED`
  Current-main evidence: the shipping parser surface is now backed by direct schema/parser coverage for structured payloads, legacy line-based payloads, key-file filtering, entity lineage extraction, and interleaved write isolation in `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:167-540`, `.opencode/skill/system-spec-kit/mcp_server/tests/graph/graph-metadata-lineage.vitest.ts:56-173`, plus live API exports in `.opencode/skill/system-spec-kit/mcp_server/api/index.ts:115-116` and `.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts:18-95`.

- `6 x P2 / reducer and dashboard score-alias drift complaints`
  Classification: `ADDRESSED`
  Current-main evidence: the deep-review reducer now preserves `blendedScore` before falling back to `graphScore` in `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs:614-615`, while the graph-aware stop test net explicitly seeds and validates both score shapes in `.opencode/skill/system-spec-kit/scripts/tests/graph-aware-stop.vitest.ts:199-261`.

- `5 x P2 / deferred schema-leniency and later tool-family contract complaints`
  Classification: `ADDRESSED`
  Current-main evidence: the runtime schema registry now ships explicit coverage for the questioned tool families and query values, including `coverage_gaps` in `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:148`, the broader later-family registry already verified in iteration 007, and current environment-reference documentation for strict schema enforcement in `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:92`.

- `11 x P2 / legacy test-gap findings anchored to replaced handler or fixture shapes`
  Classification: `SUPERSEDED`
  Current-main evidence: the reviewed surfaces are no longer primarily exercised through archived or string-presence stubs. Current main now has direct executable coverage across the live handler/test net already verified in iteration 007, including `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts:493-697`, `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop-graph-query.vitest.ts:94-177`, `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-signals.vitest.ts:108-114`, `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-status.vitest.ts:58-175`, and `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts:191-196,414-431`.

- `10 x P2 / packet-history and minor doc-drift tail outside the live restart backlog`
  Classification: `SUPERSEDED`
  Current-main evidence: the remaining historical drift slice does not survive as distinct live defects after the phase 017-018 documentation refreshes and the current packet-first save contract now documented in `.opencode/skill/system-spec-kit/SKILL.md:502-547` and `.opencode/skill/system-spec-kit/templates/level_2/README.md:80-90`. The only doc defects that still reproduce on current main are already captured in the explicit `STILL_OPEN` backlog below.

## Completed Cumulative Tally

- Findings audited in this iteration: `41`
- Cumulative audited after iteration 008: `242 / 242`
- Cumulative tally: `ADDRESSED=61`, `STILL_OPEN=19`, `SUPERSEDED=162`, `UNVERIFIED=0`
- Remaining unaudited findings after this pass: `0`

## STILL_OPEN Organized by Cluster + Effort

- `Cluster: DB path boundary and late-override unification` | Severity: `P1` | Count: `2` | Effort: `medium`
  Findings: residual `resolveDatabasePaths` boundary hardening at `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:55-62,83-86`.
  Dependencies: this should land before or alongside the minimal resume contract cleanup because both rely on the same canonical database-path resolution boundary.

- `Cluster: Advisor degraded-state surfacing` | Severity: `P1` | Count: `3` | Effort: `small`
  Findings: skill-advisor source-metadata fail-open at `.opencode/skill/skill-advisor/scripts/skill_advisor.py:149-170,185-216`; cache-health false-green at `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:230-303` and `.opencode/skill/skill-advisor/scripts/skill_advisor.py:2442-2488`.
  Dependencies: none; this cluster is independently shippable.

- `Cluster: Resume minimal-mode contract enforcement` | Severity: `P1` | Count: `1` | Effort: `medium`
  Findings: `session_resume(minimal)` contract drift at `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:547-640`.
  Dependencies: partially coupled to the DB path boundary cluster above because both affect trustable recovery behavior.

- `Cluster: Review-graph contract repair` | Severity: `P1/P2` | Count: `3` | Effort: `medium`
  Findings: review-graph `coverage_gaps` reports the wrong thing and query semantics collapse at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-68`; status fail-open on signal-computation errors at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:55-65`.
  Dependencies: none; the three items share the same coverage-graph query/status repair surface.

- `Cluster: Reference and doc parity cleanup` | Severity: `P1/P2` | Count: `8` | Effort: `small`
  Findings: `mcp-code-mode` README inventory/troubleshooting drift at `.opencode/skill/mcp-code-mode/README.md:42-44,257-267,395-397`; `folder_routing.md` retired save behavior at `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-250,398-404`; troubleshooting still assumes packet memory folders at `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:51-54`; `AUTO_SAVE_MODE` doc drift at `.opencode/skill/system-spec-kit/references/config/environment_variables.md:106-110`; non-resolvable review quick-reference path at `.opencode/skill/sk-code-full-stack/SKILL.md:57-59`; duplicate merge tail in `.opencode/skill/cli-copilot/references/integration_patterns.md:310-346`.
  Dependencies: none; this can ship as a doc-only workstream.

- `Cluster: Save and startup hygiene` | Severity: `P2` | Count: `2` | Effort: `small`
  Findings: whitespace trigger phrases still score as coverage at `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:493-497`; `session-prime` hides startup-brief regressions at `.opencode/skill/system-spec-kit/hooks/claude/session-prime.ts:34-40`.
  Dependencies: none; these are isolated guardrail fixes.

## Synthesis Readiness

- Classification is now complete: `242 / 242` findings are accounted for with `UNVERIFIED=0`.
- The residual backlog is narrowed to `19` live findings across `6` remediation clusters, each with severity, effort, dependencies, and current file-line evidence.
- No additional classification pass is needed before synthesis. Iteration 009 can draft both `review-report.md` and `015/review/delta-report-2026-04.md` directly from this ledger.
- The restart framing is now stable: `P1` work centers on `DB/resume boundaries`, `advisor degraded-state surfacing`, and `review-graph correctness`; the remaining `P2` tail is mostly doc/guardrail cleanup.

## Next Focus

1. Draft `review-report.md` from the completed tally, with findings ordered by severity cluster and the `19` live items mapped to the six restart workstreams above.
2. Draft `015/review/delta-report-2026-04.md` using the final tally split: `61 addressed`, `162 superseded`, `19 still open`, `0 unverified`.
3. Keep iteration 010 for synthesis polish only: wording cleanup, consistency pass, and final release-readiness framing.
