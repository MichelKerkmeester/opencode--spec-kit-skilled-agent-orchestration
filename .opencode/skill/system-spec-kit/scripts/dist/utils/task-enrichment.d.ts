/** Normalizes a spec title for reuse in memory task enrichment. */
export declare function normalizeSpecTitleForMemory(title: string): string;
/** Returns whether the spec title should enrich the stored memory task. */
export declare function shouldEnrichTaskFromSpecTitle(task: string, source: unknown, dataFilePath: string | null | undefined): boolean;
/** Picks the preferred task label for memory storage. */
export declare function pickPreferredMemoryTask(task: string, specTitle: string, folderBase: string, sessionCandidates?: readonly string[], allowSpecTitleFallback?: boolean): string;
//# sourceMappingURL=task-enrichment.d.ts.map