
export default function PostCard({index, urlImage, urlPost, postTitle, postSubtitle}) {
    const clickFn = () => {
        window.location.href = urlPost;
    }

    return(
        <li className={index === 0 ? 'firstPost' : ''} style={{background: urlImage}} onClick={clickFn}>
            <div>
                <h3>{postTitle}</h3>
                <p>{postSubtitle}</p>
            </div>
        </li>
    )
}