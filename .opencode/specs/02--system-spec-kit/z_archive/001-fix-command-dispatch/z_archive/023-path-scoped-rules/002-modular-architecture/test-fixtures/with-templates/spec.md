---
title: "Spec: Template Test Fixture [with-templates/spec]"
description: "This fixture tests that template directories are excluded from validation."
trigger_phrases:
  - "spec"
  - "template"
  - "test"
  - "fixture"
  - "with"
  - "templates"
importance_tier: "important"
contextType: "decision"
---
# Spec: Template Test Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 1                        |
| Status      | Complete                 |
| Created     | 2024-12-25               |

## Problem Statement

This fixture tests that template directories are excluded from validation.

## Requirements

- Validate that templates/ folder is ignored
- Ensure placeholders in templates don't trigger errors

## Scope

Test fixture only - not a real spec.
