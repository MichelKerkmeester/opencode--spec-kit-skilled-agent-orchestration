// ───────────────────────────────────────────────────────────────
// 1. MEMORY PARSER EXTENDED TESTS
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as path from 'path';
import * as fs from 'fs';
import * as os from 'os';
import * as mod from '../lib/parsing/memory-parser';

// TEST: MEMORY PARSER - EXTENDED (UNTESTED EXPORTS)
// Covers: readFileWithEncoding, parseMemoryFile, extractSpecFolder,
// IsMemoryFile, validateParsedMemory, findMemoryFiles,
// ExtractCausalLinks, hasCausalLinks, MEMORY_FILE_PATTERN,
//         CONTEXT_TYPE_MAP
/* ───────────────────────────────────────────────────────────────
   TEMP DIRECTORY HELPERS
──────────────────────────────────────────────────────────────── */

let tmpRoot: string = '';
type ParsedMemory = mod.ParsedMemory;
type ContextType = mod.ContextType;
type CausalLinks = mod.CausalLinks;

const EMPTY_CAUSAL_LINKS: CausalLinks = {
  caused_by: [],
  supersedes: [],
  derived_from: [],
  blocks: [],
  related_to: [],
};

function createParsedMemory(overrides: Partial<ParsedMemory>): ParsedMemory {
  return {
    filePath: '/specs/003/memory/f.md',
    specFolder: '003-test',
    title: 'Test Memory',
    triggerPhrases: ['test'],
    contextType: 'implementation',
    importanceTier: 'normal',
    contentHash: 'abc123',
    content: 'This is some valid content that is long enough.',
    fileSize: 47,
    lastModified: new Date().toISOString(),
    memoryType: 'declarative',
    memoryTypeSource: 'default',
    memoryTypeConfidence: 0.5,
    causalLinks: EMPTY_CAUSAL_LINKS,
    hasCausalLinks: false,
    documentType: 'memory',
    qualityScore: 0.8,
    qualityFlags: [],
    ...overrides,
  };
}

function createTmpWorkspace(): string {
  tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'mem-parser-ext-'));
  return tmpRoot;
}

/** Create a spec memory directory structure and return the memory dir path */
function createSpecMemoryDir(specName: string, subFolder?: string): string {
  const parts = subFolder
    ? ['specs', specName, subFolder, 'memory']
    : ['specs', specName, 'memory'];
  const memDir = path.join(tmpRoot, ...parts);
  fs.mkdirSync(memDir, { recursive: true });
  return memDir;
}

function writeFile(dir: string, filename: string, content: string): string {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, content, 'utf-8');
  return filePath;
}

function writeFileBuffer(dir: string, filename: string, buffer: Buffer): string {
  const filePath = path.join(dir, filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

function cleanup() {
  if (tmpRoot && fs.existsSync(tmpRoot)) {
    fs.rmSync(tmpRoot, { recursive: true, force: true });
  }
}

/* ───────────────────────────────────────────────────────────────
   SAMPLE CONTENT
──────────────────────────────────────────────────────────────── */

const COMPLETE_MEMORY = `---
title: "Session Context - Feature Implementation"
importanceTier: important
contextType: implementation
triggerPhrases: ["feature work", "session context"]
---

# Session Context - Feature Implementation

> Session type: implementation

## Summary

Implemented the widget feature with proper error handling.

## Trigger Phrases

- feature work
- session context

<!-- ANCHOR:decisions -->
Used SQLite for persistence.
<!-- /ANCHOR:decisions -->
`;

const MINIMAL_MEMORY = `# Quick Note

Brief content here about a decision.
`;

const MALFORMED_MEMORY = `---
title:
importanceTier: [bogus
---

No heading, some content.
`;

const CAUSAL_LINKS_CONTENT = `---
title: "Memory with Causal Links"
importanceTier: normal
causalLinks:
  caused_by:
    - "memory-001"
    - "memory-002"
  supersedes:
    - "memory-003"
  derived_from:
    - "memory-004"
  blocks:
  related_to:
    - "memory-005"
---

# Memory with Causal Links

Content goes here.
`;

const CAUSAL_LINKS_INLINE = `---
title: "Inline Causal"
causalLinks:
  caused_by: ["mem-A", "mem-B"]
  supersedes: []
  derived_from: ["mem-C"]
  blocks: []
  related_to: []
---

# Inline Causal

Content.
`;

/* ───────────────────────────────────────────────────────────────
   TEST SUITES
──────────────────────────────────────────────────────────────── */

describe('MEMORY PARSER EXTENDED TESTS', () => {
  beforeAll(() => {
    createTmpWorkspace();
  });

  afterAll(() => {
    cleanup();
  });

  // ───────────────────────────────────────────────────────────────
  // 4.1 MEMORY_FILE_PATTERN
  // ───────────────────────────────────────────────────────────────
  describe('MEMORY_FILE_PATTERN', () => {
    const regex: RegExp = mod.MEMORY_FILE_PATTERN;

    it('T01: matches specs/NNN-name/memory/file.md', () => {
      const p = 'specs/003-feature/memory/context.md';
      expect(regex.test(p)).toBe(true);
    });

    it('T02: matches nested sub-folder memory path', () => {
      const p = 'specs/003-feature/001-sub/memory/note.md';
      expect(regex.test(p)).toBe(true);
    });

    it('T03: accepts .txt file in memory dir (txt support)', () => {
      const p = 'specs/003-feature/memory/file.txt';
      expect(regex.test(p)).toBe(true);
    });

    it('T04: rejects .md outside memory/ dir', () => {
      const p = 'specs/003-feature/scratch/notes.md';
      expect(regex.test(p)).toBe(false);
    });

    it('T05: rejects path without specs/ prefix', () => {
      const p = 'other/003-feature/memory/file.md';
      expect(regex.test(p)).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.2 CONTEXT_TYPE_MAP
  // ───────────────────────────────────────────────────────────────
  describe('CONTEXT_TYPE_MAP', () => {
    const map = mod.CONTEXT_TYPE_MAP;

    it('T06: canonical types map to themselves', () => {
      const canonicals: ContextType[] = ['implementation', 'research', 'planning', 'general'];
      const allSelfMap = canonicals.every(k => map[k] === k);
      expect(allSelfMap).toBe(true);
    });

    it('T07: aliases map to correct canonical types', () => {
      const aliases = { debug: 'implementation', analysis: 'research', decision: 'planning', discovery: 'general', bug: 'implementation' };
      const allCorrect = Object.entries(aliases).every(([k, v]) => map[k] === v);
      expect(allCorrect).toBe(true);
    });

    it('T08: all map values are valid ContextType', () => {
      const validTypes = new Set<ContextType>(['implementation', 'research', 'planning', 'general']);
      const allValid = Object.values(map).every((v) => validTypes.has(v));
      expect(allValid).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.3 readFileWithEncoding
  // ───────────────────────────────────────────────────────────────
  describe('readFileWithEncoding', () => {
    let memDir: string;

    beforeAll(() => {
      memDir = createSpecMemoryDir('010-encoding');
    });

    it('T09: reads valid UTF-8 file', () => {
      const fp = writeFile(memDir, 'utf8.md', '# Hello World\n\nContent here.');
      const result = mod.readFileWithEncoding(fp);
      expect(result).toContain('# Hello World');
      expect(result).toContain('Content here.');
    });

    it('T10: throws on missing file', () => {
      expect(() => {
        mod.readFileWithEncoding(path.join(memDir, 'nonexistent.md'));
      }).toThrow();
    });

    it('T11: strips UTF-8 BOM correctly', () => {
      const bom = Buffer.from([0xEF, 0xBB, 0xBF]);
      const content = Buffer.from('# BOM Content\n\nText after BOM.', 'utf-8');
      const fp = writeFileBuffer(memDir, 'bom.md', Buffer.concat([bom, content]));
      const result = mod.readFileWithEncoding(fp);
      expect(result.startsWith('#')).toBe(true);
      expect(result).toContain('BOM Content');
    });

    it('T12: handles binary/unusual file without crash', () => {
      const binaryBuf = Buffer.from([0x00, 0x01, 0x02, 0xFF, 0xFE, 0x48, 0x00, 0x69, 0x00]);
      const fp = writeFileBuffer(memDir, 'binary.md', binaryBuf);
      const result = mod.readFileWithEncoding(fp);
      expect(typeof result).toBe('string');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.4 extractSpecFolder
  // ───────────────────────────────────────────────────────────────
  describe('extractSpecFolder', () => {
    it('T13: extracts from standard specs path', () => {
      const result = mod.extractSpecFolder('/project/specs/003-auth/memory/session.md');
      expect(result).toBe('003-auth');
    });

    it('T14: extracts nested sub-folder path', () => {
      const result = mod.extractSpecFolder('/project/specs/003-auth/001-login/memory/context.md');
      expect(result).toBe('003-auth/001-login');
    });

    it('T15: handles backslash Windows paths', () => {
      const result = mod.extractSpecFolder('C:\\project\\specs\\005-deploy\\memory\\note.md');
      expect(result).toBe('005-deploy');
    });

    it('T16: returns fallback for non-standard path', () => {
      const result = mod.extractSpecFolder('/some/random/path/memory/file.md');
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    // Symlink regression cases
    it('T16b: symlinked specs path resolves to same spec_folder as real path', () => {
      // Create a temp symlink structure
      const symlinkRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'esf-sym-'));
      try {
        const realDir = path.join(symlinkRoot, '.opencode', 'specs', '010-test', 'memory');
        fs.mkdirSync(realDir, { recursive: true });
        fs.writeFileSync(path.join(realDir, 'ctx.md'), 'content');

        const claudeDir = path.join(symlinkRoot, '.claude');
        fs.mkdirSync(claudeDir, { recursive: true });
        fs.symlinkSync(path.join('..', '.opencode', 'specs'), path.join(claudeDir, 'specs'));

        const realPath = path.join(symlinkRoot, '.opencode', 'specs', '010-test', 'memory', 'ctx.md');
        const symPath = path.join(symlinkRoot, '.claude', 'specs', '010-test', 'memory', 'ctx.md');

        expect(mod.extractSpecFolder(realPath)).toBe(mod.extractSpecFolder(symPath));
      } finally {
        fs.rmSync(symlinkRoot, { recursive: true, force: true });
      }
    });

    it('T16c: nested spec folder through symlink matches real path', () => {
      const symlinkRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'esf-nest-'));
      try {
        const realDir = path.join(symlinkRoot, '.opencode', 'specs', '02--domain', '010-test', 'memory');
        fs.mkdirSync(realDir, { recursive: true });
        fs.writeFileSync(path.join(realDir, 'n.md'), 'content');

        const claudeDir = path.join(symlinkRoot, '.claude');
        fs.mkdirSync(claudeDir, { recursive: true });
        fs.symlinkSync(path.join('..', '.opencode', 'specs'), path.join(claudeDir, 'specs'));

        const realPath = path.join(symlinkRoot, '.opencode', 'specs', '02--domain', '010-test', 'memory', 'n.md');
        const symPath = path.join(symlinkRoot, '.claude', 'specs', '02--domain', '010-test', 'memory', 'n.md');

        const specReal = mod.extractSpecFolder(realPath);
        const specSym = mod.extractSpecFolder(symPath);
        expect(specReal).toBe(specSym);
        expect(specReal).toBe('02--domain/010-test');
      } finally {
        fs.rmSync(symlinkRoot, { recursive: true, force: true });
      }
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.5 isMemoryFile
  // ───────────────────────────────────────────────────────────────
  describe('isMemoryFile', () => {
    it('T17: recognizes specs memory .md file', () => {
      expect(mod.isMemoryFile('/project/specs/003-auth/memory/session.md')).toBe(true);
    });

    it('T18: recognizes constitutional memory file', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/constitutional/rules.md')).toBe(true);
    });

    it('T19: rejects non-.md file in memory dir', () => {
      expect(mod.isMemoryFile('/project/specs/003-auth/memory/data.json')).toBe(false);
    });

    it('T20: rejects .md file outside memory/constitutional', () => {
      expect(mod.isMemoryFile('/project/specs/003-auth/scratch/notes.md')).toBe(false);
    });

    it('T21: rejects README.md in constitutional dir', () => {
      expect(mod.isMemoryFile('/project/.opencode/skill/my-skill/constitutional/README.md')).toBe(false);
    });

    it('T22: handles backslash paths for isMemoryFile', () => {
      expect(mod.isMemoryFile('C:\\project\\specs\\003-auth\\memory\\session.md')).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.6 validateParsedMemory
  // ───────────────────────────────────────────────────────────────
  describe('validateParsedMemory', () => {
    it('T23: valid parsed memory passes validation', () => {
      const parsed = createParsedMemory({});
      const result = mod.validateParsedMemory(parsed);
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('T24: missing specFolder triggers error', () => {
      const parsed = createParsedMemory({
        filePath: '/test.md',
        specFolder: '',
        title: null,
        triggerPhrases: [],
        contextType: 'general',
        contentHash: 'abc',
        content: 'Valid content here for testing.',
        fileSize: 30,
      });
      const result = mod.validateParsedMemory(parsed);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('spec folder'))).toBe(true);
    });

    it('T25: content too short triggers error', () => {
      const parsed = createParsedMemory({
        filePath: '/test.md',
        title: 'X',
        triggerPhrases: [],
        contextType: 'general',
        contentHash: 'abc',
        content: 'Hi',
        fileSize: 2,
      });
      const result = mod.validateParsedMemory(parsed);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('too short'))).toBe(true);
    });

    it('T26: content too long triggers error', () => {
      const parsed = createParsedMemory({
        filePath: '/test.md',
        title: 'Big',
        triggerPhrases: [],
        contextType: 'general',
        contentHash: 'abc',
        content: 'x'.repeat(250001),
        fileSize: 250001,
      });
      const result = mod.validateParsedMemory(parsed);
      expect(result.valid).toBe(false);
      expect(result.errors.some((e: string) => e.includes('too long'))).toBe(true);
    });

    it('T27: unclosed anchors produce warnings, not errors', () => {
      const parsed = createParsedMemory({
        filePath: '/test.md',
        title: 'Anchors',
        triggerPhrases: [],
        contextType: 'general',
        contentHash: 'abc',
        content: '<!-- ANCHOR:open -->\nSome content without closing anchor tag. This is long enough.',
        fileSize: 60,
      });
      const result = mod.validateParsedMemory(parsed);
      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.7 extractCausalLinks
  // ───────────────────────────────────────────────────────────────
  describe('extractCausalLinks', () => {
    it('T28: extracts multi-line causal links correctly', () => {
      const result = mod.extractCausalLinks(CAUSAL_LINKS_CONTENT);
      expect(result.caused_by).toHaveLength(2);
      expect(result.caused_by).toContain('memory-001');
      expect(result.caused_by).toContain('memory-002');
      expect(result.supersedes).toHaveLength(1);
      expect(result.supersedes[0]).toBe('memory-003');
      expect(result.derived_from).toHaveLength(1);
      expect(result.derived_from[0]).toBe('memory-004');
      expect(result.blocks).toHaveLength(0);
      expect(result.related_to).toHaveLength(1);
      expect(result.related_to[0]).toBe('memory-005');
    });

    it('T29: extracts inline array causal links', () => {
      const result = mod.extractCausalLinks(CAUSAL_LINKS_INLINE);
      expect(result.caused_by).toHaveLength(2);
      expect(result.caused_by).toContain('mem-A');
      expect(result.derived_from).toHaveLength(1);
      expect(result.derived_from[0]).toBe('mem-C');
    });

    it('T30: returns empty links when no causalLinks block', () => {
      const result = mod.extractCausalLinks('# No Causal Links\n\nJust content.');
      const allEmpty = (Object.values(result) as string[][]).every((arr) => arr.length === 0);
      expect(allEmpty).toBe(true);
    });

    it('T31: returns empty links for empty string', () => {
      const result = mod.extractCausalLinks('');
      const allEmpty = (Object.values(result) as string[][]).every((arr) => arr.length === 0);
      expect(allEmpty).toBe(true);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.8 hasCausalLinks
  // ───────────────────────────────────────────────────────────────
  describe('hasCausalLinks', () => {
    it('T32: returns true when links present', () => {
      const links = { caused_by: ['mem-1'], supersedes: [], derived_from: [], blocks: [], related_to: [] };
      expect(mod.hasCausalLinks(links)).toBe(true);
    });

    it('T33: returns false when all arrays empty', () => {
      const links = { caused_by: [], supersedes: [], derived_from: [], blocks: [], related_to: [] };
      expect(mod.hasCausalLinks(links)).toBe(false);
    });

    it('T34: returns false for null input', () => {
      expect(mod.hasCausalLinks(null)).toBe(false);
    });

    it('T35: returns false for undefined input', () => {
      expect(mod.hasCausalLinks(undefined)).toBe(false);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.9 parseMemoryFile
  // ───────────────────────────────────────────────────────────────
  describe('parseMemoryFile', () => {
    let memDir: string;

    beforeAll(() => {
      memDir = createSpecMemoryDir('020-parse');
    });

    it('T36: parses complete memory file with all fields', () => {
      const fp = writeFile(memDir, 'complete.md', COMPLETE_MEMORY);
      const result = mod.parseMemoryFile(fp);
      expect(result.title).toBe('Session Context - Feature Implementation');
      expect(result.importanceTier).toBe('important');
      expect(result.contextType).toBe('implementation');
      expect(result.specFolder).toBe('020-parse');
      expect(result.triggerPhrases.length).toBeGreaterThanOrEqual(2);
      expect(typeof result.contentHash).toBe('string');
      expect(result.contentHash).toHaveLength(64);
      expect(typeof result.fileSize).toBe('number');
      expect(typeof result.lastModified).toBe('string');
      expect(typeof result.memoryType).toBe('string');
      expect(typeof result.memoryTypeSource).toBe('string');
      expect(typeof result.memoryTypeConfidence).toBe('number');
    });

    it('T37: parses minimal file with sensible defaults', () => {
      const fp = writeFile(memDir, 'minimal.md', MINIMAL_MEMORY);
      const result = mod.parseMemoryFile(fp);
      expect(result.title).toBe('Quick Note');
      expect(result.importanceTier).toBe('normal');
      expect(result.contextType).toBe('general');
      expect(typeof result.content).toBe('string');
      expect(result.content.length).toBeGreaterThan(0);
    });

    it('T38: parses malformed file gracefully', () => {
      const fp = writeFile(memDir, 'malformed.md', MALFORMED_MEMORY);
      const result = mod.parseMemoryFile(fp);
      expect(typeof result).toBe('object');
      expect(result.content).toBeTruthy();
      expect(result.contentHash).toBeTruthy();
    });

    it('T39: throws for nonexistent file', () => {
      expect(() => {
        mod.parseMemoryFile(path.join(memDir, 'ghost.md'));
      }).toThrow();
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 4.10 findMemoryFiles
  // ───────────────────────────────────────────────────────────────
  describe('findMemoryFiles', () => {
    let memDir1: string;
    let memDir2: string;

    beforeAll(() => {
      memDir1 = createSpecMemoryDir('030-find');
      memDir2 = createSpecMemoryDir('031-other');
      writeFile(memDir1, 'context-a.md', '# A\n\nContent A');
      writeFile(memDir1, 'context-b.md', '# B\n\nContent B');
      writeFile(memDir2, 'context-c.md', '# C\n\nContent C');
      // Also write a non-.md file that should be ignored
      writeFile(memDir1, 'data.json', '{"key": "value"}');
      // Write a file in scratch (not memory) that should be ignored
      const scratchDir = path.join(tmpRoot, 'specs', '030-find', 'scratch');
      fs.mkdirSync(scratchDir, { recursive: true });
      writeFile(scratchDir, 'temp.md', '# Temp');
    });

    it('T40: finds all memory .md files', () => {
      const files = mod.findMemoryFiles(tmpRoot);
      const mdFiles = files.filter((f: string) => f.endsWith('.md'));
      expect(mdFiles.length).toBeGreaterThanOrEqual(3);
    });

    it('T41: excludes non-.md files', () => {
      const files = mod.findMemoryFiles(tmpRoot);
      const jsonFiles = files.filter((f: string) => f.endsWith('.json'));
      expect(jsonFiles).toHaveLength(0);
    });

    it('T42: excludes files outside memory/ dirs', () => {
      const files = mod.findMemoryFiles(tmpRoot);
      const scratchFiles = files.filter((f: string) => f.includes('scratch'));
      expect(scratchFiles).toHaveLength(0);
    });

    it('T43: filters by specFolder option', () => {
      const files = mod.findMemoryFiles(tmpRoot, { specFolder: '030-find' });
      expect(files).toHaveLength(2);
      expect(files.every((f: string) => f.includes('030-find'))).toBe(true);
    });

    it('T44: returns empty array for nonexistent workspace', () => {
      const files = mod.findMemoryFiles('/nonexistent/workspace/path');
      expect(Array.isArray(files)).toBe(true);
      expect(files).toHaveLength(0);
    });
  });
});
