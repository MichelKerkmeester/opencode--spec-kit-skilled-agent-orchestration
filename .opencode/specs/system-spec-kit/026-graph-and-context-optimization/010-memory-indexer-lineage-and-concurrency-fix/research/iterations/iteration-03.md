## Iteration 03

### Focus
Canonical-path fallback and legacy-row behavior: assess whether the fix packet preserves lineage safety when older rows lack `canonical_file_path`.

### Findings
- The new PE guard explicitly falls back from `candidate.canonical_file_path` to `candidate.file_path` before normalizing, so the downgrade logic does not require the canonical column to be populated. (`.opencode/skill/system-spec-kit/mcp_server/handlers/save/pe-orchestration.ts:28-40`)
- `findSimilarMemories()` may legitimately return candidates with `canonical_file_path: null`, because it only forwards the value when vector-search rows provide it. (`.opencode/skill/system-spec-kit/mcp_server/handlers/pe-gating.ts:128-147`)
- Adjacent dedup coverage already protects the same legacy condition in the content-hash path: cross-path duplicates still resolve when legacy rows have `NULL canonical_file_path`, while same-path exclusions still work. (`.opencode/skill/system-spec-kit/mcp_server/tests/content-hash-dedup.vitest.ts:539-590`)
- No PE-specific regression currently exercises the null-canonical fallback; both packet regressions populate `canonical_file_path` explicitly, so this safety path is inferred from code plus nearby dedup tests rather than directly proven. (`.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:51-60`, `.opencode/skill/system-spec-kit/mcp_server/tests/pe-orchestration.vitest.ts:113-122`)

### New Questions
- Should the packet add a PE regression where the sibling candidate has `canonical_file_path: null` and only `file_path` is populated?
- Is there any route where a non-normalized `file_path` alias could still evade the downgrade?
- How does the system behave once the save crosses into lineage-state proper?
- Are there scope-specific logical-key rules that matter for scan concurrency?

### Status
new-territory
