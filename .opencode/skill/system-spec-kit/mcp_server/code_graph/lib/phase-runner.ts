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
  readonly kind: 'duplicate-phase' | 'missing-dependency' | 'cycle-detected' | 'phase-failure';
  readonly phaseName?: string;

  constructor(
    kind: 'duplicate-phase' | 'missing-dependency' | 'cycle-detected' | 'phase-failure',
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
 *   2. Dependency that does not    → PhaseRunnerError('missing-dependency')
 *      resolve to any phase output
 *   3. Any cycle                    → PhaseRunnerError('cycle-detected')
 */
export function topologicalSort(phases: readonly Phase[]): string[] {
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

  // Build output-key → phase-name lookup so dependencies can name
  // either the phase or its declared output.
  const phaseNamesByOutputKey = new Map<string, string>();
  for (const phase of phases) {
    phaseNamesByOutputKey.set(outputKey(phase), phase.name);
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
