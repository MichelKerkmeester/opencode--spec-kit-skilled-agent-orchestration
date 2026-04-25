// ───────────────────────────────────────────────────────────────
// MODULE: Settings-driven Invocation Parity (F23.1 / F25 / F46 / F56 regression guard)
// ───────────────────────────────────────────────────────────────
//
// PURPOSE
// -------
// Locks in the canonical NESTED shape of `.claude/settings.local.json` so a
// regression like the one PR 2 fixed (F23.1: top-level `bash:` field firing the
// copilot adapter alongside the nested claude adapter, causing duplicate
// briefs) cannot land again.
//
// CANONICAL SHAPE (per Claude Code's hook schema)
// -----------------------------------------------
//   "hooks": {
//     "<EventName>": [
//       {
//         "matcher": "...",
//         "hooks": [
//           { "type": "command", "command": "...", "timeout": N }
//         ]
//       }
//     ]
//   }
//
// CONTRACT
// --------
// For each Claude hook event (`UserPromptSubmit`, `PreCompact`, `SessionStart`,
// `Stop`):
//   - The event value is a single-element array of matcher-groups.
//   - Each matcher-group has a `matcher` string and a `hooks[]` array.
//   - `hooks[]` is a single-element array (no parallel-hook fan-out).
//   - The single hook has type === "command" and a `command` string.
//   - The matcher-group has NO top-level `bash:` field (the F23.1 trigger).
//   - The `command` string points at `dist/hooks/claude/<event>.js`
//     (NOT `dist/hooks/copilot/...` — the F23.1 wrong-adapter trigger).
//
// The `Stop` hook additionally must be `async: true` with a timeout that
// allows the session-stop handler to flush state (>= 10s).
//
// An anti-regression grep over the raw JSON file asserts ZERO occurrences of
// the substring `hooks/copilot/` — defense-in-depth against shape changes we
// didn't anticipate.
//
// ALWAYS-ON JSON SHAPE
// --------------------
// The JSON shape contract is runtime-independent: CI and autonomous runs on
// Codex / Copilot / Gemini must still assert the production
// `.claude/settings.local.json` contents. Only true Claude interpreter behavior
// belongs behind a Claude runtime guard; this suite intentionally stays at the
// checked-in JSON boundary.
//
// NON-GOALS (intentional brittleness budget)
// ------------------------------------------
// - Does NOT assert exact `timeout` values for non-Stop hooks (3s today; not
//   load-bearing — Claude's interpreter may relax this).
// - Does NOT assert env-var passthrough or matchers other than presence and
//   string type (matchers can be empty string for lifecycle events).
// - Does NOT mock Claude Code's closed-source hook-schema interpreter — the
//   contract is enforced at the JSON-shape boundary.
//
// SOURCES: iter-9 F46, iter-10 F51, iter-11 F56; .claude/settings.local.json (post-PR-2 nested shape).

import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

// ───────────────────────────────────────────────────────────────
// 1. PATH RESOLUTION
// ───────────────────────────────────────────────────────────────

// tests/hooks/<this-file>.ts -> 7 levels up reaches repo root.
//   hooks -> tests -> skill-advisor -> mcp_server -> system-spec-kit
//   -> skill -> .opencode -> <repo-root>
const REPO_ROOT = resolve(import.meta.dirname, '../../../../../../..');
const SETTINGS_PATH = resolve(REPO_ROOT, '.claude/settings.local.json');
const SETTINGS_EXISTS = existsSync(SETTINGS_PATH);
const RAW_SETTINGS = SETTINGS_EXISTS ? readFileSync(SETTINGS_PATH, 'utf8') : '';
const SETTINGS = RAW_SETTINGS ? JSON.parse(RAW_SETTINGS) as ClaudeSettings : {};

// ───────────────────────────────────────────────────────────────
// 2. EXPECTED SHAPE
// ───────────────────────────────────────────────────────────────

const EXPECTED_HOOK_EVENTS = [
  'UserPromptSubmit',
  'PreCompact',
  'SessionStart',
  'Stop',
] as const;

const EXPECTED_HANDLER_FRAGMENTS: Record<(typeof EXPECTED_HOOK_EVENTS)[number], string> = {
  UserPromptSubmit: 'dist/hooks/claude/user-prompt-submit.js',
  PreCompact: 'dist/hooks/claude/compact-inject.js',
  SessionStart: 'dist/hooks/claude/session-prime.js',
  Stop: 'dist/hooks/claude/session-stop.js',
};

interface HookCommand {
  readonly type?: string;
  readonly command?: string;
  readonly timeout?: number;
  readonly async?: boolean;
}

interface MatcherGroup {
  readonly matcher?: string;
  readonly hooks?: HookCommand[];
  // The F23.1 trigger field. MUST be undefined at the matcher-group level.
  readonly bash?: string;
}

interface ClaudeSettings {
  readonly hooks?: Record<string, MatcherGroup[]>;
}

// ───────────────────────────────────────────────────────────────
// 3. SUITE
// ───────────────────────────────────────────────────────────────

describe('settings-driven invocation parity (F23.1 / F25 / F46 / F56)', () => {
    it('settings file exists at the expected path', () => {
      expect(SETTINGS_EXISTS).toBe(true);
    });

    it('top-level hooks block is defined and contains the four expected events', () => {
      expect(SETTINGS.hooks).toBeDefined();
      const keys = Object.keys(SETTINGS.hooks ?? {}).sort();
      for (const event of EXPECTED_HOOK_EVENTS) {
        expect(keys).toContain(event);
      }
    });

    for (const event of EXPECTED_HOOK_EVENTS) {
      describe(`event=${event}`, () => {
        const getMatcherGroup = (): MatcherGroup | undefined =>
          SETTINGS.hooks?.[event]?.[0];
        const getHook = (): HookCommand | undefined =>
          getMatcherGroup()?.hooks?.[0];

        it('event is a single-element array of matcher-groups (no parallel-hook duplication)', () => {
          const arr = SETTINGS.hooks?.[event];
          expect(Array.isArray(arr)).toBe(true);
          expect(arr).toHaveLength(1);
        });

        it('matcher-group has a `matcher` string field', () => {
          const group = getMatcherGroup();
          expect(typeof group?.matcher).toBe('string');
        });

        it('matcher-group has a single-element nested `hooks[]` array', () => {
          const group = getMatcherGroup();
          expect(Array.isArray(group?.hooks)).toBe(true);
          expect(group?.hooks).toHaveLength(1);
        });

        it('matcher-group has no top-level `bash` field (the F23.1 trigger)', () => {
          const group = getMatcherGroup();
          expect(group?.bash).toBeUndefined();
        });

        it('inner hook has `type: "command"`', () => {
          const hook = getHook();
          expect(hook?.type).toBe('command');
        });

        it('inner hook has a non-empty `command` string', () => {
          const hook = getHook();
          expect(hook?.command).toBeTypeOf('string');
          expect((hook?.command ?? '').length).toBeGreaterThan(0);
        });

        it('command points at the claude/ adapter, NOT copilot/codex/gemini', () => {
          const cmd = getHook()?.command ?? '';
          expect(cmd).toContain(EXPECTED_HANDLER_FRAGMENTS[event]);
          expect(cmd).not.toContain('hooks/copilot/');
          expect(cmd).not.toContain('hooks/codex/');
          expect(cmd).not.toContain('hooks/gemini/');
        });

        it('command is anchored to the canonical repo root and pinned node binary', () => {
          const cmd = getHook()?.command ?? '';
          expect(cmd).toContain(`cd "${REPO_ROOT}"`);
          expect(cmd).toMatch(/&& \/[^'"\s]+\/node\s+\.opencode\/skill\/system-spec-kit\/mcp_server\/dist\/hooks\/claude\//);
          expect(cmd).not.toContain('git rev-parse');
          expect(cmd).not.toContain('|| pwd');
          expect(cmd).not.toContain('&& node ');
        });

        it('command terminates in a .js script reference', () => {
          // The command may be wrapped in `bash -c '... node <path>.js'`,
          // so we check that the resolved handler fragment ends with `.js`
          // rather than that the entire command literal ends with `.js`.
          expect(EXPECTED_HANDLER_FRAGMENTS[event].endsWith('.js')).toBe(true);
          expect(getHook()?.command).toMatch(/\.js(?:'|"|\s|$)/);
        });
      });
    }

    describe('event=Stop (async-flush special case)', () => {
      it('Stop hook is async with a flush-window timeout (>= 10s)', () => {
        const stop = SETTINGS.hooks?.Stop?.[0]?.hooks?.[0];
        expect(stop?.async).toBe(true);
        // We assert the floor (10s) but NOT an exact value — Claude may relax
        // this upward without breaking the contract. The floor is load-bearing
        // because session-stop must have time to write continuity state.
        expect(stop?.timeout).toBeTypeOf('number');
        expect(stop?.timeout ?? 0).toBeGreaterThanOrEqual(10);
      });
    });

    describe('anti-regression: copilot adapter must not appear anywhere in the file', () => {
      it('grep -c "hooks/copilot/" returns 0', () => {
        // Defense-in-depth: even if the parsed shape passes, a stray copilot
        // reference anywhere in the raw text would be suspicious. Use grep
        // (not String.prototype.includes) to mirror what a human reviewer
        // would run, and to surface any regression-shaped JSON we didn't
        // anticipate.
        let count: number;
        try {
          const out = execFileSync('grep', ['-c', 'hooks/copilot/', SETTINGS_PATH], {
            encoding: 'utf8',
          });
          count = Number.parseInt(out.trim(), 10);
        } catch (err) {
          // grep -c exits 1 when there are zero matches — that's the success
          // case for this assertion.
          const exitErr = err as { status?: number; stdout?: string };
          if (exitErr.status === 1) {
            count = 0;
          } else {
            throw err;
          }
        }
        expect(count).toBe(0);
      });
    });
  });
