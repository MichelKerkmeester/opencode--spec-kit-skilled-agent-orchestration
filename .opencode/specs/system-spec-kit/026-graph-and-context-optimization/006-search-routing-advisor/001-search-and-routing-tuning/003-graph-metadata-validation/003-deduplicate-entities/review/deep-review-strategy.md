# Deep Review Strategy

## Topic

Deep review of `003-deduplicate-entities`, including packet docs, generated metadata, and referenced graph metadata parser/test surfaces.

## Review Dimensions

- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Files Under Review

| File | Role |
|------|------|
| `spec.md` | Packet scope and key file claim |
| `plan.md` | Implementation plan and verification expectations |
| `tasks.md` | Completion ledger |
| `checklist.md` | Completion evidence |
| `decision-record.md` | Collision-policy ADR |
| `implementation-summary.md` | Closeout and continuity surface |
| `description.json` | Memory search packet metadata |
| `graph-metadata.json` | Graph metadata surface |
| `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` | Referenced implementation |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts` | Referenced regression coverage |
| `.opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-integration.vitest.ts` | Referenced verification suite |

## Cross-Reference Status

| Protocol | Level | Status | Notes |
|----------|-------|--------|-------|
| `spec_code` | core | partial | Main helper exists, but packet cap claims and line anchors drift from runtime. |
| `checklist_evidence` | core | partial | Checklist evidence overstates the 16-entity cap and relies on out-of-packet corpus evidence. |
| `feature_catalog_code` | overlay | partial | Operator docs now describe dedupe generally, while this packet still contains stale local claims. |
| `playbook_capability` | overlay | partial | No direct playbook contradiction found; metadata hygiene issues remain. |

## Non-Goals

- No production code edits.
- No changes outside `review/**`.
- No git staging or commit operations.

## Stop Conditions

- Stop after 10 iterations or legal convergence.
- P0 would block convergence. No P0 findings were found.
- Max iteration stop was used to satisfy the requested 10-iteration pass.

## Active Findings

- F001 P1 traceability: `description.json` parentChain still points at `010-search-and-routing-tuning`.
- F002 P1 correctness: packet says the 16-entity cap is preserved, but parser/test behavior is 24.
- F003 P2 maintainability: packet graph metadata contains mixed-format duplicate key_file references.
- F004 P2 maintainability: packet graph metadata contains stop-word entity slots.
- F005 P2 traceability: continuity `next_safe_action` is stale after closeout.
- F006 P2 traceability: spec/plan line anchors for `deriveEntities()` are stale.
