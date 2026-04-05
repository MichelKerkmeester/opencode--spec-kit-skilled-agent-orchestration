---
title: ".../001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/valid-evidence/spec]"
description: "This fixture tests that completed P0/P1 items have evidence."
trigger_phrases:
  - "spec"
  - "valid"
  - "evidence"
  - "fixture"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Valid Evidence Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 2                        |
| Status      | Active                   |
| Created     | 2024-12-25               |

<!-- ANCHOR:metadata -->
## Problem Statement

This fixture tests that completed P0/P1 items have evidence.

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:requirements -->
## Requirements

- All completed P0 items must have [EVIDENCE:] tags
- All completed P1 items must have [EVIDENCE:] tags
- P2 items do not require evidence
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## Scope

Test fixture for evidence validation.
<!-- /ANCHOR:scope -->
