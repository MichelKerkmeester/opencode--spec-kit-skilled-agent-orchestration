// ---------------------------------------------------------------
// MODULE: File Writer
// ---------------------------------------------------------------
// Atomic file writing with validation and rollback on failure

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';

const MIN_SUBSTANCE_CHARS = 200;
const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

function validateContentSubstance(content: string, filename: string): void {
  const stripped = content
    .replace(FRONTMATTER_BLOCK_RE, '')            // frontmatter
    .replace(/<!--.*?-->/g, '')                 // HTML comments / anchors
    .replace(/^#+\s*.*$/gm, '')                // empty headings
    .replace(/^\|.*\|$/gm, '')                 // table rows (template structure)
    .replace(/^\s*[-*]\s*$/gm, '')             // empty list items
    .trim();
  if (stripped.length < MIN_SUBSTANCE_CHARS) {
    throw new Error(
      `Empty/template-only content in ${filename}: ` +
      `${stripped.length} chars substance (minimum ${MIN_SUBSTANCE_CHARS})`
    );
  }
}

// RC-6: Return duplicate filename instead of throwing, so callers can skip
// idempotently. Previously, throw-on-duplicate was treated as a batch error
// that triggered rollback, causing 5 separate runs to create 5 files.
async function checkForDuplicateContent(
  contextDir: string, content: string, filename: string
): Promise<string | null> {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  let entries: string[];
  try {
    const dirEntries = await fs.readdir(contextDir);
    entries = dirEntries.filter(f => f.endsWith('.md') && f !== filename);
  } catch {
    return null; // directory doesn't exist yet — no duplicates possible
  }
  for (const existing of entries) {
    try {
      const existingContent = await fs.readFile(path.join(contextDir, existing), 'utf-8');
      const existingHash = crypto.createHash('sha256').update(existingContent).digest('hex');
      if (hash === existingHash) {
        return existing; // duplicate found — return the matching filename
      }
    } catch {
      // skip unreadable files
    }
  }
  return null;
}

/** Write files atomically with batch rollback on failure. */
export async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
): Promise<string[]> {
  const written: Array<{ filename: string; existedBefore: boolean; backupPath?: string }> = [];
  for (const [filename, content] of Object.entries(files)) {
    validateNoLeakedPlaceholders(content, filename);
    validateContentSubstance(content, filename);
    // RC-6: Skip duplicate files idempotently instead of crashing the batch
    const duplicateOf = await checkForDuplicateContent(contextDir, content, filename);
    if (duplicateOf) {
      console.warn(`   Skipping ${filename}: duplicate of existing ${duplicateOf}`);
      continue;
    }
    const warnings = validateAnchors(content);
    if (warnings.length) console.warn(`   Warning: ${filename}: ${warnings.join(', ')}`);
    // Reject filenames that could escape contextDir
    if (path.isAbsolute(filename) || filename.includes('..')) {
      throw new Error(`Invalid filename "${filename}": must be a relative path without traversal`);
    }
    const filePath = path.join(contextDir, filename);
    if (!path.resolve(filePath).startsWith(path.resolve(contextDir) + path.sep)) {
      throw new Error(`Filename "${filename}" resolves outside target directory`);
    }
    // Backup existing file before overwrite
    let existedBefore = false;
    let backupPath: string | undefined;
    let fileExists = false;
    try {
      await fs.access(filePath);
      fileExists = true;
    } catch { /* Expected: file doesn't exist */ }
    const tempSuffix = crypto.randomBytes(4).toString('hex');
    const tempPath = `${filePath}.tmp.${tempSuffix}`;
    try {
      if (fileExists) {
        const backupSuffix = crypto.randomBytes(4).toString('hex');
        backupPath = `${filePath}.bak.${backupSuffix}`;
        await fs.copyFile(filePath, backupPath);
        existedBefore = true;
        console.warn(`   Warning: overwriting existing file ${filename}`);
      }
      await fs.writeFile(tempPath, content, 'utf-8');
      const stat = await fs.stat(tempPath);
      if (stat.size !== Buffer.byteLength(content, 'utf-8')) throw new Error('Size mismatch');
      await fs.rename(tempPath, filePath);
      written.push({ filename, existedBefore, backupPath });
      console.log(`   ${filename} (${content.split('\n').length} lines)`);
    } catch (e: unknown) {
      try { await fs.unlink(tempPath); } catch { /* temp file cleanup — failure is non-critical */ }
      // Rollback already-written files from this batch
      const rollbackErrors: string[] = [];
      for (const prev of written) {
        try {
          if (prev.existedBefore && prev.backupPath) {
            await fs.rename(prev.backupPath, path.join(contextDir, prev.filename));
          } else {
            await fs.unlink(path.join(contextDir, prev.filename));
          }
        } catch (rollbackErr: unknown) {
          const msg = rollbackErr instanceof Error ? rollbackErr.message : String(rollbackErr);
          rollbackErrors.push(`${prev.filename}: ${msg}`);
        }
      }
      if (backupPath) {
        try { await fs.unlink(backupPath); } catch { /* cleanup current backup */ }
      }
      const errMsg = e instanceof Error ? e.message : String(e);
      const rollbackNote = rollbackErrors.length > 0
        ? ` (rollback errors: ${rollbackErrors.join('; ')})`
        : '';
      throw new Error(`Write failed ${filename} (rolled back ${written.length} prior files${rollbackNote}): ${errMsg}`);
    }
  }
  // Clean up backup files on success
  for (const w of written) {
    if (w.backupPath) {
      try { await fs.unlink(w.backupPath); } catch { /* best-effort cleanup */ }
    }
  }
  return written.map(w => w.filename);
}
