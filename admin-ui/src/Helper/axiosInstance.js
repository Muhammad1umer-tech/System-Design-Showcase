import axios from 'axios';
import { baseURL } from '../../constants';

// Create Axios instance with default configurations
var access_token = null

const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 10000,
    headers: {
        Authorization: access_token,
    },
});

export default axiosInstance;


axiosInstance.interceptors.request.use(async req => {
    console.log("API Hit before interceptor")
    access_token = localStorage.getItem('access') ?
    localStorage.getItem('access') : null
    req.headers.Authorization = `Bearer ${access_token}`
    return req

  });


  axiosInstance.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response.status === 401 && !error.config._retry) {
        error.config._retry = true; // Mark the request as retried to avoid infinite loop

        const refresh_token = localStorage.getItem('refresh');
        if (refresh_token) {
          return axiosInstance.post('/auth/api/token/refresh/', { refresh: refresh_token })
            .then(res => {
              const new_access_token = res.data['access'];
              localStorage.setItem('access', new_access_token);
              error.config.headers.Authorization = `Bearer ${new_access_token}`
              return axios(error.config); // Retry the original request with the new access token
            })
            .catch(err => {
              console.error("Error refreshing access token:", err)
              return Promise.reject(error);
            });
        } else {
          console.error("No refresh token available.")
          window.location.href = '/login-register/';
          return Promise.reject(error)
        }
      }
      return Promise.reject(error);
    }
  );



