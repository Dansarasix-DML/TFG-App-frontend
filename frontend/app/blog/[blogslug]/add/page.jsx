"use client";

import MDEditor from '@uiw/react-md-editor';
import { Api } from '@/services/Api'
import { getJwt, isLogedRedirect } from '@/services/Cookies'
import { useState, useEffect } from "react";
import '../../../css/addPost.css';
import Swal from 'sweetalert2';

export default function PostAdd({}) {

  isLogedRedirect();

  const [value, setValue] = useState("**Hello world!!!**");
  const [bannerImgName, setBannerImgName] = useState("Banner del post");

  const handleFileChange = (e, setFileName) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  useEffect(() => {
    const fetchBloggerId = async () => {
      try {
        const response1 = await Api.post(window.location.pathname.replace("/add", ""), "", getJwt());
        const bloggerId = response1.data.blogger;
  
        const response2 = await Api.post("/auth/me", "", getJwt());
        if (response2.data.id !== bloggerId) {
          window.location.href = "/dashboard";
        }
      } catch (error) {
        console.error("Error fetching blogger ID or user data", error);
      }
    };
  
    fetchBloggerId();
  }, []);
    

  const buttonFn = (values) => {
    if (values.get('banner_img').name === "") {
      values.set('banner_img', 'post_default_banner.png');
    }

    console.log(Object.fromEntries(values));

    Api.postFiles(window.location.pathname, values, getJwt()).then(res => {
        if(res.statusCode === 422) {
          console.log(res);
        } if(res.statusCode === 201) {
          // setCreado("Post creado correctamente");
          Swal.fire({
              title: "Success creating the post!",
              text: "The post has been created successfully",
              icon: "success",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Go to post page",
              cancelButtonText: "Return to Dashboard"
          }).then((result) => {
              window.location.href = (result.isConfirmed) ? 
              window.location.pathname.replace("/add", "") + "/" + values.get('slug') : "/dashboard";
          });
        } else {
          console.log(res);
        }
      });
    }

    return (
      <div className='divBox1'>
        <div className='addPostFormBox'>
          <form method='POST' className='addPostForm' onSubmit={(e) => {
              e.preventDefault();
              const data = new FormData(e.target);
              buttonFn(data);
          }}>
            <h2>Nuevo Post</h2>
            <div>
              <label htmlFor="title">Título del post:</label>
              <input type="text" placeholder='Título' name='title' id='title' required/>
            </div>
            <div>
              <label htmlFor="subtitle">Subtítulo del post:</label>
              <input type="text" placeholder='Título' name='subtitle' id='subtitle' required/>
            </div>
            <div>
              <label htmlFor="slug">Slug del post:</label>
              <input type="text" placeholder='Enlace' name='slug' id='slug' required/>
            </div>
            <div>
                <MDEditor
                    value={value}
                    onChange={setValue}
                />
                <input type="hidden" name="content" value={value}/>
            </div>
            <div className="custom-file-input">
              <span className="title-label">Banner del post:</span>
              <label htmlFor="banner_img" className="custom-file-label">{bannerImgName}</label>
              <input type="file" id="banner_img" name="banner_img" onChange={(e) => handleFileChange(e, setBannerImgName)}/>
            </div>
            <button type='SUBMIT'>Crear Nuevo Post</button>
          </form>
          {/* <p>{creado}</p> */}
        </div>
      </div>
    );
}