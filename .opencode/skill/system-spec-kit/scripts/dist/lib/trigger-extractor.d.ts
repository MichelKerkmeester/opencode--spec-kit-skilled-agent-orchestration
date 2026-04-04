import type { ExtractionResult } from '@spec-kit/shared/types';
import { STOP_WORDS_ENGLISH } from '@spec-kit/shared/trigger-extractor';
export declare function extractTriggerPhrases(text: string | null | undefined): string[];
export declare function extractTriggerPhrasesWithStats(text: string | null | undefined): ExtractionResult;
export declare const extract_trigger_phrases: typeof extractTriggerPhrases;
export declare const extract_trigger_phrases_with_stats: typeof extractTriggerPhrasesWithStats;
export declare const CONFIG: import("@spec-kit/shared/types").TriggerConfig;
export { STOP_WORDS_ENGLISH };
//# sourceMappingURL=trigger-extractor.d.ts.map