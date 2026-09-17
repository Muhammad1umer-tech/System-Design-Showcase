import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../constants";

const BlogPosts = ({posts}) => {

  function formatDate(dateString) {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
    return formattedDate;
  }

    return (
      <Fragment>
        {posts.length==0 ?
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>Nothing to show</div>
        : posts.map(post=>(
          <div key={post.id} className="col-lg-6 col-md-6 col-sm-12">
          <div className="blog-wrap-2 mb-30">
            <div className="blog-img-2">
              <Link to={process.env.PUBLIC_URL + `/blog-details-standard/${post.id}`}>
                <img
                  // src={`http://127.0.0.1:8000${post['image_Field']}`}
                  src={`${baseURL}${post['image_Field']}`}
                  alt=""
                />
              </Link>
            </div>
            <div className="blog-content-2">
              <div className="blog-meta-2">
                <ul>
                  <li>{formatDate(post['scheduling_date_time'])}</li>
                  <li>
                    {/* <Link to={process.env.PUBLIC_URL + `/blog-details-standard/${post.id}`}> */}
                      {post['Comment']} <i className="fa fa-comments-o" />
                    {/* </Link> */}
                  </li>
                  <li>
                   {post['like']}  <button className="like-button" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                    <i className="fa fa-thumbs-up" />
                    </button>
                  </li>
                </ul>
              </div>
              <h4>
                <Link to={process.env.PUBLIC_URL + `/blog-details-standard/${post['id']}`}>
                  {post['Post_Textfield']}
                </Link>
              </h4>
              <p>
                {post['content']}
              </p>
              <div className="blog-share-comment">
                <div className="blog-btn-2">
                  <Link to={process.env.PUBLIC_URL + `/blog-details-standard/${post['id']}`}>
                    read more
                  </Link>
                </div>
                <div className="blog-share">
                  <span>share :</span>
                  <div className="share-social">
                    <ul>
                      <li>
                        <a className="facebook" href="//facebook.com">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a className="twitter" href="//twitter.com">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                      <li>
                        <a className="instagram" href="//instagram.com">
                          <i className="fa fa-instagram" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        ))}

      </Fragment>

    );
};

export default BlogPosts;
