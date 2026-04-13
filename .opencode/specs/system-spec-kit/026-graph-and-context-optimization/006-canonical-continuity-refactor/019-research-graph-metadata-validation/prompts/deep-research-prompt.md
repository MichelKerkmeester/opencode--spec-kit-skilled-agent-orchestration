# Deep Research Prompt: Graph Metadata Quality & Relationship Validation

Use this prompt to launch the research via the sk-deep-research workflow.

## Invocation

```
/spec_kit:deep-research:auto "Graph metadata relationship validation and entity quality analysis across 515+ spec folders" --max-iterations=15 --spec-folder=.opencode/specs/system-spec-kit/026-graph-and-context-optimization/006-canonical-continuity-refactor/019-research-graph-metadata-validation
```

## Research Charter (for strategy.md initialization)

**Topic:** Scan all graph-metadata.json files across the spec tree to validate relationship integrity, entity quality, derived field accuracy, and timestamp freshness. Pure filesystem and code analysis - no historical save data needed.

**Constraints:**
- No historical save data needed. This is a pure filesystem scan of current state.
- Do NOT modify graph-metadata.json files. Read-only analysis only.
- Focus on measurable quantities: broken-edge rates, cycle detection, entity noise rates, status accuracy.
- Use Bash scripting (jq, find, grep) for corpus-wide scans. Use Read for targeted file inspection.

**Key Files (read these first):**
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts` - Zod schema defining valid structure
- `.opencode/skill/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts` - derivation logic, normalization, limits
- `.opencode/skill/system-spec-kit/scripts/graph/backfill-graph-metadata.ts` - batch generation logic

**Corpus to scan:**
- All `graph-metadata.json` files under `.opencode/specs/` (515+ files)
- Use: `find .opencode/specs -name "graph-metadata.json" -not -path "*/z_archive/*" -not -path "*/node_modules/*"`

**Research Questions (8):**
1. How many declared depends_on edges resolve to actual spec folders? What is the broken-edge rate?
2. Are there dependency cycles? Which folders participate?
3. Do children_ids match actual child directories? What is the ghost-child rate?
4. What percentage of key_files entries point to files that actually exist?
5. How many entities are basename-only duplicates of canonical-path entries?
6. Do status values match reality (compare with implementation-summary.md presence)?
7. What is the distribution of entity/key_file/trigger_phrase counts? Are the limits (16/20/12) appropriate?
8. How many files have stale last_save_at timestamps (older than spec-doc mtimes)?

**Iteration Focus Suggestions:**
- Iter 1-2: Count and inventory all graph-metadata.json files, read the schema
- Iter 3-5: Validate depends_on edges and children_ids (RQ-1, RQ-2, RQ-3)
- Iter 6-8: Validate key_files existence and entity quality (RQ-4, RQ-5)
- Iter 9-11: Cross-reference status with implementation reality (RQ-6)
- Iter 12-13: Compute distribution statistics (RQ-7) and timestamp freshness (RQ-8)
- Iter 14-15: Synthesize findings, identify systematic patterns, recommend parser improvements

**Useful jq Patterns:**
```bash
# Count all graph-metadata files
find .opencode/specs -name "graph-metadata.json" -not -path "*/z_archive/*" | wc -l

# Extract all depends_on targets
find .opencode/specs -name "graph-metadata.json" -not -path "*/z_archive/*" -exec jq -r '.manual.depends_on[]? // empty' {} \; | sort | uniq -c | sort -rn

# Check for cycles (all edges as source->target pairs)
find .opencode/specs -name "graph-metadata.json" -not -path "*/z_archive/*" -exec sh -c 'folder=$(dirname "{}"); jq -r --arg f "$folder" ".manual.depends_on[]? | \"\($f) -> \(.)\"" "{}"' \;

# Entity count distribution
find .opencode/specs -name "graph-metadata.json" -not -path "*/z_archive/*" -exec jq '.derived.entities | length' {} \; | sort -n | uniq -c

# Find shell commands in key_files
find .opencode/specs -name "graph-metadata.json" -not -path "*/z_archive/*" -exec jq -r '.derived.key_files[]? | select(test("node |npx |vitest|TMPDIR"))' {} \;
```

**Convergence Signal:** Research converges when all 8 questions have quantified answers, systematic patterns in broken references are identified, and parser improvement recommendations are documented.
