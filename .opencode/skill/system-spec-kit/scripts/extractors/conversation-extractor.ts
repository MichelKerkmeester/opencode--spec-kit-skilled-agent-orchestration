// ───────────────────────────────────────────────────────────────
// 1. CONVERSATION EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts structured conversation data — exchanges, tool calls, phases, and flowcharts

import { CONFIG } from '../core';
import { formatTimestamp, truncateToolOutput, summarizeExchange } from '../utils/message-utils';
import { detectToolCall, isProseContext, classifyConversationPhase } from '../utils/tool-detection';
import * as simFactory from '../lib/simulation-factory';
import * as flowchartGen from '../lib/flowchart-generator';
import type {
  ToolCallEntry,
  ConversationMessage,
  ConversationPhase,
  ConversationData,
} from '../types/session-types';

// Re-export canonical types for backward compatibility
export type {
  ToolCallEntry,
  ConversationMessage,
  ConversationPhase,
  ConversationData,
};

/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/

/** Conversation-focused subset of collected session data. */
export interface CollectedDataForConversation {
  userPrompts?: Array<{ prompt: string; timestamp?: string }>;
  observations?: Array<{
    timestamp?: string;
    narrative?: string;
    facts?: Array<string | null>;
    title?: string;
    files?: string[];
    type?: string;
  }>;
}

/* ───────────────────────────────────────────────────────────────
   2. CONVERSATION EXTRACTION
------------------------------------------------------------------*/

async function extractConversations(
  collectedData: CollectedDataForConversation | null
): Promise<ConversationData> {
  if (!collectedData) {
    console.log('   Warning: Using simulation data for conversations');
    return simFactory.createConversationData();
  }

  const userPrompts = collectedData.userPrompts || [];
  const observations = collectedData.observations || [];

  if (userPrompts.length === 0 && observations.length === 0) {
    console.warn('   Warning: No conversation data found');
    console.warn('   Warning: Generated output may be minimal or empty');
  }

  if (userPrompts.length === 0) {
    console.warn('   Warning: No user prompts found (empty conversation)');
  }

  if (observations.length === 0) {
    console.warn('   Warning: No observations found (no events documented)');
  }

  const MESSAGES: ConversationMessage[] = [];
  const phaseTimestamps = new Map<string, Date[]>();
  const consumedObservationIndexes = new Set<number>();

  const validPrompts = userPrompts;

  for (let i = 0; i < validPrompts.length; i++) {
    const userPrompt = validPrompts[i];

    const rawTimestamp: string = userPrompt.timestamp || new Date().toISOString();
    const userMessage: ConversationMessage = {
      TIMESTAMP: formatTimestamp(rawTimestamp, 'readable'),
      ROLE: 'User',
      CONTENT: userPrompt.prompt.trim(),
      TOOL_CALLS: []
    };
    MESSAGES.push(userMessage);

    const userTime = new Date(rawTimestamp);
    const relatedObs = observations
      .map((obs, obsIndex) => ({ obs, obsIndex }))
      .filter(({ obs, obsIndex }) => {
        if (consumedObservationIndexes.has(obsIndex)) {
          return false;
        }
        const obsTime = new Date(obs.timestamp || '');
        const timeDiff = Math.abs(obsTime.getTime() - userTime.getTime());
        return timeDiff < CONFIG.MESSAGE_TIME_WINDOW;
      })
      .sort((a, b) => {
        const timeA = new Date(a.obs.timestamp || '').getTime();
        const timeB = new Date(b.obs.timestamp || '').getTime();
        return timeA - timeB;
      });

    if (relatedObs.length > 0) {
      for (const related of relatedObs) {
        consumedObservationIndexes.add(related.obsIndex);
      }

      const TOOL_CALLS: ToolCallEntry[] = relatedObs.flatMap(({ obs }) => {
        if (!obs.facts) return [];

        return obs.facts.map((fact) => {
          if (!fact || typeof fact !== 'string') return null;

          const detection = detectToolCall(fact);
          if (!detection) return null;

          const toolIndex = fact.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
          if (toolIndex >= 0 && isProseContext(fact, toolIndex)) {
            return null;
          }

          if (detection.confidence === 'low') return null;

          const fileMatch = fact.match(/File:\s*([^\n]+)/i) || fact.match(/(?:file_path|path):\s*([^\n]+)/i);
          const resultMatch = fact.match(/Result:\s*([^\n]+)/i);

          return {
            TOOL_NAME: detection.tool,
            DESCRIPTION: fileMatch?.[1] || fact.substring(0, 100),
            HAS_RESULT: !!resultMatch,
            RESULT_PREVIEW: resultMatch?.[1] ? truncateToolOutput(resultMatch[1], CONFIG.TOOL_PREVIEW_LINES) : '',
            HAS_MORE: (resultMatch?.[1]?.split('\n').length ?? 0) > CONFIG.TOOL_PREVIEW_LINES
          };
        }).filter(Boolean) as ToolCallEntry[];
      });

      const narratives: string[] = relatedObs.map(({ obs }) => obs.narrative).filter(Boolean) as string[];
      const summary = summarizeExchange(
        userMessage.CONTENT,
        narratives.join(' '),
        TOOL_CALLS
      );

      const assistantMessage: ConversationMessage = {
        TIMESTAMP: formatTimestamp(relatedObs[0].obs.timestamp || rawTimestamp, 'readable'),
        ROLE: 'Assistant',
        CONTENT: summary.fullSummary,
        TOOL_CALLS: TOOL_CALLS.slice(0, 10)
      };

      MESSAGES.push(assistantMessage);

      const phase: string = classifyConversationPhase(
        TOOL_CALLS.map(tc => ({ tool: tc.TOOL_NAME })),
        userMessage.CONTENT
      );
      if (!phaseTimestamps.has(phase)) {
        phaseTimestamps.set(phase, []);
      }
      const phaseTimestamp = userMessage.TIMESTAMP.replace(' @ ', 'T');
      const timestamps = phaseTimestamps.get(phase);
      if (timestamps) {
        timestamps.push(new Date(phaseTimestamp));
      }
    }
  }

  // Ensure chronological order
  MESSAGES.sort((a, b) => {
    const timeA = new Date(a.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const timeB = new Date(b.TIMESTAMP.replace(' @ ', 'T')).getTime();
    return timeA - timeB;
  });

  // User messages before assistant when timestamps equal
  for (let i = 0; i < MESSAGES.length - 1; i++) {
    const curr = MESSAGES[i];
    const next = MESSAGES[i + 1];
    const currTime = new Date(curr.TIMESTAMP.replace(' @ ', 'T')).getTime();
    const nextTime = new Date(next.TIMESTAMP.replace(' @ ', 'T')).getTime();

    if (currTime === nextTime && curr.ROLE === 'Assistant' && next.ROLE === 'User') {
      [MESSAGES[i], MESSAGES[i + 1]] = [MESSAGES[i + 1], MESSAGES[i]];
    }
  }

  const PHASES: ConversationPhase[] = Array.from(phaseTimestamps.entries()).map(([PHASE_NAME, timestamps]) => {
    if (timestamps.length === 0) {
      return { PHASE_NAME, DURATION: 'N/A' };
    }

    const firstTime = timestamps[0];
    const lastTime = timestamps[timestamps.length - 1];
    const durationMs = lastTime.getTime() - firstTime.getTime();
    const minutes = Math.floor(durationMs / 60000);

    return {
      PHASE_NAME,
      DURATION: minutes > 0 ? `${minutes} min` : '< 1 min'
    };
  });

  let duration = 'N/A';
  if (MESSAGES.length > 0) {
    const firstTimestamp = MESSAGES[0].TIMESTAMP.replace(' @ ', 'T');
    const lastTimestamp = MESSAGES[MESSAGES.length - 1].TIMESTAMP.replace(' @ ', 'T');
    const firstTime = new Date(firstTimestamp);
    const lastTime = new Date(lastTimestamp);
    const durationMs = lastTime.getTime() - firstTime.getTime();
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    duration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }

  const hasDecisions = MESSAGES.some(
    (m) => m.CONTENT.toLowerCase().includes('option') || m.CONTENT.toLowerCase().includes('decide')
  );
  const hasParallel = PHASES.length > 3;
  const FLOW_PATTERN: string = hasDecisions
    ? 'Sequential with Decision Points'
    : hasParallel
      ? 'Multi-Phase Workflow'
      : 'Linear Sequential';

  const TOOL_COUNT: number = MESSAGES.reduce((count, msg) => count + msg.TOOL_CALLS.length, 0);

  const AUTO_GENERATED_FLOW: string = flowchartGen.generateConversationFlowchart(
    PHASES,
    userPrompts[0]?.prompt
  );

  return {
    MESSAGES,
    MESSAGE_COUNT: MESSAGES.length,
    DURATION: duration,
    FLOW_PATTERN,
    PHASE_COUNT: PHASES.length,
    PHASES,
    AUTO_GENERATED_FLOW,
    TOOL_COUNT,
    DATE: new Date().toISOString().split('T')[0]
  };
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
------------------------------------------------------------------*/

export {
  extractConversations,
  // Backward-compatible alias
  extractConversations as extractConversations_alias
};
