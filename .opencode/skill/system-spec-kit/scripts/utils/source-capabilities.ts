import type { DataSource } from './input-normalizer';

export type SourceInputMode = 'structured' | 'stateless';
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
    inputMode: 'stateless',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'claude-code-capture': {
    source: 'claude-code-capture',
    inputMode: 'stateless',
    toolTitleWithPathExpected: true,
    prefersStructuredSave: true,
  },
  'codex-cli-capture': {
    source: 'codex-cli-capture',
    inputMode: 'stateless',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'copilot-cli-capture': {
    source: 'copilot-cli-capture',
    inputMode: 'stateless',
    toolTitleWithPathExpected: false,
    prefersStructuredSave: true,
  },
  'gemini-cli-capture': {
    source: 'gemini-cli-capture',
    inputMode: 'stateless',
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
  SOURCE_CAPABILITIES,
  getSourceCapabilities,
  isKnownDataSource,
};
