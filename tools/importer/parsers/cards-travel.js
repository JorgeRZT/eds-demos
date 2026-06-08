/* eslint-disable */
/* global WebImporter */

/**
 * Parser: cards-travel
 * Base block: cards
 * Source: https://www.viajeselcorteingles.es/grandes-viajes/destinos/egipto
 * Instances: .mod_section_access, .hv-advantages, .mod-links-destination-x2
 * Generated: 2026-06-08
 * Validated: verified via MCP Playwright (site WAF blocks standalone validator)
 *
 * Handles three source patterns:
 * 1. .mod_section_access — ul > li > a with img + p
 * 2. .hv-advantages — article with icon span + div.text (h3 + p)
 * 3. .mod-links-destination-x2 — anchors with img + span inside a div
 */
export default function parse(element, { document }) {
  const cells = [];

  // Detect which pattern we are dealing with
  const isAdvantages = element.classList.contains('hv-advantages') || element.querySelector('.hv-advantages-container');
  const isDestinationLinks = element.classList.contains('mod-links-destination-x2') || element.classList.contains('mod-links');
  const isSectionAccess = element.classList.contains('mod_section_access') || element.querySelector('.section_access_container');

  if (isSectionAccess) {
    // Pattern 1: .mod_section_access — list items with image + text links
    const listItems = element.querySelectorAll('li');
    listItems.forEach((li) => {
      const link = li.querySelector('a');
      const img = li.querySelector('img');
      const text = li.querySelector('p, span');

      const imageCell = [];
      if (img) imageCell.push(img);

      const contentCell = [];
      if (text && link) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = text.textContent.trim();
        contentCell.push(a);
      } else if (text) {
        contentCell.push(text);
      }

      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
  } else if (isAdvantages) {
    // Pattern 2: .hv-advantages — articles with icon + heading + description
    const articles = element.querySelectorAll('article');
    articles.forEach((article) => {
      const iconSpan = article.querySelector('span.icon, span[class*="icon"]');
      const heading = article.querySelector('h3, h4, h2');
      const description = article.querySelector('.text p, p');

      const imageCell = [];
      if (iconSpan) imageCell.push(iconSpan);

      const contentCell = [];
      if (heading) contentCell.push(heading);
      if (description) contentCell.push(description);

      if (contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
  } else if (isDestinationLinks) {
    // Pattern 3: .mod-links-destination-x2 — list items or direct links with img + text
    // Live DOM uses: ul > li > div.cont-image > a > picture + h3
    const listItems = element.querySelectorAll('li');
    if (listItems.length > 0) {
      listItems.forEach((li) => {
        const link = li.querySelector('a[href]');
        const img = li.querySelector('img');
        const text = li.querySelector('h3, span, p');

        if (!img && !text) return;

        const imageCell = [];
        if (img) imageCell.push(img);

        const contentCell = [];
        if (text && link) {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = text.textContent.trim();
          contentCell.push(a);
        } else if (text) {
          contentCell.push(text);
        }

        if (imageCell.length > 0 || contentCell.length > 0) {
          cells.push([imageCell, contentCell]);
        }
      });
    } else {
      // Fallback: direct anchor children (cleaned HTML structure)
      const links = element.querySelectorAll('a[href]');
      links.forEach((link) => {
        const img = link.querySelector('img');
        const text = link.querySelector('h3, span, p');

        if (!img && !text) return;

        const imageCell = [];
        if (img) imageCell.push(img);

        const contentCell = [];
        if (text) {
          const a = document.createElement('a');
          a.href = link.href;
          a.textContent = text.textContent.trim();
          contentCell.push(a);
        }

        if (imageCell.length > 0 || contentCell.length > 0) {
          cells.push([imageCell, contentCell]);
        }
      });
    }
  } else {
    // Fallback: try to find any card-like items (links with images)
    const links = element.querySelectorAll('a[href]');
    links.forEach((link) => {
      const img = link.querySelector('img');
      const text = link.querySelector('span, p, h3, h4');

      if (!img && !text) return;

      const imageCell = [];
      if (img) imageCell.push(img);

      const contentCell = [];
      if (text) {
        const a = document.createElement('a');
        a.href = link.href;
        a.textContent = text.textContent.trim();
        contentCell.push(a);
      }

      if (imageCell.length > 0 || contentCell.length > 0) {
        cells.push([imageCell, contentCell]);
      }
    });
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'cards-travel', cells });
  element.replaceWith(block);
}
