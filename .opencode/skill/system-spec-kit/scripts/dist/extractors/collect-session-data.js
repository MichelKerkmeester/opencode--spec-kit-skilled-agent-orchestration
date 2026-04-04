"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Collect Session Data
// ───────────────────────────────────────────────────────────────
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.collectSessionData = collectSessionData;
exports.shouldAutoSave = shouldAutoSave;
exports.extractPreflightPostflightData = extractPreflightPostflightData;
exports.calculateLearningIndex = calculateLearningIndex;
exports.getScoreAssessment = getScoreAssessment;
exports.getTrendIndicator = getTrendIndicator;
exports.generateLearningSummary = generateLearningSummary;
exports.buildContinueSessionData = buildContinueSessionData;
exports.determineSessionStatus = determineSessionStatus;
exports.estimateCompletionPercent = estimateCompletionPercent;
exports.extractPendingTasks = extractPendingTasks;
exports.generateContextSummary = generateContextSummary;
exports.generateResumeContext = generateResumeContext;
// ───────────────────────────────────────────────────────────────
// 1. COLLECT SESSION DATA
// ───────────────────────────────────────────────────────────────
// Orchestrates session data collection — gathers observations, files, decisions, and context
// Node stdlib
const path = __importStar(require("path"));
const fsSync = __importStar(require("fs"));
// Internal modules
const config_1 = require("../config");
const message_utils_1 = require("../utils/message-utils");
const slug_utils_1 = require("../utils/slug-utils");
const logger_1 = require("../utils/logger");
const fact_coercion_1 = require("../utils/fact-coercion");
const spec_folder_1 = require("../spec-folder");
const session_extractor_1 = require("./session-extractor");
const file_extractor_1 = require("./file-extractor");
const implementation_guide_extractor_1 = require("./implementation-guide-extractor");
/* ───────────────────────────────────────────────────────────────
   2. PREFLIGHT/POSTFLIGHT UTILITIES
------------------------------------------------------------------*/
function getScoreAssessment(score, metric) {
    if (score === null || score === undefined || isNaN(score)) {
        return '';
    }
    if (metric === 'uncertainty') {
        if (score <= 20)
            return 'Very low uncertainty';
        if (score <= 40)
            return 'Low uncertainty';
        if (score <= 60)
            return 'Moderate uncertainty';
        if (score <= 80)
            return 'High uncertainty';
        return 'Very high uncertainty';
    }
    if (score >= 80)
        return 'Strong';
    if (score >= 60)
        return 'Good';
    if (score >= 40)
        return 'Moderate';
    if (score >= 20)
        return 'Limited';
    return 'Minimal';
}
function getTrendIndicator(delta, invertedBetter = false) {
    if (delta === null || delta === undefined || isNaN(delta)) {
        return '\u2192';
    }
    if (invertedBetter) {
        if (delta > 0)
            return '\u2193';
        if (delta < 0)
            return '\u2191';
        return '\u2192';
    }
    if (delta > 0)
        return '\u2191';
    if (delta < 0)
        return '\u2193';
    return '\u2192';
}
function calculateLearningIndex(deltaKnow, deltaUncert, deltaContext) {
    const dk = deltaKnow ?? 0;
    const du = deltaUncert ?? 0;
    const dc = deltaContext ?? 0;
    const index = (dk * config_1.CONFIG.LEARNING_WEIGHTS.knowledge) +
        (du * config_1.CONFIG.LEARNING_WEIGHTS.uncertainty) +
        (dc * config_1.CONFIG.LEARNING_WEIGHTS.context);
    return Math.round(Math.max(0, Math.min(100, index)));
}
function extractPreflightPostflightData(collectedData) {
    const preflight = collectedData?.preflight;
    const postflight = collectedData?.postflight;
    const hasPreflightBaseline = Boolean(preflight && (typeof preflight.knowledgeScore === 'number' ||
        typeof preflight.uncertaintyScore === 'number' ||
        typeof preflight.contextScore === 'number' ||
        typeof preflight.timestamp === 'string' ||
        (preflight.gaps?.length ?? 0) > 0 ||
        typeof preflight.confidence === 'number' ||
        typeof preflight.uncertaintyRaw === 'number' ||
        typeof preflight.readiness === 'string'));
    const hasPostflightDelta = Boolean(preflight && postflight &&
        Number.isFinite(preflight.knowledgeScore) &&
        Number.isFinite(postflight.knowledgeScore) &&
        Number.isFinite(preflight.uncertaintyScore) &&
        Number.isFinite(postflight.uncertaintyScore) &&
        Number.isFinite(preflight.contextScore) &&
        Number.isFinite(postflight.contextScore));
    const DEFAULT_VALUE = null;
    // F-35: Guard against NaN/Infinity — replace with null
    const safeNum = (v) => v !== undefined && v !== null && Number.isFinite(v) ? v : null;
    const preflightData = {
        PREFLIGHT_KNOW_SCORE: safeNum(preflight?.knowledgeScore),
        PREFLIGHT_UNCERTAINTY_SCORE: safeNum(preflight?.uncertaintyScore),
        PREFLIGHT_CONTEXT_SCORE: safeNum(preflight?.contextScore),
        PREFLIGHT_KNOW_ASSESSMENT: getScoreAssessment(preflight?.knowledgeScore, 'knowledge'),
        PREFLIGHT_UNCERTAINTY_ASSESSMENT: getScoreAssessment(preflight?.uncertaintyScore, 'uncertainty'),
        PREFLIGHT_CONTEXT_ASSESSMENT: getScoreAssessment(preflight?.contextScore, 'context'),
        PREFLIGHT_TIMESTAMP: preflight?.timestamp ?? DEFAULT_VALUE,
        PREFLIGHT_GAPS: preflight?.gaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
        PREFLIGHT_CONFIDENCE: safeNum(preflight?.confidence),
        PREFLIGHT_UNCERTAINTY_RAW: safeNum(preflight?.uncertaintyRaw ?? preflight?.uncertaintyScore),
        PREFLIGHT_READINESS: preflight?.readiness ?? DEFAULT_VALUE
    };
    const postflightData = {
        POSTFLIGHT_KNOW_SCORE: safeNum(postflight?.knowledgeScore),
        POSTFLIGHT_UNCERTAINTY_SCORE: safeNum(postflight?.uncertaintyScore),
        POSTFLIGHT_CONTEXT_SCORE: safeNum(postflight?.contextScore)
    };
    let deltaData = {
        DELTA_KNOW_SCORE: DEFAULT_VALUE,
        DELTA_UNCERTAINTY_SCORE: DEFAULT_VALUE,
        DELTA_CONTEXT_SCORE: DEFAULT_VALUE,
        DELTA_KNOW_TREND: '\u2192',
        DELTA_UNCERTAINTY_TREND: '\u2192',
        DELTA_CONTEXT_TREND: '\u2192',
        LEARNING_INDEX: DEFAULT_VALUE,
        LEARNING_SUMMARY: 'Learning metrics will be calculated when both preflight and postflight data are provided.'
    };
    if (hasPostflightDelta) {
        const deltaKnow = (postflight?.knowledgeScore ?? 0) - (preflight?.knowledgeScore ?? 0);
        const deltaUncert = (preflight?.uncertaintyScore ?? 0) - (postflight?.uncertaintyScore ?? 0);
        const deltaContext = (postflight?.contextScore ?? 0) - (preflight?.contextScore ?? 0);
        const learningIndex = calculateLearningIndex(deltaKnow, deltaUncert, deltaContext);
        const formatDelta = (d) => d >= 0 ? `+${d}` : `${d}`;
        deltaData = {
            DELTA_KNOW_SCORE: formatDelta(deltaKnow),
            DELTA_UNCERTAINTY_SCORE: formatDelta(deltaUncert),
            DELTA_CONTEXT_SCORE: formatDelta(deltaContext),
            DELTA_KNOW_TREND: getTrendIndicator(deltaKnow, false),
            DELTA_UNCERTAINTY_TREND: getTrendIndicator(deltaUncert, true),
            DELTA_CONTEXT_TREND: getTrendIndicator(deltaContext, false),
            LEARNING_INDEX: learningIndex,
            LEARNING_SUMMARY: generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex)
        };
    }
    const gapsData = {
        GAPS_CLOSED: postflight?.gapsClosed?.map((g) => ({ GAP_DESCRIPTION: g })) ?? [],
        NEW_GAPS: postflight?.newGaps?.map((g) => ({ GAP_DESCRIPTION: g })) ?? []
    };
    return {
        HAS_PREFLIGHT_BASELINE: hasPreflightBaseline,
        HAS_POSTFLIGHT_DELTA: hasPostflightDelta,
        ...preflightData,
        ...postflightData,
        ...deltaData,
        ...gapsData
    };
}
function generateLearningSummary(deltaKnow, deltaUncert, deltaContext, learningIndex) {
    const parts = [];
    if (deltaKnow > 20) {
        parts.push(`Significant knowledge gain (+${deltaKnow} points)`);
    }
    else if (deltaKnow > 10) {
        parts.push(`Moderate knowledge improvement (+${deltaKnow} points)`);
    }
    else if (deltaKnow > 0) {
        parts.push(`Slight knowledge increase (+${deltaKnow} points)`);
    }
    else if (deltaKnow < -10) {
        parts.push(`Knowledge score decreased (${deltaKnow} points) - may indicate scope expansion`);
    }
    if (deltaUncert > 20) {
        parts.push(`Major uncertainty reduction (-${deltaUncert} points)`);
    }
    else if (deltaUncert > 10) {
        parts.push(`Good uncertainty reduction (-${deltaUncert} points)`);
    }
    else if (deltaUncert < -10) {
        parts.push(`Uncertainty increased (+${Math.abs(deltaUncert)} points) - new unknowns discovered`);
    }
    if (deltaContext > 15) {
        parts.push(`Substantial context enrichment (+${deltaContext} points)`);
    }
    else if (deltaContext > 5) {
        parts.push(`Context improved (+${deltaContext} points)`);
    }
    if (parts.length === 0) {
        if (learningIndex >= 25) {
            return 'Productive session with balanced learning across metrics.';
        }
        else if (learningIndex >= 10) {
            return 'Moderate learning session - incremental progress made.';
        }
        else {
            return 'Low learning delta - session may have focused on execution rather than exploration.';
        }
    }
    let summary = parts.join('. ') + '.';
    if (learningIndex >= 40) {
        summary += ' Overall: Highly productive learning session.';
    }
    else if (learningIndex >= 25) {
        summary += ' Overall: Good learning session with meaningful progress.';
    }
    else if (learningIndex >= 10) {
        summary += ' Overall: Moderate learning session.';
    }
    return summary;
}
/* ───────────────────────────────────────────────────────────────
   3. CONTINUE SESSION DATA
------------------------------------------------------------------*/
function isCompletedNextStep(step) {
    const text = typeof step === 'string'
        ? step
        : (typeof step === 'object' && step !== null && 'text' in step)
            ? String(step.text)
            : JSON.stringify(step);
    return /^\s*\[x\]/i.test(text) || /^\s*[✓✔]/i.test(text) || /^\s*~~/.test(text);
}
function determineSessionStatus(blockers, observations, messageCount, collectedData) {
    const completionKeywords = /\b(?:done|complete[d]?|finish(?:ed)?|success(?:ful(?:ly)?)?)\b/i;
    const resolutionKeywords = /\b(?:resolved|fixed|unblocked|works?\s+now|workaround)\b/i;
    const pendingWorkKeywords = /\b(?:todo|remaining|pending|left to do|follow-?up|next(?:\s+step|\s+action)?|need(?:s)? to|still need(?:s)?|still pending)\b/i;
    const observationTexts = observations
        .map((obs) => `${obs.title || ''} ${obs.narrative || ''}`.trim())
        .filter(Boolean);
    // CG-03: Detect completion from explicit JSON-mode data
    // O5-3: Access fields directly via CollectedDataBase instead of Record casts
    if (collectedData) {
        const hasSessionSummary = !!collectedData.sessionSummary;
        const hasKeyDecisions = Array.isArray(collectedData.keyDecisions) &&
            collectedData.keyDecisions.length > 0;
        // Fix 2: Also check observations for "Next Steps" title (normalizer may consume the field)
        const hasNextSteps = !!collectedData.nextSteps
            || observations.some(obs => /^next\s*steps?\b/i.test(obs.title || ''));
        const isFileSource = collectedData._source === 'file';
        const unresolvedNextSteps = Array.isArray(collectedData.nextSteps)
            ? collectedData.nextSteps.filter(step => !isCompletedNextStep(step))
            : [];
        const hasUnresolvedNextSteps = unresolvedNextSteps.length > 0
            || ((!Array.isArray(collectedData.nextSteps) || collectedData.nextSteps.length === 0)
                && observations.some(obs => /^next\s*steps?\b/i.test(obs.title || '')));
        // If explicit JSON data has summary + decisions + next steps, session is complete
        // But if there are pending nextSteps, downgrade to partial (IN_PROGRESS)
        if (isFileSource && hasSessionSummary && (hasKeyDecisions || hasNextSteps)) {
            if (hasUnresolvedNextSteps) {
                return 'IN_PROGRESS';
            }
            return 'COMPLETED';
        }
    }
    if (blockers && blockers !== 'None') {
        // O5-13: Scope F-25 resolution to observations AFTER the blocker was detected
        const blockerKeywordsLocal = /\b(?:blocked|stuck|can't proceed|cannot proceed|waiting on|depends on|broken|fails?)\b/i;
        const blockerIdx = observations.findIndex((obs) => {
            const text = `${obs.title || ''} ${obs.narrative || ''}`;
            return blockerKeywordsLocal.test(text);
        });
        if (blockerIdx >= 0) {
            const laterObs = observations.slice(blockerIdx + 1);
            const blockerResolved = laterObs.some((obs) => {
                const text = `${obs.title || ''} ${obs.narrative || ''}`;
                return resolutionKeywords.test(text);
            });
            if (!blockerResolved) {
                return 'BLOCKED';
            }
            // Blocker was resolved by a later observation — fall through to check completion
        }
        else {
            // Blocker string was set but no matching observation found in narratives;
            // check ALL observations for resolution (blocker came from summary/external source)
            const blockerResolved = observations.some((obs) => {
                const text = `${obs.title || ''} ${obs.narrative || ''}`;
                return resolutionKeywords.test(text);
            });
            if (!blockerResolved) {
                return 'BLOCKED';
            }
        }
    }
    if (observationTexts.some((text) => completionKeywords.test(text))) {
        return 'COMPLETED';
    }
    const toolCallCount = Array.isArray(collectedData?.toolCalls)
        ? collectedData.toolCalls.length
        : (collectedData?._toolCallCount ?? 0);
    const exchangeCount = Array.isArray(collectedData?.exchanges)
        ? collectedData.exchanges.length
        : 0;
    const nextStepsText = Array.isArray(collectedData?.nextSteps)
        ? collectedData.nextSteps.map((step) => JSON.stringify(step)).join(' ')
        : '';
    const summaryText = collectedData?.sessionSummary || '';
    const pendingObservationTexts = (Array.isArray(collectedData?.nextSteps) && collectedData.nextSteps.length > 0
        ? observations
            .filter((obs) => !/^next\s*steps?\b/i.test(obs.title || ''))
            .map((obs) => `${obs.title || ''} ${obs.narrative || ''}`.trim())
            .filter(Boolean)
        : observationTexts);
    const combinedActivityCount = messageCount + toolCallCount + exchangeCount + observations.length;
    const highActivity = (toolCallCount >= 6 ||
        (messageCount >= 3 && toolCallCount >= 3) ||
        (messageCount >= 5 && (toolCallCount >= 2 || exchangeCount >= 2 || observations.length >= 4)) ||
        (combinedActivityCount >= 10 && (toolCallCount > 0 || exchangeCount > 0)));
    const hasPendingWorkIndicators = [summaryText, nextStepsText, ...pendingObservationTexts]
        .some((text) => pendingWorkKeywords.test(text));
    const hasNoBlockers = !blockers || blockers === 'None';
    if (hasNoBlockers && highActivity && !hasPendingWorkIndicators) {
        return 'COMPLETED';
    }
    if (messageCount < 3) {
        return 'IN_PROGRESS';
    }
    return 'IN_PROGRESS';
}
function estimateCompletionPercent(observations, messageCount, toolCounts, sessionStatus, collectedData) {
    if (sessionStatus === 'COMPLETED')
        return 100;
    if (sessionStatus === 'BLOCKED')
        return Math.min(90, messageCount * 5);
    // CG-03: JSON-mode explicit data with sessionSummary → high completion
    // O5-3: Access fields directly via CollectedDataBase instead of Record casts
    if (collectedData) {
        const hasSessionSummary = !!collectedData.sessionSummary;
        const isFileSource = collectedData._source === 'file';
        if (isFileSource && hasSessionSummary) {
            return 95;
        }
    }
    const totalTools = Object.values(toolCounts).reduce((a, b) => a + b, 0);
    const writeTools = (toolCounts.Write || 0) + (toolCounts.Edit || 0);
    let basePercent = 0;
    basePercent += Math.min(50, messageCount * 5);
    if (totalTools > 0) {
        basePercent += Math.min(30, (writeTools / totalTools) * 40);
    }
    basePercent += Math.min(20, observations.length * 3);
    return Math.min(95, Math.round(basePercent));
}
function extractPendingTasks(observations, recentContext, nextAction) {
    const tasks = [];
    const taskPatterns = [
        /\b(?:todo|task|need(?:s)? to|should|must|next):\s*(.+?)(?:[.!?\n]|$)/gi,
        /\[\s*\]\s*(.+?)(?:\n|$)/g,
        /\b(?:remaining|pending|left to do):\s*(.+?)(?:[.!?\n]|$)/gi
    ];
    let taskId = 1;
    const seen = new Set();
    for (const obs of observations) {
        const text = `${obs.title || ''} ${obs.narrative || ''}`;
        for (const pattern of taskPatterns) {
            let match;
            pattern.lastIndex = 0;
            while ((match = pattern.exec(text)) !== null) {
                const taskDesc = match[1].trim().substring(0, 100);
                if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
                    seen.add(taskDesc.toLowerCase());
                    tasks.push({
                        TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
                        TASK_DESCRIPTION: taskDesc,
                        TASK_PRIORITY: 'P1'
                    });
                }
            }
        }
        if (obs.facts) {
            const factTexts = (0, fact_coercion_1.coerceFactsToText)(obs.facts, {
                component: 'collect-session-data',
                fieldPath: 'observations[].facts',
            });
            for (const factText of factTexts) {
                for (const pattern of taskPatterns) {
                    let match;
                    pattern.lastIndex = 0;
                    while ((match = pattern.exec(factText)) !== null) {
                        const taskDesc = match[1].trim().substring(0, 100);
                        if (taskDesc.length > 10 && !seen.has(taskDesc.toLowerCase())) {
                            seen.add(taskDesc.toLowerCase());
                            tasks.push({
                                TASK_ID: `T${String(taskId++).padStart(3, '0')}`,
                                TASK_DESCRIPTION: taskDesc,
                                TASK_PRIORITY: 'P2'
                            });
                        }
                    }
                }
            }
        }
    }
    if (nextAction &&
        nextAction !== 'Continue implementation' &&
        !seen.has(nextAction.toLowerCase())) {
        tasks.unshift({
            TASK_ID: 'T000',
            TASK_DESCRIPTION: nextAction,
            TASK_PRIORITY: 'P0'
        });
    }
    return tasks.slice(0, 10);
}
function generateContextSummary(summary, observations, projectPhase, decisionCount) {
    const parts = [];
    parts.push(`**Phase:** ${projectPhase}`);
    if (observations.length > 0) {
        const recentTitles = observations
            .slice(-3)
            .map((o) => o.title)
            .filter((t) => !!t && t.length > 5)
            .join(', ');
        if (recentTitles) {
            parts.push(`**Recent:** ${recentTitles}`);
        }
    }
    if (decisionCount > 0) {
        parts.push(`**Decisions:** ${decisionCount} decision${decisionCount > 1 ? 's' : ''} recorded`);
    }
    return parts.join('\n\n');
}
function generateResumeContext(files, specFiles, observations) {
    const items = [];
    if (files.length > 0) {
        const fileList = files.slice(0, 3).map((f) => f.FILE_PATH).join(', ');
        items.push({ CONTEXT_ITEM: `Files modified: ${fileList}` });
    }
    const priorityDocs = ['tasks.md', 'checklist.md', 'plan.md'];
    const relevantDocs = specFiles.filter((sf) => priorityDocs.includes(sf.FILE_NAME));
    if (relevantDocs.length > 0) {
        items.push({ CONTEXT_ITEM: `Check: ${relevantDocs.map((d) => d.FILE_NAME).join(', ')}` });
    }
    const lastMeaningful = [...observations].reverse().find((o) => o.narrative && o.narrative.length > 50);
    if (lastMeaningful) {
        const lastText = (lastMeaningful.title || lastMeaningful.narrative || '').substring(0, 80);
        const lastTruncated = lastText.length >= 80
            ? (lastText.lastIndexOf(' ', 77) > 30 ? lastText.substring(0, lastText.lastIndexOf(' ', 77)) : lastText.substring(0, 77)) + '...'
            : lastText;
        items.push({ CONTEXT_ITEM: `Last: ${lastTruncated}` });
    }
    return items.slice(0, 5);
}
function buildContinueSessionData(params) {
    const { observations, userPrompts, toolCounts, recentContext, FILES, SPEC_FILES, summary, projectPhase, nextAction, blockers, duration, decisionCount, collectedData } = params;
    const sessionStatus = determineSessionStatus(blockers, observations, userPrompts.length, collectedData);
    const completionPercent = estimateCompletionPercent(observations, userPrompts.length, toolCounts, sessionStatus, collectedData);
    const pendingTasks = extractPendingTasks(observations, recentContext, nextAction);
    const contextSummary = generateContextSummary(summary, observations, projectPhase, decisionCount);
    const resumeContext = generateResumeContext(FILES, SPEC_FILES, observations);
    const continuationCount = recentContext?.[0]?.continuationCount ?? 1;
    const lastPrompt = userPrompts[userPrompts.length - 1];
    // F-19 — Guard against invalid timestamps that cause RangeError on toISOString()
    let lastActivity;
    if (lastPrompt?.timestamp) {
        const d = new Date(lastPrompt.timestamp);
        lastActivity = isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
    }
    else {
        lastActivity = new Date().toISOString();
    }
    return {
        SESSION_STATUS: sessionStatus,
        COMPLETION_PERCENT: completionPercent,
        LAST_ACTIVITY_TIMESTAMP: lastActivity,
        SESSION_DURATION: duration,
        CONTINUATION_COUNT: continuationCount,
        CONTEXT_SUMMARY: contextSummary,
        PENDING_TASKS: pendingTasks,
        NEXT_CONTINUATION_COUNT: continuationCount + 1,
        RESUME_CONTEXT: resumeContext
    };
}
/* ───────────────────────────────────────────────────────────────
   4. LAZY-LOADED DEPENDENCIES
------------------------------------------------------------------*/
const simFactoryModule = __importStar(require("../lib/simulation-factory"));
function getSimFactory() {
    return simFactoryModule;
}
/* ───────────────────────────────────────────────────────────────
   5. AUTO-SAVE DETECTION
------------------------------------------------------------------*/
/** Auto-save detection based on message count threshold. */
function shouldAutoSave(messageCount) {
    return messageCount > 0 && messageCount % config_1.CONFIG.MESSAGE_COUNT_TRIGGER === 0;
}
function resolveSpecFolderRelative(normalizedDetected, candidateSpecsDirs) {
    for (const candidateRoot of candidateSpecsDirs) {
        const normalizedRoot = path.resolve(candidateRoot).replace(/\\/g, '/');
        const relative = path.relative(normalizedRoot, normalizedDetected).replace(/\\/g, '/');
        if (relative &&
            relative !== '.' &&
            relative !== '..' &&
            !relative.startsWith('../') &&
            !path.isAbsolute(relative)) {
            return { relative, matchedRoot: candidateRoot };
        }
    }
    return { relative: path.basename(normalizedDetected), matchedRoot: null };
}
function countDistinctFilePaths(files, predicate) {
    const normalizedPaths = new Set();
    for (const file of files) {
        if (!file?.FILE_PATH) {
            continue;
        }
        if (predicate && !predicate(file)) {
            continue;
        }
        normalizedPaths.add(file.FILE_PATH.replace(/\\/g, '/').toLowerCase());
    }
    return normalizedPaths.size;
}
async function collectSessionData(collectedData, specFolderName = null, explicitSessionId) {
    const now = new Date();
    // F-24: Consolidated spec-folder resolution helper
    // CODEX2-004: Preserve the winning specs root from phase 1 for use in phase 2
    let folderName = specFolderName || '';
    let resolvedSpecsRoot = null;
    if (!folderName) {
        const detectedFolder = await (0, spec_folder_1.detectSpecFolder)();
        const normalizedDetected = path.resolve(detectedFolder).replace(/\\/g, '/');
        const candidateSpecsDirs = Array.from(new Set([
            (0, config_1.findActiveSpecsDir)() || path.join(config_1.CONFIG.PROJECT_ROOT, 'specs'),
            ...(0, config_1.getSpecsDirectories)(),
            path.join(config_1.CONFIG.PROJECT_ROOT, 'specs'),
            path.join(config_1.CONFIG.PROJECT_ROOT, '.opencode', 'specs'),
        ]));
        const resolution = resolveSpecFolderRelative(normalizedDetected, candidateSpecsDirs);
        folderName = resolution.relative;
        resolvedSpecsRoot = resolution.matchedRoot;
    }
    const dateOnly = (0, message_utils_1.formatTimestamp)(now, 'date-dutch');
    const timeOnly = (0, message_utils_1.formatTimestamp)(now, 'time-short');
    // RECOVERY-ONLY: This fallback is unreachable in JSON-primary mode (data-loader throws before reaching here).
    if (!collectedData) {
        console.log('   Warning: Using simulation data');
        return getSimFactory().createSessionData({
            specFolder: folderName,
            channel: (0, session_extractor_1.getChannel)(),
            skillVersion: config_1.CONFIG.SKILL_VERSION
        });
    }
    const data = { ...collectedData };
    const sessionId = (typeof explicitSessionId === 'string' && explicitSessionId.trim().length > 0
        ? explicitSessionId.trim()
        : (0, session_extractor_1.generateSessionId)());
    const channel = (0, session_extractor_1.getChannel)();
    const sessionInfo = data.recentContext?.[0] || {};
    let observations = data.observations || [];
    if (observations.length > config_1.CONFIG.MAX_OBSERVATIONS) {
        // Prioritize followup observations (nextSteps) before truncation
        const followups = observations.filter(o => o.type === 'followup');
        const others = observations.filter(o => o.type !== 'followup');
        observations = [...followups, ...others];
        (0, logger_1.structuredLog)('warn', 'observation_truncation_applied', {
            specFolder: data.SPEC_FOLDER || folderName,
            sessionId,
            channel,
            originalCount: observations.length,
            retainedCount: config_1.CONFIG.MAX_OBSERVATIONS,
        });
    }
    observations = observations.slice(0, config_1.CONFIG.MAX_OBSERVATIONS);
    const userPrompts = data.userPrompts || [];
    const messageCount = userPrompts.length || 0;
    if (shouldAutoSave(messageCount)) {
        console.log(`\n   Context Budget: ${messageCount} messages reached. Auto-saving context...\n`);
    }
    const duration = (0, session_extractor_1.calculateSessionDuration)(userPrompts, now);
    const FILES = (0, file_extractor_1.extractFilesFromData)(data, observations);
    const capturedFileCount = countDistinctFilePaths(FILES, (file) => file._provenance !== 'git' && file._provenance !== 'spec-folder');
    const filesystemDerivedCount = countDistinctFilePaths(FILES, (file) => file._provenance === 'git' || file._provenance === 'spec-folder');
    const gitChangedFileCount = countDistinctFilePaths(FILES, (file) => file._provenance === 'git');
    const filesystemFileCount = filesystemDerivedCount > 0 ? filesystemDerivedCount : capturedFileCount;
    const sourceTranscriptPath = typeof data._sourceTranscriptPath === 'string' ? data._sourceTranscriptPath : '';
    const sourceSessionId = typeof data._sourceSessionId === 'string'
        ? data._sourceSessionId
        : typeof data._sessionId === 'string'
            ? data._sessionId
            : '';
    const sourceSessionCreated = typeof data._sourceSessionCreated === 'number' && Number.isFinite(data._sourceSessionCreated)
        ? data._sourceSessionCreated
        : 0;
    const sourceSessionUpdated = typeof data._sourceSessionUpdated === 'number' && Number.isFinite(data._sourceSessionUpdated)
        ? data._sourceSessionUpdated
        : 0;
    const OUTCOMES = observations
        .slice(0, 10)
        .map((obs) => ({
        OUTCOME: obs.title || obs.narrative?.substring(0, 300) || '',
        TYPE: (0, file_extractor_1.detectObservationType)(obs)
    }));
    const rawLearning = sessionInfo.learning || '';
    const isErrorContent = /\bAPI\s+Error:\s*\d{3}\b/i.test(rawLearning)
        || /\{"?\s*(?:type|error)"?\s*:\s*"?(?:error|api_error|overloaded_error)/i.test(rawLearning)
        || /internal server error/i.test(rawLearning);
    // P3-7: Check if rawLearning is topically related to the spec folder before using it as SUMMARY.
    // Prevents a random last exchange from becoming the memory's entire description.
    const learningIsTopical = (() => {
        if (!folderName || rawLearning.length === 0)
            return rawLearning.length > 0;
        const segments = folderName.split('/').map(s => s.replace(/^\d+--?/, '').trim().toLowerCase()).filter(s => s.length > 2);
        const lowerLearning = rawLearning.toLowerCase();
        return segments.some(segment => lowerLearning.includes(segment));
    })();
    const nonFollowupObservationTitles = observations
        .filter((observation) => observation.type !== 'followup')
        .slice(0, 3)
        .map((observation) => observation.title)
        .filter(Boolean);
    const observationFallback = nonFollowupObservationTitles.join('; ')
        || observations.slice(0, 3).map((o) => o.title).filter(Boolean).join('; ');
    // Rec 3: Prefer explicit sessionSummary from JSON over transcript-derived learning
    const SUMMARY = (typeof data.sessionSummary === 'string' && data.sessionSummary.length > 20)
        ? data.sessionSummary.substring(0, 500)
        : (!isErrorContent && learningIsTopical && rawLearning.length > 0)
            ? rawLearning
            : observationFallback
                || 'Session focused on implementing and testing features.';
    const explicitImportanceTier = typeof data.importanceTier === 'string'
        ? data.importanceTier
        : (typeof data.importance_tier === 'string' ? data.importance_tier : null);
    // RC5: Extract explicit contextType from JSON payload
    const explicitContextType = typeof data.contextType === 'string'
        ? data.contextType
        : (typeof data.context_type === 'string' ? data.context_type : null);
    // RC5-ext: Extract explicit projectPhase from JSON payload
    let explicitProjectPhase = typeof data.projectPhase === 'string'
        ? data.projectPhase
        : (typeof data.project_phase === 'string' ? data.project_phase : null);
    const { contextType, importanceTier, decisionCount, toolCounts } = (0, session_extractor_1.detectSessionCharacteristics)(observations, userPrompts, FILES, explicitImportanceTier, explicitContextType);
    // RC5-ext: When no explicit projectPhase and tool counts are 0 (JSON mode),
    // infer phase from contextType to avoid RESEARCH default.
    if (!explicitProjectPhase && contextType !== 'general') {
        const CONTEXT_TO_PHASE = {
            implementation: 'IMPLEMENTATION',
            research: 'RESEARCH',
            debugging: 'DEBUGGING',
            review: 'REVIEW',
            decision: 'PLANNING',
            planning: 'PLANNING',
            discovery: 'RESEARCH',
        };
        if (CONTEXT_TO_PHASE[contextType]) {
            explicitProjectPhase = CONTEXT_TO_PHASE[contextType];
        }
    }
    const manualDecisionCount = Array.isArray(data._manualDecisions)
        ? data._manualDecisions.length
        : (Array.isArray(data.keyDecisions) ? data.keyDecisions.length : 0);
    const effectiveDecisionCount = Math.max(decisionCount, manualDecisionCount);
    const TOOL_COUNT = Object.values(toolCounts).reduce((sum, count) => sum + count, 0);
    const firstPrompt = userPrompts[0]?.prompt || '';
    const taskFromPrompt = firstPrompt.match(/^(.{20,100}?)(?:[.!?\n]|$)/)?.[1];
    const quickSummaryCandidates = [
        ...observations.map((observation) => observation.title || ''),
        sessionInfo.request || '',
        sessionInfo.learning || '',
        taskFromPrompt?.trim() || '',
    ];
    const quickSummary = (0, slug_utils_1.pickBestContentName)(quickSummaryCandidates)
        || observations[0]?.title
        || sessionInfo.request
        || sessionInfo.learning
        || taskFromPrompt?.trim()
        || 'Development session';
    const OBSERVATIONS_DETAILED = (0, file_extractor_1.buildObservationsWithAnchors)(observations, data.SPEC_FOLDER || folderName);
    const createdAtEpoch = Math.floor(Date.now() / 1000);
    let SPEC_FILES = [];
    // CODEX2-004: Reuse the specs root that phase 1 matched instead of re-calling
    // findActiveSpecsDir(), which always prefers PROJECT_ROOT/specs and can point
    // at the wrong tree when specs exist in both locations.
    const activeSpecsDir = resolvedSpecsRoot
        || (0, config_1.findActiveSpecsDir)()
        || path.join(config_1.CONFIG.PROJECT_ROOT, 'specs');
    // Backfill SPEC_FOLDER from CLI-known folder name
    if (!data.SPEC_FOLDER && folderName) {
        data.SPEC_FOLDER = folderName;
    }
    // F-03: Path traversal guard with canonical path resolution
    let specFolderPath = null;
    if (data.SPEC_FOLDER) {
        const candidate = path.resolve(activeSpecsDir, data.SPEC_FOLDER);
        const boundary = path.resolve(activeSpecsDir);
        try {
            const realCandidate = fsSync.realpathSync(candidate);
            const realBoundary = fsSync.realpathSync(boundary);
            if (realCandidate === realBoundary || realCandidate.startsWith(realBoundary + path.sep)) {
                specFolderPath = candidate;
            }
        }
        catch {
            // Directory doesn't exist yet — fall back to resolved path check
            if (candidate === boundary || candidate.startsWith(boundary + path.sep)) {
                specFolderPath = candidate;
            }
        }
    }
    if (specFolderPath) {
        try {
            SPEC_FILES = await (0, session_extractor_1.detectRelatedDocs)(specFolderPath);
        }
        catch (docError) {
            const errMsg = docError instanceof Error ? docError.message : String(docError);
            console.warn(`   Warning: Could not detect related docs: ${errMsg}`);
            SPEC_FILES = [];
        }
    }
    const implementationGuide = (0, implementation_guide_extractor_1.buildImplementationGuideData)(observations, FILES, folderName);
    const { projectPhase, activeFile, lastAction, nextAction, blockers, fileProgress } = (0, session_extractor_1.buildProjectStateSnapshot)({
        toolCounts,
        observations,
        messageCount,
        FILES: FILES,
        SPEC_FILES,
        specFolderPath,
        recentContext: data.recentContext,
        explicitProjectPhase,
    });
    const expiresAtEpoch = (0, session_extractor_1.calculateExpiryEpoch)(importanceTier, createdAtEpoch);
    const preflightPostflightData = extractPreflightPostflightData(data);
    const continueSessionData = buildContinueSessionData({
        observations,
        userPrompts,
        toolCounts,
        recentContext: data.recentContext,
        FILES,
        SPEC_FILES,
        summary: SUMMARY,
        projectPhase,
        lastAction,
        nextAction,
        blockers,
        duration,
        decisionCount: effectiveDecisionCount,
        collectedData: data
    });
    return {
        // Rec 3: Derive title from sessionSummary when available (up to 80 chars, sentence boundary)
        TITLE: (() => {
            const summary = typeof data.sessionSummary === 'string' ? data.sessionSummary : '';
            if (summary.length > 10) {
                // Find first sentence or clause boundary within 80 chars
                const truncated = summary.substring(0, 80);
                const boundary = truncated.match(/^(.{20,}?)[.!?,;:\n]/);
                return boundary ? boundary[1].trim() : truncated.replace(/\s+\S*$/, '').trim();
            }
            return path.basename(folderName).replace(/^\d{3}-/, '').replace(/-/g, ' ');
        })(),
        DATE: dateOnly,
        TIME: timeOnly,
        SPEC_FOLDER: folderName,
        DURATION: duration,
        SUMMARY,
        FILES: FILES.length > 0 ? FILES : [],
        HAS_FILES: FILES.length > 0,
        FILE_COUNT: filesystemFileCount,
        CAPTURED_FILE_COUNT: capturedFileCount,
        FILESYSTEM_FILE_COUNT: filesystemFileCount,
        GIT_CHANGED_FILE_COUNT: gitChangedFileCount,
        OUTCOMES: OUTCOMES.length > 0 ? OUTCOMES : [{ OUTCOME: 'Session in progress', TYPE: 'status' }],
        TOOL_COUNT,
        MESSAGE_COUNT: messageCount,
        QUICK_SUMMARY: quickSummary,
        // RC1: Pass through raw sessionSummary from JSON payload for title candidate
        _JSON_SESSION_SUMMARY: typeof data.sessionSummary === 'string' ? data.sessionSummary : null,
        SKILL_VERSION: config_1.CONFIG.SKILL_VERSION,
        OBSERVATIONS: OBSERVATIONS_DETAILED,
        HAS_OBSERVATIONS: OBSERVATIONS_DETAILED.length > 0,
        // Q3: Pass through structured technicalContext for dedicated template section
        TECHNICAL_CONTEXT: Array.isArray(data.TECHNICAL_CONTEXT) ? data.TECHNICAL_CONTEXT : [],
        HAS_TECHNICAL_CONTEXT: Array.isArray(data.TECHNICAL_CONTEXT) && data.TECHNICAL_CONTEXT.length > 0,
        SPEC_FILES,
        HAS_SPEC_FILES: SPEC_FILES.length > 0,
        ...implementationGuide,
        SESSION_ID: sessionId,
        CHANNEL: channel,
        IMPORTANCE_TIER: importanceTier,
        CONTEXT_TYPE: contextType,
        CREATED_AT_EPOCH: createdAtEpoch,
        LAST_ACCESSED_EPOCH: createdAtEpoch,
        EXPIRES_AT_EPOCH: expiresAtEpoch,
        TOOL_COUNTS: toolCounts,
        DECISION_COUNT: effectiveDecisionCount,
        ACCESS_COUNT: 1,
        LAST_SEARCH_QUERY: '',
        RELEVANCE_BOOST: 1.0,
        PROJECT_PHASE: projectPhase,
        ACTIVE_FILE: activeFile,
        LAST_ACTION: lastAction,
        NEXT_ACTION: nextAction,
        BLOCKERS: blockers,
        FILE_PROGRESS: fileProgress,
        HAS_FILE_PROGRESS: fileProgress.length > 0,
        SOURCE_TRANSCRIPT_PATH: sourceTranscriptPath,
        SOURCE_SESSION_ID: sourceSessionId,
        SOURCE_SESSION_CREATED: sourceSessionCreated,
        SOURCE_SESSION_UPDATED: sourceSessionUpdated,
        // Git provenance metadata (M-007d) — surfaced from captured-session enrichment
        HEAD_REF: typeof data.headRef === 'string' ? data.headRef : null,
        COMMIT_REF: typeof data.commitRef === 'string' ? data.commitRef : null,
        REPOSITORY_STATE: typeof data.repositoryState === 'string' ? data.repositoryState : 'unavailable',
        IS_DETACHED_HEAD: data.isDetachedHead === true,
        ...preflightPostflightData,
        ...continueSessionData
    };
}
//# sourceMappingURL=collect-session-data.js.map