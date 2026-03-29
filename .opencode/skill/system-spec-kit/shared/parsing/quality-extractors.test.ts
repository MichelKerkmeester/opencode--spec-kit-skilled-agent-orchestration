import { extractQualityFlags, extractQualityScore } from './quality-extractors.js';

function assertEqual(actual: unknown, expected: unknown, label: string): void {
  if (actual !== expected) {
    throw new Error(`${label} failed: expected ${String(expected)}, got ${String(actual)}`);
  }
  console.log(`PASS: ${label}`);
}

function assertArrayEqual(actual: string[], expected: string[], label: string): void {
  if (actual.length !== expected.length) {
    throw new Error(
      `${label} failed: expected length ${expected.length}, got ${actual.length} (actual: [${actual.join(', ')}])`
    );
  }

  for (let i = 0; i < expected.length; i += 1) {
    if (actual[i] !== expected[i]) {
      throw new Error(
        `${label} failed at index ${i}: expected ${expected[i]}, got ${actual[i]}`
      );
    }
  }

  console.log(`PASS: ${label}`);
}

// 1. Empty input string -> score 0, flags []
{
  const content = '';
  assertEqual(extractQualityScore(content), 0, 'empty input score');
  assertArrayEqual(extractQualityFlags(content), [], 'empty input flags');
}

// 2. Content with no frontmatter -> score 0, flags [] (must NOT parse body text)
{
  const content = [
    '# Memory Note',
    'quality_score: 0.95',
    'quality_flags:',
    '- body-flag',
  ].join('\n');

  assertEqual(extractQualityScore(content), 0, 'no frontmatter score');
  assertArrayEqual(extractQualityFlags(content), [], 'no frontmatter flags');
}

// 3. Valid frontmatter with quality_score: 0.85 -> 0.85
{
  const content = ['---', 'quality_score: 0.85', '---', 'Body text'].join('\n');
  assertEqual(extractQualityScore(content), 0.85, 'valid score 0.85');
}

// 4. quality_score > 1 -> clamped to 1.0
{
  const content = ['---', 'quality_score: 1.75', '---'].join('\n');
  assertEqual(extractQualityScore(content), 1, 'score clamp high');
}

// 5. quality_score < 0 -> clamped to 0.0
{
  const content = ['---', 'quality_score: -0.25', '---'].join('\n');
  assertEqual(extractQualityScore(content), 0, 'score clamp low (negative input)');
}

// 6. quality_score: NaN or non-numeric -> 0
{
  const nanContent = ['---', 'quality_score: NaN', '---'].join('\n');
  const textContent = ['---', 'quality_score: not-a-number', '---'].join('\n');

  assertEqual(extractQualityScore(nanContent), 0, 'score NaN text returns 0');
  assertEqual(extractQualityScore(textContent), 0, 'score non-numeric returns 0');
}

// 7. quality_score in body text but NOT in frontmatter -> must return 0
{
  const content = [
    '---',
    'title: no quality score here',
    '---',
    'quality_score: 0.99',
  ].join('\n');

  assertEqual(extractQualityScore(content), 0, 'score in body only returns 0');
}

// 8. Valid quality_flags YAML list -> correct array
{
  const content = ['---', 'quality_flags:', '  - concise', '  - relevant', '  - grounded', '---'].join('\n');

  assertArrayEqual(
    extractQualityFlags(content),
    ['concise', 'relevant', 'grounded'],
    'valid flags list'
  );
}

// 9. Flags with quoted values (single and double quotes) -> stripped correctly
{
  const content = [
    '---',
    'quality_flags:',
    "  - 'single-quoted'",
    '  - "double-quoted"',
    '---',
  ].join('\n');

  assertArrayEqual(
    extractQualityFlags(content),
    ['single-quoted', 'double-quoted'],
    'quoted flags are stripped'
  );
}

// 10. Empty flags list -> []
{
  const content = ['---', 'quality_flags: []', '---'].join('\n');
  assertArrayEqual(extractQualityFlags(content), [], 'empty flags list');
}

// 11. Multiline frontmatter with both score and flags
{
  const content = [
    '---',
    'title: Example',
    'quality_score: 0.42',
    'author: Test',
    'quality_flags:',
    '  - one',
    '  - two',
    'date: 2026-03-04',
    '---',
    'Body',
  ].join('\n');

  assertEqual(extractQualityScore(content), 0.42, 'multiline frontmatter score');
  assertArrayEqual(extractQualityFlags(content), ['one', 'two'], 'multiline frontmatter flags');
}

// 12. Windows-style \r\n line endings in frontmatter
{
  const content = ['---', 'quality_score: 0.67', 'quality_flags:', '- windows', '---', 'Body'].join('\r\n');

  assertEqual(extractQualityScore(content), 0.67, 'CRLF score');
  assertArrayEqual(extractQualityFlags(content), ['windows'], 'CRLF flags');
}

// 13. Frontmatter with extra whitespace around quality_score value
{
  const content = ['---', 'quality_score:    0.31   ', '---'].join('\n');
  assertEqual(extractQualityScore(content), 0.31, 'score with extra whitespace');
}

console.log('All quality extractor tests passed.');
