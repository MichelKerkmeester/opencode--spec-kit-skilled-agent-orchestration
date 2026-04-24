# Deep Review Report - 004-normalize-legacy-files

## 1. Executive Summary

Verdict: **CONDITIONAL**.

The 10-iteration loop found no P0 blockers, 5 P1 findings, and 5 P2 advisories. Under the requested verdict rule, `P0 -> FAIL; >=5 P1 -> CONDITIONAL; else PASS`, this packet is conditional. The central issue is that the packet's completed documentation claims active-only backfill behavior, but the current implementation, tests, and system-spec-kit guidance say the backfill is inclusive by default and `--active-only` is opt-in.

`hasAdvisories`: `true`

## 2. Scope

Reviewed packet:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/001-search-and-routing-tuning/003-graph-metadata-validation/004-normalize-legacy-files`

Canonical packet files reviewed:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`

Requested but absent:

- `decision-record.md`

Referenced implementation and validation files reviewed:

- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts`
- `.opencode/skill/system-spec-kit/scripts/tests/graph-metadata-backfill.vitest.ts`
- `.opencode/skill/system-spec-kit/SKILL.md`

## 3. Method

The loop ran 10 iterations, rotating dimensions in the requested order: correctness, security, traceability, maintainability, then repeat. Each pass read prior state, reviewed one target dimension, wrote an iteration narrative, wrote a JSONL delta, updated the findings registry, and appended session-log state.

No production files were modified. Writes were confined to `review/**`.

## 4. Findings by Severity

### P0

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| None | - | No P0 findings were identified. | - |

### P1

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| F001 | Correctness | Completed packet claims active-only default, but implementation is inclusive by default. | `tasks.md:6`, `implementation-summary.md:39`, `backfill-graph-metadata.ts:7`, `backfill-graph-metadata.ts:73`, `graph-metadata-backfill.vitest.ts:78` |
| F002 | Traceability | Completed regression-test task describes the opposite of the checked-in test behavior. | `tasks.md:8`, `graph-metadata-backfill.vitest.ts:78`, `graph-metadata-backfill.vitest.ts:117` |
| F003 | Traceability | `graph-metadata.json` causal summary still advertises the retired migration objective. | `spec.md:16`, `spec.md:18`, `graph-metadata.json:189` |
| F004 | Traceability | `description.json` parentChain retains stale `010-search-and-routing-tuning` after migration to `001-search-and-routing-tuning`. | `description.json:2`, `description.json:18`, `description.json:26`, `description.json:31` |
| F005 | Traceability | Checklist completion depends on non-local corpus-scan evidence that is not present in the packet. | `checklist.md:10`, `checklist.md:16`, `plan.md:20`, `plan.md:21` |

### P2

| ID | Dimension | Finding | Evidence |
| --- | --- | --- | --- |
| F006 | Security | Malformed `--root` usage silently falls back to the default root. | `backfill-graph-metadata.ts:89`, `backfill-graph-metadata.ts:90`, `backfill-graph-metadata.ts:91` |
| F007 | Maintainability | `spec.md` key-files list omits the regression test that the packet relies on. | `spec.md:20`, `spec.md:22`, `graph-metadata.json:34`, `graph-metadata.json:36` |
| F008 | Maintainability | Generated entity extraction contains low-quality placeholder entities. | `graph-metadata.json:93`, `graph-metadata.json:99`, `graph-metadata.json:111`, `graph-metadata.json:177` |
| F009 | Correctness | Verification command in the plan is a mutating backfill command, not a scan-only proof. | `plan.md:20`, `backfill-graph-metadata.ts:214`, `backfill-graph-metadata.ts:216` |
| F010 | Traceability | Review scope named `decision-record.md`, but the Level 2 packet has no such file. | `.opencode/skill/system-spec-kit/SKILL.md:397` |

## 5. Findings by Dimension

Correctness:

- F001: Active-only default claim contradicts implementation.
- F009: Verification command mutates metadata instead of proving the scan result read-only.

Security:

- F006: Missing `--root` operand does not fail closed.

Traceability:

- F002: Task/test mismatch.
- F003: Stale graph metadata causal summary.
- F004: Stale `description.json` parentChain.
- F005: Checklist evidence is not packet-local or reproducible from a saved artifact.
- F010: Requested `decision-record.md` absent, advisory only because Level 2 does not require it.

Maintainability:

- F007: Key file list is incomplete.
- F008: Low-quality derived entities reduce retrieval precision.

## 6. Adversarial Self-Check for P0

No P0 was assigned because none of the findings indicate data loss, an exploitable security flaw, or a runtime path that is definitely broken for all operators. The strongest issue, F001/F002, is a documentation-to-code contradiction in a completed packet. It can mislead future work and memory retrieval, but the implementation itself has a coherent current behavior: inclusive by default with `--active-only` opt-in.

Counterevidence sought:

- Source comments say inclusive default: `backfill-graph-metadata.ts:7`.
- Runtime default sets `activeOnly = false`: `backfill-graph-metadata.ts:73`.
- Tests assert inclusive default: `graph-metadata-backfill.vitest.ts:78`.
- System-spec-kit guidance says inclusive default: `.opencode/skill/system-spec-kit/SKILL.md:546`.

Result: no P0 escalation.

## 7. Remediation Order

1. Decide the intended current contract: inclusive default or active-only default.
2. If inclusive default is intended, update `tasks.md`, `implementation-summary.md`, `checklist.md`, and any stale retirement wording that claims active-only default behavior.
3. Refresh `graph-metadata.json` so `derived.causal_summary`, low-quality entities, and key-file derivations match the retired packet state.
4. Refresh `description.json` so `parentChain` matches the current `001-search-and-routing-tuning` hierarchy while aliases preserve historical paths.
5. Add a packet-local verification artifact or command for the `legacyGraphMetadataFiles = 0` claim, preferably read-only.
6. Harden `--root` parsing to reject missing operands.
7. Add the regression test to `spec.md` key files or explain why graph metadata should be the only place listing it.

## 8. Verification Suggestions

- Run a read-only scan that reports `legacyGraphMetadataFiles = 0` without refreshing files, then save the output or cite the owning packet path.
- Run the existing graph backfill tests after documentation alignment:
  `cd .opencode/skill/system-spec-kit && NODE_PATH=./mcp_server/node_modules ./mcp_server/node_modules/.bin/vitest run scripts/tests/graph-metadata-backfill.vitest.ts`
- Run TypeScript validation for the script package:
  `cd .opencode/skill/system-spec-kit/scripts && npx tsc --noEmit`
- Validate JSON artifacts after metadata refresh:
  `node -e "for (const f of ['description.json','graph-metadata.json']) JSON.parse(require('fs').readFileSync(f,'utf8'))"`

## 9. Appendix

### Iteration List

| Iteration | Dimension | New Findings | Ratio | Notes |
| --- | --- | --- | --- | --- |
| 001 | correctness | F001 | 0.50 | Found active-only default contradiction. |
| 002 | security | F006 | 0.12 | Found operator-safety advisory. |
| 003 | traceability | F002, F003, F004, F005 | 0.50 | Found hard traceability issues. |
| 004 | maintainability | F007, F008 | 0.18 | Found key-file and entity hygiene issues. |
| 005 | correctness | F009 | 0.11 | Found mutating verification command. |
| 006 | security | None | 0.10 | Confirmed no P0/P1 security issue. |
| 007 | traceability | F010 | 0.10 | Recorded absent decision-record advisory. |
| 008 | maintainability | None | 0.04 | Saturation pass. |
| 009 | correctness | None | 0.04 | Saturation pass. |
| 010 | security | None | 0.03 | Max iterations reached. |

### Delta Churn

Churn sequence: `0.50 -> 0.12 -> 0.50 -> 0.18 -> 0.11 -> 0.10 -> 0.10 -> 0.04 -> 0.04 -> 0.03`.

Stop reason: `maxIterationsReached`. The final three iterations reached the low-churn stuck threshold, but this coincided with the requested 10-iteration cap and synthesis proceeded.

### Artifact Index

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
- `review/review-report.md`
