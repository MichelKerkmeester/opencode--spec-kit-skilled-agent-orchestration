# Iteration 005 — A5: Schema validation gaps

## Focus
Audited schema validation gaps around `JSON.parse`, zod boundary validation, unsafe post-parse casts, and path traversal handling under `.opencode/skill/system-spec-kit/mcp_server/`. The emphasis was on public MCP boundaries and parse results that can affect reads, writes, routing, or output contracts.

## Actions Taken
- Ran `rg -n "JSON\\.parse"` across `mcp_server` source, excluding compiled outputs for primary analysis.
- Ran `rg -n "\\.parse\\(|safeParse|z\\.object|zod"` to identify zod validation boundaries and compare raw parses against existing schemas.
- Read `schemas/tool-input-schemas.ts`, `context-server.ts`, shared `path-security.ts`, advisor schemas/handlers, memory save/ingest paths, resume ladder path resolution, coverage graph handlers/storage, JSON helpers, folder discovery, memory parser, and selected formatter/parser call sites.
- Checked path traversal controls for `memory_save`, `memory_ingest_start`, `code_graph_context` seed extraction, `session_resume`, and advisor `workspaceRoot` inputs.

## Findings

| ID | Priority | File:Line | Description | Recommendation |
|----|----------|-----------|-------------|----------------|
| F-005-A5-01 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/schemas/advisor-tool-schemas.ts:92-95` | `advisor_status` accepts `workspaceRoot` as any non-empty string. `readAdvisorStatus()` then `resolve()`s it and reads/scans under that root at `skill_advisor/handlers/advisor-status.ts:95-105`. `advisor_validate` has the same pattern for optional `workspaceRoot` at `skill_advisor/handlers/advisor-validate.ts:375-377`. This is a path-boundary gap: absolute or sibling workspace roots are not normalized and bounded to the current workspace before filesystem reads. | Replace raw `workspaceRoot` strings with a workspace-root schema/refinement that resolves, realpaths where possible, and requires containment under `process.cwd()` or an explicit allowlist. Prefer `findAdvisorWorkspaceRoot()` for default discovery and reject arbitrary absolute roots unless an admin-only mode is explicit. |
| F-005-A5-02 | P1 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:116-135` | `loadCorpus()` and `loadRegressionCases()` parse JSONL and cast each line directly to `CorpusRow` / `RegressionCase`. There is no zod schema for required fields such as prompt/gold skill/runtime case shape. Combined with the unbounded `workspaceRoot` above, attacker-controlled fixture files can bypass shape validation and poison or crash validation metrics. | Add `CorpusRowSchema` and `RegressionCaseSchema` with strict field checks. Parse each JSONL line as `unknown`, validate, and report line-numbered schema errors instead of trusting `as` casts. |
| F-005-A5-03 | P2 | `.opencode/skill/system-spec-kit/mcp_server/skill_advisor/handlers/advisor-validate.ts:220-238` | `runPythonTopSkills()` parses Python stdout as `Array<string \| null>` without validating array shape, element types, or length against the input rows. `parityRegressions()` then indexes into that result, so malformed or truncated stdout can silently under-report parity regressions. | Validate stdout with `z.array(z.string().nullable()).length(rows.length)` or an equivalent manual guard before computing parity results. |
| F-005-A5-04 | P2 | `.opencode/skill/system-spec-kit/mcp_server/formatters/search-results.ts:807-808` | Search result formatting uses generic `safeJsonParse<string[]>(...)`, whose implementation returns `JSON.parse(str) as T` at `utils/json-helpers.ts:16-20` and `formatters/search-results.ts:249-253`. A persisted `triggerPhrases` JSON object/string can bypass array validation and be emitted where the response contract expects `string[]`. | Replace generic parsing here with `safeJsonParseTyped(..., 'array', [])` plus `every(typeof === 'string')`, or a `z.array(z.string()).safeParse(...)` helper. |
| F-005-A5-05 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts:513-543` | `parseDescriptionMetadataContent()` parses `description.json` as `Record<string, unknown>` and manually defaults invalid fields. A proper `perFolderDescriptionSchema` exists at `lib/description/description-schema.ts:46-63`, and `folder-discovery.ts:157-162` uses it, but this parser path does not. Malformed metadata can therefore enter the memory index with empty/default fields instead of failing schema validation. | Reuse `perFolderDescriptionSchema.safeParse()` in `parseDescriptionMetadataContent()` and surface schema errors with file path context. Keep fallback extraction only for missing optional fields after schema validation. |
| F-005-A5-06 | P2 | `.opencode/skill/system-spec-kit/mcp_server/lib/storage/checkpoints.ts:1568-1578` | Checkpoint restore decompresses a snapshot and casts `JSON.parse(...) as CheckpointSnapshot`, then only checks that memory rows are an array. Table names, row object shapes, metadata fields, and governance payloads are not schema-validated before restore logic consumes them. | Add a checkpoint snapshot schema for the supported snapshot formats and validate before restore. Reject unknown table shapes or quarantine malformed rows with explicit restore errors. |

## Questions Answered
- Raw `JSON.parse` without zod is concentrated in internal envelope decoration, DB JSON columns, advisor fixtures/metrics, checkpoint snapshots, parsers, and formatters.
- Public MCP tool arguments are generally zod-validated by `validateToolArgs()` in `context-server.ts:923-939`.
- `memory_save` and `memory_ingest_start` have stronger path controls: they ultimately use `validateFilePath()` / configured memory roots (`shared/utils/path-security.ts:13-89`, `lib/search/vector-index-store.ts:303-309`, `handlers/memory-ingest.ts:230-258`).
- `code_graph_context` seed paths are schema-loose (`schemas/tool-input-schemas.ts:499-506`) but the passive file-path extraction path bounds candidates to `process.cwd()` before stat/read-like use (`context-server.ts:465-491`).
- `session_resume` accepts path-like `specFolder`, but the resume ladder bounds resolved folders to `workspace/.opencode/specs` or `workspace/specs` (`lib/resume/resume-ladder.ts:525-568`).

## Questions Remaining
- Several DB JSON column parsers (`coverage-graph`, `skill-graph`, `surrogate-storage`, learned feedback) still use `JSON.parse(...) as ...`; follow-up should classify which are purely trusted persistence and which can be influenced by public MCP inputs.
- The advisor `workspaceRoot` pattern also appears in rebuild/recommend surfaces; this iteration verified status/validate deeply, but a follow-up should trace every advisor tool dispatch path.
- Output-envelope zod validation is not systematic. A follow-up could define a response-contract validation layer for MCP envelopes where malformed DB JSON can leak to clients.

## Next Focus
Follow up on advisor tool root handling and DB JSON column schemas, especially checkpoint, skill graph, and coverage graph persistence where public writes may later become trusted typed reads.
