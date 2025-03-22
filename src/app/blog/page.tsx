import Link from "next/link";
import { format } from "date-fns";
import { getSortedPostsData } from "@/lib/posts";
import { FiCalendar, FiArrowRight } from "react-icons/fi";
import YearNavigation from "@/components/YearNavigation";
import ScrollToTop from "@/components/ScrollToTop";

export default function BlogPage() {
  const posts = getSortedPostsData();

  // 按年份分组文章
  const postsByYear = posts.reduce((acc, post) => {
    const year = post.date.substring(0, 4);
    if (!acc[year]) {
      acc[year] = [];
    }
    acc[year].push(post);
    return acc;
  }, {} as Record<string, typeof posts>);

  // 获取年份列表并排序
  const years = Object.keys(postsByYear).sort((a, b) => b.localeCompare(a));

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            博客文章
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            分享技术见解，探索创新解决方案
          </p>

          {/* 年份导航 */}
          <YearNavigation years={years} postsByYear={postsByYear} />

          {/* 按年份分组展示文章 */}
          <div className="space-y-16">
            {years.map((year) => (
              <div key={year} id={year}>
                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                  {year}年
                </h2>
                <div className="space-y-8">
                  {postsByYear[year].map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                    >
                      <Link href={`/blog/${post.id}`} className="block p-8">
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
                          <div className="flex items-center gap-2">
                            <FiCalendar className="w-4 h-4" />
                            <time dateTime={post.date}>
                              {format(new Date(post.date), "yyyy年MM月dd日")}
                            </time>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {post.tags.map((tag) => (
                              <span
                                key={tag}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-indigo-50 text-indigo-700"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>

                        <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors duration-200">
                          {post.title}
                        </h2>

                        <p className="text-gray-600 mb-4 line-clamp-2">
                          {post.description}
                        </p>

                        <div className="flex items-center text-indigo-600 font-medium group">
                          <span className="mr-2">阅读全文</span>
                          <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                        </div>
                      </Link>
                    </article>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <ScrollToTop />
    </div>
  );
}
