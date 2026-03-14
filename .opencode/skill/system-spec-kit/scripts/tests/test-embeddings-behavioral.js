// ───────────────────────────────────────────────────────────────
// 1. TEST: EMBEDDINGS BEHAVIORAL VERIFICATION
// ───────────────────────────────────────────────────────────────
// Tests actual behavior of shared/embeddings.ts functions
// (re-exported via lib/embeddings.ts shim).
//
// Strategy: mock the factory's createEmbeddingsProvider so no
// Real model/API is loaded, then verify caching, input
// Validation, batching, lazy loading, and dimension logic.
'use strict';

const path = require('path');
const Module = require('module');

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
────────────────────────────────────────────────────────────────
*/

const ROOT = path.join(__dirname, '..', '..');
const SHARED_DIST = path.join(ROOT, 'shared', 'dist');

// Test results
const results = { passed: 0, failed: 0, skipped: 0, tests: [] };

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
────────────────────────────────────────────────────────────────
*/

function log(msg) { console.log(msg); }

function pass(id, evidence) {
  results.passed++;
  results.tests.push({ name: id, status: 'PASS', evidence });
  log(`   ✅ ${id}`);
  if (evidence) log(`      Evidence: ${evidence}`);
}

function fail(id, reason) {
  results.failed++;
  results.tests.push({ name: id, status: 'FAIL', reason });
  log(`   ❌ ${id}`);
  log(`      Reason: ${reason}`);
}

function skip(id, reason) {
  results.skipped++;
  results.tests.push({ name: id, status: 'SKIP', reason });
  log(`   ⏭️  ${id} (skipped: ${reason})`);
}

function assertEqual(actual, expected, id, evidence) {
  if (actual === expected) {
    pass(id, evidence || `${actual}`);
  } else {
    fail(id, `Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}

function assert(condition, id, evidence, failMsg) {
  if (condition) {
    pass(id, evidence);
  } else {
    fail(id, failMsg || 'Assertion failed');
  }
}

/* ─────────────────────────────────────────────────────────────
   3. MOCK PROVIDER FACTORY
────────────────────────────────────────────────────────────────
*/

/**
 * Create a mock embedding provider that returns deterministic
 * Float32Array embeddings without loading any model.
 */
function createMockProvider(opts = {}) {
  const dim = opts.dim || 768;
  const providerName = opts.provider || 'mock-test';
  const modelName = opts.model || 'mock-model-v1';
  let callCount = 0;
  let documentCallCount = 0;
  let queryCallCount = 0;
  let warmupCalled = false;

  /** Produce a deterministic embedding from text */
  function deterministicEmbedding(text) {
    const arr = new Float32Array(dim);
    for (let i = 0; i < dim; i++) {
      // Simple deterministic hash-like fill
      arr[i] = ((text.charCodeAt(i % text.length) * (i + 1)) % 1000) / 1000;
    }
    return arr;
  }

  return {
    // Core interface
    async generateEmbedding(text) {
      callCount++;
      return deterministicEmbedding(text);
    },
    async embedDocument(text) {
      documentCallCount++;
      return deterministicEmbedding('doc:' + text);
    },
    async embedQuery(text) {
      queryCallCount++;
      return deterministicEmbedding('query:' + text);
    },
    async warmup() {
      warmupCalled = true;
      return true;
    },
    getMetadata() {
      return {
        provider: providerName,
        model: modelName,
        dim,
        healthy: true,
        device: 'cpu',
        loaded: true,
        loadTimeMs: 42,
      };
    },
    getProfile() {
      return { provider: providerName, model: modelName, dim, slug: `${providerName}-${dim}` };
    },
    async healthCheck() { return true; },
    getProviderName() { return providerName; },
    // Test introspection helpers
    _getCallCount() { return callCount; },
    _getDocumentCallCount() { return documentCallCount; },
    _getQueryCallCount() { return queryCallCount; },
    _wasWarmupCalled() { return warmupCalled; },
    _resetCounts() { callCount = 0; documentCallCount = 0; queryCallCount = 0; },
  };
}

/* ─────────────────────────────────────────────────────────────
   4. MODULE LOADING WITH MOCKED FACTORY
────────────────────────────────────────────────────────────────
*/

/**
 * Load the embeddings module with factory mocked.
 *
 * Because the module caches the singleton provider, we need to:
 * 1. Mock the factory before any require of embeddings
 * 2. Clear require caches between test groups that need fresh state
 */
function loadEmbeddingsWithMock(mockProvider) {
  // Resolve the factory module path
  const factoryPath = path.join(SHARED_DIST, 'embeddings', 'factory.js');
  const factoryResolved = require.resolve(factoryPath);

  // Clear caches so we get a fresh embeddings module
  const embeddingsPath = path.join(SHARED_DIST, 'embeddings.js');
  const embeddingsResolved = require.resolve(embeddingsPath);
  delete require.cache[embeddingsResolved];
  delete require.cache[factoryResolved];

  // Pre-load and mock factory
  const factory = require(factoryResolved);
  const originalCreate = factory.createEmbeddingsProvider;
  factory.createEmbeddingsProvider = async function mockCreate(_opts) {
    return mockProvider;
  };

  // Also mock getProviderInfo for pre-init metadata
  const originalGetInfo = factory.getProviderInfo;
  factory.getProviderInfo = function mockGetInfo() {
    return { provider: 'mock-test', reason: 'mock', config: {} };
  };

  // Now load embeddings (it will use our mocked factory)
  const emb = require(embeddingsResolved);

  return {
    emb,
    restore() {
      factory.createEmbeddingsProvider = originalCreate;
      factory.getProviderInfo = originalGetInfo;
      delete require.cache[embeddingsResolved];
      delete require.cache[factoryResolved];
    },
  };
}

/**
 * Load the embeddings module with factory that throws (simulates provider unavailable).
 */
function loadEmbeddingsWithFailingFactory(errorMsg) {
  const factoryPath = path.join(SHARED_DIST, 'embeddings', 'factory.js');
  const factoryResolved = require.resolve(factoryPath);
  const embeddingsPath = path.join(SHARED_DIST, 'embeddings.js');
  const embeddingsResolved = require.resolve(embeddingsPath);
  delete require.cache[embeddingsResolved];
  delete require.cache[factoryResolved];

  const factory = require(factoryResolved);
  const originalCreate = factory.createEmbeddingsProvider;
  factory.createEmbeddingsProvider = async function failCreate() {
    throw new Error(errorMsg || 'Provider unavailable');
  };

  const emb = require(embeddingsResolved);

  return {
    emb,
    restore() {
      factory.createEmbeddingsProvider = originalCreate;
      delete require.cache[embeddingsResolved];
      delete require.cache[factoryResolved];
    },
  };
}

/* ─────────────────────────────────────────────────────────────
   5. TEST GROUPS
────────────────────────────────────────────────────────────────
*/

// ═══════════════════════════════════════════════════════════════
// GROUP A: PURE FUNCTIONS & CONSTANTS (no provider needed)
// ═══════════════════════════════════════════════════════════════

async function testPureFunctionsAndConstants() {
  log('\n🔬 GROUP A: Pure functions & constants');

  // Load fresh module (no provider init needed for these)
  const embeddingsPath = path.join(SHARED_DIST, 'embeddings.js');
  delete require.cache[require.resolve(embeddingsPath)];
  // Clear factory cache too to get a clean module
  const factoryPath = path.join(SHARED_DIST, 'embeddings', 'factory.js');
  try { delete require.cache[require.resolve(factoryPath)]; } catch (_) {}
  const emb = require(embeddingsPath);

  // --- Constants ---
  assertEqual(emb.EMBEDDING_DIM, 768, 'EB-001: EMBEDDING_DIM is 768');
  assertEqual(emb.EMBEDDING_TIMEOUT, 30000, 'EB-002: EMBEDDING_TIMEOUT is 30000ms');
  assertEqual(emb.MODEL_NAME, 'nomic-ai/nomic-embed-text-v1.5', 'EB-003: MODEL_NAME is nomic default');
  assertEqual(emb.DEFAULT_MODEL_NAME, 'nomic-ai/nomic-embed-text-v1.5', 'EB-004: DEFAULT_MODEL_NAME matches MODEL_NAME');
  assert(typeof emb.MAX_TEXT_LENGTH === 'number' && emb.MAX_TEXT_LENGTH > 0,
    'EB-005: MAX_TEXT_LENGTH is a positive number', `${emb.MAX_TEXT_LENGTH}`);
  assert(typeof emb.BATCH_DELAY_MS === 'number',
    'EB-006: BATCH_DELAY_MS is a number', `${emb.BATCH_DELAY_MS}`);
  assertEqual(emb.BATCH_RATE_LIMIT_DELAY, emb.BATCH_DELAY_MS,
    'EB-007: BATCH_RATE_LIMIT_DELAY aliases BATCH_DELAY_MS');

  // --- TASK_PREFIX object ---
  assert(emb.TASK_PREFIX && typeof emb.TASK_PREFIX === 'object',
    'EB-008: TASK_PREFIX is an object', Object.keys(emb.TASK_PREFIX).join(', '));
  assertEqual(emb.TASK_PREFIX.DOCUMENT, 'search_document: ',
    'EB-009: TASK_PREFIX.DOCUMENT correct');
  assertEqual(emb.TASK_PREFIX.QUERY, 'search_query: ',
    'EB-010: TASK_PREFIX.QUERY correct');
  assertEqual(emb.TASK_PREFIX.CLUSTERING, 'clustering: ',
    'EB-011: TASK_PREFIX.CLUSTERING correct');
  assertEqual(emb.TASK_PREFIX.CLASSIFICATION, 'classification: ',
    'EB-012: TASK_PREFIX.CLASSIFICATION correct');

  // --- getTaskPrefix ---
  assertEqual(emb.getTaskPrefix('document'), 'search_document: ',
    'EB-013: getTaskPrefix("document") returns correct prefix');
  assertEqual(emb.getTaskPrefix('query'), 'search_query: ',
    'EB-014: getTaskPrefix("query") returns correct prefix');
  assertEqual(emb.getTaskPrefix('clustering'), 'clustering: ',
    'EB-015: getTaskPrefix("clustering") returns correct prefix');
  assertEqual(emb.getTaskPrefix('classification'), 'classification: ',
    'EB-016: getTaskPrefix("classification") returns correct prefix');
  assertEqual(emb.getTaskPrefix('unknown_task'), '',
    'EB-017: getTaskPrefix with unknown task returns empty string');
  assertEqual(emb.getTaskPrefix(''), '',
    'EB-018: getTaskPrefix with empty string returns empty string');

  // --- getOptimalDevice ---
  const expectedDevice = process.platform === 'darwin' ? 'mps' : 'cpu';
  assertEqual(emb.getOptimalDevice(), expectedDevice,
    'EB-019: getOptimalDevice returns platform-appropriate device',
    `platform=${process.platform}`);

  // --- shouldEagerWarmup ---
  // Save original env
  const origEager = process.env.SPECKIT_EAGER_WARMUP;
  const origLazy = process.env.SPECKIT_LAZY_LOADING;

  // Test default (no env vars)
  delete process.env.SPECKIT_EAGER_WARMUP;
  delete process.env.SPECKIT_LAZY_LOADING;
  assertEqual(emb.shouldEagerWarmup(), false,
    'EB-020: shouldEagerWarmup defaults to false');

  // Test SPECKIT_EAGER_WARMUP=true
  process.env.SPECKIT_EAGER_WARMUP = 'true';
  assertEqual(emb.shouldEagerWarmup(), true,
    'EB-021: shouldEagerWarmup true when SPECKIT_EAGER_WARMUP=true');

  // Test SPECKIT_EAGER_WARMUP=1
  process.env.SPECKIT_EAGER_WARMUP = '1';
  assertEqual(emb.shouldEagerWarmup(), true,
    'EB-022: shouldEagerWarmup true when SPECKIT_EAGER_WARMUP=1');

  // Test SPECKIT_LAZY_LOADING=false (inverse semantics)
  delete process.env.SPECKIT_EAGER_WARMUP;
  process.env.SPECKIT_LAZY_LOADING = 'false';
  assertEqual(emb.shouldEagerWarmup(), true,
    'EB-023: shouldEagerWarmup true when SPECKIT_LAZY_LOADING=false');

  // Test SPECKIT_LAZY_LOADING=0
  process.env.SPECKIT_LAZY_LOADING = '0';
  assertEqual(emb.shouldEagerWarmup(), true,
    'EB-024: shouldEagerWarmup true when SPECKIT_LAZY_LOADING=0');

  // Restore env
  if (origEager !== undefined) process.env.SPECKIT_EAGER_WARMUP = origEager;
  else delete process.env.SPECKIT_EAGER_WARMUP;
  if (origLazy !== undefined) process.env.SPECKIT_LAZY_LOADING = origLazy;
  else delete process.env.SPECKIT_LAZY_LOADING;

  // --- getEmbeddingDimension (env-based, no provider) ---
  const origProvider = process.env.EMBEDDINGS_PROVIDER;
  const origVoyage = process.env.VOYAGE_API_KEY;
  const origOpenai = process.env.OPENAI_API_KEY;

  // Default (no env) = 768
  delete process.env.EMBEDDINGS_PROVIDER;
  delete process.env.VOYAGE_API_KEY;
  delete process.env.OPENAI_API_KEY;
  assertEqual(emb.getEmbeddingDimension(), 768,
    'EB-025: getEmbeddingDimension defaults to 768 with no env');

  // EMBEDDINGS_PROVIDER=voyage → 1024
  process.env.EMBEDDINGS_PROVIDER = 'voyage';
  assertEqual(emb.getEmbeddingDimension(), 1024,
    'EB-026: getEmbeddingDimension returns 1024 for voyage provider');

  // EMBEDDINGS_PROVIDER=openai → 1536
  process.env.EMBEDDINGS_PROVIDER = 'openai';
  assertEqual(emb.getEmbeddingDimension(), 1536,
    'EB-027: getEmbeddingDimension returns 1536 for openai provider');

  // EMBEDDINGS_PROVIDER=VOYAGE (case insensitive)
  process.env.EMBEDDINGS_PROVIDER = 'VOYAGE';
  assertEqual(emb.getEmbeddingDimension(), 1024,
    'EB-028: getEmbeddingDimension case-insensitive for provider name');

  // API key inference: VOYAGE_API_KEY only → 1024
  delete process.env.EMBEDDINGS_PROVIDER;
  process.env.VOYAGE_API_KEY = 'test-key';
  delete process.env.OPENAI_API_KEY;
  assertEqual(emb.getEmbeddingDimension(), 1024,
    'EB-029: getEmbeddingDimension infers 1024 from VOYAGE_API_KEY');

  // API key inference: OPENAI_API_KEY only → 1536
  delete process.env.VOYAGE_API_KEY;
  process.env.OPENAI_API_KEY = 'test-key';
  assertEqual(emb.getEmbeddingDimension(), 1536,
    'EB-030: getEmbeddingDimension infers 1536 from OPENAI_API_KEY');

  // Both keys → defaults to 768 (ambiguous)
  process.env.VOYAGE_API_KEY = 'v-key';
  process.env.OPENAI_API_KEY = 'o-key';
  assertEqual(emb.getEmbeddingDimension(), 768,
    'EB-031: getEmbeddingDimension returns 768 when both API keys present (ambiguous)');

  // Restore env
  if (origProvider !== undefined) process.env.EMBEDDINGS_PROVIDER = origProvider;
  else delete process.env.EMBEDDINGS_PROVIDER;
  if (origVoyage !== undefined) process.env.VOYAGE_API_KEY = origVoyage;
  else delete process.env.VOYAGE_API_KEY;
  if (origOpenai !== undefined) process.env.OPENAI_API_KEY = origOpenai;
  else delete process.env.OPENAI_API_KEY;

  // --- Chunking re-exports ---
  assert(typeof emb.semanticChunk === 'function',
    'EB-032: semanticChunk is re-exported', 'function');
  assert(typeof emb.RESERVED_OVERVIEW === 'number',
    'EB-033: RESERVED_OVERVIEW is re-exported', `${emb.RESERVED_OVERVIEW}`);
  assert(typeof emb.RESERVED_OUTCOME === 'number',
    'EB-034: RESERVED_OUTCOME is re-exported', `${emb.RESERVED_OUTCOME}`);
  assert(typeof emb.MIN_SECTION_LENGTH === 'number',
    'EB-035: MIN_SECTION_LENGTH is re-exported', `${emb.MIN_SECTION_LENGTH}`);

  // --- Pre-init utility state ---
  assertEqual(emb.getModelName(), 'not-loaded',
    'EB-036: getModelName returns "not-loaded" before init');
  assertEqual(emb.getEmbeddingProfile(), null,
    'EB-037: getEmbeddingProfile returns null before init');
  assertEqual(emb.getModelLoadTime(), null,
    'EB-038: getModelLoadTime returns null before init');
  assertEqual(emb.getCurrentDevice(), null,
    'EB-039: getCurrentDevice returns null before init');
}

// ═══════════════════════════════════════════════════════════════
// GROUP B: INPUT VALIDATION (null/empty returns before provider)
// ═══════════════════════════════════════════════════════════════

async function testInputValidation() {
  log('\n🔬 GROUP B: Input validation (null/empty guard paths)');

  // Use a mock that tracks calls to verify the provider is NOT called
  const mockProvider = createMockProvider();
  const { emb, restore } = loadEmbeddingsWithMock(mockProvider);

  try {
    // --- generateEmbedding ---
    assertEqual(await emb.generateEmbedding(null), null,
      'EB-040: generateEmbedding(null) returns null');
    assertEqual(await emb.generateEmbedding(undefined), null,
      'EB-041: generateEmbedding(undefined) returns null');
    assertEqual(await emb.generateEmbedding(''), null,
      'EB-042: generateEmbedding("") returns null');
    assertEqual(await emb.generateEmbedding('   '), null,
      'EB-043: generateEmbedding("   ") returns null (whitespace only)');
    assertEqual(await emb.generateEmbedding(123), null,
      'EB-044: generateEmbedding(123) returns null (non-string)');
    assertEqual(await emb.generateEmbedding({}), null,
      'EB-045: generateEmbedding({}) returns null (object)');

    // Provider should NOT have been called for any of the above
    assertEqual(mockProvider._getCallCount(), 0,
      'EB-046: provider.generateEmbedding not called for invalid inputs');

    // --- generateDocumentEmbedding ---
    assertEqual(await emb.generateDocumentEmbedding(null), null,
      'EB-047: generateDocumentEmbedding(null) returns null');
    assertEqual(await emb.generateDocumentEmbedding(''), null,
      'EB-048: generateDocumentEmbedding("") returns null');
    assertEqual(await emb.generateDocumentEmbedding('   '), null,
      'EB-049: generateDocumentEmbedding("   ") returns null');
    assertEqual(await emb.generateDocumentEmbedding(42), null,
      'EB-050: generateDocumentEmbedding(42) returns null');

    assertEqual(mockProvider._getDocumentCallCount(), 0,
      'EB-051: provider.embedDocument not called for invalid inputs');

    // --- generateQueryEmbedding ---
    assertEqual(await emb.generateQueryEmbedding(null), null,
      'EB-052: generateQueryEmbedding(null) returns null');
    assertEqual(await emb.generateQueryEmbedding(''), null,
      'EB-053: generateQueryEmbedding("") returns null');
    assertEqual(await emb.generateQueryEmbedding('   \t\n  '), null,
      'EB-054: generateQueryEmbedding(whitespace) returns null');

    assertEqual(mockProvider._getQueryCallCount(), 0,
      'EB-055: provider.embedQuery not called for invalid inputs');

    // --- generateClusteringEmbedding ---
    assertEqual(await emb.generateClusteringEmbedding(null), null,
      'EB-056: generateClusteringEmbedding(null) returns null');
    assertEqual(await emb.generateClusteringEmbedding(''), null,
      'EB-057: generateClusteringEmbedding("") returns null');

    // --- generateBatchEmbeddings ---
    let threw = false;
    try { await emb.generateBatchEmbeddings('not-an-array'); }
    catch (e) { threw = e instanceof TypeError; }
    assert(threw, 'EB-058: generateBatchEmbeddings throws TypeError for non-array',
      'TypeError thrown');

    const emptyResult = await emb.generateBatchEmbeddings([]);
    assert(Array.isArray(emptyResult) && emptyResult.length === 0,
      'EB-059: generateBatchEmbeddings([]) returns empty array');
  } finally {
    restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP C: CORE EMBEDDING GENERATION (with mock provider)
// ═══════════════════════════════════════════════════════════════

async function testCoreEmbeddingGeneration() {
  log('\n🔬 GROUP C: Core embedding generation (mock provider)');

  const mockProvider = createMockProvider({ dim: 768 });
  const { emb, restore } = loadEmbeddingsWithMock(mockProvider);

  try {
    emb.clearEmbeddingCache();

    // --- Basic embedding generation ---
    const result = await emb.generateEmbedding('hello world');
    assert(result instanceof Float32Array,
      'EB-060: generateEmbedding returns Float32Array', `type=${result?.constructor?.name}`);
    assertEqual(result.length, 768,
      'EB-061: embedding has correct dimension (768)');
    assertEqual(mockProvider._getCallCount(), 1,
      'EB-062: provider.generateEmbedding called once');

    // --- Trimming behavior ---
    mockProvider._resetCounts();
    emb.clearEmbeddingCache();
    const resultTrimmed = await emb.generateEmbedding('  padded text  ');
    assert(resultTrimmed instanceof Float32Array,
      'EB-063: generateEmbedding trims whitespace and succeeds');
    assertEqual(mockProvider._getCallCount(), 1,
      'EB-064: provider called with trimmed text');

    // --- generateDocumentEmbedding ---
    mockProvider._resetCounts();
    emb.clearEmbeddingCache();
    const docResult = await emb.generateDocumentEmbedding('document text');
    assert(docResult instanceof Float32Array,
      'EB-065: generateDocumentEmbedding returns Float32Array');
    assertEqual(mockProvider._getDocumentCallCount(), 1,
      'EB-066: provider.embedDocument called (not generateEmbedding)');
    assertEqual(mockProvider._getCallCount(), 0,
      'EB-067: provider.generateEmbedding NOT called by generateDocumentEmbedding');

    // --- generateQueryEmbedding ---
    mockProvider._resetCounts();
    emb.clearEmbeddingCache();
    const queryResult = await emb.generateQueryEmbedding('search query');
    assert(queryResult instanceof Float32Array,
      'EB-068: generateQueryEmbedding returns Float32Array');
    assertEqual(mockProvider._getQueryCallCount(), 1,
      'EB-069: provider.embedQuery called');
    assertEqual(mockProvider._getCallCount(), 0,
      'EB-070: provider.generateEmbedding NOT called by generateQueryEmbedding');

    // --- generateClusteringEmbedding delegates to generateDocumentEmbedding ---
    mockProvider._resetCounts();
    emb.clearEmbeddingCache();
    const clusterResult = await emb.generateClusteringEmbedding('cluster text');
    assert(clusterResult instanceof Float32Array,
      'EB-071: generateClusteringEmbedding returns Float32Array');
    assertEqual(mockProvider._getDocumentCallCount(), 1,
      'EB-072: generateClusteringEmbedding delegates to embedDocument');

    // --- generateEmbeddingWithTimeout (successful) ---
    mockProvider._resetCounts();
    emb.clearEmbeddingCache();
    const timeoutResult = await emb.generateEmbeddingWithTimeout('timeout test', 5000);
    assert(timeoutResult instanceof Float32Array,
      'EB-073: generateEmbeddingWithTimeout returns result for fast operation');
  } finally {
    restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP D: CACHING BEHAVIOR
// ═══════════════════════════════════════════════════════════════

async function testCachingBehavior() {
  log('\n🔬 GROUP D: Caching behavior');

  const mockProvider = createMockProvider({ dim: 768 });
  const { emb, restore } = loadEmbeddingsWithMock(mockProvider);

  try {
    emb.clearEmbeddingCache();

    // --- Cache miss then hit ---
    const first = await emb.generateEmbedding('cache test');
    assertEqual(mockProvider._getCallCount(), 1,
      'EB-074: First call is cache miss → provider called');

    const second = await emb.generateEmbedding('cache test');
    assertEqual(mockProvider._getCallCount(), 1,
      'EB-075: Second call is cache hit → provider NOT called again');

    assert(first instanceof Float32Array && second instanceof Float32Array,
      'EB-076: Both cached and uncached results are Float32Array');

    // Verify same content (should be identical reference or equal values)
    let arraysEqual = first.length === second.length;
    if (arraysEqual) {
      for (let i = 0; i < first.length; i++) {
        if (first[i] !== second[i]) { arraysEqual = false; break; }
      }
    }
    assert(arraysEqual,
      'EB-077: Cached result matches original embedding values');

    // --- clearEmbeddingCache ---
    emb.clearEmbeddingCache();
    mockProvider._resetCounts();
    await emb.generateEmbedding('cache test');
    assertEqual(mockProvider._getCallCount(), 1,
      'EB-078: After clearEmbeddingCache, provider is called again (cache cleared)');

    // --- getEmbeddingCacheStats ---
    emb.clearEmbeddingCache();
    const stats0 = emb.getEmbeddingCacheStats();
    assertEqual(stats0.size, 0, 'EB-079: Cache stats size=0 after clear');
    assert(stats0.maxSize === 1000, 'EB-080: Cache maxSize is 1000', `${stats0.maxSize}`);

    await emb.generateEmbedding('stats test');
    const stats1 = emb.getEmbeddingCacheStats();
    assertEqual(stats1.size, 1, 'EB-081: Cache stats size=1 after one embedding');

    // --- Document embedding cache uses different key namespace ---
    emb.clearEmbeddingCache();
    mockProvider._resetCounts();
    await emb.generateDocumentEmbedding('same text');
    assertEqual(mockProvider._getDocumentCallCount(), 1,
      'EB-082: Document embedding: first call hits provider');
    await emb.generateDocumentEmbedding('same text');
    assertEqual(mockProvider._getDocumentCallCount(), 1,
      'EB-083: Document embedding: second call uses cache');

    // GenerateEmbedding with the same raw text should NOT hit doc cache (different namespace)
    mockProvider._resetCounts();
    await emb.generateEmbedding('same text');
    assertEqual(mockProvider._getCallCount(), 1,
      'EB-084: generateEmbedding("same text") is NOT cached by doc namespace');

    // --- Query embedding caching ---
    emb.clearEmbeddingCache();
    mockProvider._resetCounts();
    await emb.generateQueryEmbedding('search term');
    assertEqual(mockProvider._getQueryCallCount(), 1,
      'EB-085: Query embedding: first call hits provider');
    await emb.generateQueryEmbedding('search term');
    assertEqual(mockProvider._getQueryCallCount(), 1,
      'EB-086: Query embedding: second call uses cache');
  } finally {
    restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP E: BATCH PROCESSING
// ═══════════════════════════════════════════════════════════════

async function testBatchProcessing() {
  log('\n🔬 GROUP E: Batch processing');

  const mockProvider = createMockProvider({ dim: 768 });
  const { emb, restore } = loadEmbeddingsWithMock(mockProvider);

  try {
    emb.clearEmbeddingCache();

    // --- Basic batch ---
    const texts = ['alpha', 'beta', 'gamma'];
    const results = await emb.generateBatchEmbeddings(texts, 5, { delayMs: 0 });
    assertEqual(results.length, 3,
      'EB-087: Batch returns correct number of results');
    assert(results.every(r => r instanceof Float32Array),
      'EB-088: All batch results are Float32Array');

    // --- Batch with concurrency splitting ---
    emb.clearEmbeddingCache();
    mockProvider._resetCounts();
    const moreTexts = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
    const batchResults = await emb.generateBatchEmbeddings(moreTexts, 3, { delayMs: 0 });
    assertEqual(batchResults.length, 7,
      'EB-089: Batch with 7 texts at concurrency=3 returns 7 results');

    // Provider should have been called 7 times (1 per unique text)
    assertEqual(mockProvider._getCallCount(), 7,
      'EB-090: Provider called once per text in batch');

    // --- Batch leverages cache ---
    // Run same batch again without clearing cache
    mockProvider._resetCounts();
    const cachedBatch = await emb.generateBatchEmbeddings(moreTexts, 3, { delayMs: 0 });
    assertEqual(cachedBatch.length, 7,
      'EB-091: Repeated batch returns 7 results');
    assertEqual(mockProvider._getCallCount(), 0,
      'EB-092: Repeated batch uses cache → provider called 0 times');

    // --- Single-item batch ---
    emb.clearEmbeddingCache();
    mockProvider._resetCounts();
    const singleBatch = await emb.generateBatchEmbeddings(['solo'], 5, { delayMs: 0 });
    assertEqual(singleBatch.length, 1,
      'EB-093: Single-item batch returns 1 result');
    assert(singleBatch[0] instanceof Float32Array,
      'EB-094: Single-item batch result is Float32Array');
  } finally {
    restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP F: LAZY LOADING & PROVIDER LIFECYCLE
// ═══════════════════════════════════════════════════════════════

async function testLazyLoadingLifecycle() {
  log('\n🔬 GROUP F: Lazy loading & provider lifecycle');

  const mockProvider = createMockProvider({ dim: 384, provider: 'lifecycle-test', model: 'test-v2' });
  const { emb, restore } = loadEmbeddingsWithMock(mockProvider);

  try {
    // --- Pre-init state ---
    assertEqual(emb.isProviderInitialized(), false,
      'EB-095: isProviderInitialized() false before any call');
    assertEqual(emb.isModelLoaded(), false,
      'EB-096: isModelLoaded() false before any call');

    const preStats = emb.getLazyLoadingStats();
    assertEqual(preStats.isInitialized, false,
      'EB-097: getLazyLoadingStats.isInitialized false before init');
    assertEqual(preStats.isInitializing, false,
      'EB-098: getLazyLoadingStats.isInitializing false before init');
    assertEqual(preStats.initDurationMs, null,
      'EB-099: getLazyLoadingStats.initDurationMs null before init');

    // --- Trigger init via embedding call ---
    await emb.generateEmbedding('trigger init');

    assertEqual(emb.isProviderInitialized(), true,
      'EB-100: isProviderInitialized() true after embedding call');
    assertEqual(emb.isModelLoaded(), true,
      'EB-101: isModelLoaded() true after embedding call');

    const postStats = emb.getLazyLoadingStats();
    assertEqual(postStats.isInitialized, true,
      'EB-102: getLazyLoadingStats.isInitialized true after init');
    assert(typeof postStats.initDurationMs === 'number' && postStats.initDurationMs >= 0,
      'EB-103: getLazyLoadingStats.initDurationMs is a non-negative number',
      `${postStats.initDurationMs}ms`);
    assert(typeof postStats.firstEmbeddingTime === 'number',
      'EB-104: getLazyLoadingStats.firstEmbeddingTime recorded');

    // --- Post-init utility functions return provider data ---
    assertEqual(emb.getModelName(), 'test-v2',
      'EB-105: getModelName returns provider model after init');
    assertEqual(emb.getModelLoadTime(), 42,
      'EB-106: getModelLoadTime returns provider loadTimeMs');
    assertEqual(emb.getCurrentDevice(), 'cpu',
      'EB-107: getCurrentDevice returns provider device');

    // --- getEmbeddingProfile ---
    const profile = emb.getEmbeddingProfile();
    assert(profile !== null,
      'EB-108: getEmbeddingProfile returns non-null after init');
    assertEqual(profile.provider, 'lifecycle-test',
      'EB-109: getEmbeddingProfile.provider matches mock');
    assertEqual(profile.dim, 384,
      'EB-110: getEmbeddingProfile.dim matches mock (384)');

    // --- getEmbeddingProfileAsync ---
    const asyncProfile = await emb.getEmbeddingProfileAsync();
    assertEqual(asyncProfile.model, 'test-v2',
      'EB-111: getEmbeddingProfileAsync.model matches mock');

    // --- getProviderMetadata ---
    const metadata = emb.getProviderMetadata();
    assertEqual(metadata.provider, 'lifecycle-test',
      'EB-112: getProviderMetadata.provider matches mock');
    assertEqual(metadata.healthy, true,
      'EB-113: getProviderMetadata.healthy is true');

    // --- getEmbeddingDimension uses provider when available ---
    assertEqual(emb.getEmbeddingDimension(), 384,
      'EB-114: getEmbeddingDimension returns provider dim (384) when initialized');

    // --- preWarmModel ---
    const warmResult = await emb.preWarmModel();
    assertEqual(warmResult, true,
      'EB-115: preWarmModel returns true');
    assert(mockProvider._wasWarmupCalled(),
      'EB-116: preWarmModel calls provider.warmup()');
  } finally {
    restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP G: ERROR HANDLING (provider failure)
// ═══════════════════════════════════════════════════════════════

async function testErrorHandling() {
  log('\n🔬 GROUP G: Error handling (provider failure)');

  // --- Provider creation failure ---
  const { emb: failEmb, restore: restore1 } = loadEmbeddingsWithFailingFactory('Model not found');

  try {
    let threw = false;
    let errMsg = '';
    try {
      await failEmb.generateEmbedding('should fail');
    } catch (e) {
      threw = true;
      errMsg = e.message;
    }
    assert(threw,
      'EB-117: generateEmbedding throws when provider creation fails');
    assert(errMsg.includes('Model not found'),
      'EB-118: Error message propagates from factory',
      errMsg);

    // After failure, provider promise is cleared (allows retry)
    assertEqual(failEmb.isProviderInitialized(), false,
      'EB-119: isProviderInitialized false after factory failure');
  } finally {
    restore1();
  }

  // --- generateEmbeddingWithTimeout: timeout triggers ---
  const slowProvider = createMockProvider({ dim: 768 });
  // Override generateEmbedding to be slow
  slowProvider.generateEmbedding = async function(text) {
    await new Promise(r => setTimeout(r, 500));
    return new Float32Array(768);
  };
  const { emb: slowEmb, restore: restore2 } = loadEmbeddingsWithMock(slowProvider);

  try {
    let timedOut = false;
    try {
      await slowEmb.generateEmbeddingWithTimeout('slow text', 50); // 50ms timeout
    } catch (e) {
      timedOut = e.message.includes('timed out');
    }
    assert(timedOut,
      'EB-120: generateEmbeddingWithTimeout rejects on timeout',
      'Error: Embedding generation timed out');
  } finally {
    restore2();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP H: PRE-INIT METADATA FALLBACKS
// ═══════════════════════════════════════════════════════════════

async function testPreInitMetadata() {
  log('\n🔬 GROUP H: Pre-init metadata fallbacks');

  const mockProvider = createMockProvider();
  const { emb, restore } = loadEmbeddingsWithMock(mockProvider);

  try {
    // Before init, getProviderMetadata should fall back to factory.getProviderInfo
    const meta = emb.getProviderMetadata();
    assert(meta !== null && typeof meta === 'object',
      'EB-121: getProviderMetadata returns object before init');
    assertEqual(meta.provider, 'mock-test',
      'EB-122: getProviderMetadata.provider from mocked getProviderInfo');

    // GetEmbeddingProfile is null before init (sync)
    assertEqual(emb.getEmbeddingProfile(), null,
      'EB-123: getEmbeddingProfile null before init (sync)');

    // GetEmbeddingProfileAsync triggers init
    const asyncProfile = await emb.getEmbeddingProfileAsync();
    assert(asyncProfile !== null,
      'EB-124: getEmbeddingProfileAsync triggers init and returns profile');
    assert(emb.isProviderInitialized(),
      'EB-125: Provider initialized after getEmbeddingProfileAsync');
  } finally {
    restore();
  }
}

// ═══════════════════════════════════════════════════════════════
// GROUP I: RE-EXPORT SHIM VERIFICATION
// ═══════════════════════════════════════════════════════════════

async function testReExportShim() {
  log('\n🔬 GROUP I: Re-export shim (lib/embeddings → shared/embeddings)');

  try {
    const libPath = path.join(ROOT, 'scripts', 'dist', 'lib', 'embeddings.js');
    const sharedPath = path.join(ROOT, 'shared', 'dist', 'embeddings.js');

    // Both should resolve to files
    const libMod = require(libPath);
    const sharedMod = require(sharedPath);

    // The shim should re-export everything from shared
    const sharedKeys = Object.keys(sharedMod).sort();
    const libKeys = Object.keys(libMod).sort();

    // All shared exports should be available through lib
    let allPresent = true;
    const missing = [];
    for (const key of sharedKeys) {
      if (!libKeys.includes(key)) {
        allPresent = false;
        missing.push(key);
      }
    }
    assert(allPresent,
      'EB-126: lib/embeddings re-exports all shared/embeddings exports',
      missing.length === 0 ? `All ${sharedKeys.length} exports present` : `Missing: ${missing.join(', ')}`);

    // Verify the exports are the same references (same functions, not copies)
    assertEqual(libMod.generateEmbedding, sharedMod.generateEmbedding,
      'EB-127: generateEmbedding is same reference through shim');
    assertEqual(libMod.EMBEDDING_DIM, sharedMod.EMBEDDING_DIM,
      'EB-128: EMBEDDING_DIM is same value through shim');
    assertEqual(libMod.TASK_PREFIX, sharedMod.TASK_PREFIX,
      'EB-129: TASK_PREFIX is same reference through shim');
  } catch (error) {
    fail('EB-126-129: Re-export shim verification', error.message);
  }
}

/* ─────────────────────────────────────────────────────────────
   6. MAIN
────────────────────────────────────────────────────────────────
*/

async function main() {
  console.log('═══════════════════════════════════════════════════════════════');
  console.log('  EMBEDDINGS BEHAVIORAL TESTS');
  console.log('  Source: shared/embeddings.ts (via lib/embeddings.ts shim)');
  console.log('═══════════════════════════════════════════════════════════════');

  try {
    await testPureFunctionsAndConstants();
    await testInputValidation();
    await testCoreEmbeddingGeneration();
    await testCachingBehavior();
    await testBatchProcessing();
    await testLazyLoadingLifecycle();
    await testErrorHandling();
    await testPreInitMetadata();
    await testReExportShim();
  } catch (error) {
    console.error('\n💥 UNEXPECTED ERROR:', error.message);
    console.error(error.stack);
    results.failed++;
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log(`  RESULTS: ${results.passed} passed, ${results.failed} failed, ${results.skipped} skipped`);
  console.log(`  TOTAL: ${results.passed + results.failed + results.skipped} tests`);
  console.log('═══════════════════════════════════════════════════════════════');

  process.exit(results.failed > 0 ? 1 : 0);
}

main();
