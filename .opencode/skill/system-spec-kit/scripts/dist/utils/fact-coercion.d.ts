export type FactDropReason = 'nullish' | 'unserializable-object';
export interface CoercedFact {
    text: string;
    dropReason?: FactDropReason;
    sourceType: 'string' | 'text-object' | 'object' | 'primitive' | 'nullish';
}
export interface FactDropLogContext {
    component: string;
    fieldPath: string;
    specFolder?: string;
    sessionId?: string;
}
declare function coerceFactToText(value: unknown): CoercedFact;
declare function coerceFactsToText(facts: unknown[] | null | undefined, logContext?: FactDropLogContext): string[];
export { coerceFactToText, coerceFactsToText, };
//# sourceMappingURL=fact-coercion.d.ts.map