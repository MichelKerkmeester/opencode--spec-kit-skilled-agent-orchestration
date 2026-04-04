"use strict";
// ---------------------------------------------------------------
// MODULE: Collect Redaction Calibration Inputs
// ---------------------------------------------------------------
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ───────────────────────────────────────────────────────────────
// 1. COLLECT REDACTION CALIBRATION INPUTS
// ───────────────────────────────────────────────────────────────
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const child_process_1 = require("child_process");
function parseArgs() {
    const [, , specFolder] = process.argv;
    if (!specFolder) {
        throw new Error('Usage: ts-node scripts/evals/collect-redaction-calibration-inputs.ts <spec-folder-relative-path>');
    }
    return { specFolder };
}
function runCommand(spec) {
    const result = (0, child_process_1.spawnSync)(spec.command, spec.args, {
        cwd: spec.cwd,
        encoding: 'utf8',
        shell: false,
    });
    const stdout = result.stdout || '';
    const stderr = result.stderr || '';
    const code = typeof result.status === 'number' ? result.status : -1;
    return [
        `$ ${spec.command} ${spec.args.join(' ')}`,
        `exit_code: ${code}`,
        stdout.trim() ? `stdout:\n${stdout.trimEnd()}` : 'stdout: <empty>',
        stderr.trim() ? `stderr:\n${stderr.trimEnd()}` : 'stderr: <empty>',
    ].join('\n');
}
function buildCommandMatrix(workspaceRoot, specFolder) {
    const specs = [
        { command: 'git', args: ['status', '--short'], cwd: workspaceRoot },
        { command: 'git', args: ['branch', '--show-current'], cwd: workspaceRoot },
        { command: 'git', args: ['log', '--oneline', '-5'], cwd: workspaceRoot },
        { command: 'node', args: ['--version'], cwd: workspaceRoot },
        { command: 'npm', args: ['--version'], cwd: workspaceRoot },
        { command: 'python3', args: ['--version'], cwd: workspaceRoot },
        { command: 'ls', args: ['-la'], cwd: workspaceRoot },
        { command: 'ls', args: ['-la', '.opencode/skill/system-spec-kit'], cwd: workspaceRoot },
        { command: 'ls', args: ['-la', '.opencode/skill/system-spec-kit/mcp_server'], cwd: workspaceRoot },
        { command: 'ls', args: ['-la', specFolder], cwd: workspaceRoot },
    ];
    const outputs = [];
    for (let i = 0; i < 5; i += 1) {
        outputs.push(...specs);
    }
    return outputs.slice(0, 50);
}
function main() {
    const { specFolder } = parseArgs();
    const workspaceRoot = process.cwd();
    const outputDir = path_1.default.join(specFolder, 'scratch', 'redaction-calibration-inputs');
    fs_1.default.mkdirSync(outputDir, { recursive: true });
    const commands = buildCommandMatrix(workspaceRoot, specFolder);
    const manifest = [];
    commands.forEach((spec, index) => {
        const output = runCommand(spec);
        const fileName = `${String(index + 1).padStart(2, '0')}-${spec.command}-${spec.args[0] || 'cmd'}.txt`;
        fs_1.default.writeFileSync(path_1.default.join(outputDir, fileName), `${output}\n`, 'utf8');
        manifest.push({ file: fileName, command: `${spec.command} ${spec.args.join(' ')}` });
    });
    fs_1.default.writeFileSync(path_1.default.join(outputDir, 'manifest.json'), `${JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, inputs: manifest }, null, 2)}\n`, 'utf8');
    console.log(`Collected ${manifest.length} Bash outputs in ${outputDir}`);
}
main();
//# sourceMappingURL=collect-redaction-calibration-inputs.js.map