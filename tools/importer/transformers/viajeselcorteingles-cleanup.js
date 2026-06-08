/* eslint-disable */
/* global WebImporter */

/**
 * Transformer: viajeselcorteingles cleanup
 * Removes non-authorable site chrome from viajeselcorteingles.es pages.
 * Selectors verified from live page DOM structure.
 */
const TransformHook = { beforeTransform: 'beforeTransform', afterTransform: 'afterTransform' };

export default function transform(hookName, element, payload) {
  if (hookName === TransformHook.beforeTransform) {
    // Remove cookie consent and overlay elements that may block parsing
    WebImporter.DOMUtils.remove(element, [
      '#onetrust-consent-sdk',
      '#CybotCookiebotDialog',
      '[class*="cookie"]',
      '.modal-overlay',
      '.modal-backdrop'
    ]);
  }

  if (hookName === TransformHook.afterTransform) {
    // Remove non-authorable site chrome: header, footer, navigation, breadcrumbs
    WebImporter.DOMUtils.remove(element, [
      'header',
      'footer',
      'nav',
      '.breadcrumb',
      '[class*="breadcrumb"]',
      '.site-header',
      '.site-footer',
      '#header',
      '#footer',
      'iframe',
      'link',
      'noscript',
      'script',
      'img[src*="bat.bing.net"]',
      'img[src*="tracking"]',
      'img[src*="pixel"]'
    ]);

    // Remove breadcrumb list (first ul with only li > a links at the top)
    const firstChild = element.querySelector(':scope > div > ul:first-child');
    if (firstChild) {
      const items = firstChild.querySelectorAll('li');
      const isNav = items.length <= 5 && Array.from(items).every(
        (li) => li.querySelector('a') || li.textContent.trim().length < 50
      );
      if (isNav) firstChild.remove();
    }

    // Remove tracking pixels and orphan "Tu opinión" text
    const allPs = element.querySelectorAll('p');
    allPs.forEach((p) => {
      const img = p.querySelector('img[src*="bat.bing.net"], img[src*="action/0"]');
      if (img) p.remove();
      if (p.textContent.trim() === 'Tu opinión') p.remove();
      if (p.textContent.trim() === 'X') p.remove();
    });
  }
}
