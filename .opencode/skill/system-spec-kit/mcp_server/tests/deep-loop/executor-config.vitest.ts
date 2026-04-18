import { describe, it, expect } from 'vitest';

import {
  ExecutorConfigError,
  ExecutorNotWiredError,
  parseExecutorConfig,
  resolveExecutorConfig,
} from '../../lib/deep-loop/executor-config';

describe('executor-config', () => {
  it('returns all defaults for a native executor config', () => {
    expect(parseExecutorConfig({ kind: 'native' })).toEqual({
      kind: 'native',
      model: null,
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    });
  });

  it('defaults to native when given an empty object', () => {
    expect(parseExecutorConfig({})).toMatchObject({
      kind: 'native',
      timeoutSeconds: 900,
    });
  });

  it('accepts a wired cli-codex executor with a model', () => {
    expect(parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
  });

  it('rejects cli-codex when model is null', () => {
    try {
      parseExecutorConfig({ kind: 'cli-codex', model: null });
      throw new Error('Expected parseExecutorConfig to throw');
    } catch (error: unknown) {
      expect(error).toBeInstanceOf(ExecutorConfigError);
      if (error instanceof ExecutorConfigError) {
        expect(error.issues).toContainEqual({
          path: ['model'],
          message: 'model is required when kind is cli-codex',
        });
      }
    }
  });

  it('rejects cli-copilot because it is not wired yet', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-copilot', model: 'copilot-x' })).toThrow(ExecutorNotWiredError);
  });

  it('rejects cli-gemini because it is not wired yet', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-gemini', model: 'gemini-pro' })).toThrow(ExecutorNotWiredError);
  });

  it('rejects cli-claude-code because it is not wired yet', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-claude-code', model: 'opus-4.7' })).toThrow(ExecutorNotWiredError);
  });

  it('rejects unknown executor kinds', () => {
    expect(() => parseExecutorConfig({ kind: 'mystery-cli', model: 'x' })).toThrow(ExecutorConfigError);
  });

  it('rejects unknown reasoning effort values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', reasoningEffort: 'super' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects unknown service tier values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', serviceTier: 'slow' })).toThrow(
      ExecutorConfigError,
    );
  });

  it('rejects non-positive timeout values', () => {
    expect(() => parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4', timeoutSeconds: 0 })).toThrow(
      ExecutorConfigError,
    );
  });

  it('defaults timeoutSeconds to 900 when not specified', () => {
    expect(parseExecutorConfig({ kind: 'cli-codex', model: 'gpt-5.4' }).timeoutSeconds).toBe(900);
  });

  it('lets CLI values override file values during resolution', () => {
    expect(resolveExecutorConfig({ cli: { kind: 'cli-codex', model: 'gpt-5.4' }, file: { kind: 'native' } })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
  });

  it('uses file values when CLI values are absent', () => {
    expect(resolveExecutorConfig({ cli: {}, file: { kind: 'cli-codex', model: 'gpt-5.4' } })).toMatchObject({
      kind: 'cli-codex',
      model: 'gpt-5.4',
    });
  });

  it('merges a CLI model onto the default native kind without requiring it', () => {
    expect(resolveExecutorConfig({ cli: { model: 'x' } })).toEqual({
      kind: 'native',
      model: 'x',
      reasoningEffort: null,
      serviceTier: null,
      sandboxMode: null,
      timeoutSeconds: 900,
    });
  });

  it('rejects a resolved cli-codex config when no model is available from any source', () => {
    expect(() => resolveExecutorConfig({ cli: { kind: 'cli-codex' } })).toThrow(ExecutorConfigError);
  });
});
