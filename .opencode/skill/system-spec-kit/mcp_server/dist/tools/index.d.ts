import * as contextTools from './context-tools.js';
import * as memoryTools from './memory-tools.js';
import * as causalTools from './causal-tools.js';
import * as checkpointTools from './checkpoint-tools.js';
import * as lifecycleTools from './lifecycle-tools.js';
import * as codeGraphTools from './code-graph-tools.js';
export { contextTools, memoryTools, causalTools, checkpointTools, lifecycleTools, codeGraphTools };
export type { MCPResponse } from './types.js';
/** All tool dispatch modules in priority order */
export declare const ALL_DISPATCHERS: readonly [typeof contextTools, typeof memoryTools, typeof causalTools, typeof checkpointTools, typeof lifecycleTools, typeof codeGraphTools];
/** Dispatch a tool call to the appropriate module. Returns null if unrecognized. */
export declare function dispatchTool(name: string, args: Record<string, unknown>): Promise<import('./types.js').MCPResponse | null>;
//# sourceMappingURL=index.d.ts.map