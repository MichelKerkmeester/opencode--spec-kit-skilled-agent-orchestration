// ---------------------------------------------------------------
// MODULE: V-Rule Bridge
// ---------------------------------------------------------------
// O2-5/O2-12: Runtime bridge to scripts/memory/validate-memory-quality
// Uses compiled JS output to avoid cross-project TypeScript rootDir issues.
// Falls back gracefully if the module is not available.

import path from 'path';
import { createRequire } from 'module';

// Feature catalog: Verify-fix-verify memory quality loop
// Feature catalog: Pre-storage quality gate

// ───────────────────────────────────────────────────────────────
// 1. TYPES (mirrored from validate-memory-quality.ts)
// ───────────────────────────────────────────────────────────────

type QualityRuleId = 'V1' | 'V2' | 'V3' | 'V4' | 'V5' | 'V6' | 'V7' | 'V8' | 'V9' | 'V10' | 'V11' | 'V12';
type ValidationDisposition = 'abort_write' | 'write_skip_index' | 'write_and_index';

interface RuleResult {
  ruleId: QualityRuleId;
  passed: boolean;
  message: string;
}

interface ValidationResult {
  valid: boolean;
  failedRules: QualityRuleId[];
  ruleResults: RuleResult[];
}

interface ValidationDispositionResult {
  disposition: ValidationDisposition;
  blockingRuleIds: QualityRuleId[];
  indexBlockingRuleIds: QualityRuleId[];
  softRuleIds: QualityRuleId[];
}

type VRuleUnavailableResult = {
  passed: false;
  status: 'error' | 'warning';
  message: string;
  _unavailable: true;
};

// ───────────────────────────────────────────────────────────────
// 2. MODULE LOADING
// ───────────────────────────────────────────────────────────────

let _validateMemoryQualityContent: ((content: string, options?: { filePath?: string }) => ValidationResult) | null = null;
let _determineValidationDisposition: ((failedRules: readonly QualityRuleId[], source?: string | null) => ValidationDispositionResult) | null = null;
let _loadAttempted = false;
const runtimeRequire = createRequire(import.meta.filename);

function loadModule(): void {
  if (_loadAttempted) return;
  _loadAttempted = true;
  try {
    const candidatePaths = [
      path.resolve(import.meta.dirname, '../../scripts/dist/memory/validate-memory-quality.js'),
      path.resolve(import.meta.dirname, '../../../scripts/dist/memory/validate-memory-quality.js'),
    ];

    let lastError: unknown;
    for (const distPath of candidatePaths) {
      try {
        const mod = runtimeRequire(distPath);
        _validateMemoryQualityContent = mod.validateMemoryQualityContent;
        _determineValidationDisposition = mod.determineValidationDisposition;
        return;
      } catch (error: unknown) {
        lastError = error;
      }
    }

    throw lastError instanceof Error ? lastError : new Error(String(lastError));
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error(`[v-rule-bridge] Failed to load validate-memory-quality: ${msg} — V-rule checks unavailable`);
  }
}

// ───────────────────────────────────────────────────────────────
// 3. EXPORTS
// ───────────────────────────────────────────────────────────────

export function validateMemoryQualityContent(content: string, options?: { filePath?: string }): ValidationResult | VRuleUnavailableResult | null {
  loadModule();
  if (!_validateMemoryQualityContent) {
    console.warn('[v-rule-bridge] validateMemoryQualityContent called but module not loaded — V-rule validation unavailable');
    return {
      passed: false,
      status: 'error',
      message: 'V-rule validation unavailable — run npm run build --workspace=@spec-kit/scripts',
      _unavailable: true,
    } as VRuleUnavailableResult;
  }
  return _validateMemoryQualityContent(content, options);
}

/** Check whether the V-rule validator module is loaded and operational. */
export function isVRuleBridgeAvailable(): boolean {
  loadModule();
  return _validateMemoryQualityContent !== null;
}

export function determineValidationDisposition(
  failedRules: readonly QualityRuleId[],
  source?: string | null,
): ValidationDispositionResult | null {
  loadModule();
  if (!_determineValidationDisposition) return null;
  return _determineValidationDisposition(failedRules, source);
}

export type { ValidationResult, ValidationDispositionResult, QualityRuleId };
