import React, { useState } from 'react';


export default function ProductCard({ name, description, slug, imgs, purchase_price, sale_price, quantity, blogName, blogImg, Type  }) {
    const clickFn = () => {
        window.location.href = "/shop/"+slug;
    }

    // Function to replace newlines with <br>
    const formatDescription = (text) => {
        // console.log(text);

        if (Array.isArray(text)) {
            text = text.join(''); // Convert array to string
        }
      
        if (typeof text !== 'string') {
            return null;
        }

        return text.split('\n').map((line, index) => (
        <React.Fragment key={index}>
            {line}
            <br />
        </React.Fragment>
        ));
    };

    return (
        <article className="product-card" onClick={clickFn}>
            <img src={"https://api.gameverseproject.tech/img/blogs/"+imgs[0]} className="product-card-img"/>
            <div className="product-card-div">
                <div className='product-card-div-up'>
                    <div className="product-card-div-up-content">
                        <p className="product-card-title">{name}</p>
                    </div>
                    <div className="product-card-div-up-blogger">
                        <img src={"https://api.gameverseproject.tech/img/"+blogImg} className="product-card-blogger-img"/>
                        <p className="product-card-blogger-name">{blogName}</p>
                    </div>
                </div>
                <div className="product-prices">
                    <p className="sale-price">{sale_price}€</p>
                    <p className="purchase-price">{purchase_price}€</p>
                </div>
                <p className='product-card-div-down'>{formatDescription(description)}</p>
            </div>
        </article>
    )
}