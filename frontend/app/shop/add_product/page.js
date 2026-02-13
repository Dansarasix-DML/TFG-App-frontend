"use client";
import { Api } from '@/services/Api'
import { getCookies, getJwt, isLogedRedirect } from '@/services/Cookies'
import { useState, useEffect } from "react";
import FileUploader from '@/app/components/FileUploader/FileUploader';
import '../../css/addProduct.css';
import Swal from 'sweetalert2';

export default function AddProduct() {
    const [cookies, setCookies] = useState({});
    const [files, setFiles] = useState([]);
    const [types, setTypes] = useState([]);
    const [blogs, setBlogs] = useState([]);

    useEffect(() => {
        isLogedRedirect()
        
        async function fetchType() {
            try {
                Api.post("/shop/productsTypesAJAX", "", getJwt()).then(res => {
                    setTypes(res.data.types);
                })
            } catch (error) {
                console.error(error);
            }
        }

        fetchType();
    }, []);

    useEffect(() => {
        let cookieString = document.cookie;

        let cookies = cookieString.split('; ');
        let cookieObj = {};
        cookies.forEach(cookie => {
            let [name, value] = cookie.split('=');
            cookieObj[name] = decodeURIComponent(value);
        });

        setCookies(cookieObj);
    }, []);

    useEffect(() => {
        Api.post("/blog/me", "", getJwt()).then(res => {
            if (res.statusCode === 200) {
                setBlogs(res.data);
            }
        });
    }, [cookies]);

    const handleFilesChange = (newFiles) => {
        setFiles(newFiles);
    };

    useEffect(() => {
        setCookies(getCookies());
    }, []);

    const buttonFn = (data) => {
        // console.log(data);
        Api.postFiles("/shop/add", data, getJwt()).then(res => {
            if (res.statusCode === 422) {
                console.log(res);
            } else if (res.statusCode === 201) {
                // setCreado("Producto creado correctamente");
                Swal.fire({
                    title: "Success creating the product!",
                    text: "The product has been created successfully",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Go to the product page"
                }).then((result) => {
                    window.location.href = (result.isConfirmed) ? 
                    "/shop/" + data.get("slug") : "/dashboard";
                });
            } else {
                console.log(res);
            }
        });
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.target);
        files.forEach((file, index) => {
            data.append(`file-${index}`, file);
        });
        buttonFn(data);
    };

    return (
        <main>
            <div className='divBox1'>
                <div className='addBlogFormBox'>
                    <form method='POST' className='addBlogForm' encType="multipart/form-data" onSubmit={handleSubmit}>
                        <h2>Nuevo Producto</h2>
                        <div>
                            <div className='part'>
                                <div>
                                    <label htmlFor="name">Nombre del producto:</label>
                                    <input type="text" placeholder='Nombre' name='name' id='name' required />
                                </div>
                                <div>
                                    <label htmlFor="slug">Slug del producto:</label>
                                    <input type="text" placeholder='Enlace' name='slug' id='slug' required />
                                </div>
                                <div>
                                    <label htmlFor="type">Tipo del producto:</label>
                                    <select name="type" id="type">
                                        <option hidden defaultValue={0} key="-1">Selecciona una opcion</option>
                                        {types && types.map((type, index) => (
                                            <option value={type.id} key={index}>{type.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="blog">Blog del producto:</label>
                                    <select name="blog" id="blog">
                                        <option hidden defaultValue={0} key="-1">Selecciona una opcion</option>
                                        {blogs && blogs.map((blog, index) => (
                                            <option value={blog.slug} key={index}>{blog.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className='part'>
                                <div>
                                    <label htmlFor="categories">Categorias del producto:</label>
                                    <input type="text" placeholder='Categorias' name='categories' id='categories' required />
                                </div>
                                <div>
                                    <label htmlFor="purchase_price">Precio de compra del producto:</label>
                                    <input type="text" placeholder='Precio de compra' name='purchase_price' id='purchase_price' required />
                                </div>
                                <div>
                                    <label htmlFor="sale_price">Precio de venta del producto:</label>
                                    <input type="text" placeholder='Precio de venta' name='sale_price' id='sale_price' required />
                                </div>
                                <div>
                                    <label htmlFor="taxes">Tasas del producto:</label>
                                    <input type="text" placeholder='Tasas' name='taxes' id='taxes' />
                                </div>
                                <div>
                                    <label htmlFor="quantity">Cantidad del producto:</label>
                                    <input type="number" placeholder='Cantidad' name='quantity' id='quantity' required />
                                </div>
                            </div>
                            <div className='part'>
                                <div>
                                    <label>Archivos adjuntos:</label>
                                    <FileUploader onFilesChange={handleFilesChange} />
                                </div>
                            </div>
                        </div>
                        <div className='textareasBox'>
                            <div className='desc'>
                                <label htmlFor="desc">Descripción del producto:</label>
                                <textarea placeholder='Descripción' name='desc' id='desc' />
                            </div>
                            <div className='desc'>
                                <label htmlFor="summary">Resumen del producto:</label>
                                <textarea placeholder='Resumen' name='summary' id='summary' />
                            </div>
                        </div>
                        <button type="submit">Crear Nuevo Producto</button>
                    </form>
                </div>
            </div>
        </main>
    );
}