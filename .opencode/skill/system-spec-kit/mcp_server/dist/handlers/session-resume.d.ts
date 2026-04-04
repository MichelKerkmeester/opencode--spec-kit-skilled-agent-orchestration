import type { MCPResponse } from '@spec-kit/shared/types';
interface SessionResumeArgs {
    specFolder?: string;
    minimal?: boolean;
}
/** Handle session_resume tool call — composite resume with memory + graph + cocoindex */
export declare function handleSessionResume(args: SessionResumeArgs): Promise<MCPResponse>;
export {};
//# sourceMappingURL=session-resume.d.ts.map