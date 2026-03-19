// ---------------------------------------------------------------
// MODULE: Conversation Extractor
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. CONVERSATION EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts structured conversation data — exchanges, tool calls, phases, and flowcharts

import { CONFIG } from '../core';
import { formatTimestamp, truncateToolOutput, summarizeExchange } from '../utils/message-utils';
import { detectToolCall, isProseContext } from '../utils/tool-detection';
import { classifyConversationExchanges } from '../utils/phase-classifier';
import { coerceFactsToText } from '../utils/fact-coercion';
import { detectObservationType } from './file-extractor';
import * as simFactory from '../lib/simulation-factory';
import * as flowchartGen from '../lib/flowchart-generator';
import type {
  CollectedDataSubset,
  ConversationData,
  ConversationMessage,
  ConversationPhase,
  ToolCallEntry,
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

interface TempConversationMessage {
  tempId: string;
  rawTimestamp: string;
  message: ConversationMessage;
}

type PendingExchangeInput = Parameters<typeof classifyConversationExchanges>[0][number] & {
  tempMessageIds: string[];
};

/* ───────────────────────────────────────────────────────────────
   2. CONVERSATION EXTRACTION
------------------------------------------------------------------*/

async function extractConversations(
  collectedData: CollectedDataSubset<'userPrompts' | 'observations'> | null
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
  const tempMessages: TempConversationMessage[] = [];
  const exchangeInputs: PendingExchangeInput[] = [];
  const consumedObservationIndexes = new Set<number>();

  for (let i = 0; i < userPrompts.length; i++) {
    const userPrompt = userPrompts[i];
    const rawTimestamp: string = userPrompt.timestamp || new Date().toISOString();
    const userTempId = `user-${i + 1}`;

    const userMessage: ConversationMessage = {
      TIMESTAMP: formatTimestamp(rawTimestamp, 'readable'),
      ROLE: 'User',
      CONTENT: userPrompt.prompt.trim(),
      TOOL_CALLS: [],
    };

    tempMessages.push({
      tempId: userTempId,
      rawTimestamp,
      message: userMessage,
    });

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

    for (const related of relatedObs) {
      consumedObservationIndexes.add(related.obsIndex);
    }

    const toolCalls: ToolCallEntry[] = relatedObs.flatMap(({ obs }) => {
      const factTexts = coerceFactsToText(obs.facts, {
        component: 'conversation-extractor',
        fieldPath: 'observations[].facts',
      });

      if (factTexts.length === 0) {
        return [];
      }

      return factTexts.map((fact) => {
        const detection = detectToolCall(fact);
        if (!detection) return null;

        const toolIndex = fact.search(new RegExp(`\\b${detection.tool}\\b`, 'i'));
        if (toolIndex >= 0 && isProseContext(fact, toolIndex)) {
          return null;
        }

        if (detection.confidence === 'low') {
          return null;
        }

        const fileMatch = fact.match(/File:\s*([^\n]+)/i) || fact.match(/(?:file_path|path):\s*([^\n]+)/i);
        const resultMatch = fact.match(/Result:\s*([^\n]+)/i);

        return {
          TOOL_NAME: detection.tool,
          DESCRIPTION: fileMatch?.[1] || fact.substring(0, 100),
          HAS_RESULT: !!resultMatch,
          RESULT_PREVIEW: resultMatch?.[1] ? truncateToolOutput(resultMatch[1], CONFIG.TOOL_PREVIEW_LINES) : '',
          HAS_MORE: (resultMatch?.[1]?.split('\n').length ?? 0) > CONFIG.TOOL_PREVIEW_LINES,
        };
      }).filter(Boolean) as ToolCallEntry[];
    });

    const narratives = relatedObs.map(({ obs }) => obs.narrative).filter(Boolean) as string[];
    const factTexts = relatedObs.flatMap(({ obs }) => coerceFactsToText(obs.facts, {
      component: 'conversation-extractor',
      fieldPath: 'observations[].facts',
    }));
    const observationTypes = relatedObs.map(({ obs }) => detectObservationType(obs));
    const tempMessageIds = [userTempId];
    let exchangeEndTimestamp = rawTimestamp;

    if (relatedObs.length > 0) {
      const assistantTimestamp = relatedObs[0].obs.timestamp || rawTimestamp;
      const assistantTempId = `assistant-${i + 1}`;
      const summary = summarizeExchange(
        userMessage.CONTENT,
        narratives.join(' '),
        toolCalls,
      );

      tempMessages.push({
        tempId: assistantTempId,
        rawTimestamp: assistantTimestamp,
        message: {
          TIMESTAMP: formatTimestamp(assistantTimestamp, 'readable'),
          ROLE: 'Assistant',
          CONTENT: summary.fullSummary,
          TOOL_CALLS: toolCalls.slice(0, 10),
        },
      });

      tempMessageIds.push(assistantTempId);
      exchangeEndTimestamp = assistantTimestamp;
    }

    exchangeInputs.push({
      id: `exchange-${i + 1}`,
      messageIndexes: [],
      observationIndexes: relatedObs.map(({ obsIndex }) => obsIndex),
      prompt: userMessage.CONTENT,
      narratives,
      factTexts,
      toolNames: toolCalls.map((toolCall) => toolCall.TOOL_NAME),
      observationTypes,
      startTimestamp: rawTimestamp,
      endTimestamp: exchangeEndTimestamp,
      tempMessageIds,
    });
  }

  tempMessages.sort((a, b) => {
    const timeA = new Date(a.rawTimestamp).getTime();
    const timeB = new Date(b.rawTimestamp).getTime();
    return timeA - timeB;
  });

  for (let i = 0; i < tempMessages.length - 1; i++) {
    const curr = tempMessages[i];
    const next = tempMessages[i + 1];
    const currTime = new Date(curr.rawTimestamp).getTime();
    const nextTime = new Date(next.rawTimestamp).getTime();

    if (currTime === nextTime && curr.message.ROLE === 'Assistant' && next.message.ROLE === 'User') {
      [tempMessages[i], tempMessages[i + 1]] = [tempMessages[i + 1], tempMessages[i]];
    }
  }

  const messageIndexByTempId = new Map<string, number>();
  tempMessages.forEach((entry, index) => {
    messageIndexByTempId.set(entry.tempId, index);
    MESSAGES.push(entry.message);
  });

  for (let i = 0; i < exchangeInputs.length; i++) {
    exchangeInputs[i].messageIndexes = exchangeInputs[i].tempMessageIds
      .map((tempId) => messageIndexByTempId.get(tempId))
      .filter((value): value is number => value !== undefined);
  }

  const classification = classifyConversationExchanges(exchangeInputs.map(({ tempMessageIds: _tempMessageIds, ...exchange }) => exchange));
  const phases: ConversationPhase[] = classification.phases;

  let duration = 'N/A';
  if (tempMessages.length > 0) {
    const firstTime = new Date(tempMessages[0].rawTimestamp);
    const lastTime = new Date(tempMessages[tempMessages.length - 1].rawTimestamp);
    const durationMs = Math.max(0, lastTime.getTime() - firstTime.getTime());
    const minutes = Math.floor(durationMs / 60000);
    const hours = Math.floor(minutes / 60);
    duration = hours > 0 ? `${hours}h ${minutes % 60}m` : `${minutes}m`;
  }

  const toolCount = MESSAGES.reduce((count, message) => count + message.TOOL_CALLS.length, 0);
  const autoGeneratedFlow = flowchartGen.generateConversationFlowchart(
    phases,
    userPrompts[0]?.prompt,
  );

  return {
    MESSAGES,
    MESSAGE_COUNT: MESSAGES.length,
    DURATION: duration,
    FLOW_PATTERN: classification.flowPattern,
    PHASE_COUNT: phases.length,
    UNIQUE_PHASE_COUNT: classification.uniquePhaseCount,
    PHASES: phases,
    TOPIC_CLUSTERS: classification.topicClusters,
    AUTO_GENERATED_FLOW: autoGeneratedFlow,
    TOOL_COUNT: toolCount,
    DATE: new Date().toISOString().split('T')[0],
  };
}

/* ───────────────────────────────────────────────────────────────
   3. EXPORTS
------------------------------------------------------------------*/

export {
  extractConversations,
  // Legacy alias — retained for backward compatibility with external callers
  extractConversations as extractConversations_alias,
};
