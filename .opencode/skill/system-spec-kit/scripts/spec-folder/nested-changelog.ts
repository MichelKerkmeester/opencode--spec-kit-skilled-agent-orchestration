// ───────────────────────────────────────────────────────────────────
// MODULE: Nested Changelog Generator
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { validateFilePath } from '@spec-kit/shared/utils/path-security';
import { CONFIG, getSpecsDirectories, SPEC_FOLDER_PATTERN, findChildFolderSync } from '../core';

// ───────────────────────────────────────────────────────────────────
// 2. TYPE DEFINITIONS
// ───────────────────────────────────────────────────────────────────

type NestedChangelogMode = 'root' | 'phase';

interface CliOptions {
  help: boolean;
  json: boolean;
  write: boolean;
  mode: 'auto' | NestedChangelogMode;
  outputPath: string | null;
  specFolderArg: string | null;
}

interface ChecklistItem {
  checked: boolean;
  priority: string | null;
  text: string;
  evidence: string | null;
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

// ───────────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────────

const HELP_TEXT = `
Usage: node nested-changelog.js <spec-folder> [options]

Arguments:
  <spec-folder>       Spec folder path, phase child path, or bare spec folder name

Options:
  --help, -h          Show this help message
  --json              Print the derived changelog payload as JSON
  --write             Write the rendered changelog markdown to disk
  --mode <auto|root|phase>
                      Override automatic root/phase mode detection
  --output <path>     Override the default output file path

Examples:
  node nested-changelog.js .opencode/specs/02--system-spec-kit/025-nested-changelog-per-spec
  node nested-changelog.js .opencode/specs/02--system-spec-kit/024-compact-code-graph/029-review-remediation --write
  node nested-changelog.js 024-compact-code-graph --mode root --json
`;

// ───────────────────────────────────────────────────────────────────
// 4. HELPERS
// ───────────────────────────────────────────────────────────────────

function parseArgs(argv: string[]): CliOptions {
  const options: CliOptions = {
    help: false,
    json: false,
    write: false,
    mode: 'auto',
    outputPath: null,
    specFolderArg: null,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--help' || token === '-h') {
      options.help = true;
      continue;
    }
    if (token === '--json') {
      options.json = true;
      continue;
    }
    if (token === '--write') {
      options.write = true;
      continue;
    }
    if (token === '--mode') {
      const value = argv[index + 1];
      if (!value || !['auto', 'root', 'phase'].includes(value)) {
        throw new Error('Expected --mode auto|root|phase');
      }
      options.mode = value as CliOptions['mode'];
      index += 1;
      continue;
    }
    if (token === '--output') {
      const value = argv[index + 1];
      if (!value) {
        throw new Error('Expected a path after --output');
      }
      options.outputPath = value;
      index += 1;
      continue;
    }
    if (token.startsWith('-')) {
      throw new Error(`Unknown option: ${token}`);
    }
    if (options.specFolderArg) {
      throw new Error('Only one spec folder path may be provided');
    }
    options.specFolderArg = token;
  }

  return options;
}

function normalizeSlashes(value: string): string {
  return value.replace(/\\/g, '/');
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(/^---[\s\S]*?\n---\s*\n?/, '');
}

function cleanInlineMarkdown(value: string): string {
  return value
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeItemText(value: string): string {
  return cleanInlineMarkdown(
    value
      .replace(/\[EVIDENCE:[^\]]+\]/gi, '')
      .replace(/\[DEFERRED:[^\]]+\]/gi, '')
      .replace(/\[(P[0-2])\]/gi, '')
      .replace(/^T\d+\s+/i, '')
      .replace(/^[\d.() -]+/, '')
  );
}

function readOptionalFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, 'utf8');
  } catch (_error) {
    return '';
  }
}

function extractMarkdownTitle(markdown: string): string {
  const match = stripFrontmatter(markdown).match(/^#\s+(.+)$/m);
  return match ? cleanInlineMarkdown(match[1]) : '';
}

function normalizeHeading(heading: string): string {
  return heading.replace(/^\d+\.\s*/, '').trim().toLowerCase();
}

function extractSection(markdown: string, headingNames: string[]): string {
  const content = stripFrontmatter(markdown);
  const headings = Array.from(content.matchAll(/^#{1,6}\s+(.+)$/gm));
  const normalizedHeadingNames = headingNames.map((name) => name.toLowerCase());

  for (let index = 0; index < headings.length; index += 1) {
    const match = headings[index];
    const label = normalizeHeading(match[1] || '');
    if (!normalizedHeadingNames.includes(label)) {
      continue;
    }

    const start = (match.index ?? 0) + match[0].length;
    const end = index + 1 < headings.length
      ? (headings[index + 1].index ?? content.length)
      : content.length;
    return content.slice(start, end).trim();
  }

  return '';
}

function extractFirstParagraph(markdown: string): string {
  const candidates = stripFrontmatter(markdown)
    .split(/\n\s*\n/)
    .map((block) => block.trim())
    .filter(Boolean);

  for (const block of candidates) {
    if (
      block.startsWith('#')
      || block.startsWith('|')
      || block.startsWith('<!--')
      || block.startsWith('- ')
      || block.startsWith('* ')
      || block.startsWith('```')
    ) {
      continue;
    }
    const cleaned = cleanInlineMarkdown(block);
    if (cleaned.length >= 20) {
      return cleaned;
    }
  }

  return '';
}

function extractMetadataValue(markdown: string, field: string): string {
  const pattern = new RegExp(`\\|\\s*\\*\\*${field.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\$&')}\\*\\*\\s*\\|\\s*([^|]+?)\\s*\\|`, 'i');
  const match = markdown.match(pattern);
  return match ? cleanInlineMarkdown(match[1]) : '';
}

function parseChecklistItems(markdown: string): ChecklistItem[] {
  const items: ChecklistItem[] = [];
  const lines = stripFrontmatter(markdown).split(/\r?\n/);
  let currentPriority: string | null = null;

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,6}\s+\[?(P[0-2])\]?/i);
    if (headingMatch) {
      currentPriority = headingMatch[1].toUpperCase();
      continue;
    }

    const itemMatch = line.match(/^\s*-\s*\[([ xX])\]\s+(.+)$/);
    if (!itemMatch) {
      continue;
    }

    const priorityMatch = itemMatch[2].match(/\[(P[0-2])\]/i);
    const evidenceMatch = itemMatch[2].match(/\[(EVIDENCE:[^\]]+)\]/i);
    items.push({
      checked: itemMatch[1].toLowerCase() === 'x',
      priority: priorityMatch ? priorityMatch[1].toUpperCase() : currentPriority,
      text: sanitizeItemText(itemMatch[2]),
      evidence: evidenceMatch ? cleanInlineMarkdown(evidenceMatch[1]) : null,
    });
  }

  return items;
}

function parseTableRows(sectionContent: string): string[][] {
  const rows: string[][] = [];
  const lines = sectionContent.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);

  for (const line of lines) {
    if (!line.startsWith('|')) {
      if (rows.length > 0) {
        break;
      }
      continue;
    }
    if (/^\|[- :|]+\|?$/.test(line)) {
      continue;
    }
    const cells = line.split('|').slice(1, -1).map((cell) => cleanInlineMarkdown(cell));
    if (cells.length > 1) {
      rows.push(cells);
    }
  }

  if (rows.length > 1 && rows[0].every((cell) => /^[A-Za-z ][A-Za-z /]+$/.test(cell))) {
    return rows.slice(1);
  }

  return rows;
}

function extractFilesChanged(implementationSummary: string, specMarkdown: string, taskItems: ChecklistItem[]): FileChangeRow[] {
  const rows: FileChangeRow[] = [];
  const seen = new Set<string>();
  const fileSections = [
    extractSection(implementationSummary, ['files changed']),
    extractSection(implementationSummary, ['what was built']),
    extractSection(specMarkdown, ['scope']),
  ];

  for (const section of fileSections) {
    for (const row of parseTableRows(section)) {
      if (row.length < 3) {
        continue;
      }
      const filePath = row[0];
      if (!filePath || !/[/.]/.test(filePath)) {
        continue;
      }
      const key = filePath.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      rows.push({
        path: filePath,
        action: row[1] || 'Updated',
        description: row[2] || 'Updated as part of this spec',
      });
    }
  }

  for (const item of taskItems) {
    const paths = Array.from(item.text.matchAll(/`([^`]+)`/g)).map((match) => match[1]);
    for (const filePath of paths) {
      const key = filePath.toLowerCase();
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);
      rows.push({
        path: filePath,
        action: 'Updated',
        description: item.text,
      });
    }
  }

  return rows.slice(0, 12);
}

function classifyChangeItem(text: string): 'added' | 'changed' | 'fixed' {
  const lower = text.toLowerCase();
  if (/(fix|fixed|repair|remediat|bug|correct|restore|prevent|harden|debug)/.test(lower)) {
    return 'fixed';
  }
  if (/(add|added|create|created|introduc|new|support|enable|implement|build)/.test(lower)) {
    return 'added';
  }
  return 'changed';
}

function extractChangeBullets(taskItems: ChecklistItem[], summaryText: string): Pick<NestedChangelogData, 'added' | 'changed' | 'fixed'> {
  const added: string[] = [];
  const changed: string[] = [];
  const fixed: string[] = [];
  const seen = new Set<string>();

  const push = (bucket: string[], text: string): void => {
    const cleaned = sanitizeItemText(text);
    if (!cleaned || cleaned.length < 8) {
      return;
    }
    const key = cleaned.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    bucket.push(cleaned);
  };

  for (const item of taskItems.filter((entry) => entry.checked)) {
    const bucket = classifyChangeItem(item.text);
    if (bucket === 'added') {
      push(added, item.text);
    } else if (bucket === 'fixed') {
      push(fixed, item.text);
    } else {
      push(changed, item.text);
    }
  }

  if (added.length + changed.length + fixed.length === 0 && summaryText) {
    push(changed, summaryText);
  }

  return {
    added: added.slice(0, 6),
    changed: changed.slice(0, 6),
    fixed: fixed.slice(0, 6),
  };
}

function extractVerificationItems(implementationSummary: string, checklistItems: ChecklistItem[], tasksItems: ChecklistItem[]): string[] {
  const results: string[] = [];
  const seen = new Set<string>();

  for (const row of parseTableRows(extractSection(implementationSummary, ['verification']))) {
    if (row.length < 2) {
      continue;
    }
    const value = `${row[0]} - ${row[1]}`;
    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    results.push(value);
  }

  const evidencedChecklistItems = checklistItems
    .filter((item) => item.checked && item.evidence)
    .slice(0, 4)
    .map((item) => `${item.priority || 'Checklist'} - ${item.text} (${item.evidence})`);
  for (const item of evidencedChecklistItems) {
    const key = item.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    results.push(item);
  }

  const completedTasks = tasksItems.filter((item) => item.checked).length;
  if (completedTasks > 0) {
    results.push(`Tasks complete - ${completedTasks} completed task item(s) recorded`);
  }

  return results.slice(0, 8);
}

function extractFollowUps(implementationSummary: string, checklistItems: ChecklistItem[], tasksItems: ChecklistItem[]): string[] {
  const followUps: string[] = [];
  const seen = new Set<string>();

  const add = (value: string): void => {
    const cleaned = sanitizeItemText(value);
    if (!cleaned || cleaned.toLowerCase() === 'none identified.') {
      return;
    }
    const key = cleaned.toLowerCase();
    if (seen.has(key)) {
      return;
    }
    seen.add(key);
    followUps.push(cleaned);
  };

  for (const item of [...checklistItems, ...tasksItems]) {
    if (!item.checked) {
      add(item.text);
    }
  }

  const limitationsSection = extractSection(implementationSummary, ['known limitations']);
  for (const line of limitationsSection.split(/\r?\n/)) {
    if (/^\s*\d+\.\s+/.test(line) || /^\s*-\s+/.test(line)) {
      add(line.replace(/^\s*(?:\d+\.)?\s*-\s*/, '').replace(/^\s*\d+\.\s*/, ''));
    }
  }

  return followUps.length > 0 ? followUps.slice(0, 6) : ['None recorded.'];
}

function extractSummary(implementationSummary: string, specMarkdown: string): string {
  const orderedCandidates = [
    extractFirstParagraph(extractSection(implementationSummary, ['what was built'])),
    extractFirstParagraph(implementationSummary),
    extractFirstParagraph(extractSection(specMarkdown, ['executive summary'])),
    extractFirstParagraph(extractSection(specMarkdown, ['problem & purpose'])),
    extractFirstParagraph(specMarkdown),
  ];

  for (const candidate of orderedCandidates) {
    if (candidate) {
      return candidate;
    }
  }

  return 'This spec completed work that is now captured in the packet-local changelog.';
}

function extractStatus(specMarkdown: string, implementationSummary: string, tasksItems: ChecklistItem[]): string {
  const status = extractMetadataValue(specMarkdown, 'Status') || extractMetadataValue(implementationSummary, 'Status');
  if (status) {
    return status;
  }
  if (tasksItems.length > 0 && tasksItems.every((item) => item.checked)) {
    return 'Complete';
  }
  return 'In Progress';
}

function buildIncludedPhases(rootSpecFolder: string): PhaseRollupEntry[] {
  const entries = fs.readdirSync(rootSpecFolder, { withFileTypes: true });
  const phases: PhaseRollupEntry[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory() || !SPEC_FOLDER_PATTERN.test(entry.name)) {
      continue;
    }
    const phaseFolder = path.join(rootSpecFolder, entry.name);
    const specMarkdown = readOptionalFile(path.join(phaseFolder, 'spec.md'));
    const implementationSummary = readOptionalFile(path.join(phaseFolder, 'implementation-summary.md'));
    const tasksItems = parseChecklistItems(readOptionalFile(path.join(phaseFolder, 'tasks.md')));
    if (!specMarkdown && !implementationSummary && tasksItems.length === 0) {
      continue;
    }

    const summary = extractSummary(implementationSummary, specMarkdown);
    phases.push({
      folder: entry.name,
      status: extractStatus(specMarkdown, implementationSummary, tasksItems),
      summary,
    });
  }

  return phases;
}

function renderIncludedPhases(phases: PhaseRollupEntry[]): string {
  if (phases.length === 0) {
    return '';
  }

  const lines = [
    '### Included Phases',
    '',
    '| Phase | Status | Summary |',
    '|---|---|---|',
    ...phases.map((phase) => `| \`${phase.folder}\` | ${phase.status} | ${phase.summary} |`),
    '',
  ];

  return `${lines.join('\n')}\n`;
}

function renderList(items: string[]): string {
  const normalized = items.filter(Boolean);
  if (normalized.length === 0) {
    return '- None recorded.';
  }
  return normalized.map((item) => `- ${item}`).join('\n');
}

function renderFilesTable(rows: FileChangeRow[]): string {
  if (rows.length === 0) {
    return '_No file-level detail recorded._';
  }

  const lines = [
    '| File | Action | What changed |',
    '|---|---|---|',
    ...rows.map((row) => `| \`${row.path}\` | ${row.action} | ${row.description} |`),
  ];

  return lines.join('\n');
}

function renderTemplate(templatePath: string, replacements: Record<string, string>): string {
  let content = fs.readFileSync(templatePath, 'utf8');
  for (const [key, value] of Object.entries(replacements)) {
    content = content.replace(new RegExp(`{{${key}}}`, 'g'), value);
  }
  return content;
}

// ───────────────────────────────────────────────────────────────────
// 5. CORE LOGIC
// ───────────────────────────────────────────────────────────────────

function ensureApprovedSpecFolder(specFolderPath: string): string {
  const approved = validateFilePath(specFolderPath, getSpecsDirectories());
  if (!approved) {
    throw new Error(`Spec folder must be inside specs/ or .opencode/specs/: ${specFolderPath}`);
  }
  return approved;
}

function resolveSpecFolder(rawArg: string): string {
  const trimmed = rawArg.trim().replace(/\/+$/, '');
  const attempts: string[] = [];

  if (path.isAbsolute(trimmed)) {
    attempts.push(trimmed);
  } else {
    attempts.push(path.join(CONFIG.PROJECT_ROOT, trimmed));
    const childMatch = findChildFolderSync(trimmed);
    if (childMatch) {
      attempts.push(childMatch);
    }
  }

  for (const attempt of attempts) {
    if (!attempt) {
      continue;
    }
    const resolved = path.resolve(attempt);
    if (fs.existsSync(resolved) && fs.statSync(resolved).isDirectory()) {
      return ensureApprovedSpecFolder(resolved);
    }
  }

  throw new Error(`Spec folder not found: ${rawArg}`);
}

function detectMode(specFolder: string, explicitMode: CliOptions['mode']): NestedChangelogMode {
  if (explicitMode === 'root' || explicitMode === 'phase') {
    return explicitMode;
  }

  const parent = path.dirname(specFolder);
  const parentName = path.basename(parent);
  if (SPEC_FOLDER_PATTERN.test(parentName) && fs.existsSync(path.join(parent, 'spec.md'))) {
    return 'phase';
  }

  return 'root';
}

function buildOutputPath(rootSpecFolder: string, specFolder: string, mode: NestedChangelogMode, overridePath: string | null): string {
  if (overridePath) {
    return path.isAbsolute(overridePath)
      ? overridePath
      : path.join(CONFIG.PROJECT_ROOT, overridePath);
  }

  const rootName = path.basename(rootSpecFolder);
  const packetPrefix = rootName.match(/^(\d{3})-/)?.[1] || rootName;
  const changelogDir = path.join(rootSpecFolder, 'changelog');
  if (mode === 'root') {
    return path.join(changelogDir, `changelog-${packetPrefix}-root.md`);
  }
  return path.join(changelogDir, `changelog-${packetPrefix}-${path.basename(specFolder)}.md`);
}

/** Build a packet-local changelog payload for a spec root or child phase folder. */
function buildNestedChangelogData(specFolderPath: string, options: Pick<CliOptions, 'mode' | 'outputPath'>): NestedChangelogData {
  const specFolder = resolveSpecFolder(specFolderPath);
  const mode = detectMode(specFolder, options.mode);
  const rootSpecFolder = mode === 'phase' ? path.dirname(specFolder) : specFolder;
  const specMarkdown = readOptionalFile(path.join(specFolder, 'spec.md'));
  const implementationSummary = readOptionalFile(path.join(specFolder, 'implementation-summary.md'));
  const tasksMarkdown = readOptionalFile(path.join(specFolder, 'tasks.md'));
  const checklistMarkdown = readOptionalFile(path.join(specFolder, 'checklist.md'));
  const tasksItems = parseChecklistItems(tasksMarkdown);
  const checklistItems = parseChecklistItems(checklistMarkdown);
  const summary = extractSummary(implementationSummary, specMarkdown);
  const changeBullets = extractChangeBullets([...tasksItems, ...checklistItems], summary);
  const filesChanged = extractFilesChanged(implementationSummary, specMarkdown, [...tasksItems, ...checklistItems]);
  const verification = extractVerificationItems(implementationSummary, checklistItems, tasksItems);
  const followUps = extractFollowUps(implementationSummary, checklistItems, tasksItems);
  const outputPath = buildOutputPath(rootSpecFolder, specFolder, mode, options.outputPath);
  const humanTitle = cleanInlineMarkdown(
    extractMarkdownTitle(specMarkdown)
    || extractMarkdownTitle(implementationSummary)
    || path.basename(specFolder)
  ).replace(/^Feature Specification:\s*/i, '');
  const level = extractMetadataValue(implementationSummary, 'Level') || extractMetadataValue(specMarkdown, 'Level') || 'unknown';
  const includedPhases = mode === 'root' ? buildIncludedPhases(rootSpecFolder) : [];
  const relativeSpecFolder = normalizeSlashes(path.relative(CONFIG.PROJECT_ROOT, specFolder));
  const relativeRootSpecFolder = normalizeSlashes(path.relative(CONFIG.PROJECT_ROOT, rootSpecFolder));

  return {
    mode,
    specFolder: relativeSpecFolder,
    rootSpecFolder: relativeRootSpecFolder,
    outputPath: normalizeSlashes(path.relative(CONFIG.PROJECT_ROOT, outputPath)),
    date: new Date().toISOString().slice(0, 10),
    level,
    title: mode === 'root'
      ? `Changelog: ${humanTitle} [${path.basename(rootSpecFolder)}/root]`
      : `Changelog: ${humanTitle} [${path.basename(rootSpecFolder)}/${path.basename(specFolder)}]`,
    description: mode === 'root'
      ? `Chronological changelog for the ${humanTitle} spec root.`
      : `Chronological changelog for the ${humanTitle} phase.`,
    summary,
    includedPhases,
    added: changeBullets.added.length > 0 ? changeBullets.added : ['No new additions recorded.'],
    changed: changeBullets.changed.length > 0 ? changeBullets.changed : ['No broader packet changes recorded.'],
    fixed: changeBullets.fixed.length > 0 ? changeBullets.fixed : ['No fixes recorded.'],
    verification: verification.length > 0 ? verification : ['No explicit verification recorded.'],
    filesChanged,
    followUps,
  };
}

/** Render packet-local changelog markdown from a derived changelog payload. */
function generateNestedChangelogMarkdown(data: NestedChangelogData): string {
  const templatePath = path.join(
    CONFIG.TEMPLATE_DIR,
    'changelog',
    data.mode === 'root' ? 'root.md' : 'phase.md'
  );

  return renderTemplate(templatePath, {
    TITLE: data.title,
    DESCRIPTION: data.description,
    DATE: data.date,
    SPEC_FOLDER: data.specFolder,
    ROOT_SPEC_FOLDER: data.rootSpecFolder,
    LEVEL: data.level,
    SUMMARY: data.summary,
    INCLUDED_PHASES_SECTION: renderIncludedPhases(data.includedPhases),
    ADDED_LIST: renderList(data.added),
    CHANGED_LIST: renderList(data.changed),
    FIXED_LIST: renderList(data.fixed),
    VERIFICATION_LIST: renderList(data.verification),
    FILES_TABLE: renderFilesTable(data.filesChanged),
    FOLLOW_UP_LIST: renderList(data.followUps),
  }).trimEnd() + '\n';
}

/** Write a rendered packet-local changelog to its resolved output path. */
function writeNestedChangelog(data: NestedChangelogData): string {
  const absoluteOutputPath = path.join(CONFIG.PROJECT_ROOT, data.outputPath);
  fs.mkdirSync(path.dirname(absoluteOutputPath), { recursive: true });
  fs.writeFileSync(absoluteOutputPath, generateNestedChangelogMarkdown(data), 'utf8');
  return absoluteOutputPath;
}

function main(): void {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    process.stdout.write(HELP_TEXT);
    return;
  }

  if (!options.specFolderArg) {
    throw new Error('Spec folder path required');
  }

  const data = buildNestedChangelogData(options.specFolderArg, options);
  const markdown = generateNestedChangelogMarkdown(data);

  if (options.write) {
    writeNestedChangelog(data);
  }

  if (options.json) {
    process.stdout.write(JSON.stringify({
      ...data,
      markdown,
      written: options.write,
    }, null, 2));
    process.stdout.write('\n');
    return;
  }

  process.stdout.write(markdown);
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    process.stderr.write(`${message}\n`);
    process.exit(1);
  }
}

// ───────────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────────

export {
  buildNestedChangelogData,
  generateNestedChangelogMarkdown,
  writeNestedChangelog,
};
