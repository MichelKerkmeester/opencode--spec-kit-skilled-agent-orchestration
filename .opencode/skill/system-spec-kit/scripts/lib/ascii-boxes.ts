// ---------------------------------------------------------------
// MODULE: Ascii Boxes
// ---------------------------------------------------------------

// ───────────────────────────────────────────────────────────────
// 1. ASCII BOXES
// ───────────────────────────────────────────────────────────────
// ───────────────────────────────────────────────────────────────
// 2. TYPES
// ───────────────────────────────────────────────────────────────
/** Box drawing character set */
export interface BoxCharacters {
  readonly ROUND_TOP_LEFT: string;
  readonly ROUND_TOP_RIGHT: string;
  readonly ROUND_BOTTOM_LEFT: string;
  readonly ROUND_BOTTOM_RIGHT: string;
  readonly TOP_LEFT: string;
  readonly TOP_RIGHT: string;
  readonly BOTTOM_LEFT: string;
  readonly BOTTOM_RIGHT: string;
  readonly HORIZONTAL: string;
  readonly VERTICAL: string;
  readonly ARROW_DOWN: string;
  readonly ARROW_RIGHT: string;
  readonly CHECK: string;
  readonly CROSS: string;
  readonly CHECKBOX: string;
  readonly BULLET: string;
  readonly CHOSEN: string;
  readonly WARNING: string;
  readonly CLIPBOARD: string;
}

/** Text alignment option for padText */
export type TextAlign = 'left' | 'center';

/** Option record for decision tree formatting */
export interface OptionRecord {
  LABEL?: string;
  PROS?: Array<{ PRO?: string } | string>;
  CONS?: Array<{ CON?: string } | string>;
}

/** Caveat record for decision tree formatting */
export interface CaveatRecord {
  CAVEAT_ITEM?: string;
}

/** Follow-up action record */
export interface FollowUpRecord {
  FOLLOWUP_ITEM?: string;
}

/** Evidence record for decision tree formatting */
export interface EvidenceRecord {
  EVIDENCE_ITEM?: string;
}

// ───────────────────────────────────────────────────────────────
// 3. BOX DRAWING CHARACTERS
// ───────────────────────────────────────────────────────────────
const BOX: BoxCharacters = {
  ROUND_TOP_LEFT: '\u256D', ROUND_TOP_RIGHT: '\u256E',
  ROUND_BOTTOM_LEFT: '\u2570', ROUND_BOTTOM_RIGHT: '\u256F',
  TOP_LEFT: '\u250C', TOP_RIGHT: '\u2510',
  BOTTOM_LEFT: '\u2514', BOTTOM_RIGHT: '\u2518',
  HORIZONTAL: '\u2500', VERTICAL: '\u2502',
  ARROW_DOWN: '\u25BC', ARROW_RIGHT: '\u25B6',
  CHECK: '\u2713', CROSS: '\u2717', CHECKBOX: '\u25A1', BULLET: '\u2022',
  CHOSEN: '\u2705', WARNING: '\u26A0\uFE0F', CLIPBOARD: '\uD83D\uDCCB',
};

// ───────────────────────────────────────────────────────────────
// 4. TEXT UTILITIES
// ───────────────────────────────────────────────────────────────
function padText(text: string, width: number, align: TextAlign = 'left'): string {
  const cleaned: string = text.substring(0, width);
  if (align === 'center') {
    const padding: number = Math.max(0, width - cleaned.length);
    const leftPad: number = Math.floor(padding / 2);
    return ' '.repeat(leftPad) + cleaned + ' '.repeat(padding - leftPad);
  }
  return cleaned.padEnd(width);
}

// ───────────────────────────────────────────────────────────────
// 5. DECISION TREE VISUALIZATION HELPERS
// ───────────────────────────────────────────────────────────────
function normalizeConfidencePercent(confidence: number): number {
  return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
}

function formatDecisionHeader(
  title: string,
  context: string,
  confidence: number,
  timestamp: string,
  choiceConfidence?: number,
  rationaleConfidence?: number
): string {
  const width: number = 64;
  const innerWidth: number = width - 4;
  const date: Date = new Date(timestamp);
  const isoStr: string = Number.isFinite(date.getTime()) ? date.toISOString() : '1970-01-01T00:00:00.000Z';
  const timeStr: string = isoStr.split('T')[1].substring(0, 8);
  const dateStr: string = isoStr.split('T')[0];

  const maxContextWidth: number = innerWidth - 9;
  const contextSnippet: string = context ? context.substring(0, maxContextWidth - 3) + (context.length > maxContextWidth - 3 ? '...' : '') : '';

  const displayConfidence: number = normalizeConfidencePercent(confidence);
  const displayChoiceConfidence = typeof choiceConfidence === 'number' ? normalizeConfidencePercent(choiceConfidence) : null;
  const displayRationaleConfidence = typeof rationaleConfidence === 'number' ? normalizeConfidencePercent(rationaleConfidence) : null;
  const shouldShowSplitConfidence =
    displayChoiceConfidence !== null
    && displayRationaleConfidence !== null
    && Math.abs(displayChoiceConfidence - displayRationaleConfidence) > 10;
  const confidenceLine = shouldShowSplitConfidence
    ? `Confidence: ${displayConfidence}% | Choice: ${displayChoiceConfidence}% / Rationale: ${displayRationaleConfidence}%`
    : `Confidence: ${displayConfidence}%`;

  return `\u256D${'\u2500'.repeat(width)}\u256E
\u2502  DECISION: ${padText(title, innerWidth - 10)}  \u2502
\u2502  Context: ${padText(contextSnippet, innerWidth - 9)}  \u2502
\u2502  ${padText(confidenceLine, innerWidth)}  \u2502
\u2502  ${padText(`${dateStr} @ ${timeStr}`, innerWidth)}  \u2502
\u2570${'\u2500'.repeat(width)}\u256F`;
}

function formatOptionBox(option: OptionRecord, isChosen: boolean, maxWidth: number = 20): string {
  let box: string = `\u250C${'\u2500'.repeat(maxWidth)}\u2510\n`;
  const headerPrefix = isChosen ? '>> ' : '';
  box += `\u2502  ${padText(`${headerPrefix}${option.LABEL || 'Option'}`, maxWidth - 4)}  \u2502\n`;

  if (option.PROS && option.PROS.length > 0) {
    for (const pro of option.PROS.slice(0, 2)) {
      const proText: string = typeof pro === 'string' ? pro : (pro as { PRO?: string }).PRO || '';
      box += `\u2502  \u2713 ${padText(proText, maxWidth - 6)}  \u2502\n`;
    }
  }

  if (option.CONS && option.CONS.length > 0) {
    for (const con of option.CONS.slice(0, 2)) {
      const conText: string = typeof con === 'string' ? con : (con as { CON?: string }).CON || '';
      box += `\u2502  \u2717 ${padText(conText, maxWidth - 6)}  \u2502\n`;
    }
  }

  box += `\u2514${'\u2500'.repeat(maxWidth)}\u2518`;
  return box;
}

function formatChosenBox(chosen: string, rationale: string, evidence: Array<EvidenceRecord | string>): string {
  const width: number = 40;
  let box: string = `\u250C${'\u2500'.repeat(width)}\u2510\n`;
  box += `\u2502  ${padText('\u2705 CHOSEN: ' + chosen, width - 4)}  \u2502\n`;
  box += `\u2502  ${padText('', width - 4)}  \u2502\n`;

  if (rationale) {
    box += `\u2502  ${padText('Rationale:', width - 4)}  \u2502\n`;
    const words: string[] = rationale.substring(0, 100).split(' ');
    let line: string = '';

    for (const word of words) {
      if ((line + ' ' + word).length > width - 4) {
        box += `\u2502  ${padText(line, width - 4)}  \u2502\n`;
        line = word;
      } else {
        line += (line ? ' ' : '') + word;
      }
    }
    if (line) {
      box += `\u2502  ${padText(line, width - 4)}  \u2502\n`;
    }
  }

  if (evidence && evidence.length > 0) {
    box += `\u2502  ${padText('', width - 4)}  \u2502\n`;
    box += `\u2502  ${padText('Evidence:', width - 4)}  \u2502\n`;
    for (const ev of evidence.slice(0, 3)) {
      const evText: string = typeof ev === 'string' ? ev : (ev as EvidenceRecord).EVIDENCE_ITEM || '';
      box += `\u2502  ${padText('\u2022 ' + evText, width - 4)}  \u2502\n`;
    }
  }

  box += `\u2514${'\u2500'.repeat(width)}\u2518`;
  return box;
}

function formatCaveatsBox(caveats: Array<CaveatRecord | string>): string {
  if (!caveats || caveats.length === 0) return '';

  const width: number = 40;
  let box: string = `\u250C${'\u2500'.repeat(width)}\u2510\n`;
  box += `\u2502  ${padText('\u26A0\uFE0F  Caveats:', width - 4)}  \u2502\n`;

  for (const caveat of caveats.slice(0, 3)) {
    const caveatText: string = typeof caveat === 'string' ? caveat : (caveat as CaveatRecord).CAVEAT_ITEM || '';
    box += `\u2502  ${padText('\u2022 ' + caveatText, width - 4)}  \u2502\n`;
  }

  box += `\u2514${'\u2500'.repeat(width)}\u2518`;
  return box;
}

function formatFollowUpBox(followup: Array<FollowUpRecord | string>): string {
  if (!followup || followup.length === 0) return '';

  const width: number = 40;
  let box: string = `\u250C${'\u2500'.repeat(width)}\u2510\n`;
  box += `\u2502  ${padText('\uD83D\uDCCB Follow-up Actions:', width - 4)}  \u2502\n`;

  for (const action of followup.slice(0, 3)) {
    const actionText: string = typeof action === 'string' ? action : (action as FollowUpRecord).FOLLOWUP_ITEM || '';
    box += `\u2502  ${padText('\u25A1 ' + actionText, width - 4)}  \u2502\n`;
  }

  box += `\u2514${'\u2500'.repeat(width)}\u2518`;
  return box;
}

// ───────────────────────────────────────────────────────────────
// 6. EXPORTS
// ───────────────────────────────────────────────────────────────
export {
  BOX,
  padText,
  formatDecisionHeader,
  formatOptionBox,
  formatChosenBox,
  formatCaveatsBox,
  formatFollowUpBox,
};
