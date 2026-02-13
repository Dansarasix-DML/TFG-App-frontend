
// src/Carrusel.js
import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import ProductCard from '../Blog/ProductCard';
import './LastProducts.css'; // Asegúrate de crear y ajustar este archivo CSS

const LastProducts = () => {
    const carruselRef = useRef(null);
    const [products, setProducts] = useState([]);
    const [currentGroupIndex, setCurrentGroupIndex] = useState(0);
    const groupSize = 3; // Número de elementos por grupo

    useEffect(() => {
        async function fetchProducts() {
        try {
            const response = await Axios.get(process.env.DB_HOST + '/api/shop/lastProductsAJAX/2');
            setProducts(response.data.products);
        } catch (error) {
            console.error(error);
        }
        }

        fetchProducts();
    }, []);

    const totalGroups = Math.ceil(products.length / groupSize);

    const scrollLeft = () => {
        setCurrentGroupIndex((prevIndex) => (prevIndex === 0 ? totalGroups - 1 : prevIndex - 1));
    };

    const scrollRight = () => {
        setCurrentGroupIndex((prevIndex) => (prevIndex === totalGroups - 1 ? 0 : prevIndex + 1));
    };

    return (
        <div className="LastProducts-container">
        <button className="prev" onClick={scrollLeft}>‹</button>
        <ul className="LastProducts" ref={carruselRef} style={{ transform: `translateX(-${currentGroupIndex * 100}%)` }}>
            {[...Array(totalGroups)].map((_, groupIndex) => (
            <div key={groupIndex} className="LastProducts-group">
                {products.slice(groupIndex * groupSize, (groupIndex + 1) * groupSize).map((product) => (
                <ProductCard
                    key={product.id}
                    clase={true}
                    urlImage={`url(${"https://api.gameverseproject.tech/img/blogs/" + product.imgs.split(',')[0]}) white`}
                    urlProduct={"/shop/" + product.slug}
                    productName={product.name}
                />
                ))}
                {groupIndex === totalGroups - 1 &&
                Array(groupSize - products.slice(groupIndex * groupSize).length)
                    .fill(null)
                    .map((_, index) => <li key={index} className="filler" />)
                }
            </div>
            ))}
        </ul>
        <button className="next" onClick={scrollRight}>›</button>
        </div>
    );
  };

export default LastProducts;
