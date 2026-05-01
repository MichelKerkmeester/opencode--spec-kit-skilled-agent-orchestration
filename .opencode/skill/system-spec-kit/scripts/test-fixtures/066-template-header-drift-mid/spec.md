<!-- ANCHOR:overview -->
<!-- SPECKIT_TEMPLATE_SOURCE: test-fixture -->
# Mid-Doc Header Drift Fixture

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Active |
| **Created** | 2025-01-01 |

## Problem Statement

F-009-B4-04: This fixture introduces a custom H2 header in the middle of the document so the wrapper can classify it as `mid_document_extra_header` rather than discarding it.

## Custom Mid-Document Section

This header appears between two required sections and should surface as a warning when the test runs against a level-aware template.

## Out of Scope

This is the trailing required-shape section.
<!-- /ANCHOR:overview -->
