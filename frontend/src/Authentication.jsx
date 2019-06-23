
import React from "react";

export class Authentication {
    constructor(){
    }

    getAuthenticationURL(callback) {
        fetch("http://localhost:8080/api/authentication/url")
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