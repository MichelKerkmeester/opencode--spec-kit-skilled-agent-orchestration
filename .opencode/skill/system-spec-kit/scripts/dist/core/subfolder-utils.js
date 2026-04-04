"use strict";
// ---------------------------------------------------------------
// MODULE: Subfolder Utils
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
exports.SEARCH_MAX_DEPTH = exports.CATEGORY_FOLDER_PATTERN = exports.SPEC_FOLDER_BASIC_PATTERN = exports.SPEC_FOLDER_PATTERN = void 0;
exports.findChildFolderSync = findChildFolderSync;
exports.findChildFolderAsync = findChildFolderAsync;
// ───────────────────────────────────────────────────────────────
// 1. SUBFOLDER UTILS
// ───────────────────────────────────────────────────────────────
// CORE: SUBFOLDER UTILS
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
const fs = __importStar(require("fs/promises"));
const config_1 = require("./config");
/** Pattern for strict spec folder names: 3 digits + kebab-case suffix. */
exports.SPEC_FOLDER_PATTERN = /^\d{3}-[a-z][a-z0-9-]*$/;
/** Basic pattern for initial spec folder detection (less strict). */
exports.SPEC_FOLDER_BASIC_PATTERN = /^\d{3}-[a-zA-Z]/;
/** Pattern for category/organizational folders: 2 digits + double-hyphen + kebab-case (e.g., "02--system-spec-kit"). */
exports.CATEGORY_FOLDER_PATTERN = /^\d{2}--[a-z][a-z0-9-]*$/;
/** Maximum recursive search depth for child folder resolution. */
exports.SEARCH_MAX_DEPTH = 4;
/** Check if a directory entry is traversable during child folder search. */
function isTraversableFolder(name) {
    return exports.SPEC_FOLDER_PATTERN.test(name) || exports.CATEGORY_FOLDER_PATTERN.test(name);
}
/** Find a bare child folder under all spec parents (sync, recursive up to SEARCH_MAX_DEPTH). */
function findChildFolderSync(childName, options) {
    if (!childName)
        return null;
    const specsDirs = (0, config_1.getSpecsDirectories)();
    const matches = [];
    const visited = new Set();
    const warnings = [];
    // Deduplicate aliased roots upfront to avoid duplicate traversal
    const uniqueRoots = new Map();
    for (const specsDir of specsDirs) {
        if (!fsSync.existsSync(specsDir))
            continue;
        let realRoot;
        try {
            realRoot = fsSync.realpathSync(specsDir);
        }
        catch (_error) {
            if (_error instanceof Error) {
                void _error.message;
            }
            realRoot = path.resolve(specsDir);
        }
        if (!uniqueRoots.has(realRoot)) {
            uniqueRoots.set(realRoot, specsDir);
        }
    }
    function searchDir(dir, depth) {
        if (depth > exports.SEARCH_MAX_DEPTH) {
            warnings.push(`Search depth limit reached at: ${dir}`);
            return;
        }
        // Prevent cycle revisits via real-path tracking
        let realDir;
        try {
            realDir = fsSync.realpathSync(dir);
        }
        catch (_error) {
            if (_error instanceof Error) {
                void _error.message;
            }
            realDir = path.resolve(dir);
        }
        if (visited.has(realDir))
            return;
        visited.add(realDir);
        let dirents;
        try {
            dirents = fsSync.readdirSync(dir, { withFileTypes: true });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            warnings.push(`Could not read directory ${dir}: ${msg}`);
            return;
        }
        for (const dirent of dirents) {
            if (dirent.isSymbolicLink())
                continue;
            if (!dirent.isDirectory())
                continue;
            if (dirent.name === childName) {
                matches.push(path.join(dir, dirent.name));
            }
            else if (isTraversableFolder(dirent.name)) {
                searchDir(path.join(dir, dirent.name), depth + 1);
            }
        }
    }
    for (const specsDir of uniqueRoots.values()) {
        searchDir(specsDir, 0);
    }
    if (warnings.length > 0 && process.env.DEBUG) {
        warnings.forEach((w) => console.warn(`   [subfolder-utils] ${w}`));
    }
    if (matches.length === 1) {
        return matches[0];
    }
    if (matches.length > 1) {
        // Deduplicate aliased results (belt-and-suspenders with root dedup)
        const uniqueReal = [...new Set(matches.map((m) => {
                try {
                    return fsSync.realpathSync(m);
                }
                catch (_error) {
                    if (_error instanceof Error) {
                        void _error.message;
                    }
                    return m;
                }
            }))];
        if (uniqueReal.length === 1) {
            return matches[0];
        }
        const ambiguityHandler = options?.onAmbiguity ?? ((name, paths) => {
            console.error(`❌ Ambiguous child folder "${name}" found in multiple locations:`);
            paths.forEach((p) => console.error(`   - ${p}`));
        });
        ambiguityHandler(childName, matches);
        return null;
    }
    return null;
}
/** Find a bare child folder under all spec parents (async, recursive up to SEARCH_MAX_DEPTH). */
async function findChildFolderAsync(childName, options) {
    if (!childName)
        return null;
    const specsDirs = (0, config_1.getSpecsDirectories)();
    const matches = [];
    const visited = new Set();
    const warnings = [];
    // Deduplicate aliased roots upfront to avoid duplicate traversal
    const uniqueRoots = new Map();
    for (const specsDir of specsDirs) {
        try {
            await fs.access(specsDir);
            let realRoot;
            try {
                realRoot = await fs.realpath(specsDir);
            }
            catch (_error) {
                if (_error instanceof Error) {
                    void _error.message;
                }
                realRoot = path.resolve(specsDir);
            }
            if (!uniqueRoots.has(realRoot)) {
                uniqueRoots.set(realRoot, specsDir);
            }
        }
        catch (_error) {
            if (_error instanceof Error) {
                void _error.message;
            }
            continue;
        }
    }
    async function searchDir(dir, depth) {
        if (depth > exports.SEARCH_MAX_DEPTH) {
            warnings.push(`Search depth limit reached at: ${dir}`);
            return;
        }
        let realDir;
        try {
            realDir = await fs.realpath(dir);
        }
        catch (_error) {
            if (_error instanceof Error) {
                void _error.message;
            }
            realDir = path.resolve(dir);
        }
        if (visited.has(realDir))
            return;
        visited.add(realDir);
        let dirents;
        try {
            dirents = await fs.readdir(dir, { withFileTypes: true });
        }
        catch (err) {
            const msg = err instanceof Error ? err.message : String(err);
            warnings.push(`Could not read directory ${dir}: ${msg}`);
            return;
        }
        for (const dirent of dirents) {
            if (dirent.isSymbolicLink())
                continue;
            if (!dirent.isDirectory())
                continue;
            if (dirent.name === childName) {
                matches.push(path.join(dir, dirent.name));
            }
            else if (isTraversableFolder(dirent.name)) {
                await searchDir(path.join(dir, dirent.name), depth + 1);
            }
        }
    }
    for (const specsDir of uniqueRoots.values()) {
        await searchDir(specsDir, 0);
    }
    if (warnings.length > 0 && process.env.DEBUG) {
        warnings.forEach((w) => console.warn(`   [subfolder-utils] ${w}`));
    }
    if (matches.length === 1) {
        return matches[0];
    }
    if (matches.length > 1) {
        const uniqueReal = [...new Set(await Promise.all(matches.map(async (m) => {
                try {
                    return await fs.realpath(m);
                }
                catch (_error) {
                    if (_error instanceof Error) {
                        void _error.message;
                    }
                    return m;
                }
            })))];
        if (uniqueReal.length === 1) {
            return matches[0];
        }
        const ambiguityHandler = options?.onAmbiguity ?? ((name, paths) => {
            console.error(`❌ Ambiguous child folder "${name}" found in multiple locations:`);
            paths.forEach((p) => console.error(`   - ${p}`));
        });
        ambiguityHandler(childName, matches);
        return null;
    }
    return null;
}
//# sourceMappingURL=subfolder-utils.js.map