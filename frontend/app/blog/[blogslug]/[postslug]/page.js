'use client';
import PostIndex from '../../../components/Post/PostIndex.js';
import '../../../css/post.css';

export default function PostPage({params}) {
    return (
      <PostIndex postslug={params.postslug} blogslug={params.blogslug}/>
    );
}