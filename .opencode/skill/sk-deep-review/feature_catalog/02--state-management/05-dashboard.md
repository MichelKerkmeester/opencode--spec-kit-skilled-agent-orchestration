---
title: "Dashboard"
description: "Publishes the current review status as a machine-owned summary surface."
---

# Dashboard

## 1. OVERVIEW

Publishes the current review status as a machine-owned summary surface.

`deep-review-dashboard.md` is the packet's operator view. It turns the raw log and reducer state into a readable status page without becoming a manual editing surface that could drift from the underlying packet.

## 2. CURRENT REALITY

The dashboard is regenerated after every iteration from the JSONL log, strategy file, and findings registry. It reports the provisional verdict, findings summary, progress table, coverage state, trend signals, and active risks. In confirm mode it is surfaced at approval checkpoints, while in auto mode it is written for later inspection.

The dashboard is explicitly auto-generated and read-only. If generation fails, the loop logs a warning and keeps moving, which means the dashboard is important for visibility but not part of the legal-stop path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `assets/deep_review_dashboard.md` | Template | Provides the dashboard scaffold for generated review summaries. |
| `references/state_format.md` | Schema | Defines the dashboard location, inputs, sections, and overwrite rules. |
| `references/loop_protocol.md` | Protocol | Defines when the dashboard is regenerated and what it must summarize. |
| `assets/deep_review_strategy.md` | Template | Supplies the strategy inputs the dashboard reads for coverage and next-focus state. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/03--iteration-execution-and-state-discipline/013-review-dashboard-generation-after-iteration.md` | Manual scenario | Verifies dashboard generation after each iteration. |
| `manual_testing_playbook/04--convergence-and-recovery/022-blocked-stop-reducer-surfacing.md` | Manual scenario | Confirms blocked-stop and reducer output make it into status summaries. |

---

## 4. SOURCE METADATA

- Group: State management
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--state-management/05-dashboard.md`
- Primary sources: `assets/deep_review_dashboard.md`, `references/state_format.md`, `references/loop_protocol.md`, `assets/deep_review_strategy.md`
