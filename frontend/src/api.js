import {backend} from "./Configuration";
import Authentication from "./authentication/Authentication";


const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

const handlers = {};

export function setErrorHandler(code, handler) {
    handlers[code] = handler;
}

export function defaultErrorHandler(response) {
    throw new ApiError(response);
}

export async function backendFetch(url, {alwaysThrow = false, ...config} = {}) {

    const configHeaders = (config && config.headers) || {};
    if (Authentication.isAuthenticated()) {
        configHeaders.Authorization = 'Bearer ' + Authentication.getToken();
    }


    const response = await fetch(
        backend + url,
        {
            ...config,
            headers: {
                ...defaultHeaders,
                ...configHeaders
            }
        }
    );

    if (!response.ok) {
        if (!alwaysThrow) {
            let errorHandler = handlers[response.status];
            errorHandler && errorHandler(response);
        }
        defaultErrorHandler(response);
        // if the default error Handler
    } else if (response.status === 200) {
        // no clue, why
        if (true) {
            let text = await response.text();
            return JSON.parse(text);
        } else {
            return await response.json();
        }
    } else {
        return response;
    }
};

backendFetch.post = (url, config) => backendFetch(url, { ...config, method: "POST"});
backendFetch.get = (url, config) => backendFetch(url, { ...config, method: "GET"});
backendFetch.put = (url, config) => backendFetch(url, { ...config, method: "PUT"});
backendFetch.delete = (url, config) => backendFetch(url, { ...config, method: "DELETE"});

export function addCommentReply(comment, parentId) {
    return backendFetch.post("/comments/" + parentId + "/", {body: JSON.stringify(comment)})
}

export class ApiError extends Error {
    constructor(response) {
        super(response.statusText);
        this.response = response;
        Error.captureStackTrace(this, ApiError);
    }
}
