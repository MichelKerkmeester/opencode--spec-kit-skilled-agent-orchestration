/** Maximum allowed lengths for string inputs (SEC-003: CWE-400 mitigation) */
export interface InputLimits {
    query: number;
    title: number;
    specFolder: number;
    contextType: number;
    name: number;
    prompt: number;
    filePath: number;
}
/** Arguments object that can be validated for input lengths */
export interface ValidatableArgs {
    query?: string;
    title?: string;
    specFolder?: string;
    contextType?: string;
    name?: string;
    prompt?: string;
    filePath?: string;
    [key: string]: unknown;
}
/** Shared file path validation function signature */
export type SharedValidateFilePath = (filePath: string, allowedBasePaths: string[]) => string | null;
export declare const INPUT_LIMITS: Readonly<InputLimits>;
/** Maximum query length for search operations (BUG-007) */
export declare const MAX_QUERY_LENGTH: number;
/**
 * Validate and normalize a search query
 * BUG-007: Properly rejects empty, null, and invalid queries.
 */
export declare function validateQuery(query: unknown): string;
/**
 * Validate input string lengths
 * SEC-003: Input length enforcement for CWE-400 mitigation
 */
export declare function validateInputLengths(args: ValidatableArgs | null | undefined): void;
/**
 * Create a file path validator with specified allowed base paths
 */
export declare function createFilePathValidator(allowedBasePaths: string[], sharedValidateFilePath: SharedValidateFilePath): (filePath: string) => string;
/**
 * Get default allowed base paths for file operations
 */
export declare function getDefaultAllowedPaths(defaultBasePath?: string): string[];
//# sourceMappingURL=validators.d.ts.map