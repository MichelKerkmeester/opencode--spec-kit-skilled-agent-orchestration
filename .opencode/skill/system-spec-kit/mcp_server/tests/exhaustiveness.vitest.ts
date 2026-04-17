// ───────────────────────────────────────────────────────────────
// TEST: Exhaustiveness Helper
// ───────────────────────────────────────────────────────────────

import { describe, expect, it } from 'vitest';

import { assertNever } from '../lib/utils/exhaustiveness.js';

describe('assertNever', () => {
  it('throws with the unexpected value in the message', () => {
    expect(() => assertNever('unexpected' as never)).toThrow(
      'Exhaustiveness violation: unexpected value "unexpected"',
    );
  });

  it('includes the optional context label', () => {
    expect(() => assertNever({ kind: 'mystery' } as never, 'sample-context')).toThrow(
      'Exhaustiveness violation: unexpected value {"kind":"mystery"} (sample-context)',
    );
  });
});

describe('sample consumer patterns', () => {
  it('covers switch-based status handling', () => {
    type Status = 'ran' | 'skipped' | 'failed';
    const renderStatus = (status: Status): string => {
      switch (status) {
        case 'ran':
          return 'ok';
        case 'skipped':
          return 'skip';
        case 'failed':
          return 'fail';
        default:
          return assertNever(status, 'sample-status');
      }
    };

    expect(renderStatus('ran')).toBe('ok');
    expect(() => renderStatus('surprise' as Status)).toThrow('sample-status');
  });

  it('covers record lookup patterns', () => {
    type SkipReason = 'feature_disabled' | 'empty_content';
    const lookup = {
      feature_disabled: 'feature_disabled',
      empty_content: 'empty_content',
    } satisfies Record<SkipReason, string>;

    const resolve = (reason: SkipReason): string => {
      const mapped = lookup[reason];
      return mapped ?? assertNever(reason, 'sample-record-lookup');
    };

    expect(resolve('feature_disabled')).toBe('feature_disabled');
  });

  it('covers two-variant abort unions', () => {
    type ConflictAbortStatus = 'conflict_stale_predecessor' | 'scope_retagged';
    const normalize = (status: ConflictAbortStatus): ConflictAbortStatus => {
      switch (status) {
        case 'conflict_stale_predecessor':
        case 'scope_retagged':
          return status;
        default:
          return assertNever(status, 'sample-conflict-abort');
      }
    };

    expect(normalize('scope_retagged')).toBe('scope_retagged');
  });

  it('covers expanded trust-state unions', () => {
    type TrustState = 'live' | 'cached' | 'stale' | 'absent' | 'unavailable';
    const normalize = (trustState: TrustState): TrustState => {
      switch (trustState) {
        case 'live':
        case 'cached':
        case 'stale':
        case 'absent':
        case 'unavailable':
          return trustState;
        default:
          return assertNever(trustState, 'sample-trust-state');
      }
    };

    expect(normalize('cached')).toBe('cached');
  });

  it('covers trigger-category routing switches', () => {
    type TriggerCategory = 'file_write' | 'memory_save' | 'resume' | 'read_only';
    const route = (category: TriggerCategory): string => {
      switch (category) {
        case 'file_write':
          return 'write';
        case 'memory_save':
          return 'save';
        case 'resume':
          return 'resume';
        case 'read_only':
          return 'read';
        default:
          return assertNever(category, 'sample-trigger-category');
      }
    };

    expect(route('read_only')).toBe('read');
  });
});
