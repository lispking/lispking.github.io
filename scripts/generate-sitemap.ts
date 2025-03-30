import fs from 'fs';
import path from 'path';
import { getAllPosts } from '../src/lib/posts';

const DOMAIN = 'lispking.github.io';
const PROTOCOL = 'https';
const BASE_URL = `${PROTOCOL}://${DOMAIN}`;

async function generateSitemap() {
  // 获取所有博客文章
  const posts = getAllPosts();

  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- 主页 -->
      <url>
        <loc>${BASE_URL}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- 博客页面 -->
      <url>
        <loc>${BASE_URL}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- 项目页面 -->
      <url>
        <loc>${BASE_URL}/projects</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- 关于页面 -->
      <url>
        <loc>${BASE_URL}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>

      <!-- 联系页面 -->
      <url>
        <loc>${BASE_URL}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>

      <!-- 博客文章 -->
      ${posts.map(post => `
      <url>
        <loc>${BASE_URL}/blog/${post.id}</loc>
        <lastmod>${new Date(post.date).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`).join('')}
    </urlset>`;

  // 将sitemap写入public目录
  const publicDir = path.join(process.cwd(), 'public');
  fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
  console.log('Sitemap generated successfully!');
}

generateSitemap().catch(console.error);