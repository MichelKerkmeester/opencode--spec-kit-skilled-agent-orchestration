#!/usr/bin/env node
/**
 * Wraps all level_1-3+ template files with ANCHOR tags
 * Uses anchor-generator.ts wrapSectionsWithAnchors() function
 */
import * as fs from 'node:fs';
import * as path from 'node:path';
import { wrapSectionsWithAnchors } from '../../../../../skill/system-spec-kit/scripts/dist/lib/anchor-generator.js';
const TEMPLATE_BASE = '/Users/michelkerkmeester/MEGA/Development/Opencode Env/Public/.opencode/skill/system-spec-kit/templates';
const LEVEL_FOLDERS = ['level_1', 'level_2', 'level_3', 'level_3+'];
const TEMPLATE_FILES = [
    'spec.md',
    'plan.md',
    'tasks.md',
    'checklist.md',
    'decision-record.md',
    'implementation-summary.md'
];
async function processTemplate(filePath) {
    const relativePath = filePath.replace(TEMPLATE_BASE + '/', '');
    try {
        // Check if file exists
        if (!fs.existsSync(filePath)) {
            return {
                file: relativePath,
                success: false,
                anchorsAdded: 0,
                anchorsPreserved: 0,
                collisions: 0,
                error: 'File not found (skipped)'
            };
        }
        // Read file content
        const content = fs.readFileSync(filePath, 'utf-8');
        // Wrap sections with ANCHOR tags
        const result = wrapSectionsWithAnchors(content);
        // Only write if anchors were added
        if (result.anchorsAdded > 0) {
            fs.writeFileSync(filePath, result.content, 'utf-8');
        }
        return {
            file: relativePath,
            success: true,
            anchorsAdded: result.anchorsAdded,
            anchorsPreserved: result.anchorsPreserved,
            collisions: result.collisions.length,
            error: result.collisions.length > 0 ? `Collisions: ${result.collisions.join(', ')}` : undefined
        };
    }
    catch (error) {
        return {
            file: relativePath,
            success: false,
            anchorsAdded: 0,
            anchorsPreserved: 0,
            collisions: 0,
            error: error instanceof Error ? error.message : String(error)
        };
    }
}
async function main() {
    console.log('ANCHOR Template Wrapper');
    console.log('======================\n');
    const results = [];
    let totalFiles = 0;
    let totalSuccess = 0;
    let totalAnchorsAdded = 0;
    let totalAnchorsPreserved = 0;
    // Process each level folder
    for (const level of LEVEL_FOLDERS) {
        console.log(`\n## Processing ${level}/`);
        for (const filename of TEMPLATE_FILES) {
            const filePath = path.join(TEMPLATE_BASE, level, filename);
            totalFiles++;
            const result = await processTemplate(filePath);
            results.push(result);
            if (result.success) {
                totalSuccess++;
                totalAnchorsAdded += result.anchorsAdded;
                totalAnchorsPreserved += result.anchorsPreserved;
                if (result.anchorsAdded > 0) {
                    console.log(`  ✓ ${filename}: +${result.anchorsAdded} anchors (${result.anchorsPreserved} preserved)`);
                }
                else {
                    console.log(`  - ${filename}: No changes needed (${result.anchorsPreserved} existing)`);
                }
            }
            else {
                console.log(`  ✗ ${filename}: ${result.error}`);
            }
        }
    }
    // Summary
    console.log('\n## Summary');
    console.log(`Total files processed: ${totalFiles}`);
    console.log(`Success: ${totalSuccess}`);
    console.log(`Failed: ${totalFiles - totalSuccess}`);
    console.log(`Total anchors added: ${totalAnchorsAdded}`);
    console.log(`Total anchors preserved: ${totalAnchorsPreserved}`);
    // Detailed results
    console.log('\n## Detailed Results');
    console.log('| File | Status | Added | Preserved | Issues |');
    console.log('|------|--------|-------|-----------|--------|');
    for (const result of results) {
        const status = result.success ? '✓' : '✗';
        const issues = result.error || '-';
        console.log(`| ${result.file} | ${status} | ${result.anchorsAdded} | ${result.anchorsPreserved} | ${issues} |`);
    }
    process.exit(totalFiles === totalSuccess ? 0 : 1);
}
main();
