export interface ReindexArgs {
    full?: boolean;
}
/** Handle ccc_reindex tool call */
export declare function handleCccReindex(args: ReindexArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=ccc-reindex.d.ts.map