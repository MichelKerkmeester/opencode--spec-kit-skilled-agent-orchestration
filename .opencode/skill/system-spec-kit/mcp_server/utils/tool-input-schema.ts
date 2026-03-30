// ───────────────────────────────────────────────────────────────
// MODULE: Tool Input Schema
// ───────────────────────────────────────────────────────────────
import type { ToolDefinition } from '../tool-schemas.js';

interface JsonSchemaProperty {
  type?: string;
  enum?: unknown[];
  items?: JsonSchemaProperty;
  minimum?: number;
  maximum?: number;
  const?: unknown;
  minLength?: number;
  maxLength?: number;
  minItems?: number;
  maxItems?: number;
}

interface SchemaConstraint {
  required?: string[];
  properties?: Record<string, JsonSchemaProperty>;
  anyOf?: SchemaConstraint[];
  allOf?: SchemaConstraint[];
  oneOf?: SchemaConstraint[];
}

interface InputSchema extends SchemaConstraint {
  type?: string;
  additionalProperties?: boolean;
  'x-requiredAnyOf'?: string[][];
}

function hasValue(value: unknown): boolean {
  if (value === null || value === undefined) {
    return false;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return true;
}

function isNumericLike(value: unknown): boolean {
  if (typeof value === 'number') {
    return Number.isFinite(value);
  }
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 && Number.isFinite(Number(trimmed));
  }
  return false;
}

function validateType(field: string, value: unknown, expectedType: string): void {
  if (expectedType === 'string' && typeof value !== 'string') {
    throw new Error(`Invalid type for '${field}': expected string`);
  }

  if (expectedType === 'number' && !isNumericLike(value)) {
    throw new Error(`Invalid type for '${field}': expected number`);
  }

  if (expectedType === 'boolean' && typeof value !== 'boolean') {
    throw new Error(`Invalid type for '${field}': expected boolean`);
  }

  if (expectedType === 'array' && !Array.isArray(value)) {
    throw new Error(`Invalid type for '${field}': expected array`);
  }

  if (
    expectedType === 'object' &&
    (value === null || typeof value !== 'object' || Array.isArray(value))
  ) {
    throw new Error(`Invalid type for '${field}': expected object`);
  }
}

function validateProperty(field: string, value: unknown, schema: JsonSchemaProperty): void {
  if (schema.const !== undefined && value !== schema.const) {
    throw new Error(`Invalid value for '${field}': expected constant ${String(schema.const)}`);
  }

  if (Array.isArray(schema.enum) && !schema.enum.includes(value)) {
    throw new Error(`Invalid value for '${field}': must be one of ${schema.enum.join(', ')}`);
  }

  if (schema.type) {
    validateType(field, value, schema.type);
  }

  if (schema.type === 'array' && schema.items && Array.isArray(value)) {
    for (const item of value) {
      validateProperty(field, item, schema.items);
    }
  }

  if (schema.type === 'string' && typeof value === 'string') {
    if (schema.minLength !== undefined && value.length < schema.minLength) {
      throw new Error(`Invalid value for '${field}': length must be >= ${schema.minLength}`);
    }
    if (schema.maxLength !== undefined && value.length > schema.maxLength) {
      throw new Error(`Invalid value for '${field}': length must be <= ${schema.maxLength}`);
    }
  }

  if (schema.type === 'array' && Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) {
      throw new Error(`Invalid value for '${field}': must contain at least ${schema.minItems} item(s)`);
    }
    if (schema.maxItems !== undefined && value.length > schema.maxItems) {
      throw new Error(`Invalid value for '${field}': must contain at most ${schema.maxItems} item(s)`);
    }
  }

  if (
    schema.type === 'number' &&
    isNumericLike(value) &&
    (schema.minimum !== undefined || schema.maximum !== undefined)
  ) {
    const numericValue = typeof value === 'number' ? value : Number(value);
    if (schema.minimum !== undefined && numericValue < schema.minimum) {
      throw new Error(`Invalid value for '${field}': must be >= ${schema.minimum}`);
    }
    if (schema.maximum !== undefined && numericValue > schema.maximum) {
      throw new Error(`Invalid value for '${field}': must be <= ${schema.maximum}`);
    }
  }
}

function matchesSchemaConstraint(args: Record<string, unknown>, constraint: SchemaConstraint): boolean {
  const required = constraint.required ?? [];
  if (required.some((field) => !hasValue(args[field]))) {
    return false;
  }

  if (constraint.properties) {
    for (const [field, propertySchema] of Object.entries(constraint.properties)) {
      const value = args[field];
      if (!hasValue(value)) {
        continue;
      }
      try {
        validateProperty(field, value, propertySchema);
      } catch {
        return false;
      }
    }
  }

  if (Array.isArray(constraint.allOf) && constraint.allOf.length > 0) {
    if (!constraint.allOf.every((entry) => matchesSchemaConstraint(args, entry))) {
      return false;
    }
  }

  if (Array.isArray(constraint.anyOf) && constraint.anyOf.length > 0) {
    if (!constraint.anyOf.some((entry) => matchesSchemaConstraint(args, entry))) {
      return false;
    }
  }

  if (Array.isArray(constraint.oneOf) && constraint.oneOf.length > 0) {
    const matchedCount = constraint.oneOf.filter((entry) => matchesSchemaConstraint(args, entry)).length;
    if (matchedCount !== 1) {
      return false;
    }
  }

  return true;
}

/**
 * Validate tool arguments against the declared MCP input schema.
 *
 * Coverage is intentionally focused on compatibility-safe checks:
 * - required fields
 * - oneOf constraint variants
 * - basic types / enums / const / min / max for provided fields
 *
 * Unknown tools or missing schemas are skipped to preserve legacy behavior.
 */
export function validateToolInputSchema(
  toolName: string,
  args: Record<string, unknown>,
  toolDefinitions: ToolDefinition[]
): void {
  const toolDefinition = toolDefinitions.find((tool) => tool.name === toolName);
  if (!toolDefinition) {
    return;
  }

  const schema = toolDefinition.inputSchema as InputSchema;
  if (schema.type === 'object' && (args === null || typeof args !== 'object' || Array.isArray(args))) {
    throw new Error(`Invalid arguments for '${toolName}': expected object`);
  }

  const required = schema.required ?? [];
  const missing = required.filter((field) => !hasValue(args[field]));
  if (missing.length > 0) {
    throw new Error(`Missing required arguments for '${toolName}': ${missing.join(', ')}`);
  }

  if (Array.isArray(schema['x-requiredAnyOf']) && schema['x-requiredAnyOf'].length > 0) {
    const branchMatched = schema['x-requiredAnyOf'].some((fields) =>
      Array.isArray(fields) && fields.every((field) => hasValue(args[field]))
    );
    if (!branchMatched) {
      throw new Error(`Arguments for '${toolName}' do not satisfy required schema constraints`);
    }
  }

  if (!schema.properties) {
    if (!matchesSchemaConstraint(args, schema)) {
      throw new Error(`Arguments for '${toolName}' do not satisfy required schema constraints`);
    }
    return;
  }

  for (const [field, value] of Object.entries(args)) {
    if (schema.additionalProperties === false && !Object.prototype.hasOwnProperty.call(schema.properties, field)) {
      throw new Error(`Unknown argument for '${toolName}': ${field}`);
    }
    if (!hasValue(value)) {
      continue;
    }
    const propertySchema = schema.properties[field];
    if (!propertySchema) {
      continue;
    }
    validateProperty(field, value, propertySchema);
  }

  if (!matchesSchemaConstraint(args, schema)) {
    throw new Error(`Arguments for '${toolName}' do not satisfy required schema constraints`);
  }
}
