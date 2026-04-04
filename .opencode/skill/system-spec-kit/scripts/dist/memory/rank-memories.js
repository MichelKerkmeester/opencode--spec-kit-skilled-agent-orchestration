#!/usr/bin/env node
"use strict";
// ---------------------------------------------------------------
// MODULE: Rank Memories
// ---------------------------------------------------------------
// ───────────────────────────────────────────────────────────────
// 1. RANK MEMORIES
// ───────────────────────────────────────────────────────────────
// Computes composite ranking scores for memories and folders with recency decay
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
exports.DECAY_RATE = exports.SCORE_WEIGHTS = exports.TIER_WEIGHTS = exports.simplifyFolderPath = exports.computeRecencyScore = exports.getArchiveMultiplier = exports.isArchived = void 0;
exports.formatRelativeTime = formatRelativeTime;
exports.computeFolderScore = computeFolderScore;
exports.processMemories = processMemories;
const fs = __importStar(require("fs"));
/* ───────────────────────────────────────────────────────────────
   1. IMPORTS FROM FOLDER-SCORING
------------------------------------------------------------------*/
const folder_scoring_1 = require("@spec-kit/shared/scoring/folder-scoring");
Object.defineProperty(exports, "isArchived", { enumerable: true, get: function () { return folder_scoring_1.isArchived; } });
Object.defineProperty(exports, "getArchiveMultiplier", { enumerable: true, get: function () { return folder_scoring_1.getArchiveMultiplier; } });
Object.defineProperty(exports, "computeRecencyScore", { enumerable: true, get: function () { return folder_scoring_1.computeRecencyScore; } });
Object.defineProperty(exports, "simplifyFolderPath", { enumerable: true, get: function () { return folder_scoring_1.simplifyFolderPath; } });
Object.defineProperty(exports, "TIER_WEIGHTS", { enumerable: true, get: function () { return folder_scoring_1.TIER_WEIGHTS; } });
Object.defineProperty(exports, "SCORE_WEIGHTS", { enumerable: true, get: function () { return folder_scoring_1.SCORE_WEIGHTS; } });
Object.defineProperty(exports, "DECAY_RATE", { enumerable: true, get: function () { return folder_scoring_1.DECAY_RATE; } });
/* ───────────────────────────────────────────────────────────────
   3. HELPER FUNCTIONS
------------------------------------------------------------------*/
function formatRelativeTime(timestamp) {
    const date = new Date(timestamp);
    if (isNaN(date.getTime())) {
        return 'unknown';
    }
    const daysSince = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince < 0)
        return 'future';
    if (daysSince < 1 / 24)
        return 'just now';
    if (daysSince < 1)
        return `${Math.floor(daysSince * 24)}h ago`;
    if (daysSince < 7)
        return `${Math.floor(daysSince)}d ago`;
    if (daysSince < 30)
        return `${Math.floor(daysSince / 7)}w ago`;
    if (daysSince < 365)
        return `${Math.floor(daysSince / 30)}mo ago`;
    return `${Math.floor(daysSince / 365)}y ago`;
}
function formatFolderDisplay(folder) {
    const name = folder.simplified || (0, folder_scoring_1.simplifyFolderPath)(folder.folder);
    const count = folder.memoryCount || 0;
    const time = folder.lastUpdateRelative || formatRelativeTime(folder.lastUpdate);
    const scorePercent = Math.round((folder.score || 0) * 100);
    return `${name} (${count}, ${time}) ${scorePercent}%`;
}
function computeFolderScore(folderPath, folderMemories) {
    // NormalizedMemory is structurally compatible with FolderMemoryInput (id: string|number vs string is the only diff)
    const result = (0, folder_scoring_1.computeSingleFolderScore)(folderPath, folderMemories);
    return result.score;
}
function normalizeMemory(m) {
    return {
        id: m.id ?? 0,
        title: m.title ?? 'Untitled',
        specFolder: m.specFolder ?? 'unknown',
        importanceTier: m.importanceTier ?? 'normal',
        createdAt: m.createdAt ?? new Date().toISOString(),
        updatedAt: m.updatedAt ?? m.createdAt ?? new Date().toISOString(),
        filePath: m.filePath ?? null,
        triggerCount: m.triggerCount ?? 0,
        importanceWeight: m.importanceWeight ?? 0.5
    };
}
/* ───────────────────────────────────────────────────────────────
   4. MAIN PROCESSING
------------------------------------------------------------------*/
function processMemories(rawMemories, options = {}) {
    const { showArchived = false, folderLimit = 3, memoryLimit = 5 } = options;
    const memories = rawMemories.map(normalizeMemory);
    const constitutional = memories
        .filter((m) => m.importanceTier === 'constitutional')
        .slice(0, folderLimit)
        .map((m) => ({
        id: m.id,
        title: m.title,
        specFolder: m.specFolder,
        simplified: (0, folder_scoring_1.simplifyFolderPath)(m.specFolder)
    }));
    const folderMap = new Map();
    for (const memory of memories) {
        const folder = memory.specFolder || 'unknown';
        if (!folderMap.has(folder)) {
            folderMap.set(folder, []);
        }
        const folderList = folderMap.get(folder);
        if (folderList)
            folderList.push(memory);
    }
    const folderScores = [];
    for (const [folder, folderMemories] of folderMap) {
        const isArchivedFolder = (0, folder_scoring_1.isArchived)(folder);
        if (isArchivedFolder && !showArchived)
            continue;
        const score = computeFolderScore(folder, folderMemories);
        const topTier = (0, folder_scoring_1.findTopTier)(folderMemories);
        const lastActivity = (0, folder_scoring_1.findLastActivity)(folderMemories);
        folderScores.push({
            folder,
            simplified: (0, folder_scoring_1.simplifyFolderPath)(folder),
            score: Math.round(score * 1000) / 1000,
            memoryCount: folderMemories.length,
            lastUpdate: lastActivity,
            lastUpdateRelative: formatRelativeTime(lastActivity),
            topTier: topTier,
            isArchived: isArchivedFolder
        });
    }
    folderScores.sort((a, b) => b.score - a.score);
    const highImportance = folderScores
        .filter((f) => f.topTier === 'critical' || f.topTier === 'constitutional')
        .filter((f) => !f.isArchived)
        .slice(0, folderLimit);
    const recentlyActive = folderScores
        .filter((f) => !f.isArchived)
        .slice(0, folderLimit);
    const recentMemories = [...memories]
        .filter((m) => m.importanceTier !== 'constitutional')
        .filter((m) => showArchived || !(0, folder_scoring_1.isArchived)(m.specFolder))
        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        .slice(0, memoryLimit)
        .map((m) => ({
        id: m.id,
        title: m.title,
        specFolder: m.specFolder,
        simplified: (0, folder_scoring_1.simplifyFolderPath)(m.specFolder),
        updatedAt: m.updatedAt,
        updatedAtRelative: formatRelativeTime(m.updatedAt),
        tier: m.importanceTier || 'normal'
    }));
    const allFolders = [];
    for (const [folder] of folderMap) {
        allFolders.push({
            folder,
            isArchived: (0, folder_scoring_1.isArchived)(folder)
        });
    }
    const archivedCount = allFolders.filter((f) => f.isArchived).length;
    return {
        constitutional,
        recentlyActive,
        highImportance,
        recentMemories,
        stats: {
            totalMemories: memories.length,
            totalFolders: folderMap.size,
            activeFolders: folderMap.size - archivedCount,
            archivedFolders: archivedCount,
            showingArchived: showArchived
        }
    };
}
/* ───────────────────────────────────────────────────────────────
   5. CLI INTERFACE
------------------------------------------------------------------*/
function readStdin() {
    return new Promise((resolve, reject) => {
        let data = '';
        process.stdin.setEncoding('utf8');
        if (process.stdin.isTTY) {
            resolve('');
            return;
        }
        process.stdin.on('readable', () => {
            let chunk;
            while ((chunk = process.stdin.read()) !== null) {
                data += chunk;
            }
        });
        process.stdin.on('end', () => resolve(data));
        process.stdin.on('error', reject);
    });
}
function parseArgs(args) {
    const options = {
        showArchived: false,
        folderLimit: 3,
        memoryLimit: 5,
        format: 'full',
        filePath: null
    };
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];
        if (arg === '--show-archived') {
            options.showArchived = true;
        }
        else if (arg === '--folder-limit' && args[i + 1]) {
            options.folderLimit = parseInt(args[++i], 10) || 3;
        }
        else if (arg === '--memory-limit' && args[i + 1]) {
            options.memoryLimit = parseInt(args[++i], 10) || 5;
        }
        else if (arg === '--format' && args[i + 1]) {
            options.format = args[++i];
        }
        else if (arg.startsWith('--file=')) {
            options.filePath = arg.slice(7);
        }
        else if (!arg.startsWith('--') && (arg.endsWith('.json') || fs.existsSync(arg))) {
            options.filePath = arg;
        }
    }
    return options;
}
function showHelp() {
    console.log(`
rank-memories.js - Compute composite ranking scores for memories and folders

Usage:
  cat memories.json | node rank-memories.js [options]
  node rank-memories.js /path/to/memories.json [options]

Options:
  --show-archived     Include archived folders in output
  --folder-limit N    Max folders per section (default: 3)
  --memory-limit N    Max recent memories (default: 5)
  --format compact    Output format (compact|full)
  --help, -h          Show this help
`);
}
/* ───────────────────────────────────────────────────────────────
   6. ENTRY POINT
------------------------------------------------------------------*/
async function main() {
    const args = process.argv.slice(2);
    if (args.includes('--help') || args.includes('-h')) {
        showHelp();
        process.exit(0);
    }
    const options = parseArgs(args);
    let inputData;
    try {
        if (options.filePath) {
            inputData = fs.readFileSync(options.filePath, 'utf8');
        }
        else {
            inputData = await readStdin();
        }
    }
    catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`Error reading input: ${errMsg}`);
        process.exit(1);
    }
    if (!inputData || inputData.trim() === '') {
        console.error('Error: No input data provided. Pipe JSON or specify a file path.');
        console.error('Run with --help for usage information.');
        process.exit(1);
    }
    let parsedMemories = null;
    try {
        const parsed = JSON.parse(inputData);
        if (Array.isArray(parsed)) {
            parsedMemories = parsed;
        }
        else if (typeof parsed === 'object' &&
            parsed !== null &&
            'results' in parsed &&
            Array.isArray(parsed.results)) {
            parsedMemories = parsed.results;
        }
        else {
            throw new Error('Input JSON must be an array or an object with a results array');
        }
    }
    catch (err) {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`Error parsing JSON: ${errMsg}`);
        process.exit(1);
        return;
    }
    if (!parsedMemories) {
        return;
    }
    const memories = parsedMemories;
    const result = processMemories(memories, {
        showArchived: options.showArchived,
        folderLimit: options.folderLimit,
        memoryLimit: options.memoryLimit
    });
    if (options.format === 'compact') {
        console.log(JSON.stringify(result));
    }
    else {
        console.log(JSON.stringify(result, null, 2));
    }
}
// Guard main() execution to prevent side effects on import
if (require.main === module) {
    main().catch((err) => {
        const errMsg = err instanceof Error ? err.message : String(err);
        console.error(`Error: ${errMsg}`);
        process.exit(1);
    });
}
//# sourceMappingURL=rank-memories.js.map