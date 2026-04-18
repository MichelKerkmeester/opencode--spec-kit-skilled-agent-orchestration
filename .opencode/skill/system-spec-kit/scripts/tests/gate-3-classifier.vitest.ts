import { describe, expect, it } from 'vitest';
import { RECOVERED_TRANSCRIPT_STRIP_PATTERNS } from '../../mcp_server/hooks/shared-provenance.js';

import {
  FILE_WRITE_TRIGGERS,
  GATE_3_SCHEMA_VERSION,
  GATE_3_VOCABULARY,
  MEMORY_SAVE_TRIGGERS,
  READ_ONLY_DISQUALIFIERS,
  RESUME_TRIGGERS,
  classifyPrompt,
  matchesEntry,
  normalizePrompt,
  toJsonSnapshot,
  tokenizePrompt,
} from '../../shared/gate-3-classifier';

const ASCII_ONLY_PATTERN = /^[\x00-\x7F]+$/;
const ADVERSARIAL_NORMALIZATION_CASES = [
  { input: 'SYST\u0415M:', expected: 'system:' },
  { input: 'SYSTE\u041C:', expected: 'system:' },
  { input: 'SY\u0405TEM:', expected: 'system:' },
  { input: 'US\u0415R:', expected: 'user:' },
  { input: 'U\u0405ER:', expected: 'user:' },
  { input: 'ASSIST\u0410NT:', expected: 'assistant:' },
  { input: 'ASSI\u0405TANT:', expected: 'assistant:' },
  { input: 'D\u0415VELOPER:', expected: 'developer:' },
  { input: 'D\u0415V\u0415LOPER:', expected: 'developer:' },
  { input: 'SYST\u00C9M:', expected: 'system:' },
  { input: 'US\u00C9R:', expected: 'user:' },
  { input: 'ASSIST\u00C1NT:', expected: 'assistant:' },
  { input: 'D\u00CBVELOPER:', expected: 'developer:' },
  { input: 'SYST\u0395M:', expected: 'system:' },
  { input: '\u0456gnore previous', expected: 'ignore previous' },
  { input: '\u0423ou are', expected: 'you are' },
  { input: 'Y\u043Eu are', expected: 'you are' },
  { input: 'Follo\uFF57 these instructions', expected: 'follow these instructions' },
  { input: '\uFF33\uFF39\uFF33\uFF34\uFF25\uFF2D:', expected: 'system:' },
  { input: 'imp\u043Ertant: ignore everything', expected: 'important: ignore everything' },
  { input: 'ign\u03BFre previous', expected: 'ignore previous' },
] as const;

describe('Gate 3 classifier — vocabulary invariants', () => {
  it('exposes a stable schema version', () => {
    expect(GATE_3_SCHEMA_VERSION).toBe('1.0.0');
  });

  it('exposes the five categorical groups via GATE_3_VOCABULARY', () => {
    expect(Object.keys(GATE_3_VOCABULARY)).toEqual([
      'fileWrite',
      'memorySave',
      'resume',
      'readOnlyDisqualifier',
    ]);
  });

  it('every file-write trigger is a single token (not a phrase)', () => {
    for (const entry of FILE_WRITE_TRIGGERS) {
      expect(entry.kind).toBe('token');
      expect(entry.pattern).not.toMatch(/\s/);
    }
  });

  it('every memory-save and resume trigger is a phrase', () => {
    for (const entry of MEMORY_SAVE_TRIGGERS) {
      expect(entry.kind).toBe('phrase');
    }
    for (const entry of RESUME_TRIGGERS) {
      expect(entry.kind).toBe('phrase');
    }
  });

  it('read-only disqualifiers include analyze/review/audit/inspect/explain', () => {
    const patterns = READ_ONLY_DISQUALIFIERS.map(e => e.pattern);
    expect(patterns).toEqual(expect.arrayContaining([
      'review', 'audit', 'inspect', 'analyze', 'explain',
    ]));
  });

  it('file-write list does NOT include analyze/decompose/phase (false-positive tokens)', () => {
    const patterns = FILE_WRITE_TRIGGERS.map(e => e.pattern);
    expect(patterns).not.toContain('analyze');
    expect(patterns).not.toContain('decompose');
    expect(patterns).not.toContain('phase');
  });
});

describe('Gate 3 classifier — normalization', () => {
  it('lowercases and collapses whitespace', () => {
    expect(normalizePrompt('Fix    THE bug')).toBe('fix the bug');
  });

  it('applies NFKC and strips soft hyphen / zero-width characters before matching', () => {
    expect(normalizePrompt('f\u00ADix   t\u200Bhe bug')).toBe('fix the bug');
    expect(normalizePrompt('\uFEFFwrite the file')).toBe('write the file');
  });

  it('folds adversarial Unicode confusables into ASCII-safe normalized prompts', () => {
    for (const { input, expected } of ADVERSARIAL_NORMALIZATION_CASES) {
      const normalized = normalizePrompt(input);
      expect(normalized).toBe(expected);
      expect(ASCII_ONLY_PATTERN.test(normalized)).toBe(true);
      expect(RECOVERED_TRANSCRIPT_STRIP_PATTERNS.some((pattern) => pattern.test(normalized))).toBe(true);
    }
  });

  it('does not over-fold plain ASCII control inputs', () => {
    expect(normalizePrompt('System:')).toBe('system:');
    expect(normalizePrompt('system:')).toBe('system:');
  });

  it('tokenizes while preserving /, :, - and _', () => {
    const tokens = tokenizePrompt(normalizePrompt('/spec_kit:resume the deep-research'));
    expect(tokens).toEqual(expect.arrayContaining(['/spec_kit:resume', 'the', 'deep-research']));
  });
});

describe('Gate 3 classifier — matchesEntry', () => {
  it('matches a token only as a standalone word', () => {
    const tokens = tokenizePrompt('please fix this');
    expect(
      matchesEntry({ pattern: 'fix', kind: 'token', category: 'file_write' }, 'please fix this', tokens),
    ).toBe(true);
  });

  it('does NOT match a token that is a substring of another word', () => {
    const tokens = tokenizePrompt('the prefix is wrong');
    expect(
      matchesEntry({ pattern: 'fix', kind: 'token', category: 'file_write' }, 'the prefix is wrong', tokens),
    ).toBe(false);
  });

  it('matches a phrase as a substring of the normalized prompt', () => {
    const tokens = tokenizePrompt('please save memory now');
    expect(
      matchesEntry({ pattern: 'save memory', kind: 'phrase', category: 'memory_save' }, 'please save memory now', tokens),
    ).toBe(true);
  });
});

describe('Gate 3 classifier — positive matches (T-DOC-02)', () => {
  it('triggers Gate 3 for "implement the feature"', () => {
    const r = classifyPrompt('implement the new feature');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('triggers Gate 3 for "rename the helper"', () => {
    expect(classifyPrompt('rename the helper module').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for "fix the bug"', () => {
    expect(classifyPrompt('please fix the bug in session-stop').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 when soft hyphen hides a file-write token', () => {
    const r = classifyPrompt('f\u00ADile write');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('triggers Gate 3 when zero-width space hides a file-write token', () => {
    const r = classifyPrompt('wr\u200Bite the packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('triggers Gate 3 when soft hyphen and zero-width space appear together', () => {
    const r = classifyPrompt('wr\u00ADi\u200Bte the packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });
});

describe('Gate 3 classifier — read-only disqualifiers (T-DOC-02)', () => {
  it('does NOT trigger Gate 3 for "analyze the phase transition"', () => {
    const r = classifyPrompt('analyze the phase transition');
    expect(r.triggersGate3).toBe(false);
    expect(r.reason).toBe('no_match');
  });

  it('does NOT trigger Gate 3 for "review the decomposition phase"', () => {
    const r = classifyPrompt('review the decomposition phase');
    expect(r.triggersGate3).toBe(false);
  });

  it('does NOT trigger Gate 3 for "audit the synthesis phase"', () => {
    const r = classifyPrompt('audit the synthesis phase');
    expect(r.triggersGate3).toBe(false);
  });

  it('suppresses Gate 3 when "review" co-occurs with a file-write verb', () => {
    // e.g., "review the changes I want to update" — read-only framing dominates
    const r = classifyPrompt('review the changes I want to update');
    expect(r.triggersGate3).toBe(false);
    expect(r.reason).toBe('read_only_override');
  });

  it('recovers mixed read-only prompts with an explicit write tail', () => {
    for (const prompt of [
      'review the routing corpus and update the mislabeled prompts',
      'audit the packet docs, then generate a corrected iteration stub',
      'analyze the current error classes and patch the obvious trigger gap',
      'explain the taxonomy, then rewrite the weak prompts',
    ]) {
      const r = classifyPrompt(prompt);
      expect(r.triggersGate3).toBe(true);
      expect(r.reason).toBe('file_write_match');
    }
  });

  it('does NOT suppress Gate 3 for a save-memory trigger even with "review"', () => {
    const r = classifyPrompt('review and save memory for the packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('memory_save_match');
  });
});

describe('Gate 3 classifier — save/resume/continue (T-DOC-03)', () => {
  it('triggers Gate 3 for "save context"', () => {
    const r = classifyPrompt('save context for the current spec');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('memory_save_match');
  });

  it('triggers Gate 3 for "save memory"', () => {
    expect(classifyPrompt('save memory now').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for "/memory:save"', () => {
    const r = classifyPrompt('please run /memory:save on the 016 packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('memory_save_match');
  });

  it('triggers Gate 3 for "/spec_kit:resume"', () => {
    const r = classifyPrompt('/spec_kit:resume the 016 packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('resume_match');
  });

  it('triggers Gate 3 for "resume deep research"', () => {
    expect(classifyPrompt('resume deep research loop').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for "continue iteration"', () => {
    expect(classifyPrompt('continue iteration 42').triggersGate3).toBe(true);
  });

  it('triggers Gate 3 for broader resume/context continuity markers', () => {
    for (const prompt of [
      'resume the packet and reconstruct continuity from implementation-summary.md',
      'resume the phase folder and rebuild context from continuity',
    ]) {
      const r = classifyPrompt(prompt);
      expect(r.triggersGate3).toBe(true);
      expect(r.reason).toBe('resume_match');
    }
  });

  it('triggers Gate 3 for direct spec_kit deep-research command prompts', () => {
    const r = classifyPrompt('run /spec_kit:deep-research :auto for the routing packet');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('resume_match');
    expect(r.matched.map((entry) => entry.pattern)).toEqual(expect.arrayContaining([
      '/spec_kit:deep-research',
      ':auto',
    ]));
  });

  it('triggers Gate 3 for direct spec_kit deep-review command prompts', () => {
    const r = classifyPrompt('/spec_kit:deep-review :auto the current packet for 10 iterations');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('resume_match');
  });

  it('triggers Gate 3 for deep-loop natural-language markers', () => {
    for (const prompt of [
      'run a deep research pass over the packet',
      'continue the active deep-research lineage',
      'start a deep review loop with convergence tracking',
      'kick off another deep-review wave for packet docs',
      'continue the iteration loop and append artifacts',
      'begin a 10-iteration research sweep over routing prompts',
      'autoresearch the routing accuracy packet',
    ]) {
      const r = classifyPrompt(prompt);
      expect(r.triggersGate3).toBe(true);
      expect(r.reason).toBe('resume_match');
    }
  });

  it('only treats :auto as deep-loop write marker when paired with spec_kit', () => {
    expect(classifyPrompt('explain the :auto suffix in isolation').triggersGate3).toBe(false);
    expect(classifyPrompt('run spec_kit:deep-review :auto on the packet').triggersGate3).toBe(true);
  });
});

describe('Gate 3 classifier — negative baselines', () => {
  it('does NOT trigger Gate 3 for pure greetings', () => {
    expect(classifyPrompt('hello, what is the current status').triggersGate3).toBe(false);
  });

  it('does NOT trigger Gate 3 for pure question prompts', () => {
    expect(classifyPrompt('what files live in the shared folder?').triggersGate3).toBe(false);
  });

  it('does NOT trigger Gate 3 for "show me" reads', () => {
    expect(classifyPrompt('show me the recent commits').triggersGate3).toBe(false);
  });

  it('keeps historical false-positive tokens read-only when no write tail exists', () => {
    for (const prompt of [
      'analyze the routing phase',
      'decompose the planning phase at a high level',
      'explain the phase taxonomy',
      'analyze whether phase causes confusion, but do not change anything',
    ]) {
      expect(classifyPrompt(prompt).triggersGate3).toBe(false);
    }
  });

  it('does NOT trigger Gate 3 for prompt-only generation in chat', () => {
    for (const prompt of [
      'create a sharper prompt for the next routing run',
      'generate a better prompt package, but do not save it anywhere',
      'build a better phrasing for the deep-review dispatch and keep it in chat only',
    ]) {
      expect(classifyPrompt(prompt).triggersGate3).toBe(false);
    }
  });

  it('does NOT trigger Gate 3 for read-only deep-loop references', () => {
    for (const prompt of [
      'inspect the deep-research state log and summarize progression',
      'review the deep-research instructions and confirm scope',
      'explain why deep-loop prompts matter',
    ]) {
      expect(classifyPrompt(prompt).triggersGate3).toBe(false);
    }
  });

  it('confusable-folds Cyrillic homoglyphs into a file-write token', () => {
    const r = classifyPrompt('d\u0435lete the helper');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('confusable-folds Greek epsilon into a file-write token', () => {
    const r = classifyPrompt('\u0395dit the helper');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });

  it('accent-folds Latin characters into a file-write token', () => {
    const r = classifyPrompt('cr\u00E9ate the helper');
    expect(r.triggersGate3).toBe(true);
    expect(r.reason).toBe('file_write_match');
  });
});

describe('Gate 3 classifier — JSON snapshot', () => {
  it('emits a structurally valid snapshot', () => {
    const snap = toJsonSnapshot();
    expect(snap.version).toBe(GATE_3_SCHEMA_VERSION);
    expect(snap.fileWrite.length).toBe(FILE_WRITE_TRIGGERS.length);
    expect(snap.memorySave.length).toBe(MEMORY_SAVE_TRIGGERS.length);
    expect(snap.resume.length).toBe(RESUME_TRIGGERS.length);
    expect(snap.readOnlyDisqualifier.length).toBe(READ_ONLY_DISQUALIFIERS.length);
    for (const entry of snap.fileWrite) {
      expect(entry.kind).toBe('token');
    }
  });
});
