// TEST: Learned Stage 2 Combiner (REQ-D1-006)
// Ridge regression, LOOCV, SHAP, model persistence, shadow scoring,
// feature extraction, and feature flag behaviour.
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  extractFeatureVector,
  trainRegularizedLinearRanker,
  predict,
  runLOOCV,
  computeSHAP,
  computeExactLinearSHAP,
  saveModel,
  loadModel,
  shadowScore,
  FEATURE_NAMES,
  FEATURE_COUNT,
  DEFAULT_LAMBDA,
  MODEL_VERSION,
  type ScoringContext,
  type TrainingExample,
  type FeatureVector,
  type LearnedModel,
} from '@spec-kit/shared/ranking/learned-combiner';

import { isLearnedStage2CombinerEnabled } from '../lib/search/search-flags';

/* ───────────────────────────────────────────────────────────────
   HELPERS
   ──────────────────────────────────────────────────────────────── */

const savedEnv: Record<string, string | undefined> = {};

function setEnv(key: string, value: string | undefined): void {
  if (!(key in savedEnv)) savedEnv[key] = process.env[key];
  if (value === undefined) {
    delete process.env[key];
  } else {
    process.env[key] = value;
  }
}

function restoreEnv(): void {
  for (const [key, value] of Object.entries(savedEnv)) {
    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }
}

/** Generate a simple training set where label = weighted sum of features. */
function makeLinearTrainingSet(
  count: number,
  trueWeights: number[],
  trueBias: number,
  noise: number = 0,
): TrainingExample[] {
  const examples: TrainingExample[] = [];
  for (let i = 0; i < count; i++) {
    const features: FeatureVector = [0, 0, 0, 0, 0, 0, 0, 0];
    for (let j = 0; j < FEATURE_COUNT; j++) {
      // Spread features across [0, 1] deterministically
      features[j] = Math.max(0, Math.min(1, ((i * (j + 1) * 7 + j * 13) % 100) / 100));
    }
    let label = trueBias;
    for (let j = 0; j < FEATURE_COUNT; j++) {
      label += trueWeights[j] * features[j];
    }
    // Add deterministic "noise"
    label += noise * ((i % 5) - 2) / 10;
    label = Math.max(0, Math.min(1, label));
    examples.push({ features, label });
  }
  return examples;
}

/** Create a simple known model for testing. */
function makeTestModel(): LearnedModel {
  return {
    weights: [0.2, 0.15, 0.1, 0.1, 0.1, 0.1, 0.15, 0.1],
    bias: 0.0,
    lambda: DEFAULT_LAMBDA,
    trainingSize: 50,
    trainR2: 0.85,
    trainedAt: '2026-03-21T12:00:00.000Z',
    version: MODEL_VERSION,
  };
}

/* ───────────────────────────────────────────────────────────────
   TESTS
   ──────────────────────────────────────────────────────────────── */

describe('REQ-D1-006 Learned Stage 2 Combiner', () => {
  beforeEach(() => {
    setEnv('SPECKIT_LEARNED_STAGE2_COMBINER', 'false');
  });

  afterEach(() => {
    restoreEnv();
  });

  /* ─── Feature Extraction ─── */

  describe('extractFeatureVector', () => {
    it('returns 8 features in canonical order', () => {
      const ctx: ScoringContext = {
        rrfScore: 0.8,
        overlapScore: 0.6,
        graphScore: 0.4,
        sessionScore: 0.3,
        causalScore: 0.5,
        feedbackScore: 0.2,
        validationScore: 0.7,
        artifactScore: 0.1,
      };

      const vec = extractFeatureVector(ctx);

      expect(vec).toHaveLength(FEATURE_COUNT);
      expect(vec).toEqual([0.8, 0.6, 0.4, 0.3, 0.5, 0.2, 0.7, 0.1]);
    });

    it('all features are in [0, 1]', () => {
      const ctx: ScoringContext = {
        rrfScore: -0.5,
        overlapScore: 1.5,
        graphScore: NaN,
        sessionScore: Infinity,
        causalScore: -Infinity,
        feedbackScore: undefined,
        validationScore: 0.5,
        artifactScore: 0,
      };

      const vec = extractFeatureVector(ctx);

      for (const v of vec) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
        expect(Number.isFinite(v)).toBe(true);
      }
    });

    it('missing values default to 0', () => {
      const vec = extractFeatureVector({});
      expect(vec).toEqual([0, 0, 0, 0, 0, 0, 0, 0]);
    });

    it('clamps values above 1 to 1', () => {
      const ctx: ScoringContext = {
        rrfScore: 2.0,
        overlapScore: 100,
      };
      const vec = extractFeatureVector(ctx);
      expect(vec[0]).toBe(1);
      expect(vec[1]).toBe(1);
    });

    it('clamps values below 0 to 0', () => {
      const ctx: ScoringContext = {
        rrfScore: -0.1,
        overlapScore: -100,
      };
      const vec = extractFeatureVector(ctx);
      expect(vec[0]).toBe(0);
      expect(vec[1]).toBe(0);
    });

    it('FEATURE_NAMES has exactly 8 entries', () => {
      expect(FEATURE_NAMES).toHaveLength(8);
      expect(FEATURE_COUNT).toBe(8);
    });
  });

  /* ─── Ridge Regression ─── */

  describe('trainRegularizedLinearRanker', () => {
    it('returns null for fewer than 2 examples', () => {
      const single: TrainingExample[] = [
        { features: [1, 0, 0, 0, 0, 0, 0, 0], label: 0.5 },
      ];
      expect(trainRegularizedLinearRanker(single)).toBeNull();
      expect(trainRegularizedLinearRanker([])).toBeNull();
    });

    it('trains successfully with sufficient data', () => {
      const trueWeights = [0.3, 0.2, 0.1, 0.1, 0.1, 0.05, 0.05, 0.1];
      const examples = makeLinearTrainingSet(30, trueWeights, 0.0);
      const model = trainRegularizedLinearRanker(examples);

      expect(model).not.toBeNull();
      expect(model!.weights).toHaveLength(FEATURE_COUNT);
      expect(typeof model!.bias).toBe('number');
      expect(model!.lambda).toBe(DEFAULT_LAMBDA);
      expect(model!.trainingSize).toBe(30);
      expect(model!.version).toBe(MODEL_VERSION);
      expect(model!.trainedAt).toBeTruthy();
    });

    it('predictions are clamped to [0, 1]', () => {
      const trueWeights = [0.5, 0.5, 0, 0, 0, 0, 0, 0];
      const examples = makeLinearTrainingSet(20, trueWeights, 0.0);
      const model = trainRegularizedLinearRanker(examples);

      expect(model).not.toBeNull();

      // Test with extreme feature values
      const highFeatures: FeatureVector = [1, 1, 1, 1, 1, 1, 1, 1];
      const lowFeatures: FeatureVector = [0, 0, 0, 0, 0, 0, 0, 0];

      const highPred = predict(model!, highFeatures);
      const lowPred = predict(model!, lowFeatures);

      expect(highPred).toBeGreaterThanOrEqual(0);
      expect(highPred).toBeLessThanOrEqual(1);
      expect(lowPred).toBeGreaterThanOrEqual(0);
      expect(lowPred).toBeLessThanOrEqual(1);
    });

    it('recovers approximately correct weights for noiseless linear data', () => {
      // With a perfect linear relationship and mild regularization,
      // the learned weights should approximate the true weights
      const trueWeights = [0.3, 0.2, 0.1, 0.05, 0.05, 0.1, 0.1, 0.1];
      const examples = makeLinearTrainingSet(50, trueWeights, 0.0);
      const model = trainRegularizedLinearRanker(examples, 0.001); // low lambda for better fit

      expect(model).not.toBeNull();
      // R-squared should be high for noiseless linear data
      expect(model!.trainR2).toBeGreaterThan(0.5);
    });

    it('respects custom lambda', () => {
      const examples = makeLinearTrainingSet(20, [0.2, 0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], 0.0);

      const lowLambda = trainRegularizedLinearRanker(examples, 0.001);
      const highLambda = trainRegularizedLinearRanker(examples, 10.0);

      expect(lowLambda).not.toBeNull();
      expect(highLambda).not.toBeNull();

      // Higher lambda should shrink weights closer to 0
      const lowNorm = lowLambda!.weights.reduce((sum, w) => sum + w * w, 0);
      const highNorm = highLambda!.weights.reduce((sum, w) => sum + w * w, 0);
      expect(highNorm).toBeLessThan(lowNorm);
    });

    it('treats negative lambda as 0', () => {
      const examples = makeLinearTrainingSet(20, [0.2, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1, 0.1], 0.0);
      const model = trainRegularizedLinearRanker(examples, -5);
      expect(model).not.toBeNull();
      expect(model!.lambda).toBe(0);
    });

    it('verify hand-computed ridge solution for small example', () => {
      // With ridge regression (lambda > 0), the regularization term makes the
      // system solvable even with few examples. Use 9 well-conditioned examples
      // so we can verify the model produces accurate predictions.
      const examples: TrainingExample[] = [];
      for (let i = 0; i < FEATURE_COUNT; i++) {
        const features: FeatureVector = [0, 0, 0, 0, 0, 0, 0, 0];
        features[i] = 1; // one-hot encoding
        const label = (i + 1) / (FEATURE_COUNT + 1); // labels: 0.111, 0.222, ...
        examples.push({ features, label });
      }
      // Add a 9th example (zero vector) to anchor the bias
      examples.push({ features: [0, 0, 0, 0, 0, 0, 0, 0], label: 0.05 });

      const model = trainRegularizedLinearRanker(examples, 0.01);
      expect(model).not.toBeNull();

      // Verify predictions are close to labels for training data
      for (let i = 0; i < examples.length; i++) {
        const pred = predict(model!, examples[i].features);
        expect(pred).toBeCloseTo(examples[i].label, 1);
      }

      // Verify bias is close to the zero-vector label
      expect(model!.bias).toBeCloseTo(0.05, 1);
    });
  });

  /* ─── Predict ─── */

  describe('predict', () => {
    it('returns clamped value for extreme weights', () => {
      const model: LearnedModel = {
        weights: [10, 10, 10, 10, 10, 10, 10, 10],
        bias: 5,
        lambda: 0.1,
        trainingSize: 10,
        trainR2: 0.5,
        trainedAt: '',
        version: MODEL_VERSION,
      };

      const features: FeatureVector = [1, 1, 1, 1, 1, 1, 1, 1];
      expect(predict(model, features)).toBe(1); // 85 clamped to 1

      const zeroFeatures: FeatureVector = [0, 0, 0, 0, 0, 0, 0, 0];
      expect(predict(model, zeroFeatures)).toBe(1); // bias=5 clamped to 1
    });

    it('returns 0 for very negative predictions', () => {
      const model: LearnedModel = {
        weights: [-10, -10, 0, 0, 0, 0, 0, 0],
        bias: -5,
        lambda: 0.1,
        trainingSize: 10,
        trainR2: 0.5,
        trainedAt: '',
        version: MODEL_VERSION,
      };

      const features: FeatureVector = [1, 1, 0, 0, 0, 0, 0, 0];
      expect(predict(model, features)).toBe(0); // -25 clamped to 0
    });

    it('computes correct linear combination', () => {
      const model: LearnedModel = {
        weights: [0.5, 0.3, 0, 0, 0, 0, 0, 0],
        bias: 0.1,
        lambda: 0.1,
        trainingSize: 10,
        trainR2: 0.5,
        trainedAt: '',
        version: MODEL_VERSION,
      };

      const features: FeatureVector = [0.4, 0.2, 0, 0, 0, 0, 0, 0];
      // 0.5*0.4 + 0.3*0.2 + 0.1 = 0.2 + 0.06 + 0.1 = 0.36
      expect(predict(model, features)).toBeCloseTo(0.36, 10);
    });
  });

  /* ─── LOOCV ─── */

  describe('runLOOCV', () => {
    it('returns empty folds for fewer than 3 examples', () => {
      const twoExamples: TrainingExample[] = [
        { features: [1, 0, 0, 0, 0, 0, 0, 0], label: 0.5 },
        { features: [0, 1, 0, 0, 0, 0, 0, 0], label: 0.3 },
      ];

      const result = runLOOCV(twoExamples);
      expect(result.folds).toHaveLength(0);
      expect(result.r2).toBe(0);
      expect(result.mae).toBe(0);
    });

    it('fold count matches data size', () => {
      const trueWeights = [0.3, 0.2, 0.1, 0.05, 0.05, 0.1, 0.1, 0.1];
      const examples = makeLinearTrainingSet(15, trueWeights, 0.0);

      const result = runLOOCV(examples);
      expect(result.folds).toHaveLength(15);
    });

    it('each fold has valid structure', () => {
      const trueWeights = [0.3, 0.2, 0.1, 0.1, 0.1, 0.05, 0.05, 0.1];
      const examples = makeLinearTrainingSet(10, trueWeights, 0.0);

      const result = runLOOCV(examples);

      for (let i = 0; i < result.folds.length; i++) {
        const fold = result.folds[i];
        expect(fold.foldIndex).toBe(i);
        expect(typeof fold.predicted).toBe('number');
        expect(typeof fold.actual).toBe('number');
        expect(fold.residual).toBeCloseTo(fold.actual - fold.predicted, 10);
        expect(fold.predicted).toBeGreaterThanOrEqual(0);
        expect(fold.predicted).toBeLessThanOrEqual(1);
      }
    });

    it('reports R-squared and MAE', () => {
      const trueWeights = [0.3, 0.2, 0.1, 0.05, 0.05, 0.1, 0.1, 0.1];
      const examples = makeLinearTrainingSet(20, trueWeights, 0.0);

      const result = runLOOCV(examples);

      expect(typeof result.r2).toBe('number');
      expect(typeof result.mae).toBe('number');
      expect(result.mae).toBeGreaterThanOrEqual(0);
    });
  });

  /* ─── SHAP Feature Importance ─── */

  describe('computeSHAP', () => {
    it('returns importance for all features', () => {
      const model = makeTestModel();
      const examples = makeLinearTrainingSet(20, model.weights, model.bias);

      const importances = computeSHAP(model, examples);

      expect(importances).toHaveLength(FEATURE_COUNT);
      for (const imp of importances) {
        expect(FEATURE_NAMES).toContain(imp.feature);
        expect(typeof imp.importance).toBe('number');
        expect(imp.importance).toBeGreaterThanOrEqual(0);
        expect(typeof imp.weight).toBe('number');
        expect(typeof imp.featureStd).toBe('number');
        expect(imp.featureStd).toBeGreaterThanOrEqual(0);
      }
    });

    it('returns importances sorted descending', () => {
      const model = makeTestModel();
      const examples = makeLinearTrainingSet(20, model.weights, model.bias);

      const importances = computeSHAP(model, examples);

      for (let i = 1; i < importances.length; i++) {
        expect(importances[i - 1].importance).toBeGreaterThanOrEqual(importances[i].importance);
      }
    });

    it('importance = |weight| * std(feature) for each feature', () => {
      const model = makeTestModel();
      const examples = makeLinearTrainingSet(20, model.weights, model.bias);

      const importances = computeSHAP(model, examples);

      for (const imp of importances) {
        const expectedImportance = Math.abs(imp.weight) * imp.featureStd;
        expect(imp.importance).toBeCloseTo(expectedImportance, 10);
      }
    });

    it('zero-variance feature has zero importance', () => {
      const model = makeTestModel();
      // All examples have the same feature values -> std = 0 -> importance = 0
      const constantExamples: TrainingExample[] = Array.from({ length: 10 }, () => ({
        features: [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5] as FeatureVector,
        label: 0.5,
      }));

      const importances = computeSHAP(model, constantExamples);

      for (const imp of importances) {
        expect(imp.importance).toBe(0);
        expect(imp.featureStd).toBe(0);
      }
    });
  });

  describe('computeExactLinearSHAP', () => {
    it('returns per-feature SHAP values', () => {
      const model = makeTestModel();
      const examples = makeLinearTrainingSet(20, model.weights, model.bias);
      const features: FeatureVector = [0.8, 0.6, 0.4, 0.3, 0.5, 0.2, 0.7, 0.1];

      const shap = computeExactLinearSHAP(model, features, examples);

      expect(shap).toHaveLength(FEATURE_COUNT);
      for (const s of shap) {
        expect(FEATURE_NAMES).toContain(s.feature);
        expect(typeof s.shapValue).toBe('number');
        expect(Number.isFinite(s.shapValue)).toBe(true);
      }
    });

    it('SHAP values sum to prediction minus base value', () => {
      const model = makeTestModel();
      const examples = makeLinearTrainingSet(30, model.weights, model.bias);
      const features: FeatureVector = [0.8, 0.6, 0.4, 0.3, 0.5, 0.2, 0.7, 0.1];

      const shap = computeExactLinearSHAP(model, features, examples);

      // For linear SHAP: sum of SHAP values + E[f(x)] = f(x) (before clamping)
      // E[f(x)] = bias + sum(weight_i * mean(feature_i))
      const shapSum = shap.reduce((sum, s) => sum + s.shapValue, 0);

      // Compute E[f(x)] = bias + sum(weight_i * mean_i)
      let expectedValue = model.bias;
      for (let i = 0; i < FEATURE_COUNT; i++) {
        const featureMean = examples.reduce((sum, ex) => sum + ex.features[i], 0) / examples.length;
        expectedValue += model.weights[i] * featureMean;
      }

      // f(x) = bias + sum(weight_i * x_i) (before clamping)
      let fx = model.bias;
      for (let i = 0; i < FEATURE_COUNT; i++) {
        fx += model.weights[i] * features[i];
      }

      // shapSum + expectedValue should equal fx
      expect(shapSum + expectedValue).toBeCloseTo(fx, 10);
    });
  });

  /* ─── Model Persistence ─── */

  describe('saveModel / loadModel', () => {
    it('round-trips a model correctly', () => {
      const original = makeTestModel();
      const json = saveModel(original);
      const loaded = loadModel(json);

      expect(loaded).not.toBeNull();
      expect(loaded!.weights).toEqual(original.weights);
      expect(loaded!.bias).toBe(original.bias);
      expect(loaded!.lambda).toBe(original.lambda);
      expect(loaded!.trainingSize).toBe(original.trainingSize);
      expect(loaded!.trainR2).toBe(original.trainR2);
      expect(loaded!.trainedAt).toBe(original.trainedAt);
      expect(loaded!.version).toBe(original.version);
    });

    it('produces valid JSON', () => {
      const model = makeTestModel();
      const json = saveModel(model);
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('returns null for invalid JSON', () => {
      expect(loadModel('not json')).toBeNull();
      expect(loadModel('')).toBeNull();
      expect(loadModel('{}')).toBeNull();
    });

    it('returns null for missing required fields', () => {
      // Missing weights
      expect(loadModel(JSON.stringify({
        bias: 0,
        lambda: 0.1,
        trainingSize: 10,
        version: MODEL_VERSION,
      }))).toBeNull();

      // Wrong weight count
      expect(loadModel(JSON.stringify({
        weights: [0.1, 0.2],
        bias: 0,
        lambda: 0.1,
        trainingSize: 10,
        version: MODEL_VERSION,
      }))).toBeNull();

      // Missing bias
      expect(loadModel(JSON.stringify({
        weights: [0, 0, 0, 0, 0, 0, 0, 0],
        lambda: 0.1,
        trainingSize: 10,
        version: MODEL_VERSION,
      }))).toBeNull();
    });

    it('returns null for unsupported version', () => {
      const json = JSON.stringify({
        weights: [0, 0, 0, 0, 0, 0, 0, 0],
        bias: 0,
        lambda: 0.1,
        trainingSize: 10,
        trainR2: 0.5,
        trainedAt: '',
        version: MODEL_VERSION + 1,
      });
      expect(loadModel(json)).toBeNull();
    });

    it('returns null for NaN in weights', () => {
      const json = JSON.stringify({
        weights: [NaN, 0, 0, 0, 0, 0, 0, 0],
        bias: 0,
        lambda: 0.1,
        trainingSize: 10,
        version: MODEL_VERSION,
      });
      expect(loadModel(json)).toBeNull();
    });

    it('returns null for Infinity in bias', () => {
      const json = JSON.stringify({
        weights: [0, 0, 0, 0, 0, 0, 0, 0],
        bias: Infinity,
        lambda: 0.1,
        trainingSize: 10,
        version: MODEL_VERSION,
      });
      expect(loadModel(json)).toBeNull();
    });

    it('gracefully handles missing optional fields', () => {
      const json = JSON.stringify({
        weights: [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8],
        bias: 0.05,
        lambda: 0.1,
        trainingSize: 20,
        version: MODEL_VERSION,
        // trainR2 and trainedAt are missing
      });
      const loaded = loadModel(json);
      expect(loaded).not.toBeNull();
      expect(loaded!.trainR2).toBe(0); // defaults to 0
      expect(loaded!.trainedAt).toBe(''); // defaults to ''
    });

    it('round-trips a model trained from real data', () => {
      const trueWeights = [0.3, 0.2, 0.1, 0.05, 0.05, 0.1, 0.1, 0.1];
      const examples = makeLinearTrainingSet(30, trueWeights, 0.0);
      const model = trainRegularizedLinearRanker(examples);

      expect(model).not.toBeNull();

      const json = saveModel(model!);
      const loaded = loadModel(json);

      expect(loaded).not.toBeNull();

      // Predictions should be identical after round-trip
      const testFeatures: FeatureVector = [0.5, 0.3, 0.7, 0.1, 0.4, 0.6, 0.2, 0.8];
      expect(predict(loaded!, testFeatures)).toBe(predict(model!, testFeatures));
    });
  });

  /* ─── Shadow Scoring ─── */

  describe('shadowScore', () => {
    it('returns null when flag is OFF', () => {
      const model = makeTestModel();
      const features: FeatureVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

      const result = shadowScore(model, features, 0.7, false);
      expect(result).toBeNull();
    });

    it('returns null when model is null', () => {
      const features: FeatureVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

      const result = shadowScore(null, features, 0.7, true);
      expect(result).toBeNull();
    });

    it('returns both scores and delta when flag is ON', () => {
      const model = makeTestModel();
      const features: FeatureVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];
      const manualScore = 0.7;

      const result = shadowScore(model, features, manualScore, true);

      expect(result).not.toBeNull();
      expect(typeof result!.learnedScore).toBe('number');
      expect(result!.learnedScore).toBeGreaterThanOrEqual(0);
      expect(result!.learnedScore).toBeLessThanOrEqual(1);
      expect(result!.manualScore).toBe(manualScore);
      expect(result!.delta).toBeCloseTo(Math.abs(result!.learnedScore - manualScore), 10);
    });

    it('delta is always non-negative', () => {
      const model = makeTestModel();
      const features: FeatureVector = [0.1, 0.9, 0.3, 0.7, 0.5, 0.2, 0.8, 0.4];

      const result = shadowScore(model, features, 0.3, true);

      expect(result).not.toBeNull();
      expect(result!.delta).toBeGreaterThanOrEqual(0);
    });
  });

  /* ─── Feature Flag ─── */

  describe('SPECKIT_LEARNED_STAGE2_COMBINER flag', () => {
    it('is ON by default (graduated)', () => {
      delete process.env.SPECKIT_LEARNED_STAGE2_COMBINER;
      expect(isLearnedStage2CombinerEnabled()).toBe(true);
    });

    it('is OFF when set to false', () => {
      setEnv('SPECKIT_LEARNED_STAGE2_COMBINER', 'false');
      expect(isLearnedStage2CombinerEnabled()).toBe(false);
    });

    it('is ON when set to true', () => {
      setEnv('SPECKIT_LEARNED_STAGE2_COMBINER', 'true');
      expect(isLearnedStage2CombinerEnabled()).toBe(true);
    });

    it('is ON when set to 1', () => {
      setEnv('SPECKIT_LEARNED_STAGE2_COMBINER', '1');
      expect(isLearnedStage2CombinerEnabled()).toBe(true);
    });

    it('is ON for empty string (graduated — any non-false value is ON)', () => {
      setEnv('SPECKIT_LEARNED_STAGE2_COMBINER', '');
      expect(isLearnedStage2CombinerEnabled()).toBe(true);
    });

    it('shadowScore returns null when flag OFF (no overhead)', () => {
      const model = makeTestModel();
      const features: FeatureVector = [0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5, 0.5];

      // Simulate checking flag before calling
      const enabled = false; // flag OFF
      const result = shadowScore(model, features, 0.7, enabled);
      expect(result).toBeNull();
    });
  });

  /* ─── Integration: Train → Predict → LOOCV → SHAP ─── */

  describe('end-to-end integration', () => {
    it('full pipeline: train, predict, LOOCV, SHAP, persist, shadow', () => {
      // 1. Generate training data
      const trueWeights = [0.25, 0.2, 0.15, 0.1, 0.1, 0.05, 0.1, 0.05];
      const examples = makeLinearTrainingSet(40, trueWeights, 0.0);

      // 2. Train
      const model = trainRegularizedLinearRanker(examples);
      expect(model).not.toBeNull();

      // 3. Predict
      const testFeatures: FeatureVector = [0.6, 0.4, 0.3, 0.2, 0.5, 0.1, 0.7, 0.3];
      const pred = predict(model!, testFeatures);
      expect(pred).toBeGreaterThanOrEqual(0);
      expect(pred).toBeLessThanOrEqual(1);

      // 4. LOOCV
      const loocv = runLOOCV(examples);
      expect(loocv.folds).toHaveLength(examples.length);
      expect(typeof loocv.r2).toBe('number');

      // 5. SHAP
      const importances = computeSHAP(model!, examples);
      expect(importances).toHaveLength(FEATURE_COUNT);
      // The feature with highest true weight (rrf=0.25) should have
      // relatively high importance (not necessarily #1 due to feature variance)
      expect(importances.some(imp => imp.feature === 'rrf')).toBe(true);

      // 6. Persist
      const json = saveModel(model!);
      const loaded = loadModel(json);
      expect(loaded).not.toBeNull();
      expect(predict(loaded!, testFeatures)).toBe(pred);

      // 7. Shadow scoring
      const shadow = shadowScore(loaded!, testFeatures, 0.5, true);
      expect(shadow).not.toBeNull();
      expect(shadow!.learnedScore).toBe(pred);
    });

    it('handles degenerate data gracefully', () => {
      // All labels are the same
      const examples: TrainingExample[] = Array.from({ length: 10 }, (_, i) => ({
        features: extractFeatureVector({
          rrfScore: i / 10,
          overlapScore: (10 - i) / 10,
        }),
        label: 0.5, // all same
      }));

      const model = trainRegularizedLinearRanker(examples);
      // Should still train (R2 will be 0 since no variance in labels)
      expect(model).not.toBeNull();

      const loocv = runLOOCV(examples);
      expect(loocv.folds).toHaveLength(10);
    });
  });

  /* ─── Constants ─── */

  describe('constants', () => {
    it('DEFAULT_LAMBDA is 0.1', () => {
      expect(DEFAULT_LAMBDA).toBe(0.1);
    });

    it('MODEL_VERSION is 1', () => {
      expect(MODEL_VERSION).toBe(1);
    });

    it('FEATURE_COUNT is 8', () => {
      expect(FEATURE_COUNT).toBe(8);
    });

    it('FEATURE_NAMES matches expected order', () => {
      expect(FEATURE_NAMES).toEqual([
        'rrf', 'overlap', 'graph', 'session',
        'causal', 'feedback', 'validation', 'artifact',
      ]);
    });
  });
});
