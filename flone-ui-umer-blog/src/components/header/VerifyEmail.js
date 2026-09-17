import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axiosInstance from "../../custom_axios/axios";

const VerifyEmail = () => {
const [error, setError] = useState('');
const [otp, setotp] = useState('');

 useEffect(() => {
    axiosInstance.get('/send_sms_code_to_email/')
      .then(res=>{
        setError(res.data['message'])
      })
      .catch(err=>{
        setError("Please enter Correct Pin")
      })
 }, []);

 const test = (e) => {
    console.log(otp)
    e.preventDefault()

    axiosInstance.get(`/verify_email/${otp}`)
    .then(res=>{
      console.log(res.data['detail'])
      if(res.data['detail'] === 'Verified') {
        setError(res.data['detail'])
        setTimeout(() => {
          window.location.href = '/'
        }, 3000);
      }
    })
    .catch(err=>{
        console.log(err)
        setError(err.response.data['detail'])
    })
  }

  const onChangeFunc = (e) => {
    const { name, value } = e.target;
    setotp(value);
  }
  return (
    <div className="blog-reply-wrapper mt-50" style={{ maxWidth: '300px', margin: '0 auto' }}>
      <h3>Get verified by Twilio</h3>
      <form className="blog-form">
        <div className="row">
          <div className="col-md-10">
            <textarea
              name="otp"
              value={otp}
              onChange={onChangeFunc}
              placeholder="Enter Otp"
            />
          </div>
          <div className="col-md-10 text-center">
            <button onClick={test}>Verify</button>
          </div>
        </div>
      </form>
    {<p style={{ color: 'red', marginTop: '30px' }}>{error}</p>}
    </div>
  );

};

export default VerifyEmail;
