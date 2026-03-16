---
title: "Malformed Rich Memory"
description: "Durable regression fixture for memory_save template-contract coverage."
trigger_phrases:
  - "template contract"
  - "historical remediation"
  - "memory save rejection"
  - "missing anchor scaffolding"
importance_tier: "normal"
contextType: "implementation"
---

# Malformed Rich Memory

## SESSION SUMMARY

| **Meta Data** | **Value** |
|:--------------|:----------|
| Total Messages | 4 |
| Fixture Type | new-149-manual |

## CONTINUE SESSION

Continue validating the `memory_save` rendered-memory contract with a fixture that is rich enough to satisfy the durable-memory gate while still failing structural template validation because the required anchor scaffolding was intentionally removed.

## PROJECT STATE SNAPSHOT

The handler is saving into a sandbox spec folder. This fixture captures concrete file roles, operator-visible save outcomes, and enough semantic detail to survive the shared insufficiency contract before the rendered-memory template contract blocks indexing.

## OVERVIEW

This regression fixture exists to prove that malformed rendered memories are rejected before indexing even when they contain concrete implementation evidence, file references, decisions, outcomes, and follow-up guidance.

## DETAILED CHANGES

### Key Files

| File | Role |
|------|------|
| `mcp_server/handlers/memory-save.ts` | Coordinates atomic save, sufficiency enforcement, template-contract validation, duplicate detection, and post-mutation feedback for the memory save path. |
| `shared/parsing/memory-template-contract.ts` | Defines the mandatory anchor and HTML id contract that malformed rendered memories must satisfy before indexing. |
| `scripts/memory/historical-memory-remediation.ts` | Repairs or quarantines already-written historical memories after the save path blocks malformed content. |

### Observation: rejection-before-index verification

Executed the save path with a durable fixture so the handler reaches the rendered-memory template contract and proves the rejection happens before any database rows, embeddings, or post-mutation feedback can be created.

## DECISIONS

- Decided to keep the save-time contract strict instead of letting remediation act as a fallback for malformed new memories.
- Chosen fixture content keeps concrete file, decision, and workflow evidence while intentionally omitting anchor scaffolding so template validation remains the only blocker.

## CONVERSATION

The operator requested proof that malformed rendered memories fail before write and index mutation, and that the later historical remediation pass still reports a clean final state for repairable sandbox cases.

## RECOVERY HINTS

- Restore the required ANCHOR comments and HTML ids before retrying `memory_save`.
- Re-run the remediation CLI with `--apply` and read the final canonical report files for operator-facing truth.

## MEMORY METADATA

```yaml
session_id: "spec010-new149-manual"
fixture_title: "Malformed Rich Memory"
```
