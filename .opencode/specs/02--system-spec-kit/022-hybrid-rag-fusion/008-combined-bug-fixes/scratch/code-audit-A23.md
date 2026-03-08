● Todo added: Extract source file paths from each feature catalog markdown file

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-mem
  ory-content-generation.md
  └ 43 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/08-anchor-awar
  e-chunk-thinning.md
  └ 28 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/09-encoding-in
  tent-capture-at-index-time.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/10-auto-entity
  -extraction.md
  └ 47 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/11-content-awa
  re-memory-filename-generation.md
  └ 27 lines read

● Read .opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/12-generation-
  time-duplicate-and-empty-content-prevention.md
  └ 131 lines read

● Todo started: extract-source-files

● Parse source file paths from feature files
  $ python - <<'PY'
  import re, json, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  features=[
  '.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-me...
  └ 23 lines...

● Parse source paths from feature markdown
  $ python3 - <<'PY'
  import re, json, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public')
  features=[
  '.opencode/skill/system-spec-kit/feature_catalog/13--memory-quality-and-indexing/07-smarter-me...
  └ 176 lines...

● Grep "normalizeContentForEmbedding|normalizeContentForBM25|writeFilesAtomically|validateContentSub
stance|checkForDuplicateContent|generateContentSlug|encoding_intent|classifyEncodingIntent|chunk
thinning|thinChunks|extractEntities|computeEdgeDensity|normalizeEntityName"
(/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit)
  └ 5 lines found

● Find file-writer and key source files
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && rg --files | rg
  'file-writer\.ts$|content-normalizer\.ts$|chunk-thinning\.ts$|anchor-chunker\.ts$|encoding-int
  ent\.ts$|entity-extractor\.ts$|extraction-adapter\.ts$|redaction-gate\.ts$|working-memory\.ts$
  |slug-utils\.ts$|rollout-policy\.ts$|memory-parser\.ts$|memory-types\.ts$|type-inference\.ts$|...
  └ 21 lines...

● Count lines in key files
  $ cd '/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit' && wc -l mcp_server/lib/chunking/anchor-chunker.ts
   mcp_server/lib/chunking/chunk-thinning.ts mcp_server/lib/cognitive/rollout-policy.ts
  mcp_server/lib/cognitive/working-memory.ts mcp_server/lib/config/memory-types.ts
  mcp_server/lib/config/type-inference.ts mcp_server/lib/extraction/entity-extractor.ts ...
  └ 27 lines...

● Read .opencode/skill/system-spec-kit/mcp_server/lib/chunking/anchor-chunker.ts
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/chunking/chunk-thinning.ts
  └ 155 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/search/encoding-intent.ts
  └ 103 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/extraction/entity-extractor.ts
  └ 277 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/extraction/extraction-adapter.ts
  └ 298 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/extraction/redaction-gate.ts
  └ 95 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts lines 1-260
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/content-normalizer.ts
  └ 265 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts lines 261-620
  └ 360 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts lines 621-952
  └ 332 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/config/type-inference.ts
  └ 340 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/config/memory-types.ts
  └ 433 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/scoring/importance-tiers.ts
  └ 231 lines read

● Read .opencode/skill/system-spec-kit/shared/parsing/quality-extractors.ts
  └ 45 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/utils/canonical-path.ts
  └ 25 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/utils/path-security.ts
  └ 7 lines read

● Read .opencode/skill/system-spec-kit/shared/utils/path-security.ts
  └ 107 lines read

● Read .opencode/skill/system-spec-kit/scripts/core/file-writer.ts
  └ 93 lines read

● Read .opencode/skill/system-spec-kit/scripts/utils/slug-utils.ts
  └ 175 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/rollout-policy.ts
  └ 57 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 1-260
  └ 259 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 261-520
  └ 260 lines read

● Read .opencode/skill/system-spec-kit/mcp_server/lib/cognitive/working-memory.ts lines 521-674
  └ 154 lines read

● Compute source-file README coverage per feature
  $ python3 - <<'PY'
  import re, pathlib, json
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  feature_dir=root/'feature_catalog/13--memory-quality-and-indexing'...
  └ 32 lines...

● Compute README coverage for requested features
  $ python3 - <<'PY'
  import re, pathlib, json
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  rel_features=[...
  └ 896 lines...

● Demonstrate file-writer substance gate regex issue
  $ node - <<'NODE'
  const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;
  const content = `<!--\nANCHOR: start\n${'x'.repeat(260)}\n-->`;
  const stripped = content.replace(FRONTMATTER_BLOCK_RE,'').replace(/<!--.*?-->/g,'').replace(/^
  #+\s*.*$/gm,'').replace(/^\|.*\|$/gm,'').replace(/^\s*[-*]\s*$/gm,'').trim();...
  └ 5 lines...

● Demonstrate rollout bypass when identity missing
  $ node - <<'NODE'
  process.env.SPECKIT_ROLLOUT_PERCENT='10';
  function getRolloutPercent(){const raw=process.env.SPECKIT_ROLLOUT_PERCENT; if(typeof
  raw!=='string'||raw.trim().length===0) return 100; const parsed=parseInt(raw,10);
  if(!Number.isFinite(parsed)) return 100; return Math.max(0,Math.min(100,parsed));}...
  └ 10 lines...

● Count source files per requested feature
  $ python3 - <<'PY'
  import re, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  features=['07-smarter-memory-content-generation.md','08-anchor-aware-chunk-thinning.md','09-en...
  └ 15 lines...

● Generate README coverage lines for requested features
  $ python3 - <<'PY'
  import re, pathlib
  root=pathlib.Path('/Users/michelkerkmeester/MEGA/Development/Opencode
  Env/Public/.opencode/skill/system-spec-kit')
  features=[...
  └ 176 lines...

● Todo completed: audit-source-files

---
FEATURE: 07-smarter-memory-content-generation.md  
SOURCE_FILES_AUDITED: 16  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/config/memory-types.ts: LISTED in mcp_server/lib/config/README.md
- mcp_server/lib/config/type-inference.ts: LISTED in mcp_server/lib/config/README.md
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/lib/parsing/memory-parser.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/utils/canonical-path.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/path-security.ts: LISTED in mcp_server/lib/utils/README.md
- shared/parsing/quality-extractors.ts: LISTED in shared/parsing/README.md
- shared/utils/path-security.ts: LISTED in shared/utils/README.md
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/importance-tiers.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-parser-extended.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-parser.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-path-security.vitest.ts: LISTED in mcp_server/tests/README.md
- shared/parsing/quality-extractors.test.ts: LISTED in shared/parsing/README.md
---

---
FEATURE: 08-anchor-aware-chunk-thinning.md  
SOURCE_FILES_AUDITED: 3  
BUGS_FOUND: 0

README_COVERAGE:
- mcp_server/lib/chunking/anchor-chunker.ts: LISTED in mcp_server/lib/chunking/README.md
- mcp_server/lib/chunking/chunk-thinning.ts: LISTED in mcp_server/lib/chunking/README.md
- mcp_server/tests/chunk-thinning.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 09-encoding-intent-capture-at-index-time.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 1

BUG: MQI-001  
FILE: mcp_server/lib/search/encoding-intent.ts:36-39  
SEVERITY: P2-MINOR  
TYPE: LOGIC  
DESCRIPTION: Threshold comparison is strict (`> 0.4`) instead of inclusive (`>= 0.4`), so exact-boundary scores are misclassified as `document` despite the feature spec’s 0.4 threshold semantics.  
EVIDENCE:
```ts
// Threshold: >0.4 for classification
if (codeScore > 0.4 && codeScore > structuredScore) return 'code';
if (structuredScore > 0.4 && structuredScore >= codeScore) return 'structured_data';
```
SUGGESTED_FIX: Change both threshold checks to `>= 0.4`, and add boundary tests for exactly 0.4.

README_COVERAGE:
- mcp_server/lib/search/encoding-intent.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/tests/encoding-intent.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 10-auto-entity-extraction.md  
SOURCE_FILES_AUDITED: 12  
BUGS_FOUND: 2

BUG: MQI-002  
FILE: mcp_server/lib/extraction/extraction-adapter.ts:197-201  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: `resolveMemoryIdFromText()` resolves memory by `LIKE %spec.md LIMIT 1`, which can bind extracted events to an unrelated memory when multiple spec files exist.  
EVIDENCE:
```ts
const pathMatch = sourceText.match(/[A-Za-z0-9_./-]*spec\.md/);
...
const row = db.prepare('SELECT id FROM memory_index WHERE file_path LIKE ? LIMIT 1')
  .get(`%${pathMatch[0]}`);
```
SUGGESTED_FIX: Resolve using canonical/absolute path equality (or newest exact match by normalized path), and avoid broad `%...` suffix matches without disambiguation.

BUG: MQI-003  
FILE: mcp_server/lib/cognitive/rollout-policy.ts:41-47  
SEVERITY: P1-IMPORTANT  
TYPE: LOGIC  
DESCRIPTION: Rollout gating is bypassed when `identity` is absent; with rollout <100%, function returns `true` unconditionally, enabling feature for all anonymous calls.  
EVIDENCE:
```ts
const rolloutPercent = getRolloutPercent();
if (rolloutPercent >= 100) return true;
if (rolloutPercent <= 0) return false;

if (!identity || identity.trim().length === 0) {
  return true;
}
```
SUGGESTED_FIX: For missing identity, either return `false` under partial rollout or use deterministic fallback identity (e.g., process/session key) so percentage gating still applies.

README_COVERAGE:
- mcp_server/lib/cognitive/rollout-policy.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/working-memory.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/extraction/entity-extractor.ts: LISTED in mcp_server/lib/extraction/README.md
- mcp_server/lib/extraction/extraction-adapter.ts: LISTED in mcp_server/lib/extraction/README.md
- mcp_server/lib/extraction/redaction-gate.ts: LISTED in mcp_server/lib/extraction/README.md
- mcp_server/tests/checkpoint-working-memory.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/entity-extractor.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/extraction-adapter.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/redaction-gate.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/rollout-policy.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/working-memory-event-decay.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/working-memory.vitest.ts: LISTED in mcp_server/tests/README.md
---

---
FEATURE: 11-content-aware-memory-filename-generation.md  
SOURCE_FILES_AUDITED: 2  
BUGS_FOUND: 2

BUG: MQI-004  
FILE: mcp_server/lib/parsing/slug-utils.ts:1-1  
SEVERITY: P1-IMPORTANT  
TYPE: ERROR_HANDLING  
DESCRIPTION: Feature catalog points to a non-existent implementation path (`mcp_server/lib/parsing/slug-utils.ts`), so the referenced code cannot be audited or linked from that location.  
EVIDENCE: Source path extracted from feature file does not exist on disk; actual slug implementation is in `scripts/utils/slug-utils.ts`.  
SUGGESTED_FIX: Update feature catalog source mapping to the real file path (`scripts/utils/slug-utils.ts`) and keep it synchronized.

BUG: MQI-005  
FILE: scripts/utils/slug-utils.ts:170-173  
SEVERITY: P2-MINOR  
TYPE: EDGE_CASE  
DESCRIPTION: Fallback slug path has no minimum-length enforcement, so very short fallback values can produce low-signal filenames despite the feature requirement of meaningful minimum length.  
EVIDENCE:
```ts
const fallbackSlug = slugify(fallback);
if (fallbackSlug.length > 0) {
  return truncateSlugAtWordBoundary(fallbackSlug);
}
```
SUGGESTED_FIX: Enforce `fallbackSlug.length >= 8` (or pad/hash fallback when shorter), consistent with feature’s minimum-length contract.

README_COVERAGE:
- mcp_server/lib/parsing/slug-utils.ts: MISSING in mcp_server/lib/parsing/README.md
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md
---

---
FEATURE: 12-generation-time-duplicate-and-empty-content-prevention.md  
SOURCE_FILES_AUDITED: 106  
BUGS_FOUND: 1

BUG: MQI-006  
FILE: scripts/core/file-writer.ts:17-23  
SEVERITY: P1-IMPORTANT  
TYPE: EDGE_CASE  
DESCRIPTION: Empty-content guard does not remove multiline HTML comments/anchors because the regex `<!--.*?-->` is not dotall; template-only files with multiline comments can bypass the substance gate.  
EVIDENCE:
```ts
const stripped = content
  .replace(FRONTMATTER_BLOCK_RE, '')
  .replace(/<!--.*?-->/g, '') // fails on multiline comments
  ...
if (stripped.length < MIN_SUBSTANCE_CHARS) { ... }
```
SUGGESTED_FIX: Use `replace(/<!--[\s\S]*?-->/g, '')` (or `s` flag equivalent), and add a test with multiline anchor/comment-only content.

README_COVERAGE:
- mcp_server/configs/cognitive.ts: LISTED in mcp_server/configs/README.md
- mcp_server/core/config.ts: LISTED in mcp_server/core/README.md
- mcp_server/handlers/handler-utils.ts: LISTED in mcp_server/handlers/README.md
- mcp_server/handlers/memory-crud-types.ts: LISTED in mcp_server/handlers/README.md
- mcp_server/handlers/pe-gating.ts: LISTED in mcp_server/handlers/README.md
- mcp_server/handlers/save/create-record.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/handlers/save/db-helpers.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/handlers/save/dedup.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/handlers/save/types.ts: LISTED in mcp_server/handlers/save/README.md
- mcp_server/hooks/mutation-feedback.ts: MISSING in mcp_server/hooks/README.md
- mcp_server/lib/cache/embedding-cache.ts: LISTED in mcp_server/lib/cache/README.md
- mcp_server/lib/cognitive/fsrs-scheduler.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/prediction-error-gate.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/cognitive/rollout-policy.ts: LISTED in mcp_server/lib/cognitive/README.md
- mcp_server/lib/config/memory-types.ts: LISTED in mcp_server/lib/config/README.md
- mcp_server/lib/config/type-inference.ts: LISTED in mcp_server/lib/config/README.md
- mcp_server/lib/errors/core.ts: LISTED in mcp_server/lib/errors/README.md
- mcp_server/lib/errors/recovery-hints.ts: LISTED in mcp_server/lib/errors/README.md
- mcp_server/lib/interfaces/vector-store.ts: LISTED in mcp_server/lib/interfaces/README.md
- mcp_server/lib/parsing/content-normalizer.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/lib/parsing/memory-parser.ts: LISTED in mcp_server/lib/parsing/README.md
- mcp_server/lib/providers/embeddings.ts: LISTED in mcp_server/lib/providers/README.md
- mcp_server/lib/scoring/importance-tiers.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/scoring/interference-scoring.ts: LISTED in mcp_server/lib/scoring/README.md
- mcp_server/lib/search/bm25-index.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/encoding-intent.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/search-flags.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-aliases.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-mutations.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-queries.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-schema.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-store.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index-types.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/search/vector-index.ts: LISTED in mcp_server/lib/search/README.md
- mcp_server/lib/storage/incremental-index.ts: LISTED in mcp_server/lib/storage/README.md
- mcp_server/lib/utils/canonical-path.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/format-helpers.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/logger.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/lib/utils/path-security.ts: LISTED in mcp_server/lib/utils/README.md
- mcp_server/schemas/tool-input-schemas.ts: LISTED in mcp_server/schemas/README.md
- mcp_server/tool-schemas.ts: LISTED in mcp_server/README.md
- mcp_server/utils/batch-processor.ts: LISTED in mcp_server/utils/README.md
- mcp_server/utils/db-helpers.ts: LISTED in mcp_server/utils/README.md
- mcp_server/utils/index.ts: LISTED in mcp_server/utils/README.md
- mcp_server/utils/json-helpers.ts: LISTED in mcp_server/utils/README.md
- mcp_server/utils/tool-input-schema.ts: LISTED in mcp_server/utils/README.md
- mcp_server/utils/validators.ts: LISTED in mcp_server/utils/README.md
- shared/chunking.ts: LISTED in shared/README.md
- shared/config.ts: LISTED in shared/README.md
- shared/embeddings.ts: LISTED in shared/README.md
- shared/embeddings/factory.ts: LISTED in shared/embeddings/README.md
- shared/embeddings/profile.ts: LISTED in shared/embeddings/README.md
- shared/embeddings/providers/hf-local.ts: LISTED in shared/embeddings/providers/README.md
- shared/embeddings/providers/openai.ts: LISTED in shared/embeddings/providers/README.md
- shared/embeddings/providers/voyage.ts: LISTED in shared/embeddings/providers/README.md
- shared/normalization.ts: LISTED in shared/README.md
- shared/parsing/quality-extractors.ts: LISTED in shared/parsing/README.md
- shared/types.ts: LISTED in shared/README.md
- shared/utils/path-security.ts: LISTED in shared/utils/README.md
- shared/utils/retry.ts: LISTED in shared/utils/README.md
- mcp_server/tests/batch-processor.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/bm25-index.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/cognitive-gaps.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/config-cognitive.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/consumption-logger.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/content-hash-dedup.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/content-normalizer.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/embedding-cache.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/embeddings.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/encoding-intent.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/eval-logger.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/fsrs-scheduler.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/full-spec-doc-indexing.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/handler-memory-index-cooldown.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/handler-memory-index.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/hybrid-search-flags.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/importance-tiers.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/incremental-index-v2.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/incremental-index.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/index-refresh.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/integration-session-dedup.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/interference.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-parser-extended.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-parser.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/memory-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/prediction-error-gate.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/recovery-hints.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/regression-010-index-large-files.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/retry-manager.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/retry.vitest.ts: MISSING in mcp_server/tests/README.md
- mcp_server/tests/rollout-policy.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/score-normalization.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/scoring.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/search-flags.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/tool-input-schema.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/trigger-config-extended.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/trigger-setAttentionScore.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-composite-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-folder-scoring-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-normalization-roundtrip.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-normalization.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-path-security.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-tier-classifier-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/unit-transaction-metrics-types.vitest.ts: LISTED in mcp_server/tests/README.md
- mcp_server/tests/vector-index-impl.vitest.ts: LISTED in mcp_server/tests/README.md
- shared/parsing/quality-extractors.test.ts: LISTED in shared/parsing/README.md
---


Total usage est:        1 Premium request
API time spent:         4m 10s
Total session time:     4m 32s
Total code changes:     +0 -0
Breakdown by AI model:
 gpt-5.3-codex           977.8k in, 15.1k out, 848.8k cached (Est. 1 Premium request)
