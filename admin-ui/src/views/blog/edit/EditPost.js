




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
import { useParams } from 'react-router-dom';
import axiosInstance from '../../../Helper/axiosInstance'
import { baseURL } from '../../../../constants'
const BlogEditPost = () => {
    const [categories, setcategories] = useState([])
    const [Tags, setTags] = useState([])
    const { id } = useParams();
    const [error, setError] = useState('');
    const [blogCategories_and_tags, setBlogCategories_and_tags] = useState({
        Categories: '',
        tags: []
    });
    const [images, setImages] = useState({
        file: '',
        url: '',
        drop: false
    });

    const onDrop = useCallback((acceptedFiles) => {
        acceptedFiles.map((file) => {
            const reader = new FileReader();

            reader.onload = function (e) {
                setImages({
                    file: file,
                    url: e.target.result,
                    drop: true
                });
            };

            reader.readAsDataURL(file);
            return file;
        });

    }, []);

    const content_into_html = (content) => {
        const contentBlock = htmlToDraft(content)
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)

        return editorState
    }

    const editorState = content_into_html('')
    const [data, setData] = useState({
        Post_Textfield: '',
        scheduling_date_time: '',
        content: editorState,

    });

    const changeForm = (value, datakey) => {
        if (value === 'Post_Textfield') {
            setData({ ...data, [value]: datakey.target.value });
        }
        else {
            setData({ ...data, [value]: datakey });
        }
    };

    const edit_a_post = async (e) => {
        let formData = new FormData()
        const response = await fetch(images.url);
        if (images.drop === false) {
            const blob = await response.blob();
            const filename = images.url.substring(images.url.lastIndexOf('/') + 1);
            const file = new File([blob], filename, { type: 'image/jpeg' });
            formData.append('image_Field', file, file.name)
        }
        else {
            console.log(images['file'])
          formData.append('image_Field', images['file'], images['file'].name)
        }

        const contentAsRaw = convertToRaw(data.content.getCurrentContent());
        const htmlContent = draftToHtml(contentAsRaw);
        const scheduling_date_time = new Date(data.scheduling_date_time);
        const formatted_date_time = scheduling_date_time.toISOString().slice(0, 19).replace('T', ' ');

        // let cate = [];
        // for (let cat of blogCategories_and_tags.Categories) {
        // cate.push(cat['value']);
        // }

        // let tagss = [];
        // for (let tag of blogCategories_and_tags.tags) {
        // tagss.push(tag['value']);
        // }

        console.log("Aa", blogCategories_and_tags.tags['value'])
        formData.append('Post_Textfield', data.Post_Textfield)
        formData.append('content', htmlContent)
        formData.append('scheduling_date_time', formatted_date_time)
        formData.append(`Category`, blogCategories_and_tags.Categories['value']);
        formData.append(`tags`, blogCategories_and_tags.tags['value']);

        axiosInstance.put(`${baseURL}/edit_post/${id}`,
        formData
        ).then(res=>
          setError('Successsfully Eddted'))
        .catch(err=>console.log(err))

    }
    useEffect(() => {
        var c = []
        axiosInstance.get(`${baseURL}/see_category/`)
        .then(res=>{
          for( var i = 0 ; i < res.data.length ; i++) {
            const temp = { value: res.data[i]['id'], label: res.data[i]['Category_name']}
            c.push(temp)
          }
          setcategories(c)
        }
        )
        var cc = []
        axiosInstance.get(`${baseURL}/see_tags/`)
        .then(res=>{
          for( var i = 0 ; i < res.data.length ; i++) {
            const temp = { value: res.data[i]['id'], label: res.data[i]['tag_name']}
            cc.push(temp)
          }
        setTags(cc)
        }
        )
      },[])
    // const categories = [
    //     { value: 2, label: 'E-commerce' },
    //     { value: 3, label: 'Blogs' },
    //     { value: 4, label: 'postman' },
    //     { value: 5, label: 'hzhzzh' },
    //     { value: 6, label: 'hzhzzhaa' },
    //     { value: 7, label: 'hu' },
    //     { value: 8, label: 'Umer---' },
    //     { value: 9, label: 'Umer M' }
    // ]

    // const Tags = [
    //     { value: 'Fashion', label: 'Fashion' },
    //     { value: 'Women', label: 'Women' },
    //     { value: 'For Men', label: 'For Men' },
    //     { value: 'Accessories', label: 'Accessories' },
    //     { value: 'Clothing', label: 'Clothing' },
    // ]

    useEffect(() => {
        axiosInstance.get(`${baseURL}/get_post/${id}`)
            .then(res => {
                setData({
                    Post_Textfield: res.data['Post_Textfield'],
                    scheduling_date_time: res.data['scheduling_date_time'],
                    content: content_into_html  (res.data['content']),
                })
                setImages({
                    ...images,
                    url: baseURL + res.data['image_Field']
                })

                let tags = [];
                console.log(res.data)
                for (let i = 0; i < res.data['tags'].length; i++) {
                    const tag = res.data['tags'][i];
                    tags.push({ value: res.data['tag_id'], label: tag });
                };

                const category = { value: res.data['Category'], label: res.data['category'] }

                console.log(res.data)
                setBlogCategories_and_tags({
                    tags: tags[0],
                    Categories: category
                })

            }).catch(err => console.log(err))
    }, [])


    const handlePostNow = () => {
        const daete = new Date()
        changeForm("scheduling_date_time", daete)

    };

    return data ? (
        <div className='blog-edit-wrapper'>
            <Breadcrumbs title='Blog Edit' data={[{ title: 'Pages' }, { title: 'Blog' }, { title: 'Edit' }]} />
            <Row>
                <Col sm='12'>
                    <Card>
                        <CardBody>
                            <div className='d-flex'>
                                <div>
                                    <Avatar className='me-75' imgWidth='38' imgHeight='38' />
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
                                        <Input id='blog-edit-title' value={data.Post_Textfield} onChange={data => changeForm("Post_Textfield", data)} />
                                    </Col>
                                    <Col md='6' className='mb-2'>
                                        <Label className='form-label' for='blog-edit-category'>
                                            Category
                                        </Label>
                                        <Select
                                            id='blog-edit-category'
                                            isClearable={false}
                                            theme={selectThemeColors}
                                            value={blogCategories_and_tags.Categories}
                                            name='colors'
                                            options={categories}
                                            className='react-select'
                                            classNamePrefix='select'
                                            onChange={data => {
                                                console.log("a", data)
                                                setBlogCategories_and_tags({ ...blogCategories_and_tags, ['Categories']: data })

                                            }}
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
                                            value={blogCategories_and_tags.tags}
                                            name='colors'
                                            options={Tags}
                                            className='react-select'
                                            classNamePrefix='select'
                                            onChange={data => {
                                                setBlogCategories_and_tags({ ...blogCategories_and_tags, ['tags']: data })
                                            }}
                                        />
                                    </Col>
                                    <Col md='6' className='mb-2'>
                                    </Col>
                                    <Col md='6' className='mb-2'>
                                        <Label className='form-label' for='blog-edit-status'>
                                            Posted Date
                                        </Label>
                                        <div>
                                            <Calendar
                                                color='secondary'
                                                onChange={newDate => changeForm("scheduling_date_time", newDate)}
                                                value={data.scheduling_date_time}
                                            />
                                            <Button color='secondary' outline onClick={handlePostNow}>Add Right Now Data</Button>
                                        </div>

                                    </Col>
                                    <Col sm='12' className='mb-2'>
                                        <Label className='form-label'>Content</Label>
                                        <Editor editorState={data.content} onEditorStateChange={data => changeForm("content", data)} />
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
                                            <Dropzone onDrop={onDrop} accept={"image/*"} />
                                            <ImageGrid images={images['url']} />
                                        </div>
                                    </Col>
                                    <Col className='mt-50'>
                                        <Button onClick={edit_a_post} color='primary' className='me-1'>
                                            Done
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
    ) : null
}

export default BlogEditPost
