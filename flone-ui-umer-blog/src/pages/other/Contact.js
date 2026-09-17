import { Fragment, useState } from "react";
import { useLocation } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import axios from 'axios';
import { baseURL } from "../../constants";

const Contact = () => {
  let { pathname } = useLocation();
  const [send_mail, setsend_mail] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const OnChange_Contact_us = (e) => {
    const { name, value } = e.target;
    setsend_mail({ ...send_mail, [name]: value });
  }
  const [mail_sent, setmail_sent] = useState('');

  const mail_sender = (e) => {
    e.preventDefault();
    // axios.post('https://1412-116-58-60-117.ngrok-free.app/send_mail/', send_mail)
    axios.post(`${baseURL}/send_mail/`, send_mail)
      .then(() => {
        setmail_sent("Mail sent successfully")
        setsend_mail({
          name: '',
          email: '',
          subject: '',
          message: ''
        })
      })
      .catch(err => {
        setmail_sent(err);
      });
  };
  return (
    <Fragment>
      <SEO
        titleTemplate="Contact"
        description="Contact page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Contact", path: process.env.PUBLIC_URL + pathname }
          ]}
        />
        <div className="contact-area pt-100 pb-100">
          <div className="container">
            <div className="contact-map mb-10">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d38486.935854087744!2d74.34408934994254!3d31.50227238773725!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391905c0d39fb72f%3A0xa5c1994a4a6a827a!2sThe%20Hexaa!5e0!3m2!1sen!2sus!4v1710481107249!5m2!1sen!2sus" width="100%" height="450"  allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>
            <div className="custom-row-2">
              <div className="col-12 col-lg-4 col-md-5">
                <div className="contact-info-wrap">
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-phone" />
                    </div>
                    <div className="contact-info-dec">
                      <p>+012 345 678 102</p>
                      <p>+012 345 678 102</p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-globe" />
                    </div>
                    <div className="contact-info-dec">
                      <p>
                        <a href="mailto:yourname@email.com">
                          yourname@email.com
                        </a>
                      </p>
                      <p>
                        <a href="https://yourwebsitename.com">
                          yourwebsitename.com
                        </a>
                      </p>
                    </div>
                  </div>
                  <div className="single-contact-info">
                    <div className="contact-icon">
                      <i className="fa fa-map-marker" />
                    </div>
                    <div className="contact-info-dec">
                      <p>Address goes here, </p>
                      <p>street, Crossroad 123.</p>
                    </div>
                  </div>
                  <div className="contact-social text-center">
                    <h3>Follow Us</h3>
                    <ul>
                      <li>
                        <a href="//facebook.com">
                          <i className="fa fa-facebook" />
                        </a>
                      </li>
                      <li>
                        <a href="//pinterest.com">
                          <i className="fa fa-pinterest-p" />
                        </a>
                      </li>
                      <li>
                        <a href="//thumblr.com">
                          <i className="fa fa-tumblr" />
                        </a>
                      </li>
                      <li>
                        <a href="//vimeo.com">
                          <i className="fa fa-vimeo" />
                        </a>
                      </li>
                      <li>
                        <a href="//twitter.com">
                          <i className="fa fa-twitter" />
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-8 col-md-7">
                <div className="contact-form">
                  <div className="contact-title mb-30">
                    <h2>Get In Touch</h2>
                  </div>
                  <form onSubmit={mail_sender} className="contact-form-style">
                    <div className="row">
                      <div className="col-lg-6">
                        <input name="name"
                        value={send_mail.name}
                        onChange={OnChange_Contact_us}
                        placeholder="Name*"
                        type="text"
                        required
                        />
                      </div>
                      <div className="col-lg-6">
                        <input name="email"
                        value={send_mail.email}
                        onChange={OnChange_Contact_us}
                        placeholder="Email*"
                        type="email"
                        required
                        />
                      </div>
                      <div className="col-lg-12">
                        <input
                          name="subject"
                          value={send_mail.subject}
                          onChange={OnChange_Contact_us}
                          placeholder="Subject*"
                          type="text"
                        />
                      </div>
                      <div className="col-lg-12">
                        <textarea
                          name="message"
                          value={send_mail.message}
                          onChange={OnChange_Contact_us}
                          placeholder="Your Message*"
                          maxLength="100"
                          required
                        />
                        <div style={{ color: 'grey', marginLeft:'5px' }}>{send_mail.message.length}/100</div>
                        {/* <button onClick={mail_sender}>SEND</button> */}
                        <button type="submit">SEND</button>
                        {mail_sent && <p style={{ color: 'black', marginTop: '30px' }}>{mail_sent}</p>}
                      </div>
                    </div>
                  </form>
                  <p className="form-message" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </LayoutOne>
    </Fragment>
  );
};

export default Contact;
