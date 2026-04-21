# Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL

The implementation itself looks healthy: current AST inspection shows zero whitespace and zero hyphen keys in `INTENT_BOOSTERS` and `MULTI_SKILL_BOOSTERS`, and the current-path regression command with `--dataset` exits 0 with top1_accuracy 1.0 and p0_pass_rate 1.0.

The packet is not clean for release bookkeeping. The review found 0 P0, 5 P1, and 5 P2 findings. Per the requested verdict rule, `>=5 P1` yields CONDITIONAL. The dominant risk is stale documentation/evidence after the advisor moved under `system-spec-kit/mcp_server/skill-advisor`.

hasAdvisories: true

## 2. Scope

Reviewed spec folder:

`/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-search-routing-advisor/003-advisor-phrase-booster-tailoring`

Reviewed packet files:

- `spec.md`
- `plan.md`
- `tasks.md`
- `checklist.md`
- `implementation-summary.md`
- `description.json`
- `graph-metadata.json`
- `scratch/phrase-boost-delta.md`
- `scratch/baseline-regression.json`
- `scratch/post-regression.json`
- `scratch/followup-post-regression.json`

Reviewed implementation references:

- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py`
- `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`

`decision-record.md` was requested but absent. Level 2 does not require it, so the absence is advisory rather than blocking.

## 3. Method

Ten iterations were run across the requested rotation:

1. correctness
2. security
3. traceability
4. maintainability
5. correctness
6. security
7. traceability
8. maintainability
9. correctness
10. security

Checks included direct packet reads, actual implementation path resolution, AST inspection of booster dictionaries, current regression harness replay with bytecode disabled, and traceability comparison between spec/checklist/summary/metadata/scratch artifacts.

Stop reason: maxIterationsReached. Convergence did not short-circuit earlier because active P1 traceability/correctness findings remained.

## 4. Findings By Severity

### P0

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| None | - | No P0 findings. | - |

### P1

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| F001 | correctness | Regression command in the spec omits the required `--dataset` argument. The current harness requires it, so the documented command exits 2. | `skill_advisor_regression.py:8`, `skill_advisor_regression.py:242`, `spec.md:122`, `tasks.md:54`, `tasks.md:80` |
| F002 | correctness | REQ-001 verification evidence uses stale line ranges and does not scan the current `INTENT_BOOSTERS` block. | `spec.md:120`, `plan.md:85`, `plan.md:120`, `scratch/phrase-boost-delta.md:102`, `skill_advisor.py:1154`, `skill_advisor.py:1418` |
| F003 | correctness | REQ-010/CHK-032 claims five uplift-style validations, but four rows are `+0.00` high-confidence holds. | `spec.md:130`, `tasks.md:82`, `checklist.md:84`, `scratch/phrase-boost-delta.md:88-92` |
| F004 | traceability | Spec docs and generated graph metadata point to non-existent `.opencode/skill/skill-advisor/...` paths. | `spec.md:54`, `spec.md:106`, `spec.md:107`, `implementation-summary.md:18`, `implementation-summary.md:78`, `graph-metadata.json:42`, `graph-metadata.json:53` |
| F005 | traceability | `graph-metadata.json` still says `status: planned` while the implementation summary/checklist say complete. | `graph-metadata.json:40`, `implementation-summary.md:26`, `implementation-summary.md:49`, `checklist.md:125`, `description.json:11` |

### P2

| ID | Dimension | Finding | Evidence |
|----|-----------|---------|----------|
| F006 | security | Rollback instructions recommend `git checkout` against stale paths. | `plan.md:179`, `plan.md:227`, `scratch/phrase-boost-delta.md:195` |
| F007 | traceability | Checklist evidence index references `scratch/multi-word-inventory.md`, but that file is absent. | `checklist.md:59`, `checklist.md:134`, `tasks.md:87` |
| F008 | traceability | `decision-record.md` is absent from the requested review corpus. | Folder listing; review invocation |
| F009 | maintainability | Delta report line guidance for PHRASE additions is stale. | `scratch/phrase-boost-delta.md:69`, `skill_advisor.py:1418`, `skill_advisor.py:1623` |
| F010 | correctness | `tasks.md` remains unchecked despite completed implementation summary/checklist. | `tasks.md:54`, `tasks.md:67`, `tasks.md:80`, `implementation-summary.md:49`, `checklist.md:125` |

## 5. Findings By Dimension

Correctness:

- F001: Update regression commands to include `--dataset` and the current fixture path.
- F002: Replace stale line-range grep evidence with AST-based or block-aware verification.
- F003: Reword REQ-010/CHK-032 evidence to distinguish threshold holds from actual uplift.
- F010: Align `tasks.md` completion markers with the completed packet state.

Security:

- F006: Replace destructive rollback guidance with a safety-aware remediation note, or at least correct the target paths and require explicit operator approval.

Traceability:

- F004: Replace stale `.opencode/skill/skill-advisor/...` paths with `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/...`.
- F005: Regenerate or patch graph metadata so status reflects completion.
- F007: Either restore `scratch/multi-word-inventory.md` or remove it from the checklist evidence index.
- F008: Document that `decision-record.md` is not required for this Level 2 packet, or add a short decision record if the packet now expects one.

Maintainability:

- F009: Replace approximate line references with current anchors or path/symbol references.

## 6. Adversarial Self-Check For P0

No P0 was assigned because current production behavior passed the strongest checks available in this review:

- Current-path regression with `--dataset` exits 0.
- Current fixture evaluation reports top1_accuracy 1.0 and p0_pass_rate 1.0.
- AST parse succeeds.
- AST dictionary inspection shows `INTENT_BOOSTERS` and `MULTI_SKILL_BOOSTERS` contain no whitespace or hyphen keys.

Counterargument considered: stale verification commands could hide a broken implementation. Rejected as P0 because the current implementation was independently validated against the actual path and fixture. The release blocker is documentation/traceability integrity, not runtime failure.

## 7. Remediation Order

1. Fix F004 first: update all stale implementation and fixture paths across spec, plan, tasks, checklist, implementation summary, scratch report, and metadata.
2. Fix F001: update every regression command to include `--dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl`.
3. Fix F002: replace line-range grep checks with an AST/block-aware check.
4. Fix F005: regenerate `description.json`/`graph-metadata.json` so status and key files reflect the completed moved packet.
5. Fix F003 and F010: synchronize completion wording and task/checklist evidence.
6. Address P2 advisories F006-F009 as cleanup.

## 8. Verification Suggestions

Use these checks after remediation:

```bash
PYTHONDONTWRITEBYTECODE=1 python3 .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor_regression.py --dataset .opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/fixtures/skill_advisor_regression_cases.jsonl --threshold 0.8 --uncertainty 0.35 --min-top1-accuracy 0.92
```

```bash
PYTHONDONTWRITEBYTECODE=1 python3 - <<'PY'
import ast, pathlib
path = pathlib.Path('.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py')
mod = ast.parse(path.read_text())
for name in ['INTENT_BOOSTERS', 'MULTI_SKILL_BOOSTERS']:
    node = next(n.value for n in mod.body if isinstance(n, ast.Assign) and any(getattr(t, 'id', None) == name for t in n.targets))
    bad = [k.value for k in node.keys if isinstance(k, ast.Constant) and isinstance(k.value, str) and (any(c.isspace() for c in k.value) or '-' in k.value)]
    assert not bad, (name, bad)
print('BOOSTER_KEY_INVARIANT_OK')
PY
```

Also verify:

- `rg "\.opencode/skill/skill-advisor" <spec-folder>` returns no stale path references unless they are explicitly listed as migration aliases.
- `graph-metadata.json` derives `status` consistently with `implementation-summary.md`.
- Checklist evidence entries all point to files that exist.

## 9. Appendix

Iteration list:

| Iteration | Dimension | New Findings | Churn |
|-----------|-----------|--------------|-------|
| 001 | correctness | F001, F002, F003 | 0.58 |
| 002 | security | F006 | 0.08 |
| 003 | traceability | F004, F005, F007, F008 | 0.36 |
| 004 | maintainability | F009 | 0.09 |
| 005 | correctness | F010 | 0.14 |
| 006 | security | none | 0.06 |
| 007 | traceability | none | 0.11 |
| 008 | maintainability | none | 0.07 |
| 009 | correctness | none | 0.05 |
| 010 | security | none | 0.04 |

Delta churn sequence: 0.58 -> 0.08 -> 0.36 -> 0.09 -> 0.14 -> 0.06 -> 0.11 -> 0.07 -> 0.05 -> 0.04.

Artifacts:

- `review/deep-review-config.json`
- `review/deep-review-state.jsonl`
- `review/deep-review-findings-registry.json`
- `review/iterations/iteration-001.md` through `review/iterations/iteration-010.md`
- `review/deltas/iter-001.jsonl` through `review/deltas/iter-010.jsonl`
- `review/review-report.md`
