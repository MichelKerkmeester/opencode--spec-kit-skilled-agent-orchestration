// ───────────────────────────────────────────────────────────────
// MODULE: Phase Parent Health Tests
// ───────────────────────────────────────────────────────────────
// F-019-D4-03: tests for assessPhaseParentHealth and the manifest-size
// thresholds. Builds synthetic phase-parent folders under os.tmpdir() with
// varying child counts and asserts the health bucket and recommendation
// text shape.

import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import {
  PHASE_PARENT_ERROR_THRESHOLD,
  PHASE_PARENT_WARNING_THRESHOLD,
  assessPhaseParentHealth,
  isPhaseParent,
} from '../lib/spec/is-phase-parent';

function makePhaseParent(root: string, childCount: number): void {
  fs.mkdirSync(root, { recursive: true });
  fs.writeFileSync(path.join(root, 'spec.md'), '# Parent\n', 'utf8');
  for (let i = 0; i < childCount; i += 1) {
    const slug = `${String(i + 1).padStart(3, '0')}-child-${i + 1}`;
    const childDir = path.join(root, slug);
    fs.mkdirSync(childDir, { recursive: true });
    fs.writeFileSync(path.join(childDir, 'spec.md'), `# Child ${i + 1}\n`, 'utf8');
  }
}

describe('assessPhaseParentHealth (F-019-D4-03)', () => {
  let tempRoot: string;

  beforeEach(() => {
    tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'phase-parent-health-'));
  });

  afterEach(() => {
    fs.rmSync(tempRoot, { recursive: true, force: true });
  });

  it('returns not_phase_parent for a folder with no NNN children', () => {
    const folder = path.join(tempRoot, 'leaf');
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'spec.md'), '# Leaf\n', 'utf8');

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('not_phase_parent');
    expect(health.childCount).toBe(0);
    expect(isPhaseParent(folder)).toBe(false);
  });

  it('returns ok for a phase parent with 1 child', () => {
    const folder = path.join(tempRoot, '100-parent');
    makePhaseParent(folder, 1);

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('ok');
    expect(health.childCount).toBe(1);
    expect(health.recommendation).toContain('healthy manifest size');
  });

  it('returns ok for a phase parent with childCount one below the warning threshold', () => {
    const folder = path.join(tempRoot, '100-parent');
    makePhaseParent(folder, PHASE_PARENT_WARNING_THRESHOLD - 1);

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('ok');
    expect(health.childCount).toBe(PHASE_PARENT_WARNING_THRESHOLD - 1);
  });

  it('returns warning at exactly the warning threshold', () => {
    const folder = path.join(tempRoot, '100-parent');
    makePhaseParent(folder, PHASE_PARENT_WARNING_THRESHOLD);

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('warning');
    expect(health.childCount).toBe(PHASE_PARENT_WARNING_THRESHOLD);
    expect(health.recommendation).toContain('warning threshold');
  });

  it('returns warning for childCount between warning and error thresholds', () => {
    const folder = path.join(tempRoot, '100-parent');
    const midpoint = Math.floor((PHASE_PARENT_WARNING_THRESHOLD + PHASE_PARENT_ERROR_THRESHOLD) / 2);
    makePhaseParent(folder, midpoint);

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('warning');
    expect(health.childCount).toBe(midpoint);
  });

  it('returns error at exactly the error threshold', () => {
    const folder = path.join(tempRoot, '100-parent');
    makePhaseParent(folder, PHASE_PARENT_ERROR_THRESHOLD);

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('error');
    expect(health.childCount).toBe(PHASE_PARENT_ERROR_THRESHOLD);
    expect(health.recommendation).toContain('exceeds error threshold');
  });

  it('returns error for childCount well above error threshold (50+)', () => {
    const folder = path.join(tempRoot, '100-parent');
    makePhaseParent(folder, 50);

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('error');
    expect(health.childCount).toBe(50);
  });

  it('ignores non-NNN children when counting', () => {
    const folder = path.join(tempRoot, '100-parent');
    makePhaseParent(folder, 3);
    fs.mkdirSync(path.join(folder, 'scratch'), { recursive: true });
    fs.mkdirSync(path.join(folder, 'z_archive'), { recursive: true });
    fs.mkdirSync(path.join(folder, 'changelog'), { recursive: true });

    const health = assessPhaseParentHealth(folder);
    expect(health.status).toBe('ok');
    expect(health.childCount).toBe(3);
  });

  it('exposes thresholds as exported constants', () => {
    expect(PHASE_PARENT_WARNING_THRESHOLD).toBe(20);
    expect(PHASE_PARENT_ERROR_THRESHOLD).toBe(40);
    expect(PHASE_PARENT_WARNING_THRESHOLD).toBeLessThan(PHASE_PARENT_ERROR_THRESHOLD);
  });
});
