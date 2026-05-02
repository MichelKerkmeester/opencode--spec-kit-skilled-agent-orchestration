## Packet 052: stress-test-expansion-and-alignment — sk-code-opencode alignment + coverage gap fill

You are cli-codex (gpt-5.5 high fast) implementing **039-stress-test-expansion-and-alignment**.

### CRITICAL: Spec folder path

The packet folder is: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/039-stress-test-expansion-and-alignment/` — write ALL packet files there. Do NOT ask for the spec folder.

### Goal

Two-track work across `.opencode/skill/system-spec-kit/mcp_server/stress_test/`:

1. **sk-code-opencode alignment**: every `.ts` file under `stress_test/` MUST follow sk-code-opencode TypeScript standards (strict imports, named exports where appropriate, no unused vars, vitest convention compliance, telemetry naming, test descriptors, no console.log without `process.env.DEBUG_*` gates).
2. **Coverage gap fill**: cross-reference the 3 mcp_server-attached feature catalogs against `stress_test/`. For features NOT covered by an existing vitest, author new tests OR document an explicit deferral with rationale.

### Source of truth

- sk-code-opencode standards: `.opencode/skill/sk-code-opencode/SKILL.md` + `.opencode/skill/sk-code-opencode/references/`
- Feature catalogs to audit:
  - `.opencode/skill/system-spec-kit/feature_catalog/` (302 features — focus on stress-test-relevant categories: 06--analysis, 11--scoring, 12--query-intelligence, 13--memory-quality, 14--stress-testing, 15--retrieval, 22--context-preservation)
  - `.opencode/skill/system-spec-kit/mcp_server/code_graph/feature_catalog/` (17 features)
  - `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/feature_catalog/` (37 features)
- Existing stress test inventory: `.opencode/skill/system-spec-kit/mcp_server/stress_test/` (29 .ts files / 25 vitest / 63 tests; subsystems: memory/, code-graph/, skill-advisor/, search-quality/, matrix/, session/)
- vitest config: `.opencode/skill/system-spec-kit/mcp_server/vitest.config.ts`

### Phase 1: Inventory existing tests

Walk `stress_test/` and produce:
- Per-file inventory table: `| File | Subsystem | Test count | Behaviors covered |`
- Subsystem totals
- Save to `audit-findings.md` Section 1

### Phase 2: sk-code-opencode alignment audit

For each `.ts` file under `stress_test/`, check:

- **Imports**: ESM-style, no relative `../../../` chains beyond 2 levels (extract helpers if needed)
- **Exports**: named exports for utilities; default export only when intentional
- **Naming**: vitest descriptors use behavior-based phrasing (`describe('feature X', () => { it('does Y when Z', ...)`)
- **Strict mode**: no `any` without justification comment; no `as` casts without narrowing
- **Telemetry / logging**: no bare `console.log` without `process.env.DEBUG_*` gate
- **Async**: no unhandled promise rejections; vitest awaits properly
- **Cleanup**: vitest `afterEach`/`afterAll` for any side-effect-creating tests
- **No dead code**: unused imports / unused vars flagged
- **File header**: top-of-file comment describes what subsystem behavior is exercised

For each violation, record in `audit-findings.md` Section 2 with file:line, severity (P0/P1/P2), and proposed fix.

### Phase 3: Apply alignment fixes

Apply ALL P0 + P1 fixes surgically. For P2, apply if cheap; otherwise document deferral. After fixes:

```bash
cd .opencode/skill/system-spec-kit/mcp_server && npm run build
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run stress_test/ --reporter=verbose 2>&1 | tail -50
```

Build MUST pass. All tests MUST still pass (no regression). Save vitest output to `logs/vitest-post-alignment.log`.

### Phase 4: Coverage gap analysis

For each feature in the 3 catalogs (focus on testable runtime behaviors — exclude purely documentation features), determine:
- **Covered**: existing vitest exercises this feature (cite file:test-name)
- **Partial**: feature is touched but key edge case missing
- **Uncovered**: no vitest exercises this feature
- **Out-of-scope**: feature is documentation/UI-only or covered by handler-level test outside stress_test/

Output a coverage matrix in `audit-findings.md` Section 3:
```
| Catalog | Feature | Status | Test file (if any) | Action |
```

Aim: 100% catalog → status mapping for relevant features.

### Phase 5: Author new tests for high-value gaps

For Uncovered + Partial features ranked by stress-test value (memory invariants, search quality regression, code-graph freshness, skill-advisor concurrency, matrix shadow comparison, session lifecycle), author new vitest files OR extend existing ones.

Each new test file:
- Header comment: subsystem + feature catalog reference
- Frontmatter-style imports
- `describe('<feature>', ...)` + ≥2 `it()` cases (golden path + 1 edge case)
- Cleanup hooks where state is created
- Filename: `<subsystem>/<feature-slug>.vitest.ts` matching existing convention

Re-run vitest after additions:
```bash
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run stress_test/ --reporter=verbose 2>&1 | tail -80
```

Save to `logs/vitest-post-coverage.log`. All tests pass.

### Phase 6: Author packet docs (Level 2)

At the packet folder, author Level 2 docs from templates at `.opencode/skill/system-spec-kit/templates/level_2/`:
- `spec.md` — two-track goal, scope (alignment + coverage), success criteria (build pass, tests pass, coverage matrix complete)
- `plan.md` — phases mirroring this prompt
- `tasks.md` — actionable task list
- `checklist.md` — P0/P1/P2 items (target ≥20 items, 100% [x])
- `decision-record.md` — alignment-rule decisions, deferred-coverage rationale
- `implementation-summary.md` — populated after work completes (alignment fix counts, new test counts, coverage matrix delta)
- `description.json` + `graph-metadata.json` — mirror from sibling 050/051 and update fields
- `audit-findings.md` — Sections 1-3 above
- `remediation-log.md` — per-file alignment fix log
- `coverage-matrix.md` — full catalog → test mapping

Continuity frontmatter MUST be valid (`recent_action`, `next_safe_action` < 80 chars).

### Phase 7: Verification

```bash
# Strict validator MUST exit 0
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/039-stress-test-expansion-and-alignment --strict

# Build + vitest pass
cd .opencode/skill/system-spec-kit/mcp_server && npm run build
cd .opencode/skill/system-spec-kit/mcp_server && npx vitest run stress_test/ 2>&1 | tail -20

# sk-code-opencode lint sweep on stress_test
cd .opencode/skill/system-spec-kit/mcp_server && npx tsc --noEmit 2>&1 | tail -20
```

### Constraints

- **CODE + DOC.** This packet IS allowed to modify stress_test/ source files for alignment fixes and new tests.
- Do NOT change runtime behavior under `mcp_server/` outside `stress_test/` — alignment fixes scope is `stress_test/*.ts` only.
- Do NOT delete existing tests unless they are duplicates (document any deletion in `remediation-log.md`).
- New test files MUST follow existing vitest convention (`<subsystem>/<feature>.vitest.ts`).
- All vitest cases MUST pass; build MUST pass; strict validator MUST exit 0.
- Evergreen-doc rule MUST be honored in any new doc content (no packet IDs in evergreen content; spec-local docs in this packet ARE allowed to reference 052).
- DO NOT commit; orchestrator commits.
- Stay on `main` branch; do NOT create a feature branch.

### Packet meta

**Deps**: `manual.depends_on=["system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/025-stress-test-folder-completion","system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/037-feature-catalog-shape-realignment"]`.

**Trigger phrases**: `["039-stress-test-expansion-and-alignment","stress test alignment","stress test coverage","sk-code-opencode stress test"]`.

**Causal summary**: `"Aligns all .ts files under .opencode/skill/system-spec-kit/mcp_server/stress_test/ with sk-code-opencode standards (~29 files audited, P0/P1 fixes applied). Cross-references 3 mcp_server feature catalogs (system-spec-kit + code_graph + skill_advisor) against existing stress_test coverage and authors new tests for high-value uncovered features. Build + vitest + strict validator all pass."`.

When done, last action: all four checks green (strict validator, build, vitest, tsc) + complete coverage matrix in `coverage-matrix.md`. No narration; just write files and exit.
