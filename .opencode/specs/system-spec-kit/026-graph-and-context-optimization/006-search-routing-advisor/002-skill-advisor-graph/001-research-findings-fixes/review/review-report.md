# Deep Review Report: 001-research-findings-fixes

## 1. Executive summary

Verdict: **CONDITIONAL**.

The loop found **0 P0**, **5 P1**, and **4 P2** findings across 10 iterations. The packet has strong evidence that the main behavior regressions pass, but it is not clean enough to treat as production-ready documentation or verification state. The biggest issue is that current strict validation fails while the checklist claims it passes. The second cluster is traceability drift: multiple docs and graph metadata entries point at a stale `.opencode/skill/skill-advisor/scripts/...` location instead of the live `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/...` path.

Under the requested verdict rule, P0 would be FAIL, five or more P1 findings is CONDITIONAL, otherwise PASS. This review therefore returns **CONDITIONAL with advisories**.

## 2. Scope

Reviewed target:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes`

Primary packet files:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Referenced implementation evidence:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill-graph.json`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- Related skill `graph-metadata.json` files for system-spec-kit, sk-doc, mcp-coco-index, sk-improve-prompt, sk-deep-review, and sk-deep-research.

## 3. Method

The review ran 10 iterations with rotating dimensions:

correctness -> security -> traceability -> maintainability, then repeated.

Commands executed for evidence included:

- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --validate-only`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- Focused local advisor prompts including `figma`, `code review`, `deep review loop`, and `build something generic`.

The requested write boundary was honored: reviewed code/spec production references were read-only, and all created artifacts are under `review/**`.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Status |
|----|-----------|---------|--------|
| None | - | No P0 findings identified. | - |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-001 | correctness | Validation evidence is false: current strict graph validation exits 2. | `checklist.md:58`, `checklist.md:69`, `skill_graph_compiler.py:782`, `skill_graph_compiler.py:786`; live command exits 2 with zero-edge warnings for `sk-deep-research` and `sk-git`. |
| DR-002 | traceability | Spec/checklist/summary point at non-existent skill-advisor paths. | `spec.md:133`, `spec.md:142`, `implementation-summary.md:82`; actual scripts live under `system-spec-kit/mcp_server/skill-advisor/scripts/`. |
| DR-003 | traceability | `graph-metadata.json` derived key files/entities retain stale paths. | `graph-metadata.json:50`, `graph-metadata.json:71`, `graph-metadata.json:89`. |
| DR-004 | correctness | Current advisor health is degraded by graph/discovery inventory mismatch. | `skill_advisor.py --health` reports `status: degraded`, `inventory_parity.in_sync: false`, `missing_in_discovery: ["skill-advisor"]`. |
| DR-005 | correctness | Graph evidence separation does not lower uncertainty. | Original spec describes confidence/uncertainty inflation; `skill_advisor.py:2791` and `skill_advisor.py:2794` calculate uncertainty before any graph-fraction handling; `skill_advisor.py:2822` only adjusts confidence. |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| DR-006 | traceability | Regression evidence counts are stale. | Docs claim 44/44 and 12/12 P0; current regression reports 104/104 and 24/24 P0 across two runners. |
| DR-007 | maintainability | Compiled graph size evidence conflicts with current artifact. | `checklist.md:68` and `tasks.md:77` claim under 4KB; current `skill-graph.json` is 4667 bytes. |
| DR-008 | maintainability | Plan still includes impossible `--audit-drift` verification for a deferred flag. | `plan.md:185`, `checklist.md:95`; compiler help exposes no `--audit-drift`. |
| DR-009 | maintainability | Reason ordering debt remains and is visible in production output. | `checklist.md:103`; `skill_advisor.py:2811` still sorts/truncates reasons alphabetically. |

## 5. Findings by dimension

| Dimension | P0 | P1 | P2 | Summary |
|-----------|----|----|----|---------|
| correctness | 0 | 3 | 0 | Validation/health claims are not aligned with live behavior; graph-evidence uncertainty remains untreated. |
| security | 0 | 0 | 0 | No direct security defect found in reviewed local metadata/subprocess paths. |
| traceability | 0 | 2 | 1 | Stale implementation paths and stale evidence counts are the strongest documentation risks. |
| maintainability | 0 | 0 | 3 | Deferred items are mostly documented, but verification instructions and size targets are inconsistent. |

## 6. Adversarial self-check for P0

I challenged each P1 for possible P0 escalation:

- DR-001 is serious because validation fails, but regression still passes and the defect is a blocked release/verification claim rather than a runtime crash or unsafe behavior.
- DR-002 and DR-003 break continuation traceability, but the actual files exist elsewhere and can be discovered.
- DR-004 reports degraded health, but the advisor still loads the graph and regression passes.
- DR-005 leaves uncertainty calibration incomplete, but graph-only candidate creation is blocked and no prompt reviewed showed an immediate unsafe result.

No P0 was justified by the available evidence.

## 7. Remediation order

1. Fix DR-001: decide whether zero-edge skills are true validation blockers. If they are, add appropriate graph edges or remove the zero-edge state. If they are allowed, stop treating them as strict validation failures and update the checklist accordingly.
2. Fix DR-002 and DR-003: update all stale `.opencode/skill/skill-advisor/scripts/...` references to the current nested `system-spec-kit/mcp_server/skill-advisor/scripts/...` paths, then regenerate packet metadata.
3. Fix DR-004: either include nested `skill-advisor` in discovery parity or document why the 21st graph node is intentionally outside skill discovery and adjust health semantics.
4. Fix DR-005: include graph-derived evidence in uncertainty calibration, not only confidence calibration.
5. Refresh DR-006 and DR-007 evidence after the above changes.
6. Clean up DR-008 and DR-009 as normal P2 debt.

## 8. Verification suggestions

Run these after remediation:

```bash
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --validate-only
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health
python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl
rg -n "\.opencode/skill/skill-advisor/scripts" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/001-research-findings-fixes
wc -c .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill-graph.json
```

Expected clean state:

- validation exits 0 or the checklist explicitly documents accepted warning behavior,
- health is `ok` or documented degraded state is intentional,
- no stale skill-advisor script paths remain in the packet,
- regression counts in docs match the current harness,
- graph size target is updated or the artifact is brought back under target.

## 9. Appendix

### Iterations

| Iteration | Dimension | New findings | Ratio | Churn |
|-----------|-----------|--------------|-------|-------|
| 001 | correctness | DR-001, DR-004 | 0.54 | 0.54 |
| 002 | security | none | 0.08 | 0.08 |
| 003 | traceability | DR-002, DR-003, DR-006 | 0.46 | 0.46 |
| 004 | maintainability | DR-007 | 0.16 | 0.16 |
| 005 | correctness | DR-005 | 0.24 | 0.24 |
| 006 | security | none | 0.02 | 0.02 |
| 007 | traceability | none | 0.05 | 0.05 |
| 008 | maintainability | DR-008, DR-009 | 0.08 | 0.08 |
| 009 | correctness | none | 0.01 | 0.01 |
| 010 | security | none | 0.00 | 0.00 |

### Artifacts

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
- `review/review-report.md`

### Stop reason

`maxIterationsReached`
