---
title: "Spec: Invalid Anchors Fixture [invalid-anchors/spec]"
description: "This fixture tests detection of malformed ANCHOR tags."
trigger_phrases:
  - "spec"
  - "invalid"
  - "anchors"
  - "fixture"
importance_tier: "important"
contextType: "decision"
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
## Requirements

- Validator must catch unclosed anchors
- Validator must catch mismatched anchor IDs
- Validator must catch orphaned closing tags

## Scope

Test fixture for invalid anchor detection.
