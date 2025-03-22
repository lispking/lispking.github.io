import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import remarkRehype from 'remark-rehype'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeStringify from 'rehype-stringify'
import remarkGfm from 'remark-gfm'

const postsDirectory = path.join(process.cwd(), 'src/posts')

export interface PostData {
  id: string
  title: string
  date: string
  description: string
  tags: string[]
  category: string
  contentHtml: string
}

function getAllMarkdownFiles(dir: string): string[] {
  const files: string[] = []
  const entries = fs.readdirSync(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)
    if (entry.isDirectory()) {
      files.push(...getAllMarkdownFiles(fullPath))
    } else if (entry.isFile() && entry.name.endsWith('.md')) {
      files.push(fullPath)
    }
  }

  return files
}

export function getSortedPostsData(year?: string): Omit<PostData, 'contentHtml'>[] {
  // Get all markdown files recursively under /posts
  const filePaths = getAllMarkdownFiles(postsDirectory)
  const allPostsData = filePaths.map(filePath => {
    // Get relative path from posts directory
    const relativePath = path.relative(postsDirectory, filePath)
    // Remove ".md" from file name to get id
    const id = relativePath.replace(/\.md$/, '')
    // Get category from directory structure
    const category = path.dirname(relativePath) === '.' ? 'uncategorized' : path.dirname(relativePath)

    // Read markdown file as string
    const fileContents = fs.readFileSync(filePath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Combine the data with the id and category
    return {
      id,
      category,
      ...(matterResult.data as { title: string; date: string; description: string; tags: string[] })
    }
  })

  // Filter posts by year if specified
  const filteredPosts = year
    ? allPostsData.filter(post => post.date.startsWith(year))
    : allPostsData

  // Sort posts by date
  return filteredPosts.sort((a, b) => {
    if (a.date < b.date) {
      return 1
    } else {
      return -1
    }
  })
}

export function getAllPostIds() {
  const filePaths = getAllMarkdownFiles(postsDirectory)
  return filePaths.map(filePath => {
    const relativePath = path.relative(postsDirectory, filePath)
    const id = relativePath.replace(/\.md$/, '')
    const segments = id.split(path.sep)
    return {
      params: {
        id: segments
      }
    }
  })
  // Sort by date (newest first)
  .sort((a, b) => {
    const aId = Array.isArray(a.params.id) ? a.params.id.join('/') : a.params.id
    const bId = Array.isArray(b.params.id) ? b.params.id.join('/') : b.params.id
    return bId.localeCompare(aId)
  })
}

export async function getPostData(id: string | string[]): Promise<PostData> {
  // Handle nested paths
  const idPath = Array.isArray(id) ? path.join(...id) : id
  const fullPath = path.join(postsDirectory, `${idPath}.md`)
  try {
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const relativePath = path.relative(postsDirectory, fullPath)
    const category = path.dirname(relativePath) === '.' ? 'uncategorized' : path.dirname(relativePath)

    // Use gray-matter to parse the post metadata section
    const matterResult = matter(fileContents)

    // Use remark to convert markdown into HTML string
    const processedContent = await remark()
      .use(remarkGfm)
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypePrettyCode, {
        theme: 'github-dark',
        keepBackground: true,
      })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .process(matterResult.content)
    const contentHtml = processedContent.toString()

    // Combine the data with the id, category and contentHtml
    return {
      id: idPath,
      category,
      contentHtml,
      ...(matterResult.data as { title: string; date: string; description: string; tags: string[] })
    }
  } catch {
    throw new Error(`文章不存在: ${id}`)
  }
}