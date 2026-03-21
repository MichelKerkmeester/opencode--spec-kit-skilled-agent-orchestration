// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Extractor
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. SPEC FOLDER EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts structured context from spec folder documents for captured-session enrichment

import fs from 'fs';
import path from 'path';

import { CONFIG } from '../config';
import { toCanonicalRelativePath } from '../utils/file-helpers';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

const SYNTHETIC_TIMESTAMP = new Date(0).toISOString();
const MAX_SPEC_OBSERVATIONS = 15;

export interface SpecFolderExtraction {
  observations: Array<{
    type: string;
    title: string;
    narrative: string;
    timestamp: string;
    facts: string[];
    files: string[];
    _provenance: 'spec-folder';
    _synthetic: true;
  }>;
  FILES: Array<{ FILE_PATH: string; DESCRIPTION: string; _provenance: 'spec-folder' }>;
  recentContext: Array<{ learning: string; request: string; files: string[] }>;
  summary: string;
  triggerPhrases: string[];
  decisions: Array<{ title: string; rationale: string; chosen: string; _provenance: 'spec-folder' }>;
  sessionPhase: string;
}

type Frontmatter = Record<string, string | string[]>;
type TaskStats = { checked: number; unchecked: number; percent: number } | null;
type ChecklistStats = { passed: number; total: number; p0: string; p1: string; p2: string } | null;

/* ───────────────────────────────────────────────────────────────
   2. UTILITY FUNCTIONS
------------------------------------------------------------------*/

function readDoc(specFolderPath: string, fileName: string): string | null {
  try {
    return fs.readFileSync(path.join(specFolderPath, fileName), 'utf8');
  } catch {
    return null;
  }
}

function parseFrontmatter(content: string | null): { data: Frontmatter; body: string } {
  if (!content) return { data: {}, body: '' };
  const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, body: content };
  const data: Frontmatter = {};
  let currentKey = '';
  for (const rawLine of match[1].split('\n')) {
    const line = rawLine.trimEnd();
    const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim().replace(/^['"]|['"]$/g, '');
      data[currentKey] = value || [];
      continue;
    }
    const item = line.match(/^\s*-\s+(.*)$/);
    if (item && currentKey) {
      if (typeof data[currentKey] === 'string') continue;
      const existing = Array.isArray(data[currentKey]) ? data[currentKey] as string[] : [];
      existing.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
      data[currentKey] = existing;
    }
  }
  return { data, body: content.slice(match[0].length) };
}

function extractFrontmatterListItems(content: string | null, keyName: string): string[] {
  if (!content) return [];

  const items: string[] = [];
  const blockPattern = /(?:^|\n)---\s*\n([\s\S]*?)\n---\s*(?=\n|$)/g;

  for (const match of content.matchAll(blockPattern)) {
    const lines = match[1].split('\n');
    let collecting = false;

    for (const rawLine of lines) {
      const line = rawLine.trimEnd();
      const isKeyLine = new RegExp(`^${keyName}:\\s*$`, 'i').test(line);

      if (isKeyLine) {
        collecting = true;
        continue;
      }

      if (!collecting) {
        continue;
      }

      const item = line.match(/^\s*-\s+(.*)$/);
      if (item) {
        items.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
        continue;
      }

      if (line.trim() === '') {
        continue;
      }

      collecting = false;
    }
  }

  return items;
}

function cleanText(text: string): string {
  return text
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getSection(content: string, headingPattern: RegExp): string {
  const lines = content.split('\n');
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start < 0) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n').trim();
}

function getSubsection(content: string, headingPattern: RegExp): string {
  const lines = content.split('\n');
  const start = lines.findIndex((line) => headingPattern.test(line));
  if (start < 0) return '';
  let end = lines.length;
  for (let i = start + 1; i < lines.length; i++) {
    if (/^###\s+/.test(lines[i]) || /^##\s+/.test(lines[i])) {
      end = i;
      break;
    }
  }
  return lines.slice(start + 1, end).join('\n').trim();
}

function normalizeFilePath(rawPath: string): string {
  const cleaned = rawPath.replace(/`/g, '').trim();
  if (!cleaned) return '';
  return toCanonicalRelativePath(cleaned, CONFIG.PROJECT_ROOT);
}

function dedupe<T>(items: T[]): T[] {
  return Array.from(new Set(items.filter(Boolean))) as T[];
}

/* ───────────────────────────────────────────────────────────────
   3. DOCUMENT PARSERS
------------------------------------------------------------------*/

function parseSpecDoc(content: string | null) {
  const { data, body } = parseFrontmatter(content);
  const files: SpecFolderExtraction['FILES'] = [];
  const observations: SpecFolderExtraction['observations'] = [];
  const triggerPhrases = dedupe([
    ...(Array.isArray(data.trigger_phrases) ? data.trigger_phrases : []),
    ...extractFrontmatterListItems(content, 'trigger_phrases'),
  ].map(cleanText));
  const summary = cleanText(
    [
      data.description,
      getSection(body, /^##\s+\d+\.\s+PROBLEM(?: AND PURPOSE)?/i),
    ].filter(Boolean).join(' ')
  );
  const filesTable = getSubsection(body, /^###\s+Files to Change/i);
  const fileMatches = filesTable.matchAll(/\|\s*`?([^`|\n]+?)`?\s*\|\s*[^|\n]*\|\s*([^|\n]+?)\s*\|/g);
  for (const [, rawPath, rawDescription] of fileMatches) {
    if (/file path|---/i.test(rawPath)) continue;
    const filePath = normalizeFilePath(rawPath);
    if (filePath) files.push({ FILE_PATH: filePath, DESCRIPTION: cleanText(rawDescription), _provenance: 'spec-folder' });
  }
  const requirements = getSection(body, /^##\s+\d+\.\s+REQUIREMENTS/i);
  for (const [, id, requirement, criteria] of requirements.matchAll(/\|\s*(REQ-[^|\s]+)\s*\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|/g)) {
    observations.push({
      type: 'requirement',
      title: `${id}: ${cleanText(requirement)}`,
      narrative: cleanText(criteria),
      timestamp: SYNTHETIC_TIMESTAMP,
      facts: [cleanText(requirement), cleanText(criteria)].filter(Boolean),
      files: [],
      _provenance: 'spec-folder',
      _synthetic: true,
    });
  }
  return { summary, triggerPhrases, files, observations };
}

function parsePlanDoc(content: string | null) {
  const { body } = parseFrontmatter(content);
  const summary = cleanText(getSection(body, /^##\s+\d+\.\s+SUMMARY/i));
  const phases = getSection(body, /^##\s+\d+\.\s+IMPLEMENTATION PHASES/i);
  const phaseTitle = phases.match(/^###\s+([^\n]+)/m)?.[1]?.trim() || '';
  const nextActions = Array.from(
    phases.matchAll(/^- (?:\[\s\]\s+)?(.+)$/gm)
  ).map((match) => cleanText(match[1])).filter(Boolean).slice(0, 3);
  return { summary, phaseTitle, nextActions };
}

function parseTasksDoc(content: string | null): TaskStats {
  if (!content) return null;
  const checked = (content.match(/\[x\]/gi) || []).length;
  const unchecked = (content.match(/\[ \]/g) || []).length;
  const total = checked + unchecked;
  return { checked, unchecked, percent: total ? Math.round((checked / total) * 100) : 0 };
}

function parseChecklistDoc(content: string | null): ChecklistStats {
  if (!content) return null;
  const stat = (label: string) => {
    const section = getSection(content, new RegExp(`^##\\s+${label}\\b`, 'i'));
    const passed = (section.match(/^- \[x\]/gim) || []).length;
    const total = (section.match(/^- \[(?:x| )\]/gim) || []).length;
    return `${passed}/${total || 0}`;
  };
  const passed = (content.match(/^- \[x\]/gim) || []).length;
  const total = (content.match(/^- \[(?:x| )\]/gim) || []).length;
  return { passed, total, p0: stat('P0'), p1: stat('P1'), p2: stat('P2') };
}

function parseDecisionDoc(content: string | null): SpecFolderExtraction['decisions'] {
  if (!content) return [];
  const extractLabeledBlock = (section: string, label: 'Context' | 'Decision'): string => {
    const headingMatch = section.match(new RegExp(`###\\s+${label}([\\s\\S]*?)(?:\\n###\\s+|\\n##\\s+|$)`, 'i'))?.[1] || '';
    if (headingMatch.trim()) return headingMatch;
    if (label === 'Context') {
      // Match both **Context:** and **Context**: (colon inside or outside bold)
      return section.match(/\*\*Context(?::\*\*|\*\*:)\s*([\s\S]*?)(?:\*\*Decision(?::\*\*|\*\*:)|\n##\s+|$)/i)?.[1] || '';
    }
    // Match both **Decision:** and **Decision**: (colon inside or outside bold)
    return section.match(/\*\*Decision(?::\*\*|\*\*:)\s*([\s\S]*?)(?:\*\*(?:Rationale|Alternatives(?:\s+Considered|\s+Rejected)?|Consequences|Notes?|Tradeoffs?|Chosen|We chose)[^*]*(?:\*\*:?|:\*\*)|\n##\s+|$)/i)?.[1] || '';
  };

  const extractChosen = (decisionBlock: string): string => {
    // Match both **We chose:** / **Chosen:** and **We chose**: / **Chosen**: (colon inside or outside bold)
    const explicitChosen = decisionBlock.match(/\*\*(?:We chose|Chosen)(?::\*\*|\*\*:)\s*([^\n]+)/i)?.[1] || '';
    if (explicitChosen.trim()) return cleanText(explicitChosen);

    const firstSentence = decisionBlock
      .replace(/^\*\*Decision(?::\*\*|\*\*:)\s*/i, '')
      .trim()
      .match(/(.+?[.!?])(?:\s|$)/)?.[1]
      || decisionBlock.replace(/^\*\*Decision(?::\*\*|\*\*:)\s*/i, '').trim().split('\n')[0] || '';

    return cleanText(firstSentence);
  };

  const sections = content.split(/^##\s+/m).slice(1);
  return sections.map((section) => {
    const title = cleanText(section.split('\n')[0] || 'Decision');
    const rationale = cleanText(extractLabeledBlock(section, 'Context'));
    const decisionBlock = extractLabeledBlock(section, 'Decision');
    const chosen = extractChosen(decisionBlock);
    return title && chosen ? { title, rationale, chosen, _provenance: 'spec-folder' as const } : null;
  }).filter((entry): entry is SpecFolderExtraction['decisions'][number] => Boolean(entry));
}

/* ───────────────────────────────────────────────────────────────
   4. SESSION PHASE DETECTION
------------------------------------------------------------------*/

function determineSessionPhase(taskStats: TaskStats, checklistStats: ChecklistStats, planPhase: string, status: string): string {
  if (/complete|done|closed/i.test(status)) return 'complete';
  if (taskStats?.percent === 100 && (!checklistStats || checklistStats.passed === checklistStats.total)) return 'complete';
  if ((checklistStats && checklistStats.total > 0 && checklistStats.passed < checklistStats.total) || taskStats?.percent === 100) return 'testing';
  if (taskStats && taskStats.percent >= 25) return 'implementing';
  if (planPhase) return 'implementing';
  return 'planning';
}

/* ───────────────────────────────────────────────────────────────
   5. SPEC FOLDER EXTRACTION
------------------------------------------------------------------*/

export async function extractSpecFolderContext(specFolderPath: string): Promise<SpecFolderExtraction> {
  const descriptionRaw = readDoc(specFolderPath, 'description.json');
  let description: Record<string, unknown> = {};
  if (descriptionRaw) {
    try {
      description = JSON.parse(descriptionRaw) as Record<string, unknown>;
    } catch {
      description = {};
    }
  }
  const spec = parseSpecDoc(readDoc(specFolderPath, 'spec.md'));
  const plan = parsePlanDoc(readDoc(specFolderPath, 'plan.md'));
  const tasks = parseTasksDoc(readDoc(specFolderPath, 'tasks.md'));
  const checklist = parseChecklistDoc(readDoc(specFolderPath, 'checklist.md'));
  const decisions = parseDecisionDoc(readDoc(specFolderPath, 'decision-record.md'));

  const summary = cleanText([
    String(description.title || description.name || ''),
    String(description.description || ''),
    spec.summary,
    plan.summary,
  ].filter(Boolean).join(' ')).slice(0, CONFIG.MAX_CONTENT_PREVIEW);

  const observations: SpecFolderExtraction['observations'] = [
    ...((description.id || description.title || description.status) ? [{
      type: 'metadata',
      title: 'Spec folder metadata',
      narrative: cleanText([
        `Spec ${String(description.id || description.name || '')}`,
        String(description.title || ''),
        `status ${String(description.status || 'unknown')}`,
        `level ${String(description.level || 'unknown')}`,
        String(description.parent ? `parent ${description.parent}` : ''),
      ].filter(Boolean).join(', ')),
      timestamp: SYNTHETIC_TIMESTAMP,
      facts: [
        `id=${String(description.id || '')}`,
        `name=${String(description.name || '')}`,
        `title=${String(description.title || '')}`,
        `status=${String(description.status || '')}`,
        `level=${String(description.level || '')}`,
        `parent=${String(description.parent || '')}`,
      ].filter((fact) => !fact.endsWith('=')),
      files: [],
      _provenance: 'spec-folder' as const,
      _synthetic: true as const,
    }] : []),
    ...spec.observations,
    ...(tasks ? [{
      type: 'progress',
      title: 'Task completion status',
      narrative: `Tasks complete: ${tasks.checked}/${tasks.checked + tasks.unchecked || 0} (${tasks.percent}%).`,
      timestamp: SYNTHETIC_TIMESTAMP,
      facts: [`checked=${tasks.checked}`, `unchecked=${tasks.unchecked}`, `completion=${tasks.percent}%`],
      files: [],
      _provenance: 'spec-folder' as const,
      _synthetic: true as const,
    }] : []),
    ...(checklist ? [{
      type: 'verification',
      title: 'Checklist verification status',
      narrative: `Checklist progress P0 ${checklist.p0}, P1 ${checklist.p1}, P2 ${checklist.p2}.`,
      timestamp: SYNTHETIC_TIMESTAMP,
      facts: [`passed=${checklist.passed}`, `total=${checklist.total}`],
      files: [],
      _provenance: 'spec-folder' as const,
      _synthetic: true as const,
    }] : []),
  ];
  const structuralTypes = ['progress', 'checklist', 'phase', 'status'];
  observations.sort((a, b) => {
    const aStructural = structuralTypes.some((t) => a.type?.toLowerCase().includes(t)) ? 0 : 1;
    const bStructural = structuralTypes.some((t) => b.type?.toLowerCase().includes(t)) ? 0 : 1;
    return aStructural - bStructural;
  });
  const cappedObservations = observations.slice(0, MAX_SPEC_OBSERVATIONS);

  return {
    observations: cappedObservations,
    FILES: [...new Map(spec.files.map((f) => [f.FILE_PATH, f])).values()],
    recentContext: summary ? [{
      learning: plan.summary || summary,
      request: cleanText([plan.phaseTitle, ...plan.nextActions].filter(Boolean).join(' | ')) || 'Review spec folder context',
      files: spec.files.map((file) => file.FILE_PATH).slice(0, CONFIG.MAX_FILES_IN_MEMORY),
    }] : [],
    summary,
    triggerPhrases: dedupe([
      ...spec.triggerPhrases,
      ...((Array.isArray(description.triggerPhrases) ? description.triggerPhrases : []) as unknown[]).filter((t): t is string => typeof t === 'string').map(cleanText),
    ]).slice(0, 12),
    decisions,
    sessionPhase: determineSessionPhase(tasks, checklist, plan.phaseTitle, String(description.status || '')),
  };
}
