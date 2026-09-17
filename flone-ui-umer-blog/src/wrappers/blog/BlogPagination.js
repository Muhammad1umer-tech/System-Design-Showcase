import { Fragment, useState, useEffect } from "react";
import axiosInstance from "../../custom_axios/axios";
import { baseURL } from "../../constants";



const BlogPagination = ({categoryortags, search, link, paginate, update_and_send_posts}) => {

  const [current_page, setcurrent_page]= useState(1)
  const [next_pre, setnext_pre] = useState({
    next:'',
    previous:'',
  });

  const [total_page, settotal_page]= useState(0)

  console.log(link, search, categoryortags)

  useEffect(() => {
    let link_for_request = ''
    if (link) {
      link_for_request = `${baseURL}/${link}`
    }
    else if( search ){
      // link_for_request = `http://127.0c.0.1:8000/elastic_search/?search=${search}`
      link_for_request = `${baseURL}/posts/?search=${search}`
    }

    else if(categoryortags[0] === 'category') {
        link_for_request = `${baseURL}/get_category_posts/${categoryortags[1]}/`
    }

    else if(categoryortags[0] === 'tag'){
      link_for_request = `${baseURL}/get_tag_posts/${categoryortags[1]}/`
  }
  else {
    link_for_request = `${baseURL}/get_all_post/`
  }

    axiosInstance.get(link_for_request)
    .then(res => {
      update_and_send_posts(res.data)
      setnext_pre({
        next: res.data['next'],
        previous: res.data['previous'],
      })
      const temp = res.data['count']
      settotal_page(Math.ceil(temp/2))
    })
    .catch(err => {
      console.error(err)
    });
}, [categoryortags[0], categoryortags[1], search, link]);

const update_post_paginate = (page_number) => {
  let url = ''
  if(link) {
    url =  `${baseURL}/${link}?page=${page_number}`
  }
  else if (search) {
    url =  `${baseURL}/posts/?page=${page_number}&search=${search}`
  }
  else if (categoryortags[0] === 'category') {
    url =  `${baseURL}/get_category_posts/${categoryortags[1]}/?page=${page_number}`
  }

  else {
    url =  `${baseURL}/get_tag_posts/${categoryortags[1]}/?page=${page_number}`
  }

  console.log(url)

  axiosInstance.get(url)
    .then(res => {
      update_and_send_posts(res.data)
      setnext_pre({
        next: res.data['next'],
        previous: res.data['previous'],
      })
    })
    .catch(err => {
      console.error(err)
    });
}

const fun_pre = () => {
  // console.log("previous", next_pre)
  axiosInstance.get(next_pre['previous'])
    .then(res => {
      update_and_send_posts(res.data)
      setcurrent_page(current_page-1)
      setnext_pre({
        next: res.data['next'],
        previous: res.data['previous'],
      })
    })
    .catch(err => {
      console.error(err)
    });
}

const fun_next = () => {
  axiosInstance.get(next_pre['next'])
    .then(res => {
      update_and_send_posts(res.data)
      setcurrent_page(current_page+1)
      setnext_pre({
        next: res.data['next'],
        previous: res.data['previous'],
      })
    })
    .catch(err => {
      console.error(err)
    });
}
const test = (index) => {
  if (index+1<=total_page) {
    update_post_paginate(index+1)
    setcurrent_page(index+1)
  }
}
  return (
    <div className="pro-pagination-style text-center mt-20">
      <ul>
        <li>
          <button disabled={current_page === 1} onClick={fun_pre} className="prev">
            <i className="fa fa-angle-double-left" />
          </button>
        </li>
        {Array.from({ length: total_page }, (_, index) => (
          <li onClick={() => test(index)}  key={index}> <button>{index+1}</button></li>
        ))}
        <li>
          <button disabled={current_page === total_page} onClick={fun_next} className="next">
            <i className="fa fa-angle-double-right" />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default BlogPagination;
