"use strict";
// ---------------------------------------------------------------
// MODULE: Data Loader
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCollectedData = loadCollectedData;
// ───────────────────────────────────────────────────────────────
// 1. DATA LOADER
// ───────────────────────────────────────────────────────────────
// Loads session data from JSON file (via file path, --stdin, or --json)
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const node_os_1 = __importDefault(require("node:os"));
const core_1 = require("../core");
const utils_1 = require("../utils");
const input_normalizer_1 = require("../utils/input-normalizer");
async function loadCollectedData(options) {
    const dataFile = options?.dataFile !== undefined ? options.dataFile : core_1.CONFIG.DATA_FILE;
    const specFolderArg = options?.specFolderArg !== undefined ? options.specFolderArg : core_1.CONFIG.SPEC_FOLDER_ARG;
    if (!dataFile) {
        throw new Error('NO_DATA_FILE: Structured JSON input is required via --stdin, --json, or a JSON file path. ' +
            'External CLI agents must provide data via JSON mode: ' +
            'write session data to /tmp/save-context-data.json, then run: node generate-context.js /tmp/save-context-data.json [spec-folder]');
    }
    try {
        // SEC-001: Path traversal mitigation (CWE-22)
        // Use os.tmpdir() for cross-platform temp directory support
        // Also include /tmp for macOS where /tmp symlinks to /private/tmp
        const tmpDir = node_os_1.default.tmpdir();
        const dataFileAllowedBases = [
            tmpDir,
            '/tmp', // macOS: symlink to /private/tmp
            '/private/tmp', // macOS: actual tmp location
            process.cwd(),
            node_path_1.default.join(process.cwd(), 'specs'),
            node_path_1.default.join(process.cwd(), '.opencode')
        ];
        let validatedDataFilePath;
        try {
            validatedDataFilePath = (0, utils_1.sanitizePath)(dataFile, dataFileAllowedBases);
        }
        catch (pathError) {
            const pathErrMsg = pathError instanceof Error ? pathError.message : String(pathError);
            (0, utils_1.structuredLog)('error', 'Invalid data file path - security validation failed', {
                filePath: dataFile,
                error: pathErrMsg
            });
            throw new Error(`Security: Invalid data file path: ${pathErrMsg}`);
        }
        const dataContent = await promises_1.default.readFile(validatedDataFilePath, 'utf-8');
        const rawData = JSON.parse(dataContent);
        (0, input_normalizer_1.validateInputData)(rawData, specFolderArg);
        console.log('   \u2713 Loaded and validated conversation data from file');
        const data = (0, input_normalizer_1.normalizeInputData)(rawData);
        console.log(`   \u2713 Loaded data from data file`);
        return { ...data, _source: 'file' };
    }
    catch (error) {
        if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
            (0, utils_1.structuredLog)('error', 'Data file not found', {
                filePath: dataFile,
                error: error.message
            });
            throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Data file not found: ${dataFile}`);
        }
        else if (error instanceof Error && 'code' in error && error.code === 'EACCES') {
            (0, utils_1.structuredLog)('error', 'Permission denied reading data file', {
                filePath: dataFile,
                error: error.message
            });
            throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Permission denied: ${dataFile}`);
        }
        else if (error instanceof SyntaxError) {
            (0, utils_1.structuredLog)('error', 'Invalid JSON in data file', {
                filePath: dataFile,
                error: error.message,
                position: error.message.match(/position (\d+)/)?.[1] || 'unknown'
            });
            throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Invalid JSON in data file ${dataFile}: ${error.message}`);
        }
        else {
            const errMsg = error instanceof Error ? error.message : String(error);
            (0, utils_1.structuredLog)('error', 'Failed to load data file', {
                filePath: dataFile,
                error: errMsg
            });
            throw new Error(`EXPLICIT_DATA_FILE_LOAD_FAILED: Failed to load data file ${dataFile}: ${errMsg}`);
        }
    }
}
//# sourceMappingURL=data-loader.js.map