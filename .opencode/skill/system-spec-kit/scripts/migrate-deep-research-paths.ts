#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Migrate Deep Research Paths
// ---------------------------------------------------------------

import * as fs from 'node:fs';
import * as path from 'node:path';

const SCRIPT_DIR = __dirname;
const DEFAULT_SPECS_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', 'specs');

const TEXT_EXTENSIONS = new Set(['.md', '.json', '.jsonl', '.yaml', '.yml', '.txt']);
const LIVE_RESEARCH_ROOT_BASENAMES = new Set([
  'deep-research-config.json',
  'deep-research-state.jsonl',
  'deep-research-strategy.md',
  'deep-research-dashboard.md',
  'research-ideas.md',
  '.deep-research-pause',
]);

interface Counters {
  moved: number;
  rewritten: number;
  skipped: number;
}

function normalize(filePath: string): string {
  return filePath.replace(/\\/g, '/');
}

function ensureDir(dirPath: string): void {
  fs.mkdirSync(dirPath, { recursive: true });
}

function filesHaveSameContent(sourcePath: string, destinationPath: string): boolean {
  try {
    return fs.readFileSync(sourcePath).equals(fs.readFileSync(destinationPath));
  } catch {
    return false;
  }
}

function moveFile(sourcePath: string, destinationPath: string, counters: Counters): void {
  if (!fs.existsSync(sourcePath)) {
    return;
  }

  if (fs.existsSync(destinationPath)) {
    if (filesHaveSameContent(sourcePath, destinationPath)) {
      fs.rmSync(sourcePath);
      counters.moved += 1;
      return;
    }

    counters.skipped += 1;
    console.warn(`Skipping conflicting destination: ${normalize(destinationPath)}`);
    return;
  }

  ensureDir(path.dirname(destinationPath));
  fs.renameSync(sourcePath, destinationPath);
  counters.moved += 1;
}

function listEntries(dirPath: string): fs.Dirent[] {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function rewriteTextContent(content: string): string {
  const replacements: Array<[RegExp, string]> = [
    [/(^|[\s`(])research\/research\/research\.md(?=([`\])\s,.:;]|$))/gm, '$1research/research.md'],
    [/(\.\.?\/)research\/research\/research\.md(?=([`\])\s,.:;]|$))/g, '$1research/research.md'],
    [/(^|[\s`(])(?:\.\/)?research\.md(?=([`\])\s,.:;]|$))/gm, '$1research/research.md'],
    [/(\.\.\/)research\.md(?=([`\])\s,.:;]|$))/g, '$1research/research.md'],
    [/scratch\/iteration-/g, 'research/iterations/iteration-'],
    [/review\/iteration-/g, 'review/iterations/iteration-'],
    [/scratch\/deep-research-config\.json/g, 'research/deep-research-config.json'],
    [/scratch\/deep-research-state\.jsonl/g, 'research/deep-research-state.jsonl'],
    [/scratch\/deep-research-strategy\.md/g, 'research/deep-research-strategy.md'],
    [/scratch\/deep-research-dashboard\.md/g, 'research/deep-research-dashboard.md'],
    [/scratch\/research-ideas\.md/g, 'research/research-ideas.md'],
    [/scratch\/\.deep-research-pause/g, 'research/.deep-research-pause'],
  ];

  let next = content;
  for (const [pattern, replacement] of replacements) {
    next = next.replace(pattern, replacement);
  }
  return next;
}

function rewriteTextFile(filePath: string, counters: Counters): void {
  const extension = path.extname(filePath).toLowerCase();
  if (!TEXT_EXTENSIONS.has(extension)) {
    return;
  }

  const original = fs.readFileSync(filePath, 'utf-8');
  const rewritten = rewriteTextContent(original);
  if (rewritten !== original) {
    fs.writeFileSync(filePath, rewritten, 'utf-8');
    counters.rewritten += 1;
  }
}

function migrateSpecPacket(packetPath: string, counters: Counters): void {
  const researchDoc = path.join(packetPath, 'research.md');
  if (fs.existsSync(researchDoc)) {
    moveFile(researchDoc, path.join(packetPath, 'research', 'research.md'), counters);
  }

  const scratchDir = path.join(packetPath, 'scratch');
  if (fs.existsSync(scratchDir) && fs.statSync(scratchDir).isDirectory()) {
    for (const entry of listEntries(scratchDir)) {
      const sourcePath = path.join(scratchDir, entry.name);
      if (!entry.isFile()) {
        continue;
      }

      if (entry.name.startsWith('iteration-') && entry.name.endsWith('.md')) {
        moveFile(sourcePath, path.join(packetPath, 'research', 'iterations', entry.name), counters);
        continue;
      }

      if (
        LIVE_RESEARCH_ROOT_BASENAMES.has(entry.name)
        || entry.name.startsWith('deep-research-')
      ) {
        moveFile(sourcePath, path.join(packetPath, 'research', entry.name), counters);
      }
    }
  }

  const reviewDir = path.join(packetPath, 'review');
  if (fs.existsSync(reviewDir) && fs.statSync(reviewDir).isDirectory()) {
    for (const entry of listEntries(reviewDir)) {
      if (!entry.isFile()) {
        continue;
      }
      if (entry.name.startsWith('iteration-') && entry.name.endsWith('.md')) {
        moveFile(
          path.join(reviewDir, entry.name),
          path.join(reviewDir, 'iterations', entry.name),
          counters,
        );
      }
    }
  }
}

function walkAndMigrate(dirPath: string, counters: Counters): void {
  migrateSpecPacket(dirPath, counters);

  for (const entry of listEntries(dirPath)) {
    if (!entry.isDirectory()) {
      continue;
    }
    if (
      entry.name === 'node_modules'
      || entry.name.startsWith('.git')
      || entry.name === 'research'
      || entry.name === 'review'
      || entry.name === 'scratch'
      || entry.name === 'memory'
      || entry.name === 'iterations'
    ) {
      continue;
    }
    walkAndMigrate(path.join(dirPath, entry.name), counters);
  }
}

function walkAndRewrite(dirPath: string, counters: Counters): void {
  for (const entry of listEntries(dirPath)) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.git')) {
        continue;
      }
      walkAndRewrite(fullPath, counters);
      continue;
    }
    if (entry.isFile()) {
      rewriteTextFile(fullPath, counters);
    }
  }
}

function main(): void {
  const rootArg = process.argv[2];
  const specsRoot = path.resolve(rootArg || DEFAULT_SPECS_ROOT);
  const counters: Counters = { moved: 0, rewritten: 0, skipped: 0 };

  if (!fs.existsSync(specsRoot)) {
    throw new Error(`Specs root not found: ${specsRoot}`);
  }

  walkAndMigrate(specsRoot, counters);
  walkAndRewrite(specsRoot, counters);

  console.log(`Migrated deep-research paths under ${normalize(specsRoot)}`);
  console.log(`Moved files: ${counters.moved}`);
  console.log(`Rewritten text files: ${counters.rewritten}`);
  console.log(`Skipped conflicts: ${counters.skipped}`);
}

main();
