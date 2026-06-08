/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: viajeselcorteingles sections
 * Inserts section breaks (<hr>) and Section Metadata blocks based on template sections.
 * Selectors from page-templates.json, verified against captured DOM.
 *
 * Template sections (destination-page):
 *   1. .row.full-landing (no style)
 *   2. #modAdviseme (style: highlight)
 *   3. .mod_section_access (style: grey)
 *   4. .hv-advantages (no style)
 *   5. .thumbnail-module (no style)
 *   6. .row > .column > .module.mod-info:has(> h2:first-child) [1st match] (no style)
 *   7. .row > .column > .module.mod-info:has(> h2:first-child) [2nd match] (style: grey)
 *   8. .row > .column > .module.mod-info:has(> h2:first-child) [3rd match] (no style)
 *   9. .mod-links-destination-x2 (no style)
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.afterTransform) {
    const { template } = payload;
    if (!template || !template.sections || template.sections.length < 2) return;

    const doc = payload.document || element.ownerDocument || document;

    // Track how many times each selector has been used (for repeated selectors)
    const selectorUsageCount = {};

    // Process sections in reverse order to preserve DOM positions during insertion
    const sections = [...template.sections].reverse();

    sections.forEach((section, reverseIndex) => {
      const isFirst = reverseIndex === template.sections.length - 1; // First section in original order
      const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;

      // Find the matching element for this section
      let sectionEl = null;

      // For repeated selectors, we need to find the Nth occurrence
      // Count from original order (forward), so build occurrence index
      const originalIndex = template.sections.length - 1 - reverseIndex;

      // Count how many sections before this one (in original order) use the same selector
      let occurrenceIndex = 0;
      for (let i = 0; i < originalIndex; i++) {
        const prevSelector = Array.isArray(template.sections[i].selector)
          ? template.sections[i].selector[0]
          : template.sections[i].selector;
        if (prevSelector === selector) {
          occurrenceIndex++;
        }
      }

      // Get all matches and pick the Nth one
      const allMatches = element.querySelectorAll(selector);
      if (allMatches.length > occurrenceIndex) {
        sectionEl = allMatches[occurrenceIndex];
      }

      if (!sectionEl) return;

      // Add Section Metadata block if section has a style
      if (section.style) {
        const sectionMetadataBlock = WebImporter.Blocks.createBlock(doc, {
          name: 'Section Metadata',
          cells: { style: section.style },
        });
        sectionEl.after(sectionMetadataBlock);
      }

      // Insert <hr> before section element (except the first section)
      if (!isFirst) {
        const hr = doc.createElement('hr');
        sectionEl.before(hr);
      }
    });
  }
}
