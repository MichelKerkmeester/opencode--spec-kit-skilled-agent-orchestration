// ───────────────────────────────────────────────────────────────
// 1. MEMORY PARSER TESTS
// ───────────────────────────────────────────────────────────────
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import * as memoryParser from '../lib/parsing/memory-parser';

/* ───────────────────────────────────────────────────────────────
   TESTS: MEMORY PARSER (T500)
──────────────────────────────────────────────────────────────── */

describe('Memory Parser Tests (T500)', () => {

  // ───────────────────────────────────────────────────────────────
  // 5.1 FRONTMATTER PARSING (T500-01 through T500-05)
  // ───────────────────────────────────────────────────────────────
  describe('Frontmatter Parsing (T500-01 to T500-05)', () => {
    it('T500-01: Valid markdown with frontmatter parses correctly', () => {
      const content = `---
title: "Test Memory"
importanceTier: critical
contextType: implementation
---

# Test Memory

Some content here.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);
      const contextType = memoryParser.extractContextType(content);

      expect(title).toBe('Test Memory');
      expect(tier).toBe('critical');
      expect(contextType).toBe('implementation');
    });

    it('T500-01b: context_type alias is parsed for context type', () => {
      const content = `---
title: "Alias Context Test"
importance_tier: important
context_type: research
---

# Alias Context Test
`;
      const contextType = memoryParser.extractContextType(content);
      expect(contextType).toBe('research');
    });

    it('T500-02: Missing frontmatter handled gracefully', () => {
      const content = `# No Frontmatter Here

Just plain markdown content.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('No Frontmatter Here');
      expect(tier).toBe('normal');
    });

    it('T500-02b: Generic session heading falls back to feature heading', () => {
      const content = `# SESSION SUMMARY

## CONTINUE SESSION

### FEATURE: Add descriptive memory titles for indexing

Implemented the title extraction fallback.
`;

      const title = memoryParser.extractTitle(content);
      expect(title).toBe('Add descriptive memory titles for indexing');
    });

    it('T500-02c: Generic session heading falls back to overview sentence', () => {
      const content = `# SESSION SUMMARY

## 2. OVERVIEW

Improved context indexing so memory entries use specific task-focused titles.

## 3. DETAILED CHANGES

- Added parser fallback logic.
`;

      const title = memoryParser.extractTitle(content);
      expect(title).toBe('Improved context indexing so memory entries use specific task-focused titles.');
    });

    it('T500-03: Empty file returns default/empty result', () => {
      const content = '';
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);
      const triggers = memoryParser.extractTriggerPhrases(content);

      expect(title).toBeNull();
      expect(tier).toBe('normal');
      expect(Array.isArray(triggers)).toBe(true);
      expect(triggers.length).toBe(0);
    });

    it('T500-04: Special characters in frontmatter preserved', () => {
      const content = `---
title: "Memory with special chars: <>&\\"'@#$%"
---

Content here.
`;
      const title = memoryParser.extractTitle(content);
      expect(title).toBeTruthy();
      expect(title).toContain('<>&');
    });

    it('T500-05: Nested frontmatter YAML values', () => {
      const content = `---
title: "Nested Test"
importanceTier: important
contextType: research
---

# Nested Test

Content.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('Nested Test');
      expect(tier).toBe('important');
    });

    it('T500-05b: Tier precedence uses YAML over inline markers and defaults', () => {
      const content = `---
importanceTier: critical
---

# Example

[IMPORTANT]
`;

      const tier = memoryParser.extractImportanceTier(content, { documentType: 'spec' });
      expect(tier).toBe('critical');
    });

    it('T500-05c: Invalid YAML tier falls back to inline marker', () => {
      const content = `---
importanceTier: invalid_tier
---

# Example

[IMPORTANT]
`;

      const tier = memoryParser.extractImportanceTier(content, { documentType: 'spec' });
      expect(tier).toBe('important');
    });

    it('T500-05d: Missing explicit tier falls back to document-type default', () => {
      const content = `# Spec Document Without Tier`;

      const tier = memoryParser.extractImportanceTier(content, { documentType: 'spec' });
      expect(tier).toBe('important');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.2 TRIGGER PHRASE EXTRACTION (T500-06)
  // ───────────────────────────────────────────────────────────────
  describe('Trigger Phrase Extraction (T500-06)', () => {
    it('T500-06a: Inline YAML trigger phrases extracted', () => {
      const contentInline = `---
triggerPhrases: ["save context", "memory save", "persist state"]
---

# Test
`;
      const triggersInline = memoryParser.extractTriggerPhrases(contentInline);

      expect(Array.isArray(triggersInline)).toBe(true);
      expect(triggersInline.length).toBe(3);
      expect(triggersInline).toContain('save context');
      expect(triggersInline).toContain('memory save');
      expect(triggersInline).toContain('persist state');
    });

    it('T500-06b: Multi-line YAML trigger phrases extracted', () => {
      const contentMultiLine = `---
triggerPhrases:
  - "debug workflow"
  - "fix issue"
  - "troubleshoot"
---

# Test
`;
      const triggersMulti = memoryParser.extractTriggerPhrases(contentMultiLine);

      expect(Array.isArray(triggersMulti)).toBe(true);
      expect(triggersMulti.length).toBe(3);
    });

    it('T500-06c: YAML-looking body text does not override frontmatter metadata', () => {
      const content = `---
triggerPhrases: ["frontmatter trigger"]
contextType: implementation
importanceTier: critical
---

# Test

contextType: research
importanceTier: normal
triggerPhrases:
  - body trigger
`;

      expect(memoryParser.extractTriggerPhrases(content)).toEqual(['frontmatter trigger']);
      expect(memoryParser.extractContextType(content)).toBe('implementation');
      expect(memoryParser.extractImportanceTier(content)).toBe('critical');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.3 CONTENT HASH (T500-07 to T500-08)
  // ───────────────────────────────────────────────────────────────
  describe('Content Hash (T500-07 to T500-08)', () => {
    it('T500-07: Content hash computation is consistent', () => {
      const content = 'Some test content for hashing.';
      const hash1 = memoryParser.computeContentHash(content);
      const hash2 = memoryParser.computeContentHash(content);

      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe('string');
      expect(hash1.length).toBe(64);
    });

    it('T500-08: Content hash changes when content changes', () => {
      const hash1 = memoryParser.computeContentHash('Content version 1');
      const hash2 = memoryParser.computeContentHash('Content version 2');

      expect(hash1).not.toBe(hash2);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.4 ANCHOR DETECTION (T500-09)
  // ───────────────────────────────────────────────────────────────
  describe('Anchor Detection (T500-09)', () => {
    it('T500-09: Anchor detection works', () => {
      const content = `Some intro text.

<!-- ANCHOR:decisions -->
Decision 1: Use SQLite for storage.
Decision 2: Use SHA-256 for hashing.
<!-- /ANCHOR:decisions -->

More text.

<!-- ANCHOR:next-steps -->
Step 1: Implement caching.
<!-- /ANCHOR:next-steps -->
`;
      const anchors = memoryParser.extractAnchors(content);
      const validation = memoryParser.validateAnchors(content);

      expect(anchors['decisions']).toBeTruthy();
      expect(anchors['next-steps']).toBeTruthy();
      expect(validation.valid).toBe(true);
    });

    it('T500-09b: Unclosed anchor detected', () => {
      const badContent = `<!-- ANCHOR:unclosed -->
Some text without closing tag.
`;
      const badValidation = memoryParser.validateAnchors(badContent);
      expect(badValidation.valid).toBe(false);
      expect(badValidation.unclosedAnchors).toContain('unclosed');
    });

    it('T500-09c: overlapping anchors are rejected', () => {
      const overlappingContent = `<!-- ANCHOR:outer -->
Outer
<!-- ANCHOR:inner -->
Inner
<!-- /ANCHOR:outer -->
<!-- /ANCHOR:inner -->`;

      const validation = memoryParser.validateAnchors(overlappingContent);
      expect(validation.valid).toBe(false);
      expect(validation.warnings.some((warning) => warning.includes('out of order'))).toBe(true);
    });

    it('T500-09d: extraction fails closed for crossed and unclosed anchors', () => {
      const malformedContent = `<!-- ANCHOR:outer -->
Outer
<!-- ANCHOR:inner -->
Inner
<!-- /ANCHOR:outer -->

<!-- ANCHOR:tail -->
Tail without closing tag
`;

      const validation = memoryParser.validateAnchors(malformedContent);
      const anchors = memoryParser.extractAnchors(malformedContent);

      expect(validation.valid).toBe(false);
      expect(anchors).toEqual({});
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.5 LARGE FILE HANDLING (T500-10)
  // ───────────────────────────────────────────────────────────────
  describe('Large File Handling (T500-10)', () => {
    it('T500-10: Large file handling (>10KB)', () => {
      const header = `---
title: "Large File Test"
---

# Large File Test

`;
      const largeBody = 'x'.repeat(15000); // >10KB
      const largeContent = header + largeBody;

      const title = memoryParser.extractTitle(largeContent);
      const hash = memoryParser.computeContentHash(largeContent);

      expect(title).toBe('Large File Test');
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.6 ARRAY VALUES & MALFORMED YAML (T500-11 to T500-12)
  // ───────────────────────────────────────────────────────────────
  describe('Array Values & Malformed YAML (T500-11 to T500-12)', () => {
    it('T500-11: Array values in frontmatter', () => {
      const content = `---
triggerPhrases: ["alpha", "beta", "gamma"]
---

# Array Test
`;
      const triggers = memoryParser.extractTriggerPhrases(content);
      expect(Array.isArray(triggers)).toBe(true);
      expect(triggers.length).toBe(3);
    });

    it('T500-12: Malformed YAML frontmatter handled', () => {
      const content = `---
title: unclosed quote
importanceTier: [invalid
---

# Malformed
`;
      // Should not throw - should return defaults
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);
      const triggers = memoryParser.extractTriggerPhrases(content);

      // The parser is regex-based so it should still extract something or return defaults
      expect(typeof title === 'string' || title === null).toBe(true);
      expect(tier).toBe('normal');
      expect(triggers).toEqual([]);
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.7 BODY-ONLY & FRONTMATTER-ONLY (T500-13 to T500-14)
  // ───────────────────────────────────────────────────────────────
  describe('Body-only & Frontmatter-only (T500-13 to T500-14)', () => {
    it('T500-13: File with only frontmatter (no body)', () => {
      const content = `---
title: "Frontmatter Only"
importanceTier: important
---
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('Frontmatter Only');
      expect(tier).toBe('important');
    });

    it('T500-14: File with only body (no frontmatter)', () => {
      const content = `# Just A Heading

Some body content without any frontmatter.

## Another Section

More content.
`;
      const title = memoryParser.extractTitle(content);
      const tier = memoryParser.extractImportanceTier(content);

      expect(title).toBe('Just A Heading');
      expect(tier).toBe('normal');
    });
  });

  // ───────────────────────────────────────────────────────────────
  // 5.8 UNICODE CONTENT (T500-15)
  // ───────────────────────────────────────────────────────────────
  describe('Unicode Content Handling (T500-15)', () => {
    it('T500-15: Unicode content handling', () => {
      const content = `---
title: "Memoire avec des accents francais"
---

# Memoire avec des accents francais

Contenu en francais: cafe, resume, naive, cliche.
Japanese: \u6771\u4EAC\u90FD
Chinese: \u4F60\u597D\u4E16\u754C
Emoji: Test content
`;
      const title = memoryParser.extractTitle(content);
      const hash = memoryParser.computeContentHash(content);

      expect(title).toBeTruthy();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBe(64);
    });
  });

  describe('Directory Scanning Deduplication (T500-16)', () => {
    let workspaceRoot: string;

    beforeAll(() => {
      workspaceRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'memory-parser-dedup-'));
    });

    afterAll(() => {
      if (workspaceRoot && fs.existsSync(workspaceRoot)) {
        fs.rmSync(workspaceRoot, { recursive: true, force: true });
      }
    });

    it('T500-16: findMemoryFiles deduplicates symlinked specs roots', () => {
      const canonicalSpecsRoot = path.join(workspaceRoot, '.opencode', 'specs');
      const memoryDir = path.join(canonicalSpecsRoot, '200-dedup-check', 'memory');
      fs.mkdirSync(memoryDir, { recursive: true });
      fs.writeFileSync(path.join(memoryDir, 'entry.md'), '# Dedup\n\nMemory content');

      const linkedSpecsRoot = path.join(workspaceRoot, 'specs');
      try {
        fs.symlinkSync(canonicalSpecsRoot, linkedSpecsRoot, 'dir');
      } catch {
        // Symlink creation can fail in restricted environments.
        expect(Array.isArray(memoryParser.findMemoryFiles(workspaceRoot))).toBe(true);
        return;
      }

      const files = memoryParser.findMemoryFiles(workspaceRoot);
      expect(files).toHaveLength(1);
      expect(files[0].endsWith(path.join('200-dedup-check', 'memory', 'entry.md'))).toBe(true);
    });

    it('T500-17: specFolder filter uses boundary-safe matching', () => {
      const specsRoot = path.join(workspaceRoot, '.opencode', 'specs');
      const targetDir = path.join(specsRoot, '003-target', 'memory');
      const siblingPrefixDir = path.join(specsRoot, '003-target-other', 'memory');

      fs.mkdirSync(targetDir, { recursive: true });
      fs.mkdirSync(siblingPrefixDir, { recursive: true });

      const targetFile = path.join(targetDir, 'target.md');
      const siblingFile = path.join(siblingPrefixDir, 'sibling.md');
      fs.writeFileSync(targetFile, '# Target');
      fs.writeFileSync(siblingFile, '# Sibling');

      const files = memoryParser.findMemoryFiles(workspaceRoot, { specFolder: '003-target' });

      expect(files.some((filePath) => filePath.endsWith(path.join('003-target', 'memory', 'target.md')))).toBe(true);
      expect(files.some((filePath) => filePath.endsWith(path.join('003-target-other', 'memory', 'sibling.md')))).toBe(false);
    });
  });

});
