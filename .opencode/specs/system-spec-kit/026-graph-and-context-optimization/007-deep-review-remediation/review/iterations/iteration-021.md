# Iteration 21 - security - lib

## Dispatcher
- iteration: 21 of 50
- dispatcher: cli-copilot gpt-5.4 high (code review v1)
- timestamp: 2026-04-16T06:01:56.566Z

## Files Reviewed
- .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/merge/anchor-merge-operation.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/parsing/trigger-matcher.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/routing/content-router.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/scoring/interference-scoring.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/bm25-index.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/cross-encoder.ts
- .opencode/skill/system-spec-kit/mcp_server/lib/search/deterministic-extractor.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts
- .opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/cross-encoder.vitest.ts
- .opencode/skill/system-spec-kit/mcp_server/tests/content-router.vitest.ts

## Findings - New
### P0 Findings
- None.

### P1 Findings
1. **Absolute `specFolder` values let the resume handlers read markdown outside the packet roots.** `buildResumeLadder()` accepts an absolute `specFolder`/`fallbackSpecFolder`, treats any existing directory as valid, and then opens `handover.md`, `implementation-summary.md`, and other canonical filenames from that directory even when it is outside `.opencode/specs` or `specs` (`lib/resume/resume-ladder.ts:523-577`, `590-620`). Both public recovery paths pass the caller-controlled field straight through (`handlers/session-resume.ts:123-134`, `425-428`; `handlers/memory-context.ts:887-890`). That makes the "packet-local resume ladder" into an arbitrary markdown disclosure primitive for any directory the service account can access.

```json
{
  "claim": "User-controlled absolute specFolder values can escape the specs roots and cause buildResumeLadder() to read handover/spec markdown from arbitrary directories.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:523-577",
    ".opencode/skill/system-spec-kit/mcp_server/lib/resume/resume-ladder.ts:590-620",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:123-134",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/session-resume.ts:425-428",
    ".opencode/skill/system-spec-kit/mcp_server/handlers/memory-context.ts:887-890",
    ".opencode/skill/system-spec-kit/mcp_server/tests/resume-ladder.vitest.ts:115-243"
  ],
  "counterevidenceSought": "I looked for handler-side normalization or a root-bound check that rejects absolute folders outside workspace specs roots, and for tests covering that rejection path; I did not find either.",
  "alternativeExplanation": "The code may have been intended to support absolute paths for internal callers, but the exposed handlers currently treat specFolder as external input and do not constrain it to packet roots.",
  "finalSeverity": "P1",
  "confidence": 0.97,
  "downgradeTrigger": "Downgrade if an upstream schema or transport layer already rejects absolute or out-of-root specFolder values before these handlers run."
}
```

2. **Graph-metadata derivation confirms and persists absolute file references from packet docs.** `deriveGraphMetadata()` extracts backticked file references from canonical docs, allows absolute paths through lookup resolution, and keeps the original absolute string when the referenced file exists (`lib/graph/graph-metadata-parser.ts:376-393`, `562-631`, `771-785`, `886-897`). The resulting absolute path is then written into `derived.key_files` and re-emitted as an entity path (`lib/graph/graph-metadata-parser.ts:726-755`, `886-897`). An attacker who can influence spec-doc content can use save-time graph refresh to probe for filesystem existence and leak out-of-repo absolute paths into `graph-metadata.json` and downstream search/index surfaces.

```json
{
  "claim": "deriveGraphMetadata() treats absolute file references in packet docs as valid key_files when they exist on disk, which leaks out-of-repo absolute paths into graph metadata.",
  "evidenceRefs": [
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:376-393",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:562-631",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:726-755",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:771-785",
    ".opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts:886-897",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:118-145",
    ".opencode/skill/system-spec-kit/mcp_server/tests/graph-metadata-schema.vitest.ts:166-205"
  ],
  "counterevidenceSought": "I checked for a read-side equivalent of writeGraphMetadataFile()'s supported-root enforcement and for tests that require absolute references to be dropped; neither exists.",
  "alternativeExplanation": "The current behavior may have been intended to preserve legitimately cross-referenced workspace files, but the implementation does not distinguish trusted in-repo paths from arbitrary absolute filesystem paths.",
  "finalSeverity": "P1",
  "confidence": 0.89,
  "downgradeTrigger": "Downgrade if the save pipeline strips or rejects absolute references before deriveGraphMetadata() ever sees canonical doc content."
}
```

### P2 Findings
- `tests/resume-ladder.vitest.ts:115-243` only exercises workspace-relative packet names; there is no regression that asserts absolute or out-of-root `specFolder` values are rejected.
- `tests/graph-metadata-schema.vitest.ts:166-205` validates happy-path `key_files` derivation only; it never asserts that absolute/out-of-repo references are discarded, despite the fixture helper explicitly being able to materialize absolute paths (`tests/graph-metadata-schema.vitest.ts:118-145`).
- `tests/cross-encoder.vitest.ts:24-245` mostly checks constants and fallback result shape. It does not cover provider-side payload boundaries (for example, enforcing `maxDocuments` before POSTing `documents.map(d => d.content)`), so future exfiltration regressions in the outbound reranker path could pass unnoticed.

## Traceability Checks
- The resume ladder is documented and implemented as a packet-local recovery path, but the current absolute-path acceptance in `buildResumeLadder()` breaks that contract by letting callers leave the packet roots entirely.
- `writeGraphMetadataFile()` correctly refuses writes outside supported specs roots (`lib/graph/graph-metadata-parser.ts:949-962`), but the read/derive side does not apply the same boundary to `key_files`, so the implementation only partially matches the "canonical spec-docs only" intent.

## Confirmed-Clean Surfaces
- `lib/merge/anchor-merge-operation.ts`: anchor IDs are regex-escaped, corrupted/conflicted anchor bodies are rejected up front, and merge modes stay scoped to located anchors; I did not find an obvious injection or anchor-smuggling sink here.
- `lib/search/bm25-index.ts`: FTS token sanitization strips operators/column filters and caps oversized query input before it is reused for lexical search.
- `lib/scoring/importance-tiers.ts` and `lib/scoring/interference-scoring.ts`: the reviewed SQL reads use fixed predicates plus positional placeholders, with no obvious user-controlled SQL string interpolation.
- `lib/search/cross-encoder.ts`: provider endpoints are fixed constants rather than user-supplied URLs, so I did not find an SSRF-style endpoint construction issue in this pass.

## Next Focus
- Iteration 22 should follow the security boundary from these libs into the remaining search/vector handlers, especially any path or network inputs that reach reranking, vector-store mutation, or persistence code.
