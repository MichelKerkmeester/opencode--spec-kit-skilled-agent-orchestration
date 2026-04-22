import { readdir } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { fileURLToPath } from 'node:url';

import { describe, expect, it } from 'vitest';

const thisDir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(thisDir, '../../../../..');
const pluginsDir = resolve(repoRoot, '.opencode/plugins');
const pluginExtensions = new Set(['.js', '.mjs', '.ts']);
const hookKeys = new Set([
  'event',
  'config',
  'tool',
  'auth',
  'provider',
  'chat.message',
  'chat.params',
  'chat.headers',
  'permission.ask',
  'command.execute.before',
  'tool.execute.before',
  'shell.env',
  'tool.execute.after',
  'experimental.chat.messages.transform',
  'experimental.chat.system.transform',
  'experimental.session.compacting',
  'experimental.text.complete',
  'tool.definition',
]);

function hasHookProperty(value: Record<string, unknown>): boolean {
  return Object.keys(value).some((key) => hookKeys.has(key));
}

describe('OpenCode plugins folder purity', () => {
  it('contains only importable plugin entrypoints with valid hook objects', async () => {
    const entries = await readdir(pluginsDir, { withFileTypes: true });
    const pluginFiles = entries
      .filter((entry) => entry.isFile() && pluginExtensions.has(extname(entry.name)))
      .map((entry) => resolve(pluginsDir, entry.name))
      .sort();

    expect(pluginFiles.length).toBeGreaterThan(0);

    for (const pluginFile of pluginFiles) {
      const pluginModule = await import(pathToFileURL(pluginFile).href);
      expect(pluginModule, `${pluginFile} must default-export an OpenCode plugin entrypoint`)
        .toHaveProperty('default');

      const pluginDefault = pluginModule.default;
      expect(pluginDefault, `${pluginFile} default export must not be nullish`)
        .not.toBeNull();
      expect(pluginDefault, `${pluginFile} default export must not be undefined`)
        .not.toBeUndefined();

      if (typeof pluginDefault === 'function') {
        const hooks = await pluginDefault({});
        expect(hooks, `${pluginFile} plugin factory must return a hook object`)
          .not.toBeNull();
        expect(hooks, `${pluginFile} plugin factory must not return undefined`)
          .not.toBeUndefined();
        expect(hooks, `${pluginFile} plugin factory must return an object`)
          .toEqual(expect.any(Object));
        expect(hasHookProperty(hooks), `${pluginFile} plugin factory returned no recognized OpenCode hook keys`)
          .toBe(true);
        continue;
      }

      expect(pluginDefault, `${pluginFile} object default export must be an OpenCode hook object`)
        .toEqual(expect.any(Object));
      expect(hasHookProperty(pluginDefault), `${pluginFile} object default export has no recognized OpenCode hook keys`)
        .toBe(true);
    }
  });
});
