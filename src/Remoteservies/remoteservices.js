import axios from 'axios';

const remote = {
  // Ensure this points to your backend API (adjust host/port if needed)
  address: 'http://127.0.0.1:5173/api'
};

// GET request: Uses token if available, otherwise sends cookies (withCredentials:true)
async function getRequest(api) {
  const token = localStorage.getItem("token");
  const apiUrl = remote.address + api;
  return axios.get(apiUrl, {
    headers: token ? { Authorization: `Token ${token}` } : {},
    withCredentials: true
  })
  .then(res => res.data)
  .catch(error => {
    const errorMessage = error?.response?.data?.Message || error?.response?.data || error?.response;
    return Promise.reject(errorMessage);
  });
}
async function getRequestUrl(apiUrl) {
  const token = localStorage.getItem("token");

  return axios.get(apiUrl, {
    headers: token ? { Authorization: `Token ${token}` } : {},
    withCredentials: true
  })
  .then(res => res.data)
  .catch(error => {
    const errorMessage = error?.response?.data?.Message || error?.response?.data || error?.response;
    return Promise.reject(errorMessage);
  });
}


// POST request: Uses token if available; if not, it still sends cookies
async function postRequest(api, data) {
  const token = localStorage.getItem("token");
  const apiUrl = remote.address + api;
  return axios.post(apiUrl, data, {
    headers: token
      ? {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json'
        }
      : {
          'Content-Type': 'application/json'
        },
    withCredentials: true
  })
  .then(res => res.data)
  .catch(error => {
    const errorMessage = error?.response?.data?.Message || error?.response?.data || error?.response || 'Error Message Not Handled';
    return Promise.reject(errorMessage);
  });
}

const RemoteServices = {
  loginPost: function (data) {
    const url = `/account/login/`;
    return postRequest(url, data);
  },
  Registration: function (data) {
    const url = `/account/register/`;
    return postRequest(url, data);
  },
  UploadContent: function (data) {
    const url = `/contentUpload/`;
    return postRequest(url, data);
  },
  getUserList: function () {
    const url = `/account/users/`;
    return getRequest(url);
  },
  getContact: function () {
    const url = `/account/conversation-users/`;
    return getRequest(url);
  },
  getSearchUser: function (data) {
    const url = `/account/users/search/?q=${data}`;
    return getRequest(url);
  },
  addUserContact: function (data) {
    const url = `/account/contacts/add/`;
    return postRequest(url, data);
  },
  logoutcookies: function () {
    const url = `/account/logout/`;
    return postRequest(url);
  },
  getMessageSelected: function (data) {
    const url = `/chat/messages/?contact_id=${data}`;
    return getRequest(url);
  },
  paganitionUrl: function (url) {
    
    return getRequestUrl(url);
  },

};

export default RemoteServices;
