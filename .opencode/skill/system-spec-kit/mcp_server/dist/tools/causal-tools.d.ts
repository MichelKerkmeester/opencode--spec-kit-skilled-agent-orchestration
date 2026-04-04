import type { MCPResponse } from './types.js';
/** Tool names handled by this module */
export declare const TOOL_NAMES: Set<string>;
/** Dispatch a tool call. Returns null if tool name not handled. */
export declare function handleTool(name: string, args: Record<string, unknown>): Promise<MCPResponse | null>;
//# sourceMappingURL=causal-tools.d.ts.map