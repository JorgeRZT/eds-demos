/* eslint-disable */
/* global WebImporter */

/**
 * Parser for hero-destination
 * Base block: hero
 * Source: https://www.viajeselcorteingles.es/grandes-viajes/destinos/egipto
 * Selector: .header-block
 * Generated: 2026-06-08
 *
 * Source structure:
 *   .header-block
 *     .content-title-page > .content-text > h1 (heading)
 *     .content-title-page > .content-text > p (description)
 *     .mod-full-header > figure > picture > img (hero image)
 *
 * Target structure (from block library):
 *   Row 1: Background/hero image
 *   Row 2: Heading (h1)
 *   Row 3: Description text
 *   Row 4: CTA button (optional - not present in current source)
 */
export default function parse(element, { document }) {
  // Extract hero image - prefer data-src/data-original over src (lazy-load sites)
  let heroImage = element.querySelector('.mod-full-header figure picture, .mod-full-header figure img, .mod-full-header img');

  // If the img is a lazy-load placeholder, look for the real src
  if (heroImage && heroImage.tagName === 'IMG') {
    const realSrc = heroImage.getAttribute('data-src')
      || heroImage.getAttribute('data-original')
      || heroImage.getAttribute('data-lazy-src');
    if (realSrc) {
      heroImage.setAttribute('src', realSrc);
    } else if (heroImage.src && heroImage.src.includes('agenteLoading')) {
      // Fallback: find any img with destination-specific URL in the element
      const allImgs = element.querySelectorAll('img');
      for (const img of allImgs) {
        const src = img.getAttribute('data-src') || img.src;
        if (src && !src.includes('agenteLoading') && !src.includes('loading')) {
          heroImage = img;
          break;
        }
      }
    }
  }

  // Extract heading from .content-title-page
  const heading = element.querySelector('.content-title-page .content-text h1, .content-title-page h1, .content-text h1, h1');

  // Extract description from .content-title-page
  const description = element.querySelector('.content-title-page .content-text p, .content-text p, .content-title-page p');

  // Extract optional CTA links
  const ctaLinks = Array.from(element.querySelectorAll('.content-title-page a, .content-text a'));

  // Build cells array matching block library structure
  const cells = [];

  // Row 1: Hero/background image
  if (heroImage) {
    cells.push([heroImage]);
  }

  // Row 2+: Content cell with heading, description, and optional CTAs
  const contentCell = [];
  if (heading) contentCell.push(heading);
  if (description) contentCell.push(description);
  if (ctaLinks.length > 0) contentCell.push(...ctaLinks);

  if (contentCell.length > 0) {
    cells.push(contentCell);
  }

  const block = WebImporter.Blocks.createBlock(document, { name: 'hero-destination', cells });
  element.replaceWith(block);
}
