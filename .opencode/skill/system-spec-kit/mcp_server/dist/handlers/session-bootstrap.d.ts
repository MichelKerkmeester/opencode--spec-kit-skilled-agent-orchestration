import type { MCPResponse } from '@spec-kit/shared/types';
interface SessionBootstrapArgs {
    specFolder?: string;
}
/** Handle session_bootstrap tool call — one-call session setup */
export declare function handleSessionBootstrap(args: SessionBootstrapArgs): Promise<MCPResponse>;
export {};
//# sourceMappingURL=session-bootstrap.d.ts.map