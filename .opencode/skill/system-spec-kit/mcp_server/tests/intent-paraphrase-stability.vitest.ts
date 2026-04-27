import { describe, expect, it } from 'vitest';
import { classifyIntent } from '../lib/search/intent-classifier';
import type { IntentType } from '../lib/search/intent-classifier';

interface ParaphraseGroup {
  name: string;
  expectedIntent: IntentType;
  variants: string[];
}

const PARAPHRASE_GROUPS: ParaphraseGroup[] = [
  {
    name: 'understand semantic search terse-to-explanatory',
    expectedIntent: 'understand',
    variants: [
      'Semantic Search',
      'Find stuff related to semantic search',
      'Tell me about semantic search',
      'What does semantic search mean',
    ],
  },
  {
    name: 'understand cache architecture',
    expectedIntent: 'understand',
    variants: [
      'explain the cache architecture',
      'describe the cache architecture',
      'understand the cache architecture',
    ],
  },
  {
    name: 'fix bug login',
    expectedIntent: 'fix_bug',
    variants: [
      'fix the login bug',
      'the login is broken, fix it',
      'debug login failure',
      'login error needs fixing',
    ],
  },
  {
    name: 'fix bug checkout',
    expectedIntent: 'fix_bug',
    variants: [
      'fix the checkout error',
      'debug checkout error',
      'repair checkout issue',
    ],
  },
  {
    name: 'add feature dark mode',
    expectedIntent: 'add_feature',
    variants: [
      'add dark mode feature',
      'implement dark mode feature',
      'build a dark mode feature',
      'create dark mode feature',
    ],
  },
  {
    name: 'add feature payment integration',
    expectedIntent: 'add_feature',
    variants: [
      'add payment integration feature',
      'implement payment integration feature',
      'build payment integration feature',
    ],
  },
  {
    name: 'refactor auth module',
    expectedIntent: 'refactor',
    variants: [
      'refactor the auth module',
      'clean up auth code',
      'restructure auth module',
      'simplify auth module',
    ],
  },
  {
    name: 'refactor service layer',
    expectedIntent: 'refactor',
    variants: [
      'refactor the service layer',
      'clean up the service layer',
      'restructure the service layer',
    ],
  },
  {
    name: 'security auth audit',
    expectedIntent: 'security_audit',
    variants: [
      'security audit of auth permissions',
      'security review of auth permissions',
      'audit auth permissions security',
    ],
  },
  {
    name: 'security injection audit',
    expectedIntent: 'security_audit',
    variants: [
      'check SQL injection vulnerabilities',
      'audit SQL injection vulnerabilities',
      'security audit SQL injection vulnerabilities',
    ],
  },
  {
    name: 'find spec packet',
    expectedIntent: 'find_spec',
    variants: [
      'show the spec for packet 012',
      'find the spec for packet 012',
      'get the spec for packet 012',
    ],
  },
  {
    name: 'find spec requirements',
    expectedIntent: 'find_spec',
    variants: [
      'show the requirements for cache rewrite',
      'find the requirements for cache rewrite',
      'get the requirements for cache rewrite',
    ],
  },
  {
    name: 'find decision record',
    expectedIntent: 'find_decision',
    variants: [
      'show the decision record for cache contract',
      'find the decision record for cache contract',
      'get the decision record for cache contract',
    ],
  },
  {
    name: 'find decision rationale',
    expectedIntent: 'find_decision',
    variants: [
      'find the rationale for this approach',
      'show the rationale for this approach',
      'get the rationale for this approach',
    ],
  },
  {
    name: 'cross cli fix bug styles',
    expectedIntent: 'fix_bug',
    variants: [
      'fix login bug',
      'Please investigate why the login flow is broken and fix the issue.',
      'Debug the login error in auth.',
    ],
  },
  {
    name: 'cross cli add feature styles',
    expectedIntent: 'add_feature',
    variants: [
      'add dark mode toggle feature',
      'Please implement a dark mode toggle for the settings page.',
      'Build support for a dark mode toggle.',
    ],
  },
  {
    name: 'cross cli refactor styles',
    expectedIntent: 'refactor',
    variants: [
      'refactor auth handlers',
      'Please clean up and simplify the auth handlers.',
      'Restructure auth handlers for maintainability.',
    ],
  },
  {
    name: 'cross cli understand styles',
    expectedIntent: 'understand',
    variants: [
      'explain memory_context routing',
      'Please describe how memory_context routing works.',
      'What is the memory_context routing flow?',
    ],
  },
  {
    name: 'cross cli spec styles',
    expectedIntent: 'find_spec',
    variants: [
      'show the packet 012 spec tasks',
      'find the packet 012 spec tasks',
      'get the packet 012 spec tasks',
    ],
  },
  {
    name: 'cross cli decision styles',
    expectedIntent: 'find_decision',
    variants: [
      'find decision record for daemon restart',
      'Please show the decision rationale for daemon restart.',
      'Get the ADR or decision record for daemon restart.',
    ],
  },
];

const KNOWN_FLAKY_GROUPS: string[] = [];
const MAX_CONFIDENCE_DRIFT = 0.30;

function pairCount(group: ParaphraseGroup): number {
  return (group.variants.length * (group.variants.length - 1)) / 2;
}

describe('intent paraphrase stability corpus', () => {
  it('contains at least 20 paraphrase pairs across the intent vocabulary', () => {
    const totalPairs = PARAPHRASE_GROUPS.reduce((sum, group) => sum + pairCount(group), 0);
    const coveredIntents = new Set(PARAPHRASE_GROUPS.map((group) => group.expectedIntent));

    expect(totalPairs).toBeGreaterThanOrEqual(20);
    expect(coveredIntents.size).toBeGreaterThanOrEqual(6);
  });

  it('keeps equivalent paraphrases on the same task intent with bounded confidence drift', () => {
    for (const group of PARAPHRASE_GROUPS) {
      if (KNOWN_FLAKY_GROUPS.includes(group.name)) {
        continue;
      }

      const classifications = group.variants.map((query) => ({
        query,
        result: classifyIntent(query),
      }));
      const intents = new Set(classifications.map(({ result }) => result.intent));
      const confidences = classifications.map(({ result }) => result.confidence);
      const drift = Math.max(...confidences) - Math.min(...confidences);

      expect([...intents], `${group.name}: ${JSON.stringify(classifications)}`).toEqual([group.expectedIntent]);
      expect(drift, `${group.name}: confidence drift ${drift}`).toBeLessThan(MAX_CONFIDENCE_DRIFT);
    }
  });
});
