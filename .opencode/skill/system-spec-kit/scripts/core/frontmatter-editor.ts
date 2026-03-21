// ───────────────────────────────────────────────────────────────
// MODULE: Frontmatter Editor
// ───────────────────────────────────────────────────────────────
// Frontmatter injection and trigger phrase rendering utilities.
// Extracted from workflow.ts to reduce module size.

import * as path from 'node:path';
import type { SpecDocHealthResult } from '@spec-kit/shared/parsing/spec-doc-health';
import type { FileChange } from '../types/session-types';

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

    if (/^quality_score\s*:/i.test(trimmed)) {
      continue;
    }

    if (/^quality_flags\s*:/i.test(trimmed)) {
      skippingQualityFlags = true;
      continue;
    }

    strippedLines.push(line);
  }

  const qualityLines = [
    `quality_score: ${qualityScore.toFixed(2)}`,
    ...(qualityFlags.length > 0
      ? ['quality_flags:', ...qualityFlags.map((flag) => `  - ${JSON.stringify(flag)}`)]
      : ['quality_flags: []']),
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

export function ensureMinTriggerPhrases(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
  if (existing.length >= 2) {
    return existing;
  }

  const topicFromFolder = specFolderName.replace(/^\d{1,3}-/, '');
  const folderTokens = topicFromFolder
    .split(/[-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);
  const combined = [...new Set([...existing, ...folderTokens])];
  if (combined.length >= 2) {
    return combined;
  }

  if (combined.length === 1) {
    return [combined[0], topicFromFolder.replace(/-/g, ' ').toLowerCase() || 'session'];
  }

  return ['session', 'context'];
}

export function ensureMinSemanticTopics(existing: string[], enhancedFiles: FileChange[], specFolderName: string): string[] {
  if (existing.length >= 1) {
    return existing;
  }

  const topicFromFolder = specFolderName.replace(/^\d{1,3}-/, '');
  const folderTokens = topicFromFolder
    .split(/[-_]/)
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);

  const fileTokens = enhancedFiles
    .flatMap((file) => path.basename(file.FILE_PATH).replace(/\.[^.]+$/, '').split(/[-_]/))
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length >= 3);

  const combined = [...new Set([...folderTokens, ...fileTokens])];
  return combined.length > 0 ? [combined[0]] : ['session'];
}
