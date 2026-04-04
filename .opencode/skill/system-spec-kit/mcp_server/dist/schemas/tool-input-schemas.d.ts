import { z, ZodError, type ZodType } from 'zod';
type ToolInput = Record<string, unknown>;
type ToolInputSchema = ZodType<ToolInput>;
export declare const getSchema: <T extends z.ZodRawShape>(shape: T) => z.ZodObject<T>;
/** Shared max paths constant — used by both schema and handler. */
export declare const MAX_INGEST_PATHS = 50;
export declare const MEMORY_BULK_DELETE_MIN_OLDER_THAN_DAYS = 1;
export declare const memoryBulkDeleteSchema: z.ZodObject<{
    tier: z.ZodEnum<{
        constitutional: "constitutional";
        critical: "critical";
        important: "important";
        normal: "normal";
        temporary: "temporary";
        deprecated: "deprecated";
    }>;
    specFolder: z.ZodOptional<z.ZodString>;
    confirm: z.ZodLiteral<true>;
    olderThanDays: z.ZodOptional<z.ZodPipe<z.ZodPipe<z.ZodTransform<unknown, unknown>, z.ZodNumber>, z.ZodNumber>>;
    skipCheckpoint: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const TOOL_SCHEMAS: Record<string, ToolInputSchema>;
export declare class ToolSchemaValidationError extends Error {
    readonly toolName: string;
    readonly code = "E030";
    readonly details: Record<string, unknown>;
    constructor(toolName: string, message: string, details: Record<string, unknown>);
}
export declare function formatZodError(toolName: string, error: ZodError): ToolSchemaValidationError;
export declare function getToolSchema(toolName: string): ToolInputSchema | null;
export declare function validateToolArgs(toolName: string, rawInput: Record<string, unknown>): ToolInput;
export {};
//# sourceMappingURL=tool-input-schemas.d.ts.map