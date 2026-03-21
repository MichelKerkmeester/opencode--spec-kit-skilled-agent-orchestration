import { afterEach, describe, expect, it, vi } from 'vitest';

vi.mock('../lib/search/vector-index', () => ({
  getDb: vi.fn(() => null),
}));

import {
  MIN_CONTENT_LENGTH,
  SHORT_DECISION_EXCEPTION_LOG_PREFIX,
  countStructuralSignals,
  isQualityGateExceptionEnabled,
  runQualityGate,
  shouldBypassShortDecisionLengthGate,
  validateStructural,
} from '../lib/validation/save-quality-gate';

function shortDecisionContent(label: string): string {
  return `Decision: ${label}`.padEnd(MIN_CONTENT_LENGTH - 5, '.');
}

describe('Save quality gate short-decision exception', () => {
  afterEach(() => {
    delete process.env.SPECKIT_SAVE_QUALITY_GATE;
    delete process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS;
  });

  it('bypasses the length gate for short decisions with title + specFolder', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';

    const result = validateStructural({
      title: 'Short decision',
      content: shortDecisionContent('title-spec'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'decision',
    });

    expect(countStructuralSignals({
      title: 'Short decision',
      content: shortDecisionContent('title-spec'),
      specFolder: '022-hybrid-rag-fusion',
    })).toBe(2);
    expect(shouldBypassShortDecisionLengthGate({
      title: 'Short decision',
      content: shortDecisionContent('title-spec'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'decision',
    })).toBe(true);
    expect(result.reasons.some((reason) => reason.includes('Content too short'))).toBe(false);
    expect(result.pass).toBe(true);
  });

  it('bypasses the length gate for short decisions with title + anchor', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';

    const result = validateStructural({
      title: 'Anchored decision',
      content: `${shortDecisionContent('title-anchor')}\n<!-- ANCHOR:decision -->`,
      specFolder: '',
      contextType: 'decision',
      anchor: 'decision',
    });

    expect(countStructuralSignals({
      title: 'Anchored decision',
      content: `${shortDecisionContent('title-anchor')}\n<!-- ANCHOR:decision -->`,
      specFolder: '',
      anchor: 'decision',
    })).toBe(2);
    expect(result.reasons.some((reason) => reason.includes('Content too short'))).toBe(false);
    expect(result.reasons).toContain('Spec folder is missing or empty');
  });

  it('bypasses the length gate for short decisions with specFolder + anchor', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';

    const result = validateStructural({
      title: null,
      content: `${shortDecisionContent('spec-anchor')}\n<!-- ANCHOR:decision -->`,
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'decision',
      anchor: 'decision',
    });

    expect(countStructuralSignals({
      title: null,
      content: `${shortDecisionContent('spec-anchor')}\n<!-- ANCHOR:decision -->`,
      specFolder: '022-hybrid-rag-fusion',
      anchor: 'decision',
    })).toBe(2);
    expect(result.reasons.some((reason) => reason.includes('Content too short'))).toBe(false);
    expect(result.reasons).toContain('Title is missing or empty');
  });

  it('rejects non-decision content even when two structural signals are present', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';

    const result = validateStructural({
      title: 'Implementation note',
      content: shortDecisionContent('non-decision'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'implementation',
      anchor: 'implementation',
    });

    expect(shouldBypassShortDecisionLengthGate({
      title: 'Implementation note',
      content: shortDecisionContent('non-decision'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'implementation',
      anchor: 'implementation',
    })).toBe(false);
    expect(result.reasons.some((reason) => reason.includes('Content too short'))).toBe(true);
  });

  it('rejects short decisions with fewer than two structural signals', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';

    const result = validateStructural({
      title: 'Only one signal',
      content: shortDecisionContent('insufficient'),
      specFolder: '',
      contextType: 'decision',
    });

    expect(countStructuralSignals({
      title: 'Only one signal',
      content: shortDecisionContent('insufficient'),
      specFolder: '',
    })).toBe(1);
    expect(result.reasons.some((reason) => reason.includes('Content too short'))).toBe(true);
  });

  it('logs a warning when the exception is used', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    validateStructural({
      title: 'Warned decision',
      content: shortDecisionContent('warn-log'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'decision',
    });

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining(SHORT_DECISION_EXCEPTION_LOG_PREFIX)
    );

    warnSpy.mockRestore();
  });

  it('gates the exception behind SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS', () => {
    process.env.SPECKIT_SAVE_QUALITY_GATE = 'false';

    expect(isQualityGateExceptionEnabled()).toBe(false);
    expect(runQualityGate({
      title: 'Disabled exception',
      content: shortDecisionContent('flag-off'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'decision',
    }).gateEnabled).toBe(false);

    process.env.SPECKIT_SAVE_QUALITY_GATE = 'true';
    process.env.SPECKIT_SAVE_QUALITY_GATE_EXCEPTIONS = 'true';

    expect(isQualityGateExceptionEnabled()).toBe(true);
    const result = runQualityGate({
      title: 'Enabled exception',
      content: shortDecisionContent('flag-on'),
      specFolder: '022-hybrid-rag-fusion',
      contextType: 'decision',
    });
    expect(result.layers.structural.reasons.some((reason) => reason.includes('Content too short'))).toBe(false);
  });
});
