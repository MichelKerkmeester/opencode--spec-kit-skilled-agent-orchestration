**Directory Listing (Requested First)**
`/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/`
1. `01-feature-flag-governance.md`
2. `02-feature-flag-sunset-audit.md`
3. `03-hierarchical-scope-governance-governed-ingest-retention-and-audit.md`
4. `04-shared-memory-rollout-deny-by-default-membership-and-kill-switch.md`

Read and cross-checked:
- Prior audit summary: [implementation-summary.md#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/specs/02--system-spec-kit/022-hybrid-rag-fusion/007-code-audit-per-feature-catalog/017-governance/implementation-summary.md#L1)
- Catalog entries above
- Referenced `mcp_server` files + additional implementing files

**Feature 01 — Feature flag governance**
- File verification: Catalog explicitly states no dedicated source files ([01-feature-flag-governance.md#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/01-feature-flag-governance.md#L30)).
- Function verification: No function signatures documented in this entry.
- Flag defaults check: Not applicable in entry (process-control feature).
- Unreferenced files found: None required for this feature as documented.
- Behavioral accuracy: Matches process-level description (no runtime hard cap evidenced for “12 active scoring signals”).
- Verdict: **MATCH**

**Feature 02 — Feature flag sunset audit**
- File verification: Entry says “No dedicated source files” ([02-feature-flag-sunset-audit.md#L30](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/feature_catalog/17--governance/02-feature-flag-sunset-audit.md#L30)), but its claims are code-backed.
- Function verification:
  - `search-flags.ts` has **46 exported `is*` helpers** (line-level definitions include [search-flags.ts#L27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L27) through [search-flags.ts#L491](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L491)).
  - `isPipelineV2Enabled()` is absent in runtime; only historical test comment remains ([pipeline-v2.vitest.ts#L289](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts#L289)).
- Flag defaults check:
  - Deferred flags listed as default ON are consistent with `search-flags` docs + `isFeatureEnabled` default-on behavior ([search-flags.ts#L142](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L142), [search-flags.ts#L167](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L167), [search-flags.ts#L175](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L175), [search-flags.ts#L183](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L183), [search-flags.ts#L192](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L192), [rollout-policy.ts#L53](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts#L53)).
  - `SPECKIT_ABLATION` default OFF is correct ([ablation-framework.ts#L41](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts#L41)).
  - Drift: catalog says `ADAPTIVE_FUSION` remains an active operational knob, but runtime adaptive fusion is used without `SPECKIT_ADAPTIVE_FUSION` gating ([hybrid-search.ts#L789](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L789)); `SPECKIT_ADAPTIVE_FUSION` not found in runtime TS files.
- Unreferenced files found:
  - [search-flags.ts#L27](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts#L27)
  - [rollout-policy.ts#L53](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts#L53)
  - [ablation-framework.ts#L41](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/eval/ablation-framework.ts#L41)
  - [hybrid-search.ts#L789](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts#L789)
  - [learned-feedback.ts#L418](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/learned-feedback.ts#L418)
- Behavioral accuracy: Mostly accurate, but adaptive-fusion knob statement is stale.
- Verdict: **PARTIAL**

**Feature 03 — Hierarchical scope governance, governed ingest, retention, and audit**
- File verification (all listed files exist):
  - [scope-governance.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L1)
  - [retention.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts#L1)
  - [vector-index-schema.ts#L1078](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1078)
  - [memory-save.ts#L630](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L630)
  - [memory-governance.vitest.ts#L23](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/memory-governance.vitest.ts#L23)
- Function verification:
  - `validateGovernedIngest(input: GovernedIngestInput): GovernanceDecision` exists ([scope-governance.ts#L229](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L229)).
  - `runRetentionSweep(database, scope = {}, options?): RetentionSweepResult` exists ([retention.ts#L41](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts#L41)).
  - `ensureGovernanceTables(database): void` exists ([vector-index-schema.ts#L1078](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1078)).
- Flag defaults check:
  - Scope/governance guardrails default ON unless explicitly disabled ([scope-governance.ts#L151](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L151), [scope-governance.ts#L187](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L187), [scope-governance.ts#L199](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L199)).
  - `retention_policy` default `'keep'` in schema/migration ([scope-governance.ts#L234](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L234), [vector-index-schema.ts#L1063](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-schema.ts#L1063)).
- Unreferenced files found:
  - Retrieval path also enforces governance scope but is not cataloged: [memory-search.ts#L64](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts#L64), [stage1-candidate-gen.ts#L45](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L45), [stage1-candidate-gen.ts#L706](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L706).
  - Additional governance integration test not cataloged: [governance-e2e.vitest.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/governance-e2e.vitest.ts#L1).
- Behavioral accuracy:
  - Provenance enforcement with scoped identity is correct ([scope-governance.ts#L261](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L261), [scope-governance.ts#L264](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L264), [memory-save.ts#L643](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L643)).
  - Audit trail + retention integration is correct ([retention.ts#L98](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/retention.ts#L98), [scope-governance.ts#L338](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts#L338)).
- Verdict: **PARTIAL** (behavior matches, catalog under-references implementation surface)

**Feature 04 — Shared-memory rollout, deny-by-default membership, and kill switch**
- File verification (all listed files exist):
  - [shared-spaces.ts#L184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L184)
  - [shared-memory.ts#L213](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L213)
  - [lifecycle-tools.ts#L49](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts#L49)
  - [tool-schemas.ts#L353](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts#L353)
  - [tool-input-schemas.ts#L419](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts#L419)
  - [handlers/index.ts#L155](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts#L155)
  - [shared-spaces.vitest.ts#L33](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-spaces.vitest.ts#L33)
- Function verification:
  - `isSharedMemoryEnabled(database?: Database.Database): boolean` exists ([shared-spaces.ts#L184](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L184)).
  - `enableSharedMemory(database: Database.Database): void` exists ([shared-spaces.ts#L212](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L212)).
  - `handleSharedMemoryEnable(_args: Record<string, unknown>): Promise<MCPResponse>` exists and is re-exported ([shared-memory.ts#L508](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L508), [handlers/index.ts#L156](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts#L156)).
- Flag defaults check:
  - Shared-memory subsystem default OFF with two-tier enablement is correctly implemented ([shared-spaces.ts#L177](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L177), [shared-spaces.ts#L186](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L186), [shared-spaces.ts#L195](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L195), [shared-spaces.ts#L215](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L215)).
  - Deny-by-default + rollout + kill-switch enforcement matches ([shared-spaces.ts#L452](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L452), [shared-spaces.ts#L474](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L474), [shared-spaces.ts#L568](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/collab/shared-spaces.ts#L568)).
- Unreferenced files found:
  - Additional feature-implementing test files not cataloged: [shared-memory-handlers.vitest.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-handlers.vitest.ts#L1), [shared-memory-e2e.vitest.ts#L1](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/tests/shared-memory-e2e.vitest.ts#L1).
  - Shared-space governance also enforced in save/search flows not listed in this entry: [memory-save.ts#L659](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts#L659), [stage1-candidate-gen.ts#L709](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage1-candidate-gen.ts#L709).
- Behavioral accuracy: Matches rollout + deny-by-default + kill-switch + first-run enable persistence/README behavior ([shared-memory.ts#L218](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L218), [shared-memory.ts#L525](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L525), [shared-memory.ts#L563](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/.opencode/skill/system-spec-kit/mcp_server/handlers/shared-memory.ts#L563)).
- Verdict: **PARTIAL** (behavior matches, catalog under-references implementation surface)

| # | Feature | Files OK? | Functions OK? | Flags OK? | Unreferenced? | Verdict |
|---|---|---|---|---|---|---|
| 01 | Feature flag governance | N/A (no files listed) | N/A | N/A | No | MATCH |
| 02 | Feature flag sunset audit | N/A (no files listed) | Mostly yes (46 helpers, pipeline helper removed) | Partial (adaptive-fusion knob claim stale) | Yes | PARTIAL |
| 03 | Hierarchical scope governance, governed ingest, retention, and audit | Yes | Yes | Yes | Yes | PARTIAL |
| 04 | Shared-memory rollout, deny-by-default membership, and kill switch | Yes | Yes | Yes | Yes | PARTIAL |