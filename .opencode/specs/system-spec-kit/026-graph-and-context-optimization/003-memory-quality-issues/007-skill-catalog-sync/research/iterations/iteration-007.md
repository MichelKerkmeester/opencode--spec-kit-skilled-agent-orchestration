---
title: "Review Iteration 007: memory commands"
description: "Phase 7 drift audit of memory command docs against the post-Phase-6 memory-save baseline"
trigger_phrases:
  - "phase 7 review iteration 007"
  - "memory command drift"
  - "memory save command audit"
importance_tier: important
contextType: "research"
---

# Review Iteration 007: memory commands

## Surface Audited
- `.opencode/command/memory/save.md`
- `.opencode/command/memory/search.md`
- `.opencode/command/memory/manage.md`
- `.opencode/command/memory/learn.md`

## Findings

### P0 — must update before Sub-PR-14 ships
- **F007.1** — `memory/save.md` Step 5 command table shows an incomplete save command
  - **Location**: `.opencode/command/memory/save.md:303-305`
  - **Stale content**: ``| **JSON File** (standard) | `node generate-context.js ${TMPDIR:-/tmp}/save-context-data.json` |``
  - **Why stale**: The table omits both the repository-relative script path and the spec-folder argument, while the authoritative example immediately below uses the full `scripts/dist/memory/generate-context.js` path and a temp JSON file. As written, the table command is not directly runnable from this repo workflow.
  - **Required update**: Replace the table command with the full repo-relative runtime command or explicitly mark it as a shortened placeholder.

### P1 — should update; defer only with rationale
- **F007.2** — Example tool-call transcript still describes `generate-context.ts` as the CLI entry point
  - **Location**: `.opencode/command/memory/save.md:279-280`
  - **Stale content**: ``"inputSummary": "Read generate-context.ts", "outputSummary": "612 lines, CLI entry point"``
  - **Why stale**: The command’s own workflow is built around the runtime `.js` entrypoint. Keeping the transcript example on `.ts` makes the canonical surface look split between source and executable naming.
  - **Required update**: Update the example transcript to refer to the runtime save entrypoint or clarify that it is reading the source file behind the runtime command.

## Negative Cases (confirmed still accurate)
- `.opencode/command/memory/save.md:313-323` already shows the correct temp-file pattern with the full repo-relative `generate-context.js` path.
- `.opencode/command/memory/save.md:311-313` correctly preserves the `/tmp/save-context-data.json` intermediate-file exception for JSON-mode saves.

## Confidence
**0.96** — Audited all four memory command docs and found actionable drift only in `save.md`. The two findings were verified directly against the surrounding correct examples in the same command.

## Cross-Surface Notes
- This surface matches the broader `generate-context.ts` fossil theme, with one additional operator-facing issue: the top-line command summary became too abbreviated to be safely runnable.
