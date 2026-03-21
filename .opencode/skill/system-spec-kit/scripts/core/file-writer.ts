// ---------------------------------------------------------------
// MODULE: File Writer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. FILE WRITER
// ───────────────────────────────────────────────────────────────
// Atomic file writing with validation and rollback on failure

import * as fs from 'fs/promises';
import * as fsSync from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';

const MIN_SUBSTANCE_CHARS = 200;
const FRONTMATTER_BLOCK_RE = /^---\r?\n[\s\S]*?\r?\n---(?:\r?\n|$)/;

function canonicalizeForDuplicateComparison(content: string): string {
  return content
    .replace(/^(title:\s*".*?) \[[^"\]]+\]"$/gm, '$1"')
    .replace(/^(# .+?) \[[^\]]+\]$/gm, '$1')
    .replace(/^session_id:\s*".*"$/gm, 'session_id: "<normalized>"')
    .replace(/^(created_at|created_at_epoch|last_accessed_epoch|expires_at_epoch):.*$/gm, '$1: <normalized>')
    .replace(/^access_count:\s*\d+$/gm, 'access_count: <normalized>')
    .replace(/^fingerprint_hash:\s*".*"$/gm, 'fingerprint_hash: "<normalized>"')
    .replace(/^memories_surfaced:\s*\d+$/gm, 'memories_surfaced: <normalized>')
    .replace(/^dedup_savings_tokens:\s*\d+$/gm, 'dedup_savings_tokens: <normalized>')
    .replace(/^\*\*Timestamp\*\*:\s+.*$/gm, '**Timestamp**: <normalized>')
    .replace(/^\s+- id:\s*".*"$/gm, '    - id: "<normalized>"')
    .replace(/^\s+similarity:\s*.+$/gm, '      similarity: <normalized>');
}

function verifyResolvedWriteTarget(
  resolvedContextDir: string,
  filePath: string,
  filename: string
): void {
  const realContextDir = fsSync.realpathSync(resolvedContextDir);
  // F-18 — realpathSync(filePath) throws ENOENT for new files that
  // Don't exist yet. Resolve the parent directory instead (which must exist)
  // And append the filename to construct the expected real path.
  const parentDir = path.dirname(filePath);
  const basename = path.basename(filePath);
  let realFilePath: string;
  try {
    realFilePath = path.join(fsSync.realpathSync(parentDir), basename);
  } catch (e: unknown) {
    const err = e as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') {
      throw new Error(`Parent directory does not exist for "${filename}"`);
    }
    throw e;
  }
  if (realFilePath !== realContextDir && !realFilePath.startsWith(realContextDir + path.sep)) {
    throw new Error(`Filename "${filename}" resolves outside target directory`);
  }
}

async function backupExistingFileAtomically(filePath: string, backupPath: string): Promise<boolean> {
  let existingFile: fs.FileHandle | undefined;
  try {
    existingFile = await fs.open(filePath, fsSync.constants.O_RDONLY);
  } catch (openErr: unknown) {
    const err = openErr as NodeJS.ErrnoException;
    if (err.code === 'ENOENT') return false;
    throw openErr;
  }

  try {
    const existingContent = await existingFile.readFile();
    await fs.writeFile(backupPath, existingContent, { flag: 'wx' });
    return true;
  } finally {
    await existingFile.close();
  }
}

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
// Idempotently. Previously, throw-on-duplicate was treated as a batch error
// That triggered rollback, causing 5 separate runs to create 5 files.
async function checkForDuplicateContent(
  contextDir: string, content: string, filename: string
): Promise<string | null> {
  const hash = crypto.createHash('sha256')
    .update(canonicalizeForDuplicateComparison(content))
    .digest('hex');
  let entries: string[];
  try {
    const dirEntries = await fs.readdir(contextDir);
    entries = dirEntries.filter(f => f.endsWith('.md') && f !== filename);
  } catch (dirErr: unknown) {
    // F-29: Only swallow ENOENT (dir doesn't exist), rethrow everything else
    if ((dirErr as NodeJS.ErrnoException).code === 'ENOENT') return null;
    throw dirErr;
  }
  for (const existing of entries) {
    try {
      const existingContent = await fs.readFile(path.join(contextDir, existing), 'utf-8');
      const existingHash = crypto.createHash('sha256')
        .update(canonicalizeForDuplicateComparison(existingContent))
        .digest('hex');
      if (hash === existingHash) {
        return existing; // duplicate found — return the matching filename
      }
    } catch (readErr: unknown) {
      // F-29: Only skip ENOENT (file removed between readdir and read), rethrow others
      if ((readErr as NodeJS.ErrnoException).code !== 'ENOENT') throw readErr;
    }
  }
  return null;
}

/** Write files atomically with batch rollback on failure. */
export async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
): Promise<string[]> {
  // F-01: Resolve to canonical path before any I/O to prevent symlink-based traversal
  const resolvedContextDir = fsSync.realpathSync(path.resolve(contextDir));
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
    const resolvedFilePath = path.join(resolvedContextDir, filename);
    if (!resolvedFilePath.startsWith(resolvedContextDir + path.sep)) {
      throw new Error(`Filename "${filename}" resolves outside target directory`);
    }
    let existedBefore = false;
    let backupPath: string | undefined;
    const tempSuffix = crypto.randomBytes(4).toString('hex');
    const tempPath = `${filePath}.tmp.${tempSuffix}`;
    let renamedIntoPlace = false;
    try {
      const backupSuffix = crypto.randomBytes(4).toString('hex');
      backupPath = `${filePath}.bak.${backupSuffix}`;
      existedBefore = await backupExistingFileAtomically(filePath, backupPath);
      if (existedBefore) {
        console.warn(`   Warning: overwriting existing file ${filename}`);
      }
      const tempFd = await fs.open(
        tempPath,
        fsSync.constants.O_CREAT | fsSync.constants.O_EXCL | fsSync.constants.O_WRONLY,
        0o600
      );
      try {
        await tempFd.writeFile(content, 'utf-8');
        // Fsync before rename ensures content reaches disk (F9 fix)
        await tempFd.sync();
      } finally {
        await tempFd.close();
      }
      const stat = await fs.stat(tempPath);
      if (stat.size !== Buffer.byteLength(content, 'utf-8')) throw new Error('Size mismatch');
      // F-01: Verify containment BEFORE rename, not after
      verifyResolvedWriteTarget(resolvedContextDir, filePath, filename);
      await fs.rename(tempPath, filePath);
      renamedIntoPlace = true;
      // F-28: fsync parent directory after rename to ensure metadata reaches disk
      const parentDir = path.dirname(filePath);
      const parentFd = await fs.open(parentDir, fsSync.constants.O_RDONLY);
      try { await parentFd.sync(); } finally { await parentFd.close(); }
      written.push({ filename, existedBefore, backupPath });
      console.log(`   ${filename} (${content.split('\n').length} lines)`);
    } catch (e: unknown) {
      try { await fs.unlink(tempPath); } catch { /* temp file cleanup — failure is non-critical */ }
      // F-05: Accumulate current-file restore errors instead of swallowing
      const currentFileErrors: string[] = [];
      if (renamedIntoPlace) {
        try {
          if (existedBefore && backupPath) {
            // F-06: rename-based restore instead of copyFile (atomic, detects concurrent modification)
            await fs.rename(backupPath, filePath);
          } else {
            await fs.unlink(filePath);
          }
        } catch (restoreErr: unknown) {
          const msg = restoreErr instanceof Error ? restoreErr.message : String(restoreErr);
          currentFileErrors.push(`${filename}: ${msg}`);
        }
      } else if (existedBefore && backupPath) {
        try {
          // F-06: rename-based restore
          await fs.rename(backupPath, filePath);
        } catch (restoreErr: unknown) {
          const msg = restoreErr instanceof Error ? restoreErr.message : String(restoreErr);
          currentFileErrors.push(`${filename}: ${msg}`);
        }
      }
      // Rollback already-written files from this batch
      const rollbackErrors: string[] = [...currentFileErrors];
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
