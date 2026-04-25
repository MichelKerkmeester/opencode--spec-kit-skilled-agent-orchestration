# Iteration 001: Architecture Baseline and Pipeline DAG

## Focus

Establish the GitNexus architecture baseline: package layout, ingestion phases, graph persistence, and user-facing graph surfaces.

## Actions Taken

- Read the project architecture map and source package layout.
- Compared the documented phase DAG with the actual phase registry and runner.
- Checked whether the pipeline exposes typed dependencies or hidden phase coupling.

## Findings

- GitNexus is organized as ingestion, persistence, and query layers: `analyze.ts` delegates into `runFullAnalysis`, then `runPipelineFromRepo`, persists into `.gitnexus/`, and registers the repo for MCP discovery. [SOURCE: external/ARCHITECTURE.md:18]
- The query layer intentionally has three front doors over one backend: MCP stdio, HTTP bridge, and CLI direct commands. [SOURCE: external/ARCHITECTURE.md:22]
- The ingestion system is a fixed phase DAG: `scan -> structure -> [markdown, cobol] -> parse -> [routes, tools, orm] -> crossFile -> mro -> communities -> processes`. [SOURCE: external/ARCHITECTURE.md:80]
- The actual phase registry mirrors the documented sequence and conditionally appends graph-heavy phases when `skipGraphPhases` is false. [SOURCE: external/gitnexus/src/core/ingestion/pipeline.ts:73]
- The runner executes a topological sort, rejects duplicate names, missing dependencies, and cycles, then passes only declared dependency results into each phase. [SOURCE: external/gitnexus/src/core/ingestion/pipeline-phases/runner.ts:22] [SOURCE: external/gitnexus/src/core/ingestion/pipeline-phases/runner.ts:182]

## Questions Answered

- Partially answered: GitNexus' pipeline design is portable as an architectural pattern for Public Code Graph, especially phase metadata, explicit deps, timings, and failure attribution.

## Questions Remaining

- Whether Public Code Graph should adopt GitNexus' richer graph schema, or only the phase orchestration pattern.
- Whether process/community nodes are worth implementing before route/tool/API safety tools.

## Ruled Out

- Directly copying the whole GitNexus ingestion pipeline: Public's Code Graph currently supports a smaller language/runtime surface and should not inherit GitNexus' full native dependency profile.

## Dead Ends

- CocoIndex semantic bootstrap timed out before producing usable hits, so iteration evidence came from direct reads and `rg`.

## Sources Consulted

- external/ARCHITECTURE.md:18
- external/ARCHITECTURE.md:22
- external/ARCHITECTURE.md:80
- external/gitnexus/src/core/ingestion/pipeline.ts:73
- external/gitnexus/src/core/ingestion/pipeline-phases/runner.ts:22
- external/gitnexus/src/core/ingestion/pipeline-phases/runner.ts:182

## Reflection

- What worked and why: Source-first architecture reading quickly separated implemented DAG mechanics from README-level claims.
- What did not work and why: Semantic bootstrap was unavailable because CocoIndex timed out.
- What I would do differently: Start future runs by indexing the external tree only after confirming CocoIndex health.

## Recommended Next Focus

Compare GitNexus graph schema, edge metadata, and persistence model against Public's current SQLite Code Graph schema.
