import PropTypes from "prop-types";
import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import clsx from "clsx";
import MenuCart from "./sub-components/MenuCart";
import axiosInstance from "../../custom_axios/axios";
import {closeWebSocket} from "../../custom_axios/Socket";
import axios from 'axios'
import NotificationIcon from './sub-components/NotificationComponent'
import { useSelector, useDispatch } from 'react-redux'
import {setdefault} from '../../../src/store/slices/notification-slice'
import VerifyOtp from "../../pages/other/Verify_Otp";

const IconGroup = ({iconWhiteClass }) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()



  const Logout_function = () => {
    localStorage.clear()
    closeWebSocket()
    dispatch(setdefault())
    const currentUrl = window.location.href;
    console.log(currentUrl)
    if (currentUrl === 'http://localhost:3000/'){
      window.location.reload()
    }
    else{
      navigate('/')
    }

  }

  const handleClick = e => {
    e.currentTarget.nextSibling.classList.toggle("active");
  };

  // const [searchQuery, setSearchQuery] = useState('');

  // const search_function = (e) => {
  //   e.preventDefault();


  //   console.log('Search Query:', searchQuery);

  //   navigate(`/blog-standard?search=${searchQuery}`)
  // };

  const triggerMobileMenu = () => {
    const offcanvasMobileMenu = document.querySelector(
      "#offcanvas-mobile-menu"
    );
    offcanvasMobileMenu.classList.add("active");
  };
  const { compareItems } = useSelector((state) => state.compare);
  const { wishlistItems } = useSelector((state) => state.wishlist);
  const { cartItems } = useSelector((state) => state.cart);

  const VerifyOtp = () => {
    axiosInstance.get("/auth/get_user_details/")
      .then(res => {
          const link = 'verify-otp?email=' + res.data['email']
          axiosInstance.get('/send_sms_code/', {
            params: {
              email: res.data['email']
            }
          })
          .then(res=>{
            setTimeout(() => {
              window.location.href = link
            }, 1000);
          })
          .catch(err=>{
            console.log(err)
          })
            })
            .catch(err => {
              console.log("err")
            });


}

  return (
    <div className={clsx("header-right-wrap", iconWhiteClass)} >
      <div className="same-style header-search d-none d-lg-block">
      {/* <div style={{display:'flex'}}>
      <input
      style={{width:130}}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
      />
      <button className="search-active" onClick={search_function}>
        <i className="pe-7s-search" />
      </button>
    </div> */}
        <div className="search-content">
          <form action="#">
            <input type="text" placeholder="Search" />
            <button className="button-search">
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div>
      <div className="same-style account-setting d-none d-lg-block">
        <button
          className="account-setting-active"
          onClick={e => handleClick(e)}
        >
          <i className="pe-7s-user-female" />
        </button>
        <div className="account-dropdown">
          <ul>
            <li>
              {localStorage.getItem('access') ?
              <div style={{ cursor: 'pointer' }} onClick={Logout_function}>Logout</div> :
              <Link to={process.env.PUBLIC_URL + "/login-register"}>Login</Link>}
            </li>
            {localStorage.getItem('access')? <span></span>
           :  <li>
           <Link to={process.env.PUBLIC_URL + "/login-register"}>
             Register
           </Link>
         </li> }
            <li>
              <Link to={process.env.PUBLIC_URL + "/my-account"}>
                my account
              </Link>
            </li>

            <li>
            {localStorage.getItem('access') ?
              <Link to={process.env.PUBLIC_URL + "/verify-email"}>
                Verify Mail
              </Link> :
              <div></div> }
             </li>
             <li>
            {localStorage.getItem('access') ?
              <Link onClick={VerifyOtp} >
                Verify Number
              </Link> :
              <div></div> }
             </li>
          </ul>
        </div>
      </div>
      <div className="same-style header-compare">
        <Link to={process.env.PUBLIC_URL + "/compare"}>
          <i className="pe-7s-shuffle" />
          <span className="count-style">
            {compareItems && compareItems.length ? compareItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style header-wishlist">
        <Link to={process.env.PUBLIC_URL + "/wishlist"}>
          <i className="pe-7s-like" />
          <span className="count-style">
            {wishlistItems && wishlistItems.length ? wishlistItems.length : 0}
          </span>
        </Link>
      </div>
      <div className="same-style cart-wrap d-none d-lg-block">
        <button className="icon-cart" onClick={e => handleClick(e)}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </button>
        {/* menu cart */}
        <MenuCart />
      </div>
      <div className="same-style header-wishlist">
        <NotificationIcon/>
      </div>
      <div className="same-style cart-wrap d-block d-lg-none">
        <Link className="icon-cart" to={process.env.PUBLIC_URL + "/cart"}>
          <i className="pe-7s-shopbag" />
          <span className="count-style">
            {cartItems && cartItems.length ? cartItems.length : 0}
          </span>
        </Link>
      </div>

      <div className="same-style mobile-off-canvas d-block d-lg-none">
        <button
          className="mobile-aside-button"
          onClick={() => triggerMobileMenu()}
        >
          <i className="pe-7s-menu" />
        </button>
      </div>
    </div>
  );
};

IconGroup.propTypes = {
  iconWhiteClass: PropTypes.string,
};



export default IconGroup;
