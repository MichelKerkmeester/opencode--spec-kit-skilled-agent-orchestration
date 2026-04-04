type StructuredCollectedData = Record<string, unknown> & {
    _source: 'file';
};
interface ParsedCliArguments {
    dataFile: string | null;
    specFolderArg: string | null;
    collectedData: StructuredCollectedData | null;
    sessionId: string | null;
}
/** Result of validating a requested spec folder reference. */
export interface SpecFolderValidation {
    valid: boolean;
    reason?: string;
    warning?: string;
}
declare function isValidSpecFolder(folderPath: string): SpecFolderValidation;
declare function extractPayloadSpecFolder(data: Record<string, unknown>): string | null;
declare function readAllStdin(stdin?: NodeJS.ReadStream): Promise<string>;
declare function parseArguments(argv?: string[], stdinReader?: (stdin?: NodeJS.ReadStream) => Promise<string>): Promise<ParsedCliArguments>;
declare function validateArguments(): void;
declare function main(argv?: string[], stdinReader?: (stdin?: NodeJS.ReadStream) => Promise<string>): Promise<void>;
export { main, readAllStdin, parseArguments, validateArguments, isValidSpecFolder, extractPayloadSpecFolder, };
//# sourceMappingURL=generate-context.d.ts.map