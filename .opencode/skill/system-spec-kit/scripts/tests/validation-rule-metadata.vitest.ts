import { describe, expect, it } from 'vitest';

import {
  determineValidationDisposition,
  getRuleMetadata,
  shouldBlockIndex,
  shouldBlockWrite,
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
    expect(getSourceCapabilities('copilot-cli-capture').toolTitleWithPathExpected).toBe(false);
    expect(getSourceCapabilities('gemini-cli-capture').toolTitleWithPathExpected).toBe(false);
  });
});
