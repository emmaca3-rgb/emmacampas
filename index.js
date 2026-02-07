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
    ? `http://localhost:${process.env.PORT || 1234}`
    : process.env.URL || pkg.homepage;

const defaultLanguage = "en";
const languages = [...new Set(data.pages.map((x) => x.language))];

const sortedDates = data.events.toSorted((a, b) =>
  new Date(a.date) < new Date(b.date) ? 1 : -1,
);

const additionalData = {
  version: process.env.VERSION,
  thisYear: new Date().getFullYear(),
  url,
  dates: sortedDates,
  nextDates: sortedDates
    .filter((x) => new Date(x.date) > new Date())
    .slice(0, 5),
  pastDates: sortedDates.filter((x) => new Date(x.date) < new Date()),
  labels,
  navigation: ["index", "about", "dates", "media", "contact"],
  socialMediaCover: data.homepage.socialMediaCover,
  gallery: data.gallery,
  links: data.homepage.links,
};

const renderer = {
  paragraph: (token) =>
    token.startsWith("<figure") ? token : `<p>${token}</p>`,
};

marked.use(renderer);

function formatUrl({ slug, url, language }) {
  return [
    url,
    language === defaultLanguage || slug.startsWith(language) ? null : language,
    slug,
  ]
    .filter(Boolean)
    .join("/")
    .replace(/\/index$/, "");
}

const helpers = {
  translate,
  translateSanity,
  isLandscape: (ratio) => ratio > 1,
  getUrl: (pageSlug, context) =>
    formatUrl({ ...context.data.root, slug: pageSlug }),
  markdown: (content) => marked(content),
  getNavLabel: (section, context) =>
    translate(`sections.${section}`, context.data.root.language),
  geLangClass: (language, context) =>
    language === context.data.root.language ? "current" : "",
  getNavClass: (pageSlug, context) => {
    const url = formatUrl(context.data.root);
    const { slug, language } = context.data.root;
    if (language === defaultLanguage && pageSlug.endsWith("index")) {
      return slug === pageSlug ? "current" : "";
    }
    const currentPageSlug = pageSlug.replace(/index$/, "");
    return url.endsWith(
      !currentPageSlug ? context.data.root.language : currentPageSlug,
    )
      ? "current"
      : "";
  },
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

function getHomepage(language) {
  return {
    id: "homepage",
    language,
    template: "index",
    slug: language === defaultLanguage ? "index" : language,
    title: translate("subtitle", language),
    description: translate("description", language),
    isHomepage: true,
    sitemap: {
      priority: 1,
    },
    ...additionalData,
    ...data.homepage,
  };
}

await render({
  buildPath: path.join(process.cwd(), "output"),
  domain: url,
  pages: [
    ...languages.map(getHomepage),
    ...data.pages.map((page) => ({
      ...page,
      ...additionalData,
      sitemap: {
        changefreq: "monthly",
        priority: 0.8,
      },
      template: page.id === "about" ? null : page.id,
      slug: (({ language, id, slug }) => {
        if (language === defaultLanguage) {
          return id;
        }
        return slug || `${language}/${id}`;
      })(page),
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
