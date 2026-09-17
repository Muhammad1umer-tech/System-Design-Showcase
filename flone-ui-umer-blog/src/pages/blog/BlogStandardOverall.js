import { Fragment, useState, useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import BlogSidebar from "../../wrappers/blog/BlogSidebar";
import BlogPosts from "../../wrappers/blog/BlogPosts";
import axiosInstance from "../../custom_axios/axios";
import { useTranslation } from "react-i18next";



const BlogStandardOverall = () => {
  let { pathname } = useLocation();
  const { t } = useTranslation();
  let navigate = useNavigate()
  const [trendingposts, settrendingposts] = useState([]);
  const [popular_posts, setpopular_posts] = useState([]);
  const [top_posts, settop_posts] = useState([]);
  const [featured_posts, setfeatured_posts] = useState([]);



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


  useEffect(() => {
    axiosInstance.get("/show_all_category_post/")
    .then(res => {
        settrendingposts(res.data['trending_posts'])
        setpopular_posts(res.data['popular_posts'])
        settop_posts(res.data['top_posts'])
        setfeatured_posts(res.data['featured_posts'])
    })
    .catch(err => {
      console.error("Error in stanrdardoverall", err)
    });
}, []);

  return (
    <Fragment>
      <SEO
        titleTemplate="Blog"
        description="Blog of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        <Breadcrumb
          pages={[
            {label: t("home"), path: process.env.PUBLIC_URL + "/" },
            {label: t("All-Blogs"), path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="blog-area pt-100 pb-100">
          <div className="container">
            <div className="row flex-row-reverse"   style={{ display: 'flex', justifyContent: 'center' }}>
              <div className="col-lg-9">
                <div className="ml-20">
                <div className="column" style={{ display: 'display-flex', marginRight: '20px' }}>
               </div>
                   <div className="row">
                    <div style={{ display: 'flex' , justifyContent: 'space-between'}}>
                        <h2 style={{ marginBottom: '20px' }}>{t("Trending Posts")}</h2>
                        <Link
                        to={{
                            pathname: "/blog-standard",
                            search: "?link=show_trending_posts/",
                        }}
                        >
                        {t("View all")}
                        </Link>
                    </div>
                    <BlogPosts posts={trendingposts}/>


                    <div style={{ display: 'flex' , justifyContent: 'space-between'}}>
                        <h2 style={{ marginBottom: '20px' }}>{t("Popular Posts")}</h2>
                        <Link
                        to={{
                            pathname: "/blog-standard",
                            search: "?link=show_popular_posts/",
                        }}
                        >
                        {t("View all")}
                        </Link>
                    </div>
                    <BlogPosts posts={popular_posts}/>


                    <div style={{ display: 'flex' , justifyContent: 'space-between'}}>
                        <h2 style={{ marginBottom: '20px' }}>{t('Top Posts')}</h2>
                        <Link
                        to={{
                            pathname: "/blog-standard",
                            search: "?link=show_top_posts/",
                        }}
                        >
                        {t("View all")}
                        </Link>
                    </div>
                    <BlogPosts posts={top_posts}/>
                    <div style={{ display: 'flex' ,justifyContent: 'space-between'}}>
                        <h2 style={{ marginBottom: '20px' }}>{t('Featured Posts')}</h2>
                        <Link
                        to={{
                            pathname: "/blog-standard",
                            search: "?link=show_featured_posts/",
                        }}
                        >
                        {t("View all")}
                        </Link>
                    </div>
                    <BlogPosts posts={featured_posts}/>
                  </div>

                </div>
              </div>
              {/* <div className="col-lg-3">
                {/* blog sidebar */}
                {/* <BlogSidebar /> */}
              {/* </div>  */}
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default BlogStandardOverall;
