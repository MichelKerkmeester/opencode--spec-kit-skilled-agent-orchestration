---
title: "CONTEXT (Reference Stub for Contextador Research)"
description: "Reference stub explaining the Contextador CONTEXT.md concept that the phase prompt cites. This file exists to satisfy validate.sh strict mode and is not a Contextador-style artifact."
trigger_phrases:
  - "contextador context.md"
  - "context artifact"
importance_tier: "normal"
contextType: "general"
---
# CONTEXT (Reference Stub for Contextador Research)

<!-- SPECKIT_LEVEL: 3 -->
<!-- Status: REFERENCE STUB (not a Contextador artifact) -->

## What This File Is

This file is a stub created so that validate.sh --strict in the 003-contextador phase folder does not flag references to "CONTEXT.md" inside `phase-research-prompt.md` as missing markdown files.

In Contextador (the system being researched in this phase), `CONTEXT.md` is the name of the Markdown artifact that Contextador's MCP server creates and queries. Contextador maps a codebase into a hierarchy of `CONTEXT.md` files and serializes structured pointers from those files when an agent asks a natural-language question.

## Why It Lives Here

- The phase prompt references `CONTEXT.md` multiple times when describing Contextador's behavior
- validate.sh --strict treats backticked .md references as wikilink-style file references
- Creating this stub keeps the validator clean without modifying the user-authored phase prompt or pretending Contextador's artifacts exist inside this repository

## What This File Is Not

- Not an actual Contextador `CONTEXT.md` artifact
- Not part of the research output (the canonical output is research/research.md)
- Not a description of any code in `Code_Environment/Public`

## Where to Look Instead

- Phase prompt: phase-research-prompt.md
- Research scaffold: spec.md, plan.md, tasks.md, checklist.md, decision-record.md
- Final research: research/research.md (populated during synthesis)
- Source under study: external/src/mcp.ts and the rest of the Contextador checkout
