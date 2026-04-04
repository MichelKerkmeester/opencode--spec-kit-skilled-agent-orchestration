// ───────────────────────────────────────────────────────────────
// MODULE: Types
// ───────────────────────────────────────────────────────────────
import { buildMutationHookFeedback } from '../../hooks/mutation-feedback.js';
export function normalizeScopeMatchValue(value) {
    if (typeof value !== 'string')
        return null;
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
}
//# sourceMappingURL=types.js.map