# Iteration 007

## Focus

Finish the late-stage classification push by batch-auditing the remaining P2-heavy fixture/doc drift tail, consolidate the live `STILL_OPEN` backlog into restart-ready workstreams, and leave iteration 008 with either a short final classification sweep or direct synthesis.

## Actions Taken

1. Re-read `iteration-006.md`, `deep-review-state.jsonl`, and the 015 source report sections covering `3.6 Test Quality Issues`, `3.7 Stale References`, and the workstream summary.
2. Re-checked the current reducer/schema/runtime hardening surfaces in:
   - `.opencode/skill/sk-deep-review/scripts/reduce-state.cjs`
   - `.opencode/skill/sk-deep-research/scripts/reduce-state.cjs`
   - `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts`
3. Re-checked the current live handler/test net for the old coverage-graph + tool-family fixture complaints in:
   - `.opencode/skill/system-spec-kit/mcp_server/tests/tool-input-schema.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/deep-loop-graph-query.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-signals.vitest.ts`
   - `.opencode/skill/system-spec-kit/mcp_server/tests/coverage-graph-status.vitest.ts`
   - `.opencode/skill/system-spec-kit/scripts/tests/session-isolation.vitest.ts`
4. Re-checked the remaining stale-reference/doc drift surfaces that still looked plausibly live in:
   - `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md`
   - `.opencode/skill/system-spec-kit/references/config/environment_variables.md`
   - `.opencode/skill/sk-code-full-stack/SKILL.md`
   - `.opencode/skill/cli-copilot/references/integration_patterns.md`
   - `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts`

## Findings Batch-Audited

- `18 x P2 / legacy coverage-graph + tool-family test-fixture drift`
  Classification: `SUPERSEDED`
  Current-main evidence: the old "archived stubs / string-presence / no live handler tests" complaint class is no longer representative of the shipping surface. Current main now has direct executable coverage for the shipped handlers and later tool families in `tool-input-schema.vitest.ts:493-697`, `deep-loop-graph-query.vitest.ts:94-177`, `coverage-graph-signals.vitest.ts:108-114`, `coverage-graph-status.vitest.ts:58-175`, and `session-isolation.vitest.ts:191-196,414-431`.

- `8 x P2 / generic pre-016 smoke-test harness complaints tied to replaced handler shapes`
  Classification: `SUPERSEDED`
  Current-main evidence: the 015 report's fixture-drift tail repeatedly assumes the reviewed slice still relies on archived or string-only coverage. In the current repo, the reviewed graph/tool surfaces are exercised through the real exported handlers and schema validators rather than the historical stubs the report anchored to (`mcp_server/tests/deep-loop-graph-query.vitest.ts:94-177`, `mcp_server/tests/coverage-graph-status.vitest.ts:58-175`, `mcp_server/tests/tool-input-schema.vitest.ts:493-697`).

- `6 x P2 / packet-history doc/comment drift outside the 015 restart surface`
  Classification: `SUPERSEDED`
  Current-main evidence: this tail lands on closed packet-history docs under prior `009/010/012/014` children rather than the live 015 restart scope. For the restart backlog, these are no longer first-order system-hardening defects; they belong to packet-history cleanup, not Workstream 0+ runtime follow-on.

- `2 x reducer output stability complaints`
  Classification: `ADDRESSED`
  Current-main evidence: the deep-review reducer now explicitly supports both the old section schema and the live operational schema via the `Focus/Dispatcher`, `Findings/Findings - New`, `Ruled Out/Confirmed-Clean`, and `Next Focus` fallbacks (`sk-deep-review/scripts/reduce-state.cjs:224-233`), and it preserves `blendedScore` before falling back to `graphScore` (`sk-deep-review/scripts/reduce-state.cjs:614-615`).

- `2 x schema/runtime parity complaints for later MCP tool families`
  Classification: `ADDRESSED`
  Current-main evidence: the runtime input-schema registry now includes `code_graph_*`, `skill_graph_*`, `ccc_*`, and `deep_loop_graph_*` entries plus allowed-key maps in the shipped schema file (`mcp_server/schemas/tool-input-schemas.ts:603-617`, `659-673`), closing the older "published schema but no runtime contract" complaint class for these tool families.

- `2 x error-surface normalization / handler-error hardening complaints`
  Classification: `ADDRESSED`
  Current-main evidence: the current MCP error surface is centralized around `ERROR_CODES`, tool-default error-code mapping, `userFriendlyError()`, and `createErrorWithHint()` (`lib/errors/core.ts:52-65`, `134-180`, `351-386`; `lib/errors/recovery-hints.ts:45-130`), which is materially stronger than the earlier ad hoc error-message paths flagged in the 015 tail.

- `1 x P2 / handleCoverageGraphStatus still fail-opens on signal computation errors`
  Classification: `STILL_OPEN`
  Current-main evidence: `handleCoverageGraphStatus()` still catches signal-computation failures and returns success with `signals = null` / `momentum = null` instead of surfacing a degraded or failed status (`handlers/coverage-graph/status.ts:55-65`).

- `1 x P2 / troubleshooting.md still assumes packet-local memory directories are current`
  Classification: `STILL_OPEN`
  Current-main evidence: the quick-fix table still tells operators to create `specs/###-feature/memory/` directories for a missing spec folder (`references/debugging/troubleshooting.md:51-54`), which conflicts with the canonical packet-first save contract already used elsewhere.

- `1 x P2 / environment_variables.md still narrows AUTO_SAVE_MODE to hooks only`
  Classification: `STILL_OPEN`
  Current-main evidence: the environment reference still documents `AUTO_SAVE_MODE` as "Skip alignment check in hooks" (`references/config/environment_variables.md:106-110`), which is narrower than the current folder auto-detect / prompt-suppression reality already called out by the 015 report.

- `1 x P2 / sk-code-full-stack points at a non-resolvable review quick-reference path`
  Classification: `STILL_OPEN`
  Current-main evidence: `sk-code-full-stack/SKILL.md` still references `sk-code-review/references/quick_reference.md` as though it were a local relative path (`sk-code-full-stack/SKILL.md:57-59`), but the actual file lives in a sibling skill tree and the reference is not directly resolvable from this skill root.

- `1 x P2 / cli-copilot integration_patterns.md still contains a duplicate merge tail`
  Classification: `STILL_OPEN`
  Current-main evidence: the file cleanly closes one `CROSS-VALIDATION` / `ANTI-PATTERNS` pair and then immediately restarts the same sections at `integration_patterns.md:310-346`, leaving a live duplicate tail artifact.

## Cumulative Tally

- Findings audited in this iteration: `43`
- Cumulative audited after iteration 007: `201 / 242`
- Cumulative tally: `ADDRESSED=41`, `STILL_OPEN=19`, `SUPERSEDED=141`, `UNVERIFIED=0`
- Remaining unaudited findings after this pass: `41`

## STILL_OPEN Consolidated

- `2 x P1 / resolveDatabasePaths residual boundary hardening`
  Evidence: `mcp_server/core/config.ts:55-62`, `mcp_server/core/config.ts:83-86`
  Proposed cluster: `DB path boundary and late-override unification`
  Effort: `medium (1-3 days)`

- `2 x P1 / skill-advisor source metadata fail-open`
  Evidence: `skill_advisor.py:149-170`, `skill_advisor.py:185-216`
  Proposed cluster: `advisor degraded-source diagnostics`
  Effort: `small (<1 day)`

- `1 x P1 / cache-health false-green in skill-advisor`
  Evidence: `skill_advisor_runtime.py:230-303`, `skill_advisor.py:2442-2488`
  Proposed cluster: `advisor cache integrity and health state`
  Effort: `small (<1 day)`

- `1 x P1 / session_resume(minimal) contract drift`
  Evidence: `mcp_server/handlers/session-resume.ts:547-640`
  Proposed cluster: `resume minimal-mode contract enforcement`
  Effort: `medium (1-3 days)`

- `1 x P2 / whitespace trigger phrases score as coverage`
  Evidence: `mcp_server/lib/validation/save-quality-gate.ts:493-497`
  Proposed cluster: `trigger-quality normalization`
  Effort: `small (<1 day)`

- `1 x P2 / coverage-graph query semantics collapse`
  Evidence: `mcp_server/handlers/coverage-graph/query.ts:67-68`
  Proposed cluster: `coverage-graph query-mode separation`
  Effort: `medium (1-3 days)`

- `1 x P1 / coverage_gaps reports the wrong thing for review graphs`
  Evidence: `mcp_server/handlers/coverage-graph/query.ts:67-68`
  Proposed cluster: `review-graph coverage-gaps contract repair`
  Effort: `medium (1-3 days)`

- `1 x P2 / session-prime hides startup-brief regressions`
  Evidence: `hooks/claude/session-prime.ts:34-40`
  Proposed cluster: `startup-brief degraded-state logging`
  Effort: `small (<1 day)`

- `2 x P1/P2 / mcp-code-mode README parity drift`
  Evidence: `.opencode/skill/mcp-code-mode/README.md:42-44`, `.opencode/skill/mcp-code-mode/README.md:257-267`, `.opencode/skill/mcp-code-mode/README.md:395-397`
  Proposed cluster: `code-mode inventory and troubleshooting doc sync`
  Effort: `small (<1 day)`

- `2 x P1/P2 / folder_routing.md still documents retired/incorrect save behavior`
  Evidence: `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-250`, `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:398-404`
  Proposed cluster: `folder-routing canonical save path and scoring example sync`
  Effort: `small (<1 day)`

- `1 x P2 / handleCoverageGraphStatus fail-opens on signal computation errors`
  Evidence: `mcp_server/handlers/coverage-graph/status.ts:55-65`
  Proposed cluster: `coverage-graph degraded-status propagation`
  Effort: `small (<1 day)`

- `1 x P2 / troubleshooting.md still assumes packet memory folders`
  Evidence: `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:51-54`
  Proposed cluster: `debug-reference canonical save contract sync`
  Effort: `small (<1 day)`

- `1 x P2 / environment_variables.md narrows AUTO_SAVE_MODE to hooks only`
  Evidence: `.opencode/skill/system-spec-kit/references/config/environment_variables.md:106-110`
  Proposed cluster: `env-reference autosave semantics sync`
  Effort: `small (<1 day)`

- `1 x P2 / sk-code-full-stack review quick-reference path is non-resolvable`
  Evidence: `.opencode/skill/sk-code-full-stack/SKILL.md:57-59`
  Proposed cluster: `skill cross-reference path repair`
  Effort: `small (<1 day)`

- `1 x P2 / cli-copilot integration_patterns duplicate merge tail`
  Evidence: `.opencode/skill/cli-copilot/references/integration_patterns.md:310-346`
  Proposed cluster: `copilot reference dedupe cleanup`
  Effort: `small (<1 day)`

## Next Focus

Iteration 008 can now go one of two ways:

1. If the remaining `41` findings are mostly packet-history/doc noise like this batch, do a short final classification sweep and then move directly into synthesis.
2. If the remaining tail hides any live runtime defects, limit the final sweep to those and keep the synthesis backlog anchored on the `19` evidence-backed `STILL_OPEN` findings above.
3. Pre-stage synthesis around five restart buckets: `DB/resume boundaries`, `coverage-graph semantics`, `advisor degraded-state surfacing`, `startup/save-quality hardening`, and `reference/doc parity cleanup`.
