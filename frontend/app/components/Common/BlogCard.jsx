'use client';

import { useState } from 'react';
import './BlogCard.css';
import { Api } from '@/services/Api';
import { getJwt } from '@/services/Cookies';
import Swal from 'sweetalert2';


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

export default function BlogCard({ blog_banner, blog_icon, blog_name, blogger_name, blogger_username, blog_slug, editable }) {
    const [showModal, setShowModal] = useState(false);
    const type = "blog";

    const clickFn = () => {
        window.location.href = "/blog/"+blog_slug;
    }

    const handleDeleteClick = (event) => {
        event.stopPropagation();  // Evitar que el evento se propague al click del artículo
        // setShowModal(true);
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
          }).then((result) => {
            Api.delete("/blog/"+blog_slug+"/delete", getJwt()).then((res) => {
                // console.log(res);
                // window.location.href = "/dashboard";
            })
            if (result.isConfirmed) {
              Swal.fire({
                title: "Deleted!",
                text: "Your blog has been deleted.",
                icon: "success"
              }).then(() => {
                window.location.href = "/dashboard";
              });
            }
          });
    }

    const handleConfirm = () => {
        Api.delete("/blog/"+blog_slug+"/delete", getJwt()).then((res) => {
            console.log(res);
            window.location.href = "/dashboard";
        })
    }

    const back = (blog_banner && blog_banner != "" && blog_banner != " ") ? "url(https://api.gameverseproject.tech/img/blogs/"+blog_banner+")" : "url(https://api.gameverseproject.tech/img/blogs/blog_default_banner.png)";

    return (
        <>
        <article className="blog-card" style={{backgroundImage: back}} onClick={clickFn}>
            <div className='blog-card-data'>
                <img src={(blog_icon && blog_icon != "" && blog_icon != " ") ? "https://api.gameverseproject.tech/img/blogs/"+blog_icon : "https://api.gameverseproject.tech/img/blogs/post_default_icon.png"} className="blog-card-icon"/>
                <div className="blog-card-div-content">
                    <p className="blog-card-name">{blog_name}</p>
                    <p className="blog-card-blogger"><a href={'/user/'+blogger_username}>{blogger_name}</a></p>
                    { editable && (
                        <div className='actions'>
                            <a href={"/blog/"+blog_slug+"/edit"}>
                                <p><i className="bi bi-pencil-fill"></i> Edit</p>
                            </a>
                            <a href="#!" onClick={handleDeleteClick}>
                                <p><i className="bi bi-trash"></i> Delete</p>
                            </a>
                            <a href={"/blog/"+blog_slug+"/add"}>
                                <p><i className="bi bi-file-earmark-plus-fill"></i> Create Post</p>
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