// ───────────────────────────────────────────────────────────────
// TEST: YAML intake-event payload vocabulary boundary (T-TEST-NEW-13)
// ───────────────────────────────────────────────────────────────
// R47-002 / T-YML-PLN-03: The /spec_kit:plan and /spec_kit:complete
// assets emit `intake_triggered` / `intake_completed` events that
// MUST carry BOTH `folderState` (local classifier) and `startState`
// (canonical intake-contract enum) as distinct fields. If either
// field is dropped or the two collapse into one vocabulary,
// downstream consumers lose the ability to tell a local classifier
// state from the canonical emitted contract.
//
// Pre-fix failure mode: the payload string template could easily
// omit one of the two fields or substitute the same placeholder
// for both, silently laundering the vocabulary boundary. This
// test pins the contract at the YAML layer so asset edits that
// break it fail the suite before any runtime emits a degraded
// event.
// ───────────────────────────────────────────────────────────────

import fs from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

const REPO_ROOT = path.resolve(import.meta.dirname, '..', '..', '..', '..', '..');
const ASSETS_ROOT = path.join(REPO_ROOT, '.opencode', 'command', 'spec_kit', 'assets');

const ASSETS_WITH_INTAKE_EVENTS = [
  'spec_kit_plan_auto.yaml',
  'spec_kit_plan_confirm.yaml',
  'spec_kit_complete_auto.yaml',
  'spec_kit_complete_confirm.yaml',
];

describe('YAML intake-event payloads preserve folderState / startState boundary (T-TEST-NEW-13)', () => {
  for (const assetName of ASSETS_WITH_INTAKE_EVENTS) {
    const assetPath = path.join(ASSETS_ROOT, assetName);

    it(`${assetName}: intake_triggered payload carries distinct folderState + startState fields`, () => {
      const text = fs.readFileSync(assetPath, 'utf-8');

      // Gate: the asset MUST define an intake_triggered event emission.
      expect(text, `${assetName} should emit intake_triggered`).toMatch(/emit_event:\s*intake_triggered/);

      // The payload must carry BOTH folderState and startState as JSON keys.
      // The values are Mustache-style placeholders bound to {folder_state} and
      // {start_state} respectively. The test asserts the two vocabularies are
      // NOT collapsed into one field (e.g., both bound to {folder_state}).
      const payloadMatch = text.match(/payload:\s*'?(\{[^']*"event":"intake_triggered"[^']*\})'?/);
      expect(payloadMatch, `${assetName} should define intake_triggered payload`).not.toBeNull();

      const payload = payloadMatch![1];
      expect(payload, `${assetName}: folderState field must be present`).toContain('"folderState":');
      expect(payload, `${assetName}: startState field must be present`).toContain('"startState":');

      // Boundary check: folderState is bound to {folder_state}, startState is
      // bound to {start_state}. If either swaps or shares the same placeholder,
      // the vocabulary boundary collapses.
      expect(payload).toMatch(/"folderState":"\{folder_state\}"/);
      expect(payload).toMatch(/"startState":"\{start_state\}"/);
    });

    it(`${assetName}: intake_completed payload carries distinct folderState + startState fields`, () => {
      const text = fs.readFileSync(assetPath, 'utf-8');

      // Plan assets emit this via `emit_event_after_bind`; complete assets
      // similarly mirror the pair. Both must preserve the two vocabularies.
      expect(text, `${assetName} should emit intake_completed`).toMatch(/emit_event_after_bind:\s*intake_completed/);

      const payloadMatch = text.match(/payload_after_bind:\s*'?(\{[^']*"event":"intake_completed"[^']*\})'?/);
      expect(payloadMatch, `${assetName} should define intake_completed payload`).not.toBeNull();

      const payload = payloadMatch![1];
      expect(payload).toContain('"folderState":');
      expect(payload).toContain('"startState":');
      expect(payload).toMatch(/"folderState":"\{folder_state\}"/);
      expect(payload).toMatch(/"startState":"\{start_state\}"/);
    });

    it(`${assetName}: folder_state is mapped explicitly to start_state via map_to_start_state (or equivalent)`, () => {
      const text = fs.readFileSync(assetPath, 'utf-8');

      // R41-001 + R47-002: the two vocabularies must be reconciled by an
      // explicit mapping in the asset, not collapsed by convention. Plan
      // assets use `map_to_start_state:`, complete assets reuse the
      // intake-contract directly. The test accepts either path so the
      // boundary is documented somewhere in the asset.
      const hasMapping = /map_to_start_state\s*:/.test(text)
        || /start_state.*(empty-folder|partial-folder|populated-folder)/.test(text);
      expect(hasMapping, `${assetName} must declare a folder_state → start_state mapping`).toBe(true);
    });
  }

  it('no asset emits only one of the two vocabulary fields (regression: dropped-field collapse)', () => {
    for (const assetName of ASSETS_WITH_INTAKE_EVENTS) {
      const text = fs.readFileSync(path.join(ASSETS_ROOT, assetName), 'utf-8');

      // Count how many times each field appears in the intake-event payload
      // contexts. Both counts must match; if folderState appears 2x (trigger
      // + completed) but startState appears 0x or 1x, the asset has regressed.
      const folderStateCount = (text.match(/"folderState":/g) ?? []).length;
      const startStateCount = (text.match(/"startState":/g) ?? []).length;

      expect(
        folderStateCount,
        `${assetName}: folderState occurrences (${folderStateCount}) must match startState occurrences (${startStateCount})`,
      ).toBe(startStateCount);

      // If the asset emits intake events at all, both counts should be >= 2
      // (one for triggered, one for completed).
      if (/emit_event:\s*intake_triggered/.test(text)) {
        expect(folderStateCount, `${assetName}: folderState must appear >= 2x when intake events are emitted`).toBeGreaterThanOrEqual(2);
        expect(startStateCount, `${assetName}: startState must appear >= 2x when intake events are emitted`).toBeGreaterThanOrEqual(2);
      }
    }
  });
});
