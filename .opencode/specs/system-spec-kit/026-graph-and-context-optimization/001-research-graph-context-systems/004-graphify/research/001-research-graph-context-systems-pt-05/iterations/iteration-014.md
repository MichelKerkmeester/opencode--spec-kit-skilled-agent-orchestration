# Iteration 14: Narrowest Viable Multimodal Adoption Path

## Focus
This iteration answers Q17 by finding the smallest multimodal slice Public can adopt without building graphify's full ingestion subsystem. The standard here is safety and fit with current repo reality, not feature parity with graphify.

## Findings

### Finding 45
Public already has a multimodal-adjacent extraction surface in `diagram-extractor.ts`. It converts textual observations into structured diagram data, which means the repo does not start from zero on non-code artifact interpretation. The existing behavior is narrower than graphify's vision pass, but it proves there is already a pattern for structured extraction from non-code inputs. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:8-20; .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:121-188]

### Finding 46
The safest narrow path is local-file ingestion only. `memory-ingest.ts` enforces allowed base paths, rejects traversal, and canonicalizes real paths before processing. That is the opposite of graphify's remote-fetch-heavy ingestion model and should remain the trust boundary for any Public multimodal expansion. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227]

### Finding 47
A minimal multimodal scope for Public is therefore: PDF text extraction for local files, screenshot and diagram interpretation for local images, and reuse of the existing diagram-extraction style for structured outputs. There is no need to start with tweets, arbitrary webpages, or a full remote URL ingestion stack. [SOURCE: .opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:121-188; .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227]

### Finding 48
The wave-1 graphify lesson still applies: per-file-type strategies matter more than ingestion plumbing. Public should copy graphify's prompt-shaping discipline for screenshots, diagrams, and document artifacts, but keep the transport local-file-only and governed by existing path constraints. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227]

## Cross-Phase Overlap Handling
- This iteration did not propose a general-purpose asset pipeline or remote ingestion framework.
- It stayed tied to current extractor and ingest guardrails already present in Public.

## Exhausted / Ruled-Out Directions
- I looked for a need to replicate graphify's full remote ingestion subsystem and ruled it out. Public's current trust boundary is clearly local-path-based, and that is a better fit for a first multimodal rollout. [SOURCE: .opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227]

## Final Verdict on Q17
Public's narrowest viable multimodal adoption path is local-file-only: PDF text, screenshots, and diagrams. Reuse graphify's per-artifact prompting ideas, but keep ingestion inside current base-path and canonicalization guardrails instead of importing graphify's remote-fetch model.

## Tools Used
- `sed -n`
- `rg -n`
- `nl -ba`

## Sources Queried
- `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:8-20`
- `.opencode/skill/system-spec-kit/scripts/extractors/diagram-extractor.ts:121-188`
- `.opencode/skill/system-spec-kit/mcp_server/handlers/memory-ingest.ts:165-227`
