// ---------------------------------------------------------------
// MODULE: V-Rule Bridge
// ---------------------------------------------------------------
// O2-5/O2-12: Runtime bridge to scripts/memory/validate-memory-quality
// Uses compiled JS output to avoid cross-project TypeScript rootDir issues.
// Falls back gracefully if the module is not available.
import path from 'path';
import { createRequire } from 'module';
// ───────────────────────────────────────────────────────────────
// 2. MODULE LOADING
// ───────────────────────────────────────────────────────────────
let _validateMemoryQualityContent = null;
let _determineValidationDisposition = null;
let _loadAttempted = false;
const runtimeRequire = createRequire(import.meta.filename);
function loadModule() {
    if (_loadAttempted)
        return;
    _loadAttempted = true;
    try {
        const candidatePaths = [
            path.resolve(import.meta.dirname, '../../scripts/dist/memory/validate-memory-quality.js'),
            path.resolve(import.meta.dirname, '../../../scripts/dist/memory/validate-memory-quality.js'),
        ];
        let lastError;
        for (const distPath of candidatePaths) {
            try {
                const mod = runtimeRequire(distPath);
                _validateMemoryQualityContent = mod.validateMemoryQualityContent;
                _determineValidationDisposition = mod.determineValidationDisposition;
                return;
            }
            catch (error) {
                lastError = error;
            }
        }
        throw lastError instanceof Error ? lastError : new Error(String(lastError));
    }
    catch (error) {
        const msg = error instanceof Error ? error.message : String(error);
        console.error(`[v-rule-bridge] Failed to load validate-memory-quality: ${msg} — V-rule checks unavailable`);
    }
}
// ───────────────────────────────────────────────────────────────
// 3. EXPORTS
// ───────────────────────────────────────────────────────────────
export function validateMemoryQualityContent(content, options) {
    loadModule();
    if (!_validateMemoryQualityContent) {
        console.warn('[v-rule-bridge] validateMemoryQualityContent called but module not loaded — V-rule validation unavailable');
        return {
            passed: false,
            status: 'error',
            message: 'V-rule validation unavailable — run npm run build --workspace=@spec-kit/scripts',
            _unavailable: true,
        };
    }
    return _validateMemoryQualityContent(content, options);
}
/** Check whether the V-rule validator module is loaded and operational. */
export function isVRuleBridgeAvailable() {
    loadModule();
    return _validateMemoryQualityContent !== null;
}
export function determineValidationDisposition(failedRules, source) {
    loadModule();
    if (!_determineValidationDisposition)
        return null;
    return _determineValidationDisposition(failedRules, source);
}
//# sourceMappingURL=v-rule-bridge.js.map