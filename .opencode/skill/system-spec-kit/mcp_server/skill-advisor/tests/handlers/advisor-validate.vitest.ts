import { describe, expect, it } from 'vitest';

import { AdvisorValidateInputSchema, AdvisorValidateOutputSchema } from '../../schemas/advisor-tool-schemas.js';
import { handleAdvisorValidate } from '../../handlers/advisor-validate.js';

describe('advisor_validate handler', () => {
  it('returns the required slice bundle schema for a skill subset', async () => {
    const response = await handleAdvisorValidate({ skillSlug: 'system-spec-kit' });
    const parsed = JSON.parse(response.content[0].text) as { status: string; data: unknown };

    expect(parsed.status).toBe('ok');
    expect(() => AdvisorValidateOutputSchema.parse(parsed.data)).not.toThrow();
    expect(parsed.data).toEqual(expect.objectContaining({
      skillSlug: 'system-spec-kit',
      slices: expect.objectContaining({
        corpus: expect.any(Object),
        holdout: expect.any(Object),
        parity: expect.any(Object),
        safety: expect.any(Object),
        latency: expect.any(Object),
      }),
    }));
  });

  it('preserves privacy by excluding raw prompts and PII-shaped content', async () => {
    const raw = (await handleAdvisorValidate({ skillSlug: null })).content[0].text;

    expect(raw).not.toContain('"prompt"');
    expect(raw).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  });

  it('rejects invalid strict input clearly', () => {
    expect(() => AdvisorValidateInputSchema.parse({
      skillSlug: 12,
    })).toThrow();
    expect(() => AdvisorValidateInputSchema.parse({
      skillSlug: null,
      prompt: 'not allowed',
    })).toThrow(/Unrecognized key/);
  });
});
