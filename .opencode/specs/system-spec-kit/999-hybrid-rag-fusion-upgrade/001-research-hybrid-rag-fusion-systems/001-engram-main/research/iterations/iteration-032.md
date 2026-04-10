# Iteration 032: MIGRATION RISK MATRIX

## Focus
MIGRATION RISK MATRIX: For each adopt-now pattern, detail what could break during migration. Include rollback plans and feature flags needed.

## Findings
### Finding 1: A deterministic recent-session digest is safe only if it stays additive to `session_resume` and `session_bootstrap`
- **Source**: `001-engram-main/external/internal/store/store.go:1613-1667`; `001-engram-main/external/internal/mcp/mcp.go:375-395,460-562`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-597`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-240`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:739-776`; `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:226-244,283-288`
- **What it does**: Engram’s `FormatContext()` builds a bounded digest over recent sessions, prompts, and observations. Public already has the stronger authority surface in `session_resume` and `session_bootstrap`, so the transferable pattern is an additive digest block inside those existing payloads, not a second lifecycle API.
- **Why it matters**: Highest-leverage continuity win, but it touches Public’s most trust-sensitive startup path.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**:
  - Startup authority drift if the digest disagrees with existing `memory`, `cachedSummary`, or `structuralContext`.
  - Token bloat if the digest appears in bootstrap, startup instructions, and compaction payloads at once.
  - Scope/session leakage if it bypasses current resume/session boundaries.
- **Feature flags needed**:
  - `SPECKIT_RESUME_DIGEST_V1=false`
  - `SPECKIT_RESUME_DIGEST_MODE=shadow|promoted`
  - `SPECKIT_BOOTSTRAP_DIGEST_V1=false`
- **Rollback plan**:
  - Turn both digest flags off.
  - Remove only the additive digest section.
  - Keep `session_resume`, `session_bootstrap`, cached-summary gating, and structural trust unchanged.

### Finding 2: A thin action card plus one-command runtime setup can easily duplicate or override Public’s existing recovery hooks
- **Source**: `001-engram-main/external/README.md:45-58`; `001-engram-main/external/docs/AGENT-SETUP.md:27-43,69-84,111-122,147-158`; `001-engram-main/external/docs/PLUGINS.md:13-37,48-57,76-120`; `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-809`; `.opencode/plugins/spec-kit-compact-code-graph.js:396-417`; `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:226-244`
- **What it does**: Engram productizes runtime setup with one-command installers and thin plugins. Public already emits startup instructions and injects compaction context, so the reusable piece is packaging/export ergonomics, not a new transport model.
- **Why it matters**: Fast DX win after digest work, but it crosses every runtime adapter boundary.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**:
  - Runtime instruction drift if exported cards fall out of sync with real recovery order.
  - Double injection if generated cards and the current compaction plugin both add overlapping recovery blocks.
  - Hidden daemon assumptions if setup starts acting like Engram’s HTTP-backed plugin model.
- **Feature flags needed**:
  - `SPECKIT_RUNTIME_ACTION_CARD_V1=false`
  - `SPECKIT_RUNTIME_SETUP_EXPORT_V1=false`
  - Per-runtime kill switches: `..._OPENCODE_V1`, `..._CLAUDE_V1`, `..._CODEX_V1`, `..._GEMINI_V1`
- **Rollback plan**:
  - Disable export flags.
  - Fall back to current `context-server.ts` instructions and existing plugin behavior.
  - Keep recovery truth in core surfaces, not generated runtime files.

### Finding 3: An exact-handle lexical lane can regress search quality if it escapes its narrow artifact-only scope
- **Source**: `001-engram-main/external/internal/store/store.go:1474-1583`; `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,113-164`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-45,69-83,154-184`; `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:231-244,283-288`
- **What it does**: Engram prepends exact `topic_key` hits before FTS results for handle-shaped queries. Public already keeps semantic-first routing and BM25 preservation for artifact-like searches; the migration target is a tiny exact-handle lane, not a lexical-first rewrite.
- **Why it matters**: Search regressions would be immediate and user-visible.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**:
  - Rank inversion if exact matches suppress vector/graph/BM25 results for merely slash-shaped queries.
  - False positives/collisions from loose key normalization.
  - Governance bugs if the lane ignores tenant/user/agent/shared-space filters.
- **Feature flags needed**:
  - `SPECKIT_EXACT_HANDLE_LANE_V1=false`
  - `SPECKIT_EXACT_HANDLE_MODE=shadow|promoted`
  - `SPECKIT_EXACT_HANDLE_ALLOWLIST=spec,plan,tasks,checklist,decision-record,implementation-summary,research`
- **Rollback plan**:
  - Disable the exact-handle flags.
  - Return to the current hybrid router immediately.
  - Keep any new key metadata additive and unused on rollback.

### Finding 4: A read-only doctor/scorecard should compose current diagnostics, not become a new source of truth or a hidden repair surface
- **Source**: `001-engram-main/external/internal/mcp/mcp.go:399-411`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:30-57`; `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:223-360`; `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:33-195`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-47`; `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:9-55`; `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:388-410`; `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:230-239,656-700,731-776`
- **What it does**: Engram’s `mem_stats` shows the value of a lightweight operational surface. Public already has `memory_stats`, `memory_health`, `session_health`, `code_graph_status`, `ccc_status`, and `eval_reporting_dashboard`; the adopt-now move is a read-only composite wrapper over those tools.
- **Why it matters**: Improves operability without touching ranking semantics or governance.
- **Recommendation**: adopt now
- **Impact**: high
- **Source strength**: primary
- **Migration risk**:
  - Status divergence if the scorecard recomputes instead of delegating to existing handlers.
  - Accidental side effects if “doctor” exposes or triggers repair paths by default.
  - Context clutter if the composite becomes an eager agent-facing tool.
- **Feature flags needed**:
  - `SPECKIT_DOCTOR_SCORECARD_V1=false`
  - `SPECKIT_DOCTOR_INCLUDE_EVAL_V1=false`
  - `SPECKIT_DOCTOR_REPAIR_ACTIONS=false`
  - `SPECKIT_DOCTOR_AGENT_SURFACE=off|readonly`
- **Rollback plan**:
  - Disable the doctor flags.
  - Keep the underlying diagnostics tools as the only operational surfaces.
  - Ensure the first version stays read-only.

## Sources Consulted
- `001-engram-main/external/internal/store/store.go:1474-1583`
- `001-engram-main/external/internal/store/store.go:1613-1667`
- `001-engram-main/external/internal/mcp/mcp.go:50-167`
- `001-engram-main/external/internal/mcp/mcp.go:375-590`
- `001-engram-main/external/README.md:45-58`
- `001-engram-main/external/docs/AGENT-SETUP.md:27-43,69-84,111-122,147-158`
- `001-engram-main/external/docs/PLUGINS.md:13-37,48-57,76-120`
- `.opencode/plugins/spec-kit-compact-code-graph.js:396-417`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:741-809`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:409-597`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:168-240`
- `.opencode/skill/system-spec-kit/mcp_server/lib/search/query-router.ts:48-56,113-164`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-stats.ts:30-57`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts:223-360`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/session-health.ts:33-195`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/status.ts:9-47`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/ccc-status.ts:9-55`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/eval-reporting.ts:388-410`
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:41-45,69-83,154-184,230-239,656-700,731-776`
- `.opencode/skill/system-spec-kit/mcp_server/ENV_REFERENCE.md:226-244,283-288`
- `research/iterations/iteration-030.md:1-100`

## Assessment
- New information ratio: 0.12
- Questions addressed: [migration risk for deterministic recent-session digest, migration risk for thin runtime setup/action cards, migration risk for exact-handle lexical lane, migration risk for read-only doctor/scorecard]
- Questions answered: [all four adopt-now migration tracks, required feature-flag families, rollback shape for each track]
- Novelty justification: This is the first pass that turns the P1-P4 adopt-now set into a reversible rollout matrix tied to Public’s current recovery, routing, and diagnostics surfaces.

## Ruled Out
- Big-bang enablement across all runtimes at once
- Replacing `session_resume` / `session_bootstrap` with a second explicit lifecycle authority
- Global lexical bypass for any slash-shaped query
- A doctor surface that can repair by default

## Reflection
- What worked: Using the clean adopt-now synthesis in `iteration-030.md` as the baseline, then tracing each item into current Public fault lines.
- What did not work: The packet’s `research.md` tail and `iteration-031.md` content are noisy enough to be weak sources of truth for late-stage synthesis.
- What I would do differently: Normalize the canonical packet docs earlier so late iterations do not have to work around transcript contamination.

## Recommended Next Focus
Feature-flag sequencing and shadow-mode graduation criteria for P1-P4, including rollout order and required telemetry before promotion.


Total usage est:        1 Premium request
API time spent:         5m 10s
Total session time:     5m 29s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.4                  1.5m in, 20.0k out, 1.4m cached, 8.4k reasoning (Est. 1 Premium request)
