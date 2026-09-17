import React, { Fragment, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import axiosInstance from "../../custom_axios/axios";

const Product = (props) => {
  console.log("bbbbbbbbbbbbbbb", useLocation())

  let { pathname } = useLocation();
  let { id } = useParams();
  const [product, setproduct] = useState(null)
  // const { products } = useSelector((state) => state.product);
  // const product = products.find(product => product.id === id);

  useEffect(() => {
    console.log("useeffect")
    axiosInstance.get(`/get_ecommerce_items_per_id/${id}`)
    .then(res=>{
      console.log(res.data)
      setproduct(res.data)
    })
    .catch(err=>{
      console.log(err)
    })
  }, []);

  console.log(product, "Haaaaaa")
  return (
   product ?  <Fragment>
   <SEO
     titleTemplate="Product Page"
     description="Product Page of flone react minimalist eCommerce template."
   />

   <LayoutOne headerTop="visible">
     {/* breadcrumb */}
     <Breadcrumb
       pages={[
         {label: "Home", path: process.env.PUBLIC_URL + "/" },
         {label: "Shop Product", path: process.env.PUBLIC_URL + pathname }
       ]}
     />

     {/* product description with image */}
     <ProductImageDescription
       spaceTopClass="pt-100"
       spaceBottomClass="pb-100"
       product={product}
       cartItem={'cartItem'}
     />

     {/* product description tab */}
     <ProductDescriptionTab
       spaceBottomClass="pb-90"
       productFullDesc={product.fullDescription}
     />

     {/* related product slider */}
     <RelatedProductSlider
       spaceBottomClass="pb-95"
       category={product.category}
     />
   </LayoutOne>
 </Fragment> : <div></div>
  );
};

export default Product;
