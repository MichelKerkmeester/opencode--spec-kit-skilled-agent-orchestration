'use strict';

// ---------------------------------------------------------------
// MODULE: Deterministic Replay Runner (T003)
// ---------------------------------------------------------------
// Replays corpus entries with given configurations, producing
// deterministic outputs. Same inputs always produce same outputs.
// Isolates replay from live network or human-in-the-loop
// variability (REQ-004).
// ---------------------------------------------------------------

/* ---------------------------------------------------------------
   1. CONSTANTS
----------------------------------------------------------------*/

/**
 * Default config values used when a config field is not specified.
 * @type {Readonly<Record<string, number|boolean>>}
 */
const DEFAULT_CONFIG = Object.freeze({
  convergenceThreshold: 0.05,
  stuckThreshold: 3,
  maxIterations: 10,
  rollingStopThreshold: 0.08,
  noProgressThreshold: 0.05,
  compositeStopScore: 0.60,
});

/* ---------------------------------------------------------------
   2. CONVERGENCE EVALUATION
----------------------------------------------------------------*/

/**
 * Evaluate whether the loop would converge at this iteration
 * given the config thresholds.
 *
 * @param {object} iteration - A corpus iteration record.
 * @param {object} config - The configuration under test.
 * @param {object} priorState - Accumulated state from prior iterations.
 * @returns {{ converged: boolean; stuck: boolean; signals: object }}
 */
function evaluateConvergence(iteration, config, priorState) {
  if (!iteration || typeof iteration !== 'object') {
    return {
      converged: false,
      stuck: false,
      signals: {
        newInfoRatio: 1.0,
        rollingAvg: 1.0,
        compositeScore: 1.0,
        belowThreshold: false,
        compositePass: false,
        consecutiveLowProgress: 0,
        convergenceThreshold: DEFAULT_CONFIG.convergenceThreshold,
        stuckThreshold: DEFAULT_CONFIG.stuckThreshold,
      },
    };
  }
  if (!config || typeof config !== 'object') config = DEFAULT_CONFIG;
  if (!priorState || typeof priorState !== 'object') {
    priorState = { newInfoRatios: [], consecutiveLowProgress: 0 };
  }
  const newInfoRatio = iteration.newInfoRatio ?? 1.0;
  const convergenceThreshold = config.convergenceThreshold ?? DEFAULT_CONFIG.convergenceThreshold;
  const stuckThreshold = config.stuckThreshold ?? DEFAULT_CONFIG.stuckThreshold;
  const noProgressThreshold = config.noProgressThreshold ?? DEFAULT_CONFIG.noProgressThreshold;
  const compositeStopScore = config.compositeStopScore ?? DEFAULT_CONFIG.compositeStopScore;

  // Compute rolling average of newInfoRatio
  const ratios = [...priorState.newInfoRatios, newInfoRatio];
  const windowSize = Math.min(ratios.length, 3);
  const window = ratios.slice(-windowSize);
  const rollingAvg = window.reduce((s, v) => s + v, 0) / window.length;

  // Check stuck (consecutive low-progress iterations)
  const isLowProgress = newInfoRatio < noProgressThreshold;
  const consecutiveLowProgress = isLowProgress
    ? priorState.consecutiveLowProgress + 1
    : 0;
  const stuck = consecutiveLowProgress >= stuckThreshold;

  // Convergence signals
  const convergenceSignals = iteration.convergenceSignals || {};
  const compositeScore = convergenceSignals.compositeStop ?? rollingAvg;

  // Converged when rolling average is below threshold.
  // compositePass is an additional signal only when compositeStop was
  // explicitly provided by convergence signals (not the fallback).
  const belowThreshold = rollingAvg <= convergenceThreshold;
  const hasExplicitComposite = convergenceSignals.compositeStop !== undefined;
  const compositePass = hasExplicitComposite && compositeScore >= compositeStopScore;
  const converged = belowThreshold || compositePass;

  return {
    converged,
    stuck,
    signals: {
      newInfoRatio,
      rollingAvg,
      compositeScore,
      belowThreshold,
      compositePass,
      consecutiveLowProgress,
      convergenceThreshold,
      stuckThreshold,
    },
  };
}

/* ---------------------------------------------------------------
   3. REPLAY EXECUTION
----------------------------------------------------------------*/

/**
 * Replay a corpus entry with a given config. Deterministic:
 * same corpus entry + same config = same output.
 *
 * @param {object} corpusEntry - A validated corpus entry from replay-corpus.cjs.
 * @param {object} config - The configuration to replay under.
 * @returns {{ iterationsUsed: number; maxIterations: number; converged: boolean; stuckIterations: number; recoveryAttempts: number; recoverySuccesses: number; totalFindings: number; relevantFindings: number; stopReason: string; perIterationSignals: object[]; finalSignals: object }}
 */
function replayRun(corpusEntry, config) {
  if (!corpusEntry || typeof corpusEntry !== 'object') {
    return {
      iterationsUsed: 0,
      maxIterations: DEFAULT_CONFIG.maxIterations,
      converged: false,
      stuckIterations: 0,
      recoveryAttempts: 0,
      recoverySuccesses: 0,
      totalFindings: 0,
      relevantFindings: 0,
      stopReason: 'invalidCorpusEntry',
      perIterationSignals: [],
      graphBonus: 1.0,
      finalSignals: null,
    };
  }
  if (!config || typeof config !== 'object') config = DEFAULT_CONFIG;
  const maxIterations = config.maxIterations ?? DEFAULT_CONFIG.maxIterations;
  const iterations = corpusEntry.iterations || [];

  let state = {
    newInfoRatios: [],
    consecutiveLowProgress: 0,
    totalFindings: 0,
    relevantFindings: 0,
    stuckIterations: 0,
    recoveryAttempts: 0,
    recoverySuccesses: 0,
  };

  const perIterationSignals = [];
  let converged = false;
  let iterationsUsed = 0;
  let stopReason = 'maxIterationsReached';

  for (let i = 0; i < iterations.length && i < maxIterations; i++) {
    const iteration = iterations[i];
    iterationsUsed = i + 1;

    // Accumulate findings
    const findingsCount = iteration.findingsCount || 0;
    state.totalFindings += findingsCount;

    // Relevant findings: those with significant new info ratio
    const newInfoRatio = iteration.newInfoRatio ?? 0;
    if (newInfoRatio > 0.1) {
      state.relevantFindings += findingsCount;
    }

    // Evaluate convergence under candidate config
    const evalResult = evaluateConvergence(iteration, config, state);

    // Update state
    state.newInfoRatios.push(newInfoRatio);

    if (evalResult.stuck) {
      state.stuckIterations++;
      state.recoveryAttempts++;
      // Simulate recovery: if there are more iterations after stuck, recovery succeeded
      if (i + 1 < iterations.length) {
        state.recoverySuccesses++;
      }
    }

    state.consecutiveLowProgress = evalResult.signals.consecutiveLowProgress;

    perIterationSignals.push({
      run: iteration.run || i + 1,
      ...evalResult.signals,
      converged: evalResult.converged,
      stuck: evalResult.stuck,
    });

    // Check stop conditions
    if (evalResult.converged) {
      converged = true;
      stopReason = 'converged';
      break;
    }

    if (evalResult.stuck) {
      stopReason = 'stuckRecovery';
      // Don't break - recovery might happen in next iteration
    }
  }

  // Check for graph/wave metrics in the corpus entry and apply graph bonus
  let graphBonus = 1.0;
  if (corpusEntry.graphMetrics || corpusEntry.waveMetrics) {
    const graphMetrics = corpusEntry.graphMetrics || {};
    const waveMetrics = corpusEntry.waveMetrics || {};
    // Apply a 1.1x bonus when graph convergence signals are present and positive
    if (graphMetrics.graphConvergence > 0 || waveMetrics.convergenceScore > 0) {
      graphBonus = 1.1;
    }
  }

  return {
    iterationsUsed,
    maxIterations,
    converged,
    stuckIterations: state.stuckIterations,
    recoveryAttempts: state.recoveryAttempts,
    recoverySuccesses: state.recoverySuccesses,
    totalFindings: state.totalFindings,
    relevantFindings: state.relevantFindings,
    stopReason,
    perIterationSignals,
    graphBonus,
    finalSignals: perIterationSignals.length > 0
      ? perIterationSignals[perIterationSignals.length - 1]
      : null,
  };
}

/**
 * Compare baseline and candidate replay results.
 *
 * @param {object} baseline - Replay results for the baseline config.
 * @param {object} candidate - Replay results for the candidate config.
 * @returns {{ improved: boolean; regressions: string[]; improvements: string[]; delta: Record<string, number> }}
 */
function compareResults(baseline, candidate) {
  if (!baseline || typeof baseline !== 'object' || !candidate || typeof candidate !== 'object') {
    return { improved: false, regressions: ['Missing baseline or candidate results'], improvements: [], delta: {} };
  }
  const improvements = [];
  const regressions = [];
  const delta = {};

  // Compare convergence efficiency (lower iterations used = better)
  const iterDelta = baseline.iterationsUsed - candidate.iterationsUsed;
  delta.iterationsUsed = iterDelta;
  if (iterDelta > 0) {
    improvements.push(`Converged ${iterDelta} iteration(s) sooner`);
  } else if (iterDelta < 0) {
    regressions.push(`Needed ${Math.abs(iterDelta)} more iteration(s)`);
  }

  // Compare convergence (converging is better than not)
  if (candidate.converged && !baseline.converged) {
    improvements.push('Candidate converged while baseline did not');
  } else if (!candidate.converged && baseline.converged) {
    regressions.push('Candidate failed to converge while baseline did');
  }

  // Compare stuck iterations (fewer = better)
  const stuckDelta = baseline.stuckIterations - candidate.stuckIterations;
  delta.stuckIterations = stuckDelta;
  if (stuckDelta > 0) {
    improvements.push(`${stuckDelta} fewer stuck iteration(s)`);
  } else if (stuckDelta < 0) {
    regressions.push(`${Math.abs(stuckDelta)} more stuck iteration(s)`);
  }

  // Compare findings (more relevant findings = better)
  const findingsDelta = candidate.relevantFindings - baseline.relevantFindings;
  delta.relevantFindings = findingsDelta;
  if (findingsDelta > 0) {
    improvements.push(`${findingsDelta} more relevant finding(s)`);
  } else if (findingsDelta < 0) {
    regressions.push(`${Math.abs(findingsDelta)} fewer relevant finding(s)`);
  }

  // Overall: improved if there are improvements and no critical regressions
  const improved = improvements.length > 0 && regressions.length === 0;

  return { improved, regressions, improvements, delta };
}

/* ---------------------------------------------------------------
   4. EXPORTS
----------------------------------------------------------------*/

module.exports = {
  DEFAULT_CONFIG,
  evaluateConvergence,
  replayRun,
  compareResults,
};
