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
    PROS?: Array<{
        PRO?: string;
    } | string>;
    CONS?: Array<{
        CON?: string;
    } | string>;
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
declare const BOX: BoxCharacters;
declare function padText(text: string, width: number, align?: TextAlign): string;
declare function formatDecisionHeader(title: string, context: string, confidence: number, timestamp: string, choiceConfidence?: number, rationaleConfidence?: number): string;
declare function formatOptionBox(option: OptionRecord, isChosen: boolean, maxWidth?: number): string;
declare function formatChosenBox(chosen: string, rationale: string, evidence: Array<EvidenceRecord | string>): string;
declare function formatCaveatsBox(caveats: Array<CaveatRecord | string>): string;
declare function formatFollowUpBox(followup: Array<FollowUpRecord | string>): string;
export { BOX, padText, formatDecisionHeader, formatOptionBox, formatChosenBox, formatCaveatsBox, formatFollowUpBox, };
//# sourceMappingURL=ascii-boxes.d.ts.map