// ───────────────────────────────────────────────────────────────
// MODULE: Diagram Extractor
// ───────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────
// 1. DIAGRAM EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts and generates ASCII flowcharts and diagrams from conversation data

import { validateDataStructure } from '../utils/data-validator';
import { coerceFactsToText } from '../utils/fact-coercion';
import {
  detectToolCall,
  isProseContext,
  classifyConversationPhase
} from '../utils/tool-detection';
import * as flowchartGen from '../lib/flowchart-generator';
import * as simFactory from '../lib/simulation-factory';
import { generateDecisionTree } from '../lib/decision-tree-generator';
import type {
  CollectedDataSubset,
  DiagramOutput,
  AutoDecisionTree,
  DiagramTypeCount,
  PatternSummaryEntry,
  PhaseEntry,
  DiagramData,
} from '../types/session-types';

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

// Re-export canonical types for backward compatibility
export type {
  DiagramOutput,
  AutoDecisionTree,
  DiagramTypeCount,
  PatternSummaryEntry,
  PhaseEntry,
  DiagramData,
};

/* ───────────────────────────────────────────────────────────────
   2. PHASE EXTRACTION
------------------------------------------------------------------*/

function extractPhasesFromData(collectedData: CollectedDataSubset<'observations' | 'userPrompts'> | null): PhaseEntry[] {
  if (!collectedData || !collectedData.observations || collectedData.observations.length === 0) {
    return simFactory.createSimulationPhases();
  }

  const messageCount: number = collectedData.observations.length;
  if (messageCount <= 2) {
    console.log('   Session too short for meaningful phase detection');
    return [];
  }

  const observations = collectedData.observations;
  const phaseMap = new Map<string, { count: number; duration: number; activities: string[] }>();

  for (const obs of observations) {
    const tools: string[] = obs.facts?.flatMap((f) => {
      if (typeof f !== 'string') return [];

      const detection = detectToolCall(f);
      if (!detection) return [];

      const toolIndex = f.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
      if (toolIndex >= 0 && isProseContext(f, toolIndex)) {
        return [];
      }

      return [detection.tool];
    }) || [];
    const content: string = obs.narrative || '';

    const phase: string = classifyConversationPhase(
      tools.map((t) => ({ tool: t })),
      content
    );

    if (!phaseMap.has(phase)) {
      phaseMap.set(phase, { count: 0, duration: 0, activities: [] });
    }

    const phaseData = phaseMap.get(phase)!;
    phaseData.count++;

    if (content && content.trim().length > 10) {
      let activity: string = content.substring(0, 50);
      const lastSpace = activity.lastIndexOf(' ');
      if (lastSpace > 30) {
        activity = activity.substring(0, lastSpace);
      }

      if (activity.length < content.length) {
        activity += '...';
      }

      const meaningfulContent = activity.replace(/[^a-zA-Z0-9]/g, '');
      if (meaningfulContent.length < 5) continue;

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

async function extractDiagrams(
  collectedData: CollectedDataSubset<'observations' | 'userPrompts'> | null
): Promise<DiagramData> {
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

  const DIAGRAMS: DiagramOutput[] = [];

  for (const obs of observations) {
    const narrative: string = obs.narrative || '';
    const facts = coerceFactsToText(obs.facts, {
      component: 'diagram-extractor',
      fieldPath: 'observations[].facts',
    });

    if (boxChars.test(narrative) || facts.some((f) => boxChars.test(f))) {
      const asciiArt: string = boxChars.test(narrative)
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
  const AUTO_CONVERSATION_FLOWCHART: string = flowchartGen.generateConversationFlowchart(
    phases,
    userPrompts[0]?.prompt || 'User request'
  );

  // CG-01: Always return empty AUTO_DECISION_TREES to prevent duplication.
  // The {{#DECISIONS}} template loop already renders per-decision DECISION_TREE
  // fields via {{#HAS_DECISION_TREE}}. AUTO_DECISION_TREES would duplicate them.
  const AUTO_DECISION_TREES: AutoDecisionTree[] = [];

  const diagramTypeCounts = new Map<string, number>();
  for (const diagram of DIAGRAMS) {
    const count = diagramTypeCounts.get(diagram.DIAGRAM_TYPE) || 0;
    diagramTypeCounts.set(diagram.DIAGRAM_TYPE, count + 1);
  }

  const DIAGRAM_TYPES: DiagramTypeCount[] = Array.from(diagramTypeCounts.entries()).map(
    ([TYPE, COUNT]) => ({ TYPE, COUNT })
  );

  const patternCounts = new Map<string, number>();
  for (const diagram of DIAGRAMS) {
    const count = patternCounts.get(diagram.PATTERN_NAME) || 0;
    patternCounts.set(diagram.PATTERN_NAME, count + 1);
  }

  const PATTERN_SUMMARY: PatternSummaryEntry[] = Array.from(patternCounts.entries()).map(
    ([PATTERN_NAME, COUNT]) => ({ PATTERN_NAME, COUNT })
  );

  return {
    DIAGRAMS: DIAGRAMS.map((d) => validateDataStructure(d) as DiagramOutput),
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

/* ───────────────────────────────────────────────────────────────
   4. EXPORTS
------------------------------------------------------------------*/

export {
  extractPhasesFromData,
  extractDiagrams
};
