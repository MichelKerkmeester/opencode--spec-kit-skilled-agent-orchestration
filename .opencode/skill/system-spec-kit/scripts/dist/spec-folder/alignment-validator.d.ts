import type { CollectedDataSubset } from '../types/session-types';
/** Configuration for alignment validation checks. */
export interface AlignmentConfig {
    THRESHOLD: number;
    WARNING_THRESHOLD: number;
    ARCHIVE_PATTERNS: string[];
    STOPWORDS: string[];
    INFRASTRUCTURE_PATTERNS: Record<string, string[]>;
    INFRASTRUCTURE_BONUS: number;
    INFRASTRUCTURE_THRESHOLD: number;
}
/** Result returned from a spec-folder alignment validation run. */
export interface AlignmentResult {
    proceed: boolean;
    useAlternative: boolean;
    selectedFolder?: string;
}
/** Work-domain classification derived during alignment validation. */
export interface WorkDomainResult {
    domain: 'opencode' | 'project';
    subpath: string | null;
    confidence: number;
    patterns: string[];
}
/** Alignment-focused subset of collected session data. */
export type AlignmentCollectedData = CollectedDataSubset<'recentContext' | 'observations' | 'SPEC_FOLDER'>;
/** Describes a field-level diff between telemetry schema sources. */
export interface TelemetrySchemaFieldDiff {
    interfaceName: string;
    schemaOnlyFields: string[];
    docsOnlyFields: string[];
}
/** Options controlling telemetry schema documentation validation. */
export interface TelemetrySchemaDocsValidationOptions {
    schemaPath?: string;
    docsPath?: string;
    useCache?: boolean;
}
declare const ALIGNMENT_CONFIG: AlignmentConfig;
/** Check whether a folder name matches any archive pattern from config. */
declare function isArchiveFolder(name: string): boolean;
declare function computeTelemetrySchemaDocsFieldDiffs(schemaSource: string, docsSource: string): TelemetrySchemaFieldDiff[];
declare function formatTelemetrySchemaDocsDriftDiffs(diffs: TelemetrySchemaFieldDiff[]): string;
declare function validateTelemetrySchemaDocsDrift(options?: TelemetrySchemaDocsValidationOptions): Promise<void>;
declare function extractConversationTopics(collectedData: AlignmentCollectedData | null): string[];
declare function extractObservationKeywords(collectedData: AlignmentCollectedData | null): string[];
declare function parseSpecFolderTopic(folderName: string): string[];
declare function calculateAlignmentScore(conversationTopics: string[], specFolderName: string): number;
declare function validateContentAlignment(collectedData: AlignmentCollectedData, specFolderName: string, specsDir: string): Promise<AlignmentResult>;
declare function validateFolderAlignment(collectedData: AlignmentCollectedData, specFolderName: string, specsDir: string): Promise<AlignmentResult>;
export { ALIGNMENT_CONFIG, isArchiveFolder, extractConversationTopics, extractObservationKeywords, parseSpecFolderTopic, calculateAlignmentScore, computeTelemetrySchemaDocsFieldDiffs, formatTelemetrySchemaDocsDriftDiffs, validateTelemetrySchemaDocsDrift, validateContentAlignment, validateFolderAlignment, };
//# sourceMappingURL=alignment-validator.d.ts.map