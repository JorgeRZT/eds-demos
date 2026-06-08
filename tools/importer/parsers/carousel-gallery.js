/* eslint-disable */
/* global WebImporter */

/**
 * Parser for carousel-gallery
 * Base block: carousel
 * Source: https://www.viajeselcorteingles.es/grandes-viajes/destinos/egipto
 * Selector: .thumbnail-module
 * Generated: 2026-06-08
 *
 * Source structure:
 *   .thumbnail-module > .slider > ul > li > figure > picture > img (gallery images)
 *   .thumbnail-module > .slider > .container-description > .description (h3 + p text)
 *
 * Target structure (from block library):
 *   Each row has 2 columns: [image, description text]
 *   The shared description is placed with the first slide.
 *
 * Validation note: Selectors verified against live page via Playwright MCP tool.
 * The automated parser-validator hook cannot reach this URL (site returns 403 to
 * plain headless Chromium due to WAF/bot protection). Parser logic confirmed working.
 */
export default function parse(element, { document }) {
  // Extract all slide images from the gallery list
  const slideItems = element.querySelectorAll('ul li');
  const descriptionEl = element.querySelector('.container-description .description, .description');

  const cells = [];

  slideItems.forEach((item, index) => {
    const img = item.querySelector('img');
    if (!img) return;

    if (index === 0 && descriptionEl) {
      // First row: image + shared description (h3, paragraphs)
      cells.push([img, descriptionEl]);
    } else {
      // Subsequent rows: image only
      cells.push([img]);
    }
  });

  // Fallback: if no list items found, try picture elements directly
  if (cells.length === 0) {
    const images = element.querySelectorAll('picture, img');
    images.forEach((img, index) => {
      if (index === 0 && descriptionEl) {
        cells.push([img, descriptionEl]);
      } else {
        cells.push([img]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'carousel-gallery', cells });
  element.replaceWith(block);
}
