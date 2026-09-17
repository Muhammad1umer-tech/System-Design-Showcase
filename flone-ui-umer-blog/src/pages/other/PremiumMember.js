import { Fragment, useState, useEffect } from "react";
import axiosInstance from "../../custom_axios/axios";
import { useNavigate } from "react-router-dom";

const PremiumMember = () => {
  let navigate = useNavigate()
  const [subscription, usesubscription] = useState([]);

  useEffect(() => {

    axiosInstance.get("/premiumDetails/")
    .then(res => {
      console.log(res.data)
      usesubscription(res.data)
    })
    .catch(err => {
      console.error("Error while fetching premiumDetails", err)
    });
}, []);

console.log(subscription)
  const func = (id) => {
    axiosInstance.post('/payment/create-checkout-session/', {"subscription_id":id})
    .then(res=>{
      window.location.replace(res.data);
      console.log("run")
    })
    .catch(err=>{
      console.log("error while create_checkout_session", err)
    })
  }

  return (
    <div>
    {subscription.map((sub) => (
      <div key={sub.id}>
        <h2>{sub.name}</h2>
          <button onClick={()=>func(sub.product_id)} id="checkout-button">{sub.name}</button>
          <input type="hidden" name="subscription_id" value={sub.product_id} />
      </div>
    ))}
  </div>
  );
};

export default PremiumMember;
