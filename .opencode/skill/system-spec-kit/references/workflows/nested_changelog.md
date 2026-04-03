---
title: Nested Changelog Workflow
description: Generate packet-local changelog files for spec roots and phase child folders.
---

# Nested Changelog Workflow

Packet-local changelogs capture completion state inside a spec folder instead of the global `.opencode/changelog/` release stream.

## When To Use

- A root spec folder needs a local changelog history beside `implementation-summary.md`
- A phase child folder needs a packet-local changelog entry in the parent `changelog/` folder
- `/spec_kit:complete` or `/spec_kit:implement` finishes work on a root packet or phase child

## Generator

```bash
node .opencode/skill/system-spec-kit/scripts/dist/spec-folder/nested-changelog.js <spec-folder> --write
```

### Modes

| Mode | Detected when | Output |
|---|---|---|
| `root` | The target folder is a spec root | `<spec-folder>/changelog/changelog-<packet>-root.md` |
| `phase` | The target folder is a direct phase child | `<parent-spec>/changelog/changelog-<packet>-<phase-folder>.md` |

## Evidence Stack

The generator prefers these sources, in order:

1. `implementation-summary.md`
2. `tasks.md`
3. `checklist.md`
4. `decision-record.md`
5. `spec.md`

It derives summary, change bullets, verification notes, files changed, and follow-ups from the available packet evidence. Root changelogs also roll up direct child phase folders when they exist.

## Canonical Templates

- `templates/changelog/root.md`
- `templates/changelog/phase.md`

Use these templates for packet-local changelog generation. Do not reuse the global `.opencode/command/create/assets/changelog_template.md` for nested packet output.
