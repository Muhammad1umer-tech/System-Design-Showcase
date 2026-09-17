import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import {initWebSocket} from '../../custom_axios/Socket'
import {gapi} from "gapi-script";
import { useSelector, useDispatch } from 'react-redux'
import {fetchNotificationCount} from '../../../src/store/slices/notification-slice'

import GoogleLogin from "react-google-login";
import FacebookLogin from 'react-facebook-login';
import { baseURL, googleOAuthClientId, recaptchaSiteKey } from "../../constants";

const LoginFormHelper = () => {

    console.log("login helper")
    const dispatch = useDispatch()
    const clientId = googleOAuthClientId
    const recaptchaRef = React.createRef()
    const [captchaResponse, setCaptchaResponse] = useState('');

    const handleCaptchaChange = (response) => {
      setCaptchaResponse(response);
    };


    let { pathname } = useLocation();
    const [FormData, setFormData] = useState({
      username: '',
      password: '',
      email: '',
      phonenumber: ''
    });

    const [LoginData, setLoginData] = useState({
      email: '',
      password: ''
    });


    const [error, setError] = useState('');


    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/enterprise.js?render=6LcoZaApAAAAAE1GvG4z7Z8zBXO8d0Zvwt_EVcLJ';
      script.async = true;
      document.body.appendChild(script);

      return () => {
        // Cleanup: remove the script when the component unmounts
        document.body.removeChild(script);
      };
    }, []);

    //Login Function
    const ChangeLoginData = (e) => {
      const { name, value } = e.target;
      setLoginData({ ...LoginData, [name]: value });
    }

    const onFailure = (err) => {
      console.log('failed:', err);
    };

    const onSuccess = (res) => {
          console.log("google",res)
           axios.post(`${baseURL}/social_auth/test/`, res)
           .then(res=>{
            localStorage.clear();
            localStorage.setItem('access', res.data.access);
            localStorage.setItem('refresh', res.data.refresh);
            window.location.href = '/'
           }
          )
           .catch(err=>console.log(err))

    }

    const handleFacebookCallback = (response) => {
        if (response?.status === "unknown") {
            console.error('Sorry!', 'Something went wrong with facebook Login.');
         return;
        }
        console.log(response);
    }

    const login_helper_function = () => {
                axios.post(`${baseURL}/auth/login/`, LoginData)
              .then(response => {
                  const tokens = response.data

                  localStorage.setItem('access', tokens['access']);
                  localStorage.setItem('refresh', tokens['refresh']);

                  let socket = initWebSocket(dispatch, true);
                  // socket.emit('join_room', 123)
                  dispatch(fetchNotificationCount())
                  setTimeout(() => {
                    window.location.href = '/';
                  }, 2000);
              })

              .catch(error => {
                  if (error.response.status === 400){
                    setError(error.response.data)
                  }

                  else if (error.response) {
                    setError(error.response.data.message);
                  } else {
                    setError('An error occurred. Please try again.');
                  }
              });
    }

    const login_user = (e) => {
      e.preventDefault();
      axios.post(`${baseURL}/verify-recaptcha/`, {'captchaResponse': captchaResponse })
      .then(res=>{
        setError(res.data['message'])
        login_helper_function()
        recaptchaRef.current.reset()
      })
      .catch(err=>{
        setError("Please verify recaptcha")
      })

    }

  return (
    <div className="login-register-form">
                            <form onSubmit={login_user}>
                              <input
                                type="email"
                                name="email"
                                value={LoginData.email}
                                onChange={ChangeLoginData}
                                placeholder="Email"
                              />
                              <input
                                type="password"
                                name="password"
                                value={LoginData.password}
                                onChange={ChangeLoginData}
                                placeholder="Password"
                              />
                              <div className="button-box">
                                <div className="login-toggle-btn">
                                  <input type="checkbox" />
                                  <label className="ml-10">Remember me</label>
                                  <Link to={process.env.PUBLIC_URL + "/"}>
                                    Forgot Password?
                                  </Link>
                                </div>
                                <ReCAPTCHA
                                  onChange={handleCaptchaChange}
                                  ref={recaptchaRef}
                                  sitekey={recaptchaSiteKey}
                                  theme="dark"
                                />
                                <button type="submit">
                                  <span style={{marginTop: '10px'}} >Login</span>
                                </button>

                                {error && <p style={{ color: 'red', marginTop: '30px' }}>{error}</p>}
                              </div>
                            </form>
                            <div className="Auth-form-container">
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px'}}>
                              <GoogleLogin
                                  clientId={clientId}
                                  buttonText="Sign in with Google"
                                  onSuccess={onSuccess}
                                  onFailure={onFailure}
                                  cookiePolicy={'single_host_origin'}
                              />
                              <FacebookLogin
                                buttonStyle={{padding:"6px"}}
                                appId="7548769678525206"
                                autoLoad={false}
                                fields="name,email,picture"
                                callback={handleFacebookCallback}/>
                          </div>

                          </div>
    </div>
  );
};

export default LoginFormHelper;
