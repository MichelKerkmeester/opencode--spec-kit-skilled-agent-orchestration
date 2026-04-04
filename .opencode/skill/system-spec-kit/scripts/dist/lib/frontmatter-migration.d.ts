/** Defines frontmatter value. */
export type FrontmatterValue = string | string[];
/** Represents frontmatter section. */
export interface FrontmatterSection {
    key: string;
    lines: string[];
}
/** Represents frontmatter detection. */
export interface FrontmatterDetection {
    found: boolean;
    malformed: boolean;
    reason?: string;
    start: number;
    end: number;
    sections: FrontmatterSection[];
    rawBlock: string;
}
/** Defines document kind. */
export type DocumentKind = 'template' | 'memory' | 'spec_doc' | 'unknown';
/** Represents classified document. */
export interface ClassifiedDocument {
    kind: DocumentKind;
    documentType: string;
    filePath: string;
    fileName: string;
    fileStem: string;
    specLeaf: string | null;
    specPath: string | null;
    templateRelativePath: string | null;
    suffix: string;
}
/** Represents managed frontmatter. */
export interface ManagedFrontmatter {
    title: string;
    description?: string;
    trigger_phrases?: string[];
    importance_tier: string;
    contextType: string;
}
/** Represents build frontmatter options. */
export interface BuildFrontmatterOptions {
    templatesRoot: string;
    maxTitleLength?: number;
}
/** Represents build frontmatter result. */
export interface BuildFrontmatterResult {
    changed: boolean;
    content: string;
    classification: ClassifiedDocument;
    managed: ManagedFrontmatter;
    hadFrontmatter: boolean;
    malformedFrontmatter: boolean;
    malformedReason: string | null;
}
declare const SPEC_DOC_BASENAMES: Set<string>;
declare const TITLE_MAX_LENGTH = 120;
/** Provides detect frontmatter. */
export declare function detectFrontmatter(content: string): FrontmatterDetection;
/** Parse frontmatter sections. */
export declare function parseFrontmatterSections(rawBlock: string): FrontmatterSection[];
/** Parse section value. */
export declare function parseSectionValue(section: FrontmatterSection): FrontmatterValue | undefined;
/** Classify document. */
export declare function classifyDocument(filePath: string, templatesRoot: string): ClassifiedDocument;
/** Build managed frontmatter. */
export declare function buildManagedFrontmatter(content: string, sections: FrontmatterSection[], classification: ClassifiedDocument, maxTitleLength?: number): ManagedFrontmatter;
/** Build frontmatter content. */
export declare function buildFrontmatterContent(originalContent: string, options: BuildFrontmatterOptions, filePath: string): BuildFrontmatterResult;
export { TITLE_MAX_LENGTH, SPEC_DOC_BASENAMES, };
//# sourceMappingURL=frontmatter-migration.d.ts.map