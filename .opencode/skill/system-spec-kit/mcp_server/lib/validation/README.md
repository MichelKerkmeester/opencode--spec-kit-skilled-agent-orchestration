---
title: "Validation"
description: "Pre-flight quality gates for memory operations: anchor validation, duplicate detection and token budget verification."
trigger_phrases:
  - "validation"
  - "preflight"
  - "anchor format"
---

# Validation

> Pre-flight quality gates for memory operations: anchor validation, duplicate detection, token budget verification and content size checks.

---

## TABLE OF CONTENTS
<!-- ANCHOR:table-of-contents -->

- [1. OVERVIEW](#1--overview)
- [2. STRUCTURE](#2--structure)
- [3. FEATURES](#3--features)
- [4. USAGE EXAMPLES](#4--usage-examples)
- [5. RELATED RESOURCES](#5--related-resources)

<!-- /ANCHOR:table-of-contents -->

## 1. OVERVIEW
<!-- ANCHOR:overview -->

The validation subsystem provides pre-flight checks that run before expensive operations like embedding generation or database writes. It prevents invalid data from entering the system and provides actionable feedback for resolution.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 2 | preflight.ts, save-quality-gate.ts |
| Pre-flight Checks | 4 | Anchors, duplicates, tokens, content size |
| Quality Gate Layers | 3 | Structural, content quality, semantic dedup |
| Error Codes | 10 | PF001-PF031 range |
| Config Options | 8 | Environment-configurable thresholds |

### Key Features

| Feature | Description |
|---------|-------------|
| **Anchor Validation** | Validates paired tags (`<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`) for format, closure and uniqueness |
| **Duplicate Detection** | Exact (SHA-256 hash) and similar (vector similarity) duplicate finding |
| **Token Budget** | Estimates tokens and enforces limits before API calls |
| **Unified Preflight** | Single `runPreflight()` runs all checks with dry-run support |
| **Save Quality Gate** | 3-layer pre-storage validation (structural, content quality scoring, semantic dedup). Behind `SPECKIT_SAVE_QUALITY_GATE` flag |

<!-- /ANCHOR:overview -->

## 2. STRUCTURE
<!-- ANCHOR:structure -->

```
validation/
 preflight.ts         # Pre-flight validation before expensive operations
 save-quality-gate.ts # 3-layer pre-storage quality gate (structural, content, semantic dedup)
 README.md            # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `preflight.ts` | All validation logic: anchors, duplicates, tokens, content size, unified preflight |
| `save-quality-gate.ts` | 3-layer pre-storage quality gate: structural validation, content quality scoring (title, triggers, length, anchors, metadata, signal density), and semantic dedup. Behind `SPECKIT_SAVE_QUALITY_GATE` flag with 14-day warn-only graduation period |

<!-- /ANCHOR:structure -->

## 3. FEATURES
<!-- ANCHOR:features -->

### Anchor Format Validation

Validates memory file anchor tags:

| Check | Description |
|-------|-------------|
| Format | Must match paired tags (`<!-- ANCHOR:id --> ... <!-- /ANCHOR:id -->`) |
| ID Pattern | Alphanumeric start, allows hyphens and slashes |
| Closure | Each `<!-- ANCHOR:id -->` opening tag needs matching `<!-- /ANCHOR:id -->` closure |
| Uniqueness | No duplicate anchor IDs in same file |

### Duplicate Detection

Two-tier duplicate detection:

| Type | Method | Speed |
|------|--------|-------|
| Exact | SHA-256 content hash | Fast (database lookup) |
| Similar | Vector similarity | Requires embedding |

### Token Budget Estimation

Prevents exceeding embedding API limits:

| Setting | Default | Environment Variable |
|---------|---------|---------------------|
| Chars per token | 4 | `MCP_CHARS_PER_TOKEN` |
| Max tokens | 8000 | `MCP_MAX_MEMORY_TOKENS` |
| Warning threshold | 80% | `MCP_TOKEN_WARNING_THRESHOLD` |

### Content Size Behavior

`validateContentSize()` and `runPreflight()` enforce a max-size gate with chunk-aware warning behavior:

| Range | Behavior |
|------|----------|
| `< MCP_MIN_CONTENT_LENGTH` | Hard fail (`PF031`) |
| `>= CHUNKING_THRESHOLD` and `<= MCP_MAX_CONTENT_LENGTH` | Warning (`PF030`) with chunking guidance |
| `> MCP_MAX_CONTENT_LENGTH` | Hard fail (`PF030`) |

Default cap is `MCP_MAX_CONTENT_LENGTH=250000` (250KB), configurable via environment.

### Pre-flight Error Codes

| Code | Error | Description |
|------|-------|-------------|
| PF001 | ANCHOR_FORMAT_INVALID | Invalid anchor syntax |
| PF002 | ANCHOR_UNCLOSED | Missing closing tag |
| PF003 | ANCHOR_ID_INVALID | Invalid anchor ID format |
| PF010 | DUPLICATE_DETECTED | Generic duplicate found |
| PF011 | DUPLICATE_EXACT | Exact hash match |
| PF012 | DUPLICATE_SIMILAR | Vector similarity match |
| PF020 | TOKEN_BUDGET_EXCEEDED | Over token limit |
| PF021 | TOKEN_BUDGET_WARNING | Approaching limit |
| PF030 | CONTENT_TOO_LARGE | Exceeds max size |
| PF031 | CONTENT_TOO_SMALL | Below min size |

### Exported API

**Functions:**

| Function | Signature | Purpose |
|----------|-----------|---------|
| `validateAnchorFormat` | `(content: string, options?) => AnchorValidationResult` | Validate anchor tags |
| `computeContentHash` | `(content: string) => string` | SHA-256 content hash |
| `checkDuplicate` | `(params: DuplicateCheckParams, options?) => DuplicateCheckResult` | Detect duplicates |
| `estimateTokens` | `(content: string \| unknown) => number` | Estimate token count |
| `checkTokenBudget` | `(content: string, options?) => TokenBudgetResult` | Check against token limit |
| `validateContentSize` | `(content: string, options?) => ContentSizeResult` | Validate content length |
| `runPreflight` | `(params: PreflightParams, options?) => PreflightResult` | Run all checks |

**Types:** `PreflightConfig`, `PreflightIssue`, `AnchorValidationResult`, `DuplicateCheckResult`, `TokenBudgetResult`, `ContentSizeResult`, `DuplicateCheckParams`, `DuplicateCheckOptions`, `PreflightParams`, `PreflightOptions`, `PreflightDetails`, `PreflightResult`, `PreflightErrorDetails`

**Constants:** `PREFLIGHT_CONFIG`, `PreflightErrorCodes`

**Classes:** `PreflightError`

### Save Quality Gate (TM-04)

**Purpose**: 3-layer pre-storage quality gate before memory writes. Behind `SPECKIT_SAVE_QUALITY_GATE` flag.

| Layer | Check | Details |
|-------|-------|---------|
| Layer 1 | Structural | Content length, spec folder format, title presence |
| Layer 2 | Content Quality | Weighted signal density across 5 dimensions (title 0.25, triggers 0.20, length 0.20, anchors 0.15, metadata 0.20). Threshold: 0.4 |
| Layer 3 | Semantic Dedup | Cosine similarity against existing memories. Threshold: 0.92 |

**Warn-Only Mode**: First 14 days after activation, scores are logged but saves are not blocked. Activation timestamp is persisted to SQLite config table to survive restarts.

**Exported functions (save-quality-gate.ts):**

| Function | Purpose |
|----------|---------|
| `isQualityGateEnabled()` | Check if `SPECKIT_SAVE_QUALITY_GATE` flag is enabled |
| `isWarnOnlyMode()` | Check if still in 14-day warn-only period |
| `setActivationTimestamp(timestamp?)` | Persist activation timestamp to SQLite config |
| `resetActivationTimestamp()` | Clear persisted activation timestamp |
| `validateStructural(params)` | Layer 1: structural validation |
| `scoreTitleQuality(title)` | Layer 2 dimension: title quality (0-1) |
| `scoreTriggerQuality(triggerPhrases)` | Layer 2 dimension: trigger phrase quality (0-1) |
| `scoreLengthQuality(content)` | Layer 2 dimension: content length quality (0-1) |
| `scoreAnchorQuality(anchors)` | Layer 2 dimension: anchor quality (0-1) |
| `scoreMetadataQuality(content)` | Layer 2 dimension: metadata quality (0-1) |
| `scoreContentQuality(params)` | Layer 2: combined content quality scoring |
| `cosineSimilarity(a, b)` | Cosine similarity between two vectors |
| `checkSemanticDedup(params)` | Layer 3: semantic dedup check |
| `runQualityGate(params)` | Run all 3 layers, returns `QualityGateResult` |

**Exported types:** `StructuralValidationResult`, `ContentQualityDimensions`, `ContentQualityResult`, `SemanticDedupResult`, `QualityGateResult`, `QualityGateParams`, `FindSimilarFn`

<!-- /ANCHOR:features -->

## 4. USAGE EXAMPLES
<!-- ANCHOR:usage-examples -->

### Example 1: Run All Pre-flight Checks

```typescript
import { runPreflight } from './preflight';

const result = runPreflight({
  content: memoryFileContent,
  file_path: '/specs/<###-spec-name>/memory/context.md',
  spec_folder: 'specs/<###-spec-name>',
  database: db,
}, {
  check_anchors: true,
  check_duplicates: true,
  check_tokens: true,
  check_size: true,
});

if (!result.pass) {
  console.log('Pre-flight failed:', result.errors);
}
```

### Example 2: Validate Anchor Format Only

```typescript
import { validateAnchorFormat } from './preflight';

const result = validateAnchorFormat(content, { strict: true });
// result.valid: boolean
// result.anchors: ['summary', 'decisions', ...]
// result.errors: [{ code, message, suggestion }]
```

### Example 3: Check Token Budget

```typescript
import { checkTokenBudget, estimateTokens } from './preflight';

const tokens = estimateTokens(content);
console.log(`Estimated: ${tokens} tokens`);

const budget = checkTokenBudget(content, { maxTokens: 4000 });
if (!budget.within_budget) {
  console.log(`Over budget: ${budget.estimated_tokens}/${budget.maxTokens}`);
}
```

### Example 4: Dry Run Mode

```typescript
const result = runPreflight(
  { content, file_path, spec_folder },
  { dry_run: true }
);
// result.pass is always true in dry_run
// result.dry_run_would_pass shows actual validation result
```

### Example 5: Run Save Quality Gate

```typescript
import { runQualityGate } from './save-quality-gate';

const result = runQualityGate({
  title: 'Architecture decision: use SQLite',
  content: memoryContent,
  specFolder: 'specs/<###-spec-name>',
  triggerPhrases: ['architecture', 'sqlite'],
  anchors: ['summary', 'decisions'],
  embedding: embeddingVector,
  findSimilar: (emb, opts) => vectorStore.search(emb, opts),
});

if (!result.pass) {
  console.log('Quality gate rejected:', result.reasons);
  console.log('Warn-only mode:', result.warnOnly);
}
```

### Common Patterns

| Pattern | Function | When to Use |
|---------|----------|-------------|
| Full validation | `runPreflight()` | Before memory_save |
| Quality gate | `runQualityGate()` | Before memory storage (flag-gated) |
| Anchor check | `validateAnchorFormat()` | Editing memory files |
| Token estimate | `estimateTokens()` | Before embedding API |
| Hash compute | `computeContentHash()` | Duplicate detection |
| Structural check | `validateStructural()` | Quick pre-save structural validation |
| Content scoring | `scoreContentQuality()` | Evaluate memory content quality |
| Recursive phase validation | `validate.sh --recursive` | Validate phase-based spec hierarchies (spec 139) |

<!-- /ANCHOR:usage-examples -->

## 5. RELATED RESOURCES
<!-- ANCHOR:related -->

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../errors/](../errors/) | Error codes and recovery hints |
| [../../context-server.ts](../../context-server.ts) | MCP server using validation |

### Configuration

All thresholds are environment-configurable:

```bash
# Token budget
MCP_CHARS_PER_TOKEN=4
MCP_MAX_MEMORY_TOKENS=8000
MCP_TOKEN_WARNING_THRESHOLD=0.8

# Content limits
MCP_MIN_CONTENT_LENGTH=10
MCP_MAX_CONTENT_LENGTH=250000

# Duplicate detection
MCP_DUPLICATE_THRESHOLD=0.95

# Strict mode
MCP_ANCHOR_STRICT=true
```

<!-- /ANCHOR:related -->

---

**Version**: 1.7.3
**Last Updated**: 2026-02-21
