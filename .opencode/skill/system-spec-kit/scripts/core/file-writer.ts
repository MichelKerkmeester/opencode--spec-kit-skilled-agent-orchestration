// ---------------------------------------------------------------
// MODULE: File Writer
// Atomic file writing with validation and rollback on failure
// ---------------------------------------------------------------

import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { validateNoLeakedPlaceholders, validateAnchors } from '../utils/validation-utils';

const MIN_SUBSTANCE_CHARS = 200;

function validateContentSubstance(content: string, filename: string): void {
  const stripped = content
    .replace(/^---[\s\S]*?---/m, '')           // frontmatter
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

async function checkForDuplicateContent(
  contextDir: string, content: string, filename: string
): Promise<void> {
  const hash = crypto.createHash('sha256').update(content).digest('hex');
  let entries: string[];
  try {
    const dirEntries = await fs.readdir(contextDir);
    entries = dirEntries.filter(f => f.endsWith('.md') && f !== filename);
  } catch {
    return; // directory doesn't exist yet — no duplicates possible
  }
  for (const existing of entries) {
    try {
      const existingContent = await fs.readFile(path.join(contextDir, existing), 'utf-8');
      const existingHash = crypto.createHash('sha256').update(existingContent).digest('hex');
      if (hash === existingHash) {
        throw new Error(`Duplicate content: ${filename} matches existing ${existing}`);
      }
    } catch (e: unknown) {
      if (e instanceof Error && e.message.startsWith('Duplicate content:')) throw e;
      // skip unreadable files
    }
  }
}

export async function writeFilesAtomically(
  contextDir: string,
  files: Record<string, string>
): Promise<string[]> {
  const written: string[] = [];
  for (const [filename, content] of Object.entries(files)) {
    validateNoLeakedPlaceholders(content, filename);
    validateContentSubstance(content, filename);
    await checkForDuplicateContent(contextDir, content, filename);
    const warnings = validateAnchors(content);
    if (warnings.length) console.warn(`   Warning: ${filename}: ${warnings.join(', ')}`);
    const filePath = path.join(contextDir, filename);
    const tempPath = filePath + '.tmp';
    try {
      await fs.writeFile(tempPath, content, 'utf-8');
      const stat = await fs.stat(tempPath);
      if (stat.size !== Buffer.byteLength(content, 'utf-8')) throw new Error('Size mismatch');
      await fs.rename(tempPath, filePath);
      written.push(filename);
      console.log(`   ${filename} (${content.split('\n').length} lines)`);
    } catch (e: unknown) {
      try { await fs.unlink(tempPath); } catch (_e: unknown) { /* temp file cleanup — failure is non-critical */ }
      const errMsg = e instanceof Error ? e.message : String(e);
      throw new Error(`Write failed ${filename}: ${errMsg}`);
    }
  }
  return written;
}
