// Importa Suspense y cualquier otro hook necesario
'use client';

import { Suspense } from 'react';
import { Api } from "@/services/Api";
import { getJwt, isLogedRedirect } from "@/services/Cookies";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
import "@/app/css/checkoutFinish.css";

function CompraCorrecta() {
    const searchParams = useSearchParams();
    
    const [order, setOrder] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    
    useEffect(() => {
        isLogedRedirect();

        const success = searchParams.get('success');
        const session_id = searchParams.get('session_id');
        const canceled = searchParams.get('canceled');

        if (success && session_id) {
            Api.post("/pay/getCheckoutData", {'checkout': session_id}, getJwt()).then(res => {
                console.log(res.data);
                setOrder(res.data.order);
                setIsLoading(false);
                setIsError(false);
            }).catch(err => {
                console.error("Error fetching checkout data:", err);
                setIsLoading(false);
                setIsError(true);
            });
        } else {
            setIsLoading(false);
            setIsError(true);
        }
    }, [searchParams]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return (
            <div className="checkout-finish">
                <p className="checkout-finish-error">¡Ha ocurrido un error al procesar el pago, por favor, vuelve a intentarlo pasados unos minutos!</p>
            </div>
        );
    }

    return(
        <div className="checkout-finish">
            <p className="checkout-finish-title">¡Gracias por tu compra!</p>
            <hr />
            <p className="checkout-finish-order-id">Pedido #{order.id}</p>
            <hr />
            <p className="checkout-finish-text">Para obtener más información acerca del estado de tu pedido pulsa <a href="/user/pedidos">AQUÍ</a> o visita la página de Pedidos.</p>
        </div>
    );
}

export default function PageWrapper() {
    return (
        <main>
            <Suspense fallback={<div>Loading...</div>}>
                <CompraCorrecta />
            </Suspense>
        </main>
    );
}
