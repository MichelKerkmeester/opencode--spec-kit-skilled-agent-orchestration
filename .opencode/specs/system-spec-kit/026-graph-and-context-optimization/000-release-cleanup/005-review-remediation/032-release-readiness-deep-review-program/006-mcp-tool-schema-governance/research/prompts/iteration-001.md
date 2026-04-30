## Packet 045/006: mcp-tool-schema-governance — Deep-review angle 6 (release-readiness)

### CRITICAL: Spec folder path

The packet folder for THIS audit is: `specs/system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/032-release-readiness-deep-review-program/006-mcp-tool-schema-governance/` — write ALL packet files (spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md, description.json, graph-metadata.json, review-report.md) under that path. Do NOT ask for the spec folder; use this exact path.

READ-ONLY deep-review audit. Output: `review-report.md` with severity-classified P0/P1/P2 findings.

### Target surface

- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` (canonical TOOL_DEFINITIONS)
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts` (Zod input schemas)
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts` (dispatcher)
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` (tool dispatch)

### Audit dimensions + schema-specific questions

For correctness: every TOOL_DEFINITIONS entry has a matching Zod schema; every handler's input matches the schema's parsed type. SPECKIT_STRICT_SCHEMAS=on rejects hallucinated parameters.

For security: governed-ingest enforcement (provenanceActor/Source/tenantId required when applicable); no schema bypass via unparsed/forwarded fields; SQL injection paths through schema fields validated.

For traceability: schema validation errors are operator-actionable; rejection logs name the offending field.

For maintainability: schemas live in one canonical place per tool; no schema duplication that could drift.

### Specific questions

- Does every tool in `TOOL_DEFINITIONS` have a Zod schema? Walk the array; flag any tool without a corresponding schema.
- Is `SPECKIT_STRICT_SCHEMAS` enabled by default? What's the failure mode when off?
- Are there any tools that skip schema validation? (e.g., if `skipPreflight: true` is honored in production)
- Governed ingest: which tools require it? When is it enforced vs optional? Is the enforcement consistent?
- Tool count canonical: 50 in tool-schemas.ts + 4 in skill_advisor schemas = 54. Does opencode.json's binding match? Does the README claim match?
- Are there deferred / not-yet-wired tools mentioned anywhere that would inflate the count if accidentally enabled?

### Read also

- 042 README refresh (canonical tool-count source)
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/` (scope-governance + provenance)
- 033 `memory_retention_sweep` schema (recently added)
- 034 `advisor_rebuild` schema (recently added)

### Output

Same 9-section review-report.md format. Severity rubric: P0=schema bypass / governance bypass / silent inflation of tool count, P1=schema drift / inconsistent enforcement, P2=cleanup.

### Packet structure (Level 2)

Same 7-file structure. Deps include 045 phase parent.

**Trigger phrases**: `["045-006-mcp-tool-schema-governance","schema audit","governance enforcement review","tool count canonical"]`.

**Causal summary**: `"Deep-review angle 6: MCP tool schema strictness, governed-ingest enforcement, scope-governance, canonical tool count alignment across tool-schemas.ts / opencode.json / README / docs."`.

### Constraints

READ-ONLY. Strict validator must exit 0. Cite file:line. DO NOT commit. Evergreen-doc rule.

When done, last action: strict validator passing + review-report.md complete.
