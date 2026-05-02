// -------------------------------------------------------------------
// MODULE: Validation Orchestrator
// -------------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { resolveLevelContract, type SpecKitLevel } from '../templates/level-contract-resolver.js';
import { isPhaseParent } from '../spec/is-phase-parent.js';
import { runSpecDocStructureRule, type RuleResult, type SpecDocRuleName } from './spec-doc-structure.js';

export interface ValidateOpts {
  strict?: boolean;
  json?: boolean;
  quiet?: boolean;
  verbose?: boolean;
}

export interface ValidationEntry {
  rule: string;
  status: 'pass' | 'warn' | 'error' | 'info';
  message: string;
  details: string[];
}

export interface ValidationReport {
  folder: string;
  level: SpecKitLevel;
  entries: ValidationEntry[];
  summary: {
    errors: number;
    warnings: number;
    info: number;
  };
  passed: boolean;
}

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
function findSkillRoot(startDir: string): string {
  let current = startDir;
  for (let depth = 0; depth < 8; depth += 1) {
    if (fs.existsSync(path.join(current, 'templates', 'manifest', 'spec-kit-docs.json'))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }
  return path.resolve(startDir, '../../..');
}

const SKILL_ROOT = findSkillRoot(MODULE_DIR);
const TEMPLATE_ROOT = path.join(SKILL_ROOT, 'templates', 'manifest');
const VALID_LEVELS = new Set<SpecKitLevel>(['1', '2', '3', '3+', 'phase']);
const REQUIRED_FRONTMATTER_KEYS = ['packet_pointer', 'last_updated_at', 'last_updated_by', 'recent_action', 'next_safe_action'];
const OPTIONAL_TEMPLATE_HEADER_RE = /^(?:L(?:2|3\+?)|FIX ADDENDUM)\s*:/iu;
const OPTIONAL_TEMPLATE_ANCHORS = new Set(['affected-surfaces']);

function normalizeLevel(raw: string): SpecKitLevel {
  if (raw === '3+') return '3+';
  if (raw === 'phase' || raw === 'phase-parent') return 'phase';
  if (raw === '1' || raw === '2' || raw === '3') return raw;
  throw new Error(`Unsupported spec kit level: ${raw || '(empty)'}`);
}

function detectLevel(folder: string): SpecKitLevel {
  if (isPhaseParent(folder)) return 'phase';
  const specPath = path.join(folder, 'spec.md');
  if (fs.existsSync(specPath)) {
    const head = fs.readFileSync(specPath, 'utf8').slice(0, 4096);
    const marker = head.match(/SPECKIT_LEVEL:\s*(1|2|3\+?|phase)/u)?.[1];
    if (marker) return normalizeLevel(marker);
    const yamlLevel = head.match(/^level:\s*(1|2|3\+?)\s*$/mu)?.[1];
    if (yamlLevel) return normalizeLevel(yamlLevel);
    const tableLevel = head.match(/\|\s*\*\*Level\*\*\s*\|\s*(1|2|3\+?)\s*\|/u)?.[1];
    if (tableLevel) return normalizeLevel(tableLevel);
  }
  if (fs.existsSync(path.join(folder, 'decision-record.md'))) return '3';
  if (fs.existsSync(path.join(folder, 'checklist.md'))) return '2';
  return '1';
}

function entry(rule: string, status: ValidationEntry['status'], message: string, details: string[] = []): ValidationEntry {
  return { rule, status, message, details };
}

function docsForLevel(level: SpecKitLevel): string[] {
  const contract = resolveLevelContract(level);
  return [...contract.requiredCoreDocs, ...contract.requiredAddonDocs];
}

function readIfExists(filePath: string): string | null {
  return fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : null;
}

function stripFences(content: string): string {
  const lines = content.replace(/\r\n/gu, '\n').split('\n');
  let inFence = false;
  return lines.map((line) => {
    if (/^\s*(```|~~~)/u.test(line)) {
      inFence = !inFence;
      return '';
    }
    return inFence ? '' : line;
  }).join('\n');
}

function renderInlineGates(template: string, level: SpecKitLevel): string {
  const lines = template.split(/(?<=\n)/u);
  const output: string[] = [];
  const stack: boolean[] = [];
  let inFence = false;

  for (const line of lines) {
    if (/^\s*(`{3}|~~~)/u.test(line)) {
      if (stack.every(Boolean)) output.push(line);
      inFence = !inFence;
      continue;
    }
    if (!inFence) {
      const open = line.match(/^\s*<!--\s*IF\s+(.+?)\s*-->\s*$/u);
      if (open) {
        const values = open[1].match(/level:([A-Za-z0-9+,_ -]+)/u)?.[1]
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean) ?? [];
        stack.push(values.includes(level));
        continue;
      }
      if (/^\s*<!--\s*\/IF\s*-->\s*$/u.test(line)) {
        stack.pop();
        continue;
      }
    }
    if (stack.every(Boolean)) output.push(line);
  }
  return output.join('');
}

function templateNameForDoc(level: SpecKitLevel, docName: string): string {
  if (level === 'phase' && docName === 'spec.md') return 'phase-parent.spec.md.tmpl';
  return `${docName}.tmpl`;
}

function renderedTemplate(level: SpecKitLevel, docName: string): string | null {
  const templatePath = path.join(TEMPLATE_ROOT, templateNameForDoc(level, docName));
  if (!fs.existsSync(templatePath)) return null;
  return renderInlineGates(fs.readFileSync(templatePath, 'utf8'), level);
}

function normalizeHeader(raw: string): string {
  return raw
    .replace(/\[[^\]]+\]/gu, '')
    .replace(/^\d+\.\s*/u, '')
    .replace(/\s+/gu, ' ')
    .trim()
    .toUpperCase();
}

function h2Headers(content: string): string[] {
  return [...stripFences(content).matchAll(/^##\s+(.+)$/gmu)].map((match) => normalizeHeader(match[1]));
}

function anchors(content: string): string[] {
  return [...stripFences(content).matchAll(/<!--\s*ANCHOR:([A-Za-z0-9][A-Za-z0-9_-]*)\s*-->/gu)].map((match) => match[1]);
}

function validateFileExists(folder: string, level: SpecKitLevel): ValidationEntry {
  const missing = docsForLevel(level).filter((docName) => !fs.existsSync(path.join(folder, docName)));
  if (level === 'phase') {
    for (const required of ['description.json', 'graph-metadata.json']) {
      if (!fs.existsSync(path.join(folder, required))) missing.push(required);
    }
  }
  return missing.length === 0
    ? entry('FILE_EXISTS', 'pass', `All required files present for Level ${level}`)
    : entry('FILE_EXISTS', 'error', `Missing ${missing.length} required file(s) for Level ${level}`, missing);
}

function validatePlaceholders(folder: string, level: SpecKitLevel): ValidationEntry {
  const findings: string[] = [];
  for (const docName of docsForLevel(level)) {
    const content = readIfExists(path.join(folder, docName));
    if (!content) continue;
    const lines = content.split(/\r?\n/u);
    lines.forEach((line, index) => {
      if (/<YOUR_VALUE_HERE:|\[YOUR_VALUE_HERE:|\[NEEDS_CLARIFICATION:/u.test(line)) {
        findings.push(`${docName}:${index + 1}: ${line.trim().slice(0, 120)}`);
      }
    });
  }
  return findings.length === 0
    ? entry('PLACEHOLDER_FILLED', 'pass', 'No unfilled template placeholders found')
    : entry('PLACEHOLDER_FILLED', 'error', `${findings.length} placeholder(s) found`, findings);
}

function validateTemplateSource(folder: string, level: SpecKitLevel): ValidationEntry {
  const missing = docsForLevel(level).filter((docName) => {
    const content = readIfExists(path.join(folder, docName));
    return content && !content.split(/\r?\n/u).slice(0, 70).some((line) => line.includes('SPECKIT_TEMPLATE_SOURCE:'));
  });
  return missing.length === 0
    ? entry('TEMPLATE_SOURCE', 'pass', 'Template source headers present')
    : entry('TEMPLATE_SOURCE', 'error', 'Template source header missing', missing);
}

function validateTemplateShape(folder: string, level: SpecKitLevel, scope: 'headers' | 'anchors'): ValidationEntry {
  if (level === 'phase' && isPhaseParent(folder)) {
    return entry(scope === 'headers' ? 'TEMPLATE_HEADERS' : 'ANCHORS_VALID', 'pass', 'Phase parent lean template shape accepted');
  }

  const findings: string[] = [];
  let checked = 0;
  for (const docName of docsForLevel(level)) {
    const actual = readIfExists(path.join(folder, docName));
    const expected = renderedTemplate(level, docName);
    if (!actual || !expected) continue;
    checked += 1;

    if (scope === 'headers') {
      const actualHeaders = h2Headers(actual);
      const expectedHeaders = h2Headers(expected).filter((header) => !OPTIONAL_TEMPLATE_HEADER_RE.test(header));
      let cursor = 0;
      for (const expectedHeader of expectedHeaders) {
        const foundAt = expectedHeader === 'ADR-001:'
          ? actualHeaders.findIndex((header, index) => index >= cursor && /^ADR-001:/u.test(header))
          : actualHeaders.indexOf(expectedHeader, cursor);
        if (foundAt === -1) findings.push(`${docName}: missing or out-of-order header '${expectedHeader}'`);
        else cursor = foundAt + 1;
      }
    } else {
      const actualAnchors = new Set(anchors(actual));
      const expectedAnchors = anchors(expected).filter((anchor) => !OPTIONAL_TEMPLATE_ANCHORS.has(anchor));
      for (const expectedAnchor of expectedAnchors) {
        if (!actualAnchors.has(expectedAnchor)) findings.push(`${docName}: missing required anchor '${expectedAnchor}'`);
      }
      const openCount = (stripFences(actual).match(/<!--\s*ANCHOR:/gu) ?? []).length;
      const closeCount = (stripFences(actual).match(/<!--\s*\/ANCHOR:/gu) ?? []).length;
      if (openCount !== closeCount) findings.push(`${docName}: anchor open/close count mismatch (${openCount}/${closeCount})`);
    }
  }
  const rule = scope === 'headers' ? 'TEMPLATE_HEADERS' : 'ANCHORS_VALID';
  return findings.length === 0
    ? entry(rule, 'pass', `Template ${scope} match in ${checked} file(s)`)
    : entry(rule, 'error', `${findings.length} template ${scope} issue(s) found`, findings);
}

function validatePriorityTags(folder: string): ValidationEntry {
  const checklist = readIfExists(path.join(folder, 'checklist.md'));
  if (!checklist) return entry('PRIORITY_TAGS', 'pass', 'No checklist found');
  const findings = checklist
    .split(/\r?\n/u)
    .map((line, index) => ({ line, index: index + 1 }))
    .filter(({ line }) => /^-\s+\[[ xX]\]/u.test(line) && !/\*{0,2}CHK-[A-Za-z0-9-]+\*{0,2}\s+\[P[012]\]/u.test(line))
    .map(({ line, index }) => `checklist.md:${index}: ${line.trim().slice(0, 120)}`);
  return findings.length === 0
    ? entry('PRIORITY_TAGS', 'pass', 'Checklist priority tags use CHK-* [P*] format')
    : entry('PRIORITY_TAGS', 'warn', `${findings.length} checklist item(s) have non-standard priority tags`, findings);
}

function extractSessionIds(content: string): { sessionIds: string[]; parentSessionIds: string[] } {
  const sessionIds: string[] = [];
  const parentSessionIds: string[] = [];
  for (const match of content.matchAll(/^\s{6}session_id:\s*(.+?)\s*$/gmu)) {
    sessionIds.push(match[1].replace(/^["']|["']$/gu, ''));
  }
  for (const match of content.matchAll(/^\s{6}parent_session_id:\s*(.+?)\s*$/gmu)) {
    const value = match[1].replace(/^["']|["']$/gu, '');
    if (value !== 'null' && value.trim()) parentSessionIds.push(value);
  }
  return { sessionIds, parentSessionIds };
}

function collectKnownSessionIds(folder: string): Set<string> {
  const root = (() => {
    const marker = `${path.sep}.opencode${path.sep}specs${path.sep}`;
    const index = folder.indexOf(marker);
    return index >= 0 ? folder.slice(0, index + marker.length - 1) : path.dirname(folder);
  })();
  const known = new Set<string>();
  const stack = [root];
  while (stack.length > 0) {
    const current = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(current, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const dirent of entries) {
      const full = path.join(current, dirent.name);
      if (dirent.isDirectory()) {
        if (dirent.name === 'node_modules' || dirent.name === '.git' || dirent.name === 'scratch') continue;
        stack.push(full);
      } else if (dirent.isFile() && dirent.name.endsWith('.md')) {
        const content = readIfExists(full);
        if (!content) continue;
        for (const id of extractSessionIds(content).sessionIds) known.add(id);
      }
    }
  }
  return known;
}

function validateSpecDocRule(folder: string, level: SpecKitLevel, rule: SpecDocRuleName): ValidationEntry {
  const result: RuleResult = runSpecDocStructureRule({ folder, level, rule });
  const status = result.status === 'fail' ? 'error' : result.status;
  const details = [...result.details];
  if (rule === 'FRONTMATTER_MEMORY_BLOCK') {
    const known = collectKnownSessionIds(folder);
    for (const docName of docsForLevel(level)) {
      const content = readIfExists(path.join(folder, docName));
      if (!content) continue;
      for (const parentId of extractSessionIds(content).parentSessionIds) {
        if (!known.has(parentId)) {
          details.push(`SESSION_LINEAGE_BROKEN: ${docName}: parent_session_id '${parentId}' does not exist in known packet frontmatter`);
        }
      }
    }
  }
  const hasLineageWarning = details.some((detail) => detail.startsWith('SESSION_LINEAGE_BROKEN:'));
  return entry(
    result.rule,
    status === 'pass' && hasLineageWarning ? 'warn' : status,
    hasLineageWarning && status === 'pass' ? 'Session lineage warning(s) found' : result.message,
    details,
  );
}

function validateFrontmatterBasics(folder: string, level: SpecKitLevel): ValidationEntry {
  const missing: string[] = [];
  for (const docName of docsForLevel(level)) {
    const content = readIfExists(path.join(folder, docName));
    if (!content) continue;
    const frontmatter = content.match(/^---\n([\s\S]*?)\n---/u)?.[1] ?? '';
    for (const key of REQUIRED_FRONTMATTER_KEYS) {
      if (!new RegExp(`^\\s{4}${key}:`, 'mu').test(frontmatter)) {
        missing.push(`${docName}: missing _memory.continuity.${key}`);
      }
    }
  }
  return missing.length === 0
    ? entry('FRONTMATTER_VALID', 'pass', 'Frontmatter continuity basics present')
    : entry('FRONTMATTER_VALID', 'warn', `${missing.length} frontmatter continuity warning(s)`, missing);
}

export function validateFolder(folderPath: string, opts: ValidateOpts = {}): ValidationReport {
  const folder = path.resolve(folderPath);
  if (!fs.existsSync(folder) || !fs.statSync(folder).isDirectory()) {
    throw new Error(`Folder not found: ${folderPath}`);
  }
  const level = normalizeLevel(opts.strict && isPhaseParent(folder) ? 'phase' : detectLevel(folder));
  const entries: ValidationEntry[] = [];

  entries.push(validateFileExists(folder, level));
  entries.push(validatePlaceholders(folder, level));
  entries.push(validateTemplateSource(folder, level));
  entries.push(validateTemplateShape(folder, level, 'headers'));
  entries.push(validateTemplateShape(folder, level, 'anchors'));
  entries.push(validatePriorityTags(folder));
  entries.push(validateFrontmatterBasics(folder, level));
  entries.push(validateSpecDocRule(folder, level, 'FRONTMATTER_MEMORY_BLOCK'));
  entries.push(validateSpecDocRule(folder, level, 'SPEC_DOC_SUFFICIENCY'));
  entries.push(entry('SECTIONS_PRESENT', 'pass', 'Section presence covered by per-document manifest anchors'));
  entries.push(entry('LEVEL_DECLARED', 'info', `Detected Level ${level}`));
  entries.push(entry('GRAPH_METADATA_PRESENT', fs.existsSync(path.join(folder, 'graph-metadata.json')) ? 'pass' : 'warn', 'Graph metadata checked'));

  const summary = {
    errors: entries.filter((item) => item.status === 'error').length,
    warnings: entries.filter((item) => item.status === 'warn').length,
    info: entries.filter((item) => item.status === 'info').length,
  };
  return {
    folder,
    level,
    entries,
    summary,
    passed: summary.errors === 0 && !(opts.strict && summary.warnings > 0),
  };
}

function parseCliArgs(argv: string[]): { folder: string; opts: ValidateOpts } {
  let folder = '';
  const opts: ValidateOpts = {};
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    switch (arg) {
      case '--folder':
        folder = argv[index + 1] ?? '';
        index += 1;
        break;
      case '--strict':
        opts.strict = true;
        break;
      case '--json':
        opts.json = true;
        break;
      case '--quiet':
      case '-q':
        opts.quiet = true;
        break;
      case '--verbose':
        opts.verbose = true;
        break;
      default:
        if (!arg.startsWith('--') && !folder) folder = arg;
        break;
    }
  }
  if (!folder) {
    throw new Error('Usage: orchestrator --folder <spec-folder> [--strict] [--json] [--quiet]');
  }
  return { folder, opts };
}

function printReport(report: ValidationReport, opts: ValidateOpts): void {
  if (opts.json) {
    process.stdout.write(`${JSON.stringify(report)}\n`);
    return;
  }
  if (opts.quiet) {
    const status = report.passed ? 'PASSED' : 'FAILED';
    process.stdout.write(`RESULT: ${status} (errors=${report.summary.errors} warnings=${report.summary.warnings})\n`);
    return;
  }
  process.stdout.write(`\nSpec Folder Validation v3.0.0\n\n`);
  process.stdout.write(`  Folder: ${report.folder}\n`);
  process.stdout.write(`  Level:  ${report.level}\n\n`);
  for (const item of report.entries) {
    if (item.status === 'info' && !opts.verbose) continue;
    const marker = item.status === 'error' ? 'x' : item.status === 'warn' ? '!' : item.status === 'info' ? 'i' : '+';
    process.stdout.write(`${marker} ${item.rule}: ${item.message}\n`);
    if (opts.verbose) {
      for (const detail of item.details) process.stdout.write(`    - ${detail}\n`);
    }
  }
  process.stdout.write(`\nSummary: Errors: ${report.summary.errors}  Warnings: ${report.summary.warnings}\n\n`);
  process.stdout.write(`RESULT: ${report.passed ? 'PASSED' : 'FAILED'}\n`);
}

if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    const { folder, opts } = parseCliArgs(process.argv.slice(2));
    const report = validateFolder(folder, opts);
    printReport(report, opts);
    process.exitCode = report.passed ? 0 : 2;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`ERROR: ${message}`);
    process.exitCode = /Folder not found|ENOENT|EACCES|manifest|Internal template contract/u.test(message) ? 3 : 1;
  }
}
