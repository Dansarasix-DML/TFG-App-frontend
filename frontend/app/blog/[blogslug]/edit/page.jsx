"use client";

import { Api } from '@/services/Api';
import { getJwt, isLogedRedirect } from '@/services/Cookies';
import { useState, useEffect } from "react";
import '../../../css/addBlog.css';
import Swal from 'sweetalert2';


export default function EditBLog() {


  const [actualizado, setActualizado] = useState("");
  const [blog, setBlog] = useState({
    title: "",
    slug: "",
    description: "",
    profile_img: "",
    banner_img: "",
    blogger: ""
  });

  useEffect(() => {
    isLogedRedirect();

    const fetchData = async () => {
      try {
        const res = await Api.post(window.location.pathname.replace("/edit", ""), "", getJwt());
        setBlog(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Error fetching blog data:", error);
      }
    };

    fetchData();

  }, [])

  useEffect(() => {
    Api.post("/auth/me", "", getJwt()).then(res => {
      if (res.data.id !== blog.blogger && blog.blogger !== "") {
        window.location.href = "/dashboard";
      }
    }
    );

  }, [blog])

  const buttonFn = (values) => {
      values = Object.fromEntries(values.entries());
      Api.post(window.location.pathname, values, getJwt()).then(res => {
          if(res.statusCode === 422) {
            console.log(res);
          } if(res.statusCode === 200) {
            // setActualizado("Blog actualizado correctamente");
            console.log(res);
            Swal.fire({
              title: "Blog updated!",
              text: "The blog has been updated successfully",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Go to blog page",
              cancelButtonText: "Return to Dashboard"
          }).then((result) => {
              window.location.href = (result.isConfirmed) ? 
              "/blog/" + blog.slug : "/dashboard";
          });
          } else {
            console.log(res);
          }
        });
      }

  return (
      <div className='divBox1'>
        <div className='addBlogFormBox'>
          <form method='POST' className='addBlogForm' onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              buttonFn(data);
          }}>
            <h2>Editar Blog</h2>
            <div>
              <label htmlFor="title">Título del blog:</label>
              <input type="text" placeholder='Título' name='title' id='title' required defaultValue={blog.title} onChange={e => setBlog({...blog, title: e.target.value})}/>
            </div>
            <div>
              <label htmlFor="slug">Slug del blog:</label>
              <input type="text" placeholder='Enlace' name='slug' id='slug' required defaultValue={blog.slug} onChange={e => setBlog({...blog, slug: e.target.value})}/>
            </div>
            <div>
              <label htmlFor="description">Descripción del blog:</label>
              <input type="text" placeholder='Descripción' id='description' name='description' defaultValue={blog.description} onChange={e => setBlog({...blog, description: e.target.value})}/>
            </div>
            <div>
              <label htmlFor="profile_img">Icono del blog:</label>
              <input type="text" placeholder='Icono del blog' id='profile_img' name='profile_img' defaultValue={blog.profile_img} onChange={e => setBlog({...blog, profile_img: e.target.value})}/>
            </div>
            <div>
              <label htmlFor="banner_img">Banner del blog:</label>
              <input type="text" placeholder='Banner del blog' id='banner_img' name='banner_img' defaultValue={blog.banner_img} onChange={e => setBlog({...blog, banner_img: e.target.value})}/>
            </div>
            <input type="hidden" name="id" defaultValue={blog.id} />
            <button type='SUBMIT'>Editar Blog</button>
          </form>
          <p>{actualizado}</p>
        </div>
      </div>
    );
}