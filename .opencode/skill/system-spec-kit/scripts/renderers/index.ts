// ───────────────────────────────────────────────────────────────
// 1. INDEX
// ───────────────────────────────────────────────────────────────
// Barrel export for template rendering modules
export {
  populateTemplate,
  renderTemplate,
  cleanupExcessiveNewlines,
  stripTemplateConfigComments,
  isFalsy,
} from './template-renderer';

export type { TemplateContext } from './template-renderer';
