import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// import {initWebSocket} from '../../../../src/custom_axios/Socket'
// import axiosInstance from '../../../../src/custom_axios/axios'
import { useSelector, useDispatch } from 'react-redux'

const NotificationIcon = () => {
  const count = useSelector((state) => state.counter.value)

  let socket;

  // if(localStorage.getItem('access')){
  //   socket = initWebSocket(false)
  // }


  // const axios_call = () => {
  //   axiosInstance.get(`http://c127.0.0.1:8000/get_all_notification/`)
  //   .then(res => {
  //     setNotifications(res.data)
  //   })
  //   .catch(err => {
  //     console.error(err);
  //   });
  // }


  //   if (socket){
  //     socket.addEventListener('message', (event) => {
  //       axios_call()
  //     });
  //   }


// useEffect(() => {
//   if (socket)
//     axios_call()

// },[])


  return (
    <Link to={process.env.PUBLIC_URL + "/notification"}>
      <i className='fas fa-bell'></i>
      <span className="count-style">
        {count}
      </span>
    </Link>
  );
};

export default NotificationIcon;
