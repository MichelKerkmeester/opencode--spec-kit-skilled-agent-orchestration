/** Template context data: a record of string keys to arbitrary values */
export type TemplateContext = Record<string, unknown>;
declare function isFalsy(value: unknown): boolean;
declare function cleanupExcessiveNewlines(text: string): string;
declare function stripTemplateConfigComments(text: string): string;
declare function renderTemplate(template: string, data: TemplateContext, parentData?: TemplateContext): string;
declare function populateTemplate(templateName: string, data: TemplateContext): Promise<string>;
export { populateTemplate, renderTemplate, cleanupExcessiveNewlines, stripTemplateConfigComments, isFalsy, };
//# sourceMappingURL=template-renderer.d.ts.map