import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

const request = axios.create({
        baseURL: API_BASE_URL
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

// Pages that import the raw instance (`import request from ...`) get the token too.
request.interceptors.request.use((config) => {
    if (typeof window === "undefined") return config;
    try {
        const token = (JSON.parse(sessionStorage.getItem("userLogin") || "null") as { token?: string } | null)?.token;
        if (token && !config.headers.Authorization) config.headers.Authorization = `Bearer ${token}`;
    } catch {
        /* unreadable session: send the request without a token */
    }
    return config;
});

// The token lives for one hour. When the server says it is no longer valid, sign the user out
// instead of leaving the app half-working with a stack of failed requests.
request.interceptors.response.use(
    (response) => response,
    (error) => {
        const hadToken = Boolean(error?.config?.headers?.Authorization);
        if (typeof window !== "undefined" && error?.response?.status === 401 && hadToken) {
            sessionStorage.removeItem("userLogin");
            if (!window.location.pathname.startsWith("/login")) window.location.assign("/login?expired=1");
        }
        return Promise.reject(error);
    }
);

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
