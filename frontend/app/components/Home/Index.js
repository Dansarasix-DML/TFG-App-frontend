import {useState, useEffect} from 'react';
import Axios from 'axios';
import BlogCard from '../Common/BlogCard';
import PostCard from '../Common/PostCard';
import SearchTable from './SearchTable';

function Posts() {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await Axios.get(process.env.DB_HOST + '/api/blog/lastPostsIndexAJAX');
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchBlogs();
    }, []);

    return (
        <section className='last-posts'>
            {posts.map(post => (
                <PostCard 
                    post_img={post.banner_img}
                    post_title={post.title}
                    post_subtitle={post.subtitle}
                    post_summary={post.summary ? post.summary.replaceAll("#", "").replaceAll("*", "") + "..." : ""}
                    post_slug={post.slug}
                    blogger_img={post.blog_img ? 'blogs/' + post.blog_img : 'avatar01.png'}
                    blog_slug={post.blog_slug}
                    blogger_name={post.blog_title}
                    key={post.id}
                />
            ))}
        </section>
    )
}

function Blogs() {
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await Axios.get(process.env.DB_HOST + '/api/blog/lastBlogsAJAX');
                setBlogs(response.data);
                console.log(blogs);
            } catch (error) {
                console.error(error);
            }
        }
        fetchBlogs();
    }, []);

    return (
        <section className='last-blogs'>
            {blogs.map(blog => (
                <BlogCard 
                    blog_banner={(blog.banner_img !== "" && blog.banner_img !== " " && blog.banner_img) ? blog.banner_img : "blog_default_banner.png"}
                    blog_icon={(blog.profile_img !== "" && blog.profile_img !== " " && blog.profile_img) ? blog.profile_img : "blog_default_icon.png"}
                    blog_name={blog.title}
                    blogger_name={blog.name}
                    blogger_username={blog.username}
                    blog_slug={blog.slug}
                    key={blog.id}
                />
            ))}
        </section>
    )
}

export default function Index() {
    return (
        <div id='app'>
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Last Posts</h2>
                <hr />
            </div>
            <Posts />
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Last Blogs</h2>
                <hr />
            </div>
            <Blogs />
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Search</h2>
                <hr />
            </div>
            <SearchTable />
        </div>
    )
}