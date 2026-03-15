// ---------------------------------------------------------------
// MODULE: Memory Template Contract
// ---------------------------------------------------------------

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;
const RAW_MUSTACHE_RE = /\{\{[^}]+\}\}/;
const LEGACY_TEMPLATE_BANNER_RE = /^\s*<!-- TEMPLATE: context_template\.md v[0-9.]+ - DO NOT EDIT GENERATED FILES -->/m;
const CONSTITUTIONAL_GUIDANCE_RE = /<!-- Constitutional Tier Promotion:/m;
const FRONTMATTER_KEY_RE = /^([A-Za-z_][A-Za-z0-9_-]*)\s*:\s*(.*)$/;

export type MemoryTemplateViolationCode =
  | 'missing_frontmatter'
  | 'malformed_frontmatter'
  | 'missing_frontmatter_key'
  | 'missing_blank_line_after_frontmatter'
  | 'invalid_trigger_phrases'
  | 'raw_mustache_literal'
  | 'legacy_template_banner'
  | 'constitutional_guidance_comment'
  | 'missing_section'
  | 'missing_anchor_comment'
  | 'missing_html_id';

export interface MemoryTemplateViolation {
  code: MemoryTemplateViolationCode;
  message: string;
  sectionId?: string;
  detail?: string;
}

export interface MemoryTemplateContractResult {
  valid: boolean;
  violations: MemoryTemplateViolation[];
  missingAnchors: string[];
  unexpectedTemplateArtifacts: string[];
}

export interface MemoryTemplateSectionRule {
  sectionId: string;
  commentId: string;
  headingPattern: RegExp;
  includeHtmlId: boolean;
  required: 'mandatory' | 'conditional';
}

const SECTION_RULES: MemoryTemplateSectionRule[] = [
  { sectionId: 'preflight', commentId: 'preflight', headingPattern: /^##\s+PREFLIGHT BASELINE\s*$/i, includeHtmlId: false, required: 'conditional' },
  { sectionId: 'continue-session', commentId: 'continue-session', headingPattern: /^##\s+CONTINUE SESSION\s*$/i, includeHtmlId: true, required: 'mandatory' },
  { sectionId: 'project-state-snapshot', commentId: 'project-state-snapshot', headingPattern: /^##\s+PROJECT STATE SNAPSHOT\s*$/i, includeHtmlId: true, required: 'mandatory' },
  { sectionId: 'implementation-guide', commentId: 'task-guide', headingPattern: /^##\s+(?:\d+\.\s+)?IMPLEMENTATION GUIDE\s*$/i, includeHtmlId: true, required: 'conditional' },
  { sectionId: 'overview', commentId: 'summary', headingPattern: /^##\s+(?:\d+\.\s+)?OVERVIEW\s*$/i, includeHtmlId: true, required: 'conditional' },
  { sectionId: 'detailed-changes', commentId: 'detailed-changes', headingPattern: /^##\s+(?:\d+\.\s+)?DETAILED CHANGES\s*$/i, includeHtmlId: true, required: 'conditional' },
  { sectionId: 'workflow-visualization', commentId: 'workflow-visualization', headingPattern: /^##\s+(?:\d+\.\s+)?WORKFLOW VISUALIZATION\s*$/i, includeHtmlId: true, required: 'conditional' },
  { sectionId: 'decisions', commentId: 'decisions', headingPattern: /^##\s+(?:\d+\.\s+)?DECISIONS\s*$/i, includeHtmlId: true, required: 'mandatory' },
  { sectionId: 'conversation', commentId: 'session-history', headingPattern: /^##\s+(?:\d+\.\s+)?CONVERSATION\s*$/i, includeHtmlId: true, required: 'mandatory' },
  { sectionId: 'recovery-hints', commentId: 'recovery-hints', headingPattern: /^##\s+RECOVERY HINTS\s*$/i, includeHtmlId: true, required: 'mandatory' },
  { sectionId: 'postflight-learning-delta', commentId: 'postflight', headingPattern: /^##\s+POSTFLIGHT LEARNING DELTA\s*$/i, includeHtmlId: true, required: 'conditional' },
  { sectionId: 'memory-metadata', commentId: 'metadata', headingPattern: /^##\s+MEMORY METADATA\s*$/i, includeHtmlId: true, required: 'mandatory' },
];

interface ParsedFrontmatterSection {
  key: string;
  firstValue: string;
  lines: string[];
}

function extractFrontmatter(content: string): { found: boolean; body: string; block: string } {
  const match = content.match(FRONTMATTER_RE);
  if (!match) {
    return { found: false, body: content, block: '' };
  }

  return {
    found: true,
    block: match[1],
    body: content.slice(match[0].length),
  };
}

function parseFrontmatterSections(block: string): ParsedFrontmatterSection[] | null {
  const lines = block.split(/\r?\n/);
  const sections: ParsedFrontmatterSection[] = [];
  let current: ParsedFrontmatterSection | null = null;

  for (const line of lines) {
    if (!line.trim()) {
      if (current) {
        current.lines.push(line);
      }
      continue;
    }

    const keyMatch = line.match(FRONTMATTER_KEY_RE);
    if (/^\S/.test(line) && keyMatch) {
      current = {
        key: keyMatch[1],
        firstValue: keyMatch[2].trim(),
        lines: [line],
      };
      sections.push(current);
      continue;
    }

    if (!current) {
      return null;
    }

    current.lines.push(line);
  }

  return sections;
}

function stripQuotes(value: string): string {
  const trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"'))
    || (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }

  return trimmed;
}

function hasScalarValue(sections: Map<string, ParsedFrontmatterSection>, keys: string[]): boolean {
  for (const key of keys) {
    const section = sections.get(key);
    if (!section) {
      continue;
    }

    const normalized = stripQuotes(section.firstValue);
    if (normalized.length > 0) {
      return true;
    }
  }

  return false;
}

function hasValidTriggerPhrases(sections: Map<string, ParsedFrontmatterSection>): boolean {
  const section = sections.get('trigger_phrases') ?? sections.get('triggerPhrases');
  if (!section) {
    return false;
  }

  const firstValue = section.firstValue.trim();
  if (firstValue === '[]') {
    return true;
  }

  if (firstValue.length > 0) {
    return false;
  }

  const listItems = section.lines.slice(1).filter((line) => line.trim().length > 0);
  if (listItems.length === 0) {
    return false;
  }

  return listItems.every((line) => /^\s*-\s+.+$/.test(line));
}

function findHeadingIndex(lines: string[], rule: MemoryTemplateSectionRule): number {
  return lines.findIndex((line) => rule.headingPattern.test(line.trim()));
}

function hasAnchorScaffolding(lines: string[], headingIndex: number, rule: MemoryTemplateSectionRule): {
  hasComment: boolean;
  hasHtmlId: boolean;
} {
  const expectedComment = `<!-- ANCHOR:${rule.commentId} -->`;
  const expectedId = `<a id="${rule.sectionId}"></a>`;
  let hasComment = false;
  let hasHtmlId = false;

  for (let offset = -3; offset <= 2; offset += 1) {
    const line = lines[headingIndex + offset];
    if (!line) {
      continue;
    }

    const trimmed = line.trim();
    if (trimmed === expectedComment) {
      hasComment = true;
    }
    if (rule.includeHtmlId && trimmed === expectedId) {
      hasHtmlId = true;
    }
  }

  return {
    hasComment,
    hasHtmlId: rule.includeHtmlId ? hasHtmlId : true,
  };
}

function hasClosingAnchor(lines: string[], headingIndex: number, commentId: string): boolean {
  for (let index = headingIndex + 1; index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed === `<!-- /ANCHOR:${commentId} -->`) {
      return true;
    }
    if (/^##\s+/.test(trimmed) || trimmed === '---' || trimmed.startsWith('*Generated by ')) {
      return false;
    }
  }

  return false;
}

function countAnchorOpeners(lines: string[], headingIndex: number, commentId: string): number {
  const opener = `<!-- ANCHOR:${commentId} -->`;
  let count = 0;

  for (let index = Math.max(0, headingIndex - 3); index < lines.length; index += 1) {
    const trimmed = lines[index].trim();
    if (trimmed === opener) {
      count += 1;
    }
    if (index > headingIndex && (/^##\s+/.test(trimmed) || trimmed === '---' || trimmed.startsWith('*Generated by '))) {
      break;
    }
  }

  return count;
}

function countAnchorClosers(content: string, commentId: string): number {
  const matches = content.match(new RegExp(`<!--\\s*\\/ANCHOR:${commentId}\\s*-->`, 'g'));
  return matches?.length ?? 0;
}

export function validateMemoryTemplateContract(content: string): MemoryTemplateContractResult {
  const violations: MemoryTemplateViolation[] = [];
  const missingAnchors: string[] = [];
  const unexpectedTemplateArtifacts: string[] = [];

  const frontmatter = extractFrontmatter(content);
  if (!frontmatter.found) {
    violations.push({
      code: 'missing_frontmatter',
      message: 'Memory file is missing YAML frontmatter.',
    });
  }

  let frontmatterSections: ParsedFrontmatterSection[] | null = null;
  if (frontmatter.found) {
    frontmatterSections = parseFrontmatterSections(frontmatter.block);
    if (!frontmatterSections) {
      violations.push({
        code: 'malformed_frontmatter',
        message: 'Memory frontmatter could not be parsed safely.',
      });
    }
  }

  if (frontmatterSections) {
    const sections = new Map(frontmatterSections.map((section) => [section.key, section]));
    const requiredScalarKeys: Array<{ keys: string[]; label: string }> = [
      { keys: ['title'], label: 'title' },
      { keys: ['description'], label: 'description' },
      { keys: ['importance_tier', 'importanceTier'], label: 'importance_tier' },
      { keys: ['contextType', 'context_type'], label: 'contextType' },
    ];

    for (const required of requiredScalarKeys) {
      if (!hasScalarValue(sections, required.keys)) {
        violations.push({
          code: 'missing_frontmatter_key',
          message: `Memory frontmatter is missing a valid ${required.label} value.`,
          detail: required.label,
        });
      }
    }

    if (!hasValidTriggerPhrases(sections)) {
      violations.push({
        code: 'invalid_trigger_phrases',
        message: 'Memory frontmatter trigger_phrases must render as a YAML list or [].',
      });
    }
  }

  // Check for blank line between frontmatter close and body content
  // Uses the already-parsed body (from FRONTMATTER_RE) instead of indexOf
  // to avoid mismatching if YAML values contain literal '---'
  if (frontmatter.found && frontmatter.body.length > 0
      && !frontmatter.body.startsWith('\n') && !frontmatter.body.startsWith('\r\n')) {
    violations.push({
      code: 'missing_blank_line_after_frontmatter',
      message: 'Memory file is missing a blank line between frontmatter close (---) and body content.',
    });
  }

  if (RAW_MUSTACHE_RE.test(content)) {
    unexpectedTemplateArtifacts.push('raw_mustache_literal');
    violations.push({
      code: 'raw_mustache_literal',
      message: 'Rendered memory still contains raw Mustache tokens.',
    });
  }

  if (LEGACY_TEMPLATE_BANNER_RE.test(content)) {
    unexpectedTemplateArtifacts.push('legacy_template_banner');
    violations.push({
      code: 'legacy_template_banner',
      message: 'Rendered memory still contains the legacy template banner comment.',
    });
  }

  if (CONSTITUTIONAL_GUIDANCE_RE.test(content)) {
    unexpectedTemplateArtifacts.push('constitutional_guidance_comment');
    violations.push({
      code: 'constitutional_guidance_comment',
      message: 'Rendered memory still contains constitutional guidance comments.',
    });
  }

  const bodyLines = frontmatter.body.split(/\r?\n/);
  for (const rule of SECTION_RULES) {
    const headingIndex = findHeadingIndex(bodyLines, rule);
    if (headingIndex === -1) {
      if (rule.required === 'mandatory') {
        violations.push({
          code: 'missing_section',
          message: `Rendered memory is missing the required ${rule.sectionId} section.`,
          sectionId: rule.sectionId,
        });
      }
      continue;
    }

    const scaffolding = hasAnchorScaffolding(bodyLines, headingIndex, rule);
    if (!scaffolding.hasComment) {
      missingAnchors.push(rule.sectionId);
      violations.push({
        code: 'missing_anchor_comment',
        message: `Rendered memory is missing the ANCHOR comment for ${rule.sectionId}.`,
        sectionId: rule.sectionId,
      });
    }
    if (!scaffolding.hasHtmlId) {
      missingAnchors.push(rule.sectionId);
      violations.push({
        code: 'missing_html_id',
        message: `Rendered memory is missing the HTML id for ${rule.sectionId}.`,
        sectionId: rule.sectionId,
      });
    }
    if (rule.sectionId === 'memory-metadata' && !hasClosingAnchor(bodyLines, headingIndex, rule.commentId)) {
      missingAnchors.push(rule.sectionId);
      violations.push({
        code: 'missing_anchor_comment',
        message: 'Rendered memory is missing the closing ANCHOR comment for memory-metadata.',
        sectionId: rule.sectionId,
      });
    }
    if (rule.sectionId === 'memory-metadata' && countAnchorOpeners(bodyLines, headingIndex, rule.commentId) !== 1) {
      missingAnchors.push(rule.sectionId);
      violations.push({
        code: 'missing_anchor_comment',
        message: 'Rendered memory has duplicate opening ANCHOR comments for memory-metadata.',
        sectionId: rule.sectionId,
      });
    }
    if (rule.sectionId === 'memory-metadata' && countAnchorClosers(frontmatter.body, rule.commentId) !== 1) {
      missingAnchors.push(rule.sectionId);
      violations.push({
        code: 'missing_anchor_comment',
        message: 'Rendered memory has duplicate or orphaned closing ANCHOR comments for memory-metadata.',
        sectionId: rule.sectionId,
      });
    }
  }

  return {
    valid: violations.length === 0,
    violations,
    missingAnchors: Array.from(new Set(missingAnchors)),
    unexpectedTemplateArtifacts: Array.from(new Set(unexpectedTemplateArtifacts)),
  };
}

export function getMemoryTemplateSectionRules(): MemoryTemplateSectionRule[] {
  return SECTION_RULES.map((rule) => ({ ...rule }));
}
