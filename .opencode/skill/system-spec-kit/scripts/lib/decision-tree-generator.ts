// ---------------------------------------------------------------
// MODULE: Decision Tree Generator
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. DECISION TREE GENERATOR
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 2. IMPORTS
// ───────────────────────────────────────────────────────────────
import {
  padText,
  formatDecisionHeader,
  formatOptionBox,
  formatChosenBox,
  formatCaveatsBox,
  formatFollowUpBox,
} from './ascii-boxes';
import type { OptionRecord, EvidenceRecord, CaveatRecord, FollowUpRecord } from './ascii-boxes';
import type { DecisionRecord } from '../types/session-types';

// ───────────────────────────────────────────────────────────────
// 3. TYPES
// ───────────────────────────────────────────────────────────────
/**
 * Decision node data for tree generation.
 *
 * Scalar fields are derived from DecisionRecord (session-types.ts) via
 * Partial<Pick<…>> so they stay in sync with the canonical type.
 * Array fields use the wider ascii-boxes rendering types (OptionRecord,
 * EvidenceRecord, etc.) because the formatting functions accept both
 * structured records and plain strings.
 */
export type DecisionNode = Partial<Pick<DecisionRecord,
  | 'TITLE'
  | 'CONTEXT'
  | 'CONFIDENCE'
  | 'CHOICE_CONFIDENCE'
  | 'RATIONALE_CONFIDENCE'
  | 'TIMESTAMP'
  | 'CHOSEN'
  | 'RATIONALE'
>> & {
  OPTIONS?: OptionRecord[];
  EVIDENCE?: Array<EvidenceRecord | string>;
  CAVEATS?: Array<CaveatRecord | string>;
  FOLLOWUP?: Array<FollowUpRecord | string>;
};

// ───────────────────────────────────────────────────────────────
// 4. DECISION TREE GENERATION
// ───────────────────────────────────────────────────────────────
function generateDecisionTree(decisionData: DecisionNode | string, ...args: unknown[]): string {
  // Handle legacy format (simple parameters) for backwards compatibility
  if (typeof decisionData === 'string') {
    const title: string = decisionData;
    if (!Array.isArray(args[0])) {
      return formatDecisionHeader(title, '', 75, new Date().toISOString());
    }
    const chosen: string = typeof args[1] === 'string' ? args[1] : '';

    const pad = (text: string, length: number): string => text.substring(0, length).padEnd(length);
    return `\u250C\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
\u2502  ${pad(title, 18)}  \u2502
\u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
         \u2502
         \u25BC
    \u2571\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2572
   \u2571  Options?   \u2572
   \u2572            \u2571
    \u2572\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2571
      ${chosen ? '\u2713' : ''}`;
  }

  const {
    TITLE = 'Decision',
    CONTEXT = '',
    CONFIDENCE = 75,
    CHOICE_CONFIDENCE,
    RATIONALE_CONFIDENCE,
    TIMESTAMP = new Date().toISOString(),
    OPTIONS = [],
    CHOSEN = '',
    RATIONALE = '',
    EVIDENCE = [],
    CAVEATS = [],
    FOLLOWUP = []
  } = decisionData;

  if (OPTIONS.length === 0) {
    return formatDecisionHeader(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP, CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE) + '\n' +
           '         \u2502\n' +
           '         \u25BC\n' +
           '   (No options provided)';
  }

  let tree: string = formatDecisionHeader(TITLE, CONTEXT, CONFIDENCE, TIMESTAMP, CHOICE_CONFIDENCE, RATIONALE_CONFIDENCE);
  tree += '\n                      \u2502\n                      \u25BC\n';

  const questionText: string = OPTIONS.length > 2 ? `Select from ${OPTIONS.length} options?` : 'Choose option?';
  tree += `              \u2571${'\u2500'.repeat(questionText.length + 2)}\u2572\n`;
  tree += `             \u2571  ${questionText}  \u2572\n`;
  tree += `            \u2571${' '.repeat(questionText.length + 4)}\u2572\n`;
  tree += `            \u2572${' '.repeat(questionText.length + 4)}\u2571\n`;
  tree += `             \u2572${'\u2500'.repeat(questionText.length + 2)}\u2571\n`;

  const chosenOption: OptionRecord | undefined = CHOSEN.trim().length > 0
    ? OPTIONS.find((opt: OptionRecord) =>
        opt.LABEL === CHOSEN ||
        CHOSEN.includes(opt.LABEL || '') ||
        (opt.LABEL || '').includes(CHOSEN)
      )
    : undefined;

  const displayedOptions: OptionRecord[] = OPTIONS.slice(0, 4);
  const spacing: number = displayedOptions.length === 2 ? 15 : 10;

  if (displayedOptions.length === 2) {
    tree += '               \u2502           \u2502\n';
    tree += `            ${padText(displayedOptions[0].LABEL || '', 10)}     ${padText(displayedOptions[1].LABEL || '', 10)}\n`;
    tree += '               \u2502           \u2502\n';
    tree += '               \u25BC           \u25BC\n';
  } else {
    let branchLine: string = '      ';
    for (let i = 0; i < displayedOptions.length; i++) {
      branchLine += '\u2502' + ' '.repeat(spacing);
    }
    tree += branchLine.trimEnd() + '\n';

    let labelLine: string = '   ';
    for (const opt of displayedOptions) {
      labelLine += padText(opt.LABEL || '', spacing + 1);
    }
    tree += labelLine.trimEnd() + '\n';
  }

  if (displayedOptions.length <= 3) {
    const boxes: string[][] = displayedOptions.map((opt: OptionRecord) =>
      formatOptionBox(opt, opt === chosenOption, 18).split('\n')
    );

    const maxLines: number = Math.max(...boxes.map((b: string[]) => b.length));

    for (let lineIdx = 0; lineIdx < maxLines; lineIdx++) {
      let line: string = '';
      for (let boxIdx = 0; boxIdx < boxes.length; boxIdx++) {
        const boxLine: string = boxes[boxIdx][lineIdx] || ' '.repeat(20);
        line += boxLine + '  ';
      }
      tree += line.trimEnd() + '\n';
    }
  }

  if (chosenOption || CHOSEN) {
    tree += '             \u2502           \u2502\n';
    tree += '             \u2502           \u25BC\n';
    tree += '             \u2502  ' + formatChosenBox(CHOSEN, RATIONALE, EVIDENCE).split('\n').join('\n             \u2502  ') + '\n';
    tree += '             \u2502           \u2502\n';
    tree += '             \u2514\u2500\u2500\u2500\u2500\u2500\u252C\u2500\u2500\u2500\u2500\u2500\u2518\n';
    tree += '                   \u2502\n';
    tree += '                   \u25BC\n';
  }

  if (CAVEATS && CAVEATS.length > 0) {
    tree += formatCaveatsBox(CAVEATS).split('\n').map((line: string) => '     ' + line).join('\n') + '\n';
    tree += '                   \u2502\n';
    tree += '                   \u25BC\n';
  }

  if (FOLLOWUP && FOLLOWUP.length > 0) {
    tree += formatFollowUpBox(FOLLOWUP).split('\n').map((line: string) => '     ' + line).join('\n') + '\n';
    tree += '                   \u2502\n';
    tree += '                   \u25BC\n';
  }

  tree += '        \u256D\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256E\n';
  tree += '        \u2502 Decision Logged \u2502\n';
  tree += '        \u2570\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u256F';

  return tree;
}

// ───────────────────────────────────────────────────────────────
// 5. EXPORTS
// ───────────────────────────────────────────────────────────────
export { generateDecisionTree };
