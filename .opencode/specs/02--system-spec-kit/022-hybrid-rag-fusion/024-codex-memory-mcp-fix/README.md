---
title: "024 Codex Memory MCP Fix"
description: "Packet overview for the retroactive Codex spec_kit_memory MCP remediation slice and its broader follow-up backlog."
trigger_phrases:
  - "packet 024 overview"
  - "codex memory mcp fix packet"
  - "spec_kit_memory remediation readme"
contextType: "implementation"
---
# 024 Codex Memory MCP Fix

This packet retroactively documents the landed Codex-facing `spec_kit_memory` MCP startup fix and keeps the next broader remediation steps visible without rewriting `020-pre-release-remediation`.

## Current State

- Codex startup slice: green and recorded here.
- Follow-up caveat fix: green and recorded here.
- Broader `022` remediation: still open and still anchored by `020-pre-release-remediation`.

## Packet Contents

- `spec.md` - scope, requirements, risks, and user stories
- `plan.md` - execution strategy and validation plan
- `tasks.md` - retroactive completed work plus broader remediation to-do items
- `checklist.md` - packet-local verification state
- `decision-record.md` - why `024` exists instead of expanding `020`
- `implementation-summary.md` - what this packet creation turn delivered
- `description.json` - packet identity and indexing metadata

## Related Packets

- `../020-pre-release-remediation/` - broader remediation source of truth
- `../021-ground-truth-id-remapping/` - adjacent follow-on packet in the same tree
- `../022-spec-doc-indexing-bypass/` - nearby spec-doc indexing context

## Use This Packet When

- You need to resume Codex-specific memory MCP work.
- You need the verified startup-fix context without re-reading the entire `020` packet.
- You want the next actionable backlog for runtime, docs, or release-control follow-up.

## Do Not Use This Packet To

- Claim that the entire `022-hybrid-rag-fusion` program is complete.
- Replace the canonical `020` review artifacts.
- Assume pending backlog items have already landed.

## Verification Entry Point

Run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix \
  --no-recursive
```

Then use `tasks.md` as the resume checklist for the next implementation wave.
