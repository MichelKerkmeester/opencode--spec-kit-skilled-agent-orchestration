// ───────────────────────────────────────────────────────────────
// MODULE: Advisor Daemon State Mutation
// ───────────────────────────────────────────────────────────────

import Database from 'better-sqlite3';
import { mkdirSync } from 'node:fs';
import { dirname } from 'node:path';
import { errorMessage } from '../utils/error-format.js';

const DEFAULT_BUSY_RETRY_ATTEMPTS = 3;

function isSqliteBusyError(error: unknown): boolean {
  const code = (error as { code?: unknown })?.code;
  const message = errorMessage(error);
  return code === 'SQLITE_BUSY' || /SQLITE_BUSY/i.test(message);
}

export function runDaemonStateMutation<T>(
  dbPath: string,
  initialize: (db: Database.Database) => void,
  mutate: (db: Database.Database) => T,
  attempts = DEFAULT_BUSY_RETRY_ATTEMPTS,
): T {
  let remaining = attempts;
  while (true) {
    const db = openDaemonStateDb(dbPath);
    try {
      initialize(db);
      return mutate(db);
    } catch (error: unknown) {
      if (!isSqliteBusyError(error) || remaining <= 0) {
        throw error;
      }
      remaining -= 1;
    } finally {
      db.close();
    }
  }
}

function openDaemonStateDb(dbPath: string): Database.Database {
  mkdirSync(dirname(dbPath), { recursive: true });
  return new Database(dbPath);
}
