#!/usr/bin/env node
"use strict";
// ---------------------------------------------------------------
// MODULE: Wrap All Templates
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. WRAP ALL TEMPLATES
// ───────────────────────────────────────────────────────────────
/**
 * Wraps all level_1-3+ template files with ANCHOR tags
 * Uses anchor-generator.ts wrapSectionsWithAnchors() function
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("node:fs"));
const path = __importStar(require("node:path"));
const anchor_generator_js_1 = require("./lib/anchor-generator.js");
const SCRIPT_DIR = __dirname;
const TEMPLATE_BASE = path.resolve(SCRIPT_DIR, '..', 'templates');
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
                success: true,
                skipped: true,
                anchorsAdded: 0,
                anchorsPreserved: 0,
                collisions: 0,
                error: 'Not present for this level (skipped)'
            };
        }
        // Read file content
        const content = fs.readFileSync(filePath, 'utf-8');
        // Wrap sections with ANCHOR tags
        const result = (0, anchor_generator_js_1.wrapSectionsWithAnchors)(content);
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
    let totalSkipped = 0;
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
                if (result.skipped) {
                    totalSkipped++;
                    console.log(`  · ${filename}: Not present for this level (skipped)`);
                    continue;
                }
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
    console.log(`Skipped: ${totalSkipped}`);
    console.log(`Failed: ${totalFiles - totalSuccess}`);
    console.log(`Total anchors added: ${totalAnchorsAdded}`);
    console.log(`Total anchors preserved: ${totalAnchorsPreserved}`);
    // Detailed results
    console.log('\n## Detailed Results');
    console.log('| File | Status | Added | Preserved | Issues |');
    console.log('|------|--------|-------|-----------|--------|');
    for (const result of results) {
        const status = result.skipped ? '·' : (result.success ? '✓' : '✗');
        const issues = result.error || '-';
        console.log(`| ${result.file} | ${status} | ${result.anchorsAdded} | ${result.anchorsPreserved} | ${issues} |`);
    }
    process.exit(totalFiles === totalSuccess ? 0 : 1);
}
main();
//# sourceMappingURL=wrap-all-templates.js.map