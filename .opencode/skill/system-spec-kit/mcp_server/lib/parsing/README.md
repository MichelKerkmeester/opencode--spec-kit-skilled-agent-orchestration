---
title: "Parsing Modules"
description: "Memory file parsing and trigger matching for the Spec Kit Memory system."
trigger_phrases:
  - "memory parser"
  - "trigger matcher"
  - "anchor extraction"
---

# Parsing Modules

> Memory file parsing and trigger matching for the Spec Kit Memory system.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

---

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The parsing module provides core functionality for extracting structured data from memory files. It handles ANCHOR section extraction (enabling ~93% token savings) and trigger phrase matching (<50ms for proactive surfacing). It also supports encoding detection for UTF-8/UTF-16 files.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 4 | memory-parser, trigger-matcher, entity-scope, content-normalizer |
| Supported Encodings | 3 | UTF-8, UTF-16 LE, UTF-16 BE (with BOM detection) |
| Trigger Match Target | <50ms | NFR-P03 performance requirement |

### Key Features

| Feature | Description |
|---------|-------------|
| **ANCHOR Extraction** | Parse paired tags (`<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`) for targeted retrieval |
| **Trigger Matching** | Match user prompts against cached trigger phrases with Unicode support and CORRECTION/PREFERENCE signal categories (Sprint 1) |
| **Memory Type Inference** | Automatic classification (research, implementation, decision, discovery) via `inferMemoryType` from config |
| **Spec Document Classification** | Derives `documentType` and `specLevel` from file paths for full spec folder indexing |
| **Causal Link Extraction** | Parse relationship metadata (caused_by, supersedes, derived_from, blocks, related_to) |
| **Entity Scope Detection** | Context type detection from content or tool usage, SQL scope filter building, session ID generation |

<!-- /ANCHOR:overview -->

---

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
parsing/
 content-normalizer.ts # Strip markdown noise (frontmatter, anchors, tables, fences) for embedding and BM25
 entity-scope.ts       # Context type detection, scope filtering, session ID generation
 memory-parser.ts      # Core memory file parsing with ANCHOR extraction
 trigger-matcher.ts    # Fast trigger phrase matching (<50ms target)
 README.md             # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `content-normalizer.ts` | Normalize raw markdown for embedding generation and BM25 indexing by stripping structural noise (frontmatter, anchors, HTML comments, code fences, pipe tables, list bullets, heading hashes) |
| `entity-scope.ts` | Detect context types from content/tools, build SQL scope filters, generate session IDs |
| `memory-parser.ts` | Parse memory files, extract metadata, titles, trigger phrases, anchors, causal links |
| `trigger-matcher.ts` | Match prompts against trigger phrases with LRU regex caching |

<!-- /ANCHOR:structure -->

---

## 3. FEATURES
<!-- ANCHOR:features -->

### Memory Parser (`memory-parser.ts`)

**Purpose**: Extract structured data from markdown memory files

| Aspect | Details |
|--------|---------|
| **Encoding Support** | UTF-8, UTF-16 LE/BE with automatic BOM detection |
| **Metadata Extraction** | Title, spec folder, context type, importance tier, memory type |
| **ANCHOR Parsing** | Section-level content retrieval via paired tags (`<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`) |
| **Type Inference** | Automatic `memoryType` classification via `inferMemoryType` from `lib/config/type-inference` |
| **Causal Links** | Extracts `caused_by`, `supersedes`, `derived_from`, `blocks`, `related_to` from YAML metadata |

**Exported functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `parseMemoryFile` | `(filePath: string) => ParsedMemory` | Full memory file parse with all metadata |
| `readFileWithEncoding` | `(filePath: string) => string` | Read file with BOM detection |
| `extractSpecFolder` | `(filePath: string) => string` | Extract spec folder name from file path |
| `extractTitle` | `(content: string) => string \| null` | Extract title from YAML frontmatter or first `#` heading |
| `extractTriggerPhrases` | `(content: string) => string[]` | Extract trigger phrases from YAML or `## Trigger Phrases` section |
| `extractContextType` | `(content: string) => ContextType` | Extract context type from metadata |
| `extractImportanceTier` | `(content: string) => string` | Extract importance tier from YAML metadata (HTML comments stripped before matching) |
| `extractDocumentType` | `(filePath: string) => string` | Derive document type from folder and filename |
| `extractSpecLevel` | `(filePath: string) => number \| null` | Derive spec level (1, 2, 3, 4) from spec paths |
| `computeContentHash` | `(content: string) => string` | SHA-256 hash of content |
| `extractCausalLinks` | `(content: string) => CausalLinks` | Extract causal link metadata from YAML |
| `hasCausalLinks` | `(causalLinks: CausalLinks) => boolean` | Check if any causal links are present |
| `isMemoryFile` | `(filePath: string) => boolean` | Check if path is a valid memory file |
| `validateAnchors` | `(content: string) => AnchorValidation` | Validate anchor tag format and closure |
| `extractAnchors` | `(content: string) => Record<string, string>` | Extract anchor section contents |
| `validateParsedMemory` | `(parsed: ParsedMemory) => ParsedMemoryValidation` | Validate parsed memory data |
| `findMemoryFiles` | `(workspacePath: string, options?) => string[]` | Find all memory files in a workspace |

**Exported types:** `CausalLinks`, `TypeInferenceResult`, `ParsedMemory`, `AnchorValidation`, `ParsedMemoryValidation`, `ContextType`, `FindMemoryFilesOptions`, `DocumentType`

**Exported constants:** `MEMORY_FILE_PATTERN`, `CONTEXT_TYPE_MAP`

### Trigger Matcher (`trigger-matcher.ts`)

**Purpose**: Fast trigger phrase matching for proactive memory surfacing

| Aspect | Details |
|--------|---------|
| **Performance** | <50ms matching target (NFR-P03) |
| **Caching** | 60-second TTL cache with LRU regex cache (max 100) |
| **Unicode** | NFC normalization with optional accent stripping |
| **Word Boundaries** | Unicode-aware matching (Latin characters A-z, accented chars) |
| **Signal Categories** | CORRECTION and PREFERENCE signal vocabulary (Sprint 1, TM-08) |

**Exported functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `matchTriggerPhrases` | `(userPrompt: string, limit?: number) => TriggerMatch[]` | Match prompt against trigger phrases |
| `matchTriggerPhrasesWithStats` | `(userPrompt: string, limit?: number) => TriggerMatchWithStats` | Match with timing stats |
| `loadTriggerCache` | `() => TriggerCacheEntry[]` | Load/refresh trigger phrase cache from DB |
| `clearCache` | `() => void` | Clear trigger cache and regex cache |
| `getCacheStats` | `() => CacheStats` | Get cache statistics |
| `getAllPhrases` | `() => string[]` | Get all unique cached trigger phrases |
| `getMemoriesByPhrase` | `(phrase: string) => MemoryByPhrase[]` | Find memories matching a specific phrase |
| `refreshTriggerCache` | `() => TriggerCacheEntry[]` | Force cache reload |
| `normalizeUnicode` | `(str: string, stripAccents?: boolean) => string` | Unicode normalization |
| `matchPhraseWithBoundary` | `(text: string, phrase: string, precompiledRegex?) => boolean` | Word-boundary phrase match |
| `logExecutionTime` | `(operation: string, durationMs: number, details?) => ExecutionLogEntry \| undefined` | Performance logging |
| `getCachedRegex` | `(phrase: string) => RegExp` | Get/create cached regex for phrase |

**Exported types:** `TriggerCacheEntry`, `TriggerMatch`, `TriggerMatchWithStats`, `TriggerMatchStats`, `CacheStats`, `MemoryByPhrase`, `ExecutionLogEntry`, `TriggerMatcherConfig`

**Exported constant:** `CONFIG`

### Content Normalizer (`content-normalizer.ts`)

**Purpose**: Normalize raw markdown content before embedding generation or BM25 indexing by stripping structural noise

| Aspect | Details |
|--------|---------|
| **Pipeline** | 8-step normalization: strip frontmatter, anchors, HTML comments, code fences, pipe tables, list bullets, headings, then collapse whitespace |
| **Embedding Entry Point** | `normalizeContentForEmbedding(content)` for semantic embedding models |
| **BM25 Entry Point** | `normalizeContentForBM25(content)` for keyword indexing (currently delegates to embedding pipeline) |
| **Integration** | Used before `generateDocumentEmbedding()` in memory-save and before token building in bm25-index |

**Exported functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `normalizeContentForEmbedding` | `(content: string) => string` | Full 8-step normalization for semantic embeddings |
| `normalizeContentForBM25` | `(content: string) => string` | Full normalization for BM25 keyword indexing |
| `stripYamlFrontmatter` | `(content: string) => string` | Remove YAML frontmatter block |
| `stripAnchors` | `(content: string) => string` | Remove ANCHOR comment markers |
| `stripHtmlComments` | `(content: string) => string` | Remove all HTML comments |
| `stripCodeFences` | `(content: string) => string` | Remove fence markers, keep code body |
| `normalizeMarkdownTables` | `(content: string) => string` | Convert pipe tables to plain prose |
| `normalizeMarkdownLists` | `(content: string) => string` | Strip bullet, checkbox, and ordered list notation |
| `normalizeHeadings` | `(content: string) => string` | Strip hash marks and numeric prefixes from headings |

### Entity Scope (`entity-scope.ts`)

**Purpose**: Context type detection, scope filtering and session ID generation

| Aspect | Details |
|--------|---------|
| **Context Types** | `research`, `implementation`, `decision`, `discovery`, `general` |
| **Content Detection** | Keyword scanning (explored->research, implemented->implementation, decided->decision, found->discovery) |
| **Tool Detection** | Infers context from tool usage (AskUserQuestion->decision, Read/Grep/Glob majority->research) |
| **Scope Filtering** | Builds SQL WHERE clauses from specFolder, sessionId and contextTypes |

**Exported functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `detectContextType` | `(content: string) => string` | Detect context type from free-text content via keyword matching |
| `detectContextTypeFromTools` | `(tools: Array<{tool: string}>) => string` | Detect context type from tool invocation list |
| `buildScopeFilter` | `(scope: {specFolder?, sessionId?, contextTypes?}) => {clause, params}` | Build SQL WHERE clause from scope object |
| `isValidContextType` | `(type: string) => boolean` | Check if string is a recognised context type |
| `generateSessionId` | `() => string` | Generate a unique session-prefixed identifier |

**Exported constants:** `CONTEXT_TYPES`

<!-- /ANCHOR:features -->

---

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Parse Memory File with Anchors

```typescript
import { parseMemoryFile, extractAnchors } from './memory-parser';

// Parse full memory file
const memory = parseMemoryFile('specs/007-auth/memory/session-001.md');
// Returns: { filePath, specFolder, title, triggerPhrases, contextType,
//            importanceTier, contentHash, content, fileSize, lastModified,
//            memoryType, memoryTypeSource, memoryTypeConfidence,
//            causalLinks, hasCausalLinks }

// Extract specific anchor content (~93% token savings)
const anchors = extractAnchors(memory.content);
const summary = anchors['summary'];  // Just the summary section
```

### Example 2: Match Trigger Phrases

```typescript
import { matchTriggerPhrasesWithStats } from './trigger-matcher';

const result = matchTriggerPhrasesWithStats('authentication login flow', 5);

console.log(`Found ${result.matches.length} memories`);
console.log(`Match time: ${result.stats.matchTimeMs}ms`);
// Logs: Found 3 memories, Match time: 12ms
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Full parse | `parseMemoryFile(path)` | Index new memories |
| Anchor-only | `extractAnchors(content)` | Targeted section retrieval |
| Trigger match | `matchTriggerPhrases(prompt, limit)` | Proactive surfacing |
| Find files | `findMemoryFiles(workspace, { specFolder })` | Directory scanning |

<!-- /ANCHOR:usage-examples -->

---

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [lib/README.md](../README.md) | Parent library overview |
| [cognitive/README.md](../cognitive/README.md) | Attention decay, working memory |
| [search/README.md](../search/README.md) | Vector search, hybrid search |
| [config/](../config/) | Type inference used by memory-parser |

<!-- /ANCHOR:related -->

---

**Version**: 1.8.0
**Last Updated**: 2026-03-08
