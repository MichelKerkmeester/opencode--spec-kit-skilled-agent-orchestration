import type { DataSource } from './input-normalizer';
export type SourceInputMode = 'structured' | 'captured';
export type KnownDataSource = DataSource;
export interface SourceCapabilities {
    source: DataSource;
    inputMode: SourceInputMode;
    toolTitleWithPathExpected: boolean;
    prefersStructuredSave: boolean;
}
declare function getSourceCapabilities(source: DataSource | string | null | undefined): SourceCapabilities;
export { getSourceCapabilities, };
//# sourceMappingURL=source-capabilities.d.ts.map