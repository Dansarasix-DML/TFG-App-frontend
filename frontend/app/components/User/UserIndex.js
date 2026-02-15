'use client';

import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import BlogCard from './BlogCard';
import ProductCard from '../Blog/ProductCard';
import Image from 'next/image';

function Blogs({username}) {
    const [blogs, setBlogs] = useState({});

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await Axios.get(process.env.NEXT_PUBLIC_DB_HOST + '/api/user/' + username);
                setBlogs(response.data.blogs);
            } catch (error) {
                console.error(error);
            }
        }

        fetchBlogs();
    }, [username]);

    return (
        <div>
            <ul className='blogs'>
                {Object.values(blogs).map(blog => (
                    <BlogCard 
                        key={blog.id}
                        banner={blog.banner_img ? "https://gameverse-app.vercel.app/img/blogs/" + blog.banner_img : "https://gameverse-app.vercel.app/img/banner01.jpg"}
                        profile={blog.profile_img ? "https://gameverse-app.vercel.app/img/blogs/" + blog.profile_img : null}
                        title={blog.title}
                        slug={blog.slug}
                    />
                ))}
            </ul>
        </div>
    )
    
}

function Products({type, url}) {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const uri = url;
                const response = await Axios.get(uri);
                // console.log(response.data);
                setProducts(type === "games" ? response.data.games : response.data.merch);
            } catch (error) {
                console.error(error);
            }
        }

        fetchPosts();
    }, [type, url]);

    return (
        <div>
            <ul className='games_list'>
                {products.map((product, index) => (
                    <ProductCard 
                        key={product.id}
                        urlImage={`url(${"https://gameverse-app.vercel.app/img/blogs/" + product.imgs.split(',')[0]}) white`} 
                        urlProduct={"/shop/" + product.slug} 
                        productName={product.name}
                    />
                ))}
            </ul>
        </div>
    
    )
    
}

function User({username}) {
    const [user, setUser] = useState({});

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await Axios.get(process.env.NEXT_PUBLIC_DB_HOST + '/api/user/' + username);
                setUser(response.data.user);
            } catch (error) {
                console.error(error);
            }
        }

        fetchBlogs();
    }, [username]);

    return (
        <div className={user.banner ? 'userbox' : 'userbox defaultBanner'} style={user.banner ? {backgroundImage: "url(https://gameverse-app.vercel.app/img/users/"+user.banner+")"} : {}}>
            {(user.avatar !== "" && user.avatar !== " " && user.avatar) ? <img src={"https://gameverse-app.vercel.app/img/users/"+user.avatar} alt={user.name} /> : <img src='https://gameverse-app.vercel.app/img/users/avatar.png' alt='default' />}
            <div className='userData'>
                <h2>{user.name}</h2>
                <p>@{user.username}</p>
                <p>{user.email}</p>
                {user.telephone ? <p>{user.telephone}</p> : null}
                {user.bio ? <p>{user.bio}</p> : null}
            </div>
        </div>
    )

}

export default function UserIndex({username}) {
    return (
        <>
            <User username={username} />
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Blogs</h2>
                <hr />
            </div>
            <Blogs username={username} />
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Games</h2>
                <hr />
            </div>
            <Products type="games" url={process.env.NEXT_PUBLIC_DB_HOST + "/api/user/" + username + "/products"}/>
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Merchandising</h2>
                <hr />
            </div>
            <Products type="merchandising" url={process.env.NEXT_PUBLIC_DB_HOST + "/api/user/" + username + "/products"}/>
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Events</h2>
                <hr />
            </div>
        </>
    )
}