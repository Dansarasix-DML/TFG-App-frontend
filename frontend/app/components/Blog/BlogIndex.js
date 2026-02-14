import React, {useState, useEffect} from 'react';
import Axios from 'axios';
import ProductCard from './ProductCard';
import PostCard from './PostCard';
import AddButton from "../../components/Buttons/AddButton";
import { Api } from '@/services/Api';
import { getJwt } from '@/services/Cookies';
import './blogHeader.css';
import Swal from 'sweetalert2';


function Posts({blogslug}) {
    const [posts, setPosts] = useState([]);
    const [loged, setLoged] = useState(false);

    useEffect(() => {
        Api.post("/auth/me", "", getJwt()).then(res => {
          if (res.data.id) {
              setLoged(true);
            }
          }
        )
    }, [])

    useEffect(() => {
        async function fetchPosts() {
            try {
                const uri = process.env.NEXT_PUBLIC_DB_HOST + "/api/blog/" + blogslug + "/lastPostsAJAX";
                const response = await Axios.get(uri);
                setPosts(response.data);
            } catch (error) {
                console.error(error);
            }
        }

        fetchPosts();
    }, [blogslug]);

    return (
        <div className='margin1'>
            <ul className='list3'>
                {posts.map((post, index) => (
                    <PostCard 
                        index={index}
                        key={post.id}
                        urlImage={post.banner_img ? "url(https://api.gameverseproject.tech" + "/img/blogs/" + post.banner_img + ") white" : "url(" + "/img/banner01.jpg) white"}
                        urlPost={"/blog/" + blogslug + "/" + post.slug}
                        postTitle={post.title}
                        postSubtitle={post.subtitle}
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
        <div className='margin1'>
            <ul className='games_list'>
                {products.map((product, index) => (
                    <ProductCard 
                        key={product.id}
                        urlImage={`url(https://api.gameverseproject.tech${"/img/blogs/" + product.imgs.split(',')[0]}) white`} 
                        urlProduct={"/shop/" + product.slug} 
                        productName={product.name}
                    />
                ))}
            </ul>
        </div>
    
    )
    
}

function SubButton ({blogId, subscribers, setSubscribers}) {
    const [subscribed, setSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        Api.post("/user/getSubs", {blogId: blogId}, getJwt()).then(res => {
            if (res.statusCode === 200) {
                setSubscribed(res.data.sub);
            }
            setLoading(false);
        }).catch(() => {
            setLoading(false);
        });
    }, [blogId]);

    const subscribe = () => {
        // console.log('Subscribed - ' + blogId);
        Api.post("/user/subscribe", {blogId: blogId}, getJwt()).then(res => {
            if (res.statusCode === 200) {
                const title = subscribed ? "Unsubscribed" : "Subscribed";
                const text = subscribed ? "You have unsubscribed from the blog." : 
                "You have subscribed to the blog.";
                Swal.fire({
                    title: title + " to the blog!",
                    text: text,
                    icon: "success",
                });
            }
        })
    };

    const handleClick = () => {
        setSubscribed(!subscribed);
        setSubscribers(subscribed ? subscribers - 1 : subscribers + 1)
        subscribe();
    }

    if (loading) {
        return <button disabled className="unsubButton">Loading...</button>;
    }

    return (
        <button className={subscribed ? 'unsubButton' : 'subButton'} onClick={handleClick}>
            {subscribed ? 'Unsubscribe' : 'Subscribe'}
        </button>
    );

}

function BlogHeader({blogslug}) {
    const [blog, setBlog] = useState([]);
    const [subscribers, setSubscribers] = useState(0);
    const [loged, setLoged] = useState(false);

    useEffect(() => {
        Api.post("/auth/me", "", getJwt()).then(res => {
          if (res.data.id) {
              setLoged(true);
            }
          }
        )
    }, [])

    useEffect(() => {
        async function fetchPosts() {
            try {
                const uri = process.env.NEXT_PUBLIC_DB_HOST + "/api/blog/" + blogslug + "/getInfo";
                // console.log(uri);
                const response = await Axios.get(uri);
                setBlog(response.data.blog);
            } catch (error) {
                console.error(error);
            }
        }

        fetchPosts();
    }, [blogslug]);

    useEffect(() => {
        async function fetchSubscribers() {
            try {
                const uri = process.env.NEXT_PUBLIC_DB_HOST + "/api/blog/" + blog.id + "/getSubscribers";
                // console.log(uri);
                const response = await Axios.get(uri);
                setSubscribers(response.data.subscribers);
            } catch (error) {
                console.error(error);
            }
        }

        if (blog.id) {
            fetchSubscribers();
        }
    }, [blog.id]);

    const back = "url(https://api.gameverseproject.tech/img/blogs/"+blog.banner_img+")";

    return (
        <div className='blogHeaderBack' style={{backgroundImage: back}}>
            <img src={'https://api.gameverseproject.tech/img/blogs/'+blog.profile_img}></img>
            <div className='blogData'>
                <div>
                    <h1>{blog.title}</h1>
                    <p>Created by: {blog.user_name} <strong>(@{blog.user_username})</strong></p>
                    <p>Subscribers: {subscribers}</p>
                </div>
                {loged && (<SubButton blogId={blog.id} subscribers={subscribers} setSubscribers={setSubscribers}/>)}
            </div>
        </div>
    );
    
}

export default function BlogIndex({blogslug}){
    
    return(
        <div id='app'>
            <BlogHeader blogslug={blogslug}/>
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Last Posts</h2>
                <hr />
            </div>
            <p>Last posts.</p>
            <Posts blogslug={blogslug}/>
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Games</h2>
                <hr />
            </div>
            <p>Titles released.</p>
            <Products type="games" url={process.env.NEXT_PUBLIC_DB_HOST + "/api/blog/" + blogslug + "/gamesAJAX"}/>
            <div className='divFlex1 gap1'>
                <hr />
                <h2 className='sectionSubtitle'>Merchandising</h2>
                <hr />
            </div>
            <p>Merchandising from this Blog.</p>
            <Products type="merch" url={process.env.NEXT_PUBLIC_DB_HOST + "/api/blog/" + blogslug + "/merchAJAX"}/>
            <div className='divFlex1'>
                <hr />
                <h2 className='sectionSubtitle'>Events</h2>
                <hr />
            </div>
            <p>Events related this Blog.</p>
        </div>
    )
}