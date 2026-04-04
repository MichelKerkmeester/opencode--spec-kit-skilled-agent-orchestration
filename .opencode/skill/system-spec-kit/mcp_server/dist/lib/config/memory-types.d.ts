export { SPEC_DOCUMENT_FILENAMES } from './spec-doc-paths.js';
/**
 * Describes the MemoryTypeConfig shape.
 */
export interface MemoryTypeConfig {
    halfLifeDays: number | null;
    description: string;
    autoExpireDays: number | null;
    decayEnabled: boolean;
}
/**
 * Defines the MemoryTypeName type.
 */
export type MemoryTypeName = 'working' | 'episodic' | 'prospective' | 'implicit' | 'declarative' | 'procedural' | 'semantic' | 'autobiographical' | 'meta-cognitive';
interface PathTypePattern {
    pattern: RegExp;
    type: MemoryTypeName;
}
interface HalfLifeValidationResult {
    valid: boolean;
    errors: string[];
}
/**
 * Defines the MEMORY_TYPES constant.
 */
export declare const MEMORY_TYPES: {
    readonly working: {
        readonly halfLifeDays: 1;
        readonly description: "Active session context and immediate task state";
        readonly autoExpireDays: 7;
        readonly decayEnabled: true;
    };
    readonly episodic: {
        readonly halfLifeDays: 7;
        readonly description: "Event-based memories: sessions, debugging, discoveries";
        readonly autoExpireDays: 30;
        readonly decayEnabled: true;
    };
    readonly prospective: {
        readonly halfLifeDays: 14;
        readonly description: "Future intentions: TODOs, next steps, planned actions";
        readonly autoExpireDays: 60;
        readonly decayEnabled: true;
    };
    readonly implicit: {
        readonly halfLifeDays: 30;
        readonly description: "Learned patterns: code styles, workflows, habits";
        readonly autoExpireDays: 120;
        readonly decayEnabled: true;
    };
    readonly declarative: {
        readonly halfLifeDays: 60;
        readonly description: "Facts and knowledge: implementations, APIs, technical details";
        readonly autoExpireDays: 180;
        readonly decayEnabled: true;
    };
    readonly procedural: {
        readonly halfLifeDays: 90;
        readonly description: "How-to knowledge: processes, procedures, guides";
        readonly autoExpireDays: 365;
        readonly decayEnabled: true;
    };
    readonly semantic: {
        readonly halfLifeDays: 180;
        readonly description: "Core concepts: architecture, design principles, domain knowledge";
        readonly autoExpireDays: null;
        readonly decayEnabled: true;
    };
    readonly autobiographical: {
        readonly halfLifeDays: 365;
        readonly description: "Project history: milestones, major decisions, historical context";
        readonly autoExpireDays: null;
        readonly decayEnabled: true;
    };
    readonly 'meta-cognitive': {
        readonly halfLifeDays: null;
        readonly description: "Rules about rules: constitutional, standards, invariants";
        readonly autoExpireDays: null;
        readonly decayEnabled: false;
    };
};
/**
 * Defines the HALF_LIVES_DAYS constant.
 */
export declare const HALF_LIVES_DAYS: Readonly<Record<string, number | null>>;
/**
 * Defines the PATH_TYPE_PATTERNS constant.
 */
export declare const PATH_TYPE_PATTERNS: readonly PathTypePattern[];
/**
 * Defines the KEYWORD_TYPE_MAP constant.
 */
export declare const KEYWORD_TYPE_MAP: Readonly<Record<string, MemoryTypeName>>;
export declare function getValidTypes(): MemoryTypeName[];
/**
 * Provides the isValidType helper.
 */
export declare function isValidType(type: string | null | undefined): boolean;
/**
 * Returns the half-life in days for a given memory type name.
 * Returns null if the type has no decay or is not recognized.
 */
export declare function getHalfLifeForType(typeName: string): number | null;
/**
 * Resolves a primary spec document path to its configured memory type.
 * Returns null for non-spec paths and nested memory artifacts.
 */
export declare function resolveSpecDocumentType(filePath: string | null | undefined): MemoryTypeName | null;
/**
 * Returns the stored half-life for a memory type, preserving the legacy
 * declarative default for absent or unknown inputs.
 */
export declare function getHalfLife(type: string | null | undefined): number | null;
export declare function isDecayEnabled(type: string | null | undefined): boolean;
/**
 * Provides the getDefaultType helper.
 */
export declare function getDefaultType(): MemoryTypeName;
export declare function getDefaultHalfLives(): Record<MemoryTypeName, number | null>;
/**
 * Defines the DocumentType type.
 */
export type DocumentType = 'spec' | 'plan' | 'tasks' | 'checklist' | 'decision_record' | 'implementation_summary' | 'research' | 'handover' | 'memory' | 'constitutional';
/**
 * Describes the SpecDocumentConfig shape.
 */
export interface SpecDocumentConfig {
    filePattern: RegExp;
    documentType: DocumentType;
    memoryType: MemoryTypeName;
    defaultImportanceTier: string;
    defaultImportanceWeight: number;
}
/** Configuration for each spec folder document type */
export declare const SPEC_DOCUMENT_CONFIGS: readonly SpecDocumentConfig[];
/**
 * Infer document type from a file path.
 * Returns the DocumentType if the file matches a known spec document pattern,
 * or falls back based on path characteristics.
 */
export declare function inferDocumentTypeFromPath(filePath: string): DocumentType;
/**
 * Get the SpecDocumentConfig for a given document type.
 */
export declare function getSpecDocumentConfig(documentType: DocumentType): SpecDocumentConfig | null;
export declare function validateHalfLifeConfig(config: Record<string, unknown> | null | undefined): HalfLifeValidationResult;
//# sourceMappingURL=memory-types.d.ts.map