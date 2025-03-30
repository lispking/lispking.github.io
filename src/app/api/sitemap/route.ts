import { getSortedPostsData } from '@/lib/posts';
import { headers } from 'next/headers';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  const headersList = headers();
  const domain = (await headersList).get('host') || 'lispking.github.io';
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${domain}`;

  // 获取所有博客文章
  const posts = getSortedPostsData();

  // 生成sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <!-- 主页 -->
      <url>
        <loc>${baseUrl}</loc>
        <changefreq>daily</changefreq>
        <priority>1.0</priority>
      </url>
      
      <!-- 博客页面 -->
      <url>
        <loc>${baseUrl}/blog</loc>
        <changefreq>daily</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- 项目页面 -->
      <url>
        <loc>${baseUrl}/projects</loc>
        <changefreq>weekly</changefreq>
        <priority>0.8</priority>
      </url>

      <!-- 关于页面 -->
      <url>
        <loc>${baseUrl}/about</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>

      <!-- 联系页面 -->
      <url>
        <loc>${baseUrl}/contact</loc>
        <changefreq>monthly</changefreq>
        <priority>0.7</priority>
      </url>

      <!-- 博客文章 -->
      ${posts.map(post => `
      <url>
        <loc>${baseUrl}/blog/${post.id}</loc>
        <lastmod>${new Date(post.date).toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`).join('')}
    </urlset>`;

  return new Response(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}