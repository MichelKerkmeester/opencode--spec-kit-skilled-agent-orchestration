// ---------------------------------------------------------------
// MODULE: Flowchart Generator
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. FLOWCHART GENERATOR
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Workflow pattern type */
export type WorkflowPattern = 'linear' | 'parallel';

/** Diagram classification pattern names */
export type DiagramPatternName =
  | 'Linear Sequential'
  | 'Decision Branch'
  | 'Parallel Execution'
  | 'Nested Sub-Process'
  | 'Approval Gate'
  | 'Loop/Iteration'
  | 'Multi-Stage Pipeline'
  | 'Unknown';

/** Complexity level for diagrams */
export type ComplexityLevel = 'Low' | 'Medium' | 'High';

/** A workflow phase with activities.
 * Structural interface satisfied by both PhaseEntry (diagram-extractor) and
 * ConversationPhase (conversation-extractor) without requiring an index signature. */
export interface Phase {
  PHASE_NAME?: string;
  DURATION?: string;
  ACTIVITIES?: string[];
  TRANSITION_TRIGGER?: string;
}

/** Detailed phase with computed fields */
export interface PhaseDetail {
  INDEX: number;
  PHASE_NAME: string;
  DURATION: string;
  ACTIVITIES: string[];
  HAS_TRANSITION: boolean;
  FROM_PHASE: string;
  TO_PHASE: string;
  TRANSITION_TRIGGER: string;
}

/** Feature extracted from flowchart analysis */
export interface FlowchartFeature {
  FEATURE_NAME: string;
  FEATURE_DESC: string;
}

/** Classification result for an ASCII diagram */
export interface DiagramClassification {
  pattern: DiagramPatternName;
  complexity: ComplexityLevel;
}

// ───────────────────────────────────────────────────────────────
// 3. PATTERN CONSTANTS
// ───────────────────────────────────────────────────────────────
const PATTERNS: { readonly LINEAR: WorkflowPattern; readonly PARALLEL: WorkflowPattern } = {
  LINEAR: 'linear',
  PARALLEL: 'parallel',
} as const;

const DIAGRAM_PATTERNS: Record<string, DiagramPatternName> = {
  LINEAR_SEQUENTIAL: 'Linear Sequential',
  DECISION_BRANCH: 'Decision Branch',
  PARALLEL_EXECUTION: 'Parallel Execution',
  NESTED_SUB_PROCESS: 'Nested Sub-Process',
  APPROVAL_GATE: 'Approval Gate',
  LOOP_ITERATION: 'Loop/Iteration',
  MULTI_STAGE_PIPELINE: 'Multi-Stage Pipeline',
  UNKNOWN: 'Unknown',
};

const COMPLEXITY: Record<string, ComplexityLevel> = {
  LOW: 'Low',
  MEDIUM: 'Medium',
  HIGH: 'High',
};

// ───────────────────────────────────────────────────────────────
// 4. HELPER FUNCTIONS
// ───────────────────────────────────────────────────────────────
function pad(text: string, length: number): string {
  return text.substring(0, length).padEnd(length);
}

// ───────────────────────────────────────────────────────────────
// 5. PATTERN DETECTION
// ───────────────────────────────────────────────────────────────
/** Linear (<=4 phases) or parallel (>4 phases) */
function detectWorkflowPattern(phases: Phase[] = []): WorkflowPattern {
  if (phases.length === 0) return PATTERNS.LINEAR;
  return phases.length > 4 ? PATTERNS.PARALLEL : PATTERNS.LINEAR;
}

// ───────────────────────────────────────────────────────────────
// 6. FLOWCHART GENERATION
// ───────────────────────────────────────────────────────────────
function generateConversationFlowchart(phases: Phase[] = [], initialRequest: string = 'User Request'): string {
  if (phases.length === 0) {
    return `\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
\u2502  ${pad(initialRequest, 16)}  \u2502
\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F
         \u2502
         \u25BC
   \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
   \u2502  Done  \u2502
   \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F`;
  }

  let flowchart: string = `\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
\u2502  ${pad(initialRequest, 16)}  \u2502
\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F
         \u2502`;

  for (let i = 0; i < phases.length; i++) {
    const phase: Phase = phases[i];
    const phaseName: string = phase.PHASE_NAME || `Phase ${i + 1}`;
    const duration: string = phase.DURATION || 'N/A';

    flowchart += `
         \u25BC
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  ${pad(phaseName, 16)}  \u2502
\u2502  ${pad(duration, 16)}  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`;

    if (i < phases.length - 1) {
      flowchart += `
         \u2502`;
    }
  }

  flowchart += `
         \u2502
         \u25BC
   \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
   \u2502 \u2705 Done \u2502
   \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F`;

  return flowchart;
}

function generateWorkflowFlowchart(phases: Phase[] = []): string | null {
  if (phases.length === 0) {
    return null;
  }

  const padWide = (text: string, length: number = 56): string => text.substring(0, length).padEnd(length);
  let flowchart: string = '';

  flowchart = `\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
\u2502${padWide('CONVERSATION WORKFLOW', 58).replace(/^(.*)$/, () => {
    const padding: number = Math.floor((58 - 'CONVERSATION WORKFLOW'.length) / 2);
    return ' '.repeat(padding) + 'CONVERSATION WORKFLOW' + ' '.repeat(58 - padding - 'CONVERSATION WORKFLOW'.length);
  })}\u2502
\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F
                        \u2502
                        \u25BC`;

  const patternType: WorkflowPattern = detectWorkflowPattern(phases);

  if (patternType === PATTERNS.LINEAR) {
    for (let i = 0; i < phases.length; i++) {
      const phase: Phase = phases[i];
      const phaseName: string = phase.PHASE_NAME || `Phase ${i + 1}`;
      const duration: string = phase.DURATION || 'Duration unknown';
      const activities: string[] = phase.ACTIVITIES || [];

      flowchart += `
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  ${padWide(phaseName, 52)}  \u2502`;

      for (let j = 0; j < Math.min(3, activities.length); j++) {
        flowchart += `
\u2502  \u2022 ${padWide(activities[j], 50)}  \u2502`;
      }

      flowchart += `
\u2502  ${padWide('Duration: ' + duration, 52)}  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518`;

      if (i < phases.length - 1) {
        flowchart += `
                        \u2502
                        \u25BC`;
      }
    }
  } else if (patternType === PATTERNS.PARALLEL) {
    const firstPhase: Phase = phases[0];
    const parallelPhases: Phase[] = phases.slice(1, Math.min(4, phases.length));

    flowchart += `
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  ${padWide(firstPhase.PHASE_NAME || 'Preparation', 52)}  \u2502
\u2502  \u2022 ${padWide((firstPhase.ACTIVITIES || [])[0] || 'Initial setup', 50)}  \u2502
\u2502  Duration: ${padWide(firstPhase.DURATION || 'N/A', 44)}  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                        \u2502
                        \u25BC
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
PARALLEL EXECUTION - ${parallelPhases.length} concurrent phases
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
                        \u2502`;

    flowchart += `
      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
      \u2502                 \u2502                 \u2502
      \u25BC                 \u25BC                 \u25BC`;

    flowchart += `
\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510      \u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510`;

    const maxLines: number = Math.max(...parallelPhases.map((p: Phase) => (p.ACTIVITIES || []).length + 3));
    for (let line = 0; line < maxLines; line++) {
      flowchart += '\n\u2502';
      for (let i = 0; i < 3 && i < parallelPhases.length; i++) {
        const phase: Phase = parallelPhases[i];
        let text: string = '';

        if (line === 0) {
          text = (phase.PHASE_NAME || `Phase ${i + 1}`).substring(0, 8).padEnd(8);
        } else if (line === 1) {
          text = '        ';
        } else if (line === 2) {
          const activity: string = (phase.ACTIVITIES || [])[0] || '';
          text = ('\u2022 ' + activity).substring(0, 8).padEnd(8);
        } else if (line < (phase.ACTIVITIES || []).length + 2) {
          const activity: string = (phase.ACTIVITIES || [])[line - 2] || '';
          text = ('\u2022 ' + activity).substring(0, 8).padEnd(8);
        } else if (line === maxLines - 2) {
          text = '        ';
        } else if (line === maxLines - 1) {
          text = (phase.DURATION || 'N/A').substring(0, 8).padEnd(8);
        } else {
          text = '        ';
        }

        flowchart += ` ${text} \u2502${i < 2 && i < parallelPhases.length - 1 ? '      ' : ''}`;
      }
    }

    flowchart += `
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
      \u2502                 \u2502                 \u2502
      \u2502                 \u2502                 \u2502
      \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u253C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
                        \u2502
                        \u25BC    (All phases complete)
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
SYNCHRONIZATION POINT
\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500`;
  }

  flowchart += `
                        \u2502
                        \u25BC
\u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E
\u2502${padWide('WORKFLOW COMPLETE', 58).replace(/^(.*)$/, () => {
    const padding: number = Math.floor((58 - 'WORKFLOW COMPLETE'.length) / 2);
    return ' '.repeat(padding) + 'WORKFLOW COMPLETE' + ' '.repeat(58 - padding - 'WORKFLOW COMPLETE'.length);
  })}\u2502
\u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F`;

  return flowchart;
}

// 6. PHASE DETAILS & FEATURES
function buildPhaseDetails(phases: Phase[] = []): PhaseDetail[] {
  return phases.map((phase: Phase, index: number): PhaseDetail => ({
    INDEX: index + 1,
    PHASE_NAME: phase.PHASE_NAME || `Phase ${index + 1}`,
    DURATION: phase.DURATION || 'N/A',
    ACTIVITIES: phase.ACTIVITIES || [],
    HAS_TRANSITION: index < phases.length - 1,
    FROM_PHASE: phase.PHASE_NAME || `Phase ${index + 1}`,
    TO_PHASE: phases[index + 1]?.PHASE_NAME || 'Complete',
    TRANSITION_TRIGGER: phase.TRANSITION_TRIGGER || 'Completion of previous phase',
  }));
}

function extractFlowchartFeatures(phases: Phase[] = [], patternType: string = 'linear'): FlowchartFeature[] {
  const features: FlowchartFeature[] = [];

  if (patternType === PATTERNS.PARALLEL) {
    features.push({ FEATURE_NAME: 'Parallel execution', FEATURE_DESC: 'Multiple phases running concurrently' });
    features.push({ FEATURE_NAME: 'Synchronization points', FEATURE_DESC: 'Coordination between parallel streams' });
  } else {
    features.push({ FEATURE_NAME: 'Sequential progression', FEATURE_DESC: 'Step-by-step workflow execution' });
  }

  if (phases.length > 0) {
    const hasActivities: boolean = phases.some((p: Phase) => p.ACTIVITIES && p.ACTIVITIES.length > 0);
    if (hasActivities) {
      features.push({ FEATURE_NAME: 'Detailed activities', FEATURE_DESC: 'Inline breakdown of phase tasks' });
    }

    const hasDurations: boolean = phases.every((p: Phase) => p.DURATION && p.DURATION !== 'N/A');
    if (hasDurations) {
      features.push({ FEATURE_NAME: 'Timing information', FEATURE_DESC: 'Duration tracking for each phase' });
    }
  }

  features.push({ FEATURE_NAME: 'Phase count', FEATURE_DESC: `${phases.length} distinct phases tracked` });
  return features;
}

function getPatternUseCases(patternType: string = 'linear'): string[] {
  const useCaseMap: Record<string, string[]> = {
    linear: [
      'Sequential feature implementations',
      'Bug fixes and patches',
      'Documentation generation',
      'Single-file modifications',
      'Simple refactoring',
      'Research-driven development',
    ],
    parallel: [
      'Concurrent development tasks',
      'Multi-file refactoring',
      'Parallel research and implementation',
      'Independent feature development',
      'Distributed problem-solving',
      'Complex system changes',
    ],
  };

  return useCaseMap[patternType] || useCaseMap.linear;
}

// ───────────────────────────────────────────────────────────────
// 7. DIAGRAM CLASSIFICATION
// ───────────────────────────────────────────────────────────────
/** Classifies ASCII art using 7 core patterns from sk-doc */
function classifyDiagramPattern(asciiArt: string): DiagramClassification {
  const art: string = asciiArt.toLowerCase();
  let complexity: ComplexityLevel = COMPLEXITY.LOW;
  let pattern: DiagramPatternName = DIAGRAM_PATTERNS.UNKNOWN;

  const hasDecisionDiamond: boolean = asciiArt.includes('\u2571') && asciiArt.includes('\u2572');
  const hasBranchConnector: boolean = asciiArt.includes('\u252C') || asciiArt.includes('\u253C');
  const hasMultipleBranchArrows: boolean = asciiArt
    .split('\n')
    .some((line) => ((line.match(/\u25BC/g) || []).length > 1));
  const hasParallelBlock: boolean = art.includes('parallel') || (hasBranchConnector && hasMultipleBranchArrows);
  const hasApprovalGate: boolean = asciiArt.includes('\u2554\u2550') || art.includes('approval') || art.includes('gate');
  // F-24 — └ and ┘ are standard box-drawing characters used in any boxed
  // Diagram. Requiring both misclassifies most diagrams as loops. Instead, only
  // Match explicit "loop" keyword or back-edge indicators (← ↑ arrows pointing back).
  const hasLoopBack: boolean = art.includes('loop') || art.includes('retry') ||
    (asciiArt.includes('\u2190') && (asciiArt.includes('\u2514') || asciiArt.includes('\u2518')));
  const hasNestedProcess: boolean = art.includes('sub-process') || art.includes('sub process');
  const hasPipeline: boolean = asciiArt.includes('\u2500\u2500\u2500\u2500\u25B6') || (art.includes('stage') && asciiArt.includes('\u2502'));

  const boxCount: number = (asciiArt.match(/\u250C[\u2500]+\u2510/g) || []).length +
                    (asciiArt.match(/\u256D[\u2500]+\u256E/g) || []).length +
                    (asciiArt.match(/\u2554[\u2550]+\u2557/g) || []).length;

  if (hasApprovalGate) {
    pattern = DIAGRAM_PATTERNS.APPROVAL_GATE;
    complexity = COMPLEXITY.MEDIUM;
  } else if (hasLoopBack) {
    pattern = DIAGRAM_PATTERNS.LOOP_ITERATION;
    complexity = COMPLEXITY.MEDIUM;
  } else if (hasParallelBlock) {
    pattern = DIAGRAM_PATTERNS.PARALLEL_EXECUTION;
    complexity = COMPLEXITY.HIGH;
  } else if (hasDecisionDiamond) {
    pattern = DIAGRAM_PATTERNS.DECISION_BRANCH;
    complexity = boxCount > 5 ? COMPLEXITY.HIGH : COMPLEXITY.MEDIUM;
  } else if (hasPipeline) {
    pattern = DIAGRAM_PATTERNS.MULTI_STAGE_PIPELINE;
    complexity = COMPLEXITY.MEDIUM;
  } else if (hasNestedProcess) {
    pattern = DIAGRAM_PATTERNS.NESTED_SUB_PROCESS;
    complexity = COMPLEXITY.HIGH;
  } else if (asciiArt.includes('\u250C') || asciiArt.includes('\u2502') || asciiArt.includes('\u25BC')) {
    pattern = DIAGRAM_PATTERNS.LINEAR_SEQUENTIAL;
    complexity = boxCount > 10 ? COMPLEXITY.MEDIUM : COMPLEXITY.LOW;
  }

  return { pattern, complexity };
}

// ───────────────────────────────────────────────────────────────
// 8. MODULE EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  generateConversationFlowchart,
  generateWorkflowFlowchart,
  detectWorkflowPattern,
  classifyDiagramPattern,
  buildPhaseDetails,
  extractFlowchartFeatures,
  getPatternUseCases,
  // Constants
  PATTERNS,
  DIAGRAM_PATTERNS,
  COMPLEXITY,
};
