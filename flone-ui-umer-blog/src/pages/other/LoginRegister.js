import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import Tab from "react-bootstrap/Tab";
import Nav from "react-bootstrap/Nav";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import ReCAPTCHA from "react-google-recaptcha";
import {initWebSocket} from '../../custom_axios/Socket'
import GoogleLogin from "react-google-login";
import {gapi} from "gapi-script";
import RegisterForm from "./RegisterForm";
import LoginFormHelper from "./LoginForm";
import { baseURL, googleOAuthClientId } from "../../constants";

const LoginRegister = ({inilize_socket}) => {

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

  const login_helper_function = () => {
              axios.post(`${baseURL}/auth/login/`, LoginData)
            .then(response => {
                const tokens = response.data

                localStorage.setItem('access', tokens['access']);
                localStorage.setItem('refresh', tokens['refresh']);


                initWebSocket(true);
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
      setError(err['message'])
    })



  }

  //Register function
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...FormData, [name]: value });
  };

  const register_helper_function = () => {
    axios.post(`${baseURL}/auth/register/`, FormData)
    .then(response => {
        console.log('Response from the Server:', response.data);
        var message_from_server = ''
        if (response.data['username']) {
          message_from_server = response.data['username']
        } else if(response.data['email']) {
          message_from_server = response.data['email']
        } else {
          message_from_server = response.data
        }

        setError(message_from_server)

        if( message_from_server === 'Registration Successfull') {
          const email = FormData['email']
          const link = '/verify-otp?email=' + email;
          axios.get(`${baseURL}/send_sms_code/`, {
            params: {
              email: email
            }
          })
          .then(res=>{
            setTimeout(() => {
              window.location.href = link
            }, 1000);

          })
          .catch(err=>{

          })
        }
        setFormData({
          username: '',
          password: '',
          email: '',
          phonenumber: ''
      });
    })
    .catch(error => {
        setError(error);
        if (error.response) {
          setError(error.response.data.message);
        } else {
          setError('An error occurred. Please try again.');
        }
    });
  }
  const register_user = (e) => {
    e.preventDefault();
    register_helper_function()

    // axios.post("http://127.c0.0.1:8000/verify-recaptcha/", {'captchaResponse': captchaResponse })
    // .then(res=>{
    //   setError(res.data['message'])
    //   register_helper_function()
    //   recaptchaRef.current.reset()

    // })
    // .catch(err=>{
    //   setError(err['message'])
    // })
  };

  return (
    <Fragment>
      <SEO
        titleTemplate="Login"
        description="Login page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Login Register", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="login-register-area pt-100 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-7 col-md-12 ms-auto me-auto">
                <div className="login-register-wrapper">
                  <Tab.Container defaultActiveKey="login">
                    <Nav variant="pills" className="login-register-tab-list">
                      <Nav.Item>
                        <Nav.Link eventKey="login">
                          <h4>Login</h4>
                        </Nav.Link>
                      </Nav.Item>
                      <Nav.Item>
                        <Nav.Link eventKey="register">
                          <h4>Register</h4>
                        </Nav.Link>
                      </Nav.Item>
                    </Nav>
                    <Tab.Content>
                      <Tab.Pane eventKey="login">
                        <div className="login-form-container">
                          <LoginFormHelper/>
                        </div>
                      </Tab.Pane>
                      <Tab.Pane eventKey="register">
                        <div className="login-form-container">
                          <RegisterForm/>
                        </div>
                      </Tab.Pane>
                    </Tab.Content>
                  </Tab.Container>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default LoginRegister;
