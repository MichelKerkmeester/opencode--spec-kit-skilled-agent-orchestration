---
title: "Spec: Missing Evidence Fixture [missing-evidence/spec]"
description: "This fixture tests detection of missing evidence on completed items."
trigger_phrases:
  - "spec"
  - "missing"
  - "evidence"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Missing Evidence Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 2                        |
| Status      | Active                   |
| Created     | 2024-12-25               |

<!-- ANCHOR:metadata -->
## Problem Statement

This fixture tests detection of missing evidence on completed items.

<!-- /ANCHOR:metadata -->
## Requirements

- Validator must catch P0 completed items without evidence
- Validator must catch P1 completed items without evidence

## Scope

Test fixture for missing evidence detection.
