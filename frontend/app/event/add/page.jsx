'use client';

import { getJwt, isLogedRedirect } from "@/services/Cookies"
import { useEffect, useState } from "react";
import { Api } from "@/services/Api";
import MDEditor from '@uiw/react-md-editor';
import "@/app/css/addEvent.css"
import Swal from 'sweetalert2';

export default function AddEvent() {
    const [blogs, setBlogs] = useState([])
    const [value, setValue] = useState("**Hello world!!!**");
    const [bannerImgName, setBannerImgName] = useState("Banner del evento");

    const handleFileChange = (e, setFileName) => {
      const file = e.target.files[0];
      if (file) {
        setFileName(file.name);
      }
    };

    const getOwnBlogs = () => {
        Api.post("/blog/me", "", getJwt()).then(res => {
            console.log(res);
            setBlogs(res.data)
        })
    }

    useEffect(() => {
        isLogedRedirect();
        getOwnBlogs();
    }, [])

    const buttonFn = values => {
        if (values.get('banner_img').name === "") {
            values.set('banner_img', 'default_banner.jpeg');
        }
        Api.postFiles("/event/add", values, getJwt()).then(res => {
            if(res.statusCode === 422) {
              console.log(res);
            } if(res.statusCode === 201) {
                Swal.fire({
                    title: "Success creating the event!",
                    text: "The event has been created successfully",
                    icon: "success",
                    showCancelButton: true,
                    confirmButtonColor: "#3085d6",
                    cancelButtonColor: "#d33",
                    confirmButtonText: "Go to the event page"
                }).then((result) => {
                    window.location.href = (result.isConfirmed) ? 
                    "/event/" + values.get('slug') : "/dashboard";
                });
            } else {
              console.log(res);
            }
          });
        }

    function buttonHandler(e) {
        e.preventDefault();
        const data = new FormData(e.target);
        buttonFn(data);
    }
    

    return (
        <main className="addEventMain">
            <form className="addEventForm" onSubmit={buttonHandler}>
                <div>
                    <p>Seleccione el blog*: </p>
                    <select name="blog_id" required>
                        {blogs.map(blog => (
                            <option key={blog.id} value={blog.id}>{blog.title}</option>
                        ))}
                    </select>
                    <p>Título del evento*: </p>
                    <input type="text" name="title" placeholder="Title" required/>
                    <p>Subtítulo del evento*: </p>
                    <input type="text" name="subtitle" placeholder="Subtitle" required/>
                    <p>Slug del evento*: </p>
                    <input type="text" name="slug" placeholder="Slug" required/>
                    <span className="title-label">Banner del evento*:</span>
                    <label htmlFor="banner_img" className="custom-file-label">{bannerImgName}</label>
                    <input type="file" id="banner_img" name="banner_img" onChange={(e) => handleFileChange(e, setBannerImgName)}/>
                
                </div>
                <p>Habla sobre tu evento!</p>
                <MDEditor
                    value={value}
                    onChange={setValue}
                />
                <input type="hidden" name="content" value={value} />
                <div>
                    <p>Fecha de inicio del evento*: </p>
                    <input type="datetime" name="start_dtime" required/>
                    <p>Fecha de fin del evento*: </p>
                    <input type="datetime" name="end_dtime" required/>
                    <p>Ubicación del evento: </p>
                    <input type="text" name="ubication" placeholder="Ubication" />
                    <p>Sección (ubicación) del evento: </p>
                    <input type="text" name="section" placeholder="Sección" />
                    <p>Capacidad del evento (0 si no hay): </p>
                    <input type="number" name="capacity" min="0" placeholder="Capacidad" defaultValue={0}/>
                </div>

                <button type="submit">Crear Evento!</button>
            </form>
        </main>
    )
}