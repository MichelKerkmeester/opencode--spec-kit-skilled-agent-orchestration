"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Source Capabilities
// ───────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSourceCapabilities = getSourceCapabilities;
const SOURCE_CAPABILITIES = {
    file: {
        source: 'file',
        inputMode: 'structured',
        toolTitleWithPathExpected: false,
        prefersStructuredSave: true,
    },
    'opencode-capture': {
        source: 'opencode-capture',
        inputMode: 'captured',
        toolTitleWithPathExpected: false,
        prefersStructuredSave: true,
    },
    'claude-code-capture': {
        source: 'claude-code-capture',
        inputMode: 'captured',
        toolTitleWithPathExpected: true,
        prefersStructuredSave: true,
    },
    'codex-cli-capture': {
        source: 'codex-cli-capture',
        inputMode: 'captured',
        toolTitleWithPathExpected: false,
        prefersStructuredSave: true,
    },
    'copilot-cli-capture': {
        source: 'copilot-cli-capture',
        inputMode: 'captured',
        toolTitleWithPathExpected: true,
        prefersStructuredSave: true, // NOTE: aspirational — most sources still rely on runtime capture. See O4-12.
    },
    'gemini-cli-capture': {
        source: 'gemini-cli-capture',
        inputMode: 'captured',
        toolTitleWithPathExpected: false,
        prefersStructuredSave: true,
    },
    simulation: {
        source: 'simulation',
        inputMode: 'structured',
        toolTitleWithPathExpected: false,
        prefersStructuredSave: false,
    },
};
function isKnownDataSource(source) {
    return source in SOURCE_CAPABILITIES;
}
function getSourceCapabilities(source) {
    if (!source) {
        return SOURCE_CAPABILITIES.file;
    }
    if (typeof source === 'string' && isKnownDataSource(source)) {
        return SOURCE_CAPABILITIES[source];
    }
    if (typeof source === 'string') {
        return SOURCE_CAPABILITIES.file;
    }
    return SOURCE_CAPABILITIES[source];
}
//# sourceMappingURL=source-capabilities.js.map