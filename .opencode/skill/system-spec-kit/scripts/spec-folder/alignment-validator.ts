// ---------------------------------------------------------------
// MODULE: Alignment Validator
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. ALIGNMENT VALIDATOR
// ───────────────────────────────────────────────────────────────
// Validates conversation-to-spec-folder alignment using topic and keyword matching

// Node stdlib
import * as fs from 'fs/promises';
import * as path from 'path';

// Internal modules
import { promptUserChoice } from '../utils/prompt-utils';
import type { CollectedDataSubset } from '../types/session-types';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** Configuration for alignment validation checks. */
export interface AlignmentConfig {
  THRESHOLD: number;
  WARNING_THRESHOLD: number;
  ARCHIVE_PATTERNS: string[];
  STOPWORDS: string[];
  INFRASTRUCTURE_PATTERNS: Record<string, string[]>;
  INFRASTRUCTURE_BONUS: number;
  INFRASTRUCTURE_THRESHOLD: number;
}

/** Result returned from a spec-folder alignment validation run. */
export interface AlignmentResult {
  proceed: boolean;
  useAlternative: boolean;
  selectedFolder?: string;
}

/** Work-domain classification derived during alignment validation. */
export interface WorkDomainResult {
  domain: 'opencode' | 'project';
  subpath: string | null;
  confidence: number;
  patterns: string[];
}

/** Alignment-focused subset of collected session data. */
export type AlignmentCollectedData = CollectedDataSubset<'recentContext' | 'observations' | 'SPEC_FOLDER'>;

/** Describes a field-level diff between telemetry schema sources. */
export interface TelemetrySchemaFieldDiff {
  interfaceName: string;
  schemaOnlyFields: string[];
  docsOnlyFields: string[];
}

/** Options controlling telemetry schema documentation validation. */
export interface TelemetrySchemaDocsValidationOptions {
  schemaPath?: string;
  docsPath?: string;
  useCache?: boolean;
}

/* ───────────────────────────────────────────────────────────────
   2. CONFIGURATION
------------------------------------------------------------------*/

const ALIGNMENT_CONFIG: AlignmentConfig = {
  THRESHOLD: 70,
  WARNING_THRESHOLD: 50,
  ARCHIVE_PATTERNS: ['z_', 'archive', 'old', '.archived'],
  STOPWORDS: ['the', 'this', 'that', 'with', 'for', 'and', 'from', 'fix', 'update', 'add', 'remove'],

  INFRASTRUCTURE_PATTERNS: {
    'skill/system-spec-kit': ['memory', 'spec-kit', 'speckit', 'spec', 'opencode', 'retrieval', 'testing', 'manual', 'playbook', 'mutation', 'maintenance'],
    'skill/': ['skill', 'opencode'],
    'command/memory': ['memory', 'spec-kit', 'speckit', 'opencode'],
    'command/': ['command', 'opencode'],
    'agent/': ['agent', 'opencode'],
    'scripts/': ['script', 'opencode']
  },

  INFRASTRUCTURE_BONUS: 40,
  INFRASTRUCTURE_THRESHOLD: 0.5
};

const FALLBACK_TELEMETRY_INTERFACE_NAMES = [
  'RetrievalTelemetry',
  'LatencyMetrics',
  'ModeMetrics',
  'FallbackMetrics',
  'QualityMetrics',
] as const;

const telemetrySchemaDocsValidationCache = {
  checked: false,
};

/* ───────────────────────────────────────────────────────────────
   2.5 ARCHIVE FILTERING
------------------------------------------------------------------*/

/** Check whether a folder name matches any archive pattern from config. */
function isArchiveFolder(name: string): boolean {
  const lowerName = name.toLowerCase();
  return ALIGNMENT_CONFIG.ARCHIVE_PATTERNS.some((pattern) => lowerName.includes(pattern));
}

/* ───────────────────────────────────────────────────────────────
   2.75 TELEMETRY SCHEMA/DOCS DRIFT VALIDATION
------------------------------------------------------------------*/

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function dedupeAndSort(values: string[]): string[] {
  return Array.from(new Set(values)).sort();
}

function extractSchemaInterfaceFields(schemaSource: string, interfaceName: string): string[] {
  const interfacePattern = new RegExp(
    `interface\\s+${escapeRegExp(interfaceName)}\\s*\\{([\\s\\S]*?)\\}`,
    'm'
  );
  const match = schemaSource.match(interfacePattern);
  if (!match) return [];

  const fields: string[] = [];
  const fieldPattern = /^\s*([A-Za-z_][A-Za-z0-9_]*)\??\s*:/gm;
  let fieldMatch = fieldPattern.exec(match[1]);
  while (fieldMatch) {
    fields.push(fieldMatch[1]);
    fieldMatch = fieldPattern.exec(match[1]);
  }

  return dedupeAndSort(fields);
}

function extractDocsInterfaceFields(docsSource: string, interfaceName: string): string[] {
  const headingPattern = new RegExp(`^###\\s+${escapeRegExp(interfaceName)}\\s*$`, 'm');
  const headingMatch = headingPattern.exec(docsSource);
  if (!headingMatch) return [];

  const startIndex = headingMatch.index + headingMatch[0].length;
  const tail = docsSource.slice(startIndex);
  const nextHeadingMatch = tail.match(/^###\s+/m);
  const section = nextHeadingMatch ? tail.slice(0, nextHeadingMatch.index) : tail;

  const fields: string[] = [];
  const fieldPattern = /^\|\s*`([^`]+)`\s*\|/gm;
  let fieldMatch = fieldPattern.exec(section);
  while (fieldMatch) {
    fields.push(fieldMatch[1].trim());
    fieldMatch = fieldPattern.exec(section);
  }

  return dedupeAndSort(fields);
}

function extractTelemetryInterfaceNames(schemaSource: string): string[] {
  const interfacePattern = /interface\s+([A-Za-z_][A-Za-z0-9_]*)\s*\{/g;
  const names: string[] = [];
  let match = interfacePattern.exec(schemaSource);
  while (match) {
    const interfaceName = match[1];
    if (/Telemetry|Metrics|Trace/i.test(interfaceName)) {
      names.push(interfaceName);
    }
    match = interfacePattern.exec(schemaSource);
  }

  const deduped = dedupeAndSort(names);
  if (deduped.length > 0) {
    return deduped;
  }

  return [...FALLBACK_TELEMETRY_INTERFACE_NAMES];
}

function computeTelemetrySchemaDocsFieldDiffs(
  schemaSource: string,
  docsSource: string
): TelemetrySchemaFieldDiff[] {
  const diffs: TelemetrySchemaFieldDiff[] = [];
  const interfaceNames = extractTelemetryInterfaceNames(schemaSource);

  for (const interfaceName of interfaceNames) {
    const schemaFields = extractSchemaInterfaceFields(schemaSource, interfaceName);
    const docsFields = extractDocsInterfaceFields(docsSource, interfaceName);

    const docsFieldSet = new Set(docsFields);
    const schemaFieldSet = new Set(schemaFields);

    const schemaOnlyFields = schemaFields.filter((field) => !docsFieldSet.has(field));
    const docsOnlyFields = docsFields.filter((field) => !schemaFieldSet.has(field));

    if (schemaOnlyFields.length > 0 || docsOnlyFields.length > 0) {
      diffs.push({
        interfaceName,
        schemaOnlyFields,
        docsOnlyFields,
      });
    }
  }

  return diffs;
}

function formatTelemetrySchemaDocsDriftDiffs(diffs: TelemetrySchemaFieldDiff[]): string {
  const lines: string[] = ['Field-level differences:'];

  for (const diff of diffs) {
    lines.push(`- ${diff.interfaceName}`);

    for (const field of diff.schemaOnlyFields) {
      lines.push(`  + ${field} (schema-only)`);
    }

    for (const field of diff.docsOnlyFields) {
      lines.push(`  - ${field} (docs-only)`);
    }
  }

  return lines.join('\n');
}

function formatPathForMessage(filePath: string): string {
  const relative = path.relative(process.cwd(), filePath);
  return relative && !relative.startsWith('..') ? relative : filePath;
}

async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch (error: unknown) {
    if (error instanceof Error) {
      return false;
    }
    return false;
  }
}

async function resolveTelemetrySchemaDocsPaths(): Promise<{ schemaPath: string; docsPath: string }> {
  const rootCandidates = [
    path.resolve(__dirname, '..', '..'),
    path.resolve(__dirname, '..', '..', '..'),
  ];

  for (const rootDir of rootCandidates) {
    const schemaPath = path.join(rootDir, 'mcp_server', 'lib', 'telemetry', 'retrieval-telemetry.ts');
    const docsPath = path.join(rootDir, 'mcp_server', 'lib', 'telemetry', 'README.md');

    if (await fileExists(schemaPath) && await fileExists(docsPath)) {
      return { schemaPath, docsPath };
    }
  }

  throw new Error(
    'Unable to locate telemetry schema/docs files for drift validation: expected mcp_server/lib/telemetry/retrieval-telemetry.ts and README.md'
  );
}

async function validateTelemetrySchemaDocsDrift(
  options: TelemetrySchemaDocsValidationOptions = {}
): Promise<void> {
  const useCache =
    options.useCache !== false &&
    typeof options.schemaPath !== 'string' &&
    typeof options.docsPath !== 'string';

  if (useCache && telemetrySchemaDocsValidationCache.checked) {
    return;
  }

  let schemaPath = options.schemaPath;
  let docsPath = options.docsPath;

  if (!schemaPath || !docsPath) {
    const defaultPaths = await resolveTelemetrySchemaDocsPaths();
    schemaPath = schemaPath || defaultPaths.schemaPath;
    docsPath = docsPath || defaultPaths.docsPath;
  }

  const schemaSource = await fs.readFile(schemaPath, 'utf-8');
  const docsSource = await fs.readFile(docsPath, 'utf-8');
  const diffs = computeTelemetrySchemaDocsFieldDiffs(schemaSource, docsSource);

  if (diffs.length > 0) {
    const message = [
      `Telemetry schema/docs drift detected between "${formatPathForMessage(schemaPath)}" and "${formatPathForMessage(docsPath)}".`,
      formatTelemetrySchemaDocsDriftDiffs(diffs),
    ].join('\n');

    const error = new Error(message);

    if (useCache) {
      telemetrySchemaDocsValidationCache.checked = false;
    }
    throw error;
  }

  if (useCache) {
    telemetrySchemaDocsValidationCache.checked = true;
  }
}

/* ───────────────────────────────────────────────────────────────
   3. TOPIC EXTRACTION
------------------------------------------------------------------*/

function extractConversationTopics(collectedData: AlignmentCollectedData | null): string[] {
  const topics = new Set<string>();

  if (collectedData?.recentContext?.[0]?.request) {
    const request = collectedData.recentContext[0].request.toLowerCase();
    const words = request.match(/\b[a-z]{3,}\b/gi) || [];
    words.forEach((w) => topics.add(w.toLowerCase()));
  }

  if (collectedData?.observations) {
    for (const obs of collectedData.observations.slice(0, 3)) {
      if (obs.title) {
        const words = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
        words.forEach((w) => topics.add(w.toLowerCase()));
      }
    }
  }

  return Array.from(topics).filter((t) =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(t) && t.length >= 3
  );
}

function extractObservationKeywords(collectedData: AlignmentCollectedData | null): string[] {
  const keywords = new Set<string>();

  if (!collectedData?.observations) return [];

  for (const obs of collectedData.observations.slice(0, 10)) {
    if (obs.title) {
      const titleWords = obs.title.match(/\b[a-z]{3,}\b/gi) || [];
      titleWords.forEach((w) => keywords.add(w.toLowerCase()));
    }

    if (obs.narrative) {
      const narrativeSnippet = obs.narrative.substring(0, 200);
      const narrativeWords = narrativeSnippet.match(/\b[a-z]{3,}\b/gi) || [];
      narrativeWords.forEach((w) => keywords.add(w.toLowerCase()));
    }

    if (obs.files) {
      for (const file of obs.files) {
        const filename = path.basename(file).replace(/\.[^.]+$/, '');
        const fileWords = filename.split(/[-_.]/).filter((w) => w.length >= 3);
        fileWords.forEach((w) => keywords.add(w.toLowerCase()));
      }
    }
  }

  return Array.from(keywords).filter((k) =>
    !ALIGNMENT_CONFIG.STOPWORDS.includes(k) && k.length >= 3
  );
}

/* ───────────────────────────────────────────────────────────────
   3.5 WORK DOMAIN DETECTION
------------------------------------------------------------------*/

function detectWorkDomain(collectedData: AlignmentCollectedData | null): WorkDomainResult {
  const files: string[] = [];

  if (collectedData?.observations) {
    for (const obs of collectedData.observations) {
      if (obs.files) {
        files.push(...obs.files);
      }
    }
  }

  if (collectedData?.recentContext) {
    for (const ctx of collectedData.recentContext) {
      if (ctx.files) {
        files.push(...ctx.files);
      }
    }
  }

  if (files.length === 0) {
    return { domain: 'project', subpath: null, confidence: 0, patterns: [] };
  }

  const normalizedFiles = files.map((f) => f.replace(/\\/g, '/'));
  const opencodeFiles = normalizedFiles.filter((f) =>
    f.includes('.opencode/') || f.includes('/.opencode/')
  );

  const opencodeRatio = opencodeFiles.length / normalizedFiles.length;

  if (opencodeRatio < ALIGNMENT_CONFIG.INFRASTRUCTURE_THRESHOLD) {
    return { domain: 'project', subpath: null, confidence: 1 - opencodeRatio, patterns: [] };
  }

  let detectedSubpath: string | null = null;
  let matchedPatterns: string[] = [];

  for (const [subpath, patterns] of Object.entries(ALIGNMENT_CONFIG.INFRASTRUCTURE_PATTERNS)) {
    const matchingFiles = opencodeFiles.filter((f) => f.includes(`.opencode/${subpath}`));
    if (matchingFiles.length > 0) {
      if (!detectedSubpath || subpath.length > detectedSubpath.length) {
        detectedSubpath = subpath;
        matchedPatterns = patterns;
      }
    }
  }

  return {
    domain: 'opencode',
    subpath: detectedSubpath,
    confidence: opencodeRatio,
    patterns: matchedPatterns
  };
}

function calculateAlignmentScoreWithDomain(
  conversationTopics: string[],
  specFolderName: string,
  workDomain: WorkDomainResult | null = null
): number {
  const baseScore = calculateAlignmentScore(conversationTopics, specFolderName);

  if (!workDomain || workDomain.domain !== 'opencode') {
    return baseScore;
  }

  const folderLower = specFolderName.toLowerCase();
  const patterns = workDomain.patterns || [];

  let infrastructureBonus = 0;
  for (const pattern of patterns) {
    if (folderLower.includes(pattern)) {
      infrastructureBonus = ALIGNMENT_CONFIG.INFRASTRUCTURE_BONUS;
      break;
    }
  }

  return baseScore + infrastructureBonus;
}

/* ───────────────────────────────────────────────────────────────
   4. SCORE CALCULATION
------------------------------------------------------------------*/

function parseSpecFolderTopic(folderName: string): string[] {
  // Accept full relative paths (with / separators) and extract topics from ALL segments
  // e.g., "014-manual-testing-per-playbook/001-retrieval" → ["manual", "testing", "per", "playbook", "retrieval"]
  const segments = folderName.split('/').filter((s) => s.length > 0);
  const allTopics: string[] = [];
  for (const segment of segments) {
    const topic = segment.replace(/^\d+-/, '');
    const words = topic.split(/[-_]/).filter((w) => w.length > 0);
    allTopics.push(...words);
  }
  return [...new Set(allTopics)];
}

function calculateAlignmentScore(conversationTopics: string[], specFolderName: string): number {
  const specTopics = parseSpecFolderTopic(specFolderName);

  if (specTopics.length === 0) return 0;

  let matches = 0;
  for (const specTopic of specTopics) {
    // O4-7: Use word-boundary matching instead of substring inclusion
    const topicRegex = new RegExp(`\\b${escapeRegExp(specTopic)}\\b`, 'i');
    if (conversationTopics.some((ct) =>
      topicRegex.test(ct) || new RegExp(`\\b${escapeRegExp(ct)}\\b`, 'i').test(specTopic)
    )) {
      matches++;
    }
  }

  return Math.round((matches / specTopics.length) * 100);
}

/* ───────────────────────────────────────────────────────────────
   5. VALIDATION FUNCTIONS
------------------------------------------------------------------*/

async function validateContentAlignment(
  collectedData: AlignmentCollectedData,
  specFolderName: string,
  specsDir: string
): Promise<AlignmentResult> {
  await validateTelemetrySchemaDocsDrift();

  const conversationTopics = extractConversationTopics(collectedData);
  const observationKeywords = extractObservationKeywords(collectedData);
  const combinedTopics = [...new Set([...conversationTopics, ...observationKeywords])];

  const workDomain = detectWorkDomain(collectedData);

  const baseScore = calculateAlignmentScore(combinedTopics, specFolderName);
  const domainAwareScore = calculateAlignmentScoreWithDomain(combinedTopics, specFolderName, workDomain);
  const finalScore = Math.max(baseScore, domainAwareScore);

  console.log(`   Phase 1B Alignment: ${specFolderName} (${baseScore}% match)`);

  const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;

  if (isInfrastructureMismatch) {
    console.log(`   Warning: INFRASTRUCTURE MISMATCH: Work is on .opencode/${workDomain.subpath || ''}`);
    console.log(`      But target folder "${specFolderName}" doesn't match infrastructure patterns`);
    console.log(`      Suggested patterns: ${workDomain.patterns.join(', ')}`);
  }

  if (finalScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
    console.log('   Content aligns with target folder');
    return { proceed: true, useAlternative: false };
  }

  if (finalScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
    console.log(`   Warning: Moderate alignment (${finalScore}%) - proceeding with caution`);
    return { proceed: true, useAlternative: false };
  }

  if (isInfrastructureMismatch) {
    console.log('\n   Warning: INFRASTRUCTURE ALIGNMENT WARNING');
    console.log(`   Work domain: .opencode/${workDomain.subpath || '*'} (${Math.round(workDomain.confidence * 100)}% of files)`);
  } else {
    console.log('\n   Warning: ALIGNMENT WARNING: Content may not match target folder');
  }
  console.log(`   Conversation topics: ${combinedTopics.slice(0, 5).join(', ')}`);
  console.log(`   Target folder: ${specFolderName} (${baseScore}% match)\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter((name) => /^\d{3}-/.test(name))
      .filter((name) => !isArchiveFolder(name))
      .sort()
      .reverse();

    const alternatives = specFolders
      .map((folder) => ({
        folder,
        score: calculateAlignmentScoreWithDomain(combinedTopics, folder, workDomain)
      }))
      .filter((alt) => alt.folder !== specFolderName && alt.score > finalScore)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (alternatives.length > 0) {
      console.log('   Better matching folders found:');
      alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
      });
      console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway\n`);

      if (!process.stdout.isTTY || !process.stdin.isTTY) {
        if (finalScore === 0 && isInfrastructureMismatch) {
          console.log(`   ALIGNMENT_HARD_BLOCK: Non-interactive mode with 0% alignment and infrastructure mismatch — refusing to proceed with "${specFolderName}".`);
          return { proceed: false, useAlternative: false };
        }
        // O4-8: Block in non-interactive mode when alignment is critically low
        if (finalScore < 20) {
          console.log(`   ALIGNMENT_HARD_BLOCK: ${finalScore}% alignment is below minimum non-interactive threshold (20%)`);
          return { proceed: false, useAlternative: false };
        }
        console.log('   Warning: Non-interactive mode - proceeding with specified folder');
        return { proceed: true, useAlternative: false };
      }

      try {
        const choice = await promptUserChoice(
          `   Select option (1-${alternatives.length + 1}): `,
          alternatives.length + 1
        );

        if (choice <= alternatives.length) {
          console.log(`   Switching to: ${alternatives[choice - 1].folder}`);
          return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
        }

        console.log(`   Continuing with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.log(`   Warning: Proceeding with "${specFolderName}"`);
          return { proceed: true, useAlternative: false };
        }
        console.log(`   Warning: Proceeding with "${specFolderName}"`);
        return { proceed: true, useAlternative: false };
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // Could not read alternatives - proceed with warning
    }
  }

  if (finalScore === 0 && isInfrastructureMismatch && (!process.stdout.isTTY || !process.stdin.isTTY)) {
    console.log(`   ALIGNMENT_HARD_BLOCK: 0% alignment with infrastructure mismatch and no alternatives — refusing to proceed with "${specFolderName}".`);
    return { proceed: false, useAlternative: false };
  }
  // O4-8: Block in non-interactive mode when alignment is critically low
  if (finalScore < 20 && (!process.stdout.isTTY || !process.stdin.isTTY)) {
    console.log(`   ALIGNMENT_HARD_BLOCK: ${finalScore}% alignment is below minimum non-interactive threshold (20%)`);
    return { proceed: false, useAlternative: false };
  }
  console.log(`   Warning: No better alternatives found - proceeding with "${specFolderName}"`);
  return { proceed: true, useAlternative: false };
}

async function validateFolderAlignment(
  collectedData: AlignmentCollectedData,
  specFolderName: string,
  specsDir: string
): Promise<AlignmentResult> {
  await validateTelemetrySchemaDocsDrift();

  const conversationTopics = extractConversationTopics(collectedData);

  const workDomain = detectWorkDomain(collectedData);

  const baseScore = calculateAlignmentScore(conversationTopics, specFolderName);
  const domainAwareScore = calculateAlignmentScoreWithDomain(conversationTopics, specFolderName, workDomain);
  const alignmentScore = Math.max(baseScore, domainAwareScore);

  console.log(`   Alignment check: ${specFolderName} (${baseScore}% match)`);

  const isInfrastructureMismatch = workDomain.domain === 'opencode' && domainAwareScore === baseScore;

  if (isInfrastructureMismatch) {
    console.log(`   Warning: Infrastructure work detected: .opencode/${workDomain.subpath || '*'}`);
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.THRESHOLD && !isInfrastructureMismatch) {
    console.log('   Good alignment with selected folder');
    return { proceed: true, useAlternative: false };
  }

  if (alignmentScore >= ALIGNMENT_CONFIG.WARNING_THRESHOLD && !isInfrastructureMismatch) {
    console.log('   Warning: Moderate alignment - proceeding with caution');
    return { proceed: true, useAlternative: false };
  }

  if (isInfrastructureMismatch) {
    console.log(`\n   Warning: INFRASTRUCTURE MISMATCH (${Math.round(workDomain.confidence * 100)}% of files in .opencode/)`);
    console.log(`   Suggested folder patterns: ${workDomain.patterns.join(', ')}`);
  } else {
    console.log(`\n   Warning: LOW ALIGNMENT WARNING (${baseScore}% match)`);
  }
  console.log(`   The selected folder "${specFolderName}" may not match conversation content.\n`);

  try {
    const entries = await fs.readdir(specsDir);
    const specFolders = entries
      .filter((name) => /^\d{3}-/.test(name))
      .filter((name) => !isArchiveFolder(name))
      .sort()
      .reverse();

    const alternatives = specFolders
      .map((folder) => ({
        folder,
        score: calculateAlignmentScoreWithDomain(conversationTopics, folder, workDomain)
      }))
      .filter((alt) => alt.folder !== specFolderName)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);

    if (alternatives.length > 0 && alternatives[0].score > alignmentScore) {
      console.log('   Better matching alternatives:');
      alternatives.forEach((alt, i) => {
        console.log(`   ${i + 1}. ${alt.folder} (${alt.score}% match)`);
      });
      console.log(`   ${alternatives.length + 1}. Continue with "${specFolderName}" anyway`);
      console.log(`   ${alternatives.length + 2}. Abort and specify different folder\n`);

      if (!process.stdout.isTTY || !process.stdin.isTTY) {
        console.log('   Warning: Non-interactive mode - proceeding with specified folder');
        return { proceed: true, useAlternative: false };
      }

      const choice = await promptUserChoice(
        `   Select option (1-${alternatives.length + 2}): `,
        alternatives.length + 2
      );

      if (choice <= alternatives.length) {
        return { proceed: true, useAlternative: true, selectedFolder: alternatives[choice - 1].folder };
      } else if (choice === alternatives.length + 1) {
        console.log(`   Proceeding with "${specFolderName}" as requested`);
        return { proceed: true, useAlternative: false };
      } else {
        console.log('   Aborted. Please re-run with correct folder.');
        return { proceed: false, useAlternative: false };
      }
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      // If we can't find alternatives, just proceed with warning
    }
  }

  console.log(`   Warning: Proceeding with "${specFolderName}" (no better alternatives found)`);
  return { proceed: true, useAlternative: false };
}

/* ───────────────────────────────────────────────────────────────
   6. EXPORTS
------------------------------------------------------------------*/

export {
  ALIGNMENT_CONFIG,
  isArchiveFolder,
  extractConversationTopics,
  extractObservationKeywords,
  parseSpecFolderTopic,
  calculateAlignmentScore,
  computeTelemetrySchemaDocsFieldDiffs,
  formatTelemetrySchemaDocsDriftDiffs,
  validateTelemetrySchemaDocsDrift,
  validateContentAlignment,
  validateFolderAlignment,
};
