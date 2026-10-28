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

export function organizationJsonLd(origin: string, name: string): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: origin,
  };
}

export function articleJsonLd(input: {
  headline: string;
  datePublished: string;
  dateModified: string;
  image: string;
  url: string;
}): JsonLdNode {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.headline,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    image: input.image,
    mainEntityOfPage: input.url,
  };
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
