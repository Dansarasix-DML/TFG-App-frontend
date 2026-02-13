"use client";

import { useState } from 'react';
import './AuthCard.css'
import { Api } from '@/services/Api'
import { setUserCookies } from '@/services/Cookies'
import Modal from '@/components/Modal';
import GoogleAuth from '@/app/components/GoogleAuth/GoogleAuth';


export default function AuthCard({ title, type, captchaStatus, children }) {
    const [errors, setErrors] = useState([]);
    const [registered, setRegistered] = useState(false);
    const [captchaError, setCaptchaError] = useState(false);

    const buttonFn = (values) => {
        values = Object.fromEntries(values.entries());
        Api.post("/auth/"+type, values).then(res => {
            if(res.statusCode === 422) {
                setErrors(res.data.errors)
            } if(res.statusCode === 201) {
                setErrors([]);
                setRegistered(true);
            } if(res.statusCode === 200) {
                setUserCookies(res.data.email, res.data.token);
                if (type === "register") {
                    window.location.href = '/';
                } else {
                    window.history.back();
                }
            } else {
                console.log(res);
            }
        });
    }

    return (
        <>
        {registered === true && (
            <Modal title="Registro correcto!" type="good" message="Te has registrado correctamente, por favor, revisa tu correo para activar tu cuenta." />
        )}
        <div className='auth-card'>
            <p className='auth-card-title'>{title}</p>
            <form method='POST' className='auth-card-form' onSubmit={(e) => {
                e.preventDefault();
                if (captchaStatus || type=="login") {
                    setCaptchaError(false)
                    const data = new FormData(e.target);
                    buttonFn(data)
                } else {
                    setCaptchaError(true)
                }
            }}>
                {type === "register" && (
                    <>
                    <input type="text" placeholder='Nombre' name='name' />
                    {errors.name && (
                            <span className="error-message">
                                {errors.name[0] == "* validation.required" ? "* Nombre obligatorio" : "* Nombre incorrecto"}
                            </span>
                        )}
                    <input type="text" placeholder='Nombre de Usuario' name='username' />
                    {errors.username && (
                            <span className="error-message">
                                {errors.username[0] == "* validation.required" ? "* Nombre de usuario obligatorio" : errors.username[0] == "validation.unique" ? "* Nombre de usuario en uso" : "* Nombre de usuario incorrecto"}
                            </span>
                        )}
                    </>
                )}
                <input type="email" placeholder='Email' name='email' />
                {errors.email && (
                        <span className="error-message">
                            {/* {errors.email[0] == "validation.required" ? "* Email obligatorio" : errors.email[0] ? "* Email en uso" :"* Email incorrecto"} */}
                            {errors.email[0] === "validation.exists" ? "Email incorrecto" : errors.email[0] == "validation.required" ? "* Email obligatorio" : errors.email[0] ? "* Email en uso" :"* Email incorrecto"}
                        </span>
                    )}
                <input type="password" placeholder='Contraseña' name='password' />
                {errors.password && (
                        <span className="error-message">
                            {errors.password[0] == "validation.required" ? "* Contraseña obligatoria" : errors.password[0] == "validation.min.string" ? "* La contraseña debe contener más de 8 caracteres" : "* Contraseña incorrecta"}
                        </span>
                    )}
                { type == "register" ? <p className='legal-span'>Al crear una cuenta, aceptas nuestros <a href="">Términos de Servicio</a> y <a href="">Política de Privacidad</a></p> : <></> }
                {children}
                <span className="error-message" style={{textAlign: 'center'}}>
                    {captchaError ? "* Debes pasar el captcha de verificación" : ""}
                </span>
                <button type='SUBMIT'>{ type == "register" ? "Registrarse" : "Iniciar Sesión" }</button>
                <span className="error-message">
                    {errors.user !== undefined ? errors.user[0] == "El usuario no está activado." ? "Error: El usuario no está activado." : "Ha ocurrido un error" : ""}
                </span>
            </form>
            {type=="register" 
                ? <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p> 
                : 
                <>
                    <p className='register-ask'>¿Todavía no tienes cuenta? <a href="/register">Regístrate</a></p>
                    <p>¿Has olvidado tu contraseña? <a href="/login">Recupérala</a></p>
                </>
            }
            <hr className='form-divider'/>
            <GoogleAuth />
        </div>
        </>
    )
}