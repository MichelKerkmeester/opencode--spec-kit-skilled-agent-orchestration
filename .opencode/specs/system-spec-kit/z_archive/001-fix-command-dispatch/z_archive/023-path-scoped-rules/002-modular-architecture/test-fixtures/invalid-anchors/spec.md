---
title: "...001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/invalid-anchors/spec]"
description: "This fixture tests detection of malformed ANCHOR tags."
trigger_phrases:
  - "spec"
  - "invalid"
  - "anchors"
  - "fixture"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Invalid Anchors Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 1                        |
| Status      | Active                   |
| Created     | 2024-12-25               |

<!-- ANCHOR:metadata -->
## Problem Statement

This fixture tests detection of malformed ANCHOR tags.

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:requirements -->
## Requirements

- Validator must catch unclosed anchors
- Validator must catch mismatched anchor IDs
- Validator must catch orphaned closing tags
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## Scope

Test fixture for invalid anchor detection.
<!-- /ANCHOR:scope -->
