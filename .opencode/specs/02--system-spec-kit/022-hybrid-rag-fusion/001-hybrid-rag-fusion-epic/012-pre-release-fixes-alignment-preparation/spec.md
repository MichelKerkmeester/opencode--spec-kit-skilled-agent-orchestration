# 012 — Pre-Release Fixes & Alignment Preparation

> **Level 2+ | Phase 12 of 022-hybrid-rag-fusion Epic**

<!-- SPECKIT_LEVEL: 2 -->

---

## Objective

Two-phase pre-release quality gate for the 022-hybrid-rag-fusion system:
1. **Audit** (complete) — 10-agent deep investigation identifying all broken, untested, misaligned, or non-compliant code and documentation
2. **Remediation** (pending) — Fix the 4 P0 blockers, 19 P1 must-fix, and triage 26 P2 should-fix items to reach release readiness

## Audit Results Summary

| Severity | Count | Description |
|----------|-------|-------------|
| **P0** | 4 | Release blockers — server crash, failing tests, broken module resolution, validation red |
| **P1** | 19 | Wrong behavior, data loss, dead features, stale docs, incomplete phases |
| **P2** | 26 | Code quality, hygiene, coverage gaps, architecture drift |

**Total: 49 findings** across 10 investigation areas. See `research.md` for full evidence.

## Scope

### Audit scope (complete)
- Memory MCP server (33 tools, all handlers, pipeline, startup)
- generate-context.js and system-spec-kit scripts (save pipeline, validators)
- Feature catalog (219 snippets) vs code audit (22 categories)
- Manual testing playbook (230 scenarios) vs feature catalog (75% coverage)
- Session capturing (009) — 20 sub-phases, 3 incomplete
- Architecture audit (005) vs actual implementation (41 documented vs 51 in code)
- sk-code--opencode compliance (190 files audited)
- Recent commits regression (5 code-touching commits analyzed)
- Validator and template compliance (43 errors, 40 warnings)

### Remediation scope (pending)
- **P0 fixes**: Module resolution, startup error handling, lint blockers, spec validation
- **P1 fixes**: Quality loop, pipeline integrity, dead flags, stale docs, search regression
- **P2 triage**: Dead code cleanup, playbook coverage, architecture docs, standards compliance

### Out of scope
- New feature development
- Playbook scenario creation for the 54 untested features (separate task)
- Implementation of unfinished session capturing sub-phases (009/019 remediation sprints)

## Method

### Phase 1: Deep Research (complete)
10 GPT-5.4 agents via `codex exec` (read-only sandbox, high reasoning):

| # | Agent Focus | P0 | P1 | P2 |
|---|-------------|----|----|-----|
| 1 | MCP Server Health | 1 | 2 | 6 |
| 2 | Scripts & generate-context | 0 | 5 | 1 |
| 3 | Feature Catalog vs Code Audit | 0 | 0 | 4 |
| 4 | Playbook vs Catalog Alignment | 0 | 0 | 2 |
| 5 | Pipeline Architecture | 0 | 2 | 3 |
| 6 | Session Capturing (009) | 1 | 2 | 0 |
| 7 | Validators & Templates | 1 | 3 | 2 |
| 8 | Recent Commits Regression | 0 | 1 | 2 |
| 9 | sk-code--opencode Compliance | 0 | 0 | 3 |
| 10 | Architecture vs Implementation | 0 | 4 | 3 |

### Phase 2: Synthesis (complete)
- Findings compiled into `research.md` with cross-agent correlation
- Remediation priorities established in `tasks.md`
- Cascade dependencies mapped (P0-4 → P0-3, P0-1 ← P1-2)

### Phase 3: Remediation (pending)
- Execute fixes per `tasks.md` priority order
- Verify each fix with targeted tests
- Re-run `validate.sh` after spec doc fixes

## Deliverables

| File | Status | Content |
|------|--------|---------|
| `research.md` | Complete | 49 findings with file:line evidence, severity, cross-agent correlations |
| `tasks.md` | Complete | Prioritized remediation items aligned with P0/P1/P2 |
| `checklist.md` | Complete | Verification criteria per severity tier |
| `plan.md` | Complete | 3-phase workflow with dependency chain |
| `scratch/agent-NN-*.md` | Complete | 10 raw agent reports |

## Success Criteria

- [x] All 10 investigation areas audited
- [x] Findings categorized by severity (P0/P1/P2)
- [x] No P0 issues without documented remediation path
- [x] Feature catalog and playbook gaps quantified (75% coverage, 54 untested)
- [ ] All P0 blockers resolved
- [ ] `validate.sh` passes (exit 0 or 1, not 2)
- [ ] `npm run check` passes
- [ ] workflow-e2e tests pass (39/39)
- [ ] MCP server starts reliably on flaky networks
