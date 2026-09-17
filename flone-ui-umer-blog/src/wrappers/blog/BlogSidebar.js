
import axiosInstance from "../../custom_axios/axios";
import { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const BlogSidebar = ({update_Categories_or_tags}) => {
  const [category, setcategory] = useState('')
  const [tags, settags] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()



  useEffect(() => {
    axiosInstance.get("/see_category/")
    .then(res=>{
      setcategory(res.data)
      console.log(category)
    })

    axiosInstance.get("/see_tags/")
    .then(res=>{
      settags(res.data)
    })
  }, []);
  const search_function = (e) => {
    e.preventDefault();
    console.log('Search Query:', searchQuery);
    if(searchQuery != '')
      navigate(`/blog-standard?search=${searchQuery}`)
    else
    navigate(`/blog-standard?link=get_all_post/`)

  };


  return (
    <div className="sidebar-style">
      {/* <div className="sidebar-widget">
        <h4 className="pro-sidebar-title">Search </h4>
        <div className="pro-sidebar-search mb-55 mt-25">
          <form className="pro-sidebar-search-form" action="#">
            <input type="text" placeholder="Search here..." />
            <button>
              <i className="pe-7s-search" />
            </button>
          </form>
        </div>
      </div> */}
      <div style={{display:'flex'}}>
      <input
      style={{width:130}}
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search"
      />
      <button className="search-active" onClick={search_function}>
        <i className="pe-7s-search" />
      </button>
    </div>
      <div className="sidebar-widget">
        {/* <h4 className="pro-sidebar-title">Recent Projects </h4>
        <div className="sidebar-project-wrap mt-30">
          <div className="single-sidebar-blog">
            <div className="sidebar-blog-img">
              <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/blog/sidebar-1.jpg"
                  }
                  alt=""
                />
              </Link>
            </div>
            <div className="sidebar-blog-content">
              <span>Photography</span>
              <h4>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  T- Shart And Jeans
                </Link>
              </h4>
            </div>
          </div>
          <div className="single-sidebar-blog">
            <div className="sidebar-blog-img">
              <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/blog/sidebar-2.jpg"
                  }
                  alt=""
                />
              </Link>
            </div>
            <div className="sidebar-blog-content">
              <span>Branding</span>
              <h4>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  T- Shart And Jeans
                </Link>
              </h4>
            </div>
          </div>
          <div className="single-sidebar-blog">
            <div className="sidebar-blog-img">
              <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/blog/sidebar-3.jpg"
                  }
                  alt=""
                />
              </Link>
            </div>
            <div className="sidebar-blog-content">
              <span>Design</span>
              <h4>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  T- Shart And Jeans
                </Link>
              </h4>
            </div>
          </div>
          <div className="single-sidebar-blog">
            <div className="sidebar-blog-img">
              <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                <img
                  src={
                    process.env.PUBLIC_URL + "/assets/img/blog/sidebar-2.jpg"
                  }
                  alt=""
                />
              </Link>
            </div>
            <div className="sidebar-blog-content">
              <span>Photography</span>
              <h4>
                <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
                  T- Shart And Jeans
                </Link>
              </h4>
            </div>
          </div>
        </div> */}
      </div>
      <div className="sidebar-widget mt-35">
        <h4 className="pro-sidebar-title">Categories</h4>
        <div className="sidebar-widget-list sidebar-widget-list--blog mt-20">
          <ul>
            <li>
            {Array.from(category).map(cat => (
            <div key={cat.Category_name} className="sidebar-widget-list-left">
              <div onClick={() => update_Categories_or_tags(['category', cat.Category_name])}>
                <Link to={`${process.env.PUBLIC_URL}/blog-standard`}>
                  {cat.Category_name}
                </Link>
              </div>
            </div>
          ))}
            </li>


          </ul>
        </div>
      </div>
      <div className="sidebar-widget mt-50">
        <h4 className="pro-sidebar-title">Tag </h4>
        <div className="sidebar-widget-tag mt-25">
          <ul>
          {Array.from(tags).map(tag => (
            <li>
            <Link >
            <div onClick={()=>update_Categories_or_tags(['tag', tag.tag_name])}>
              {tag.tag_name}
            </div>
            </Link>
          </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
