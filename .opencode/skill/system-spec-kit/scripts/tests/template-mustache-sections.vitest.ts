// ───────────────────────────────────────────────────────────────
// TEST: Mustache Conditional Sections for toolCalls and exchanges
// Phase 004 CHK-022, CHK-043: Template rendering for
// {{#hasToolCalls}} and {{#hasExchanges}} guard sections.
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';
import { renderTemplate } from '../renderers/template-renderer';

import type { TemplateContext } from '../renderers/template-renderer';

/* ───────────────────────────────────────────────────────────────
   TEMPLATE FIXTURES
──────────────────────────────────────────────────────────────── */

const TOOL_CALLS_TEMPLATE = '{{#hasToolCalls}}**Tool Calls:** {{TOOL_CALLS_COMPACT}}{{/hasToolCalls}}';
const EXCHANGES_TEMPLATE = '{{#hasExchanges}}**Exchanges:** {{EXCHANGES_COMPACT}}{{/hasExchanges}}';
const COMBINED_TEMPLATE = [
  '{{#hasToolCalls}}**Tool Calls:** {{TOOL_CALLS_COMPACT}}{{/hasToolCalls}}',
  '{{#hasExchanges}}**Exchanges:** {{EXCHANGES_COMPACT}}{{/hasExchanges}}',
].join('\n');

/* ───────────────────────────────────────────────────────────────
   {{#hasToolCalls}} SECTION
──────────────────────────────────────────────────────────────── */

describe('Mustache conditional sections for toolCalls and exchanges', () => {

  describe('{{#hasToolCalls}} section', () => {

    it('renders tool calls content when hasToolCalls is true', () => {
      const data: TemplateContext = {
        hasToolCalls: true,
        TOOL_CALLS_COMPACT: '`Read` (5) | `Write` (3)',
      };
      const output = renderTemplate(TOOL_CALLS_TEMPLATE, data);
      expect(output).toContain('**Tool Calls:**');
      expect(output).toContain('`Read` (5) | `Write` (3)');
    });

    it('omits tool calls section when hasToolCalls is false', () => {
      const data: TemplateContext = {
        hasToolCalls: false,
        TOOL_CALLS_COMPACT: '`Read` (5)',
      };
      const output = renderTemplate(TOOL_CALLS_TEMPLATE, data);
      expect(output).not.toContain('Tool Calls');
      expect(output).not.toContain('Read');
    });

    it('omits tool calls section when hasToolCalls is undefined', () => {
      const data: TemplateContext = {};
      const output = renderTemplate(TOOL_CALLS_TEMPLATE, data);
      expect(output).not.toContain('Tool Calls');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     {{#hasExchanges}} SECTION
  ──────────────────────────────────────────────────────────────── */

  describe('{{#hasExchanges}} section', () => {

    it('renders exchanges content when hasExchanges is true', () => {
      const data: TemplateContext = {
        hasExchanges: true,
        EXCHANGES_COMPACT: '4 exchanges — `research`, `implementation`, `review`',
      };
      const output = renderTemplate(EXCHANGES_TEMPLATE, data);
      expect(output).toContain('**Exchanges:**');
      expect(output).toContain('4 exchanges');
    });

    it('omits exchanges section when hasExchanges is false', () => {
      const data: TemplateContext = {
        hasExchanges: false,
        EXCHANGES_COMPACT: 'some exchanges',
      };
      const output = renderTemplate(EXCHANGES_TEMPLATE, data);
      expect(output).not.toContain('Exchanges');
    });
  });

  /* ───────────────────────────────────────────────────────────────
     COMBINED TEMPLATE
  ──────────────────────────────────────────────────────────────── */

  describe('combined template with both sections', () => {

    it('renders both sections when both have data', () => {
      const data: TemplateContext = {
        hasToolCalls: true,
        TOOL_CALLS_COMPACT: '`Read` (5)',
        hasExchanges: true,
        EXCHANGES_COMPACT: '2 exchanges',
      };
      const output = renderTemplate(COMBINED_TEMPLATE, data);
      expect(output).toContain('Tool Calls');
      expect(output).toContain('Exchanges');
    });

    it('renders only toolCalls when exchanges is empty', () => {
      const data: TemplateContext = {
        hasToolCalls: true,
        TOOL_CALLS_COMPACT: '`Read` (5)',
        hasExchanges: false,
      };
      const output = renderTemplate(COMBINED_TEMPLATE, data);
      expect(output).toContain('Tool Calls');
      expect(output).not.toContain('Exchanges');
    });

    it('renders neither section when both are false', () => {
      const data: TemplateContext = {
        hasToolCalls: false,
        hasExchanges: false,
      };
      const output = renderTemplate(COMBINED_TEMPLATE, data);
      expect(output.trim()).toBe('');
    });

    it('handles empty string value with truthy flag', () => {
      const data: TemplateContext = {
        hasToolCalls: true,
        TOOL_CALLS_COMPACT: '',
      };
      const output = renderTemplate(TOOL_CALLS_TEMPLATE, data);
      expect(output).toContain('**Tool Calls:**');
    });
  });
});
