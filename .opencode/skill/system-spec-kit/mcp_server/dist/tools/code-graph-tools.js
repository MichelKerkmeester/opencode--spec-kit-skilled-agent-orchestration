// ───────────────────────────────────────────────────────────────
// MODULE: Code Graph Tools
// ───────────────────────────────────────────────────────────────
// Dispatch for code graph MCP tools: scan, query, status, context.
import { handleCodeGraphScan, handleCodeGraphQuery, handleCodeGraphStatus, handleCodeGraphContext, handleCccStatus, handleCccReindex, handleCccFeedback, } from '../handlers/code-graph/index.js';
/** Tool names handled by this module */
export const TOOL_NAMES = new Set([
    'code_graph_scan',
    'code_graph_query',
    'code_graph_status',
    'code_graph_context',
    'ccc_status',
    'ccc_reindex',
    'ccc_feedback',
]);
/** Coerce handler response to MCPResponse (fix type literal narrowing) */
function toMCP(result) {
    return {
        content: result.content.map(c => ({ type: 'text', text: c.text })),
    };
}
function getMissingRequiredStringArgs(args, requiredKeys) {
    return requiredKeys.filter((key) => {
        const value = args[key];
        return typeof value !== 'string' || value.trim().length === 0;
    });
}
function validationError(tool, missingKeys) {
    return {
        content: [{
                type: 'text',
                text: JSON.stringify({
                    status: 'error',
                    error: `Missing required field${missingKeys.length === 1 ? '' : 's'}: ${missingKeys.join(', ')}`,
                    tool,
                }),
            }],
    };
}
/** Dispatch a tool call. Returns null if tool name not handled. */
export async function handleTool(name, args) {
    switch (name) {
        case 'code_graph_scan':
            return toMCP(await handleCodeGraphScan(args));
        case 'code_graph_query': {
            const missingKeys = getMissingRequiredStringArgs(args, ['operation', 'subject']);
            if (missingKeys.length > 0) {
                return validationError(name, missingKeys);
            }
            return toMCP(await handleCodeGraphQuery(args));
        }
        case 'code_graph_status':
            return toMCP(await handleCodeGraphStatus());
        case 'code_graph_context':
            return toMCP(await handleCodeGraphContext(args));
        case 'ccc_status':
            return toMCP(await handleCccStatus());
        case 'ccc_reindex':
            return toMCP(await handleCccReindex(args));
        case 'ccc_feedback': {
            const missingKeys = getMissingRequiredStringArgs(args, ['query', 'rating']);
            if (missingKeys.length > 0) {
                return validationError(name, missingKeys);
            }
            return toMCP(await handleCccFeedback(args));
        }
        default:
            return null;
    }
}
//# sourceMappingURL=code-graph-tools.js.map