import {useState, useEffect, useRef} from 'react';
import StarButton from '../Buttons/StarButton';
import Axios from 'axios';
import { Api } from '@/services/Api';
import { getJwt } from '@/services/Cookies';
import Swal from 'sweetalert2';

export default function ProductData({productSlug}) {
    const [product, setProduct] = useState([]);
    const [rating, setRating] = useState([]);
    const [loged, setLoged] = useState(false);

    useEffect(() => {
        async function fetchProduct() {
            try {
                const response = await Axios.get(process.env.DB_HOST + '/api/shop/productDataAJAX/'+productSlug);
                setProduct(response.data.product);
                setRating(response.data.rating);
            } catch (error) {
                console.error(error);
            }
        }

        fetchProduct();
    }, [productSlug]);

    const addCart = () => {
        Api.post("/shop/addCart", {productSlug: productSlug}, getJwt()).then(res => {
            if (res.statusCode === 200) {
                console.log('Product added to cart');
                // alert('Product added to cart');
                Swal.fire({
                    title: "Product added to cart!",
                    text: "Look your cart to see the product!",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Go to cart"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/shop/cart";
                    }
                });
            }
        })
    
    }

    const addWishList = () => {
        Api.post("/shop/addWishList", {productSlug: productSlug}, getJwt()).then(res => {
            if (res.statusCode === 200) {
                console.log('Product added to wish list');
                // alert('Product added to wish list');
                Swal.fire({
                    title: "Product added to wish list!",
                    text: "Look your wish list to see the product!",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Go to wish list"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = "/shop/wish_list";
                    }
                });
            }
        })
    
    }

    useEffect(() => {
        Api.post("/auth/me", "", getJwt()).then(res => {
          if (res.data.id) {
              setLoged(true);
            }
          }
        )
    }, [])

    return (
        <div className='data1'>
            <h1>{product.name}</h1>
            <h3><span className='span1'>Blog:</span> {product.blogTitle}</h3>
            <p><strong><span className='span1'>Category:</span> {product.categories}</strong></p>
            <div className='starButtons'><span className='span1'>
                Rating:</span> <strong>{isNaN(parseFloat(rating).toFixed(2)) ? 0 : parseFloat(rating).toFixed(2)}</strong> 
                <StarButton startValue={Math.floor(rating)} />
            </div>
            {/* <p className='desc'><span>Description:</span>{product.description}</p> */}
            <div className='pricesBox'>
                <span>Price:</span>
                <div className='prices'>
                    <p className='sale_sale'>{product.sale_price} €</p>
                    <p className='purchase_sale'>{product.purchase_price} €</p>
                </div>
            </div>
            {loged && (
                <div className='actions'>
                    <button className='add' onClick={addCart}>Add to cart</button>
                    <button className='add-list' onClick={addWishList}>Add to wish list</button>
                </div>
            )}
        </div>
    )

}