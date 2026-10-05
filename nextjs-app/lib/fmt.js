/** Tiny formatting helpers for lib/ui-copy.js templates (client-safe). */

/** fmt('Aufnahme {n} von {total}', { n: 3, total: 15 }) */
export function fmt(template, vars = {}) {
  if (typeof template !== 'string') return '';
  return template.replace(/\{(\w+)\}/g, (m, key) => (vars[key] ?? vars[key] === 0 ? String(vars[key]) : m));
}

/** plural(3, ['Aufnahme', 'Aufnahmen']) -> 'Aufnahmen' */
export function plural(n, forms) {
  if (!Array.isArray(forms)) return forms || '';
  return n === 1 ? forms[0] : forms[1] ?? forms[0];
}
