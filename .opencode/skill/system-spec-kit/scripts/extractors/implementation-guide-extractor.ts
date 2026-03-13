// --- 1. IMPLEMENTATION GUIDE EXTRACTOR ---
// Extracts implementation guidance and step-by-step instructions from session observations

import { createHash } from 'node:crypto';
import { detectObservationType } from './file-extractor';
import { slugify } from '../utils/slug-utils';

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

/** Describes a concrete implementation step for the guide output. */
export interface ImplementationStep {
  FEATURE_NAME: string;
  DESCRIPTION: string;
}

/** Associates an important file with its role in the implementation. */
export interface KeyFileWithRole {
  FILE_PATH: string;
  ROLE: string;
}

/** Describes how the implementation can be extended safely. */
export interface ExtensionGuide {
  GUIDE_TEXT: string;
}

/** Summarizes a reusable code pattern identified in the implementation. */
export interface CodePattern {
  PATTERN_NAME: string;
  USAGE: string;
}

/** Output payload for the implementation guide extractor. */
export interface ImplementationGuideData {
  HAS_IMPLEMENTATION_GUIDE: boolean;
  TOPIC: string;
  IMPLEMENTATIONS: ImplementationStep[];
  IMPL_KEY_FILES: KeyFileWithRole[];
  EXTENSION_GUIDES: ExtensionGuide[];
  PATTERNS: CodePattern[];
}

/** Observation input used by the implementation guide extractor. */
export interface ObservationInput {
  type?: string;
  title?: string;
  narrative?: string;
  facts?: Array<string | { text?: string; files?: string[] }>;
  files?: string[];
}

/** File input used by the implementation guide extractor. */
export interface FileInput {
  FILE_PATH?: string;
  path?: string;
  DESCRIPTION?: string;
  description?: string;
}

/* -----------------------------------------------------------------
   2. IMPLEMENTATION DETECTION
------------------------------------------------------------------*/

function hasImplementationWork(observations: ObservationInput[], files: FileInput[]): boolean {
  const implTypes = ['implementation', 'feature', 'bugfix', 'refactor'];
  const hasImplType = observations.some((o) => implTypes.includes(o.type || ''));

  const implKeywords = /\b(implemented|built|created|added|fixed|refactored|developed|constructed|established)\b/i;
  const hasImplKeywords = observations.some((o) =>
    o.narrative && implKeywords.test(o.narrative)
  );

  const hasFileChanges = files && files.length > 0;

  const score = (hasImplType ? 1 : 0) + (hasImplKeywords ? 1 : 0) + (hasFileChanges ? 1 : 0);
  return score >= 2;
}

function createTopicFallback(text: string): string {
  const digest = createHash('sha1').update(text).digest('hex').slice(0, 8);
  return `topic-${digest}`;
}

function extractMainTopic(observations: ObservationInput[], specFolder: string | undefined): string {
  if (specFolder) {
    const folderTopic = specFolder.replace(/^\d+-/, '').replace(/-/g, '-');
    if (folderTopic.length > 3) return folderTopic;
  }

  const implObs = observations.find((o) =>
    o.type === 'implementation' || o.type === 'feature'
  );

  if (implObs && implObs.title) {
    const baseTitle = implObs.title
      .replace(/^(implemented|created|added|built|fixed)\s+/i, '')
      .trim();
    const topicSlug = slugify(baseTitle).substring(0, 40);
    return topicSlug || createTopicFallback(baseTitle || implObs.title);
  }

  return 'implementation';
}

/* -----------------------------------------------------------------
   3. FEATURE EXTRACTION
------------------------------------------------------------------*/

function extractWhatBuilt(observations: ObservationInput[]): ImplementationStep[] {
  const implementations: ImplementationStep[] = [];
  const seen = new Set<string>();

  for (const obs of observations) {
    const type = detectObservationType(obs);
    if (!['feature', 'implementation', 'bugfix', 'refactor'].includes(type)) continue;

    let featureName: string = obs.title || 'Implementation';

    featureName = featureName
      .replace(/^(implemented|created|added|built|fixed|refactored)\s+/i, '')
      .trim();

    const key = featureName.toLowerCase().substring(0, 30);
    if (seen.has(key)) continue;
    seen.add(key);

    let description: string = obs.narrative || '';
    const firstSentence = description.match(/^[^.!?]+[.!?]/);
    description = firstSentence
      ? firstSentence[0].trim()
      : description.substring(0, 100).trim();

    description = description
      .replace(/\*\*([^*]+)\*\*/g, '$1')
      .replace(/`([^`]+)`/g, '$1')
      .replace(/^[-*]\s+/, '');

    if (featureName.length > 3) {
      implementations.push({
        FEATURE_NAME: featureName.charAt(0).toUpperCase() + featureName.slice(1),
        DESCRIPTION: description || 'Implemented during session'
      });
    }
  }

  return implementations.slice(0, 5);
}

/* -----------------------------------------------------------------
   4. FILE ROLE DETECTION
------------------------------------------------------------------*/

interface RolePattern {
  pattern: RegExp;
  role: string;
}

function extractKeyFilesWithRoles(files: FileInput[], observations: ObservationInput[]): KeyFileWithRole[] {
  const keyFiles: KeyFileWithRole[] = [];

  const fileContextMap = new Map<string, string>();
  for (const obs of observations) {
    if (obs.files && Array.isArray(obs.files)) {
      for (const file of obs.files) {
        const narrative = obs.narrative || '';
        if (!fileContextMap.has(file) && narrative.length > 10) {
          fileContextMap.set(file, narrative);
        }
      }
    }
  }

  const rolePatterns: RolePattern[] = [
    { pattern: /\.test\.|\.spec\.|__tests__/, role: 'Test file' },
    { pattern: /config\.|\.config\./, role: 'Configuration' },
    { pattern: /index\.(js|ts|jsx|tsx)$/, role: 'Entry point / exports' },
    { pattern: /types?\.(ts|d\.ts)$/, role: 'Type definitions' },
    { pattern: /utils?\./, role: 'Utility functions' },
    { pattern: /hooks?\./, role: 'React hook' },
    { pattern: /context\./, role: 'React context provider' },
    { pattern: /store\./, role: 'State management' },
    { pattern: /service\./, role: 'Service layer' },
    { pattern: /api\./, role: 'API layer' },
    { pattern: /model\./, role: 'Data model' },
    { pattern: /schema\./, role: 'Schema definition' },
    { pattern: /migration/, role: 'Database migration' },
    { pattern: /template/, role: 'Template file' },
    { pattern: /\.css$/, role: 'Styles' },
    { pattern: /\.md$/, role: 'Documentation' },
    { pattern: /\.sh$/, role: 'Script' }
  ];

  for (const file of files) {
    const filePath: string = file.FILE_PATH || file.path || '';
    const existingDesc: string = file.DESCRIPTION || file.description || '';

    let role = '';

    for (const { pattern, role: pattern_role } of rolePatterns) {
      if (pattern.test(filePath)) {
        role = pattern_role;
        break;
      }
    }

    if (!role && existingDesc && existingDesc.length > 10 &&
        !existingDesc.toLowerCase().includes('modified during session')) {
      role = existingDesc;
    }

    if (!role && fileContextMap.has(filePath)) {
      const context = fileContextMap.get(filePath)!;
      const phrase = context.match(/\b(?:for|handles?|provides?|implements?|contains?)\s+([^.]+)/i);
      if (phrase) {
        role = phrase[1].trim().substring(0, 60);
      }
    }

    if (!role) {
      const filename = filePath.replace(/\\/g, '/').split('/').pop()?.replace(/\.[^.]+$/, '') || '';
      role = filename
        .replace(/[-_]/g, ' ')
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .toLowerCase();
      role = 'Core ' + role;
    }

    keyFiles.push({
      FILE_PATH: filePath,
      ROLE: role.charAt(0).toUpperCase() + role.slice(1)
    });
  }

  return keyFiles.slice(0, 8);
}

/* -----------------------------------------------------------------
   5. EXTENSION GUIDE GENERATION
------------------------------------------------------------------*/

function generateExtensionGuide(observations: ObservationInput[], files: FileInput[]): ExtensionGuide[] {
  const guides: ExtensionGuide[] = [];
  const seenPatterns = new Set<string>();

  const fileTypes = new Map<string, number>();
  for (const file of files) {
    const filePath: string = file.FILE_PATH || file.path || '';
    const ext = filePath.split('.').pop() || '';
    fileTypes.set(ext, (fileTypes.get(ext) || 0) + 1);
  }

  if ((fileTypes.get('js') || 0) > 0 || (fileTypes.get('ts') || 0) > 0) {
    guides.push({ GUIDE_TEXT: 'Add new modules following the existing file structure patterns' });
    seenPatterns.add('modules');
  }

  if ((fileTypes.get('test.js') || 0) > 0 || (fileTypes.get('spec.js') || 0) > 0 ||
      files.some((f) => ((f.FILE_PATH || f.path || '') as string).includes('test'))) {
    guides.push({ GUIDE_TEXT: 'Create corresponding test files for new implementations' });
    seenPatterns.add('tests');
  }

  for (const obs of observations) {
    const narrative = (obs.narrative || '').toLowerCase();

    if (narrative.includes('api') && !seenPatterns.has('api')) {
      guides.push({ GUIDE_TEXT: 'Follow the established API pattern for new endpoints' });
      seenPatterns.add('api');
    }

    if (narrative.includes('validation') && !seenPatterns.has('validation')) {
      guides.push({ GUIDE_TEXT: 'Apply validation patterns to new input handling' });
      seenPatterns.add('validation');
    }

    if (narrative.includes('error') && !seenPatterns.has('error')) {
      guides.push({ GUIDE_TEXT: 'Maintain consistent error handling approach' });
      seenPatterns.add('error');
    }

    if ((narrative.includes('template') || narrative.includes('mustache')) && !seenPatterns.has('template')) {
      guides.push({ GUIDE_TEXT: 'Use established template patterns for new outputs' });
      seenPatterns.add('template');
    }
  }

  if (guides.length === 0) {
    guides.push({ GUIDE_TEXT: 'Reference existing implementations as patterns for new features' });
  }

  return guides.slice(0, 4);
}

/* -----------------------------------------------------------------
   6. PATTERN EXTRACTION
------------------------------------------------------------------*/

interface PatternMatcher {
  keywords: string[];
  name: string;
  usage: string;
}

function extractCodePatterns(observations: ObservationInput[], files: FileInput[]): CodePattern[] {
  const patterns: CodePattern[] = [];
  const seen = new Set<string>();

  const patternMatchers: PatternMatcher[] = [
    { keywords: ['helper', 'util', 'utility'], name: 'Helper Functions', usage: 'Encapsulate reusable logic in dedicated utility functions' },
    { keywords: ['validation', 'validate', 'validator'], name: 'Validation', usage: 'Input validation before processing' },
    { keywords: ['template', 'mustache', 'handlebars', 'placeholder'], name: 'Template Pattern', usage: 'Use templates with placeholder substitution' },
    { keywords: ['filter', 'filtering', 'pipeline'], name: 'Filter Pipeline', usage: 'Chain filters for data transformation' },
    { keywords: ['fallback', 'default', 'graceful'], name: 'Graceful Fallback', usage: 'Provide sensible defaults when primary method fails' },
    { keywords: ['normalize', 'normalization', 'clean'], name: 'Data Normalization', usage: 'Clean and standardize data before use' },
    { keywords: ['cache', 'caching', 'memoize'], name: 'Caching', usage: 'Cache expensive computations or fetches' },
    { keywords: ['async', 'await', 'promise'], name: 'Async/Await', usage: 'Handle asynchronous operations cleanly' },
    { keywords: ['map', 'reduce', 'filter', 'transform'], name: 'Functional Transforms', usage: 'Use functional methods for data transformation' },
    { keywords: ['export', 'module', 'import'], name: 'Module Pattern', usage: 'Organize code into importable modules' }
  ];

  const allText = observations
    .map((o) => `${o.title || ''} ${o.narrative || ''}`)
    .join(' ')
    .toLowerCase();

  const fileNames = files
    .map((f) => (f.FILE_PATH || f.path || '').toLowerCase())
    .join(' ');

  const combinedText = allText + ' ' + fileNames;

  for (const matcher of patternMatchers) {
    if (seen.has(matcher.name)) continue;

    const hasKeyword = matcher.keywords.some((kw) => combinedText.includes(kw));
    if (hasKeyword) {
      patterns.push({
        PATTERN_NAME: matcher.name,
        USAGE: matcher.usage
      });
      seen.add(matcher.name);
    }
  }

  return patterns.slice(0, 5);
}

/* -----------------------------------------------------------------
   7. IMPLEMENTATION GUIDE BUILDER
------------------------------------------------------------------*/

function buildImplementationGuideData(
  observations: ObservationInput[],
  files: FileInput[],
  spec_folder?: string
): ImplementationGuideData {
  const hasImpl = hasImplementationWork(observations, files);

  if (!hasImpl) {
    return {
      HAS_IMPLEMENTATION_GUIDE: false,
      TOPIC: '',
      IMPLEMENTATIONS: [],
      IMPL_KEY_FILES: [],
      EXTENSION_GUIDES: [],
      PATTERNS: []
    };
  }

  return {
    HAS_IMPLEMENTATION_GUIDE: true,
    TOPIC: extractMainTopic(observations, spec_folder),
    IMPLEMENTATIONS: extractWhatBuilt(observations),
    IMPL_KEY_FILES: extractKeyFilesWithRoles(files, observations),
    EXTENSION_GUIDES: generateExtensionGuide(observations, files),
    PATTERNS: extractCodePatterns(observations, files)
  };
}

/* -----------------------------------------------------------------
   8. EXPORTS
------------------------------------------------------------------*/

export {
  hasImplementationWork,
  extractMainTopic,
  extractWhatBuilt,
  extractKeyFilesWithRoles,
  generateExtensionGuide,
  extractCodePatterns,
  buildImplementationGuideData,
  // Backward-compatible aliases (snake_case)
  hasImplementationWork as has_implementation_work,
  extractMainTopic as extract_main_topic,
  extractWhatBuilt as extract_what_built,
};
