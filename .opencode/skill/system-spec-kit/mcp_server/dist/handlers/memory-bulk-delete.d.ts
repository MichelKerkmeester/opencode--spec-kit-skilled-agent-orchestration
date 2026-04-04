import type { MCPResponse } from './types.js';
interface BulkDeleteArgs {
    tier: string;
    specFolder?: string;
    confirm: boolean;
    olderThanDays?: number;
    skipCheckpoint?: boolean;
}
declare function handleMemoryBulkDelete(args: BulkDeleteArgs): Promise<MCPResponse>;
export { handleMemoryBulkDelete };
//# sourceMappingURL=memory-bulk-delete.d.ts.map