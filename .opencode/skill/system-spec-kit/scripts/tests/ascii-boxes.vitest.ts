import { describe, expect, it } from 'vitest';

import { formatOptionBox } from '../lib/ascii-boxes';

describe('ascii option boxes', () => {
  it('adds a chosen marker to the selected option header', () => {
    const chosen = formatOptionBox({ LABEL: 'Option A' }, true, 20);
    const unchosen = formatOptionBox({ LABEL: 'Option A' }, false, 20);

    expect(chosen).toContain('>> Option A');
    expect(unchosen).not.toContain('>> Option A');
  });
});
