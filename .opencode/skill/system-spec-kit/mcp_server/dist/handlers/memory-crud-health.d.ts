import type { MCPResponse } from './types.js';
import type { HealthArgs } from './memory-crud-types.js';
/** Handle memory_health tool -- returns system health status and diagnostics. */
declare function handleMemoryHealth(args: HealthArgs): Promise<MCPResponse>;
export { handleMemoryHealth };
//# sourceMappingURL=memory-crud-health.d.ts.map