/* eslint-disable */
var CustomImportScript = (() => {
  var __defProp = Object.defineProperty;
  var __defProps = Object.defineProperties;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getOwnPropSymbols = Object.getOwnPropertySymbols;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __propIsEnum = Object.prototype.propertyIsEnumerable;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __spreadValues = (a, b) => {
    for (var prop in b || (b = {}))
      if (__hasOwnProp.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    if (__getOwnPropSymbols)
      for (var prop of __getOwnPropSymbols(b)) {
        if (__propIsEnum.call(b, prop))
          __defNormalProp(a, prop, b[prop]);
      }
    return a;
  };
  var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

  // tools/importer/import-destination-page.js
  var import_destination_page_exports = {};
  __export(import_destination_page_exports, {
    default: () => import_destination_page_default
  });

  // tools/importer/parsers/hero-destination.js
  function parse(element, { document: document2 }) {
    let heroImage = element.querySelector(".mod-full-header figure picture, .mod-full-header figure img, .mod-full-header img");
    if (heroImage && heroImage.tagName === "IMG") {
      const realSrc = heroImage.getAttribute("data-src") || heroImage.getAttribute("data-original") || heroImage.getAttribute("data-lazy-src");
      if (realSrc) {
        heroImage.setAttribute("src", realSrc);
      } else if (heroImage.src && heroImage.src.includes("agenteLoading")) {
        const allImgs = element.querySelectorAll("img");
        for (const img of allImgs) {
          const src = img.getAttribute("data-src") || img.src;
          if (src && !src.includes("agenteLoading") && !src.includes("loading")) {
            heroImage = img;
            break;
          }
        }
      }
    }
    const heading = element.querySelector(".content-title-page .content-text h1, .content-title-page h1, .content-text h1, h1");
    const description = element.querySelector(".content-title-page .content-text p, .content-text p, .content-title-page p");
    const ctaLinks = Array.from(element.querySelectorAll(".content-title-page a, .content-text a"));
    const cells = [];
    if (heroImage) {
      cells.push([heroImage]);
    }
    const contentCell = [];
    if (heading) contentCell.push(heading);
    if (description) contentCell.push(description);
    if (ctaLinks.length > 0) contentCell.push(...ctaLinks);
    if (contentCell.length > 0) {
      cells.push(contentCell);
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "hero-destination", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/cards-travel.js
  function parse2(element, { document: document2 }) {
    const cells = [];
    const isAdvantages = element.classList.contains("hv-advantages") || element.querySelector(".hv-advantages-container");
    const isDestinationLinks = element.classList.contains("mod-links-destination-x2") || element.classList.contains("mod-links");
    const isSectionAccess = element.classList.contains("mod_section_access") || element.querySelector(".section_access_container");
    if (isSectionAccess) {
      const listItems = element.querySelectorAll("li");
      listItems.forEach((li) => {
        const link = li.querySelector("a");
        const img = li.querySelector("img");
        const text = li.querySelector("p, span");
        const imageCell = [];
        if (img) imageCell.push(img);
        const contentCell = [];
        if (text && link) {
          const a = document2.createElement("a");
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
      const articles = element.querySelectorAll("article");
      articles.forEach((article) => {
        const iconSpan = article.querySelector('span.icon, span[class*="icon"]');
        const heading = article.querySelector("h3, h4, h2");
        const description = article.querySelector(".text p, p");
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
      const listItems = element.querySelectorAll("li");
      if (listItems.length > 0) {
        listItems.forEach((li) => {
          const link = li.querySelector("a[href]");
          const img = li.querySelector("img");
          const text = li.querySelector("h3, span, p");
          if (!img && !text) return;
          const imageCell = [];
          if (img) imageCell.push(img);
          const contentCell = [];
          if (text && link) {
            const a = document2.createElement("a");
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
        const links = element.querySelectorAll("a[href]");
        links.forEach((link) => {
          const img = link.querySelector("img");
          const text = link.querySelector("h3, span, p");
          if (!img && !text) return;
          const imageCell = [];
          if (img) imageCell.push(img);
          const contentCell = [];
          if (text) {
            const a = document2.createElement("a");
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
      const links = element.querySelectorAll("a[href]");
      links.forEach((link) => {
        const img = link.querySelector("img");
        const text = link.querySelector("span, p, h3, h4");
        if (!img && !text) return;
        const imageCell = [];
        if (img) imageCell.push(img);
        const contentCell = [];
        if (text) {
          const a = document2.createElement("a");
          a.href = link.href;
          a.textContent = text.textContent.trim();
          contentCell.push(a);
        }
        if (imageCell.length > 0 || contentCell.length > 0) {
          cells.push([imageCell, contentCell]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "cards-travel", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/carousel-gallery.js
  function parse3(element, { document: document2 }) {
    const slideItems = element.querySelectorAll("ul li");
    const descriptionEl = element.querySelector(".container-description .description, .description");
    const cells = [];
    slideItems.forEach((item, index) => {
      const img = item.querySelector("img");
      if (!img) return;
      if (index === 0 && descriptionEl) {
        cells.push([img, descriptionEl]);
      } else {
        cells.push([img]);
      }
    });
    if (cells.length === 0) {
      const images = element.querySelectorAll("picture, img");
      images.forEach((img, index) => {
        if (index === 0 && descriptionEl) {
          cells.push([img, descriptionEl]);
        } else {
          cells.push([img]);
        }
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "carousel-gallery", cells });
    element.replaceWith(block);
  }

  // tools/importer/parsers/accordion-travel.js
  function parse4(element, { document: document2 }) {
    const contentContainer = element.querySelector(".content-mod-info");
    const cells = [];
    if (contentContainer) {
      const accordionItems = contentContainer.querySelectorAll(":scope > .module.mod-info");
      accordionItems.forEach((item) => {
        const title = item.querySelector("h2");
        if (!title) return;
        const contentDiv = item.querySelector(".content-mod-info");
        cells.push([title, contentDiv || ""]);
      });
    }
    const block = WebImporter.Blocks.createBlock(document2, { name: "accordion-travel", cells });
    element.replaceWith(block);
  }

  // tools/importer/transformers/viajeselcorteingles-cleanup.js
  var TransformHook = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform(hookName, element, payload) {
    if (hookName === TransformHook.beforeTransform) {
      WebImporter.DOMUtils.remove(element, [
        "#onetrust-consent-sdk",
        "#CybotCookiebotDialog",
        '[class*="cookie"]',
        ".modal-overlay",
        ".modal-backdrop"
      ]);
    }
    if (hookName === TransformHook.afterTransform) {
      WebImporter.DOMUtils.remove(element, [
        "header",
        "footer",
        "nav",
        ".breadcrumb",
        '[class*="breadcrumb"]',
        ".site-header",
        ".site-footer",
        "#header",
        "#footer",
        "iframe",
        "link",
        "noscript",
        "script",
        'img[src*="bat.bing.net"]',
        'img[src*="tracking"]',
        'img[src*="pixel"]'
      ]);
      const firstChild = element.querySelector(":scope > div > ul:first-child");
      if (firstChild) {
        const items = firstChild.querySelectorAll("li");
        const isNav = items.length <= 5 && Array.from(items).every(
          (li) => li.querySelector("a") || li.textContent.trim().length < 50
        );
        if (isNav) firstChild.remove();
      }
      const allPs = element.querySelectorAll("p");
      allPs.forEach((p) => {
        const img = p.querySelector('img[src*="bat.bing.net"], img[src*="action/0"]');
        if (img) p.remove();
        if (p.textContent.trim() === "Tu opini\xF3n") p.remove();
        if (p.textContent.trim() === "X") p.remove();
      });
    }
  }

  // tools/importer/transformers/viajeselcorteingles-sections.js
  var TransformHook2 = { beforeTransform: "beforeTransform", afterTransform: "afterTransform" };
  function transform2(hookName, element, payload) {
    if (hookName === TransformHook2.afterTransform) {
      const { template } = payload;
      if (!template || !template.sections || template.sections.length < 2) return;
      const doc = payload.document || element.ownerDocument || document;
      const selectorUsageCount = {};
      const sections = [...template.sections].reverse();
      sections.forEach((section, reverseIndex) => {
        const isFirst = reverseIndex === template.sections.length - 1;
        const selector = Array.isArray(section.selector) ? section.selector[0] : section.selector;
        let sectionEl = null;
        const originalIndex = template.sections.length - 1 - reverseIndex;
        let occurrenceIndex = 0;
        for (let i = 0; i < originalIndex; i++) {
          const prevSelector = Array.isArray(template.sections[i].selector) ? template.sections[i].selector[0] : template.sections[i].selector;
          if (prevSelector === selector) {
            occurrenceIndex++;
          }
        }
        const allMatches = element.querySelectorAll(selector);
        if (allMatches.length > occurrenceIndex) {
          sectionEl = allMatches[occurrenceIndex];
        }
        if (!sectionEl) return;
        if (section.style) {
          const sectionMetadataBlock = WebImporter.Blocks.createBlock(doc, {
            name: "Section Metadata",
            cells: { style: section.style }
          });
          sectionEl.after(sectionMetadataBlock);
        }
        if (!isFirst) {
          const hr = doc.createElement("hr");
          sectionEl.before(hr);
        }
      });
    }
  }

  // tools/importer/import-destination-page.js
  var parsers = {
    "hero-destination": parse,
    "cards-travel": parse2,
    "carousel-gallery": parse3,
    "accordion-travel": parse4
  };
  var transformers = [
    transform,
    transform2
  ];
  var PAGE_TEMPLATE = {
    name: "destination-page",
    description: "Travel destination page showcasing trip packages, highlights, and booking options for a specific destination",
    urls: [
      "https://www.viajeselcorteingles.es/grandes-viajes/destinos/egipto"
    ],
    blocks: [
      {
        name: "hero-destination",
        instances: [".header-block"]
      },
      {
        name: "cards-travel",
        instances: [".mod_section_access", ".hv-advantages", ".mod-links-destination-x2"]
      },
      {
        name: "carousel-gallery",
        instances: [".thumbnail-module"]
      },
      {
        name: "accordion-travel",
        instances: [".row > .column > .module.mod-info"]
      }
    ],
    sections: [
      {
        id: "section-1",
        name: "Hero Banner",
        selector: ".row.full-landing",
        style: null,
        blocks: ["hero-destination"],
        defaultContent: []
      },
      {
        id: "section-2",
        name: "CTA Banner",
        selector: "#modAdviseme",
        style: "highlight",
        blocks: [],
        defaultContent: ["#modAdviseme h2", "#modAdviseme p", "#modAdviseme .content-button a"]
      },
      {
        id: "section-3",
        name: "Formas de viajar",
        selector: ".mod_section_access",
        style: "grey",
        blocks: ["cards-travel"],
        defaultContent: [".mod_section_access header h2", ".mod_section_access header p"]
      },
      {
        id: "section-4",
        name: "Advantages",
        selector: ".hv-advantages",
        style: null,
        blocks: ["cards-travel"],
        defaultContent: [".hv-advantages header h2"]
      },
      {
        id: "section-5",
        name: "Image Carousel",
        selector: ".thumbnail-module",
        style: null,
        blocks: ["carousel-gallery"],
        defaultContent: []
      },
      {
        id: "section-6",
        name: "Que ver en Egipto",
        selector: [".row > .column > .module.mod-info:has(> h2:first-child)"],
        style: null,
        blocks: ["accordion-travel"],
        defaultContent: []
      },
      {
        id: "section-7",
        name: "Donde alojarse",
        selector: [".row > .column > .module.mod-info:has(> h2:first-child)"],
        style: "grey",
        blocks: ["accordion-travel"],
        defaultContent: []
      },
      {
        id: "section-8",
        name: "Informacion util",
        selector: [".row > .column > .module.mod-info:has(> h2:first-child)"],
        style: null,
        blocks: ["accordion-travel"],
        defaultContent: []
      },
      {
        id: "section-9",
        name: "Otros destinos destacados",
        selector: ".mod-links-destination-x2",
        style: null,
        blocks: ["cards-travel"],
        defaultContent: [".mod-links-destination-x2 h2"]
      }
    ]
  };
  function executeTransformers(hookName, element, payload) {
    const enhancedPayload = __spreadProps(__spreadValues({}, payload), { template: PAGE_TEMPLATE });
    transformers.forEach((transformerFn) => {
      try {
        transformerFn.call(null, hookName, element, enhancedPayload);
      } catch (e) {
        console.error(`Transformer failed at ${hookName}:`, e);
      }
    });
  }
  function findBlocksOnPage(document2, template) {
    const pageBlocks = [];
    template.blocks.forEach((blockDef) => {
      blockDef.instances.forEach((selector) => {
        const elements = document2.querySelectorAll(selector);
        elements.forEach((element) => {
          pageBlocks.push({
            name: blockDef.name,
            selector,
            element
          });
        });
      });
    });
    return pageBlocks;
  }
  var import_destination_page_default = {
    transform: (payload) => {
      const { document: document2, url, params } = payload;
      const main = document2.body;
      executeTransformers("beforeTransform", main, payload);
      const pageBlocks = findBlocksOnPage(document2, PAGE_TEMPLATE);
      pageBlocks.forEach((block) => {
        const parser = parsers[block.name];
        if (parser) {
          try {
            parser(block.element, { document: document2, url, params });
          } catch (e) {
            console.error(`Failed to parse ${block.name} (${block.selector}):`, e);
          }
        }
      });
      executeTransformers("afterTransform", main, payload);
      const hr = document2.createElement("hr");
      main.appendChild(hr);
      WebImporter.rules.createMetadata(main, document2);
      WebImporter.rules.transformBackgroundImages(main, document2);
      WebImporter.rules.adjustImageUrls(main, url, params.originalURL);
      const path = WebImporter.FileUtils.sanitizePath(
        new URL(params.originalURL).pathname.replace(/\/$/, "").replace(/\.html$/, "")
      );
      return [{
        element: main,
        path,
        report: {
          title: document2.title,
          template: PAGE_TEMPLATE.name,
          blocks: pageBlocks.map((b) => b.name)
        }
      }];
    }
  };
  return __toCommonJS(import_destination_page_exports);
})();
