/** Mapping of array field names to their corresponding boolean flag field names */
export interface ArrayFlagMappings {
    readonly [key: string]: string;
}
/** Mapping of presence field names to their corresponding boolean flag field names */
export interface PresenceFlagMappings {
    readonly [key: string]: string;
}
/** Generic constraint for data passed to validateDataStructure.
 * Callers pass their own typed objects (DecisionRecord, DiagramOutput, etc.)
 * without needing [key: string]: unknown index signatures.
 * Kept as a type alias for backward-compatible re-exports. */
export type ValidatedData = Record<string, unknown>;
declare const ARRAY_FLAG_MAPPINGS: ArrayFlagMappings;
declare const PRESENCE_FLAG_MAPPINGS: PresenceFlagMappings;
declare function ensureArrayOfObjects(value: unknown, objectKey: string): Array<Record<string, string>>;
declare function hasArrayContent(value: unknown): boolean;
declare function validateDataStructure<T extends object>(data: T): T;
export { ARRAY_FLAG_MAPPINGS, PRESENCE_FLAG_MAPPINGS, ensureArrayOfObjects, hasArrayContent, validateDataStructure, };
//# sourceMappingURL=data-validator.d.ts.map