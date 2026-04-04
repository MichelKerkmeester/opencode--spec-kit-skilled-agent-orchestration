"use strict";
// ---------------------------------------------------------------
// MODULE: Directory Setup
// ---------------------------------------------------------------
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
exports.setupContextDirectory = setupContextDirectory;
// ───────────────────────────────────────────────────────────────
// 1. DIRECTORY SETUP
// ───────────────────────────────────────────────────────────────
// Creates and configures spec folder directory structure with memory subdirectories
// Node stdlib
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
// Internal modules
const utils_1 = require("../utils");
const core_1 = require("../core");
/* ───────────────────────────────────────────────────────────────
   1. DIRECTORY SETUP
------------------------------------------------------------------*/
async function setupContextDirectory(specFolder) {
    let sanitizedPath;
    try {
        sanitizedPath = (0, utils_1.sanitizePath)(specFolder, (0, core_1.getSpecsDirectories)());
    }
    catch (sanitizeError) {
        const errMsg = sanitizeError instanceof Error ? sanitizeError.message : String(sanitizeError);
        (0, utils_1.structuredLog)('error', 'Invalid spec folder path', {
            specFolder,
            error: errMsg
        });
        throw new Error(`Invalid spec folder path: ${errMsg}`);
    }
    const leafFolder = path.basename(sanitizedPath);
    if (!core_1.SPEC_FOLDER_PATTERN.test(leafFolder)) {
        (0, utils_1.structuredLog)('error', 'Spec folder leaf name is invalid', {
            specFolder: sanitizedPath,
            expected: 'NNN-name'
        });
        throw new Error(`Invalid spec folder path: expected leaf folder in NNN-name format, received "${leafFolder}"`);
    }
    try {
        const stats = await fs.stat(sanitizedPath);
        if (!stats.isDirectory()) {
            throw new Error(`Path exists but is not a directory: ${sanitizedPath}`);
        }
    }
    catch (err) {
        const nodeErr = err instanceof Error ? err : undefined;
        if (nodeErr?.code === 'ENOENT') {
            const specsDir = (0, core_1.findActiveSpecsDir)() || path.join(core_1.CONFIG.PROJECT_ROOT, 'specs');
            let availableFolders = [];
            try {
                const entries = await fs.readdir(specsDir, { withFileTypes: true });
                availableFolders = entries
                    .filter((e) => e.isDirectory())
                    .map((e) => e.name)
                    .slice(0, 10);
            }
            catch (error) {
                if (error instanceof Error) {
                    // Specs/ doesn't exist or can't be read
                }
            }
            let errorMsg = `Spec folder does not exist: ${sanitizedPath}`;
            errorMsg += '\nPlease create the spec folder first or check the path.';
            errorMsg += `\nSearched in: ${(0, core_1.getSpecsDirectories)().join(', ')}`;
            if (availableFolders.length > 0) {
                const activeDirName = path.basename(specsDir);
                errorMsg += `\n\nAvailable spec folders (in ${activeDirName}/):`;
                availableFolders.forEach((f) => errorMsg += `\n  - ${activeDirName}/${f}`);
            }
            (0, utils_1.structuredLog)('error', 'Spec folder not found', {
                specFolder: sanitizedPath,
                availableFolders
            });
            throw new Error(errorMsg);
        }
        throw err;
    }
    const contextDir = path.join(sanitizedPath, 'memory');
    try {
        await fs.mkdir(contextDir, { recursive: true });
    }
    catch (mkdirError) {
        const nodeErr = mkdirError instanceof Error ? mkdirError : undefined;
        (0, utils_1.structuredLog)('error', 'Failed to create memory directory', {
            contextDir,
            error: nodeErr?.message ?? String(mkdirError),
            code: nodeErr?.code
        });
        let errorMsg = `Failed to create memory directory: ${contextDir}`;
        if (nodeErr?.code === 'EACCES') {
            errorMsg += ' (Permission denied. Check directory permissions.)';
        }
        else if (nodeErr?.code === 'ENOSPC') {
            errorMsg += ' (No space left on device.)';
        }
        throw new Error(errorMsg);
    }
    return contextDir;
}
//# sourceMappingURL=directory-setup.js.map