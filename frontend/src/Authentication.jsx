
import React from "react";
import backend from "./Configuration";

export class Authentication {
    constructor(){
        console.log(backend);
    }

    getAuthenticationURL(callback) {
        fetch(backend + "/api/authentication/url")
            .then((response) => {
                return response.json()
            })
            .then((data) => {
                callback(data.url);
            })
    }

    isAuthenticated() {
        return false;
    }

    logout() {
    }

}

const instance = new Authentication();
export default instance;