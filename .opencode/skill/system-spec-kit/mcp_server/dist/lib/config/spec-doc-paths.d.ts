export declare const SPEC_DOCUMENT_FILENAMES: Set<string>;
export declare function normalizeSpecPath(filePath: string | null | undefined): string;
export declare function isSpecsScopedPath(filePath: string | null | undefined): boolean;
export declare function isWorkingArtifactPath(filePath: string | null | undefined): boolean;
export declare function isSpecDocumentExcludedPath(filePath: string | null | undefined): boolean;
export declare function isCanonicalResearchDocumentPath(filePath: string | null | undefined): boolean;
export declare function isLegacyOrCanonicalResearchDocumentPath(filePath: string | null | undefined): boolean;
export declare function canClassifyAsSpecDocument(filePath: string | null | undefined): boolean;
export declare function isSpecLeafSegment(segment: string | null | undefined): boolean;
export declare function matchesSpecDocumentPath(filePath: string | null | undefined, basename: string): boolean;
export declare function extractSpecFolderFromSpecDocumentPath(filePath: string | null | undefined): string | null;
//# sourceMappingURL=spec-doc-paths.d.ts.map