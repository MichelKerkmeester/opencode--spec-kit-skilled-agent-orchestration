import { describe, expect, it } from 'vitest';

import {
  scoreMemoryQuality as scoreRenderQuality,
  buildRenderQualityScoreFields,
} from '../core/quality-scorer';
import {
  scoreMemoryQuality as scoreInputCompleteness,
  buildInputCompletenessScoreFields,
} from '../extractors/quality-scorer';

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
});
