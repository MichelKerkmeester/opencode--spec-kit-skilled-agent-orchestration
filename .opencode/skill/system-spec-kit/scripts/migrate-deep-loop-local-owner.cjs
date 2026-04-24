#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const { normalizeSpecFolderReference } = require('../shared/review-research-paths.cjs');

const SCRIPT_DIR = __dirname;
const REPO_ROOT = path.resolve(SCRIPT_DIR, '../../../../');
const DEFAULT_SPECS_ROOTS = [
  path.join(REPO_ROOT, '.opencode/specs'),
  path.join(REPO_ROOT, 'specs'),
].filter((candidate) => fs.existsSync(candidate));

const MODE_CONFIG_FILE = {
  research: 'deep-research-config.json',
  review: 'deep-review-config.json',
};

const MODE_STATE_FILE = {
  research: 'deep-research-state.jsonl',
  review: 'deep-review-state.jsonl',
};

const WALK_SKIP_DIRS = new Set([
  '.git',
  'node_modules',
  'memory',
  'research',
  'review',
  'research_archive',
  'review_archive',
  'scratch',
  'iterations',
  'deltas',
  'prompts',
  'logs',
]);

const REWRITE_EXTENSIONS = new Set([
  '.md',
  '.json',
  '.jsonl',
  '.yaml',
  '.yml',
  '.toml',
  '.txt',
  '.cjs',
  '.js',
  '.ts',
]);

function parseArgs(argv) {
  const args = {
    dryRun: false,
    json: false,
    specsRoots: DEFAULT_SPECS_ROOTS,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--dry-run') {
      args.dryRun = true;
      continue;
    }
    if (value === '--json') {
      args.json = true;
      continue;
    }
    if (value === '--specs-root') {
      const nextValue = argv[index + 1];
      if (!nextValue) {
        throw new Error('--specs-root requires a path');
      }
      args.specsRoots = [path.resolve(nextValue)];
      index += 1;
      continue;
    }
    throw new Error(`Unknown argument: ${value}`);
  }

  return args;
}

function normalizePath(filePath) {
  return filePath.replace(/\\/g, '/');
}

function listEntries(dirPath) {
  try {
    return fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return [];
  }
}

function isSpecFolder(dirPath) {
  return fs.existsSync(path.join(dirPath, 'spec.md'));
}

function collectSpecFolders(specsRoot) {
  const results = [];

  function walk(currentDir) {
    if (isSpecFolder(currentDir)) {
      results.push(currentDir);
    }

    for (const entry of listEntries(currentDir)) {
      if (!entry.isDirectory()) {
        continue;
      }
      if (WALK_SKIP_DIRS.has(entry.name)) {
        continue;
      }
      walk(path.join(currentDir, entry.name));
    }
  }

  walk(specsRoot);
  return results.sort();
}

function readPacketOwner(packetDir, mode) {
  const configPath = path.join(packetDir, MODE_CONFIG_FILE[mode]);
  if (fs.existsSync(configPath)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      return normalizeSpecFolderReference(parsed.specFolder);
    } catch {
      // Fall through to JSONL probing.
    }
  }

  const statePath = path.join(packetDir, MODE_STATE_FILE[mode]);
  if (!fs.existsSync(statePath)) {
    return null;
  }

  const lines = fs.readFileSync(statePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    if (!line.trim()) {
      continue;
    }
    try {
      const parsed = JSON.parse(line);
      return normalizeSpecFolderReference(parsed.specFolder);
    } catch {
      return null;
    }
  }

  return null;
}

function discoverMisplacedPackets(specsRoot) {
  const misplaced = [];

  for (const specFolder of collectSpecFolders(specsRoot)) {
    const currentSpecRelative = normalizePath(path.relative(specsRoot, specFolder));

    for (const mode of ['research', 'review']) {
      const artifactRoot = path.join(specFolder, mode);
      for (const entry of listEntries(artifactRoot)) {
        if (!entry.isDirectory() || !/-pt-\d+$/.test(entry.name)) {
          continue;
        }

        const packetDir = path.join(artifactRoot, entry.name);
        const ownerRelative = readPacketOwner(packetDir, mode);
        if (!ownerRelative) {
          continue;
        }

        const ownerAbsolute = path.join(specsRoot, ownerRelative);
        if (!normalizePath(ownerAbsolute).startsWith(`${normalizePath(specFolder)}/`)) {
          continue;
        }
        if (ownerRelative === currentSpecRelative) {
          continue;
        }

        misplaced.push({
          mode,
          packetName: entry.name,
          ownerRelative,
          ownerAbsolute,
          currentSpecRelative,
          currentSpecAbsolute: specFolder,
          packetDir,
          destinationDir: path.join(ownerAbsolute, mode, entry.name),
        });
      }
    }
  }

  return misplaced.sort((left, right) => left.packetDir.localeCompare(right.packetDir));
}

function rewriteLiveReferences(repoRoot, replacements, dryRun) {
  const updatedFiles = [];

  function shouldSkipDir(dirPath, entryName) {
    if (entryName === '.git' || entryName === 'node_modules') {
      return true;
    }
    const normalizedDir = normalizePath(dirPath);
    return normalizedDir.includes('/research/iterations')
      || normalizedDir.includes('/review/iterations')
      || normalizedDir.includes('/prompts')
      || normalizedDir.includes('/logs');
  }

  function walk(currentDir) {
    for (const entry of listEntries(currentDir)) {
      const fullPath = path.join(currentDir, entry.name);
      if (entry.isDirectory()) {
        if (shouldSkipDir(fullPath, entry.name)) {
          continue;
        }
        walk(fullPath);
        continue;
      }
      if (!entry.isFile() || !REWRITE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        continue;
      }

      const original = fs.readFileSync(fullPath, 'utf8');
      let next = original;
      for (const [fromPath, toPath] of replacements) {
        next = next.split(fromPath).join(toPath);
      }
      if (next !== original) {
        if (!dryRun) {
          fs.writeFileSync(fullPath, next, 'utf8');
        }
        updatedFiles.push(normalizePath(path.relative(repoRoot, fullPath)));
      }
    }
  }

  walk(repoRoot);
  return updatedFiles.sort();
}

function ensureDir(dirPath, dryRun) {
  if (!dryRun) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function executeMigration(specsRoot, dryRun) {
  const misplaced = discoverMisplacedPackets(specsRoot);
  const moved = [];
  const conflicts = [];
  const replacements = [];

  for (const item of misplaced) {
    const destinationDir = item.destinationDir;
    if (fs.existsSync(destinationDir)) {
      conflicts.push({
        source: normalizePath(path.relative(REPO_ROOT, item.packetDir)),
        destination: normalizePath(path.relative(REPO_ROOT, destinationDir)),
      });
      continue;
    }

    ensureDir(path.dirname(destinationDir), dryRun);
    if (!dryRun) {
      fs.renameSync(item.packetDir, destinationDir);
    }

    const sourceRelative = normalizePath(path.relative(REPO_ROOT, item.packetDir));
    const destinationRelative = normalizePath(path.relative(REPO_ROOT, destinationDir));
    replacements.push([sourceRelative, destinationRelative]);
    moved.push({
      mode: item.mode,
      packetName: item.packetName,
      owner: item.ownerRelative,
      source: sourceRelative,
      destination: destinationRelative,
    });
  }

  const rewrittenFiles = rewriteLiveReferences(REPO_ROOT, replacements, dryRun);
  const after = discoverMisplacedPackets(specsRoot);

  return {
    specsRoot: normalizePath(path.relative(REPO_ROOT, specsRoot)) || '.',
    dryRun,
    discovered: misplaced.length,
    movedCount: moved.length,
    conflictCount: conflicts.length,
    rewrittenFilesCount: rewrittenFiles.length,
    remainingMisplacedCount: after.length,
    moved,
    conflicts,
    rewrittenFiles,
    remainingMisplaced: after.map((item) => ({
      mode: item.mode,
      packetName: item.packetName,
      owner: item.ownerRelative,
      source: normalizePath(path.relative(REPO_ROOT, item.packetDir)),
      destination: normalizePath(path.relative(REPO_ROOT, item.destinationDir)),
    })),
  };
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.specsRoots.length) {
    throw new Error('No specs roots found.');
  }

  const results = args.specsRoots.map((specsRoot) => executeMigration(specsRoot, args.dryRun));
  if (args.json) {
    process.stdout.write(`${JSON.stringify(results, null, 2)}\n`);
    return;
  }

  for (const result of results) {
    console.log(`Specs root: ${result.specsRoot}`);
    console.log(`Dry run: ${result.dryRun ? 'yes' : 'no'}`);
    console.log(`Discovered misplaced packets: ${result.discovered}`);
    console.log(`Moved packets: ${result.movedCount}`);
    console.log(`Conflicts: ${result.conflictCount}`);
    console.log(`Rewritten live files: ${result.rewrittenFilesCount}`);
    console.log(`Remaining misplaced packets: ${result.remainingMisplacedCount}`);
  }
}

main();
