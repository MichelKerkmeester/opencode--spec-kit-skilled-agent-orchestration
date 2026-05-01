<!-- ANCHOR:overview -->
<!-- SPECKIT_TEMPLATE_SOURCE: test-fixture -->

# Link Formats Fixture

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Active |
| **Created** | 2025-01-01 |

## Problem Statement

F-009-B4-01: This fixture exercises angle-bracket and reference-style markdown links to confirm `extract_markdown_link_targets` captures all four link formats.

## References

Inline:        [plan](plan.md)
Anchored:      [plan](plan.md#section)
Angle-bracket: [tasks](<tasks.md>)
Reference def: [helper]: ./helper.md

Absolute URLs (must be ignored): [home](https://example.com).

## Out of Scope

Reference link USE syntax `[label][ref]` is not a target itself; the target lives in the matching reference definition.

<!-- /ANCHOR:overview -->
