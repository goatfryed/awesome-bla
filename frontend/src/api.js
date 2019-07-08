import {backendUrl} from "./config";
import Authentication from "./authentication/Authentication";


const defaultHeaders = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
};

export async function backendFetch(url, config) {

    const configHeaders = (config && config.headers) || {};
    if (Authentication.isAuthenticated()) {
        configHeaders.Authorization = 'Bearer ' + Authentication.getToken();
    }

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

    if (response.status === 200) {
        // no clue, why
        if (true) {
            let text = await response.text();
            console.log(text);
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