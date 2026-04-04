/** Expected types for typed JSON parsing */
export type ExpectedJsonType = 'array' | 'object' | 'string' | 'number';
/** Parses JSON and returns a fallback value on failure. */
export declare function safeJsonParse<T = unknown>(str: string | null | undefined, fallback: T): T;
/** Stringifies JSON and returns a fallback value on failure. */
export declare function safeJsonStringify(value: unknown, fallback?: string, space?: number): string;
/** Parses JSON and validates the expected top-level value type. */
export declare function safeJsonParseTyped<T = unknown>(str: string | null | undefined, expectedType: ExpectedJsonType, fallback: T): T;
//# sourceMappingURL=json-helpers.d.ts.map