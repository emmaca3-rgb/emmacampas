import path from "node:path";
import { load, render } from "goffre";
import { marked } from "marked";
import _ from "lodash";

const { json, pages } = await load();

const byLanguage = pages.reduce((memo, page) => {
  const [language, id] = page.slug.split("/");
  return {
    ...memo,
    [language]: memo[language]
      ? { ...memo[language], [id]: page }
      : { [id]: page },
  };
}, {});

const translate = (key, language) =>
  _.get(json.labels, `${language}.${key}`) || key;

const helpers = {
  translate,
  markdown: (content) => marked(content),
  geLangClass: (language, currentLanguage) =>
    language === currentLanguage ? "current" : "",
  formatDate: (date, language) =>
    new Date(date).toLocaleDateString(
      language ? `${language}-${language.toUpperCase()}` : "en-EN",
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    ),
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

await render({
  buildPath: path.join(process.cwd(), "output"),
  pages: Object.entries(byLanguage).map(([language, sections]) => ({
    slug: language === "en" ? "index" : language,
    title: `${translate("title", language)} - ${translate(
      "subtitle",
      language
    )}`,
    language,
    sections,
    url: process.env.URL || "https://emmacampas.com",
    ...json,
  })),
  handlebars: {
    helpers,
  },
});
