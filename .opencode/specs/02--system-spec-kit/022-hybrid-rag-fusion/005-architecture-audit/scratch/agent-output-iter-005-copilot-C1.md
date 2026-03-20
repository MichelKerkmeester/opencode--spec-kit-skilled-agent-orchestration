I’m auditing the user-facing surface area first, then I’ll synthesize concrete UX friction findings with file references.

● Create session plan file (shell)
  │ cat >
  │ '/Users/michelkerkmeester/.copilot/session-state/3b6ad0ff-f7c3-47b3-a4f5-787911a375bf/plan.md'
  │ <<'EOF'
  │ # Plan…
  └ 9 lines...

● Explore Audit UX surfaces
  │ Read recovery-hints.ts
  │   │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  │   └ L400:550 (151 lines read)
  └ Get complete recovery hints for session and token budget errors (shell)
      │ grep -C 5 "SESSION_EXPIRED\|TOKEN_BUDGET_EXCEEDED"
      │ /Users/michelkerkmeester/MEGA/Development/Opencode\
      │ Env/Public/.opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts | tail
      -40
      └ 41 lines...

I’ve got a first-pass audit; now I’m spot-checking the highest-risk claims directly in code so the findings are precise and evidence-backed.

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L480:900 (421 lines read)

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L1:260 (260 lines read)

● Read startup-checks.ts
  │ .opencode/skill/system-spec-kit/mcp_server/startup-checks.ts
  └ L1:260 (161 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L1:380 (265 lines read)

● Read core.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/core.ts
  └ L1:280 (280 lines read)

● Read envelope.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/response/envelope.ts
  └ L1:320 (286 lines read)

● Read recovery-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  └ L1:420 (420 lines read)

● Search (grep)
  │ "session_id|minQualityScore|olderThanDays|turnNumber|console\.error|warmupCompleted|TOKEN_BUDGET
  │ _EXCEEDED|SESSION_EXPIRED|CAUSAL_|toolTip|createErrorResponse|createSuccessResponse|hints\b|ERRO
  │ R:|schema-downgrade|bulk-delete" (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/{tools,formatters}/*.ts"
  └ 10 files found

I’ve confirmed several of the earlier concerns and am now checking the tool layer itself for consistency in schemas, envelopes, and error handling.

● Read errors.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors.ts
  └ L1:280 (35 lines read)

● Read tool-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts
  └ L260:577 (269 lines read)

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L1:360 (360 lines read)

● Read checkpoint-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/checkpoint-tools.ts
  └ L1:360 (37 lines read)

● Read context-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/context-tools.ts
  └ L1:360 (18 lines read)

● Read memory-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/memory-tools.ts
  └ L1:360 (57 lines read)

● Read lifecycle-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/lifecycle-tools.ts
  └ L1:360 (66 lines read)

● Read causal-tools.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/causal-tools.ts
  └ L1:360 (36 lines read)

● Read recovery-hints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/lib/errors/recovery-hints.ts
  └ L420:760 (341 lines read)

● Read search-results.ts
  │ .opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts
  └ L1:320 (320 lines read)

● Search (grep)
  │ "createMCP|createResponse|wrapForMCP|return \{|summary:|hints:|meta:|throw new
  │ MemoryError|ERROR_CODES|userFriendlyError" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/tools)
  └ 1 line found

I’m extending the audit one layer deeper into validation and handler responses, since that’s where callers actually experience schema and envelope behavior.

● Read tool-input-schemas.ts
  │ .opencode/skill/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts
  └ L360:520 (161 lines read)

● Read types.ts
  │ .opencode/skill/system-spec-kit/mcp_server/tools/types.ts
  └ L1:220 (220 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L1:220 (220 lines read)

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L220:480 (261 lines read)

● Search (grep)
  │ "createMCP|createResponse|createErrorResponse|wrapForMCP|buildErrorResponse|formatZodError|ToolS
  │ chemaValidationError|summary:|hints:|meta:" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Search (glob)
  │ ".opencode/skill/system-spec-kit/mcp_server/handlers/**/*.ts"
  └ 40 files found

I’ve confirmed the schema validation is relatively strong; I’m now checking startup termination paths and which handlers bypass the standard envelope helpers.

● Read context-server.ts
  │ .opencode/skill/system-spec-kit/mcp_server/context-server.ts
  └ L900:1120 (174 lines read)

● Search (grep)
  │ "return \{\s*content:|createMCPErrorResponse|createMCPSuccessResponse|createMCPEmptyResponse|bui
  │ ldErrorResponse|wrapForMCP" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

● Search (grep)
  │ "Unknown tool|Invalid arguments for|Action: remove unknown
  │ keys|session_id|turnNumber|include_cognitive|minQualityScore|min_quality_score|olderThanDays|con
  │ firmName|clearExisting|reportMode|autoRepair" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server)
  └ 5 lines found

I’ve verified the startup completion/failure path. One last pass is checking representative handlers so I can judge whether response formatting is consistently enforced in practice, not just by helper availability.

● Read memory-search.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts
  └ L1:260 (260 lines read)

● Read memory-crud-health.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-health.ts
  └ L1:260 (260 lines read)

● Read checkpoints.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts
  └ L1:280 (279 lines read)

● Read memory-context.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
  └ L1:260 (260 lines read)

● Read response-builder.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/save/response-builder.ts
  └ L1:300 (300 lines read)

● Search (grep)
  │ "createMCP(?:Success|Empty|Error)?Response|createResponse|wrapForMCP|return \{\s*content:" in
  │ *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 5 lines found

I found a stronger response-consistency issue than I expected: some handlers emit symbolic error codes instead of the canonical `E###` codes. I’m confirming where that happens before I wrap up.

● Search (grep)
  │ "toolTip\?|createMCPErrorResponse\(|createMCPSuccessResponse\(|createMCPResponse\(" in *.ts
  │ (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 96 lines found

● Search (grep)
  │ "code:\s*'[^']+'" in *.ts (.opencode/skill/system-spec-kit/mcp_server/handlers)
  └ 53 lines found

The response-shape issue is real: the envelope is standardized, but the error-code vocabulary inside it is not. I’m doing one last CLI pass for help/flag handling, then I’ll deliver the audit.

● Read cli.ts
  │ .opencode/skill/system-spec-kit/mcp_server/cli.ts
  └ L260:620 (252 lines read)

✗ Search (grep)
  │ "--help|Unknown command|schema-downgrade|process\.exit\(|printUsage\(|ERROR:"
  │ (.opencode/skill/system-spec-kit/mcp_server/cli.ts)
  └ rg: unrecognized flag --help|Unknown
    command|schema-downgrade|process\.exit\(|printUsage\(|ERROR:

I found the most important architectural friction: the MCP tool catalog and the runtime validator disagree on some accepted parameters. I’m grabbing one representative handler example so I can show how that leaks into real error responses.

● Read memory-ingest.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts
  └ L180:320 (140 lines read)

● Read memory-crud-update.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-update.ts
  └ L220:255 (36 lines read)

● Read memory-crud-list.ts
  │ .opencode/skill/system-spec-kit/mcp_server/handlers/memory-crud-list.ts
  └ L1:120 (120 lines read)

# UX Friction Audit: system-spec-kit MCP Server

Scope reviewed:

`cli.ts`, `context-server.ts`, `startup-checks.ts`, `tool-schemas.ts`, `schemas/tool-input-schemas.ts`, `tools/*.ts`, `lib/errors.ts`, `lib/errors/core.ts`, `lib/errors/recovery-hints.ts`, `lib/response/envelope.ts`, and representative handlers/formatters behind those interfaces.

## Findings

### 1. MCP tool definitions and runtime validation are out of sync
Severity: High

The MCP catalog shown to callers is built from `TOOL_DEFINITIONS` (`context-server.ts:264-265`), but actual validation happens later with separate Zod schemas (`context-server.ts:281-325`, `tool-input-schemas.ts:506-520`).

That split is causing real contract drift:

- `memory_search` advertises `tenantId`, `userId`, `agentId`, `sharedSpaceId` (`tool-schemas.ts:63-67`), but the validator and allowed-parameter list reject them (`tool-input-schemas.ts:113-152`, `tool-input-schemas.ts:405-408`).
- `memory_save` advertises governance/provenance fields like `tenantId`, `sharedSpaceId`, `provenanceSource`, `retentionPolicy` (`tool-schemas.ts:186-189`), but the validator only accepts `filePath`, `force`, `dryRun`, `skipPreflight`, `asyncEmbedding` (`tool-input-schemas.ts:162-168`, `tool-input-schemas.ts:409`).

This is one of the highest-friction issues for AI callers: the tool list tells them to use parameters the server will reject.

### 2. Error-code vocabulary is inconsistent inside otherwise standardized envelopes
Severity: High

The top-level response envelope is standardized (`envelope.ts:126-285`), but the `data.code` field is not.

Canonical codes are defined as `E###` values (`recovery-hints.ts:45-119`), yet handlers emit a mix of:

- canonical-ish codes: `E021`, `E020`, `E081`
- ad hoc codes: `E_VALIDATION`, `E404`, `E_DB_UNAVAILABLE`, `E_INVALID_INPUT`
- symbolic names: `CHECKPOINT_CREATE_FAILED`, `CHECKPOINT_RESTORE_FAILED`

Examples:
- `memory-ingest.ts:203-217`, `255-265`, `284-294`
- `memory-crud-list.ts:38-103`
- `memory-crud-update.ts:231-240`
- `checkpoints.ts:118-129`, `226-240`

Compounding that, `createErrorResponse()` only adds hints when a handler explicitly passes `recovery`; it does not map `code` back to the recovery catalog (`envelope.ts:199-233`). So two tools can fail in the same envelope shape but with different code namespaces and different hint behavior.

### 3. Some error paths still do not tell the caller what to do next
Severity: Medium-High

The strongest positive pattern here is `formatZodError()`: it lists invalid parameters, unknown keys, expected names, and a next action (`tool-input-schemas.ts:457-499`).

But that clarity is not consistent across the system:

- Unknown tools fall through to `throw new Error("Unknown tool: ...")` (`context-server.ts:324-327`).
- That then becomes a generic fallback error response with default hints (`context-server.ts:398-405`, `recovery-hints.ts:652-661`), not a tool-aware “here are the valid tools” response.

So argument mistakes get helpful remediation, but catalog mistakes do not.

### 4. CLI help and CLI recovery guidance contradict the actual CLI
Severity: High

The CLI surface has a few direct UX traps:

- Bulk delete prints a restore instruction: `spec-kit-cli checkpoint restore <name>` (`cli.ts:351-356`).
- But the CLI only implements `stats`, `bulk-delete`, `reindex`, and `schema-downgrade` (`cli.ts:50-60`, `cli.ts:483-499`).

That means the CLI tells the user to run a command that does not exist.

There is also a hidden flag:

- `schema-downgrade` reads `--folder` (`cli.ts:434`, `cli.ts:457-461`),
- but the help text never documents it (`cli.ts:57-60`).

And reindex failures are noisy:

- on failure it prints the raw JSON envelope text to stderr (`cli.ts:398-403`) instead of extracting `summary` and `hints`.

### 5. Startup UX mixes normal progress, degraded mode, warnings, and fatal conditions
Severity: High

`context-server.ts` logs almost all startup state via `console.error`, including normal progress:

- waiting for model: `context-server.ts:515`
- starting scan: `context-server.ts:527`
- DB initialized: `context-server.ts:741-744`
- lazy loading enabled: `context-server.ts:831-832`
- server running: `context-server.ts:1065-1067`

That makes it hard to distinguish:

- normal startup
- degraded startup
- skipped startup work
- actual startup failure

Specific friction points:

- skipped startup scan is error-toned, but non-fatal (`context-server.ts:518-521`)
- “no memory files found” is also error-toned (`context-server.ts:529-531`)
- API-key validation exceptions defer failure to first use (`context-server.ts:781-785`)
- eager warmup timeout marks embeddings “ready” to avoid undefined state (`context-server.ts:820-825`), which can mask degraded startup
- final fatal handler is raw and generic (`context-server.ts:1073`)

There is one good explicit ready signal — `Context MCP server running on stdio` (`context-server.ts:1067`) — but it is buried in a stream of same-severity stderr messages.

### 6. Some recovery hints are misleading or too generic
Severity: Medium

A few recovery hints stand out as weak:

- `SESSION_EXPIRED` suggests `/memory:continue` (`recovery-hints.ts:462-468`), which is not an MCP tool.
- `PARAMETER_OUT_OF_RANGE` does not say which parameter was wrong or what range applies (`recovery-hints.ts:310-317`).
- `ANCHOR_FORMAT_INVALID` gives generic rules but not the offending anchor or file segment (`recovery-hints.ts:554-562`).
- `TOKEN_BUDGET_EXCEEDED` suggests splitting/summarizing, but does not include actual budget vs actual size (`recovery-hints.ts:563-570`).

These are not empty hints, but they still leave the caller doing detective work.

### 7. Parameter naming conventions are inconsistent
Severity: Medium

There is still visible naming drift across tools:

- `memory_match_triggers` mixes `session_id`, `turnNumber`, and `include_cognitive` in one interface (`tool-schemas.ts:179-182`, `tool-input-schemas.ts:154-160`, `tool-input-schemas.ts:408`)
- `memory_search` supports both `min_quality_score` and deprecated `minQualityScore` (`tool-schemas.ts:105-116`, `tool-input-schemas.ts:129-130`, `tool-input-schemas.ts:407`)

This increases cognitive load for AI callers and makes tool use less predictable.

### 8. Response composition is standardized, but payload semantics still vary enough to leak complexity
Severity: Medium

The envelope factory is solid (`envelope.ts:126-285`), but orchestration code already has to compensate for shape variation:

- `memory_context` must parse either `data.results` or nested `data.content[0].text` from delegated responses (`memory-context.ts:120-147`).

That is a warning sign: the top-level shell is standardized, but the practical shape of composed payloads is not uniform enough for easy reuse.

### 9. Severity taxonomy is inconsistent between catalog-based and ad hoc recoveries
Severity: Medium

The canonical recovery catalog defines severity as `low | medium | high | critical` (`recovery-hints.ts:13-23`).

But ad hoc handler-supplied recovery objects use values like `warning` and `error`:

- `memory-ingest.ts:212-216`
- `memory-crud-update.ts:236-240`

Because `createErrorResponse()` accepts any string severity (`envelope.ts:64-80`, `229-231`), clients can receive mixed severity vocabularies from different tools.

## Strong spots

- Schema-validation UX is strong when it is hit: `formatZodError()` is concrete and actionable (`tool-input-schemas.ts:457-499`).
- The recovery-hints catalog is broad and generally well structured (`recovery-hints.ts:140-643`).
- The envelope helpers do provide a real top-level contract (`envelope.ts:126-285`).

## Highest-priority fixes

1. Make tool definitions and validators share one source of truth.
2. Standardize all handler error codes onto the canonical `E###` catalog.
3. Fix CLI help/recovery text, especially the nonexistent `checkpoint restore` command and undocumented `--folder`.
4. Separate startup `info`, `warn`, and `fatal` semantics.
5. Replace generic/misleading hints like `/memory:continue` with real MCP recovery actions.

