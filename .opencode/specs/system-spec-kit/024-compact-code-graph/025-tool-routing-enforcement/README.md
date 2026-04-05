---
title: "Phase 025: Tool Routing Enforcement"
description: "Fix root cause of AI tool misjudgment — enforce CocoIndex and Code Graph usage across hook-compatible and non-hook CLIs."
trigger_phrases:
  - "tool routing enforcement"
  - "phase 025"
  - "cocoindex enforcement"
importance_tier: "critical"
contextType: "implementation"
---
# Phase 025: Tool Routing Enforcement

## Overview

Eliminates AI tool misjudgment by adding active enforcement at three MCP enforcement points — server instructions, session priming, and tool response hints — so that ALL CLIs route to the correct search tool.

## Problem

AI defaults to Grep/Glob for code searches even when CocoIndex (semantic) and Code Graph (structural) are available. Root cause: passive "MUST use" instructions in CLAUDE.md compete with built-in AI tool preferences. No active enforcement exists at the MCP layer.

## Documentation Level: 3

| File | Status |
|------|--------|
| spec.md | Complete |
| plan.md | Complete |
| tasks.md | Complete (30 items) |
| checklist.md | Complete |
| decision-record.md | Complete (4 decisions) |
| implementation-summary.md | Pending (post-implementation) |

## Estimated LOC: 250-350
## Risk: LOW — additive enforcement, no functional changes to search tools
