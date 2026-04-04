type NestedChangelogMode = 'root' | 'phase';
interface CliOptions {
    help: boolean;
    json: boolean;
    write: boolean;
    mode: 'auto' | NestedChangelogMode;
    outputPath: string | null;
    specFolderArg: string | null;
}
interface FileChangeRow {
    path: string;
    action: string;
    description: string;
}
interface PhaseRollupEntry {
    folder: string;
    status: string;
    summary: string;
}
interface NestedChangelogData {
    mode: NestedChangelogMode;
    specFolder: string;
    rootSpecFolder: string;
    outputPath: string;
    date: string;
    level: string;
    title: string;
    description: string;
    summary: string;
    includedPhases: PhaseRollupEntry[];
    added: string[];
    changed: string[];
    fixed: string[];
    verification: string[];
    filesChanged: FileChangeRow[];
    followUps: string[];
}
/** Build a packet-local changelog payload for a spec root or child phase folder. */
declare function buildNestedChangelogData(specFolderPath: string, options: Pick<CliOptions, 'mode' | 'outputPath'>): NestedChangelogData;
/** Render packet-local changelog markdown from a derived changelog payload. */
declare function generateNestedChangelogMarkdown(data: NestedChangelogData): string;
/** Write a rendered packet-local changelog to its resolved output path. */
declare function writeNestedChangelog(data: NestedChangelogData): string;
export { buildNestedChangelogData, generateNestedChangelogMarkdown, writeNestedChangelog, };
//# sourceMappingURL=nested-changelog.d.ts.map