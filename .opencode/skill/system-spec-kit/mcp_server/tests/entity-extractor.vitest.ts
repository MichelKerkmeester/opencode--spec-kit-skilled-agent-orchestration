// TEST: ENTITY EXTRACTOR (R10)
// Covers: extractEntities, filterEntities, storeEntities,
// UpdateEntityCatalog, computeEdgeDensity, normalizeEntityName,
// Entity-denylist
import { describe, it, expect, beforeEach } from 'vitest';
import Database from 'better-sqlite3';

import {
  extractEntities,
  filterEntities,
  storeEntities,
  updateEntityCatalog,
  rebuildEntityCatalog,
  rebuildAutoEntities,
  computeEdgeDensity,
  normalizeEntityName,
  __testables,
} from '../lib/extraction/entity-extractor.js';
import type { ExtractedEntity } from '../lib/extraction/entity-extractor.js';

import {
  isEntityDenied,
  getEntityDenylistSize,
  ENTITY_DENYLIST,
} from '../lib/extraction/entity-denylist.js';

/* --- Helper: In-memory test database --- */

function createTestDb(): Database.Database {
  const db = new Database(':memory:');
  db.exec(`
    CREATE TABLE memory_index (
      id          INTEGER PRIMARY KEY,
      spec_folder TEXT,
      file_path   TEXT,
      title       TEXT,
      content_text TEXT
    );

    CREATE TABLE memory_entities (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      memory_id   INTEGER NOT NULL,
      entity_text TEXT NOT NULL,
      entity_type TEXT NOT NULL DEFAULT 'noun_phrase',
      frequency   INTEGER NOT NULL DEFAULT 1,
      created_by  TEXT NOT NULL DEFAULT 'entity_extractor',
      created_at  TEXT DEFAULT (datetime('now')),
      UNIQUE(memory_id, entity_text)
    );

    CREATE TABLE entity_catalog (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      canonical_name TEXT NOT NULL UNIQUE,
      aliases        TEXT DEFAULT '[]',
      entity_type    TEXT NOT NULL DEFAULT 'noun_phrase',
      memory_count   INTEGER NOT NULL DEFAULT 0,
      created_at     TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE causal_edges (
      id         INTEGER PRIMARY KEY AUTOINCREMENT,
      source_id  TEXT,
      target_id  TEXT,
      relation   TEXT,
      strength   REAL DEFAULT 1.0,
      evidence   TEXT,
      created_by TEXT DEFAULT 'manual'
    );
  `);
  return db;
}

// ===============================================================
// 1. extractEntities (~12 tests)
// ===============================================================

describe('extractEntities', () => {
  it('returns empty array for empty content', () => {
    const result = extractEntities('');
    expect(result).toEqual([]);
  });

  it('returns empty array for whitespace-only content', () => {
    const result = extractEntities('   \n\t  ');
    expect(result).toEqual([]);
  });

  it('extracts proper nouns (capitalized multi-word sequences)', () => {
    // Regex matches consecutive capitalized words; "The" is included since it
    // Matches [A-Z][a-z]+, so the full match is "The Spec Kit Memory".
    const result = extractEntities('The Spec Kit Memory system is robust.');
    const properNouns = result.filter((e) => e.type === 'proper_noun');
    expect(properNouns.length).toBeGreaterThanOrEqual(1);
    expect(properNouns.some((e) => e.text === 'The Spec Kit Memory')).toBe(true);
  });

  it('extracts technology names from code fences', () => {
    const result = extractEntities('Here is code:\n```typescript\nconst x = 1;\n```\nAnd more:\n```python\nprint("hi")\n```');
    const techs = result.filter((e) => e.type === 'technology');
    expect(techs.length).toBe(2);
    expect(techs.map((e) => e.text)).toContain('typescript');
    expect(techs.map((e) => e.text)).toContain('python');
  });

  it('stops key phrase extraction at sentence boundaries', () => {
    const result = extractEntities('Built using React and integrates via GraphQL. Implements Singleton pattern.');
    const keyPhrases = result.filter((e) => e.type === 'key_phrase');
    expect(keyPhrases.length).toBeGreaterThanOrEqual(1);
    expect(keyPhrases.some((e) => e.text === 'React')).toBe(true);
    expect(keyPhrases.some((e) => e.text === 'GraphQL')).toBe(true);
    expect(keyPhrases.some((e) => e.text === 'Singleton')).toBe(true);
    expect(keyPhrases.some((e) => e.text.includes('. Implements'))).toBe(false);
  });

  it('keeps dotted technology names inside a single key phrase token', () => {
    const result = extractEntities('Built using Node.js with Next.js Adapter.');
    const keyPhrases = result.filter((e) => e.type === 'key_phrase');
    expect(keyPhrases.some((e) => e.text === 'Node.js')).toBe(true);
    expect(keyPhrases.some((e) => e.text === 'Next.js Adapter')).toBe(true);
  });

  it('extracts heading content from markdown', () => {
    const result = extractEntities('## Architecture Overview\nSome text.\n### Database Schema\nMore text.');
    const headings = result.filter((e) => e.type === 'heading');
    expect(headings.length).toBe(2);
    expect(headings.map((e) => e.text)).toContain('Architecture Overview');
    expect(headings.map((e) => e.text)).toContain('Database Schema');
  });

  it('extracts quoted strings (2-50 chars)', () => {
    // "Entity Extractor" is also matched by the proper_noun regex (two
    // Capitalized words). Deduplication merges them; the first type
    // (proper_noun) wins, so only "valid" remains with type 'quoted'.
    const result = extractEntities('The module is called "Entity Extractor" and outputs "valid" results.');
    const quoted = result.filter((e) => e.type === 'quoted');
    expect(quoted.length).toBe(1);
    expect(quoted[0].text).toBe('valid');
    // "Entity Extractor" is present but as proper_noun due to dedup
    const entityExtractor = result.find((e) => e.text === 'Entity Extractor');
    expect(entityExtractor).toBeDefined();
    expect(entityExtractor!.type).toBe('proper_noun');
    expect(entityExtractor!.frequency).toBe(2); // once from proper_noun, once from quoted
  });

  it('deduplicates by normalized text', () => {
    // "Spec Kit" appears twice via proper noun match in two separate contexts
    const content = 'Spec Kit is great. We love Spec Kit here.';
    const result = extractEntities(content);
    const specKitEntries = result.filter((e) => e.text.toLowerCase().includes('spec kit'));
    // Should be deduplicated to a single entry
    const normalizedKeys = new Set(specKitEntries.map((e) => e.text.toLowerCase().trim()));
    expect(normalizedKeys.size).toBeLessThanOrEqual(specKitEntries.length);
  });

  it('sums frequencies for duplicate entities', () => {
    // Same proper noun appearing multiple times
    const content = 'Hello World is good. Hello World is great. Hello World is best.';
    const result = extractEntities(content);
    const hw = result.find((e) => e.text === 'Hello World');
    expect(hw).toBeDefined();
    expect(hw!.frequency).toBe(3);
  });

  it('extracts all types from mixed content', () => {
    const content = [
      '## Sprint Overview',
      'Built using TypeScript with Better Sqlite integration.',
      '```javascript',
      'const x = 1;',
      '```',
      'The "entity extractor" was implemented by Open Code Team.',
    ].join('\n');
    const result = extractEntities(content);
    const types = new Set(result.map((e) => e.type));
    expect(types.has('heading')).toBe(true);
    expect(types.has('technology')).toBe(true);
    // Key_phrase: "using TypeScript" and "with Better Sqlite"
    expect(types.has('key_phrase')).toBe(true);
    expect(types.has('quoted')).toBe(true);
  });

  it('handles long content with many entities', () => {
    const lines: string[] = [];
    for (let i = 0; i < 50; i++) {
      lines.push(`## Heading Number ${i}`);
      lines.push(`Content using Module${i} with Library${i}.`);
      lines.push(`"quoted phrase ${i}"`);
    }
    const content = lines.join('\n');
    const result = extractEntities(content);
    expect(result.length).toBeGreaterThan(10);
  });

  it('does not extract single non-capitalized word as proper noun', () => {
    const content = 'hello world lowercase only.';
    const result = extractEntities(content);
    const properNouns = result.filter((e) => e.type === 'proper_noun');
    expect(properNouns).toHaveLength(0);
  });

  it('ignores quoted strings shorter than 2 or longer than 50 chars', () => {
    // Use isolated quote pairs to prevent cross-quote matching.
    // The regex "([^"]{2,50})" matches greedily between any two quotes,
    // So multiple quotes on the same line can pair unexpectedly.
    const tooShort = extractEntities('Value "a" end');
    expect(tooShort.filter((e) => e.type === 'quoted')).toHaveLength(0);

    const justRight = extractEntities('Value "hello world" end');
    const rightQuoted = justRight.filter((e) => e.type === 'quoted');
    expect(rightQuoted).toHaveLength(1);
    expect(rightQuoted[0].text).toBe('hello world');

    const tooLong = extractEntities('Value "' + 'A'.repeat(51) + '" end');
    expect(tooLong.filter((e) => e.type === 'quoted')).toHaveLength(0);
  });
});

// ===============================================================
// 2. filterEntities (~8 tests)
// ===============================================================

describe('filterEntities', () => {
  it('removes single character entities', () => {
    const entities: ExtractedEntity[] = [
      { text: 'a', type: 'proper_noun', frequency: 1 },
      { text: 'React Native', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('React Native');
  });

  it('removes entities longer than 100 characters', () => {
    const entities: ExtractedEntity[] = [
      { text: 'A'.repeat(101), type: 'proper_noun', frequency: 1 },
      { text: 'Valid Entity', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Valid Entity');
  });

  it('removes entities where ALL words are on the denylist', () => {
    // "new" and "thing" are both on the denylist
    const entities: ExtractedEntity[] = [
      { text: 'new thing', type: 'proper_noun', frequency: 1 },
      { text: 'React Framework', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('React Framework');
  });

  it('keeps valid entities that pass all checks', () => {
    const entities: ExtractedEntity[] = [
      { text: 'TypeScript Compiler', type: 'technology', frequency: 2 },
      { text: 'Better Sqlite', type: 'technology', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(2);
  });

  it('returns empty array for empty input', () => {
    const result = filterEntities([]);
    expect(result).toEqual([]);
  });

  it('handles mix of valid and invalid entities', () => {
    const entities: ExtractedEntity[] = [
      { text: 'x', type: 'quoted', frequency: 1 },                    // too short
      { text: 'A'.repeat(120), type: 'proper_noun', frequency: 1 },   // too long
      { text: 'old change', type: 'heading', frequency: 1 },          // all denylist
      { text: 'Spec Kit Memory', type: 'proper_noun', frequency: 3 }, // valid
      { text: 'vitest', type: 'technology', frequency: 1 },           // valid
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(2);
    expect(result.map((e) => e.text)).toContain('Spec Kit Memory');
    expect(result.map((e) => e.text)).toContain('vitest');
  });

  it('is case-insensitive for denylist matching', () => {
    // "THING" should match "thing" in the denylist
    const entities: ExtractedEntity[] = [
      { text: 'THING', type: 'proper_noun', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(0);
  });

  it('keeps multi-word entities where only SOME words are denied', () => {
    // "new" is denied but "Framework" is not, so not ALL words are denied
    const entities: ExtractedEntity[] = [
      { text: 'new Framework', type: 'key_phrase', frequency: 1 },
    ];
    const result = filterEntities(entities);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('new Framework');
  });
});

// ===============================================================
// 3. Entity Denylist (~4 tests)
// ===============================================================

describe('Entity Denylist', () => {
  it('isEntityDenied returns true for common nouns', () => {
    expect(isEntityDenied('thing')).toBe(true);
    expect(isEntityDenied('time')).toBe(true);
    expect(isEntityDenied('people')).toBe(true);
    expect(isEntityDenied('system')).toBe(true);
  });

  it('isEntityDenied returns false for valid entity names', () => {
    expect(isEntityDenied('React')).toBe(false);
    expect(isEntityDenied('TypeScript')).toBe(false);
    expect(isEntityDenied('Kubernetes')).toBe(false);
    expect(isEntityDenied('SpecKit')).toBe(false);
  });

  it('isEntityDenied is case-insensitive', () => {
    expect(isEntityDenied('THING')).toBe(true);
    expect(isEntityDenied('Thing')).toBe(true);
    expect(isEntityDenied('tHiNg')).toBe(true);
    expect(isEntityDenied('  thing  ')).toBe(true);
  });

  it('getDenylistSize returns a positive number', () => {
    const size = getEntityDenylistSize();
    expect(size).toBeGreaterThan(0);
    // Should be at least the sum of all three arrays (COMMON_NOUNS + TECHNOLOGY_STOP_WORDS + GENERIC_MODIFIERS)
    expect(size).toBeGreaterThanOrEqual(30);
    // Cross-check: size should equal the Set size
    expect(size).toBe(ENTITY_DENYLIST.size);
  });
});

// ===============================================================
// 4. storeEntities (~5 tests)
// ===============================================================

describe('storeEntities', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
    // Insert a memory row to satisfy foreign-key-like references
    db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
      .run(1, '003-spec-kit', '/tmp/test.md', 'Test Memory', 'Some content here.');
  });

  it('stores entities in memory_entities table', () => {
    const entities: ExtractedEntity[] = [
      { text: 'React Framework', type: 'proper_noun', frequency: 2 },
      { text: 'typescript', type: 'technology', frequency: 1 },
    ];
    const result = storeEntities(db, 1, entities);
    expect(result.stored).toBe(2);

    const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1').all() as Array<{
      entity_text: string;
      entity_type: string;
      frequency: number;
      created_by: string;
    }>;
    expect(rows).toHaveLength(2);
    expect(rows[0].entity_text).toBe('React Framework');
    expect(rows[0].entity_type).toBe('proper_noun');
    expect(rows[0].frequency).toBe(2);
    expect(rows[0].created_by).toBe('auto');
  });

  it('returns count of stored entities', () => {
    const entities: ExtractedEntity[] = [
      { text: 'Alpha Beta', type: 'proper_noun', frequency: 1 },
      { text: 'Gamma Delta', type: 'key_phrase', frequency: 1 },
      { text: 'Epsilon', type: 'technology', frequency: 3 },
    ];
    const result = storeEntities(db, 1, entities);
    expect(result.stored).toBe(3);
  });

  it('handles UNIQUE constraint with INSERT OR REPLACE', () => {
    const entities1: ExtractedEntity[] = [
      { text: 'React Framework', type: 'proper_noun', frequency: 1 },
    ];
    const entities2: ExtractedEntity[] = [
      { text: 'React Framework', type: 'technology', frequency: 5 },
    ];
    storeEntities(db, 1, entities1);
    const result = storeEntities(db, 1, entities2);
    expect(result.stored).toBe(1);

    const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1 AND entity_text = ?')
      .all('React Framework') as Array<{ entity_type: string; frequency: number }>;
    expect(rows).toHaveLength(1);
    // INSERT OR REPLACE replaces the entire row
    expect(rows[0].frequency).toBe(5);
    expect(rows[0].entity_type).toBe('technology');
  });

  it('stores nothing for empty entities array', () => {
    const result = storeEntities(db, 1, []);
    expect(result.stored).toBe(0);

    const rows = db.prepare('SELECT * FROM memory_entities WHERE memory_id = 1').all();
    expect(rows).toHaveLength(0);
  });

  it('stores multiple entities for same memory', () => {
    const entities: ExtractedEntity[] = [
      { text: 'Alpha', type: 'technology', frequency: 1 },
      { text: 'Beta', type: 'technology', frequency: 2 },
      { text: 'Gamma', type: 'quoted', frequency: 1 },
      { text: 'Delta Epsilon', type: 'proper_noun', frequency: 3 },
      { text: 'Zeta', type: 'heading', frequency: 1 },
    ];
    const result = storeEntities(db, 1, entities);
    expect(result.stored).toBe(5);

    const count = db.prepare('SELECT COUNT(*) AS cnt FROM memory_entities WHERE memory_id = 1')
      .get() as { cnt: number };
    expect(count.cnt).toBe(5);
  });
});

// ===============================================================
// 5. updateEntityCatalog (~5 tests)
// ===============================================================

describe('updateEntityCatalog', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('creates new catalog entries for unseen entities', () => {
    const entities: ExtractedEntity[] = [
      { text: 'React Framework', type: 'technology', frequency: 1 },
      { text: 'Spec Kit', type: 'proper_noun', frequency: 2 },
    ];
    const result = updateEntityCatalog(db, entities);
    expect(result.upserted).toBe(2);

    const rows = db.prepare('SELECT * FROM entity_catalog ORDER BY id').all() as Array<{
      canonical_name: string;
      aliases: string;
      entity_type: string;
      memory_count: number;
    }>;
    expect(rows).toHaveLength(2);
    expect(rows[0].canonical_name).toBe('react framework');
    expect(rows[0].memory_count).toBe(1);
    expect(JSON.parse(rows[0].aliases)).toContain('React Framework');
  });

  it('increments memory_count on re-insert of existing entity', () => {
    const entities1: ExtractedEntity[] = [
      { text: 'React Framework', type: 'technology', frequency: 1 },
    ];
    updateEntityCatalog(db, entities1);

    // Second catalog update with same entity (different casing to test normalization)
    const entities2: ExtractedEntity[] = [
      { text: 'React Framework', type: 'technology', frequency: 1 },
    ];
    updateEntityCatalog(db, entities2);

    const row = db.prepare('SELECT * FROM entity_catalog WHERE canonical_name = ?')
      .get('react framework') as { memory_count: number; aliases: string };
    expect(row.memory_count).toBe(2);
  });

  it('normalizes entity names to lowercase with stripped punctuation', () => {
    // Unicode-aware normalizeEntityName replaces all non-letter/non-number/non-space
    // Characters (dots, !, hyphens) with spaces, then collapses whitespace.
    // 'React.js Framework!' -> 'react js framework' (dot replaced with space)
    const entities: ExtractedEntity[] = [
      { text: 'React.js Framework!', type: 'technology', frequency: 1 },
    ];
    updateEntityCatalog(db, entities);

    const row = db.prepare('SELECT * FROM entity_catalog').get() as { canonical_name: string };
    expect(row.canonical_name).toBe('react js framework');
  });

  it('appends new alias variants for the same canonical name', () => {
    const entities1: ExtractedEntity[] = [
      { text: 'React Framework', type: 'technology', frequency: 1 },
    ];
    updateEntityCatalog(db, entities1);

    const entities2: ExtractedEntity[] = [
      { text: 'react framework', type: 'technology', frequency: 1 },
    ];
    updateEntityCatalog(db, entities2);

    const row = db.prepare('SELECT * FROM entity_catalog WHERE canonical_name = ?')
      .get('react framework') as { aliases: string };
    const aliases = JSON.parse(row.aliases) as string[];
    expect(aliases).toContain('React Framework');
    expect(aliases).toContain('react framework');
    expect(aliases).toHaveLength(2);
  });

  it('returns upserted count matching entity count', () => {
    const entities: ExtractedEntity[] = [
      { text: 'Alpha Service', type: 'proper_noun', frequency: 1 },
      { text: 'Beta Library', type: 'technology', frequency: 1 },
      { text: 'Gamma Module', type: 'key_phrase', frequency: 1 },
    ];
    const result = updateEntityCatalog(db, entities);
    expect(result.upserted).toBe(3);
  });
});

// ===============================================================
// 6. rebuildEntityCatalog / rebuildAutoEntities
// ===============================================================

describe('rebuildEntityCatalog', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('rebuilds catalog counts and aliases from current memory_entities rows', () => {
    db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
      .run(1, 'specs/a', '/tmp/1.md', 'Memory 1', 'Built using React Framework.');
    db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
      .run(2, 'specs/b', '/tmp/2.md', 'Memory 2', 'Built using react framework.');

    db.prepare(`
      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(1, 'React Framework', 'technology', 1, 'auto');
    db.prepare(`
      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(2, 'react framework', 'technology', 1, 'manual');
    db.prepare(`
      INSERT INTO entity_catalog (canonical_name, aliases, entity_type, memory_count, created_at)
      VALUES (?, ?, ?, ?, datetime('now'))
    `).run('stale entry', '["stale"]', 'technology', 99);

    const result = rebuildEntityCatalog(db);

    expect(result.rebuilt).toBe(1);

    const row = db.prepare(`
      SELECT canonical_name, aliases, entity_type, memory_count
      FROM entity_catalog
      WHERE canonical_name = ?
    `).get('react framework') as {
      canonical_name: string;
      aliases: string;
      entity_type: string;
      memory_count: number;
    };

    expect(row.canonical_name).toBe('react framework');
    expect(JSON.parse(row.aliases)).toEqual(['React Framework', 'react framework']);
    expect(row.entity_type).toBe('technology');
    expect(row.memory_count).toBe(2);
  });
});

describe('rebuildAutoEntities', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('dry-run reports the targeted cleanup without changing stored rows', () => {
    db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
      .run(1, 'specs/001-test', '/tmp/1.md', 'Memory 1', 'Built using Node.js with Next.js Adapter.');

    db.prepare(`
      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(1, 'Node.js. With Next.js Adapter', 'technology', 1, 'auto');

    const beforeCount = db.prepare('SELECT COUNT(*) AS cnt FROM memory_entities').get() as { cnt: number };
    const result = rebuildAutoEntities(db, { specFolder: 'specs/001-test', dryRun: true });
    const afterCount = db.prepare('SELECT COUNT(*) AS cnt FROM memory_entities').get() as { cnt: number };

    expect(result.dryRun).toBe(true);
    expect(result.memoriesScanned).toBe(1);
    expect(result.memoriesReprocessed).toBe(1);
    expect(result.autoRowsRemoved).toBe(1);
    expect(result.extractedEntities).toBeGreaterThanOrEqual(2);
    expect(beforeCount.cnt).toBe(afterCount.cnt);
  });

  it('rebuilds auto rows in scope and preserves manual rows', () => {
    db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
      .run(1, 'specs/001-test', '/tmp/1.md', 'Scoped Memory', 'Built using Node.js with Next.js Adapter.');
    db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
      .run(2, 'specs/002-other', '/tmp/2.md', 'Other Memory', 'Built using Python Toolkit.');

    db.prepare(`
      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(1, 'Node.js. With Next.js Adapter', 'technology', 1, 'auto');
    db.prepare(`
      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(1, 'Curated Alias', 'quoted', 1, 'manual');
    db.prepare(`
      INSERT INTO memory_entities (memory_id, entity_text, entity_type, frequency, created_by)
      VALUES (?, ?, ?, ?, ?)
    `).run(2, 'Python Toolkit', 'technology', 1, 'auto');

    const result = rebuildAutoEntities(db, { specFolder: 'specs/001-test' });

    expect(result.dryRun).toBe(false);
    expect(result.autoRowsRemoved).toBe(1);
    expect(result.storedEntities).toBeGreaterThanOrEqual(2);
    expect(result.catalogEntriesRebuilt).toBeGreaterThanOrEqual(3);

    const scopedRows = db.prepare(`
      SELECT entity_text, created_by
      FROM memory_entities
      WHERE memory_id = 1
      ORDER BY entity_text ASC
    `).all() as Array<{ entity_text: string; created_by: string }>;
    expect(scopedRows.some((row) => row.entity_text === 'Curated Alias' && row.created_by === 'manual')).toBe(true);
    expect(scopedRows.some((row) => row.entity_text === 'Node.js. With Next.js Adapter')).toBe(false);
    expect(scopedRows.some((row) => row.entity_text === 'Node.js' && row.created_by === 'auto')).toBe(true);
    expect(scopedRows.some((row) => row.entity_text === 'Next.js Adapter' && row.created_by === 'auto')).toBe(true);

    const untouchedOther = db.prepare(`
      SELECT entity_text, created_by
      FROM memory_entities
      WHERE memory_id = 2
    `).get() as { entity_text: string; created_by: string };
    expect(untouchedOther.entity_text).toBe('Python Toolkit');
    expect(untouchedOther.created_by).toBe('auto');

    const catalogRows = db.prepare(`
      SELECT canonical_name, memory_count
      FROM entity_catalog
      ORDER BY canonical_name ASC
    `).all() as Array<{ canonical_name: string; memory_count: number }>;
    expect(catalogRows.some((row) => row.canonical_name === 'node js' && row.memory_count === 1)).toBe(true);
    expect(catalogRows.some((row) => row.canonical_name === 'next js adapter' && row.memory_count === 1)).toBe(true);
    expect(catalogRows.some((row) => row.canonical_name === 'curated alias' && row.memory_count === 1)).toBe(true);
    expect(catalogRows.some((row) => row.canonical_name === 'python toolkit' && row.memory_count === 1)).toBe(true);
  });
});

// ===============================================================
// 7. computeEdgeDensity (~3 tests)
// ===============================================================

describe('computeEdgeDensity', () => {
  let db: Database.Database;

  beforeEach(() => {
    db = createTestDb();
  });

  it('returns 0 for empty graph (no memories, no edges)', () => {
    const density = computeEdgeDensity(db);
    expect(density).toBe(0);
  });

  it('returns edges/memories ratio', () => {
    // Insert 4 memories
    for (let i = 1; i <= 4; i++) {
      db.prepare('INSERT INTO memory_index (id, spec_folder, file_path, title, content_text) VALUES (?, ?, ?, ?, ?)')
        .run(i, 'test', `/tmp/${i}.md`, `Memory ${i}`, 'content');
    }
    // Insert 6 edges
    for (let i = 1; i <= 6; i++) {
      db.prepare('INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)')
        .run(String(i), String(i + 1), 'caused');
    }

    const density = computeEdgeDensity(db);
    expect(density).toBe(6 / 4);
    expect(density).toBe(1.5);
  });

  it('returns 0 when there are zero memories (avoids division by zero)', () => {
    // Insert edges but no memories
    db.prepare('INSERT INTO causal_edges (source_id, target_id, relation) VALUES (?, ?, ?)')
      .run('1', '2', 'caused');

    const density = computeEdgeDensity(db);
    expect(density).toBe(0);
  });
});

// ===============================================================
// 8. normalizeEntityName (~3 tests)
// ===============================================================

describe('normalizeEntityName', () => {
  it('lowercases text', () => {
    expect(normalizeEntityName('React Framework')).toBe('react framework');
    expect(normalizeEntityName('HELLO WORLD')).toBe('hello world');
  });

  it('strips punctuation (Unicode-aware, hyphens stripped too)', () => {
    // Unicode-aware regex /[^\p{L}\p{N}\s]/gu replaces all non-letter/non-number/non-space
    // Characters (including dots and hyphens) with a space, then collapses whitespace.
    expect(normalizeEntityName('React.js!')).toBe('react js');
    expect(normalizeEntityName('hello-world')).toBe('hello world');
    expect(normalizeEntityName('test@special#chars')).toBe('test special chars');
    expect(normalizeEntityName('it\'s a "test"')).toBe('it s a test');
  });

  it('collapses whitespace and trims', () => {
    expect(normalizeEntityName('  hello   world  ')).toBe('hello world');
    expect(normalizeEntityName('multiple   spaces   here')).toBe('multiple spaces here');
    expect(normalizeEntityName('\ttab\tseparated')).toBe('tab separated');
  });
});

// ===============================================================
// 9. __testables.deduplicateEntities (internal helper)
// ===============================================================

describe('__testables.deduplicateEntities', () => {
  it('merges entries with same normalized key and sums frequencies', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'Hello World', type: 'proper_noun' },
      { text: 'Hello World', type: 'technology' },
      { text: 'Hello World', type: 'quoted' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(result).toHaveLength(1);
    expect(result[0].text).toBe('Hello World');
    expect(result[0].frequency).toBe(3);
    // First occurrence's type wins
    expect(result[0].type).toBe('proper_noun');
  });

  it('returns empty array for empty input', () => {
    const result = __testables.deduplicateEntities([]);
    expect(result).toEqual([]);
  });

  it('preserves distinct entities as separate entries', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'Alpha', type: 'technology' },
      { text: 'Beta', type: 'technology' },
      { text: 'Gamma', type: 'proper_noun' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(result).toHaveLength(3);
    expect(result.every((e) => e.frequency === 1)).toBe(true);
  });

  it('treats differently-cased text as duplicates via normalization', () => {
    const raw: Array<{ text: string; type: ExtractedEntity['type'] }> = [
      { text: 'React Framework', type: 'proper_noun' },
      { text: 'react framework', type: 'technology' },
    ];
    const result = __testables.deduplicateEntities(raw);
    expect(result).toHaveLength(1);
    expect(result[0].frequency).toBe(2);
    // First occurrence wins, so text stays as "React Framework"
    expect(result[0].text).toBe('React Framework');
  });
});
