
export default function PostCard({index, urlImage, urlPost, postTitle}) {
    const clickFn = () => {
        window.location.href = urlPost;
    }

    return(
        <li className="flex1" style={{background: urlImage}} onClick={clickFn}>
            <div>
                <h3>{postTitle}</h3>
            </div>
        </li>
    )
}