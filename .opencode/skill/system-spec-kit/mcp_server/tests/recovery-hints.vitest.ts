// TEST: RECOVERY HINTS (ERROR CATALOG WITH RECOVERY GUIDANCE) (Vitest)
// Converted from recovery-hints.test.js
// T001-T095: Error catalog with recovery hints (REQ-004, REQ-009)
//
// STATUS: FULL CONVERSION - Pure logic module with no DB dependencies
import { describe, it, expect, beforeAll } from 'vitest';
import {
  ERROR_CODES,
  RECOVERY_HINTS,
  TOOL_SPECIFIC_HINTS,
  DEFAULT_HINT,
  getRecoveryHint,
  hasSpecificHint,
  getAvailableHints,
  getErrorCodes,
} from '../lib/errors/recovery-hints';

const errorCodeMap = ERROR_CODES as unknown as Record<string, string>;
type RecoveryToolName = Parameters<typeof getRecoveryHint>[0];
type RecoveryErrorCode = Parameters<typeof getRecoveryHint>[1];

// T001: Module Loading
describe('Recovery Hints - Module Loading', () => {
  it('T001: Module loads without error', () => {
    expect(ERROR_CODES).toBeDefined();
    expect(RECOVERY_HINTS).toBeDefined();
    expect(TOOL_SPECIFIC_HINTS).toBeDefined();
    expect(DEFAULT_HINT).toBeDefined();
    expect(getRecoveryHint).toBeDefined();
    expect(hasSpecificHint).toBeDefined();
    expect(getAvailableHints).toBeDefined();
    expect(getErrorCodes).toBeDefined();
  });
});

// T002-T010: ERROR_CODES Constant
describe('ERROR_CODES Constant - T002-T010', () => {
  it('T002: ERROR_CODES is exported as object', () => {
    expect(ERROR_CODES).toBeDefined();
    expect(typeof ERROR_CODES).toBe('object');
  });

  it('T003: ERROR_CODES contains at least 49 error codes', () => {
    const errorCodeCount = Object.keys(ERROR_CODES).length;
    expect(errorCodeCount).toBeGreaterThanOrEqual(49);
  });

  it('T004: Embedding error codes (E001-E004) exist', () => {
    expect(ERROR_CODES.EMBEDDING_FAILED).toBe('E001');
    expect(ERROR_CODES.EMBEDDING_DIMENSION_INVALID).toBe('E002');
    expect(ERROR_CODES.EMBEDDING_TIMEOUT).toBe('E003');
    expect(ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE).toBe('E004');
  });

  it('T005: File error codes (E010-E014) exist', () => {
    expect(ERROR_CODES.FILE_NOT_FOUND).toBe('E010');
    expect(ERROR_CODES.FILE_ACCESS_DENIED).toBe('E011');
    expect(ERROR_CODES.FILE_ENCODING_ERROR).toBe('E012');
    expect(ERROR_CODES.FILE_TOO_LARGE).toBe('E013');
    expect(ERROR_CODES.FILE_INVALID_PATH).toBe('E014');
  });

  it('T006: Database error codes (E020-E024) exist', () => {
    expect(ERROR_CODES.DB_CONNECTION_FAILED).toBe('E020');
    expect(ERROR_CODES.DB_QUERY_FAILED).toBe('E021');
    expect(ERROR_CODES.DB_TRANSACTION_FAILED).toBe('E022');
    expect(ERROR_CODES.DB_MIGRATION_FAILED).toBe('E023');
    expect(ERROR_CODES.DB_CORRUPTION).toBe('E024');
  });

  it('T007: Parameter error codes (E030-E033) exist', () => {
    expect(ERROR_CODES.INVALID_PARAMETER).toBe('E030');
    expect(ERROR_CODES.MISSING_REQUIRED_PARAM).toBe('E031');
    expect(ERROR_CODES.PARAMETER_OUT_OF_RANGE).toBe('E032');
    expect(ERROR_CODES.INVALID_SPEC_FOLDER).toBe('E033');
  });

  it('T008: HTTP-style rate limiting codes (E429, E503) exist', () => {
    expect(ERROR_CODES.RATE_LIMITED).toBe('E429');
    expect(ERROR_CODES.SERVICE_UNAVAILABLE).toBe('E503');
  });

  it('T009: All error code values are unique', () => {
    const values = Object.values(ERROR_CODES);
    const uniqueValues = new Set(values);
    expect(values.length).toBe(uniqueValues.size);
  });

  it('T010: All error code values start with E', () => {
    const allStartWithE = Object.values(ERROR_CODES).every(
      (v) => typeof v === 'string' && v.startsWith('E')
    );
    expect(allStartWithE).toBe(true);
  });
});

// T011-T020: RECOVERY_HINTS Catalog
describe('RECOVERY_HINTS Catalog - T011-T020', () => {
  it('T011: RECOVERY_HINTS is exported as object', () => {
    expect(RECOVERY_HINTS).toBeDefined();
    expect(typeof RECOVERY_HINTS).toBe('object');
  });

  it('T012: All error codes have recovery hints', () => {
    const errorCodeValues = Object.values(ERROR_CODES);
    const hintsWithCoverage = errorCodeValues.filter((code) => RECOVERY_HINTS[code]);
    expect(hintsWithCoverage.length).toBe(errorCodeValues.length);
  });

  it('T013: Each hint has required hint property (string)', () => {
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      expect(hint.hint).toBeDefined();
      expect(typeof hint.hint).toBe('string');
    }
  });

  it('T014: Each hint has required actions property (non-empty array)', () => {
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      expect(Array.isArray(hint.actions)).toBe(true);
      expect(hint.actions.length).toBeGreaterThan(0);
    }
  });

  it('T015: Each hint has valid severity property (low/medium/high/critical)', () => {
    const validSeverities = ['low', 'medium', 'high', 'critical'];
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      expect(validSeverities).toContain(hint.severity);
    }
  });

  it('T016: DB_CONNECTION_FAILED has critical severity', () => {
    const dbConnHint = RECOVERY_HINTS[ERROR_CODES.DB_CONNECTION_FAILED];
    expect(dbConnHint).toBeDefined();
    expect(dbConnHint.severity).toBe('critical');
  });

  it('T017: DB_CORRUPTION has critical severity', () => {
    const dbCorruptHint = RECOVERY_HINTS[ERROR_CODES.DB_CORRUPTION];
    expect(dbCorruptHint).toBeDefined();
    expect(dbCorruptHint.severity).toBe('critical');
  });

  it('T018: DB_MIGRATION_FAILED has critical severity', () => {
    const dbMigHint = RECOVERY_HINTS[ERROR_CODES.DB_MIGRATION_FAILED];
    expect(dbMigHint).toBeDefined();
    expect(dbMigHint.severity).toBe('critical');
  });

  it('T019: Low severity codes have low severity', () => {
    const lowSeverityCodes = [
      'INVALID_PARAMETER',
      'MISSING_REQUIRED_PARAM',
      'PARAMETER_OUT_OF_RANGE',
      'FILE_ENCODING_ERROR',
      'FILE_TOO_LARGE',
    ];
    for (const codeName of lowSeverityCodes) {
      const code = errorCodeMap[codeName];
      const hint = RECOVERY_HINTS[code];
      expect(hint).toBeDefined();
      expect(hint.severity).toBe('low');
    }
  });

  it('T020: toolTip property is string when present', () => {
    for (const [code, hint] of Object.entries(RECOVERY_HINTS)) {
      if (hint.toolTip !== undefined) {
        expect(typeof hint.toolTip).toBe('string');
      }
    }
  });
});

// T021-T030: TOOL_SPECIFIC_HINTS
describe('TOOL_SPECIFIC_HINTS - T021-T030', () => {
  it('T021: TOOL_SPECIFIC_HINTS is exported as object', () => {
    expect(TOOL_SPECIFIC_HINTS).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS).toBe('object');
  });

  it('T022: memory_search has tool-specific hints', () => {
    expect(TOOL_SPECIFIC_HINTS.memory_search).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS.memory_search).toBe('object');
  });

  it('T023: checkpoint_restore has tool-specific hints', () => {
    expect(TOOL_SPECIFIC_HINTS.checkpoint_restore).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS.checkpoint_restore).toBe('object');
  });

  it('T024: memory_save has tool-specific hints', () => {
    expect(TOOL_SPECIFIC_HINTS.memory_save).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS.memory_save).toBe('object');
  });

  it('T025: memory_index_scan has tool-specific hints', () => {
    expect(TOOL_SPECIFIC_HINTS.memory_index_scan).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS.memory_index_scan).toBe('object');
  });

  it('T026: memory_drift_why has tool-specific hints', () => {
    expect(TOOL_SPECIFIC_HINTS.memory_drift_why).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS.memory_drift_why).toBe('object');
  });

  it('T027: memory_causal_link has tool-specific hints', () => {
    expect(TOOL_SPECIFIC_HINTS.memory_causal_link).toBeDefined();
    expect(typeof TOOL_SPECIFIC_HINTS.memory_causal_link).toBe('object');
  });

  it('T028: Tool-specific hints have valid structure (hint, actions, severity)', () => {
    for (const [toolName, hints] of Object.entries(TOOL_SPECIFIC_HINTS)) {
      for (const [code, hint] of Object.entries(hints as Record<string, any>)) {
        expect(hint.hint).toBeDefined();
        expect(Array.isArray(hint.actions)).toBe(true);
        expect(hint.severity).toBeDefined();
      }
    }
  });

  it('T029: memory_search EMBEDDING_FAILED has contextual hint', () => {
    const genericEmbedHint = RECOVERY_HINTS[ERROR_CODES.EMBEDDING_FAILED];
    const searchEmbedHint =
      TOOL_SPECIFIC_HINTS.memory_search?.[ERROR_CODES.EMBEDDING_FAILED];
    expect(searchEmbedHint).toBeDefined();
    expect(searchEmbedHint.hint).not.toBe(genericEmbedHint.hint);
  });

  it('T030: memory_save FILE_NOT_FOUND has contextual guidance', () => {
    const saveFileNotFound =
      TOOL_SPECIFIC_HINTS.memory_save?.[ERROR_CODES.FILE_NOT_FOUND];
    expect(saveFileNotFound).toBeDefined();
    expect(saveFileNotFound.hint).toContain('index');
  });
});

// T031-T040: getRecoveryHint() Function
describe('getRecoveryHint() Function - T031-T040', () => {
  it('T031: getRecoveryHint is exported as function', () => {
    expect(typeof getRecoveryHint).toBe('function');
  });

  it('T032: Returns tool-specific hint when available', () => {
    const searchHint = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    const expectedSearchHint =
      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
    expect(searchHint).toBe(expectedSearchHint);
  });

  it('T033: Falls back to generic hint when no tool-specific', () => {
    const genericHint = getRecoveryHint('unknown_tool', ERROR_CODES.FILE_NOT_FOUND);
    const expectedGenericHint = RECOVERY_HINTS[ERROR_CODES.FILE_NOT_FOUND];
    expect(genericHint).toBe(expectedGenericHint);
  });

  it('T034: Returns DEFAULT_HINT for unknown error code', () => {
    const defaultHint = getRecoveryHint('any_tool', 'E999');
    expect(defaultHint).toBe(DEFAULT_HINT);
  });

  it('T035: Returns DEFAULT_HINT for null error code', () => {
    const nullCodeHint = getRecoveryHint('any_tool', null as unknown as RecoveryErrorCode);
    expect(nullCodeHint).toBe(DEFAULT_HINT);
  });

  it('T036: Returns DEFAULT_HINT for undefined error code', () => {
    const undefinedCodeHint = getRecoveryHint('any_tool', undefined as unknown as RecoveryErrorCode);
    expect(undefinedCodeHint).toBe(DEFAULT_HINT);
  });

  it('T037: Works with null tool name (falls back to generic)', () => {
    const nullToolHint = getRecoveryHint(
      null as unknown as RecoveryToolName,
      ERROR_CODES.DB_CONNECTION_FAILED
    );
    const expectedDbHint = RECOVERY_HINTS[ERROR_CODES.DB_CONNECTION_FAILED];
    expect(nullToolHint).toBe(expectedDbHint);
  });

  it('T038: checkpoint_restore specific hint overrides generic', () => {
    const restoreHint = getRecoveryHint(
      'checkpoint_restore',
      ERROR_CODES.CHECKPOINT_NOT_FOUND
    );
    const specificCheckpointHint =
      TOOL_SPECIFIC_HINTS.checkpoint_restore?.[ERROR_CODES.CHECKPOINT_NOT_FOUND];
    expect(specificCheckpointHint).toBeDefined();
    expect(restoreHint).toBe(specificCheckpointHint);
  });

  it('T039: Returns hint object with all required properties', () => {
    const fullHint = getRecoveryHint('memory_save', ERROR_CODES.VALIDATION_FAILED);
    expect(fullHint.hint).toBeDefined();
    expect(fullHint.actions).toBeDefined();
    expect(fullHint.severity).toBeDefined();
  });

  it('T040: Same error code returns different hints for different tools', () => {
    const saveEmbedHint = getRecoveryHint('memory_save', ERROR_CODES.EMBEDDING_FAILED);
    const searchEmbedHint = getRecoveryHint(
      'memory_search',
      ERROR_CODES.EMBEDDING_FAILED
    );
    expect(saveEmbedHint.hint).not.toBe(searchEmbedHint.hint);
  });
});

// T041-T045: hasSpecificHint() Helper
describe('hasSpecificHint() Helper - T041-T045', () => {
  it('T041: hasSpecificHint is exported as function', () => {
    expect(typeof hasSpecificHint).toBe('function');
  });

  it('T042: Returns true for tool-specific hint', () => {
    const hasSearch = hasSpecificHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    expect(hasSearch).toBe(true);
  });

  it('T043: Returns true for generic hint (no tool-specific)', () => {
    const hasGeneric = hasSpecificHint('unknown_tool', ERROR_CODES.DB_CORRUPTION);
    expect(hasGeneric).toBe(true);
  });

  it('T044: Returns false for unknown error code', () => {
    const hasUnknown = hasSpecificHint('any_tool', 'E999');
    expect(hasUnknown).toBe(false);
  });

  it('T045: Returns false for null/undefined inputs', () => {
    const hasNull = hasSpecificHint(
      null as unknown as RecoveryToolName,
      null as unknown as RecoveryErrorCode
    );
    const hasUndefined = hasSpecificHint(
      undefined as unknown as RecoveryToolName,
      undefined as unknown as RecoveryErrorCode
    );
    expect(hasNull).toBe(false);
    expect(hasUndefined).toBe(false);
  });
});

// T046-T050: getAvailableHints() Helper
describe('getAvailableHints() Helper - T046-T050', () => {
  it('T046: getAvailableHints is exported as function', () => {
    expect(typeof getAvailableHints).toBe('function');
  });

  it('T047: Returns all generic hints for unknown tool', () => {
    const unknownHints = getAvailableHints('unknown_tool');
    const genericHintCount = Object.keys(RECOVERY_HINTS).length;
    expect(Object.keys(unknownHints).length).toBe(genericHintCount);
  });

  it('T048: Returns merged hints for tool with specific hints', () => {
    const searchHints = getAvailableHints('memory_search');
    const genericHintCount = Object.keys(RECOVERY_HINTS).length;
    expect(Object.keys(searchHints).length).toBeGreaterThanOrEqual(genericHintCount);
  });

  it('T049: Tool-specific hints override generic in result', () => {
    const searchHints = getAvailableHints('memory_search');
    const searchEmbedHint = searchHints[ERROR_CODES.EMBEDDING_FAILED];
    const expectedToolHint =
      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED];
    expect(searchEmbedHint).toBe(expectedToolHint);
  });

  it('T050: Returns object with string keys (error codes)', () => {
    const unknownHints = getAvailableHints('unknown_tool');
    const allKeysAreStrings = Object.keys(unknownHints).every(
      (k) => typeof k === 'string'
    );
    expect(allKeysAreStrings).toBe(true);
  });
});

// T051-T055: getErrorCodes() Helper
describe('getErrorCodes() Helper - T051-T055', () => {
  it('T051: getErrorCodes is exported as function', () => {
    expect(typeof getErrorCodes).toBe('function');
  });

  it('T052: Returns ERROR_CODES constant', () => {
    const codes = getErrorCodes();
    expect(codes).toBe(ERROR_CODES);
  });

  it('T053: Returned object is same reference on multiple calls', () => {
    const codes = getErrorCodes();
    const codes2 = getErrorCodes();
    expect(codes).toBe(codes2);
  });

  it('T054: Contains all expected error code names', () => {
    const expectedCodeNames = [
      'EMBEDDING_FAILED',
      'FILE_NOT_FOUND',
      'DB_CONNECTION_FAILED',
      'INVALID_PARAMETER',
      'SEARCH_FAILED',
      'API_KEY_INVALID_STARTUP',
      'CHECKPOINT_NOT_FOUND',
      'SESSION_EXPIRED',
      'MEMORY_NOT_FOUND',
      'VALIDATION_FAILED',
      'CAUSAL_EDGE_NOT_FOUND',
      'RATE_LIMITED',
    ];
    const codes = getErrorCodes();
    const allPresent = expectedCodeNames.every(
      (name) => (codes as unknown as Record<string, string>)[name] !== undefined
    );
    expect(allPresent).toBe(true);
  });

  it('T055: Can enumerate all error codes', () => {
    const allCodes = Object.entries(getErrorCodes());
    expect(allCodes.length).toBeGreaterThanOrEqual(49);
  });
});

// T056-T060: DEFAULT_HINT Fallback
describe('DEFAULT_HINT Fallback - T056-T060', () => {
  it('T056: DEFAULT_HINT is exported as object', () => {
    expect(DEFAULT_HINT).toBeDefined();
    expect(typeof DEFAULT_HINT).toBe('object');
  });

  it('T057: DEFAULT_HINT has expected hint message', () => {
    expect(DEFAULT_HINT.hint).toBe('An unexpected error occurred.');
  });

  it('T058: DEFAULT_HINT actions include memory_health() reference (REQ-009)', () => {
    expect(Array.isArray(DEFAULT_HINT.actions)).toBe(true);
    const hasMemoryHealthAction = DEFAULT_HINT.actions.some((a: string) =>
      a.includes('memory_health()')
    );
    expect(hasMemoryHealthAction).toBe(true);
  });

  it('T059: DEFAULT_HINT has medium severity', () => {
    expect(DEFAULT_HINT.severity).toBe('medium');
  });

  it('T060: DEFAULT_HINT has toolTip for memory_health()', () => {
    expect(DEFAULT_HINT.toolTip).toBe('memory_health()');
  });
});

// T061-T070: Severity Levels
describe('Severity Levels - T061-T070', () => {
  it('T061: At least 3 critical severity hints exist', () => {
    const criticalHints = Object.values(RECOVERY_HINTS).filter(
      (h: any) => h.severity === 'critical'
    );
    expect(criticalHints.length).toBeGreaterThanOrEqual(3);
  });

  it('T062: At least 5 high severity hints exist', () => {
    const highHints = Object.values(RECOVERY_HINTS).filter(
      (h: any) => h.severity === 'high'
    );
    expect(highHints.length).toBeGreaterThanOrEqual(5);
  });

  it('T063: At least 15 medium severity hints exist', () => {
    const mediumHints = Object.values(RECOVERY_HINTS).filter(
      (h: any) => h.severity === 'medium'
    );
    expect(mediumHints.length).toBeGreaterThanOrEqual(15);
  });

  it('T064: At least 10 low severity hints exist', () => {
    const lowHints = Object.values(RECOVERY_HINTS).filter(
      (h: any) => h.severity === 'low'
    );
    expect(lowHints.length).toBeGreaterThanOrEqual(10);
  });

  it('T065: EMBEDDING_PROVIDER_UNAVAILABLE is high severity', () => {
    const providerHint = RECOVERY_HINTS[ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE];
    expect(providerHint).toBeDefined();
    expect(providerHint.severity).toBe('high');
  });

  it('T066: API_KEY_INVALID_STARTUP is high severity', () => {
    const apiKeyHint = RECOVERY_HINTS[ERROR_CODES.API_KEY_INVALID_STARTUP];
    expect(apiKeyHint).toBeDefined();
    expect(apiKeyHint.severity).toBe('high');
  });

  it('T067: SERVICE_UNAVAILABLE is high severity', () => {
    const serviceHint = RECOVERY_HINTS[ERROR_CODES.SERVICE_UNAVAILABLE];
    expect(serviceHint).toBeDefined();
    expect(serviceHint.severity).toBe('high');
  });

  it('T068: RATE_LIMITED is low severity (transient)', () => {
    const rateHint = RECOVERY_HINTS[ERROR_CODES.RATE_LIMITED];
    expect(rateHint).toBeDefined();
    expect(rateHint.severity).toBe('low');
  });

  it('T069: SESSION_EXPIRED is low severity (user can recover)', () => {
    const sessionHint = RECOVERY_HINTS[ERROR_CODES.SESSION_EXPIRED];
    expect(sessionHint).toBeDefined();
    expect(sessionHint.severity).toBe('low');
  });

  it('T070: CHECKPOINT_RESTORE_FAILED is high severity (data loss risk)', () => {
    const restoreHint = RECOVERY_HINTS[ERROR_CODES.CHECKPOINT_RESTORE_FAILED];
    expect(restoreHint).toBeDefined();
    expect(restoreHint.severity).toBe('high');
  });
});

// T071-T080: Error Code Categories
describe('Error Code Categories - T071-T080', () => {
  it('T071: Search error codes (E040-E044) exist', () => {
    expect(ERROR_CODES.SEARCH_FAILED).toBe('E040');
    expect(ERROR_CODES.VECTOR_SEARCH_UNAVAILABLE).toBe('E041');
    expect(ERROR_CODES.QUERY_TOO_LONG).toBe('E042');
    expect(ERROR_CODES.QUERY_EMPTY).toBe('E043');
    expect(ERROR_CODES.NO_RESULTS).toBe('E044');
  });

  it('T072: API/Auth error codes (E050-E053) exist', () => {
    expect(ERROR_CODES.API_KEY_INVALID_STARTUP).toBe('E050');
    expect(ERROR_CODES.API_KEY_INVALID_RUNTIME).toBe('E051');
    expect(ERROR_CODES.LOCAL_MODEL_UNAVAILABLE).toBe('E052');
    expect(ERROR_CODES.API_RATE_LIMITED).toBe('E053');
  });

  it('T073: Checkpoint error codes (E060-E063) exist', () => {
    expect(ERROR_CODES.CHECKPOINT_NOT_FOUND).toBe('E060');
    expect(ERROR_CODES.CHECKPOINT_RESTORE_FAILED).toBe('E061');
    expect(ERROR_CODES.CHECKPOINT_CREATE_FAILED).toBe('E062');
    expect(ERROR_CODES.CHECKPOINT_DUPLICATE_NAME).toBe('E063');
  });

  it('T074: Session error codes (E070-E072) exist', () => {
    expect(ERROR_CODES.SESSION_EXPIRED).toBe('E070');
    expect(ERROR_CODES.SESSION_INVALID).toBe('E071');
    expect(ERROR_CODES.SESSION_RECOVERY_FAILED).toBe('E072');
  });

  it('T075: Memory operation error codes (E080-E084) exist', () => {
    expect(ERROR_CODES.MEMORY_NOT_FOUND).toBe('E080');
    expect(ERROR_CODES.MEMORY_SAVE_FAILED).toBe('E081');
    expect(ERROR_CODES.MEMORY_DELETE_FAILED).toBe('E082');
    expect(ERROR_CODES.MEMORY_UPDATE_FAILED).toBe('E083');
    expect(ERROR_CODES.MEMORY_DUPLICATE).toBe('E084');
  });

  it('T076: Validation error codes (E090-E093) exist', () => {
    expect(ERROR_CODES.VALIDATION_FAILED).toBe('E090');
    expect(ERROR_CODES.ANCHOR_FORMAT_INVALID).toBe('E091');
    expect(ERROR_CODES.TOKEN_BUDGET_EXCEEDED).toBe('E092');
    expect(ERROR_CODES.PREFLIGHT_FAILED).toBe('E093');
  });

  it('T077: Causal graph error codes (E100-E103) exist', () => {
    expect(ERROR_CODES.CAUSAL_EDGE_NOT_FOUND).toBe('E100');
    expect(ERROR_CODES.CAUSAL_CYCLE_DETECTED).toBe('E101');
    expect(ERROR_CODES.CAUSAL_INVALID_RELATION).toBe('E102');
    expect(ERROR_CODES.CAUSAL_SELF_REFERENCE).toBe('E103');
  });

  it('T078: Error code ranges allow for expansion', () => {
    const allValues = Object.values(ERROR_CODES).filter(
      (v) => v !== 'E429' && v !== 'E503'
    );
    const numericParts = allValues.map((v) => parseInt(v.slice(1)));
    const sortedNumeric = [...numericParts].sort((a, b) => a - b);
    for (let i = 1; i < sortedNumeric.length; i++) {
      expect(sortedNumeric[i] - sortedNumeric[i - 1]).toBeGreaterThanOrEqual(1);
    }
  });

  it('T079: All error codes follow E### format', () => {
    const allFollowFormat = Object.values(ERROR_CODES).every((v) => /^E\d+$/.test(v));
    expect(allFollowFormat).toBe(true);
  });

  it('T080: Error codes are ascending within categories', () => {
    const categories: Record<string, string[]> = {
      embedding: [
        ERROR_CODES.EMBEDDING_FAILED,
        ERROR_CODES.EMBEDDING_DIMENSION_INVALID,
        ERROR_CODES.EMBEDDING_TIMEOUT,
        ERROR_CODES.EMBEDDING_PROVIDER_UNAVAILABLE,
      ],
      file: [
        ERROR_CODES.FILE_NOT_FOUND,
        ERROR_CODES.FILE_ACCESS_DENIED,
        ERROR_CODES.FILE_ENCODING_ERROR,
        ERROR_CODES.FILE_TOO_LARGE,
        ERROR_CODES.FILE_INVALID_PATH,
      ],
      db: [
        ERROR_CODES.DB_CONNECTION_FAILED,
        ERROR_CODES.DB_QUERY_FAILED,
        ERROR_CODES.DB_TRANSACTION_FAILED,
        ERROR_CODES.DB_MIGRATION_FAILED,
        ERROR_CODES.DB_CORRUPTION,
      ],
    };
    for (const [_cat, codes] of Object.entries(categories)) {
      const nums = codes.map((c) => parseInt(c.slice(1)));
      for (let i = 1; i < nums.length; i++) {
        expect(nums[i]).toBeGreaterThan(nums[i - 1]);
      }
    }
  });
});

// T081-T090: Action Content
describe('Action Content - T081-T090', () => {
  it('T081: All actions are non-empty strings', () => {
    for (const [_code, hint] of Object.entries(RECOVERY_HINTS)) {
      for (const action of hint.actions) {
        expect(typeof action).toBe('string');
        expect(action.trim()).not.toBe('');
      }
    }
  });

  it('T082: DB_CORRUPTION mentions checkpoint_list()', () => {
    const corruptionHint = RECOVERY_HINTS[ERROR_CODES.DB_CORRUPTION];
    const hasCheckpointAction = corruptionHint.actions.some((a: string) =>
      a.includes('checkpoint_list()')
    );
    expect(hasCheckpointAction).toBe(true);
  });

  it('T083: EMBEDDING_FAILED mentions BM25 fallback', () => {
    const embedHint = RECOVERY_HINTS[ERROR_CODES.EMBEDDING_FAILED];
    const hasBM25 =
      embedHint.hint.includes('BM25') ||
      embedHint.actions.some((a: string) => a.includes('BM25'));
    expect(hasBM25).toBe(true);
  });

  it('T084: ANCHOR_FORMAT_INVALID provides format example', () => {
    const anchorHint = RECOVERY_HINTS[ERROR_CODES.ANCHOR_FORMAT_INVALID];
    const hasFormatExample = anchorHint.actions.some((a: string) =>
      a.includes('<!-- ANCHOR:')
    );
    expect(hasFormatExample).toBe(true);
  });

  it('T085: CAUSAL_INVALID_RELATION lists valid relations', () => {
    const causalHint = RECOVERY_HINTS[ERROR_CODES.CAUSAL_INVALID_RELATION];
    const hasValidRelations = causalHint.actions.some(
      (a: string) => a.includes('caused') && a.includes('supports')
    );
    expect(hasValidRelations).toBe(true);
  });

  it('T086: FILE_TOO_LARGE suggests splitting', () => {
    const fileLargeHint = RECOVERY_HINTS[ERROR_CODES.FILE_TOO_LARGE];
    const hasSplitSuggestion = fileLargeHint.actions.some((a: string) =>
      a.toLowerCase().includes('split')
    );
    expect(hasSplitSuggestion).toBe(true);
  });

  it('T087: QUERY_TOO_LONG suggests memory_match_triggers()', () => {
    const queryLongHint = RECOVERY_HINTS[ERROR_CODES.QUERY_TOO_LONG];
    const hasTriggerSuggestion = queryLongHint.actions.some((a: string) =>
      a.includes('memory_match_triggers()')
    );
    expect(hasTriggerSuggestion).toBe(true);
  });

  it('T088: MEMORY_SAVE_FAILED mentions dryRun validation', () => {
    const saveFailedHint = RECOVERY_HINTS[ERROR_CODES.MEMORY_SAVE_FAILED];
    const hasDryRun = saveFailedHint.actions.some((a: string) =>
      a.includes('dryRun')
    );
    expect(hasDryRun).toBe(true);
  });

  it('T088b: MEMORY_SAVE_FAILED mentions insufficient context recovery', () => {
    const saveFailedHint = RECOVERY_HINTS[ERROR_CODES.MEMORY_SAVE_FAILED];
    const mentionsInsufficientContext = saveFailedHint.actions.some((a: string) =>
      a.includes('INSUFFICIENT_CONTEXT_ABORT')
    );
    expect(mentionsInsufficientContext).toBe(true);
  });

  it('T089: MEMORY_DUPLICATE suggests force=true', () => {
    const duplicateHint = RECOVERY_HINTS[ERROR_CODES.MEMORY_DUPLICATE];
    const hasForce = duplicateHint.actions.some((a: string) =>
      a.includes('force=true')
    );
    expect(hasForce).toBe(true);
  });

  it('T090: SESSION_EXPIRED mentions recovery option', () => {
    const expiredHint = RECOVERY_HINTS[ERROR_CODES.SESSION_EXPIRED];
    const hasRecovery = expiredHint.actions.some(
      (a: string) => a.includes('/spec_kit:resume') || a.includes('recovery')
    );
    expect(hasRecovery).toBe(true);
  });
});

// T091-T095: Integration Tests
describe('Integration Tests - T091-T095', () => {
  it('T091: Complete lookup chain works (tool-specific -> generic -> default)', () => {
    const toolSpecific = getRecoveryHint('memory_search', ERROR_CODES.EMBEDDING_FAILED);
    const generic = getRecoveryHint('unknown_tool', ERROR_CODES.EMBEDDING_FAILED);
    const defaultFallback = getRecoveryHint('unknown_tool', 'E999');

    expect(toolSpecific).toBe(
      TOOL_SPECIFIC_HINTS.memory_search[ERROR_CODES.EMBEDDING_FAILED]
    );
    expect(generic).toBe(RECOVERY_HINTS[ERROR_CODES.EMBEDDING_FAILED]);
    expect(defaultFallback).toBe(DEFAULT_HINT);
  });

  it('T092: getAvailableHints includes all error codes', () => {
    const allSearchHints = getAvailableHints('memory_search');
    const allCodesHaveHints = Object.values(ERROR_CODES).every(
      (code) => allSearchHints[code] !== undefined
    );
    expect(allCodesHaveHints).toBe(true);
  });

  it('T093: hasSpecificHint and getRecoveryHint are consistent', () => {
    for (const code of Object.values(ERROR_CODES)) {
      const hasIt = hasSpecificHint('unknown_tool', code);
      const hint = getRecoveryHint('unknown_tool', code);
      if (hasIt) {
        expect(hint).not.toBe(DEFAULT_HINT);
      }
      if (!hasIt) {
        expect(hint).toBe(DEFAULT_HINT);
      }
    }
  });

  it('T094: All exported functions handle edge cases without throwing', () => {
    expect(() => {
      getRecoveryHint(
        null as unknown as RecoveryToolName,
        null as unknown as RecoveryErrorCode
      );
      getRecoveryHint('', '');
      hasSpecificHint(
        null as unknown as RecoveryToolName,
        null as unknown as RecoveryErrorCode
      );
      hasSpecificHint('', '');
      getAvailableHints(null as unknown as RecoveryToolName);
      getAvailableHints('');
      getErrorCodes();
    }).not.toThrow();
  });

  it('T095: Module exports all expected items', () => {
    const expectedExports = [
      'ERROR_CODES',
      'RECOVERY_HINTS',
      'TOOL_SPECIFIC_HINTS',
      'DEFAULT_HINT',
      'getRecoveryHint',
      'hasSpecificHint',
      'getAvailableHints',
      'getErrorCodes',
    ];
    // All were imported successfully at the top of this file
    const allExported = expectedExports.every((name) => {
      const mod: any = {
        ERROR_CODES,
        RECOVERY_HINTS,
        TOOL_SPECIFIC_HINTS,
        DEFAULT_HINT,
        getRecoveryHint,
        hasSpecificHint,
        getAvailableHints,
        getErrorCodes,
      };
      return mod[name] !== undefined;
    });
    expect(allExported).toBe(true);
  });
});
