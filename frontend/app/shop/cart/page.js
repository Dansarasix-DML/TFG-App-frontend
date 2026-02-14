"use client";
import { Api } from '@/services/Api';
import { getUsrEmail, getJwt, isLogedRedirect } from '@/services/Cookies';
import { useState, useEffect } from "react";
import ProductCard from '@/app/components/Wish_List/ProductCard';
import '@/app/css/CartIndex.css';
import '@/app/components/Common/ProductCard.css';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [productsQuantity, setProductsQuantity] = useState({});

    const total = products.reduce((acc, product) => acc + Number(product.sale_price), 0);

    useEffect(() => {
        Api.post("/shop/getCart", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                setProducts(res.data);
            }
        })
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault(); 

        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = 'user_email';
        hiddenInput.value = getUsrEmail();
        event.target.appendChild(hiddenInput);

        event.target.submit();
    };

    useEffect(() => {
        const counts = {};

        products.forEach(product => {
            if (!counts[product.id]) {
                counts[product.id] = [];
            }
            
            counts[product.id].push(product);
        });

        setProductsQuantity(counts)
    }, [products])
    

    return (
        <div className='productsBox'>
            {products.length !== 0 ? 
                <>
                {Object.keys(productsQuantity).map(productId => (
                        <ProductCard 
                            key={productsQuantity[productId][0].id+Math.floor(Math.random() * 250)}
                            type='cart'
                            profile={productsQuantity[productId][0].imgs ? 'https://api.gameverseproject.tech/img/blogs/' + productsQuantity[productId][0].imgs.split(", ")[0] : 
                            'https://api.gameverseproject.tech/img/blogs/blog_default_banner.jpg'}
                            name={productsQuantity[productId][0].name}
                            slug = {productsQuantity[productId][0].slug}
                            categories={productsQuantity[productId][0].categories}
                            sale_price={productsQuantity[productId][0].sale_price}
                            quantity={productsQuantity[productId].length}
                        />
                    ))}
                    <hr className='hr2'/>
                    <div className='total'>
                        <h4>Total: {total} €</h4>
                        <form action={process.env.NEXT_PUBLIC_DB_HOST_API+"/pay/checkout"} method="POST" onSubmit={handleSubmit}>
                            <button type='submit' className='order'>Process Order</button>
                        </form>
                    </div>
                </>                
            : <h4>There is not products yet.</h4>}
        </div>
    );

}

export default function Cart() {

    useEffect(() => {
        isLogedRedirect();
    }, [])

    return (
        <main>
            <div className='divFlex1'>
                <hr/>
                <h2 className="sectionSubtitle">Cart</h2>
                <hr/>
            </div>
            <ProductList/>
        </main>
    );
}