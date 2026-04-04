import Database from 'better-sqlite3';
interface SchemaCompatibilityReport {
    compatible: boolean;
    schemaVersion: number | null;
    missingTables: string[];
    missingColumns: Record<string, string[]>;
    missingIndexes: string[];
    constraintMismatches: string[];
    warnings: string[];
}
interface LineageSchemaReport {
    compatible: boolean;
    schemaVersion: number | null;
    missingTables: string[];
    missingColumns: Record<string, string[]>;
    warnings: string[];
}
/** Current schema version for vector-index migrations. */
export declare const SCHEMA_VERSION = 25;
/**
 * Runs schema migrations between two schema versions.
 * @param database - The database connection to migrate.
 * @param from_version - The current schema version.
 * @param to_version - The target schema version.
 * @returns Nothing.
 */
export declare function run_migrations(database: Database.Database, from_version: number, to_version: number): void;
/**
 * Ensures the schema version table is current.
 * @param database - The database connection to check.
 * @returns The previous schema version.
 */
export declare function ensure_schema_version(database: Database.Database): number;
export declare function ensureLineageTables(database: Database.Database): void;
export declare function ensureGovernanceTables(database: Database.Database): void;
export declare function ensureSharedSpaceTables(database: Database.Database): void;
/**
 * Validates backward compatibility expectations for the current schema.
 * Never throws; returns compatibility details for logging and rollout gates.
 */
export declare function validate_backward_compatibility(database: Database.Database): SchemaCompatibilityReport;
export declare function validateLineageSchemaSupport(database: Database.Database): LineageSchemaReport;
/**
 * Adds legacy confidence-related columns when needed.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export declare function migrate_confidence_columns(database: Database.Database): void;
/**
 * Ensures canonical file path columns and indexes exist.
 * @param database - The database connection to migrate.
 * @returns Nothing.
 */
export declare function ensure_canonical_file_path_support(database: Database.Database): void;
/**
 * Checks legacy databases for constitutional tier support.
 * @param database - The database connection to inspect.
 * @returns Nothing.
 */
export declare function migrate_constitutional_tier(database: Database.Database): void;
/**
 * Creates common indexes used by vector-index queries.
 * @param database - The database connection to update.
 * @returns Nothing.
 */
export declare function create_common_indexes(database: Database.Database): void;
/**
 * Ensure companion tables exist alongside memory_index.
 */
export declare function ensureCompanionTables(database: Database.Database): void;
/**
 * Creates or upgrades the vector-index schema.
 * @param database - The database connection to initialize.
 * @param options - Schema creation options.
 * @returns Nothing.
 */
export declare function create_schema(database: Database.Database, options: {
    sqlite_vec_available: boolean;
    get_embedding_dim: () => number;
}): void;
export { ensure_schema_version as ensureSchemaVersion };
export { run_migrations as runMigrations };
export { create_schema as createSchema };
export { create_common_indexes as createCommonIndexes };
export { migrate_confidence_columns as migrateConfidenceColumns };
export { ensure_canonical_file_path_support as ensureCanonicalFilePathSupport };
export { migrate_constitutional_tier as migrateConstitutionalTier };
export { validate_backward_compatibility as validateBackwardCompatibility };
//# sourceMappingURL=vector-index-schema.d.ts.map