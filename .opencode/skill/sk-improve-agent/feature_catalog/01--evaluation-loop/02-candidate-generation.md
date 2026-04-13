---
title: "Candidate generation"
description: "Generates one bounded packet-local candidate through the proposal-only improve-agent subagent."
---

# Candidate generation

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

---

## 1. OVERVIEW

Generates one bounded packet-local candidate through the proposal-only improve-agent subagent.

This feature covers the proposal stage of the loop, where the evaluated agent can be changed only inside the packet-local runtime area and only after the control bundle has been read.

---

## 2. CURRENT REALITY

Candidate generation is delegated to `.opencode/agent/improve-agent.md`. That subagent requires five concrete inputs, reads the copied charter and manifest before writing, reads the canonical target and integration report, writes one candidate under `improvement/candidates/`, returns structured JSON metadata, and stops before scoring, benchmarking, promotion, or mirror synchronization begins.

The YAML workflows own when candidate generation happens. Autonomous mode runs the proposal step whenever the loop continues, while confirm mode adds an approval gate before dispatching the candidate writer. The packet-local boundary is strict in the shipped agent: canonical targets and runtime mirrors are explicit never-edit surfaces.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `.opencode/agent/improve-agent.md` | Proposal agent | Defines the proposal-only contract, required inputs, and runtime-only write boundary. |
| `.opencode/command/improve/assets/improve_improve-agent_auto.yaml` | Workflow | Dispatches the candidate-generation step on each autonomous iteration. |
| `.opencode/command/improve/assets/improve_improve-agent_confirm.yaml` | Workflow | Gates candidate generation behind operator approval in interactive mode. |
| `.opencode/skill/sk-improve-agent/SKILL.md` | Skill orchestration | Describes the bounded-candidate rule and the packet-local `candidates/` directory contract. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `.opencode/skill/sk-improve-agent/references/loop_protocol.md` | Reference | Documents the proposal-first sequence and runtime-only candidate path. |
| `.opencode/skill/sk-improve-agent/references/no_go_conditions.md` | Safety reference | Stops the loop when mutator and scorer boundaries blur or scope broadens. |

---

## 4. SOURCE METADATA

- Group: Evaluation loop
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--evaluation-loop/02-candidate-generation.md`
