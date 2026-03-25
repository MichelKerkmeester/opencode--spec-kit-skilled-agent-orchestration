// ---------------------------------------------------------------
// MODULE: Collect Redaction Calibration Inputs
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. COLLECT REDACTION CALIBRATION INPUTS
// ───────────────────────────────────────────────────────────────
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

interface CommandSpec {
  command: string;
  args: string[];
  cwd?: string;
}

function parseArgs(): { specFolder: string } {
  const [, , specFolder] = process.argv;
  if (!specFolder) {
    throw new Error('Usage: ts-node scripts/evals/collect-redaction-calibration-inputs.ts <spec-folder-relative-path>');
  }
  return { specFolder };
}

function runCommand(spec: CommandSpec): string {
  const result = spawnSync(spec.command, spec.args, {
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

function buildCommandMatrix(workspaceRoot: string, specFolder: string): CommandSpec[] {
  const specs: CommandSpec[] = [
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

  const outputs: CommandSpec[] = [];
  for (let i = 0; i < 5; i += 1) {
    outputs.push(...specs);
  }
  return outputs.slice(0, 50);
}

function main(): void {
  const { specFolder } = parseArgs();
  const workspaceRoot = process.cwd();
  const outputDir = path.join(specFolder, 'scratch', 'redaction-calibration-inputs');
  fs.mkdirSync(outputDir, { recursive: true });

  const commands = buildCommandMatrix(workspaceRoot, specFolder);
  const manifest: Array<{ file: string; command: string }> = [];

  commands.forEach((spec, index) => {
    const output = runCommand(spec);
    const fileName = `${String(index + 1).padStart(2, '0')}-${spec.command}-${spec.args[0] || 'cmd'}.txt`;
    fs.writeFileSync(path.join(outputDir, fileName), `${output}\n`, 'utf8');
    manifest.push({ file: fileName, command: `${spec.command} ${spec.args.join(' ')}` });
  });

  fs.writeFileSync(
    path.join(outputDir, 'manifest.json'),
    `${JSON.stringify({ generatedAt: new Date().toISOString(), count: manifest.length, inputs: manifest }, null, 2)}\n`,
    'utf8'
  );

  console.log(`Collected ${manifest.length} Bash outputs in ${outputDir}`);
}

main();
