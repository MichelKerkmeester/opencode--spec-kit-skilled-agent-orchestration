# Implementation Dispatch: Template/Validator Contract Alignment

Dispatched via `codex exec gpt-5.4 --reasoning-effort=high --service-tier=fast` per autonomous-completion directive.

**Gate 3 pre-answered**: Option **E** (phase folder). All file writes pre-authorized. Autonomous run, no gates.

## SCOPE

Read first:
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-runtime-executor-hardening/003-system-hardening/007-template-validator-contract-alignment/{spec.md,plan.md,tasks.md}`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/review/019-system-hardening-001-initial-research-006-template-validator-audit/review-report.md`

Implement 5 ranked proposals:

**Rank 1 — Rule registry canonicalization:**
- Create `.opencode/skill/system-spec-kit/scripts/lib/validator-registry.{ts,json}` as single source of truth: `[{rule_id, script_path, severity, description}, ...]`
- Refactor `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` dispatch loop to read registry (all 17 published + 7 live-but-unpublished rules)
- Generate `show_help()` output from registry (so dispatch + help + severity always agree)
- Verify: same rule set dispatched, same output format, no regression

**Rank 2 — Semantic non-empty frontmatter validation:**
- Update `.opencode/skill/system-spec-kit/scripts/rules/check-frontmatter.sh:33-60` to reject empty `title`, `description`, `trigger_phrases`, `importance_tier`, `contextType`
- Update `.opencode/skill/system-spec-kit/mcp_server/lib/validation/spec-doc-structure.ts:518-567` `requiredPairs` to treat empty-string as missing
- Add grandfathering allowlist with cutoff timestamp
- Synthetic fixtures pass/fail as expected

**Rank 3 — Anchor parity:**
- Update `.opencode/skill/system-spec-kit/scripts/rules/check-anchors.sh:117-143` to reject duplicate IDs (matching `mcp_server/lib/validation/preflight.ts:323-339`)
- Pre-scan active 026 packets for latent duplicates; surface list in implementation-summary
- Synthetic duplicate-anchor fixture fails

**Rank 4 — Reporting split (deferrable):**
- Categorize rules in registry: `authored_template` vs `operational_runtime`
- Update coverage-matrix output format to group by category

**Rank 5 — decision-record placeholder fix:**
- Fix frontmatter description in `.opencode/skill/system-spec-kit/templates/level_3/decision-record.md:2-4` (remove stray comment terminator)
- Verify template validates cleanly

## CONSTRAINTS

- Run validator + full mcp_server test suite after each rank
- Self-correct up to 3 attempts on failure, then HALT
- Mark `tasks.md` items `[x]` with evidence (file:line per rank)
- Update checklist.md + implementation-summary.md
- DO NOT git commit or git push (orchestrator commits at end)

## OUTPUT EXPECTATION

All 5 ranks land (rank 4 deferrable if time-constrained). Validator regression green. Spec docs updated.
