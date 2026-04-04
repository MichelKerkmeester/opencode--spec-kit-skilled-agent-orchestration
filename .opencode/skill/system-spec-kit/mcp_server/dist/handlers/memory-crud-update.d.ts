import type { MCPResponse } from './types.js';
import type { UpdateArgs } from './memory-crud-types.js';
/** Handle memory_update tool -- updates metadata fields and optionally regenerates embeddings. */
declare function handleMemoryUpdate(args: UpdateArgs): Promise<MCPResponse>;
export { handleMemoryUpdate };
//# sourceMappingURL=memory-crud-update.d.ts.map