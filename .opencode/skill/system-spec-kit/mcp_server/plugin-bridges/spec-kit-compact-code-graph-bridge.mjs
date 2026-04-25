#!/usr/bin/env node
// Helper for packet 026/007/009 (relocated under mcp_server/ in 026/009/016).
// Lives outside `.opencode/plugins/` so OpenCode discovers only real plugin entrypoints.

import { handleSessionResume } from '../dist/handlers/session-resume.js';
import * as vectorIndex from '../dist/lib/search/vector-index.js';
import * as sessionManager from '../dist/lib/session/session-manager.js';

function parseArgs(argv) {
  const options = {
    minimal: false,
    specFolder: undefined,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === '--minimal') {
      options.minimal = true;
      continue;
    }
    if (value === '--spec-folder') {
      const nextValue = argv[index + 1];
      if (typeof nextValue === 'string' && nextValue.trim()) {
        options.specFolder = nextValue.trim();
        index += 1;
      }
    }
  }

  return options;
}

function ensureRuntimeReady() {
  vectorIndex.initializeDb();
  const database = vectorIndex.getDb();
  if (!database) {
    throw new Error('Database not initialized after initializeDb()');
  }

  const sessionInit = sessionManager.init(database);
  if (!sessionInit.success) {
    throw new Error(sessionInit.error || 'Session manager initialization failed');
  }
}

async function withStdoutSilenced(fn) {
  const forwarded = (method) => (...args) => {
    const rendered = args
      .map((value) => (typeof value === 'string' ? value : JSON.stringify(value)))
      .join(' ');
    process.stderr.write(`${rendered}\n`);
  };

  const original = {
    log: console.log,
    info: console.info,
    debug: console.debug,
    warn: console.warn,
  };

  console.log = forwarded('log');
  console.info = forwarded('info');
  console.debug = forwarded('debug');
  console.warn = forwarded('warn');

  try {
    return await fn();
  } finally {
    console.log = original.log;
    console.info = original.info;
    console.debug = original.debug;
    console.warn = original.warn;
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const response = await withStdoutSilenced(async () => {
    ensureRuntimeReady();
    return await handleSessionResume({
      ...(args.specFolder ? { specFolder: args.specFolder } : {}),
      ...(args.minimal ? { minimal: true } : {}),
    });
  });

  const text = response?.content?.[0]?.text;
  if (typeof text !== 'string' || !text.trim()) {
    throw new Error('Bridge did not receive a text response from handleSessionResume()');
  }

  try {
    const parsed = JSON.parse(text);
    const plan = parsed?.data?.opencodeTransport;
    if (!plan || plan.transportOnly !== true) {
      process.stderr.write('[bridge] session_resume returned no opencodeTransport - plugin injection will no-op\n');
    }
  } catch {
    process.stderr.write('[bridge] session_resume returned non-JSON output - plugin injection will no-op\n');
  }

  process.stdout.write(text);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  process.stderr.write(`[spec-kit-compact-code-graph-bridge] ${message}\n`);
  process.exitCode = 1;
});
