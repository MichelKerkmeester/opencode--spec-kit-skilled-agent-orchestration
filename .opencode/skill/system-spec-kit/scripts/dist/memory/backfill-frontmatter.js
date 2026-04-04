#!/usr/bin/env node
"use strict";
// ---------------------------------------------------------------
// MODULE: Backfill Frontmatter
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. BACKFILL FRONTMATTER
// ───────────────────────────────────────────────────────────────
// Bulk normalizes markdown frontmatter for templates, spec docs, and memories.
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
exports.classifyDocument = void 0;
exports.run = run;
exports.parseArgs = parseArgs;
exports.discoverSpecsRoots = discoverSpecsRoots;
exports.collectSpecFiles = collectSpecFiles;
exports.collectTemplateFiles = collectTemplateFiles;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const frontmatter_migration_1 = require("../lib/frontmatter-migration");
Object.defineProperty(exports, "classifyDocument", { enumerable: true, get: function () { return frontmatter_migration_1.classifyDocument; } });
/* ───────────────────────────────────────────────────────────────
   2. CONSTANTS
------------------------------------------------------------------*/
function resolveProjectRoot() {
    const candidates = [
        path.resolve(__dirname, '../../../../../..'),
        path.resolve(__dirname, '../../../..'),
        process.cwd(),
    ];
    for (const candidate of candidates) {
        const templates = path.join(candidate, '.opencode', 'skill', 'system-spec-kit', 'templates');
        if (fs.existsSync(templates)) {
            return candidate;
        }
    }
    return candidates[0];
}
const PROJECT_ROOT = resolveProjectRoot();
const TEMPLATES_ROOT = path.join(PROJECT_ROOT, '.opencode', 'skill', 'system-spec-kit', 'templates');
const HELP_TEXT = `
backfill-frontmatter — Normalize markdown frontmatter for templates/spec docs/memory files

Usage:
  node backfill-frontmatter.js [options]

Required mode:
  --dry-run            Preview changes (default if --apply is omitted)
  --apply              Apply changes in-place

Options:
  --roots <paths>      Comma-separated specs root paths (default: auto-discover all dirs named "specs")
  --include-archive    Include z_archive trees (default: excluded)
  --skip-templates     Skip templates root processing
  --allow-malformed    Continue without failing when malformed frontmatter is detected
  --report <path>      Write JSON report to file
  --help, -h           Show this help message

Examples:
  node backfill-frontmatter.js --dry-run --include-archive
  node backfill-frontmatter.js --apply --roots .opencode/specs,specs --report /tmp/frontmatter-report.json
`;
/* ───────────────────────────────────────────────────────────────
   3. ARG PARSING
------------------------------------------------------------------*/
function parseArgs(argv) {
    let dryRun = true;
    let apply = false;
    let includeArchive = false;
    let skipTemplates = false;
    let allowMalformed = false;
    let roots = [];
    let reportPath = null;
    for (let i = 0; i < argv.length; i += 1) {
        const arg = argv[i];
        if (arg === '--help' || arg === '-h') {
            console.log(HELP_TEXT);
            process.exit(0);
        }
        if (arg === '--dry-run') {
            dryRun = true;
            apply = false;
            continue;
        }
        if (arg === '--apply') {
            apply = true;
            dryRun = false;
            continue;
        }
        if (arg === '--include-archive') {
            includeArchive = true;
            continue;
        }
        if (arg === '--skip-templates') {
            skipTemplates = true;
            continue;
        }
        if (arg === '--allow-malformed') {
            allowMalformed = true;
            continue;
        }
        if (arg === '--roots') {
            const value = argv[i + 1];
            if (!value || value.startsWith('--')) {
                throw new Error('--roots requires a comma-separated value');
            }
            i += 1;
            roots = value
                .split(',')
                .map((entry) => entry.trim())
                .filter((entry) => entry.length > 0)
                .map((entry) => {
                const resolved = path.resolve(PROJECT_ROOT, entry);
                const relative = path.relative(PROJECT_ROOT, resolved);
                if (relative.startsWith('..') || path.isAbsolute(relative)) {
                    throw new Error(`Path ${entry} is outside project boundary`);
                }
                return resolved;
            });
            continue;
        }
        if (arg === '--report') {
            const value = argv[i + 1];
            if (!value || value.startsWith('--')) {
                throw new Error('--report requires a file path');
            }
            i += 1;
            const resolvedReport = path.resolve(PROJECT_ROOT, value);
            const relative = path.relative(PROJECT_ROOT, resolvedReport);
            if (relative.startsWith('..') || path.isAbsolute(relative)) {
                throw new Error(`Path ${value} is outside project boundary`);
            }
            reportPath = resolvedReport;
            continue;
        }
        throw new Error(`Unknown argument: ${arg}`);
    }
    return {
        dryRun,
        apply,
        includeArchive,
        skipTemplates,
        allowMalformed,
        roots,
        reportPath,
    };
}
/* ───────────────────────────────────────────────────────────────
   4. DISCOVERY
------------------------------------------------------------------*/
function normalizePath(filePath) {
    return filePath.replace(/\\/g, '/');
}
function recordSkippedDir(skippedDirs, dirPath, error) {
    const message = error instanceof Error ? error.message : String(error);
    skippedDirs.push({
        dirPath,
        error: message,
    });
}
function discoverSpecsRoots(baseDir, skippedDirs = []) {
    const roots = [];
    const queue = [baseDir];
    const skipDirs = new Set([
        '.git',
        '.next',
        '.turbo',
        'node_modules',
        'dist',
        'build',
        '.cache',
        '.pytest_cache',
    ]);
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        let entries = [];
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
        }
        catch (error) {
            recordSkippedDir(skippedDirs, current, error);
            continue;
        }
        for (const entry of entries) {
            if (!entry.isDirectory()) {
                continue;
            }
            if (skipDirs.has(entry.name)) {
                continue;
            }
            const fullPath = path.join(current, entry.name);
            if (entry.name === 'specs') {
                roots.push(fullPath);
                continue;
            }
            queue.push(fullPath);
        }
    }
    const deduped = new Map();
    for (const root of roots) {
        try {
            const realPath = fs.realpathSync(root);
            if (!deduped.has(realPath)) {
                deduped.set(realPath, root);
            }
        }
        catch (error) {
            if (error instanceof Error && !deduped.has(root)) {
                deduped.set(root, root);
                continue;
            }
            if (!deduped.has(root)) {
                deduped.set(root, root);
            }
        }
    }
    return Array.from(deduped.values()).sort();
}
function collectTemplateFiles(rootPath, skippedDirs = []) {
    if (!fs.existsSync(rootPath)) {
        return [];
    }
    const files = [];
    const queue = [rootPath];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        let entries = [];
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
        }
        catch (error) {
            recordSkippedDir(skippedDirs, current, error);
            continue;
        }
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            if (entry.isDirectory()) {
                queue.push(fullPath);
                continue;
            }
            if (entry.isFile() && entry.name.toLowerCase().endsWith('.md')) {
                files.push(fullPath);
            }
        }
    }
    return files.sort();
}
function collectSpecFiles(rootPath, includeArchive, skippedDirs = []) {
    if (!fs.existsSync(rootPath)) {
        return [];
    }
    const files = [];
    const queue = [rootPath];
    while (queue.length > 0) {
        const current = queue.shift();
        if (!current) {
            continue;
        }
        let entries = [];
        try {
            entries = fs.readdirSync(current, { withFileTypes: true });
        }
        catch (error) {
            recordSkippedDir(skippedDirs, current, error);
            continue;
        }
        for (const entry of entries) {
            const fullPath = path.join(current, entry.name);
            const normalized = normalizePath(fullPath);
            if (entry.isDirectory()) {
                if (!includeArchive && normalized.includes('/z_archive/')) {
                    continue;
                }
                queue.push(fullPath);
                continue;
            }
            if (!entry.isFile() || !entry.name.toLowerCase().endsWith('.md')) {
                continue;
            }
            const lowerName = entry.name.toLowerCase();
            if (normalized.includes('/memory/')) {
                files.push(fullPath);
                continue;
            }
            if (frontmatter_migration_1.SPEC_DOC_BASENAMES.has(lowerName)) {
                files.push(fullPath);
            }
        }
    }
    return files.sort();
}
/* ───────────────────────────────────────────────────────────────
   5. MIGRATION
------------------------------------------------------------------*/
function initializeReport(options) {
    return {
        generatedAt: new Date().toISOString(),
        mode: options.apply ? 'apply' : 'dry-run',
        options: {
            includeArchive: options.includeArchive,
            skipTemplates: options.skipTemplates,
            allowMalformed: options.allowMalformed,
            roots: options.roots,
        },
        summary: {
            total: 0,
            changed: 0,
            unchanged: 0,
            failed: 0,
            malformedSkipped: 0,
            skippedDirs: 0,
        },
        byKind: {},
        changedFiles: [],
        failedFiles: [],
        skippedDirs: [],
    };
}
function addKindCounters(report, classification, changed) {
    const key = `${classification.kind}:${classification.documentType}`;
    if (!report.byKind[key]) {
        report.byKind[key] = { total: 0, changed: 0 };
    }
    report.byKind[key].total += 1;
    if (changed) {
        report.byKind[key].changed += 1;
    }
}
function writeReport(report, reportPath) {
    const dir = path.dirname(reportPath);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(reportPath, `${JSON.stringify(report, null, 2)}\n`, 'utf-8');
}
function printSummary(report) {
    console.log('\n=== Frontmatter Migration Summary ===');
    console.log(`Mode:      ${report.mode}`);
    console.log(`Total:     ${report.summary.total}`);
    console.log(`Changed:   ${report.summary.changed}`);
    console.log(`Unchanged: ${report.summary.unchanged}`);
    console.log(`Failed:    ${report.summary.failed}`);
    console.log(`Malformed: ${report.summary.malformedSkipped}`);
    console.log(`Skipped:   ${report.summary.skippedDirs}`);
    console.log('\nBy kind:');
    const keys = Object.keys(report.byKind).sort();
    for (const key of keys) {
        const bucket = report.byKind[key];
        console.log(`  ${key} -> ${bucket.changed}/${bucket.total} changed`);
    }
    if (report.summary.failed > 0) {
        console.log('\nFailures:');
        for (const failed of report.failedFiles.slice(0, 20)) {
            console.log(`  ${failed.filePath}`);
            console.log(`    ${failed.error}`);
        }
        if (report.failedFiles.length > 20) {
            console.log(`  ... and ${report.failedFiles.length - 20} more`);
        }
    }
    if (report.summary.skippedDirs > 0) {
        console.log('\nSkipped directories:');
        for (const skipped of report.skippedDirs.slice(0, 20)) {
            console.log(`  ${skipped.dirPath}`);
            console.log(`    ${skipped.error}`);
        }
        if (report.skippedDirs.length > 20) {
            console.log(`  ... and ${report.skippedDirs.length - 20} more`);
        }
    }
}
function run() {
    const options = parseArgs(process.argv.slice(2));
    const skippedDirs = [];
    const roots = options.roots.length > 0
        ? options.roots
        : discoverSpecsRoots(PROJECT_ROOT, skippedDirs);
    options.roots = roots;
    if (!options.skipTemplates && !fs.existsSync(TEMPLATES_ROOT)) {
        throw new Error(`Templates root not found: ${TEMPLATES_ROOT}`);
    }
    const allTargets = [];
    if (!options.skipTemplates) {
        allTargets.push(...collectTemplateFiles(TEMPLATES_ROOT, skippedDirs));
    }
    for (const root of roots) {
        allTargets.push(...collectSpecFiles(root, options.includeArchive, skippedDirs));
    }
    const deduped = Array.from(new Set(allTargets.map((entry) => path.resolve(entry)))).sort();
    const report = initializeReport(options);
    report.skippedDirs.push(...skippedDirs);
    report.summary.skippedDirs = report.skippedDirs.length;
    for (const filePath of deduped) {
        report.summary.total += 1;
        let originalContent = '';
        try {
            originalContent = fs.readFileSync(filePath, 'utf-8');
            const result = (0, frontmatter_migration_1.buildFrontmatterContent)(originalContent, { templatesRoot: TEMPLATES_ROOT }, filePath);
            if (result.malformedFrontmatter) {
                report.summary.malformedSkipped += 1;
                const reason = result.malformedReason || 'Malformed frontmatter detected';
                if (options.allowMalformed) {
                    report.summary.unchanged += 1;
                }
                else {
                    report.summary.failed += 1;
                    report.failedFiles.push({
                        filePath,
                        error: reason,
                        category: 'malformed_frontmatter',
                    });
                }
                continue;
            }
            addKindCounters(report, result.classification, result.changed);
            if (result.changed) {
                report.summary.changed += 1;
                report.changedFiles.push({
                    filePath,
                    kind: result.classification.kind,
                    documentType: result.classification.documentType,
                    title: result.managed.title,
                    hadFrontmatter: result.hadFrontmatter,
                });
                if (options.apply) {
                    fs.writeFileSync(filePath, result.content, 'utf-8');
                }
            }
            else {
                report.summary.unchanged += 1;
            }
        }
        catch (error) {
            report.summary.failed += 1;
            const message = error instanceof Error ? error.message : String(error);
            report.failedFiles.push({ filePath, error: message });
        }
    }
    printSummary(report);
    if (options.reportPath) {
        writeReport(report, options.reportPath);
        console.log(`\nReport: ${options.reportPath}`);
    }
    if (report.summary.failed > 0) {
        process.exit(1);
    }
}
if (require.main === module) {
    try {
        run();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`[backfill-frontmatter] ${message}`);
        process.exit(1);
    }
}
//# sourceMappingURL=backfill-frontmatter.js.map