'use client';

import { Api } from '@/services/Api';
import { getJwt, isLogedRedirect } from '@/services/Cookies';
import { useState, useEffect } from "react";
import '../../css/addBlog.css';
// import '../../components/FileUploader/FileUploader.css';
import Swal from 'sweetalert2';

export default function BlogAdd() {

  useEffect(() => {
    isLogedRedirect();
  
  }, [])
  
  const [slug, setSlug] = useState("");
  const [profileImgName, setProfileImgName] = useState("Icono del blog");
  const [bannerImgName, setBannerImgName] = useState("Banner del blog");

  const handleFileChange = (e, setFileName) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const buttonFn = (values) => {
    // Establecer imágenes predeterminadas si no se han proporcionado
    if (values.get('banner_img').name === "") {
      values.set('banner_img', 'blog_default_banner.png');
    }
    if (values.get('profile_img').name === "") {
      values.set('profile_img', 'blog_default_icon.png');
    }

    console.log(Object.fromEntries(values));

    Api.postFiles("/blog/add", values, getJwt()).then(res => {
        if (res.statusCode === 422) {
            console.log(res);
        } else if (res.statusCode === 201) {
            Swal.fire({
                title: "Success creating the blog!",
                text: "The blog has been created successfully",
                icon: "success",
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Go to the blog page"
            }).then((result) => {
                window.location.href = (result.isConfirmed) ? 
                "/blog/" + values.get('slug') : "/dashboard";
            });
        } else {
            console.log(res);
        }
    });
  }

  const createSlug = (title) => {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9 ]/g, '') // Remove invalid characters
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/-+/g, '-'); // Replace multiple - with single -
  }

  const handleTitleChange = (e) => {
    const newTitle = e.target.value;
    setSlug(createSlug(newTitle));
  }

  return (
    <div className='divBox1'>
      <div className='addBlogFormBox'>
        <form method='POST' className='addBlogForm' onSubmit={(e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            buttonFn(data);
        }}>
          <h2>Nuevo Blog</h2>
          <div>
            <label htmlFor="title">Título del blog:</label>
            <input type="text" placeholder='Título' name='title' id='title' required onChange={handleTitleChange}/>
          </div>
          <div>
            <label htmlFor="slug">Slug del blog:</label>
            <input type="text" placeholder='Enlace' name='slug' id='slug' required value={slug} readOnly/>
          </div>
          <div>
            <label htmlFor="description">Descripción del blog:</label>
            <input type="text" placeholder='Descripción' id='description' name='description' />
          </div>
          <div className="custom-file-input">
            <span className="title-label">Icono del blog:</span>
            <label htmlFor="profile_img" className="custom-file-label">{profileImgName}</label>
            <input type="file" id="profile_img" name="profile_img" onChange={(e) => handleFileChange(e, setProfileImgName)}/>
          </div>
          <div className="custom-file-input">
            <span className="title-label">Banner del blog:</span>
            <label htmlFor="banner_img" className="custom-file-label">{bannerImgName}</label>
            <input type="file" id="banner_img" name="banner_img" onChange={(e) => handleFileChange(e, setBannerImgName)}/>
          </div>

          {/* <div>
            <label htmlFor="profile_img">Icono del blog:</label>
            <input type="file" placeholder='Icono del blog' id='profile_img' name='profile_img' />
          </div>
          <div>
            <label htmlFor="banner_img">Banner del blog:</label>
            <input type="file" placeholder='Banner del blog' id='banner_img' name='banner_img' />
          </div> */}
          <button type='SUBMIT'>Crear Nuevo Blog</button>
        </form>
      </div>
    </div>
  );
}
