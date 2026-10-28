export type JsonLdNode = {
  "@context": "https://schema.org";
  "@type": string;
  [key: string]: unknown;
};

export function websiteJsonLd(origin: string, name: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name,
    url: origin,
  };
}

function organizationFields(origin: string, name: string) {
  return {
    "@type": "Organization" as const,
    name,
    url: origin,
  };
}

export function organizationJsonLd(origin: string, name: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    ...organizationFields(origin, name),
  };
}

export function aboutPageJsonLd(origin: string, name: string, description: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name,
    url: `${origin}/about`,
    description,
    isPartOf: {
      "@type": "WebSite",
      name,
      url: origin,
    },
    mainEntity: organizationFields(origin, name),
  };
}

export function articleJsonLd(input: {
  headline: string;
  datePublished: string;
  dateModified?: string;
  image: string;
  url: string;
  authorName: string;
  publisherUrl: string;
}): JsonLdNode {
  const organization = organizationFields(input.publisherUrl, input.authorName);
  const article: JsonLdNode = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    datePublished: input.datePublished,
    image: input.image,
    mainEntityOfPage: input.url,
    author: organization,
    publisher: organization,
  };
  if (input.dateModified && input.dateModified !== input.datePublished) {
    article.dateModified = input.dateModified;
  }
  return article;
}

export function breadcrumbJsonLd(
  origin: string,
  crumbs: readonly { name: string; path: string }[],
): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: `${origin}${crumb.path}`,
    })),
  };
}
