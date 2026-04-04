// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Indexer Types
// ───────────────────────────────────────────────────────────────
import { createHash } from 'node:crypto';
/** Generate a deterministic symbol ID from file path, qualified name, and kind */
export function generateSymbolId(filePath, fqName, kind) {
    return createHash('sha256')
        .update(filePath + '::' + fqName + '::' + kind)
        .digest('hex')
        .slice(0, 16);
}
/** Generate a content hash for change detection */
export function generateContentHash(content) {
    return createHash('sha256').update(content).digest('hex').slice(0, 12);
}
/** Detect language from file extension */
export function detectLanguage(filePath) {
    const ext = filePath.split('.').pop()?.toLowerCase();
    switch (ext) {
        case 'js':
        case 'mjs':
        case 'cjs':
        case 'jsx':
            return 'javascript';
        case 'ts':
        case 'mts':
        case 'cts':
        case 'tsx':
            return 'typescript';
        case 'py':
            return 'python';
        case 'sh':
        case 'bash':
        case 'zsh':
            return 'bash';
        default:
            return null;
    }
}
/** Get default indexer configuration */
export function getDefaultConfig(rootDir) {
    return {
        rootDir,
        includeGlobs: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts', '**/*.js', '**/*.jsx', '**/*.mjs', '**/*.cjs', '**/*.py', '**/*.sh', '**/*.bash', '**/*.zsh'],
        excludeGlobs: ['**/node_modules/**', '**/dist/**', '**/.git/**', '**/vendor/**'],
        maxFileSizeBytes: 102_400,
        languages: ['javascript', 'typescript', 'python', 'bash'],
    };
}
//# sourceMappingURL=indexer-types.js.map