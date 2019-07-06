import {backendUrl} from "./config";


const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export async function backendFetch(url, config) {

    const configHeaders = (config && config.headers) || {};

    const response = await fetch(
        backendUrl + url,
        {
            ...config,
            headers: {
                ...defaultHeaders,
                ...configHeaders
            }
        }
    );

    return await response.json();
};

backendFetch.post = (url, config) => backendFetch(url, { ...config, method: "POST"});
backendFetch.get = (url, config) => backendFetch(url, { ...config, method: "GET"});
backendFetch.put = (url, config) => backendFetch(url, { ...config, method: "PUT"});
backendFetch.delete = (url, config) => backendFetch(url, { ...config, method: "DELETE"});

export function addCommentReply(comment, parentId) {
    return backendFetch.post("/comments/" + parentId + "/", {body: JSON.stringify(comment)})
}