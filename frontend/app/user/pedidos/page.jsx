'use client';

import { Api } from "@/services/Api";
import { getJwt, isLogedRedirect } from "@/services/Cookies";
import { useEffect, useState } from "react";
import "@/app/css/pedidos.css"

export default function Pedidos() {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        isLogedRedirect();
        
        Api.post('/user/myOrders', "", getJwt()).then(res => {
            console.log(res.data);
            setOrders(res.data);
        })
    }, [])
    
    return(
        <main>
            <div className="pageTitle">
                <hr style={{width: "40%"}}/>
                <h1 className="section-name">Pedidos</h1>
                <hr style={{width: "40%"}}/>
            </div>
            <div className="listadoOrders">
                {orders.map(order => (
                    <OrderCard 
                        key={order.order.id}
                        id={order.order.id}
                        datetime={order.order.datetime}
                        price={order.order.price}
                        tax={order.order.tax}
                        total={order.order.total}
                        status={order.order.status}
                        updated_at={order.order.updated_at} 
                    />
                ))}
            </div>
        </main>
    )
}

function OrderCard({ id, datetime, price, tax, total, status, updated_at }) {
    function handleClickRedirect() {
        window.location.href = "/user/pedidos/"+id;
    }

    return (
      <div className="orderCard" onClick={handleClickRedirect}>
        <div className="orderCard-header">
          <h2>Pedido #{id}</h2>
        </div>
        <div className="orderCard-body">
          <div className="orderCard-details">
            <p><strong>Fecha de Compra:</strong> {new Date(datetime).toLocaleString()}</p>
            <p><strong>Subtotal:</strong> {price}€</p>
            <p><strong>IVA:</strong> {tax}€</p>
            <p className="orderCard-details-total"><strong>Total:</strong> {total}€</p>
          </div>
          <div className={`orderCard-status ${status.toLowerCase()}`}>
            <p>{status}</p>
          </div>
        </div>
        <div className="orderCard-footer">
          <small>Last updated: {new Date(updated_at).toLocaleString()}</small>
        </div>
      </div>
    );
  }