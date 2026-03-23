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

const withAuth = (options: Record<string, any> = {}) => {
    if (typeof window === "undefined") return options;

    try {
        const raw = sessionStorage.getItem("userLogin");
        if (!raw) return options;

        const parsed = JSON.parse(raw) as { token?: string } | null;
        const token = parsed?.token;
        if (!token) return options;

        return {
            ...options,
            headers: {
                ...(options.headers || {}),
                Authorization: `Bearer ${token}`,
            },
        };
    } catch {
        return options;
    }
}

export const get = async (path : string, options = {}) => {
    const api = await request.get(normalizePath(path), withAuth(options));
    return api.data;
}

export const post = async (path : string, data = {}, options = {}) => {
    const api = await request.post(normalizePath(path), data, withAuth(options));
    return api.data;
    
}

export const put = async (path : string, data = {}, options = {}) => {
    const api = await request.put(normalizePath(path), data, withAuth(options));
    return api.data;
}

export const del = async (path : string, options = {}) => {
    const api = await request.delete(normalizePath(path), withAuth(options));
    return api.data;
}

export const patch = async (path : string, data = {}, options = {}) => {
    const api = await request.patch(normalizePath(path), data, withAuth(options));
    return api.data;
}
export default request;
