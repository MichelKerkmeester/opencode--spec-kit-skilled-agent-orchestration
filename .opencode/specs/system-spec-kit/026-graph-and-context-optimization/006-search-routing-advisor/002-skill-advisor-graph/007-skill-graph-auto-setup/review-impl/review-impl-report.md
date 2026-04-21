# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

The reviewed production code is not release-clean for the skill-graph auto-setup surface. No P0 security/data-loss/crash blocker was found, but the setup and freshness lifecycle has six P1 defects and two P2 advisories. Confidence: high for correctness/robustness/testing findings because the main failures were reproduced against live commands or temp DB calls; moderate-high for security because no exploitable boundary was found in two passes.

Counts: P0=0, P1=6, P2=2.

## 2. Scope

Code files audited from the packet's implementation-summary and graph-metadata claims:

| Claimed / Derived File | Live Code Audited | Status |
|---|---|---|
| `.opencode/skill/skill-advisor/scripts/init-skill-graph.sh` | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh` | moved live counterpart audited |
| `.opencode/skill/skill-advisor/scripts/skill_advisor.py` | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | moved live counterpart audited |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` | audited |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | derived key file audited |

Supporting production/test code read to validate call paths:
- `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py`
- Scoped vitest files under `mcp_server/skill-advisor/tests/` and `mcp_server/tests/skill-graph-schema.vitest.ts`

Spec docs, `description.json`, and packet `graph-metadata.json` were used only to establish scope. They were not accepted as finding evidence.

## 3. Method

The loop ran 10 implementation-audit iterations with dimensions rotated as requested: correctness, security, robustness, testing, then repeat.

Vitest was run for every iteration using:

```bash
cd .opencode/skill/system-spec-kit/mcp_server
../scripts/node_modules/.bin/vitest run skill-advisor/tests/compat/python-compat.vitest.ts skill-advisor/tests/skill-graph-db.vitest.ts skill-advisor/tests/lifecycle-derived-metadata.vitest.ts tests/skill-graph-schema.vitest.ts --reporter=default
```

Result each time: PASS, 4 test files, 30 tests.

Git history was checked each iteration for the implementation files. Relevant commits included:
- `8264f5ecca feat(011): implement skill graph auto-setup with init script and lazy fallback`
- `106d394ca0 refactor: consolidate skill-advisor into self-contained mcp_server/skill-advisor/`
- `a663cbe78f fix(027): scan-findings Themes 2-7 — 34 findings closed`

Additional reproduction checks:
- `bash .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh` reports validation failure with effective `rc=2`.
- A temp-DB call to `indexSkillMetadata(resolve('.opencode/skill'))` fails on a non-skill fixture `graph-metadata.json`.
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health` exits 0 but reports degraded inventory parity with `missing_in_discovery: ["skill-advisor"]`.

## 4. Findings By Severity

### P0

None.

### P1

| ID | Dimension | Finding | Required Code Evidence |
|---|---|---|---|
| IMPL-COR-001 | correctness | Init script aborts before JSON export and health because validation currently exits nonzero under `set -e`. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:8`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:53`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:56`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:59` |
| IMPL-COR-002 | correctness | Advisor health is structurally degraded because graph inventory includes nested `skill-advisor` while SKILL.md discovery scans only top-level folders. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2931`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2957`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2968`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:153`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_runtime.py:155` |
| IMPL-ROB-001 | robustness | Context-server startup reindex can fail on non-skill packet metadata because the DB indexer recursively treats every `graph-metadata.json` as skill metadata. | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1472`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1480`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:338`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:462` |
| IMPL-ROB-002 | robustness | Context-server watcher misses nested skill-advisor metadata because it watches only one-level skill folders. | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1528`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1529`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1543`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:82`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:89` |
| IMPL-TST-001 | testing | No scoped regression test executes the shipped init script end-to-end. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:53`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:56`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/init-skill-graph.sh:59`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts:13`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/compat/python-compat.vitest.ts:15` |
| IMPL-TST-002 | testing | DB indexer tests do not cover mixed repository roots containing non-skill `graph-metadata.json` files. | `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:320`, `.opencode/skill/system-spec-kit/mcp_server/lib/skill-graph/skill-graph-db.ts:455`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts:28`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/skill-graph-db.vitest.ts:40` |

### P2

| ID | Dimension | Finding | Required Code Evidence |
|---|---|---|---|
| IMPL-TST-003 | testing | Context-server watcher lacks scoped nested metadata coverage. | `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1528`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1529`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts:117`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/daemon-freshness-foundation.vitest.ts:124` |
| IMPL-ROB-003 | robustness | Python auto-compile fallback runs graph compiler without a timeout. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:745`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:748`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:246`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:251` |

## 5. Findings By Dimension

Correctness:
- `IMPL-COR-001`: setup script exits before setup.
- `IMPL-COR-002`: health signal is degraded by inventory mismatch.

Security:
- No findings. Two security passes reviewed subprocess invocation, prompt handling, env gates, shell usage, and local file boundaries.

Robustness:
- `IMPL-ROB-001`: recursive indexer can fail on unrelated packet metadata.
- `IMPL-ROB-002`: context-server watcher misses nested skill-advisor metadata.
- `IMPL-ROB-003`: auto-compile subprocess lacks timeout.

Testing:
- `IMPL-TST-001`: init script not tested end-to-end.
- `IMPL-TST-002`: mixed repo indexer fixture missing.
- `IMPL-TST-003`: context-server nested watcher coverage missing.

## 6. Adversarial Self-Check For P0

No P0 findings were reported.

Self-check:
- The init-script failure is P1, not P0: it blocks the operator setup path but does not directly corrupt data, expose secrets, or crash the running MCP server.
- The recursive indexer failure is P1, not P0: context-server catches the exception and continues, but freshness can remain stale.
- The watcher miss is P1, not P0: nested metadata updates are not automatically observed, but manual/restart paths still exist.
- No security issue was found that would justify P0.

## 7. Remediation Order

1. Fix `IMPL-COR-001` and `IMPL-TST-001` together: make `init-skill-graph.sh` distinguish fatal validation failures from advisory topology warnings, and add a vitest/subprocess regression that runs the actual script or an equivalent temp-fixture invocation.
2. Fix `IMPL-ROB-001` and `IMPL-TST-002`: constrain `discoverGraphMetadataFiles()` to actual skill metadata roots or schema-shape-filter packet metadata before parsing; add a fixture with a non-skill `graph-metadata.json` under the scanned tree.
3. Fix `IMPL-COR-002`: align health inventory parity with the chosen model. Either make nested `skill-advisor` discoverable as a real skill record or exclude it from graph/health parity.
4. Fix `IMPL-ROB-002` and `IMPL-TST-003`: watch recursive/nested graph metadata paths or delegate to the daemon watcher that already handles broader lifecycle changes; add context-server-specific coverage.
5. Fix `IMPL-ROB-003`: add a bounded timeout to the auto-compile subprocess and fail open with a diagnostic.

## 8. Test Additions Needed

- Init script smoke test: execute the setup script against a controlled fixture and assert validation/export/health behavior.
- Mixed tree indexer test: include valid skill metadata plus a spec-packet `graph-metadata.json` and assert indexing skips or classifies the packet metadata safely.
- Context-server watcher test: verify nested `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/graph-metadata.json` changes schedule a skill-graph reindex.
- Health parity test: assert `skill_advisor.py --health` is `ok` when the graph and discovery model intentionally include/exclude nested `skill-advisor`.
- Timeout test: simulate a hanging compiler subprocess and assert auto-compile fails open within budget.

## 9. Appendix: Iterations And Churn

| Iteration | Dimension | New P0 | New P1 | New P2 | Churn |
|---|---|---:|---:|---:|---:|
| 001 | correctness | 0 | 1 | 0 | 0.31 |
| 002 | security | 0 | 0 | 0 | 0.00 |
| 003 | robustness | 0 | 2 | 0 | 0.48 |
| 004 | testing | 0 | 2 | 1 | 0.44 |
| 005 | correctness | 0 | 1 | 0 | 0.25 |
| 006 | security | 0 | 0 | 0 | 0.00 |
| 007 | robustness | 0 | 0 | 1 | 0.06 |
| 008 | testing | 0 | 0 | 0 | 0.00 |
| 009 | correctness | 0 | 0 | 0 | 0.00 |
| 010 | security | 0 | 0 | 0 | 0.00 |

Stop reason: maxIterationsReached.

Artifacts:
- `review-impl/deep-review-impl-config.json`
- `review-impl/deep-review-impl-state.jsonl`
- `review-impl/deep-review-impl-findings-registry.json`
- `review-impl/iterations/iteration-001.md` through `iteration-010.md`
- `review-impl/deltas/iter-001.jsonl` through `iter-010.jsonl`
