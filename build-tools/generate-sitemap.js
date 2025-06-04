#!/usr/bin/env node

import { writeFileSync } from 'fs';
import { join } from 'path';

// Configuration
const SITE_URL = 'https://engram.kuber.studio';
const OUTPUT_PATH = './dist/sitemap.xml';

// Routes configuration
const STATIC_ROUTES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/resources', priority: '0.9', changefreq: 'weekly' },
  { path: '/privacy', priority: '0.5', changefreq: 'yearly' }
];

const BRANCHES = ['aids', 'aiml', 'civil', 'cse', 'ece', 'eee', 'it', 'mech'];
const SEMESTERS = ['sem-1', 'sem-2', 'sem-3', 'sem-4', 'sem-5', 'sem-6'];

/**
 * Generate dynamic routes for branch/semester combinations
 */
function generateDynamicRoutes() {
  const routes = [];
  
  BRANCHES.forEach(branch => {
    SEMESTERS.forEach(semester => {
      routes.push({
        path: `/${branch}/${semester}`,
        priority: '0.8',
        changefreq: 'weekly'
      });
    });
  });
  
  return routes;
}

/**
 * Generate XML sitemap
 */
function generateSitemap() {
  const currentDate = new Date().toISOString().split('T')[0];
  const allRoutes = [...STATIC_ROUTES, ...generateDynamicRoutes()];
  
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  allRoutes.forEach(route => {
    xml += `
  <url>
    <loc>${SITE_URL}${route.path}</loc>
    <lastmod>${currentDate}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
  });

  xml += `
</urlset>`;

  return xml;
}

/**
 * Main function to generate and save sitemap
 */
function main() {
  try {
    const sitemap = generateSitemap();
    writeFileSync(OUTPUT_PATH, sitemap, 'utf8');
    
    console.log(`✅ Sitemap generated successfully!`);
    console.log(`📍 Location: ${OUTPUT_PATH}`);
    console.log(`🔗 Total URLs: ${STATIC_ROUTES.length + (BRANCHES.length * SEMESTERS.length)}`);
    console.log(`   - Static routes: ${STATIC_ROUTES.length}`);
    console.log(`   - Dynamic routes: ${BRANCHES.length * SEMESTERS.length}`);
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

// Run the script
main();
