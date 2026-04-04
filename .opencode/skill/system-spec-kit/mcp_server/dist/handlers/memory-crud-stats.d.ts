import type { MCPResponse } from './types.js';
import type { StatsArgs } from './memory-crud-types.js';
/** Handle memory_stats tool -- returns memory system statistics and folder rankings. */
declare function handleMemoryStats(args: StatsArgs | null): Promise<MCPResponse>;
export { handleMemoryStats };
//# sourceMappingURL=memory-crud-stats.d.ts.map