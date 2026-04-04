/** Narrow pre-validated MCP tool args to a specific handler arg type.
 *  Centralises the single protocol-boundary cast so call sites stay clean. */
export function parseArgs(args) {
    // Guard against null/undefined/non-object
    // At the protocol boundary before casting.
    if (args == null || typeof args !== 'object') {
        return {};
    }
    return args;
}
//# sourceMappingURL=types.js.map