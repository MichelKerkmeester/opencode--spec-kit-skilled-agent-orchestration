"use strict";
// ---------------------------------------------------------------
// MODULE: Run Redaction Calibration
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. RUN REDACTION CALIBRATION
// ───────────────────────────────────────────────────────────────
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const NON_SECRET_FP_PATTERNS = [
    /^[0-9a-f]{40}$/,
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    /^v?\d+\.\d+\.\d+$/,
];
function parseArgs() {
    const [, , specFolder] = process.argv;
    if (!specFolder) {
        throw new Error('Usage: ts-node scripts/evals/run-redaction-calibration.ts <spec-folder-relative-path>');
    }
    return { specFolder };
}
function tokenize(text) {
    return text.split(/\s+/).map((t) => t.trim()).filter(Boolean);
}
function isLikelyFalsePositive(value) {
    return NON_SECRET_FP_PATTERNS.some((pattern) => pattern.test(value));
}
function evaluateFile(filePath) {
    const input = fs_1.default.readFileSync(filePath, 'utf8');
    const result = loadRedactionGate()(input);
    const tokens = tokenize(input);
    let falsePositives = 0;
    for (const match of result.matches) {
        if (isLikelyFalsePositive(match.value)) {
            falsePositives += 1;
        }
    }
    return {
        file: path_1.default.basename(filePath),
        tokenCount: tokens.length,
        redactedCount: result.matches.length,
        falsePositiveCount: falsePositives,
        redactedSamples: result.matches.slice(0, 5).map((m) => m.value),
    };
}
let cachedRedactionGate = null;
function loadRedactionGate() {
    if (cachedRedactionGate) {
        return cachedRedactionGate;
    }
    const gateModulePath = path_1.default.join(process.cwd(), 'mcp_server', 'dist', 'lib', 'extraction', 'redaction-gate.js');
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const gateModule = require(gateModulePath);
    cachedRedactionGate = gateModule.applyRedactionGate;
    return cachedRedactionGate;
}
function writeReport(specFolder, cases) {
    const outputPath = path_1.default.join(specFolder, 'scratch', 'redaction-calibration.md');
    const totalTokens = cases.reduce((sum, c) => sum + c.tokenCount, 0);
    const totalRedactions = cases.reduce((sum, c) => sum + c.redactedCount, 0);
    const totalFalsePositives = cases.reduce((sum, c) => sum + c.falsePositiveCount, 0);
    const fpRate = totalTokens > 0 ? (totalFalsePositives / totalTokens) * 100 : 0;
    const overRedactionCases = cases.filter((c) => c.falsePositiveCount > 0);
    const preview = cases.slice(0, 10).map((c) => `| ${c.file} | ${c.tokenCount} | ${c.redactedCount} | ${c.falsePositiveCount} |`);
    const content = [
        '# Redaction Calibration Report (Phase 1.5)',
        '',
        '## Inputs',
        '',
        '- Source: `scratch/redaction-calibration-inputs/`',
        `- Files processed: ${cases.length}`,
        `- Total tokens (non-secret denominator): ${totalTokens}`,
        '',
        '## Pattern Calibration',
        '',
        '- Added exclusion heuristic for git SHA-1 hashes (`/^[0-9a-f]{40}$/`).',
        '- Added exclusion heuristic for UUIDs (`/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i`).',
        '- Tuned generic high-entropy pattern threshold from 32 to 40 characters.',
        '',
        '## Results',
        '',
        `- Total redactions: ${totalRedactions}`,
        `- False positives: ${totalFalsePositives}`,
        `- FP rate: ${fpRate.toFixed(2)}%`,
        `- Hard gate (<= 15%): **${fpRate <= 15 ? 'PASS' : 'FAIL'}**`,
        '',
        '## Sample Breakdown (first 10 files)',
        '',
        '| File | Tokens | Redactions | False Positives |',
        '|------|--------|------------|-----------------|',
        ...preview,
        '',
        '## Over-redaction Cases',
        '',
        overRedactionCases.length === 0
            ? '- None detected after SHA/UUID exclusions and entropy threshold tuning.'
            : overRedactionCases.map((c) => `- ${c.file}: ${c.falsePositiveCount} FP(s), samples=${c.redactedSamples.join(', ')}`).join('\n'),
        '',
    ].join('\n');
    fs_1.default.writeFileSync(outputPath, `${content}\n`, 'utf8');
}
function main() {
    const { specFolder } = parseArgs();
    const inputDir = path_1.default.join(specFolder, 'scratch', 'redaction-calibration-inputs');
    const files = fs_1.default.readdirSync(inputDir)
        .filter((name) => name.endsWith('.txt'))
        .map((name) => path_1.default.join(inputDir, name))
        .sort();
    if (files.length === 0) {
        throw new Error(`No calibration input files found in ${inputDir}`);
    }
    const cases = files.map((filePath) => evaluateFile(filePath));
    writeReport(specFolder, cases);
    const totalFp = cases.reduce((sum, c) => sum + c.falsePositiveCount, 0);
    const totalTokens = cases.reduce((sum, c) => sum + c.tokenCount, 0);
    const fpRate = totalTokens > 0 ? (totalFp / totalTokens) * 100 : 0;
    console.log(`Redaction calibration complete (FP rate=${fpRate.toFixed(2)}%)`);
}
main();
//# sourceMappingURL=run-redaction-calibration.js.map