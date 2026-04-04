"use strict";
// ---------------------------------------------------------------
// MODULE: Rebuild Auto Entities
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = main;
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const paths_1 = require("@spec-kit/shared/paths");
const { rebuildAutoEntities } = require('@spec-kit/mcp-server/api');
const HELP_TEXT = `
rebuild-auto-entities — Rebuild auto-generated entity rows from current memory content

Usage: node rebuild-auto-entities.js [options]

Options:
  --dry-run                 Preview the rebuild without changing the database
  --spec-folder <path>      Limit the rebuild to one spec folder
  --help, -h                Show this help message

Examples:
  node rebuild-auto-entities.js --dry-run
  node rebuild-auto-entities.js --spec-folder specs/123-example
`;
function parseArgs(argv) {
    if (argv.includes('--help') || argv.includes('-h')) {
        console.log(HELP_TEXT);
        process.exit(0);
    }
    const dryRun = argv.includes('--dry-run');
    const specFolderIndex = argv.indexOf('--spec-folder');
    let specFolder = null;
    if (specFolderIndex !== -1) {
        const value = argv[specFolderIndex + 1];
        if (!value || value.startsWith('--')) {
            throw new Error('Expected a spec folder path after --spec-folder');
        }
        specFolder = value.trim();
    }
    return { dryRun, specFolder };
}
async function main() {
    const args = parseArgs(process.argv.slice(2));
    const database = new better_sqlite3_1.default(paths_1.DB_PATH);
    try {
        const result = rebuildAutoEntities(database, args);
        console.log(args.dryRun ? '=== DRY-RUN MODE — no changes were made ===' : '=== AUTO ENTITIES REBUILT ===');
        console.log(`Database: ${paths_1.DB_PATH}`);
        console.log(`Scope: ${result.specFolder ?? 'all spec folders'}`);
        console.log(`Memories scanned: ${result.memoriesScanned}`);
        console.log(`Memories reprocessed: ${result.memoriesReprocessed}`);
        console.log(`Auto rows removed: ${result.autoRowsRemoved}`);
        console.log(`Entities extracted: ${result.extractedEntities}`);
        console.log(`Entities stored: ${result.storedEntities}`);
        if (!args.dryRun) {
            console.log(`Catalog entries rebuilt: ${result.catalogEntriesRebuilt}`);
        }
    }
    finally {
        database.close();
    }
}
if (require.main === module) {
    void main().catch((error) => {
        const message = error instanceof Error ? error.message : String(error);
        console.error('[rebuild-auto-entities] Error:', message);
        process.exit(1);
    });
}
//# sourceMappingURL=rebuild-auto-entities.js.map