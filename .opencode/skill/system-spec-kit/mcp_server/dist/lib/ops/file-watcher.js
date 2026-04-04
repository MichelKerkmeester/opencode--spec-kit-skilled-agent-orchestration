// ───────────────────────────────────────────────────────────────
// MODULE: File Watcher
// ───────────────────────────────────────────────────────────────
/* ───────────────────────────────────────────────────────────────
   1. IMPORTS
──────────────────────────────────────────────────────────────── */
import fs from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
/* ───────────────────────────────────────────────────────────────
   3. CONSTANTS
──────────────────────────────────────────────────────────────── */
const DEFAULT_DEBOUNCE_MS = 2000;
const RETRY_DELAYS_MS = [1000, 2000, 4000];
const MAX_BUSY_RETRIES = RETRY_DELAYS_MS.length;
// CHK-087: Watcher metrics counters
let filesReindexed = 0;
let totalReindexTimeMs = 0;
let chokidarModule = null;
let chokidarModulePromise = null;
let chokidarModuleLoadError = null;
/** Return accumulated watcher metrics for diagnostics. */
export function getWatcherMetrics() {
    return {
        filesReindexed,
        avgReindexTimeMs: filesReindexed > 0 ? Math.round(totalReindexTimeMs / filesReindexed) : 0,
    };
}
export function resetWatcherMetrics() {
    filesReindexed = 0;
    totalReindexTimeMs = 0;
}
/* ───────────────────────────────────────────────────────────────
   4. HELPERS
──────────────────────────────────────────────────────────────── */
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function loadChokidarModule() {
    if (chokidarModule !== null) {
        return chokidarModule;
    }
    if (chokidarModulePromise !== null) {
        return chokidarModulePromise;
    }
    const loadPromise = (async () => {
        try {
            chokidarModule = await import('chokidar');
            chokidarModuleLoadError = null;
            return chokidarModule;
        }
        catch (error) {
            chokidarModuleLoadError = error instanceof Error ? error.message : String(error);
            return null;
        }
    })();
    chokidarModulePromise = loadPromise;
    try {
        return await loadPromise;
    }
    finally {
        if (chokidarModulePromise === loadPromise) {
            chokidarModulePromise = null;
        }
    }
}
function getWatchFactory() {
    if (chokidarModule?.default?.watch) {
        return chokidarModule.default.watch;
    }
    if (chokidarModulePromise === null) {
        void loadChokidarModule();
    }
    const loadErrorSuffix = chokidarModuleLoadError
        ? ` Last module resolution error: ${chokidarModuleLoadError}`
        : '';
    throw new Error(`chokidar module is still loading or unavailable; retry startFileWatcher once lazy import completes.${loadErrorSuffix}`);
}
function isDotfilePath(filePath) {
    const parts = filePath
        .split(/[/\\]/)
        .filter((part) => part.length > 0);
    for (const part of parts) {
        if (!part.startsWith('.') || part.length <= 1) {
            continue;
        }
        // .opencode is a first-class workspace root for Spec Kit assets.
        // Treating it as a dotfile path would suppress watcher events for
        // .opencode/specs/** and break auto re-indexing in default layouts.
        if (part === '.opencode') {
            continue;
        }
        return true;
    }
    return false;
}
function isMarkdownPath(filePath) {
    return filePath.toLowerCase().endsWith('.md');
}
function shouldIgnoreWatchTarget(targetPath) {
    if (isDotfilePath(targetPath))
        return true;
    const basename = path.basename(targetPath);
    return basename.startsWith('.');
}
function getWatchScopedPath(targetPath, watchRoots) {
    const resolvedTarget = path.resolve(targetPath);
    for (const watchRoot of watchRoots) {
        const relativeTarget = path.relative(watchRoot, resolvedTarget);
        const isWithinRoot = relativeTarget === '' || (!relativeTarget.startsWith(`..${path.sep}`) &&
            relativeTarget !== '..' &&
            !path.isAbsolute(relativeTarget));
        if (isWithinRoot) {
            return relativeTarget;
        }
    }
    return null;
}
function isSqliteBusyError(error) {
    const message = error instanceof Error ? error.message : String(error);
    const code = error?.code;
    return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}
async function hashFileContent(filePath) {
    const content = await fs.readFile(filePath);
    return createHash('sha256').update(content).digest('hex');
}
async function withBusyRetry(operation) {
    let retryCount = 0;
    while (true) {
        try {
            await operation();
            return;
        }
        catch (error) {
            const shouldRetry = isSqliteBusyError(error) && retryCount < MAX_BUSY_RETRIES;
            if (!shouldRetry) {
                throw error;
            }
            await sleep(RETRY_DELAYS_MS[retryCount]);
            retryCount += 1;
        }
    }
}
/* ───────────────────────────────────────────────────────────────
   5. WATCHER CORE
──────────────────────────────────────────────────────────────── */
/**
 * Provides the startFileWatcher helper.
 */
export function startFileWatcher(config) {
    const watchFactory = config.watchFactory ?? getWatchFactory();
    const debounceMs = config.debounceMs ?? DEFAULT_DEBOUNCE_MS;
    const watchRoots = config.paths.map((watchPath) => path.resolve(watchPath));
    const debounceTimers = new Map();
    const contentHashes = new Map();
    const canonicalPaths = new Map();
    const inFlightReindex = new Set();
    let isClosing = false;
    // C3 fix: Bounded concurrency — prevent unbounded parallel reindex operations
    const MAX_CONCURRENT_REINDEX = 2;
    let activeReindexCount = 0;
    const pendingReindexSlots = [];
    function acquireReindexSlot() {
        if (activeReindexCount < MAX_CONCURRENT_REINDEX) {
            activeReindexCount++;
            return Promise.resolve();
        }
        return new Promise((resolve) => pendingReindexSlots.push(() => { activeReindexCount++; resolve(); }));
    }
    function releaseReindexSlot() {
        activeReindexCount--;
        const next = pendingReindexSlots.shift();
        if (next)
            next();
    }
    // M1 fix: AbortController per file path for cancellation of stale reindex
    const activeAbortControllers = new Map();
    const trackInFlight = (task) => {
        inFlightReindex.add(task);
        void task.finally(() => {
            inFlightReindex.delete(task);
        });
    };
    const watcher = watchFactory(config.paths, {
        ignoreInitial: true,
        awaitWriteFinish: { stabilityThreshold: 1000 },
        ignored: (targetPath) => {
            return shouldIgnoreWatchTarget(getWatchScopedPath(targetPath, watchRoots) ?? targetPath);
        },
        followSymlinks: false,
    });
    const scheduleTask = (targetPath, operation) => {
        if (typeof targetPath !== 'string') {
            return;
        }
        if (isClosing) {
            return;
        }
        const filePath = targetPath;
        const watchScopedPath = getWatchScopedPath(filePath, watchRoots);
        if (!isMarkdownPath(filePath) || shouldIgnoreWatchTarget(watchScopedPath ?? filePath)) {
            return;
        }
        const existing = debounceTimers.get(filePath);
        if (existing) {
            clearTimeout(existing);
        }
        const timeout = setTimeout(() => {
            debounceTimers.delete(filePath);
            if (isClosing) {
                return;
            }
            const task = operation().catch((error) => {
                const message = error instanceof Error ? error.message : String(error);
                console.warn(`[file-watcher] Watch task failed for ${path.basename(filePath)}: ${message}`);
            });
            trackInFlight(task);
        }, debounceMs);
        debounceTimers.set(filePath, timeout);
    };
    const scheduleReindex = (targetPath, options = {}) => {
        const filePath = typeof targetPath === 'string' ? targetPath : null;
        const forceReindex = options.force === true;
        // M1: Abort any in-flight reindex for this same file before scheduling new one
        if (filePath) {
            const prev = activeAbortControllers.get(filePath);
            if (prev)
                prev.abort();
        }
        scheduleTask(targetPath, async () => {
            if (!filePath) {
                return;
            }
            const controller = new AbortController();
            activeAbortControllers.set(filePath, controller);
            try {
                let resolvedPath;
                try {
                    resolvedPath = await fs.realpath(filePath);
                }
                catch (realpathErr) {
                    const code = realpathErr instanceof Error && 'code' in realpathErr && typeof realpathErr.code === 'string'
                        ? realpathErr.code
                        : undefined;
                    if (code === 'ENOENT')
                        return;
                    throw realpathErr;
                }
                if (controller.signal.aborted)
                    return;
                activeAbortControllers.set(resolvedPath, controller);
                canonicalPaths.set(filePath, resolvedPath);
                canonicalPaths.set(resolvedPath, resolvedPath);
                const containmentRoots = await Promise.all(config.paths.map(async (root) => {
                    const normalizedRoot = path.resolve(root);
                    try {
                        return await fs.realpath(normalizedRoot);
                    }
                    catch (rootErr) {
                        const code = rootErr instanceof Error && 'code' in rootErr && typeof rootErr.code === 'string'
                            ? rootErr.code
                            : undefined;
                        if (code === 'ENOENT')
                            return normalizedRoot;
                        throw rootErr;
                    }
                }));
                const isContained = containmentRoots.some((root) => {
                    const rootPrefix = root.endsWith(path.sep) ? root : `${root}${path.sep}`;
                    return resolvedPath === root || resolvedPath.startsWith(rootPrefix);
                });
                if (!isContained) {
                    console.warn(`[file-watcher] Skipping reindex outside watch roots: ${path.basename(filePath)}`);
                    return;
                }
                // Handle ENOENT gracefully when a file is rapidly
                // Created then deleted before the debounce timer fires.
                let nextHash;
                try {
                    nextHash = await hashFileContent(resolvedPath);
                }
                catch (hashErr) {
                    const code = hashErr instanceof Error && 'code' in hashErr && typeof hashErr.code === 'string'
                        ? hashErr.code
                        : undefined;
                    if (code === 'ENOENT')
                        return; // File was deleted — silently ignore
                    throw hashErr;
                }
                if (controller.signal.aborted)
                    return;
                if (!forceReindex) {
                    const previousHash = contentHashes.get(resolvedPath);
                    if (previousHash && previousHash === nextHash) {
                        return;
                    }
                }
                // C3: Acquire concurrency slot before CPU-intensive reindex
                await acquireReindexSlot();
                try {
                    if (controller.signal.aborted)
                        return;
                    const reindexStart = Date.now();
                    await withBusyRetry(async () => {
                        await config.reindexFn(resolvedPath);
                    });
                    const reindexElapsed = Date.now() - reindexStart;
                    filesReindexed++;
                    totalReindexTimeMs += reindexElapsed;
                    console.error(`[file-watcher] Reindexed ${path.basename(resolvedPath)} in ${reindexElapsed}ms (total: ${filesReindexed} files, avg: ${Math.round(totalReindexTimeMs / filesReindexed)}ms)`);
                    contentHashes.set(resolvedPath, nextHash);
                }
                finally {
                    releaseReindexSlot();
                }
            }
            finally {
                if (activeAbortControllers.get(filePath) === controller) {
                    activeAbortControllers.delete(filePath);
                }
                const resolvedPath = canonicalPaths.get(filePath);
                if (resolvedPath && activeAbortControllers.get(resolvedPath) === controller) {
                    activeAbortControllers.delete(resolvedPath);
                }
            }
        });
    };
    const scheduleRemove = (targetPath) => {
        const filePath = typeof targetPath === 'string' ? targetPath : null;
        scheduleTask(targetPath, async () => {
            if (!filePath) {
                return;
            }
            const canonicalPath = canonicalPaths.get(filePath) ?? filePath;
            contentHashes.delete(canonicalPath);
            contentHashes.delete(filePath);
            canonicalPaths.delete(filePath);
            if (canonicalPath !== filePath) {
                canonicalPaths.delete(canonicalPath);
            }
            if (!config.removeFn) {
                return;
            }
            await withBusyRetry(async () => {
                await config.removeFn?.(filePath);
            });
            console.error(`[file-watcher] Removed indexed entries for ${path.basename(filePath)}`);
        });
    };
    watcher.on('add', (targetPath) => {
        scheduleReindex(targetPath, { force: true });
    });
    watcher.on('change', (targetPath) => {
        scheduleReindex(targetPath);
    });
    watcher.on('unlink', (targetPath) => {
        scheduleRemove(targetPath);
    });
    watcher.on('error', (error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[file-watcher] Watcher error: ${message}`);
    });
    const originalClose = watcher.close.bind(watcher);
    watcher.close = async () => {
        isClosing = true;
        for (const timeout of debounceTimers.values()) {
            clearTimeout(timeout);
        }
        debounceTimers.clear();
        while (inFlightReindex.size > 0) {
            await Promise.allSettled(Array.from(inFlightReindex));
        }
        await originalClose();
    };
    return watcher;
}
/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
──────────────────────────────────────────────────────────────── */
/**
 * Defines the __testables constant.
 */
export const __testables = {
    getWatchScopedPath,
    isDotfilePath,
    isMarkdownPath,
    shouldIgnoreWatchTarget,
    isSqliteBusyError,
    resetWatcherMetrics,
};
//# sourceMappingURL=file-watcher.js.map