// ───────────────────────────────────────────────────────────────
// MODULE: Skill Advisor Prompt Policy
// ───────────────────────────────────────────────────────────────

import { canonicalFold } from '@spec-kit/shared/unicode-normalization';

export interface AdvisorPromptPolicyResult {
  readonly fire: boolean;
  readonly reason: string;
  readonly canonicalPrompt: string;
  readonly meaningfulTokenCount: number;
  readonly visibleCharCount: number;
  readonly metalinguisticMentions: string[];
}

const EXACT_SKIP_COMMANDS = new Set(['/help', '/clear', '/exit', '/quit']);
const CASUAL_ACKNOWLEDGEMENTS = new Set([
  'ok',
  'okay',
  'k',
  'kk',
  'yes',
  'yep',
  'yeah',
  'no',
  'nope',
  'thanks',
  'thank you',
  'thx',
  'hi',
  'hey',
  'hello',
]);
const WORK_INTENT_VERBS = new Set([
  'add',
  'analyze',
  'build',
  'change',
  'check',
  'configure',
  'create',
  'debug',
  'delete',
  'diagnose',
  'edit',
  'fix',
  'generate',
  'implement',
  'inspect',
  'install',
  'investigate',
  'modify',
  'move',
  'patch',
  'refactor',
  'remove',
  'rename',
  'repair',
  'review',
  'run',
  'ship',
  'test',
  'update',
  'validate',
  'verify',
  'write',
]);
const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'for',
  'i',
  'in',
  'is',
  'it',
  'me',
  'of',
  'on',
  'or',
  'please',
  'the',
  'this',
  'to',
  'with',
]);
const GOVERNANCE_MARKERS = [
  'spec kit',
  'speckit',
  'gate 3',
  'deep review',
  'deep research',
  'memory save',
  'skill advisor',
];

function normalizePrompt(prompt: string): string {
  return canonicalFold(prompt).replace(/\s+/g, ' ').trim();
}

function tokenize(prompt: string): string[] {
  return prompt
    .toLowerCase()
    .match(/[a-z0-9][a-z0-9_-]*/g) ?? [];
}

function meaningfulTokens(tokens: string[]): string[] {
  return tokens.filter((token) => token.length > 0 && !STOP_WORDS.has(token));
}

function hasExplicitMarker(canonicalLower: string): boolean {
  return /\bsk-[a-z0-9][a-z0-9-]*\b/.test(canonicalLower)
    || /(?:^|\s)\/[a-z][a-z0-9:_-]*/.test(canonicalLower)
    || GOVERNANCE_MARKERS.some((marker) => canonicalLower.includes(marker));
}

function hasWorkIntentVerb(tokens: string[]): boolean {
  return tokens.some((token) => WORK_INTENT_VERBS.has(token));
}

export function extractMetalinguisticSkillMentions(prompt: string): string[] {
  const canonicalLower = normalizePrompt(prompt).toLowerCase();
  return [...new Set(canonicalLower.match(/\bsk-[a-z0-9][a-z0-9-]*\b/g) ?? [])].sort();
}

export function shouldFireAdvisor(prompt: string): AdvisorPromptPolicyResult {
  const canonicalPrompt = normalizePrompt(prompt);
  const canonicalLower = canonicalPrompt.toLowerCase();
  const tokens = tokenize(canonicalPrompt);
  const meaningful = meaningfulTokens(tokens);
  const visibleCharCount = canonicalPrompt.length;
  const metalinguisticMentions = extractMetalinguisticSkillMentions(canonicalPrompt);

  if (visibleCharCount === 0) {
    return {
      fire: false,
      reason: 'empty_prompt',
      canonicalPrompt,
      meaningfulTokenCount: 0,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (EXACT_SKIP_COMMANDS.has(canonicalLower)) {
    return {
      fire: false,
      reason: 'skip_command',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  const explicitMarker = hasExplicitMarker(canonicalLower);
  const workIntent = hasWorkIntentVerb(tokens);
  const casual = CASUAL_ACKNOWLEDGEMENTS.has(canonicalLower);

  if (!explicitMarker && !workIntent && visibleCharCount <= 15 && casual) {
    return {
      fire: false,
      reason: 'short_casual_acknowledgement',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (explicitMarker) {
    return {
      fire: true,
      reason: 'explicit_skill_or_governance_marker',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (workIntent && meaningful.length >= 3) {
    return {
      fire: true,
      reason: 'work_intent_with_meaningful_tokens',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (visibleCharCount >= 20 && meaningful.length >= 4) {
    return {
      fire: true,
      reason: 'length_and_token_threshold',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  if (visibleCharCount >= 50 && !casual) {
    return {
      fire: true,
      reason: 'long_non_casual_prompt',
      canonicalPrompt,
      meaningfulTokenCount: meaningful.length,
      visibleCharCount,
      metalinguisticMentions,
    };
  }

  return {
    fire: false,
    reason: 'below_prompt_policy_threshold',
    canonicalPrompt,
    meaningfulTokenCount: meaningful.length,
    visibleCharCount,
    metalinguisticMentions,
  };
}
