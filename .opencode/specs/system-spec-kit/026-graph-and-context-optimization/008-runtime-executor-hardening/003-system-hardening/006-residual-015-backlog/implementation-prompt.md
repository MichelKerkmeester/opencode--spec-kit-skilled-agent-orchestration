# Implementation Dispatch: 015 Residual Backlog

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast` per autonomous-completion directive.

**Gate 3 pre-answered**: Option **E** (phase folder). All file writes pre-authorized. Autonomous run, no gates.

## SCOPE

Read first:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/006-residual-015-backlog/{spec.md,plan.md,tasks.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-pt-01/review-report.md`

Implement 19 residuals across 6 clusters in 4 waves:

**W0+A — C1 DB boundary + C3 resume minimal:**
- Fix realpath escape enforcement in `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:55-62`
- Fix late-env-override drift at `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:83-86`
- Fix `session_resume(minimal)` payload contract at `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:547-640`
- Regression tests per finding

**W0+B — C4 review-graph:**
- Fix `coverage_gaps` semantics at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/query.ts:67-68`
- Fix `coverage_gaps` / `uncovered_questions` collapse at same location
- Fix fail-open at `.opencode/skill/system-spec-kit/mcp_server/handlers/coverage-graph/status.ts:55-65`
- Regression tests

**W0+C — C2 advisor degraded-state:**
- Fix corrupt source-metadata fail-open at `.opencode/skill/skill-advisor/scripts/skill_advisor.py:149-170`
- Fix continuation-record degraded visibility at `.opencode/skill/skill-advisor/scripts/skill_advisor.py:185-216`
- Fix cache-health false-green at `.opencode/skill/skill-advisor/scripts/skill_advisor_runtime.py:230-303` + `skill_advisor.py:2442-2488`
- Regression tests

**W0+D — C5 docs + C6 hygiene:**
- Update `.opencode/skill/mcp-code-mode/README.md:42-44, 257-267, 395-397` (inventory + surface)
- Update `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:244-250` (retired memory contract)
- Fix `.opencode/skill/system-spec-kit/references/structure/folder_routing.md:398-404` (moderate-alignment example)
- Update `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md:51-54`
- Document `AUTO_SAVE_MODE` in `.opencode/skill/system-spec-kit/references/config/environment_variables.md:106-110`
- Fix `.opencode/skill/sk-code-full-stack/SKILL.md:57-59` path
- Fix `.opencode/skill/cli-copilot/references/integration_patterns.md:310-346` duplicate merge tail
- Fix whitespace-only trigger phrases in `.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:493-497`
- Fix session-prime regression hiding at `.opencode/skill/system-spec-kit/mcp_server/hooks/claude/session-prime.ts:34-40`
- Run `validate.sh --strict` to verify doc updates

## CONSTRAINTS

- Run tests after each Wave
- Self-correct up to 3 attempts on failure, then HALT
- Mark `tasks.md` items `[x]` with evidence
- Update checklist.md + implementation-summary.md
- DO NOT git commit or git push (orchestrator commits at end)

## OUTPUT EXPECTATION

All 19 residuals closed. Regression green per cluster. Spec docs updated.
