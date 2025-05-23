import { format } from "date-fns";
import { getAllPostIds, getPostData } from "@/lib/posts";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight, FiCalendar, FiTag } from "react-icons/fi";
import ShareButton from "@/components/ShareButton";
import ScrollToTop from "@/components/ScrollToTop";
import "@/styles/prism-theme.css";
import type { Viewport } from "next";
import CodeBlock from "@/components/CodeBlock";

type Props = {
  params: Promise<{ id: string[] }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export function generateViewport(): Viewport {
  return {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: "black",
  };
}

export async function generateStaticParams() {
  const posts = getAllPostIds();
  return posts.map((post) => ({
    id: post.params.id
  }));
}

export default async function Post({ params }: Props) {
  const { id } = await params;
  const post = await getPostData(id);

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          <CodeBlock />
          {/* 返回按钮 */}
          <Link
            href="/blog"
            className="group inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 mb-8"
          >
            <FiArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
            <span>返回文章列表</span>
          </Link>
          <header className="mb-8">
            {/* 文章标题 */}
            <h1 className="text-3xl font-bold mb-6 text-gray-900">
              {post.title}
            </h1>

            {/* 元信息 */}
            <div className="flex flex-wrap items-center gap-4 text-gray-600 pb-6 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <FiCalendar className="w-4 h-4" />
                <time dateTime={post.date}>
                  {format(new Date(post.date), "yyyy年MM月dd日")}
                </time>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-gray-600">{post.wordCount} 字</span>
                <span className="text-gray-600">·</span>
                <span className="text-gray-600">
                  {post.readingTime} 分钟阅读
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FiTag className="w-4 h-4" />
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 text-sm rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              {/* Twitter分享按钮 */}
              <ShareButton title={post.title} path={`/blog/${id.join("/")}`} />
            </div>
          </header>

          {/* 文章内容 */}
          <div
            className="prose prose-lg max-w-none prose-indigo"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />
          <ScrollToTop />
          {/* 上一篇/下一篇导航 */}
          <div className="flex justify-between mt-12">
            {post.prevId && (
              <Link
                href={`/blog/${post.prevId}`}
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200"
              >
                <FiArrowLeft className="w-5 h-5" />
                <span>上一篇：{post.prevTitle}</span>
              </Link>
            )}
            {post.nextId && (
              <Link
                href={`/blog/${post.nextId}`}
                className="inline-flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors duration-200 ml-auto"
              >
                <span>下一篇：{post.nextTitle}</span>
                <FiArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </article>
      </div>
    </div>
  );
}
