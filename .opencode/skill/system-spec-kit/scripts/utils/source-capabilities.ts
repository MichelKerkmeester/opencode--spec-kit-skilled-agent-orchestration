// ───────────────────────────────────────────────────────────────
// MODULE: Source Capabilities
// ───────────────────────────────────────────────────────────────

import type { DataSource } from './input-normalizer';

export type SourceInputMode = 'structured' | 'captured';
export type KnownDataSource = DataSource;

export interface SourceCapabilities {
  source: DataSource;
  inputMode: SourceInputMode;
  toolTitleWithPathExpected: boolean;
  prefersStructuredSave: boolean;
}

const SOURCE_CAPABILITIES: Record<DataSource, SourceCapabilities> = {
  file: {
    source: 'file',
    inputMode: 'structured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'opencode-capture': {
    source: 'opencode-capture',
    inputMode: 'captured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'claude-code-capture': {
    source: 'claude-code-capture',
    inputMode: 'captured',
    toolTitleWithPathExpected: true,
    prefersStructuredSave: true,
  },
  'codex-cli-capture': {
    source: 'codex-cli-capture',
    inputMode: 'captured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'copilot-cli-capture': {
    source: 'copilot-cli-capture',
    inputMode: 'captured',
    toolTitleWithPathExpected: true,
    prefersStructuredSave: true, // NOTE: aspirational — most sources still rely on runtime capture. See O4-12.
  },
  'gemini-cli-capture': {
    source: 'gemini-cli-capture',
    inputMode: 'captured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  simulation: {
    source: 'simulation',
    inputMode: 'structured',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: false,
  },
};

function isKnownDataSource(source: string): source is KnownDataSource {
  return source in SOURCE_CAPABILITIES;
}

function getSourceCapabilities(source: DataSource | string | null | undefined): SourceCapabilities {
  if (!source) {
    return SOURCE_CAPABILITIES.file;
  }

  if (typeof source === 'string' && isKnownDataSource(source)) {
    return SOURCE_CAPABILITIES[source];
  }

  if (typeof source === 'string') {
    return SOURCE_CAPABILITIES.file;
  }

  return SOURCE_CAPABILITIES[source];
}

export {
  getSourceCapabilities,
};
