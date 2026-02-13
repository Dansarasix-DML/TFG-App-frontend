"use client";

import MDEditor from '@uiw/react-md-editor';
import { Api } from '@/services/Api'
import { getJwt, isLogedRedirect } from '@/services/Cookies'
import { useState, useEffect } from "react";
import '../../../../css/addPost.css';
import Swal from 'sweetalert2';


export default function PostAdd() {

  isLogedRedirect();

  const [actualizado, setActualizado] = useState("");
  const [post, setPost] = useState({
    title: "",
    subtitle: "",
    slug: "",
    content: "",
    banner_img: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await Api.post(window.location.pathname.replace("/edit", ""), "", getJwt());
        setPost(res.data.post);
  
        // Una vez que el post se ha establecido, llamar a fetchBloggerId
        await fetchBloggerId(res.data.post.slug);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
  
    const fetchBloggerId = async (slug) => {
      try {
        const response1 = await Api.post(window.location.pathname.replace(`${slug}/edit`, ""), "", getJwt());
        const bloggerId = response1.data.blogger;
  
        const response2 = await Api.post("/auth/me", "", getJwt());
        if (response2.data.id !== bloggerId) {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Error fetching blogger ID or user data", error);
      }
    };
  
    fetchData();
  }, []);
  

  const buttonFn = (values) => {
    values = Object.fromEntries(values.entries());
    values.id = post.id;
    Api.post(window.location.pathname, values, getJwt()).then(res => {
        if(res.statusCode === 422) {
          console.log(res);
        } if(res.statusCode === 200) {
          // setActualizado("Post actualizado correctamente");
          Swal.fire({
            title: "Success edit!",
            text: "The post has been edited successfully",
            icon: "success",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Go to blog page",
            cancelButtonText: "Return to Dashboard"
        }).then((result) => {
            window.location.href = (result.isConfirmed) ? 
            window.location.pathname.replace("/edit", "") : "/dashboard";
        });
        } else {
          console.log(res);
        }
      });
    }

    const setValue = (value) => {
      setPost(prevPost => ({
        ...prevPost,
        content: value
      }));
    };

    return (
      <div className='divBox1'>
        <div className='addPostFormBox'>
          <form method='POST' className='addPostForm' onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              buttonFn(data);
          }}>
            <h2>Actualizar Post</h2>
            <div>
              <label htmlFor="title">Título del post:</label>
              <input type="text" placeholder='Título' name='title' id='title' value={post.title} onChange={e => setPost({...post, title: e.target.value})} required/>
            </div>
            <div>
              <label htmlFor="subtitle">Subtítulo del post:</label>
              <input type="text" placeholder='Título' name='subtitle' id='subtitle' value={post.subtitle} onChange={e => setPost({...post, subtitle: e.target.value})} required/>
            </div>
            <div>
              <label htmlFor="slug">Slug del post:</label>
              <input type="text" placeholder='Enlace' name='slug' id='slug' value={post.slug} onChange={e => setPost({...post, slug: e.target.value})} required/>
            </div>
            <div>
                <MDEditor
                    value={post.content}
                    onChange={setValue}
                />
                <input type="hidden" name="content" value={post.content}/>
            </div>
            <div>
              <label htmlFor="banner_img">Banner del post:</label>
              <input type="text" placeholder='Banner del post' id='banner_img' name='banner_img' value={post.banner_img} onChange={e => setPost({...post, banner_img: e.target.value})}/>
            </div>
            <button type='SUBMIT'>Actualizar Post</button>
          </form>
          <p>{actualizado}</p>
        </div>
      </div>
    );
}