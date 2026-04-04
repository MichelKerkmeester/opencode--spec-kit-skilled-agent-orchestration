"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Decision Extractor
// ───────────────────────────────────────────────────────────────
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractDecisions = extractDecisions;
// ───────────────────────────────────────────────────────────────
// 1. DECISION EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts decision records with options, rationale, confidence, and decision trees
const message_utils_1 = require("../utils/message-utils");
const data_validator_1 = require("../utils/data-validator");
const fact_coercion_1 = require("../utils/fact-coercion");
const anchor_generator_1 = require("../lib/anchor-generator");
const decision_tree_generator_1 = require("../lib/decision-tree-generator");
/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/
// F-32: Word boundaries prevent partial matches (e.g., "undecided" matching "decided")
const DECISION_CUE_REGEX = /\b(decided|chose|will use|approach is|going with|rejected|we'll|selected|prefer|adopt)\b/i;
const HIGH_CONFIDENCE_THRESHOLD = 0.8;
const MEDIUM_CONFIDENCE_THRESHOLD = 0.5;
const PLACEHOLDER_CHOICE_REGEX = /^(?:chosen approach|n\/a|option [a-z0-9]+|alternative [a-z0-9]+)$/i;
const TRADEOFF_SIGNAL_REGEX = /\b(?:pro|con|advantage|disadvantage|trade-?off|caveat|warning|limitation)\b/i;
function normalizeConfidence(value) {
    const normalized = value > 1 ? value / 100 : value;
    return Math.min(1, Math.max(0, normalized));
}
function isSpecificChoice(choice) {
    const normalized = choice.trim();
    return normalized.length > 0 && !PLACEHOLDER_CHOICE_REGEX.test(normalized);
}
function hasTradeoffSignals(values) {
    return values.some((value) => TRADEOFF_SIGNAL_REGEX.test(value));
}
function buildDecisionConfidence(params) {
    const explicitConfidence = typeof params.explicitConfidence === 'number' && Number.isFinite(params.explicitConfidence)
        ? normalizeConfidence(params.explicitConfidence)
        : null;
    if (explicitConfidence !== null) {
        return {
            choiceConfidence: explicitConfidence,
            rationaleConfidence: explicitConfidence,
            confidence: explicitConfidence,
        };
    }
    let choiceConfidence = 0.7;
    if (params.hasAlternatives) {
        choiceConfidence += 0.1;
    }
    if (params.hasExplicitChoice) {
        choiceConfidence += 0.08;
    }
    if (isSpecificChoice(params.chosen)) {
        choiceConfidence += 0.07;
    }
    let rationaleConfidence = 0.7;
    if (params.hasExplicitRationale) {
        rationaleConfidence += 0.1;
    }
    if (params.hasTradeoffs) {
        rationaleConfidence += 0.08;
    }
    if (params.hasEvidence) {
        rationaleConfidence += 0.07;
    }
    const normalizedChoice = normalizeConfidence(choiceConfidence);
    const normalizedRationale = normalizeConfidence(rationaleConfidence);
    return {
        choiceConfidence: normalizedChoice,
        rationaleConfidence: normalizedRationale,
        confidence: Math.min(normalizedChoice, normalizedRationale),
    };
}
function extractSentenceAroundCue(text) {
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
function buildLexicalDecisionObservations(collectedData) {
    const candidates = [];
    const addCandidate = (rawText, source, index) => {
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
/* ───────────────────────────────────────────────────────────────
   2. DECISION EXTRACTION
------------------------------------------------------------------*/
async function extractDecisions(collectedData) {
    const manualDecisions = collectedData?._manualDecisions || [];
    // F-12: Return empty decisions for null input instead of synthetic simulation data
    if (!collectedData) {
        return { DECISIONS: [], DECISION_COUNT: 0, HIGH_CONFIDENCE_COUNT: 0, MEDIUM_CONFIDENCE_COUNT: 0, LOW_CONFIDENCE_COUNT: 0, FOLLOWUP_COUNT: 0 };
    }
    // F-12: Process manual decisions, then merge with observation-extracted decisions
    let processedManualDecisions = [];
    if (manualDecisions.length > 0) {
        console.log(`   Processing ${manualDecisions.length} manual decision(s)`);
        processedManualDecisions = manualDecisions.map((manualDec, index) => {
            const manualObj = typeof manualDec === 'object' && manualDec !== null && !Array.isArray(manualDec)
                ? manualDec
                : null;
            const toText = (value) => typeof value === 'string' ? value.trim() : '';
            let decisionText;
            if (typeof manualDec === 'string') {
                decisionText = manualDec;
            }
            else if (manualObj) {
                decisionText = toText(manualObj.decision) || toText(manualObj.title) || JSON.stringify(manualObj);
            }
            else {
                decisionText = `Decision ${index + 1}`;
            }
            // Fix 1: Split string-form decisions at first separator to extract title vs rationale
            const titleMatch = decisionText.match(/^(?:Decision\s*(?:\d+\s*)?:\s*)?(.+?)(?:\s+(?:--|[\u2013\u2014])\s+(.+))?$/i);
            const title = titleMatch?.[1]?.trim() || `Decision ${index + 1}`;
            const fallbackRationale = titleMatch?.[2]?.trim() || '';
            // For plain strings without separator, try splitting at first sentence boundary
            const sentenceSplitRationale = fallbackRationale || (() => {
                const sentenceEnd = decisionText.match(/^([^.!?]+[.!?])\s+(.+)/);
                return sentenceEnd?.[2]?.trim() || '';
            })();
            const rawAlternatives = manualObj && Array.isArray(manualObj.alternatives)
                ? manualObj.alternatives
                : (manualObj && Array.isArray(manualObj.options) ? manualObj.options : []);
            const OPTIONS = rawAlternatives.length > 0
                ? rawAlternatives.map((alternative, optionIndex) => {
                    if (typeof alternative === 'string') {
                        return {
                            OPTION_NUMBER: optionIndex + 1,
                            LABEL: `Option ${optionIndex + 1}`,
                            DESCRIPTION: alternative.trim() || `Alternative ${optionIndex + 1}`,
                            HAS_PROS_CONS: false,
                            PROS: [],
                            CONS: []
                        };
                    }
                    if (typeof alternative === 'object' && alternative !== null) {
                        const optionObj = alternative;
                        const optionLabel = toText(optionObj.label) || toText(optionObj.title) || toText(optionObj.name) || `Option ${optionIndex + 1}`;
                        const optionDescription = toText(optionObj.description) || toText(optionObj.details) || toText(optionObj.summary) || optionLabel;
                        const optionPros = Array.isArray(optionObj.pros)
                            ? optionObj.pros.map((pro) => ({ PRO: String(pro).trim() })).filter((pro) => pro.PRO.length > 0)
                            : [];
                        const optionCons = Array.isArray(optionObj.cons)
                            ? optionObj.cons.map((con) => ({ CON: String(con).trim() })).filter((con) => con.CON.length > 0)
                            : [];
                        return {
                            OPTION_NUMBER: optionIndex + 1,
                            LABEL: optionLabel,
                            DESCRIPTION: optionDescription,
                            HAS_PROS_CONS: optionPros.length > 0 || optionCons.length > 0,
                            PROS: optionPros,
                            CONS: optionCons
                        };
                    }
                    return {
                        OPTION_NUMBER: optionIndex + 1,
                        LABEL: `Option ${optionIndex + 1}`,
                        DESCRIPTION: `Alternative ${optionIndex + 1}`,
                        HAS_PROS_CONS: false,
                        PROS: [],
                        CONS: []
                    };
                })
                : [{
                        OPTION_NUMBER: 1,
                        LABEL: 'Chosen Approach',
                        DESCRIPTION: !manualObj ? '' : (title.length > 200 ? title.substring(0, 197) + '...' : title),
                        HAS_PROS_CONS: false,
                        PROS: [],
                        CONS: []
                    }];
            const rationaleFromInput = toText(manualObj?.rationale) || toText(manualObj?.reasoning);
            const rationale = rationaleFromInput || sentenceSplitRationale || decisionText;
            const hasAlternatives = rawAlternatives.length >= 2;
            const chosenLabel = toText(manualObj?.chosen) || toText(manualObj?.choice) || toText(manualObj?.selected)
                || OPTIONS[0]?.DESCRIPTION || OPTIONS[0]?.LABEL || 'Chosen Approach';
            let explicitConfidence = typeof manualObj?.confidence === 'number' && Number.isFinite(manualObj.confidence)
                ? manualObj.confidence
                : undefined;
            // Q5: String-form decision text analysis — parse explicit confidence from text
            if (!manualObj && explicitConfidence === undefined) {
                const textConfMatch = decisionText.match(/confidence:?\s*(\d+(?:\.\d+)?)(?:%|\b)/i);
                if (textConfMatch) {
                    explicitConfidence = parseFloat(textConfMatch[1]);
                }
            }
            const choiceSignals = [
                toText(manualObj?.chosen),
                toText(manualObj?.choice),
                toText(manualObj?.selected),
            ];
            let hasExplicitChoice = choiceSignals.some((signal) => signal.length > 0);
            // Q5: String-form choice verb detection
            if (!manualObj && !hasExplicitChoice) {
                hasExplicitChoice = /\b(?:chose|selected|decided)\b/i.test(decisionText);
            }
            const tradeoffSignals = [
                decisionText,
                rationale,
                ...(Array.isArray(manualObj?.pros) ? manualObj.pros.map((value) => String(value)) : []),
                ...(Array.isArray(manualObj?.cons) ? manualObj.cons.map((value) => String(value)) : []),
            ];
            const hasOptionTradeoffs = OPTIONS.some((option) => option.PROS.length > 0 || option.CONS.length > 0);
            const hasEvidence = rationaleFromInput.length > 0;
            // Q5: String-form rationale detection ("because", "due to")
            const hasStringRationale = !manualObj && rationaleFromInput.length === 0
                && /\b(?:because|due to)\b/i.test(decisionText);
            const { choiceConfidence, rationaleConfidence, confidence, } = buildDecisionConfidence({
                hasAlternatives,
                hasExplicitChoice,
                chosen: chosenLabel,
                hasExplicitRationale: rationaleFromInput.length > 0 || hasStringRationale,
                hasTradeoffs: hasOptionTradeoffs || hasTradeoffSignals(tradeoffSignals),
                hasEvidence,
                explicitConfidence,
            });
            // Fix 1: CONTEXT = brief "why this decision mattered", not the full rationale
            const contextText = rationaleFromInput
                ? `${title} — ${rationaleFromInput.substring(0, 120)}`
                : title;
            // Anchor ID assigned in the unified pass at line ~562 (avoids double-assignment)
            return {
                INDEX: index + 1,
                TITLE: title,
                CONTEXT: !manualObj && !rationaleFromInput ? '' : contextText,
                TIMESTAMP: (0, message_utils_1.formatTimestamp)(),
                OPTIONS,
                CHOSEN: chosenLabel,
                RATIONALE: rationale,
                HAS_PROS: false,
                PROS: [],
                HAS_CONS: false,
                CONS: [],
                CHOICE_CONFIDENCE: choiceConfidence,
                RATIONALE_CONFIDENCE: rationaleConfidence,
                CONFIDENCE: confidence,
                HAS_EVIDENCE: hasEvidence,
                EVIDENCE: hasEvidence ? [{ EVIDENCE_ITEM: rationaleFromInput }] : [],
                HAS_CAVEATS: false,
                CAVEATS: [],
                HAS_FOLLOWUP: false,
                FOLLOWUP: [],
                DECISION_TREE: '',
                HAS_DECISION_TREE: false,
                DECISION_ANCHOR_ID: '',
                DECISION_IMPORTANCE: 'medium'
            };
        });
        // F-12: Don't return early — fall through to merge with observation-extracted decisions
    }
    // Process MCP data - extract decision observations
    let decisionObservations = (collectedData.observations || [])
        .filter((obs) => obs.type === 'decision')
        .filter((obs) => !(processedManualDecisions.length > 0 && obs._manualDecision));
    // REQ-002: suppress ALL observation-type decisions when manual decisions exist,
    // since observation decisions are auto-extracted from the same session and manual
    // decisions should take full precedence
    if (processedManualDecisions.length > 0) {
        decisionObservations = [];
    }
    // P0-3: Also suppress lexical extraction when manual decisions exist,
    // since those observations were already built from the same manual decisions
    const lexicalDecisionObservations = decisionObservations.length === 0 && processedManualDecisions.length === 0
        ? buildLexicalDecisionObservations(collectedData)
        : [];
    const allDecisionObservations = decisionObservations.length > 0
        ? decisionObservations
        : lexicalDecisionObservations;
    const decisions = allDecisionObservations.map((obs, index) => {
        const manualDecision = '_manualDecision' in obs ? obs._manualDecision : undefined;
        const narrative = manualDecision?.fullText?.trim() || obs.narrative || '';
        const facts = (0, fact_coercion_1.coerceFactsToText)(obs.facts, {
            component: 'decision-extractor',
            fieldPath: 'observations[].facts',
            specFolder: collectedData.SPEC_FOLDER,
        });
        const optionMatches = facts.filter((f) => f.includes('Option') || f.includes('Alternative'));
        const OPTIONS = optionMatches.map((opt, i) => {
            const labelMatch = opt.match(/Option\s+([A-Za-z0-9]+):?/)
                || opt.match(/Alternative\s+([A-Za-z0-9]+):?/)
                || opt.match(/^(\d+)\./);
            const label = labelMatch?.[1] || `${i + 1}`;
            let description = opt;
            if (opt.includes(':')) {
                const parts = opt.split(':');
                description = parts.slice(1).join(':').trim();
            }
            else if (labelMatch) {
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
            let impliedDescription;
            if (narrative.length > 200) {
                const truncated = narrative.substring(0, 200);
                const lastSpace = truncated.lastIndexOf(' ');
                impliedDescription = (lastSpace > 80 ? truncated.substring(0, lastSpace) : truncated) + '...';
            }
            else {
                impliedDescription = narrative;
            }
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
        const CHOSEN = manualDecision?.chosenApproach?.trim()
            || chosenMatch?.[1]?.trim()
            || (OPTIONS.length > 0 ? OPTIONS[0].LABEL : 'N/A');
        const rationaleMatch = narrative.match(/(?:because|rationale|reason):?\s+([^\.\n]+)/i);
        const RATIONALE = rationaleMatch?.[1]?.trim() || narrative.substring(0, 200);
        const confidenceMatch = narrative.match(/confidence:?\s*(\d+(?:\.\d+)?)(?:%|\b)/i);
        const parsedConfidence = confidenceMatch ? parseFloat(confidenceMatch[1]) : NaN;
        const manualConfidence = manualDecision?.confidence;
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
        // F-32: Merge file evidence with fact evidence instead of preferring files only
        const observationFiles = 'files' in obs && Array.isArray(obs.files) ? obs.files : null;
        const fileEvidence = observationFiles
            ? observationFiles.map((f) => ({ EVIDENCE_ITEM: f }))
            : [];
        const factEvidence = facts
            .filter((f) => {
            const lower = f.toLowerCase();
            return !!lower.match(/\bevidence:\s/) || !!lower.match(/\bsee:\s/) || !!lower.match(/\breference:\s/);
        })
            .map((e) => {
            const parts = e.split(':');
            const text = parts.length > 1 ? parts.slice(1).join(':').trim() : e;
            return { EVIDENCE_ITEM: text };
        });
        const EVIDENCE = [...fileEvidence, ...factEvidence];
        const explicitConfidence = typeof manualConfidence === 'number' && Number.isFinite(manualConfidence)
            ? manualConfidence
            : Number.isFinite(parsedConfidence)
                ? parsedConfidence
                : undefined;
        const { choiceConfidence, rationaleConfidence, confidence, } = buildDecisionConfidence({
            hasAlternatives: OPTIONS.length >= 2,
            hasExplicitChoice: Boolean(manualDecision?.chosenApproach?.trim() || chosenMatch?.[1]?.trim()),
            chosen: CHOSEN,
            hasExplicitRationale: Boolean(rationaleMatch?.[1]?.trim()),
            hasTradeoffs: PROS.length > 0 || CONS.length > 0 || CAVEATS.length > 0,
            hasEvidence: EVIDENCE.length > 0,
            explicitConfidence,
        });
        const decision = {
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
            CHOICE_CONFIDENCE: choiceConfidence,
            RATIONALE_CONFIDENCE: rationaleConfidence,
            CONFIDENCE: confidence,
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
        decision.DECISION_TREE = OPTIONS.length > 0 ? (0, decision_tree_generator_1.generateDecisionTree)(decision) : '';
        decision.HAS_DECISION_TREE = decision.DECISION_TREE.length > 0;
        return decision;
    });
    // F-12: Merge manual decisions with observation-extracted decisions
    const allDecisions = [...processedManualDecisions, ...decisions];
    const highConfidence = allDecisions.filter((d) => d.CONFIDENCE >= HIGH_CONFIDENCE_THRESHOLD).length;
    const mediumConfidence = allDecisions.filter((d) => d.CONFIDENCE >= MEDIUM_CONFIDENCE_THRESHOLD && d.CONFIDENCE < HIGH_CONFIDENCE_THRESHOLD).length;
    const lowConfidence = allDecisions.filter((d) => d.CONFIDENCE < MEDIUM_CONFIDENCE_THRESHOLD).length;
    const followupCount = allDecisions.reduce((count, d) => count + d.FOLLOWUP.length, 0);
    // Add anchor IDs for searchable decision retrieval
    const usedAnchorIds = [];
    const specNumber = (0, anchor_generator_1.extractSpecNumber)(collectedData.SPEC_FOLDER || '000-unknown');
    const decisionsWithAnchors = allDecisions.map((decision) => {
        const category = 'decision';
        let anchorId = (0, anchor_generator_1.generateAnchorId)(decision.TITLE || 'Decision', category, specNumber);
        anchorId = (0, anchor_generator_1.validateAnchorUniqueness)(anchorId, usedAnchorIds);
        usedAnchorIds.push(anchorId);
        const importance = decision.CONFIDENCE >= HIGH_CONFIDENCE_THRESHOLD ? 'high'
            : decision.CONFIDENCE >= MEDIUM_CONFIDENCE_THRESHOLD ? 'medium'
                : 'low';
        return {
            ...decision,
            DECISION_ANCHOR_ID: anchorId,
            DECISION_IMPORTANCE: importance
        };
    });
    return {
        DECISIONS: decisionsWithAnchors.map((d) => (0, data_validator_1.validateDataStructure)(d)),
        DECISION_COUNT: allDecisions.length,
        HIGH_CONFIDENCE_COUNT: highConfidence,
        MEDIUM_CONFIDENCE_COUNT: mediumConfidence,
        LOW_CONFIDENCE_COUNT: lowConfidence,
        FOLLOWUP_COUNT: followupCount
    };
}
//# sourceMappingURL=decision-extractor.js.map