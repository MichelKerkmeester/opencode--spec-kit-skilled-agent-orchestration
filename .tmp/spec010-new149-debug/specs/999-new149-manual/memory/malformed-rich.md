---
title: "Malformed Rich Memory"
description: "Rich rendered-memory fixture for validating template-contract rejection before indexing."
trigger_phrases:
  - "template contract"
  - "historical remediation"
  - "memory save rejection"
importance_tier: "important"
contextType: "implementation"
---

# Malformed Rich Memory

**Summary:** Verified the rendered-memory contract should reject structurally malformed files before write or index mutation, even when the narrative evidence is otherwise durable and specific.

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Total Messages | 6 |
| Tool Executions | 4 |
| Decisions Made | 2 |

## CONTINUE SESSION

Continue validating `mcp_server/handlers/memory-save.ts`, `shared/parsing/memory-template-contract.ts`, and `scripts/memory/historical-memory-remediation.ts` so the rejection reason stays structural instead of semantic.

## PROJECT STATE SNAPSHOT

The fixture is intentionally rich on files, commands, outcomes, and operator intent so sufficiency can pass while the template contract fails on missing anchor scaffolding.

## 2. DECISIONS

- Keep `memory_save` strict about rendered-memory structure.
- Reject malformed files before DB writes or embedding work begin.

## 3. CONVERSATION

The operator requested proof that malformed rendered memories fail before indexing and that historical remediation can still repair structurally-fixable memories in a later maintenance pass.

## RECOVERY HINTS

- Restore the required ANCHOR comments and HTML ids before retrying save.
- Use historical remediation only for already-written memories, not as a bypass for save-time contract failures.

## MEMORY METADATA

```yaml
session_id: "spec010-new149-manual"
```