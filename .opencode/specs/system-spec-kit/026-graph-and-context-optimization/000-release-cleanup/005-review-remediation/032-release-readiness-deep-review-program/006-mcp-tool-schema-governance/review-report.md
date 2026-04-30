---
title: "Review Report: MCP Tool Schema Governance"
description: "Release-readiness deep-review report for MCP tool schema strictness, governed-ingest enforcement, and canonical tool count alignment."
trigger_phrases:
  - "045-006-mcp-tool-schema-governance"
  - "schema audit"
  - "governance enforcement review"
  - "tool count canonical"
importance_tier: "important"
contextType: "review"
---
# Review Report: MCP Tool Schema Governance

## 1. Executive Summary

**Verdict: FAIL.** Active findings: P0=1, P1=4, P2=2. `hasAdvisories=true`.

The canonical count is sound: `spec_kit_memory` exposes 54 public tools, made of 50 local descriptors plus 4 imported Skill Advisor descriptors. The root README and MCP server README both align on that public count, and deferred route/tool/shape entities are explicitly excluded from the live count.

The release blocker is schema enforcement consistency. `session_health` has a Zod schema and an empty allowed-parameter list, but its dispatch path never calls validation, so `SPECKIT_STRICT_SCHEMAS=on` cannot reject hallucinated parameters for that public tool. Separate P1 drift remains around `code_graph_verify` missing from the Zod registry, hidden `memory_save` handler inputs, conditional governed-ingest enforcement across scan/ingest surfaces, and raw argument use before schema validation.

## 2. Planning Trigger

Route to remediation planning before release readiness. The P0 needs a dispatcher fix and a regression test proving strict mode rejects unknown `session_health` parameters.

The P1 work should be handled in the same packet if practical because all four issues share the same governance boundary: descriptor/schema/allowed-parameter parity, validation order, and whether ingest mutation paths must always carry provenance.

## 3. Active Finding Registry

### P0-001: `session_health` bypasses schema validation despite strict schema metadata

**Severity:** P0, schema bypass.

**Evidence:** The schema registry defines `session_health` as an empty strict schema `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:656`, and the allowed-parameter map also declares no accepted parameters `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:715`. The lifecycle dispatcher validates neighboring lifecycle tools but dispatches `session_health` directly with no `validateToolArgs` call `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:55` and `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:66`. The server sends raw `args` into `dispatchTool` after only length validation `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:920` and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:930`.

**Impact:** `SPECKIT_STRICT_SCHEMAS=on` does not reject hallucinated fields for this public tool. The handler ignores arguments, so the immediate runtime risk is low, but the schema governance contract is broken: a public tool has a canonical schema that is never enforced.

**Concrete fix:** Change the lifecycle dispatcher to call `validateToolArgs('session_health', args)` before `handleSessionHealth()`. Add a regression test that passes an unknown field to `session_health` and expects the same strict-schema rejection as other tools.

### P1-001: `code_graph_verify` is public but missing from the Zod schema registry and allowed-parameter map

**Severity:** P1, schema drift / public tool fails closed.

**Evidence:** `tool-schemas.ts` includes public `code_graph_verify` in `TOOL_DEFINITIONS` `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:645` and `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:646`. `code_graph/tools/code-graph-tools.ts` includes it in the code graph tool set `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:20` and dispatches to `handleCodeGraphVerify(parseArgs(args))` `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts:77`. Central dispatch validates all code graph tools before calling their module dispatcher `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:79` and `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:109`. `TOOL_SCHEMAS` does not include `code_graph_verify` in the code graph block `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:632`, and `ALLOWED_PARAMETERS` jumps from `code_graph_context` to `detect_changes` with no `code_graph_verify` entry `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:698` and `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:699`. `validateToolArgs` throws an unknown-schema error when a tool has no schema `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:786`.

**Impact:** The tool does not silently accept unvalidated input; it fails closed before the handler. That still blocks release readiness because the canonical public registry advertises a tool that the strict validation layer cannot dispatch. It also violates the "every `TOOL_DEFINITIONS` entry has a matching Zod schema" requirement.

**Concrete fix:** Add `codeGraphVerifySchema` with the handler-supported fields from `VerifyArgs`: `rootDir`, `batteryPath`, `category`, `failFast`, `includeDetails`, `persistBaseline`, and `allowInlineIndex` `.opencode/skill/system-spec-kit/mcp_server/code_graph/handlers/verify.ts:28`. Register it in `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS`, and add a schema/descriptor parity test.

### P1-002: `memory_save` supports hidden handler inputs that strict public schemas reject

**Severity:** P1, schema drift / strict-off hidden behavior.

**Evidence:** `SaveArgs` includes `plannerMode` and `targetAnchorId` `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:286`, `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:290`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/save/types.ts:295`. The handler destructures both fields `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2703`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2707`, and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2712`. `targetAnchorId` affects canonical-save planning `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2724`. The public schema for `memory_save` includes `filePath`, `force`, `dryRun`, `skipPreflight`, `asyncEmbedding`, `routeAs`, `mergeModeHint`, governance fields, and retention fields, but not `plannerMode` or `targetAnchorId` `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:237`. The allowed-parameter map also omits both `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:669`.

**Impact:** In default strict mode, MCP callers cannot pass handler-supported planning controls. In `SPECKIT_STRICT_SCHEMAS=false`, those hidden fields pass through because schemas become passthrough, creating a mode-dependent public contract. That is exactly the kind of schema/handler drift strict schema governance is supposed to prevent.

**Concrete fix:** Decide whether `plannerMode` and `targetAnchorId` are public MCP inputs. If yes, add them to the JSON descriptor, Zod schema, and allowed-parameter map. If no, remove them from the public handler arg type or keep them on an internal-only code path that cannot arrive through MCP passthrough mode.

### P1-003: Governed ingest is enforced for `memory_save` only when governance-triggering fields are present, while scan/ingest mutation surfaces cannot carry governance metadata

**Severity:** P1, inconsistent governed-ingest enforcement.

**Evidence:** `requiresGovernedIngest` returns true only when scope/provenance fields, `governedAt`, ephemeral retention, or `deleteAfter` are present `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225`. `validateGovernedIngest` allows writes with null governance metadata when governance is not required `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:241`, and only requires `tenantId`, `sessionId`, user/agent identity, `provenanceSource`, and `provenanceActor` once governed ingest is triggered `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272`. `memory_save` calls governance validation before write/preflight skip paths `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2749` and rejects missing governed fields before continuing `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2761`.

The other ingest surfaces cannot carry equivalent governance fields. `memory_index_scan` validates only scan args `.opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts:57`; its public allowed parameters are `specFolder`, `force`, `includeConstitutional`, `includeSpecDocs`, and `incremental` `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:690`. Bulk ingest accepts only `paths` and `specFolder` `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:692`, and `memory_ingest_start` queues jobs with that shape `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:36` and `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:246`. The memory indexing path defaults scope to `{}` when no scope is supplied `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2630`.

**Impact:** Governed ingest is consistent for `memory_save` only under the current conditional policy. If release readiness requires all ingestion writes to carry provenance and tenant scope when applicable, `memory_index_scan` and `memory_ingest_start` can create or refresh unscoped/provenance-less records because their schemas do not expose governance inputs.

**Concrete fix:** Make the policy explicit. Either require governance metadata on all ingest mutation surfaces in governed deployments, or document `memory_index_scan` and `memory_ingest_start` as operator-maintenance paths that are intentionally ungoverned and gated by a separate capability boundary. If governance is required, add common governance fields to their schemas and handlers.

### P1-004: Raw arguments influence session priming and auto-surface behavior before schema validation

**Severity:** P1, validation-order drift.

**Evidence:** `context-server.ts` validates only input lengths before pre-dispatch work `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:930`. It records metrics from raw `args.mode` and `args.specFolder` before tool schema validation `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:943` and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:949`. It primes sessions with raw `args` `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:958`, and runs auto-surface logic with raw `args` before dispatch `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:976` and `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:992`. Only after that does it call `dispatchTool(name, args, callerContext)` `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:1010`.

**Impact:** Even when a tool eventually rejects hallucinated parameters, those parameters can influence metrics, session priming, or memory auto-surface behavior first. This is not a full handler-level schema bypass, but it weakens the strict-schema guarantee and makes rejection side effects harder to reason about.

**Concrete fix:** Move schema validation to the server boundary before session priming and auto-surface logic, or add a server-level validated-args preflight for all public tools. If double validation overhead is a concern, pass parsed args through dispatch and remove duplicate module validation later.

### P2-001: Schema README reports a stale 57-key schema count

**Severity:** P2, documentation drift.

**Evidence:** The schema README says the live registry declares 57 schema keys for 54 public MCP tools plus aliases/internal entries `.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:27`. It also says `tool-input-schemas.ts` defines schemas for the 54-tool public surface plus compatibility/internal entries `.opencode/skill/system-spec-kit/mcp_server/schemas/README.md:41`. The audited source registry contains the four advisor schemas and public non-advisor schemas, but the exact key count no longer matches 57, and `code_graph_verify` is missing from the registry.

**Impact:** This does not inflate the canonical public count because the README correctly points to `TOOL_DEFINITIONS.length` as source of truth. It can still mislead maintainers doing schema parity checks.

**Concrete fix:** Update the schema README after the registry is fixed. The doc should avoid hard-coding the schema-key count unless a test keeps it current.

### P2-002: Strict-off passthrough mode preserves unknown fields all the way to handlers

**Severity:** P2, documented-but-risky failure mode.

**Evidence:** `getSchema` uses strict schemas by default and switches to passthrough only when `SPECKIT_STRICT_SCHEMAS === 'false'` `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:29`. `parseArgs` returns the raw object cast when args are already an object `.opencode/skill/system-spec-kit/mcp_server/tools/types.ts:8`. Existing tests assert that extra fields pass through when strict schemas are disabled `tests/context-server.vitest.ts:116`.

**Impact:** This is a deliberate escape hatch, not a default release blocker. The failure mode when off is clear: unknown parameters survive validation and can be read by handlers that support hidden fields, such as `memory_save`'s planning inputs. That makes strict-off unsafe for release-like environments.

**Concrete fix:** Document `SPECKIT_STRICT_SCHEMAS=false` as development-only and add an environment health warning when the MCP server starts with strict schemas disabled.

## 4. Remediation Workstreams

| Workstream | Findings | Action |
|------------|----------|--------|
| Dispatch validation closure | P0-001, P1-004 | Validate every public tool before any tool-specific side effects; make `session_health` reject unknown fields. |
| Schema/handler parity | P1-001, P1-002, P2-001 | Add `code_graph_verify` schema; decide `memory_save` public planning fields; update docs after parity is restored. |
| Governed-ingest policy | P1-003 | Decide whether scan/ingest are governed mutation paths; add governance args or document/gate maintenance-only exception. |
| Strict-off guardrails | P2-002 | Warn in non-development use and document passthrough semantics clearly. |

## 5. Spec Seed

Follow-up packet: `046-mcp-tool-schema-governance-remediation`.

Problem: Release readiness is blocked because not every public MCP tool enforces its schema, and schema/governance drift remains across `code_graph_verify`, `memory_save`, and ingest mutation surfaces.

Requirements:
- P0: Every public `TOOL_DEFINITIONS` entry must have a Zod schema and allowed-parameter entry.
- P0: `SPECKIT_STRICT_SCHEMAS=on` must reject unknown parameters for every public tool, including `session_health`.
- P1: Schema validation must occur before session priming and auto-surface behavior, or those pre-dispatch hooks must use parsed validated args.
- P1: `memory_save` handler-only inputs must either become public schema fields or internal-only fields.
- P1: Governed-ingest policy must be explicit and consistently enforced across all ingestion write surfaces.
- P2: README/schema docs must avoid stale schema-key count claims.

## 6. Plan Seed

1. Add a schema parity test that compares `TOOL_DEFINITIONS` names against `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS`.
2. Add `session_health` validation in `lifecycle-tools.ts` and test unknown-field rejection.
3. Add `codeGraphVerifySchema` and allowed parameters for handler-supported verify args.
4. Decide and implement public/private treatment for `memory_save` `plannerMode` and `targetAnchorId`.
5. Move validation earlier in `context-server.ts` or pass pre-validated args through pre-dispatch hooks.
6. Decide governed-ingest policy for `memory_index_scan` and `memory_ingest_start`.
7. Update schema README after code fixes.
8. Run targeted schema/dispatcher tests and strict spec validation.

## 7. Traceability Status

Question: Does every tool in `TOOL_DEFINITIONS` have a Zod schema?

Answer: No. The canonical public registry is 54 tools: 50 local descriptors exported through `TOOL_DEFINITIONS` plus 4 imported advisor descriptors `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:906`. The missing Zod schema is `code_graph_verify`, which is public in the descriptor registry but absent from `TOOL_SCHEMAS` and `ALLOWED_PARAMETERS`. That is P1-001. The four advisor tools are present through `AdvisorToolInputSchemas` `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:642`.

Question: Is `SPECKIT_STRICT_SCHEMAS` enabled by default? What happens when off?

Answer: Yes. Strict mode is default because `getSchema` treats every value except the exact string `false` as strict `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:29`. When off, schemas become `passthrough()` `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:32`, so unknown fields survive validation and can reach handlers through `parseArgs`. That failure mode is P2-002.

Question: Are there any tools that skip schema validation?

Answer: Yes. `session_health` skips validation in `tools/lifecycle-tools.ts`; that is P0-001. The rest of the sampled dispatch modules either validate internally or are centrally validated. Memory tools call `validateToolArgs` per case, including `memory_retention_sweep` `.opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts:79`. Context tools validate `memory_context` `.opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts:14`. Causal tools validate their names `.opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts:32`. Checkpoint tools validate their names `.opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts:32`. Code graph, skill graph, advisor, and coverage graph tools are centrally validated by `SCHEMA_VALIDATED_TOOL_NAMES` `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts:79`.

Question: Governed ingest: which tools require it? When is it enforced versus optional?

Answer: `memory_save` enforces governed ingest when governance-triggering fields are present. `validateGovernedIngest` requires tenant/session/actor/source only after `requiresGovernedIngest` returns true `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:225` and `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:272`. `memory_save` calls that validator before write paths and before `skipPreflight` can matter `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:2749`, so `skipPreflight` is not a governance bypass. `memory_index_scan` and `memory_ingest_start` are ingest mutation surfaces but their schemas do not accept governance metadata, and indexing defaults to empty scope. That is P1-003.

Question: Are schema validation errors operator-actionable and do rejection logs name offending fields?

Answer: Mostly yes. `formatZodError` reports unknown parameters and expected names `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:737` and `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:769`. `validateToolArgs` logs rejected parameters with the tool name `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts:803`. The gap is that missing-schema failures are clear but point to the tool name rather than an offending field; for `code_graph_verify`, that is still operator-actionable because the schema itself is missing.

Question: Do schemas live in one canonical place per tool?

Answer: Generally yes, with drift. Public non-advisor schemas live in `tool-input-schemas.ts`; advisor schemas live in `skill_advisor/schemas/advisor-tool-schemas.ts` and are imported into `TOOL_SCHEMAS`. That is a reasonable split because advisor descriptors are also imported into `tool-schemas.ts`. The drift is not duplicate schema definitions; it is missing or hidden public schema fields.

Question: Tool count canonical: 50 in `tool-schemas.ts` plus 4 advisor schemas equals 54. Does `opencode.json` binding match? Does README match?

Answer: Yes for the public count. `tool-schemas.ts` exports 50 local descriptors plus 4 imported advisor descriptors through `TOOL_DEFINITIONS` `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:906`. The MCP server README says 54 MCP tools from `TOOL_DEFINITIONS.length` `.opencode/skill/system-spec-kit/mcp_server/README.md:60`. The root README says 63 total across 4 native MCP servers, with 54 `spec_kit_memory` tools made of 50 local descriptors plus 4 advisor descriptors `README.md:1289`. `opencode.json` binds the native MCP servers; it does not enumerate per-tool counts, so there is no binding-level numeric mismatch.

Question: Are there deferred or not-yet-wired tools that would inflate the count if accidentally enabled?

Answer: Deferred graph entities exist in docs, but current docs explicitly exclude deferred/not-yet-wired handlers from the count. The MCP README notes route/tool/shape graph entities remain deferred and do not affect `detect_changes` `.opencode/skill/system-spec-kit/mcp_server/README.md:587`, and later states deferred/not-yet-wired handlers do not count `.opencode/skill/system-spec-kit/mcp_server/README.md:1355`. No silent count inflation was found.

Security question: Any SQL injection paths through schema fields?

Answer: No active SQL injection path found in audited governance code. Governance audit writes use parameterized inserts `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:352`. Governance review filters build `WHERE` fragments from fixed clauses and bind caller values as parameters `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:454`, `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:555`, and `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts:588`.

## 8. Deferred Items

- Implement P0/P1 runtime remediation in a separate packet.
- Add schema parity tests for descriptor/schema/allowed-parameter maps.
- Decide the governed-ingest policy for maintenance scan and bulk ingest paths.
- Update schema README after parity remediation.
- Add a server startup warning for `SPECKIT_STRICT_SCHEMAS=false`.

## 9. Audit Appendix

### Coverage

Reviewed surfaces:
- `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts`
- `.opencode/skill/system-spec-kit/mcp_server/lib/governance/scope-governance.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/index.ts`
- `.opencode/skill/system-spec-kit/mcp_server/context-server.ts`
- `.opencode/skill/system-spec-kit/mcp_server/tools/*.ts`
- `.opencode/skill/system-spec-kit/mcp_server/code_graph/tools/code-graph-tools.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts`
- Root `README.md`, MCP server README, schema README, and `opencode.json`.
- Related packets 033, 034, and 042.

### Tool Count Matrix

| Surface | Result |
|---------|--------|
| Local `tool-schemas.ts` descriptors | 50 local public descriptors. |
| Imported Skill Advisor descriptors | 4 advisor descriptors. |
| Canonical `spec_kit_memory` public count | 54. |
| Root README total native MCP count | 63 across 4 native MCP servers. |
| MCP server README count | 54 from `TOOL_DEFINITIONS.length`. |
| `opencode.json` binding | Binds MCP servers, does not enumerate per-tool counts. |

### Schema Parity Matrix

| Tool or family | Result |
|----------------|--------|
| `memory_retention_sweep` | Present in descriptor, Zod schema, allowed-parameter map, and memory dispatcher. |
| `advisor_rebuild` | Present as imported advisor descriptor and imported advisor input schema. |
| `code_graph_verify` | Public descriptor exists; Zod schema and allowed-parameter entry missing. |
| `session_health` | Schema and allowed-parameter entry exist; dispatcher skips validation. |
| `memory_save` | Schema exists; handler supports hidden planning inputs not present in public schema. |

### Strict Mode Matrix

| Mode | Behavior |
|------|----------|
| Default / unset | Strict schemas reject unknown parameters for tools that call validation. |
| `SPECKIT_STRICT_SCHEMAS=false` | Schemas use passthrough; unknown parameters survive validation. |
| Missing schema | `validateToolArgs` throws unknown-schema error, causing fail-closed behavior. |
| Skipped validation | Tool bypasses strict and passthrough schema behavior entirely. |

### Governance Matrix

| Tool | Governance Fields | Enforcement |
|------|-------------------|-------------|
| `memory_save` | Accepts tenant/session/actor/source/retention fields. | Enforced when governance-triggering fields are present; rejects before write. |
| `memory_index_scan` | No governance fields in public schema. | Indexing can proceed with empty/default scope. |
| `memory_ingest_start` | No governance fields in public schema. | Queues ingest jobs without provenance metadata. |
| Governance audit review | Scope filters and optional unscoped mode. | Uses fixed SQL fragments and bound parameters. |

### Related Packet Checks

- 042 README refresh establishes the 54 `spec_kit_memory` and 63 total native MCP count wording.
- 033 `memory_retention_sweep` is correctly represented in the audited schema and dispatch surfaces.
- 034 `advisor_rebuild` is correctly represented through imported Skill Advisor descriptors and schemas.

### Convergence Evidence

All four review dimensions were covered:
- Correctness: descriptor/schema parity, handler type drift, strict-mode default, validation skip.
- Security: governed-ingest enforcement, SQL parameterization, strict schema bypass.
- Traceability: error formatting, rejected-field logs, README/tool-count source alignment.
- Maintainability: canonical schema ownership, deferred tool count exclusion, schema README drift.

Convergence is blocked by one active P0 and four active P1 findings. Release readiness for MCP tool schema governance is not achieved.
