export interface ContextHandlerArgs {
    input?: string;
    queryMode?: string;
    subject?: string;
    seeds?: Array<{
        filePath?: string;
        startLine?: number;
        endLine?: number;
        query?: string;
        provider?: string;
        source?: string;
        file?: string;
        range?: {
            start: number;
            end: number;
        };
        score?: number;
        snippet?: string;
        symbolName?: string;
        kind?: string;
        nodeId?: string;
        symbolId?: string;
    }>;
    budgetTokens?: number;
    profile?: string;
    includeTrace?: boolean;
}
/** Handle code_graph_context tool call */
export declare function handleCodeGraphContext(args: ContextHandlerArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=context.d.ts.map