export interface NodeVersionMarker {
    nodeVersion: string;
    moduleVersion: string;
    platform: string;
    arch: string;
    createdAt: string;
}
export interface RuntimeSnapshot {
    nodeVersion: string;
    moduleVersion: string;
    platform: string;
    arch: string;
}
export interface RuntimeMismatchResult {
    detected: boolean;
    reasons: string[];
}
export declare function detectRuntimeMismatch(marker: NodeVersionMarker, runtime?: RuntimeSnapshot): RuntimeMismatchResult;
/** Logs a warning when the active Node.js version differs from the project marker. */
export declare function detectNodeVersionMismatch(): void;
/**
 * Check that SQLite version meets minimum requirement (3.35.0+)
 * Required for: RETURNING clause, CTEs, window functions used in scoring pipeline
 */
export declare function checkSqliteVersion(db: {
    prepare: (sql: string) => {
        get: () => unknown;
    };
}): void;
//# sourceMappingURL=startup-checks.d.ts.map