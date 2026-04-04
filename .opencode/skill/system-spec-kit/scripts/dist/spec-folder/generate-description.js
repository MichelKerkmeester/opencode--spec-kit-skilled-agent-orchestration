"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Generate Description
// ───────────────────────────────────────────────────────────────
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
// ───────────────────────────────────────────────────────────────
// 1. GENERATE DESCRIPTION
// ───────────────────────────────────────────────────────────────
// CLI: Generate Per-Folder description.json
// Usage: node generate-description.js <folder-path> <base-path> [--description "text"]
//
// If --description is provided, uses it directly + keyword extraction.
// Otherwise reads spec.md via generatePerFolderDescription().
const path = __importStar(require("node:path"));
const fs = __importStar(require("node:fs"));
const api_1 = require("@spec-kit/mcp-server/api");
function main() {
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
    let realFolder;
    let realBase;
    try {
        realFolder = fs.realpathSync(folderPath);
        realBase = fs.realpathSync(basePath);
    }
    catch (err) {
        console.error(`Error: cannot resolve real path — ${err.message}`);
        process.exit(1);
    }
    if (!(realFolder === realBase || realFolder.startsWith(realBase + path.sep))) {
        console.error(`Error: folder path escapes base path (${realFolder} not under ${realBase})`);
        process.exit(1);
    }
    // Parse --description flag
    let explicitDescription = null;
    const descIdx = args.indexOf('--description');
    if (descIdx !== -1 && args[descIdx + 1]) {
        explicitDescription = args[descIdx + 1];
    }
    let desc;
    if (explicitDescription) {
        // Build from explicit description
        const existing = (0, api_1.loadPerFolderDescription)(folderPath);
        const folderName = path.basename(folderPath);
        const numMatch = folderName.match(/^(\d+)/);
        const specId = numMatch ? numMatch[1] : '';
        const folderSlug = (0, api_1.slugifyFolderName)(folderName);
        const relativePath = path.relative(basePath, folderPath).replace(/\\/g, '/');
        const segments = relativePath.split('/').filter(Boolean);
        const parentChain = segments.length > 1 ? segments.slice(0, -1) : [];
        const normalizedRelativeFolder = relativePath && !relativePath.startsWith('..') ? relativePath : folderName;
        desc = {
            specFolder: normalizedRelativeFolder,
            description: explicitDescription.slice(0, 150),
            keywords: (0, api_1.extractKeywords)(explicitDescription),
            lastUpdated: new Date().toISOString(),
            specId,
            folderSlug,
            parentChain,
            memorySequence: existing?.memorySequence ?? 0,
            memoryNameHistory: existing?.memoryNameHistory ?? [],
        };
    }
    else {
        // Generate from spec.md
        desc = (0, api_1.generatePerFolderDescription)(folderPath, basePath);
    }
    if (!desc) {
        console.error('Could not generate description (missing spec.md or unreadable content)');
        process.exit(1);
    }
    (0, api_1.savePerFolderDescription)(desc, folderPath);
    console.log(`description.json created in ${folderPath}`);
}
main();
//# sourceMappingURL=generate-description.js.map