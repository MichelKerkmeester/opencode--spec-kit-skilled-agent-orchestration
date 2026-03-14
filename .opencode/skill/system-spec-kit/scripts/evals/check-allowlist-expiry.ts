// ---------------------------------------------------------------
// MODULE: Check Allowlist Expiry
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CHECK ALLOWLIST EXPIRY
// ───────────────────────────────────────────────────────────────
// Warns when allowlist exceptions are within 30 days of expiry.
// Fails when allowlist exceptions are already expired.

import * as fs from 'fs';
import * as path from 'path';

interface AllowlistException {
  file: string;
  import: string;
  owner: string;
  reason: string;
  removeWhen: string;
  createdAt?: string;
  lastReviewedAt?: string;
  expiresAt?: string;
}

interface Allowlist {
  description: string;
  exceptions: AllowlistException[];
}

interface ExpiryFinding {
  file: string;
  importPath: string;
  expiresAt: string;
  daysUntilExpiry: number;
}

interface InvalidExpiry {
  file: string;
  importPath: string;
  expiresAt: string;
}

function resolveAllowlistPath(): string | null {
  const candidates = [
    // Source layout (tsx): scripts/evals/check-allowlist-expiry.ts
    path.resolve(__dirname, 'import-policy-allowlist.json'),
    // Compiled layout (node): scripts/dist/evals/check-allowlist-expiry.js
    path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
    // Fallbacks based on cwd
    path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
    path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
  ];

  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return candidate;
  }

  return null;
}

const WARNING_WINDOW_DAYS = 30;
const MS_PER_DAY = 24 * 60 * 60 * 1000;

function loadAllowlist(): Allowlist {
  const allowlistPath = resolveAllowlistPath();

  if (!allowlistPath) {
    const searched = [
      path.resolve(__dirname, 'import-policy-allowlist.json'),
      path.resolve(__dirname, '../../evals/import-policy-allowlist.json'),
      path.resolve(process.cwd(), 'evals/import-policy-allowlist.json'),
      path.resolve(process.cwd(), 'scripts/evals/import-policy-allowlist.json'),
    ];
    console.error(`Error: allowlist file not found. Checked:\n${searched.map((item) => `  - ${item}`).join('\n')}`);
    process.exit(2);
  }

  try {
    const parsed: unknown = JSON.parse(fs.readFileSync(allowlistPath, 'utf-8'));
    if (!parsed || typeof parsed !== 'object') {
      throw new Error('allowlist must be a JSON object');
    }

    const candidate = parsed as Partial<Allowlist>;
    if (!Array.isArray(candidate.exceptions)) {
      throw new Error('allowlist.exceptions must be an array');
    }

    return {
      description: typeof candidate.description === 'string' ? candidate.description : '',
      exceptions: candidate.exceptions as AllowlistException[],
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`Error: failed to parse ${allowlistPath}: ${message}`);
    process.exit(2);
  }
}

function parseIsoDate(dateText: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateText)) return null;
  const year = Number(dateText.slice(0, 4));
  const month = Number(dateText.slice(5, 7));
  const day = Number(dateText.slice(8, 10));
  const parsed = new Date(`${dateText}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  if (
    parsed.getUTCFullYear() !== year ||
    parsed.getUTCMonth() !== month - 1 ||
    parsed.getUTCDate() !== day
  ) {
    return null;
  }
  return parsed;
}

function toUtcStartOfDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

function calculateDaysUntil(expiryDate: Date, now: Date): number {
  const nowDay = toUtcStartOfDay(now);
  const expiryDay = toUtcStartOfDay(expiryDate);
  return Math.floor((expiryDay - nowDay) / MS_PER_DAY);
}

function main(): void {
  const allowlist = loadAllowlist();
  const now = new Date();

  const expiredFindings: ExpiryFinding[] = [];
  const warningFindings: ExpiryFinding[] = [];
  const invalidDates: InvalidExpiry[] = [];

  for (const entry of allowlist.exceptions) {
    if (!entry.expiresAt) continue;

    const expiryDate = parseIsoDate(entry.expiresAt);
    if (!expiryDate) {
      invalidDates.push({
        file: entry.file,
        importPath: entry.import,
        expiresAt: entry.expiresAt,
      });
      continue;
    }

    const daysUntilExpiry = calculateDaysUntil(expiryDate, now);
    const finding: ExpiryFinding = {
      file: entry.file,
      importPath: entry.import,
      expiresAt: entry.expiresAt,
      daysUntilExpiry,
    };

    if (daysUntilExpiry < 0) {
      expiredFindings.push(finding);
      continue;
    }

    if (daysUntilExpiry <= WARNING_WINDOW_DAYS) {
      warningFindings.push(finding);
    }
  }

  if (invalidDates.length > 0) {
    console.error(`Allowlist expiry check FAILED: ${invalidDates.length} invalid expiresAt value(s):\n`);
    for (const item of invalidDates) {
      console.error(`  ${item.file} → ${item.importPath} (expiresAt: ${item.expiresAt})`);
    }
    console.error('\nUse ISO date format YYYY-MM-DD for expiresAt.');
    process.exit(2);
  }

  if (warningFindings.length > 0) {
    console.warn(`Allowlist expiry warning: ${warningFindings.length} exception(s) expire within ${WARNING_WINDOW_DAYS} days:\n`);
    for (const item of warningFindings) {
      console.warn(`  ${item.file} → ${item.importPath} (expires ${item.expiresAt}, ${item.daysUntilExpiry} day(s) remaining)`);
    }
    console.warn('');
  }

  if (expiredFindings.length > 0) {
    console.error(`Allowlist expiry check FAILED: ${expiredFindings.length} expired exception(s):\n`);
    for (const item of expiredFindings) {
      const daysOverdue = Math.abs(item.daysUntilExpiry);
      console.error(`  ${item.file} → ${item.importPath} (expired ${item.expiresAt}, ${daysOverdue} day(s) overdue)`);
    }
    console.error('\nRemove or renew expired allowlist entries before merging.');
    process.exit(1);
  }

  if (warningFindings.length === 0) {
    console.log('Allowlist expiry check passed: no entries expiring within 30 days and no expired entries found.');
  } else {
    console.log('Allowlist expiry check passed with warnings (no expired entries).');
  }

  process.exit(0);
}

main();
