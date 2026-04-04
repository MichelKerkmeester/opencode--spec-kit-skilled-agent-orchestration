#!/usr/bin/env node
import { classifyDocument } from '../lib/frontmatter-migration';
interface CliOptions {
    dryRun: boolean;
    apply: boolean;
    includeArchive: boolean;
    skipTemplates: boolean;
    allowMalformed: boolean;
    roots: string[];
    reportPath: string | null;
}
interface SkippedDirEntry {
    dirPath: string;
    error: string;
}
declare function parseArgs(argv: string[]): CliOptions;
declare function discoverSpecsRoots(baseDir: string, skippedDirs?: SkippedDirEntry[]): string[];
declare function collectTemplateFiles(rootPath: string, skippedDirs?: SkippedDirEntry[]): string[];
declare function collectSpecFiles(rootPath: string, includeArchive: boolean, skippedDirs?: SkippedDirEntry[]): string[];
declare function run(): void;
export { run, parseArgs, discoverSpecsRoots, collectSpecFiles, collectTemplateFiles, classifyDocument };
//# sourceMappingURL=backfill-frontmatter.d.ts.map