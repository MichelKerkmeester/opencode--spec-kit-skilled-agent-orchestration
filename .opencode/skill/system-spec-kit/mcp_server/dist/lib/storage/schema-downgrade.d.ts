import type Database from 'better-sqlite3';
interface SchemaDowngradeOptions {
    specFolder?: string;
    checkpointName?: string;
}
interface SchemaDowngradeResult {
    fromVersion: number;
    toVersion: number;
    checkpointName: string;
    preservedRows: number;
    removedColumns: string[];
}
declare function downgradeSchemaV16ToV15(database: Database.Database, options?: SchemaDowngradeOptions): SchemaDowngradeResult;
export { downgradeSchemaV16ToV15, };
/**
 * Re-exports related public types.
 */
export type { SchemaDowngradeOptions, SchemaDowngradeResult, };
//# sourceMappingURL=schema-downgrade.d.ts.map