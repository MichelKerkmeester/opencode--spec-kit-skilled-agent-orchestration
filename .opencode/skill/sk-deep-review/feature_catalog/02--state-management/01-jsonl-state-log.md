---
title: "JSONL state log"
description: "Stores the append-only execution history for the deep-review lineage."
---

# JSONL state log

## 1. OVERVIEW

Stores the append-only execution history for the deep-review lineage.

`deep-review-state.jsonl` is the packet's event spine. It captures config, iteration output, stop decisions, pause and recovery events, graph-assisted convergence data, and the final synthesis result in one ordered stream.

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 2. CURRENT REALITY

The JSONL log starts with a config record, then appends one record per iteration with required fields for focus, dimensions, files reviewed, findings counts, severity-weighted `newFindingsRatio`, session lineage, and timing. Optional fields extend the record with traceability checks, graph events, coverage, ruled-out directions, and convergence signals.

The same file also persists first-class lifecycle events such as `blocked_stop`, `graph_convergence`, `userPaused`, `stuckRecovery`, and `synthesis_complete`. Because the loop recomputes decisions from stored state, the JSONL contract is load-bearing for convergence replay, dashboard refreshes, and restart-safe reducer output.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state_format.md` | Schema | Defines the config record, iteration fields, event payloads, graph events, and normalization rules. |
| `references/loop_protocol.md` | Protocol | Requires JSONL reads before dispatch and appends state after each loop phase. |
| `references/convergence.md` | Protocol | Defines the shared stop-reason enum and blocked-stop persistence rules that land in JSONL. |
| `assets/review_mode_contract.yaml` | Contract | Declares required iteration and synthesis-event fields and lifecycle metadata. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/009-review-iteration-writes-findings-jsonl-and-strategy-update.md` | Manual scenario | Verifies per-iteration JSONL append behavior. |
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/014-severity-classification-in-jsonl.md` | Manual scenario | Checks severity-weighted JSONL findings fields. |
| `manual_testing_playbook/05--pause-resume-and-fault-tolerance/023-malformed-jsonl-lines-are-skipped-with-defaults.md` | Manual scenario | Exercises malformed-line handling and state recovery expectations. |
| `manual_testing_playbook/05--pause-resume-and-fault-tolerance/024-jsonl-reconstruction-from-review-iteration-files.md` | Manual scenario | Verifies reconstruction from write-once iteration files. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/01-jsonl-state-log.md`
- Primary sources: `references/state_format.md`, `references/loop_protocol.md`, `references/convergence.md`, `assets/review_mode_contract.yaml`
