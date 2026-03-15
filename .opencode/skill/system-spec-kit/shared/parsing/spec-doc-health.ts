// ---------------------------------------------------------------
// MODULE: Spec Document Health Evaluator
// ---------------------------------------------------------------
// Shared evaluator for spec folder document quality.
// Used by workflow.ts (memory pipeline) and memory-save.ts for
// non-blocking health annotation on rendered memory files.
//
// Mirrors the fast 6-rule subset from validate.sh but in TypeScript
// for pipeline integration. Does NOT replace validate.sh — this is
// a lightweight evaluator for metadata annotation only.

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------
// Types
// ---------------------------------------------------------------

export interface SpecDocHealthIssue {
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
}

export interface SpecDocFileResult {
  file: string;
  pass: boolean;
  issues: string[];
}

export interface SpecDocHealthResult {
  pass: boolean;
  score: number; // 0-1 normalized
  errors: number;
  warnings: number;
  level: number | null;
  perFile: SpecDocFileResult[];
}

// ---------------------------------------------------------------
// Constants
// ---------------------------------------------------------------

const SPECKIT_LEVEL_RE = /<!--\s*SPECKIT_LEVEL:\s*(\d\+?)\s*-->/;
const SPECKIT_TEMPLATE_SOURCE_RE = /<!--\s*SPECKIT_TEMPLATE_SOURCE:\s*.+\s*-->/;
const YAML_FRONTMATTER_RE = /^---\r?\n[\s\S]*?\r?\n---/;
const ANCHOR_OPEN_RE = /<!--\s*ANCHOR:(\S+)\s*-->/g;
const ANCHOR_CLOSE_RE = /<!--\s*\/ANCHOR:(\S+)\s*-->/g;
const FOLDER_NAMING_RE = /^\d{3}-[a-z0-9]([a-z0-9-]*[a-z0-9])?$/;
const MAX_FILE_SIZE = 250 * 1024; // 250KB
const MIN_CONTENT_LENGTH = 5;

const REQUIRED_FILES: Record<number, string[]> = {
  1: ['spec.md', 'plan.md', 'tasks.md'],
  2: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md'],
  3: ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md'],
};

// ---------------------------------------------------------------
// Level Detection
// ---------------------------------------------------------------

function detectLevel(folderPath: string): number | null {
  const specPath = path.join(folderPath, 'spec.md');
  if (!fs.existsSync(specPath)) return null;

  try {
    const content = fs.readFileSync(specPath, 'utf-8').slice(0, 2000);
    const match = content.match(SPECKIT_LEVEL_RE);
    if (match) {
      return parseInt(match[1], 10);
    }

    // Fallback: infer from files
    if (fs.existsSync(path.join(folderPath, 'decision-record.md'))) return 3;
    if (fs.existsSync(path.join(folderPath, 'checklist.md'))) return 2;
    return 1;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------
// Rule Checks
// ---------------------------------------------------------------

function checkFileExists(folderPath: string, level: number): SpecDocHealthIssue[] {
  const issues: SpecDocHealthIssue[] = [];
  const required = REQUIRED_FILES[Math.min(level, 3)] || REQUIRED_FILES[1];

  for (const file of required) {
    if (!fs.existsSync(path.join(folderPath, file))) {
      issues.push({
        rule: 'FILE_EXISTS',
        severity: 'error',
        message: `Missing required file: ${file}`,
      });
    }
  }
  return issues;
}

function checkLevelDeclared(folderPath: string): SpecDocHealthIssue[] {
  const specPath = path.join(folderPath, 'spec.md');
  if (!fs.existsSync(specPath)) return [];

  try {
    const content = fs.readFileSync(specPath, 'utf-8').slice(0, 2000);
    if (!SPECKIT_LEVEL_RE.test(content)) {
      return [{
        rule: 'LEVEL_DECLARED',
        severity: 'warning',
        message: 'SPECKIT_LEVEL not declared in spec.md',
      }];
    }
  } catch {
    // File read error — skip
  }
  return [];
}

function checkFrontmatter(folderPath: string): SpecDocHealthIssue[] {
  const issues: SpecDocHealthIssue[] = [];
  const specPath = path.join(folderPath, 'spec.md');
  if (!fs.existsSync(specPath)) return [];

  try {
    const content = fs.readFileSync(specPath, 'utf-8');
    if (!YAML_FRONTMATTER_RE.test(content)) {
      issues.push({
        rule: 'FRONTMATTER_VALID',
        severity: 'error',
        message: 'Missing YAML frontmatter in spec.md',
      });
    }
  } catch {
    // skip
  }
  return issues;
}

function checkTemplateSource(folderPath: string): SpecDocHealthIssue[] {
  const issues: SpecDocHealthIssue[] = [];
  const mdFiles = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md'];

  for (const file of mdFiles) {
    const filePath = path.join(folderPath, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      const head = fs.readFileSync(filePath, 'utf-8').slice(0, 500);
      if (!SPECKIT_TEMPLATE_SOURCE_RE.test(head)) {
        issues.push({
          rule: 'TEMPLATE_SOURCE',
          severity: 'warning',
          message: `Missing SPECKIT_TEMPLATE_SOURCE in ${file}`,
        });
      }
    } catch {
      // skip
    }
  }
  return issues;
}

function checkAnchors(folderPath: string): SpecDocHealthIssue[] {
  const issues: SpecDocHealthIssue[] = [];
  const mdFiles = ['spec.md', 'plan.md', 'tasks.md', 'checklist.md', 'decision-record.md'];

  for (const file of mdFiles) {
    const filePath = path.join(folderPath, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const opens = new Set<string>();
      const closes = new Set<string>();

      let match;
      const openRe = new RegExp(ANCHOR_OPEN_RE.source, 'g');
      while ((match = openRe.exec(content)) !== null) {
        opens.add(match[1]);
      }
      const closeRe = new RegExp(ANCHOR_CLOSE_RE.source, 'g');
      while ((match = closeRe.exec(content)) !== null) {
        closes.add(match[1]);
      }

      for (const name of opens) {
        if (!closes.has(name)) {
          issues.push({
            rule: 'ANCHORS_VALID',
            severity: 'error',
            message: `Unclosed anchor ANCHOR:${name} in ${file}`,
          });
        }
      }
      for (const name of closes) {
        if (!opens.has(name)) {
          issues.push({
            rule: 'ANCHORS_VALID',
            severity: 'error',
            message: `Orphan closing /ANCHOR:${name} in ${file}`,
          });
        }
      }
    } catch {
      // skip
    }
  }
  return issues;
}

function checkFolderNaming(folderPath: string): SpecDocHealthIssue[] {
  const folderName = path.basename(folderPath);
  if (!FOLDER_NAMING_RE.test(folderName)) {
    return [{
      rule: 'FOLDER_NAMING',
      severity: 'error',
      message: `Folder name "${folderName}" does not match NNN-slug pattern`,
    }];
  }
  return [];
}

function checkContentSubstance(folderPath: string): SpecDocHealthIssue[] {
  const issues: SpecDocHealthIssue[] = [];
  const mdFiles = ['spec.md', 'plan.md', 'tasks.md'];

  for (const file of mdFiles) {
    const filePath = path.join(folderPath, file);
    if (!fs.existsSync(filePath)) continue;

    try {
      const stats = fs.statSync(filePath);
      if (stats.size > MAX_FILE_SIZE) {
        issues.push({
          rule: 'CONTENT_SUBSTANCE',
          severity: 'warning',
          message: `${file} exceeds 250KB (${Math.round(stats.size / 1024)}KB)`,
        });
      }

      const content = fs.readFileSync(filePath, 'utf-8').trim();
      // Strip frontmatter and comments for substance check
      const stripped = content
        .replace(YAML_FRONTMATTER_RE, '')
        .replace(/<!--[\s\S]*?-->/g, '')
        .replace(/^#.*$/gm, '')
        .trim();

      if (stripped.length < MIN_CONTENT_LENGTH) {
        issues.push({
          rule: 'CONTENT_SUBSTANCE',
          severity: 'warning',
          message: `${file} has no substantive content`,
        });
      }
    } catch {
      // skip
    }
  }
  return issues;
}

// ---------------------------------------------------------------
// Main Evaluator
// ---------------------------------------------------------------

export function evaluateSpecDocHealth(specFolderPath: string): SpecDocHealthResult {
  const resolvedPath = path.resolve(specFolderPath);

  if (!fs.existsSync(resolvedPath) || !fs.statSync(resolvedPath).isDirectory()) {
    return {
      pass: false,
      score: 0,
      errors: 1,
      warnings: 0,
      level: null,
      perFile: [],
    };
  }

  const level = detectLevel(resolvedPath);
  const effectiveLevel = level ?? 1;

  // Run all checks
  const allIssues: SpecDocHealthIssue[] = [
    ...checkFileExists(resolvedPath, effectiveLevel),
    ...checkLevelDeclared(resolvedPath),
    ...checkFrontmatter(resolvedPath),
    ...checkTemplateSource(resolvedPath),
    ...checkAnchors(resolvedPath),
    ...checkFolderNaming(resolvedPath),
    ...checkContentSubstance(resolvedPath),
  ];

  const errors = allIssues.filter(i => i.severity === 'error').length;
  const warnings = allIssues.filter(i => i.severity === 'warning').length;

  // Build per-file results
  const fileIssueMap = new Map<string, string[]>();
  for (const issue of allIssues) {
    // Extract file name from message if present
    const fileMatch = issue.message.match(/in (\S+\.md)/);
    const fileName = fileMatch ? fileMatch[1] : issue.message.match(/Missing required file: (\S+)/)
      ? issue.message.match(/Missing required file: (\S+)/)![1]
      : 'folder';
    if (!fileIssueMap.has(fileName)) {
      fileIssueMap.set(fileName, []);
    }
    fileIssueMap.get(fileName)!.push(`[${issue.severity}] ${issue.rule}: ${issue.message}`);
  }

  const perFile: SpecDocFileResult[] = [];
  for (const [file, issues] of fileIssueMap) {
    const hasError = issues.some(i => i.startsWith('[error]'));
    perFile.push({ file, pass: !hasError, issues });
  }

  // Score: 1.0 = perfect, subtract per issue
  const totalChecks = 7; // number of check functions
  const errorWeight = 0.15;
  const warningWeight = 0.05;
  const rawScore = Math.max(0, 1 - (errors * errorWeight) - (warnings * warningWeight));
  const score = Math.round(rawScore * 100) / 100;

  return {
    pass: errors === 0,
    score,
    errors,
    warnings,
    level,
    perFile,
  };
}
