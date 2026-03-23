// ───────────────────────────────────────────────────────────────
// MODULE: Generate Description
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. GENERATE DESCRIPTION
// ───────────────────────────────────────────────────────────────
// CLI: Generate Per-Folder description.json
// Usage: node generate-description.js <folder-path> <base-path> [--description "text"]
//
// If --description is provided, uses it directly + keyword extraction.
// Otherwise reads spec.md via generatePerFolderDescription().

import * as path from 'node:path';
import * as fs from 'node:fs';
import {
  generatePerFolderDescription,
  savePerFolderDescription,
  loadPerFolderDescription,
  extractKeywords,
  slugifyFolderName,
} from '@spec-kit/mcp-server/api';
import type { PerFolderDescription } from '@spec-kit/mcp-server/api';

function main(): void {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.error('Usage: generate-description.js <folder-path> <base-path> [--description "text"]');
    process.exit(1);
  }

  const folderPath = path.resolve(args[0]);
  const basePath = path.resolve(args[1]);

  // Path containment check — prevent directory traversal attacks.
  // Try/catch guards against crash on broken symlinks (realpathSync throws ENOENT).
  // Path.sep boundary prevents prefix bypass (e.g. /specs-evil passing for /specs).
  let realFolder: string;
  let realBase: string;
  try {
    realFolder = fs.realpathSync(folderPath);
    realBase = fs.realpathSync(basePath);
  } catch (err: unknown) {
    console.error(`Error: cannot resolve real path — ${(err as NodeJS.ErrnoException).message}`);
    process.exit(1);
  }
  if (!(realFolder === realBase || realFolder.startsWith(realBase + path.sep))) {
    console.error(`Error: folder path escapes base path (${realFolder} not under ${realBase})`);
    process.exit(1);
  }

  // Parse --description flag
  let explicitDescription: string | null = null;
  const descIdx = args.indexOf('--description');
  if (descIdx !== -1 && args[descIdx + 1]) {
    explicitDescription = args[descIdx + 1];
  }

  let desc: PerFolderDescription | null;

  if (explicitDescription) {
    // Build from explicit description
    const existing = loadPerFolderDescription(folderPath);
    const folderName = path.basename(folderPath);
    const numMatch = folderName.match(/^(\d+)/);
    const specId = numMatch ? numMatch[1] : '';
    const folderSlug = slugifyFolderName(folderName);

    const relativePath = path.relative(basePath, folderPath).replace(/\\/g, '/');
    const segments = relativePath.split('/').filter(Boolean);
    const parentChain = segments.length > 1 ? segments.slice(0, -1) : [];
    const normalizedRelativeFolder =
      relativePath && !relativePath.startsWith('..') ? relativePath : folderName;

    desc = {
      specFolder: normalizedRelativeFolder,
      description: explicitDescription.slice(0, 150),
      keywords: extractKeywords(explicitDescription),
      lastUpdated: new Date().toISOString(),
      specId,
      folderSlug,
      parentChain,
      memorySequence: existing?.memorySequence ?? 0,
      memoryNameHistory: existing?.memoryNameHistory ?? [],
    };
  } else {
    // Generate from spec.md
    desc = generatePerFolderDescription(folderPath, basePath);
  }

  if (!desc) {
    console.error('Could not generate description (missing spec.md or unreadable content)');
    process.exit(1);
  }

  savePerFolderDescription(desc, folderPath);
  console.log(`description.json created in ${folderPath}`);
}

main();
