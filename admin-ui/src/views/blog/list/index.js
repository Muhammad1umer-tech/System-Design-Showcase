// ** React Imports
import { Link } from 'react-router-dom'
import { Fragment, useState, useEffect } from 'react'

// ** Third Party Components
import axios from 'axios'
import classnames from 'classnames'
import { MessageSquare } from 'react-feather'

// ** Custom Components
// import Sidebar from '../BlogSidebar'
import Avatar from '@components/avatar'
import Breadcrumbs from '@components/breadcrumbs'

// ** Reactstrap Imports
import {
  Row,
  Col,
  Card,
  CardBody,
  CardText,
  CardTitle,
  CardImg,
  Badge,
  Pagination,
  PaginationItem,
  PaginationLink
} from 'reactstrap'

// ** Styles
import '@styles/base/pages/page-blog.scss'
import axiosInstance from '../../../Helper/axiosInstance'
import BlogSidebar from './Filter'
import BlogListHelper from './BlogListHelper'

const BlogList = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axiosInstance.get('/get_all_post_admin/').then(res => setData(res.data)).catch(err => console.log(err))
  }, [])


  return (
   <BlogListHelper Data={data}/>
  )
}

export default BlogList
