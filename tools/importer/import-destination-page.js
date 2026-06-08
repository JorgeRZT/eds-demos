/* eslint-disable */
/* global WebImporter */

// PARSER IMPORTS
import heroDestinationParser from './parsers/hero-destination.js';
import cardsTravelParser from './parsers/cards-travel.js';
import carouselGalleryParser from './parsers/carousel-gallery.js';
import accordionTravelParser from './parsers/accordion-travel.js';

// TRANSFORMER IMPORTS
import cleanupTransformer from './transformers/viajeselcorteingles-cleanup.js';
import sectionsTransformer from './transformers/viajeselcorteingles-sections.js';

// PARSER REGISTRY
const parsers = {
  'hero-destination': heroDestinationParser,
  'cards-travel': cardsTravelParser,
  'carousel-gallery': carouselGalleryParser,
  'accordion-travel': accordionTravelParser,
};

// TRANSFORMER REGISTRY
const transformers = [
  cleanupTransformer,
  sectionsTransformer,
];

// PAGE TEMPLATE CONFIGURATION
const PAGE_TEMPLATE = {
  name: 'destination-page',
  description: 'Travel destination page showcasing trip packages, highlights, and booking options for a specific destination',
  urls: [
    'https://www.viajeselcorteingles.es/grandes-viajes/destinos/egipto',
  ],
  blocks: [
    {
      name: 'hero-destination',
      instances: ['.header-block'],
    },
    {
      name: 'cards-travel',
      instances: ['.mod_section_access', '.hv-advantages', '.mod-links-destination-x2'],
    },
    {
      name: 'carousel-gallery',
      instances: ['.thumbnail-module'],
    },
    {
      name: 'accordion-travel',
      instances: ['.row > .column > .module.mod-info'],
    },
  ],
  sections: [
    {
      id: 'section-1',
      name: 'Hero Banner',
      selector: '.row.full-landing',
      style: null,
      blocks: ['hero-destination'],
      defaultContent: [],
    },
    {
      id: 'section-2',
      name: 'CTA Banner',
      selector: '#modAdviseme',
      style: 'highlight',
      blocks: [],
      defaultContent: ['#modAdviseme h2', '#modAdviseme p', '#modAdviseme .content-button a'],
    },
    {
      id: 'section-3',
      name: 'Formas de viajar',
      selector: '.mod_section_access',
      style: 'grey',
      blocks: ['cards-travel'],
      defaultContent: ['.mod_section_access header h2', '.mod_section_access header p'],
    },
    {
      id: 'section-4',
      name: 'Advantages',
      selector: '.hv-advantages',
      style: null,
      blocks: ['cards-travel'],
      defaultContent: ['.hv-advantages header h2'],
    },
    {
      id: 'section-5',
      name: 'Image Carousel',
      selector: '.thumbnail-module',
      style: null,
      blocks: ['carousel-gallery'],
      defaultContent: [],
    },
    {
      id: 'section-6',
      name: 'Que ver en Egipto',
      selector: ['.row > .column > .module.mod-info:has(> h2:first-child)'],
      style: null,
      blocks: ['accordion-travel'],
      defaultContent: [],
    },
    {
      id: 'section-7',
      name: 'Donde alojarse',
      selector: ['.row > .column > .module.mod-info:has(> h2:first-child)'],
      style: 'grey',
      blocks: ['accordion-travel'],
      defaultContent: [],
    },
    {
      id: 'section-8',
      name: 'Informacion util',
      selector: ['.row > .column > .module.mod-info:has(> h2:first-child)'],
      style: null,
      blocks: ['accordion-travel'],
      defaultContent: [],
    },
    {
      id: 'section-9',
      name: 'Otros destinos destacados',
      selector: '.mod-links-destination-x2',
      style: null,
      blocks: ['cards-travel'],
      defaultContent: ['.mod-links-destination-x2 h2'],
    },
  ],
};

/**
 * Execute all page transformers for a specific hook
 */
function executeTransformers(hookName, element, payload) {
  const enhancedPayload = { ...payload, template: PAGE_TEMPLATE };
  transformers.forEach((transformerFn) => {
    try {
      transformerFn.call(null, hookName, element, enhancedPayload);
    } catch (e) {
      console.error(`Transformer failed at ${hookName}:`, e);
    }
  });
}

/**
 * Find all blocks on the page based on the embedded template configuration
 */
function findBlocksOnPage(document, template) {
  const pageBlocks = [];
  template.blocks.forEach((blockDef) => {
    blockDef.instances.forEach((selector) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        pageBlocks.push({
          name: blockDef.name,
          selector,
          element,
        });
      });
    });
  });
  return pageBlocks;
}

export default {
  transform: (payload) => {
    const { document, url, params } = payload;
    const main = document.body;

    // 1. Execute beforeTransform transformers (initial cleanup)
    executeTransformers('beforeTransform', main, payload);

    // 2. Find blocks on page using embedded template
    const pageBlocks = findBlocksOnPage(document, PAGE_TEMPLATE);

    // 3. Parse each block using registered parsers
    pageBlocks.forEach((block) => {
      const parser = parsers[block.name];
      if (parser) {
        try {
          parser(block.element, { document, url, params });
        } catch (e) {
          console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
        }
      }
    });

    // 4. Execute afterTransform transformers (final cleanup + section breaks/metadata)
    executeTransformers('afterTransform', main, payload);

    // 5. Apply WebImporter built-in rules
    const hr = document.createElement('hr');
    main.appendChild(hr);
    WebImporter.rules.createMetadata(main, document);
    WebImporter.rules.transformBackgroundImages(main, document);
    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    // 6. Generate sanitized path
    const path = WebImporter.FileUtils.sanitizePath(
      new URL(params.originalURL).pathname.replace(/\/$/, '').replace(/\.html$/, ''),
    );

    return [{
      element: main,
      path,
      report: {
        title: document.title,
        template: PAGE_TEMPLATE.name,
        blocks: pageBlocks.map((b) => b.name),
      },
    }];
  },
};
