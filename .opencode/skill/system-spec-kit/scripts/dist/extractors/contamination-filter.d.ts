import type { DataSource } from '../utils/input-normalizer';
import { type SourceCapabilities } from '../utils/source-capabilities';
type ContaminationSeverity = 'low' | 'medium' | 'high';
interface DenylistEntry {
    label: string;
    pattern: RegExp;
    severity: ContaminationSeverity;
}
type DenylistPattern = DenylistEntry | RegExp;
declare const DEFAULT_DENYLIST: readonly DenylistEntry[];
interface FilterResult {
    cleanedText: string;
    removedPhrases: string[];
    hadContamination: boolean;
    matchedPatterns: string[];
    maxSeverity: ContaminationSeverity | null;
}
interface FilterOptions {
    captureSource?: DataSource;
    sourceCapabilities?: SourceCapabilities;
}
declare const SEVERITY_RANK: Record<ContaminationSeverity, number>;
declare function getContaminationPatternLabels(denylist?: readonly DenylistPattern[]): string[];
declare function filterContamination(input: string, denylist?: readonly DenylistPattern[], options?: FilterOptions): FilterResult;
export { DEFAULT_DENYLIST, SEVERITY_RANK, filterContamination, getContaminationPatternLabels, };
export type { ContaminationSeverity, DenylistEntry, DenylistPattern, FilterOptions, FilterResult, };
//# sourceMappingURL=contamination-filter.d.ts.map