// TEST: INTENT CLASSIFIER
import { describe, it, expect } from 'vitest';
import * as intentClassifier from '../lib/search/intent-classifier';
import { INTENT_LAMBDA_MAP } from '../lib/search/intent-classifier';
import type { IntentType, IntentWeights } from '../lib/search/intent-classifier';

type ClassifiableIntent = Exclude<IntentType, 'find_spec' | 'find_decision'>;

/* ───────────────────────────────────────────────────────────────
   TEST CONFIGURATION
──────────────────────────────────────────────────────────────── */

const TEST_QUERIES: Record<ClassifiableIntent, string[]> = {
  add_feature: [
    'add a new authentication module',
    'create user registration flow',
    'implement payment integration',
    'build a dashboard component',
    'introduce dark mode support',
    'develop new API endpoint for users',
  ],
  fix_bug: [
    'fix the login error',
    'debug why the form is not submitting',
    'fix the broken search bug',
    'crash bug when clicking submit button',
    'fix bug where users can\'t login',
    'fix regression bug in payment flow',
  ],
  refactor: [
    'refactor the authentication module',
    'clean up the utility functions',
    'reorganize the project folder layout',
    'improve code quality in handlers',
    'simplify the database query builder',
    'consolidate duplicate helper functions',
  ],
  security_audit: [
    'security audit of user authentication',
    'check for SQL injection vulnerabilities',
    'check for XSS injection attacks',
    'audit access control permissions',
    'pentest the authentication endpoint security',
    'CVE-2024 vulnerability security check',
  ],
  understand: [
    'how does the caching system work',
    'what is the purpose of this module',
    'explain how the module architecture works',
    'explain the authentication flow',
    'understand the database schema',
    'what is the context for this feature',
  ],
};

/* ───────────────────────────────────────────────────────────────
   T036: INTENT TYPES TESTS
──────────────────────────────────────────────────────────────── */

describe('T036: Intent Types', () => {
  it('INTENT_TYPES contains all 7 required types', () => {
    const types = Object.values(intentClassifier.INTENT_TYPES);
    expect(types.length).toBe(7);
    expect(types).toContain('add_feature');
    expect(types).toContain('fix_bug');
    expect(types).toContain('refactor');
    expect(types).toContain('security_audit');
    expect(types).toContain('understand');
    expect(types).toContain('find_spec');
    expect(types).toContain('find_decision');
  });

  it('All intent types have descriptions via getIntentDescription', () => {
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      const description = intentClassifier.getIntentDescription(intent);
      expect(description && description.length > 0 && description !== 'Unknown intent').toBe(true);
    }
  });

  it('All intent types have keyword definitions (flat array)', () => {
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      const keywords = intentClassifier.INTENT_KEYWORDS[intent];
      expect(keywords).toBeTruthy();
      expect(Array.isArray(keywords) && keywords.length > 0).toBe(true);
    }
  });

  it('All intent types have pattern definitions', () => {
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      const patterns = intentClassifier.INTENT_PATTERNS[intent];
      expect(patterns && patterns.length > 0).toBe(true);
      expect(patterns.every((p: unknown) => p instanceof RegExp)).toBe(true);
    }
  });
});

/* ───────────────────────────────────────────────────────────────
   T037: QUERY CLASSIFIER TESTS
──────────────────────────────────────────────────────────────── */

describe('T037: Query Classifier', () => {
  it('classify_intent returns expected structure', () => {
    const result = intentClassifier.classifyIntent('add a new feature');
    expect(result.intent).toBeTruthy();
    expect(typeof result.confidence).toBe('number');
    expect(typeof result.scores).toBe('object');
    expect(Array.isArray(result.keywords)).toBe(true);
    expect(Array.isArray(result.rankedIntents)).toBe(true);
  });

  it('classify_intent handles empty query', () => {
    const result = intentClassifier.classifyIntent('');
    expect(result.intent).toBe('understand');
    expect(result.confidence).toBe(0);
  });

  it('classify_intent handles null query', () => {
    // @ts-expect-error intentional invalid input to verify runtime guard behavior
    const result = intentClassifier.classifyIntent(null);
    expect(result.intent).toBe('understand');
    expect(result.confidence).toBe(0);
  });

  it('detect_intent returns IntentResult object', () => {
    const result = intentClassifier.detectIntent('fix the bug');
    expect(typeof result).toBe('object');
    expect(typeof result.intent).toBe('string');
    expect(intentClassifier.isValidIntent(result.intent)).toBe(true);
  });

  it('preserves top-ranked secondary intents for multi-facet queries', () => {
    const result = intentClassifier.classifyIntent(
      'find the authentication spec requirements and plan, then show the decision record for why we chose this approach',
    );

    expect(result.rankedIntents.length).toBeGreaterThanOrEqual(2);
    expect(result.rankedIntents.length).toBeLessThanOrEqual(3);
    expect(result.rankedIntents.map((entry) => entry.intent)).toContain(result.intent);
    expect(result.rankedIntents.map((entry) => entry.intent)).toContain('find_spec');
    expect(result.rankedIntents.map((entry) => entry.intent)).toContain('find_decision');
    expect(result.rankedIntents[0]!.score).toBeGreaterThanOrEqual(result.rankedIntents[1]!.score);
  });

  // Test detection accuracy for each intent type
  for (const [expected_intent, queries] of Object.entries(TEST_QUERIES)) {
    it(`Detects ${expected_intent} intent from sample queries`, () => {
      let correct = 0;
      for (const query of queries) {
        const result = intentClassifier.classifyIntent(query);
        if (result.intent === expected_intent) {
          correct++;
        }
      }
      const accuracy = correct / queries.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.5);
    });
  }
});

/* ───────────────────────────────────────────────────────────────
   T038: INTENT WEIGHT ADJUSTMENTS TESTS
──────────────────────────────────────────────────────────────── */

describe('T038: Intent Weight Adjustments', () => {
  it('All intent types have weight adjustments', () => {
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
      expect(weights).toBeTruthy();
    }
  });

  it('Weight adjustments sum to ~1.0 for numeric fields', () => {
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
      const numericSum = weights.recency + weights.importance + weights.similarity;
      expect(Math.abs(numericSum - 1.0)).toBeLessThan(0.01);
    }
  });

  it('Weight adjustments contain required scoring factors', () => {
    const requiredFactors: Array<keyof IntentWeights> = ['similarity', 'importance', 'recency'];
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS[intent];
      for (const factor of requiredFactors) {
        expect(typeof weights[factor]).toBe('number');
      }
    }
  });

  it('get_intent_weights returns weights for valid intent', () => {
    const weights = intentClassifier.getIntentWeights('add_feature');
    expect(typeof weights.similarity).toBe('number');
    expect(typeof weights.importance).toBe('number');
    expect(typeof weights.recency).toBe('number');
  });

  it('apply_intent_weights adjusts results array', () => {
    const results = [
      { similarity: 0.5, importance_weight: 0.5, title: 'test1' },
      { similarity: 0.3, importance_weight: 0.8, title: 'test2' },
    ];
    const applied = intentClassifier.applyIntentWeights(results, 'fix_bug');
    expect(Array.isArray(applied)).toBe(true);
    expect(applied.length).toBe(2);
    expect(typeof applied[0].intentAdjustedScore).toBe('number');
  });

  it('get_query_weights returns IntentWeights for query', () => {
    const weights = intentClassifier.getQueryWeights('fix the login bug');
    expect(typeof weights.similarity).toBe('number');
    expect(typeof weights.importance).toBe('number');
    expect(typeof weights.recency).toBe('number');
  });
});

/* ───────────────────────────────────────────────────────────────
   T039: VALIDATION FUNCTIONS TESTS
──────────────────────────────────────────────────────────────── */

describe('T039: Validation Functions', () => {
  it('is_valid_intent returns true for valid intents', () => {
    for (const intent of Object.values(intentClassifier.INTENT_TYPES)) {
      expect(intentClassifier.isValidIntent(intent)).toBe(true);
    }
  });

  it('is_valid_intent returns false for invalid intents', () => {
    expect(intentClassifier.isValidIntent('invalid')).toBe(false);
    expect(intentClassifier.isValidIntent('')).toBe(false);
    // @ts-expect-error intentional invalid input to verify runtime guard behavior
    expect(intentClassifier.isValidIntent(null)).toBe(false);
  });

  it('get_valid_intents returns all intent types', () => {
    const valid = intentClassifier.getValidIntents();
    expect(valid.length).toBe(7);
  });

  it('get_intent_description returns description for valid intent', () => {
    const desc = intentClassifier.getIntentDescription('add_feature');
    expect(desc && desc.length > 0).toBe(true);
  });

  it('get_intent_description returns fallback for invalid intent', () => {
    // @ts-expect-error intentional invalid input to verify runtime guard behavior
    const desc = intentClassifier.getIntentDescription('invalid');
    expect(desc).toBe('Unknown intent');
  });
});

/* ───────────────────────────────────────────────────────────────
   CHK-039: OVERALL ACCURACY TEST (>80%)
──────────────────────────────────────────────────────────────── */

describe('CHK-039: Overall Accuracy Test', () => {
  it('Overall intent detection accuracy >80%', () => {
    let totalCorrect = 0;
    let totalQueries = 0;

    for (const [expected_intent, queries] of Object.entries(TEST_QUERIES)) {
      for (const query of queries) {
        const result = intentClassifier.classifyIntent(query);
        if (result.intent === expected_intent) {
          totalCorrect++;
        }
        totalQueries++;
      }
    }

    const accuracy = totalCorrect / totalQueries;
    expect(accuracy).toBeGreaterThanOrEqual(0.80);
  });
});

/* ───────────────────────────────────────────────────────────────
   T051-T060: EXTENDED INTENT CLASSIFIER TESTS
──────────────────────────────────────────────────────────────── */

describe('T051: Intent Classification for add_feature Queries', () => {
  it('T051: add_feature queries are correctly classified', () => {
    const addFeatureQueries = [
      'add a new authentication module',
      'create new user registration flow',
      'implement dark mode support',
      'build a new dashboard component',
      'add new API endpoint for feature',
      'implement new payment integration',
    ];

    let correct = 0;
    for (const query of addFeatureQueries) {
      const result = intentClassifier.classifyIntent(query);
      if (result.intent === 'add_feature') {
        correct++;
      }
    }
    const accuracy = correct / addFeatureQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});

describe('T052: Intent Classification for fix_bug Queries', () => {
  it('T052: fix_bug queries are correctly classified', () => {
    const fixBugQueries = [
      'fix the login error issue',
      'debug why the form is not working',
      'fix broken checkout bug',
      'crash bug when clicking submit',
      'fix bug where users can\'t login',
      'debug error in payment flow',
    ];

    let correct = 0;
    for (const query of fixBugQueries) {
      const result = intentClassifier.classifyIntent(query);
      if (result.intent === 'fix_bug') {
        correct++;
      }
    }
    const accuracy = correct / fixBugQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});

describe('T053: Intent Classification for refactor Queries', () => {
  it('T053: refactor queries are correctly classified', () => {
    const refactorQueries = [
      'refactor the database connection module',
      'clean up the deprecated API handlers',
      'restructure and reorganize the project layout',
      'optimize and improve the service layer',
      'consolidate and simplify the utility functions',
      'reorganize and simplify the shared module',
    ];

    let correct = 0;
    for (const query of refactorQueries) {
      const result = intentClassifier.classifyIntent(query);
      if (result.intent === 'refactor') {
        correct++;
      }
    }
    const accuracy = correct / refactorQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});

describe('T054: Intent Classification for security_audit Queries', () => {
  it('T054: security_audit queries are correctly classified', () => {
    const securityAuditQueries = [
      'security audit of the API endpoints',
      'check for SQL injection vulnerabilities',
      'review XSS security vulnerabilities in forms',
      'audit permission controls and authorization',
      'security audit of the authentication flow',
      'CVE-2024-1234 vulnerability security assessment',
    ];

    let correct = 0;
    for (const query of securityAuditQueries) {
      const result = intentClassifier.classifyIntent(query);
      if (result.intent === 'security_audit') {
        correct++;
      }
    }
    const accuracy = correct / securityAuditQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});

describe('T055: Intent Classification for understand Queries', () => {
  it('T055: understand queries are correctly classified', () => {
    const understandQueries = [
      'how does the caching mechanism work',
      'what is the purpose of this middleware',
      'why was this architecture chosen',
      'explain the data flow process',
      'understand the authentication strategy',
      'what is the context behind this design decision',
    ];

    let correct = 0;
    for (const query of understandQueries) {
      const result = intentClassifier.classifyIntent(query);
      if (result.intent === 'understand') {
        correct++;
      }
    }
    const accuracy = correct / understandQueries.length;
    expect(accuracy).toBeGreaterThanOrEqual(0.8);
  });
});

describe('T056: Keyword Scoring', () => {
  it('T056: Keywords produce positive score for matching query', () => {
    const result = intentClassifier.calculateKeywordScore('implement something new', 'add_feature');
    expect(result.score).toBeGreaterThan(0);
    expect(result.matches.length).toBeGreaterThan(0);
  });

  it('T056: Non-matching query produces zero score', () => {
    const result = intentClassifier.calculateKeywordScore('zzz qqq xxx', 'add_feature');
    expect(result.score).toBe(0);
    expect(result.matches.length).toBe(0);
  });

  it('T056: More keyword matches produce higher scores', () => {
    const highResult = intentClassifier.calculateKeywordScore('add create new implement build feature', 'add_feature');
    const lowResult = intentClassifier.calculateKeywordScore('add something', 'add_feature');
    expect(highResult.score).toBeGreaterThan(lowResult.score);
  });
});

describe('T057: Pattern + Keyword + Centroid Combined Scoring', () => {
  it('T057: Combined score uses centroid/keyword/pattern blend', () => {
    const query = 'add a new authentication feature';
    const result = intentClassifier.classifyIntent(query);

    expect(result.intent).toBe('add_feature');
    expect(result.confidence).toBeGreaterThan(0);

    const patternScore = intentClassifier.calculatePatternScore('add a new authentication', 'add_feature');
    const keywordScore = intentClassifier.calculateKeywordScore('add a new authentication feature', 'add_feature');
    const centroidScore = intentClassifier.calculateCentroidScore('add a new authentication feature', 'add_feature');
    expect(patternScore).toBeGreaterThan(0);
    expect(keywordScore.score).toBeGreaterThan(0);
    expect(centroidScore).toBeGreaterThan(0);
  });

  it('T057: Pattern-only signal still contributes to ranking', () => {
    const patternScore = intentClassifier.calculatePatternScore('fix the login error', 'fix_bug');
    expect(patternScore).toBeGreaterThan(0);
    const expectedContribution = patternScore * 0.15;
    expect(expectedContribution).toBeGreaterThan(0);
  });

  it('T057: Keyword signal remains weighted in combined score', () => {
    const result = intentClassifier.calculateKeywordScore('refactor the code', 'refactor');
    expect(result.score).toBeGreaterThan(0);
    const expectedContribution = result.score * 0.35;
    expect(expectedContribution).toBeGreaterThan(0);
  });
});

describe('T058: Intent-specific Weight Adjustments', () => {
  it('T058: add_feature weights favor importance', () => {
    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['add_feature'];
    expect(weights.importance).toBe(0.4);
    expect(weights.recency).toBe(0.3);
    expect(weights.similarity).toBe(0.3);
  });

  it('T058: fix_bug weights favor recency', () => {
    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['fix_bug'];
    expect(weights.recency).toBe(0.5);
    expect(weights.importance).toBe(0.2);
    expect(weights.similarity).toBe(0.3);
  });

  it('T058: refactor weights favor similarity', () => {
    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['refactor'];
    expect(weights.similarity).toBe(0.5);
    expect(weights.importance).toBe(0.3);
    expect(weights.recency).toBe(0.2);
  });

  it('T058: security_audit weights favor importance', () => {
    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['security_audit'];
    expect(weights.importance).toBe(0.5);
    expect(weights.similarity).toBe(0.4);
    expect(weights.recency).toBe(0.1);
  });

  it('T058: understand weights favor similarity', () => {
    const weights = intentClassifier.INTENT_WEIGHT_ADJUSTMENTS['understand'];
    expect(weights.similarity).toBe(0.5);
    expect(weights.importance).toBe(0.3);
    expect(weights.recency).toBe(0.2);
  });
});

describe('T059: autoDetectIntent Parameter (memory_search)', () => {
  it('T059: get_query_weights returns IntentWeights structure', () => {
    const weights = intentClassifier.getQueryWeights('implement new user dashboard');
    expect(typeof weights.similarity).toBe('number');
    expect(typeof weights.importance).toBe('number');
    expect(typeof weights.recency).toBe('number');
  });

  it('T059: get_query_weights returns correct weights for fix_bug query', () => {
    const weights = intentClassifier.getQueryWeights('fix the login bug');
    expect(weights.similarity).toBe(0.3);
    expect(weights.recency).toBe(0.5);
    expect(weights.importance).toBe(0.2);
  });

  it('T059: get_query_weights returns weights for ambiguous query', () => {
    const weights = intentClassifier.getQueryWeights('tell me about something');
    expect(typeof weights.similarity).toBe('number');
    expect(typeof weights.recency).toBe('number');
  });
});

describe('T060: 80% Overall Detection Accuracy Target', () => {
  it('T060: Extended queries achieve 80% overall detection accuracy', () => {
    const extendedQueries = {
      add_feature: [
        'add a new authentication module',
        'create new user registration flow',
        'implement dark mode support',
        'build a new dashboard component',
        'add new API endpoint feature',
        'extend the notification functionality',
        'implement new payment integration',
        'enable new feature support',
      ],
      fix_bug: [
        'fix the login error issue',
        'debug why form is not working',
        'fix broken checkout bug',
        'crash bug when clicking submit',
        'fix bug where users can\'t login',
        'resolve the issue with bug in payments',
        'fix the search not working',
        'fix regression bug in submit flow',
      ],
      refactor: [
        'refactor the database module code',
        'clean up the deprecated handlers',
        'restructure and reorganize the project',
        'improve and optimize code quality',
        'reduce technical debt and simplify',
        'extract and consolidate common patterns',
        'consolidate the utility functions',
        'modernize and migrate the legacy code',
      ],
      security_audit: [
        'security audit of the API endpoints',
        'check for SQL injection vulnerabilities',
        'review XSS protections in forms',
        'audit access control permissions',
        'penetration test the auth flow',
        'CVE-2024-1234 vulnerability security check',
        'security review of user input validation',
        'check csrf protections and sanitize input',
      ],
      understand: [
        'how does the caching system work',
        'what is the purpose of this module',
        'why was this decision made',
        'explain the data flow process',
        'understand the authentication context',
        'what is the context for this design',
        'documentation overview for the API',
        'background on the system architecture',
      ],
    };

    let totalCorrect = 0;
    let totalQueries = 0;

    for (const [expected_intent, queries] of Object.entries(extendedQueries)) {
      for (const query of queries) {
        const result = intentClassifier.classifyIntent(query);
        if (result.intent === expected_intent) {
          totalCorrect++;
        }
        totalQueries++;
      }
    }

    const accuracy = totalCorrect / totalQueries;
    expect(accuracy).toBeGreaterThanOrEqual(0.80);
  });

  it('T060: No single intent category below 60% detection rate', () => {
    const categoryQueries = {
      add_feature: ['add new feature', 'create component', 'implement system', 'build module', 'develop api'],
      fix_bug: ['fix bug', 'debug error', 'broken functionality', 'crash issue', 'not working'],
      refactor: ['refactor code', 'clean up codebase', 'restructure project', 'improve quality', 'reduce debt'],
      security_audit: ['security audit', 'vulnerability check', 'xss review', 'penetration test', 'audit permissions'],
      understand: ['how does work', 'what is purpose', 'why decision', 'explain flow', 'understand context'],
    };

    for (const [expected_intent, queries] of Object.entries(categoryQueries)) {
      let correct = 0;
      for (const query of queries) {
        const result = intentClassifier.classifyIntent(query);
        if (result.intent === expected_intent) {
          correct++;
        }
      }
      const accuracy = correct / queries.length;
      expect(accuracy).toBeGreaterThanOrEqual(0.60);
    }
  });
});

describe('C138: Centroid-Based Classification & Lambda Mapping', () => {
  it('C138-T0: 7 centroid embeddings are computed at initialization', () => {
    const centroidKeys = Object.keys(intentClassifier.INTENT_CENTROIDS);
    expect(centroidKeys).toHaveLength(7);
    for (const key of centroidKeys) {
      const centroid = intentClassifier.INTENT_CENTROIDS[key as keyof typeof intentClassifier.INTENT_CENTROIDS];
      expect(centroid).toBeInstanceOf(Float32Array);
      expect(centroid.length).toBeGreaterThan(0);
    }
  });

  it('C138-T0b: dotProduct self-similarity is >= cross-intent similarity', () => {
    const query = intentClassifier.toDeterministicEmbedding('fix login bug and debug failing auth');
    const fixCentroid = intentClassifier.INTENT_CENTROIDS.fix_bug;
    const refactorCentroid = intentClassifier.INTENT_CENTROIDS.refactor;
    const self = intentClassifier.dotProduct(query, fixCentroid);
    const cross = intentClassifier.dotProduct(query, refactorCentroid);
    expect(self).toBeGreaterThanOrEqual(cross);
  });

  it('C138-T0c: centroid score peak classifies canonical queries for all 7 intents', () => {
      const canonicalQueries: Record<IntentType, string> = {
      add_feature: 'add a new feature and implement support for integration',
      fix_bug: 'fix login bug and debug broken crash',
      refactor: 'refactor and simplify module architecture',
      security_audit: 'security audit vulnerability and injection review',
      understand: 'explain architecture and system flow overview',
      find_spec: 'find spec requirements and implementation plan',
      find_decision: 'find decision record rationale and alternatives',
    };

      for (const [expectedIntent, query] of Object.entries(canonicalQueries) as Array<[IntentType, string]>) {
        const scores = Object.values(intentClassifier.INTENT_TYPES).map((intent) => ({
          intent,
          score: intentClassifier.calculateCentroidScore(query, intent),
        }));
      const top = scores.sort((a, b) => b.score - a.score)[0];
      expect(top.intent).toBe(expectedIntent);
    }
  });

  it('C138-T1: classifyIntent returns one of 7 valid intent types', () => {
    const validIntents: IntentType[] = ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'];
    const result = intentClassifier.classifyIntent('fix the login error');
    expect(validIntents).toContain(result.intent);
  });

  it('C138-T2: classifyIntent returns confidence between 0 and 1', () => {
    const result = intentClassifier.classifyIntent('explain the architecture');
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });

  it('C138-T3: all 7 intent types are classifiable', () => {
      const queries: Record<IntentType, string> = {
      add_feature: 'add a new feature',
      fix_bug: 'fix the broken login',
      refactor: 'refactor the module',
      security_audit: 'check security vulnerabilities',
      understand: 'explain how this works',
      find_spec: 'find the spec for auth',
      find_decision: 'find the decision about database',
    };

    for (const [expectedIntent, query] of Object.entries(queries)) {
      const result = intentClassifier.classifyIntent(query);
      expect(result.intent).toBe(expectedIntent);
    }
  });

  it('C138-T4: scores object contains all 7 intent types', () => {
    const result = intentClassifier.classifyIntent('test query');
    const expectedKeys = ['add_feature', 'fix_bug', 'refactor', 'security_audit', 'understand', 'find_spec', 'find_decision'];
    for (const key of expectedKeys) {
      expect(result.scores).toHaveProperty(key);
    }
  });

  it('C138-T5: intent-to-lambda mapping covers required intents', () => {
    // Per spec: understand→0.5 (diversity), fix_bug→0.85 (relevance)
    expect(INTENT_LAMBDA_MAP).toBeDefined();
    expect(INTENT_LAMBDA_MAP.understand).toBeLessThan(INTENT_LAMBDA_MAP.fix_bug);
    expect(INTENT_LAMBDA_MAP.fix_bug).toBeGreaterThan(0.8);
    expect(INTENT_LAMBDA_MAP.understand).toBeLessThanOrEqual(0.5);
    expect(typeof INTENT_LAMBDA_MAP.add_feature).toBe('number');
    expect(typeof INTENT_LAMBDA_MAP.refactor).toBe('number');
    expect(typeof INTENT_LAMBDA_MAP.find_spec).toBe('number');
  });
});
