"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Memory Metadata
// ───────────────────────────────────────────────────────────────
// Memory classification, session dedup, causal links, and evidence
// snapshot construction. Extracted from workflow.ts to reduce module size.
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
exports.inferMemoryType = inferMemoryType;
exports.defaultHalfLifeDays = defaultHalfLifeDays;
exports.baseDecayRateFromHalfLife = baseDecayRateFromHalfLife;
exports.importanceMultiplier = importanceMultiplier;
exports.buildMemoryClassificationContext = buildMemoryClassificationContext;
exports.buildSessionDedupContext = buildSessionDedupContext;
exports.buildCausalLinksContext = buildCausalLinksContext;
exports.buildWorkflowMemoryEvidenceSnapshot = buildWorkflowMemoryEvidenceSnapshot;
exports.extractAnchorIds = extractAnchorIds;
const crypto = __importStar(require("node:crypto"));
const workflow_accessors_1 = require("./workflow-accessors");
// ───────────────────────────────────────────────────────────────
// 2. FUNCTIONS
// ───────────────────────────────────────────────────────────────
function inferMemoryType(contextType, importanceTier) {
    if (importanceTier === 'constitutional') {
        return 'constitutional';
    }
    if (contextType === 'implementation') {
        return 'procedural';
    }
    if (contextType === 'decision' || contextType === 'research' || contextType === 'discovery') {
        return 'semantic';
    }
    return 'episodic';
}
function defaultHalfLifeDays(memoryType) {
    switch (memoryType) {
        case 'constitutional':
            return 0;
        case 'procedural':
            return 180;
        case 'semantic':
            return 365;
        case 'episodic':
        default:
            return 30;
    }
}
function baseDecayRateFromHalfLife(halfLifeDays) {
    if (halfLifeDays <= 0) {
        return 0;
    }
    return Number(Math.pow(0.5, 1 / halfLifeDays).toFixed(4));
}
function importanceMultiplier(importanceTier) {
    switch (importanceTier) {
        case 'constitutional':
            return 2;
        case 'critical':
            return 1.6;
        case 'important':
            return 1.3;
        case 'temporary':
            return 0.6;
        case 'deprecated':
            return 0.2;
        case 'normal':
        default:
            return 1;
    }
}
function buildMemoryClassificationContext(collectedData, sessionData) {
    const rawClassification = (0, workflow_accessors_1.readNamedObject)(collectedData, 'memory_classification', 'memoryClassification');
    const rawDecayFactors = (0, workflow_accessors_1.readNamedObject)(rawClassification, 'decay_factors', 'decayFactors');
    const fallbackType = inferMemoryType(sessionData.CONTEXT_TYPE, sessionData.IMPORTANCE_TIER);
    const memoryType = (0, workflow_accessors_1.readString)(rawClassification, (0, workflow_accessors_1.readString)(collectedData, fallbackType, 'memory_type', 'memoryType'), 'memory_type', 'memoryType');
    const halfLifeDays = (0, workflow_accessors_1.readNumber)(rawClassification, defaultHalfLifeDays(memoryType), 'half_life_days', 'halfLifeDays');
    return {
        MEMORY_TYPE: memoryType,
        HALF_LIFE_DAYS: halfLifeDays,
        BASE_DECAY_RATE: (0, workflow_accessors_1.readNumber)(rawDecayFactors || rawClassification, baseDecayRateFromHalfLife(halfLifeDays), 'base_decay_rate', 'baseDecayRate'),
        ACCESS_BOOST_FACTOR: (0, workflow_accessors_1.readNumber)(rawDecayFactors || rawClassification, 0.1, 'access_boost_factor', 'accessBoostFactor'),
        RECENCY_WEIGHT: (0, workflow_accessors_1.readNumber)(rawDecayFactors || rawClassification, 0.5, 'recency_weight', 'recencyWeight'),
        IMPORTANCE_MULTIPLIER: (0, workflow_accessors_1.readNumber)(rawDecayFactors || rawClassification, importanceMultiplier(sessionData.IMPORTANCE_TIER), 'importance_multiplier', 'importanceMultiplier'),
    };
}
function buildSessionDedupContext(collectedData, sessionData, memoryTitle) {
    const rawDedup = (0, workflow_accessors_1.readNamedObject)(collectedData, 'session_dedup', 'sessionDedup');
    const rawSimilarMemories = rawDedup?.['similar_memories'] ?? rawDedup?.['similarMemories'];
    const similarMemories = Array.isArray(rawSimilarMemories)
        ? rawSimilarMemories.flatMap((entry) => {
            if (typeof entry === 'string' && entry.trim().length > 0) {
                return [{ MEMORY_ID: entry.trim(), SIMILARITY_SCORE: 0 }];
            }
            if (entry && typeof entry === 'object') {
                const item = entry;
                const memoryId = (0, workflow_accessors_1.readString)(item, '', 'id', 'memory_id', 'memoryId');
                if (memoryId.length === 0) {
                    return [];
                }
                return [{
                        MEMORY_ID: memoryId,
                        SIMILARITY_SCORE: (0, workflow_accessors_1.readNumber)(item, 0, 'similarity', 'similarity_score', 'similarityScore'),
                    }];
            }
            return [];
        })
        : [];
    const fallbackFingerprint = crypto
        .createHash('sha1')
        .update(`${sessionData.SESSION_ID}\n${memoryTitle}\n${sessionData.SUMMARY}`)
        .digest('hex');
    return {
        MEMORIES_SURFACED_COUNT: (0, workflow_accessors_1.readNumber)(rawDedup, similarMemories.length, 'memories_surfaced', 'memoriesSurfaced', 'memories_surfaced_count', 'memoriesSurfacedCount'),
        DEDUP_SAVINGS_TOKENS: (0, workflow_accessors_1.readNumber)(rawDedup, 0, 'dedup_savings_tokens', 'dedupSavingsTokens'),
        FINGERPRINT_HASH: (0, workflow_accessors_1.readString)(rawDedup, fallbackFingerprint, 'fingerprint_hash', 'fingerprintHash'),
        SIMILAR_MEMORIES: similarMemories,
    };
}
function buildCausalLinksContext(collectedData) {
    const rawCausalLinks = (0, workflow_accessors_1.readNamedObject)(collectedData, 'causal_links', 'causalLinks');
    return {
        CAUSED_BY: (0, workflow_accessors_1.readStringArray)(rawCausalLinks, 'caused_by', 'causedBy'),
        SUPERSEDES: (0, workflow_accessors_1.readStringArray)(rawCausalLinks, 'supersedes'),
        DERIVED_FROM: (0, workflow_accessors_1.readStringArray)(rawCausalLinks, 'derived_from', 'derivedFrom'),
        BLOCKS: (0, workflow_accessors_1.readStringArray)(rawCausalLinks, 'blocks'),
        RELATED_TO: (0, workflow_accessors_1.readStringArray)(rawCausalLinks, 'related_to', 'relatedTo'),
    };
}
function normalizeEvidenceLine(value) {
    if (typeof value === 'string') {
        return value.trim();
    }
    if (value && typeof value === 'object' && typeof value.text === 'string') {
        return String(value.text).trim();
    }
    return '';
}
function buildWorkflowMemoryEvidenceSnapshot(params) {
    const { title, content, triggerPhrases, files, observations, decisions, outcomes, nextAction, blockers, recentContext, } = params;
    const meaningfulBlockers = typeof blockers === 'string'
        && blockers.trim().length > 0
        && !/^none$/i.test(blockers.trim())
        ? [blockers.trim()]
        : [];
    return {
        title,
        content,
        triggerPhrases,
        files: files.map((file) => ({
            path: file.FILE_PATH,
            description: file.DESCRIPTION,
            specRelevant: true,
        })),
        observations: observations.map((observation) => ({
            title: typeof observation.TITLE === 'string'
                ? observation.TITLE
                : (typeof observation.title === 'string' ? observation.title : ''),
            narrative: typeof observation.NARRATIVE === 'string'
                ? observation.NARRATIVE
                : (typeof observation.narrative === 'string' ? observation.narrative : ''),
            facts: Array.isArray(observation.FACTS)
                ? observation.FACTS.map(normalizeEvidenceLine).filter(Boolean)
                : (Array.isArray(observation.facts) ? observation.facts.map(normalizeEvidenceLine).filter(Boolean) : []),
            synthetic: observation._synthetic === true,
            provenance: typeof observation._provenance === 'string' ? observation._provenance : undefined,
            specRelevant: observation._specRelevant !== false,
        })),
        decisions: decisions.map((decision) => ([
            typeof decision.TITLE === 'string' ? decision.TITLE : '',
            typeof decision.CHOSEN === 'string' ? decision.CHOSEN : '',
            typeof decision.RATIONALE === 'string' ? decision.RATIONALE : '',
            typeof decision.CONTEXT === 'string' ? decision.CONTEXT : '',
        ].filter(Boolean).join(' '))).filter(Boolean),
        nextActions: typeof nextAction === 'string' && nextAction.trim().length > 0 ? [nextAction.trim()] : [],
        blockers: meaningfulBlockers,
        outcomes: outcomes
            .map((outcome) => (typeof outcome.OUTCOME === 'string' ? outcome.OUTCOME.trim() : ''))
            .filter(Boolean),
        recentContext: (recentContext || []).map((context) => ({
            request: context.request,
            learning: context.learning,
        })),
        anchors: extractAnchorIds(content),
    };
}
/** Also used by frontmatter-editor; exported for reuse. */
function extractAnchorIds(content) {
    const matches = content.matchAll(/<!--\s*(?:\/)?ANCHOR:\s*([a-zA-Z0-9][a-zA-Z0-9-]*)\s*-->/g);
    return Array.from(new Set(Array.from(matches, (match) => match[1])));
}
//# sourceMappingURL=memory-metadata.js.map