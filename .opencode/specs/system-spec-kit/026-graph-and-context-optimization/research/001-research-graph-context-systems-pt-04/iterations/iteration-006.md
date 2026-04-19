# Iteration 6 -- 003-contextador

## Metadata
- Run: 6 of 10
- Focus: Cross-comparison against Code_Environment/Public retrieval surfaces: CocoIndex, Spec Kit Memory, Code Graph MCP
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T11:00:53Z
- Tool calls used: 10

## Reading order followed
1. `.opencode/skill/sk-deep-research/SKILL.md` `1-220`
2. `.opencode/skill/mcp-coco-index/SKILL.md` `1-240`
3. `.opencode/skill/mcp-coco-index/README.md` `1-260`
4. `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` `1-260`
5. `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts` `1-226`
6. `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts` `1-230`
7. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts` `1-260`
8. `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts` `40-50`, `190-220`
9. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts` `1-238`
10. `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts` `1-205`
11. `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-search.ts` `1-260`
12. `.opencode/skill/system-spec-kit/SKILL.md` `560-802`
13. `external/src/mcp.ts` `1-280`
14. `external/src/lib/core/pointers.ts` `1-190`
15. `external/src/lib/core/response.ts` `1-118`
16. `external/src/lib/mainframe/index.ts` `1-6`
17. `external/src/lib/mainframe/bridge.ts` `1-260`
18. `external/src/lib/core/stats.ts` `1-108`
19. `research/iterations/iteration-005.md` `1-99`

## Findings

Evidence posture for this iteration:
- Source-proven claims are grounded in code/handler files listed above.
- README-only or prior-iteration carryover claims are labeled explicitly.

### Cross-comparison table

| Capability | Contextador implementation | Public equivalent (CocoIndex / Code Graph MCP / Spec Kit Memory) | Verdict (NEW/DUPLICATE/HYBRID/NEGATIVE) | Recommendation (adopt now/prototype later/reject) |
| --- | --- | --- | --- | --- |
| MCP query interface for codebase questions | One primary `context` tool takes a natural-language question, optionally checks Mainframe, routes locally, then reads `CONTEXT.md` files and returns serialized pointer text (`external/src/mcp.ts:185-277`). | Public deliberately splits this into `memory_context()` for orchestration, CocoIndex for semantic search, and `code_graph_query()` / `code_graph_context()` for structural follow-up (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`, `.opencode/skill/system-spec-kit/SKILL.md:767-802`). | NEGATIVE | reject — Public already has a broader and more precise MCP surface for the same question class, while Contextador compresses multiple concerns into one weaker text-only entry point. |
| Semantic search backend | Source-proven code path is routed `CONTEXT.md` lookup plus pointer extraction/serialization; this iteration found no vector index or semantic embedding backend on the live `context` path (`external/src/mcp.ts:212-245`, `external/src/lib/core/pointers.ts:23-38`, `external/src/lib/core/pointers.ts:151-190`). | CocoIndex is a real vector-search subsystem with incremental indexing, SQLite vector storage, embedding models, and a dedicated MCP `search` tool (`.opencode/skill/mcp-coco-index/README.md:42-47`, `.opencode/skill/mcp-coco-index/README.md:53-59`, `.opencode/skill/mcp-coco-index/README.md:137-143`, `.opencode/skill/mcp-coco-index/README.md:161-170`). | NEGATIVE | reject — Contextador does not match the semantic-retrieval depth Public already has through CocoIndex. |
| Structural query backend (callers, imports, dependencies) | Pointer payloads expose only summary dependencies and API/test lists parsed from markdown headings, not symbol-level call/import traversal (`external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:80-138`, `external/src/lib/core/pointers.ts:151-190`). | Public has dedicated structural handlers with `outline`, `calls_from`, `calls_to`, `imports_from`, `imports_to`, transitive traversal, seed-based context expansion, and readiness metadata (`.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:9-16`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:86-192`, `.opencode/skill/system-spec-kit/SKILL.md:761-786`). | NEGATIVE | reject — Public's code graph layer is materially stronger and more exact than Contextador's markdown-derived dependency summaries. |
| Pointer-based context delivery depth | Contextador serializes a compact fixed schema: `purpose`, `keyFiles`, `dependencies`, `apiSurface`, and `tests`, then emits plain text blocks (`external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:151-190`). | Public can return richer payloads: anchor-filtered memory content and graph neighborhoods with anchors, graph context, text briefs, and metadata (`.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-45`, `.opencode/skill/system-spec-kit/SKILL.md:603-605`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:166-189`). | NEGATIVE | reject — Contextador's payload is compact but shallower than Public's existing content-plus-structure delivery options. |
| Self-healing / stale-context repair | Contextador does add a real repair loop: missing `CONTEXT.md` files are queued, background sweeps run, and feedback can enrich existing context docs by reading missing files and rewriting sections (`external/src/mcp.ts:101-115`, `external/src/mcp.ts:117-174`, `external/src/mcp.ts:224-255`). | Public already has freshness checks and bounded remediation, but mostly through readiness guidance and save-time verify-fix-verify rather than query-triggered markdown repair (`.opencode/skill/system-spec-kit/SKILL.md:612-613`, `.opencode/skill/system-spec-kit/SKILL.md:782-786`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:118-133`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:88-104`). | HYBRID | prototype later — the additive part is query-triggered document repair, but Public is already stronger on bounded read-path freshness contracts. |
| Cross-agent shared cache | Mainframe persists a project-local agent identity, checks recent room history by `queryHash`, broadcasts pointer payloads, and coordinates janitor work with a TTL-style room lock (`external/src/lib/mainframe/bridge.ts:26-58`, `external/src/lib/mainframe/bridge.ts:128-166`, `external/src/lib/mainframe/bridge.ts:216-249`, `external/src/mcp.ts:200-208`, `external/src/mcp.ts:262-272`). | Public has shared-memory spaces and governed collaborative retrieval/save surfaces, but they are memory artifacts and shared spaces rather than a query-hash answer cache (`.opencode/skill/system-spec-kit/SKILL.md:583-589`, `.opencode/skill/system-spec-kit/SKILL.md:616-617`, `.opencode/skill/system-spec-kit/SKILL.md:702-708`). | HYBRID | prototype later — there is overlap in collaboration, but Contextador adds a specific cross-agent answer-cache pattern that Public does not currently expose. |
| Token-efficiency reporting / measurement | Contextador's reporting is estimated from fixed constants (`25000` token averages) plus aggregate counters, not measured per-query avoided reads (`external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:75-107`). | Public emphasizes enforced token budgets, anchor-filtered retrieval, progressive disclosure, and typed retrieval traces rather than a broad savings headline (`.opencode/skill/system-spec-kit/SKILL.md:591-591`, `.opencode/skill/system-spec-kit/SKILL.md:604-605`, `.opencode/skill/system-spec-kit/SKILL.md:638-640`, `.opencode/skill/system-spec-kit/SKILL.md:712-712`, `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:131-139`). | NEGATIVE | reject — Public's budget/trace model is more trustworthy than Contextador's coarse token-savings estimate. |
| Multi-provider abstraction | Contextador explicitly supports Anthropic, OpenAI, Google, Copilot, OpenRouter, custom OpenAI-compatible endpoints, and `claude-code`; this is source-proven from prior iteration evidence, not newly re-derived here (`external/src/lib/providers/config.ts:6-13`, `external/src/lib/providers/config.ts:46-63`, `external/src/lib/providers/config.ts:76-112`; cross-referenced in `research/iterations/iteration-005.md:49-55`). | Public retrieval surfaces do support multiple embedding backends, but only at the embedding/config layer rather than as a unified end-user provider abstraction (`.opencode/skill/mcp-coco-index/README.md:55-57`, `.opencode/skill/mcp-coco-index/README.md:139-140`, `.opencode/skill/mcp-coco-index/README.md:182-187`, `.opencode/skill/system-spec-kit/mcp_server/context-server.ts:67-73`). | NEW | prototype later — this is additive setup/runtime ergonomics, but it is not a direct retrieval moat over Public's existing search stack. |
| `.mcp.json` auto-detection / framework setup | Contextador's setup story includes `.mcp.json` creation plus README-level "auto-detected via `.mcp.json`" language; the auto-detection claim is partly README-level and was source-audited in iteration 5 (`external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`, `external/README.md:51-57`; cross-referenced in `research/iterations/iteration-005.md:57-63`). | Public setup is manual but explicit: CocoIndex uses `ensure_ready.sh`, `ccc index`, `ccc status`, and direct MCP/CLI wiring, while session startup/recovery is handled through hooks and bootstrap tools rather than generated project MCP config (`.opencode/skill/mcp-coco-index/README.md:94-126`, `.opencode/skill/system-spec-kit/SKILL.md:741-757`). | NEW | prototype later — Contextador adds onboarding automation, but Public already has richer runtime recovery once the tools are installed. |
| Memory continuity / session resumption | Contextador can replay cached query answers from Mainframe and summarize room history, but this is query/broadcast reuse rather than a full merged recovery surface (`external/src/mcp.ts:200-208`, `external/src/lib/mainframe/bridge.ts:128-166`, `external/src/lib/mainframe/bridge.ts:205-214`). | Public has first-class recovery tools that merge memory context, code graph freshness, CocoIndex availability, health hints, and next actions into `session_resume()` / `session_bootstrap()` (`.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:68-143`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:154-213`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`, `.opencode/skill/system-spec-kit/SKILL.md:753-755`, `.opencode/skill/system-spec-kit/SKILL.md:796-802`). | NEGATIVE | reject — Public's session continuity surface is already deeper, more typed, and more recovery-oriented than Mainframe cache reuse. |

### F6.1 -- Public already covers the core retrieval stack more completely than Contextador, but it does so as three specialized surfaces rather than one marketing-friendly tool
- Source evidence: `external/src/mcp.ts:185-277`, `.opencode/skill/mcp-coco-index/README.md:42-47`, `.opencode/skill/system-spec-kit/mcp_server/tool-schemas.ts:40-50`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/query.ts:116-238`, `.opencode/skill/system-spec-kit/SKILL.md:772-786`
- Evidence type: source-proven
- What it shows: Contextador's top-level value proposition bundles routing, retrieval, and presentation into a single `context` call, but the underlying capability set is already split across Public's semantic search, structural graph queries, and session/memory orchestration. The split is real complexity, but it also gives Public more exact tools for each job.
- Direct answer to open questions: Q12
- Why it matters for Code_Environment/Public: Contextador is not a clean replacement for the existing stack; at most it is a packaging layer on top of capability classes Public already has.

### F6.2 -- Contextador's strongest additive idea is query-triggered context repair, not better retrieval depth
- Source evidence: `external/src/mcp.ts:101-115`, `external/src/mcp.ts:117-174`, `external/src/mcp.ts:224-255`, `.opencode/skill/system-spec-kit/SKILL.md:612-613`, `.opencode/skill/system-spec-kit/SKILL.md:782-786`
- Evidence type: source-proven
- What it shows: When Contextador detects missing or stale context, it can queue repair work and even enrich `CONTEXT.md` from concrete file reads. Public already has save-time autofix and read-path freshness handling, but it does not currently mutate documentation in response to live retrieval misses.
- Direct answer to open questions: Q12
- Why it matters for Code_Environment/Public: If anything from Contextador is worth prototyping, this repair pattern is the clearest candidate because it is genuinely additive rather than duplicate.

### F6.3 -- Mainframe overlaps with Public shared memory at the collaboration level, but its actual contribution is a query-hash cache, not a superior memory model
- Source evidence: `external/src/lib/mainframe/bridge.ts:128-166`, `external/src/lib/mainframe/bridge.ts:216-249`, `external/src/mcp.ts:200-208`, `.opencode/skill/system-spec-kit/SKILL.md:583-589`, `.opencode/skill/system-spec-kit/SKILL.md:616-617`, `.opencode/skill/system-spec-kit/SKILL.md:702-708`
- Evidence type: source-proven
- What it shows: Mainframe stores and replays prior broadcast results keyed by hashed queries and scopes. Public shared memory already supports governed collaboration and shared retrieval, but it is centered on persisted memory records and spaces, not on answer-cache replay.
- Direct answer to open questions: Q12
- Why it matters for Code_Environment/Public: This is a hybrid overlap, not a duplicate; adopting it would mean deciding whether an ephemeral/shared answer cache belongs alongside the current memory system.

### F6.4 -- Public is materially stronger for session recovery and structural depth than Contextador's pointer-centric workflow
- Source evidence: `external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:151-190`, `.opencode/skill/system-spec-kit/mcp_server/handlers/code-graph/context.ts:166-189`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:68-143`, `.opencode/skill/system-spec-kit/mcp_server/handlers/session-bootstrap.ts:107-217`
- Evidence type: source-proven
- What it shows: Contextador intentionally compresses output into a small fixed pointer schema, while Public can return anchor-targeted content, graph neighborhoods, freshness/readiness metadata, and merged resume packages. That makes Contextador cheaper to skim, but substantially thinner.
- Direct answer to open questions: Q12, partial Q3
- Why it matters for Code_Environment/Public: Contextador's pointer delivery should be treated as a lossy compression layer, not as a richer context model than Public already has.

### F6.5 -- The remaining novelty is mostly ergonomics: provider abstraction and MCP setup automation, not retrieval superiority
- Source evidence: `external/src/lib/providers/config.ts:6-13`, `external/src/lib/providers/config.ts:46-63`, `external/src/lib/providers/config.ts:76-112`, `external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`, `.opencode/skill/mcp-coco-index/README.md:94-126`, `.opencode/skill/system-spec-kit/SKILL.md:741-757`
- Evidence type: source-proven, with README carryover on the `.mcp.json` "auto-detected" wording
- What it shows: Contextador meaningfully improves onboarding ergonomics by supporting more provider choices and generating project MCP config. Public's advantage is not setup smoothness; it is the deeper retrieval and recovery substrate after setup is complete.
- Direct answer to open questions: Q12
- Why it matters for Code_Environment/Public: Any adoption discussion should separate operator ergonomics from retrieval capability, because Contextador is strongest on the former and weaker on the latter.

## Newly answered key questions
- Q12: Contextador is mostly weaker or overlapping on core retrieval. Public already wins on semantic search, structural queries, and session recovery. The clearest additive ideas are query-triggered doc repair, a query-hash shared cache, provider/setup ergonomics, and a deliberately shallow pointer format.
- Q3 (partial): The pointer payload is source-proven to contain only `purpose`, `keyFiles`, `dependencies`, `apiSurface`, and `tests` (`external/src/lib/core/pointers.ts:14-20`, `external/src/lib/core/pointers.ts:151-190`). That makes it substantially shallower than Public's anchor-filtered content plus graph-neighborhood surfaces, but this iteration did not benchmark task-level lossiness.

## Open questions still pending
- Q3: How much practical answer quality is lost when real multi-step tasks use pointer serialization instead of raw `CONTEXT.md` bodies, anchor-filtered memory content, or `code_graph_context` expansions?

## Recommended next focus (iteration 7)
Read `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/002-codesight/phase-research-prompt.md` and `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/001-research-graph-context-systems/004-graphify/phase-research-prompt.md`, then articulate the ownership boundary: what 003-contextador should own as routing/compression/cache/repair ergonomics versus what 002-codesight should own for semantic understanding and what 004-graphify should own for structural graph intelligence. Do not modify those phase folders.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.71
- status: insight
- findingsCount: 5
