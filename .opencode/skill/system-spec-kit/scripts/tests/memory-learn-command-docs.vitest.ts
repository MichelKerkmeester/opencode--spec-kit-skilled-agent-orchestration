import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');

function readWorkspaceFile(relativePath: string): string {
  return fs.readFileSync(path.join(WORKSPACE_ROOT, relativePath), 'utf8');
}

describe('/memory:learn command docs', () => {
  it('documents the constitutional workflow without contradictory qualification text', () => {
    const learnDoc = readWorkspaceFile('.opencode/command/memory/learn.md');

    expect(learnDoc).toContain('# /memory:learn — Constitutional Memory Manager');
    expect(learnDoc).toContain('[s] use /memory:save instead');
    expect(learnDoc).not.toContain('save as critical instead');
    expect(learnDoc).toContain('Self-check (do NOT prompt user unless one or more answers are "no"):');
  });

  it('keeps active command and workspace docs aligned to the constitutional manager wording', () => {
    const docPaths = [
      '.opencode/command/README.txt',
      '.opencode/command/memory/README.txt',
      '.opencode/command/memory/search.md',
      '.opencode/command/spec_kit/debug.md',
      '.opencode/command/spec_kit/complete.md',
      'README.md',
      '.opencode/README.md',
      '.opencode/agent/speckit.md',
    ];

    const contents = docPaths.map((docPath) => ({
      docPath,
      content: readWorkspaceFile(docPath),
    }));

    const legacyPatterns = [
      /Capture learnings and corrections/,
      /Explicit learning\b/,
      /Save explicit correction or preference/,
      /learning from mistakes/,
      /correct subcommand/,
    ];

    for (const { docPath, content } of contents) {
      expect(content, `${docPath} should still mention /memory:learn`).toContain('/memory:learn');
      for (const legacyPattern of legacyPatterns) {
        expect(content, `${docPath} contains legacy /memory:learn wording`).not.toMatch(legacyPattern);
      }
    }

    const combined = contents.map((entry) => entry.content).join('\n');
    expect(combined).toMatch(/Constitutional memory manager|constitutional memories/i);
  });
});
