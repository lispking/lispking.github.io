import { getAllPostIds, getPostData } from '@/lib/posts';
import { NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = false;

export async function GET() {
  try {
    const posts = getAllPostIds();
    const postsData = await Promise.all(
      posts.map(async (post) => {
        const postData = await getPostData(post.params.id);
        return {
          id: post.params.id.join('/'),
          title: postData.title,
          date: postData.date,
          tags: postData.tags,
        };
      })
    );

    return NextResponse.json(postsData);
  } catch (error) {
    console.error('Error fetching posts:', error);
    return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 });
  }
} 