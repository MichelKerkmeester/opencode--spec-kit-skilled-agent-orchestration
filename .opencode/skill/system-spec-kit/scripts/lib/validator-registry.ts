import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export type ValidatorRuleSeverity = 'error' | 'warn' | 'info' | 'skip';
export type ValidatorRuleCategory = 'authored_template' | 'operational_runtime';

export interface ValidatorRule {
  readonly rule_id: string;
  readonly aliases: readonly string[];
  readonly script_path: string;
  readonly severity: ValidatorRuleSeverity;
  readonly category: ValidatorRuleCategory;
  readonly description: string;
  readonly strict_only?: boolean;
}

const THIS_DIR = path.dirname(fileURLToPath(import.meta.url));
const REGISTRY_PATH = path.join(THIS_DIR, 'validator-registry.json');

export function loadValidatorRegistry(registryPath = REGISTRY_PATH): ValidatorRule[] {
  const raw = fs.readFileSync(registryPath, 'utf8');
  const parsed = JSON.parse(raw) as ValidatorRule[];

  return parsed.map((rule) => ({
    ...rule,
    aliases: rule.aliases ?? [],
    strict_only: rule.strict_only === true,
  }));
}

export function normalizeRuleId(value: string): string {
  return value.trim().replace(/-/g, '_').toUpperCase();
}

export function findValidatorRule(value: string, registry = loadValidatorRegistry()): ValidatorRule | undefined {
  const normalized = normalizeRuleId(value);

  return registry.find((rule) => {
    if (rule.rule_id === normalized) {
      return true;
    }
    return rule.aliases.map(normalizeRuleId).includes(normalized);
  });
}
