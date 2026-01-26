import { createClient } from "@sanity/client";
import fs from "node:fs/promises";
import config from "./sanity.json" with { type: "json" };

let client = null;

function getClient() {
  if (client) {
    return client;
  }
  client = client = createClient({
    useCdn: false,
    ...config,
    apiVersion: new Date().toISOString().split("T").at(0),
  });
  return client;
}

export async function getData({ cached }) {
  if (cached) {
    try {
      const data = await fs.readFile("./sanity-dump.json", "utf-8");
      console.log("sanity: cache hit");
      return JSON.parse(data);
    } catch {
      console.log("sanity: cache miss");
    }
  }
  const data = {
    pages: await getPages(),
    events: await getEvents(),
    homepage: await getHomepage(),
    gallery: await getGallery(),
  };

  await fs.writeFile("./sanity-dump.json", JSON.stringify(data));

  return data;
}

export async function getPages() {
  return getClient().fetch(
    `*[_type=="page"] {
      id,
      title,
      subtitle,
      language,
      description,
      body[]{
        content,
        title,
        picture -> {
          caption, attribution, "url": image.asset->url}
        },
        cover -> {caption, attribution, "url": image.asset->url}
      }`,
  );
}

export async function getEvents() {
  return getClient().fetch('*[_type=="event"] { date, description, location }');
}

export async function getHomepage() {
  const data = await getClient().fetch(
    `*[_type=="homepage"] {
      intro,
      "socialMediaCover" : socialMediaCover.asset->url,
      quote -> { text, source, link },
      videos[]->{title, link},
      socialLinks
    }`,
  );
  return {
    ...data[0],
    links: data[0].socialLinks.reduce(
      (memo, { id, link }) => ({ ...memo, [id]: link }),
      {},
    ),
    videos: data[0].videos.map((x) => ({
      id: getVideoID(x.link),
      ...x,
    })),
  };
}

export async function getGallery() {
  const data = await getClient().fetch(
    `*[_type=="gallery"] {
      pictures[]->{
        caption,
        attribution,
        "url": image.asset->url,
        "dimensions": image.asset-> metadata.dimensions
      },
      videos[]->{title, link},
    }`,
  );
  return {
    ...data[0],
    videos: data[0].videos.map((x) => ({
      id: getVideoID(x.link),
      ...x,
    })),
  };
}

export function getVideoID(link) {
  const url = new URL(link);
  const params = new URLSearchParams(url.search);
  return params.get("v");
}

export function translate(entity, language = "en") {
  return entity[language];
}
