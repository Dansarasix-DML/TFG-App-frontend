"use client";

import { useEffect, useState } from "react";
import { Api } from '@/services/Api';
import { getJwt, eraseCookies } from '@/services/Cookies';

function Header() {

  const [loged, setLoged] = useState(false);
  const [username, setUsername] = useState("");

  function logout(e) {
    e.preventDefault();
    eraseCookies();
  }

  useEffect(() => {
    Api.post("/auth/me", "", getJwt()).then(res => {
      if (res.data.id) {
          setLoged(true);
          setUsername(res.data.username);
        }
      }
    )
  }, [])
  

    return (
      <header className="main-header">
          <nav>
            <ul>
              <a href='/'><li><i className="bi bi-house-door-fill"></i><span className="main-header-icons-text"> Home</span></li></a>
              <a href='/shop'><li><i className="bi bi-bag-fill"></i><span className="main-header-icons-text"> Shop</span></li></a>
              <a href='/event'><li><i className="bi bi-people-fill"></i><span className="main-header-icons-text"> Events</span></li></a>
              {loged && ( 
                <>
                  <a href='/dashboard' className="loginButtonLink"><li className="loginButton">DashBoard</li></a>
                  <a href={'/user/pedidos'}><li><i className="bi bi-archive-fill"></i></li></a>
                  <a href={'/shop/cart'}><li><i className="bi bi-cart-fill"></i></li></a>
                  <a href={'/shop/wish_list'}><li><i className="bi bi-bookmark-fill"></i></li></a>
                  <a href='/logout'><li><i className="bi bi-box-arrow-right" onClick={logout}></i></li></a>
                </>
              )}
              {!loged && ( 
                  <a href='/login' className="loginButtonLink"><li className="loginButton">Login</li></a>
              )}
            </ul>
          </nav>
          <section className='main-header-title-section'>
              <h1>Game<span>V</span>erse</h1>
          </section>
      </header>
    )
  }
  
  export default Header;