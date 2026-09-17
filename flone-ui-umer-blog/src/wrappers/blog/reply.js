import React, { useState } from 'react';
import axios from 'axios';
import axiosInstance from '../../custom_axios/axios';
import { baseURL } from '../../constants';

const ReplyForm = ({update_replies_on_comment, comment_id, blogid}) => {
  const [posted_comment, setPostedComment] = useState({ Text: '' });

  const onChangeFunc = (e) => {
    setPostedComment({ ...posted_comment, [e.target.name]: e.target.value });
  };

  const addComment = (e) => {
    e.preventDefault();
    if (posted_comment['Text'] === '')
      return

    axiosInstance.post(
        `${baseURL}/comment/`,
        {
          Text: posted_comment.Text,
          parent_comment: comment_id,
          Post: blogid,
        },

      ).then(res=>{
        console.log(res.data)
        update_replies_on_comment()
        setPostedComment({ Text: '' });
      })
      .catch(err=>{
        console.log(err)
      })

  };

  return (
    <div className="blog-reply-wrapper mt-50" style={{ maxWidth: '300px', margin: '0 auto' }}>
      <form className="blog-form">
        <div className="row">
          <div className="col-md-10">
            <textarea
              name="Text"
              value={posted_comment.Text}
              onChange={onChangeFunc}
              placeholder="Message"
            />
          </div>
          <div className="col-md-10 text-center"> {/* Center-align the button */}
            <button onClick={addComment}>Add a Comment</button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ReplyForm;
