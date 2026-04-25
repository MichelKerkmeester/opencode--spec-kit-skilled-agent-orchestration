// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Phase Runner
// ───────────────────────────────────────────────────────────────
// Typed phase-DAG orchestrator for the structural indexing flow.
// Each phase declares its name, its dependency outputs (`inputs`),
// and the output key it produces (`output`). The runner validates
// the DAG (duplicate names, missing deps, cycles), topologically
// sorts the nodes, and invokes each phase with a typed map that
// contains ONLY the outputs of phases listed in its `inputs` —
// undeclared upstream outputs are not visible to the phase body.
//
// Owner-local clean-room implementation per ADR-012-001. The DAG
// shape (declared inputs/outputs, duplicate/missing/cycle
// rejection, dependency-only output passing) is taken from the
// pt-02 §4 phase-runner pattern; no upstream source/schema text
// is reused.

/**
 * A single phase in the indexing DAG.
 *
 * - `name`     — unique within a runner invocation (duplicates rejected)
 * - `inputs`   — names of phases this phase depends on; the runner
 *                passes ONLY these outputs in `deps`. Listing a name
 *                that does not exist in the runner is rejected.
 * - `output`   — the key this phase publishes (defaults to `name`).
 *                Downstream phases reference it via `inputs`.
 * - `run(deps)` — receives a map keyed by `inputs[i]` (each value
 *                produced by that named phase). Returns the phase's
 *                output value (typed `O`).
 */
export interface Phase<I extends Record<string, unknown> = Record<string, unknown>, O = unknown> {
  readonly name: string;
  readonly inputs: readonly string[];
  readonly output?: string;
  run(deps: I): Promise<O> | O;
}

/** Error thrown when a runner invocation cannot construct a valid DAG. */
export class PhaseRunnerError extends Error {
  readonly kind:
    | 'duplicate-phase'
    | 'duplicate-output'
    | 'missing-dependency'
    | 'cycle-detected'
    | 'phase-failure'
    | 'invalid-key';
  readonly phaseName?: string;

  constructor(
    kind:
      | 'duplicate-phase'
      | 'duplicate-output'
      | 'missing-dependency'
      | 'cycle-detected'
      | 'phase-failure'
      | 'invalid-key',
    message: string,
    phaseName?: string,
    options?: { cause?: unknown },
  ) {
    super(message, options);
    this.name = 'PhaseRunnerError';
    this.kind = kind;
    this.phaseName = phaseName;
  }
}

// 008/D3: Runtime guards for phase keys. TypeScript enforces these at
// compile time, but consumers of the exported API may pass values
// through type-erased boundaries (JSON, dynamic loading, JS callers).
// Reject empty strings, non-strings, and strings containing control
// characters BEFORE DAG construction so the failure path is predictable.
const PHASE_KEY_BLOCKED = /[\x00-\x1F\x7F]/;
const PHASE_KEY_MAX_LENGTH = 256;

function validatePhaseKey(value: unknown, role: string, phaseName?: string): string {
  if (typeof value !== 'string') {
    throw new PhaseRunnerError(
      'invalid-key',
      `Phase runner rejected: ${role} must be a string, got ${value === null ? 'null' : typeof value}`,
      phaseName,
    );
  }
  if (value.length === 0) {
    throw new PhaseRunnerError(
      'invalid-key',
      `Phase runner rejected: ${role} must be a non-empty string`,
      phaseName,
    );
  }
  if (value.length > PHASE_KEY_MAX_LENGTH) {
    throw new PhaseRunnerError(
      'invalid-key',
      `Phase runner rejected: ${role} exceeds ${PHASE_KEY_MAX_LENGTH}-character cap`,
      phaseName,
    );
  }
  if (PHASE_KEY_BLOCKED.test(value)) {
    throw new PhaseRunnerError(
      'invalid-key',
      `Phase runner rejected: ${role} contains control characters`,
      phaseName,
    );
  }
  return value;
}

/** Map of phase output keys to the value produced by that phase. */
export type PhaseOutputs = Record<string, unknown>;

function outputKey(phase: Phase): string {
  return phase.output ?? phase.name;
}

/**
 * Validate the DAG and return a topological order of phase names.
 *
 * Rejection paths (in evaluation order):
 *   1. Duplicate phase name        → PhaseRunnerError('duplicate-phase')
 *   2. Duplicate `output` key      → PhaseRunnerError('duplicate-output')
 *      across phases (R-007-P2-1)
 *   3. Dependency that does not    → PhaseRunnerError('missing-dependency')
 *      resolve to any phase output
 *   4. Any cycle                    → PhaseRunnerError('cycle-detected')
 */
export function topologicalSort(phases: readonly Phase[]): string[] {
  // 008/D3: Validate every phase's runtime keys BEFORE DAG construction.
  // TypeScript erases at runtime, so callers loading phases through
  // JSON / dynamic imports / JS bridges may bypass the compile-time
  // contract and reach this function with malformed shapes.
  for (const phase of phases) {
    validatePhaseKey(phase.name, 'phase.name');
    if (phase.output !== undefined) {
      validatePhaseKey(phase.output, 'phase.output', phase.name);
    }
    for (const input of phase.inputs ?? []) {
      validatePhaseKey(input, 'phase.inputs entry', phase.name);
    }
  }

  const phasesByName = new Map<string, Phase>();
  for (const phase of phases) {
    if (phasesByName.has(phase.name)) {
      throw new PhaseRunnerError(
        'duplicate-phase',
        `Phase runner rejected: duplicate phase name "${phase.name}"`,
        phase.name,
      );
    }
    phasesByName.set(phase.name, phase);
  }

  // R-007-P2-1: Build output-key → phase-name lookup AND reject any
  // duplicate output keys. Two phases publishing the same output
  // key are just as ambiguous as two phases sharing a name —
  // dependents that reference that key cannot deterministically
  // resolve which producer's value they receive. Mirror the
  // duplicate-name rejection so the failure modes stay symmetric.
  const phaseNamesByOutputKey = new Map<string, string>();
  for (const phase of phases) {
    const key = outputKey(phase);
    const existingProducer = phaseNamesByOutputKey.get(key);
    if (existingProducer !== undefined && existingProducer !== phase.name) {
      throw new PhaseRunnerError(
        'duplicate-output',
        `Phase runner rejected: phases "${existingProducer}" and "${phase.name}" both publish output key "${key}"`,
        phase.name,
      );
    }
    phaseNamesByOutputKey.set(key, phase.name);
  }

  // Also reject when a phase's `output` key collides with a
  // *different* phase's `name` (which would also cause ambiguous
  // dependency resolution). This is the second half of the
  // symmetry: a phase named `X` and another phase whose `output`
  // is `X` collide because dependents naming `X` can't tell which
  // producer is meant.
  for (const phase of phases) {
    const key = outputKey(phase);
    if (key === phase.name) continue;
    const collidingPhase = phasesByName.get(key);
    if (collidingPhase !== undefined && collidingPhase.name !== phase.name) {
      throw new PhaseRunnerError(
        'duplicate-output',
        `Phase runner rejected: phase "${phase.name}" output "${key}" collides with phase name "${collidingPhase.name}"`,
        phase.name,
      );
    }
  }

  for (const phase of phases) {
    for (const dep of phase.inputs) {
      if (!phaseNamesByOutputKey.has(dep) && !phasesByName.has(dep)) {
        throw new PhaseRunnerError(
          'missing-dependency',
          `Phase runner rejected: phase "${phase.name}" depends on unknown phase "${dep}"`,
          phase.name,
        );
      }
    }
  }

  // Kahn's algorithm — keeps incoming-edge counts and processes
  // any node with zero remaining edges. Stable iteration order
  // (insertion order of `phases`) makes failure messages
  // deterministic.
  const incomingEdges = new Map<string, number>();
  const dependents = new Map<string, string[]>();
  for (const phase of phases) {
    incomingEdges.set(phase.name, phase.inputs.length);
    for (const dep of phase.inputs) {
      const depPhaseName = phaseNamesByOutputKey.get(dep) ?? dep;
      const list = dependents.get(depPhaseName) ?? [];
      list.push(phase.name);
      dependents.set(depPhaseName, list);
    }
  }

  const ready: string[] = [];
  for (const phase of phases) {
    if ((incomingEdges.get(phase.name) ?? 0) === 0) {
      ready.push(phase.name);
    }
  }

  const order: string[] = [];
  while (ready.length > 0) {
    const next = ready.shift()!;
    order.push(next);
    for (const dependent of dependents.get(next) ?? []) {
      const remaining = (incomingEdges.get(dependent) ?? 0) - 1;
      incomingEdges.set(dependent, remaining);
      if (remaining === 0) {
        ready.push(dependent);
      }
    }
  }

  if (order.length !== phases.length) {
    const stuck = phases
      .filter(p => (incomingEdges.get(p.name) ?? 0) > 0)
      .map(p => p.name);
    throw new PhaseRunnerError(
      'cycle-detected',
      `Phase runner rejected: cycle detected among phases [${stuck.join(', ')}]`,
      stuck[0],
    );
  }

  return order;
}

/**
 * Execute the phases in topological order.
 *
 * - Each phase receives a `deps` object containing ONLY outputs of
 *   phases listed in its `inputs`. Other phase outputs in the run
 *   are not visible — this is the dependency-only passing contract
 *   from R-002-2.
 * - On failure, throws `PhaseRunnerError('phase-failure')` carrying
 *   the offending phase name in `phaseName` and the original error
 *   as `cause` (R-002-7 failure attribution).
 *
 * Returns the full output map keyed by each phase's `output` (or
 * `name` when `output` is omitted).
 */
export async function runPhases(phases: readonly Phase[]): Promise<PhaseOutputs> {
  const order = topologicalSort(phases);
  const phasesByName = new Map<string, Phase>();
  for (const phase of phases) phasesByName.set(phase.name, phase);

  const outputs: PhaseOutputs = {};
  const phaseNamesByOutputKey = new Map<string, string>();
  for (const phase of phases) phaseNamesByOutputKey.set(outputKey(phase), phase.name);

  for (const phaseName of order) {
    const phase = phasesByName.get(phaseName)!;
    const deps: Record<string, unknown> = {};
    for (const inputKey of phase.inputs) {
      // Resolve to the canonical output key so the value is published
      // under the same name the dependency declared.
      const producerName = phaseNamesByOutputKey.get(inputKey) ?? inputKey;
      const producer = phasesByName.get(producerName);
      const producerOutputKey = producer ? outputKey(producer) : inputKey;
      deps[inputKey] = outputs[producerOutputKey];
    }

    try {
      const value = await phase.run(deps);
      outputs[outputKey(phase)] = value;
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : String(cause);
      throw new PhaseRunnerError(
        'phase-failure',
        `Phase "${phase.name}" failed: ${message}`,
        phase.name,
        { cause },
      );
    }
  }

  return outputs;
}
