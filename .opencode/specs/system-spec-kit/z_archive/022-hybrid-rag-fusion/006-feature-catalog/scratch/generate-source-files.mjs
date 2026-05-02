#!/usr/bin/env node
// generate-source-files.mjs
// Generates ## Source Files sections for all feature catalog snippets
// and patches both per-feature snippets and the monolithic feature_catalog.md

import fs from 'fs';
import path from 'path';

const PROJ = '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit';
const MCP = path.join(PROJ, 'mcp_server');
const SHARED = path.join(PROJ, 'shared');
const CATALOG = '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/specs/system-spec-kit/022-hybrid-rag-fusion/feature-catalog';

// ===================================================================
// STEP 1: BUILD DEPENDENCY GRAPH
// ===================================================================

function extractImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const imports = [];
  const regex = /from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function resolveToFile(basePath) {
  const candidates = [
    basePath + '.ts',
    path.join(basePath, 'index.ts'),
    basePath,
  ];
  for (const candidate of candidates) {
    try {
      const realPath = fs.realpathSync(candidate);
      if (fs.existsSync(realPath) && fs.statSync(realPath).isFile()) {
        return realPath;
      }
    } catch { /* ignore */ }
  }
  return null;
}

function resolveImport(importPath, fromFile) {
  if (importPath.startsWith('@spec-kit/shared/')) {
    const sharedPath = importPath.replace('@spec-kit/shared/', '');
    return resolveToFile(path.join(SHARED, sharedPath));
  }
  if (importPath.startsWith('.')) {
    const dir = path.dirname(fromFile);
    return resolveToFile(path.join(dir, importPath));
  }
  return null; // external package
}

function collectTsFiles(dir, excludeTests = true) {
  const files = [];
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const fullPath = path.join(d, entry.name);
      if (entry.isSymbolicLink()) {
        try {
          const stat = fs.statSync(fullPath);
          if (stat.isDirectory()) {
            // Skip symlinked directories to avoid double-counting
            continue;
          }
        } catch { continue; }
      }
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', '.git', 'database'].includes(entry.name)) continue;
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith('.ts')) {
        if (excludeTests && (entry.name.endsWith('.vitest.ts') || entry.name === 'vitest.config.ts')) continue;
        if (excludeTests && entry.name.endsWith('.test.ts')) continue;
        files.push(fs.realpathSync(fullPath));
      }
    }
  }
  walk(dir);
  return files;
}

function collectTestFiles(dir) {
  const files = [];
  function walk(d) {
    for (const entry of fs.readdirSync(d, { withFileTypes: true })) {
      const fullPath = path.join(d, entry.name);
      if (entry.isDirectory()) {
        if (['node_modules', 'dist', '.git'].includes(entry.name)) continue;
        walk(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.vitest.ts') || entry.name.endsWith('.test.ts'))) {
        files.push(fs.realpathSync(fullPath));
      }
    }
  }
  walk(dir);
  return files;
}

function buildGraph() {
  const sourceFiles = [...collectTsFiles(MCP), ...collectTsFiles(SHARED)];
  const graph = new Map();

  for (const file of sourceFiles) {
    const imports = extractImports(file);
    const deps = new Set();
    for (const imp of imports) {
      const resolved = resolveImport(imp, file);
      if (resolved && sourceFiles.includes(resolved)) {
        deps.add(resolved);
      }
    }
    graph.set(file, deps);
  }

  return { graph, sourceFiles };
}

function transitiveClosureOf(entryPoints, graph) {
  const visited = new Set();
  const queue = [];
  for (const ep of entryPoints) {
    const resolved = resolveToFile(path.join(PROJ, ep.replace(/\.ts$/, '')));
    if (resolved) queue.push(resolved);
  }
  while (queue.length > 0) {
    const current = queue.shift();
    if (visited.has(current)) continue;
    visited.add(current);
    const deps = graph.get(current);
    if (deps) {
      for (const dep of deps) {
        if (!visited.has(dep)) queue.push(dep);
      }
    }
  }
  return visited;
}

// ===================================================================
// STEP 2: CLASSIFY FILES BY LAYER
// ===================================================================

function toRelativePath(absPath) {
  if (absPath.startsWith(PROJ + '/')) {
    return absPath.substring(PROJ.length + 1);
  }
  return absPath;
}

function classifyLayer(relPath) {
  if (relPath.startsWith('shared/')) return 'Shared';
  if (relPath.startsWith('mcp_server/handlers/')) return 'Handler';
  if (relPath.startsWith('mcp_server/hooks/')) return 'Hook';
  if (relPath.startsWith('mcp_server/formatters/')) return 'Formatter';
  if (relPath.startsWith('mcp_server/schemas/')) return 'Schema';
  if (relPath.startsWith('mcp_server/api/')) return 'API';
  if (relPath.startsWith('mcp_server/core/')) return 'Core';
  if (relPath.startsWith('mcp_server/utils/')) return 'Util';
  if (relPath.startsWith('mcp_server/tools/')) return 'API';
  if (relPath.startsWith('mcp_server/configs/')) return 'Core';
  if (relPath.startsWith('mcp_server/lib/')) return 'Lib';
  if (relPath.startsWith('mcp_server/scripts/')) return 'Util';
  if (relPath.match(/mcp_server\/(cli|context-server|startup-checks|tool-schemas)\.ts/)) return 'Core';
  return 'Lib';
}

function deriveRole(relPath) {
  const base = path.basename(relPath, '.ts');
  const dir = path.dirname(relPath);

  // Lookup table for common files
  const roleMap = {
    'memory-context': 'Context orchestration entry point',
    'memory-search': 'Search handler entry point',
    'memory-triggers': 'Trigger matching handler',
    'memory-save': 'Save handler entry point',
    'memory-crud': 'CRUD dispatch handler',
    'memory-crud-update': 'Update handler',
    'memory-crud-delete': 'Delete handler',
    'memory-crud-list': 'List handler',
    'memory-crud-stats': 'Statistics handler',
    'memory-crud-health': 'Health diagnostics handler',
    'memory-crud-utils': 'CRUD utility helpers',
    'memory-crud-types': 'CRUD type definitions',
    'memory-bulk-delete': 'Bulk delete handler',
    'memory-index': 'Index scan handler',
    'memory-index-discovery': 'Spec doc discovery handler',
    'memory-index-alias': 'Index alias handler',
    'memory-ingest': 'Ingestion handler',
    'checkpoints': dir.includes('handlers') ? 'Checkpoint handler' : 'Checkpoint storage',
    'causal-graph': 'Causal graph handler',
    'causal-links-processor': 'Causal link mutation handler',
    'eval-reporting': 'Eval reporting handler',
    'session-learning': 'Session learning handler',
    'quality-loop': 'Quality loop handler',
    'pe-gating': 'Prediction error gating',
    'chunking-orchestrator': 'Chunking orchestration',
    'mutation-hooks': 'Post-mutation hook dispatch',
    'handler-utils': 'Handler utility helpers',
    'types': 'Type definitions',
    'index': 'Module barrel export',
    // Save sub-handlers
    'create-record': 'Record creation logic',
    'db-helpers': dir.includes('save') ? 'Save DB helpers' : 'Database helpers',
    'dedup': 'Deduplication logic',
    'embedding-pipeline': 'Embedding generation pipeline',
    'pe-orchestration': 'PE orchestration flow',
    'post-insert': 'Post-insert processing',
    'reconsolidation-bridge': 'Reconsolidation bridge',
    'response-builder': 'Response construction',
    // Hooks
    'memory-surface': 'Auto-surface UX hook',
    'mutation-feedback': 'Mutation feedback hook',
    'response-hints': 'Response hint hook',
    // Formatters
    'search-results': 'Search result formatting',
    'token-metrics': 'Token metrics display',
    // Core
    'config': dir.includes('core') ? 'Server configuration' : (dir.includes('shared') ? 'Shared configuration' : 'Configuration'),
    'db-state': 'Database state management',
    'context-server': 'MCP server entry point',
    'cli': 'CLI entry point',
    'startup-checks': 'Startup validation',
    'tool-schemas': 'Tool schema definitions',
    'tool-input-schemas': 'Zod input schemas',
    // Lib: cognitive
    'archival-manager': 'Archival tier management',
    'attention-decay': 'FSRS attention decay',
    'co-activation': 'Co-activation spreading',
    'fsrs-scheduler': 'FSRS scheduling algorithm',
    'prediction-error-gate': 'Prediction error computation',
    'pressure-monitor': 'Context pressure detection',
    'rollout-policy': 'Feature rollout gating',
    'temporal-contiguity': 'Temporal contiguity scoring',
    'tier-classifier': 'Memory tier classification',
    'working-memory': 'Working memory integration',
    // Lib: search
    'hybrid-search': 'Multi-channel search orchestration',
    'intent-classifier': 'Intent detection',
    'bm25-index': 'BM25 index management',
    'sqlite-fts': 'SQLite FTS5 interface',
    'search-flags': 'Feature flag registry',
    'search-types': 'Search type definitions',
    'query-classifier': 'Query complexity classification',
    'query-router': 'Channel routing',
    'query-expander': 'Query term expansion',
    'rsf-fusion': 'Relative score fusion',
    'rrf-fusion': 'Reciprocal rank fusion',
    'channel-representation': 'Channel min-representation',
    'channel-enforcement': 'Channel enforcement',
    'confidence-truncation': 'Confidence-based truncation',
    'dynamic-token-budget': 'Token budget computation',
    'embedding-expansion': 'Embedding query expansion',
    'encoding-intent': 'Encoding intent classification',
    'entity-linker': 'Cross-document entity linking',
    'evidence-gap-detector': 'Evidence gap detection',
    'feedback-denylist': 'Feedback denylist management',
    'folder-discovery': 'Spec folder auto-discovery',
    'folder-relevance': 'Folder relevance scoring',
    'graph-search-fn': 'Graph degree scoring',
    'graph-flags': 'Graph feature flags',
    'local-reranker': 'Local GGUF reranker',
    'cross-encoder': 'Cross-encoder reranking',
    'reranker': 'Reranker dispatch',
    'auto-promotion': 'Auto-promotion on validation',
    'learned-feedback': 'Learned relevance feedback',
    'memory-summaries': 'Memory summary generation',
    'tfidf-summarizer': 'TF-IDF extractive summarizer',
    'retrieval-directives': 'Constitutional retrieval injection',
    'spec-folder-hierarchy': 'Spec folder hierarchy traversal',
    'anchor-metadata': 'Anchor metadata extraction',
    'artifact-routing': 'Artifact type routing',
    'context-budget': 'Context budget management',
    'session-boost': 'Session attention boost',
    'causal-boost': 'Causal neighbor boosting',
    'validation-metadata': 'Validation signal metadata',
    'fsrs': 'FSRS algorithm implementation',
    'vector-index': 'Vector index facade',
    'vector-index-impl': 'Vector index implementation',
    'vector-index-queries': 'Vector index query methods',
    'vector-index-store': 'Vector index storage',
    'vector-index-schema': 'Vector index schema',
    'vector-index-mutations': 'Vector index mutations',
    'vector-index-aliases': 'Vector index aliases',
    'vector-index-types': 'Vector index type definitions',
    // Lib: pipeline
    'orchestrator': 'Pipeline orchestration',
    'stage1-candidate-gen': 'Stage 1 candidate generation',
    'stage2-fusion': 'Stage 2 fusion',
    'stage3-rerank': 'Stage 3 reranking',
    'stage4-filter': 'Stage 4 filtering',
    // Lib: scoring
    'composite-scoring': dir.includes('cache') ? 'Scoring cache helper' : 'Composite score computation',
    'confidence-tracker': 'Confidence tracking',
    'folder-scoring': dir.includes('shared') ? 'Shared folder scoring' : 'Folder scoring implementation',
    'importance-tiers': 'Importance tier definitions',
    'interference-scoring': 'Interference penalty scoring',
    'mpab-aggregation': 'MPAB chunk aggregation',
    'negative-feedback': 'Negative feedback demotion',
    // Lib: graph
    'graph-signals': 'Graph momentum and depth signals',
    'community-detection': 'Community detection algorithm',
    // Lib: eval
    'ablation-framework': 'Ablation study framework',
    'bm25-baseline': 'BM25-only baseline evaluation',
    'channel-attribution': 'Channel attribution analysis',
    'edge-density': 'Edge density measurement',
    'eval-ceiling': 'Full context ceiling evaluation',
    'eval-db': 'Evaluation database',
    'eval-logger': 'Evaluation event logger',
    'eval-metrics': 'Core metric computation',
    'eval-quality-proxy': 'Quality proxy formula',
    'ground-truth-data': 'Ground truth data',
    'ground-truth-feedback': 'Ground truth feedback',
    'ground-truth-generator': 'Synthetic ground truth generator',
    'k-value-analysis': 'RRF k-value sensitivity analysis',
    'reporting-dashboard': 'Reporting dashboard',
    'shadow-scoring': 'Shadow scoring system',
    // Lib: storage
    'access-tracker': 'Access pattern tracking',
    'causal-edges': 'Causal edge storage',
    'consolidation': 'Lightweight consolidation',
    'history': 'Mutation history tracking',
    'incremental-index': 'Incremental indexing',
    'index-refresh': 'Index refresh scheduling',
    'learned-triggers-schema': 'Learned triggers schema',
    'mutation-ledger': 'Mutation ledger',
    'reconsolidation': 'Memory reconsolidation',
    'schema-downgrade': 'Schema downgrade handling',
    'transaction-manager': 'Transaction management',
    // Lib: parsing
    'content-normalizer': 'Content normalization',
    'entity-scope': 'Entity scope parsing',
    'memory-parser': 'Memory file parser',
    'trigger-matcher': 'Trigger phrase matching',
    // Lib: extraction
    'entity-denylist': 'Entity denylist',
    'entity-extractor': 'Entity extraction',
    'extraction-adapter': 'Extraction adapter',
    'redaction-gate': 'Redaction gate',
    // Lib: chunking
    'anchor-chunker': 'Anchor-aware chunking',
    'chunk-thinning': 'Chunk thinning',
    // Lib: providers
    'embeddings': dir.includes('providers') ? 'Embedding provider dispatch' : 'Embedding utilities',
    'retry-manager': 'Provider retry management',
    // Lib: session
    'session-manager': 'Session lifecycle management',
    // Lib: validation
    'preflight': 'Pre-flight validation',
    'save-quality-gate': 'Pre-storage quality gate',
    // Lib: telemetry
    'consumption-logger': 'Agent consumption logging',
    'retrieval-telemetry': 'Retrieval telemetry',
    'scoring-observability': 'Scoring observability',
    'trace-schema': 'Trace schema definitions',
    // Lib: other
    'layer-definitions': 'Architecture layer enforcement',
    'pagerank': 'PageRank computation',
    'file-watcher': 'Filesystem watcher',
    'job-queue': 'Async job queue',
    'corrections': 'Learning corrections',
    'canonical-path': 'Canonical path resolution',
    'format-helpers': 'Format utility helpers',
    'logger': 'Logger utility',
    'path-security': dir.includes('shared') ? 'Shared path security' : 'Path security validation',
    'retry': dir.includes('shared') ? 'Shared retry utility' : 'Retry utility',
    // Lib: response
    'envelope': 'Response envelope formatting',
    // Lib: interfaces
    'vector-store': 'Vector store interface',
    // Lib: config
    'memory-types': 'Memory type definitions',
    'type-inference': 'Memory type inference',
    // Lib: errors
    'core': dir.includes('errors') ? 'Error type definitions' : 'Core module',
    'recovery-hints': 'Error recovery hints',
    // Shared
    'chunking': 'Content chunking',
    'normalization': 'Text normalization',
    'trigger-extractor': 'Trigger phrase extraction',
    'paths': 'Shared path utilities',
    'rrf-fusion': 'RRF fusion algorithm',
    'adaptive-fusion': 'Adaptive fusion algorithm',
    'mmr-reranker': 'MMR reranking algorithm',
    'structure-aware-chunker': 'Structure-aware chunking',
    'quality-extractors': 'Quality signal extraction',
    'token-estimate': 'Token estimation utility',
    'jsonc-strip': 'JSONC comment stripping',
    'profile': 'Embedding profile configuration',
    'factory': 'Embedding provider factory',
    'hf-local': 'HuggingFace local provider',
    'openai': 'OpenAI embedding provider',
    'voyage': 'Voyage embedding provider',
    'retrieval-trace': 'Retrieval trace contract',
    // Utils
    'validators': 'Input validators',
    'batch-processor': 'Batch processing utility',
    'json-helpers': 'JSON utility helpers',
    // Tools
    'causal-tools': 'Causal tool definitions',
    'checkpoint-tools': 'Checkpoint tool definitions',
    'context-tools': 'Context tool definitions',
    'lifecycle-tools': 'Lifecycle tool definitions',
    'memory-tools': 'Memory tool definitions',
    // API
    'eval': 'Eval API facade',
    'indexing': 'Indexing API facade',
    'providers': 'Provider API facade',
    'search': 'Search API facade',
    'storage': 'Storage API facade',
    // Configs
    'cognitive': 'Cognitive configuration',
  };

  const role = roleMap[base];
  if (role) return role;

  // Fallback: humanize the file name
  return base.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).substring(0, 40);
}

function deriveTestFocus(relPath) {
  const base = path.basename(relPath, '.vitest.ts').replace('.test', '');

  const focusMap = {
    'handler-memory-context': 'Context handler input/output',
    'memory-context': 'Context integration tests',
    'memory-context-eval-channels': 'Context eval channel coverage',
    'handler-memory-search': 'Search handler validation',
    'memory-search-integration': 'Search integration tests',
    'memory-search-eval-channels': 'Search eval channel coverage',
    'memory-search-quality-filter': 'Search quality filtering',
    'handler-memory-triggers': 'Trigger handler validation',
    'handler-memory-save': 'Save handler validation',
    'memory-save-integration': 'Save integration tests',
    'memory-save-extended': 'Save extended scenarios',
    'memory-save-ux-regressions': 'Save UX regression tests',
    'handler-memory-crud': 'CRUD handler validation',
    'memory-crud-extended': 'CRUD extended scenarios',
    'handler-memory-index': 'Index handler validation',
    'handler-memory-index-cooldown': 'Index cooldown validation',
    'handler-memory-ingest': 'Ingest handler validation',
    'handler-checkpoints': 'Checkpoint handler validation',
    'handler-causal-graph': 'Causal graph handler validation',
    'handler-session-learning': 'Session learning validation',
    'handler-helpers': 'Handler helper validation',
    'hybrid-search': 'Hybrid search orchestration',
    'hybrid-search-flags': 'Hybrid search flag behavior',
    'hybrid-search-context-headers': 'Context header injection',
    'intent-classifier': 'Intent classification accuracy',
    'bm25-index': 'BM25 index operations',
    'bm25-security': 'BM25 security validation',
    'sqlite-fts': 'SQLite FTS5 operations',
    'search-flags': 'Feature flag behavior',
    'search-extended': 'Search extended scenarios',
    'search-fallback-tiered': 'Tiered fallback chain',
    'search-results-format': 'Result formatting',
    'search-limits-scoring': 'Score limits validation',
    'search-archival': 'Archival search paths',
    'pipeline-v2': 'V2 pipeline orchestration',
    'pipeline-integration': 'Pipeline integration tests',
    'integration-138-pipeline': 'Pipeline feature-138 tests',
    'integration-search-pipeline': 'Search pipeline integration',
    'stage2-fusion': 'Stage 2 fusion validation',
    'query-classifier': 'Query classification accuracy',
    'query-router': 'Query routing logic',
    'query-router-channel-interaction': 'Channel interaction tests',
    'query-expander': 'Query expansion tests',
    'intent-routing': 'Intent routing validation',
    'intent-weighting': 'Intent weighting validation',
    'rsf-fusion': 'RSF fusion scoring',
    'rsf-fusion-edge-cases': 'RSF fusion edge cases',
    'rsf-multi': 'RSF multi-query fusion',
    'rsf-vs-rrf-kendall': 'RSF vs RRF correlation',
    'rrf-fusion': 'RRF fusion validation',
    'unit-rrf-fusion': 'RRF unit tests',
    'rrf-degree-channel': 'Degree channel integration',
    'channel-representation': 'Channel representation tests',
    'channel-enforcement': 'Channel enforcement tests',
    'channel': 'Channel general tests',
    'confidence-truncation': 'Truncation behavior',
    'dynamic-token-budget': 'Token budget computation',
    'embedding-expansion': 'Embedding expansion tests',
    'encoding-intent': 'Encoding intent tests',
    'entity-linker': 'Entity linking tests',
    'entity-extractor': 'Entity extraction tests',
    'entity-scope': 'Entity scope parsing',
    'evidence-gap-detector': 'Evidence gap detection',
    'feedback-denylist': 'Feedback denylist tests',
    'folder-discovery': 'Folder discovery tests',
    'folder-discovery-integration': 'Folder discovery integration',
    'folder-relevance': 'Folder relevance scoring',
    'folder-scoring': 'Folder scoring tests',
    'unit-folder-scoring-types': 'Folder scoring type tests',
    'graph-search-fn': 'Graph search function tests',
    'graph-flags': 'Graph flag behavior',
    'graph-signals': 'Graph signal computation',
    'graph-scoring-integration': 'Graph scoring integration',
    'graph-regression-flag-off': 'Graph regression tests',
    'local-reranker': 'Local reranker tests',
    'cross-encoder': 'Cross-encoder tests',
    'cross-encoder-extended': 'Cross-encoder extended',
    'reranker': 'Reranker dispatch tests',
    'auto-promotion': 'Auto-promotion logic',
    'promotion-positive-validation-semantics': 'Promotion semantics',
    'learned-feedback': 'Learned feedback tests',
    'memory-summaries': 'Summary generation tests',
    'retrieval-directives': 'Retrieval directive tests',
    'spec-folder-hierarchy': 'Folder hierarchy tests',
    'spec-folder-prefilter': 'Folder prefilter tests',
    'anchor-metadata': 'Anchor metadata tests',
    'anchor-id-simplification': 'Anchor ID simplification',
    'anchor-prefix-matching': 'Anchor prefix matching',
    'artifact-routing': 'Artifact routing tests',
    'session-boost': 'Session boost tests',
    'causal-boost': 'Causal boost tests',
    'validation-metadata': 'Validation metadata tests',
    'vector-index-impl': 'Vector index implementation',
    'composite-scoring': 'Composite scoring tests',
    'unit-composite-scoring-types': 'Scoring type tests',
    'scoring': 'General scoring tests',
    'scoring-gaps': 'Scoring gap analysis',
    'score-normalization': 'Score normalization tests',
    'scoring-observability': 'Scoring observability tests',
    'five-factor-scoring': 'Five-factor scoring tests',
    'search-limits-scoring': 'Score limits tests',
    'confidence-tracker': 'Confidence tracking tests',
    'interference': 'Interference scoring tests',
    'importance-tiers': 'Importance tier tests',
    'mpab-aggregation': 'MPAB aggregation tests',
    'mpab-quality-gate-integration': 'MPAB quality gate tests',
    'negative-feedback': 'Negative feedback tests (stub)',
    'co-activation': 'Co-activation spreading tests',
    'community-detection': 'Community detection tests',
    'degree-computation': 'Degree computation tests',
    'edge-density': 'Edge density measurement',
    'ablation-framework': 'Ablation framework tests',
    'bm25-baseline': 'BM25 baseline evaluation',
    'eval-db': 'Eval database operations',
    'eval-logger': 'Eval logger tests',
    'eval-metrics': 'Eval metrics computation',
    'eval-the-eval': 'Meta-evaluation tests',
    'ceiling-quality': 'Ceiling quality tests',
    'ground-truth': 'Ground truth tests',
    'ground-truth-feedback': 'Ground truth feedback',
    'reporting-dashboard': 'Dashboard reporting tests',
    'shadow-scoring': 'Shadow scoring tests',
    'shadow-comparison': 'Shadow comparison tests',
    'k-value-analysis': 'K-value analysis (stub)',
    'cross-feature-integration-eval': 'Cross-feature eval',
    'feature-eval-graph-signals': 'Graph signal evaluation',
    'feature-eval-query-intelligence': 'Query intelligence eval',
    'feature-eval-scoring-calibration': 'Scoring calibration eval',
    'consumption-logger': 'Consumption logger tests',
    'retrieval-telemetry': 'Retrieval telemetry tests',
    'causal-edges': 'Causal edge storage tests',
    'causal-edges-unit': 'Causal edge unit tests',
    'causal-fixes': 'Causal fix regression tests',
    'integration-causal-graph': 'Causal graph integration',
    'checkpoints-extended': 'Checkpoint extended tests',
    'checkpoints-storage': 'Checkpoint storage tests',
    'checkpoint-limit': 'Checkpoint limit tests',
    'checkpoint-working-memory': 'Checkpoint working memory',
    'integration-checkpoint-lifecycle': 'Checkpoint lifecycle',
    'transaction-manager': 'Transaction manager tests',
    'transaction-manager-extended': 'Transaction extended tests',
    'unit-transaction-metrics-types': 'Transaction metric types',
    'mutation-ledger': 'Mutation ledger tests',
    'incremental-index': 'Incremental index tests',
    'incremental-index-v2': 'Incremental index v2 tests',
    'index-refresh': 'Index refresh tests',
    'reconsolidation': 'Reconsolidation tests',
    'n3lite-consolidation': 'N3-lite consolidation tests',
    'session-manager': 'Session manager tests',
    'session-manager-extended': 'Session manager extended',
    'session-lifecycle': 'Session lifecycle tests',
    'session-cleanup': 'Session cleanup tests',
    'integration-session-dedup': 'Session dedup integration',
    'continue-session': 'Session continuation tests',
    'memory-parser': 'Memory parser tests',
    'memory-parser-extended': 'Parser extended tests',
    'content-normalizer': 'Content normalization tests',
    'trigger-matcher': 'Trigger matcher tests',
    'trigger-extractor': 'Trigger extractor tests',
    'trigger-config-extended': 'Trigger config extended',
    'trigger-setAttentionScore': 'Trigger attention scoring',
    'save-quality-gate': 'Quality gate tests',
    'preflight': 'Pre-flight validation tests',
    'quality-loop': 'Quality loop tests',
    'prediction-error-gate': 'PE gate tests',
    'chunk-thinning': 'Chunk thinning tests',
    'structure-aware-chunker': 'Structure-aware chunking',
    'content-hash-dedup': 'Content hash dedup tests',
    'extraction-adapter': 'Extraction adapter tests',
    'redaction-gate': 'Redaction gate tests',
    'attention-decay': 'Attention decay tests',
    'working-memory': 'Working memory tests',
    'working-memory-event-decay': 'Working memory decay',
    'fsrs-scheduler': 'FSRS scheduler tests',
    'archival-manager': 'Archival manager tests',
    'tier-classifier': 'Tier classifier tests',
    'unit-tier-classifier-types': 'Tier classifier types',
    'pressure-monitor': 'Pressure monitor tests',
    'rollout-policy': 'Rollout policy tests',
    'temporal-contiguity': 'Temporal contiguity tests',
    'cognitive-gaps': 'Cognitive gap analysis',
    'embedding-cache': 'Embedding cache tests',
    'tool-cache': 'Tool cache tests',
    'file-watcher': 'File watcher tests',
    'job-queue': 'Job queue tests',
    'pagerank': 'PageRank computation tests',
    'corrections': 'Learning corrections tests',
    'learning-stats-filters': 'Learning stats filter tests',
    'protect-learning': 'Learning protection tests',
    'integration-learning-history': 'Learning history integration',
    'layer-definitions': 'Layer definition tests',
    'context-server': 'Context server tests',
    'tool-input-schema': 'Tool input schema tests',
    'envelope': 'Response envelope tests',
    'mcp-response-envelope': 'MCP envelope tests',
    'mcp-error-format': 'MCP error format tests',
    'mcp-input-validation': 'MCP input validation',
    'mcp-tool-dispatch': 'MCP tool dispatch tests',
    'lazy-loading': 'Lazy loading tests',
    'errors-comprehensive': 'Error handling tests',
    'recovery-hints': 'Recovery hint tests',
    'safety': 'Safety validation tests',
    'unit-path-security': 'Path security unit tests',
    'unit-normalization': 'Normalization unit tests',
    'unit-normalization-roundtrip': 'Normalization roundtrip',
    'unit-fsrs-formula': 'FSRS formula unit tests',
    'schema-migration': 'Schema migration tests',
    'regression-suite': 'Regression test suite',
    'regression-010-index-large-files': 'Large file indexing regression',
    'review-fixes': 'Review fix regression tests',
    'modularization': 'Modularization tests',
    'interfaces': 'Interface validation tests',
    'api-key-validation': 'API key validation tests',
    'api-validation': 'API validation tests',
    'embeddings': 'Embedding provider tests',
    'retry-manager': 'Retry manager tests',
    'retry': 'Retry utility tests',
    'memory-types': 'Memory type tests',
    'history': 'History tracking tests',
    'access-tracker': 'Access tracker tests',
    'access-tracker-extended': 'Access tracker extended',
    'dual-scope-hooks': 'Dual-scope hook tests',
    'hooks-ux-feedback': 'UX feedback hook tests',
    'batch-processor': 'Batch processor tests',
    'progressive-validation': 'Progressive validation tests',
    'integration-save-pipeline': 'Save pipeline integration',
    'integration-trigger-pipeline': 'Trigger pipeline integration',
    'integration-error-recovery': 'Error recovery integration',
    'phase2-integration': 'Phase 2 integration tests',
    'deferred-features-integration': 'Deferred features tests',
    'cold-start': 'Cold start behavior tests',
    'decay': 'Decay behavior tests',
    'decay-delete-race': 'Decay-delete race condition',
    'flag-ceiling': 'Flag ceiling tests',
    'signal-vocab': 'Signal vocabulary tests',
    'full-spec-doc-indexing': 'Full spec doc indexing',
    'stdio-logging-safety': 'Stdio logging safety',
    'crash-recovery': 'Crash recovery tests',
    'config-cognitive': 'Cognitive config tests',
    'db-state-graph-reinit': 'DB state graph reinit',
    'adaptive-fallback': 'Adaptive fallback tests',
    'adaptive-fusion': 'Adaptive fusion tests',
    'mmr-reranker': 'MMR reranker tests',
    'retrieval-trace': 'Retrieval trace tests',
    'tiered-injection-turnNumber': 'Tiered injection tests',
    'token-budget': 'Token budget tests',
    'token-budget-enforcement': 'Token budget enforcement',
    'quality-extractors': 'Quality extractor tests',
  };

  const focus = focusMap[base];
  if (focus) return focus;
  return base.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()).substring(0, 40);
}

// ===================================================================
// STEP 3: FEATURE-TO-ENTRY-POINTS MAPPING
// ===================================================================

// Format: { 'category/filename.md': ['mcp_server/path.ts', ...] }
// Entry points are the PRIMARY files; the dep graph will expand transitively.
const FEATURE_MAP = {
  // 01-retrieval
  '01-retrieval/01-unified-context-retrieval-memorycontext.md': [
    'mcp_server/handlers/memory-context.ts',
  ],
  '01-retrieval/02-semantic-and-lexical-search-memorysearch.md': [
    'mcp_server/handlers/memory-search.ts',
  ],
  '01-retrieval/03-trigger-phrase-matching-memorymatchtriggers.md': [
    'mcp_server/handlers/memory-triggers.ts',
  ],
  '01-retrieval/04-hybrid-search-pipeline.md': [
    'mcp_server/lib/search/hybrid-search.ts',
  ],
  '01-retrieval/05-4-stage-pipeline-architecture.md': [
    'mcp_server/lib/search/pipeline/orchestrator.ts',
    'mcp_server/lib/search/pipeline/stage1-candidate-gen.ts',
    'mcp_server/lib/search/pipeline/stage2-fusion.ts',
    'mcp_server/lib/search/pipeline/stage3-rerank.ts',
    'mcp_server/lib/search/pipeline/stage4-filter.ts',
  ],
  '01-retrieval/06-bm25-trigger-phrase-re-index-gate.md': [
    'mcp_server/lib/search/bm25-index.ts',
    'mcp_server/lib/search/sqlite-fts.ts',
  ],
  '01-retrieval/07-ast-level-section-retrieval-tool.md': '__DEFERRED__',

  // 02-mutation
  '02-mutation/01-memory-indexing-memorysave.md': [
    'mcp_server/handlers/memory-save.ts',
    'mcp_server/handlers/save/index.ts',
  ],
  '02-mutation/02-memory-metadata-update-memoryupdate.md': [
    'mcp_server/handlers/memory-crud-update.ts',
  ],
  '02-mutation/03-single-and-folder-delete-memorydelete.md': [
    'mcp_server/handlers/memory-crud-delete.ts',
    'mcp_server/handlers/memory-crud.ts',
  ],
  '02-mutation/04-tier-based-bulk-deletion-memorybulkdelete.md': [
    'mcp_server/handlers/memory-bulk-delete.ts',
  ],
  '02-mutation/05-validation-feedback-memoryvalidate.md': [
    'mcp_server/handlers/memory-crud.ts',
    'mcp_server/lib/validation/save-quality-gate.ts',
  ],
  '02-mutation/06-transaction-wrappers-on-mutation-handlers.md': [
    'mcp_server/lib/storage/transaction-manager.ts',
    'mcp_server/handlers/mutation-hooks.ts',
  ],
  '02-mutation/07-namespace-management-crud-tools.md': [
    'mcp_server/handlers/memory-crud.ts',
    'mcp_server/handlers/memory-crud-utils.ts',
    'mcp_server/tools/memory-tools.ts',
  ],

  // 03-discovery
  '03-discovery/01-memory-browser-memorylist.md': [
    'mcp_server/handlers/memory-crud-list.ts',
    'mcp_server/handlers/memory-crud.ts',
  ],
  '03-discovery/02-system-statistics-memorystats.md': [
    'mcp_server/handlers/memory-crud-stats.ts',
    'mcp_server/handlers/memory-crud.ts',
  ],
  '03-discovery/03-health-diagnostics-memoryhealth.md': [
    'mcp_server/handlers/memory-crud-health.ts',
    'mcp_server/handlers/memory-crud.ts',
  ],

  // 04-maintenance
  '04-maintenance/01-workspace-scanning-and-indexing-memoryindexscan.md': [
    'mcp_server/handlers/memory-index.ts',
    'mcp_server/handlers/memory-index-discovery.ts',
    'mcp_server/handlers/memory-index-alias.ts',
    'mcp_server/lib/storage/incremental-index.ts',
  ],

  // 05-lifecycle
  '05-lifecycle/01-checkpoint-creation-checkpointcreate.md': [
    'mcp_server/handlers/checkpoints.ts',
    'mcp_server/lib/storage/checkpoints.ts',
  ],
  '05-lifecycle/02-checkpoint-listing-checkpointlist.md': [
    'mcp_server/handlers/checkpoints.ts',
    'mcp_server/lib/storage/checkpoints.ts',
  ],
  '05-lifecycle/03-checkpoint-restore-checkpointrestore.md': [
    'mcp_server/handlers/checkpoints.ts',
    'mcp_server/lib/storage/checkpoints.ts',
  ],
  '05-lifecycle/04-checkpoint-deletion-checkpointdelete.md': [
    'mcp_server/handlers/checkpoints.ts',
    'mcp_server/lib/storage/checkpoints.ts',
  ],
  '05-lifecycle/05-async-ingestion-job-lifecycle.md': [
    'mcp_server/handlers/memory-ingest.ts',
    'mcp_server/lib/ops/job-queue.ts',
  ],

  // 06-analysis
  '06-analysis/01-causal-edge-creation-memorycausallink.md': [
    'mcp_server/handlers/causal-links-processor.ts',
    'mcp_server/lib/storage/causal-edges.ts',
  ],
  '06-analysis/02-causal-graph-statistics-memorycausalstats.md': [
    'mcp_server/handlers/causal-graph.ts',
    'mcp_server/lib/storage/causal-edges.ts',
  ],
  '06-analysis/03-causal-edge-deletion-memorycausalunlink.md': [
    'mcp_server/handlers/causal-links-processor.ts',
    'mcp_server/lib/storage/causal-edges.ts',
  ],
  '06-analysis/04-causal-chain-tracing-memorydriftwhy.md': [
    'mcp_server/handlers/causal-graph.ts',
    'mcp_server/lib/storage/causal-edges.ts',
  ],
  '06-analysis/05-epistemic-baseline-capture-taskpreflight.md': [
    'mcp_server/handlers/session-learning.ts',
    'mcp_server/lib/learning/corrections.ts',
  ],
  '06-analysis/06-post-task-learning-measurement-taskpostflight.md': [
    'mcp_server/handlers/session-learning.ts',
    'mcp_server/lib/learning/corrections.ts',
  ],
  '06-analysis/07-learning-history-memorygetlearninghistory.md': [
    'mcp_server/handlers/session-learning.ts',
    'mcp_server/lib/learning/corrections.ts',
  ],

  // 07-evaluation
  '07-evaluation/01-ablation-studies-evalrunablation.md': [
    'mcp_server/handlers/eval-reporting.ts',
    'mcp_server/lib/eval/ablation-framework.ts',
  ],
  '07-evaluation/02-reporting-dashboard-evalreportingdashboard.md': [
    'mcp_server/handlers/eval-reporting.ts',
    'mcp_server/lib/eval/reporting-dashboard.ts',
  ],

  // 08-bug-fixes
  '08-bug-fixes-and-data-integrity/01-graph-channel-id-fix.md': [
    'mcp_server/lib/search/graph-search-fn.ts',
    'mcp_server/lib/search/graph-flags.ts',
  ],
  '08-bug-fixes-and-data-integrity/02-chunk-collapse-deduplication.md': [
    'mcp_server/lib/chunking/chunk-thinning.ts',
    'mcp_server/lib/scoring/mpab-aggregation.ts',
  ],
  '08-bug-fixes-and-data-integrity/03-co-activation-fan-effect-divisor.md': [
    'mcp_server/lib/cognitive/co-activation.ts',
  ],
  '08-bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md': [
    'mcp_server/handlers/save/dedup.ts',
    'mcp_server/lib/storage/incremental-index.ts',
  ],
  '08-bug-fixes-and-data-integrity/05-database-and-schema-safety.md': [
    'mcp_server/lib/storage/transaction-manager.ts',
    'mcp_server/core/db-state.ts',
    'mcp_server/lib/search/vector-index-schema.ts',
  ],
  '08-bug-fixes-and-data-integrity/06-guards-and-edge-cases.md': [
    'mcp_server/lib/errors/core.ts',
    'mcp_server/lib/errors/recovery-hints.ts',
    'mcp_server/lib/errors/index.ts',
  ],
  '08-bug-fixes-and-data-integrity/07-canonical-id-dedup-hardening.md': [
    'mcp_server/lib/utils/canonical-path.ts',
    'mcp_server/handlers/save/dedup.ts',
  ],
  '08-bug-fixes-and-data-integrity/08-mathmax-min-stack-overflow-elimination.md': [
    'mcp_server/lib/scoring/composite-scoring.ts',
    'mcp_server/lib/scoring/mpab-aggregation.ts',
  ],
  '08-bug-fixes-and-data-integrity/09-session-manager-transaction-gap-fixes.md': [
    'mcp_server/lib/session/session-manager.ts',
    'mcp_server/lib/storage/transaction-manager.ts',
  ],

  // 09-evaluation-and-measurement
  '09-evaluation-and-measurement/01-evaluation-database-and-schema.md': [
    'mcp_server/lib/eval/eval-db.ts',
  ],
  '09-evaluation-and-measurement/02-core-metric-computation.md': [
    'mcp_server/lib/eval/eval-metrics.ts',
  ],
  '09-evaluation-and-measurement/03-observer-effect-mitigation.md': [
    'mcp_server/lib/eval/shadow-scoring.ts',
  ],
  '09-evaluation-and-measurement/04-full-context-ceiling-evaluation.md': [
    'mcp_server/lib/eval/eval-ceiling.ts',
  ],
  '09-evaluation-and-measurement/05-quality-proxy-formula.md': [
    'mcp_server/lib/eval/eval-quality-proxy.ts',
  ],
  '09-evaluation-and-measurement/06-synthetic-ground-truth-corpus.md': [
    'mcp_server/lib/eval/ground-truth-generator.ts',
    'mcp_server/lib/eval/ground-truth-data.ts',
  ],
  '09-evaluation-and-measurement/07-bm25-only-baseline.md': [
    'mcp_server/lib/eval/bm25-baseline.ts',
  ],
  '09-evaluation-and-measurement/08-agent-consumption-instrumentation.md': [
    'mcp_server/lib/telemetry/consumption-logger.ts',
  ],
  '09-evaluation-and-measurement/09-scoring-observability.md': [
    'mcp_server/lib/telemetry/scoring-observability.ts',
  ],
  '09-evaluation-and-measurement/10-full-reporting-and-ablation-study-framework.md': [
    'mcp_server/lib/eval/reporting-dashboard.ts',
    'mcp_server/lib/eval/ablation-framework.ts',
  ],
  '09-evaluation-and-measurement/11-shadow-scoring-and-channel-attribution.md': [
    'mcp_server/lib/eval/shadow-scoring.ts',
    'mcp_server/lib/eval/channel-attribution.ts',
  ],
  '09-evaluation-and-measurement/12-test-quality-improvements.md': '__META__',
  '09-evaluation-and-measurement/13-evaluation-and-housekeeping-fixes.md': [
    'mcp_server/lib/eval/eval-db.ts',
    'mcp_server/lib/eval/eval-logger.ts',
    'mcp_server/lib/eval/reporting-dashboard.ts',
  ],
  '09-evaluation-and-measurement/14-cross-ai-validation-fixes.md': '__META__',

  // 10-graph-signal-activation
  '10-graph-signal-activation/01-typed-weighted-degree-channel.md': [
    'mcp_server/lib/search/graph-search-fn.ts',
    'mcp_server/lib/search/graph-flags.ts',
  ],
  '10-graph-signal-activation/02-co-activation-boost-strength-increase.md': [
    'mcp_server/lib/cognitive/co-activation.ts',
  ],
  '10-graph-signal-activation/03-edge-density-measurement.md': [
    'mcp_server/lib/eval/edge-density.ts',
  ],
  '10-graph-signal-activation/04-weight-history-audit-tracking.md': [
    'mcp_server/lib/storage/causal-edges.ts',
  ],
  '10-graph-signal-activation/05-graph-momentum-scoring.md': [
    'mcp_server/lib/graph/graph-signals.ts',
  ],
  '10-graph-signal-activation/06-causal-depth-signal.md': [
    'mcp_server/lib/graph/graph-signals.ts',
    'mcp_server/lib/search/causal-boost.ts',
  ],
  '10-graph-signal-activation/07-community-detection.md': [
    'mcp_server/lib/graph/community-detection.ts',
  ],
  '10-graph-signal-activation/08-graph-and-cognitive-memory-fixes.md': [
    'mcp_server/lib/graph/graph-signals.ts',
    'mcp_server/lib/cognitive/working-memory.ts',
    'mcp_server/lib/cognitive/attention-decay.ts',
  ],
  '10-graph-signal-activation/09-anchor-tags-as-graph-nodes.md': [
    'mcp_server/lib/search/anchor-metadata.ts',
    'mcp_server/lib/chunking/anchor-chunker.ts',
  ],

  // 11-scoring-and-calibration
  '11-scoring-and-calibration/01-score-normalization.md': [
    'mcp_server/lib/scoring/composite-scoring.ts',
  ],
  '11-scoring-and-calibration/02-cold-start-novelty-boost.md': [
    'mcp_server/lib/scoring/composite-scoring.ts',
  ],
  '11-scoring-and-calibration/03-interference-scoring.md': [
    'mcp_server/lib/scoring/interference-scoring.ts',
  ],
  '11-scoring-and-calibration/04-classification-based-decay.md': [
    'mcp_server/lib/scoring/composite-scoring.ts',
    'mcp_server/lib/cognitive/attention-decay.ts',
  ],
  '11-scoring-and-calibration/05-folder-level-relevance-scoring.md': [
    'mcp_server/lib/scoring/folder-scoring.ts',
    'mcp_server/lib/search/folder-relevance.ts',
    'shared/scoring/folder-scoring.ts',
  ],
  '11-scoring-and-calibration/06-embedding-cache.md': [
    'mcp_server/lib/cache/embedding-cache.ts',
  ],
  '11-scoring-and-calibration/07-double-intent-weighting-investigation.md': [
    'mcp_server/lib/search/intent-classifier.ts',
  ],
  '11-scoring-and-calibration/08-rrf-k-value-sensitivity-analysis.md': [
    'mcp_server/lib/eval/k-value-analysis.ts',
    'shared/algorithms/rrf-fusion.ts',
  ],
  '11-scoring-and-calibration/09-negative-feedback-confidence-signal.md': [
    'mcp_server/lib/scoring/negative-feedback.ts',
    'mcp_server/lib/scoring/confidence-tracker.ts',
  ],
  '11-scoring-and-calibration/10-auto-promotion-on-validation.md': [
    'mcp_server/lib/search/auto-promotion.ts',
  ],
  '11-scoring-and-calibration/11-scoring-and-ranking-corrections.md': [
    'mcp_server/lib/scoring/composite-scoring.ts',
    'mcp_server/lib/scoring/mpab-aggregation.ts',
  ],
  '11-scoring-and-calibration/12-stage-3-effectivescore-fallback-chain.md': [
    'mcp_server/lib/search/pipeline/stage3-rerank.ts',
  ],
  '11-scoring-and-calibration/13-scoring-and-fusion-corrections.md': [
    'mcp_server/lib/scoring/mpab-aggregation.ts',
    'mcp_server/lib/search/rsf-fusion.ts',
    'shared/algorithms/rrf-fusion.ts',
  ],
  '11-scoring-and-calibration/14-local-gguf-reranker-via-node-llama-cpp.md': [
    'mcp_server/lib/search/local-reranker.ts',
    'mcp_server/lib/search/cross-encoder.ts',
  ],

  // 12-query-intelligence
  '12-query-intelligence/01-query-complexity-router.md': [
    'mcp_server/lib/search/query-classifier.ts',
    'mcp_server/lib/search/query-router.ts',
  ],
  '12-query-intelligence/02-relative-score-fusion-in-shadow-mode.md': [
    'mcp_server/lib/search/rsf-fusion.ts',
  ],
  '12-query-intelligence/03-channel-min-representation.md': [
    'mcp_server/lib/search/channel-representation.ts',
  ],
  '12-query-intelligence/04-confidence-based-result-truncation.md': [
    'mcp_server/lib/search/confidence-truncation.ts',
  ],
  '12-query-intelligence/05-dynamic-token-budget-allocation.md': [
    'mcp_server/lib/search/dynamic-token-budget.ts',
  ],
  '12-query-intelligence/06-query-expansion.md': [
    'mcp_server/lib/search/query-expander.ts',
    'mcp_server/lib/search/embedding-expansion.ts',
  ],

  // 13-memory-quality-and-indexing
  '13-memory-quality-and-indexing/01-verify-fix-verify-memory-quality-loop.md': [
    'mcp_server/handlers/quality-loop.ts',
  ],
  '13-memory-quality-and-indexing/02-signal-vocabulary-expansion.md': [
    'mcp_server/lib/parsing/trigger-matcher.ts',
  ],
  '13-memory-quality-and-indexing/03-pre-flight-token-budget-validation.md': [
    'mcp_server/lib/validation/preflight.ts',
  ],
  '13-memory-quality-and-indexing/04-spec-folder-description-discovery.md': [
    'mcp_server/lib/search/folder-discovery.ts',
  ],
  '13-memory-quality-and-indexing/05-pre-storage-quality-gate.md': [
    'mcp_server/lib/validation/save-quality-gate.ts',
  ],
  '13-memory-quality-and-indexing/06-reconsolidation-on-save.md': [
    'mcp_server/lib/storage/reconsolidation.ts',
    'mcp_server/handlers/save/reconsolidation-bridge.ts',
  ],
  '13-memory-quality-and-indexing/07-smarter-memory-content-generation.md': [
    'mcp_server/lib/parsing/memory-parser.ts',
    'mcp_server/lib/parsing/content-normalizer.ts',
  ],
  '13-memory-quality-and-indexing/08-anchor-aware-chunk-thinning.md': [
    'mcp_server/lib/chunking/chunk-thinning.ts',
    'mcp_server/lib/chunking/anchor-chunker.ts',
  ],
  '13-memory-quality-and-indexing/09-encoding-intent-capture-at-index-time.md': [
    'mcp_server/lib/search/encoding-intent.ts',
  ],
  '13-memory-quality-and-indexing/10-auto-entity-extraction.md': [
    'mcp_server/lib/extraction/entity-extractor.ts',
    'mcp_server/lib/extraction/extraction-adapter.ts',
  ],
  '13-memory-quality-and-indexing/11-content-aware-memory-filename-generation.md': [
    'mcp_server/lib/parsing/content-normalizer.ts',
  ],
  '13-memory-quality-and-indexing/12-generation-time-duplicate-and-empty-content-prevention.md': [
    'mcp_server/handlers/save/dedup.ts',
    'mcp_server/handlers/save/create-record.ts',
  ],
  '13-memory-quality-and-indexing/13-entity-normalization-consolidation.md': [
    'mcp_server/lib/extraction/entity-extractor.ts',
    'mcp_server/lib/parsing/entity-scope.ts',
    'mcp_server/lib/extraction/entity-denylist.ts',
  ],
  '13-memory-quality-and-indexing/14-quality-gate-timer-persistence.md': [
    'mcp_server/lib/validation/save-quality-gate.ts',
  ],

  // 14-pipeline-architecture
  '14-pipeline-architecture/01-4-stage-pipeline-refactor.md': [
    'mcp_server/lib/search/pipeline/orchestrator.ts',
    'mcp_server/lib/search/pipeline/stage1-candidate-gen.ts',
    'mcp_server/lib/search/pipeline/stage2-fusion.ts',
    'mcp_server/lib/search/pipeline/stage3-rerank.ts',
    'mcp_server/lib/search/pipeline/stage4-filter.ts',
    'mcp_server/lib/search/pipeline/types.ts',
    'mcp_server/lib/search/pipeline/index.ts',
  ],
  '14-pipeline-architecture/02-mpab-chunk-to-memory-aggregation.md': [
    'mcp_server/lib/scoring/mpab-aggregation.ts',
  ],
  '14-pipeline-architecture/03-chunk-ordering-preservation.md': [
    'mcp_server/lib/search/pipeline/stage4-filter.ts',
  ],
  '14-pipeline-architecture/04-template-anchor-optimization.md': [
    'mcp_server/lib/search/anchor-metadata.ts',
  ],
  '14-pipeline-architecture/05-validation-signals-as-retrieval-metadata.md': [
    'mcp_server/lib/search/validation-metadata.ts',
  ],
  '14-pipeline-architecture/06-learned-relevance-feedback.md': [
    'mcp_server/lib/search/learned-feedback.ts',
    'mcp_server/lib/storage/learned-triggers-schema.ts',
  ],
  '14-pipeline-architecture/07-search-pipeline-safety.md': [
    'mcp_server/lib/search/pipeline/orchestrator.ts',
    'mcp_server/lib/errors/core.ts',
  ],
  '14-pipeline-architecture/08-performance-improvements.md': [
    'mcp_server/lib/cache/embedding-cache.ts',
    'mcp_server/lib/cache/tool-cache.ts',
  ],
  '14-pipeline-architecture/09-activation-window-persistence.md': [
    'mcp_server/lib/search/search-flags.ts',
    'mcp_server/lib/cognitive/rollout-policy.ts',
  ],
  '14-pipeline-architecture/10-legacy-v1-pipeline-removal.md': [
    'mcp_server/lib/search/hybrid-search.ts',
    'mcp_server/lib/search/search-flags.ts',
  ],
  '14-pipeline-architecture/11-pipeline-and-mutation-hardening.md': [
    'mcp_server/lib/storage/transaction-manager.ts',
    'mcp_server/lib/storage/mutation-ledger.ts',
  ],
  '14-pipeline-architecture/12-dbpath-extraction-and-import-standardization.md': [
    'mcp_server/core/db-state.ts',
    'mcp_server/core/config.ts',
    'shared/config.ts',
    'shared/paths.ts',
  ],
  '14-pipeline-architecture/13-strict-zod-schema-validation.md': [
    'mcp_server/schemas/tool-input-schemas.ts',
  ],
  '14-pipeline-architecture/14-dynamic-server-instructions-at-mcp-initialization.md': [
    'mcp_server/context-server.ts',
  ],
  '14-pipeline-architecture/15-warm-server-daemon-mode.md': [
    'mcp_server/cli.ts',
    'mcp_server/context-server.ts',
  ],
  '14-pipeline-architecture/16-backend-storage-adapter-abstraction.md': [
    'mcp_server/lib/interfaces/vector-store.ts',
  ],

  // 15-retrieval-enhancements
  '15-retrieval-enhancements/01-dual-scope-memory-auto-surface.md': [
    'mcp_server/hooks/memory-surface.ts',
  ],
  '15-retrieval-enhancements/02-constitutional-memory-as-expert-knowledge-injection.md': [
    'mcp_server/lib/search/retrieval-directives.ts',
  ],
  '15-retrieval-enhancements/03-spec-folder-hierarchy-as-retrieval-structure.md': [
    'mcp_server/lib/search/spec-folder-hierarchy.ts',
  ],
  '15-retrieval-enhancements/04-lightweight-consolidation.md': [
    'mcp_server/lib/storage/consolidation.ts',
  ],
  '15-retrieval-enhancements/05-memory-summary-search-channel.md': [
    'mcp_server/lib/search/memory-summaries.ts',
    'mcp_server/lib/search/tfidf-summarizer.ts',
  ],
  '15-retrieval-enhancements/06-cross-document-entity-linking.md': [
    'mcp_server/lib/search/entity-linker.ts',
  ],
  '15-retrieval-enhancements/07-tier-2-fallback-channel-forcing.md': [
    'mcp_server/lib/search/channel-enforcement.ts',
  ],
  '15-retrieval-enhancements/08-provenance-rich-response-envelopes.md': [
    'mcp_server/lib/response/envelope.ts',
  ],
  '15-retrieval-enhancements/09-contextual-tree-injection.md': [
    'mcp_server/lib/search/hybrid-search.ts',
    'mcp_server/lib/search/folder-discovery.ts',
  ],

  // 16-tooling-and-scripts
  '16-tooling-and-scripts/01-tree-thinning-for-spec-folder-consolidation.md': [
    'mcp_server/lib/chunking/chunk-thinning.ts',
  ],
  '16-tooling-and-scripts/02-architecture-boundary-enforcement.md': [
    'mcp_server/lib/architecture/layer-definitions.ts',
  ],
  '16-tooling-and-scripts/03-progressive-validation-for-spec-documents.md': '__META__',
  '16-tooling-and-scripts/04-dead-code-removal.md': '__META__',
  '16-tooling-and-scripts/05-code-standards-alignment.md': '__META__',
  '16-tooling-and-scripts/06-real-time-filesystem-watching-with-chokidar.md': [
    'mcp_server/lib/ops/file-watcher.ts',
  ],

  // 17-governance
  '17-governance/01-feature-flag-governance.md': '__GOVERNANCE__',
  '17-governance/02-feature-flag-sunset-audit.md': '__GOVERNANCE__',

  // 18-ux-hooks
  '18-ux-hooks/01-shared-post-mutation-hook-wiring.md': [
    'mcp_server/handlers/mutation-hooks.ts',
    'mcp_server/hooks/mutation-feedback.ts',
  ],
  '18-ux-hooks/02-memory-health-autorepair-metadata.md': [
    'mcp_server/handlers/memory-crud-health.ts',
    'mcp_server/hooks/response-hints.ts',
  ],
  '18-ux-hooks/03-checkpoint-delete-confirmname-safety.md': [
    'mcp_server/handlers/checkpoints.ts',
  ],
  '18-ux-hooks/04-schema-and-type-contract-synchronization.md': [
    'mcp_server/schemas/tool-input-schemas.ts',
    'mcp_server/handlers/types.ts',
  ],
  '18-ux-hooks/05-dedicated-ux-hook-modules.md': [
    'mcp_server/hooks/memory-surface.ts',
    'mcp_server/hooks/mutation-feedback.ts',
    'mcp_server/hooks/response-hints.ts',
    'mcp_server/hooks/index.ts',
  ],
  '18-ux-hooks/06-mutation-hook-result-contract-expansion.md': [
    'mcp_server/handlers/mutation-hooks.ts',
    'mcp_server/hooks/mutation-feedback.ts',
  ],
  '18-ux-hooks/07-mutation-response-ux-payload-exposure.md': [
    'mcp_server/lib/response/envelope.ts',
    'mcp_server/hooks/mutation-feedback.ts',
  ],
  '18-ux-hooks/08-context-server-success-hint-append.md': [
    'mcp_server/context-server.ts',
    'mcp_server/hooks/response-hints.ts',
  ],
  '18-ux-hooks/09-duplicate-save-no-op-feedback-hardening.md': [
    'mcp_server/handlers/memory-save.ts',
    'mcp_server/handlers/save/dedup.ts',
  ],
  '18-ux-hooks/10-atomic-save-parity-and-partial-indexing-hints.md': [
    'mcp_server/handlers/save/index.ts',
    'mcp_server/handlers/save/embedding-pipeline.ts',
  ],
  '18-ux-hooks/11-final-token-metadata-recomputation.md': [
    'mcp_server/formatters/token-metrics.ts',
  ],
  '18-ux-hooks/12-hooks-readme-and-export-alignment.md': [
    'mcp_server/hooks/index.ts',
  ],
  '18-ux-hooks/13-end-to-end-success-envelope-verification.md': [
    'mcp_server/lib/response/envelope.ts',
  ],

  // 19-decisions-and-deferrals
  '19-decisions-and-deferrals/01-int8-quantization-evaluation.md': '__DECISION_NOGO__',
  '19-decisions-and-deferrals/02-implemented-graph-centrality-and-community-detection.md': [
    'mcp_server/lib/graph/community-detection.ts',
    'mcp_server/lib/manage/pagerank.ts',
  ],
  '19-decisions-and-deferrals/03-implemented-auto-entity-extraction.md': [
    'mcp_server/lib/extraction/entity-extractor.ts',
    'mcp_server/lib/extraction/extraction-adapter.ts',
  ],
  '19-decisions-and-deferrals/04-implemented-memory-summary-generation.md': [
    'mcp_server/lib/search/memory-summaries.ts',
    'mcp_server/lib/search/tfidf-summarizer.ts',
  ],
  '19-decisions-and-deferrals/05-implemented-cross-document-entity-linking.md': [
    'mcp_server/lib/search/entity-linker.ts',
  ],

  // 20-feature-flag-reference (already has source file columns)
  '20-feature-flag-reference/01-1-search-pipeline-features-speckit.md': '__FLAG_REF__',
  '20-feature-flag-reference/02-2-session-and-cache.md': '__FLAG_REF__',
  '20-feature-flag-reference/03-3-mcp-configuration.md': '__FLAG_REF__',
  '20-feature-flag-reference/04-4-memory-and-storage.md': '__FLAG_REF__',
  '20-feature-flag-reference/05-5-embedding-and-api.md': '__FLAG_REF__',
  '20-feature-flag-reference/06-6-debug-and-telemetry.md': '__FLAG_REF__',
  '20-feature-flag-reference/07-7-ci-and-build-informational.md': '__FLAG_REF__',
};

// ===================================================================
// STEP 4: TEST FILE MATCHING
// ===================================================================

function findTestFiles(sourceFiles, allTestFiles) {
  const tests = new Set();
  for (const srcFile of sourceFiles) {
    const srcRel = toRelativePath(srcFile);
    const srcBase = path.basename(srcFile, '.ts');

    for (const testFile of allTestFiles) {
      const testBase = path.basename(testFile, '.vitest.ts').replace('.test', '');
      // Direct name match
      if (testBase === srcBase || testBase === `handler-${srcBase}` ||
          testBase === `unit-${srcBase}` || testBase === `integration-${srcBase}` ||
          testBase.includes(srcBase) || srcBase.includes(testBase)) {
        tests.add(testFile);
      }
    }
  }
  return tests;
}

// Additional feature-specific test mappings for tests that don't match by name
const EXTRA_TEST_MAP = {
  '01-retrieval/01-unified-context-retrieval-memorycontext.md': [
    'mcp_server/tests/handler-memory-context.vitest.ts',
    'mcp_server/tests/memory-context.vitest.ts',
    'mcp_server/tests/memory-context-eval-channels.vitest.ts',
    'mcp_server/tests/token-budget-enforcement.vitest.ts',
    'mcp_server/tests/token-budget.vitest.ts',
  ],
  '01-retrieval/02-semantic-and-lexical-search-memorysearch.md': [
    'mcp_server/tests/handler-memory-search.vitest.ts',
    'mcp_server/tests/memory-search-integration.vitest.ts',
    'mcp_server/tests/memory-search-eval-channels.vitest.ts',
    'mcp_server/tests/memory-search-quality-filter.vitest.ts',
  ],
  '01-retrieval/04-hybrid-search-pipeline.md': [
    'mcp_server/tests/hybrid-search.vitest.ts',
    'mcp_server/tests/hybrid-search-flags.vitest.ts',
    'mcp_server/tests/hybrid-search-context-headers.vitest.ts',
    'mcp_server/tests/search-extended.vitest.ts',
    'mcp_server/tests/search-fallback-tiered.vitest.ts',
  ],
  '01-retrieval/05-4-stage-pipeline-architecture.md': [
    'mcp_server/tests/pipeline-v2.vitest.ts',
    'mcp_server/tests/pipeline-integration.vitest.ts',
    'mcp_server/tests/integration-138-pipeline.vitest.ts',
    'mcp_server/tests/integration-search-pipeline.vitest.ts',
    'mcp_server/tests/stage2-fusion.vitest.ts',
  ],
  '02-mutation/01-memory-indexing-memorysave.md': [
    'mcp_server/tests/handler-memory-save.vitest.ts',
    'mcp_server/tests/memory-save-integration.vitest.ts',
    'mcp_server/tests/memory-save-extended.vitest.ts',
    'mcp_server/tests/integration-save-pipeline.vitest.ts',
  ],
  '05-lifecycle/01-checkpoint-creation-checkpointcreate.md': [
    'mcp_server/tests/handler-checkpoints.vitest.ts',
    'mcp_server/tests/checkpoints-extended.vitest.ts',
    'mcp_server/tests/checkpoints-storage.vitest.ts',
    'mcp_server/tests/integration-checkpoint-lifecycle.vitest.ts',
  ],
  '06-analysis/05-epistemic-baseline-capture-taskpreflight.md': [
    'mcp_server/tests/handler-session-learning.vitest.ts',
    'mcp_server/tests/integration-learning-history.vitest.ts',
    'mcp_server/tests/learning-stats-filters.vitest.ts',
  ],
  '08-bug-fixes-and-data-integrity/04-sha-256-content-hash-deduplication.md': [
    'mcp_server/tests/content-hash-dedup.vitest.ts',
  ],
  '10-graph-signal-activation/01-typed-weighted-degree-channel.md': [
    'mcp_server/tests/graph-search-fn.vitest.ts',
    'mcp_server/tests/degree-computation.vitest.ts',
    'mcp_server/tests/rrf-degree-channel.vitest.ts',
    'mcp_server/tests/graph-scoring-integration.vitest.ts',
  ],
  '11-scoring-and-calibration/01-score-normalization.md': [
    'mcp_server/tests/score-normalization.vitest.ts',
    'mcp_server/tests/composite-scoring.vitest.ts',
  ],
  '14-pipeline-architecture/01-4-stage-pipeline-refactor.md': [
    'mcp_server/tests/pipeline-v2.vitest.ts',
    'mcp_server/tests/pipeline-integration.vitest.ts',
    'mcp_server/tests/integration-search-pipeline.vitest.ts',
  ],
};

// ===================================================================
// STEP 5: GENERATE SOURCE FILES SECTION
// ===================================================================

function generateSourceFilesSection(implFiles, testFiles) {
  const implRows = [];
  const sortedImpl = [...implFiles].map(toRelativePath).sort();
  for (const rel of sortedImpl) {
    implRows.push(`| \`${rel}\` | ${classifyLayer(rel)} | ${deriveRole(rel)} |`);
  }

  const testRows = [];
  const sortedTests = [...testFiles].map(toRelativePath).sort();
  for (const rel of sortedTests) {
    testRows.push(`| \`${rel}\` | ${deriveTestFocus(rel)} |`);
  }

  let section = '\n## Source Files\n\n### Implementation\n\n';
  section += '| File | Layer | Role |\n|------|-------|------|\n';
  section += implRows.join('\n') + '\n';

  if (testRows.length > 0) {
    section += '\n### Tests\n\n';
    section += '| File | Focus |\n|------|-------|\n';
    section += testRows.join('\n') + '\n';
  }

  return section;
}

function generateSpecialSection(type) {
  if (type === '__GOVERNANCE__') {
    return '\n## Source Files\n\nNo dedicated source files — this describes governance process controls.\n';
  }
  if (type === '__DECISION_NOGO__') {
    return '\n## Source Files\n\nNo dedicated source files — this is a decision record.\n';
  }
  if (type === '__FLAG_REF__') {
    return '\n## Source Files\n\nSource file references are included in the flag table above.\n';
  }
  if (type === '__META__') {
    return '\n## Source Files\n\nNo dedicated source files — this is a cross-cutting meta-improvement applied across multiple modules.\n';
  }
  if (type === '__DEFERRED__') {
    return '\n## Source Files\n\nNo source files yet — this feature is planned but not yet implemented.\n';
  }
  return '';
}

// ===================================================================
// STEP 6: PATCH SNIPPET FILES
// ===================================================================

function patchSnippetFile(snippetPath, sourceSection) {
  const content = fs.readFileSync(snippetPath, 'utf-8');

  // Check if already has Source Files section
  if (content.includes('## Source Files')) {
    // Replace existing section
    const beforeSourceFiles = content.split('## Source Files')[0];
    const afterSourceMetadata = content.split('## Source Metadata');
    if (afterSourceMetadata.length >= 2) {
      return beforeSourceFiles.trimEnd() + '\n' + sourceSection + '\n## Source Metadata' + afterSourceMetadata.slice(1).join('## Source Metadata');
    }
    return beforeSourceFiles.trimEnd() + '\n' + sourceSection;
  }

  // Insert before ## Source Metadata
  const parts = content.split('## Source Metadata');
  if (parts.length >= 2) {
    return parts[0].trimEnd() + '\n' + sourceSection + '\n## Source Metadata' + parts.slice(1).join('## Source Metadata');
  }

  // Fallback: append at end
  return content.trimEnd() + '\n' + sourceSection;
}

// ===================================================================
// STEP 7: PATCH MONOLITH
// ===================================================================

// Build a mapping from monolith heading to Source Files section
function buildMonolithSections(featureToSection) {
  // Maps feature file key to its monolith heading
  const result = {};
  for (const [featureKey, section] of Object.entries(featureToSection)) {
    result[featureKey] = section;
  }
  return result;
}

// Heading patterns from monolith that match feature snippet titles
function extractFeatureTitleFromSnippet(snippetPath) {
  try {
    const content = fs.readFileSync(snippetPath, 'utf-8');
    const firstLine = content.split('\n')[0];
    if (firstLine.startsWith('# ')) {
      return firstLine.substring(2).trim();
    }
  } catch { /* ignore */ }
  return null;
}

function patchMonolith(monolithPath, featureSections) {
  let content = fs.readFileSync(monolithPath, 'utf-8');
  const lines = content.split('\n');
  const newLines = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Check if this is a ### heading that matches a feature
    if (line.startsWith('### ') || line.startsWith('## ')) {
      const heading = line.replace(/^#+\s+/, '').trim();

      // Find matching feature section
      let matchedSection = null;
      for (const [featureKey, section] of Object.entries(featureSections)) {
        const snippetPath = path.join(CATALOG, featureKey);
        const title = extractFeatureTitleFromSnippet(snippetPath);
        if (title && normalizeTitle(title) === normalizeTitle(heading)) {
          matchedSection = section;
          break;
        }
      }

      if (matchedSection) {
        newLines.push(line);
        i++;

        // Skip to next heading or end, collecting prose
        while (i < lines.length && !lines[i].startsWith('### ') && !lines[i].startsWith('## ') &&
               !(lines[i].startsWith('---') && i > 0 && lines[i-1].trim() === '')) {

          // Skip existing Source Files section
          if (lines[i].startsWith('## Source Files') || lines[i].trim() === '## Source Files') {
            // Skip until next ## heading or ### heading
            i++;
            while (i < lines.length && !lines[i].startsWith('## ') && !lines[i].startsWith('### ') &&
                   !(lines[i].startsWith('---') && i > 0)) {
              i++;
            }
            continue;
          }

          newLines.push(lines[i]);
          i++;
        }

        // Insert Source Files section before next heading
        const sectionLines = matchedSection.split('\n');
        for (const sl of sectionLines) {
          newLines.push(sl);
        }
        newLines.push('');
        continue;
      }
    }

    newLines.push(line);
    i++;
  }

  return newLines.join('\n');
}

function normalizeTitle(title) {
  return title.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

// ===================================================================
// MAIN
// ===================================================================

console.log('Building dependency graph...');
const { graph, sourceFiles } = buildGraph();
console.log(`  Found ${sourceFiles.length} source files, ${graph.size} in graph`);

const allTestFiles = [...collectTestFiles(MCP), ...collectTestFiles(SHARED)];
console.log(`  Found ${allTestFiles.length} test files`);

const featureSections = {};
let snippetCount = 0;
let specialCount = 0;

for (const [featureKey, entryPoints] of Object.entries(FEATURE_MAP)) {
  const snippetPath = path.join(CATALOG, featureKey);

  if (!fs.existsSync(snippetPath)) {
    console.warn(`  WARN: Snippet not found: ${featureKey}`);
    continue;
  }

  let section;
  if (typeof entryPoints === 'string') {
    section = generateSpecialSection(entryPoints);
    specialCount++;
  } else {
    // Compute transitive closure
    const fullPaths = entryPoints.map(ep => ep);
    const transitive = transitiveClosureOf(fullPaths, graph);

    // Find test files
    const tests = findTestFiles(transitive, allTestFiles);

    // Add extra test mappings
    const extraTests = EXTRA_TEST_MAP[featureKey];
    if (extraTests) {
      for (const et of extraTests) {
        const resolved = resolveToFile(path.join(PROJ, et.replace(/\.ts$/, '')));
        if (resolved) tests.add(resolved);
      }
    }

    section = generateSourceFilesSection(transitive, tests);
    snippetCount++;
  }

  featureSections[featureKey] = section;

  // Patch the snippet file
  const patched = patchSnippetFile(snippetPath, section);
  fs.writeFileSync(snippetPath, patched);
}

console.log(`\nPatched ${snippetCount} feature snippets, ${specialCount} special cases`);

// Phase 2: Patch monolith
console.log('Patching monolith...');
const monolithPath = path.join(CATALOG, 'feature_catalog.md');
const patchedMonolith = patchMonolith(monolithPath, featureSections);
fs.writeFileSync(monolithPath, patchedMonolith);
console.log('Done!');
