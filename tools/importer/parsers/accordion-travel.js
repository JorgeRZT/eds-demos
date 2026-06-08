/* eslint-disable */
/* global WebImporter */

/**
 * Parser for accordion-travel
 * Base block: accordion
 * Source: https://www.viajeselcorteingles.es/grandes-viajes/destinos/egipto
 * Selector: .row > .column > .module.mod-info
 * Generated: 2026-06-08
 *
 * Structure: Top-level .module.mod-info contains a section heading (h2)
 * and nested .module.mod-info items inside .content-mod-info.
 * Each nested item has an h2 title and optional .content-mod-info body.
 * Some items have class "collapsible" and may lack expanded content.
 */
export default function parse(element, { document }) {
  // The top-level element has: h2 (section title) + .content-mod-info (accordion items container)
  const contentContainer = element.querySelector('.content-mod-info');
  const cells = [];

  if (contentContainer) {
    // Each direct child .module.mod-info is an accordion item
    const accordionItems = contentContainer.querySelectorAll(':scope > .module.mod-info');

    accordionItems.forEach((item) => {
      // Title: the h2 inside each accordion item
      const title = item.querySelector('h2');
      if (!title) return;

      // Content: the item's own .content-mod-info contains body (figures, paragraphs)
      const contentDiv = item.querySelector('.content-mod-info');

      // Each row: [title, content] - content is the div element or empty string
      cells.push([title, contentDiv || '']);
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'accordion-travel', cells });
  element.replaceWith(block);
}
