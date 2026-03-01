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
# Spec: Invalid Priority Tags Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 2                        |
| Status      | Active                   |
| Created     | 2024-12-25               |

## Problem Statement

This fixture tests detection of improperly formatted priority tags.

## Requirements

- Validator must catch items without priority tags
- Validator must catch wrong checkbox formats

## Scope

Test fixture for invalid priority tag detection.
