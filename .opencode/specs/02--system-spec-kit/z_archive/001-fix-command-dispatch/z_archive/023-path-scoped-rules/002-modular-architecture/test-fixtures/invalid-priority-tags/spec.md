---
title: "Spec: Invalid Priority Tags Fixture [invalid-priority-tags/spec]"
description: "This fixture tests detection of improperly formatted priority tags."
trigger_phrases:
  - "spec"
  - "invalid"
  - "priority"
  - "tags"
  - "fixture"
importance_tier: "important"
contextType: "decision"
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Invalid Priority Tags Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 2                        |
| Status      | Active                   |
| Created     | 2024-12-25               |

<!-- ANCHOR:metadata -->
## Problem Statement

This fixture tests detection of improperly formatted priority tags.

<!-- /ANCHOR:metadata -->
## Requirements

- Validator must catch items without priority tags
- Validator must catch wrong checkbox formats

## Scope

Test fixture for invalid priority tag detection.
