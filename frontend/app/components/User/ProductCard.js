'use client';

import { useState, useEffect } from 'react';
import './BlogCard.css';
import './ProductCard.css';
import { Api } from '@/services/Api'
import { getJwt } from '@/services/Cookies'

const ConfirmationModal = ({ type, show, onClose, onConfirm }) => {
    if (!show) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirmación</h2>
                <p>¿Estás seguro de que deseas eliminar este {type}?</p>
                <button onClick={onConfirm}>Sí</button>
                <button onClick={onClose}>No</button>
            </div>
        </div>
    );
};

export default function ProductCard({banner, name, slug, editable}) {
    const [showModal, setShowModal] = useState(false);
    const type = "producto";

    const clickFn = () => {
        window.location.href = "/shop/"+slug;
    }    

    const handleDeleteClick = (event) => {
        event.stopPropagation();  // Evitar que el evento se propague al click del artículo
        setShowModal(true);
    }

    const handleConfirm = () => {
        Api.delete("/shop/"+slug+"/delete", getJwt()).then((res) => {
            console.log(res);
            if (res.statusCode === 200) {
                setShowModal(false);
                window.location.href = "/dashboard";
            }
        })
    }

    const back = banner ? "url(https://api.gameverseproject.tech/img/blogs/"+banner+")" : "url(https://api.gameverseproject.tech/img/banner01.jpg)";

    return (
        <>
        <article className="blog-card" style={{backgroundImage: back}} onClick={clickFn}>
            <div className='blog-card-data'>
                <div className="blog-card-div-content">
                    <p className="product-card-name">{name}</p>
                    { editable && (
                        <div className='actions'>
                            {/* <a href={"/shop/"+slug+"/edit"}>
                                <p><i className="bi bi-pencil-fill"></i> Edit</p>
                            </a> */}
                            <a href={"/dashboard/#"}>
                                <p><i className="bi bi-pencil-fill"></i> Edit</p>
                            </a>
                            <a href="#!" onClick={handleDeleteClick}>
                                <p><i className="bi bi-trash"></i> Delete</p>
                            </a>
                        </div>
                        )
                    }
                </div>
            </div>
            <div className="blog-card-div">
            </div>
        </article>
        <ConfirmationModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={handleConfirm}
            type={type}
        />
        </>
    )


}