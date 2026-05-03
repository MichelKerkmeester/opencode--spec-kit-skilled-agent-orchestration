import { expectTypeOf, test } from 'vitest';
import type { SupportedLanguage } from '../lib/indexer-types.js';

test('SupportedLanguage includes the doc lane', () => {
  expectTypeOf<'doc'>().toExtend<SupportedLanguage>();
});
