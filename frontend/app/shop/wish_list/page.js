"use client";
import { Api } from '@/services/Api';
import { getJwt, isLogedRedirect, getCookies } from '@/services/Cookies';
import { useState, useEffect } from "react";
import ProductCard from '@/app/components/Wish_List/ProductCard';
import '@/app/css/wishListIndex.css';
import '@/app/components/Common/ProductCard.css';

function ProductList() {
    const [products, setProducts] = useState([]);

    const fetchWishList = () => {
        Api.post("/shop/getWishList", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                // console.log(res.data);
                setProducts(res.data);
            }
        })
    };

    useEffect(() => {
        fetchWishList();
    }, []);
    

    return (
        <div className='productsBox'>
            {products.length !== 0 ? 
                products.map(product => (
                    <ProductCard 
                        key={product.id}
                        type='wishList'
                        profile={product.imgs ? 'https://api.gameverseproject.tech/img/blogs/' + product.imgs.split(", ")[0] : 
                        'https://api.gameverseproject.tech/img/blogs/blog_default_banner.jpg'}
                        name={product.name}
                        slug = {product.slug}
                        categories={product.categories}
                        sale_price={product.sale_price}
                        onDeleted={fetchWishList}
                    />
                ))
            : <h4>There is not products yet.</h4>}
        </div>
    );
}

export default function wishList() {

    const [cookies, setCookies] = useState({});

    useEffect(() => {
        isLogedRedirect();
        setCookies(getCookies);
    }, [])

    return (
        <main>
            <div className='divFlex1'>
                <hr/>
                <h2 className="sectionSubtitle">Wish List</h2>
                <hr/>
            </div>
            <ProductList/>
        </main>
    );
}