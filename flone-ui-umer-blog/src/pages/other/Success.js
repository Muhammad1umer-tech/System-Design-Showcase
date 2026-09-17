import { Fragment, useState, useEffect } from "react";
import axiosInstance from "../../custom_axios/axios";
import { useNavigate } from "react-router-dom";

const Success = () => {
    useEffect(() => {
        axiosInstance.get("/charge/")
        .then(res => {
         console.log(res.data)
        })
        .catch(err => {
          console.error("Error while updating user", err)
        });
    }, []);

    console.log("gaaaaaaaa")
  return (
    <div>
    charge
  </div>
  );
};

export default Success;
