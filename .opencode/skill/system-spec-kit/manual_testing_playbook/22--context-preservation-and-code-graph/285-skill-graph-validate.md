---
title: "285 -- Skill graph validate"
description: "Manual scenario for validating skill_graph_validate diagnostics."
---

# 285 -- Skill graph validate

## 1. OVERVIEW

Validate that `skill_graph_validate` reports schema, edge, relation-weight,
symmetry, and cycle diagnostics for the live skill graph.

## 2. SCENARIO CONTRACT

- **Objective**: Confirm validation diagnostics are operator-readable.
- **Prerequisites**: MCP server built and running.
- **Prompt**: `Call skill_graph_validate({}) and verify schema-version, broken-edge, relation-weight, symmetry, and cycle diagnostics are present. Return pass/fail with evidence.`
- **Expected signals**: Tool response reports validation categories and pass/warn/error state.
- **Pass/fail criteria**: PASS when diagnostics are present without an unhandled exception.

