/** Represents decision for topics. */
export interface DecisionForTopics {
    TITLE?: string;
    RATIONALE?: string;
}
/** Extract key topics. */
export declare function extractKeyTopics(summary: string, decisions?: DecisionForTopics[], _specFolderName?: string): string[];
//# sourceMappingURL=topic-extractor.d.ts.map