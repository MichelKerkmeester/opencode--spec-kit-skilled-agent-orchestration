# Implementation Deep Review Report

## 1. Executive Summary

Verdict: CONDITIONAL.

The production-code audit covered 2 implementation files and found 0 P0, 2 P1, and 1 P2 findings. Confidence is medium-high: the audited surface is small, line evidence is direct, scoped Vitest passed repeatedly, and the two P1s were reproduced with targeted Python fixtures. The verdict is conditional because the P1s can misroute implementation prompts and hide corrupt authoritative metadata from runtime health.

## 2. Scope

Code files audited:

| File | Role |
| --- | --- |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py` | Skill advisor CLI, compatibility shim, native bridge, local scorer, health diagnostics |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py` | Skill graph metadata discovery, validation, and JSON compilation |

Spec docs were read only to derive scope. Findings that cite only spec docs were rejected.

## 3. Method

The review ran 10 iterations in dimension order: correctness, security, robustness, testing, correctness, security, robustness, testing, correctness, security.

Verification performed:

| Check | Result |
| --- | --- |
| Scoped Vitest iteration 001 | PASS: 5 files, 37 tests |
| Scoped Vitest iterations 002-010 | PASS each run: 5 files, 37 tests |
| `git log --oneline -- <reviewed files>` | Found implementation history at `106d394ca0` and `a663cbe78f` |
| Targeted correctness fixture | Reproduced DRI-F001 |
| Targeted robustness fixture | Reproduced DRI-F002 |
| `skill_advisor.py --validate-only` | Exits 2 on live zero-edge metadata warnings; treated as out-of-scope metadata state |

Scoped Vitest command:

```bash
cd .opencode/skill/system-spec-kit/mcp_server && ../scripts/node_modules/.bin/vitest run skill-advisor/tests/compat/python-compat.vitest.ts skill-advisor/tests/compat/shim.vitest.ts skill-advisor/tests/parity/python-ts-parity.vitest.ts skill-advisor/tests/handlers/advisor-recommend.vitest.ts skill-advisor/tests/scorer/native-scorer.vitest.ts --reporter=default
```

## 4. Findings By Severity

### P0

| ID | Finding | Evidence |
| --- | --- | --- |
| None | No P0 findings. | N/A |

### P1

| ID | Dimension | Finding | Required Code Evidence |
| --- | --- | --- | --- |
| DRI-F001 | correctness | Quoted command implementation prompts can be normalized into workflow execution routing when they contain workflow verbs. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2192`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2205`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2215`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2241` |
| DRI-F002 | robustness | Runtime source-metadata health ignores the nested skill-advisor graph-metadata file that the compiler treats as authoritative. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:82`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_graph_compiler.py:94`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:468`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2936` |

### P2

| ID | Dimension | Finding | Required Code Evidence |
| --- | --- | --- | --- |
| DRI-F003 | testing | Regression coverage misses the quoted-command workflow-verb case and nested advisor metadata health case. | `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:160`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py:790`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:2205`, `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/scripts/skill_advisor.py:468` |

## 5. Findings By Dimension

Correctness:

- DRI-F001: The guard for quoted command implementation references is too broad. `_quoted_command_reference_is_workflow_invocation()` treats workflow verbs anywhere in the prompt as invocation intent, so implementation prompts about quoted commands can be normalized away from the command bridge being edited.

Security:

- No active findings. Subprocess calls use argv lists, prompt payloads go over stdin, native labels are sanitized, and path containment checks are present for compiler metadata fields.

Robustness:

- DRI-F002: Compiler discovery and runtime source health disagree on the nested advisor metadata file. This can leave health green when a file that strict validation treats as authoritative is corrupt.

Testing:

- DRI-F003: Existing tests pass but miss the two reproduced edge cases.

## 6. Adversarial Self-Check For P0

No P0 was found.

P0 challenge on DRI-F001:

- Expected vs actual: implementation-target prompt `add tests for `/memory:save` run-mode guard` should preserve `command-memory-save`, but `skill_advisor.py:2205` makes `run` count as invocation context and normalization at `skill_advisor.py:2241` proceeds to `system-spec-kit`.
- Impact: wrong routing of an implementation prompt, not data loss, crash, auth bypass, or secret exposure. Severity remains P1.

P0 challenge on DRI-F002:

- Expected vs actual: compiler discovery fails a corrupt nested advisor metadata file via `skill_graph_compiler.py:82` and `skill_graph_compiler.py:94`; runtime health scanning from `skill_advisor.py:468` misses it and can report source metadata healthy.
- Impact: false health state and stale routing metadata risk, not direct production data loss or code execution. Severity remains P1.

## 7. Remediation Order

1. Fix DRI-F001 by making quoted command references remain implementation targets when the surrounding prompt contains edit/test/fix/modify language, even if it also contains workflow verbs as subject text.
2. Add nested advisor metadata discovery to the runtime source metadata loaders or share a discovery helper with `skill_graph_compiler.py`.
3. Add regression tests for both fixes.
4. Re-run scoped Vitest and `skill_advisor.py --validate-only`; treat remaining validate-only failure as metadata remediation outside this packet if code fixes pass.

## 8. Test Additions Needed

Add Python tests in `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/tests/python/test_skill_advisor.py`:

- A command guard case for `add tests for `/memory:save` run-mode guard` expecting `_should_guard_command_bridge_normalization(..., "command-memory-save") is True`.
- A command guard case for `fix quoted `/spec_kit:deep-review` run normalization bug` expecting the deep-review command bridge to remain the implementation target.
- A health fixture with a valid top-level skill and corrupt nested `system-spec-kit/mcp_server/skill-advisor/graph-metadata.json`, expecting `health_check().source_metadata.healthy is False`.

Add or extend Vitest compatibility coverage if the native shim should preserve the same command-reference behavior across the Python compatibility layer.

## 9. Appendix: Iteration List And Churn

| Iteration | Dimension | New Findings | Churn |
| --- | --- | --- | --- |
| 001 | correctness | DRI-F001 | 0.50 |
| 002 | security | none | 0.00 |
| 003 | robustness | DRI-F002 | 0.50 |
| 004 | testing | DRI-F003 | 0.20 |
| 005 | correctness | none | 0.00 |
| 006 | security | none | 0.00 |
| 007 | robustness | none | 0.00 |
| 008 | testing | none | 0.00 |
| 009 | correctness | none | 0.00 |
| 010 | security | none | 0.00 |

Convergence: all four dimensions were covered; the final three iterations had churn 0.00; max iteration count was reached with no P0 findings.
