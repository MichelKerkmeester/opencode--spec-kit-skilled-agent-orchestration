// ───────────────────────────────────────────────────────────────
// MODULE: Session Transition
// ───────────────────────────────────────────────────────────────
// Feature catalog: Tool-result extraction to working memory
export const SESSION_TRANSITION_SIGNAL_ORDER = [
    'session-resume',
    'pressure-override',
    'explicit-mode',
    'query-heuristic',
    'intent-classifier',
];
function uniqueOrderedSignals(signals) {
    const ordered = new Set();
    for (const signal of SESSION_TRANSITION_SIGNAL_ORDER) {
        if (signals.includes(signal)) {
            ordered.add(signal);
        }
    }
    return Array.from(ordered);
}
function buildReason(primarySignal, effectiveMode) {
    switch (primarySignal) {
        case 'session-resume':
            return `resumed session inferred ${effectiveMode} mode`;
        case 'pressure-override':
            return `pressure override selected ${effectiveMode} mode`;
        case 'explicit-mode':
            return `explicit mode request selected ${effectiveMode} mode`;
        case 'query-heuristic':
            return `query heuristic selected ${effectiveMode} mode`;
        case 'intent-classifier':
            return `intent classifier selected ${effectiveMode} mode`;
        default:
            return null;
    }
}
export function buildSessionTransitionTrace(args) {
    const activeSignals = [];
    let confidence = 0.55;
    const promoteConfidence = (candidate) => {
        confidence = Math.max(confidence, candidate);
    };
    if (args.resumedSession) {
        activeSignals.push('session-resume');
        promoteConfidence(0.95);
    }
    if (args.pressureOverrideApplied) {
        activeSignals.push('pressure-override');
        promoteConfidence(0.9);
    }
    if (args.requestedMode !== 'auto') {
        activeSignals.push('explicit-mode');
        promoteConfidence(1);
    }
    if (args.queryHeuristicApplied) {
        activeSignals.push('query-heuristic');
        promoteConfidence(0.7);
    }
    if (args.detectedIntent) {
        activeSignals.push('intent-classifier');
        if (!args.resumedSession && !args.pressureOverrideApplied && args.requestedMode === 'auto' && !args.queryHeuristicApplied) {
            promoteConfidence(0.85);
        }
    }
    const signalSources = uniqueOrderedSignals(activeSignals);
    return {
        previousState: args.previousState,
        currentState: args.effectiveMode,
        confidence,
        signalSources,
        reason: buildReason(signalSources[0], args.effectiveMode),
    };
}
export function readSessionTransitionTrace(value) {
    if (!value || typeof value !== 'object') {
        return null;
    }
    const candidate = value;
    const previousState = candidate.previousState;
    const currentState = candidate.currentState;
    const confidence = candidate.confidence;
    const signalSources = candidate.signalSources;
    const reason = candidate.reason;
    if (previousState !== null && typeof previousState !== 'string'
        || currentState !== null && typeof currentState !== 'string'
        || typeof confidence !== 'number'
        || !Number.isFinite(confidence)
        || !Array.isArray(signalSources)
        || signalSources.some((signal) => !SESSION_TRANSITION_SIGNAL_ORDER.includes(signal))
        || reason !== undefined && reason !== null && typeof reason !== 'string') {
        return null;
    }
    return {
        previousState,
        currentState,
        confidence: Math.max(0, Math.min(1, confidence)),
        signalSources: uniqueOrderedSignals(signalSources),
        reason: typeof reason === 'string' && reason.length > 0 ? reason : null,
    };
}
export function attachSessionTransitionTrace(response, sessionTransition) {
    if (!sessionTransition) {
        return response;
    }
    const firstEntry = response?.content?.[0];
    if (!firstEntry || typeof firstEntry.text !== 'string') {
        return response;
    }
    try {
        const envelope = JSON.parse(firstEntry.text);
        const data = envelope.data && typeof envelope.data === 'object'
            ? envelope.data
            : null;
        const results = Array.isArray(data?.results)
            ? data.results
            : null;
        if (!results) {
            return response;
        }
        data.results = results.map((result) => {
            const currentTrace = result.trace && typeof result.trace === 'object'
                ? result.trace
                : {};
            return {
                ...result,
                trace: {
                    ...currentTrace,
                    sessionTransition,
                },
            };
        });
        return {
            ...response,
            content: [{ ...firstEntry, text: JSON.stringify(envelope, null, 2) }],
        };
    }
    catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.warn(`[session-transition] Failed to attach session transition trace: ${message}`);
        return response;
    }
}
//# sourceMappingURL=session-transition.js.map