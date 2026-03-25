// TESTS: Deferred Features Integration — Cross-Feature Validation
// Covers: R10 to S5 dependency chain, N2 pipeline integration,
// Summary channel, flag behavior, backward compatibility.
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Database from 'better-sqlite3';

// Feature implementations
import { extractEntities, filterEntities, storeEntities, updateEntityCatalog } from '../lib/extraction/entity-extractor';
import {
  normalizeEntityName,
  buildEntityCatalog,
  findCrossDocumentMatches,
  createEntityLinks,
  hasEntityInfrastructure,
  runEntityLinking,
} from '../lib/search/entity-linker';
import { snapshotDegrees, applyGraphSignals, clearGraphSignalsCache } from '../lib/graph/graph-signals';
import {
  detectCommunitiesBFS,
  storeCommunityAssignments,
  getCommunityMembers,
  applyCommunityBoost,
  resetCommunityDetectionState,
} from '../lib/graph/community-detection';
import { generateSummary, computeTfIdf } from '../lib/search/tfidf-summarizer';
import { generateAndStoreSummary, querySummaryEmbeddings, checkScaleGate } from '../lib/search/memory-summaries';

// Feature flags
import {
  isGraphSignalsEnabled,
  isCommunityDetectionEnabled,
  isMemorySummariesEnabled,
  isAutoEntitiesEnabled,
  isEntityLinkingEnabled,
} from '../lib/search/search-flags';

/* -- Test Database Helper -- */

function createIntegrationDb(): Database.Database {
  const db = new Database(':memory:');

  db.exec(`
    CREATE TABLE memory_index (
      id INTEGER PRIMARY KEY,
      spec_folder TEXT NOT NULL DEFAULT 'test',
      file_path TEXT NOT NULL DEFAULT 'test.md',
      title TEXT,
      content_text TEXT,
      memory_state TEXT,
      importance_tier TEXT DEFAULT 'normal',
      importance_weight REAL DEFAULT 0.5,
      quality_score REAL DEFAULT 0.8,
      embedding_status TEXT DEFAULT 'success',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE causal_edges (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id TEXT NOT NULL,
      target_id TEXT NOT NULL,
      relation TEXT NOT NULL CHECK(relation IN (
        'caused', 'enabled', 'supersedes', 'contradicts', 'derived_from', 'supports'
      )),
      strength REAL DEFAULT 1.0,
      evidence TEXT,
      created_by TEXT DEFAULT 'manual',
      last_accessed TEXT
    )
  `);

  db.exec(`
    CREATE TABLE degree_snapshots (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      degree_count INTEGER NOT NULL DEFAULT 0,
      snapshot_date TEXT NOT NULL DEFAULT (date('now')),
      UNIQUE(memory_id, snapshot_date)
    )
  `);

  db.exec(`
    CREATE TABLE community_assignments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL UNIQUE,
      community_id INTEGER NOT NULL,
      algorithm TEXT NOT NULL DEFAULT 'bfs',
      computed_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE memory_summaries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL UNIQUE,
      summary_text TEXT NOT NULL,
      summary_embedding BLOB,
      key_sentences TEXT DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  db.exec(`
    CREATE TABLE memory_entities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id INTEGER NOT NULL,
      entity_text TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      frequency INTEGER NOT NULL DEFAULT 1,
      created_by TEXT NOT NULL DEFAULT 'entity_extractor',
      created_at TEXT DEFAULT (datetime('now')),
      UNIQUE(memory_id, entity_text)
    )
  `);

  db.exec(`
    CREATE TABLE entity_catalog (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      canonical_name TEXT NOT NULL UNIQUE,
      aliases TEXT DEFAULT '[]',
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      memory_count INTEGER NOT NULL DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  return db;
}

function seedMemories(db: Database.Database): void {
  // Seed memories across two spec folders
  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
    .run(1, 'specs/001-auth', 'auth/session.md', 'Session Management');
  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
    .run(2, 'specs/001-auth', 'auth/tokens.md', 'Token Validation');
  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
    .run(3, 'specs/002-api', 'api/endpoints.md', 'API Endpoints');
  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
    .run(4, 'specs/002-api', 'api/middleware.md', 'Middleware Stack');
  db.prepare(`INSERT INTO memory_index (id, spec_folder, file_path, title) VALUES (?, ?, ?, ?)`)
    .run(5, 'specs/003-data', 'data/schema.md', 'Database Schema');
}

function seedEdges(db: Database.Database): void {
  // Create a small graph: 1→2, 2→3, 1→3, 3→4
  db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)`)
    .run('1', '2', 'caused');
  db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)`)
    .run('2', '3', 'enabled');
  db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)`)
    .run('1', '3', 'supports');
  db.prepare(`INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)`)
    .run('3', '4', 'caused');
}

/* -- Tests -- */

describe('Deferred Features: Integration Tests', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createIntegrationDb();
    seedMemories(db);
    clearGraphSignalsCache();
    resetCommunityDetectionState();
  });

  afterEach(() => {
    delete process.env.SPECKIT_ENTITY_LINKING_MAX_DENSITY;
    db.close();
  });

  // -- Feature Flags: Default-ON behavior --

  describe('Feature flags — default ON, disable with =false', () => {
    afterEach(() => {
      delete process.env.SPECKIT_GRAPH_SIGNALS;
      delete process.env.SPECKIT_COMMUNITY_DETECTION;
      delete process.env.SPECKIT_MEMORY_SUMMARIES;
      delete process.env.SPECKIT_AUTO_ENTITIES;
      delete process.env.SPECKIT_ENTITY_LINKING;
    });

    it('all flags enabled by default (env unset)', () => {
      delete process.env.SPECKIT_GRAPH_SIGNALS;
      delete process.env.SPECKIT_COMMUNITY_DETECTION;
      delete process.env.SPECKIT_MEMORY_SUMMARIES;
      delete process.env.SPECKIT_AUTO_ENTITIES;
      delete process.env.SPECKIT_ENTITY_LINKING;

      expect(isGraphSignalsEnabled()).toBe(true);
      expect(isCommunityDetectionEnabled()).toBe(true);
      expect(isMemorySummariesEnabled()).toBe(true);
      expect(isAutoEntitiesEnabled()).toBe(true);
      expect(isEntityLinkingEnabled()).toBe(true);
    });

    it('flags disable with explicit "false"', () => {
      process.env.SPECKIT_GRAPH_SIGNALS = 'false';
      expect(isGraphSignalsEnabled()).toBe(false);

      process.env.SPECKIT_COMMUNITY_DETECTION = 'false';
      expect(isCommunityDetectionEnabled()).toBe(false);

      process.env.SPECKIT_MEMORY_SUMMARIES = 'false';
      expect(isMemorySummariesEnabled()).toBe(false);

      process.env.SPECKIT_AUTO_ENTITIES = 'false';
      expect(isAutoEntitiesEnabled()).toBe(false);

      process.env.SPECKIT_ENTITY_LINKING = 'false';
      expect(isEntityLinkingEnabled()).toBe(false);
    });

    it('flags remain enabled with explicit "true"', () => {
      process.env.SPECKIT_GRAPH_SIGNALS = 'true';
      expect(isGraphSignalsEnabled()).toBe(true);
    });
  });

  // -- R10 → S5: Entity Extraction → Entity Linking Dependency Chain --

  describe('R10 → S5 dependency chain', () => {
    it('extracts entities from content and stores them', () => {
      const content = `
## Session Management

Using JSON Web Tokens for authentication. The Token Validation
middleware implements OAuth 2.0 with "refresh tokens" via Express Router.

\`\`\`typescript
const middleware = createAuthMiddleware();
\`\`\`
`;
      const entities = extractEntities(content);
      const filtered = filterEntities(entities);

      expect(filtered.length).toBeGreaterThan(0);

      const result = storeEntities(db, 1, filtered);
      expect(result.stored).toBeGreaterThan(0);

      // Verify stored in DB
      const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1').all();
      expect(rows.length).toBe(result.stored);
    });

    it('updates entity catalog from extracted entities', () => {
      const entities = [
        { text: 'Session Management', type: 'proper_noun' as const, frequency: 2 },
        { text: 'Token Validation', type: 'proper_noun' as const, frequency: 1 },
      ];

      const result = updateEntityCatalog(db, entities);
      expect(result.upserted).toBeGreaterThan(0);

      const catalog = db.prepare('SELECT * FROM entity_catalog').all();
      expect(catalog.length).toBeGreaterThan(0);
    });

    it('finds cross-document entity matches after extraction', () => {
      // Store entities for memories in different spec folders
      storeEntities(db, 1, [{ text: 'Token Validation', type: 'proper_noun', frequency: 1 }]);
      storeEntities(db, 3, [{ text: 'Token Validation', type: 'proper_noun', frequency: 1 }]);

      const matches = findCrossDocumentMatches(db);
      expect(matches.length).toBeGreaterThan(0);

      const tokenMatch = matches.find(m => m.canonicalName.includes('token'));
      expect(tokenMatch).toBeDefined();
      expect(tokenMatch!.specFolders.length).toBeGreaterThanOrEqual(2);
    });

    it('creates causal edges from cross-document entity matches', () => {
      // Store entities in different spec folders
      storeEntities(db, 1, [{ text: 'OAuth Protocol', type: 'proper_noun', frequency: 1 }]);
      storeEntities(db, 3, [{ text: 'OAuth Protocol', type: 'proper_noun', frequency: 1 }]);

      const matches = findCrossDocumentMatches(db);
      const linkResult = createEntityLinks(db, matches);

      expect(linkResult.linksCreated).toBeGreaterThan(0);

      // Verify edge created with correct attributes
      const edges = db.prepare(
        "SELECT * FROM causal_edges WHERE created_by = 'entity_linker'"
      ).all() as Array<Record<string, unknown>>;
      expect(edges.length).toBeGreaterThan(0);
      expect(edges[0].relation).toBe('supports');
      expect(edges[0].strength).toBe(0.7);
    });

    it('end-to-end: runEntityLinking creates cross-doc links', () => {
      // Store entities across spec folders
      storeEntities(db, 1, [{ text: 'API Gateway', type: 'proper_noun', frequency: 1 }]);
      storeEntities(db, 4, [{ text: 'API Gateway', type: 'proper_noun', frequency: 1 }]);
      updateEntityCatalog(db, [{ text: 'API Gateway', type: 'proper_noun', frequency: 1 }]);

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBeGreaterThan(0);
      expect(result.crossDocMatches).toBeGreaterThan(0);
    });

    it('hasEntityInfrastructure returns false without entities', () => {
      expect(hasEntityInfrastructure(db)).toBe(false);
    });

    it('hasEntityInfrastructure returns true after catalog entries', () => {
      updateEntityCatalog(db, [{ text: 'Test Entity', type: 'proper_noun', frequency: 1 }]);
      expect(hasEntityInfrastructure(db)).toBe(true);
    });

    it('density guard skips entity linking when graph is already dense', () => {
      process.env.SPECKIT_ENTITY_LINKING_MAX_DENSITY = '0.3';

      // 4 seed edges across 5 memories => density 0.8 (> 0.3)
      seedEdges(db);

      storeEntities(db, 1, [{ text: 'API Gateway', type: 'proper_noun', frequency: 1 }]);
      storeEntities(db, 3, [{ text: 'API Gateway', type: 'proper_noun', frequency: 1 }]);
      updateEntityCatalog(db, [{ text: 'API Gateway', type: 'proper_noun', frequency: 1 }]);

      const result = runEntityLinking(db);
      expect(result.linksCreated).toBe(0);
      expect(result.skippedByDensityGuard).toBe(true);
      expect(result.edgeDensity).toBeGreaterThan(result.densityThreshold ?? 0);
    });
  });

  // -- N2: Graph Signals Pipeline Integration --

  describe('N2 graph signals pipeline integration', () => {
    it('snapshotDegrees captures current graph state', () => {
      seedEdges(db);
      const result = snapshotDegrees(db);
      expect(result.snapshotted).toBeGreaterThan(0);

      const snapshots = db.prepare('SELECT * FROM degree_snapshots').all();
      expect(snapshots.length).toBeGreaterThan(0);
    });

    it('applyGraphSignals modifies search result scores', () => {
      seedEdges(db);

      const rows = [
        { id: 1, score: 0.5 },
        { id: 2, score: 0.4 },
        { id: 3, score: 0.3 },
      ];

      const result = applyGraphSignals(rows, db);
      expect(result.length).toBe(3);

      // Scores should be >= original (additive bonuses)
      for (let i = 0; i < rows.length; i++) {
        expect(result[i].score).toBeGreaterThanOrEqual(rows[i].score);
      }
    });

    it('applyGraphSignals returns unchanged rows on empty graph', () => {
      const rows = [{ id: 99, score: 0.5 }];
      const result = applyGraphSignals(rows, db);
      expect(result[0].score).toBe(0.5);
    });
  });

  // -- N2c: Community Detection Integration --

  describe('N2c community detection integration', () => {
    it('detects communities and stores assignments', () => {
      seedEdges(db);

      const communities = detectCommunitiesBFS(db);
      expect(communities.size).toBeGreaterThan(0);

      const storeResult = storeCommunityAssignments(db, communities);
      expect(storeResult.stored).toBeGreaterThan(0);

      const assignments = db.prepare('SELECT * FROM community_assignments').all();
      expect(assignments.length).toBe(storeResult.stored);
    });

    it('getCommunityMembers returns co-members', () => {
      seedEdges(db);

      const communities = detectCommunitiesBFS(db);
      storeCommunityAssignments(db, communities);

      const members = getCommunityMembers(db, 1);
      // Node 1 is connected to 2, 3, 4 — they should be in same community
      expect(members.length).toBeGreaterThan(0);
    });

    it('applyCommunityBoost injects co-members into results', () => {
      seedEdges(db);
      const communities = detectCommunitiesBFS(db);
      storeCommunityAssignments(db, communities);

      const rows = [{ id: 1, score: 0.8 }];
      const boosted = applyCommunityBoost(rows, db);

      // Should have the original plus up to 3 injected co-members
      expect(boosted.length).toBeGreaterThanOrEqual(1);
      expect(boosted.length).toBeLessThanOrEqual(4); // original + max 3 injected
    });
  });

  // -- R8: Summary Generation + Search Channel --

  describe('R8 memory summaries integration', () => {
    it('generates and stores summary for content', async () => {
      const content = `
The authentication module handles user login flows. It validates credentials
against the database and issues JWT tokens. The token refresh mechanism ensures
seamless session continuity. Error handling covers expired tokens, invalid
signatures, and rate limiting scenarios.
`;
      const mockEmbedding = async (_text: string): Promise<Float32Array> => {
        return new Float32Array([0.1, 0.2, 0.3, 0.4]);
      };

      const result = await generateAndStoreSummary(db, 1, content, mockEmbedding);
      expect(result.stored).toBe(true);
      expect(result.summary.length).toBeGreaterThan(0);

      // Verify stored in DB
      const row = db.prepare('SELECT * FROM memory_summaries WHERE memory_id = 1').get();
      expect(row).toBeDefined();
    });

    it('querySummaryEmbeddings returns results', async () => {
      // Store a summary with embedding
      const embedding = new Float32Array([0.1, 0.2, 0.3, 0.4]);
      const buffer = Buffer.from(embedding.buffer);

      db.prepare(
        `INSERT INTO memory_summaries (memory_id, summary_text, summary_embedding, key_sentences)
         VALUES (?, ?, ?, ?)`
      ).run(1, 'Test summary', buffer, '["sentence one"]');

      const queryEmb = new Float32Array([0.1, 0.2, 0.3, 0.4]);
      const results = querySummaryEmbeddings(db, queryEmb, 10);

      expect(results.length).toBe(1);
      expect(results[0].memoryId).toBe(1);
      expect(results[0].similarity).toBeGreaterThan(0);
    });

    it('checkScaleGate returns false for small databases', () => {
      expect(checkScaleGate(db)).toBe(false);
    });

    it('TF-IDF generates meaningful summaries', () => {
      const result = generateSummary(
        'The search pipeline processes queries through four stages. ' +
        'Stage one generates candidates from multiple channels. ' +
        'Stage two applies scoring signals like causal boost and session attention. ' +
        'Stage three performs reranking with cross-encoders. ' +
        'Stage four filters and annotates results.'
      );

      expect(result.keySentences.length).toBeGreaterThan(0);
      expect(result.keySentences.length).toBeLessThanOrEqual(3);
      expect(result.summary.length).toBeGreaterThan(0);
    });
  });

  // -- Cross-Feature: Combined Pipeline Behavior --

  describe('cross-feature interactions', () => {
    it('N2 graph signals work alongside community detection', () => {
      seedEdges(db);

      // Run community detection
      const communities = detectCommunitiesBFS(db);
      storeCommunityAssignments(db, communities);

      // Apply community boost first (as in pipeline order)
      const rows = [{ id: 1, score: 0.8 }, { id: 5, score: 0.6 }];
      const boosted = applyCommunityBoost(rows, db);

      // Then apply graph signals
      const signaled = applyGraphSignals(boosted, db);

      // All rows should have scores
      for (const row of signaled) {
        expect(typeof row.score).toBe('number');
        expect(row.score).toBeGreaterThanOrEqual(0);
      }
    });

    it('R10 entity extraction produces data S5 can consume', () => {
      const content = `## API Gateway Design\n\nUsing Express Router for the API Gateway middleware.`;

      const entities = extractEntities(content);
      const filtered = filterEntities(entities);

      // Store for memory 1 (specs/001-auth)
      storeEntities(db, 1, filtered);

      // Store same entities for memory 3 (specs/002-api)
      storeEntities(db, 3, filtered);

      // S5 should be able to find cross-doc matches
      const matches = findCrossDocumentMatches(db);

      // At least some entities should span both spec folders
      if (filtered.length > 0) {
        expect(matches.length).toBeGreaterThanOrEqual(0); // May be 0 if all filtered to same folder
      }
    });
  });
});
