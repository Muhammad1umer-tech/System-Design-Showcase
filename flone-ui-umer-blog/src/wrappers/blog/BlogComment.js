import React, { Fragment, useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import commentImage from './img/blog/comment-1.png'
import ReplyForm from './reply'
import axiosInstance from "../../custom_axios/axios";
import { baseURL } from "../../constants";


const BlogComment = ({update_comment_no}) => {
  // isSuspense, call two times
  //how to update comment no, which is render on other component


  const { blogid } = useParams();
  const [comments, setcomments] = useState([]);
  const [reply, setreply] = useState({
    id:0,
    bool:0,
  });

  const [posted_comment, setposted_comment] = useState({
    Text: ''
  });

  const onChange_func = (e) => {
    const { name, value } = e.target;
    setposted_comment({ ...posted_comment, [name]: value });
  }

  const  axios_call = () => {
    axiosInstance.get(`/get_all_level_comment/${blogid}`)
      .then(res => {
        console.log("comment")
        console.log(res.data)
        setcomments(res.data)
      })

      .catch(err => {
        console.error(err);
      });

  }

  useEffect(() => {

    axios_call()
  }, []);


  const add_comment = (e) => {
    e.preventDefault();
    if (posted_comment['Text'] === '')
      return

    axiosInstance.post(
      `${baseURL}/comment/`,
      {
        Text: posted_comment['Text'],
        Post: parseInt(blogid),
        parent_comment: null,
      },
    ).then(res => {
      const temp = {
        id: res.data['id'],
        Text: res.data['Text'],
        username: res.data['username'],
      }

      axios_call()
      update_comment_no(res.data['comment_no'])

    })
      .catch(err => {
        console.log("hz", err)
      })
  }

  const like_the_comment = (e, comment_id) => {
    e.preventDefault()
    axiosInstance.post(
      `${baseURL}/like/`,
      {
        comment_id: comment_id,
        Post_id: null,
      },

    ).then(res=>{
      if (Number.isInteger(res.data)){
        axios_call()

      }
      else {
        console.log(res.data)
      }
    })
  }

  const reply_on_comment = (e,comment_id) => {
    e.preventDefault()

    console.log(reply.bool)
    var bool = 0
    if (reply.bool === 0) {
    bool = 1
  }
      setreply({
        id: comment_id,
        bool:bool,
      })
  }

  const update_replies_on_comment = () => {
    axios_call()
  }
  return (
    <Fragment>
      <div className="blog-comment-wrapper mt-55">
  <h4 className="blog-dec-title">comments : {comments.length} </h4>

  {comments.length ===0 ? <div></div> : comments.map((comment) => (
    <div key={comment.id} className="single-comment-wrapper mt-35">
      <img src={commentImage} alt="" style={{ width: '50px', height: '50px', marginRight: '10px'}} />
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'start'}}className="blog-comment-content">
        <h4>{comment.username}</h4>
        <p>{comment.Text}</p>
        <div className="blog-meta-2">
          <ul style={{ display: "flex", justifyContent: "start" }}>
            <li>
              <button
                onClick={(e) => reply_on_comment(e, comment.id)}
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <i className="fa fa-comments-o " style={{ marginRight: 15 }} />
              </button>

            </li>

            <li>
              {comment.like} - {" "}
              <button
                onClick={(e) => like_the_comment(e, comment.id)}
                style={{
                  border: "none",
                  background: "none",
                  padding: 0,
                  cursor: "pointer",
                }}
              >
                <i className="fa fa-thumbs-up " style={{ marginRight: 15 }} />
              </button>

            </li>

              {reply.id === comment.id && reply.bool === 1 ? (
                <ReplyForm
                  update_replies_on_comment={update_replies_on_comment}
                  comment_id={comment.id}
                  blogid={blogid}
                />
              ) : (
                <div></div>
              )}
          </ul>
        </div>
        {/* {repliescomments
          .filter((rep) => comment.id === rep.parent_comment) */
          comment['reply_1'].length ===0 ? <div></div> : comment['reply_1']
          .map((rep1) => (
            <div key={rep1.id} className="single-comment-wrapper mt-10">
              <img src={commentImage} alt="" style={{ width: '50px', height: '50px', marginRight: '20px'}} />
              <div className="blog-comment-content">
                <h4>{rep1.username}</h4>
                <p>{rep1.Text}</p>
                <div className="blog-meta-2">
                  <ul style={{ display: "flex", justifyContent: "start" }}>
                    <li>
                      <button
                        onClick={(e) => reply_on_comment(e, rep1.id)}
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <i className="fa fa-comments-o " style={{ marginRight: 15 }} />
                      </button>

                    </li>

                    <li>
                     {rep1.like} - {" "}
                      <button
                        onClick={(e) => like_the_comment(e, rep1.id, 'reply')}
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <i className="fa fa-thumbs-up " style={{ marginRight: 15 }} />
                      </button>

                    </li>

                      {reply.id === rep1.id && reply.bool === 1 ? (
                        <ReplyForm
                          update_replies_on_comment={update_replies_on_comment}
                          comment_id={rep1.id}
                          blogid={blogid}
                        />
                      ) : (
                        <div></div>
                      )}
                  </ul>
                </div>
                {
          rep1['reply_2']
          .map((rep2) => (
            <div key={rep2.id} className="single-comment-wrapper mt-10">
              <img src={commentImage} alt="" style={{ width: '50px', height: '50px', marginRight: '20px'}} />
              <div className="blog-comment-content">
                <h4>{rep2.username}</h4>
                <p>{rep2.Text}</p>
                <div className="blog-meta-2">
                  <ul style={{ display: "flex", justifyContent: "start" }}>
                    <li>
                      <button
                        onClick={(e) => reply_on_comment(e, rep2.id)}
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <i className="fa fa-comments-o " style={{ marginRight: 15 }} />
                      </button>

                    </li>

                    <li>
                     {rep2.like} - {" "}
                      <button
                        onClick={(e) => like_the_comment(e, rep2.id, 'reply')}
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <i className="fa fa-thumbs-up " style={{ marginRight: 15 }} />
                      </button>

                    </li>

                      {reply.id === rep2.id && reply.bool === 1 ? (
                        <ReplyForm
                          update_replies_on_comment={update_replies_on_comment}
                          comment_id={rep2.id}
                          blogid={blogid}
                        />
                      ) : (
                        <div></div>
                      )}
                  </ul>
                </div>
                {
          rep2['reply_3']
          .map((rep3) => (
            <div key={rep3.id} className="single-comment-wrapper mt-10">
              <img src={commentImage} alt="" style={{ width: '50px', height: '50px', marginRight: '20px'}} />
              <div className="blog-comment-content">
                <h4>{rep3.username}</h4>
                <p>{rep3.Text}</p>
                <div className="blog-meta-2">
                  <ul style={{ display: "flex", justifyContent: "start" }}>
                    <li>
                     {rep3.like} - {" "}
                      <button
                        onClick={(e) => like_the_comment(e, rep3.id, 'reply')}
                        style={{
                          border: "none",
                          background: "none",
                          padding: 0,
                          cursor: "pointer",
                        }}
                      >
                        <i className="fa fa-thumbs-up " style={{ marginRight: 15 }} />
                      </button>

                    </li>

                      {reply.id === rep3.id && reply.bool === 1 ? (
                        <ReplyForm
                          update_replies_on_comment={update_replies_on_comment}
                          comment_id={rep3.id}
                          blogid={blogid}
                        />
                      ) : (
                        <div></div>
                      )}
                  </ul>
                </div>

              </div>
            </div>
          ))}
              </div>
            </div>
          ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  ))}
</div>




      <div className="blog-reply-wrapper mt-50">
        <h4 className="blog-dec-title">post a comment</h4>
        <form className="blog-form">
          <div className="row">
            <div className="col-md-12">
              <div className="text-leave">
                <textarea name="Text" value={posted_comment.Text} onChange={onChange_func} placeholder="Message" defaultValue={""} />
              </div>
            </div>
            <button onClick={add_comment}> Add a comment</button>
          </div>
        </form>
      </div>




    </Fragment>
  );
};

export default BlogComment;
