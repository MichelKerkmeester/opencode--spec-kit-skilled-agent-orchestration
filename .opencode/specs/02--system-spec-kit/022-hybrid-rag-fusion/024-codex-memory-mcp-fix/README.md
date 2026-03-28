---
title: "024 Codex Memory MCP Fix"
description: "Packet overview for the completed retroactive Codex spec_kit_memory MCP remediation slice and its broader follow-on recommendations."
trigger_phrases:
  - "packet 024 overview"
  - "codex memory mcp fix packet"
  - "spec_kit_memory remediation readme"
contextType: "implementation"
---
# 024 Codex Memory MCP Fix

This packet now documents the landed Codex-facing `spec_kit_memory` MCP remediation slice across both startup stabilization and the in-session DB-isolation fix for `initializeDb(':memory:')` / custom-path flows, while keeping the next broader remediation recommendations visible without rewriting `020-pre-release-remediation`.

## Current State

- Packet authoring and packet-local verification: complete.
- Codex remediation slice: green and recorded here, including startup stabilization plus the vector-index-store DB-isolation fix that promotes custom or `:memory:` connections to the active shared DB.
- Broader `022` remediation: still open, but tracked here only as follow-on recommendations outside this packet's completion gate.

## Packet Contents

- `spec.md` - scope, requirements, risks, and user stories
- `plan.md` - execution strategy and validation plan
- `tasks.md` - retroactive completed work plus recorded follow-on recommendations
- `checklist.md` - packet-local completion and verification state
- `decision-record.md` - why `024` exists instead of expanding `020`
- `implementation-summary.md` - what the landed remediation and packet truth-sync update delivered
- `description.json` - packet identity and indexing metadata

## Related Packets

- `../020-pre-release-remediation/` - broader remediation source of truth
- `../021-ground-truth-id-remapping/` - adjacent follow-on packet in the same tree
- `../022-spec-doc-indexing-bypass/` - nearby spec-doc indexing context

## Use This Packet When

- You need to resume Codex-specific memory MCP work.
- You need the verified startup-fix and DB-isolation-fix context without re-reading the entire `020` packet.
- You want the recorded next-wave recommendations for runtime, docs, or release-control follow-up.

## Do Not Use This Packet To

- Claim that the entire `022-hybrid-rag-fusion` program is complete.
- Replace the canonical `020` review artifacts.
- Assume the recorded follow-on recommendations have already landed in runtime code.

## Verification Entry Point

Run:

```bash
bash .opencode/skill/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/02--system-spec-kit/022-hybrid-rag-fusion/024-codex-memory-mcp-fix \
  --no-recursive
```

Then use `tasks.md` to decide whether the next implementation or docs wave belongs in a new packet.
