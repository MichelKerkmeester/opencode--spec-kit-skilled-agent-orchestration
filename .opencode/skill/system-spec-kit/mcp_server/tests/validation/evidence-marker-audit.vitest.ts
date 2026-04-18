import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { parseMarkers } from '../../../scripts/validation/evidence-marker-audit.js';

function loadFixture(name: string): string {
  return readFileSync(new URL(`./fixtures/${name}`, import.meta.url), 'utf8');
}

describe('evidence-marker fence regressions', () => {
  it('ignores markers inside indented fenced code blocks with paren-heavy content', () => {
    const fixture = loadFixture('evidence-indented-fence.md');
    expect(parseMarkers(fixture, '/tmp/evidence-indented-fence.md')).toEqual([]);
  });

  it('keeps inner triple-backtick lines inside an outer four-backtick fence', () => {
    const fixture = loadFixture('evidence-nested-fence.md');
    const markers = parseMarkers(fixture, '/tmp/evidence-nested-fence.md');

    expect(markers).toHaveLength(1);
    expect(markers[0]).toMatchObject({
      status: 'ok',
      raw: '[EVIDENCE: after the outer fence closes]',
    });
  });

  it('treats four-backtick fences in isolation as safe code context', () => {
    const fixture = [
      '````',
      '[EVIDENCE: four-backtick content stays ignored]',
      '````',
      '',
    ].join('\n');

    expect(parseMarkers(fixture, '/tmp/evidence-four-backtick-fence.md')).toEqual([]);
  });

  it('preserves the documented false-negative behavior for mismatched fences', () => {
    const fixture = loadFixture('evidence-mismatched-fence.md');
    expect(parseMarkers(fixture, '/tmp/evidence-mismatched-fence.md')).toEqual([]);
  });
});
