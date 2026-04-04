/** Pattern for strict spec folder names: 3 digits + kebab-case suffix. */
export declare const SPEC_FOLDER_PATTERN: RegExp;
/** Basic pattern for initial spec folder detection (less strict). */
export declare const SPEC_FOLDER_BASIC_PATTERN: RegExp;
/** Pattern for category/organizational folders: 2 digits + double-hyphen + kebab-case (e.g., "02--system-spec-kit"). */
export declare const CATEGORY_FOLDER_PATTERN: RegExp;
/** Maximum recursive search depth for child folder resolution. */
export declare const SEARCH_MAX_DEPTH = 4;
/** Represents find child options. */
export interface FindChildOptions {
    /** Called when ambiguous matches are found. Defaults to console.error. */
    onAmbiguity?: (childName: string, paths: string[]) => void;
}
/** Find a bare child folder under all spec parents (sync, recursive up to SEARCH_MAX_DEPTH). */
export declare function findChildFolderSync(childName: string, options?: FindChildOptions): string | null;
/** Find a bare child folder under all spec parents (async, recursive up to SEARCH_MAX_DEPTH). */
export declare function findChildFolderAsync(childName: string, options?: FindChildOptions): Promise<string | null>;
//# sourceMappingURL=subfolder-utils.d.ts.map