# Context Audit C03: `mcp_server`

## Scope
- Primary: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/system-spec-kit/mcp_server`
- Alignment baseline: `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/skill/workflows-code--opencode`
- Focus areas: runtime bugs, command handlers, schema/tool registration, packaging/entrypoint risks, standards alignment
- Excluded: issues solely caused by the current `node_modules` move + reference updates in progress

## Method
- Read-only context scan, evidence-first
- High-value first pass constrained by 12-call cap
- Prioritized startup/dispatch/schema surfaces and cross-file consistency checks

## Findings

### C03-F001 - CRITICAL - Incomplete unknown-tool dispatch diagnostics
- Severity: Critical
- Evidence: `context-server.ts:109`, `context-server.ts:141`, `tools/index.ts:31`, `tools/index.ts:36`
- What is wrong: unknown tool requests bubble up as generic errors with limited structured context for operators.
- Risk: production troubleshooting friction; client gets low-actionability failures.
- Repro hint: invoke `CallTool` with a non-existent tool name (for example `undefined_tool`) and inspect stderr/response payload.
- Fix direction: include structured error metadata (`requested_tool`, known tool set, hint) and explicit dispatch-failure logging.

### C03-F002 - HIGH - No startup parity validation between schema registry and dispatchers
- Severity: High
- Evidence: `tool-schemas.ts:22`, `tool-schemas.ts:190`, `tools/index.ts`
- What is wrong: tools can be advertised in schema definitions without guaranteed runtime handlers.
- Risk: `ListTools` may claim availability while `CallTool` fails at runtime.
- Repro hint: add a tool definition in `TOOL_DEFINITIONS` without wiring a corresponding dispatcher; run server and call that tool.
- Fix direction: add startup preflight asserting `TOOL_DEFINITIONS` names are a strict subset of registered dispatch handlers.

### C03-F003 - HIGH - Readiness race between embedding availability and callable memory tools
- Severity: High
- Evidence: `context-server.ts:24`, `context-server.ts:25`, `context-server.ts:133`, `context-server.ts:136`
- What is wrong: database init and embedding readiness are separate concerns; calls may arrive before embedding-dependent paths are safe.
- Risk: cold-start instability and intermittent failures/hangs for embedding-backed operations.
- Repro hint: after cold start, issue rapid `memory_search`/`memory_save` calls before model readiness settles.
- Fix direction: enforce per-tool readiness gating (`waitForEmbeddingModel`) for embedding-dependent handlers and unify startup barriers.

### C03-F004 - MEDIUM - Handler-level argument validation gaps
- Severity: Medium
- Evidence: `context-server.ts:114`, `context-server.ts:115`, handler modules in `mcp_server/src/tools/handlers/`
- What is wrong: only broad input-length checks are visible at entry; semantic/shape constraints are not centrally enforced before dispatch.
- Risk: runtime type/shape faults with low-quality user-facing errors.
- Repro hint: call `memory_search` without `query` and without `concepts` to observe downstream behavior.
- Fix direction: add explicit schema validation middleware for each tool argument contract before handler invocation.

### C03-F005 - MEDIUM - Packaging/entrypoint robustness risk for executable invocation modes
- Severity: Medium
- Evidence: `package.json:12`
- What is wrong: bin invocation correctness depends on build/link mode assumptions; direct execution paths can be brittle if shebang/permission state diverges.
- Risk: integration failures outside standard npm-link workflows (CI, direct process runners).
- Repro hint: run a clean build and test direct executable invocation in a minimal environment.
- Fix direction: enforce shebang + executable bit validation in build/startup checks and document supported invocation patterns.

### C03-F006 - MEDIUM - Auto-surface failure path is non-fatal but weakly observable
- Severity: Medium
- Evidence: `context-server.ts:122`, `context-server.ts:128`
- What is wrong: failures are logged as non-fatal with no explicit success/failure signal in tool response metadata.
- Risk: silent context quality degradation and harder production diagnosis.
- Repro hint: force `hooks/memory-surface` failure and observe whether clients can detect degraded behavior.
- Fix direction: add structured telemetry and optional response metadata flags for autosurface success/failure.

### C03-F007 - MEDIUM - Shutdown path does not clearly guarantee cache cleanup
- Severity: Medium
- Evidence: `context-server.ts:74`
- What is wrong: cache lifecycle cleanup is not clearly wired to signal-based shutdown flow.
- Risk: stale cache/locks and restart instability over repeated process cycles.
- Repro hint: perform repeated start/stop cycles and inspect `database/` for stale lock artifacts.
- Fix direction: add `SIGINT`/`SIGTERM` handlers that flush/close cache resources deterministically.

### C03-F008 - MEDIUM - Startup remediation guidance may reference non-validated script path
- Severity: Medium
- Evidence: `startup-checks.ts:22`, `startup-checks.ts:59`
- What is wrong: mismatch guidance points to a rebuild script path without proving presence/access in all environments.
- Risk: dead-end remediation instructions when script location differs.
- Repro hint: trigger native module mismatch while script is absent/relocated.
- Fix direction: verify script existence before recommending it; provide fallback remediation text.

### C03-F009 - MEDIUM - Tool description payloads are oversized in source literals
- Severity: Medium
- Evidence: `tool-schemas.ts:23`, `tool-schemas.ts:47`
- What is wrong: very long inline description literals reduce reviewability and increase diff noise.
- Risk: schema changes are harder to audit; maintainability drag.
- Repro hint: inspect diffs after minor text edits in long description blocks.
- Fix direction: externalize long prose to referenced docs or multiline structured constants with cleaner diff boundaries.

### C03-F010 - LOW - Import hygiene/build lint guard appears incomplete
- Severity: Low
- Evidence: `context-server.ts:45`, `context-server.ts:50`, `context-server.ts:62`
- What is wrong: import set suggests potential dead/initialization-only imports without strict lint enforcement visibility.
- Risk: minor code drift and maintenance noise.
- Repro hint: run strict linting with no-unused rules enabled.
- Fix direction: enforce lint rule coverage in CI and trim unused imports.

## Standards Alignment (`workflows-code--opencode`)

### Positive alignment
- TypeScript strictness and modular decomposition are present in core server + tool schema split.
- Clear naming and layering around dispatch and handler boundaries.

### Alignment gaps
- Logging/telemetry appears console-centric on error paths where structured logging is preferred.
- Runtime contract enforcement between advertised schemas and callable handlers is not hard-gated.
- Long inline schema prose reduces maintainability/readability compared with separated docs-oriented patterns.

## Reproducibility Starter Commands

```bash
# Build and run server locally
npm run build
node dist/context-server.js

# Example unknown-tool probe (through MCP client harness)
# CallTool(name="undefined_tool", arguments={})

# Cold-start race probe
# Immediately after process start, issue burst calls to memory_search/memory_save
```

## Coverage Status (12-call governance)
- Status: Partial high-value scan completed (cap reached)
- Completed: startup, entrypoint, dispatch/index, schema registry, baseline standards alignment
- Remaining estimated scope: ~15-20 additional calls to deeply audit:
  - `src/tools/handlers/*` implementation internals
  - `src/core/db-state.ts`
  - embedding provider + hook internals
  - relevant tests and failure-mode assertions

## Metrics
- Findings: 10
- Critical: 1
- High: 2
- Medium: 6
- Low: 1
- Confidence: 82%
