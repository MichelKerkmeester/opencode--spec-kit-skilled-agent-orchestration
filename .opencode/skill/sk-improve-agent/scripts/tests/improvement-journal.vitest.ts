import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { describe, expect, it, beforeEach, afterEach } from 'vitest';

const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));
const WORKSPACE_ROOT = path.resolve(TEST_DIR, '../../../../../');
const require = createRequire(import.meta.url);

const journal = require(path.join(
  WORKSPACE_ROOT,
  '.opencode/skill/sk-improve-agent/scripts/improvement-journal.cjs',
)) as {
  STOP_REASONS: Readonly<Record<string, string>>;
  SESSION_OUTCOMES: Readonly<Record<string, string>>;
  VALID_EVENT_TYPES: readonly string[];
  LEGAL_STOP_GATES: readonly string[];
  validateEvent: (event: object) => { valid: boolean; errors: string[] };
  emitEvent: (journalPath: string, event: object) => { success: boolean; errors?: string[] };
  readJournal: (journalPath: string) => object[];
  getLastIteration: (journalPath: string) => number;
  getSessionResult: (journalPath: string) => { stopReason: string | null; sessionOutcome: string | null };
};

let tmpDir: string;
let journalPath: string;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'journal-test-'));
  journalPath = path.join(tmpDir, 'improvement-journal.jsonl');
});

afterEach(() => {
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe('improvement-journal', () => {
  describe('constants', () => {
    it('exports frozen STOP_REASONS', () => {
      expect(journal.STOP_REASONS).toBeDefined();
      expect(Object.isFrozen(journal.STOP_REASONS)).toBe(true);
      expect(journal.STOP_REASONS.converged).toBe('converged');
      expect(journal.STOP_REASONS.maxIterationsReached).toBe('maxIterationsReached');
      expect(journal.STOP_REASONS.blockedStop).toBe('blockedStop');
      expect(journal.STOP_REASONS.manualStop).toBe('manualStop');
      expect(journal.STOP_REASONS.error).toBe('error');
      expect(journal.STOP_REASONS.stuckRecovery).toBe('stuckRecovery');
    });

    it('exports frozen SESSION_OUTCOMES', () => {
      expect(journal.SESSION_OUTCOMES).toBeDefined();
      expect(Object.isFrozen(journal.SESSION_OUTCOMES)).toBe(true);
      expect(journal.SESSION_OUTCOMES.keptBaseline).toBe('keptBaseline');
      expect(journal.SESSION_OUTCOMES.promoted).toBe('promoted');
      expect(journal.SESSION_OUTCOMES.rolledBack).toBe('rolledBack');
      expect(journal.SESSION_OUTCOMES.advisoryOnly).toBe('advisoryOnly');
    });

    it('exports VALID_EVENT_TYPES array', () => {
      expect(Array.isArray(journal.VALID_EVENT_TYPES)).toBe(true);
      expect(journal.VALID_EVENT_TYPES).toContain('session_start');
      expect(journal.VALID_EVENT_TYPES).toContain('candidate_generated');
      expect(journal.VALID_EVENT_TYPES).toContain('candidate_scored');
      expect(journal.VALID_EVENT_TYPES).toContain('session_ended');
      expect(journal.VALID_EVENT_TYPES).toContain('trade_off_detected');
    });

    it('exports the five legal-stop gate keys', () => {
      expect(journal.LEGAL_STOP_GATES).toEqual([
        'contractGate',
        'behaviorGate',
        'integrationGate',
        'evidenceGate',
        'improvementGate',
      ]);
      expect(Object.isFrozen(journal.LEGAL_STOP_GATES)).toBe(true);
    });
  });

  describe('validateEvent', () => {
    it('accepts valid event types', () => {
      const result = journal.validateEvent({ eventType: 'session_start' });
      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('rejects invalid event types', () => {
      const result = journal.validateEvent({ eventType: 'invalid_type' });
      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors[0]).toContain('Invalid eventType');
    });

    it('rejects null events', () => {
      const result = journal.validateEvent(null as unknown as object);
      expect(result.valid).toBe(false);
    });

    it('validates stopReason on session_ended events', () => {
      const valid = journal.validateEvent({
        eventType: 'session_ended',
        details: { stopReason: 'converged', sessionOutcome: 'promoted' },
      });
      expect(valid.valid).toBe(true);

      const invalid = journal.validateEvent({
        eventType: 'session_ended',
        details: { stopReason: 'madeUpReason' },
      });
      expect(invalid.valid).toBe(false);
    });

    it('rejects deprecated stop aliases on session_ended events', () => {
      const result = journal.validateEvent({
        eventType: 'session_ended',
        details: { stopReason: 'deprecatedStopAlias', sessionOutcome: 'keptBaseline' },
      });
      expect(result.valid).toBe(false);
      expect(result.errors[0]).toContain('Invalid stopReason');
    });

    it('accepts the session_end alias with stop reason and outcome', () => {
      const result = journal.validateEvent({
        eventType: 'session_end',
        details: { stopReason: 'maxIterationsReached', sessionOutcome: 'advisoryOnly' },
      });
      expect(result.valid).toBe(true);
    });

    it('accepts legal_stop_evaluated events with nested five-gate results', () => {
      const result = journal.validateEvent({
        eventType: 'legal_stop_evaluated',
        details: {
          gateResults: {
            contractGate: 'passed',
            behaviorGate: 'passed',
            integrationGate: 'passed',
            evidenceGate: 'failed',
            improvementGate: 'passed',
          },
        },
      });
      expect(result.valid).toBe(true);
    });

    it('rejects legal_stop_evaluated events without a complete nested gate bundle', () => {
      const result = journal.validateEvent({
        eventType: 'legal_stop_evaluated',
        details: {
          contractGate: 'passed',
          gateResults: {
            contractGate: 'passed',
          },
        },
      });
      expect(result.valid).toBe(false);
      expect(result.errors).toContain('legal_stop_evaluated details.gateResults missing behaviorGate');
      expect(result.errors).toContain('legal_stop_evaluated details.gateResults missing improvementGate');
    });
  });

  describe('emitEvent', () => {
    it('creates journal file and appends event', () => {
      const result = journal.emitEvent(journalPath, {
        eventType: 'session_start',
        iteration: 1,
        details: { sessionId: 'test-session' },
      });
      expect(result.success).toBe(true);
      expect(fs.existsSync(journalPath)).toBe(true);

      const content = fs.readFileSync(journalPath, 'utf8');
      const parsed = JSON.parse(content.trim());
      expect(parsed.eventType).toBe('session_start');
      expect(parsed.timestamp).toBeDefined();
    });

    it('appends to existing journal (append-only)', () => {
      journal.emitEvent(journalPath, { eventType: 'session_start', iteration: 1 });
      journal.emitEvent(journalPath, { eventType: 'candidate_generated', iteration: 1 });

      const lines = fs.readFileSync(journalPath, 'utf8').trim().split('\n');
      expect(lines).toHaveLength(2);

      const first = JSON.parse(lines[0]);
      const second = JSON.parse(lines[1]);
      expect(first.eventType).toBe('session_start');
      expect(second.eventType).toBe('candidate_generated');
    });

    it('rejects invalid event types', () => {
      const result = journal.emitEvent(journalPath, { eventType: 'not_real' });
      expect(result.success).toBe(false);
      expect(result.errors).toBeDefined();
      expect(result.errors!.length).toBeGreaterThan(0);

      // File should not be created for invalid events
      expect(fs.existsSync(journalPath)).toBe(false);
    });

    it('adds timestamp automatically', () => {
      journal.emitEvent(journalPath, { eventType: 'session_start' });
      const events = journal.readJournal(journalPath);
      expect(events[0]).toHaveProperty('timestamp');
    });
  });

  describe('readJournal', () => {
    it('returns empty array for non-existent file', () => {
      const events = journal.readJournal('/nonexistent/path.jsonl');
      expect(events).toEqual([]);
    });

    it('reads all events from journal', () => {
      journal.emitEvent(journalPath, { eventType: 'session_start', iteration: 0 });
      journal.emitEvent(journalPath, { eventType: 'candidate_generated', iteration: 1 });
      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 1 });

      const events = journal.readJournal(journalPath);
      expect(events).toHaveLength(3);
    });
  });

  describe('getLastIteration', () => {
    it('returns 0 for empty journal', () => {
      expect(journal.getLastIteration(journalPath)).toBe(0);
    });

    it('returns highest iteration number', () => {
      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 1 });
      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 3 });
      journal.emitEvent(journalPath, { eventType: 'candidate_scored', iteration: 2 });

      expect(journal.getLastIteration(journalPath)).toBe(3);
    });
  });

  describe('getSessionResult', () => {
    it('returns nulls when no session_ended event', () => {
      journal.emitEvent(journalPath, { eventType: 'session_start' });
      const result = journal.getSessionResult(journalPath);
      expect(result.stopReason).toBeNull();
      expect(result.sessionOutcome).toBeNull();
    });

    it('returns stop reason and outcome from session_ended', () => {
      journal.emitEvent(journalPath, {
        eventType: 'session_ended',
        details: {
          stopReason: 'converged',
          sessionOutcome: 'promoted',
        },
      });

      const result = journal.getSessionResult(journalPath);
      expect(result.stopReason).toBe('converged');
      expect(result.sessionOutcome).toBe('promoted');
    });

    it('returns stop reason and outcome from session_end alias', () => {
      journal.emitEvent(journalPath, {
        eventType: 'session_end',
        details: {
          stopReason: 'maxIterationsReached',
          sessionOutcome: 'advisoryOnly',
        },
      });

      const result = journal.getSessionResult(journalPath);
      expect(result.stopReason).toBe('maxIterationsReached');
      expect(result.sessionOutcome).toBe('advisoryOnly');
    });
  });
});
