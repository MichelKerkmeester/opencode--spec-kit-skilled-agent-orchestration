---
title: "283 -- Skill graph status"
description: "Manual scenario for validating skill_graph_status health output."
---

# 283 -- Skill graph status

## 1. OVERVIEW

Validate that `skill_graph_status` reports live skill graph totals, staleness,
families, categories, schema versions, validation, and DB status.

## 2. SCENARIO CONTRACT

- **Objective**: Confirm the status tool returns a non-error health payload.
- **Prerequisites**: MCP server built and running.
- **Prompt**: `Call skill_graph_status({}) and verify totalSkills, totalEdges, staleness, validation, and dbStatus are present. Return pass/fail with evidence.`
- **Expected signals**: Tool response includes `totalSkills`, `totalEdges`, and `dbStatus`.
- **Pass/fail criteria**: PASS when status fields are present and no handler error occurs.

