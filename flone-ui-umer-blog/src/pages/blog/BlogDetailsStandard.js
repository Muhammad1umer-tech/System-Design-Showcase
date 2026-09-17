import { Fragment, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogComment from "../../wrappers/blog/BlogComment";
import BlogPost from "../../wrappers/blog/BlogPost";
import axios from 'axios';
import { baseURL } from "../../constants";

const BlogDetailsStandard = () => {

  console.log("BlogDetailsStandard")
  const { blogid } = useParams();
  let { pathname } = useLocation();
  const [comment_no, setcomment_no] = useState(0);

  const update_comment_no = (c_no) => {
    setcomment_no(c_no)
  }


const storedDatastring = sessionStorage.getItem('storedData');
const storedData = storedDatastring ? JSON.parse(storedDatastring) : {};

const currentTimeInMillis = new Date().getTime();

if (storedData.id && currentTimeInMillis - storedData.time >= 5000 ) {
  sessionStorage.removeItem('storedData');

  axios.post(`${baseURL}/adding_views/`, {'id': storedData.id})
  .then(res=>{
    console.log(res.data)
  })
  .catch(err=>{
    console.error(err)
  })
}
  const newData = { time: currentTimeInMillis, id: blogid };
  sessionStorage.setItem('storedData', JSON.stringify(newData));

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog Post"
        description="Blog Post of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Blog Post", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse" style={{display: 'display-flex', JustifyContent: 'center'}}>
              <div className="col-lg-9">
                <div className="blog-details-wrapper ml-20">
                  {/* blog post */}
                  <BlogPost comment_no={comment_no}/>


                  {/* blog post comment */}
                  <BlogComment update_comment_no={update_comment_no} />
                </div>
              </div>
              {/* <div className="col-lg-3">
                <BlogSidebar />
              </div> */}
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogDetailsStandard;
