---
title: "Packet README: Non-System Playbook Prompt Modernization"
description: "Quick packet overview for the Level 2 documentation rewrite plan covering 126 non-system manual testing playbook files."
---

# Packet README: Non-System Playbook Prompt Modernization

This packet plans a documentation-only rewrite of prompt and scenario-contract wording across five non-system manual testing playbook targets. It exists to satisfy repository spec requirements before any non-spec edits begin.

## Scope Snapshot

- **Spec Folder:** `.opencode/specs/skilled-agent-orchestration/044-non-system-playbook-prompts/`
- **Level:** 2
- **Targets:** 5
- **Scoped Files:** 126 markdown files

## Packet Documents

- `spec.md` — scope, requirements, success criteria, and Level 2 rationale
- `plan.md` — execution approach, work phases, and verification strategy
- `tasks.md` — ordered implementation checklist for the rewrite batch
- `checklist.md` — P0/P1/P2 verification gates for the documentation pass
- `implementation-summary.md` — current closeout status for this packet

## Boundary

This packet covers prompt modernization only for:

- `.opencode/skill/mcp-coco-index/manual_testing_playbook/`
- `.opencode/skill/sk-improve-agent/manual_testing_playbook/`
- `.opencode/skill/sk-deep-research/manual_testing_playbook/`
- `.opencode/skill/sk-deep-review/manual_testing_playbook/`
- `.opencode/skill/sk-doc/assets/documentation/testing_playbook/`

`system-spec-kit` manual testing playbooks and all runtime code are out of scope.
