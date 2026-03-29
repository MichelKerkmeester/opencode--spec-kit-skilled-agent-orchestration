// ---------------------------------------------------------------
// MODULE: Learned Combiner
// ---------------------------------------------------------------
// REQ-D1-006: Learned Stage 2 Weights (Research Item #28)
//
// Regularized linear ranker that learns combination weights from
// accumulated Stage 2 signals. Runs in shadow-only mode behind the
// SPECKIT_LEARNED_STAGE2_COMBINER feature flag.
//
// No external ML dependencies — matrix math imported from matrix-math.ts.
// ---------------------------------------------------------------

// Feature catalog: Learned Stage 2 weight combiner

import { transpose, matMul, matVecMul, addScaledIdentity, solveLinearSystem } from './matrix-math.js';

// Re-export matrix-math for backward compatibility
export { transpose, matMul, matVecMul, addScaledIdentity, solveLinearSystem } from './matrix-math.js';

/* ---------------------------------------------------------------
   1. TYPES
   --------------------------------------------------------------- */

/**
 * The 8 Stage 2 scoring features in canonical order.
 * Each feature is normalized to [0, 1].
 */
export const FEATURE_NAMES = [
  'rrf',
  'overlap',
  'graph',
  'session',
  'causal',
  'feedback',
  'validation',
  'artifact',
] as const;

export type FeatureName = (typeof FEATURE_NAMES)[number];

/** Number of features in the canonical feature vector. */
export const FEATURE_COUNT = FEATURE_NAMES.length;

/**
 * A fixed-length numeric feature vector.
 * Index positions correspond to FEATURE_NAMES.
 */
export type FeatureVector = [number, number, number, number, number, number, number, number];

/**
 * Scoring context from which features are extracted.
 * Field names mirror the PipelineRow / Stage 2 scoring context.
 */
export interface ScoringContext {
  /** RRF / RSF fusion score (already [0, 1]) */
  rrfScore?: number;
  /** Term overlap / BM25 score */
  overlapScore?: number;
  /** Graph signal score (momentum + causal depth) */
  graphScore?: number;
  /** Session boost score (working-memory attention) */
  sessionScore?: number;
  /** Causal boost score (graph-traversal neighbor amplification) */
  causalScore?: number;
  /** Feedback signal score (learned triggers + negative demotions) */
  feedbackScore?: number;
  /** Validation quality score (spec quality signals) */
  validationScore?: number;
  /** Artifact routing score (class-based weight boost) */
  artifactScore?: number;
}

/**
 * A single labelled training example: feature vector + ground truth relevance.
 */
export interface TrainingExample {
  features: FeatureVector;
  /** Ground truth relevance label in [0, 1] */
  label: number;
}

/**
 * Trained model weights and metadata for persistence.
 */
export interface LearnedModel {
  /** Learned weight per feature (length = FEATURE_COUNT) */
  weights: number[];
  /** Learned bias (intercept) term */
  bias: number;
  /** Regularization strength used during training */
  lambda: number;
  /** Number of training examples used */
  trainingSize: number;
  /** R-squared on training data */
  trainR2: number;
  /** ISO timestamp of training */
  trainedAt: string;
  /** Model version for forward compatibility */
  version: number;
}

/**
 * Per-fold result from Leave-One-Out Cross-Validation.
 */
export interface LOOCVFold {
  /** Index of the held-out example */
  foldIndex: number;
  /** Predicted value for the held-out example */
  predicted: number;
  /** Actual label for the held-out example */
  actual: number;
  /** Residual: actual - predicted */
  residual: number;
}

/**
 * Full LOOCV result.
 */
export interface LOOCVResult {
  /** Per-fold predictions and residuals */
  folds: LOOCVFold[];
  /** R-squared across all folds */
  r2: number;
  /** Mean absolute error across all folds */
  mae: number;
}

/**
 * SHAP-style feature importance entry.
 */
export interface FeatureImportance {
  feature: FeatureName;
  /** Absolute importance: |weight_i| * std(feature_i) */
  importance: number;
  /** The learned weight for this feature */
  weight: number;
  /** Standard deviation of this feature across training data */
  featureStd: number;
}

/**
 * Shadow scoring result comparing learned vs manual scores.
 */
export interface ShadowResult {
  /** Score from the learned combiner */
  learnedScore: number;
  /** Score from the manual / existing combiner */
  manualScore: number;
  /** Absolute delta between the two */
  delta: number;
}

/* ---------------------------------------------------------------
   2. FEATURE EXTRACTION
   --------------------------------------------------------------- */

/**
 * Clamp a numeric value to [0, 1], treating non-finite values as 0.
 */
function clamp01(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(1, value));
}

/**
 * Extract a normalized 8-feature vector from a scoring context.
 *
 * Each feature is clamped to [0, 1]. Missing values default to 0.
 * The feature order matches FEATURE_NAMES exactly.
 */
export function extractFeatureVector(ctx: ScoringContext): FeatureVector {
  return [
    clamp01(ctx.rrfScore),
    clamp01(ctx.overlapScore),
    clamp01(ctx.graphScore),
    clamp01(ctx.sessionScore),
    clamp01(ctx.causalScore),
    clamp01(ctx.feedbackScore),
    clamp01(ctx.validationScore),
    clamp01(ctx.artifactScore),
  ];
}

/* ---------------------------------------------------------------
   3. RIDGE REGRESSION
   --------------------------------------------------------------- */

/** Default regularization strength (L2 penalty). */
export const DEFAULT_LAMBDA = 0.1;

/** Current model version for serialization. */
export const MODEL_VERSION = 1;

/**
 * Compute the mean of an array of numbers.
 */
function mean(arr: number[]): number {
  if (arr.length === 0) return 0;
  let sum = 0;
  for (const v of arr) sum += v;
  return sum / arr.length;
}

/**
 * Compute the standard deviation of an array of numbers.
 */
function std(arr: number[]): number {
  if (arr.length < 2) return 0;
  const m = mean(arr);
  let sumSq = 0;
  for (const v of arr) sumSq += (v - m) * (v - m);
  return Math.sqrt(sumSq / arr.length);
}

/**
 * Compute R-squared (coefficient of determination) for predictions vs actuals.
 */
function computeR2(predictions: number[], actuals: number[]): number {
  const yMean = mean(actuals);
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < actuals.length; i++) {
    ssRes += (actuals[i] - predictions[i]) ** 2;
    ssTot += (actuals[i] - yMean) ** 2;
  }
  if (ssTot === 0) return 0; // All labels identical
  return 1 - ssRes / ssTot;
}

/**
 * Train a regularized linear ranker using Ridge Regression.
 *
 * Uses the closed-form solution: w = (X^T X + lambda * I)^{-1} X^T y
 *
 * The design matrix X is augmented with a bias column (column of 1s)
 * so the returned model includes a bias term.
 *
 * @param examples - Training data (features + labels)
 * @param lambda - L2 regularization strength (default 0.1)
 * @returns Trained model, or null if training fails (singular matrix, too few examples)
 */
export function trainRegularizedLinearRanker(
  examples: TrainingExample[],
  lambda: number = DEFAULT_LAMBDA,
): LearnedModel | null {
  if (examples.length < 2) return null;
  if (lambda < 0) lambda = 0;

  const n = examples.length;
  const d = FEATURE_COUNT;

  // Build design matrix X with bias column: [features | 1]
  // Dimensions: n x (d+1)
  const X: number[][] = [];
  const y: number[] = [];
  for (const ex of examples) {
    const row = [...ex.features, 1]; // bias column
    X.push(row);
    y.push(ex.label);
  }

  // X^T X: (d+1) x (d+1)
  const Xt = transpose(X);
  const XtX = matMul(Xt, X);

  // Add regularization: X^T X + lambda * I
  // Note: we do NOT regularize the bias term (last diagonal element)
  const regularized = addScaledIdentity(XtX, lambda);
  // Remove regularization from bias term
  regularized[d][d] -= lambda;

  // X^T y: (d+1) x 1
  const Xty = matVecMul(Xt, y.map(v => [v]).flat());

  // Solve: (X^T X + lambda I) w = X^T y
  const wFull = solveLinearSystem(regularized, Xty);
  if (!wFull) return null;

  const weights = wFull.slice(0, d);
  const bias = wFull[d];

  // Compute training predictions and R-squared
  const predictions = X.map(row => {
    let pred = 0;
    for (let j = 0; j <= d; j++) {
      pred += row[j] * wFull[j];
    }
    return Math.max(0, Math.min(1, pred));
  });

  const trainR2 = computeR2(predictions, y);

  return {
    weights,
    bias,
    lambda,
    trainingSize: n,
    trainR2,
    trainedAt: new Date().toISOString(),
    version: MODEL_VERSION,
  };
}

/**
 * Predict a score using a trained model.
 * Result is clamped to [0, 1].
 */
export function predict(model: LearnedModel, features: FeatureVector): number {
  let score = model.bias;
  for (let i = 0; i < FEATURE_COUNT; i++) {
    score += model.weights[i] * features[i];
  }
  return Math.max(0, Math.min(1, score));
}

/* ---------------------------------------------------------------
   4. LEAVE-ONE-OUT CROSS-VALIDATION (LOOCV)
   --------------------------------------------------------------- */

/**
 * Run Leave-One-Out Cross-Validation on the training data.
 *
 * For each fold, trains on all examples except one and predicts the held-out
 * example. Reports per-fold metrics and aggregate R-squared.
 *
 * @param examples - Full training dataset
 * @param lambda - Regularization strength
 * @returns LOOCV results with per-fold predictions and aggregate metrics
 */
export function runLOOCV(
  examples: TrainingExample[],
  lambda: number = DEFAULT_LAMBDA,
): LOOCVResult {
  const n = examples.length;
  if (n < 3) {
    return {
      folds: [],
      r2: 0,
      mae: 0,
    };
  }

  const folds: LOOCVFold[] = [];
  const predictions: number[] = [];
  const actuals: number[] = [];

  for (let i = 0; i < n; i++) {
    // Train on all except example i
    const trainSet = examples.filter((_, idx) => idx !== i);
    const model = trainRegularizedLinearRanker(trainSet, lambda);

    if (!model) {
      // If training fails on this fold, use 0 as prediction
      folds.push({
        foldIndex: i,
        predicted: 0,
        actual: examples[i].label,
        residual: examples[i].label,
      });
      predictions.push(0);
      actuals.push(examples[i].label);
      continue;
    }

    const pred = predict(model, examples[i].features);
    const actual = examples[i].label;

    folds.push({
      foldIndex: i,
      predicted: pred,
      actual,
      residual: actual - pred,
    });
    predictions.push(pred);
    actuals.push(actual);
  }

  const r2 = computeR2(predictions, actuals);

  let maeSum = 0;
  for (const fold of folds) {
    maeSum += Math.abs(fold.residual);
  }
  const mae = n > 0 ? maeSum / n : 0;

  return { folds, r2, mae };
}

/* ---------------------------------------------------------------
   5. SHAP FEATURE IMPORTANCE
   --------------------------------------------------------------- */

/**
 * Compute SHAP-style feature importance for a linear model.
 *
 * For linear models, the approximation is: importance_i = |weight_i| * std(feature_i).
 * This captures both the magnitude of the learned weight and the variability
 * of the feature in the training data.
 *
 * @param model - Trained model
 * @param examples - Training data used to compute feature statistics
 * @returns Ranked list of feature importances (descending)
 */
export function computeSHAP(
  model: LearnedModel,
  examples: TrainingExample[],
): FeatureImportance[] {
  const importances: FeatureImportance[] = [];

  for (let i = 0; i < FEATURE_COUNT; i++) {
    const featureValues = examples.map(ex => ex.features[i]);
    const featureStd = std(featureValues);
    const importance = Math.abs(model.weights[i]) * featureStd;

    importances.push({
      feature: FEATURE_NAMES[i],
      importance,
      weight: model.weights[i],
      featureStd,
    });
  }

  // Sort descending by importance
  importances.sort((a, b) => b.importance - a.importance);
  return importances;
}

/**
 * Compute exact linear SHAP values for a single instance.
 *
 * For linear models: shap_i = weight_i * (x_i - mean(x_i))
 *
 * @param model - Trained model
 * @param features - Feature vector for the instance
 * @param examples - Training data for computing feature means
 * @returns Per-feature SHAP contribution values
 */
export function computeExactLinearSHAP(
  model: LearnedModel,
  features: FeatureVector,
  examples: TrainingExample[],
): { feature: FeatureName; shapValue: number }[] {
  const result: { feature: FeatureName; shapValue: number }[] = [];

  for (let i = 0; i < FEATURE_COUNT; i++) {
    const featureValues = examples.map(ex => ex.features[i]);
    const featureMean = mean(featureValues);
    const shapValue = model.weights[i] * (features[i] - featureMean);

    result.push({
      feature: FEATURE_NAMES[i],
      shapValue,
    });
  }

  return result;
}

/* ---------------------------------------------------------------
   6. MODEL PERSISTENCE
   --------------------------------------------------------------- */

/**
 * Serialize a trained model to a JSON string for persistence.
 */
export function saveModel(model: LearnedModel): string {
  return JSON.stringify(model, null, 2);
}

/**
 * Deserialize a model from a JSON string.
 *
 * Returns null if the JSON is invalid, missing required fields,
 * or the model version is unsupported.
 *
 * Graceful degradation: returns null on any error rather than throwing.
 */
export function loadModel(json: string): LearnedModel | null {
  try {
    const parsed = JSON.parse(json);

    // Version check
    if (typeof parsed.version !== 'number' || parsed.version > MODEL_VERSION) {
      return null;
    }

    // Required field validation
    if (!Array.isArray(parsed.weights) || parsed.weights.length !== FEATURE_COUNT) {
      return null;
    }
    if (typeof parsed.bias !== 'number' || !Number.isFinite(parsed.bias)) {
      return null;
    }
    if (typeof parsed.lambda !== 'number' || !Number.isFinite(parsed.lambda)) {
      return null;
    }
    if (typeof parsed.trainingSize !== 'number') {
      return null;
    }

    // Validate all weights are finite numbers
    for (const w of parsed.weights) {
      if (typeof w !== 'number' || !Number.isFinite(w)) {
        return null;
      }
    }

    return {
      weights: parsed.weights,
      bias: parsed.bias,
      lambda: parsed.lambda,
      trainingSize: parsed.trainingSize,
      trainR2: typeof parsed.trainR2 === 'number' ? parsed.trainR2 : 0,
      trainedAt: typeof parsed.trainedAt === 'string' ? parsed.trainedAt : '',
      version: parsed.version,
    };
  } catch {
    return null;
  }
}

/* ---------------------------------------------------------------
   7. SHADOW SCORING
   --------------------------------------------------------------- */

/**
 * Run the learned combiner in shadow mode alongside the manual combiner.
 *
 * When the feature flag is OFF, returns null immediately (no overhead).
 * When ON, computes the learned score and returns both for comparison.
 *
 * @param model - Trained model (or null if no model available)
 * @param features - Feature vector for the current result
 * @param manualScore - Score from the existing manual combiner
 * @param flagEnabled - Whether the feature flag is ON
 * @returns Shadow result with both scores, or null if flag is OFF or no model
 */
export function shadowScore(
  model: LearnedModel | null,
  features: FeatureVector,
  manualScore: number,
  flagEnabled: boolean,
): ShadowResult | null {
  // No overhead when flag is OFF
  if (!flagEnabled) return null;

  // Graceful degradation: no model available yet
  if (!model) return null;

  const learnedScore = predict(model, features);
  const delta = Math.abs(learnedScore - manualScore);

  return {
    learnedScore,
    manualScore,
    delta,
  };
}
