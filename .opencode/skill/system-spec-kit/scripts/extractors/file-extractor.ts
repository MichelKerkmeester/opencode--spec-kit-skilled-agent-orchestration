// ---------------------------------------------------------------
// MODULE: File Extractor
// ---------------------------------------------------------------
// Extracts file references, descriptions, and observation types from session data

import { CONFIG } from '../core';
import {
  toRelativePath,
  cleanDescription,
  isDescriptionValid
} from '../utils/file-helpers';
import { getPathBasename } from '../utils/path-utils';
import {
  extractSpecNumber,
  categorizeSection,
  generateAnchorId,
  validateAnchorUniqueness
} from '../lib/anchor-generator';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

/** Captures a file change discovered in session data. */
export interface FileChange {
  FILE_PATH: string;
  DESCRIPTION: string;
  ACTION?: string;
}

/** Raw observation input used during file extraction. */
export interface ObservationInput {
  type?: string;
  title?: string;
  narrative?: string;
  facts?: Array<string | { text?: string; files?: string[] }>;
  files?: string[];
  timestamp?: string;
}

/** Normalized observation details enriched with anchors and metadata. */
export interface ObservationDetailed {
  TYPE: string;
  TITLE: string;
  NARRATIVE: string;
  HAS_FILES: boolean;
  FILES_LIST: string;
  HAS_FACTS: boolean;
  FACTS_LIST: string;
  ANCHOR_ID: string;
  IS_DECISION: boolean;
}

/** File-focused subset of collected session data. */
export interface CollectedDataForFiles {
  FILES?: Array<{ FILE_PATH?: string; path?: string; DESCRIPTION?: string; description?: string }>;
  filesModified?: Array<{ path: string; changes_summary?: string }>;
  [key: string]: unknown;
}

/** Semantic summary for a file referenced by the session. */
export interface SemanticFileInfo {
  description: string;
  action: string;
}

const ACTION_MAP: Record<string, string> = {
  created: 'Created',
  modified: 'Modified',
  deleted: 'Deleted',
  read: 'Read',
  renamed: 'Renamed',
};

function normalizeFileAction(action: string): string {
  return ACTION_MAP[action.toLowerCase()] || 'Modified';
}

/* -----------------------------------------------------------------
   2. OBSERVATION TYPE DETECTION
------------------------------------------------------------------*/

function detectObservationType(obs: ObservationInput): string {
  if (obs.type && obs.type !== 'observation') return obs.type;

  const text = ((obs.title || '') + ' ' + (obs.narrative || '')).toLowerCase();
  const facts = (obs.facts || []).map((f) => (typeof f === 'string' ? f : '')).join(' ').toLowerCase();
  const combined = text + ' ' + facts;

  if (/\b(fix(?:ed|es|ing)?|bug|error|issue|broken|patch)\b/.test(combined)) return 'bugfix';
  if (/\b(implement(?:ed|s|ing)?|add(?:ed|s|ing)?|creat(?:ed|es|ing)?|new feature|feature)\b/.test(combined)) return 'feature';
  if (/\b(refactor(?:ed|s|ing)?|clean(?:ed|s|ing)?|restructur(?:ed|es|ing)?|reorganiz(?:ed|es|ing)?)\b/.test(combined)) return 'refactor';
  if (/\b(decid(?:ed|es|ing)?|chose|select(?:ed|s|ing)?|option|alternative)\b/.test(combined)) return 'decision';
  if (/\b(research(?:ed|ing)?|investigat(?:ed|es|ing)?|explor(?:ed|es|ing)?|analyz(?:ed|es|ing)?)\b/.test(combined)) return 'research';
  if (/\b(discover(?:ed|s|ing)?|found|learn(?:ed|s|ing)?|realiz(?:ed|es|ing)?)\b/.test(combined)) return 'discovery';

  return 'observation';
}

/* -----------------------------------------------------------------
   3. FILE EXTRACTION
------------------------------------------------------------------*/

function extractFilesFromData(
  collectedData: CollectedDataForFiles | null,
  observations: ObservationInput[] | null
): FileChange[] {
  const filesMap = new Map<string, string>();

  if (!collectedData) collectedData = {} as CollectedDataForFiles;
  if (!observations) observations = [];

  const addFile = (rawPath: string, description: string): void => {
    const normalized = toRelativePath(rawPath, CONFIG.PROJECT_ROOT);
    if (!normalized) return;

    const existing = filesMap.get(normalized);
    const cleaned = cleanDescription(description);

    if (existing) {
      // Prefer a valid, more descriptive (longer) description over a generic one
      if (isDescriptionValid(cleaned) && (!isDescriptionValid(existing) || cleaned.length > existing.length)) {
        filesMap.set(normalized, cleaned);
      }
    } else {
      filesMap.set(normalized, cleaned || 'Modified during session');
    }
  };

  // Source 1: FILES array (primary input format)
  if (collectedData.FILES && Array.isArray(collectedData.FILES)) {
    for (const fileInfo of collectedData.FILES) {
      const filePath = fileInfo.FILE_PATH || fileInfo.path;
      const description = fileInfo.DESCRIPTION || fileInfo.description || 'Modified during session';
      if (filePath) addFile(filePath, description);
    }
  }

  // Source 2: files_modified array (legacy format)
  if (collectedData.filesModified && Array.isArray(collectedData.filesModified)) {
    for (const fileInfo of collectedData.filesModified) {
      addFile(fileInfo.path, fileInfo.changes_summary || 'Modified during session');
    }
  }

  // Source 3: observations
  for (const obs of observations) {
    if (obs.files) {
      for (const file of obs.files) {
        addFile(file, 'Modified during session');
      }
    }
    if (obs.facts) {
      for (const fact of obs.facts) {
        if (typeof fact === 'object' && fact !== null && 'files' in fact) {
          const factObj = fact as { files?: string[] };
          if (factObj.files && Array.isArray(factObj.files)) {
            for (const file of factObj.files) {
              addFile(file, 'Modified during session');
            }
          }
        }
      }
    }
  }

  const filesEntries = Array.from(filesMap.entries());
  const withValidDesc = filesEntries.filter(([, desc]) => isDescriptionValid(desc));
  const withFallback = filesEntries.filter(([, desc]) => !isDescriptionValid(desc));

  const allFiles = [...withValidDesc, ...withFallback];
  if (allFiles.length > CONFIG.MAX_FILES_IN_MEMORY) {
    console.warn(`Warning: Truncating files list from ${allFiles.length} to ${CONFIG.MAX_FILES_IN_MEMORY}`);
  }

  return allFiles
    .slice(0, CONFIG.MAX_FILES_IN_MEMORY)
    .map(([filePath, description]) => ({
      FILE_PATH: filePath,
      DESCRIPTION: description
    }));
}

/* -----------------------------------------------------------------
   4. SEMANTIC DESCRIPTION ENHANCEMENT
------------------------------------------------------------------*/

function enhanceFilesWithSemanticDescriptions(
  files: FileChange[],
  semanticFileChanges: Map<string, SemanticFileInfo>
): FileChange[] {
  return files.map((file) => {
    const filePath = file.FILE_PATH;
    const fileBasename = getPathBasename(filePath);

    // Priority 1: Exact full path match
    if (semanticFileChanges.has(filePath)) {
      const info = semanticFileChanges.get(filePath)!;
      return {
        FILE_PATH: file.FILE_PATH,
        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
        ACTION: normalizeFileAction(info.action)
      };
    }

    // Priority 2: Basename match only if unique
    let matchCount = 0;
    let basenameMatch: { path: string; info: SemanticFileInfo } | null = null;

    for (const [matchPath, info] of semanticFileChanges) {
      const pathBasename = getPathBasename(matchPath);
      if (pathBasename === fileBasename) {
        matchCount++;
        basenameMatch = { path: matchPath, info };
      }
    }

    if (matchCount > 1) {
      console.warn(`   Warning: Multiple files with basename '${fileBasename}' - using default description`);
    }

    if (matchCount === 1 && basenameMatch) {
      const info = basenameMatch.info;
      return {
        FILE_PATH: file.FILE_PATH,
        DESCRIPTION: info.description !== 'Modified during session' ? info.description : file.DESCRIPTION,
        ACTION: normalizeFileAction(info.action)
      };
    }

    return file;
  });
}

/* -----------------------------------------------------------------
   5. OBSERVATION ANCHORING
------------------------------------------------------------------*/

function buildObservationsWithAnchors(
  observations: ObservationInput[] | null,
  specFolder: string
): ObservationDetailed[] {
  const usedAnchorIds: string[] = [];
  const specNumber: string = extractSpecNumber(specFolder);

  // Deduplicate observations: merge repeated tool calls on the same file
  const deduped = deduplicateObservations(observations || []);

  return deduped
    .filter((obs) => obs != null)
    .map((obs) => {
      const category: string = categorizeSection(
        obs.title || 'Observation',
        obs.narrative || ''
      );

      let anchorId: string = generateAnchorId(
        obs.title || 'Observation',
        category,
        specNumber
      );
      anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
      usedAnchorIds.push(anchorId);

      const obsType: string = detectObservationType(obs);

      return {
        TYPE: obsType.toUpperCase(),
        TITLE: obs.title || 'Observation',
        NARRATIVE: obs.narrative || '',
        HAS_FILES: !!(obs.files && obs.files.length > 0),
        FILES_LIST: obs.files ? obs.files.join(', ') : '',
        HAS_FACTS: !!(obs.facts && obs.facts.length > 0),
        FACTS_LIST: obs.facts ? obs.facts.map((f) => (typeof f === 'string' ? f : '')).join(' | ') : '',
        ANCHOR_ID: anchorId,
        IS_DECISION: obsType === 'decision'
      };
    });
}

/**
 * Deduplicate observations that represent repeated tool calls on the same file.
 * Merges consecutive observations with identical titles into a single entry with
 * a count annotation and combined facts.
 */
function deduplicateObservations(observations: ObservationInput[]): ObservationInput[] {
  if (observations.length <= 1) return observations;

  const result: ObservationInput[] = [];
  const mergeTracker = new Map<string, { obs: ObservationInput; count: number; index: number }>();

  for (const obs of observations) {
    const title = (obs.title || '').trim();
    // Skip empty titles
    if (!title) {
      result.push(obs);
      continue;
    }

    // Create a dedup key from normalized title + file list
    const filesKey = (obs.files || []).sort().join('|');
    const dedupKey = `${title.toLowerCase()}::${filesKey}`;

    const existing = mergeTracker.get(dedupKey);
    if (existing) {
      // Merge: increment count, combine unique facts
      existing.count++;
      if (obs.facts) {
        const existingFacts = existing.obs.facts || [];
        const existingFactStrings = new Set(
          existingFacts.map(f => typeof f === 'string' ? f : (f as { text?: string }).text || '')
        );
        for (const fact of obs.facts) {
          const factStr = typeof fact === 'string' ? fact : (fact as { text?: string }).text || '';
          if (factStr && !existingFactStrings.has(factStr)) {
            existingFacts.push(fact);
            existingFactStrings.add(factStr);
          }
        }
        existing.obs.facts = existingFacts;
      }
      // Update narrative with count
      if (existing.count === 2) {
        existing.obs.narrative = `${existing.obs.narrative || title} (repeated ${existing.count} times)`;
      } else {
        existing.obs.narrative = (existing.obs.narrative || title).replace(
          /\(repeated \d+ times\)/,
          `(repeated ${existing.count} times)`
        );
      }
    } else {
      const obsCopy = { ...obs };
      mergeTracker.set(dedupKey, { obs: obsCopy, count: 1, index: result.length });
      result.push(obsCopy);
    }
  }

  return result;
}

/* -----------------------------------------------------------------
   6. EXPORTS
------------------------------------------------------------------*/

export {
  detectObservationType,
  extractFilesFromData,
  enhanceFilesWithSemanticDescriptions,
  buildObservationsWithAnchors,
  deduplicateObservations,
};
