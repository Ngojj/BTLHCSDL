import axios from 'axios';

const request = axios.create({
        baseURL: 'http://localhost:4000'
});

const normalizePath = (path: string) => {
    if (/^https?:\/\//i.test(path)) {
        return path;
    }

    return path.startsWith('/') ? path : `/${path}`;
}

export const get = async (path : string, options = {}) => {
    const api = await request.get(normalizePath(path), options);
    return api.data;
}

export const post = async (path : string, data = {}, options = {}) => {
    const api = await request.post(normalizePath(path), data, options);
    return api.data;
    
}

export const put = async (path : string, data = {}, options = {}) => {
    const api = await request.put(normalizePath(path), data, options);
    return api.data;
}

export const del = async (path : string, options = {}) => {
    const api = await request.delete(normalizePath(path), options);
    return api.data;
}

export const patch = async (path : string, data = {}, options = {}) => {
    const api = await request.patch(normalizePath(path), data, options);
    return api.data;
}
export default request;
