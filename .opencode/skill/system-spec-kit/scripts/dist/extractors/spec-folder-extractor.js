"use strict";
// ───────────────────────────────────────────────────────────────
// MODULE: Spec Folder Extractor
// ───────────────────────────────────────────────────────────────
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractSpecFolderContext = extractSpecFolderContext;
// ───────────────────────────────────────────────────────────────
// 1. SPEC FOLDER EXTRACTOR
// ───────────────────────────────────────────────────────────────
// Extracts structured context from spec folder documents for captured-session enrichment
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const config_1 = require("../config");
const file_helpers_1 = require("../utils/file-helpers");
/* ───────────────────────────────────────────────────────────────
   1. INTERFACES
------------------------------------------------------------------*/
const SYNTHETIC_TIMESTAMP = new Date(0).toISOString();
const MAX_SPEC_OBSERVATIONS = 15;
/* ───────────────────────────────────────────────────────────────
   2. UTILITY FUNCTIONS
------------------------------------------------------------------*/
function readDoc(specFolderPath, fileName) {
    try {
        return fs_1.default.readFileSync(path_1.default.join(specFolderPath, fileName), 'utf8');
    }
    catch {
        return null;
    }
}
function parseFrontmatter(content) {
    if (!content)
        return { data: {}, body: '' };
    const match = content.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
    if (!match)
        return { data: {}, body: content };
    const data = {};
    let currentKey = '';
    for (const rawLine of match[1].split('\n')) {
        const line = rawLine.trimEnd();
        const kv = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
        if (kv) {
            currentKey = kv[1];
            const value = kv[2].trim().replace(/^['"]|['"]$/g, '');
            data[currentKey] = value || [];
            continue;
        }
        const item = line.match(/^\s*-\s+(.*)$/);
        if (item && currentKey) {
            if (typeof data[currentKey] === 'string')
                continue;
            const existing = Array.isArray(data[currentKey]) ? data[currentKey] : [];
            existing.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
            data[currentKey] = existing;
        }
    }
    return { data, body: content.slice(match[0].length) };
}
function extractFrontmatterListItems(content, keyName) {
    if (!content)
        return [];
    const items = [];
    const blockPattern = /(?:^|\n)---\s*\n([\s\S]*?)\n---\s*(?=\n|$)/g;
    for (const match of content.matchAll(blockPattern)) {
        const lines = match[1].split('\n');
        let collecting = false;
        for (const rawLine of lines) {
            const line = rawLine.trimEnd();
            const isKeyLine = new RegExp(`^${keyName}:\\s*$`, 'i').test(line);
            if (isKeyLine) {
                collecting = true;
                continue;
            }
            if (!collecting) {
                continue;
            }
            const item = line.match(/^\s*-\s+(.*)$/);
            if (item) {
                items.push(item[1].trim().replace(/^['"]|['"]$/g, ''));
                continue;
            }
            if (line.trim() === '') {
                continue;
            }
            collecting = false;
        }
    }
    return items;
}
function cleanText(text) {
    return text
        .replace(/<!--[\s\S]*?-->/g, ' ')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*([^*]+)\*\*/g, '$1')
        .replace(/\*([^*]+)\*/g, '$1')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/\|/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
function getSection(content, headingPattern) {
    const lines = content.split('\n');
    const start = lines.findIndex((line) => headingPattern.test(line));
    if (start < 0)
        return '';
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
        if (/^##\s+/.test(lines[i])) {
            end = i;
            break;
        }
    }
    return lines.slice(start + 1, end).join('\n').trim();
}
function getSubsection(content, headingPattern) {
    const lines = content.split('\n');
    const start = lines.findIndex((line) => headingPattern.test(line));
    if (start < 0)
        return '';
    let end = lines.length;
    for (let i = start + 1; i < lines.length; i++) {
        if (/^###\s+/.test(lines[i]) || /^##\s+/.test(lines[i])) {
            end = i;
            break;
        }
    }
    return lines.slice(start + 1, end).join('\n').trim();
}
function normalizeFilePath(rawPath) {
    const cleaned = rawPath.replace(/`/g, '').trim();
    if (!cleaned)
        return '';
    return (0, file_helpers_1.toCanonicalRelativePath)(cleaned, config_1.CONFIG.PROJECT_ROOT);
}
function dedupe(items) {
    return Array.from(new Set(items.filter(Boolean)));
}
/* ───────────────────────────────────────────────────────────────
   3. DOCUMENT PARSERS
------------------------------------------------------------------*/
function parseSpecDoc(content) {
    const { data, body } = parseFrontmatter(content);
    const files = [];
    const observations = [];
    const triggerPhrases = dedupe([
        ...(Array.isArray(data.trigger_phrases) ? data.trigger_phrases : []),
        ...extractFrontmatterListItems(content, 'trigger_phrases'),
    ].map(cleanText));
    const summary = cleanText([
        data.description,
        getSection(body, /^##\s+\d+\.\s+PROBLEM(?: AND PURPOSE)?/i),
    ].filter(Boolean).join(' '));
    const filesTable = getSubsection(body, /^###\s+Files to Change/i);
    const fileMatches = filesTable.matchAll(/\|\s*`?([^`|\n]+?)`?\s*\|\s*[^|\n]*\|\s*([^|\n]+?)\s*\|/g);
    for (const [, rawPath, rawDescription] of fileMatches) {
        if (/file path|---/i.test(rawPath))
            continue;
        const filePath = normalizeFilePath(rawPath);
        if (filePath)
            files.push({ FILE_PATH: filePath, DESCRIPTION: cleanText(rawDescription), _provenance: 'spec-folder' });
    }
    const requirements = getSection(body, /^##\s+\d+\.\s+REQUIREMENTS/i);
    for (const [, id, requirement, criteria] of requirements.matchAll(/\|\s*(REQ-[^|\s]+)\s*\|\s*([^|\n]+?)\s*\|\s*([^|\n]+?)\s*\|/g)) {
        observations.push({
            type: 'requirement',
            title: `${id}: ${cleanText(requirement)}`,
            narrative: cleanText(criteria),
            timestamp: SYNTHETIC_TIMESTAMP,
            facts: [cleanText(requirement), cleanText(criteria)].filter(Boolean),
            files: [],
            _provenance: 'spec-folder',
            _synthetic: true,
        });
    }
    return { summary, triggerPhrases, files, observations };
}
function parsePlanDoc(content) {
    const { body } = parseFrontmatter(content);
    const summary = cleanText(getSection(body, /^##\s+\d+\.\s+SUMMARY/i));
    const phases = getSection(body, /^##\s+\d+\.\s+IMPLEMENTATION PHASES/i);
    const phaseTitle = phases.match(/^###\s+([^\n]+)/m)?.[1]?.trim() || '';
    const nextActions = Array.from(phases.matchAll(/^- (?:\[\s\]\s+)?(.+)$/gm)).map((match) => cleanText(match[1])).filter(Boolean).slice(0, 3);
    return { summary, phaseTitle, nextActions };
}
function parseTasksDoc(content) {
    if (!content)
        return null;
    const checked = (content.match(/\[x\]/gi) || []).length;
    const unchecked = (content.match(/\[ \]/g) || []).length;
    const total = checked + unchecked;
    return { checked, unchecked, percent: total ? Math.round((checked / total) * 100) : 0 };
}
function parseChecklistDoc(content) {
    if (!content)
        return null;
    const stat = (label) => {
        const section = getSection(content, new RegExp(`^##\\s+${label}\\b`, 'i'));
        const passed = (section.match(/^- \[x\]/gim) || []).length;
        const total = (section.match(/^- \[(?:x| )\]/gim) || []).length;
        return `${passed}/${total || 0}`;
    };
    const passed = (content.match(/^- \[x\]/gim) || []).length;
    const total = (content.match(/^- \[(?:x| )\]/gim) || []).length;
    return { passed, total, p0: stat('P0'), p1: stat('P1'), p2: stat('P2') };
}
function parseDecisionDoc(content) {
    if (!content)
        return [];
    const extractLabeledBlock = (section, label) => {
        const headingMatch = section.match(new RegExp(`###\\s+${label}([\\s\\S]*?)(?:\\n###\\s+|\\n##\\s+|$)`, 'i'))?.[1] || '';
        if (headingMatch.trim())
            return headingMatch;
        if (label === 'Context') {
            // Match both **Context:** and **Context**: (colon inside or outside bold)
            return section.match(/\*\*Context(?::\*\*|\*\*:)\s*([\s\S]*?)(?:\*\*Decision(?::\*\*|\*\*:)|\n##\s+|$)/i)?.[1] || '';
        }
        // Match both **Decision:** and **Decision**: (colon inside or outside bold)
        return section.match(/\*\*Decision(?::\*\*|\*\*:)\s*([\s\S]*?)(?:\*\*(?:Rationale|Alternatives(?:\s+Considered|\s+Rejected)?|Consequences|Notes?|Tradeoffs?|Chosen|We chose)[^*]*(?:\*\*:?|:\*\*)|\n##\s+|$)/i)?.[1] || '';
    };
    const extractChosen = (decisionBlock) => {
        // Match both **We chose:** / **Chosen:** and **We chose**: / **Chosen**: (colon inside or outside bold)
        const explicitChosen = decisionBlock.match(/\*\*(?:We chose|Chosen)(?::\*\*|\*\*:)\s*([^\n]+)/i)?.[1] || '';
        if (explicitChosen.trim())
            return cleanText(explicitChosen);
        const firstSentence = decisionBlock
            .replace(/^\*\*Decision(?::\*\*|\*\*:)\s*/i, '')
            .trim()
            .match(/(.+?[.!?])(?:\s|$)/)?.[1]
            || decisionBlock.replace(/^\*\*Decision(?::\*\*|\*\*:)\s*/i, '').trim().split('\n')[0] || '';
        return cleanText(firstSentence);
    };
    const sections = content.split(/^##\s+/m).slice(1);
    return sections.map((section) => {
        const title = cleanText(section.split('\n')[0] || 'Decision');
        const rationale = cleanText(extractLabeledBlock(section, 'Context'));
        const decisionBlock = extractLabeledBlock(section, 'Decision');
        const chosen = extractChosen(decisionBlock);
        return title && chosen ? { title, rationale, chosen, _provenance: 'spec-folder' } : null;
    }).filter((entry) => Boolean(entry));
}
/* ───────────────────────────────────────────────────────────────
   4. SESSION PHASE DETECTION
------------------------------------------------------------------*/
function determineSessionPhase(taskStats, checklistStats, planPhase, status) {
    if (/complete|done|closed/i.test(status))
        return 'complete';
    if (taskStats?.percent === 100 && (!checklistStats || checklistStats.passed === checklistStats.total))
        return 'complete';
    if ((checklistStats && checklistStats.total > 0 && checklistStats.passed < checklistStats.total) || taskStats?.percent === 100)
        return 'testing';
    if (taskStats && taskStats.percent >= 25)
        return 'implementing';
    if (planPhase)
        return 'implementing';
    return 'planning';
}
/* ───────────────────────────────────────────────────────────────
   5. SPEC FOLDER EXTRACTION
------------------------------------------------------------------*/
async function extractSpecFolderContext(specFolderPath) {
    const descriptionRaw = readDoc(specFolderPath, 'description.json');
    let description = {};
    if (descriptionRaw) {
        try {
            description = JSON.parse(descriptionRaw);
        }
        catch {
            description = {};
        }
    }
    const spec = parseSpecDoc(readDoc(specFolderPath, 'spec.md'));
    const plan = parsePlanDoc(readDoc(specFolderPath, 'plan.md'));
    const tasks = parseTasksDoc(readDoc(specFolderPath, 'tasks.md'));
    const checklist = parseChecklistDoc(readDoc(specFolderPath, 'checklist.md'));
    const decisions = parseDecisionDoc(readDoc(specFolderPath, 'decision-record.md'));
    const summary = cleanText([
        String(description.title || description.name || ''),
        String(description.description || ''),
        spec.summary,
        plan.summary,
    ].filter(Boolean).join(' ')).slice(0, config_1.CONFIG.MAX_CONTENT_PREVIEW);
    const observations = [
        ...((description.id || description.title || description.status) ? [{
                type: 'metadata',
                title: 'Spec folder metadata',
                narrative: cleanText([
                    `Spec ${String(description.id || description.name || '')}`,
                    String(description.title || ''),
                    `status ${String(description.status || 'unknown')}`,
                    `level ${String(description.level || 'unknown')}`,
                    String(description.parent ? `parent ${description.parent}` : ''),
                ].filter(Boolean).join(', ')),
                timestamp: SYNTHETIC_TIMESTAMP,
                facts: [
                    `id=${String(description.id || '')}`,
                    `name=${String(description.name || '')}`,
                    `title=${String(description.title || '')}`,
                    `status=${String(description.status || '')}`,
                    `level=${String(description.level || '')}`,
                    `parent=${String(description.parent || '')}`,
                ].filter((fact) => !fact.endsWith('=')),
                files: [],
                _provenance: 'spec-folder',
                _synthetic: true,
            }] : []),
        ...spec.observations,
        ...(tasks ? [{
                type: 'progress',
                title: 'Task completion status',
                narrative: `Tasks complete: ${tasks.checked}/${tasks.checked + tasks.unchecked || 0} (${tasks.percent}%).`,
                timestamp: SYNTHETIC_TIMESTAMP,
                facts: [`checked=${tasks.checked}`, `unchecked=${tasks.unchecked}`, `completion=${tasks.percent}%`],
                files: [],
                _provenance: 'spec-folder',
                _synthetic: true,
            }] : []),
        ...(checklist ? [{
                type: 'verification',
                title: 'Checklist verification status',
                narrative: `Checklist progress P0 ${checklist.p0}, P1 ${checklist.p1}, P2 ${checklist.p2}.`,
                timestamp: SYNTHETIC_TIMESTAMP,
                facts: [`passed=${checklist.passed}`, `total=${checklist.total}`],
                files: [],
                _provenance: 'spec-folder',
                _synthetic: true,
            }] : []),
    ];
    const structuralTypes = ['progress', 'checklist', 'phase', 'status'];
    observations.sort((a, b) => {
        const aStructural = structuralTypes.some((t) => a.type?.toLowerCase().includes(t)) ? 0 : 1;
        const bStructural = structuralTypes.some((t) => b.type?.toLowerCase().includes(t)) ? 0 : 1;
        return aStructural - bStructural;
    });
    const cappedObservations = observations.slice(0, MAX_SPEC_OBSERVATIONS);
    return {
        observations: cappedObservations,
        FILES: [...new Map(spec.files.map((f) => [f.FILE_PATH, f])).values()],
        recentContext: summary ? [{
                learning: plan.summary || summary,
                request: cleanText([plan.phaseTitle, ...plan.nextActions].filter(Boolean).join(' | ')) || 'Review spec folder context',
                files: spec.files.map((file) => file.FILE_PATH).slice(0, config_1.CONFIG.MAX_FILES_IN_MEMORY),
            }] : [],
        summary,
        triggerPhrases: dedupe([
            ...spec.triggerPhrases,
            ...(Array.isArray(description.triggerPhrases) ? description.triggerPhrases : []).filter((t) => typeof t === 'string').map(cleanText),
        ]).slice(0, 12),
        decisions,
        sessionPhase: determineSessionPhase(tasks, checklist, plan.phaseTitle, String(description.status || '')),
    };
}
//# sourceMappingURL=spec-folder-extractor.js.map