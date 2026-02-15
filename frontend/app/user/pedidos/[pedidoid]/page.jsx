'use client';

import { Api } from "@/services/Api";
import { getJwt, isLogedRedirect } from "@/services/Cookies";
import { useEffect, useState } from "react";
import "@/app/css/pedidos.css"

function ProductCard({ name, description, price, quantity, imgs }) {
    return (
      <div className="productCard">
        {/* <Carousel productSlug={productSlug} /> */}
        <img src={"https://gameverse-app.vercel.app/img/blogs/" + imgs.split(', ')[0]} alt="" />
        <div>
            <h3>{name}</h3>
            <p>{description}</p>
            <p><strong>Precio:</strong> {price}€</p>
            <p><strong>Cantidad:</strong> {quantity}</p>
        </div>
      </div>
    );
}

function AddressCard({ name, address }) {
    const [city, country, line1, line2, postal_code, state] = address.split(';');
    return (
        <div className="addressCard">
            <h3>Dirección de Envío</h3>
            <p><strong>Nombre:</strong> {name}</p>
            <p><strong>Ciudad:</strong> {city}</p>
            <p><strong>País:</strong> {country}</p>
            <p><strong>Dirección 1:</strong> {line1}</p>
            {line2 && <p><strong>Dirección 2:</strong> {line2}</p>}
            <p><strong>Código Postal:</strong> {postal_code}</p>
            <p><strong>Estado:</strong> {state}</p>
        </div>
    );
}

export default function PedidoDetalle({ params }) {
    const [order, setOrder] = useState(false);

    useEffect(() => {
        isLogedRedirect();

        Api.post("/user/getOrderDetails", { 'order_id': params.pedidoid }, getJwt()).then(res => {
            if (res.statusCode === 401) {
                // Handle unauthorized
            } else if (res.statusCode === 404) {
                // Handle not found
            } else if (res.statusCode === 200) {
                setOrder(res.data);
            }
        });
    }, []);

    if (order) {
        return (
            <main>
                <div className="orderCard">
                    <div className="orderCard-header">
                        <h2>Pedido #{order.order.id}</h2>
                    </div>
                    <div className="orderCard-body">
                        <div className="orderCard-details">
                            <p><strong>Fecha de Compra:</strong> {new Date(order.order.datetime).toLocaleString()}</p>
                            <p><strong>Subtotal:</strong> {order.order.price}€</p>
                            <p><strong>IVA:</strong> {order.order.tax}€</p>
                            <p className="orderCard-details-total"><strong>Total:</strong> {order.order.total}€</p>
                        </div>
                        <div className={`orderCard-status ${order.order.status.toLowerCase()}`}>
                            <p>{order.order.status}</p>
                        </div>
                    </div>
                    <div className="orderCard-shipping">
                        <AddressCard name={order.order.ship_name} address={order.order.ship_address} />
                    </div>
                    <div className="orderCard-products">
                        {order.order_details.map((product, index) => (
                            <ProductCard
                                key={index}
                                name={product.product.name}
                                description={product.product.summary}
                                price={product.discount_price != 0 ? product.discount_price : product.unitary_price}
                                quantity={product.quantity}
                                imgs={product.product.imgs}
                            />
                        ))}
                    </div>
                    <div className="orderCard-footer">
                        <small>Last updated: {new Date(order.order.updated_at).toLocaleString()}</small>
                    </div>
                </div>
            </main>
        );
    }

    return null; // or a loading indicator
}
