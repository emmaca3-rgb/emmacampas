import path from "node:path";
import { load, render } from "goffre";
import { marked } from "marked";
import _ from "lodash";

const { json, pages } = await load();
const { pages: homePage } = await load({
  dataPath: "./homepage",
});

const url =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:1234"
    : process.env.URL || "https://emmacampas.com";
const defaultLanguage = "en";
const languages = [...new Set(pages.map((x) => getLanguageFromSlug(x.slug)))];

const sortedDates = json.dates.toSorted((a, b) =>
  new Date(a.date) < new Date(b.date) ? 1 : -1
);

const nextDates = sortedDates
  .filter((x) => new Date(x.date) > new Date())
  .slice(0, 5);

const pastDates = sortedDates.filter((x) => new Date(x.date) < new Date());

const renderer = {
  image: (token) => {
    const img = json.images[path.basename(token, path.extname(token))];
    if (!img) {
      return "";
    }
    return `<figure class="figure">
          <img src="~/src/assets/${token}" width="${img.width}" alt="${img.alt}"/>
          <figcaption>${img.credit}</figcaption>
        </figure>`;
  },
  paragraph: (token) => {
    if (token.startsWith("<figure")) {
      return token;
    }
    return `<p>${token}</p>`;
  },
};

const helpers = {
  translate,
  getQuoteKey,
  getNavLink: (id, options) => {
    const { language } = options.data.root;
    if (id === "homepage") {
      return language === defaultLanguage ? "/" : `/${language}`;
    }
    return language === defaultLanguage ? `/${id}` : `/${language}/${id}`;
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
    nextDates,
    video: json.videos.filter((x) => !!x.homepage),
    about: homePage.find((x) => getLanguageFromSlug(x.slug) === language),
    ...json,
  };
}

function getDescription(page) {
  if (page.excerpt?.startsWith("<")) {
    return page.content
      .split("\n")
      .filter(Boolean)
      .filter((x) => !x.startsWith("<"))
      .at(0);
  }
  return page.description || page.excerpt;
}

await render({
  buildPath: path.join(process.cwd(), "output"),
  domain: url,
  pages: [
    ...languages.map(getHomepage),
    ...pages
      .map((x) => ({
        ...x,
        language: getLanguageFromSlug(x.slug),
      }))
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
        description: getDescription(page),
        ...json,
        dates: sortedDates,
        pastDates,
        nextDates,
      })),
  ],
  sitemap: {
    generate: true,
  },
  handlebars: {
    helpers,
  },
  markdown: {
    renderer,
  },
});
