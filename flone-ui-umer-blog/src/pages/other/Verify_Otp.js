import axios from "axios";
import React, { Fragment, useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const navigate = useNavigate()
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const email = queryParams.get('email');
  const [otp, setotp] = useState('');
  const [error, setError] = useState('');

  //Login Function
  const onChangeFunc = (e) => {
    const { name, value } = e.target;
    setotp(value);
  }

  const test = (e) => {
    console.log(otp)
    e.preventDefault()

    axios.get(`/verify_phone/${otp}`, {
      params: {
        email: email
      }
    })
      .then(res => {
        console.log(res.data['detail'])
        if (res.data['detail'] === 'Verified') {
          setError("Successfully Verified")
          setTimeout(() => {
            window.location.href = '/'
          }, 2000);
        }
      })
      .catch(err => {
        console.log(err)
        setError("Enter Correct Pin")
      })
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
          {error && <p style={{ color: 'red', marginTop: '30px' }}>{error}</p>}
        </div>
      </form>
    </div>
  );

};

export default VerifyOtp;
