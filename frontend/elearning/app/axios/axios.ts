import axios from 'axios';

const request = axios.create({
        baseURL: 'http://localhost:4000'
});

export const get = async (path : string, options = {}) => {
    
    const api = await request.get(path, options);
    return api.data;
}

export const post = async (path : string, data = {}, options = {}) => {
    const api = await request.post(path, data, options);
    return api.data;
    
}

export const put = async (path : string, data = {}, options = {}) => {
    const api = await request.put(path, data, options);
    return api.data;
}

export const del = async (path : string, options = {}) => {
    const api = await request.delete(path, options);
    return api.data;
}

export const patch = async (path : string, data = {}, options = {}) => {
    const api = await request.patch(path, data, options);
    return api.data;
}
export default request;