import { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPagination from "../../wrappers/blog/BlogPagination";
import BlogPosts from "../../wrappers/blog/BlogPosts";
import axiosInstance from "../../custom_axios/axios";

const BlogStandard = () => {
  let location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const link = queryParams.get('link');
  const search = queryParams.get('search');


  console.log(search, link, "BlogStandard")
  const [posts, setposts] = useState([])
  const [categoryortags, setcategoryortags] = useState([])



  const update_and_send_posts = (post) => {
    setposts(post['results']);
}



const paginate = (pointer) => {
  axiosInstance.get(pointer)
  .then(res=>{
    // console.log("paginate", res.data)
    setposts(res.data['results'])
  })
  .catch(err=>{
    console.log(err)
  })
}

function update_Categories_or_tags(cat) {
  setcategoryortags(cat)
}




if (link) {
  const storedDatastring = sessionStorage.getItem('storedData');
  const storedData = storedDatastring ? JSON.parse(storedDatastring) : {};

  const currentTimeInMillis = new Date().getTime();

  console.log(currentTimeInMillis - storedData.time)

  if (storedData.id && currentTimeInMillis - storedData.time >= 5000 ) {

    sessionStorage.removeItem('storedData');

    axiosInstance.post('/adding_views/', {'id': storedData.id})
    .then(res=>{
      console.log(res.data)
    })
    .catch(err=>{
      console.error(err)
    })
    const newData = { time: currentTimeInMillis, id: storedData.id };
    sessionStorage.setItem('storedData', JSON.stringify(newData));
  }
  sessionStorage.removeItem('storedData');
}

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Blog of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div  className="container">
            <div className="row flex-row-reverse">
              <div className="col-lg-9">
                <div className="ml-20">
                <div className="column" style={{ display: 'display-flex', marginRight: '20px', justifyContent: link === 'get_all_post/' ? 'initial': 'center'}}>
               </div>

                   <div className="row">
                    <BlogPosts posts={posts}/>
                  </div>

                  <BlogPagination categoryortags={categoryortags} search={search} link={link} paginate={paginate} update_and_send_posts={update_and_send_posts}/>
                </div>

              </div>
              {link === 'get_all_post/' || link === null ?
              <div className="col-lg-3">
              blog sidebar
              <BlogSidebar update_Categories_or_tags={update_Categories_or_tags}/>
            </div>
            : null
              }
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogStandard;
