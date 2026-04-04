import type Database from 'better-sqlite3';
import type { ParsedMemory } from '../../lib/parsing/memory-parser.js';
import type { IndexResult } from './types.js';
interface SamePathDedupExclusion {
    canonicalFilePath: string;
    filePath: string;
}
import type { MemoryScopeMatch } from './types.js';
export declare function checkExistingRow(database: Database.Database, parsed: ParsedMemory, canonicalFilePath: string, filePath: string, force: boolean, warnings: string[] | undefined, scope?: MemoryScopeMatch): IndexResult | null;
export declare function checkContentHashDedup(database: Database.Database, parsed: ParsedMemory, force: boolean, warnings: string[] | undefined, samePathExclusion?: SamePathDedupExclusion, scope?: MemoryScopeMatch): IndexResult | null;
export {};
//# sourceMappingURL=dedup.d.ts.map