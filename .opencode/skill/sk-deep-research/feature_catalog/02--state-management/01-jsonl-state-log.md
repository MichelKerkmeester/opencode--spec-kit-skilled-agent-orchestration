---
title: "JSONL state log"
description: "Provides the append-only deep-research ledger for config, iteration, and event records."
---

# JSONL state log

## 1. OVERVIEW

Provides the append-only deep-research ledger for config, iteration, and event records.

`deep-research-state.jsonl` is the authoritative event trail for a packet. It captures what the loop has done so far in a form the reducer, convergence logic, and recovery logic can all re-read later.

---

## 2. CURRENT REALITY

The JSONL log begins with a config record, then appends one line per iteration plus typed event records such as `resumed`, `restarted`, `blocked_stop`, `graph_convergence`, `userPaused`, and `synthesis_complete`. Iteration rows can carry `newInfoRatio`, `noveltyJustification`, `convergenceSignals`, `ruledOut`, `focusTrack`, `sourceStrength`, and `graphEvents`, which makes the log the richest machine-readable packet surface.

The log is append-only by contract. The agent may add one iteration line, the workflow may append event lines, and the reader path is fault-tolerant. Malformed lines are skipped with defaults instead of breaking the loop, and reconstruction from iteration files is an explicit recovery path when the log is damaged.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/references/state_format.md` | Reference | Defines the JSONL schema for config, iteration, and event lines. |
| `.opencode/skill/sk-deep-research/references/convergence.md` | Reference | Defines how convergence readers parse JSONL safely and interpret stuck, insight, and thought statuses. |
| `.opencode/agent/deep-research.md` | Agent | Defines the one-line iteration append contract and required JSONL fields. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_auto.yaml` | Workflow | Appends workflow-owned events such as `graph_convergence` and `blocked_stop`. |
| `.opencode/command/spec_kit/assets/spec_kit_deep-research_confirm.yaml` | Workflow | Mirrors the same event-writing path in confirm mode. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-deep-research/manual_testing_playbook/03--iteration-execution-and-state-discipline/025-novelty-justification-in-jsonl.md` | Manual playbook | Verifies `noveltyJustification` is present and aligned with the iteration record. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/017-malformed-jsonl-lines-are-skipped-with-defaults.md` | Manual playbook | Verifies tolerant parsing of malformed JSONL lines. |
| `.opencode/skill/sk-deep-research/manual_testing_playbook/05--pause-resume-and-fault-tolerance/018-jsonl-reconstruction-from-iteration-files.md` | Manual playbook | Verifies state reconstruction when JSONL is damaged. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/01-jsonl-state-log.md`
