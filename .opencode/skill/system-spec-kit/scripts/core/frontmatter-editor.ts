// ───────────────────────────────────────────────────────────────
// MODULE: Frontmatter Editor
// ───────────────────────────────────────────────────────────────
// Frontmatter injection and trigger phrase rendering utilities.
// Extracted from workflow.ts to reduce module size.

import * as path from 'node:path';
import type { SpecDocHealthResult } from '@spec-kit/shared/parsing/spec-doc-health';
import { sanitizeTriggerPhrases } from '../lib/trigger-phrase-sanitizer';
import type { FileChange } from '../types/session-types';

// CG-04: Domain-specific stopwords — duplicated from workflow.ts to avoid circular imports
const FOLDER_STOPWORDS = new Set([
  'system', 'spec', 'kit', 'hybrid', 'rag', 'fusion', 'agents', 'alignment',
  'opencode', 'config', 'setup', 'init', 'core', 'main', 'base', 'common',
  'shared', 'utils', 'helpers', 'tools', 'scripts', 'tests', 'docs', 'build',
  'deploy', 'release', 'version', 'update', 'fix', 'feature', 'enhancement',
  'refactor', 'cleanup', 'migration', 'integration', 'implementation',
  'based', 'features', 'perfect', 'session', 'capturing', 'pipeline',
  'quality', 'command', 'skill', 'memory', 'context', 'search', 'index',
  'generation', 'epic', 'audit', 'enforcement', 'remediation',
]);

// ───────────────────────────────────────────────────────────────
// 1. FUNCTIONS
// ───────────────────────────────────────────────────────────────

export function injectQualityMetadata(content: string, qualityScore: number, qualityFlags: string[]): string {
  // F-21: Require `---` at string start for strict frontmatter detection
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch || frontmatterMatch.index === undefined) {
    return content;
  }

  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const frontmatterLines = frontmatterMatch[1].split(/\r?\n/);
  const strippedLines: string[] = [];
  let skippingQualityFlags = false;

  for (const line of frontmatterLines) {
    const trimmed = line.trimStart();
    if (skippingQualityFlags) {
      if (/^\s*-\s+/.test(line) || line.trim() === '') {
        continue;
      }
      skippingQualityFlags = false;
    }

    if (/^(?:quality_score|render_quality_score)\s*:/i.test(trimmed)) {
      continue;
    }

    if (/^(?:quality_flags|render_quality_flags)\s*:/i.test(trimmed)) {
      skippingQualityFlags = true;
      continue;
    }

    strippedLines.push(line);
  }

  const qualityLines = [
    `render_quality_score: ${qualityScore.toFixed(2)}`,
    ...(qualityFlags.length > 0
      ? ['render_quality_flags:', ...qualityFlags.map((flag) => `  - ${JSON.stringify(flag)}`)]
      : ['render_quality_flags: []']),
  ];
  const updatedFrontmatter = [
    '---',
    ...strippedLines,
    ...qualityLines,
    '---',
  ].join(newline);
  const prefix = content.slice(0, frontmatterMatch.index);
  const suffix = content.slice(frontmatterMatch.index + frontmatterMatch[0].length).replace(/^\r?\n/, '');
  return `${updatedFrontmatter}${newline}${prefix}${suffix}`;
}

export function injectSpecDocHealthMetadata(content: string, health: SpecDocHealthResult): string {
  const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!frontmatterMatch || frontmatterMatch.index === undefined) return content;

  const newline = content.includes('\r\n') ? '\r\n' : '\n';
  const lines = frontmatterMatch[1].split(/\r?\n/);

  // Remove existing spec_folder_health lines
  const filtered = lines.filter(l => !l.trimStart().startsWith('spec_folder_health'));
  const healthLine = `spec_folder_health: ${JSON.stringify({ pass: health.pass, score: health.score, errors: health.errors, warnings: health.warnings })}`;
  filtered.push(healthLine);

  const updated = ['---', ...filtered, '---'].join(newline);
  const prefix = content.slice(0, frontmatterMatch.index);
  const suffix = content.slice(frontmatterMatch.index + frontmatterMatch[0].length).replace(/^\r?\n/, '');
  return `${updated}${newline}${prefix}${suffix}`;
}

export function renderTriggerPhrasesYaml(triggerPhrases: string[]): string {
  if (!Array.isArray(triggerPhrases) || triggerPhrases.length === 0) {
    return 'trigger_phrases: []';
  }

  const escapedPhrases = triggerPhrases.map((phrase) => {
    const normalized = String(phrase).trim();
    return `  - "${normalized.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  });

  return ['trigger_phrases:', ...escapedPhrases].join('\n');
}

function normalizeSpecSegment(segment: string): string {
  return segment
    .replace(/^\d{1,3}-/, '')
    .replace(/[-_]+/g, ' ')
    .trim()
    .toLowerCase();
}

function buildLeafFolderAnchor(specFolderName: string): string {
  const segments = specFolderName
    .split(/[\\/]/)
    .map((segment) => normalizeSpecSegment(segment))
    .filter(Boolean);

  if (segments.length === 0) {
    return '';
  }

  const leafSegment = segments[segments.length - 1];
  const leafWords = leafSegment.split(/\s+/).filter(Boolean);
  if (leafWords.length !== 1) {
    return leafSegment;
  }

  const parentSegment = segments[segments.length - 2] || '';
  const parentLead = parentSegment
    .split(/\s+/)
    .find((token) => token.length >= 3 && !FOLDER_STOPWORDS.has(token));

  return parentLead ? `${leafSegment} ${parentLead}` : leafSegment;
}

export function ensureMinTriggerPhrases(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
  if (existing.length >= 2) {
    return existing;
  }

  const topicFromFolder = normalizeSpecSegment(path.basename(specFolderName));
  const folderTokens = topicFromFolder
    .split(/[-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3 && !FOLDER_STOPWORDS.has(token));
  const leafFolderAnchor = buildLeafFolderAnchor(specFolderName);
  const fallbackPhrases = sanitizeTriggerPhrases([
    ...folderTokens,
    leafFolderAnchor,
  ], { source: 'extracted' });
  const combined = [...new Set([...existing, ...fallbackPhrases])];
  if (combined.length >= 2) {
    return combined;
  }

  if (combined.length === 1) {
    const compoundFallback = sanitizeTriggerPhrases([leafFolderAnchor || topicFromFolder], { source: 'extracted' })[0];
    return [combined[0], compoundFallback && compoundFallback !== combined[0] ? compoundFallback : 'session'];
  }

  return ['session', 'context'];
}

export function ensureMinSemanticTopics(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
  if (existing.length >= 1) {
    return existing;
  }

  const topicFromFolder = normalizeSpecSegment(path.basename(specFolderName));
  const folderTokens = topicFromFolder
    .split(/[-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3 && !FOLDER_STOPWORDS.has(token));

  const fileTokens = enhancedFiles
    .flatMap((file) => path.basename(file.FILE_PATH).replace(/\.[^.]+$/, '').split(/[-_]/))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);

  const combined = [...new Set([...folderTokens, ...fileTokens])];
  return combined.length > 0 ? [combined[0]] : ['session'];
}
