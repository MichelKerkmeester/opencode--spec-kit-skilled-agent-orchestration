---
title: "Stress Test Template Pack"
description: "Findings rubric and report templates used by the stress-test cycle in `.opencode/skill/system-spec-kit/manual_testing_playbook/14--stress-testing/`."
---

# Stress Test Template Pack

This folder ships the canonical templates for stress-test reporting under `system-spec-kit`. Operators copy these templates when running a stress-test cycle and emit findings against the rubric defined in `findings-rubric.schema.md`.

---

## Quick Start

1. Copy `findings.template.md` to your packet's `findings.md`.
2. Copy `findings-rubric.template.json` to your packet's `findings-rubric.json` and adapt the rubric to the stress scope.
3. Reference `findings-rubric.schema.md` for the rubric contract (severity dimensions, scoring fields).

---

## Files

| File | Role |
|---|---|
| `findings-rubric.schema.md` | Authoritative schema describing how a stress-test findings rubric is shaped. |
| `findings-rubric.template.json` | JSON skeleton operators copy and adapt per cycle. |
| `findings.template.md` | Markdown report skeleton operators populate during a cycle. |

---

## When to Use

Use this template pack only when running the `system-spec-kit` stress-test cycle (see `manual_testing_playbook/14--stress-testing/`). Do not repurpose for general findings reports — stress-test rubrics are domain-specific (failure-injection, pipeline-architecture stress, observability gaps).

---

## Related

- `manual_testing_playbook/14--stress-testing/01-run-stress-cycle.md` — execution playbook
- `feature_catalog/14--pipeline-architecture/26-stress-test-cycle.md` — feature catalog entry
