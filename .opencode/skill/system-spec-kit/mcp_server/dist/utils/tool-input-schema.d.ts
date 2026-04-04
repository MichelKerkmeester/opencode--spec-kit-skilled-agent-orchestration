import type { ToolDefinition } from '../tool-schemas.js';
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
export declare function validateToolInputSchema(toolName: string, args: Record<string, unknown>, toolDefinitions: ToolDefinition[]): void;
//# sourceMappingURL=tool-input-schema.d.ts.map