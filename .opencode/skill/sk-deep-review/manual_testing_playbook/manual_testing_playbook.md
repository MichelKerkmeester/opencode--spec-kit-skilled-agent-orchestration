---
title: "sk-deep-review: Manual Testing Playbook"
description: "Operator-facing reference combining the manual testing directory, integrated review protocol, orchestration guidance, and per-scenario validation files for the sk-deep-review skill."
---

# sk-deep-review: Manual Testing Playbook

This document combines the operator-facing manual testing contract for the `sk-deep-review` skill into a single reference. The root playbook acts as the directory, review protocol, and orchestration guide, while the per-feature files carry the scenario-specific execution truth.

---

Canonical package artifacts:
- `manual_testing_playbook.md`
- `01--entry-points-and-modes/`
- `02--initialization-and-state-setup/`
- `03--iteration-execution-and-state-discipline/`
- `04--convergence-and-recovery/`
- `05--pause-resume-and-fault-tolerance/`
- `06--synthesis-save-and-guardrails/`

---

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. GLOBAL PRECONDITIONS](#2--global-preconditions)
- [3. GLOBAL EVIDENCE REQUIREMENTS](#3--global-evidence-requirements)
- [4. DETERMINISTIC COMMAND NOTATION](#4--deterministic-command-notation)
- [5. SUB-AGENT ORCHESTRATION AND WAVE PLANNING](#5--sub-agent-orchestration-and-wave-planning)
- [6. ENTRY POINTS AND MODES](#6--entry-points-and-modes)
- [7. INITIALIZATION AND STATE SETUP](#7--initialization-and-state-setup)
- [8. ITERATION EXECUTION AND STATE DISCIPLINE](#8--iteration-execution-and-state-discipline)
- [9. CONVERGENCE AND RECOVERY](#9--convergence-and-recovery)
- [10. PAUSE, RESUME, AND FAULT TOLERANCE](#10--pause-resume-and-fault-tolerance)
- [11. SYNTHESIS, SAVE, AND GUARDRAILS](#11--synthesis-save-and-guardrails)
- [12. AUTOMATED TEST CROSS-REFERENCE](#12--automated-test-cross-reference)

---

## 1. OVERVIEW

This playbook provides 28 deterministic scenarios across 6 categories validating the current `sk-deep-review` skill surface. Each scenario maps to a dedicated feature file with a realistic user request, orchestrator prompt, expected process, desired user-facing outcome, one primary 9-column execution row, and source anchors into the live skill, command, YAML, and runtime docs.

### REALISTIC TEST MODEL

1. A realistic user request is given to an orchestrator.
2. The orchestrator decides whether to inspect public docs, workflow definitions, runtime agent rules, or state schemas.
3. The operator captures both the expected execution process and the user-visible outcome.
4. The scenario passes only when the documented contract is internally consistent and would guide a real operator without contradiction.

---

## 2. GLOBAL PRECONDITIONS

All scenarios assume:
- `sk-deep-review` skill exists at `.opencode/skill/sk-deep-review/`
- `/spec_kit:deep-review` command exists at `.opencode/command/spec_kit/deep-review.md`
- `@deep-review` agent definition exists at `.opencode/agent/deep-review.md` (and runtime variants)
- Review YAML workflows exist: `spec_kit_deep-review_auto.yaml`, `spec_kit_deep-review_confirm.yaml`
- `review_mode_contract.yaml` exists at `.opencode/skill/sk-deep-review/assets/`

---

## 3. GLOBAL EVIDENCE REQUIREMENTS

All scenarios must produce:
- A clear PASS/FAIL verdict with reasoning
- Evidence captured from the actual file contents (not assumed)
- Cross-source consistency verified (README vs SKILL.md vs command vs YAML vs agent)

---

## 4. DETERMINISTIC COMMAND NOTATION

Command sequences use `rg` (ripgrep) and `sed` for deterministic, reproducible evidence gathering. Operators execute these in order and capture output.

---

## 5. SUB-AGENT ORCHESTRATION AND WAVE PLANNING

28 scenarios across 6 categories. Recommended wave execution:

| Wave | Categories | Scenarios | Focus |
|------|-----------|-----------|-------|
| 1 | 01, 02 | DRV-001 to DRV-007 | Entry points and initialization |
| 2 | 03 | DRV-008 to DRV-014 | Iteration execution |
| 3 | 04 | DRV-015 to DRV-020 | Convergence and recovery |
| 4 | 05, 06 | DRV-021 to DRV-028 | Fault tolerance, synthesis, guardrails |

---

## 6. ENTRY POINTS AND MODES

### 01--entry-points-and-modes/ (3 scenarios)

| # | ID | Scenario | File |
|---|------|----------|------|
| 1 | DRV-001 | Auto mode deep review kickoff | `01--entry-points-and-modes/001-auto-mode-deep-review-kickoff.md` |
| 2 | DRV-002 | Confirm mode checkpointed review | `01--entry-points-and-modes/002-confirm-mode-checkpointed-review.md` |
| 3 | DRV-003 | Parameterized invocation (max-iterations, convergence) | `01--entry-points-and-modes/003-parameterized-invocation-max-iterations-convergence.md` |

---

## 7. INITIALIZATION AND STATE SETUP

### 02--initialization-and-state-setup/ (4 scenarios)

| # | ID | Scenario | File |
|---|------|----------|------|
| 4 | DRV-004 | Fresh review initialization creates canonical state files | `02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md` |
| 5 | DRV-005 | Resume classification from valid prior review state | `02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md` |
| 6 | DRV-006 | Invalid or contradictory review state halts for repair | `02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md` |
| 7 | DRV-007 | Scope discovery and dimension ordering | `02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md` |

---

## 8. ITERATION EXECUTION AND STATE DISCIPLINE

### 03--iteration-execution-and-state-discipline/ (7 scenarios)

| # | ID | Scenario | File |
|---|------|----------|------|
| 8 | DRV-008 | Review iteration reads state before review | `03--iteration-execution-and-state-discipline/008-review-iteration-reads-state-before-review.md` |
| 9 | DRV-009 | Review iteration writes findings, JSONL, and strategy update | `03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md` |
| 10 | DRV-010 | Strategy next focus and dimension rotation | `03--iteration-execution-and-state-discipline/010-strategy-next-focus-and-dimension-rotation.md` |
| 11 | DRV-011 | Cross-reference verification detects misalignment | `03--iteration-execution-and-state-discipline/011-cross-reference-verification-detects-misalignment.md` |
| 12 | DRV-012 | Adversarial self-check runs on P0 findings | `03--iteration-execution-and-state-discipline/012-adversarial-self-check-runs-on-p0-findings.md` |
| 13 | DRV-013 | Review dashboard generation after iteration | `03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md` |
| 14 | DRV-014 | Severity classification in JSONL | `03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md` |

---

## 9. CONVERGENCE AND RECOVERY

### 04--convergence-and-recovery/ (6 scenarios)

| # | ID | Scenario | File |
|---|------|----------|------|
| 15 | DRV-015 | Stop on max iterations | `04--convergence-and-recovery/015-stop-on-max-iterations.md` |
| 16 | DRV-016 | Composite review convergence stop behavior | `04--convergence-and-recovery/016-composite-review-convergence-stop-behavior.md` |
| 17 | DRV-017 | P0 override blocks convergence | `04--convergence-and-recovery/017-p0-override-blocks-convergence.md` |
| 18 | DRV-018 | Review quality guards block premature stop | `04--convergence-and-recovery/018-review-quality-guards-block-premature-stop.md` |
| 19 | DRV-019 | Stuck recovery widens dimension focus | `04--convergence-and-recovery/019-stuck-recovery-widens-dimension-focus.md` |
| 20 | DRV-020 | Dimension coverage convergence signal | `04--convergence-and-recovery/020-dimension-coverage-convergence-signal.md` |

---

## 10. PAUSE, RESUME, AND FAULT TOLERANCE

### 05--pause-resume-and-fault-tolerance/ (4 scenarios)

| # | ID | Scenario | File |
|---|------|----------|------|
| 21 | DRV-021 | Pause sentinel halts between review iterations | `05--pause-resume-and-fault-tolerance/021-pause-sentinel-halts-between-review-iterations.md` |
| 22 | DRV-022 | Resume after pause sentinel removal | `05--pause-resume-and-fault-tolerance/022-resume-after-pause-sentinel-removal.md` |
| 23 | DRV-023 | Malformed JSONL lines are skipped with defaults | `05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md` |
| 24 | DRV-024 | JSONL reconstruction from review iteration files | `05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md` |

---

## 11. SYNTHESIS, SAVE, AND GUARDRAILS

### 06--synthesis-save-and-guardrails/ (4 scenarios)

| # | ID | Scenario | File |
|---|------|----------|------|
| 25 | DRV-025 | Review report synthesis has all 9 sections | `06--synthesis-save-and-guardrails/025-review-report-synthesis-has-all-9-sections.md` |
| 26 | DRV-026 | Review verdict determines post-review workflow | `06--synthesis-save-and-guardrails/026-review-verdict-determines-post-review-workflow.md` |
| 27 | DRV-027 | Final synthesis memory save and guardrail behavior | `06--synthesis-save-and-guardrails/027-final-synthesis-memory-save-and-guardrail-behavior.md` |
| 28 | DRV-028 | Finding deduplication and registry | `06--synthesis-save-and-guardrails/028-finding-deduplication-and-registry.md` |

---

## 12. AUTOMATED TEST CROSS-REFERENCE

No dedicated automated test suite currently exists for `sk-deep-review`. This playbook anchors directly to the live `sk-deep-review` docs plus the active command and runtime definitions.

| Source | Path |
|--------|------|
| SKILL.md | `.opencode/skill/sk-deep-review/SKILL.md` |
| README.md | `.opencode/skill/sk-deep-review/README.md` |
| Command | `.opencode/command/spec_kit/deep-review.md` |
| Auto YAML | `.opencode/command/spec_kit/assets/spec_kit_deep-review_auto.yaml` |
| Confirm YAML | `.opencode/command/spec_kit/assets/spec_kit_deep-review_confirm.yaml` |
| Agent (OpenCode) | `.opencode/agent/deep-review.md` |
| Agent (Claude) | `.claude/agents/deep-review.md` |
| Review Contract | `.opencode/skill/sk-deep-review/assets/review_mode_contract.yaml` |
| Loop Protocol | `.opencode/skill/sk-deep-review/references/loop_protocol.md` |
| Convergence | `.opencode/skill/sk-deep-review/references/convergence.md` |
| State Format | `.opencode/skill/sk-deep-review/references/state_format.md` |
| Quick Reference | `.opencode/skill/sk-deep-review/references/quick_reference.md` |
