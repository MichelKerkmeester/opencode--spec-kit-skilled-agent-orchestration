import { describe, expect, it } from 'vitest';
import {
  extractMetalinguisticSkillMentions,
  shouldFireAdvisor,
} from '../skill-advisor/lib/prompt-policy.js';

describe('skill advisor prompt policy', () => {
  it('skips empty, whitespace, and exact navigation commands', () => {
    expect(shouldFireAdvisor('').fire).toBe(false);
    expect(shouldFireAdvisor('   ').reason).toBe('empty_prompt');
    expect(shouldFireAdvisor('/help').reason).toBe('skip_command');
    expect(shouldFireAdvisor(' /CLEAR ').reason).toBe('skip_command');
  });

  it('skips short casual acknowledgements with no work intent', () => {
    expect(shouldFireAdvisor('ok')).toMatchObject({
      fire: false,
      reason: 'short_casual_acknowledgement',
    });
    expect(shouldFireAdvisor('thanks').fire).toBe(false);
    expect(shouldFireAdvisor('hi').fire).toBe(false);
  });

  it('fires for explicit skill, command, and governance markers', () => {
    expect(shouldFireAdvisor('use sk-code-opencode here')).toMatchObject({
      fire: true,
      reason: 'explicit_skill_or_governance_marker',
    });
    expect(shouldFireAdvisor('/spec_kit:resume now').fire).toBe(true);
    expect(shouldFireAdvisor('spec kit packet alignment').fire).toBe(true);
  });

  it('fires for work-intent verbs with at least three meaningful tokens', () => {
    expect(shouldFireAdvisor('implement feature X')).toMatchObject({
      fire: true,
      reason: 'work_intent_with_meaningful_tokens',
    });
  });

  it('fires for length plus meaningful-token thresholds', () => {
    expect(shouldFireAdvisor('please examine routing behavior today').reason).toBe('length_and_token_threshold');
    expect(shouldFireAdvisor('This prompt has enough visible detail to deserve advisor routing even without a leading verb.').fire)
      .toBe(true);
  });

  it('canonical-folds Unicode before classification and extracts metalinguistic skill names', () => {
    const prompt = 'explain sk-git skill with hidden\u200bspace';
    const result = shouldFireAdvisor(prompt);

    expect(result.fire).toBe(true);
    expect(result.canonicalPrompt).not.toContain('\u200b');
    expect(result.metalinguisticMentions).toEqual(['sk-git']);
    expect(extractMetalinguisticSkillMentions(prompt)).toEqual(['sk-git']);
  });
});
