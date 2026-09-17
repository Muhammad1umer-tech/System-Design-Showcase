// ** React Imports
import { useState, useCallback, useEffect } from 'react'

// ** Third Party Components
import axios, { formToJSON } from 'axios'
import Select from 'react-select'
import htmlToDraft from 'html-to-draftjs'
import { Editor } from 'react-draft-wysiwyg'
import { EditorState, ContentState } from 'draft-js'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'

// ** Custom Components
import Avatar from '@components/avatar'
import Breadcrumbs from '@components/breadcrumbs'

// ** Utils
import { selectThemeColors } from '@utils'

import Dropzone from '../Dropzone'
import ImageGrid from '../ImageGrid'
// ** Reactstrap Imports
import { Row, Col, Card, CardBody, CardText, Form, Label, Input, Button } from 'reactstrap'
import cuid from 'cuid';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

// ** Styles
import '@styles/react/libs/editor/editor.scss'
import '@styles/base/plugins/forms/form-quill-editor.scss'
import '@styles/react/libs/react-select/_react-select.scss'
import '@styles/base/pages/page-blog.scss'
import axiosInstance from '../../../Helper/axiosInstance'
import { initWebSocket } from '../../../socket'

const BlogAdd = () => {
  const initialContent = ``

  const contentBlock = htmlToDraft(initialContent)
  const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
  const editorState = EditorState.createWithContent(contentState)
  const [categories, setcategories] = useState([])
  const [Tags, setTags] = useState([])


    const [value, onChangeCalender] = useState(new Date()),
    [title, setTitle] = useState(''),
    [error, setError] = useState(''),
    [content, setContent] = useState(editorState),
    [blogCategories, setBlogCategories] = useState([]),
    [blogTags, setBlogTags] = useState([]);
    const [images, setImages] = useState({
      'file': '',
      'url':''
    });
    const onDrop = useCallback((acceptedFiles) => {
      console.log(acceptedFiles)

    acceptedFiles.map((file) => {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        setError('Only .png and .jpg files are allowed');
        setImages({
          'file': '',
          'url':''
        })
        return null;
    }
      setError('')
      const reader = new FileReader();

      reader.onload = function (e) {
        setImages({
          'file': file,
          'url': e.target.result
        });
      };
      reader.readAsDataURL(file);
      return file;
    });
  }, []);

      useEffect(() => {
        var c = []
        axiosInstance.get('/see_category/')
        .then(res=>{
          for( var i = 0 ; i < res.data.length ; i++) {
            const temp = { value: res.data[i]['Category_name'], label: res.data[i]['Category_name']}
            c.push(temp)
          }
          setcategories(c)
        }
        )
        var cc = []
        axiosInstance.get('/see_tags/')
        .then(res=>{
          for( var i = 0 ; i < res.data.length ; i++) {
            const temp = { value: res.data[i]['tag_name'], label: res.data[i]['tag_name']}
            cc.push(temp)
          }
        setTags(cc)
        }
        )
      },[])


    const add_a_post = (e) => {
      if(images['file'] == '') {
        setError("Please enter png or jpg format file")
      }
      const contentAsRaw = convertToRaw(content.getCurrentContent());
      const htmlContent = draftToHtml(contentAsRaw);

      const scheduling_date_time = new Date(value);

      const formatted_date_time = scheduling_date_time.toISOString().slice(0, 19).replace('T', ' ');

      let formData = new FormData()

      formData.append('Post_Textfield', title)
      formData.append('content', htmlContent)
      formData.append('image_Field', images['file'], images['file'].name)
      formData.append('scheduling_date_time', formatted_date_time)

      blogCategories.forEach((value, index) => {
        formData.append(`category`, value['label']);
      });

      blogTags.forEach((value, index) => {
        formData.append(`tags`, value['label']);
      });


      axiosInstance.post('/create_post/',
      formData
      ).then(res=> {
        console.log(res)
        setError('Successsfully Added')
      })
      .catch(err=>{
        setError('Not Added')
      })
    }


  // const categories = [
  //   { value: 'E-commerce', label: 'E-commerce' },
  //   { value: 'Blogs', label: 'Blogs' },
  //   { value: 'postman', label: 'postman' },
  //   { value: 'hzhzzh', label: 'hzhzzh' },
  //   { value: 'hzhzzhaa', label: 'hzhzzhaa' },
  //   { value: 'hu', label: 'hu' },
  //   { value: 'Umer---', label: 'Umer---' },
  //   { value: 'Umer M', label: 'Umer M' }
  // ]

  // const Tags = [
  //   { value: 'Fashion', label: 'Fashion' },
  //   { value: 'Women', label: 'Women' },
  //   { value: 'For Men', label: 'For Men' },
  //   { value: 'Accessories', label: 'Accessories' },
  //   { value: 'Clothing', label: 'Clothing' },
  // ]

  const onChangeCalendar = newValue => {
    onChangeCalender(newValue);
  };

  const handlePostNow = () => {
    const daete = new Date()
    onChangeCalender(daete)

  };



  return (
    <div className='blog-edit-wrapper'>
      <Breadcrumbs title='Blog Add' data={[{ title: 'Pages' }, { title: 'Blog' }, { title: 'Add' }]} />
        <Row>
          <Col sm='12'>
            <Card>
              <CardBody>
                <div className='d-flex'>
                  <div>
                    <Avatar className='me-75'  imgWidth='38' imgHeight='38' />
                  </div>
                  <div>
                    <h6 className='mb-25'></h6>
                    <CardText></CardText>
                  </div>
                </div>
                <Form className='mt-2' onSubmit={e => e.preventDefault()}>
                  <Row>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-title'>
                        Title
                      </Label>
                      <Input id='blog-edit-title' value={title} onChange={e => setTitle(e.target.value)} />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-category'>
                        Category
                      </Label>
                      <Select
                        id='blog-edit-category'
                        isClearable={false}
                        theme={selectThemeColors}
                        value={blogCategories}
                        isMulti
                        name='colors'
                        options={categories}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={data => setBlogCategories(data)}
                      />
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-category'>
                        Tags
                      </Label>
                      <Select
                        id='blog-edit-tags'
                        isClearable={false}
                        theme={selectThemeColors}
                        value={blogTags}
                        isMulti
                        name='colors'
                        options={Tags}
                        className='react-select'
                        classNamePrefix='select'
                        onChange={data => setBlogTags(data)
                        }
                      />
                    </Col>
                    <Col md='6' className='mb-2'>
                    </Col>
                    <Col md='6' className='mb-2'>
                      <Label className='form-label' for='blog-edit-status'>
                        When to Post
                      </Label>
                      <div>
                      <Calendar
                        color='secondary'
                        onChange={onChangeCalendar}
                        value={value}
                      />
                      <Button color='secondary' outline onClick={handlePostNow}>Add Right Now Data</Button>
                      </div>

                    </Col>
                    <Col sm='12' className='mb-2'>
                      <Label className='form-label'>Content</Label>
                      <Editor editorState={content} onEditorStateChange={data => setContent(data)} />
                    </Col>
                    <Col className='mb-2' sm='12'>
                      <div className='border rounded p-2'>
                        <h4 className='mb-1'>Featured Image</h4>
                        <div className='d-flex flex-column flex-md-row'>
                          <img
                            className='rounded me-2 mb-1 mb-md-0'
                            alt='featured img'
                            width='170'
                            height='110'
                          />

                        </div>
                         <Dropzone onDrop={onDrop} accept="image/png, image/jpeg" />
                         <ImageGrid images={images['url']} />
                      </div>
                    </Col>
                    <Col className='mt-50'>
                      <Button onClick={add_a_post} color='primary' className='me-1'>
                        Add a Post
                      </Button>
                      {error && <p style={{ color: 'green', marginTop: '30px' }}>{error}</p>}
                    </Col>
                  </Row>
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
    </div>
  )
}

export default BlogAdd
