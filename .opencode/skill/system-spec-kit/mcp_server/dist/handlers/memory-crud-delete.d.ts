import type { MCPResponse } from './types.js';
import type { DeleteArgs } from './memory-crud-types.js';
/** Handle memory_delete tool -- deletes a single memory by ID or bulk-deletes by spec folder. */
declare function handleMemoryDelete(args: DeleteArgs): Promise<MCPResponse>;
export { handleMemoryDelete };
//# sourceMappingURL=memory-crud-delete.d.ts.map