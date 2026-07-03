import type { Metadata } from "next";

export const siteConfig = {
  name: "King's 技术博客",
  shortName: "King",
  title: "King's 技术博客：技术分享与创新解读",
  description:
    "欢迎来到 King's 个人技术博客，探索前沿技术和开发经验，分享 Rust、Web3、全栈开发、AI 工具与开源项目实践。",
  url: "https://lispking.github.io",
  locale: "zh_CN",
  language: "zh-CN",
  author: {
    name: "King",
    url: "https://github.com/lispking",
  },
  creator: "@lispking",
  publisher: "猿禹宙",
  themeColor: "#6366f1",
  ogImage: "/og-image.png",
  keywords: [
    "King",
    "lispking",
    "技术博客",
    "Rust编程",
    "Web3技术",
    "区块链技术",
    "全栈开发",
    "前端开发",
    "数据库开发",
    "Chrome扩展",
    "AI Agent",
    "开源项目",
  ],
  sameAs: ["https://github.com/lispking", "https://x.com/lispking"],
  location: {
    region: "CN-SH",
    placeName: "Shanghai, China",
    position: "31.2304;121.4737",
    icbm: "31.2304, 121.4737",
  },
};

type PageMetadataOptions = {
  title?: string;
  description?: string;
  path?: string;
  keywords?: string[];
};

type ArticleMetadataOptions = Required<
  Pick<PageMetadataOptions, "title" | "description" | "path">
> & {
  publishedTime: string;
  tags: string[];
  section: string;
};

export function absoluteUrl(path = "/") {
  if (path.startsWith("http")) {
    return path;
  }

  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getPageTitle(title?: string) {
  return title ? `${title} | ${siteConfig.shortName}` : siteConfig.title;
}

export function createPageMetadata({
  title,
  description = siteConfig.description,
  path = "/",
  keywords = [],
}: PageMetadataOptions = {}): Metadata {
  const pageTitle = getPageTitle(title);
  const canonicalPath = path.startsWith("/") ? path : `/${path}`;

  return {
    title: title ? title : { absolute: siteConfig.title },
    description,
    keywords: [...siteConfig.keywords, ...keywords],
    alternates: {
      canonical: canonicalPath,
      languages: {
        "zh-CN": canonicalPath,
      },
    },
    authors: [siteConfig.author],
    creator: siteConfig.author.name,
    publisher: siteConfig.publisher,
    category: "technology",
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: canonicalPath,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.creator,
      creator: siteConfig.creator,
      title: pageTitle,
      description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    other: {
      "geo.region": siteConfig.location.region,
      "geo.placename": siteConfig.location.placeName,
      "geo.position": siteConfig.location.position,
      ICBM: siteConfig.location.icbm,
    },
  };
}

export function createArticleMetadata({
  title,
  description,
  path,
  publishedTime,
  tags,
  section,
}: ArticleMetadataOptions): Metadata {
  const pageTitle = getPageTitle(title);
  const base = createPageMetadata({ title, description, path, keywords: tags });

  return {
    ...base,
    category: section,
    openGraph: {
      type: "article",
      locale: siteConfig.locale,
      url: path,
      siteName: siteConfig.name,
      title: pageTitle,
      description,
      publishedTime,
      authors: [siteConfig.author.name],
      tags,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: siteConfig.creator,
      creator: siteConfig.creator,
      title: pageTitle,
      description,
      images: [siteConfig.ogImage],
    },
  };
}

export const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": `${siteConfig.url}/#website`,
  url: siteConfig.url,
  name: siteConfig.name,
  alternateName: siteConfig.shortName,
  description: siteConfig.description,
  inLanguage: siteConfig.language,
  publisher: {
    "@id": `${siteConfig.url}/#person`,
  },
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": `${siteConfig.url}/#person`,
  name: siteConfig.author.name,
  url: siteConfig.url,
  sameAs: siteConfig.sameAs,
  address: {
    "@type": "PostalAddress",
    addressLocality: "Shanghai",
    addressCountry: "CN",
  },
};

export function createArticleJsonLd({
  title,
  description,
  path,
  datePublished,
  tags,
  wordCount,
}: {
  title: string;
  description: string;
  path: string;
  datePublished: string;
  tags: string[];
  wordCount: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": absoluteUrl(path),
    },
    headline: title,
    description,
    image: absoluteUrl(siteConfig.ogImage),
    datePublished,
    dateModified: datePublished,
    inLanguage: siteConfig.language,
    keywords: tags.join(", "),
    wordCount,
    author: {
      "@id": `${siteConfig.url}/#person`,
    },
    publisher: {
      "@id": `${siteConfig.url}/#person`,
    },
  };
}
