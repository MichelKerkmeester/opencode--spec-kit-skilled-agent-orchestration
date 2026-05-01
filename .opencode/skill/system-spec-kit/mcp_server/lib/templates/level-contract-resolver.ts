// -------------------------------------------------------------------
// MODULE: Level Contract Resolver
// -------------------------------------------------------------------

// -------------------------------------------------------------------
// 1. IMPORTS
// -------------------------------------------------------------------

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// -------------------------------------------------------------------
// 2. TYPES
// -------------------------------------------------------------------

export type SpecKitLevel = '1' | '2' | '3' | '3+' | 'phase';

export interface LevelContract {
  requiredCoreDocs: string[];
  requiredAddonDocs: string[];
  lazyAddonDocs: string[];
  sectionGates: Map<string, string[]>;
  sectionGatesByDocument: Map<string, Map<string, string[]>>;
  templateVersions: Record<string, string>;
  frontmatterMarkerLevel: number;
}

interface ManifestLevelRow {
  requiredCoreDocs: string[];
  requiredAddonDocs: string[];
  lazyAddonDocs: string[];
  sectionGates: Record<string, string[] | Record<string, string[]>>;
  frontmatterMarkerLevel: number;
}

interface SpecKitDocsManifest {
  manifestVersion: string;
  versions?: Record<string, string>;
  levels: Record<SpecKitLevel, ManifestLevelRow>;
}

export interface SerializedLevelContract {
  requiredCoreDocs: string[];
  requiredAddonDocs: string[];
  lazyAddonDocs: string[];
  sectionGates: Record<string, string[]>;
  sectionGatesByDocument: Record<string, Record<string, string[]>>;
  templateVersions: Record<string, string>;
  frontmatterMarkerLevel: number;
}

// -------------------------------------------------------------------
// 3. RESOLUTION
// -------------------------------------------------------------------

const MODULE_DIR = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_MANIFEST_PATH = path.resolve(MODULE_DIR, '../../../templates/manifest/spec-kit-docs.json');
const DIST_MANIFEST_PATH = path.resolve(MODULE_DIR, '../../../../templates/manifest/spec-kit-docs.json');
const VALID_LEVELS = new Set<SpecKitLevel>(['1', '2', '3', '3+', 'phase']);
const DOCUMENT_NAME_RE = /^(?:[A-Za-z0-9][A-Za-z0-9_-]*\/)?[A-Za-z0-9][A-Za-z0-9_-]*\.md$/u;
let cachedManifest: SpecKitDocsManifest | null = null;

function assertLevel(level: string): asserts level is SpecKitLevel {
  if (!VALID_LEVELS.has(level as SpecKitLevel)) {
    throw new Error(`Internal template contract could not be resolved for Level ${level}`);
  }
}

function levelContractError(level: string, cause?: unknown): Error {
  const error = new Error(`Internal template contract could not be resolved for Level ${level}`);
  if (process.env.SPECKIT_VERBOSE_RESOLVER === '1' && cause instanceof Error) {
    error.stack = `${error.message}\nCaused by: ${cause.stack ?? cause.message}`;
  }
  return error;
}

function resolveManifestPath(manifestPath: string): string {
  if (fs.existsSync(manifestPath)) {
    return manifestPath;
  }
  if (fs.existsSync(DIST_MANIFEST_PATH)) {
    return DIST_MANIFEST_PATH;
  }
  return manifestPath;
}

function loadManifest(level: SpecKitLevel, manifestPath = DEFAULT_MANIFEST_PATH): SpecKitDocsManifest {
  if (cachedManifest) {
    return cachedManifest;
  }

  try {
    const raw = fs.readFileSync(resolveManifestPath(manifestPath), 'utf8');
    cachedManifest = JSON.parse(raw) as SpecKitDocsManifest;
    return cachedManifest;
  } catch (error) {
    throw levelContractError(level, error);
  }
}

function assertDocumentList(level: SpecKitLevel, row: ManifestLevelRow, field: keyof ManifestLevelRow): string[] {
  const value = row[field];
  if (!Array.isArray(value)) {
    throw levelContractError(level);
  }

  const docs = value as unknown[];
  if (field === 'requiredCoreDocs' && docs.length === 0) {
    throw levelContractError(level);
  }

  for (const doc of docs) {
    if (typeof doc !== 'string' || !DOCUMENT_NAME_RE.test(doc) || doc.includes('..')) {
      throw levelContractError(level);
    }
  }

  return docs as string[];
}

function assertLevelList(level: SpecKitLevel, sectionId: string, levels: unknown): string[] {
  if (!sectionId || !Array.isArray(levels) || levels.some((entry) => !VALID_LEVELS.has(entry as SpecKitLevel))) {
    throw levelContractError(level);
  }
  return levels as string[];
}

function assertSectionGates(level: SpecKitLevel, row: ManifestLevelRow): Record<string, string[]> {
  if (!row.sectionGates || typeof row.sectionGates !== 'object' || Array.isArray(row.sectionGates)) {
    throw levelContractError(level);
  }

  const flatGates: Record<string, string[]> = {};
  for (const [sectionId, levels] of Object.entries(row.sectionGates)) {
    if (Array.isArray(levels)) {
      flatGates[sectionId] = assertLevelList(level, sectionId, levels);
      continue;
    }
    if (!levels || typeof levels !== 'object') {
      throw levelContractError(level);
    }
    for (const [nestedSectionId, nestedLevels] of Object.entries(levels)) {
      flatGates[nestedSectionId] = assertLevelList(level, nestedSectionId, nestedLevels);
    }
  }

  return flatGates;
}

function assertSectionGatesByDocument(level: SpecKitLevel, row: ManifestLevelRow): Record<string, Record<string, string[]>> {
  if (!row.sectionGates || typeof row.sectionGates !== 'object' || Array.isArray(row.sectionGates)) {
    throw levelContractError(level);
  }

  const byDocument: Record<string, Record<string, string[]>> = {};
  for (const [maybeDocumentName, value] of Object.entries(row.sectionGates)) {
    if (!maybeDocumentName.endsWith('.md')) {
      continue;
    }
    if (!value || typeof value !== 'object' || Array.isArray(value)) {
      throw levelContractError(level);
    }
    if (!DOCUMENT_NAME_RE.test(maybeDocumentName) || maybeDocumentName.includes('..')) {
      throw levelContractError(level);
    }
    byDocument[maybeDocumentName] = {};
    for (const [sectionId, levels] of Object.entries(value)) {
      byDocument[maybeDocumentName][sectionId] = assertLevelList(level, sectionId, levels);
    }
  }

  return byDocument;
}

function assertLevelRow(level: SpecKitLevel, row: ManifestLevelRow | undefined): ManifestLevelRow {
  if (!row || typeof row !== 'object') {
    throw levelContractError(level);
  }

  assertDocumentList(level, row, 'requiredCoreDocs');
  assertDocumentList(level, row, 'requiredAddonDocs');
  assertDocumentList(level, row, 'lazyAddonDocs');
  assertSectionGates(level, row);
  if (typeof row.frontmatterMarkerLevel !== 'number') {
    throw levelContractError(level);
  }

  return row;
}

export function resolveLevelContract(level: SpecKitLevel): LevelContract {
  assertLevel(level);
  const manifest = loadManifest(level);
  const row = assertLevelRow(level, manifest.levels?.[level]);
  const requiredCoreDocs = assertDocumentList(level, row, 'requiredCoreDocs');
  const requiredAddonDocs = assertDocumentList(level, row, 'requiredAddonDocs');
  const lazyAddonDocs = assertDocumentList(level, row, 'lazyAddonDocs');
  const sectionGates = assertSectionGates(level, row);
  const sectionGatesByDocument = assertSectionGatesByDocument(level, row);

  return {
    requiredCoreDocs: [...requiredCoreDocs],
    requiredAddonDocs: [...requiredAddonDocs],
    lazyAddonDocs: [...lazyAddonDocs],
    sectionGates: new Map(Object.entries(sectionGates).map(([sectionId, levels]) => [sectionId, [...levels]])),
    sectionGatesByDocument: new Map(
      Object.entries(sectionGatesByDocument).map(([docName, gates]) => [
        docName,
        new Map(Object.entries(gates).map(([sectionId, levels]) => [sectionId, [...levels]])),
      ]),
    ),
    templateVersions: { ...(manifest.versions ?? {}) },
    frontmatterMarkerLevel: row.frontmatterMarkerLevel,
  };
}

export function serializeLevelContract(contract: LevelContract): SerializedLevelContract {
  return {
    requiredCoreDocs: [...contract.requiredCoreDocs],
    requiredAddonDocs: [...contract.requiredAddonDocs],
    lazyAddonDocs: [...contract.lazyAddonDocs],
    sectionGates: Object.fromEntries(
      [...contract.sectionGates.entries()].map(([sectionId, levels]) => [sectionId, [...levels]]),
    ),
    sectionGatesByDocument: Object.fromEntries(
      [...contract.sectionGatesByDocument.entries()].map(([docName, gates]) => [
        docName,
        Object.fromEntries([...gates.entries()].map(([sectionId, levels]) => [sectionId, [...levels]])),
      ]),
    ),
    templateVersions: { ...contract.templateVersions },
    frontmatterMarkerLevel: contract.frontmatterMarkerLevel,
  };
}
