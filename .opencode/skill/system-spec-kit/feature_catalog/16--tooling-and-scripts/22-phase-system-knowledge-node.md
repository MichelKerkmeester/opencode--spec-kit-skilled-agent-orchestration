---
title: "Phase-System Knowledge Node"
description: "Knowledge node and supporting command/script surface for decomposing complex Spec Kit work into parent-child phase folders with scoring, lifecycle guidance, and recursive validation."
---

# Phase-System Knowledge Node

## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. CURRENT REALITY](#2--current-reality)
- [3. SOURCE FILES](#3--source-files)
- [4. SOURCE METADATA](#4--source-metadata)

## 1. OVERVIEW

Phase-System Knowledge Node is the condensed reference layer for Spec Kit's phase decomposition workflow.

It explains when work should stay in a single spec folder and when it should split into independently tracked child phases. The node frames phases as a behavioral overlay on documentation levels rather than a replacement for them: levels describe documentation depth, while phases describe decomposition of large or risky work into ordered work streams. The node also points readers from the compact summary into the real command, scoring, creation, and validation surfaces that make the phase system executable.

---

## 2. CURRENT REALITY

The node currently summarizes a phase system that is implemented across documentation references, slash-command workflow contracts, shell scripts, and validation rules.

At the knowledge-node level, `nodes/phase-system.md` captures the operator-facing model: phasing is suggested only when both thresholds are met, meaning a phase complexity score of at least 25 out of 50 and a recommended documentation level of at least 3. It documents the five scoring dimensions, suggested phase-count ranges, lifecycle stages, phase-status values, command/script entry points, and the expected parent/child folder topology.

That summary is backed by a deeper reference and executable tooling. `references/structure/phase_definitions.md` expands the taxonomy, folder conventions, phase map/back-reference requirements, and recursive validation expectations. `/spec_kit:plan :with-phases` (or `/spec_kit:complete :with-phases`) is the user-facing entry point that drives phase decomposition workflows via optional pre-workflow steps in the plan and complete YAML assets. `create.sh` implements the actual parent-plus-child folder creation path via `--phase`, `--phases`, `--phase-names`, and `--parent`. `recommend-level.sh` calculates both documentation level and the separate default-on phase recommendation fields, while `validate.sh --recursive` and the `PHASE_LINKS` rule check whether a phased packet is structurally coherent.

The current system is therefore not just descriptive documentation. The node is a compact retrieval surface for a live workflow that can recommend phasing, create phased structures, append phases to existing parents, and validate parent/child linkage across a decomposed spec packet.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skill/system-spec-kit/nodes/phase-system.md` | Knowledge node | Compact summary of phase applicability, scoring, lifecycle, folder structure, and command/script entry points |
| `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` | Reference | Full phase taxonomy, thresholds, parent/child conventions, and lifecycle rules |
| `.opencode/command/spec_kit/phase.md` | Command | Operator workflow contract for phase decomposition and next-step routing |
| `.opencode/skill/system-spec-kit/scripts/spec/create.sh` | Script | Creates phased parent/child spec structures and supports append mode for existing parents |
| `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | Script | Computes documentation-level scoring plus the separate phase recommendation and suggested phase count |
| `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` | Script | Runs recursive validation across a phase parent and its child folders |
| `.opencode/skill/system-spec-kit/scripts/rules/check-phase-links.sh` | Validation rule | Enforces parent back-references, phase-map presence, and predecessor/successor link consistency |

---

## 4. SOURCE METADATA

- Group: Tooling and Scripts
- Source feature title: Phase-System Knowledge Node
- Source spec: Deep research remediation 2026-03-26
- Current reality source: direct audit of the node, phase reference, phase command, and supporting script/validation surfaces
