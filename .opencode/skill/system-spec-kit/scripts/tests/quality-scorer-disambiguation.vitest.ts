import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

import {
  scoreMemoryQuality as scoreRenderQuality,
  buildRenderQualityScoreFields,
} from '../core/quality-scorer';
import {
  scoreMemoryQuality as scoreInputCompleteness,
  buildInputCompletenessScoreFields,
} from '../extractors/quality-scorer';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKFLOW_PATH = path.join(TEST_DIR, '..', 'core', 'workflow.ts');

describe('quality scorer disambiguation', () => {
  it('serializes the two scorers to distinct field names without the generic quality_score key', () => {
    const renderScore = scoreRenderQuality(
      '# Rendered Memory\n\n## OVERVIEW\n\nA durable wrapper.',
      ['render quality', 'wrapper contract'],
      ['render quality'],
      [],
      [],
    );
    const inputScore = scoreInputCompleteness({
      content: '# Rendered Memory\n\n## OVERVIEW\n\nA durable wrapper.',
      validatorSignals: [],
    });

    const renderFields = buildRenderQualityScoreFields(renderScore);
    const inputFields = buildInputCompletenessScoreFields(inputScore);

    expect(renderFields).toHaveProperty('render_quality_score');
    expect(renderFields).not.toHaveProperty('quality_score');
    expect(inputFields).toHaveProperty('input_completeness_score');
    expect(inputFields).not.toHaveProperty('quality_score');
  });

  it('labels the low-quality warning note with input_completeness_score', () => {
    const workflowSource = fs.readFileSync(WORKFLOW_PATH, 'utf8');

    expect(workflowSource).toContain('input_completeness_score: ${filterStats.qualityScore}/100');
    expect(workflowSource).not.toContain('(quality score: ${filterStats.qualityScore}/100)');
  });
});
