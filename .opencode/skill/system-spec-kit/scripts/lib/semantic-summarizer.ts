// ---------------------------------------------------------------
// MODULE: Semantic Summarizer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SEMANTIC SUMMARIZER
// ───────────────────────────────────────────────────────────────
// Node stdlib
import os from 'os';

// Internal modules
import { SemanticSignalExtractor } from './semantic-signal-extractor';
import { cleanDescription } from '../utils/file-helpers';
import { CONFIG } from '../core';
import type { WeightedDocumentSections } from '@spec-kit/shared/index';

// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Message type classification labels */
export type MessageType = 'intent' | 'plan' | 'implementation' | 'result' | 'decision' | 'question' | 'context';

/** Message-like record for semantic analysis */
export interface SemanticMessage {
  prompt?: string;
  content?: string;
  CONTENT?: string;
  timestamp?: string;
  toolCalls?: Array<Record<string, unknown>>;
  _semanticType?: MessageType;
  [key: string]: unknown;
}

/** Observation record with file references */
export interface SemanticObservation {
  files?: string[];
  narrative?: string;
  [key: string]: unknown;
}

/** File change information */
export interface FileChangeInfo {
  action: string;
  description: string;
  changes: unknown[];
  mentions: number;
}

/** Extracted decision record */
export interface ExtractedDecision {
  question: string;
  choice: string;
  context: string;
}

/** File entry in the summary */
export interface SummaryFileEntry {
  path: string;
  description: string;
}

/** Message statistics breakdown */
export interface MessageStats {
  intent: number;
  plan: number;
  implementation: number;
  result: number;
  decision: number;
  total: number;
}

/** Summary options for controlling generation */
export interface SummaryOptions {
  maxFiles?: number;
  maxDecisions?: number;
  maxOutcomes?: number;
  includeStats?: boolean;
}

/** Implementation summary result */
export interface ImplementationSummary {
  task: string;
  solution: string;
  filesCreated: SummaryFileEntry[];
  filesModified: SummaryFileEntry[];
  decisions: ExtractedDecision[];
  outcomes: string[];
  triggerPhrases: string[];
  messageStats: MessageStats;
}

interface MarkdownSectionMatch {
  content: string;
  start: number;
  end: number;
}

// ───────────────────────────────────────────────────────────────
// 3. CONSTANTS
// ───────────────────────────────────────────────────────────────
const MESSAGE_TYPES: Record<string, MessageType> = {
  INTENT: 'intent',
  PLAN: 'plan',
  IMPLEMENTATION: 'implementation',
  RESULT: 'result',
  DECISION: 'decision',
  QUESTION: 'question',
  CONTEXT: 'context',
};

// Classification patterns - order matters: specific first, generic last
const CLASSIFICATION_PATTERNS = {
  [MESSAGE_TYPES.DECISION]: [
    /(?:Selected:|Chose:|user chose|user selected|decision made|user decision)/i,
    /^(?:Option\s+)?[A-D](?:\)|:|\s*[-\u2013])/i,
    /(?:selected option|picked option|chose option)/i,
  ],
  [MESSAGE_TYPES.IMPLEMENTATION]: [
    /(?:^Created|^Modified|^Edited|^Wrote|^Added|^Removed|^Changed|^Fixed)\s+[`"']?[\w./-]+/i,
    /(?:Edit|Write)\s*\([^)]*file_path/i,
    /(?:\.js|\.ts|\.md|\.json|\.sh|\.css|\.py)\s*(?:file|module|script)?/i,
    /(?:function|class|const|let|var|export|import)\s+\w+/i,
  ],
  [MESSAGE_TYPES.RESULT]: [
    /(?:complete[d!]?|done[!]?|finished|success)/i,
    /(?:tests? pass|all tests|verified|confirmed)/i,
    /(?:## Implementation Complete|## Summary|## Results|\u2705|\u2713)/i,
    /^(?:It works|Working|Fixed|Resolved)/i,
  ],
  [MESSAGE_TYPES.PLAN]: [
    /(?:^I'll|^Let me|^First,|^Then,|^Next,|^Finally,)/i,
    /(?:plan|approach|strategy|steps to|phases)/i,
    /(?:todo|task list|checklist)/i,
    /(?:^#+\s*Plan|Implementation Plan|will need to)/i,
  ],
  [MESSAGE_TYPES.INTENT]: [
    /^(?:I want|I need|Please|Help me|I'd like|Analyze|Implement|Create|Fix|Improve)/i,
    /^(?:Can you|Could you|Would you)\s+(?:help|implement|create|add|build|fix)/i,
  ],
  [MESSAGE_TYPES.QUESTION]: [
    /^(?:Which|What|How|Where|When|Why|Should|Is|Are|Does|Do).+\?$/i,
  ],
  [MESSAGE_TYPES.CONTEXT]: [],
};

const DESC_MIN_LENGTH: number = 10;
const DESC_MAX_LENGTH: number = 100;
const FRONTMATTER_RE: RegExp = /^---[\s\S]*?\n---\s*\n?/;

// ───────────────────────────────────────────────────────────────
// 4. MESSAGE CLASSIFICATION
// ───────────────────────────────────────────────────────────────
function classifyMessage(content: string): MessageType {
  if (!content || typeof content !== 'string') {
    return MESSAGE_TYPES.CONTEXT;
  }

  const normalized: string = content.trim();

  for (const [type, patterns] of Object.entries(CLASSIFICATION_PATTERNS)) {
    for (const pattern of patterns) {
      if (pattern.test(normalized)) {
        return type as MessageType;
      }
    }
  }

  return MESSAGE_TYPES.CONTEXT;
}

function classifyMessages(messages: SemanticMessage[]): Map<MessageType, SemanticMessage[]> {
  const classified: Map<MessageType, SemanticMessage[]> = new Map();

  for (const type of Object.values(MESSAGE_TYPES)) {
    classified.set(type, []);
  }

  for (const msg of messages) {
    const content: string = msg.prompt || msg.content || msg.CONTENT || '';
    const type: MessageType = classifyMessage(content);
    const bucket = classified.get(type);
    if (bucket) bucket.push({
      ...msg,
      _semanticType: type,
    });
  }

  return classified;
}

// ───────────────────────────────────────────────────────────────
// 5. FILE CHANGE EXTRACTION
// ───────────────────────────────────────────────────────────────
function findFilePosition(content: string, filePath: string, searchFrom: number = 0): number {
  const searchContent: string = content.substring(searchFrom);
  const index: number = searchContent.indexOf(filePath);
  return index === -1 ? -1 : searchFrom + index;
}

function extractFileChanges(messages: SemanticMessage[], observations: SemanticObservation[] = []): Map<string, FileChangeInfo> {
  const fileChanges: Map<string, FileChangeInfo> = new Map();

  const filePatterns: Record<string, RegExp> = {
    created: /(?:created?|wrote?|new file|Write\()/i,
    modified: /(?:modified|edited|changed|updated|Edit\()/i,
    deleted: /(?:deleted|removed|rm\s)/i,
    renamed: /(?:renamed|moved|mv\s)/i,
    read: /(?:read|Read\()/i,
  };

  const extractFilePaths = (text: string): string[] => {
    const paths: string[] = [];

    const quotedPaths: RegExpMatchArray | null = text.match(/["'`]([^"'`]+\.[a-zA-Z]{1,10})["'`]/g);
    if (quotedPaths) {
      paths.push(...quotedPaths.map((p: string) => p.replace(/["'`]/g, '')));
    }

    const extensionPaths: RegExpMatchArray | null = text.match(/(?:^|[\s(])([./\w-]+\.(?:js|ts|jsx|tsx|json|jsonc|md|sh|css|html|py|yaml|yml))/gi);
    if (extensionPaths) {
      paths.push(...extensionPaths.map((p: string) => p.trim().replace(/^[(]/, '')));
    }

    return [...new Set(paths)];
  };

  for (const msg of messages) {
    const content: string = msg.prompt || msg.content || msg.CONTENT || '';
    const type: MessageType = classifyMessage(content);

    if (type === MESSAGE_TYPES.IMPLEMENTATION || type === MESSAGE_TYPES.RESULT || extractFilePaths(content).length > 0) {
      const paths: string[] = extractFilePaths(content);
      let lastSearchPosition: number = 0;

      for (const filePath of paths) {
        let action: string = 'modified';
        for (const [action_type, pattern] of Object.entries(filePatterns)) {
          if (pattern.test(content)) {
            action = action_type;
            break;
          }
        }

        if (action === 'read' && !content.match(/(?:renamed|\bmoved\b|mv\s)/i)) continue;

        const fileIndex: number = findFilePosition(content, filePath, lastSearchPosition);

        if (fileIndex === -1) {
          const fallbackIndex: number = content.indexOf(filePath);
          if (fallbackIndex === -1) continue;
          const contextStart: number = Math.max(0, fallbackIndex - 100);
          const contextEnd: number = Math.min(content.length, fallbackIndex + filePath.length + 200);
          const context: string = content.substring(contextStart, contextEnd);
          const description: string = extractChangeDescription(context, filePath);

          if (!fileChanges.has(filePath)) {
            fileChanges.set(filePath, { action, description, changes: [], mentions: 1 });
          }
          continue;
        }

        lastSearchPosition = fileIndex + filePath.length;

        const contextStart: number = Math.max(0, fileIndex - 100);
        const contextEnd: number = Math.min(content.length, fileIndex + filePath.length + 200);
        const context: string = content.substring(contextStart, contextEnd);

        const description: string = extractChangeDescription(context, filePath);

        if (!fileChanges.has(filePath)) {
          fileChanges.set(filePath, {
            action,
            description,
            changes: [],
            mentions: 1,
          });
        } else {
          const existing = fileChanges.get(filePath);
          if (existing) {
            existing.mentions++;
            if (description.length > existing.description.length) {
              existing.description = description;
            }
            if (action === 'created' && existing.action !== 'created') {
              existing.action = action;
            }
          }
        }
      }
    }
  }

  for (const obs of observations) {
    if (obs.files && Array.isArray(obs.files)) {
      const narrative: string = obs.narrative || '';

      for (const file of obs.files) {
        if (!fileChanges.has(file)) {
          const description: string = extractChangeDescription(narrative, file);
          fileChanges.set(file, {
            action: 'modified',
            description: description,
            changes: [],
            mentions: 1,
          });
        }
      }
    }
  }

  return fileChanges;
}

// ───────────────────────────────────────────────────────────────
// 6. DESCRIPTION UTILITIES
// ───────────────────────────────────────────────────────────────
// CleanDescription is imported from '../utils/file-helpers' (canonical location)

// NOTE: Similar to utils/file-helpers.ts:isDescriptionValid but differs in garbage patterns.
// This version has 3 additional patterns (/^changed?$/i, /^no description available$/i, /^modified?$/i)
// Specifically needed for semantic extraction where these edge cases arise more frequently.
function isDescriptionValid(description: string): boolean {
  if (!description || description.length < 8) return false;

  const garbagePatterns: readonly RegExp[] = [
    /^#+\s/,
    /^[-*]\s/,
    /\s(?:and|or|to|the)\s*$/i,
    /^(?:modified?|updated?)\s+\w+$/i,
    /^filtering\s+(?:pipeline|system)$/i,
    /^And\s+[`'"]?/i,
    /^modified? during session$/i,
    /^changed?$/i,
    /^no description available$/i,
    /^modified?$/i,
    /\[PLACEHOLDER\]/i,
  ] as const;

  return !garbagePatterns.some((p: RegExp) => p.test(description));
}

/** Caps context at 500 chars to prevent regex backtracking */
function extractChangeDescription(context: string, filePath: string): string {
  const safeContext: string = context.substring(0, CONFIG.MAX_CONTENT_PREVIEW);

  const filename: string = filePath.replace(/\\/g, '/').split('/').pop() || '';
  const filenameNoExt: string = filename.replace(/\.[^.]+$/, '');
  const escapedFilename: string = filenameNoExt.replace(/[-.*+?^${}()|[\]\\]/g, '\\$&');

  const fileSpecificPatterns: RegExp[] = [
    new RegExp(`(?:updated?|modified?|changed?|fixed?|edited?)\\s+(?:the\\s+)?['"\`]?${escapedFilename}(?:\\.\\w+)?['"\`]?\\s+(?:to\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
    new RegExp(`${escapedFilename}(?:\\.\\w+)?\\s*[:\\-\u2013\u2014]\\s*(.{15,100}?)(?:\\s*[.!,\\n]|$)`, 'i'),
    new RegExp(`(?:in|for|to)\\s+['"\`]?${escapedFilename}(?:\\.\\w+)?['"\`]?[,:]?\\s+(?:we\\s+)?(.{15,100}?)(?:\\s*[.!,]|$)`, 'i'),
    new RegExp(`(?:added?|implemented?|created?)\\s+(.{15,80}?)\\s+(?:to|in|for)\\s+['"\`]?${escapedFilename}`, 'i'),
    new RegExp(`(?:the\\s+)?${escapedFilename}(?:\\.\\w+)?\\s+(?:now\\s+)?(?:handles?|provides?|implements?|contains?)\\s+(.{15,80}?)(?:\\s*[.!,]|$)`, 'i'),
    new RegExp(`['"\`]?${escapedFilename}['"\`]?\\s+(?:now\\s+)?(?:supports?|includes?)\\s+(.{10,80})`, 'i'),
    new RegExp(`modified\\s+['"\`]?${escapedFilename}['"\`]?,\\s+(?:adding|removing|implementing)\\s+(.{10,80})`, 'i'),
  ];

  for (const pattern of fileSpecificPatterns) {
    const match: RegExpMatchArray | null = safeContext.match(pattern);
    if (match && match[1]) {
      let desc: string = match[1].trim();
      if (desc.includes(filePath) || desc.toLowerCase().includes(filenameNoExt.toLowerCase())) continue;
      desc = cleanDescription(desc);
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && isDescriptionValid(desc)) {
        return desc;
      }
    }
  }

  const withPatterns: RegExp[] = [
    /with\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    /to\s+(?:add|apply|integrate|include|remove|fix|enhance|validate)\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    /for\s+(.{10,80}?)(?:\s*[.!,]|$)/i,
    /replaced\s+(.{5,40})\s+with\s+(.{5,40})/i,
  ];

  for (const pattern of withPatterns) {
    const match: RegExpMatchArray | null = safeContext.match(pattern);
    if (match && match[1]) {
      let desc: string = match[1].trim();
      if (match[2]) {
        desc = `Replaced ${match[1].trim()} with ${match[2].trim()}`;
      }
      if (desc.includes(filePath) || desc.includes(filename)) continue;
      desc = cleanDescription(desc);
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH && !/^(the|a|an)\s/i.test(desc)) {
        return desc;
      }
    }
  }

  const actionPatterns: RegExp[] = [
    /(\d+-stage\s+\w+\s+pipeline)/i,
    /((?:filtering|content|semantic|noise|validation|processing|analysis|transformation)\s+(?:module|pipeline|system|logic))/i,
    /(configurable\s+.{5,30}\s+(?:settings|config|options|behavior))/i,
    /:\s*(.{10,60}?)(?:\s*[.!,\n]|$)/,
  ];

  for (const pattern of actionPatterns) {
    const match: RegExpMatchArray | null = safeContext.match(pattern);
    if (match && match[1]) {
      let desc: string = match[1].trim();
      if (desc.includes(filePath) || desc.includes(filename)) continue;
      desc = cleanDescription(desc);
      if (desc.length >= DESC_MIN_LENGTH && desc.length <= DESC_MAX_LENGTH) {
        return desc;
      }
    }
  }

  const humanReadable: string = filenameNoExt
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .toLowerCase();

  return `Updated ${humanReadable}`;
}

// ───────────────────────────────────────────────────────────────
// 7. DECISION EXTRACTION
// ───────────────────────────────────────────────────────────────
function extractDecisions(messages: SemanticMessage[]): ExtractedDecision[] {
  const decisions: ExtractedDecision[] = [];

  for (let i = 0; i < messages.length; i++) {
    const msg: SemanticMessage = messages[i];
    const content: string = msg.prompt || msg.content || msg.CONTENT || '';
    const type: MessageType = classifyMessage(content);

    if (type === MESSAGE_TYPES.DECISION) {
      let question: string = '';
      if (i > 0) {
        const prevContent: string = messages[i - 1].prompt || messages[i - 1].content || '';
        const questionMatch: RegExpMatchArray | null = prevContent.match(/([^.!?]+\?)/);
        if (questionMatch) {
          question = questionMatch[1].trim();
        }
      }

      const choicePatterns: RegExp[] = [
        /(?:chose|selected|picked)\s*[:"']?\s*([A-D](?:\)|:|\s)|.{5,50})/i,
        /^(?:Option\s+)?([A-D])(?:\)|:|\s)/i,
        /^([A-D])\s*[-\u2013]\s*(.+)/i,
      ];

      for (const pattern of choicePatterns) {
        const match: RegExpMatchArray | null = content.match(pattern);
        if (match) {
          decisions.push({
            question: question || 'User decision',
            choice: match[1]?.trim() || content.substring(0, 50),
            context: content.substring(0, 100),
          });
          break;
        }
      }
    }
  }

  return decisions;
}

// ───────────────────────────────────────────────────────────────
// 8. IMPLEMENTATION SUMMARY GENERATION
// ───────────────────────────────────────────────────────────────
function generateImplementationSummary(messages: SemanticMessage[], observations: SemanticObservation[] = []): ImplementationSummary {
  const classified: Map<MessageType, SemanticMessage[]> = classifyMessages(messages);
  const fileChanges: Map<string, FileChangeInfo> = extractFileChanges(messages, observations);
  const decisions: ExtractedDecision[] = extractDecisions(messages);

  const intentMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.INTENT) ?? [];
  const questionMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.QUESTION) ?? [];

  let task: string = 'Development session';

  if (intentMessages.length > 0) {
    const firstIntent: string = intentMessages[0].prompt || intentMessages[0].content || '';
    const taskPatterns: RegExp[] = [
      /^(?:I want to|I need to|Please|Help me)\s+(.{15,120}?)(?:[.!?\n]|$)/i,
      /(?:implement|create|add|build|fix|improve)\s+(.{10,100}?)(?:[.!?\n]|$)/i,
      /^(.{20,120}?)(?:[.!?\n]|$)/,
    ];

    for (const pattern of taskPatterns) {
      const match: RegExpMatchArray | null = firstIntent.match(pattern);
      if (match && match[1]) {
        task = match[1].trim().replace(/[.,;:]+$/, '');
        task = task.charAt(0).toUpperCase() + task.slice(1);
        break;
      }
    }
  }

  if (task === 'Development session' && questionMessages.length > 0) {
    const firstQuestion: string = questionMessages[0].prompt || questionMessages[0].content || '';
    if (firstQuestion.length > 20) {
      task = firstQuestion.substring(0, 100).replace(/\?.*$/, '').trim();
    }
  }

  const planMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.PLAN) ?? [];
  const implMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.IMPLEMENTATION) ?? [];
  const resultMessages: SemanticMessage[] = classified.get(MESSAGE_TYPES.RESULT) ?? [];

  let solution: string = 'Implementation and updates';
  const allPlanImpl: SemanticMessage[] = [...planMessages, ...implMessages, ...resultMessages];

  if (allPlanImpl.length > 0) {
    for (const msg of allPlanImpl) {
      const content: string = msg.prompt || msg.content || '';
      const solutionPatterns: RegExp[] = [
        /(?:create|implement|build)\s+(?:a\s+)?(.{15,80}?(?:pipeline|system|module|filter))/i,
        /with\s+(.{15,80}?(?:filtering|detection|processing|validation))/i,
        /(\d+-stage\s+.{10,50}?(?:pipeline|system|process))/i,
        /(?:solution|approach):\s*(.{15,100})/i,
        /(?:implement|create|add|build|fix)\s+(.{15,80}?)(?:\s+(?:to|for|that|in)|[.!]|$)/i,
        /(?:by\s+)?(?:adding|creating|implementing|fixing)\s+(.{15,80}?)(?:[.!]|$)/i,
        /(?:implemented?|added?|created?)\s+(.{15,80}?(?:for|to|that))/i,
        /^(.{20,100}?)(?:\s+(?:to|for|by)|[.!?\n])/i,
      ];

      for (const pattern of solutionPatterns) {
        const match: RegExpMatchArray | null = content.match(pattern);
        if (match && match[1]) {
          let extracted: string = match[1].trim().replace(/[.,;:]+$/, '');
          if (extracted.length >= 15 && !/^(a|the|some)\s/i.test(extracted)) {
            solution = extracted.charAt(0).toUpperCase() + extracted.slice(1);
            break;
          }
        }
      }
      if (solution !== 'Implementation and updates') break;
    }
  }

  const filesCreated: SummaryFileEntry[] = [];
  const filesModified: SummaryFileEntry[] = [];

  for (const [filePath, info] of fileChanges) {
    const entry: SummaryFileEntry = {
      path: filePath.replace(new RegExp(`^${os.homedir().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}/[^/]+/`), ''),
      description: info.description,
    };

    if (info.action === 'created') {
      filesCreated.push(entry);
    } else {
      filesModified.push(entry);
    }
  }

  const outcomes: string[] = [];
  const trimOutcomeToWordBoundary = (outcome: string, maxLength: number = 80): string => {
    const trimmed = outcome.trim();
    if (trimmed.length < maxLength) {
      return trimmed;
    }

    const lastSpace = trimmed.lastIndexOf(' ');
    return lastSpace > 0 ? trimmed.slice(0, lastSpace).trim() : trimmed;
  };

  for (const msg of resultMessages.slice(0, 5)) {
    const content: string = msg.prompt || msg.content || '';
    const outcomePatterns: RegExp[] = [
      /[-\u2022]\s*(.{15,80})/g,
      /(?:completed?|finished|implemented|working):\s*(.{15,80})/gi,
      /\u2713\s*(.{15,80})/g,
    ];

    for (const pattern of outcomePatterns) {
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(content)) !== null) {
        const outcome: string = trimOutcomeToWordBoundary(match[1]);
        if (outcome.length > 10 && !outcomes.includes(outcome)) {
          outcomes.push(outcome);
          if (outcomes.length >= 5) break;
        }
      }
      if (outcomes.length >= 5) break;
    }
  }

  const allContent: string = messages
    .map((m: SemanticMessage) => m.prompt || m.content || '')
    .join('\n\n');
  const triggerPhrases: string[] = SemanticSignalExtractor.extract({
    text: allContent,
    mode: 'summary',
    stopwordProfile: 'balanced',
    ngramDepth: 3,
  }).phrases;

  return {
    task,
    solution,
    filesCreated: filesCreated,
    filesModified: filesModified,
    decisions: decisions.slice(0, 5),
    outcomes: outcomes.length > 0 ? outcomes : ['Session completed'],
    triggerPhrases: triggerPhrases,
    messageStats: {
      intent: intentMessages.length,
      plan: planMessages.length,
      implementation: implMessages.length,
      result: resultMessages.length,
      decision: decisions.length,
      total: messages.length,
    },
  };
}

function formatSummaryAsMarkdown(summary: ImplementationSummary): string {
  const lines: string[] = [];

  lines.push('## Implementation Summary\n');
  lines.push(`**Task:** ${summary.task}\n`);
  lines.push(`**Solution:** ${summary.solution}\n`);

  if (summary.filesCreated.length > 0) {
    lines.push('\n### Files Created');
    for (const file of summary.filesCreated) {
      lines.push(`- \`${file.path}\` - ${file.description}`);
    }
  }

  if (summary.filesModified.length > 0) {
    lines.push('\n### Files Modified');
    for (const file of summary.filesModified) {
      lines.push(`- \`${file.path}\` - ${file.description}`);
    }
  }

  if (summary.decisions.length > 0) {
    lines.push('\n### User Decisions');
    for (const decision of summary.decisions) {
      lines.push(`- **${decision.question}**: ${decision.choice}`);
    }
  }

  if (summary.outcomes.length > 0 && summary.outcomes[0] !== 'Session completed') {
    lines.push('\n### Key Outcomes');
    for (const outcome of summary.outcomes) {
      lines.push(`- ${outcome}`);
    }
  }

  if (summary.triggerPhrases && summary.triggerPhrases.length > 0) {
    lines.push('\n### Trigger Phrases');
    lines.push(`\`${summary.triggerPhrases.join('`, `')}\``);
  }

  return lines.join('\n');
}

function stripFrontmatter(markdown: string): string {
  return markdown.replace(FRONTMATTER_RE, '');
}

function normalizeHeadingLabel(heading: string): string {
  return heading
    .replace(/^\d+\.\s*/, '')
    .trim()
    .toLowerCase();
}

function extractMarkdownTitle(markdown: string): string {
  const titleMatch = markdown.match(/^#\s+(.+)$/m);
  return titleMatch ? titleMatch[1].trim() : '';
}

function extractMarkdownSection(markdown: string, headingNames: string[]): MarkdownSectionMatch | null {
  const headingPattern = /^#{1,6}\s+(.+)$/gm;
  const headings = Array.from(markdown.matchAll(headingPattern));
  const normalizedHeadingNames = headingNames.map((name) => name.toLowerCase());

  for (let index = 0; index < headings.length; index++) {
    const heading = headings[index];
    const label = normalizeHeadingLabel(heading[1] || '');
    if (!normalizedHeadingNames.includes(label)) {
      continue;
    }

    const start = heading.index ?? 0;
    const contentStart = start + heading[0].length;
    const end = index + 1 < headings.length
      ? (headings[index + 1].index ?? markdown.length)
      : markdown.length;
    const content = markdown.slice(contentStart, end).trim();

    return {
      content,
      start,
      end,
    };
  }

  return null;
}

function extractSectionBullets(sectionContent: string): string[] {
  return sectionContent
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => /^[-*]\s+/.test(line))
    .map((line) => line.replace(/^[-*]\s+/, '').trim())
    .filter(Boolean);
}

function removeMarkdownSections(markdown: string, sections: Array<MarkdownSectionMatch | null>): string {
  const matches = sections
    .filter((section): section is MarkdownSectionMatch => Boolean(section))
    .sort((left, right) => right.start - left.start);

  let nextMarkdown = markdown;
  for (const match of matches) {
    nextMarkdown = `${nextMarkdown.slice(0, match.start)}\n\n${nextMarkdown.slice(match.end)}`;
  }

  return nextMarkdown
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function buildWeightedEmbeddingSections(
  summary: ImplementationSummary,
  markdownContent: string,
): WeightedDocumentSections {
  const markdown = stripFrontmatter(markdownContent || '');
  const decisionSection = extractMarkdownSection(markdown, ['decisions']);
  const outcomeSection = extractMarkdownSection(markdown, ['key outcomes', 'outcomes']);
  const markdownDecisions = extractSectionBullets(decisionSection?.content || '');
  const markdownOutcomes = extractSectionBullets(outcomeSection?.content || '');
  const summaryDecisions = summary.decisions.map((decision) => {
    const question = decision.question?.trim();
    const choice = decision.choice?.trim();
    return question && choice ? `${question}: ${choice}` : (choice || question || '');
  }).filter(Boolean);
  const summaryOutcomes = summary.outcomes.filter((outcome) => outcome !== 'Session completed');
  const generalFallback = removeMarkdownSections(markdown, [decisionSection, outcomeSection]);
  const fileDescriptions = [...summary.filesCreated, ...summary.filesModified]
    .map((entry) => `${entry.path}: ${entry.description}`)
    .filter(Boolean)
    .join('\n');
  const general = [summary.solution, fileDescriptions, generalFallback]
    .filter(Boolean)
    .join('\n\n')
    .trim();

  return {
    title: extractMarkdownTitle(markdown) || summary.task,
    decisions: summaryDecisions.length > 0 ? summaryDecisions : markdownDecisions,
    outcomes: summaryOutcomes.length > 0 ? summaryOutcomes : markdownOutcomes,
    general,
  };
}

// ───────────────────────────────────────────────────────────────
// 9. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  MESSAGE_TYPES,
  classifyMessage,
  classifyMessages,
  extractFileChanges,
  extractDecisions,
  generateImplementationSummary,
  buildWeightedEmbeddingSections,
  formatSummaryAsMarkdown,
};
