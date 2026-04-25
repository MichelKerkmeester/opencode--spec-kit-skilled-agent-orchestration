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
