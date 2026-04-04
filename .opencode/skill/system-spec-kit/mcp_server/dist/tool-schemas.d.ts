/**
 * Re-export schema validation helpers used by the MCP tool entry points.
 */
export { ToolSchemaValidationError, formatZodError, getToolSchema, validateToolArgs, getSchema, } from './schemas/tool-input-schemas.js';
/**
 * Normalized definition for a single MCP tool and its JSON schema.
 */
export interface ToolDefinition {
    name: string;
    description: string;
    inputSchema: Record<string, unknown>;
    outputSchema?: Record<string, unknown>;
}
/**
 * Canonical ordered list of MCP tool registrations exposed by this server.
 */
export declare const TOOL_DEFINITIONS: ToolDefinition[];
//# sourceMappingURL=tool-schemas.d.ts.map