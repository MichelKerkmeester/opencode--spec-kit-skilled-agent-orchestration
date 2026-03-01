---
title: "Research: generate-context.js Analysis [058-generate-context-modularization/research]"
description: "This document provides detailed analysis of the generate-context.js script to support the modularization effort. Key findings"
trigger_phrases:
  - "research"
  - "generate"
  - "context"
  - "analysis"
  - "058"
importance_tier: "normal"
contextType: "research"
---
# Research: generate-context.js Analysis

## Executive Summary

This document provides detailed analysis of the `generate-context.js` script to support the modularization effort. Key findings:

- **4,837 lines** with **84 functions** in **18 sections**
- **57% of code** (2,759 lines) is in one section: "MAIN WORKFLOW HELPERS"
- **10 modules already extracted** to lib/ - these are stable and should remain
- **74 functions remain inline** - these are the refactoring targets
- **Estimated reduction**: 300-500 lines through cleanup (not 2,000 as initially hoped)
- **Primary benefit**: AI editability and maintainability, not LOC reduction

---

## Section Analysis

### Section Size Distribution

| # | Section Name | Start Line | Lines | % | Risk |
|---|--------------|------------|-------|---|------|
| 1 | CLI HELP FLAG HANDLING | 14 | 29 | 0.6% | Low |
| 2 | STRUCTURED LOGGING UTILITY | 43 | 26 | 0.5% | Low |
| 3 | PATH SANITIZATION UTILITY | 69 | 49 | 1.0% | Low |
| 4 | LIBRARY IMPORTS WITH ERROR HANDLING | 118 | 148 | 3.1% | Low |
| 5 | CONFIGURATION | 266 | 107 | 2.2% | Low |
| 6 | DATABASE UPDATE NOTIFICATION | 373 | 46 | 1.0% | Medium |
| 7 | SMART ARGUMENT PARSING | 419 | 35 | 0.7% | Low |
| 8 | SESSION METADATA HELPERS | 454 | 177 | 3.7% | Medium |
| 9 | PROJECT STATE SNAPSHOT HELPERS | 631 | 117 | 2.4% | Medium |
| 10 | IMPLEMENTATION GUIDE EXTRACTION | 748 | 396 | 8.2% | Medium |
| 11 | ARGUMENT VALIDATION | 1144 | 65 | 1.3% | Low |
| 12 | CONTEXT BUDGET MANAGEMENT | 1209 | 13 | 0.3% | Low |
| 13 | DATA LOADING | 1222 | 4 | 0.1% | Low |
| 14 | INPUT NORMALIZATION HELPERS | 1226 | 432 | 8.9% | Medium |
| 15 | HELPER FUNCTIONS | 1658 | 331 | 6.8% | Medium |
| 16 | DATA VALIDATION HELPERS | 1989 | 85 | 1.8% | Low |
| 17 | MAIN WORKFLOW | 2074 | 4 | 0.1% | Low |
| 18 | MAIN WORKFLOW HELPERS | 2078 | 2759 | **57.0%** | High |

### Visual Distribution

```
MAIN WORKFLOW HELPERS  ████████████████████████████████████████████████████████ 57%
INPUT NORMALIZATION    ████████▏ 9%
IMPL GUIDE EXTRACTION  ████████ 8%
HELPER FUNCTIONS       ██████▋ 7%
SESSION METADATA       ███▌ 4%
LIBRARY IMPORTS        ███ 3%
PROJECT STATE          ██▍ 2%
CONFIGURATION          ██▏ 2%
Other (10 sections)    █████ 5%
```

---

## Function Inventory

### All 84 Functions by Section

#### Section 2: STRUCTURED LOGGING UTILITY (1 function)
- `structuredLog(level, message, data)` - JSON logging

#### Section 3: PATH SANITIZATION UTILITY (1 function)
- `sanitizePath(inputPath, allowedBases)` - CWE-22 prevention

#### Section 8: SESSION METADATA HELPERS (5 functions)
- `extractSessionId(collectedData)`
- `extractContextType(collectedData)`
- `buildImportanceTier(contextType, decisionCount, fileCount)`
- `buildTriggerPhrases(keywords, decisions)`
- `extractKeyTopics(collectedData)`

#### Section 9: PROJECT STATE SNAPSHOT HELPERS (3 functions)
- `detectProjectPhase(observations, FILES)`
- `detectBlockers(observations, messages)`
- `calculateProgress(observations, FILES)`

#### Section 10: IMPLEMENTATION GUIDE EXTRACTION (8 functions)
- `extractImplementationGuide(collectedData, specFolder)`
- `extractFeatures(observations)`
- `extractKeyFiles(observations)`
- `extractExtensionPoints(observations)`
- `extractCommonPatterns(observations)`
- `formatImplementationGuide(features, keyFiles, extensionPoints, patterns)`
- `generateFeatureSection(feature)`
- `truncateText(text, maxLength)`

#### Section 14: INPUT NORMALIZATION HELPERS (12 functions)
- `normalizeOpenCodeData(rawData)`
- `normalizeManualInput(manualInput)`
- `normalizeMessages(messages)`
- `normalizeMessage(msg)`
- `normalizeToolCall(tool)`
- `extractObservations(messages)`
- `extractUserPrompts(messages)`
- `buildFilesFromObservations(observations)`
- `inferContextType(messages, observations)`
- `generateSessionId()`
- `formatTimestamp(date)`
- `buildSpecFolderInfo(specFolderPath)`

#### Section 15: HELPER FUNCTIONS (8 functions)
- `getTimestampPrefix()`
- `slugify(text)`
- `extractSpecFolderName(specFolder)`
- `generateFilename(sessionData, specFolder)`
- `ensureDirectory(dirPath)`
- `buildKeyFilesFromObservations(observations)`
- `formatRelativePath(absolutePath)`
- `buildDescriptionForFile(filePath, observations)`

#### Section 16: DATA VALIDATION HELPERS (3 functions)
- `isArrayWithItems(arr)`
- `hasRequiredFields(obj, fields)`
- `validateSessionData(data)`

#### Section 18: MAIN WORKFLOW HELPERS (43 functions)
- `getPathBasename(p)`
- `enhanceFilesWithSemanticDescriptions(files, semanticFileChanges)`
- `buildContextTemplateData({...})`
- `main()`
- `detectSpecFolder(collectedData)`
- `validateContentAlignment(collectedData, specFolderName, specsDir)`
- `extractObservationKeywords(collectedData)`
- `validateFolderAlignment(collectedData, specFolderName, specsDir)`
- `extractConversationTopics(collectedData)`
- `parseSpecFolderTopic(folderName)`
- `calculateAlignmentScore(conversationTopics, specFolderName)`
- `filterArchiveFolders(folders)`
- `requireInteractiveMode(operation)`
- `promptUserChoice(question, maxChoice, maxAttempts, requireInteractive)`
- `promptUser(question, defaultValue, requireInteractive)`
- `setupContextDirectory(specFolder)`
- `extractFilesFromData(collectedData, observations)`
- `buildObservationsWithAnchors(observations, specFolder)`
- `detectSessionCharacteristics(observations, userPrompts, FILES)`
- `buildProjectStateSnapshot({...})`
- `calculateSessionDuration(userPrompts, now)`
- `calculateExpiryEpoch(importanceTier, createdAtEpoch)`
- `collectSessionData(collectedData, specFolderName)`
- `extractConversations(collectedData)`
- `extractDecisions(collectedData)`
- `extractDiagrams(collectedData)`
- `extractPhasesFromData(collectedData)`
- `generateDecisionTree(decisionData)`
- `populateTemplate(templateName, data)`
- `cleanupExcessiveNewlines(text)`
- `stripTemplateConfigComments(text)`
- `isFalsy(value)`
- `renderTemplate(template, data, parentData)`
- Plus ~10 more helper functions

---

## Dependency Analysis

### Import Dependencies (External)

```javascript
// Node.js built-ins
const fs = require('fs/promises');
const fsSync = require('fs');
const path = require('path');
const readline = require('readline');
const { execSync } = require('child_process');

// Existing lib/ modules
const { getFilterStats } = require('./lib/content-filter');
const { generateImplementationSummary, formatSummaryAsMarkdown, extractFileChanges } = require('./lib/semantic-summarizer');
const { generateAnchorId, categorizeSection, validateAnchorUniqueness, extractSpecNumber } = require('./lib/anchor-generator');
const { generateEmbedding, EMBEDDING_DIM, MODEL_NAME } = require('./lib/embeddings');
const vectorIndex = require('../mcp_server/lib/vector-index');
const retryManager = require('./lib/retry-manager');
const { parseOpenCodeSession } = require('./lib/opencode-capture');
const { generateFlowchart } = require('./lib/flowchart-generator');
const { drawAsciiBox } = require('./lib/ascii-boxes');
const { extractTriggerPhrases } = require('./lib/trigger-extractor');
```

### Internal Dependencies (High-Level)

```
main()
├── detectSpecFolder()
│   ├── extractObservationKeywords()
│   ├── validateContentAlignment()
│   ├── validateFolderAlignment()
│   ├── promptUserChoice()
│   └── promptUser()
├── setupContextDirectory()
├── collectSessionData()
│   ├── extractSessionId()
│   ├── extractContextType()
│   ├── buildImportanceTier()
│   ├── extractKeyTopics()
│   └── buildProjectStateSnapshot()
├── extractConversations()
│   ├── normalizeMessages()
│   └── extractPhasesFromData()
├── extractDecisions()
│   └── generateDecisionTree()
├── extractDiagrams()
├── renderTemplate()
│   ├── populateTemplate()
│   ├── stripTemplateConfigComments()
│   └── cleanupExcessiveNewlines()
└── writeFile()
```

### Shared State (Globals)

```javascript
// Constants (safe to share)
const CONTEXT_BUDGET = 45000;
const CONVERSATION_HISTORY_LIMIT = 50;

// Configuration (from JSONC or defaults)
let CONFIG = { ... };

// Library imports (module-level)
let getFilterStats, generateImplementationSummary, ...;
```

---

## Risk Assessment

### High Risk Functions

| Function | Lines | Why High Risk |
|----------|-------|---------------|
| `main()` | ~500 | Orchestrates everything, many side effects |
| `detectSpecFolder()` | ~200 | User interaction, file system, complex logic |
| `extractConversations()` | ~200 | Complex data transformation |
| `extractDecisions()` | ~300 | Complex parsing, anchor generation |
| `collectSessionData()` | ~150 | Many dependencies, builds core data structure |

### Medium Risk Functions

| Function | Lines | Why Medium Risk |
|----------|-------|-----------------|
| `renderTemplate()` | ~100 | Custom template engine, edge cases |
| `extractDiagrams()` | ~100 | ASCII art generation |
| `normalizeOpenCodeData()` | ~80 | Data transformation |
| `setupContextDirectory()` | ~80 | File system operations |

### Low Risk Functions (Pure Utilities)

| Function | Lines | Why Low Risk |
|----------|-------|--------------|
| `structuredLog()` | ~20 | Pure function, no deps |
| `sanitizePath()` | ~45 | Pure function, well-defined |
| `slugify()` | ~5 | Pure function |
| `getTimestampPrefix()` | ~5 | Pure function |
| `isArrayWithItems()` | ~3 | Pure function |

---

## Existing lib/ Modules Analysis

### Module Summary

| Module | Lines | Functions | Purpose | Stability |
|--------|-------|-----------|---------|-----------|
| content-filter.js | ~150 | 3 | Content filtering stats | Stable |
| semantic-summarizer.js | ~300 | 4 | Implementation summaries | Stable |
| anchor-generator.js | ~200 | 4 | Anchor ID generation | Stable |
| embeddings.js | ~250 | 3 | Vector embeddings | Stable |
| retry-manager.js | ~100 | 2 | Retry logic | Stable |
| simulation-factory.js | ~200 | 5 | Test simulations | Stable |
| ascii-boxes.js | ~150 | 3 | ASCII art | Stable |
| flowchart-generator.js | ~300 | 4 | Flowcharts | Stable |
| opencode-capture.js | ~400 | 5 | Data capture | Stable |
| trigger-extractor.js | ~150 | 2 | Trigger phrases | Stable |

**Recommendation**: Do not modify these modules. They follow good practices and are battle-tested.

---

## LOC Reduction Analysis

### Initial Estimate (Too Optimistic)
Initial claim: "~2,000 lines saved"

### Realistic Estimate

| Source of Reduction | Lines |
|---------------------|-------|
| Consolidate 11 import try-catch blocks | ~100 |
| Remove verbose ASCII section headers | ~80 |
| Deduplicate similar helper functions | ~50 |
| Remove dead code (if any found) | ~50 |
| Cleaner imports via index.js | ~20 |
| **Total Realistic Savings** | **~300** |

### Why Not More?

The functions themselves need to exist somewhere. Moving them to modules doesn't reduce LOC - it redistributes them. The real benefit is:

1. **Smaller files** (AI can load entire context)
2. **Clear boundaries** (easier to understand)
3. **Testability** (unit test individual modules)
4. **Maintainability** (changes isolated to modules)

---

## Test Fixture Requirements

### Recommended Fixtures

| Fixture | Description | Tests |
|---------|-------------|-------|
| minimal.json | Empty/minimal data | Edge case handling |
| simple.json | Few messages, no decisions | Basic flow |
| complex.json | Many messages, decisions, diagrams | Full functionality |
| real-session.json | Anonymized production data | Real-world patterns |
| edge-cases.json | Unusual data patterns | Error handling |

### Data Structure

```json
{
  "messages": [...],
  "observations": [...],
  "userPrompts": [...],
  "sessionId": "...",
  "specFolder": "...",
  "timestamp": "..."
}
```

---

## Conclusion

The modularization is warranted but should be approached with realistic expectations:

1. **Primary benefit**: AI editability and maintainability
2. **LOC reduction**: Modest (~300 lines, not 2,000)
3. **Risk level**: Medium-High (requires careful testing)
4. **Effort**: 4-6 focused sessions
5. **Testing strategy**: Snapshot tests are critical

The 8-phase approach with validation between each phase is the recommended path forward.
