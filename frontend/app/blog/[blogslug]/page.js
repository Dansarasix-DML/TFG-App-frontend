'use client';
import BlogIndex from '../../components/Blog/BlogIndex.js';

export default function BlogPage({params}) {
    return (
      <>
        <main>
            <BlogIndex blogslug={params.blogslug} />
        </main>
      </>
    );
}