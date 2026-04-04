import type { SpecDocHealthResult } from '@spec-kit/shared/parsing/spec-doc-health';
import type { FileChange } from '../types/session-types';
export declare function injectQualityMetadata(content: string, qualityScore: number, qualityFlags: string[]): string;
export declare function injectSpecDocHealthMetadata(content: string, health: SpecDocHealthResult): string;
export declare function renderTriggerPhrasesYaml(triggerPhrases: string[]): string;
export declare function ensureMinTriggerPhrases(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[];
export declare function ensureMinSemanticTopics(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[];
//# sourceMappingURL=frontmatter-editor.d.ts.map