'use client';

import Error from "@/app/components/Common/Error";
import { Api } from "@/services/Api";
import { useEffect, useState } from "react";

export default function TokenValidation({params}) {
    const [error, setError] = useState("");

    useEffect(() => {
        if (!params.token) {
            window.location.href = "/login";
        }

        let token = {token: params.token} 
        console.log(token);
        Api.post("/auth/activateToken", token, "").then(res => {
            if (res.statusCode === 200) {
                window.location.href = "/login";
            } else if(res.statusCode === 401) {
                setError("invalid");
            } else if(res.statusCode === 410) {
                setError("already");
                window.location.href = "/";
            } else {
                window.location.href = "/";
            }
        })
    }, [])
    
    if (error == "invalid") {
        return (
            <Error error="Token no válido" content="El token introducido no es correcto. Por favor, vuelve a intentarlo."/>
        )
    }

    if (error == "already") {
        return (
            <Error error="Token ya activado" content="El token introducido ya ha sido activado. Ya puedes iniciar sesión."/>
        )
    }
}