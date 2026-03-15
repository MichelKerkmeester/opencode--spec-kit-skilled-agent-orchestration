---
title: "Spec: Valid Anchors Fixture [valid-anchors/spec]"
description: "This fixture tests properly paired ANCHOR tags in memory files."
trigger_phrases:
  - "spec"
  - "valid"
  - "anchors"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Valid Anchors Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 1                        |
| Status      | Complete                 |
| Created     | 2024-12-25               |

<!-- ANCHOR:metadata -->
## Problem Statement

This fixture tests properly paired ANCHOR tags in memory files.

<!-- /ANCHOR:metadata -->
## Requirements

- All ANCHOR tags must have matching closing tags
- Anchor IDs must be consistent between open and close

## Scope

Test fixture for anchor validation.
