/** Accepts both Record<string, unknown> (readNamedObject results) and typed interfaces
 * (CollectedDataFull) without requiring an index signature on the typed interface.
 * Each helper casts to Record internally -- safe because all values are runtime-checked. */
export declare function readNamedObject(source: object | null | undefined, ...keys: string[]): Record<string, unknown> | null;
export declare function readStringArray(source: object | null | undefined, ...keys: string[]): string[];
export declare function readNumber(source: object | null | undefined, fallback: number, ...keys: string[]): number;
export declare function readString(source: object | null | undefined, fallback: string, ...keys: string[]): string;
export declare function capText(value: string, maxLength: number): string;
export declare function summarizeAuditCounts(counts: Map<string, number>): string[];
//# sourceMappingURL=workflow-accessors.d.ts.map