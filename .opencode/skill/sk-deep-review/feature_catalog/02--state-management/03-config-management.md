---
title: "Config management"
description: "Defines the immutable review-packet contract for the current lineage."
---

# Config management

## 1. OVERVIEW

Defines the immutable review-packet contract for the current lineage.

`deep-review-config.json` fixes the core parameters for one deep-review run. It captures the target, the active lineage, the dimension and protocol scope, thresholds, protection rules, and reducer contract the rest of the packet must honor.

## 2. CURRENT REALITY

The config file is written during initialization and treated as immutable after that point. It records `mode: "review"`, the review target and target type, the four configured dimensions, session lineage fields, convergence settings, severity threshold, cross-reference sets, release-readiness state, status, and a file-protection map for every packet artifact.

The same document also declares reducer IO names and metric names, which makes it the reference point for lifecycle transitions and replay-safe packet interpretation. Resume and restart flows compare later packet files against this config instead of guessing from partial state.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/state_format.md` | Schema | Defines the config shape, default values, field meanings, and file protection levels. |
| `references/loop_protocol.md` | Protocol | Requires config creation at init and agreement checks on resume. |
| `assets/deep_review_config.json` | Template | Provides the config seed copied into the packet during initialization. |
| `assets/review_mode_contract.yaml` | Contract | Declares target types, dimensions, lifecycle fields, release-readiness states, and reducer IO reflected into config. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--initialization-and-state-setup/004-fresh-review-initialization-creates-canonical-state-files.md` | Manual scenario | Verifies config creation on a fresh run. |
| `manual_testing_playbook/02--initialization-and-state-setup/005-resume-classification-from-valid-prior-review-state.md` | Manual scenario | Checks lineage and resume behavior against an existing config. |
| `manual_testing_playbook/02--initialization-and-state-setup/006-invalid-or-contradictory-review-state-halts-for-repair.md` | Manual scenario | Confirms config disagreement blocks resume. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/03-config-management.md`
- Primary sources: `references/state_format.md`, `references/loop_protocol.md`, `assets/deep_review_config.json`, `assets/review_mode_contract.yaml`
