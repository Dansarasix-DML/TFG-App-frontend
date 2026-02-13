'use client';
import Image from 'next/image';
import './AddButton.css';

export default function AddButton({ type }) {

    let typeUrl = null;

    switch (type) {
        case "blog":
            typeUrl = "/blog/add";
            break;
        case "product":
            typeUrl = "/shop/add_product";
            break;
        case "post":
            typeUrl = "/blog/post/add";
            break;
        case "event":
            typeUrl = "/event/add";
            break;
        default:
            typeUrl = window.location;
            break;
    }

    // const typeUrl = type === "blog" ? "/blog/add" : ("product" 
    // ? "/shop/add_product" : ("post" ? "/post/add" : window.location));

    const clickFn = () => {
        window.location.href = typeUrl;
    }

    return (
        <article className="blog-card" style={{backgroundImage: "url(https://api.gameverseproject.tech/img/banner01.jpg)"}} onClick={clickFn}>
            <div className='blog-card-data'>
                <img src="https://api.gameverseproject.tech/img/addIcon.png" className="blog-card-icon"/>
                <div className="blog-card-div-content">
                    <p className="blog-card-name">Add {type}</p>
                </div>
            </div>
            <div className="blog-card-div">
            </div>
        </article>
    )
}