// ---------------------------------------------------------------
// MODULE: Decision Extractor
// ---------------------------------------------------------------
// Extracts decision records with options, rationale, confidence, and decision trees

import { formatTimestamp } from '../utils/message-utils';
import { validateDataStructure } from '../utils/data-validator';
import { generateAnchorId, validateAnchorUniqueness, extractSpecNumber } from '../lib/anchor-generator';
import { generateDecisionTree } from '../lib/decision-tree-generator';
import type { DecisionNode } from '../lib/decision-tree-generator';
import * as simFactory from '../lib/simulation-factory';
import type { DecisionOption, DecisionRecord, DecisionData } from '../types/session-types';

// Re-export canonical types for backward compatibility
export type { DecisionOption, DecisionRecord, DecisionData };

/* -----------------------------------------------------------------
   1. INTERFACES
------------------------------------------------------------------*/

/** Decision-focused subset of collected session data. */
export interface CollectedDataForDecisions {
  _manualDecisions?: Array<string | Record<string, string>>;
  SPEC_FOLDER?: string;
  userPrompts?: Array<{ prompt?: string }>;
  observations?: Array<{
    type?: string;
    narrative?: string;
    facts?: Array<string | { text?: string }>;
    title?: string;
    timestamp?: string;
    files?: string[];
  }>;
}

const DECISION_CUE_REGEX = /(decided|chose|will use|approach is|going with|rejected|we'll|selected|prefer|adopt)/i;

function extractSentenceAroundCue(text: string): string | null {
  if (!text || typeof text !== 'string') {
    return null;
  }

  const cueMatch = text.match(DECISION_CUE_REGEX);
  if (!cueMatch || cueMatch.index === undefined) {
    return null;
  }

  const cueIndex = cueMatch.index;
  const before = text.slice(0, cueIndex);
  const after = text.slice(cueIndex);

  const sentenceStart = Math.max(before.lastIndexOf('.'), before.lastIndexOf('!'), before.lastIndexOf('?')) + 1;
  const sentenceEndMatch = after.match(/[.!?]/);
  const sentenceEnd = sentenceEndMatch && sentenceEndMatch.index !== undefined
    ? cueIndex + sentenceEndMatch.index + 1
    : text.length;

  const sentence = text.slice(sentenceStart, sentenceEnd).trim();
  if (!sentence) {
    return null;
  }

  return sentence.slice(0, 200);
}

function buildLexicalDecisionObservations(collectedData: CollectedDataForDecisions): Array<{
  type: string;
  title: string;
  narrative: string;
  timestamp: string;
  facts: string[];
}> {
  const candidates: Array<{
    type: string;
    title: string;
    narrative: string;
    timestamp: string;
    facts: string[];
  }> = [];

  const addCandidate = (rawText: string, source: string, index: number): void => {
    const sentence = extractSentenceAroundCue(rawText);
    if (!sentence) {
      return;
    }

    candidates.push({
      type: 'decision',
      title: `${source} decision ${index + 1}`,
      narrative: sentence,
      timestamp: new Date().toISOString(),
      facts: [`Source: ${source} lexical cue`],
    });
  };

  (collectedData.observations || []).forEach((observation, index) => {
    addCandidate(observation.narrative || observation.title || '', 'observation', index);
  });

  (collectedData.userPrompts || []).forEach((prompt, index) => {
    addCandidate(prompt.prompt || '', 'user', index);
  });

  return candidates;
}

/* -----------------------------------------------------------------
   2. DECISION EXTRACTION
------------------------------------------------------------------*/

async function extractDecisions(
  collectedData: CollectedDataForDecisions | null
): Promise<DecisionData> {
  const manualDecisions = collectedData?._manualDecisions || [];

  if (!collectedData) {
    console.log('   Warning: Using simulation data for decisions');
    return simFactory.createDecisionData();
  }

  // Process manual decisions from normalized input (from keyDecisions array)
  if (manualDecisions.length > 0) {
    console.log(`   Processing ${manualDecisions.length} manual decision(s)`);

    const specNumber: string = extractSpecNumber(collectedData.SPEC_FOLDER || '000-unknown');
    const usedAnchorIds: string[] = [];

    const processedDecisions: DecisionRecord[] = manualDecisions.map(
      (manualDec: string | Record<string, string>, index: number): DecisionRecord => {
        let decisionText: string;
        if (typeof manualDec === 'string') {
          decisionText = manualDec;
        } else if (typeof manualDec === 'object' && manualDec !== null) {
          decisionText = manualDec.decision || manualDec.title || JSON.stringify(manualDec);
        } else {
          decisionText = `Decision ${index + 1}`;
        }

        const titleMatch = decisionText.match(/^(?:Decision\s*\d+:\s*)?(.+?)(?:\s*[-\u2013\u2014]\s*(.+))?$/i);
        const title: string = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
        const rationale: string = titleMatch?.[2]?.trim() || decisionText;

        const OPTIONS: DecisionOption[] = [{
          OPTION_NUMBER: 1,
          LABEL: 'Chosen Approach',
          DESCRIPTION: title,
          HAS_PROS_CONS: false,
          PROS: [],
          CONS: []
        }];

        let anchorId: string = generateAnchorId(title, 'decision', specNumber);
        anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
        usedAnchorIds.push(anchorId);

        return {
          INDEX: index + 1,
          TITLE: title,
          CONTEXT: rationale,
          TIMESTAMP: formatTimestamp(),
          OPTIONS,
          CHOSEN: 'Chosen Approach',
          RATIONALE: rationale,
          HAS_PROS: false,
          PROS: [],
          HAS_CONS: false,
          CONS: [],
          CONFIDENCE: OPTIONS.length > 1 ? 70 : (rationale !== title ? 65 : 50),
          HAS_EVIDENCE: false,
          EVIDENCE: [],
          HAS_CAVEATS: false,
          CAVEATS: [],
          HAS_FOLLOWUP: false,
          FOLLOWUP: [],
          DECISION_TREE: '',
          HAS_DECISION_TREE: false,
          DECISION_ANCHOR_ID: anchorId,
          DECISION_IMPORTANCE: 'medium'
        };
      }
    );

    return {
      DECISIONS: processedDecisions.map((d) => validateDataStructure(d) as DecisionRecord),
      DECISION_COUNT: processedDecisions.length,
      HIGH_CONFIDENCE_COUNT: processedDecisions.filter((d) => d.CONFIDENCE >= 80).length,
      MEDIUM_CONFIDENCE_COUNT: processedDecisions.filter((d) => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length,
      LOW_CONFIDENCE_COUNT: processedDecisions.filter((d) => d.CONFIDENCE < 50).length,
      FOLLOWUP_COUNT: 0
    };
  }

  // Process MCP data - extract decision observations
  const decisionObservations = (collectedData.observations || [])
    .filter((obs) => obs.type === 'decision');

  const lexicalDecisionObservations = decisionObservations.length === 0
    ? buildLexicalDecisionObservations(collectedData)
    : [];

  const allDecisionObservations = decisionObservations.length > 0
    ? decisionObservations
    : lexicalDecisionObservations;

  const decisions: DecisionRecord[] = allDecisionObservations.map((obs, index) => {
    const narrative: string = obs.narrative || '';
    // Coerce facts: runtime data may contain nulls or objects with { text?: string } instead of plain strings
    const facts: string[] = (obs.facts || [])
      .filter((f): f is NonNullable<typeof f> => f != null)
      .map(f => typeof f === 'string' ? f : (f as { text?: string }).text || '')
      .filter(f => f.length > 0);

    const optionMatches = facts.filter((f) => f.includes('Option') || f.includes('Alternative'));
    const OPTIONS: DecisionOption[] = optionMatches.map((opt, i) => {
      const labelMatch = opt.match(/Option\s+([A-Za-z0-9]+):?/)
        || opt.match(/Alternative\s+([A-Za-z0-9]+):?/)
        || opt.match(/^(\d+)\./);

      const label: string = labelMatch?.[1] || `${i + 1}`;

      let description: string = opt;
      if (opt.includes(':')) {
        const parts = opt.split(':');
        description = parts.slice(1).join(':').trim();
      } else if (labelMatch) {
        description = opt.replace(labelMatch[0], '').trim();
      }

      if (!description || description.length < 3) {
        description = opt;
      }

      return {
        OPTION_NUMBER: i + 1,
        LABEL: `Option ${label}`,
        DESCRIPTION: description,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      };
    });

    // Ensure at least one option for template rendering
    if (OPTIONS.length === 0 && narrative.trim()) {
      const impliedDescription = narrative.substring(0, 100) + (narrative.length > 100 ? '...' : '');
      OPTIONS.push({
        OPTION_NUMBER: 1,
        LABEL: 'Chosen Approach',
        DESCRIPTION: impliedDescription,
        HAS_PROS_CONS: false,
        PROS: [],
        CONS: []
      });
    }

    const chosenMatch = narrative.match(/(?:chose|selected|decided on|went with):?\s+([^\.\n]+)/i);
    const CHOSEN: string = chosenMatch?.[1]?.trim() || (OPTIONS.length > 0 ? OPTIONS[0].LABEL : 'N/A');

    const rationaleMatch = narrative.match(/(?:because|rationale|reason):?\s+([^\.\n]+)/i);
    const RATIONALE: string = rationaleMatch?.[1]?.trim() || narrative.substring(0, 200);

    const confidenceMatch = narrative.match(/confidence:?\s*(\d+)%?/i);
    // Default confidence based on evidence strength: options + rationale = higher confidence
    const baseConfidence = OPTIONS.length > 1 ? 70 : RATIONALE !== narrative.substring(0, 200) ? 65 : 50;
    const CONFIDENCE: number = confidenceMatch
      ? Math.max(0, Math.min(100, parseInt(confidenceMatch[1], 10)))
      : baseConfidence;

    const PROS = facts
      .filter((f) => {
        const lower = f.toLowerCase();
        return !!lower.match(/\bpro:\s/) || !!lower.match(/\badvantage:\s/);
      })
      .map((p) => {
        const parts = p.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : p;
        return { PRO: text };
      });

    const CONS = facts
      .filter((f) => {
        const lower = f.toLowerCase();
        return !!lower.match(/\bcon:\s/) || !!lower.match(/\bdisadvantage:\s/);
      })
      .map((c) => {
        const parts = c.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : c;
        return { CON: text };
      });

    const FOLLOWUP = facts
      .filter((f) => {
        const lower = f.toLowerCase();
        return !!lower.match(/\bfollow-?up:\s/) || !!lower.match(/\btodo:\s/) || !!lower.match(/\bnext step:\s/);
      })
      .map((f) => {
        const parts = f.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : f;
        return { FOLLOWUP_ITEM: text };
      });

    const CAVEATS = facts
      .filter((f) => {
        const lower = f.toLowerCase();
        return !!lower.match(/\bcaveat:\s/) || !!lower.match(/\bwarning:\s/) || !!lower.match(/\blimitation:\s/);
      })
      .map((c) => {
        const parts = c.split(':');
        const text = parts.length > 1 ? parts.slice(1).join(':').trim() : c;
        return { CAVEAT_ITEM: text };
      });

    const observationFiles = 'files' in obs && Array.isArray(obs.files) ? obs.files : null;
    const EVIDENCE = observationFiles
      ? observationFiles.map((f: string) => ({ EVIDENCE_ITEM: f }))
      : facts
          .filter((f) => {
            const lower = f.toLowerCase();
            return !!lower.match(/\bevidence:\s/) || !!lower.match(/\bsee:\s/) || !!lower.match(/\breference:\s/);
          })
          .map((e) => {
            const parts = e.split(':');
            const text = parts.length > 1 ? parts.slice(1).join(':').trim() : e;
            return { EVIDENCE_ITEM: text };
          });

    const decision: DecisionRecord = {
      INDEX: index + 1,
      TITLE: obs.title || `Decision ${index + 1}`,
      CONTEXT: narrative,
      TIMESTAMP: obs.timestamp || new Date().toISOString(),
      OPTIONS,
      CHOSEN,
      RATIONALE,
      HAS_PROS: PROS.length > 0,
      PROS,
      HAS_CONS: CONS.length > 0,
      CONS,
      CONFIDENCE,
      HAS_EVIDENCE: EVIDENCE.length > 0,
      EVIDENCE,
      HAS_CAVEATS: CAVEATS.length > 0,
      CAVEATS,
      HAS_FOLLOWUP: FOLLOWUP.length > 0,
      FOLLOWUP,
      DECISION_TREE: '',
      HAS_DECISION_TREE: false,
      DECISION_ANCHOR_ID: '',
      DECISION_IMPORTANCE: ''
    };

    decision.DECISION_TREE = OPTIONS.length > 0 ? generateDecisionTree(decision as DecisionNode) : '';
    decision.HAS_DECISION_TREE = decision.DECISION_TREE.length > 0;

    return decision;
  });

  const highConfidence: number = decisions.filter((d) => d.CONFIDENCE >= 80).length;
  const mediumConfidence: number = decisions.filter((d) => d.CONFIDENCE >= 50 && d.CONFIDENCE < 80).length;
  const lowConfidence: number = decisions.filter((d) => d.CONFIDENCE < 50).length;
  const followupCount: number = decisions.reduce((count, d) => count + d.FOLLOWUP.length, 0);

  // Add anchor IDs for searchable decision retrieval
  const usedAnchorIds: string[] = [];
  const specNumber: string = extractSpecNumber(collectedData.SPEC_FOLDER || '000-unknown');

  const decisionsWithAnchors: DecisionRecord[] = decisions.map((decision) => {
    const category = 'decision';

    let anchorId: string = generateAnchorId(
      decision.TITLE || 'Decision',
      category,
      specNumber
    );

    anchorId = validateAnchorUniqueness(anchorId, usedAnchorIds);
    usedAnchorIds.push(anchorId);

    const importance: string = decision.CONFIDENCE >= 80 ? 'high'
      : decision.CONFIDENCE >= 50 ? 'medium'
      : 'low';

    return {
      ...decision,
      DECISION_ANCHOR_ID: anchorId,
      DECISION_IMPORTANCE: importance
    };
  });

  return {
    DECISIONS: decisionsWithAnchors.map((d) => validateDataStructure(d) as DecisionRecord),
    DECISION_COUNT: decisions.length,
    HIGH_CONFIDENCE_COUNT: highConfidence,
    MEDIUM_CONFIDENCE_COUNT: mediumConfidence,
    LOW_CONFIDENCE_COUNT: lowConfidence,
    FOLLOWUP_COUNT: followupCount
  };
}

/* -----------------------------------------------------------------
   3. EXPORTS
------------------------------------------------------------------*/

export {
  extractDecisions,
  // Backward-compatible alias
  extractDecisions as extractDecisions_alias
};
