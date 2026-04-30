---
title: "Initialization"
description: "Creates the canonical deep-review packet and seeds the first review charter."
---

# Initialization

## 1. OVERVIEW

Creates the canonical deep-review packet and seeds the first review charter.

This phase turns a requested review target into a working `review/` packet. It decides whether the run is fresh or resumable, resolves scope, orders review dimensions, selects applicable traceability protocols, and writes the initial packet files the loop depends on.

## 2. CURRENT REALITY

Initialization begins by classifying the prior state as `fresh`, `resume`, `completed-session`, or `invalid-state`. A valid new run creates `review/iterations/`, resolves the target according to one of the five target types, and writes the canonical packet under `{spec_folder}/review/`.

The initializer also applies the live four-dimension priority order: correctness first, security second, traceability third, maintainability fourth. It creates `deep-review-config.json`, seeds the first `deep-review-state.jsonl` config record, creates an empty reducer-owned findings registry, and populates `deep-review-strategy.md` with topic, dimensions, files under review, cross-reference status, known context, and review boundaries.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `SKILL.md` | Skill contract | Describes the 3-layer architecture, packet location, lifecycle modes, and required packet files. |
| `references/loop_protocol.md` | Protocol | Defines Phase 1 initialization, target resolution, dimension ordering, protocol planning, and init outputs. |
| `references/state_format.md` | Schema | Defines the config file fields, initial JSONL config record, registry shape, and file protection rules. |
| `assets/deep_review_strategy.md` | Template | Supplies the strategy sections populated during initialization. |
| `assets/review_mode_contract.yaml` | Contract | Declares target types, dimensions, lineage fields, outputs, and reducer IO. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md` | Manual scenario | Exercises the happy-path initialization flow and packet creation. |
| `manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md` | Manual scenario | Verifies resume classification from a valid prior packet. |
| `manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md` | Manual scenario | Confirms contradictory state halts instead of being guessed into shape. |
| `manual_testing_playbook/02--initialization-and-state-setup/007-scope-discovery-and-dimension-ordering.md` | Manual scenario | Checks target resolution, dimension ordering, and initial strategy content. |

---

## 4. SOURCE METADATA

- Group: Loop lifecycle
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--loop-lifecycle/01-initialization.md`
- Primary sources: `SKILL.md`, `references/loop_protocol.md`, `references/state_format.md`, `assets/deep_review_strategy.md`, `assets/review_mode_contract.yaml`
