import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import GoogleLogin from "react-google-login";
import { baseURL, googleOAuthClientId, recaptchaSiteKey } from "../../constants";


const RegisterForm = () => {

  const clientId = googleOAuthClientId

  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    phonenumber: ''
  });
  const recaptchaRef = React.createRef()
  const [captchaResponse, setCaptchaResponse] = useState('');

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


  const handleCaptchaChange = (response) => {
    setCaptchaResponse(response);
  };

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


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };


  const register_helper_function = () => {
    axios.post(`${baseURL}/auth/register/`, formData)
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

        // if( message_from_server === 'Registration Successfull') {
        //   const email = FormData['email']
        //   const link = '/verify-otp?email=' + email;
        //   axios.get('http://1c7.0.0.1:8000/send_sms_code/', {
        //     params: {
        //       email: email
        //     }
        //   })
        //   .then(res=>{
        //     setTimeout(() => {
        //       window.location.href = link
        //     }, 1000);

        //   })
        //   .catch(err=>{
        //     console.log(err)
        //   })
        // }
        setFormData({
          username: '',
          password: '',
          email: '',
          phonenumber: ''
      });
    })
    .catch(error => {
        setError(error.response.data);
    });
  }
  const register_user = (e) => {
    e.preventDefault();
    register_helper_function()

    // axios.post("http://1c27.0.0.1:8000/verify-recaptcha/", {'captchaResponse': captchaResponse })
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
    <div className="login-register-form">
      <form onSubmit={register_user}>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Username"
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Password"
        />
        <input
          placeholder="Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          type="email"
        />
        <input
          placeholder="Phone Number"
          name="phonenumber"
          value={formData.phonenumber}
          onChange={handleChange}
          type="text"
        />
        {/* <ReCAPTCHA
          onChange={handleCaptchaChange}
          ref={recaptchaRef}
          sitekey={recaptchaSiteKey}
          theme="dark"
        /> */}
        <div className="button-box" style={{display: "flex", justifyContent: 'space-evenly', marginBottom: '30px'}}>
            <GoogleLogin
                                      clientId={clientId}
                                      buttonText="Sign Up with Google"
                                      onSuccess={onSuccess}
                                      onFailure={onFailure}
                                      cookiePolicy={'single_host_origin'}
                                  />
              <button type="submit">
                <span>Register</span>
              </button>
        </div>

      </form>
      {error && <p style={{ color: 'red', marginTop: '30px' }}>{error}</p>}
    </div>
  );
};

export default RegisterForm;
