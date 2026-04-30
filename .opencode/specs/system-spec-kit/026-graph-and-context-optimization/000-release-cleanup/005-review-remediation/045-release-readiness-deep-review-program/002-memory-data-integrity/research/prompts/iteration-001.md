## Packet 045/002: memory-data-integrity — Deep-review angle 2 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/045-release-readiness-deep-review-program/002-memory-data-integrity/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-bulk-delete.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-retention-sweep.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-index-scan.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/`
- `.opencode/skill/system-spec-kit/mcp_server/lib/memory/`
- `.opencode/skill/system-spec-kit/mcp_server/db/`

### Audit dimensions (standard 4) + integrity-specific questions

For correctness: does memory_save → memory_index DB row → FTS index → vector index sync correctly under concurrent writes? Does the retention sweep race-corrupt indexes? Does FTS rebuild stay in sync with row deletions?

For security: governance enforcement (provenanceActor/Source/tenantId); SQL injection paths; transaction boundaries; isolation between tenants.

For traceability: audit trail for retention deletions; causal-graph link inference is observable; DB lineage tracking.

For maintainability: schema migrations have rollback paths; transaction discipline is consistent; error paths cleanly rollback partial state.

### Specific questions

- Does `memory_retention_sweep` correctly remove FTS + vector entries for deleted rows? (referential integrity)
- Are there race conditions between `memory_save` (insert) and `memory_retention_sweep` (delete)? Test fixtures should cover this.
- Does the embedding cache invalidate correctly when a row is deleted?
- What happens if a memory_save partially succeeds (DB row written but FTS insert fails)? Are there orphan rows?
- Does `memory_health` accurately report DB consistency state?

### Read also

- 033 retention sweep tests
- `mcp_server/stress_test/memory/` (post-038 dedicated stress tests)
- `mcp_server/lib/governance/scope-governance.ts`

### Output

Same 9-section review-report.md format as 045/001. Severity rubric: P0=data loss/corruption/silent inconsistency, P1=fixable contract drift, P2=cleanup.

### Packet structure (Level 2)

Same 7-file structure under this packet folder. Deps include 045 phase parent.

**Trigger phrases**: `["045-002-memory-data-integrity","memory data integrity","DB consistency audit","retention sweep correctness"]`.

**Causal summary**: `"Deep-review angle 2: memory subsystem data integrity — DB consistency, FTS/vector index sync, retention sweep correctness, race-condition resilience, governance enforcement."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Honor evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
