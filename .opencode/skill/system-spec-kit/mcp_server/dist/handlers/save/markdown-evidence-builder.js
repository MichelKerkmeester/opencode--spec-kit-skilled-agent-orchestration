// ───────────────────────────────────────────────────────────────
// MODULE: Markdown Evidence Builder
// ───────────────────────────────────────────────────────────────
// Pure parsing functions that extract structured evidence from
// markdown memory files for the sufficiency evaluator.
// Feature catalog: Memory indexing (memory_save)
// Feature catalog: Dry-run preflight for memory_save
const MARKDOWN_HEADING_RE = /^(#{2,6})\s+(.+?)\s*$/;
const MARKDOWN_BULLET_RE = /^\s*(?:[-*]|\d+\.)\s+(.*)$/;
function stripMarkdownDecorators(value) {
    return value
        .replace(/`+/g, '')
        .replace(/\*\*/g, '')
        .replace(/\[(.*?)\]\((.*?)\)/g, '$1 $2')
        .replace(/\s+/g, ' ')
        .trim();
}
function extractMarkdownSections(content) {
    const sections = [];
    const lines = content.split(/\r?\n/);
    let currentHeading = '';
    let currentBody = [];
    const flush = () => {
        const body = currentBody.join('\n').trim();
        if (body.length > 0) {
            sections.push({ heading: currentHeading, body });
        }
        currentBody = [];
    };
    for (const line of lines) {
        const headingMatch = line.match(MARKDOWN_HEADING_RE);
        if (headingMatch) {
            flush();
            currentHeading = stripMarkdownDecorators(headingMatch[2]);
            continue;
        }
        currentBody.push(line);
    }
    flush();
    return sections;
}
function extractMarkdownListItems(body) {
    return body
        .split(/\r?\n/)
        .map((line) => line.match(MARKDOWN_BULLET_RE)?.[1] ?? '')
        .map(stripMarkdownDecorators)
        .filter(Boolean);
}
function extractMarkdownTableFiles(body) {
    const files = [];
    for (const line of body.split(/\r?\n/)) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('|')) {
            continue;
        }
        if (/^\|[:\-|\s]+\|?$/.test(trimmed)) {
            continue;
        }
        const cells = trimmed
            .split('|')
            .slice(1, -1)
            .map((cell) => stripMarkdownDecorators(cell));
        if (cells.length < 2 || /^file$/i.test(cells[0])) {
            continue;
        }
        files.push({
            path: cells[0],
            description: cells[1],
        });
    }
    return files;
}
function buildParsedMemoryEvidenceSnapshot(parsed) {
    const sections = extractMarkdownSections(parsed.content);
    const files = [];
    const observations = [];
    const decisions = [];
    const nextActions = [];
    const blockers = [];
    const outcomes = [];
    const recentContext = [];
    for (const section of sections) {
        const heading = section.heading.toLowerCase();
        const listItems = extractMarkdownListItems(section.body);
        if (heading.includes('key files')
            || heading.includes('files changed')
            || heading.includes('files and their roles')
            || heading === 'files') {
            files.push(...extractMarkdownTableFiles(section.body));
            continue;
        }
        if (/^(?:feature|implementation|observation|read|write|edit|bash|grep|glob|search|tool)\s*:/.test(heading)) {
            observations.push({
                title: section.heading,
                narrative: stripMarkdownDecorators(section.body),
            });
            continue;
        }
        if (heading === 'decisions' || heading === 'key decisions' || /^decision\s+\d+:/i.test(section.heading)) {
            decisions.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
            continue;
        }
        if (heading.includes('next steps')
            || heading === 'next action'
            || heading.includes('pending work')
            || heading.includes('follow-up actions')) {
            nextActions.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
            continue;
        }
        if (heading.includes('blockers')) {
            blockers.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
            continue;
        }
        if (heading.includes('key outcomes') || heading === 'outcomes' || heading === 'outcome' || heading === 'results') {
            outcomes.push(...(listItems.length > 0 ? listItems : [stripMarkdownDecorators(section.body)]));
            continue;
        }
        if (heading === 'implementation state') {
            observations.push({
                title: section.heading,
                narrative: stripMarkdownDecorators(section.body),
            });
            continue;
        }
        if (heading.includes('context summary') || heading.includes('session summary') || heading === 'overview') {
            recentContext.push({
                request: section.heading,
                learning: stripMarkdownDecorators(section.body),
            });
        }
    }
    return {
        title: parsed.title,
        content: parsed.content,
        triggerPhrases: parsed.triggerPhrases,
        files,
        observations,
        decisions,
        nextActions,
        blockers,
        outcomes,
        recentContext,
    };
}
export { MARKDOWN_HEADING_RE, MARKDOWN_BULLET_RE, stripMarkdownDecorators, extractMarkdownSections, extractMarkdownListItems, extractMarkdownTableFiles, buildParsedMemoryEvidenceSnapshot, };
//# sourceMappingURL=markdown-evidence-builder.js.map