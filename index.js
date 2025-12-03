import path from "node:path";
import { load, render } from "goffre";
import { marked } from "marked";
import _ from "lodash";

const { json, pages } = await load();

const productionURL = "https://emmacampas.com";
const defaultLanguage = "en";
const languages = [...new Set(pages.map((x) => getLanguageFromSlug(x.slug)))];

const translate = (key, language) =>
  _.get(json.labels, `${language}.${key}`) || key;

const helpers = {
  translate,
  isHomepage: function (options) {
    return options.data.root.id === "homepage" ? options.fn(this) : "";
  },
  getNavLink: (id, options) => {
    const { language } = options.data.root;
    if (id === "homepage") {
      return language === defaultLanguage ? "/" : `/${language}`;
    }
    return language === defaultLanguage ? `/${id}` : `/${language}/${id}`;
  },
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
      <img alt="${img.alt}" src="../src/assets/${id}.webp?width=${img.width}" width="${img.width}"/>
      <figcaption>${img.credit}</figcaption>
    `;
  },
};

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
    title: `${translate("title", language)} - ${translate(
      "subtitle",
      language
    )}`,
    url: process.env.URL || productionURL,
    ...json,
  };
}

await render({
  buildPath: path.join(process.cwd(), "output"),
  pages: [
    ...languages.map(getHomepage),
    ...pages
      .map((x) => ({ ...x, language: getLanguageFromSlug(x.slug) }))
      .map((page) => ({
        ...page,
        slug:
          page.language === defaultLanguage
            ? removeLanguageFromSlug(page.slug)
            : page.slug,
        url: process.env.URL || productionURL,
        ...json,
      })),
  ],
  handlebars: {
    helpers,
  },
});
