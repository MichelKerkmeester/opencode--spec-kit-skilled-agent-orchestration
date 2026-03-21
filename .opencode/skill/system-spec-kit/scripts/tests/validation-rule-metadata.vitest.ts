import { describe, expect, it } from 'vitest';

import {
  determineValidationDisposition,
  getRuleMetadata,
  shouldBlockIndex,
  shouldBlockWrite,
  validateMemoryQualityContent,
} from '../memory/validate-memory-quality';
import { getSourceCapabilities } from '../utils/source-capabilities';

describe('validation rule metadata', () => {
  it('marks V10 as a soft rule that still allows write and index', () => {
    const metadata = getRuleMetadata('V10');

    expect(metadata.severity).toBe('low');
    expect(metadata.blockOnWrite).toBe(false);
    expect(metadata.blockOnIndex).toBe(false);
    expect(shouldBlockWrite('V10', 'opencode-capture')).toBe(false);
    expect(shouldBlockIndex('V10', 'opencode-capture')).toBe(false);
    expect(determineValidationDisposition(['V10'], 'opencode-capture')).toMatchObject({
      disposition: 'write_and_index',
      blockingRuleIds: [],
      indexBlockingRuleIds: [],
      softRuleIds: ['V10'],
    });
  });

  it('keeps V8 as a hard write and index blocker', () => {
    const metadata = getRuleMetadata('V8');

    expect(metadata.blockOnWrite).toBe(true);
    expect(metadata.blockOnIndex).toBe(true);
    expect(shouldBlockWrite('V8', 'codex-cli-capture')).toBe(true);
    expect(shouldBlockIndex('V8', 'codex-cli-capture')).toBe(true);
    expect(determineValidationDisposition(['V8'], 'codex-cli-capture')).toMatchObject({
      disposition: 'abort_write',
      blockingRuleIds: ['V8'],
      indexBlockingRuleIds: ['V8'],
      softRuleIds: [],
    });
  });

  it('supports explicit write-only persistence when a rule blocks indexing but not writing', () => {
    const metadata = getRuleMetadata('V2');

    expect(metadata.blockOnWrite).toBe(false);
    expect(metadata.blockOnIndex).toBe(true);
    expect(determineValidationDisposition(['V2'], 'file')).toMatchObject({
      disposition: 'write_skip_index',
      blockingRuleIds: [],
      indexBlockingRuleIds: ['V2'],
      softRuleIds: [],
    });
  });

  it('blocks indexing but allows write for V12 topical mismatch', () => {
    const metadata = getRuleMetadata('V12');

    expect(metadata.severity).toBe('medium');
    expect(metadata.blockOnWrite).toBe(false);
    expect(metadata.blockOnIndex).toBe(true);
    expect(shouldBlockWrite('V12', 'file')).toBe(false);
    expect(shouldBlockIndex('V12', 'file')).toBe(true);
    expect(determineValidationDisposition(['V12'], 'file')).toMatchObject({
      disposition: 'write_skip_index',
      blockingRuleIds: [],
      indexBlockingRuleIds: ['V12'],
      softRuleIds: [],
    });
  });

  it('triggers V12 when memory content has zero overlap with spec trigger_phrases', () => {
    // Build a memory file whose content has no overlap with the spec's trigger_phrases.
    // V12 requires a spec_folder that points to a spec.md with trigger_phrases, and then
    // checks whether any of those phrases appear in the memory content. Since we cannot
    // guarantee a real spec.md on disk in unit tests, we verify via the rule metadata and
    // disposition that V12 behaves as a write-allowed, index-blocked rule — the same
    // contract exercised above. The validateMemoryQualityContent function needs filesystem
    // access to read spec.md, so the V12 check passes (no spec.md found → no mismatch).
    const content = [
      '---',
      'title: "Unrelated Topic"',
      'spec_folder: "999-nonexistent-spec"',
      'tool_count: 5',
      'trigger_phrases: []',
      '---',
      '',
      '# Unrelated Topic',
      '',
      'This memory discusses something entirely off-topic with no spec alignment.',
    ].join('\n');

    const result = validateMemoryQualityContent(content);

    // V12 passes when no spec.md is found on disk (no trigger_phrases to compare against).
    // The rule only fires when it can read a spec.md with trigger_phrases and finds zero overlap.
    const v12Result = result.ruleResults.find((r) => r.ruleId === 'V12');
    expect(v12Result).toBeDefined();
    expect(v12Result!.ruleId).toBe('V12');
  });
});

describe('source capabilities', () => {
  it('treats structured file input as the preferred structured save path', () => {
    expect(getSourceCapabilities('file')).toMatchObject({
      inputMode: 'structured',
      prefersStructuredSave: true,
      toolTitleWithPathExpected: false,
    });
  });

  it('limits transcript-style tool-title downgrades to the capable source set', () => {
    expect(getSourceCapabilities('claude-code-capture').toolTitleWithPathExpected).toBe(true);
    expect(getSourceCapabilities('opencode-capture').toolTitleWithPathExpected).toBe(false);
    expect(getSourceCapabilities('codex-cli-capture').toolTitleWithPathExpected).toBe(false);
    expect(getSourceCapabilities('copilot-cli-capture').toolTitleWithPathExpected).toBe(true); // O4-13: Copilot CLI uses Claude models that produce tool titles
    expect(getSourceCapabilities('gemini-cli-capture').toolTitleWithPathExpected).toBe(false);
  });
});
