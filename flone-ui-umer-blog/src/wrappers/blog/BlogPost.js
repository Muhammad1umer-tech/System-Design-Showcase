import React, { Fragment, useState, useEffect   } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import axiosInstance from "../../custom_axios/axios";
import {initWebSocket} from '../../custom_axios/Socket'
import { useDispatch } from "react-redux";
import { baseURL } from "../../constants";

const BlogPost = ({comment_no}) => {

  const { blogid } = useParams();
  const dispatch = useDispatch()
  const [post, setpost] = useState({});
  const [liked, setliked] = useState(-1);
  const location = useLocation();
  const socket = initWebSocket(dispatch, false)

  useEffect(() => {
    const GET_ALL_POSTS = `query {
      specificPosts(id: ${blogid}) {
        id
        userId {
          username
        }
        content
        PostTextfield
        imageFieldUrl
        schedulingDateTime
        like
        Comment
        tags {
          tagName
        }
        Category {
          CategoryName
    }
      }
    }
    `
    axiosInstance.post("/graphql", {
      query: GET_ALL_POSTS,
    })
    .then(res => {
      setpost(res.data.data.specificPosts)
    })
    .catch(err => {
      console.log(err);
      // Handle errors here
    });
    // axiosInstance.get(`http://127c.0.0.1:8000/get_specific_post/${blogid}`)
    //   .then(res => {
    //     setpost(res.data);
    //     print(res.data)

    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }, []);

  useEffect(() => {
    console.log('URL changed:', location.pathname);
  }, [location.pathname]);


  console.log(post)


    function formatDate(dateString) {
      const date = new Date(dateString);
      const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
      return formattedDate;
    }
    const like_the_post = () => {
      let like_temp = {
        'notification':" Liked the post ",
        'post_id': blogid,
        'access': localStorage.getItem('access')
      }

      axiosInstance.post(
        `${baseURL}/like/`,
        {
          comment_id: null,
          Post_id: blogid,
        },
        {
          headers: {
            Authorization: localStorage.getItem('access')
          }
        }
      ).then(res=>{
        if (Number.isInteger(res.data)){
          socket.send(JSON.stringify(like_temp))
          console.log("temp")
          setliked(res.data)
        }
        else {
          console.log(res.data)
        }
      })
    }
console.log(post,"Aaaaaaaaaa")
  return (
    <Fragment>
      <div className="blog-details-top">
        <div className="blog-details-img">
          <img
            alt=""
            // src={`http://127.0.0.1:8000/${post['imageField']}`}
            src={post['imageFieldUrl']}
          />
        </div>
        <div className="blog-details-content">
          <div className="blog-meta-2">
            <ul>
              <li>{formatDate(post['schedulingDateTime'])}</li>
              <li>
                  {comment_no===0 ? post['Comment']: comment_no} <i className="fa fa-comments-o" />
              </li>
              <li>
                {/* <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}> */}
                  {liked===-1 ? post['like']: liked}  <button onClick={like_the_post} className="like-button" style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}>
                    <i className="fa fa-thumbs-up" />
                  </button>
                {/* </Link> */}
              </li>
            </ul>
          </div>
          <h3>{post['PostTextfield']}</h3>
          <p>
           {post['content']}{" "}
          </p>
        </div>
      </div>

      <div className="tag-share">
        <div className="dec-tag">
          <ul>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                lifestyle ,
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                interior ,
              </Link>
            </li>
            <li>
              <Link to={process.env.PUBLIC_URL + "/blog-standard"}>
                outdoor
              </Link>
            </li>
          </ul>
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
      <div className="next-previous-post">
        {/* <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          {" "}
          <i className="fa fa-angle-left" /> prev post
        </Link>
        <Link to={process.env.PUBLIC_URL + "/blog-details-standard"}>
          next post <i className="fa fa-angle-right" />
        </Link> */}
      </div>
    </Fragment>
  );
};

export default BlogPost;
