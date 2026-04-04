import type { MCPResponse } from './types.js';
interface TriggerArgs {
    prompt: string;
    specFolder?: string;
    limit?: number;
    session_id?: string;
    turnNumber?: number;
    include_cognitive?: boolean;
    tenantId?: string;
    userId?: string;
    agentId?: string;
    sharedSpaceId?: string;
}
/** Handle memory_match_triggers tool - matches prompt against trigger phrases with cognitive decay */
declare function handleMemoryMatchTriggers(args: TriggerArgs): Promise<MCPResponse>;
export { handleMemoryMatchTriggers, };
declare const handle_memory_match_triggers: typeof handleMemoryMatchTriggers;
export { handle_memory_match_triggers, };
//# sourceMappingURL=memory-triggers.d.ts.map