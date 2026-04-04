import type Database from 'better-sqlite3';
type SummarizerId = 'firstLast500' | 'matchCountSummary' | 'stdoutSummary';
interface ExtractionRule {
    readonly id: string;
    readonly toolPattern: RegExp;
    readonly contentPattern: RegExp;
    readonly attention: number;
    readonly summarizer: SummarizerId;
}
interface RuleMatch {
    rule: ExtractionRule;
    sourceText: string;
}
interface ExtractionMetrics {
    matched: number;
    inserted: number;
    skipped: number;
    redacted: number;
}
type RegisterAfterToolCallback = (fn: (tool: string, callId: string, result: unknown) => Promise<void>) => void;
declare const RULES: ExtractionRule[];
/** Applies the configured summarizer to produce a summary from the given text content. */
declare function applySummarizer(summarizer: SummarizerId, content: string): string;
/** Tests input text against extraction rules and returns the first matching rule, or null. */
declare function matchRule(toolName: string, rawText: string): RuleMatch | null;
/** Initializes the extraction adapter with a database connection and optional tool callback. */
declare function initExtractionAdapter(database: Database.Database, registerCallback: RegisterAfterToolCallback): void;
/** Returns current extraction metrics including match counts and processing stats. */
declare function getExtractionMetrics(): ExtractionMetrics;
/** Resets all extraction metrics counters to zero. */
declare function resetExtractionMetrics(): void;
export { RULES, initExtractionAdapter, applySummarizer, matchRule, getExtractionMetrics, resetExtractionMetrics, };
/**
 * Re-exports related public types.
 */
export type { ExtractionRule, ExtractionMetrics, };
//# sourceMappingURL=extraction-adapter.d.ts.map