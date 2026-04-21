# Deep Review Report: 005 Repo-Wide Path Migration

## 1. Executive summary

Verdict: FAIL.

The packet has one active P0, four active P1 findings, and two P2 advisories. All four requested dimensions were covered across ten iterations. The stop reason is `maxIterationsReached`, not convergence, because active P0 F001 blocks legal convergence.

The primary blocker is that the packet claims completion and strict validation success, but current strict validation exits 2 with `SPEC_DOC_INTEGRITY` errors. The packet also records runtime verification commands under a deleted `.opencode/skill/skill-advisor/scripts/` path; the live scripts are under `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/`, and even that live compiler validation currently fails.

## 2. Scope

Reviewed packet:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/005-repo-wide-path-migration`

Files read:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `decision-record.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Review writes were confined to `review/**`.

## 3. Method

The loop ran ten iterations in the requested rotation: correctness, security, traceability, maintainability, then repeated. Each iteration read prior state, reviewed the packet against one focus dimension, updated the finding registry, appended JSONL state, and wrote a markdown iteration file plus a delta JSONL file.

Verification commands run during review:

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh <packet> --strict`
- `python3 .opencode/skill/skill-advisor/scripts/skill_advisor.py --health`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- `rg --files .opencode | rg 'skill_advisor(_regression)?\\.py|skill_graph_compiler\\.py|manual_testing_playbook\\.md|skill-advisor/README\\.md|skill/README\\.md'`
- Path and root existence checks for the old and current skill-advisor locations.

## 4. Findings by severity

### P0

| ID | Dimension | Finding | Evidence | Required fix |
|----|-----------|---------|----------|--------------|
| F001 | correctness | Packet claims strict validation passes, but current strict validation fails. | `spec.md:112`; `plan.md:59`; `implementation-summary.md:87`; current strict validation exited 2 with 15 missing-reference integrity errors. | Correct stale paths and evidence, rerun strict validation, and only then restore complete status. |

### P1

| ID | Dimension | Finding | Evidence | Required fix |
|----|-----------|---------|----------|--------------|
| F002 | correctness | Runtime verification paths point to a deleted skill-advisor location. | `plan.md:119-120`; `tasks.md:69-71`; `checklist.md:64-66`; `.opencode/skill/skill-advisor` is missing while the nested system-spec-kit path exists. | Rewrite command evidence to the current nested path and refresh output. |
| F003 | correctness | Current compiler validation fails even at the live nested path. | `checklist.md:65`; `implementation-summary.md:84`; live `skill_graph_compiler.py --validate-only` exited 2 with zero-edge warnings for `sk-deep-research` and `sk-git`. | Fix graph metadata validation or downgrade completion claims. |
| F004 | traceability | Grep-zero and scope claims still target the old `011`/`007` root after the packet moved to `002`. | `spec.md:32`, `spec.md:115`, `spec.md:133`; `checklist.md:67`; no current `011-skill-advisor-graph` directory under the active parent. | Rebase root-wide gates to `002-skill-advisor-graph` and reserve `011` for migration aliases. |
| F005 | traceability | `description.json` parentChain disagrees with the current packet location. | `description.json:14-19`; `graph-metadata.json:3-5`; `description.json:25`. | Normalize the parentChain to the current path. |

### P2

| ID | Dimension | Finding | Evidence | Suggested fix |
|----|-----------|---------|----------|---------------|
| F006 | maintainability | Continuity frontmatter is stale relative to refreshed graph metadata. | Markdown frontmatter keeps April 13 timestamps; `description.json:11` and `graph-metadata.json:219` show April 21; validator emitted `CONTINUITY_FRESHNESS`. | Refresh continuity after correcting the packet. |
| F007 | maintainability | The packet never names the two forbidden legacy patterns it claims to grep. | `spec.md:115`; `tasks.md:72`; `implementation-summary.md:86`. | Record the exact `rg` command and patterns. |

## 5. Findings by dimension

Correctness: F001, F002, and F003. The packet is not currently correct because its completion and verification claims do not match current repo behavior.

Security: No active security findings. The packet is documentation/metadata-only, with no secrets, auth changes, unsafe parsing, or executable payloads introduced by the reviewed files.

Traceability: F004 and F005. The packet still carries old root naming into active gates and has split identity between description metadata and graph metadata.

Maintainability: F006 and F007. The packet is repairable, but stale continuity and unnamed grep patterns make future maintenance unnecessarily brittle.

## 6. Adversarial self-check for P0

Hunter: REQ-001 is explicitly P0 and requires strict validation to exit 0 or 1. Current validation exited 2, and the implementation summary claims the opposite.

Skeptic: Could this be only a warning? No. The validator output says `RESULT: FAILED`, reports `Errors: 1`, and exits 2. The continuity issue is a warning, but the missing markdown references are errors.

Referee: F001 remains P0. It directly contradicts the packet's highest-priority completion gate and invalidates the current complete status.

## 7. Remediation order

1. Fix F002 by replacing deleted `.opencode/skill/skill-advisor/scripts/*` and `../../../../../skill/skill-advisor/*` references with the live nested `system-spec-kit/mcp_server/skill-advisor` paths.
2. Fix F003 by resolving the current compiler validation failure for zero-edge `sk-deep-research` and `sk-git`, or explicitly record the validation as blocked.
3. Fix F004 and F005 by normalizing current root naming to `002-skill-advisor-graph` while preserving `011` only in alias/migration fields.
4. Rerun strict packet validation; F001 can close only when validation exits 0 or 1.
5. Refresh continuity timestamps and record the exact grep patterns to close F006 and F007.

## 8. Verification suggestions

- `bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph/005-repo-wide-path-migration --strict`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py --health`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py --validate-only`
- `python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`
- `rg -n "<exact forbidden pattern 1>|<exact forbidden pattern 2>" .opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/002-skill-advisor-graph`
- `jq '.parentChain, .migration.aliases' <packet>/description.json`
- `jq '.parent_id, .aliases, .migration' <packet>/graph-metadata.json`

## 9. Appendix

| Iteration | Dimension | New P0 | New P1 | New P2 | Churn |
|-----------|-----------|--------|--------|--------|-------|
| 001 | correctness | 1 | 1 | 0 | 0.75 |
| 002 | security | 0 | 0 | 0 | 0.00 |
| 003 | traceability | 0 | 2 | 1 | 0.35 |
| 004 | maintainability | 0 | 0 | 1 | 0.08 |
| 005 | correctness | 0 | 1 | 0 | 0.25 |
| 006 | security | 0 | 0 | 0 | 0.00 |
| 007 | traceability | 0 | 0 | 0 | 0.05 |
| 008 | maintainability | 0 | 0 | 0 | 0.06 |
| 009 | correctness | 0 | 0 | 0 | 0.00 |
| 010 | security | 0 | 0 | 0 | 0.00 |

Artifacts:

- `deep-review-config.json`
- `deep-review-state.jsonl`
- `deep-review-findings-registry.json`
- `iterations/iteration-001.md` through `iterations/iteration-010.md`
- `deltas/iter-001.jsonl` through `deltas/iter-010.jsonl`
- `review-report.md`
