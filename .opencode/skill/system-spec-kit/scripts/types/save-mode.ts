// ---------------------------------------------------------------
// MODULE: Save Mode
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. SAVE MODE
// ───────────────────────────────────────────────────────────────
// Explicit save intent used for control flow. `_source` remains provenance.

export enum SaveMode {
  Json = 'json',
  Capture = 'capture',
  ManualFile = 'manual-file',
}

export interface SaveModeInput {
  saveMode?: SaveMode | string;
  save_mode?: SaveMode | string;
  _source?: string | null;
  inputMode?: string | null;
  _isSimulation?: boolean | null;
}

function normalizeExplicitSaveMode(value: string | undefined): SaveMode | null {
  switch (value) {
    case SaveMode.Json:
    case 'file':
    case 'structured':
      return SaveMode.Json;
    case SaveMode.Capture:
    case 'captured':
      return SaveMode.Capture;
    case SaveMode.ManualFile:
    case 'manual':
    case 'simulation':
      return SaveMode.ManualFile;
    default:
      return null;
  }
}

export function resolveSaveMode(input: SaveModeInput | null | undefined): SaveMode {
  const explicitMode = typeof input?.saveMode === 'string'
    ? input.saveMode
    : typeof input?.save_mode === 'string'
      ? input.save_mode
      : undefined;
  const normalizedExplicitMode = normalizeExplicitSaveMode(explicitMode);
  if (normalizedExplicitMode) {
    return normalizedExplicitMode;
  }

  if (input?._isSimulation === true) {
    return SaveMode.ManualFile;
  }

  if (input?.inputMode === 'captured') {
    return SaveMode.Capture;
  }
  if (input?.inputMode === 'structured' || input?.inputMode === 'file') {
    return SaveMode.Json;
  }

  if (input?._source === 'simulation' || input?._source === SaveMode.ManualFile) {
    return SaveMode.ManualFile;
  }
  if (!input?._source || input._source === 'file') {
    return SaveMode.Json;
  }

  return SaveMode.Capture;
}
