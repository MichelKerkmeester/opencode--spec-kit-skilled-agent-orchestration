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
# Spec: Invalid Anchors Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 1                        |
| Status      | Active                   |
| Created     | 2024-12-25               |

## Problem Statement

This fixture tests detection of malformed ANCHOR tags.

## Requirements

- Validator must catch unclosed anchors
- Validator must catch mismatched anchor IDs
- Validator must catch orphaned closing tags

## Scope

Test fixture for invalid anchor detection.
