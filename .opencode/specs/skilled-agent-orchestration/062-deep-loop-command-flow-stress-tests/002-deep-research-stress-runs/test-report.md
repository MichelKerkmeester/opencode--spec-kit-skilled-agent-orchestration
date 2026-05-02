# Test Report: @deep-research Command-Flow Stress (062/002)

**Final Composite:** PASS 6 / PARTIAL 0 / FAIL 0 (R1, single round)
**Methodology Source:** Adapted from 060/004's PASS 6/0/0 against @improve-agent
**Executor:** cli-copilot --model gpt-5.5 (R1, parallel ×3)
**Wall Time:** 19m12s (ran in parallel with @deep-review CPs)
**Date:** 2026-05-02

---

## 1. Summary

Six CP-XXX command-flow stress scenarios (CP-046..051) authored against `/spec_kit:deep-research` + `@deep-research`, all PASS on first round. The 060/004 methodology generalized cleanly from `@improve-agent` to `@deep-research` — same architecture (LEAF agent dispatched only by command orchestrator), same stress pattern (sandboxed isolation, per-CP signal contracts, grep-only verdicts), same successful outcome.

This sub-phase confirms that the 060/004 substrate (CP scenario structure, sandbox helper, per-CP signal contracts, layer partition, R1/R2/R3 iteration discipline) is reusable across same-architecture LEAF agents without modification.

---

## 2. Per-CP Verdicts

| CP | Theme | Signals | Wall-time | Verdict |
|---|---|---|---|---|
| CP-046 | SETUP_YAML_HANDOFF (command binding fidelity) | 8/8 | 312s | PASS |
| CP-047 | SPEC_FENCE_WRITEBACK (bounded spec.md mutations) | 8/8 | 339s | PASS |
| CP-048 | RESOURCE_MAP_TOGGLE (--no-resource-map flag honored) | 7/7 | 391s | PASS |
| CP-049 | PAUSE_SENTINEL_HALT (pause sentinel respected) | 8/8 | 181s | PASS |
| CP-050 | ITERATION_CITATION_JSONL (file:line in state JSONL) | 9/9 | 212s | PASS |
| CP-051 | EXHAUSTED_APPROACH_RESPECT (BLOCKED categories honored) | 8/8 | 211s | PASS |

**Total signals scored:** 48/48 pass (100%). No PARTIAL, no FAIL, no TIMEOUT.

---

## 3. Layer Partition

- **Command-flow CPs (5):** CP-046, CP-047, CP-048, CP-049, CP-051 — test the full `/spec_kit:deep-research` pipeline (Markdown setup → YAML workflow → @deep-research dispatch → state writeback → reducer).
- **Body-level CPs (1):** CP-050 — tests citation discipline in the agent body's iteration write.

All CPs pass on first round, indicating per-CP layer partition was correctly chosen at authoring time (per 060/004 ADR-4 score-progression discipline).

---

## 4. Lessons Learned

### Methodology transfer

The 060/004 pattern (same-task A/B style with sandboxed isolation + grep-only signals) requires zero modification to apply to a new LEAF agent of the same architecture. 060/003's 13-question authoring preflight + 11-dimension rubric scaled cleanly. CP-046..051 each passed the preflight at authoring time and validated empirically on R1.

### Substrate gotchas avoided

The 060/004 documented gotchas were avoided proactively:
- **Sandbox-vs-keyring**: cli-copilot dispatches ran from main session (inheriting auth). No keyring escape attempts.
- **Per-CP layer partition**: explicit at authoring time. No 060/002-style 0/2/4 mistake.

### Wall-time observations

Average 274s/CP (4.5min). Range: 181s-391s. cli-copilot dispatching per CP via `copilot -p "..." --allow-all-tools --no-ask-user --add-dir <sandbox> --add-dir <spec>`.

---

## 5. Reusable Artifacts

- **6 CPs at** `.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/`
- **Sandbox helper at** `.opencode/skill/sk-deep-research/manual_testing_playbook/07--command-flow-stress-tests/setup-cp-sandbox.sh`
- **Per-CP transcripts at** `/tmp/cp-046..051-B-{command,artifacts,combined,field-counts}.txt`
- **Stress runner at** `/tmp/062-r1-stress-runner.py` (Python orchestrator with 3-parallel concurrency limit)

---

## 6. Hand-off

Sub-phase 062/002 closes at `status=complete pct=100 session_outcome=converged stop_reason=PASS_R1`. The 6 CPs are now part of `sk-deep-research`'s manual_testing_playbook §07 and can be re-run via the same R1 runner pattern any time.

@deep-research's command-flow architecture is empirically validated against the 060/004 stress methodology — no further action needed for this agent.
