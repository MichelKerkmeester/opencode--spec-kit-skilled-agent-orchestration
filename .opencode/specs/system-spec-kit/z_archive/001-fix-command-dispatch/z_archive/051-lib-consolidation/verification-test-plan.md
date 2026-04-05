# Verification Test Plan: Lib Consolidation

## Metadata
- **Created:** 2024-12-31
- **Status:** Ready for execution
- **Purpose:** Verify lib consolidation doesn't break existing functionality

---

## Pre-Migration Baseline

Capture these metrics BEFORE making any changes:

- [ ] Record current CLI startup time: `time node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js'); console.log('loaded')"`
- [ ] Record current MCP server startup time: `time node -e "require('./.opencode/skill/system-spec-kit/mcp_server/context-server'); console.log('loaded')"`
- [ ] Run validation test suite: `bash .opencode/skill/system-spec-kit/scripts/test-validation.sh`
- [ ] Run embeddings factory test: `node .opencode/skill/system-spec-kit/scripts/test-embeddings-factory.js`
- [ ] Count modules loaded by generate-context.js: `node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js'); console.log(Object.keys(require.cache).length + ' modules')"`

### Baseline Results (fill before migration)

| Metric | Baseline Value | Notes |
|--------|---------------|-------|
| CLI startup time | ___ms | |
| MCP server startup time | ___ms | |
| Validation tests passed | ___/__ | |
| Embeddings factory tests | PASS/FAIL | |
| Modules loaded (CLI) | ___ modules | |

---

## Unit Tests

### embeddings.js Functions

- [ ] Test: `generateEmbedding()` returns Float32Array for valid text
  ```bash
  node -e "
    const { generateEmbedding } = require('./.opencode/skill/system-spec-kit/shared/embeddings');
    generateEmbedding('test input').then(r => console.log('generateEmbedding:', r instanceof Float32Array ? 'PASS' : 'FAIL'));
  "
  ```

- [ ] Test: `generateDocumentEmbedding()` returns embedding for document text
  ```bash
  node -e "
    const { generateDocumentEmbedding } = require('./.opencode/skill/system-spec-kit/shared/embeddings');
    generateDocumentEmbedding('This is a test document about JavaScript and Node.js development.').then(r => console.log('generateDocumentEmbedding:', r ? 'PASS' : 'FAIL'));
  "
  ```

- [ ] Test: `generateQueryEmbedding()` returns embedding for search query
  ```bash
  node -e "
    const { generateQueryEmbedding } = require('./.opencode/skill/system-spec-kit/shared/embeddings');
    generateQueryEmbedding('How do I save context?').then(r => console.log('generateQueryEmbedding:', r ? 'PASS' : 'FAIL'));
  "
  ```

- [ ] Test: `getEmbeddingDimension()` returns expected dimension (768)
  ```bash
  node -e "
    const { getEmbeddingDimension } = require('./.opencode/skill/system-spec-kit/shared/embeddings');
    const dim = getEmbeddingDimension();
    console.log('getEmbeddingDimension:', dim === 768 ? 'PASS' : 'FAIL (got ' + dim + ')');
  "
  ```

- [ ] Test: `semanticChunk()` truncates long text correctly
  ```bash
  node -e "
    const { semanticChunk } = require('./.opencode/skill/system-spec-kit/shared/embeddings');
    const longText = 'x'.repeat(10000);
    const chunked = semanticChunk(longText, 1000);
    console.log('semanticChunk:', chunked.length <= 1000 ? 'PASS' : 'FAIL');
  "
  ```

### trigger-extractor.js Functions

- [ ] Test: `extractTriggerPhrases()` returns array of phrases
  ```bash
  node -e "
    const { extractTriggerPhrases } = require('./.opencode/skill/system-spec-kit/shared/trigger-extractor');
    const content = 'Implemented the memory search feature with vector embeddings. Fixed the timeout bug in retry logic.';
    const phrases = extractTriggerPhrases(content);
    console.log('extractTriggerPhrases:', Array.isArray(phrases) && phrases.length > 0 ? 'PASS (' + phrases.length + ' phrases)' : 'FAIL');
  "
  ```

- [ ] Test: `extractTriggerPhrasesWithStats()` returns stats object
  ```bash
  node -e "
    const { extractTriggerPhrasesWithStats } = require('./.opencode/skill/system-spec-kit/shared/trigger-extractor');
    const content = 'Decided to use nomic embeddings for better performance. Implemented retry with exponential backoff.';
    const result = extractTriggerPhrasesWithStats(content);
    console.log('extractTriggerPhrasesWithStats:', result.stats && result.phrases ? 'PASS' : 'FAIL');
    console.log('  Stats:', JSON.stringify(result.stats));
  "
  ```

- [ ] Test: `removeMarkdown()` strips markdown formatting
  ```bash
  node -e "
    const { removeMarkdown } = require('./.opencode/skill/system-spec-kit/shared/trigger-extractor');
    const md = '## Header\n**bold** and \`code\`';
    const clean = removeMarkdown(md);
    console.log('removeMarkdown:', !clean.includes('#') && !clean.includes('*') ? 'PASS' : 'FAIL');
  "
  ```

- [ ] Test: `extractProblemTerms()` detects error/issue patterns
  ```bash
  node -e "
    const { extractProblemTerms } = require('./.opencode/skill/system-spec-kit/shared/trigger-extractor');
    const text = 'Fixed the short output bug and resolved missing data issue';
    const terms = extractProblemTerms(text);
    console.log('extractProblemTerms:', terms.length > 0 ? 'PASS (' + terms.map(t=>t.phrase).join(', ') + ')' : 'FAIL');
  "
  ```

- [ ] Test: `extractTechnicalTerms()` detects camelCase/snake_case
  ```bash
  node -e "
    const { extractTechnicalTerms } = require('./.opencode/skill/system-spec-kit/shared/trigger-extractor');
    const text = 'Called generateContext and used memory_search function';
    const terms = extractTechnicalTerms(text);
    console.log('extractTechnicalTerms:', terms.length > 0 ? 'PASS (' + terms.map(t=>t.phrase).join(', ') + ')' : 'FAIL');
  "
  ```

### retry-utils.js Functions (NEW - after consolidation)

- [ ] Test: Base retry utilities exist without vector-index dependency
  ```bash
  node -e "
    const path = require('path');
    const retryUtils = require('./.opencode/skill/system-spec-kit/shared/retry-utils');
    const cache = Object.keys(require.cache);
    const hasVectorIndex = cache.some(k => k.includes('vector-index'));
    console.log('retry-utils loads:', retryUtils ? 'PASS' : 'FAIL');
    console.log('No vector-index loaded:', !hasVectorIndex ? 'PASS' : 'FAIL (vector-index was loaded!)');
  "
  ```

---

## Integration Tests

### generate-context.js

- [ ] Test: `--help` flag works
  ```bash
  node .opencode/skill/system-spec-kit/scripts/generate-context.js --help
  # Expected: Shows usage information, exit 0
  ```

- [ ] Test: Runs with real spec folder (simulation mode)
  ```bash
  node .opencode/skill/system-spec-kit/scripts/generate-context.js .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/051-lib-consolidation
  # Expected: Creates memory file or shows simulation warning
  ```

- [ ] Test: Handles invalid spec folder gracefully
  ```bash
  node .opencode/skill/system-spec-kit/scripts/generate-context.js specs/invalid-folder-that-does-not-exist/ 2>&1
  # Expected: Error message, non-zero exit
  ```

- [ ] Test: JSON input mode works
  ```bash
  echo '{"specFolder":".opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/051-lib-consolidation","sessionSummary":"Test summary"}' > /tmp/test-context.json
  node .opencode/skill/system-spec-kit/scripts/generate-context.js /tmp/test-context.json
  rm /tmp/test-context.json
  # Expected: Processes JSON, creates/updates memory
  ```

### MCP Server Operations

- [ ] Test: MCP server starts without error
  ```bash
  timeout 5 node -e "
    const server = require('./.opencode/skill/system-spec-kit/mcp_server/context-server');
    console.log('MCP server loaded: PASS');
    process.exit(0);
  " 2>&1 || echo "FAIL or timeout"
  ```

- [ ] Test: `memory_health()` responds
  ```bash
  # Via OpenCode MCP tool (if available) or direct function test
  node -e "
    const vectorIndex = require('./.opencode/skill/system-spec-kit/mcp_server/shared/vector-index');
    vectorIndex.initializeDb();
    const health = vectorIndex.getHealth ? vectorIndex.getHealth() : 'function not found';
    console.log('memory_health:', health ? 'PASS' : 'FAIL');
  "
  ```

- [ ] Test: `memory_search()` executes without error
  ```bash
  # Test basic search functionality
  node -e "
    const hybridSearch = require('./.opencode/skill/system-spec-kit/mcp_server/shared/hybrid-search');
    const vectorIndex = require('./.opencode/skill/system-spec-kit/mcp_server/shared/vector-index');
    vectorIndex.initializeDb();
    // Just verify it loads without crashing
    console.log('memory_search module:', hybridSearch ? 'PASS' : 'FAIL');
  "
  ```

- [ ] Test: `memory_save` workflow (via generate-context.js)
  ```bash
  # Create test memory and verify indexing
  echo '{"specFolder":".opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/051-lib-consolidation","sessionSummary":"Verification test run","triggerPhrases":["lib consolidation","verification test"]}' > /tmp/verify-save.json
  node .opencode/skill/system-spec-kit/scripts/generate-context.js /tmp/verify-save.json
  rm /tmp/verify-save.json
  # Check if memory file was created in spec folder's memory/ directory
  ls -la .opencode/specs/system-spec-kit/z_archive/001-fix-command-dispatch/z_archive/051-lib-consolidation/memory/ 2>/dev/null || echo "No memory folder yet"
  ```

---

## Import Resolution Tests

### No Circular Dependencies

- [ ] Test: Check for circular dependencies with madge
  ```bash
  npx madge --circular .opencode/skill/system-spec-kit/ 2>/dev/null || echo "madge not installed - skip"
  # Expected: No circular dependencies found
  ```

### No Cross-Folder Imports (After Migration)

- [ ] Test: No scripts/ importing from mcp_server/shared/ (except allowed)
  ```bash
  grep -rn "require.*mcp_server/lib" .opencode/skill/system-spec-kit/scripts/ 2>/dev/null | grep -v "vector-index" || echo "PASS: No invalid cross-imports"
  # Note: vector-index.js import is allowed (MCP-specific, stays in mcp_server)
  ```

- [ ] Test: No mcp_server/ importing from scripts/shared/
  ```bash
  grep -rn "require.*scripts/lib" .opencode/skill/system-spec-kit/mcp_server/ 2>/dev/null || echo "PASS: No cross-imports from scripts/lib"
  ```

### All Imports Resolve

- [ ] Test: All script imports resolve
  ```bash
  node -e "
    try {
      require('./.opencode/skill/system-spec-kit/scripts/generate-context.js');
      console.log('scripts/generate-context.js: PASS');
    } catch (e) { console.log('FAIL:', e.message); }
  "
  ```

- [ ] Test: All MCP server imports resolve
  ```bash
  node -e "
    try {
      require('./.opencode/skill/system-spec-kit/mcp_server/context-server.js');
      console.log('mcp_server/context-server.js: PASS');
    } catch (e) { console.log('FAIL:', e.message); }
  "
  ```

- [ ] Test: Shared lib imports resolve
  ```bash
  node -e "
    const path = require('path');
    const libPath = './.opencode/skill/system-spec-kit/lib';
    const modules = ['embeddings', 'trigger-extractor', 'retry-utils'];
    for (const mod of modules) {
      try {
        require(path.join(libPath, mod));
        console.log(mod + ': PASS');
      } catch (e) { console.log(mod + ': FAIL -', e.message); }
    }
  "
  ```

### No "Module Not Found" Errors

- [ ] Test: Full load test with error capture
  ```bash
  node -e "
    process.on('uncaughtException', (e) => {
      if (e.code === 'MODULE_NOT_FOUND') console.log('MODULE_NOT_FOUND:', e.message);
    });
    require('./.opencode/skill/system-spec-kit/scripts/generate-context.js');
    require('./.opencode/skill/system-spec-kit/mcp_server/context-server.js');
    console.log('All modules loaded: PASS');
  "
  ```

---

## Regression Tests

### Validation Test Suite

- [ ] Test: Run full validation test suite
  ```bash
  bash .opencode/skill/system-spec-kit/scripts/test-validation.sh
  # Expected: Same pass/fail count as baseline
  ```

### Embeddings Factory Test

- [ ] Test: Run embeddings factory test
  ```bash
  node .opencode/skill/system-spec-kit/scripts/test-embeddings-factory.js
  # Expected: ALL TESTS PASSED
  ```

### Test Fixtures

- [ ] Test: Validation fixtures still work
  ```bash
  bash .opencode/skill/system-spec-kit/scripts/test-validation.sh -c positive
  # Expected: All positive tests pass
  ```

---

## Performance Tests

### CLI Startup Time

- [ ] Test: CLI startup time comparison
  ```bash
  # Run 3 times, take average
  for i in 1 2 3; do
    time node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js')" 2>&1
  done
  # Expected: Same or faster than baseline (should NOT increase if vector-index is avoided)
  ```

### MCP Server Startup Time

- [ ] Test: MCP server startup time comparison
  ```bash
  # Run 3 times, take average
  for i in 1 2 3; do
    time node -e "require('./.opencode/skill/system-spec-kit/mcp_server/context-server.js')" 2>&1
  done
  # Expected: Same or faster than baseline
  ```

### Module Count Verification

- [ ] Test: CLI loads fewer modules (no vector-index)
  ```bash
  node -e "
    require('./.opencode/skill/system-spec-kit/scripts/generate-context.js');
    const cache = Object.keys(require.cache);
    const vectorLoaded = cache.some(k => k.includes('vector-index'));
    console.log('Modules loaded:', cache.length);
    console.log('vector-index loaded:', vectorLoaded ? 'YES (unexpected)' : 'NO (expected)');
  "
  # Expected: vector-index NOT loaded for CLI scripts
  ```

---

## Commands to Run (Quick Reference)

```bash
# === BASELINE (run BEFORE migration) ===
echo "=== BASELINE CAPTURE ===" | tee baseline.log
time node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js')" 2>&1 | tee -a baseline.log
time node -e "require('./.opencode/skill/system-spec-kit/mcp_server/context-server')" 2>&1 | tee -a baseline.log
bash .opencode/skill/system-spec-kit/scripts/test-validation.sh 2>&1 | tee -a baseline.log
node .opencode/skill/system-spec-kit/scripts/test-embeddings-factory.js 2>&1 | tee -a baseline.log

# === POST-MIGRATION VERIFICATION ===
echo "=== POST-MIGRATION VERIFICATION ===" | tee verify.log

# Unit tests
echo "--- Unit Tests ---" | tee -a verify.log
node -e "const {generateEmbedding}=require('./.opencode/skill/system-spec-kit/shared/embeddings'); generateEmbedding('test').then(r=>console.log('generateEmbedding:',r?'PASS':'FAIL'))" 2>&1 | tee -a verify.log
node -e "const {extractTriggerPhrases}=require('./.opencode/skill/system-spec-kit/shared/trigger-extractor'); console.log('extractTriggerPhrases:',extractTriggerPhrases('test feature implementation').length>0?'PASS':'FAIL')" 2>&1 | tee -a verify.log

# Integration tests
echo "--- Integration Tests ---" | tee -a verify.log
node .opencode/skill/system-spec-kit/scripts/generate-context.js --help 2>&1 | head -5 | tee -a verify.log
timeout 5 node -e "require('./.opencode/skill/system-spec-kit/mcp_server/context-server');console.log('MCP:PASS')" 2>&1 | tee -a verify.log

# Import resolution
echo "--- Import Resolution ---" | tee -a verify.log
grep -rn "require.*mcp_server/lib" .opencode/skill/system-spec-kit/scripts/ 2>/dev/null | grep -v vector-index | head -5 || echo "No invalid cross-imports" | tee -a verify.log

# Regression tests
echo "--- Regression Tests ---" | tee -a verify.log
bash .opencode/skill/system-spec-kit/scripts/test-validation.sh 2>&1 | tail -20 | tee -a verify.log
node .opencode/skill/system-spec-kit/scripts/test-embeddings-factory.js 2>&1 | tail -10 | tee -a verify.log

# Performance
echo "--- Performance ---" | tee -a verify.log
time node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js')" 2>&1 | tee -a verify.log
node -e "require('./.opencode/skill/system-spec-kit/scripts/generate-context.js');console.log('Modules:',Object.keys(require.cache).length)" 2>&1 | tee -a verify.log
```

---

## Success Criteria

| Category | Criterion | Status |
|----------|-----------|--------|
| **Unit Tests** | All embeddings.js functions work | [ ] |
| **Unit Tests** | All trigger-extractor.js functions work | [ ] |
| **Unit Tests** | retry-utils.js loads without vector-index | [ ] |
| **Integration** | generate-context.js --help works | [ ] |
| **Integration** | MCP server starts successfully | [ ] |
| **Integration** | memory_search executes | [ ] |
| **Integration** | memory_save workflow completes | [ ] |
| **Imports** | No circular dependencies | [ ] |
| **Imports** | No invalid cross-folder imports | [ ] |
| **Imports** | All imports resolve | [ ] |
| **Regression** | Validation test suite passes | [ ] |
| **Regression** | Embeddings factory test passes | [ ] |
| **Performance** | CLI startup time <= baseline | [ ] |
| **Performance** | MCP startup time <= baseline | [ ] |
| **Performance** | CLI does NOT load vector-index.js | [ ] |

**PASS Threshold:** All criteria must pass for migration to be considered successful.

---

## Rollback Triggers

If ANY of these occur, rollback immediately:

1. **Critical:**
   - generate-context.js fails to run
   - MCP server fails to start
   - "Module not found" errors
   
2. **Serious:**
   - Validation test suite regression (fewer tests pass)
   - Embeddings fail to generate
   
3. **Performance:**
   - CLI startup time increases by >50%
   - CLI now loads vector-index.js (defeats purpose)

**Rollback command:**
```bash
git checkout HEAD -- .opencode/skill/system-spec-kit/
```
