import type { Observation, ImplementationStep, KeyFileWithRole, ExtensionGuide, CodePattern } from '../types/session-types';
export type { ImplementationStep, KeyFileWithRole, ExtensionGuide, CodePattern };
/** Output payload for the implementation guide extractor. */
export interface ImplementationGuideData {
    HAS_IMPLEMENTATION_GUIDE: boolean;
    TOPIC: string;
    IMPLEMENTATIONS: ImplementationStep[];
    IMPL_KEY_FILES: KeyFileWithRole[];
    EXTENSION_GUIDES: ExtensionGuide[];
    PATTERNS: CodePattern[];
}
type ObservationInput = Observation;
/** File input used by the implementation guide extractor. */
export interface FileInput {
    FILE_PATH?: string;
    path?: string;
    DESCRIPTION?: string;
    description?: string;
}
declare function hasImplementationWork(observations: ObservationInput[], files: FileInput[]): boolean;
declare function extractMainTopic(observations: ObservationInput[], specFolder: string | undefined): string;
declare function extractWhatBuilt(observations: ObservationInput[]): ImplementationStep[];
declare function extractKeyFilesWithRoles(files: FileInput[], observations: ObservationInput[]): KeyFileWithRole[];
declare function generateExtensionGuide(observations: ObservationInput[], files: FileInput[]): ExtensionGuide[];
declare function extractCodePatterns(observations: ObservationInput[], files: FileInput[]): CodePattern[];
declare function buildImplementationGuideData(observations: ObservationInput[], files: FileInput[], spec_folder?: string): ImplementationGuideData;
export { hasImplementationWork, extractMainTopic, extractWhatBuilt, extractKeyFilesWithRoles, generateExtensionGuide, extractCodePatterns, buildImplementationGuideData, };
//# sourceMappingURL=implementation-guide-extractor.d.ts.map