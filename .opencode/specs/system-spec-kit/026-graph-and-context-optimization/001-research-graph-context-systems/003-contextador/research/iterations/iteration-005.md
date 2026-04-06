# Iteration 5 -- 003-contextador

## Metadata
- Run: 5 of 10
- Focus: README-level and stats reality check across token-savings claims, licensing, Bun runtime, providers, `.mcp.json` setup, and Mainframe Docker/Operator prerequisites
- Agent: cli-codex (gpt-5.4, model_reasoning_effort=high)
- Started: UNKNOWN
- Finished: 2026-04-06T10:56:21Z
- Tool calls used: 8

## Reading order followed
1. `external/src/lib/core/stats.ts` `1-108`
2. `external/src/lib/providers/config.ts` `1-133`
3. `external/src/cli.ts` `1-225`
4. `external/package.json` `1-54`
5. `external/README.md` `1-121`
6. `external/TROUBLESHOOTING.md` `1-67`
7. `external/LICENSE-COMMERCIAL.md` `1-20`
8. `external/LICENSE` `1`
9. `external/src/lib/setup/wizard.ts` `1-334`
10. `external/src/cli.ts` `557-585`, `769-842`

## Findings

### F5.1 -- `stats.ts` computes token savings from fixed averages and aggregate counters, not from per-query measured avoided reads
- Source evidence: `external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:43-50`, `external/src/lib/core/stats.ts:60-65`, `external/src/lib/core/stats.ts:75-85`, `external/src/lib/core/stats.ts:88-107`, `external/src/cli.ts:557-577`
- Evidence type: source-proven
- What it shows: The stats model persists only aggregate counters such as `queriesServed`, `cacheHits`, `tokensUsedInit`, and `tokensUsedQueries`. Savings are estimated with two hard-coded constants: `AVG_MANUAL_EXPLORATION_TOKENS = 25000` and `AVG_CACHE_SAVINGS_TOKENS = 25000`. `estimateTokensSaved()` multiplies non-cache queries and cache hits by those constants, then subtracts recorded init/query token usage. The CLI surfaces the result explicitly as `Tokens saved (est.)`.
- Direct answer to open questions: Q8
- Why it matters for Code_Environment/Public: This is a coarse heuristic, not an empirical measurement of how many files or tokens a specific query actually avoided.
- Risk / ambiguity: The implementation does not record any baseline "without Contextador" query cost, so the reported savings are inherently model-based estimates rather than measured deltas.

### F5.2 -- The README's "93% fewer tokens" language is marketing-level and not substantiated by the stats implementation; the README's own example math does not match 93%
- Source evidence: `external/README.md:13-19`, `external/README.md:31-38`, `external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:75-85`
- Evidence type: README claim audited against source
- What it shows: The README claims "93% fewer tokens" and illustrates a reduction from roughly `50,000` tokens to roughly `500` tokens. That example implies about a 99% reduction, not 93%. The code does not contain a benchmark harness, measured baseline comparator, or query-level savings recorder that could justify the 93% figure. Instead it uses the fixed 25K-token estimate described in F5.1.
- Direct answer to open questions: Q5, Q8
- Why it matters for Code_Environment/Public: The 93% figure should be treated as README-level marketing or rough estimation, not as a source-proven benchmark.
- Risk / ambiguity: It is possible an external benchmark informed the README, but no such benchmark is present in the traced repository files for this iteration.

### F5.3 -- Bun is a real runtime requirement, not just a preferred package manager
- Source evidence: `external/src/cli.ts:1`, `external/package.json:27-33`, `external/package.json:44-53`, `external/src/lib/setup/wizard.ts:218-255`, `external/src/cli.ts:807-808`, `external/TROUBLESHOOTING.md:9-24`
- Evidence type: source-proven
- What it shows: The CLI shebang is `#!/usr/bin/env bun`. `package.json` declares Bun-based scripts for development, build, test, setup, and MCP execution, plus `engines.bun >=1.0.0`. The code uses Bun runtime APIs such as `Bun.spawn()` in the setup wizard and doctor/Mainframe checks. Troubleshooting also tells users to install Bun if setup will not start.
- Direct answer to open questions: Q9
- Why it matters for Code_Environment/Public: Bun is a runtime dependency for the shipped CLI and operational flows, not just a tooling convenience layered on top of generic Node execution.
- Risk / ambiguity: TypeScript is only a peer dependency (`external/package.json:48-50`), so the package expects Bun first and TypeScript second.

### F5.4 -- Provider support is broader than one vendor, but it is implemented as six explicit providers plus one host-mode default; "local models" are routed through the generic custom OpenAI-compatible path
- Source evidence: `external/src/lib/providers/config.ts:6-13`, `external/src/lib/providers/config.ts:15-44`, `external/src/lib/providers/config.ts:46-63`, `external/src/lib/providers/config.ts:76-112`, `external/src/lib/providers/config.ts:114-132`, `external/src/lib/setup/wizard.ts:31-114`, `external/README.md:36-38`
- Evidence type: source-proven with README claim cross-check
- What it shows: The code explicitly supports `anthropic`, `openai`, `google`, `copilot`, `openrouter`, `custom`, and `claude-code`. Detection priority is stored config first, then environment variables, then a `claude-code` default if nothing else is configured. The setup wizard offers the same seven choices and tests connectivity for every provider except `claude-code`, which is treated as host-provided MCP use rather than a direct API client. The `custom` provider is OpenAI-compatible and is the path that covers Ollama, LM Studio, and other local or self-hosted servers.
- Direct answer to open questions: Q9
- Why it matters for Code_Environment/Public: The README's "Any AI provider" claim is directionally true for the providers above, but the implementation surface is concrete and opinionated rather than fully provider-agnostic.
- Risk / ambiguity: README wording implies broader universality than the code proves. The source proves a finite set of adapters plus one generic OpenAI-compatible escape hatch.

### F5.5 -- `.mcp.json` "auto-detection" is file-based editor discovery, not runtime auto-registration by Contextador itself
- Source evidence: `external/README.md:53-57`, `external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`
- Evidence type: source-proven plus one inferred boundary
- What it shows: `contextador init` checks for a project-root `.mcp.json` and, if it is missing, writes one containing an `mcpServers.contextador` entry that runs `bunx contextador-mcp`. The doctor command then checks only for the file's presence and warns that MCP editors will not auto-detect Contextador if the file is missing. The README's "Use with Claude Code (auto-detected via .mcp.json)" therefore maps to editor-side discovery of that file, not to any in-process registration logic inside Contextador.
- Direct answer to open questions: Q10
- Why it matters for Code_Environment/Public: This is a useful pattern to compare with existing MCP surfaces in iteration 6, but it should not be described as deeper auto-detection than "init creates a config file that MCP-aware editors may read."
- Risk / ambiguity: The actual discovery behavior belongs to the host editor. This repository only proves file creation plus a doctor warning.

### F5.6 -- Mainframe depends on Docker only for the bundled auto-setup path; the underlying shared mode can also target an existing Matrix/Operator endpoint
- Source evidence: `external/README.md:67-84`, `external/TROUBLESHOOTING.md:14-17`, `external/TROUBLESHOOTING.md:36-40`, `external/src/lib/setup/wizard.ts:152-184`, `external/src/lib/setup/wizard.ts:186-215`, `external/src/lib/setup/wizard.ts:218-286`, `external/src/cli.ts:797-842`
- Evidence type: source-proven
- What it shows: Setup offers two Mainframe paths: auto-setup via Docker or connecting to an existing Matrix server. The Docker path generates an operator config, runs `docker compose`, and waits for `http://localhost:6167/_matrix/client/versions` to go healthy. The existing-server path only asks for a URL and server name, then checks the Matrix versions endpoint. The README and troubleshooting docs mention Docker prominently because it powers the automatic operator bootstrap, but the feature itself is not Docker-only.
- Direct answer to open questions: Q9
- Why it matters for Code_Environment/Public: Mainframe should be described as "optional shared mode with Docker-backed convenience setup or BYO Matrix endpoint," not simply "requires Docker."
- Risk / ambiguity: The doctor path checks Docker whenever project Mainframe is enabled (`external/src/cli.ts:805-821`), even though the wizard supports an existing-server path. That makes the diagnostics slightly biased toward the bundled Docker deployment story.

### F5.7 -- The licensing model is dual-track in practice: repository metadata declares `AGPL-3.0-or-later`, while the commercial side letter offers a proprietary alternative for closed-source adoption
- Source evidence: `external/package.json:2-7`, `external/README.md:113-117`, `external/LICENSE:1`, `external/LICENSE-COMMERCIAL.md:1-20`
- Evidence type: source-proven plus one licensing-family inference
- What it shows: `package.json` declares the SPDX expression `AGPL-3.0-or-later`. The first line of `LICENSE` is only the GNU AGPL title, not an SPDX header. The README shortens this to `AGPL-3.0`, while `LICENSE-COMMERCIAL.md` says View AI offers a commercial license for proprietary or closed-source use, for modifying without AGPL open-source obligations, and for support/custom development. Read together, the repo is presented as AGPL/open-source by default with a commercial alternative for adopters who do not want AGPL obligations.
- Direct answer to open questions: Q11
- Why it matters for Code_Environment/Public: Adoption guidance should distinguish repository metadata (`AGPL-3.0-or-later`) from the README shorthand (`AGPL-3.0`) and from the commercial exception path. The practical adoption question is not "is there one license?" but "which track are you choosing?"
- AGPL implication for adoption: inferred, not repo-proven legal advice. The stated commercial-license rationale implies the maintainers expect AGPL obligations to be incompatible with some proprietary deployments or modifications, so closed-source adopters are steered toward the commercial path rather than assuming the open-source default fits their use case.
- Risk / ambiguity: This finding deliberately stops short of giving legal advice. The repository proves the offered licensing tracks and the maintainers' intended split, but not a jurisdiction-specific compliance interpretation.

## Newly answered key questions
- Q5: The README overstates certainty around savings and universality. Its core directional claims line up loosely with implementation intent, but several lines are marketing-level rather than runtime-proven, especially the 93% token-reduction claim and the broad "Any AI provider" framing (`external/README.md:15-19`, `external/README.md:31-38`, `external/src/lib/core/stats.ts:26-28`, `external/src/lib/providers/config.ts:6-13`).
- Q8: `stats.ts` reports estimated savings from hard-coded averages and aggregate counters. It does not measure avoided token spend per query, so the 93% number is not source-proven by the stats subsystem (`external/src/lib/core/stats.ts:26-28`, `external/src/lib/core/stats.ts:75-85`, `external/src/cli.ts:574-577`).
- Q9: Bun is required, provider support is explicit rather than universal, and Mainframe can use either Docker auto-setup or an existing Matrix endpoint (`external/src/cli.ts:1`, `external/package.json:27-33`, `external/package.json:51-53`, `external/src/lib/providers/config.ts:15-44`, `external/src/lib/setup/wizard.ts:152-286`).
- Q10: `.mcp.json` auto-detection means `contextador init` writes a project MCP config file and MCP-aware editors may discover it; Contextador itself does not perform deeper registration magic (`external/src/cli.ts:141-145`, `external/src/cli.ts:769-776`, `external/README.md:53-57`).
- Q11: The repo advertises a dual-track model: open-source under `AGPL-3.0-or-later` plus a commercial license for proprietary or closed-source adoption (`external/package.json:6`, `external/LICENSE-COMMERCIAL.md:3-20`, `external/README.md:113-117`).

## Open questions still pending
- Q3: How lossy are the serialized pointer payloads versus raw `CONTEXT.md` content in realistic multi-query workflows?
- Q12: Which Contextador behaviors are genuinely novel compared with Code_Environment/Public's existing CocoIndex, Code Graph MCP, and Spec Kit Memory surfaces, and which are mostly packaging or README differentiation?

## Recommended next focus (iteration 6)
Run the cross-comparison iteration against Code_Environment/Public's existing surfaces: `.opencode/skill/mcp-coco-index/`, Compact Code Graph / Code Graph MCP, and Spec Kit Memory with `.opencode/skill/system-spec-kit/mcp_server/context-server.ts` plus the memory subsystem. The goal should be to separate what Contextador actually adds from what is already present under different names, especially around semantic retrieval, MCP wiring, self-healing feedback loops, cache semantics, and setup ergonomics.

## Self-assessment
- newInfoRatio (estimate, 0.0-1.0): 0.62
- status: insight
- findingsCount: 7
