'use client';

import BlogCard from "../components/Common/BlogCard" ;
import ProductCard from "../components/User/ProductCard";
import EventCard from "../components/User/EventCard";
import { Api } from '@/services/Api';
import { getJwt, isLogedRedirect, getCookies } from '@/services/Cookies';
import { useState, useEffect } from "react";
import AddButton from "../components/Buttons/AddButton";
import '@/app/css/dashboard.css';

export default function Dashboard() {

    const [cookies, setCookies] = useState({});
    const [blogs, setBlogs] = useState([]);
    const [products, setProducts] = useState([]);
    const [events, setEvents] = useState([]);

    useEffect(() => {
        isLogedRedirect();
        setCookies(getCookies);
    }, [])

    useEffect(() => {
        Api.post("/blog/me", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                setBlogs(res.data);
            }
        })
    }, [cookies]);

    useEffect(() => {
        Api.post("/shop/me", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                // console.log(res.data.products);
                setProducts(res.data.products);
            }
        })
    }, [cookies]);
    
    useEffect(() => {
        Api.post("/event/me", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                // console.log(res.data.products);
                setEvents(res.data.events);
            }
        })
    }, [cookies]);

    return (
    <>
        <section className="dashboardBlogs">
            <h4 className="dashboardBlogsTitle">My Blogs</h4>
            <section className="dashboardBlogsCards">
                {blogs != [] && (blogs.map(blog => (
                    <BlogCard 
                        blog_banner={blog.banner_img}
                        blog_icon={blog.profile_img}
                        blog_name={blog.title}
                        blogger_name={blog.blogger_name}
                        blog_slug={blog.slug}
                        key={blog.id}
                        editable={true}
                    />
                )))}
                <AddButton type="blog"/>
            </section>
            <h4 className="dashboardBlogsTitle">My Products</h4>
            <section className="dashboardBlogsCards">
                {products != [] && (products.map(product => (
                    <ProductCard 
                        banner={product.imgs ? product.imgs.split(", ")[0] : ''}
                        name={product.name}
                        slug={product.slug}
                        key={product.id}
                        editable={true}
                    />
                )))}
                <AddButton type="product"/>
            </section>
            <h4 className="dashboardBlogsTitle">My Events</h4>
            <section className="dashboardBlogsCards">
                {events != [] && (events.map(event => (
                    <EventCard 
                        banner={event.banner_img}
                        name={event.title}
                        slug={event.slug}
                        key={event.id}
                        editable={true}
                    />
                )))}
                <AddButton type="event"/>
            </section>
        </section>
    </>
    )
}