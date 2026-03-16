OpenAI Codex v0.111.0 (research preview)
--------
workdir: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public
model: gpt-5.4
provider: openai
approval: never
sandbox: read-only
reasoning effort: xhigh
reasoning summaries: none
session id: 019cce98-3443-7353-a6fc-47847e699718
--------
user
You are a feature catalog verification agent. Read these feature snippet files: /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md through /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-auto-promotion-on-validation.md (files 05 through 10). For each, read its '## Source Files' section to find listed source file paths under /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/mcp_server/. Verify: (1) the 'Current Reality' description matches the actual code, (2) all listed file paths exist, (3) no important source files are missing. 

OUTPUT FORMAT (repeat for each feature file):
---
FEATURE: [filename without path]
DESCRIPTION_ACCURATE: [YES/NO/PARTIAL - does Current Reality match source code?]
CODE_PATHS_VALID: [YES/NO - do all listed file paths exist?]
INVALID_PATHS: [list any paths that do not exist, or NONE]
MISSING_CODE_PATHS: [list source files that implement this but are not listed, or NONE]
SEVERITY: [HIGH/MEDIUM/LOW - how important are any issues found]
RECOMMENDED_ACTION: [NONE/UPDATE_DESCRIPTION/UPDATE_PATHS/BOTH/REWRITE]
NOTES: [brief explanation of any issues]
---

LEAF NESTING CONSTRAINT: You are at depth 1. Do NOT invoke sub-agents. Complete with direct tool calls only.
Depth: 1
warning: Under-development features enabled: child_agents_md. Under-development features are incomplete and may behave unpredictably. To suppress this warning, set `suppress_unstable_features_warning = true` in /Users/michelkerkmeester/.codex/config.toml.
mcp: sequential_thinking starting
mcp: spec_kit_memory starting
mcp: code_mode starting
mcp: spec_kit_memory failed: MCP client for `spec_kit_memory` failed to start: MCP startup failed: handshaking with MCP server failed: connection closed: initialize response
mcp: code_mode ready
mcp: sequential_thinking ready
mcp startup: ready: code_mode, sequential_thinking; failed: spec_kit_memory
codex
I’m verifying the six feature snippets against the actual `system-spec-kit` MCP server code. First I’m checking the local instructions that apply here, then I’ll read the feature files and their referenced source files side by side so we can compare description, path validity, and any missing implementation files.
exec
/bin/zsh -lc "rg --files -g 'AGENTS.md' . .opencode/skill/system-spec-kit" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
./AGENTS.md
./.opencode/specs/03--commands-and-skills/sk-mcp/001-mcp-clickup-creation/context/clickup-cli-main/AGENTS.md
./.opencode/specs/02--system-spec-kit/z_archive/020-mcp-working-memory-hybrid-rag/scratch/opencode-working-memory/AGENTS.md
./.opencode/specs/02--system-spec-kit/024-sqlite-to-turso/context/turso-main/AGENTS.md
exec
/bin/zsh -lc 'python3 .opencode/skill/scripts/skill_advisor.py "Verify feature catalog snippets 05 through 10 under system-spec-kit against actual mcp_server source files; check Current Reality accuracy, listed path existence, and missing important source files; produce structured per-feature report" --threshold 0.8' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 656ms:
[
  {
    "skill": "system-spec-kit",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !spec, !system-spec-kit(explicit), document~, files~, folder"
  },
  {
    "skill": "sk-code--full-stack",
    "kind": "skill",
    "confidence": 0.95,
    "uncertainty": 0.15,
    "passes_threshold": true,
    "reason": "Matched: !intent:implementation, files, specification~, spec~, test~"
  },
  {
    "skill": "command-spec-kit",
    "kind": "command",
codex
The workspace only has the root [`AGENTS.md`](/Users/michelkerkmeester/MEGA/Development/Opencode%20Env/Public/AGENTS.md) governing these paths, and the skill router strongly points to `system-spec-kit`. I’m loading that guidance plus the six feature snippets now, then I’ll trace each snippet’s listed source files back into `mcp_server` and compare them against the actual implementation.
exec
/bin/zsh -lc "sed -n '1,260p' AGENTS.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §5 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/SKILL.md" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "for f in .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/0{5,6,7,8,9}-*.md .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/10-*.md; do printf '===== %s =====\\n' \""'$f"; sed -n '"'1,260p' \""'$f"; done' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
---
name: system-spec-kit
description: "Unified documentation and context preservation: spec folder workflow (levels 1-3+), CORE + ADDENDUM template architecture (v2.2), validation, and Spec Kit Memory for context preservation. Mandatory for all file modifications."
allowed-tools: [Bash, Edit, Glob, Grep, Read, Task, Write]
version: 2.2.26.0
---

<!-- Keywords: spec-kit, speckit, documentation-workflow, spec-folder, template-enforcement, context-preservation, progressive-documentation, validation, spec-kit-memory, vector-search, hybrid-search, bm25, rrf-fusion, fsrs-decay, constitutional-tier, checkpoint, importance-tiers, cognitive-memory, co-activation, tiered-injection -->

# Spec Kit - Mandatory Conversation Documentation

Orchestrates mandatory spec folder creation for all conversations involving file modifications. Ensures proper documentation level selection (1-3+), template usage, and context preservation through AGENTS.md-enforced workflows.


## 1. WHEN TO USE

### What is a Spec Folder?

A **spec folder** is a numbered directory (e.g., `specs/007-auth-feature/`) that contains all documentation for a single feature or task:

 succeeded in 50ms:
===== .opencode/skill/system-spec-kit/feature_catalog/11--scoring-and-calibration/05-folder-level-relevance-scoring.md =====
# Folder-level relevance scoring

## Current Reality

A four-factor weighted formula scores each spec folder: `score = (recency * 0.40) + (importance * 0.30) + (activity * 0.20) + (validation * 0.10)`. Recency uses a decay function `1 / (1 + days * 0.10)` so a 7-day-old folder scores about 0.59 and a 10-day-old folder about 0.50. Importance averages the tier weights of all memories in the folder. Activity caps at 1.0 when a folder has 5 or more memories. Archive folders (`z_archive/`, `scratch/`, `test-`, `prototype/`) receive a 0.1-0.2 multiplier to keep them out of top results.

This scoring enables two-phase retrieval: first rank folders by aggregated score, then search within the top-ranked folders. The DocScore formula `(1/sqrt(M+1)) * SUM(score(m))` provides damped aggregation so large folders do not dominate by volume alone. Runs behind the `SPECKIT_FOLDER_SCORING` flag (default ON).

## Source Files

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/lib/scoring/folder-scoring.ts` | Lib | Folder scoring implementation |
| `mcp_server/lib/search/folder-relevance.ts` | Lib | Folder relevance scoring |
| `shared/normalization.ts` | Shared | Text normalization |
| `shared/scoring/folder-scoring.ts` | Shared | Shared folder scoring |
| `shared/types.ts` | Shared | Type definitions |
codex
I’ve got the feature claims loaded. Next I’m checking which referenced files actually exist in `system-spec-kit`, then I’ll open the concrete implementation files and trace whether the described formulas, flags, tables, and pipeline behavior are really present.
exec
/bin/zsh -lc 'rg --files .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sort' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/INSTALL_GUIDE.md
.opencode/skill/system-spec-kit/mcp_server/LICENSE
.opencode/skill/system-spec-kit/mcp_server/README.md
.opencode/skill/system-spec-kit/mcp_server/_pending
.opencode/skill/system-spec-kit/mcp_server/api/README.md
.opencode/skill/system-spec-kit/mcp_server/api/eval.ts
.opencode/skill/system-spec-kit/mcp_server/api/index.ts
.opencode/skill/system-spec-kit/mcp_server/api/indexing.ts
.opencode/skill/system-spec-kit/mcp_server/api/providers.ts
.opencode/skill/system-spec-kit/mcp_server/api/search.ts
.opencode/skill/system-spec-kit/mcp_server/api/storage.ts
.opencode/skill/system-spec-kit/mcp_server/cli.ts
.opencode/skill/system-spec-kit/mcp_server/configs/README.md
.opencode/skill/system-spec-kit/mcp_server/configs/cognitive.ts
.opencode/skill/system-spec-kit/mcp_server/configs/search-weights.json
.opencode/skill/system-spec-kit/mcp_server/context-server.ts
.opencode/skill/system-spec-kit/mcp_server/core/README.md
.opencode/skill/system-spec-kit/mcp_server/core/config.ts
.opencode/skill/system-spec-kit/mcp_server/core/db-state.ts
.opencode/skill/system-spec-kit/mcp_server/core/index.ts
exec
/bin/zsh -lc "python3 -c \"from pathlib import Path; import re; root=Path('.opencode/skill/system-spec-kit'); files=sorted((root/'feature_catalog/11--scoring-and-calibration').glob('0[5-9]-*.md'))+sorted((root/'feature_catalog/11--scoring-and-calibration').glob('10-*.md'));\\nfor f in files:\\n text=f.read_text(); sec=text.split('## Source Files',1)[1]; paths=re.findall(r'"'`([''^`]+)`'"', sec); print('===', f.name, '===');\\n for p in paths: print(('OK   ' if (root/p).exists() else 'MISS ')+p)\"" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/folder-scoring.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/folder-relevance.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"SPECKIT_FOLDER_SCORING|DocScore|z_archive|prototype|scratch|0\\.40|0\\.30|0\\.20|0\\.10|computeFolderRelevance|folder relevance|folder score|archive multiplier\" .opencode/skill/system-spec-kit/mcp_server/lib .opencode/skill/system-spec-kit/shared .opencode/skill/system-spec-kit/mcp_server/tests" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public exited 1 in 51ms:
zsh:1: unmatched "
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Folder Scoring
// ---------------------------------------------------------------
// SCORING: FOLDER SCORING BARREL
// ---------------------------------------------------------------

export * from '@spec-kit/shared/scoring/folder-scoring';

=====
// ---------------------------------------------------------------
// MODULE: Folder Relevance
// ---------------------------------------------------------------
// Computes folder-level relevance scores from individual memory
// scores using damped aggregation: FolderScore = (1/sqrt(M+1)) * SUM(score(m))
//
// Gated behind SPECKIT_FOLDER_SCORING env var (default: disabled).
// Pure scoring addition — NO schema changes, NO new tables.
//
// References:
//   - PI-A1: Folder-level relevance scoring via DocScore aggregation
 succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:121:        { path: 'specs/z_archive/old-project', expected: true },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:122:        { path: 'specs/project/scratch/temp', expected: true },
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:134:      const archiveMultiplier = mod.getArchiveMultiplier('specs/z_archive/old');
.opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts:143:        createMemory({ specFolder: 'z_archive/old', spec_folder: 'z_archive/old' }),
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:114:  triggerQuality: 0.20,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:115:  lengthQuality: 0.20,
.opencode/skill/system-spec-kit/mcp_server/lib/validation/save-quality-gate.ts:117:  metadataQuality: 0.20,
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:171:      const p = 'specs/003-feature/scratch/notes.md';
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:285:      expect(mod.isMemoryFile('/project/specs/003-auth/scratch/notes.md')).toBe(false);
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:541:      // Write a file in scratch (not memory) that should be ignored
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:542:      const scratchDir = path.join(tmpRoot, 'specs', '030-find', 'scratch');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:543:      fs.mkdirSync(scratchDir, { recursive: true });
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:544:      writeFile(scratchDir, 'temp.md', '# Temp');
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:561:      const scratchFiles = files.filter((f: string) => f.includes('scratch'));
.opencode/skill/system-spec-kit/mcp_server/tests/memory-parser-extended.vitest.ts:562:      expect(scratchFiles).toHaveLength(0);
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:54:    it('T207: R=0.10 => COLD', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/tier-classifier.vitest.ts:55:      expect(tierClassifier.classifyState(0.10, 0)).toBe('COLD');
.opencode/skill/system-spec-kit/mcp_server/lib/validation/preflight.ts:219:    Object.setPrototypeOf(this, PreflightError.prototype);
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:638:  it('C138-T2: scratch tier has maximum decay multiplier', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/fsrs-scheduler.vitest.ts:639:    expect(TIER_MULTIPLIER.scratch).toBe(3.0);
exec
/bin/zsh -lc "sed -n '261,420p' .opencode/skill/system-spec-kit/shared/scoring/folder-scoring.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
  }).filter(t => !isNaN(t));

  if (timestamps.length === 0) {
    return new Date().toISOString();
  }

  return new Date(Math.max(...timestamps)).toISOString();
}

// ---------------------------------------------------------------
// 6. MAIN COMPUTATION
// ---------------------------------------------------------------

/**
 * Compute scores for all folders from a set of memories
 */
export function computeFolderScores(memories: FolderMemoryInput[], options: FolderScoreOptions = {}): FolderScore[] {
  const {
    excludePatterns = [],
    includeArchived = false,
exec
/bin/zsh -lc 'rg -n "last_used_at|INSERT OR REPLACE|embedding_cache|sha256|model_id|cache hit|cache miss|LRU|evict|max entries|feature flag|no feature flag" .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts .opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/tests/embedding-cache.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:28: * Create the embedding_cache table if it does not exist.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:35:    CREATE TABLE IF NOT EXISTS embedding_cache (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:37:      model_id TEXT NOT NULL,
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:41:      last_used_at TEXT NOT NULL DEFAULT (datetime('now')),
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:42:      PRIMARY KEY (content_hash, model_id)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:51: * On hit: updates last_used_at and returns the embedding Buffer.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:57: * @returns Embedding buffer on cache hit, null on miss
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:65:    'SELECT embedding, dimensions FROM embedding_cache WHERE content_hash = ? AND model_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:72:  // Update last_used_at on cache hit
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:74:    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ?",
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:84:// server processes. Eviction uses LRU (oldest last_used_at first).
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:89: * Uses INSERT OR REPLACE so duplicate (content_hash, model_id) pairs
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:110:  // Auto-evict oldest entries when cache exceeds size limit
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:112:    'SELECT COUNT(*) AS cnt FROM embedding_cache',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:118:      `DELETE FROM embedding_cache WHERE rowid IN (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:119:         SELECT rowid FROM embedding_cache ORDER BY last_used_at ASC LIMIT ?
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:125:    `INSERT OR REPLACE INTO embedding_cache
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:126:       (content_hash, model_id, embedding, dimensions, last_used_at)
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:131:/* --- 5. LRU EVICTION --- */
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:134: * Evict cache entries whose last_used_at is older than maxAgeDays.
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Embedding Cache
// ---------------------------------------------------------------
import { createHash } from 'crypto';
import type Database from 'better-sqlite3';

/* --- 1. INTERFACES --- */

interface EmbeddingCacheEntry {
  contentHash: string;
  modelId: string;
  embedding: Buffer;
  dimensions: number;
  createdAt: string;
  lastUsedAt: string;
}

interface EmbeddingCacheStats {
  totalEntries: number;
  totalSizeBytes: number;
exec
/bin/zsh -lc "rg -n \"lookupEmbedding|storeEmbedding|initEmbeddingCache|embedding_cache|generateOrCacheEmbedding\" .opencode/skill/system-spec-kit/mcp_server | sed -n '1,200p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:16:import { lookupEmbedding, storeEmbedding, computeContentHash as cacheContentHash } from '../lib/cache/embedding-cache';
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:251:        const cachedChunkBuf = lookupEmbedding(database, chunkHash, modelId);
.opencode/skill/system-spec-kit/mcp_server/handlers/chunking-orchestrator.ts:260:            storeEmbedding(database, chunkHash, modelId, chunkBuf, chunkEmbedding.length);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:9:import { lookupEmbedding, storeEmbedding } from '../../lib/cache/embedding-cache';
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:20:export async function generateOrCacheEmbedding(
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:37:      const cachedBuf = lookupEmbedding(database, parsed.contentHash, modelId);
.opencode/skill/system-spec-kit/mcp_server/handlers/save/embedding-pipeline.ts:52:          storeEmbedding(database, parsed.contentHash, modelId, embBuf, embedding.length);
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:62:import { generateOrCacheEmbedding } from './save/embedding-pipeline';
.opencode/skill/system-spec-kit/mcp_server/handlers/memory-save.ts:183:  const embeddingResult = await generateOrCacheEmbedding(database, parsed, filePath, asyncEmbedding);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:10:import { computeContentHash, lookupEmbedding, storeEmbedding } from '../cache/embedding-cache';
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:260:    const cachedEmbedding = lookupEmbedding(db, contentHash, modelId);
.opencode/skill/system-spec-kit/mcp_server/lib/providers/retry-manager.ts:279:        storeEmbedding(
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:28: * Create the embedding_cache table if it does not exist.
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:33:function initEmbeddingCache(db: Database.Database): void {
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:35:    CREATE TABLE IF NOT EXISTS embedding_cache (
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:59:function lookupEmbedding(
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:65:    'SELECT embedding, dimensions FROM embedding_cache WHERE content_hash = ? AND model_id = ?',
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:74:    "UPDATE embedding_cache SET last_used_at = datetime('now') WHERE content_hash = ? AND model_id = ?",
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:103:function storeEmbedding(
.opencode/skill/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts:112:    'SELECT COUNT(*) AS cnt FROM embedding_cache',
exec
/bin/zsh -lc 'rg -n "INTENT_WEIGHT_PROFILES|INTENT_WEIGHT_ADJUSTMENTS|isHybrid|hybrid|double-weight|double weighting|recency boost|adaptive fusion|intent weights|queryIntent" .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests/intent-classifier.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:327:        searchType: 'hybrid',
.opencode/skill/system-spec-kit/mcp_server/tests/pipeline-v2.vitest.ts:335:    expect(output.metadata.searchType).toBe('hybrid');
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:4:// Verifies that intent weights are applied correctly (not double-counted)
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:6://   System A: Channel fusion weights (adaptive-fusion.ts INTENT_WEIGHT_PROFILES)
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:7://   System B: Result scoring weights (intent-classifier.ts INTENT_WEIGHT_ADJUSTMENTS)
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:14:  hybridAdaptiveFuse,
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:15:  INTENT_WEIGHT_PROFILES,
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:85:      // System B: INTENT_WEIGHT_ADJUSTMENTS
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:86:      const systemB = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:92:      // System A: INTENT_WEIGHT_PROFILES
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:93:      const systemA = INTENT_WEIGHT_PROFILES[intent];
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:106:      const systemA = INTENT_WEIGHT_PROFILES[intent] as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:107:      const systemB = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent] as unknown as Record<string, unknown>;
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:121:  it('System B weights (INTENT_WEIGHT_ADJUSTMENTS) sum to ~1.0', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:124:      const w = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:144:  it('System A (adaptive fusion) uses channel weights, not attribute weights', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:149:    const result = hybridAdaptiveFuse(semantic, keyword, intent);
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:157:    const profile = INTENT_WEIGHT_PROFILES[intent];
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:179:    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['fix_bug'];
.opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts:229:    const bugResult = hybridAdaptiveFuse(semantic, keyword, 'fix_bug');
 succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Intent Classifier
// ---------------------------------------------------------------
/* --- 1. TYPES & CONSTANTS --- */

type IntentType = 'add_feature' | 'fix_bug' | 'refactor' | 'security_audit' | 'understand' | 'find_spec' | 'find_decision';

interface IntentResult {
  intent: IntentType;
  confidence: number;
  scores: Record<IntentType, number>;
  keywords: string[];
}

interface IntentWeights {
  recency: number;
  importance: number;
  similarity: number;
  contextType: string | null;
}
exec
/bin/zsh -lc "sed -n '460,740p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
 * This is the SINGLE authoritative point where all scoring signals are
 * applied. The ordering is fixed and must not be changed without updating
 * the architectural documentation (see types.ts Stage2 comment block).
 *
 * Signal application order (12 steps):
 *   1.  Session boost      (hybrid only — working memory attention)
 *   2.  Causal boost       (hybrid only — graph-traversal amplification)
 *   2a. Co-activation      (spreading activation from top-N seeds)
 *   2b. Community boost    (N2c — inject co-members)
 *   2c. Graph signals      (N2a+N2b — momentum + depth)
 *   3.  Testing effect     (all types, when trackAccess = true)
 *   4.  Intent weights     (non-hybrid only — G2 prevention)
 *   5.  Artifact routing   (all types, when routing confidence > 0)
 *   6.  Feedback signals   (all types — learned triggers + negative feedback)
 *   7.  Artifact limiting  (trim to strategy.maxResults if routing active)
 *   8.  Anchor metadata    (annotation — no score mutation)
 *   9.  Validation metadata (spec quality signals + quality scoring)
 *
 * @param input - Stage 2 input containing candidates and pipeline config
 * @returns Stage 2 output with scored results and per-signal metadata
exec
/bin/zsh -lc "sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/intent-weighting.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
// ---------------------------------------------------------------
// MODULE: Test — Intent Weighting
// ---------------------------------------------------------------
// Verifies that intent weights are applied correctly (not double-counted)
// across the two independent weight systems:
//   System A: Channel fusion weights (adaptive-fusion.ts INTENT_WEIGHT_PROFILES)
//   System B: Result scoring weights (intent-classifier.ts INTENT_WEIGHT_ADJUSTMENTS)

import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import * as intentClassifier from '../lib/search/intent-classifier';
import {
  getAdaptiveWeights,
  adaptiveFuse,
  hybridAdaptiveFuse,
  INTENT_WEIGHT_PROFILES,
  DEFAULT_WEIGHTS,
  FEATURE_FLAG,
} from '@spec-kit/shared/algorithms/adaptive-fusion';
import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RrfItem, FusionResult, RankedList } from '@spec-kit/shared/algorithms/rrf-fusion';
exec
/bin/zsh -lc "sed -n '680,860p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
                id: item.id,
                degreeScore: item.degreeScore,
              })),
              weight: 0.4,
            });
          }
        }
      } catch (_err: unknown) {
        // AI-GUARD: Non-critical — degree channel failure does not block pipeline
      }
    }

    // Merge keyword results after all channels complete
    const keywordResults: Array<{ id: number | string; source: string; [key: string]: unknown }> = [
      ...ftsChannelResults,
      ...bm25ChannelResults,
    ];

    if (lists.length > 0) {
      // T008: Track multi-source and graph-only results
exec
/bin/zsh -lc "sed -n '320,430p' .opencode/skill/system-spec-kit/shared/algorithms/adaptive-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    adaptiveCount: adaptiveResults.length,
    orderDifferences,
    topResultChanged,
  };
}

/* --- 8. MAIN ENTRY POINT --- */

/**
 * Adaptive hybrid fusion entry point.
 *
 * - Feature flag ON  -> use adaptive weighted fusion
 * - Feature flag OFF -> deterministic standard RRF fallback
 * - Dark-run mode: compute both, log diff, return standard
 *
 * @param semanticResults - Results from vector/semantic search
 * @param keywordResults  - Results from keyword/lexical search
 * @param intent          - Classified intent of the query
 * @param options         - Optional: documentType, identity, darkRun
 */
exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc 'rg -n "K values|grid search|20|40|60|80|100|MRR@5|Kendall|kendall|tau|optimal K|convention|rrf k|sensitivity" .opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts .opencode/skill/system-spec-kit/shared/algorithms/rrf-fusion.ts .opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: K-Value Sensitivity Analysis (T004a)
// ---------------------------------------------------------------
// Measures the impact of different RRF K-values on ranking stability.
// This is a measurement/analysis tool, not production code.
// ---------------------------------------------------------------

import { fuseResultsMulti } from '@spec-kit/shared/algorithms/rrf-fusion';
import type { RankedList, FusionResult } from '@spec-kit/shared/algorithms/rrf-fusion';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/** Result metrics for a single K-value configuration. */
interface KValueMetrics {
  /** Mean Reciprocal Rank at cutoff 5, estimated against baseline ranking. */
  mrr5: number;
  /** Kendall tau rank correlation with the baseline (K=60) ranking. */
  kendallTau: number;
 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:250:  it('C138-CV4: ID appearing in 3 variants gets +0.20 cross-variant bonus', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:262:    // 3 variants - 1 = 2 => 2 * 0.10 = 0.20 cross-variant bonus
.opencode/skill/system-spec-kit/mcp_server/tests/unit-rrf-fusion.vitest.ts:263:    expect(shared.convergenceBonus).toBeCloseTo(0.20, 2);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:32:  it('T021: RRF fusion with default k=60 parameter', () => {
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:33:    expect(DEFAULT_K).toBe(60);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:53:    const expectedDoc1Base = 1 / (60 + 0 + 1) + 1 / (60 + 1 + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:56:    const expectedDoc3 = 1 / (60 + 2 + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:103:    const baseRrf = 1 / (60 + 0 + 1) + 1 / (60 + 0 + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/rrf-fusion.vitest.ts:116:    const expectedNoBonus = 1 / (60 + 0 + 1);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:2:// MODULE: Test — RSF vs RRF Kendall Tau
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:7:// Decision criterion: tau < 0.4 = REJECT RSF (rankings too different)
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:18: * Compute Kendall tau-b rank correlation coefficient.
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:19: * Handles ties using the tau-b variant:
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:20: *   tau_b = (C - D) / sqrt((C + D + T1) * (C + D + T2))
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:29:function kendallTauB(rankingA: number[], rankingB: number[]): number {
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:47:        // Tied in both — ignored in tau-b
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:89:): { tau: number; commonIds: number; totalIds: number } {
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:109:  const tau = kendallTauB(rankVecA, rankVecB);
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:110:  return { tau, commonIds, totalIds: allIds.size };
.opencode/skill/system-spec-kit/mcp_server/tests/rsf-vs-rrf-kendall.vitest.ts:159:    results.push(makeItem(maxBaseId + 100 + i, Math.max(0, score)));
exec
/bin/zsh -lc "rg -n \"analyzeKValueSensitivity|K_VALUES|BASELINE_K\" .opencode/skill/system-spec-kit/mcp_server .opencode/skill/system-spec-kit/shared | sed -n '1,120p'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 50ms:
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:37:  analyzeKValueSensitivity,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:40:  K_VALUES,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:41:  BASELINE_K,
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:287:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:290:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:299:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:304:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:309:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:315:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:321:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:323:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:330:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:332:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:339:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:341:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:347:    const analysis = analyzeKValueSensitivity(testLists, 1);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:353:    const analysis = analyzeKValueSensitivity([], 0);
.opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts:355:    for (const k of K_VALUES) {
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:128:const K_VALUES = [20, 40, 60, 80, 100] as const;
.opencode/skill/system-spec-kit/mcp_server/lib/eval/k-value-analysis.ts:131:const BASELINE_K = 60;
exec
/bin/zsh -lc "sed -n '250,380p' .opencode/skill/system-spec-kit/mcp_server/tests/score-normalization.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:

  it('handles empty array', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';
    expect(normalizeCompositeScores([])).toEqual([]);
  });

  it('equal scores normalize to 1.0', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

    const scores = [0.5, 0.5, 0.5];
    const normalized = normalizeCompositeScores(scores);

    for (const s of normalized) {
      expect(s).toBe(1.0);
    }
  });

  it('single score normalizes to 1.0', () => {
    process.env.SPECKIT_SCORE_NORMALIZATION = 'true';

exec
/bin/zsh -lc "sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts && printf '\\n=====\\n' && sed -n '1,260p' .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts && printf '\\n=====\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "rg -n \"negative_feedback_events|RECOVERY_HALF_LIFE_MS|RECOVERY_HALF_LIFE_DAYS|0\\.3|wasUseful|SPECKIT_NEGATIVE_FEEDBACK|applyNegativeFeedback|confidence multiplier|last_negative_feedback_at|confidence-tracker|memory_validate|feedback signals\" .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts .opencode/skill/system-spec-kit/mcp_server/lib/search/search-flags.ts .opencode/skill/system-spec-kit/mcp_server/handlers/*.ts .opencode/skill/system-spec-kit/mcp_server/tests/confidence-tracker.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/*.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
// ---------------------------------------------------------------
// MODULE: Confidence Tracker
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

// ---------------------------------------------------------------
// 1. TYPES
// ---------------------------------------------------------------

export type { Database };

export interface ValidationResult {
  confidence: number;
  validationCount: number;
  positiveValidationCount: number;
  promotionEligible: boolean;
  wasPromoted: boolean;
}

 succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/index.ts:101:  handle_memory_validate,
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:49:      FROM negative_feedback_events
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:100:export function recordValidation(db: Database, memoryId: number, wasUseful: boolean): ValidationResult {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:116:      if (wasUseful) {
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:132:      const effectiveNegativeValidationCount = wasUseful
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:156:    console.error(`[confidence-tracker] recordValidation failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:183:    console.error(`[confidence-tracker] getConfidenceScore failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:213:    console.error(`[confidence-tracker] checkPromotionEligible failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:253:    console.warn(`[confidence-tracker] Memory ${memoryId} promoted to critical tier`);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:257:    console.error(`[confidence-tracker] promoteToCritical failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts:295:    console.error(`[confidence-tracker] getConfidenceInfo failed for memory ${memoryId}:`, error);
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:5:// When wasUseful=false is recorded via memory_validate, reduce the
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:6:// memory's composite score via a confidence multiplier.
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:9:// Floor: 0.3 (never suppress below 30% of original score)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:23:export const CONFIDENCE_MULTIPLIER_FLOOR = 0.3;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:34:export const RECOVERY_HALF_LIFE_MS = 30 * 24 * 60 * 60 * 1000;
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:38:  CREATE TABLE IF NOT EXISTS negative_feedback_events (
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:47:  CREATE INDEX IF NOT EXISTS idx_negative_feedback_events_memory
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:48:  ON negative_feedback_events(memory_id, created_at_ms DESC)
.opencode/skill/system-spec-kit/mcp_server/lib/scoring/negative-feedback.ts:56: * Compute the confidence multiplier based on negative validation count
exec
/bin/zsh -lc "sed -n '300,430p' .opencode/skill/system-spec-kit/mcp_server/lib/search/pipeline/stage2-fusion.ts && printf '\\n=====\\n' && sed -n '313,445p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 52ms:
    // No boost; still re-sort for consistency
    return [...results].sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
  }

  const boosted = results.map((row) => {
    const baseScore = resolveBaseScore(row);
    const boostedScore = baseScore * boostFactor;
    return {
      ...row,
      score: boostedScore,
      artifactBoostApplied: boostFactor,
    };
  });

  return boosted.sort((a, b) => resolveBaseScore(b) - resolveBaseScore(a));
}

/**
 * Apply feedback signals — learned trigger boosts and negative feedback demotions.
 *
exec
/bin/zsh -lc 'rg -n "autoPromotion|memory_promotion_audit|8-hour|8 hour|rolling window|3 per 8|promot|non-promotable|constitutional|critical|temporary|deprecated|5 positive|10 positive|important-tier|previousTier|newTier|validationCount|reason" .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts .opencode/skill/system-spec-kit/mcp_server/lib/scoring/confidence-tracker.ts .opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts .opencode/skill/system-spec-kit/mcp_server/tests/checkpoints-extended.vitest.ts' in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,280p' .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts && printf '\\n=====\\n' && sed -n '333,430p' .opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts && printf '\\n=====\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/promotion-positive-validation-semantics.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:14:import { executeAutoPromotion } from '../lib/search/auto-promotion';
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:67:  validationCount: number;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:69:  promotionEligible: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:344:  // T002a: Auto-promotion wiring on positive feedback.
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:345:  let autoPromotion: {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:347:    promoted: boolean;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:348:    previousTier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:349:    newTier?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:350:    reason?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:354:    const promotionResult = executeAutoPromotion(database, memoryId);
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:355:    autoPromotion = {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:357:      promoted: promotionResult.promoted,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:358:      previousTier: promotionResult.previousTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:359:      newTier: promotionResult.newTier,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:360:      reason: promotionResult.reason,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:374:    reason?: string;
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:398:        reason: learnResult.reason,
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:405:        reason: 'missing_query_terms_or_rank',
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:415:  if (result.promotionEligible) {
.opencode/skill/system-spec-kit/mcp_server/handlers/checkpoints.ts:416:    hints.push('Memory eligible for promotion to critical tier');
 succeeded in 50ms:
// ---------------------------------------------------------------
// MODULE: Auto Promotion
// ---------------------------------------------------------------
//
// Promotes memory importance tier based on positive validation count:
// - >=5 positive validations: normal -> important
// - >=10 positive validations: important -> critical
// - Below threshold: no change (no-op)
//
// Does NOT demote -- only promotes upward.
// ---------------------------------------------------------------

import type { DatabaseExtended as Database } from '@spec-kit/shared/types';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

export type { Database };

exec
/bin/zsh -lc "sed -n '920,980p' .opencode/skill/system-spec-kit/mcp_server/lib/search/hybrid-search.ts && printf '\\n=====\\n' && sed -n '1,240p' .opencode/skill/system-spec-kit/mcp_server/tests/folder-relevance.vitest.ts && printf '\\n=====\\n' && sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/folder-scoring.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:
          // are promoted to their correct position in the ranking
          reranked.sort((a, b) => ((b.score as number) ?? 0) - ((a.score as number) ?? 0));
        } catch (_err: unknown) {
          // AI-GUARD: Non-critical enrichment — co-activation failure does not affect core ranking
        }
      }

      // Sprint 1: Folder relevance / two-phase retrieval (SPECKIT_FOLDER_SCORING)
      if (db && isFolderScoringEnabled() && reranked.length > 0) {
        try {
          const numericIds = reranked
            .map(r => r.id)
            .filter((id): id is number => typeof id === 'number');

          if (numericIds.length > 0) {
            const folderMap = lookupFolders(db, numericIds);
            if (folderMap.size > 0) {
              const folderScores = computeFolderRelevanceScores(reranked, folderMap);
              const rawTopK = process.env.SPECKIT_FOLDER_TOP_K;
              const parsedTopK = rawTopK ? parseInt(rawTopK, 10) : NaN;
codex
I’ve finished the first pass on the code paths and I’m now checking the trickier behavior claims, especially where the snippets describe architecture decisions rather than simple constants. A few of these look like they’ve drifted from the implementation, so I’m tracing the exact runtime call paths before I lock in the report.
exec
/bin/zsh -lc "sed -n '430,620p' .opencode/skill/system-spec-kit/mcp_server/lib/search/intent-classifier.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '220,420p' .opencode/skill/system-spec-kit/mcp_server/lib/search/auto-promotion.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Publicexec
/bin/zsh -lc "sed -n '1,220p' .opencode/skill/system-spec-kit/mcp_server/tests/learned-feedback.vitest.ts" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 51ms:

  for (const [intent, score] of Object.entries(scores)) {
    if (score > topScore) {
      topScore = score;
      topIntent = intent as IntentType;
    }
  }

  // AI-WHY: P3-12: If top score is below minimum confidence, return "understand" with low confidence
  // This prevents weak single-keyword matches from dominating classification.
  if (topScore < MIN_CONFIDENCE_THRESHOLD) {
    return {
      intent: 'understand',
      confidence: topScore,
      scores,
      keywords: [...new Set(allKeywords)],
    };
  }

  return {
 succeeded in 51ms:
    const check = checkAutoPromotion(db, memoryId);

    if (!check.promoted) {
      return check;
    }

    // AI-WHY: Safeguard: cap promotion throughput to avoid runaway tier inflation.
    ensurePromotionAuditTable(db);
    const nowMs = Date.now();
    const recentPromotions = countRecentPromotions(db, nowMs);
    if (recentPromotions >= MAX_PROMOTIONS_PER_WINDOW) {
      return {
        promoted: false,
        previousTier: check.previousTier,
        newTier: check.previousTier,
        validationCount: check.validationCount,
        reason: `promotion_window_rate_limited: ${recentPromotions}/${MAX_PROMOTIONS_PER_WINDOW} in ${PROMOTION_WINDOW_HOURS}h`,
      };
    }

 succeeded in 51ms:
// @ts-nocheck
// ---------------------------------------------------------------
// TEST: Learned Relevance Feedback (R11)
// ---------------------------------------------------------------
// Tests all 10 safeguards, auto-promotion (T002a), and negative
// feedback confidence signal (T002b/A4).
// ---------------------------------------------------------------

import { describe, it, expect, beforeAll, beforeEach, afterAll, afterEach, vi } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import Database from 'better-sqlite3';

// Module under test: Feedback Denylist
import {
  DENYLIST,
  isOnDenylist,
  getDenylistSize,
} from '../lib/search/feedback-denylist';
exec
/bin/zsh -lc "node -e 'const fs=require(\"fs\"); const path=require(\"path\"); const root=path.resolve(\".opencode/skill/system-spec-kit\"); const dir=path.join(root,\"feature_catalog/11--scoring-and-calibration\"); const files=fs.readdirSync(dir).filter(f=>/"'^0[5-9]-|''^10-/.test(f)).sort(); for (const f of files) { const text=fs.readFileSync(path.join(dir,f),"utf8"); const section=text.split("## Source Files")[1]||""; const paths=[...section.matchAll(/`([''^`]+)`/g)].map(m=>m[1]); console.log("=== "+f+" ==="); for (const p of paths) { const ok=fs.existsSync(path.join(root,p)); console.log((ok?"OK   ":"MISS ")+p); } }'"'" in /Users/michelkerkmeester/MEGA/Development/Opencode Env/Public succeeded in 53ms:
=== 05-folder-level-relevance-scoring.md ===
OK   mcp_server/lib/scoring/folder-scoring.ts
OK   mcp_server/lib/search/folder-relevance.ts
OK   shared/normalization.ts
OK   shared/scoring/folder-scoring.ts
OK   shared/types.ts
OK   mcp_server/tests/folder-relevance.vitest.ts
OK   mcp_server/tests/folder-scoring.vitest.ts
OK   mcp_server/tests/memory-types.vitest.ts
OK   mcp_server/tests/score-normalization.vitest.ts
OK   mcp_server/tests/scoring.vitest.ts
OK   mcp_server/tests/unit-composite-scoring-types.vitest.ts
OK   mcp_server/tests/unit-folder-scoring-types.vitest.ts
OK   mcp_server/tests/unit-normalization-roundtrip.vitest.ts
OK   mcp_server/tests/unit-normalization.vitest.ts
OK   mcp_server/tests/unit-tier-classifier-types.vitest.ts
OK   mcp_server/tests/unit-transaction-metrics-types.vitest.ts
=== 06-embedding-cache.md ===
OK   mcp_server/lib/cache/embedding-cache.ts
OK   mcp_server/tests/embedding-cache.vitest.ts
codex
---
FEATURE: 05-folder-level-relevance-scoring.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The four-factor folder score, damped DocScore formula, archive multipliers, and default-on flag all match the code. The missing piece in the source list is the actual runtime integration file that performs two-phase retrieval and result enrichment.
---
FEATURE: 06-embedding-cache.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/embedding-pipeline.ts, mcp_server/handlers/chunking-orchestrator.ts, mcp_server/lib/providers/retry-manager.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The cache table, SHA-256 keying, `last_used_at` LRU behavior, and cache-first lookup all exist. The weak spot is the description of `INSERT OR REPLACE`: it refreshes the same `(content_hash, model_id)` entry, but model-version separation is really handled by the composite key, not by replace semantics alone.
---
FEATURE: 07-double-intent-weighting-investigation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: shared/algorithms/adaptive-fusion.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The two weight systems do exist, but the snippet is outdated about how they interact. Current runtime code explicitly prevents hybrid double-weighting in Stage 2, and `hybrid-search.ts` only reuses adaptive weights, not the adaptive fused results themselves, so the “recency boost discarded when System B re-scores” explanation no longer matches the real path.
---
FEATURE: 08-rrf-k-value-sensitivity-analysis.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The code does run a K-grid over `{20,40,60,80,100}` and computes Kendall tau plus MRR@5, but it measures against the K=60 baseline ranking. It does not identify, persist, or document an empirically chosen “optimal K,” so the current description overstates what the implementation proves.
---
FEATURE: 09-negative-feedback-confidence-signal.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The multiplier math, 30-day half-life recovery, persistence table, Stage 2 application point, and default-on flag all match the code. The source list misses the handler and pipeline files that actually record negative feedback and apply it during search.
---
FEATURE: 10-auto-promotion-on-validation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The thresholds, non-promotable tiers, 3-per-8-hour throttle, audit table, and validation-triggered execution all match. The mismatch is in the response shape: `memory_validate` includes `autoPromotion.attempted`, `promoted`, `previousTier`, `newTier`, and `reason`, but not `validationCount` inside `autoPromotion` metadata.
---
tokens used
155,046
---
FEATURE: 05-folder-level-relevance-scoring.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/lib/search/hybrid-search.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The four-factor folder score, damped DocScore formula, archive multipliers, and default-on flag all match the code. The missing piece in the source list is the actual runtime integration file that performs two-phase retrieval and result enrichment.
---
FEATURE: 06-embedding-cache.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/save/embedding-pipeline.ts, mcp_server/handlers/chunking-orchestrator.ts, mcp_server/lib/providers/retry-manager.ts, mcp_server/lib/search/vector-index-schema.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The cache table, SHA-256 keying, `last_used_at` LRU behavior, and cache-first lookup all exist. The weak spot is the description of `INSERT OR REPLACE`: it refreshes the same `(content_hash, model_id)` entry, but model-version separation is really handled by the composite key, not by replace semantics alone.
---
FEATURE: 07-double-intent-weighting-investigation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: shared/algorithms/adaptive-fusion.ts, mcp_server/lib/search/hybrid-search.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts
SEVERITY: HIGH
RECOMMENDED_ACTION: REWRITE
NOTES: The two weight systems do exist, but the snippet is outdated about how they interact. Current runtime code explicitly prevents hybrid double-weighting in Stage 2, and `hybrid-search.ts` only reuses adaptive weights, not the adaptive fused results themselves, so the “recency boost discarded when System B re-scores” explanation no longer matches the real path.
---
FEATURE: 08-rrf-k-value-sensitivity-analysis.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: NONE
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_DESCRIPTION
NOTES: The code does run a K-grid over `{20,40,60,80,100}` and computes Kendall tau plus MRR@5, but it measures against the K=60 baseline ranking. It does not identify, persist, or document an empirically chosen “optimal K,” so the current description overstates what the implementation proves.
---
FEATURE: 09-negative-feedback-confidence-signal.md
DESCRIPTION_ACCURATE: YES
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts, mcp_server/lib/search/pipeline/stage2-fusion.ts, mcp_server/lib/search/search-flags.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: UPDATE_PATHS
NOTES: The multiplier math, 30-day half-life recovery, persistence table, Stage 2 application point, and default-on flag all match the code. The source list misses the handler and pipeline files that actually record negative feedback and apply it during search.
---
FEATURE: 10-auto-promotion-on-validation.md
DESCRIPTION_ACCURATE: PARTIAL
CODE_PATHS_VALID: YES
INVALID_PATHS: NONE
MISSING_CODE_PATHS: mcp_server/handlers/checkpoints.ts
SEVERITY: MEDIUM
RECOMMENDED_ACTION: BOTH
NOTES: The thresholds, non-promotable tiers, 3-per-8-hour throttle, audit table, and validation-triggered execution all match. The mismatch is in the response shape: `memory_validate` includes `autoPromotion.attempted`, `promoted`, `previousTier`, `newTier`, and `reason`, but not `validationCount` inside `autoPromotion` metadata.
---
