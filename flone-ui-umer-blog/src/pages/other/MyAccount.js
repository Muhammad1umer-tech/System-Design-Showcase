import { Fragment, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Accordion from "react-bootstrap/Accordion";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from 'axios';
import axiosInstance from "../../custom_axios/axios";
import { baseURL } from "../../constants";

const MyAccount = () => {
  let { pathname } = useLocation();

  const [error, setError] = useState('');
  const [error1, setError1] = useState('');

  const [account_detail, setaccount_detail] = useState({
    id: '',
    username: '',
    email:''
  });

  const [password_change, setpassword_change] = useState({
    password:'',
    new_password:''
  });

  var userData = {}

  const handleChangePassword = (e) => {
    const { name, value } = e.target;
    setpassword_change({ ...password_change, [name]: value });
  }

  const edit_password = () => {
    console.log(password_change)
    const Edit_Api = `${baseURL}/auth/edit_password/`+userData['id'].toString()
    const test = {
      'password': password_change['password'],
      'new_password': password_change['new_password'],
    }
    axios.post(Edit_Api, test)
    .then(res=>{
      console.log(res)

      setpassword_change({
        password:'',
        new_password:'',
      })

      setError1("Edited Successfully")

    })
    .catch(err => {
      console.log("err", err)
    });
  }

  // const GET_ALL_POSTS = `query {
  //   allCustomUsers {
  //     id
  //     username
  //     email
  //   }
  // }
  // `
  // useEffect(() => {
  //   axiosInstance.post("http://localhost:8000/graphql", {
  //     query: GET_ALL_POSTS,
  //   })
  //   .then(res => {
  //     userData = res.data.data.allCustomUsers[0];
  //     setaccount_detail({
  //                 id: userData.id,
  //                 username: userData.username,
  //                 email: userData.email
  //               });
  //               console.log("res.data")
  //               console.log(res.data)

  //   })
  //   .catch(err => {
  //     console.log(err);
  //     // Handle errors here
  //   });
  // }, []);

  useEffect(() => {
    axiosInstance.get("/auth/get_user_details/")
      .then(res => {
          userData = res.data;
          setaccount_detail({
            id: userData.id,
            username: userData.username,
            email: userData.email
          });
          console.log("res.data")
          console.log(res.data)
      })
      .catch(err => {
        console.log(err)
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setaccount_detail({ ...account_detail, [name]: value });
  }

  const edit_post = () => {
    console.log(account_detail)
    const Edit_Api = `${baseURL}/auth/edit_user_details/`+account_detail['id'].toString()
    const test = {
      'username': account_detail['username'],
      'email': account_detail['email'],
    }
    axiosInstance.post(Edit_Api, test)
    .then(res=>{
      console.log(res)

      setaccount_detail({
        username:'',
        email:'',
      })
      setError("Edited Successfully")

    })
    .catch(err => {
      console.log("err", err)
    });
  }

  return (
    <Fragment>
      <SEO
        titleTemplate="My Account"
        description="My Account page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "My Account", path: process.env.PUBLIC_URL + pathname }
          ]}
        />

        <div className="myaccount-area pb-80 pt-100">
          <div className="container">
            <div className="row">
              <div className="ms-auto me-auto col-lg-9">
                <div className="myaccount-wrapper">
                  <Accordion defaultActiveKey="0">
                    <Accordion.Item eventKey="0" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                        <span>1 .</span> Edit your account information{" "}
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>My Account Information</h4>
                              <h5>Your Personal Details</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Username</label>
                                  <input type="text" name="username" value={account_detail.username} onChange={handleChange}/>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Email</label>
                                  <input type="text" name="email" value={account_detail.email} onChange={handleChange}/>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Telephone</label>
                                  <input type="email"/>
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Telephone</label>
                                  <input type="text" />
                                </div>
                              </div>
                              <div className="col-lg-6 col-md-6">
                                <div className="billing-info">
                                  <label>Fax</label>
                                  <input type="text" defaultValue={0}/>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button onClick={edit_post}>Continue</button>
                              </div>
                            </div>
                            {error && <p style={{ color: 'black', marginTop: '30px' }}>{error}</p>}
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>


                    <Accordion.Item eventKey="1" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>2 .</span> Change your password
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Change Password</h4>
                              <h5>Your Password</h5>
                            </div>
                            <div className="row">
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password</label>
                                  <input type="password" name="password" value={password_change.password} onChange={handleChangePassword}/>
                                </div>
                              </div>
                              <div className="col-lg-12 col-md-12">
                                <div className="billing-info">
                                  <label>Password Confirm</label>
                                  <input type="password" name="new_password" value={password_change.new_password} onChange={handleChangePassword}/>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button >Continue</button>
                              </div>
                            </div>
                            {error1 && <p style={{ color: 'black', marginTop: '30px' }}>{error1}</p>}

                          </div>
                      </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey="2" className="single-my-account mb-20">
                      <Accordion.Header className="panel-heading">
                          <span>3 .</span> Modify your address book entries
                      </Accordion.Header>
                      <Accordion.Body>
                          <div className="myaccount-info-wrapper">
                            <div className="account-info-wrapper">
                              <h4>Address Book Entries</h4>
                            </div>
                            <div className="entries-wrapper">
                              <div className="row">
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-info text-center">
                                    <p>John Doe</p>
                                    <p>Paul Park </p>
                                    <p>Lorem ipsum dolor set amet</p>
                                    <p>NYC</p>
                                    <p>New York</p>
                                  </div>
                                </div>
                                <div className="col-lg-6 col-md-6 d-flex align-items-center justify-content-center">
                                  <div className="entries-edit-delete text-center">
                                    <button className="edit">Edit</button>
                                    <button>Delete</button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="billing-back-btn">
                              <div className="billing-btn">
                                <button type="submit">Continue</button>
                              </div>
                            </div>
                          </div>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default MyAccount;
