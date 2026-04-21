# Deep Review Strategy

## Topic

Deep review of `008-deep-skill-feature-catalogs`, focused on the spec packet and the three referenced skill feature catalogs.

## Review Dimensions

- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

## Files Under Review

| File | Role |
|---|---|
| `spec.md` | Feature scope, success criteria, declared status |
| `plan.md` | Implementation approach and pattern sources |
| `tasks.md` | Completion state |
| `checklist.md` | Verification gate definitions |
| `description.json` | Memory-search description metadata |
| `graph-metadata.json` | Graph and source-doc metadata |
| `.opencode/skill/sk-deep-research/feature_catalog/feature_catalog.md` | Referenced output catalog |
| `.opencode/skill/sk-deep-review/feature_catalog/feature_catalog.md` | Referenced output catalog |
| `.opencode/skill/sk-improve-agent/feature_catalog/feature_catalog.md` | Referenced output catalog |
| `.opencode/skill/system-spec-kit/mcp_server/skill-advisor/feature_catalog/feature_catalog.md` | Current skill-advisor pattern source |
| `.opencode/skill/sk-doc/assets/documentation/feature_catalog/feature_catalog_template.md` | Catalog root template |
| `.opencode/skill/sk-doc/references/specific/feature_catalog_creation.md` | Catalog creation standards |

## Cross-Reference Status

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial | Catalogs exist, but packet status/count claims lag current artifacts. |
| `checklist_evidence` | partial | Checklist remains unchecked and no implementation summary exists. |
| `feature_catalog_code` | partial | Target catalogs exist; pattern-source path is stale. |
| `playbook_capability` | skipped | No manual playbook is in scope for this spec packet. |

## Non-Goals

- No edits outside `review/**`.
- No production code or catalog remediation.
- No git operations.

## Stop Conditions

- Max iteration count reached.
- P0 discovery requiring immediate halt.
- User pause sentinel.

## Next Focus

Synthesis is complete. Remediation should update the packet docs and metadata before claiming completion.
