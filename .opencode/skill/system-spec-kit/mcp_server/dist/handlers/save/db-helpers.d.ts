import type Database from 'better-sqlite3';
export { ALLOWED_POST_INSERT_COLUMNS, applyPostInsertMetadata, } from '../../lib/storage/post-insert-metadata.js';
/**
 * TM-06 safety gate: verify a pre-reconsolidation checkpoint exists.
 * Accepts either exact name `pre-reconsolidation` or prefixed variants.
 */
export declare function hasReconsolidationCheckpoint(database: Database.Database, specFolder: string): boolean;
//# sourceMappingURL=db-helpers.d.ts.map