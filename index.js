import path from "node:path";
import { render } from "@moonwave99/goffre";
import { marked } from "marked";
import _ from "lodash";
import { getData, translate as translateSanity } from "./sanity.js";
import pkg from "./package.json" with { type: "json" };
import labels from "./labels.json" with { type: "json" };

const data = await getData({ cached: true });

const url =
  process.env.NODE_ENV === "dev"
    ? "http://localhost:1234"
    : process.env.URL || pkg.homepage;

const thisYear = new Date().getFullYear();
const defaultLanguage = "en";
const languages = [...new Set(data.pages.map((x) => x.language))];

const sortedDates = data.events.toSorted((a, b) =>
  new Date(a.date) < new Date(b.date) ? 1 : -1,
);

const nextDates = sortedDates
  .filter((x) => new Date(x.date) > new Date())
  .slice(0, 5);

const pastDates = sortedDates.filter((x) => new Date(x.date) < new Date());

const renderer = {
  paragraph: (token) => {
    if (token.startsWith("<figure")) {
      return token;
    }
    return `<p>${token}</p>`;
  },
};

marked.use(renderer);

const helpers = {
  translate,
  translateSanity,
  getNavLink: (id, options) => {
    const { language } = options.data.root;
    if (id === "homepage") {
      return language === defaultLanguage ? "/" : `/${language}`;
    }
    return language === defaultLanguage ? `/${id}` : `/${language}/${id}`;
  },
  isLandscape: (ratio) => ratio > 1,
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
};

function translate(key, language) {
  return _.get(labels, `${language}.${key}`) || `${language}.${key}`;
}

function getTemplate(page) {
  if (page.id === "about") {
    return null;
  }
  return page.id;
}

function getHomepage(language) {
  return {
    id: "homepage",
    language,
    template: "index",
    slug: language === defaultLanguage ? "index" : language,
    title: translate("subtitle", language),
    description: translate("description", language),
    thisYear,
    url,
    isHomepage: true,
    sitemap: {
      priority: 1,
    },
    nextDates,
    labels,
    ...data.homepage,
  };
}

function getPageSlug(page) {
  if (page.language === defaultLanguage) {
    return page.id;
  }
  return page.slug || `${page.language}/${page.id}`;
}

await render({
  buildPath: path.join(process.cwd(), "output"),
  domain: url,
  pages: [
    ...languages.map(getHomepage),
    ...data.pages.map((page) => ({
      sitemap: {
        changefreq: "monthly",
        priority: 0.8,
      },
      ...page,
      thisYear,
      url,
      template: getTemplate(page),
      slug: getPageSlug(page),
      labels,
      dates: sortedDates,
      pastDates,
      nextDates,
      gallery: data.gallery,
      links: data.homepage.links,
      socialMediaCover: data.homepage.socialMediaCover,
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
