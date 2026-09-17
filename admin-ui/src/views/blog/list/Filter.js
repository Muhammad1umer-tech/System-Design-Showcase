
import { useState, useEffect } from "react";
import axiosInstance from "../../../Helper/axiosInstance";
import styles from '../../../@core/scss/react/pages/filter-sidebar.module.scss'
import 'react-calendar/dist/Calendar.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { DateRangePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";

const BlogSidebar = ({date_range, update_Categories_or_tags}) => {
  const [category, setcategory] = useState('')
  const [tags, settags] = useState('')
  const [value, setValue] = useState([]);

  useEffect(() => {
    axiosInstance.get("/see_category/")
    .then(res=>{
      setcategory(res.data)
    })

    axiosInstance.get("/see_tags/")
    .then(res=>{
      settags(res.data)
    })
  }, []);

  const pickerStyle = {
    marginTop: "10px",
};

  const handleSelect = (value) => {
    setValue(value);
    console.log(`Start Date: ${value[0]}`);
    console.log(`End Date: ${value[1]}`);
    date_range(value[0], value[1])
  };

  return (
    <div  className={styles.sidebarStyle}>
      <div className={styles.sidebarWidget}>
      <h4 className={styles.proSidebarTitle} style={{marginTop: '20px', marginBottom: '20px'}}>Date Range</h4>

      <div className="App" style={{
            display: "flex",
            alignItems: "center",
            flexDirection: "column"
        }}>
            <DateRangePicker size="md"
                placeholder="Enter Date Range"
                value={value}
                  onChange={handleSelect}
                style={pickerStyle} />
        </div>

      </div>
      <div className={styles.sidebarWidget}>
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
      <div className={styles.sidebarWidget}>
        <h4 className={styles.proSidebarTitle} style={{marginTop: '20px', marginBottom: '20px'}}>Categories</h4>
        <div className={styles.sidebarWidgetList}>
          <ul>
            <li>
            {Array.from(category).map(cat => (
            <div key={cat.Category_name} className={styles.sidebarWidgetListLeft}>
              <div style={{marginBottom: '3px', cursor: 'pointer'}} onClick={() => update_Categories_or_tags(['category', cat.Category_name])}>
                {/* <Link > */}
                  {cat.Category_name}
                {/* </Link> */}
              </div>
            </div>
          ))}
            </li>


          </ul>
        </div>
      </div>
      <div className={styles.sidebarWidget}>
        <h4 className={styles.proSidebarTitle} style={{marginTop: '20px', marginBottom: '20px'}}>Tag </h4>
        <div className={styles.sidebarWidgetTag}>
          <ul>
          {Array.from(tags).map(tag => (
            <li key={tag}>
            {/* <Link > */}
            <div style={{ cursor: 'pointer'}} onClick={()=>update_Categories_or_tags(['tag', tag.tag_name])}>
              {tag.tag_name}
            </div>
            {/* </Link> */}
          </li>
          ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BlogSidebar;
