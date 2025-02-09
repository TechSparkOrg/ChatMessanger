import axios from 'axios';

const address = 'http://127.0.0.1:5173/api';

const getRequest = async (url, data) => {
    try {
        const response = await axios.get(url,{
            params: data,
            headers:{
                'Authorization': `Token ${localStorage.getItem('token')}`
            }
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

const postRequest = async (url, data) => {
    try {
        const response = await axios.post(url, data);
        return response.data;
    } catch (error) {
        console.error('Error posting data:', error);
        throw error;
    }
};

const RemoteServices = {
    loginPost: function (data) {
        const url = `${address}/account/login/`;
        return postRequest(url, data);
    },
    Registration: function (data) {
        const url = `${address}/account/register/`;
        return postRequest(url, data);
    },
    UploadContent: function (data) {
        const url = `${address}/contentUpload/`;
        return postRequest(url, data);
    },
    getContent: function (data) {
        const url = `${address}/contentget/`;
        return getRequest(url, data);
    },
};

export default RemoteServices;
