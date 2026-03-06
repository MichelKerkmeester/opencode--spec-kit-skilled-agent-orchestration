// ---------------------------------------------------------------
// MODULE: Folder Discovery (PI-B3)
// ---------------------------------------------------------------
import * as fs from 'node:fs';
import * as path from 'node:path';

/* --- 1. TYPES --- */

/**
 * Describes a single spec folder with its cached description
 * and extracted keywords for lightweight matching.
 */
export interface FolderDescription {
  specFolder: string;
  description: string;
  keywords: string[];
  lastUpdated: string;
}

/**
 * Top-level cache structure written to descriptions.json.
 * version is always 1 for this implementation.
 */
export interface DescriptionCache {
  version: number;
  generated: string;
  folders: FolderDescription[];
}

/* --- 2. STOP WORDS --- */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to',
  'for', 'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are',
  'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does',
  'did', 'will', 'would', 'could', 'should', 'may', 'might', 'shall',
  'can', 'not', 'no', 'nor', 'so', 'yet', 'both', 'either', 'neither',
  'each', 'few', 'more', 'most', 'other', 'some', 'such', 'than',
  'that', 'these', 'this', 'those', 'into', 'through', 'during',
  'before', 'after', 'above', 'below', 'up', 'down', 'out', 'off',
  'over', 'under', 'again', 'further', 'then', 'once', 'here',
  'there', 'when', 'where', 'why', 'how', 'all', 'any', 'its',
  'it', 'we', 'they', 'he', 'she', 'you', 'i', 'my', 'our',
  'your', 'their', 'his', 'her', 'its', 'which', 'who', 'what',
]);

const MAX_SPEC_DISCOVERY_DEPTH = 8;
const SCAN_SKIP_DIRECTORIES = new Set([
  '.git',
  '.hg',
  '.svn',
  '.vscode',
  '.idea',
  'memory',
  'scratch',
  'node_modules',
]);

interface DiscoveredSpecFolder {
  basePath: string;
  folderPath: string;
  specMdPath: string;
  canonicalFolderPath: string;
}

interface DiscoveredSpecState {
  latestMtime: number;
  specFolders: Set<string>;
}

function cachedFoldersMatchDiscoveredState(
  cache: DescriptionCache,
  discoveredSpecFolders: Set<string>,
): boolean {
  const cachedSpecFolders = new Set(cache.folders.map((folder) => folder.specFolder));
  if (cachedSpecFolders.size !== discoveredSpecFolders.size) {
    return false;
  }

  for (const specFolder of cachedSpecFolders) {
    if (!discoveredSpecFolders.has(specFolder)) {
      return false;
    }
  }

  return true;
}

function resolveRealPathSafe(targetPath: string): string | null {
  try {
    return fs.realpathSync.native(targetPath);
  } catch {
    try {
      return fs.realpathSync(targetPath);
    } catch {
      return null;
    }
  }
}

function normalizeBasePaths(basePaths: string[]): string[] {
  const normalized: string[] = [];
  const seen = new Set<string>();

  for (const candidate of basePaths) {
    const absoluteCandidate = path.resolve(candidate);

    let stat: fs.Stats;
    try {
      stat = fs.statSync(absoluteCandidate);
    } catch {
      continue;
    }

    if (!stat.isDirectory()) continue;

    const canonicalPath = resolveRealPathSafe(absoluteCandidate) ?? absoluteCandidate;
    if (seen.has(canonicalPath)) continue;

    seen.add(canonicalPath);
    normalized.push(absoluteCandidate);
  }

  return normalized;
}

function shouldSkipDirectoryName(name: string): boolean {
  const normalizedName = name.toLowerCase();
  if (normalizedName.startsWith('.')) {
    return true;
  }
  return SCAN_SKIP_DIRECTORIES.has(normalizedName);
}

function discoverSpecFolders(basePath: string): DiscoveredSpecFolder[] {
  const normalizedBasePath = resolveRealPathSafe(basePath) ?? path.resolve(basePath);
  const discovered: DiscoveredSpecFolder[] = [];
  const visited = new Set<string>([normalizedBasePath]);

  const walk = (currentPath: string, depth: number): void => {
    if (depth > MAX_SPEC_DISCOVERY_DEPTH) return;

    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(currentPath, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entry of entries) {
      if (!entry.isDirectory()) continue;
      if (shouldSkipDirectoryName(entry.name)) continue;

      const candidateFolderPath = path.join(currentPath, entry.name);
      const canonicalFolderPath = resolveRealPathSafe(candidateFolderPath) ?? path.resolve(candidateFolderPath);
      if (visited.has(canonicalFolderPath)) continue;
      visited.add(canonicalFolderPath);

      let folderStat: fs.Stats;
      try {
        folderStat = fs.statSync(canonicalFolderPath);
      } catch {
        continue;
      }
      if (!folderStat.isDirectory()) continue;

      const relativeFolderPath = path.relative(normalizedBasePath, canonicalFolderPath).replace(/\\/g, '/');
      if (!relativeFolderPath || relativeFolderPath.startsWith('..')) {
        continue;
      }

      const specMdPath = path.join(canonicalFolderPath, 'spec.md');
      try {
        if (fs.statSync(specMdPath).isFile()) {
          discovered.push({
            basePath: normalizedBasePath,
            folderPath: canonicalFolderPath,
            specMdPath,
            canonicalFolderPath,
          });
        }
      } catch {
        // No spec.md in this folder
      }

      walk(canonicalFolderPath, depth + 1);
    }
  };

  walk(normalizedBasePath, 1);
  return discovered;
}

function collectDiscoveredSpecState(basePaths: string[]): DiscoveredSpecState {
  const specFolders = new Set<string>();
  let latestMtime = 0;

  for (const basePath of basePaths) {
    const discoveredFolders = discoverSpecFolders(basePath);

    for (const discoveredFolder of discoveredFolders) {
      const relativeFolderPath = path.relative(discoveredFolder.basePath, discoveredFolder.folderPath).replace(/\\/g, '/');
      if (relativeFolderPath && !relativeFolderPath.startsWith('..')) {
        specFolders.add(relativeFolderPath);
      }

      try {
        const mtime = fs.statSync(discoveredFolder.specMdPath).mtimeMs;
        if (mtime > latestMtime) {
          latestMtime = mtime;
        }
      } catch {
        // Ignore unreadable spec.md entries during staleness probing.
      }
    }
  }

  return { latestMtime, specFolders };
}

/* --- 3. DESCRIPTION EXTRACTION --- */

/**
 * Extract a short 1-sentence description from spec.md content.
 *
 * Strategy (in order):
 * 1. Look for the first `#` heading — that is the spec title
 * 2. Look for "Problem Statement" or "Problem & Purpose" section
 *    and take the first non-empty line after the heading
 * 3. Fall back to the first non-empty non-heading line
 *
 * The result is trimmed to 150 characters maximum.
 *
 * @param specContent - Raw string content of a spec.md file.
 * @returns A 1-sentence description string, or empty string for empty input.
 */
export function extractDescription(specContent: string): string {
  if (!specContent || typeof specContent !== 'string') {
    return '';
  }

  const content = specContent.trim();
  if (content.length === 0) {
    return '';
  }

  const lines = content.split('\n').map(l => l.trim());

  // Pass 1: Look for the first # heading (title)
  for (const line of lines) {
    if (line.startsWith('# ')) {
      const title = line.replace(/^#+\s+/, '').trim();
      if (title.length > 0) {
        return title.slice(0, 150);
      }
    }
  }

  // Pass 2: Look for "Problem Statement" or "Problem & Purpose" section
  // and extract the first non-empty content line following it
  const problemHeadingPattern = /^#{1,4}\s+(problem\s+(statement|&\s*purpose|and\s+purpose)|purpose|overview)/i;
  for (let i = 0; i < lines.length; i++) {
    if (problemHeadingPattern.test(lines[i])) {
      // Scan ahead for first meaningful non-heading, non-empty line
      for (let j = i + 1; j < lines.length && j < i + 10; j++) {
        const candidate = lines[j];
        if (candidate.length === 0) continue;
        if (candidate.startsWith('#')) break;
        // Strip markdown bold/italic markers
        const clean = candidate.replace(/\*+/g, '').replace(/_+/g, '').trim();
        if (clean.length > 0) {
          // Take first sentence (split on '. ') and strip trailing period
          const sentence = clean.split(/\.\s/)[0].trim().replace(/\.$/, '');
          return sentence.slice(0, 150);
        }
      }
    }
  }

  // Pass 3: Fall back to first non-empty, non-heading line
  for (const line of lines) {
    if (line.startsWith('#')) continue;
    if (line.length === 0) continue;
    const clean = line.replace(/\*+/g, '').replace(/_+/g, '').replace(/^[-*>]\s+/, '').trim();
    if (clean.length > 0) {
      const sentence = clean.split(/\.\s/)[0].trim().replace(/\.$/, '');
      return sentence.slice(0, 150);
    }
  }

  return '';
}

/* --- 4. KEYWORD EXTRACTION --- */

/**
 * Extract significant keywords from a description string.
 *
 * - Lowercases all words
 * - Splits on non-alphanumeric boundaries
 * - Filters stop words and words shorter than 3 characters
 * - Deduplicates
 *
 * @param description - A description string to extract keywords from.
 * @returns Deduplicated array of significant lowercase keywords.
 */
export function extractKeywords(description: string): string[] {
  if (!description || typeof description !== 'string') {
    return [];
  }

  const lower = description.toLowerCase();
  const words = lower.match(/\b[a-z0-9][a-z0-9-]*[a-z0-9]\b|\b[a-z0-9]{3,}\b/g) || [];

  const seen = new Set<string>();
  const keywords: string[] = [];

  for (const word of words) {
    const cleaned = word.replace(/-+/g, '-').trim();
    if (cleaned.length < 3) continue;
    if (STOP_WORDS.has(cleaned)) continue;
    if (seen.has(cleaned)) continue;
    seen.add(cleaned);
    keywords.push(cleaned);
  }

  return keywords;
}

/* --- 5. RELEVANCE SCORING / LOOKUP --- */

/**
 * Find the most relevant spec folders for a given query using
 * simple keyword-overlap scoring.
 *
 * Algorithm:
 * - Tokenize the query into lowercase words (reuse extractKeywords)
 * - For each folder in the cache, count how many query terms appear
 *   in its keywords or description (case-insensitive)
 * - Normalize score: matchCount / totalQueryTerms
 * - Return top `limit` folders with score > 0, sorted descending
 *
 * This is a lightweight pre-filter, NOT a replacement for vector search.
 *
 * @param query  - User search query string.
 * @param cache  - Loaded DescriptionCache to search against.
 * @param limit  - Maximum number of results to return (default 3).
 * @returns Array of { specFolder, relevanceScore } sorted by score desc.
 */
export function findRelevantFolders(
  query: string,
  cache: DescriptionCache,
  limit = 3,
): Array<{ specFolder: string; relevanceScore: number }> {
  if (!query || typeof query !== 'string' || !cache || !Array.isArray(cache.folders)) {
    return [];
  }

  const queryTerms = extractKeywords(query);
  if (queryTerms.length === 0) {
    return [];
  }

  const results: Array<{ specFolder: string; relevanceScore: number }> = [];

  for (const folder of cache.folders) {
    let matchCount = 0;
    const descLower = folder.description.toLowerCase();
    const keywordSet = new Set(folder.keywords);

    for (const term of queryTerms) {
      // AI-WHY: Keywords set lookup is O(1); description substring is fallback for partial matches
      if (keywordSet.has(term)) {
        matchCount++;
        continue;
      }
      // Fall back to substring match in description
      if (descLower.includes(term)) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      const relevanceScore = matchCount / queryTerms.length;
      results.push({ specFolder: folder.specFolder, relevanceScore });
    }
  }

  // Sort descending by relevance
  results.sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results.slice(0, limit);
}

/* --- 6. CACHE GENERATION --- */

/**
 * Scan spec base paths for spec.md files and generate a
 * DescriptionCache by extracting descriptions from each.
 *
 * - Uses synchronous file I/O — this is a build-time/cache generation
 *   function, NOT a hot path.
 * - Expects specsBasePaths to be absolute paths to directories that
 *   contain spec folder subdirectories (e.g., the `specs/` root).
 * - A spec folder is any direct child directory of a base path
 *   that contains a `spec.md` file.
 * - Nested spec folders (phase subfolders) are also discovered if
 *   they contain a `spec.md`.
 *
 * @param specsBasePaths - Array of absolute directory paths to scan.
 * @returns A fully populated DescriptionCache.
 */
export function generateFolderDescriptions(specsBasePaths: string[]): DescriptionCache {
  const now = new Date().toISOString();
  const normalizedBasePaths = normalizeBasePaths(specsBasePaths);
  const byCanonicalFolderPath = new Map<string, FolderDescription>();

  for (const basePath of normalizedBasePaths) {
    const discoveredFolders = discoverSpecFolders(basePath);

    for (const discoveredFolder of discoveredFolders) {
      if (byCanonicalFolderPath.has(discoveredFolder.canonicalFolderPath)) {
        continue;
      }

      const folderEntry = _processSpecFolder(
        discoveredFolder.basePath,
        discoveredFolder.folderPath,
        discoveredFolder.specMdPath,
        now,
      );

      if (folderEntry) {
        byCanonicalFolderPath.set(discoveredFolder.canonicalFolderPath, folderEntry);
      }
    }
  }

  const folders = Array.from(byCanonicalFolderPath.values()).sort((a, b) =>
    a.specFolder.localeCompare(b.specFolder),
  );

  return {
    version: 1,
    generated: now,
    folders,
  };
}

/**
 * Internal helper: read spec.md and produce a FolderDescription.
 * Returns null if content is unreadable or description is empty.
 *
 * @param folderPath  - Absolute path to the spec folder directory.
 * @param specMdPath  - Absolute path to the spec.md file within folderPath.
 * @param timestamp   - ISO timestamp to set as lastUpdated.
 * @returns A FolderDescription, or null if extraction fails.
 */
function _processSpecFolder(
  basePath: string,
  folderPath: string,
  specMdPath: string,
  timestamp: string,
): FolderDescription | null {
  let content: string;
  try {
    content = fs.readFileSync(specMdPath, 'utf-8');
  } catch (_err: unknown) {
    // AI-GUARD: Unreadable spec.md — skip folder
    return null;
  }

  const description = extractDescription(content);
  if (!description) return null;

  const keywords = extractKeywords(description);
  const normalizedRelativeFolder = path.relative(basePath, folderPath).replace(/\\/g, '/');
  if (!normalizedRelativeFolder || normalizedRelativeFolder.startsWith('..')) {
    return null;
  }

  return {
    specFolder: normalizedRelativeFolder,
    description,
    keywords,
    lastUpdated: timestamp,
  };
}

/* --- 7. CACHE I/O --- */

/**
 * Load a DescriptionCache from a JSON file on disk.
 *
 * @param cachePath - Absolute path to the descriptions.json file.
 * @returns The parsed DescriptionCache, or null if the file does not
 *          exist or cannot be parsed.
 */
export function loadDescriptionCache(cachePath: string): DescriptionCache | null {
  if (!fs.existsSync(cachePath)) {
    return null;
  }

  try {
    const raw = fs.readFileSync(cachePath, 'utf-8');
    const parsed = JSON.parse(raw) as DescriptionCache;
    return parsed;
  } catch (_err: unknown) {
    // AI-GUARD: Corrupt or unparseable cache file — return null for regeneration
    return null;
  }
}

/**
 * Write a DescriptionCache to a JSON file on disk.
 * Creates parent directories if they do not exist.
 *
 * @param cache     - The DescriptionCache to persist.
 * @param cachePath - Absolute path to write the descriptions.json file.
 */
export function saveDescriptionCache(cache: DescriptionCache, cachePath: string): void {
  const dir = path.dirname(cachePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf-8');
}

/* --- 8. INTEGRATION HELPERS (PI-B3) --- */

/**
 * Resolve the standard specs base paths for a workspace.
 * Returns all existing directories from: `specs/` and `.opencode/specs/`
 * relative to the given workspace (or cwd if omitted).
 *
 * @param workspacePath - Optional workspace root. Defaults to process.cwd().
 * @returns Array of absolute directory paths that exist.
 */
export function getSpecsBasePaths(workspacePath?: string): string[] {
  const root = workspacePath ?? process.cwd();
  const candidates = [
    path.join(root, 'specs'),
    path.join(root, '.opencode', 'specs'),
  ];

  return normalizeBasePaths(candidates);
}

/**
 * Check whether a description cache is stale by comparing its
 * `generated` timestamp against the most recent spec.md mtime
 * across all base paths using recursive depth-limited scan.
 *
 * @param cache     - The loaded DescriptionCache to check.
 * @param basePaths - Spec base directories to scan for spec.md files.
 * @returns true if any spec.md was modified after cache generation, or if cache is invalid.
 */
export function isCacheStale(cache: DescriptionCache | null, basePaths: string[]): boolean {
  if (!cache || !cache.generated) return true;

  let cacheTime: number;
  try {
    cacheTime = new Date(cache.generated).getTime();
    if (isNaN(cacheTime)) return true;
  } catch {
    return true;
  }

  const normalizedBasePaths = normalizeBasePaths(basePaths);
  const discoveredState = collectDiscoveredSpecState(normalizedBasePaths);
  if (!cachedFoldersMatchDiscoveredState(cache, discoveredState.specFolders)) {
    return true;
  }

  return discoveredState.latestMtime > cacheTime;
}

/**
 * Ensure a fresh description cache exists. Loads existing cache from
 * disk, checks staleness, regenerates if needed, saves, and returns it.
 *
 * @param basePaths - Spec base directories to scan.
 * @returns The up-to-date DescriptionCache, or null if no base paths exist.
 */
export function ensureDescriptionCache(basePaths: string[]): DescriptionCache | null {
  if (basePaths.length === 0) return null;

  const normalizedBasePaths = normalizeBasePaths(basePaths);
  if (normalizedBasePaths.length === 0) {
    return {
      version: 1,
      generated: new Date().toISOString(),
      folders: [],
    };
  }

  // AI-WHY: Cache co-located with primary base path (first in resolution order)
  const cachePath = path.join(normalizedBasePaths[0], 'descriptions.json');

  try {
    const existing = loadDescriptionCache(cachePath);

    if (existing && !isCacheStale(existing, normalizedBasePaths)) {
      return existing;
    }

    // Regenerate
    const fresh = generateFolderDescriptions(normalizedBasePaths);
    try {
      saveDescriptionCache(fresh, cachePath);
    } catch {
      // AI-GUARD: Cache write failure — still return the generated cache
    }
    return fresh;
  } catch {
    // AI-GUARD: Never throw — return null for graceful degradation
    return null;
  }
}

/**
 * Discover the most relevant spec folder for a query.
 * Orchestrates: ensureCache → findRelevantFolders → threshold check.
 *
 * @param query     - User search query.
 * @param basePaths - Spec base directories.
 * @param threshold - Minimum relevance score to accept (default 0.3).
 * @returns The best-matching specFolder path, or null if none meets threshold.
 */
export function discoverSpecFolder(
  query: string,
  basePaths: string[],
  threshold = 0.3,
): string | null {
  try {
    const cache = ensureDescriptionCache(basePaths);
    if (!cache) return null;

    const matches = findRelevantFolders(query, cache, 1);
    if (matches.length === 0) return null;

    const best = matches[0];
    if (best.relevanceScore < threshold) return null;

    return best.specFolder;
  } catch {
    // CHK-PI-B3-004: Never throw — graceful degradation
    return null;
  }
}
