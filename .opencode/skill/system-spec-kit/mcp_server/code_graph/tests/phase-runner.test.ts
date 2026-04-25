// ───────────────────────────────────────────────────────────────
// MODULE: Phase Runner Tests (012/002)
// ───────────────────────────────────────────────────────────────
// Validates rejection paths (duplicate names, missing deps,
// cycles) plus dependency-only output visibility and failure
// attribution. Covers spec 012/002 §4 R-002-1, R-002-2, R-002-7.

import { describe, it, expect } from 'vitest';
import {
  PhaseRunnerError,
  runPhases,
  topologicalSort,
  type Phase,
} from '../lib/phase-runner.js';

function phase<O>(
  name: string,
  inputs: string[],
  body: (deps: Record<string, unknown>) => O | Promise<O>,
  output?: string,
): Phase<Record<string, unknown>, O> {
  return { name, inputs, output, run: body };
}

describe('phase-runner: topologicalSort', () => {
  it('orders phases so every dependency is satisfied first', () => {
    const phases: Phase[] = [
      phase('persist', ['parse'], () => 1),
      phase('parse', ['find-files'], () => 1),
      phase('find-files', [], () => 1),
    ];

    const order = topologicalSort(phases);
    expect(order.indexOf('find-files')).toBeLessThan(order.indexOf('parse'));
    expect(order.indexOf('parse')).toBeLessThan(order.indexOf('persist'));
  });

  it('rejects duplicate phase names', () => {
    const phases: Phase[] = [
      phase('parse', [], () => 1),
      phase('parse', [], () => 2),
    ];

    expect(() => topologicalSort(phases)).toThrow(PhaseRunnerError);
    try {
      topologicalSort(phases);
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      const e = err as PhaseRunnerError;
      expect(e.kind).toBe('duplicate-phase');
      expect(e.phaseName).toBe('parse');
      expect(e.message).toMatch(/duplicate phase name "parse"/);
    }
  });

  it('rejects dependency on an unknown phase', () => {
    const phases: Phase[] = [
      phase('persist', ['ghost'], () => 1),
    ];

    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      const e = err as PhaseRunnerError;
      expect(e.kind).toBe('missing-dependency');
      expect(e.phaseName).toBe('persist');
      expect(e.message).toMatch(/unknown phase "ghost"/);
    }
  });

  it('detects a direct cycle (a → b → a)', () => {
    const phases: Phase[] = [
      phase('a', ['b'], () => 1),
      phase('b', ['a'], () => 1),
    ];

    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      expect((err as PhaseRunnerError).kind).toBe('cycle-detected');
    }
  });

  it('detects an indirect cycle (a → b → c → a)', () => {
    const phases: Phase[] = [
      phase('a', ['c'], () => 1),
      phase('b', ['a'], () => 1),
      phase('c', ['b'], () => 1),
    ];

    expect(() => topologicalSort(phases)).toThrow(/cycle detected/);
  });

  it('allows phases to reference a custom output key declared by a dependency', () => {
    const phases: Phase[] = [
      phase('producer', [], () => 'value', 'producer.output'),
      phase('consumer', ['producer.output'], () => 'ok'),
    ];

    expect(topologicalSort(phases)).toEqual(['producer', 'consumer']);
  });

  // 008/D4 regression: duplicate-output rejection (R-007-P2-1).
  // The implementation rejects (a) two phases publishing the same custom
  // output key, and (b) an output key colliding with another phase's name.
  // Pre-008 the only duplicate-shape test was duplicate phase NAMES.
  it('rejects two phases publishing the same custom output key', () => {
    const phases: Phase[] = [
      phase('producer-a', [], () => 1, 'shared.key'),
      phase('producer-b', [], () => 2, 'shared.key'),
    ];

    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      const e = err as PhaseRunnerError;
      expect(e.kind).toBe('duplicate-output');
    }
  });

  it('rejects an output key that collides with another phase name', () => {
    const phases: Phase[] = [
      phase('parse', [], () => 1),
      phase('producer', [], () => 2, 'parse'), // output 'parse' collides with phase name
    ];

    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      const e = err as PhaseRunnerError;
      expect(e.kind).toBe('duplicate-output');
    }
  });

  // 008/D3: runtime key validation. TypeScript erases at runtime, so
  // callers passing phases through JSON / JS bridges may bypass the
  // compile-time contract. Validate at topologicalSort entry.
  it('D3: rejects empty phase name', () => {
    const phases = [
      { name: '', inputs: [], run: () => 1 } as unknown as Phase,
    ];
    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      expect((err as PhaseRunnerError).kind).toBe('invalid-key');
      expect((err as Error).message).toMatch(/non-empty/);
    }
  });

  it('D3: rejects non-string phase name (number passed via JS bridge)', () => {
    const phases = [
      { name: 42 as unknown as string, inputs: [], run: () => 1 } as Phase,
    ];
    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      expect((err as PhaseRunnerError).kind).toBe('invalid-key');
      expect((err as Error).message).toMatch(/must be a string/);
    }
  });

  it('D3: rejects phase output containing control characters', () => {
    const phases = [
      { name: 'producer', inputs: [], output: 'has\x07bell', run: () => 1 } as Phase,
    ];
    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      expect((err as PhaseRunnerError).kind).toBe('invalid-key');
      expect((err as Error).message).toMatch(/control characters/);
    }
  });

  it('D3: rejects phase key exceeding 256-character cap', () => {
    const phases = [
      { name: 'a'.repeat(300), inputs: [], run: () => 1 } as Phase,
    ];
    try {
      topologicalSort(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      expect((err as PhaseRunnerError).kind).toBe('invalid-key');
      expect((err as Error).message).toMatch(/256/);
    }
  });

  it('D3: accepts unicode phase names above the control band (negative control)', () => {
    const phases = [
      phase('фаза', [], () => 1),
      phase('段階', ['фаза'], () => 2),
    ];
    expect(topologicalSort(phases)).toEqual(['фаза', '段階']);
  });
});

describe('phase-runner: runPhases', () => {
  it('passes ONLY declared dependency outputs into each phase body', async () => {
    const phases: Phase[] = [
      phase('one', [], () => 1),
      phase('two', [], () => 2),
      phase('three', ['one'], (deps) => {
        // Only "one" is declared — "two" must NOT be present.
        expect(Object.keys(deps).sort()).toEqual(['one']);
        expect(deps).not.toHaveProperty('two');
        return (deps.one as number) + 10;
      }),
    ];

    const out = await runPhases(phases);
    expect(out.three).toBe(11);
    expect(out.one).toBe(1);
    expect(out.two).toBe(2);
  });

  it('threads outputs through a multi-stage chain', async () => {
    const phases: Phase[] = [
      phase('seed', [], () => 'a'),
      phase('upper', ['seed'], (d) => (d.seed as string).toUpperCase()),
      phase('exclaim', ['upper'], (d) => `${d.upper as string}!`),
    ];

    const out = await runPhases(phases);
    expect(out.exclaim).toBe('A!');
  });

  it('attributes failures to the offending phase name', async () => {
    const phases: Phase[] = [
      phase('healthy', [], () => 'ok'),
      phase('broken', ['healthy'], () => {
        throw new Error('boom');
      }),
    ];

    try {
      await runPhases(phases);
      throw new Error('expected throw');
    } catch (err) {
      expect(err).toBeInstanceOf(PhaseRunnerError);
      const e = err as PhaseRunnerError;
      expect(e.kind).toBe('phase-failure');
      expect(e.phaseName).toBe('broken');
      expect(e.message).toMatch(/Phase "broken" failed: boom/);
      expect(e.cause).toBeInstanceOf(Error);
    }
  });

  it('awaits async phase bodies', async () => {
    const phases: Phase[] = [
      phase('async', [], async () => {
        await new Promise((r) => setTimeout(r, 1));
        return 42;
      }),
      phase('next', ['async'], (d) => (d.async as number) + 1),
    ];

    const out = await runPhases(phases);
    expect(out.next).toBe(43);
  });

  it('publishes phase output under a custom `output` key', async () => {
    const phases: Phase[] = [
      phase('p', [], () => ({ count: 5 }), 'pipeline.stats'),
    ];

    const out = await runPhases(phases);
    expect(out['pipeline.stats']).toEqual({ count: 5 });
    expect(out.p).toBeUndefined();
  });
});
