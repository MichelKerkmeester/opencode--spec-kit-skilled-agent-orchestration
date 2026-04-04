interface RedactionMatch {
    value: string;
    category: string;
}
interface RedactionResult {
    redactedText: string;
    redactionApplied: boolean;
    matches: RedactionMatch[];
}
declare const GENERIC_HIGH_ENTROPY_MIN_LENGTH = 40;
declare function applyRedactionGate(inputText: string): RedactionResult;
export { applyRedactionGate, GENERIC_HIGH_ENTROPY_MIN_LENGTH, };
/**
 * Re-exports related public types.
 */
export type { RedactionResult, RedactionMatch, };
//# sourceMappingURL=redaction-gate.d.ts.map