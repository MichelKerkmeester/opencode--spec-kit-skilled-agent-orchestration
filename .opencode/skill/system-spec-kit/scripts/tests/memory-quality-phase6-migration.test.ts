import * as fs from 'node:fs';
import * as fsp from 'node:fs/promises';
import * as os from 'node:os';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

import { afterEach, describe, expect, it } from 'vitest';

import { detectFrontmatter, parseSectionValue } from '../lib/frontmatter-migration';
import {
  runTriggerPhraseResidualMigration,
  type TriggerPhraseMigrationReport,
} from '../memory/migrate-trigger-phrase-residual';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const FIXTURE_DIR = path.join(TEST_DIR, 'fixtures', 'memory-quality', 'migration');
const tempDirs: string[] = [];

function extractTriggerPhrases(content: string): string[] {
  const detection = detectFrontmatter(content);
  if (!detection.found) {
    return [];
  }
  const triggerSection = detection.sections.find((section) => section.key === 'trigger_phrases');
  const triggerValue = triggerSection ? parseSectionValue(triggerSection) : undefined;
  return Array.isArray(triggerValue)
    ? triggerValue.filter((value): value is string => typeof value === 'string')
    : [];
}

function stripTriggerSection(content: string): string {
  const detection = detectFrontmatter(content);
  if (!detection.found) {
    return content;
  }

  const rawBlock = detection.rawBlock.replace(/\r/g, '');
  const lines = rawBlock.split('\n');
  let start = -1;
  let end = lines.length;

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^([A-Za-z_][A-Za-z0-9_-]*)\s*:/);
    if (!match) {
      continue;
    }

    if (match[1] === 'trigger_phrases') {
      start = index;
      continue;
    }

    if (start >= 0) {
      end = index;
      break;
    }
  }

  if (start < 0) {
    return content;
  }

  const strippedRawBlock = [
    ...lines.slice(0, start),
    ...lines.slice(end),
  ]
    .filter((line, index, all) => index < all.length - 1 || line.trim().length > 0)
    .join('\n');

  return `${content.slice(0, detection.start)}---\n${strippedRawBlock}\n---\n${content.slice(detection.end)}`;
}

async function createTempFixtureDir(): Promise<string> {
  const tempDir = await fsp.mkdtemp(path.join(os.tmpdir(), 'memory-quality-phase6-migration-'));
  tempDirs.push(tempDir);
  return tempDir;
}

async function copyFixturesToTempDir(tempDir: string): Promise<string[]> {
  const fixtureNames = [
    'F-MIG-001-junk-residual.md',
    'F-MIG-002-clean.md',
    'F-MIG-003-title-overlap.md',
  ];

  const copied: string[] = [];
  for (const fixtureName of fixtureNames) {
    const sourcePath = path.join(FIXTURE_DIR, fixtureName);
    const targetPath = path.join(tempDir, fixtureName);
    await fsp.copyFile(sourcePath, targetPath);
    copied.push(targetPath);
  }

  return copied;
}

afterEach(async () => {
  await Promise.all(tempDirs.splice(0).map((dirPath) => fsp.rm(dirPath, { recursive: true, force: true })));
});

describe('Phase 6 PR-13 trigger residual migration', () => {
  it('flags junk residuals in dry-run mode, preserves useful anchors, and rewrites only trigger_phrases in apply mode', async () => {
    const tempDir = await createTempFixtureDir();
    const copiedFiles = await copyFixturesToTempDir(tempDir);
    const beforeContents = new Map<string, string>();

    for (const filePath of copiedFiles) {
      beforeContents.set(filePath, await fsp.readFile(filePath, 'utf8'));
    }

    const dryRunReportPath = path.join(tempDir, 'dry-run-report.json');
    const dryRunReport = await runTriggerPhraseResidualMigration({
      mode: 'dry-run',
      scanRoots: [tempDir],
      reportPath: dryRunReportPath,
    });

    expect(fs.existsSync(dryRunReportPath)).toBe(true);
    const dryRunJson = JSON.parse(await fsp.readFile(dryRunReportPath, 'utf8')) as TriggerPhraseMigrationReport;
    expect(dryRunJson.summary.scannedFiles).toBe(3);
    expect(dryRunJson.summary.changedFiles).toBe(2);

    const junkEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-001-junk-residual.md'));
    expect(junkEntry).toBeDefined();
    expect(junkEntry?.removedPhrases).toEqual(expect.arrayContaining(['and', 'graph', 'kit/026', 'optimization/001']));
    expect(junkEntry?.preservedUsefulAnchors).toEqual(expect.arrayContaining(['api', 'cli', 'mcp']));

    const cleanEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-002-clean.md'));
    expect(cleanEntry?.changed).toBe(false);
    expect(cleanEntry?.removedPhrases).toEqual([]);

    const overlapEntry = dryRunReport.files.find((entry) => entry.filePath.endsWith('F-MIG-003-title-overlap.md'));
    expect(overlapEntry?.removedDetails).toEqual(expect.arrayContaining([
      expect.objectContaining({ phrase: 'codesight', reason: 'title_overlap' }),
      expect.objectContaining({ phrase: 'trigger phrase migration', reason: 'title_overlap' }),
    ]));
    expect(overlapEntry?.preservedUsefulAnchors).toEqual(expect.arrayContaining(['mcp']));

    await runTriggerPhraseResidualMigration({
      mode: 'apply',
      scanRoots: [tempDir],
      reportPath: path.join(tempDir, 'apply-report.json'),
    });

    const junkAfter = await fsp.readFile(path.join(tempDir, 'F-MIG-001-junk-residual.md'), 'utf8');
    expect(extractTriggerPhrases(junkAfter)).toEqual(['api', 'cli', 'mcp', 'context generation']);

    const cleanAfter = await fsp.readFile(path.join(tempDir, 'F-MIG-002-clean.md'), 'utf8');
    expect(extractTriggerPhrases(cleanAfter)).toEqual(['api', 'mcp', 'context generation']);

    const overlapAfter = await fsp.readFile(path.join(tempDir, 'F-MIG-003-title-overlap.md'), 'utf8');
    expect(extractTriggerPhrases(overlapAfter)).toEqual(['mcp', 'residual cleanup']);

    for (const filePath of copiedFiles) {
      const before = beforeContents.get(filePath);
      const after = await fsp.readFile(filePath, 'utf8');
      expect(stripTriggerSection(after)).toBe(stripTriggerSection(before || ''));
    }
  });
});
