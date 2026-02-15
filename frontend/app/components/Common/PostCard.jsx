import './PostCard.css';


export default function PostCard({ blog_slug, post_img, post_title, post_subtitle, post_summary, post_slug, blogger_img, blogger_name }) {

    const clickFn = () => {
        window.location.href = "/blog/"+blog_slug+"/"+post_slug;
    }

    return (
        <article className="post-card" onClick={clickFn}>
            <img src={(post_img && post_img != "" && post_img != " ") ? "https://gameverse-app.vercel.app/img/blogs/"+post_img : "https://gameverse-app.vercel.app/img/blogs/post_default_banner.png"} className="post-card-img"/>
            <div className="post-card-div">
                <div className='post-card-div-up'>
                    <div className="post-card-div-up-content">
                        <p className="post-card-title">{post_title}</p>
                        <p className="post-card-subtitle">{post_subtitle}</p>
                    </div>
                    <div className="post-card-div-up-blogger">
                        <img src={"https://gameverse-app.vercel.app/img/"+blogger_img} className="post-card-blogger-img"/>
                        <p className="post-card-blogger-name">{blogger_name}</p>
                    </div>
                </div>
                <p className='post-card-div-down'>{post_summary}</p>
            </div>
        </article>
    )
}