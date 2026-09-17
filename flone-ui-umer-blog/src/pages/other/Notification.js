import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axiosInstance from "../../custom_axios/axios";
import {initWebSocket} from '../../custom_axios/Socket'
import { useSelector, useDispatch } from 'react-redux'

const Notification = () => {

  // const [notifications, setNotifications] = useState([]);
  const dispatch = useDispatch()
  const notifications = useSelector((state) => state.counter.notification)
  let { pathname } = useLocation();
  const socket = initWebSocket(dispatch, false)


//   console.log("Notification page")
//   const axios_call = () => {
//     console.log("call")
//     axiosInstance.get(`http:c//127.0.0.1:8000/get_all_notification/`)
//     .then(res => {
//       setNotifications(res.data)
//     })
//     .catch(err => {
//       console.error(err);
//     });
// }
// if (socket){
//   socket.addEventListener('message', (event) => {
//   console.log("comefrombackend")
//   axios_call()
//   });
// }


// useEffect(() => {
//   if (socket)
//     axios_call()

// },[])




  return (
    <Fragment>
      <SEO
        titleTemplate="Wishlist"
        description="Wishlist page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Notification", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="cart-main-area pt-90 pb-100">
          <div className="container">
            <div className="row">
              <div className="col-lg-12">
                <div className="item-empty-area text-center">

                  {notifications && notifications.length ? (
                      <div>
                          {notifications.map((item, index) => (
                            <div key={index}>
                              <p>{item.notification}</p>
                            </div>
                          ))}
                      </div>
                    ) :
                     <div>
                     <div className="item-empty-area__icon mb-30">
                    <i className="pe-7s-like"></i>
                    </div>
                     <div className="item-empty-area__text">
                          No Notification <br />{" "}
                      </div>
                     </div>

                    }
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Notification;
