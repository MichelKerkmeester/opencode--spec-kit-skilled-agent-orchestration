---
title: "003-save-ergonomics: Wrap JSON-Primary Save Authority"
description: "Defines wrapper ergonomics for saving context without changing Public's JSON-primary save authority."
---

# 003-save-ergonomics: Wrap JSON-Primary Save Authority

## 1. Scope
This sub-phase scopes human-friendly save ergonomics that still compile into `generate-context.js` and the existing `memory_save` path. It covers wrapper input shapes, explicit target precedence, and operator-facing guidance. It does not create a markdown-first save path or a second save backend.

## 2. Research Sources
- `001-research-hybrid-rag-fusion-systems/003-modus-memory-main/research/iterations/iteration-040.md:15-18`
- `001-research-hybrid-rag-fusion-systems/004-opencode-mnemosyne-main/research/iterations/iteration-039.md:224-235`
- `001-research-hybrid-rag-fusion-systems/005-mempalace/research/iterations/iteration-040.md:16-20`

## 3. Architecture Constraints
All save ergonomics must route through `generate-context.js --json/--stdin` and current save governance. Explicit CLI targets remain authoritative, and wrapper UX must not create a second memory authority or bypass preflight contracts.

## 4. Success Criteria
- The phase names the wrapper behavior that remains JSON-primary.
- The phase binds save ergonomics to the live `generate-context.js`, TypeScript source, and `memory_save` handler.
- The phase explicitly rejects markdown-first and direct-folder save modes as authorities.

## 5. Out of Scope
- Replacing `generate-context.js`.
- Allowing direct spec-folder mode as the primary save contract.
- Writing durable memory outside the current save governance path.
