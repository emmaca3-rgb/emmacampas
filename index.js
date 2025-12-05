import path from "node:path";
import { load, render } from "goffre";
import { marked } from "marked";
import _ from "lodash";

const { json, pages } = await load();

const url = process.env.URL || "https://emmacampas.com";
const defaultLanguage = "en";
const languages = [...new Set(pages.map((x) => getLanguageFromSlug(x.slug)))];

const helpers = {
  translate,
  getQuoteKey,
  getNavLink: (id, options) => {
    const { language } = options.data.root;
    let relativeLink = "";
    if (id === "homepage") {
      relativeLink = language === defaultLanguage ? "/" : `/${language}`;
    } else {
      relativeLink =
        language === defaultLanguage ? `/${id}` : `/${language}/${id}`;
    }
    return path.join(url, relativeLink);
  },
  getUrl: (slug, context) =>
    [context.data.root.url, slug].join("/").replace(/index$/, ""),
  markdown: (content) => marked(content),
  geLangClass: (language, currentLanguage) =>
    language === currentLanguage ? "current" : "",
  formatDate: (date, language = defaultLanguage) =>
    new Date(date).toLocaleDateString(`${language}-${language.toUpperCase()}`, {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  picture: (id) => {
    const img = json.images[id];
    if (!id) {
      return;
    }
    return `
      <img alt="${img.alt}" src="~/src/assets/${id}.webp?width=${img.width}" width="${img.width}"/>
      <figcaption>${img.credit}</figcaption>
    `;
  },
};

function getQuoteKey(index = 0, key, language) {
  return translate(`quotes.${index}.${key}`, language);
}

function translate(key, language) {
  return _.get(json.labels, `${language}.${key}`) || `${language}.${key}`;
}

function getLanguageFromSlug(slug = "") {
  return slug.split("/").at(0);
}

function removeLanguageFromSlug(slug = "") {
  return slug.split("/").slice(1).join("/");
}

function getHomepage(language) {
  return {
    id: "homepage",
    language,
    template: "index",
    slug: language === defaultLanguage ? "index" : language,
    title: translate("subtitle", language),
    description: translate("description", language),
    url,
    isHomepage: true,
    sitemap: {
      priority: 1,
    },
    ...json,
  };
}

await render({
  buildPath: path.join(process.cwd(), "output"),
  domain: url,
  pages: [
    ...languages.map(getHomepage),
    ...pages
      .map((x) => ({ ...x, language: getLanguageFromSlug(x.slug) }))
      .map((page) => ({
        sitemap: {
          changefreq: "monthly",
          priority: 0.8,
        },
        ...page,
        slug:
          page.language === defaultLanguage
            ? removeLanguageFromSlug(page.slug)
            : page.slug,
        url,
        ...json,
      })),
  ],
  sitemap: {
    generate: true,
  },
  handlebars: {
    helpers,
  },
});
