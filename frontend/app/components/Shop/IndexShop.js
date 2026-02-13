import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import ProductCard from '../Common/ProductCard';
import SearchTable from './SearchTable';
import '../Common/ProductCard.css';

function LastProducts(){
    const [products, setProducts] = useState([]);

    useEffect(() => {
        async function fetchProducts() {
            try {
                const response = await Axios.get(process.env.DB_HOST + '/api/shop/lastProductsAJAX/1');
                setProducts(response.data.products);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProducts();
    }, []);

    return(
        <section className='productsIndexSection'>
            {products.map((product) => (
                <ProductCard
                    key={product.id}
                    name={product.name}
                    description={product.summary}
                    slug={product.slug}
                    imgs={product.imgs.split(',')}
                    purchase_price={product.purchase_price}
                    sale_price={product.sale_price}
                    quantity={product.quantity}
                    blogName={product.blogTitle}
                    blogImg={product.blogImg ? 'blogs/' + product.blogImg : 'avatar01.png'}
                    Type={product.Type}
                />
            ))}
        </section>
    )

}

export default function IndexShop() {
    return (
      <>
        <div className='divFlex1'>
            <hr/>
            <h2 className="sectionSubtitle">Shop</h2>
            <hr/>
        </div>
        <LastProducts />
        <div className='divFlex1'>
            <hr/>
            <h2 className="sectionSubtitle">Search</h2>
            <hr/>
        </div>
        <SearchTable />
      </>
    );
}