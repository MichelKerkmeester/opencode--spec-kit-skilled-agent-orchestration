"use strict";
// ---------------------------------------------------------------
// MODULE: Ascii Boxes
// ---------------------------------------------------------------
Object.defineProperty(exports, "__esModule", { value: true });
exports.BOX = void 0;
exports.padText = padText;
exports.formatDecisionHeader = formatDecisionHeader;
exports.formatOptionBox = formatOptionBox;
exports.formatChosenBox = formatChosenBox;
exports.formatCaveatsBox = formatCaveatsBox;
exports.formatFollowUpBox = formatFollowUpBox;
// ───────────────────────────────────────────────────────────────
// 3. BOX DRAWING CHARACTERS
// ───────────────────────────────────────────────────────────────
const BOX = {
    ROUND_TOP_LEFT: '\u256D', ROUND_TOP_RIGHT: '\u256E',
    ROUND_BOTTOM_LEFT: '\u2570', ROUND_BOTTOM_RIGHT: '\u256F',
    TOP_LEFT: '\u250C', TOP_RIGHT: '\u2510',
    BOTTOM_LEFT: '\u2514', BOTTOM_RIGHT: '\u2518',
    HORIZONTAL: '\u2500', VERTICAL: '\u2502',
    ARROW_DOWN: '\u25BC', ARROW_RIGHT: '\u25B6',
    CHECK: '\u2713', CROSS: '\u2717', CHECKBOX: '\u25A1', BULLET: '\u2022',
    CHOSEN: '\u2705', WARNING: '\u26A0\uFE0F', CLIPBOARD: '\uD83D\uDCCB',
};
exports.BOX = BOX;
// ───────────────────────────────────────────────────────────────
// 4. TEXT UTILITIES
// ───────────────────────────────────────────────────────────────
function padText(text, width, align = 'left') {
    const cleaned = text.substring(0, width);
    if (align === 'center') {
        const padding = Math.max(0, width - cleaned.length);
        const leftPad = Math.floor(padding / 2);
        return ' '.repeat(leftPad) + cleaned + ' '.repeat(padding - leftPad);
    }
    return cleaned.padEnd(width);
}
// ───────────────────────────────────────────────────────────────
// 5. DECISION TREE VISUALIZATION HELPERS
// ───────────────────────────────────────────────────────────────
function normalizeConfidencePercent(confidence) {
    return confidence <= 1 ? Math.round(confidence * 100) : Math.round(confidence);
}
function formatDecisionHeader(title, context, confidence, timestamp, choiceConfidence, rationaleConfidence) {
    const width = 64;
    const innerWidth = width - 4;
    const date = new Date(timestamp);
    const isoStr = Number.isFinite(date.getTime()) ? date.toISOString() : '1970-01-01T00:00:00.000Z';
    const timeStr = isoStr.split('T')[1].substring(0, 8);
    const dateStr = isoStr.split('T')[0];
    const maxContextWidth = innerWidth - 9;
    const contextSnippet = context ? context.substring(0, maxContextWidth - 3) + (context.length > maxContextWidth - 3 ? '...' : '') : '';
    const displayConfidence = normalizeConfidencePercent(confidence);
    const displayChoiceConfidence = typeof choiceConfidence === 'number' ? normalizeConfidencePercent(choiceConfidence) : null;
    const displayRationaleConfidence = typeof rationaleConfidence === 'number' ? normalizeConfidencePercent(rationaleConfidence) : null;
    const shouldShowSplitConfidence = displayChoiceConfidence !== null
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
function formatOptionBox(option, isChosen, maxWidth = 20) {
    let box = `\u250C${'\u2500'.repeat(maxWidth)}\u2510\n`;
    const headerPrefix = isChosen ? '>> ' : '';
    box += `\u2502  ${padText(`${headerPrefix}${option.LABEL || 'Option'}`, maxWidth - 4)}  \u2502\n`;
    if (option.PROS && option.PROS.length > 0) {
        for (const pro of option.PROS.slice(0, 2)) {
            const proText = typeof pro === 'string' ? pro : pro.PRO || '';
            box += `\u2502  \u2713 ${padText(proText, maxWidth - 6)}  \u2502\n`;
        }
    }
    if (option.CONS && option.CONS.length > 0) {
        for (const con of option.CONS.slice(0, 2)) {
            const conText = typeof con === 'string' ? con : con.CON || '';
            box += `\u2502  \u2717 ${padText(conText, maxWidth - 6)}  \u2502\n`;
        }
    }
    box += `\u2514${'\u2500'.repeat(maxWidth)}\u2518`;
    return box;
}
function formatChosenBox(chosen, rationale, evidence) {
    const width = 40;
    let box = `\u250C${'\u2500'.repeat(width)}\u2510\n`;
    box += `\u2502  ${padText('\u2705 CHOSEN: ' + chosen, width - 4)}  \u2502\n`;
    box += `\u2502  ${padText('', width - 4)}  \u2502\n`;
    if (rationale) {
        box += `\u2502  ${padText('Rationale:', width - 4)}  \u2502\n`;
        const words = rationale.substring(0, 100).split(' ');
        let line = '';
        for (const word of words) {
            if ((line + ' ' + word).length > width - 4) {
                box += `\u2502  ${padText(line, width - 4)}  \u2502\n`;
                line = word;
            }
            else {
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
            const evText = typeof ev === 'string' ? ev : ev.EVIDENCE_ITEM || '';
            box += `\u2502  ${padText('\u2022 ' + evText, width - 4)}  \u2502\n`;
        }
    }
    box += `\u2514${'\u2500'.repeat(width)}\u2518`;
    return box;
}
function formatCaveatsBox(caveats) {
    if (!caveats || caveats.length === 0)
        return '';
    const width = 40;
    let box = `\u250C${'\u2500'.repeat(width)}\u2510\n`;
    box += `\u2502  ${padText('\u26A0\uFE0F  Caveats:', width - 4)}  \u2502\n`;
    for (const caveat of caveats.slice(0, 3)) {
        const caveatText = typeof caveat === 'string' ? caveat : caveat.CAVEAT_ITEM || '';
        box += `\u2502  ${padText('\u2022 ' + caveatText, width - 4)}  \u2502\n`;
    }
    box += `\u2514${'\u2500'.repeat(width)}\u2518`;
    return box;
}
function formatFollowUpBox(followup) {
    if (!followup || followup.length === 0)
        return '';
    const width = 40;
    let box = `\u250C${'\u2500'.repeat(width)}\u2510\n`;
    box += `\u2502  ${padText('\uD83D\uDCCB Follow-up Actions:', width - 4)}  \u2502\n`;
    for (const action of followup.slice(0, 3)) {
        const actionText = typeof action === 'string' ? action : action.FOLLOWUP_ITEM || '';
        box += `\u2502  ${padText('\u25A1 ' + actionText, width - 4)}  \u2502\n`;
    }
    box += `\u2514${'\u2500'.repeat(width)}\u2518`;
    return box;
}
//# sourceMappingURL=ascii-boxes.js.map