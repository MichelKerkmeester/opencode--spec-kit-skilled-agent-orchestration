import {
  canClassifyAsSpecDocument,
  matchesSpecDocumentPath,
} from './spec-doc-paths.js';

export { SPEC_DOCUMENT_FILENAMES } from './spec-doc-paths.js';

// ───────────────────────────────────────────────────────────────
// MODULE: Memory Types
// ───────────────────────────────────────────────────────────────
// Feature catalog: Classification-based decay
// ───────────────────────────────────────────────────────────────
// 1. TYPES

// ───────────────────────────────────────────────────────────────
/**
 * Describes the MemoryTypeConfig shape.
 */
export interface MemoryTypeConfig {
  halfLifeDays: number | null;
  description: string;
  autoExpireDays: number | null;
  decayEnabled: boolean;
}

/**
 * Defines the MemoryTypeName type.
 */
export type MemoryTypeName =
  | 'working'
  | 'episodic'
  | 'prospective'
  | 'implicit'
  | 'declarative'
  | 'procedural'
  | 'semantic'
  | 'autobiographical'
  | 'meta-cognitive';

interface PathTypePattern {
  pattern: RegExp;
  type: MemoryTypeName;
}

interface HalfLifeValidationResult {
  valid: boolean;
  errors: string[];
}

// ───────────────────────────────────────────────────────────────
// 2. MEMORY TYPES CONFIGURATION

// ───────────────────────────────────────────────────────────────
/**
 * Defines the MEMORY_TYPES constant.
 */
export const MEMORY_TYPES = {
  working: {
    halfLifeDays: 1,
    description: 'Active session context and immediate task state',
    autoExpireDays: 7,
    decayEnabled: true,
  },
  episodic: {
    halfLifeDays: 7,
    description: 'Event-based memories: sessions, debugging, discoveries',
    autoExpireDays: 30,
    decayEnabled: true,
  },
  prospective: {
    halfLifeDays: 14,
    description: 'Future intentions: TODOs, next steps, planned actions',
    autoExpireDays: 60,
    decayEnabled: true,
  },
  implicit: {
    halfLifeDays: 30,
    description: 'Learned patterns: code styles, workflows, habits',
    autoExpireDays: 120,
    decayEnabled: true,
  },
  declarative: {
    halfLifeDays: 60,
    description: 'Facts and knowledge: implementations, APIs, technical details',
    autoExpireDays: 180,
    decayEnabled: true,
  },
  procedural: {
    halfLifeDays: 90,
    description: 'How-to knowledge: processes, procedures, guides',
    autoExpireDays: 365,
    decayEnabled: true,
  },
  semantic: {
    halfLifeDays: 180,
    description: 'Core concepts: architecture, design principles, domain knowledge',
    autoExpireDays: null,
    decayEnabled: true,
  },
  autobiographical: {
    halfLifeDays: 365,
    description: 'Project history: milestones, major decisions, historical context',
    autoExpireDays: null,
    decayEnabled: true,
  },
  'meta-cognitive': {
    halfLifeDays: null,
    description: 'Rules about rules: constitutional, standards, invariants',
    autoExpireDays: null,
    decayEnabled: false,
  },
} as const satisfies Record<MemoryTypeName, MemoryTypeConfig>;

// Half-life lookup for efficient access
/**
 * Defines the HALF_LIVES_DAYS constant.
 */
export const HALF_LIVES_DAYS: Readonly<Record<string, number | null>> = Object.fromEntries(
  Object.entries(MEMORY_TYPES).map(([type, config]) => [type, config.halfLifeDays])
) as Record<string, number | null>;

const EXPECTED_TYPES: readonly MemoryTypeName[] = [
  'episodic',
  'semantic',
  'procedural',
  'declarative',
  'autobiographical',
  'prospective',
  'implicit',
  'working',
  'meta-cognitive',
] as const;

// ───────────────────────────────────────────────────────────────
// 3. TYPE INFERENCE CONFIGURATION

// ───────────────────────────────────────────────────────────────
/**
 * Defines the PATH_TYPE_PATTERNS constant.
 */
export const PATH_TYPE_PATTERNS: readonly PathTypePattern[] = [
  // Episodic patterns (sessions, events) - more specific, check first
  { pattern: /session[-_]?\d+/i, type: 'episodic' },
  { pattern: /debug[-_]?log/i, type: 'episodic' },
  { pattern: /\/discovery\//i, type: 'episodic' },

  // Working memory patterns
  { pattern: /\/scratch\//, type: 'working' },
  { pattern: /\/temp\//, type: 'working' },
  { pattern: /\/research\/iterations\//, type: 'working' },
  { pattern: /\/review\/iterations\//, type: 'working' },
  { pattern: /\/session-state/i, type: 'working' },

  // Spec document filenames are resolved through SPEC_DOCUMENT_CONFIGS.
  // Keep only generic path heuristics here so the config remains the
  // single source of truth for exact spec document routing.

  // Prospective patterns (future actions)
  { pattern: /todo/i, type: 'prospective' },
  { pattern: /next[-_]?steps/i, type: 'prospective' },
  { pattern: /backlog/i, type: 'prospective' },
  { pattern: /roadmap/i, type: 'prospective' },

  // Implicit patterns (learned behaviors)
  { pattern: /pattern/i, type: 'implicit' },
  { pattern: /workflow/i, type: 'implicit' },
  { pattern: /habit/i, type: 'implicit' },

  // Declarative patterns (facts)
  { pattern: /implementation[-_]guide/i, type: 'declarative' },
  { pattern: /api[-_]?ref/i, type: 'declarative' },

  // Procedural patterns (how-to)
  { pattern: /guide/i, type: 'procedural' },
  { pattern: /process/i, type: 'procedural' },
  { pattern: /runbook/i, type: 'procedural' },
  { pattern: /checklist/i, type: 'procedural' },

  // Semantic patterns (concepts)
  { pattern: /architecture/i, type: 'semantic' },
  { pattern: /design[-_]?doc/i, type: 'semantic' },
  { pattern: /adr[-_]?\d+/i, type: 'semantic' },

  // Autobiographical patterns (history)
  { pattern: /changelog/i, type: 'autobiographical' },
  { pattern: /milestone/i, type: 'autobiographical' },
  { pattern: /retrospective/i, type: 'autobiographical' },
  { pattern: /postmortem/i, type: 'autobiographical' },

  // Meta-cognitive patterns (rules)
  { pattern: /constitutional/i, type: 'meta-cognitive' },
  { pattern: /agents\.md$/i, type: 'meta-cognitive' },
  { pattern: /claude\.md$/i, type: 'meta-cognitive' },
  { pattern: /rules/i, type: 'meta-cognitive' },
  { pattern: /invariant/i, type: 'meta-cognitive' },
] as const;

/**
 * Defines the KEYWORD_TYPE_MAP constant.
 */
export const KEYWORD_TYPE_MAP: Readonly<Record<string, MemoryTypeName>> = {
  // Working
  'session context': 'working',
  'active state': 'working',
  'current task': 'working',

  // Episodic
  'session summary': 'episodic',
  'debug session': 'episodic',
  'discovery': 'episodic',
  'event': 'episodic',
  'occurred': 'episodic',

  // Prospective
  'todo': 'prospective',
  'next steps': 'prospective',
  'future': 'prospective',
  'planned': 'prospective',
  'upcoming': 'prospective',

  // Implicit
  'pattern': 'implicit',
  'workflow': 'implicit',
  'best practice': 'implicit',
  'convention': 'implicit',

  // Declarative
  'implementation': 'declarative',
  'api': 'declarative',
  'specification': 'declarative',
  'fact': 'declarative',
  'detail': 'declarative',

  // Procedural
  'how to': 'procedural',
  'guide': 'procedural',
  'process': 'procedural',
  'procedure': 'procedural',
  'steps': 'procedural',
  'checklist': 'procedural',

  // Semantic
  'architecture': 'semantic',
  'design': 'semantic',
  'principle': 'semantic',
  'concept': 'semantic',
  'decision': 'semantic',

  // Autobiographical
  'milestone': 'autobiographical',
  'history': 'autobiographical',
  'retrospective': 'autobiographical',
  'changelog': 'autobiographical',
  'project history': 'autobiographical',

  // Meta-cognitive
  'constitutional': 'meta-cognitive',
  'rule': 'meta-cognitive',
  'standard': 'meta-cognitive',
  'invariant': 'meta-cognitive',
  'constraint': 'meta-cognitive',
};

// ───────────────────────────────────────────────────────────────
// 4. TYPE HELPER FUNCTIONS

// ───────────────────────────────────────────────────────────────
export function getValidTypes(): MemoryTypeName[] {
  return [...EXPECTED_TYPES];
}

/**
 * Provides the isValidType helper.
 */
export function isValidType(type: string | null | undefined): boolean {
  if (!type || typeof type !== 'string') {
    return false;
  }
  return (EXPECTED_TYPES as readonly string[]).includes(type.toLowerCase());
}

function getTypeConfig(type: string | null | undefined): MemoryTypeConfig | null {
  if (!type || typeof type !== 'string') {
    return null;
  }
  return MEMORY_TYPES[type.toLowerCase() as MemoryTypeName] || null;
}

/**
 * Returns the half-life in days for a given memory type name.
 * Returns null if the type has no decay or is not recognized.
 */
export function getHalfLifeForType(typeName: string): number | null {
  const config = MEMORY_TYPES[typeName.toLowerCase() as MemoryTypeName];
  if (!config || !config.decayEnabled) {
    return null;
  }
  return config.halfLifeDays ?? null;
}

/**
 * Resolves a primary spec document path to its configured memory type.
 * Returns null for non-spec paths and nested memory artifacts.
 */
export function resolveSpecDocumentType(filePath: string | null | undefined): MemoryTypeName | null {
  if (!filePath || typeof filePath !== 'string') {
    return null;
  }

  if (!canClassifyAsSpecDocument(filePath)) {
    return null;
  }

  const normalizedPath = filePath.replace(/\\/g, '/').toLowerCase();
  const matchedConfig = SPEC_DOCUMENT_CONFIGS.find((config) => config.filePattern.test(normalizedPath));
  return matchedConfig?.memoryType ?? null;
}

/**
 * Returns the stored half-life for a memory type, preserving the legacy
 * declarative default for absent or unknown inputs.
 */
export function getHalfLife(type: string | null | undefined): number | null {
  if (!type || typeof type !== 'string') {
    return 60;
  }
  const halfLife = HALF_LIVES_DAYS[type.toLowerCase()];
  return halfLife !== undefined ? halfLife : 60;
}

export function isDecayEnabled(type: string | null | undefined): boolean {
  const config = getTypeConfig(type);
  return config ? config.decayEnabled : true;
}

/**
 * Provides the getDefaultType helper.
 */
export function getDefaultType(): MemoryTypeName {
  return 'declarative';
}

// ───────────────────────────────────────────────────────────────
// 5. RESET-TO-DEFAULTS

// ───────────────────────────────────────────────────────────────
export function getDefaultHalfLives(): Record<MemoryTypeName, number | null> {
  return {
    working: 1,
    episodic: 7,
    prospective: 14,
    implicit: 30,
    declarative: 60,
    procedural: 90,
    semantic: 180,
    autobiographical: 365,
    'meta-cognitive': null,
  };
}

// 5. DOCUMENT TYPES

/**
 * Defines the DocumentType type.
 */
export type DocumentType =
  | 'spec'
  | 'plan'
  | 'tasks'
  | 'checklist'
  | 'decision_record'
  | 'implementation_summary'
  | 'research'
  | 'handover'
  | 'memory'
  | 'constitutional';

/**
 * Describes the SpecDocumentConfig shape.
 */
export interface SpecDocumentConfig {
  filePattern: RegExp;
  documentType: DocumentType;
  memoryType: MemoryTypeName;
  defaultImportanceTier: string;
  defaultImportanceWeight: number;
}

/** Configuration for each spec folder document type */
export const SPEC_DOCUMENT_CONFIGS: readonly SpecDocumentConfig[] = [
  { filePattern: /(?:^|\/)spec\.md$/i,                    documentType: 'spec',                    memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.8 },
  { filePattern: /(?:^|\/)plan\.md$/i,                    documentType: 'plan',                    memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.7 },
  { filePattern: /(?:^|\/)tasks\.md$/i,                   documentType: 'tasks',                   memoryType: 'prospective', defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.6 },
  { filePattern: /(?:^|\/)checklist\.md$/i,               documentType: 'checklist',               memoryType: 'procedural',  defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.5 },
  { filePattern: /(?:^|\/)decision-record\.md$/i,         documentType: 'decision_record',         memoryType: 'semantic',    defaultImportanceTier: 'important', defaultImportanceWeight: 0.8 },
  { filePattern: /(?:^|\/)implementation-summary\.md$/i,  documentType: 'implementation_summary',  memoryType: 'semantic',    defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.6 },
  { filePattern: /(?:^|\/)(?:research\/research\.md|research\.md)$/i, documentType: 'research', memoryType: 'semantic', defaultImportanceTier: 'normal', defaultImportanceWeight: 0.6 },
  { filePattern: /(?:^|\/)handover\.md$/i,                documentType: 'handover',                memoryType: 'episodic',    defaultImportanceTier: 'normal',    defaultImportanceWeight: 0.5 },
] as const;

/**
 * Infer document type from a file path.
 * Returns the DocumentType if the file matches a known spec document pattern,
 * or falls back based on path characteristics.
 */
export function inferDocumentTypeFromPath(filePath: string): DocumentType {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const BASENAME_BY_DOCUMENT_TYPE: Partial<Record<DocumentType, string>> = {
    spec: 'spec.md',
    plan: 'plan.md',
    tasks: 'tasks.md',
    checklist: 'checklist.md',
    decision_record: 'decision-record.md',
    implementation_summary: 'implementation-summary.md',
    research: 'research.md',
    handover: 'handover.md',
  };

  // Check spec document patterns first
  for (const config of SPEC_DOCUMENT_CONFIGS) {
    const basename = BASENAME_BY_DOCUMENT_TYPE[config.documentType];
    if (
      basename &&
      config.filePattern.test(normalizedPath)
      && matchesSpecDocumentPath(filePath, basename)
    ) {
      return config.documentType;
    }
  }

  // Constitutional files
  if (normalizedPath.includes('/constitutional/') && normalizedPath.endsWith('.md')) {
    return 'constitutional';
  }

  // Default: memory
  return 'memory';
}

/**
 * Get the SpecDocumentConfig for a given document type.
 */
export function getSpecDocumentConfig(documentType: DocumentType): SpecDocumentConfig | null {
  return SPEC_DOCUMENT_CONFIGS.find(c => c.documentType === documentType) ?? null;
}

// ───────────────────────────────────────────────────────────────
// 6. HALF-LIFE VALIDATION

// ───────────────────────────────────────────────────────────────
export function validateHalfLifeConfig(config: Record<string, unknown> | null | undefined): HalfLifeValidationResult {
  const errors: string[] = [];

  if (!config || typeof config !== 'object') {
    return { valid: false, errors: ['Configuration must be an object'] };
  }

  for (const type of EXPECTED_TYPES) {
    if (!(type in config)) {
      errors.push(`Missing type: ${type}`);
      continue;
    }

    const value = config[type];
    // M5 FIX: Reject 0 in addition to negatives — error message says "positive" but <= 0 was accepted
    if (value !== null && (typeof value !== 'number' || !Number.isFinite(value as number) || (value as number) <= 0)) {
      errors.push(`Invalid half-life for ${type}: must be positive number or null`);
    }
  }

  return { valid: errors.length === 0, errors };
}
