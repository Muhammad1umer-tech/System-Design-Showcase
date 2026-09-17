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

import '@styles/base/pages/page-blog.scss'
import BlogSidebar from './Filter'
import postcss from 'postcss'
import { baseURL } from '../../../../constants'

const BlogListHelper = ({ Data }) => {
  const [data, setData] = useState([])

  useEffect(() => {
    setData(Data)
  }, [Data])

  const update_Categories_or_tags = (prob) => {
    if (prob[0] === 'category') {
      const filtered_Data = Data.filter(post => post.category === prob[1])
      setData(filtered_Data)
    }
    else if (prob[0] === 'tag') {
      const filtered_Data = Data.filter(post => {
        return post.tags.some(tag => tag === prob[1]);
      });
      setData(filtered_Data)
    }
  }
  const date_range = (StartTime, EndTime) => {
    const filtered_Data = Data.filter(post => {
      const date = new Date(post.scheduling_date_time)
      // console.log(date>=StartTime, post.Post_Textfield)
      console.log(date,", ",StartTime, ', ',EndTime, post.Post_Textfield)
      return (StartTime <= date && date <= EndTime)
    });
    console.log(filtered_Data.length)
    setData(filtered_Data)
  }

  const badgeColorsArr = {
    Quote: 'light-info',
    Fashion: 'light-primary',
    Gaming: 'light-danger',
    Video: 'light-warning',
    Food: 'light-success'
  }
  const renderRenderList = () => {
    if (data.length == 0)
      return <div style={{ marginRight: '650px' }}>No Post to show</div>

    return data.map(item => {
      const renderTags = () => {
        return item.tags.map((tag, index) => {
          return (
            <a key={index} href='/' onClick={e => e.preventDefault()}>
              <Badge
                className={classnames({
                  'me-50': index !== item.tags.length - 1
                })}
                color={badgeColorsArr[tag]}
                pill
              >
                {tag}
              </Badge>
            </a>
          )
        })
      }
      return (
        <Col key={item.id} md='6'>
          <Card >
            <Link to={`/pages/blog/detail/${item.id}`}>
              <CardImg className='img-fluid' src={`${baseURL}${item.image_Field}`} alt={item.Post_Textfield} top />
            </Link>
            <CardBody>
              <CardTitle tag='h4'>
                <Link className='blog-title-truncate text-body-heading' to={`/pages/blog/detail/${item.id}`}>
                  {item.Post_Textfield}
                </Link>
              </CardTitle>
              <div className='d-flex'>
                <Avatar className='me-50' img={item.avatar} imgHeight='24' imgWidth='24' />
                <div>
                  <small className='text-muted me-25'>by</small>
                  <small>
                    <a className='text-body' href='/' onClick={e => e.preventDefault()}>
                      {item.username}
                    </a>
                  </small>

                </div>
              </div>
              <div className='my-1 py-25'>{renderTags()}</div>
              <CardText className='blog-content-truncate'>{item.content}</CardText>
              <hr />
              <div className='d-flex justify-content-between align-items-center'>
                <Link to={`/pages/blog/detail/${item.id}`}>
                  <MessageSquare size={15} className='text-body me-50' />
                  <span className='text-body fw-bold'>{item.comment} Comments</span>
                </Link>
                <Link className='fw-bold' to={`/pages/blog/detail/${item.id}`}>
                  Read More
                </Link>
              </div>
            </CardBody>
          </Card>
        </Col>
      )
    })
  }

  return (
    <Fragment>
      <Breadcrumbs title='Blog List' data={[{ title: 'Pages' }, { title: 'Blog' }, { title: 'List' }]} />
      <div className='blog-wrapper'>
        <div className='content-detached content-left'>
          <div className='content-body'>
            {data !== null ? (
              <div className='blog-list-wrapper'>
                <div style={{ display: 'flex' }}>
                  <Row >{renderRenderList()}</Row>
                  <BlogSidebar date_range={date_range} update_Categories_or_tags={update_Categories_or_tags} />
                </div>

              </div>
            ) : null}
          </div>
        </div>
      </div>
    </Fragment>
  )
}

export default BlogListHelper
