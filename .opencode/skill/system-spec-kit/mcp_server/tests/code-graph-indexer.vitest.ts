// ───────────────────────────────────────────────────────────────
// TEST: Code Graph Structural Indexer
// ───────────────────────────────────────────────────────────────
import { describe, it, expect } from 'vitest';
import {
  generateSymbolId,
  generateContentHash,
  detectLanguage,
  getDefaultConfig,
} from '../lib/code-graph/indexer-types.js';
import { parseFile, extractEdges } from '../lib/code-graph/structural-indexer.js';

describe('indexer-types', () => {
  describe('generateSymbolId', () => {
    it('returns a 16-char hex string', () => {
      const id = generateSymbolId('/test.ts', 'myFunc', 'function');
      expect(id).toMatch(/^[a-f0-9]{16}$/);
    });

    it('is deterministic', () => {
      const a = generateSymbolId('/test.ts', 'myFunc', 'function');
      const b = generateSymbolId('/test.ts', 'myFunc', 'function');
      expect(a).toBe(b);
    });

    it('differs for different inputs', () => {
      const a = generateSymbolId('/test.ts', 'myFunc', 'function');
      const b = generateSymbolId('/test.ts', 'otherFunc', 'function');
      expect(a).not.toBe(b);
    });
  });

  describe('generateContentHash', () => {
    it('returns a 12-char hex string', () => {
      const hash = generateContentHash('some content');
      expect(hash).toMatch(/^[a-f0-9]{12}$/);
    });
  });

  describe('detectLanguage', () => {
    it('detects TypeScript', () => {
      expect(detectLanguage('file.ts')).toBe('typescript');
      expect(detectLanguage('file.tsx')).toBe('typescript');
    });

    it('detects JavaScript', () => {
      expect(detectLanguage('file.js')).toBe('javascript');
      expect(detectLanguage('file.mjs')).toBe('javascript');
    });

    it('detects Python', () => {
      expect(detectLanguage('file.py')).toBe('python');
    });

    it('detects Bash', () => {
      expect(detectLanguage('file.sh')).toBe('bash');
    });

    it('returns null for unknown', () => {
      expect(detectLanguage('file.rs')).toBeNull();
      expect(detectLanguage('file.go')).toBeNull();
    });
  });

  describe('getDefaultConfig', () => {
    it('returns valid config', () => {
      const config = getDefaultConfig('/root');
      expect(config.rootDir).toBe('/root');
      expect(config.includeGlobs.length).toBeGreaterThan(0);
      expect(config.excludeGlobs.length).toBeGreaterThan(0);
      expect(config.maxFileSizeBytes).toBe(102400);
    });
  });
});

describe('structural-indexer', () => {
  describe('parseFile - TypeScript', () => {
    it('extracts functions', async () => {
      const content = `export function myFunc(arg: string): void {}\nasync function other() {}`;
      const result = await parseFile('/test.ts', content, 'typescript');
      expect(result.parseHealth).toBe('clean');
      const funcNames = result.nodes.filter(n => n.kind === 'function').map(n => n.name);
      expect(funcNames).toContain('myFunc');
      expect(funcNames).toContain('other');
    });

    it('extracts classes', async () => {
      const content = `export class MyClass extends Base {}`;
      const result = await parseFile('/test.ts', content, 'typescript');
      const classes = result.nodes.filter(n => n.kind === 'class');
      expect(classes.length).toBe(1);
      expect(classes[0].name).toBe('MyClass');
    });

    it('extracts interfaces', async () => {
      const content = `export interface Config { name: string; }`;
      const result = await parseFile('/test.ts', content, 'typescript');
      const ifaces = result.nodes.filter(n => n.kind === 'interface');
      expect(ifaces.length).toBe(1);
      expect(ifaces[0].name).toBe('Config');
    });

    it('extracts imports', async () => {
      const content = `import { readFileSync } from 'node:fs';`;
      const result = await parseFile('/test.ts', content, 'typescript');
      const imports = result.nodes.filter(n => n.kind === 'import');
      expect(imports.length).toBe(1);
      expect(imports[0].name).toBe('readFileSync');
    });

    it('handles empty files', async () => {
      const result = await parseFile('/empty.ts', '', 'typescript');
      expect(result.parseHealth).toBe('recovered');
      expect(result.nodes.length).toBe(0);
    });
  });

  describe('parseFile - Python', () => {
    it('extracts functions and classes', async () => {
      const content = `def hello():\n    pass\n\nclass MyClass:\n    def method(self):\n        pass`;
      const result = await parseFile('/test.py', content, 'python');
      expect(result.nodes.filter(n => n.kind === 'function').length).toBe(1);
      expect(result.nodes.filter(n => n.kind === 'class').length).toBe(1);
      expect(result.nodes.filter(n => n.kind === 'method').length).toBe(1);
    });
  });

  describe('parseFile - Bash', () => {
    it('extracts functions', async () => {
      const content = `#!/bin/bash\nmy_func() {\n  echo hello\n}\nfunction other_func() {\n  echo world\n}`;
      const result = await parseFile('/test.sh', content, 'bash');
      const funcs = result.nodes.filter(n => n.kind === 'function');
      expect(funcs.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('extractEdges', () => {
    it('creates CONTAINS edges for class methods', async () => {
      const content = `class Foo {\n  bar() {}\n}`;
      // We need Python to get methods with parentName
      const pyContent = `class Foo:\n    def bar(self):\n        pass`;
      const result = await parseFile('/test.py', pyContent, 'python');
      expect(result.edges.some(e => e.edgeType === 'CONTAINS')).toBe(true);
    });
  });
});
