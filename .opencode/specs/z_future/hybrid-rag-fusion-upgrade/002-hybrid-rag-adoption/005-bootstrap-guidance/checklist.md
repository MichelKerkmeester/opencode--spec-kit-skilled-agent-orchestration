---
title: "Checklist [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/005-bootstrap-guidance/checklist]"
description: "checklist document for 005-bootstrap-guidance."
trigger_phrases:
  - "checklist"
  - "005"
  - "bootstrap"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: 005-bootstrap-guidance

## P0
- [ ] `session_bootstrap` remains the recovery authority.
- [ ] Startup guidance is additive, not a new command surface.
- [ ] Code-search and graph routing remain separate from memory bootstrap authority.

## P1
- [ ] The phase names `session-bootstrap.ts`, `memory-context.ts`, and `context-server.ts`.
- [ ] Formatter or profile ideas are explicitly bounded.

