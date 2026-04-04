export interface QueryArgs {
    operation: 'outline' | 'calls_from' | 'calls_to' | 'imports_from' | 'imports_to';
    subject: string;
    edgeType?: string;
    limit?: number;
    includeTransitive?: boolean;
    maxDepth?: number;
}
/** Handle code_graph_query tool call */
export declare function handleCodeGraphQuery(args: QueryArgs): Promise<{
    content: Array<{
        type: string;
        text: string;
    }>;
}>;
//# sourceMappingURL=query.d.ts.map