#!/usr/bin/env node
// ───────────────────────────────────────────────────────────────
// BUILD: MINIFY WEBFLOW JAVASCRIPT
// ───────────────────────────────────────────────────────────────
//
// Usage:
//   node scripts/minify-webflow.mjs          # Normal run (skip unchanged)
//   node scripts/minify-webflow.mjs --force  # Force re-minify all
//
// Minifies all JavaScript files from src/2_javascript/ to src/2_javascript/z_minified/
// Uses terser with --compress --mangle for safe minification.

import { execSync } from 'child_process';
import { readdirSync, statSync, existsSync, readFileSync, mkdirSync, writeFileSync } from 'fs';
import { join, dirname, relative } from 'path';
import { createHash } from 'crypto';

/* ─────────────────────────────────────────────────────────────
   1. CONFIGURATION
──────────────────────────────────────────────────────────────── */

const SOURCE_DIR = 'src/2_javascript';
const OUTPUT_DIR = 'src/2_javascript/z_minified';
const MANIFEST_FILE = join(OUTPUT_DIR, 'manifest.tsv');

// Folders to skip (already minified or not for production)
const SKIP_FOLDERS = ['z_minified', 'node_modules', '.git'];

// Parse arguments
const args = process.argv.slice(2);
const FORCE_MODE = args.includes('--force');

/* ─────────────────────────────────────────────────────────────
   2. UTILITIES
──────────────────────────────────────────────────────────────── */

// Get MD5 hash of file content
function get_file_hash(file_path) {
  const content = readFileSync(file_path, 'utf-8');
  return createHash('md5').update(content).digest('hex');
}

// Recursively find all .js files in directory
function find_js_files(dir, base_dir = dir) {
  const files = [];

  if (!existsSync(dir)) {
    console.error(`Directory not found: ${dir}`);
    return files;
  }

  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full_path = join(dir, entry.name);

    if (entry.isDirectory()) {
      if (!SKIP_FOLDERS.includes(entry.name)) {
        files.push(...find_js_files(full_path, base_dir));
      }
    } else if (entry.isFile() && entry.name.endsWith('.js')) {
      files.push(relative(base_dir, full_path));
    }
  }

  return files;
}

/* ─────────────────────────────────────────────────────────────
   3. CORE FUNCTIONS
──────────────────────────────────────────────────────────────── */

// Minify a single file using terser
function minify_file(relative_path) {
  const source_path = join(SOURCE_DIR, relative_path);
  const output_path = join(OUTPUT_DIR, relative_path);
  const output_dir = dirname(output_path);

  // Ensure output directory exists
  if (!existsSync(output_dir)) {
    mkdirSync(output_dir, { recursive: true });
  }

  // Get source file size
  const source_size = statSync(source_path).size;

  try {
    // Run terser
    execSync(`npx terser "${source_path}" --compress --mangle -o "${output_path}"`, {
      stdio: 'pipe',
    });

    // Get output file size
    const output_size = statSync(output_path).size;
    const reduction = ((1 - output_size / source_size) * 100).toFixed(1);

    return {
      success: true,
      source_size,
      output_size,
      reduction,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

// Load existing manifest (hash tracking)
function load_manifest() {
  const manifest = new Map();

  if (existsSync(MANIFEST_FILE)) {
    const content = readFileSync(MANIFEST_FILE, 'utf-8');
    const lines = content.trim().split('\n').slice(1); // Skip header

    for (const line of lines) {
      const [file, hash] = line.split('\t');
      if (file && hash) {
        manifest.set(file, hash);
      }
    }
  }

  return manifest;
}

// Save manifest
function save_manifest(manifest) {
  const lines = ['file\thash'];
  for (const [file, hash] of manifest.entries()) {
    lines.push(`${file}\t${hash}`);
  }

  const output_dir = dirname(MANIFEST_FILE);
  if (!existsSync(output_dir)) {
    mkdirSync(output_dir, { recursive: true });
  }

  writeFileSync(MANIFEST_FILE, lines.join('\n') + '\n');
}

/* ─────────────────────────────────────────────────────────────
   4. MAIN EXECUTION
──────────────────────────────────────────────────────────────── */

async function main() {
  console.log('=== MINIFY-WEBFLOW ===\n');
  console.log(`Mode: ${FORCE_MODE ? 'FORCE (re-minify all)' : 'NORMAL (skip unchanged)'}`);
  console.log(`Source: ${SOURCE_DIR}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // Find all JS files
  const files = find_js_files(SOURCE_DIR);
  console.log(`Found ${files.length} JavaScript files\n`);

  if (files.length === 0) {
    console.log('No files to process.');
    return;
  }

  // Load manifest for change detection
  const manifest = load_manifest();

  let updated = 0;
  let unchanged = 0;
  let failed = 0;
  let total_source_size = 0;
  let total_output_size = 0;

  for (const file of files) {
    const source_path = join(SOURCE_DIR, file);
    const output_path = join(OUTPUT_DIR, file);
    const current_hash = get_file_hash(source_path);
    const previous_hash = manifest.get(file);

    // Skip if unchanged (unless force mode)
    if (!FORCE_MODE && previous_hash === current_hash && existsSync(output_path)) {
      const source_size = statSync(source_path).size;
      const output_size = statSync(output_path).size;
      total_source_size += source_size;
      total_output_size += output_size;

      console.log(`= ${file} [unchanged]`);
      unchanged++;
      continue;
    }

    // Minify the file
    const result = minify_file(file);

    if (result.success) {
      total_source_size += result.source_size;
      total_output_size += result.output_size;
      manifest.set(file, current_hash);

      console.log(`→ ${file} (${result.source_size}B → ${result.output_size}B) [-${result.reduction}%]`);
      updated++;
    } else {
      console.log(`✗ ${file} - ERROR: ${result.error}`);
      failed++;
    }
  }

  // Save updated manifest (uses save_manifest function defined above)
  save_manifest(manifest);

  // Summary
  const total_reduction = total_source_size > 0
    ? ((1 - total_output_size / total_source_size) * 100).toFixed(2)
    : 0;

  console.log('\n=== SUMMARY ===');
  console.log(`Updated:   ${updated}`);
  console.log(`Unchanged: ${unchanged}`);
  console.log(`Failed:    ${failed}`);
  console.log(`Total reduction: ${total_reduction}%`);

  if (failed > 0) {
    console.log('\n⚠️  Some files failed to minify. Check errors above.');
    process.exit(1);
  }

  console.log('\n✓ Minification complete');
  console.log('Next: Run verify-minification.mjs to validate');
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
