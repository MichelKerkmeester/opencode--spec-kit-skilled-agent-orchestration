# Build Verification - C09 Path Assumptions (Top 5)

Date: 2026-02-15
Mode: Read-only verification (no source edits)
Scope: Top 5 findings (C09-001..C09-005)
Exclusion: node_modules relocation-only issues excluded

## Result

- validated_count: 5
- confirmed_count: 4
- overall_status: PARTIAL_CONFIRMATION
- confidence: 92%

## Finding-by-Finding Validation

### C09-001 - CONFIRMED
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/config.ts:203` (`PROJECT_ROOT: path.resolve(..., '..', '..', '..', '..')`).
- Evidence: `.opencode/skill/system-spec-kit/scripts/core/memory-indexer.ts:19` (`path.join(__dirname, '../../../mcp_server/database/.db-updated')`).
- Conclusion: Hardcoded traversal depth assumptions are present and structurally fragile.

### C09-002 - CONFIRMED
- Evidence: `.opencode/skill/system-spec-kit/scripts/common.sh:24` uses `(cd "$script_dir/../../../.." && pwd)` fallback.
- Evidence: `.opencode/skill/system-spec-kit/scripts/spec/archive.sh:23` uses `PROJECT_ROOT="$(cd "$SCRIPT_DIR/../../../../.." && pwd)"` fallback.
- Conclusion: Non-git fallback path resolution still depends on relative depth and logical `pwd` path behavior.

### C09-003 - PARTIAL (NOT CONFIRMED AS CRITICAL)
- Evidence for path assumption exists: `.opencode/skill/system-spec-kit/mcp_server/core/config.ts:31-33` and `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index.ts:152`.
- Counter-evidence: `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:792-794` creates missing directory; `.opencode/skill/system-spec-kit/mcp_server/lib/search/vector-index-impl.ts:797-817` throws explicit DB errors.
- Conclusion: Path fragility exists, but the original critical framing is overstated.

### C09-004 - CONFIRMED
- Evidence: `.opencode/skill/system-spec-kit/scripts/spec/create.sh:297` hardcodes `TEMPLATES_BASE="$REPO_ROOT/.opencode/skill/system-spec-kit/templates"`.
- Evidence: `.opencode/skill/system-spec-kit/scripts/templates/compose.sh:60` resolves templates via fixed relative traversal.
- Conclusion: Template discovery is coupled to current repository layout.

### C09-005 - CONFIRMED
- Evidence: `.opencode/skill/system-spec-kit/scripts/loaders/data-loader.ts:85-87` anchors allow-list to `process.cwd()` and its subpaths.
- Conclusion: Validation behavior varies by invocation directory and can be CWD-sensitive.

## Top Confirmed IDs

1. C09-001
2. C09-002
3. C09-004
4. C09-005
