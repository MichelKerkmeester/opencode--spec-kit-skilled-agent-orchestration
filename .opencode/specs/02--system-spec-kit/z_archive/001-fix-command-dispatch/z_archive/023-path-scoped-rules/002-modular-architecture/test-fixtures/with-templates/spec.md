---
title: ".../001-fix-command-dispatch/z_archive/023-path-scoped-rules/002-modular-architecture/test-fixtures/with-templates/spec]"
description: "This fixture tests that template directories are excluded from validation."
trigger_phrases:
  - "spec"
  - "template"
  - "test"
  - "fixture"
  - "with"
  - "templates"
importance_tier: "important"
contextType: "planning"
---
<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Spec: Template Test Fixture

| Field       | Value                    |
|-------------|--------------------------|
| Level       | 1                        |
| Status      | Complete                 |
| Created     | 2024-12-25               |

<!-- ANCHOR:metadata -->
## Problem Statement

This fixture tests that template directories are excluded from validation.

<!-- /ANCHOR:metadata -->
<!-- ANCHOR:requirements -->
## Requirements

- Validate that templates/ folder is ignored
- Ensure placeholders in templates don't trigger errors
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:scope -->
## Scope

Test fixture only - not a real spec.
<!-- /ANCHOR:scope -->
