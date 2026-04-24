---
title: "Checklist [system-spec-kit/z_future/hybrid-rag-fusion-upgrade/002-hybrid-rag-adoption/003-save-ergonomics/checklist]"
description: "checklist document for 003-save-ergonomics."
trigger_phrases:
  - "checklist"
  - "003"
  - "save"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: 003-save-ergonomics

## P0
- [ ] `generate-context.js` remains the save authority.
- [ ] JSON-primary input modes are explicit.
- [ ] Explicit CLI target precedence is preserved.

## P1
- [ ] Save ergonomics reference `memory_save` preflight and dry-run behavior.
- [ ] Direct-folder and markdown-first save modes are rejected as authorities.

