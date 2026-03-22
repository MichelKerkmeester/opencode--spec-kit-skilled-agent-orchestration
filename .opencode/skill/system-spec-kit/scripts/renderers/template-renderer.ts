// ---------------------------------------------------------------
// MODULE: Template Renderer
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. TEMPLATE RENDERER
// ───────────────────────────────────────────────────────────────
// Mustache-based template engine — renders memory files from collected session data

// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import fs from 'fs/promises';
import path from 'path';
import { CONFIG } from '../core';
import { structuredLog } from '../utils/logger';

// ───────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────
/** Template context data: a record of string keys to arbitrary values */
export type TemplateContext = Record<string, unknown>;

/** Template data item that can be an object or primitive */
type TemplateDataItem = Record<string, unknown> | string | number | boolean;

// ───────────────────────────────────────────────────────────────
// 4. OPTIONAL PLACEHOLDERS
// ───────────────────────────────────────────────────────────────
// 084-fix: V2.2 placeholders that are spec'd but not yet implemented
// Suppress warnings for these to reduce noise until features are built
const OPTIONAL_PLACEHOLDERS: Set<string> = new Set([
  // @planned(V2.2) — These placeholders suppress warnings for template sections not yet populated.
  // Remove these entries when the corresponding template sections are either populated or removed.
  // Postflight Learning Delta (V2.2) — intentionally nullable; suppress until postflight flow is stable
  'PREFLIGHT_KNOW_SCORE', 'POSTFLIGHT_KNOW_SCORE', 'DELTA_KNOW_SCORE', 'DELTA_KNOW_TREND',
  'PREFLIGHT_UNCERTAINTY_SCORE', 'POSTFLIGHT_UNCERTAINTY_SCORE', 'DELTA_UNCERTAINTY_SCORE', 'DELTA_UNCERTAINTY_TREND',
  'PREFLIGHT_CONTEXT_SCORE', 'POSTFLIGHT_CONTEXT_SCORE', 'DELTA_CONTEXT_SCORE', 'DELTA_CONTEXT_TREND',
  'LEARNING_INDEX', 'LEARNING_SUMMARY',
  // Session-capturing runtime contract: these fields are intentionally sparse or section-scoped
  // in successful flows and should not emit false-positive template-data warnings.
  'ANCHOR_ID', 'TYPE', 'NARRATIVE', 'FILES_LIST',
  'CAPTURED_FILE_COUNT', 'FILESYSTEM_FILE_COUNT', 'GIT_CHANGED_FILE_COUNT',
  'HEAD_REF', 'COMMIT_REF',
  // Phase 004: toolCalls/exchanges compact strings — empty when no data present
  'TOOL_CALLS_COMPACT', 'EXCHANGES_COMPACT', 'hasToolCalls', 'hasExchanges',
]);

// ───────────────────────────────────────────────────────────────
// 5. HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────
function isFalsy(value: unknown): boolean {
  // "false" strings and empty arrays treated as falsy for template conditionals
  if (value === undefined || value === null || value === false) return true;
  if (typeof value === 'string' && value.toLowerCase() === 'false') return true;
  if (typeof value === 'number' && value === 0) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  return false;
}

function cleanupExcessiveNewlines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}

// P1-11: Escape mustache delimiters in variable values to prevent template injection.
// Values containing {{...}} patterns could be re-expanded during recursive section rendering.
function escapeMustacheValue(value: string): string {
  if (!value.includes('{{')) return value;
  return value.replace(/\{\{/g, '\\{\\{').replace(/\}\}/g, '\\}\\}');
}

function stripTemplateConfigComments(text: string): string {
  let result: string = text.replace(/<!--\s*TEMPLATE:\s*context_template[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Template Configuration Comments[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Context Type Detection:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Importance Tier Guidelines:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Constitutional Tier Promotion:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*Channel\/Branch Association:[\s\S]*?-->\s*\n*/g, '');
  result = result.replace(/<!--\s*SESSION CONTEXT DOCUMENTATION[\s\S]*?-->\s*$/g, '');
  result = result.replace(/\n{3,}/g, '\n\n');

  // Ensure a blank line between frontmatter close --- and body content (e.g. # H1)
  result = result.replace(/(^---\n[\s\S]*?\n---)\n(?!\n)/, '$1\n\n');

  return result;
}

// ───────────────────────────────────────────────────────────────
// 6. CORE RENDERING
// ───────────────────────────────────────────────────────────────
function renderTemplate(template: string, data: TemplateContext, parentData: TemplateContext = {}): string {
  let result: string = template;
  const mergedData: TemplateContext = { ...parentData, ...data };

  // Array loops: {{#ARRAY}}...{{/ARRAY}}
  result = result.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match: string, key: string, content: string): string => {
    const value: unknown = mergedData[key];

    if (typeof value === 'boolean') {
      return value ? renderTemplate(content, mergedData, parentData) : '';
    }

    if (isFalsy(value)) {
      return '';
    }

    if (!Array.isArray(value)) {
      return renderTemplate(content, mergedData, parentData);
    }

    if (value.length === 0) {
      return '';
    }

    return value.map((item: TemplateDataItem): string => {
      if (typeof item === 'object' && item !== null) {
        return renderTemplate(content, item as TemplateContext, mergedData);
      }
      return renderTemplate(content, { ITEM: item, '.': item }, mergedData);
    }).join('');
  });

  // Inverted sections: {{^ARRAY}}...{{/ARRAY}}
  result = result.replace(/\{\{\^(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_match: string, key: string, content: string): string => {
    const value: unknown = mergedData[key];
    if (isFalsy(value)) {
      return renderTemplate(content, mergedData, parentData);
    }
    return '';
  });

  // P1-10: Mustache comment syntax — strip {{! ... }} blocks
  result = result.replace(/\{\{![^}]*\}\}/g, '');

  // Simple variable replacement: {{VAR}} or {{.}}
  result = result.replace(/\{\{([\w.]+)\}\}/g, (_match: string, key: string): string => {
    const value: unknown = mergedData[key];

    if (value === undefined || value === null) {
      // 084-fix: Only warn for non-optional placeholders
      if (!OPTIONAL_PLACEHOLDERS.has(key)) {
        structuredLog('warn', `Missing template data for: {{${key}}}`);
      }
      return '';
    }

    if (Array.isArray(value)) {
      return escapeMustacheValue(value.map((item: TemplateDataItem): string => {
        if (typeof item === 'object' && item !== null) {
          const firstKey: string | undefined = Object.keys(item as Record<string, unknown>)[0];
          return firstKey ? String((item as Record<string, unknown>)[firstKey]) : JSON.stringify(item);
        }
        return String(item);
      }).join(', '));
    }

    if (typeof value === 'object') {
      const firstKey: string | undefined = Object.keys(value as Record<string, unknown>)[0];
      return escapeMustacheValue(firstKey ? String((value as Record<string, unknown>)[firstKey]) : JSON.stringify(value));
    }

    if (typeof value === 'boolean') {
      return value ? 'Yes' : 'No';
    }

    return escapeMustacheValue(String(value));
  });

  return cleanupExcessiveNewlines(result);
}

// ───────────────────────────────────────────────────────────────
// 7. PUBLIC API
// ───────────────────────────────────────────────────────────────
async function populateTemplate(templateName: string, data: TemplateContext): Promise<string> {
  const templateDir: string = CONFIG.TEMPLATE_DIR;
  const templatePath: string = path.join(templateDir, `${templateName}_template.md`);

  // T029 FIX: Add error handling for template not found scenario
  try {
    // Check if template exists before reading
    await fs.access(templatePath);
  } catch (_accessError: unknown) {
    if (_accessError instanceof Error) {
      // Access failures are normalized into the template-not-found error below.
    }
    throw new Error(
      `Template not found: "${templateName}" (expected at: ${templatePath}). ` +
      `Available templates should be in: ${templateDir}`
    );
  }

  let template: string;
  try {
    template = await fs.readFile(templatePath, 'utf-8');
  } catch (readError: unknown) {
    const readErrorMessage = readError instanceof Error ? readError.message : String(readError);
    throw new Error(
      `Failed to read template "${templateName}": ${readErrorMessage}`
    );
  }

  const rendered: string = renderTemplate(template, data);
  return stripTemplateConfigComments(rendered);
}

// ───────────────────────────────────────────────────────────────
// 8. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  populateTemplate,
  renderTemplate,
  cleanupExcessiveNewlines,
  stripTemplateConfigComments,
  isFalsy,
};
