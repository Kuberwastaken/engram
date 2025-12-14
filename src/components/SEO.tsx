import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title: string;
    description?: string;
    keywords?: string[];
    image?: string;
    url?: string;
    type?: 'website' | 'article' | 'book' | 'profile';
    author?: string;
    publishedTime?: string;
    modifiedTime?: string;
    structuredData?: Record<string, any>;
    children?: React.ReactNode;
}

const DEFAULT_DESCRIPTION = "The centralized, No BS Open-Source hub for IP University study materials. Get notes, PYQs, books, and syllabus for B.Tech CSE, IT, ECE, and more.";
const DEFAULT_KEYWORDS = [
    "IPU", "GGSIPU", "Guru Gobind Singh Indraprastha University",
    "B.Tech", "Engineering Notes", "IPU Notes", "IPU PYQs",
    "Previous Year Questions", "Study Materials", "Engram",
    "Kuber Mehta", "College Notes", "Engineering Syllabus"
];
const DEFAULT_IMAGE = "https://engram.kuber.studio/assets/web-app-manifest-512x512.png";
const SITE_URL = "https://engram.kuber.studio";
const SITE_NAME = "Engram";
const CREATOR = "Kuber Mehta";

export const SEO: React.FC<SEOProps> = ({
    title,
    description = DEFAULT_DESCRIPTION,
    keywords = [],
    image = DEFAULT_IMAGE,
    url,
    type = 'website',
    author = CREATOR,
    publishedTime,
    modifiedTime,
    structuredData,
    children
}) => {
    const fullTitle = `${title} | ${SITE_NAME}`;
    const fullUrl = url ? (url.startsWith('http') ? url : `${SITE_URL}${url}`) : SITE_URL;
    const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])].join(', ');

    // Base structured data for the website
    const baseStructuredData = {
        "@context": "https://schema.org",
        "@graph": [
            {
                "@type": "WebSite",
                "@id": `${SITE_URL}/#website`,
                "url": SITE_URL,
                "name": SITE_NAME,
                "description": DEFAULT_DESCRIPTION,
                "publisher": {
                    "@type": "Person",
                    "name": CREATOR,
                    "url": "https://kuber.studio"
                }
            },
            structuredData
        ].filter(Boolean)
    };

    return (
        <Helmet>
            {/* Standard Metadata */}
            <title>{fullTitle}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={allKeywords} />
            <meta name="author" content={author} />
            <link rel="canonical" href={fullUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={type} />
            <meta property="og:url" content={fullUrl} />
            <meta property="og:title" content={fullTitle} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:site_name" content={SITE_NAME} />
            {publishedTime && <meta property="article:published_time" content={publishedTime} />}
            {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}

            {/* Twitter */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:creator" content="@kuberwastaken" />
            <meta name="twitter:title" content={fullTitle} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Structured Data (JSON-LD) */}
            <script type="application/ld+json">
                {JSON.stringify(baseStructuredData)}
            </script>

            {children}
        </Helmet>
    );
};
