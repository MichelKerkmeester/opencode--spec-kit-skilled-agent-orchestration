#!/usr/bin/env node

/**
 * Add Anchors to Memory Files
 * 
 * Adds minimal anchors to memory files that don't have them.
 * - Adds summary anchor around main content
 * - Adds decisions anchor if a Decisions section exists
 * 
 * Usage: node add-anchors.js [--dry-run]
 */

const fs = require('fs');
const path = require('path');

const DRY_RUN = process.argv.includes('--dry-run');

// Files that need anchors added (from analysis)
const FILES_WITHOUT_ANCHORS = [
  'specs/003-commands/001-command-analysis/memory/context-2025-12-15.md',
  'specs/004-speckit/001-scratch-enforcement/memory/13-12-25_scratch-enforcement-complete.md',
  'specs/005-memory/001-refinement-dec-13/memory/13-12-25_11-39__memory-system-fixes.md',
  'specs/005-memory/001-refinement-dec-13/memory/13-12-25_16-05__database-path-documentation-audit.md',
  'specs/005-memory/004-auto-indexing/memory/16-12-25_13-30__command-alignment.md',
  'specs/005-memory/004-auto-indexing/memory/16-12-24_memory-docs-cleanup.md',
  'specs/005-memory/004-auto-indexing/memory/16-12-25_12-45__session-complete.md',
  'specs/006-code-refinement/004-table-of-content/003-icon-animation-isolation/memory/2024-12-14_toc-scroll-lenis-fix.md',
  'specs/006-code-refinement/004-table-of-content/002-tab-main-component/memory/2024-12-13__implementation.md',
  'specs/006-code-refinement/004-table-of-content/001-toc-scrollspy/memory/2024-12-13__research-synthesis.md',
  'specs/002-skills/008-doc-specialist-refactor/memory/14-12-24_planning_session.md',
  'specs/002-skills/008-doc-specialist-refactor/memory/14-12-24_implementation_complete.md',
  'specs/002-skills/008-doc-specialist-refactor/memory/14-12-24_script_enhancements.md',
  'specs/002-skills/008-doc-specialist-refactor/memory/14-12-24_header_standardization.md',
  'specs/002-skills/008-doc-specialist-refactor/memory/14-12-24_honesty_pass.md',
  'specs/001-agents-md/001-refinement-dec-13/memory/2024-12-13__session-context.md',
];

const BASE_PATH = '/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com';

/**
 * Generate anchor ID from filename
 */
function generateAnchorId(filename, type = 'summary') {
  // Remove .md extension
  const stem = path.basename(filename, '.md');
  // Sanitize: lowercase, replace spaces and special chars with hyphens
  const sanitized = stem.toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return `${type}-${sanitized}`;
}

/**
 * Find the index where main content starts (after header/metadata)
 */
function findContentStart(lines) {
  let separatorCount = 0;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].trim() === '---') {
      separatorCount++;
      if (separatorCount >= 1) {
        // Return the line after the first ---
        return i + 1;
      }
    }
    // If we hit a ## header before ---, content starts here
    if (lines[i].startsWith('## ') && separatorCount === 0) {
      return i;
    }
  }
  // Default: start after first line (title)
  return 1;
}

/**
 * Find decisions section if it exists
 */
function findDecisionsSection(lines) {
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].toLowerCase();
    if (line.match(/^##\s*(key\s+)?decisions/)) {
      // Find where this section ends (next ## header or end of file)
      let end = lines.length;
      for (let j = i + 1; j < lines.length; j++) {
        if (lines[j].match(/^##\s/)) {
          end = j;
          break;
        }
      }
      return { start: i, end: end };
    }
  }
  return null;
}

/**
 * Add anchors to a file
 */
function addAnchorsToFile(filePath) {
  const fullPath = path.join(BASE_PATH, filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`  ⚠️  File not found: ${filePath}`);
    return false;
  }
  
  const content = fs.readFileSync(fullPath, 'utf8');
  const lines = content.split('\n');
  
  // Check if already has anchors
  if (content.match(/<!--\s*(ANCHOR|anchor):/i)) {
    console.log(`  ⏭️  Already has anchors: ${filePath}`);
    return false;
  }
  
  const filename = path.basename(filePath);
  const summaryAnchorId = generateAnchorId(filename, 'summary');
  
  // Find where to insert anchors
  const contentStart = findContentStart(lines);
  const decisionsSection = findDecisionsSection(lines);
  
  // Build new lines array
  const newLines = [];
  
  for (let i = 0; i < lines.length; i++) {
    // Add summary opening anchor after header area
    if (i === contentStart) {
      newLines.push(`<!-- ANCHOR:${summaryAnchorId} -->`);
      newLines.push('');
    }
    
    // Add decisions anchor if we're at decisions section
    if (decisionsSection && i === decisionsSection.start) {
      const decisionsAnchorId = generateAnchorId(filename, 'decisions');
      newLines.push(`<!-- ANCHOR:${decisionsAnchorId} -->`);
    }
    
    newLines.push(lines[i]);
    
    // Close decisions anchor
    if (decisionsSection && i === decisionsSection.end - 1) {
      const decisionsAnchorId = generateAnchorId(filename, 'decisions');
      newLines.push(`<!-- /ANCHOR:${decisionsAnchorId} -->`);
      newLines.push('');
    }
  }
  
  // Add summary closing anchor at end
  newLines.push('');
  newLines.push(`<!-- /ANCHOR:${summaryAnchorId} -->`);
  
  const newContent = newLines.join('\n');
  
  if (DRY_RUN) {
    console.log(`  📝 Would update: ${filePath}`);
    console.log(`     - Summary anchor: ${summaryAnchorId}`);
    if (decisionsSection) {
      console.log(`     - Decisions anchor: decisions-${generateAnchorId(filename, 'decisions').replace('decisions-', '')}`);
    }
  } else {
    fs.writeFileSync(fullPath, newContent);
    console.log(`  ✅ Updated: ${filePath}`);
  }
  
  return true;
}

// Main
console.log('=== Adding Anchors to Memory Files ===');
console.log(`Mode: ${DRY_RUN ? 'DRY RUN (no changes)' : 'LIVE (writing files)'}`);
console.log('');

let updated = 0;
let skipped = 0;

for (const file of FILES_WITHOUT_ANCHORS) {
  if (addAnchorsToFile(file)) {
    updated++;
  } else {
    skipped++;
  }
}

console.log('');
console.log(`=== Complete ===`);
console.log(`Updated: ${updated}`);
console.log(`Skipped: ${skipped}`);

if (DRY_RUN) {
  console.log('');
  console.log('Run without --dry-run to apply changes.');
}
