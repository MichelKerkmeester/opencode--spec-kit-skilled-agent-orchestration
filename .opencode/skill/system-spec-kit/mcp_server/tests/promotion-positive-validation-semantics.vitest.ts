// TEST: Promotion Thresholds Use Positive Validation Semantics (T055)
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as path from 'path';
import * as os from 'os';
import * as fs from 'fs';
import BetterSqlite3 from 'better-sqlite3';

import * as confidenceTracker from '../lib/scoring/confidence-tracker';
import {
  checkAutoPromotion,
  executeAutoPromotion,
  scanForPromotions,
} from '../lib/search/auto-promotion';
import { recordNegativeFeedbackEvent } from '../lib/scoring/negative-feedback';

let db!: BetterSqlite3.Database;
let dbPath = '';

function insertMemory(
  id: number,
  {
    tier = 'normal',
    confidence = 0.95,
    validationCount = 0,
  }: { tier?: string; confidence?: number; validationCount?: number } = {},
): void {
  db.prepare(`
    INSERT INTO memory_index (id, title, confidence, validation_count, importance_tier, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(id, `memory-${id}`, confidence, validationCount, tier, new Date().toISOString());
}

describe('T055: positive-validation semantics for promotion thresholds', () => {
  beforeEach(() => {
    dbPath = path.join(os.tmpdir(), `promotion-positive-semantics-${Date.now()}-${Math.random()}.sqlite`);
    db = new BetterSqlite3(dbPath);
    db.exec(`
      CREATE TABLE IF NOT EXISTS memory_index (
        id INTEGER PRIMARY KEY,
        title TEXT,
        confidence REAL DEFAULT 0.5,
        validation_count INTEGER DEFAULT 0,
        importance_tier TEXT DEFAULT 'normal',
        updated_at TEXT
      )
    `);
  });

  afterEach(() => {
    try {
      if (db) db.close();
      if (dbPath && fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
    } catch {
      // Non-fatal cleanup
    }
  });

  it('confidence-tracker eligibility subtracts negative validations from threshold counts', () => {
    insertMemory(1, { confidence: 0.95, validationCount: 5, tier: 'normal' });
    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(true);

    recordNegativeFeedbackEvent(db, 1);
    recordNegativeFeedbackEvent(db, 1);

    expect(confidenceTracker.checkPromotionEligible(db, 1)).toBe(false);

    const info = confidenceTracker.getConfidenceInfo(db, 1);
    expect(info.validationCount).toBe(5);
    expect(info.positiveValidationCount).toBe(3);
    expect(info.promotionProgress.validationsMet).toBe(false);
  });

  it('recordValidation reports positiveValidationCount separately from total validationCount', () => {
    insertMemory(2, { confidence: 0.9, validationCount: 4, tier: 'normal' });

    const negativeResult = confidenceTracker.recordValidation(db, 2, false);
    expect(negativeResult.validationCount).toBe(5);
    // Current feedback is negative, so positive count should not increase.
    expect(negativeResult.positiveValidationCount).toBe(4);
    expect(negativeResult.promotionEligible).toBe(false);

    // Persist the negative event for future calls (handler does this in runtime flow).
    recordNegativeFeedbackEvent(db, 2);

    const positiveResult = confidenceTracker.recordValidation(db, 2, true);
    expect(positiveResult.validationCount).toBe(6);
    expect(positiveResult.positiveValidationCount).toBe(5);
    expect(positiveResult.promotionEligible).toBe(true);
  });

  it('auto-promotion checks use positive-validation counts (total minus negatives)', () => {
    insertMemory(3, { tier: 'normal', validationCount: 5 });
    recordNegativeFeedbackEvent(db, 3);
    recordNegativeFeedbackEvent(db, 3);

    const blocked = checkAutoPromotion(db, 3);
    expect(blocked.promoted).toBe(false);
    expect(blocked.validationCount).toBe(3);
    expect(blocked.reason).toContain('positive_validation_count=3/5');

    insertMemory(4, { tier: 'normal', validationCount: 7 });
    recordNegativeFeedbackEvent(db, 4);
    recordNegativeFeedbackEvent(db, 4);

    const eligible = checkAutoPromotion(db, 4);
    expect(eligible.promoted).toBe(true);
    expect(eligible.validationCount).toBe(5);

    const executed = executeAutoPromotion(db, 4);
    expect(executed.promoted).toBe(true);
    const row = db.prepare('SELECT importance_tier FROM memory_index WHERE id = 4').get() as {
      importance_tier: string;
    };
    expect(row.importance_tier).toBe('important');
  });

  it('scanForPromotions only returns rows that meet positive thresholds', () => {
    insertMemory(10, { tier: 'normal', validationCount: 5 });
    insertMemory(11, { tier: 'normal', validationCount: 5 });
    recordNegativeFeedbackEvent(db, 11);
    recordNegativeFeedbackEvent(db, 11);

    const eligible = scanForPromotions(db);
    expect(eligible).toHaveLength(1);
    expect(eligible[0].reason).toContain('positive_validation_count=5>=5');
  });
});
