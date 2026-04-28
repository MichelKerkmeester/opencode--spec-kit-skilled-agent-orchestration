// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Freshness SQLite Integrity
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { existsSync } from 'node:fs';
import { errorMessage } from '../utils/error-format.js';

function isCorruptionError(error: unknown): boolean {
  return /database disk image is malformed|file is not a database|SQLITE_CORRUPT|SQLITE_NOTADB|malformed/i.test(errorMessage(error));
}

export function checkSqliteIntegrity(dbPath: string): { ok: true } | { ok: false; reason: string } {
  if (!existsSync(dbPath)) {
    return { ok: false, reason: 'SQLITE_ABSENT' };
  }

  let db: Database.Database | null = null;
  try {
    db = new Database(dbPath, { readonly: true, fileMustExist: true });
    const row = db.prepare('PRAGMA quick_check').get() as { quick_check?: string } | undefined;
    const value = row?.quick_check ?? 'unknown';
    if (value !== 'ok') {
      return { ok: false, reason: `SQLITE_QUICK_CHECK_${value}` };
    }
    return { ok: true };
  } catch (error: unknown) {
    if (isCorruptionError(error)) {
      return {
        ok: false,
        reason: errorMessage(error),
      };
    }
    throw error;
  } finally {
    db?.close();
  }
}
