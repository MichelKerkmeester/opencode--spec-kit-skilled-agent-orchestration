"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Diagram Extractor
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
exports.extractPhasesFromData = extractPhasesFromData;
exports.extractDiagrams = extractDiagrams;
// ───────────────────────────────────────────────────────────────
// 1. DIAGRAM EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts and generates ASCII flowcharts and diagrams from conversation data
const data_validator_1 = require("../utils/data-validator");
const fact_coercion_1 = require("../utils/fact-coercion");
const tool_detection_1 = require("../utils/tool-detection");
const flowchartGen = __importStar(require("../lib/flowchart-generator"));
const simFactory = __importStar(require("../lib/simulation-factory"));
/* ───────────────────────────────────────────────────────────────
   2. PHASE EXTRACTION
------------------------------------------------------------------*/
function extractPhasesFromData(collectedData) {
    if (!collectedData || !collectedData.observations || collectedData.observations.length === 0) {
        return simFactory.createSimulationPhases();
    }
    const messageCount = collectedData.observations.length;
    if (messageCount <= 2) {
        console.log('   Session too short for meaningful phase detection');
        return [];
    }
    const observations = collectedData.observations;
    const phaseMap = new Map();
    for (const obs of observations) {
        const tools = obs.facts?.flatMap((f) => {
            if (typeof f !== 'string')
                return [];
            const detection = (0, tool_detection_1.detectToolCall)(f);
            if (!detection)
                return [];
            const toolIndex = f.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
            if (toolIndex >= 0 && (0, tool_detection_1.isProseContext)(f, toolIndex)) {
                return [];
            }
            return [detection.tool];
        }) || [];
        const content = obs.narrative || '';
        const phase = (0, tool_detection_1.classifyConversationPhase)(tools.map((t) => ({ tool: t })), content);
        if (!phaseMap.has(phase)) {
            phaseMap.set(phase, { count: 0, duration: 0, activities: [] });
        }
        const phaseData = phaseMap.get(phase);
        phaseData.count++;
        if (content && content.trim().length > 10) {
            let activity = content.substring(0, 50);
            const lastSpace = activity.lastIndexOf(' ');
            if (lastSpace > 30) {
                activity = activity.substring(0, lastSpace);
            }
            if (activity.length < content.length) {
                activity += '...';
            }
            const meaningfulContent = activity.replace(/[^a-zA-Z0-9]/g, '');
            if (meaningfulContent.length < 5)
                continue;
            if (!phaseData.activities.includes(activity)) {
                phaseData.activities.push(activity);
            }
        }
    }
    return Array.from(phaseMap.entries()).map(([name, data]) => ({
        PHASE_NAME: name,
        DURATION: `${data.count} actions`,
        ACTIVITIES: data.activities.slice(0, 3)
    }));
}
/* ───────────────────────────────────────────────────────────────
   3. DIAGRAM EXTRACTION
------------------------------------------------------------------*/
async function extractDiagrams(collectedData) {
    // O5-9: Return empty data instead of simulation fallback
    if (!collectedData) {
        return {
            DIAGRAMS: [],
            DIAGRAM_COUNT: 0,
            HAS_AUTO_GENERATED: false,
            FLOW_TYPE: '',
            AUTO_CONVERSATION_FLOWCHART: '',
            AUTO_DECISION_TREES: [],
            AUTO_FLOW_COUNT: 0,
            AUTO_DECISION_COUNT: 0,
            DIAGRAM_TYPES: [],
            PATTERN_SUMMARY: [],
        };
    }
    const observations = collectedData.observations || [];
    const decisions = collectedData.observations?.filter((o) => o.type === 'decision') || [];
    const userPrompts = collectedData.userPrompts || [];
    const boxChars = /[\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2500\u2502\u256D\u256E\u2570\u256F\u2571\u2572\u25BC\u25B2\u25BA\u25C4]/;
    const DIAGRAMS = [];
    for (const obs of observations) {
        const narrative = obs.narrative || '';
        const facts = (0, fact_coercion_1.coerceFactsToText)(obs.facts, {
            component: 'diagram-extractor',
            fieldPath: 'observations[].facts',
        });
        if (boxChars.test(narrative) || facts.some((f) => boxChars.test(f))) {
            const asciiArt = boxChars.test(narrative)
                ? narrative
                : facts.find((f) => boxChars.test(f)) || '';
            const pattern = flowchartGen.classifyDiagramPattern(asciiArt);
            DIAGRAMS.push({
                TITLE: obs.title || 'Detected Diagram',
                TIMESTAMP: obs.timestamp || new Date().toISOString(),
                DIAGRAM_TYPE: obs.type === 'decision' ? 'Decision Tree' : 'Workflow',
                PATTERN_NAME: pattern.pattern,
                COMPLEXITY: pattern.complexity,
                HAS_DESCRIPTION: !!obs.title,
                DESCRIPTION: obs.title || 'Diagram found in conversation',
                ASCII_ART: asciiArt.substring(0, 1000),
                HAS_NOTES: false,
                NOTES: [],
                HAS_RELATED_FILES: !!(obs.files && obs.files.length > 0),
                RELATED_FILES: obs.files ? obs.files.map((f) => ({ FILE_PATH: f })) : []
            });
        }
    }
    const phases = extractPhasesFromData(collectedData);
    const AUTO_CONVERSATION_FLOWCHART = flowchartGen.generateConversationFlowchart(phases, userPrompts[0]?.prompt || 'User request');
    // CG-01: Always return empty AUTO_DECISION_TREES to prevent duplication.
    // The {{#DECISIONS}} template loop already renders per-decision DECISION_TREE
    // fields via {{#HAS_DECISION_TREE}}. AUTO_DECISION_TREES would duplicate them.
    const AUTO_DECISION_TREES = [];
    const diagramTypeCounts = new Map();
    for (const diagram of DIAGRAMS) {
        const count = diagramTypeCounts.get(diagram.DIAGRAM_TYPE) || 0;
        diagramTypeCounts.set(diagram.DIAGRAM_TYPE, count + 1);
    }
    const DIAGRAM_TYPES = Array.from(diagramTypeCounts.entries()).map(([TYPE, COUNT]) => ({ TYPE, COUNT }));
    const patternCounts = new Map();
    for (const diagram of DIAGRAMS) {
        const count = patternCounts.get(diagram.PATTERN_NAME) || 0;
        patternCounts.set(diagram.PATTERN_NAME, count + 1);
    }
    const PATTERN_SUMMARY = Array.from(patternCounts.entries()).map(([PATTERN_NAME, COUNT]) => ({ PATTERN_NAME, COUNT }));
    return {
        DIAGRAMS: DIAGRAMS.map((d) => (0, data_validator_1.validateDataStructure)(d)),
        DIAGRAM_COUNT: DIAGRAMS.length,
        HAS_AUTO_GENERATED: true,
        FLOW_TYPE: 'Conversation Flow',
        AUTO_CONVERSATION_FLOWCHART,
        AUTO_DECISION_TREES,
        AUTO_FLOW_COUNT: 1,
        AUTO_DECISION_COUNT: AUTO_DECISION_TREES.length,
        DIAGRAM_TYPES,
        PATTERN_SUMMARY
    };
}
//# sourceMappingURL=diagram-extractor.js.map