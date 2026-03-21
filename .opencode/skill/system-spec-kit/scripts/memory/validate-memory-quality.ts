#!/usr/bin/env node
// ---------------------------------------------------------------
// MODULE: Validate Memory Quality (re-export shim)
// ---------------------------------------------------------------
// Canonical implementation lives in ../lib/validate-memory-quality.ts.
// This file re-exports everything for backward compatibility and
// serves as the CLI entry point (node validate-memory-quality.js).

import fs from 'fs';
import path from 'path';

// Re-export all values and types from the canonical location
export {
  HARD_BLOCK_RULES,
  VALIDATION_RULE_METADATA,
  determineValidationDisposition,
  getRuleMetadata,
  shouldBlockIndex,
  shouldBlockWrite,
  validateMemoryQualityContent,
  validateMemoryQualityFile,
} from '../lib/validate-memory-quality';

export type {
  ValidationDisposition,
  ValidationDispositionResult,
  ValidationRuleMetadata,
  ValidationRuleSeverity,
  QualityRuleId,
  ValidationResult,
  RuleResult,
} from '../lib/validate-memory-quality';

// CLI entry point — preserved here since this is the file invoked
// as `node validate-memory-quality.js <path>`.
import { validateMemoryQualityFile } from '../lib/validate-memory-quality';

function main(): void {
  const inputPath = process.argv[2];
  if (!inputPath) {
    console.error('Usage: node validate-memory-quality.js <memory-file-path>');
    process.exit(2);
  }

  const resolvedPath = path.resolve(inputPath);
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(2);
  }

  const result = validateMemoryQualityFile(resolvedPath);
  if (!result.valid) {
    console.error(`QUALITY_GATE_FAIL: ${result.failedRules.join(', ')}`);
    for (const failed of result.ruleResults.filter((rule) => !rule.passed)) {
      console.error(`${failed.ruleId}: ${failed.message}`);
    }
    process.exit(1);
  }

  console.log('QUALITY_GATE_PASS');
}

if (require.main === module) {
  main();
}
