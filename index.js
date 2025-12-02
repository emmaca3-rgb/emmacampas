import path from "node:path";
import { load, render } from "goffre";
import { marked } from "marked";
import _ from "lodash";

const { json, pages } = await load();

const productionURL = "https://emmacampas.com";
const languages = ["en", "es", "de", "ca"];
const defaultLanguage = languages.at(0);

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

function getContactPage(language) {
  return {
    id: "contact",
    language,
    slug: language === defaultLanguage ? "contact" : `${language}/contact`,
    title: translate("sections.contact", language),
    template: "contact",
    url: process.env.URL || productionURL,
    ...json,
  };
}

await render({
  buildPath: path.join(process.cwd(), "output"),
  pages: [
    ...languages.map(getHomepage),
    // ...languages.map(getContactPage),
    ...pages
      .map((x) => ({ ...x, language: getLanguageFromSlug(x.slug) }))
      .map((page) => ({
        ...page,
        slug:
          page.language === defaultLanguage
            ? page.slug.split("/").slice(1).join("/")
            : page.slug,
        url: process.env.URL || productionURL,
        ...json,
      })),
  ],
  handlebars: {
    helpers,
  },
});
