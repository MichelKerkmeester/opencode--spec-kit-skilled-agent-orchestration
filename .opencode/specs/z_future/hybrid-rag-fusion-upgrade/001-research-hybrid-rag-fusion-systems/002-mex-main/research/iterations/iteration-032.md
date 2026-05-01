# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: for each adopt-now pattern, identify what could break during migration, plus the rollback plan and feature flags needed.

## Findings

### Finding 1: The markdown integrity lane must launch as a **separate advisory surface**, not as a new pass/fail gate
- **Source**: Mex drift engine and scoring, current Spec Kit validator, prior adoption lock [SOURCE: external/README.md:72-87; external/src/drift/index.ts:17-67; external/src/drift/scoring.ts:1-16; .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-92,499-505,630-634; research/iterations/iteration-031.md:7-16]
- **What it does**: Mex runs lexical checks first and collapses them into a score, while Spec Kit validation already has a separate error/warning exit-code contract.
- **Why it matters**: The adopt-now value is the checker logic, not Mex’s score-first health model. If Public mixes the new integrity issues into `validate.sh` too early, it changes an already stable pass/warn/fail contract.
- **What could break during migration**:
  - strict spec validation could start failing on newly surfaced doc-link issues even when retrieval, memory indexing, and graph state are healthy
  - operator trust could drop if one new checker suddenly changes CI or local validation outcomes without calibration
  - `memory_health` and spec validation ownership would blur if lexical doc issues are reported as if they were memory DB health failures
- **Feature flags needed**:
  - `SPECKIT_INTEGRITY_ENABLED=false` by default
  - `SPECKIT_INTEGRITY_MODE=advisory|blocking` with `advisory` as the first shipped mode
  - `SPECKIT_INTEGRITY_SCORE=false` so Q1 reports issues by severity, not by aggregate score
  - `SPECKIT_INTEGRITY_SURFACE=separate` so results stay out of `validate.sh` and `memory_health` until calibrated
- **Rollback plan**:
  1. Turn off `SPECKIT_INTEGRITY_ENABLED`.
  2. Remove integrity output from any wrapper/CLI surface.
  3. Keep existing `validate.sh` and `memory_health` contracts untouched, since this lane should remain read-only and side-effect free.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 2: The integrity lane needs **Spec Kit–specific path normalization and scope whitelisting** before it is trustworthy
- **Source**: Mex claim extraction and path resolution, Spec Kit alias handling [SOURCE: external/src/drift/claims.ts:7-119; external/src/drift/checkers/path.ts:6-67; external/src/drift/checkers/edges.ts:5-34; external/src/drift/checkers/index-sync.ts:6-68; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86-127]
- **What it does**: Mex extracts path-like claims from markdown, checks them against `projectRoot`/`scaffoldRoot`, strips a `.mex/` prefix in one special case, and assumes `patterns/INDEX.md` as the indexed pattern registry.
- **Why it matters**: Public already has alias-aware spec paths, and its markdown corpus is broader than Mex’s scaffold. Importing Mex’s resolver unchanged would create false positives faster than it creates trust.
- **What could break during migration**:
  - valid `.opencode/specs/...` and `specs/...` references could be treated as different or missing paths unless normalized first
  - `index-sync` could generate noise if run on surfaces that do not have an explicit authoritative index contract
  - non-authoritative example paths, placeholders, or doc-local references could look like drift and swamp the useful issues
- **Feature flags needed**:
  - `SPECKIT_INTEGRITY_SCOPE=spec-docs|memory|constitutional|phase-folder`
  - `SPECKIT_INTEGRITY_CHECKERS=paths,edges,index-sync` with per-checker toggles
  - `SPECKIT_INTEGRITY_ALIAS_NORMALIZATION=true`
  - `SPECKIT_INTEGRITY_INDEX_SYNC=false` unless a target surface explicitly declares an index authority
- **Rollback plan**:
  1. Disable the noisy checker only (`index-sync` first if needed).
  2. Shrink scope to a single folder class or phase folder.
  3. Keep path normalization on even if other checkers are turned back off, because alias handling is prerequisite correctness work.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 3: The guided maintenance surface must remain a **thin wrapper over existing authority**, with dry-run and confirmation semantics preserved
- **Source**: Mex sync UX, prompt-export/manual fallback, current Spec Kit repair safeguards [SOURCE: external/src/cli.ts:28-161; external/SYNC.md:3-21,23-62; external/src/sync/index.ts:29-209; external/src/sync/brief-builder.ts:7-158; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:419-440; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1376; research/iterations/iteration-031.md:18-27]
- **What it does**: Mex exposes a very small public surface for detect -> preview -> prompt/export -> verify. Spec Kit already has stronger primitives, but they are spread across separate tools with different safety contracts.
- **Why it matters**: The adopt-now pattern is the UX shape, not Mex’s direct execution model. Public should wrap `session_bootstrap`, `memory_health`, `memory_save(dryRun)`, and later repair helpers, but it should not replace or bypass them.
- **What could break during migration**:
  - a wrapper that jumps directly from diagnosis to execution could bypass `memory_health` confirmation gating
  - a wrapper that turns `memory_save` into implicit write-mode could violate its current non-mutating dry-run contract
  - duplicating repair logic in a new surface would create drift between the wrapper and the underlying MCP tools
- **Feature flags needed**:
  - `SPECKIT_GUIDED_SURFACE_ENABLED=false` by default
  - `SPECKIT_GUIDED_SURFACE_EXECUTION=false` for planner/prompt mode first
  - `SPECKIT_GUIDED_SURFACE_PROMPT_EXPORT=true`
  - `SPECKIT_GUIDED_SURFACE_ALLOW_AUTOREPAIR=false`
  - `SPECKIT_GUIDED_SURFACE_MEMORY_SAVE_MODE=dry-run-only` for Q1
- **Rollback plan**:
  1. Hide or disable the wrapper command.
  2. Fall back to direct MCP tools only.
  3. Leave all underlying handlers unchanged, since the wrapper should not own state or mutation authority.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary

### Finding 4: The guided maintenance surface must default to **error-only, structurally-aware routing**, not broad repair orchestration
- **Source**: Mex warning handling, current bootstrap/health structural hints, current retrieval/graph authority [SOURCE: external/src/sync/index.ts:61-77,171-209; .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194-209,323-330; .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:117-130; .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,623-625]
- **What it does**: Mex sync ignores warning-only files by default and loops only on actionable error sets. Spec Kit already knows when structural context is stale or missing and already has explicit tools for retrieval and code-graph refresh.
- **Why it matters**: If Public ships a wrapper that includes warnings, stale graph state, and optional rescans all at once, the first release becomes a noisy orchestration layer instead of a reliable maintenance surface.
- **What could break during migration**:
  - operators could get misleading repair guidance when structural context is stale or missing
  - wrapper-driven auto-scans could add latency and side effects to a workflow that should mostly be advisory in Q1
  - including warnings by default would inflate issue volume before the integrity lane is calibrated
- **Feature flags needed**:
  - `SPECKIT_GUIDED_SURFACE_INCLUDE_WARNINGS=false`
  - `SPECKIT_GUIDED_SURFACE_REQUIRE_BOOTSTRAP=true`
  - `SPECKIT_GUIDED_SURFACE_AUTO_SCAN=false`
  - `SPECKIT_GUIDED_SURFACE_ROUTE_THROUGH_EXISTING_TOOLS=true`
- **Rollback plan**:
  1. Degrade the wrapper to hint-only mode when structural context is `stale` or `missing`.
  2. Turn warning inclusion back off.
  3. Require manual invocation of `code_graph_scan` rather than auto-running it from the wrapper.
- **Recommendation**: adopt now
- **Impact**: medium
- **Source strength**: primary

## Sources Consulted
- `research/iterations/iteration-030.md` [SOURCE: research/iterations/iteration-030.md:8383-8425]
- `research/iterations/iteration-031.md` [SOURCE: research/iterations/iteration-031.md:7-27]
- `external/README.md` [SOURCE: external/README.md:72-87]
- `external/SYNC.md` [SOURCE: external/SYNC.md:3-21,23-62]
- `external/src/cli.ts` [SOURCE: external/src/cli.ts:28-161]
- `external/src/drift/index.ts` [SOURCE: external/src/drift/index.ts:17-67]
- `external/src/drift/scoring.ts` [SOURCE: external/src/drift/scoring.ts:1-16]
- `external/src/drift/claims.ts` [SOURCE: external/src/drift/claims.ts:7-119]
- `external/src/drift/checkers/path.ts` [SOURCE: external/src/drift/checkers/path.ts:6-67]
- `external/src/drift/checkers/edges.ts` [SOURCE: external/src/drift/checkers/edges.ts:5-34]
- `external/src/drift/checkers/index-sync.ts` [SOURCE: external/src/drift/checkers/index-sync.ts:6-68]
- `external/src/sync/index.ts` [SOURCE: external/src/sync/index.ts:29-209]
- `external/src/sync/brief-builder.ts` [SOURCE: external/src/sync/brief-builder.ts:7-158]
- `.opencode/skill/system-spec-kit/scripts/spec/validate.sh` [SOURCE: .opencode/skill/system-spec-kit/scripts/spec/validate.sh:87-92,499-505,630-634]
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-44,218-220,623-625]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:194-209,323-330]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:117-130]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:86-127,419-440]
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts` [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:1187-1262,1273-1376]

## Assessment
- **New information ratio**: 0.14
- **Questions addressed**: which Q1 pattern can silently break existing contracts; where false positives are most likely; which flags are required to keep rollout reversible; what must stay out of the first guided-maintenance release
- **Questions answered**: the integrity lane is safe only as a separate advisory surface; checker trust depends on alias-aware scoping and per-checker rollout; the guided maintenance surface is safe only as a thin wrapper that preserves dry-run, confirmation, and structural-readiness contracts
- **Novelty justification**: prior iterations chose the patterns, but this pass adds the concrete migration blast radius, reversible rollout boundaries, and flag topology needed to ship them safely
- **Validation note**: I could not rerun `validate.sh` in this session because shell execution permission was denied, so the latest validation evidence remains the prior strict-pass status already captured in iteration 031

## Ruled Out
- importing Mex’s `0-100` drift score as a top-level Public health signal, because it would interfere with existing severity-based validation and health surfaces
- making the integrity lane blocking on first release, because false-positive calibration is the main migration risk
- bundling `spec-kit doctor` or any execution-owning repair loop into the same release as the Q1 adopt-now slices
- enabling warnings, rescans, or auto-repair by default in the first guided maintenance surface

## Reflection
- **What worked**: comparing Mex’s detect/score/sync contracts directly against Spec Kit’s existing `validate.sh`, `memory_health`, `memory_save(dryRun)`, `session_bootstrap`, and `session_health` contracts made the migration risk concrete instead of hypothetical
- **What did not work**: I could not refresh the phase validation status in-session because shell execution permission was denied, so the validation note had to stay anchored to prior recorded evidence
- **What I would do differently**: turn the proposed flags into a literal acceptance matrix next, with one success criterion and one rollback trigger per flag

## Recommended Next Focus
Define the Q1 rollout contract as a small acceptance matrix: checker scope, advisory-to-blocking promotion criteria, wrapper routing behavior under stale structural context, and the exact conditions under which planner-only maintenance can ever gain execution privileges.


Total usage est:        1 Premium request
API time spent:         4m 5s
Total session time:     4m 23s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.2m in, 16.0k out, 1.1m cached, 9.6k reasoning (Est. 1 Premium request)
