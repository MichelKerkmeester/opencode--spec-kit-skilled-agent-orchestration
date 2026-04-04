export interface FeedbackArgs {
    query: string;
    resultFile?: string;
    rating: 'helpful' | 'not_helpful' | 'partial';
    comment?: string;
}
/** Handle ccc_feedback tool call */
export declare function handleCccFeedback(args: FeedbackArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=ccc-feedback.d.ts.map