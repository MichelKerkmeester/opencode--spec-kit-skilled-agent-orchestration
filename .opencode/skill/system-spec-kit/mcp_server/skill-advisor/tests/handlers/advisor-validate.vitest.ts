// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Validate Tests
// ───────────────────────────────────────────────────────────────

import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import { advisorHookOutcomesPath } from '../../lib/metrics.js';
import { AdvisorValidateInputSchema, AdvisorValidateOutputSchema } from '../../schemas/advisor-tool-schemas.js';
import { handleAdvisorValidate } from '../../handlers/advisor-validate.js';

const REPO_ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../../../../../../..');

describe('advisor_validate handler', () => {
  it('returns the required slice bundle schema for a skill subset', async () => {
    const response = await handleAdvisorValidate({ confirmHeavyRun: true, skillSlug: 'system-spec-kit' });
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
    const raw = (await handleAdvisorValidate({ confirmHeavyRun: true, skillSlug: null })).content[0].text;

    expect(raw).not.toContain('"prompt"');
    expect(raw).not.toMatch(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
  });

  it('drops malformed durable outcome telemetry instead of crashing validation', async () => {
    const workspaceRoot = REPO_ROOT;
    const outcomesPath = advisorHookOutcomesPath(workspaceRoot);
    const previousExists = existsSync(outcomesPath);
    const previousContent = previousExists ? readFileSync(outcomesPath, 'utf8') : null;

    mkdirSync(dirname(outcomesPath), { recursive: true });
    writeFileSync(
      outcomesPath,
      [
        '{"timestamp":"2026-04-24T10:08:00.000Z","runtime":"codex","outcome":"accepted","skillLabel":"system-spec-kit"}',
        '{"timestamp":"2026-04-24T10:08:01.000Z","runtime":"codex","outcome"',
        '{"timestamp":"2026-04-24T10:08:02.000Z","runtime":"codex","outcome":"corrected","skillLabel":"system-spec-kit","correctedSkillLabel":"sk-code-opencode"}',
        '{"timestamp":"2026-04-24T10:08:03.000Z","runtime":"codex","outcome":"mystery","skillLabel":"system-spec-kit"}',
      ].join('\n'),
      'utf8',
    );

    try {
      const response = await handleAdvisorValidate({ confirmHeavyRun: true, workspaceRoot });
      const parsed = JSON.parse(response.content[0].text) as { status: string; data: unknown };
      const data = AdvisorValidateOutputSchema.parse(parsed.data);

      expect(parsed.status).toBe('ok');
      expect(data.telemetry.outcomes.totals).toEqual({
        accepted: 1,
        corrected: 1,
        ignored: 0,
      });
    } finally {
      if (previousExists && previousContent !== null) {
        writeFileSync(outcomesPath, previousContent, 'utf8');
      } else {
        rmSync(outcomesPath, { force: true });
      }
    }
  });

  it('rejects invalid strict input clearly', () => {
    expect(() => AdvisorValidateInputSchema.parse({
      skillSlug: 'system-spec-kit',
    })).toThrow();
    expect(() => AdvisorValidateInputSchema.parse({
      confirmHeavyRun: true,
      skillSlug: 12,
    })).toThrow();
    expect(() => AdvisorValidateInputSchema.parse({
      confirmHeavyRun: true,
      skillSlug: null,
      prompt: 'not allowed',
    })).toThrow(/Unrecognized key/);
  });
});
