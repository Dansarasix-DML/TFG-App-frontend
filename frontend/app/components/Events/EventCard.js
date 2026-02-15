import '../Common/BlogCard.css';

export default function EventCard ({ banner, title, blogTitle, blogSlug, slug }){
    const back = "url(https://gameverse-app.vercel.app/img/events/"+banner+")";

    const clickFn = () => {
        window.location.href = "/event/"+slug;
    }

    return (
        <article className="blog-card" style={{backgroundImage: back}} onClick={clickFn}>
            <div className='blog-card-data'>
                <div className="blog-card-div-content">
                    <p className="blog-card-name">{title}</p>
                    <p className="blog-card-blogger"><a href={'/blog/'+blogSlug}>{blogTitle}</a></p>
                </div>
            </div>
            <div className="blog-card-div"></div>
        </article>
    );

}

