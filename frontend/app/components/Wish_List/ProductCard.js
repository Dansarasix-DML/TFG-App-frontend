import Trash from "../Common/Trash";
import { Api } from '@/services/Api';
import { getJwt } from '@/services/Cookies';
import Swal from 'sweetalert2';

export default function ProductCard({profile, type, name, slug, categories, sale_price, onDeleted, quantity}) {

    const initialQuantity = quantity;

    const clickFn = () => {
        window.location.href = "/shop/"+slug;
    }

    const deleteBtn = () => {

        const handleDeleteClick = (event) => {
            event.stopPropagation();  // Evitar que el evento se propague al click del artículo
            // console.log('delete');

            const url = type === 'cart' ? '/shop/removeCart' : '/shop/removeWishList';

            Api.post(url, {productSlug: slug}, getJwt()).then((res) => {
                // console.log(message);
                // alert(message);
                Swal.fire({
                    title: type === 'cart' ? 'Product removed from cart!' 
                    : 'Product removed from wish list!',
                    text: type === 'cart' ? 'This product has been removed from your cart!' 
                    : 'This product has been removed from your wish list!',
                    icon: "success"
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.reload();
                    }
                });
            })
        }

        return (
            <button className='delete' onClick={handleDeleteClick}><Trash/></button>
        )
    }

    function quantityHolder(e) {
        if (e.target.value < initialQuantity) {
            Api.post("/shop/removeCartProduct", {productSlug: slug}, getJwt()).then((res) => {
                window.location.reload();
            })
        } else {
            Api.post("/shop/addCart", {productSlug: slug}, getJwt()).then((res) => {
                window.location.reload();
            })
        }
        
    }

    return (
        <div className='product-card relative' onClick={clickFn}>
            <img className='product-card-img' src={profile} alt={name}/>
            <div className="productWish-data">
                <div className="product-card-div-up-content">
                    <p className="product-card-title">{name}</p>
                </div>
                <p className="productWish-category"><strong>Category:</strong> {categories}</p>
                {type === 'cart' && (<div>
                    <p>Quantity: </p> 
                    <input className="productWish-quantity" type="number" defaultValue={quantity} min={1} max={100} onClick={e => e.stopPropagation()} onChange={quantityHolder}/>
                </div>)}
                <p className="sale-price"><strong>Price:</strong> {sale_price} €</p>
            </div>
            {deleteBtn()}
        </div>
    );
}